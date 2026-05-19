// app/api/shipmentsx/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  redis,
  shipmentXKey,
  shipmentsXIndexKey,
  buildTimestampX,
  ShipmentX,
  ShipmentXStatus,
  TrackingEventX,
} from "@/lib/shipmentsX";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trackingNumber = id.toUpperCase().trim();
    const shipment = await redis.get<ShipmentX>(shipmentXKey(trackingNumber));

    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found." }, { status: 404 });
    }

    return NextResponse.json({ shipment });
  } catch (error) {
    console.error("GET /api/shipmentsx/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch shipment." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trackingNumber = id.toUpperCase().trim();

    const shipment = await redis.get<ShipmentX>(shipmentXKey(trackingNumber));
    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found." }, { status: 404 });
    }

    const body = await req.json();

    // ── MODE: edit an existing event in-place ──────────────────────────────
    if (body.mode === "edit-event") {
      const {
        eventIndex,
        status,
        location,
        description,
        eventDate,
        eventTime,
      } = body;

      if (
        eventIndex === undefined ||
        eventIndex === null ||
        !status ||
        !location ||
        !description ||
        !eventDate ||
        !eventTime
      ) {
        return NextResponse.json(
          {
            error:
              "eventIndex, status, location, description, eventDate and eventTime are all required.",
          },
          { status: 400 }
        );
      }

      const idx = Number(eventIndex);

      if (isNaN(idx) || idx < 0 || idx >= shipment.events.length) {
        return NextResponse.json(
          {
            error: `Invalid eventIndex: ${eventIndex}. Shipment has ${shipment.events.length} events.`,
          },
          { status: 400 }
        );
      }

      const updatedEvents: TrackingEventX[] = shipment.events.map((ev, i) => {
        if (i === idx) {
          return {
            status: status as ShipmentXStatus,
            location,
            description,
            eventDate,
            eventTime,
            timestamp: buildTimestampX(eventDate, eventTime),
          };
        }
        return ev;
      });

      const latestEvent = [...updatedEvents].reduce((latest, ev) => {
        const evTime = new Date(
          `${ev.eventDate || "2000-01-01"}T${ev.eventTime || "00:00"}`
        ).getTime();
        const latestTime = new Date(
          `${latest.eventDate || "2000-01-01"}T${latest.eventTime || "00:00"}`
        ).getTime();
        return evTime > latestTime ? ev : latest;
      });

      const updated: ShipmentX = {
        ...shipment,
        currentStatus: latestEvent.status,
        events: updatedEvents,
      };

      await redis.set(shipmentXKey(trackingNumber), updated);
      return NextResponse.json({ shipment: updated });
    }

    // ── MODE: edit estimated delivery date & time ──────────────────────────
    if (body.mode === "edit-delivery") {
      const { estimatedDelivery, estimatedDeliveryTime } = body;

      if (!estimatedDelivery) {
        return NextResponse.json(
          { error: "estimatedDelivery date is required." },
          { status: 400 }
        );
      }

      const updated: ShipmentX = {
        ...shipment,
        estimatedDelivery,
        estimatedDeliveryTime: estimatedDeliveryTime ?? "",
      };

      await redis.set(shipmentXKey(trackingNumber), updated);
      return NextResponse.json({ shipment: updated });
    }

    // ── MODE: add a brand-new tracking event ───────────────────────────────
    const { status, location, description, eventDate, eventTime } = body;

    if (!status || !location || !description) {
      return NextResponse.json(
        { error: "status, location, and description are required." },
        { status: 400 }
      );
    }

    const evDate = eventDate || new Date().toISOString().slice(0, 10);
    const evTime = eventTime || new Date().toTimeString().slice(0, 5);

    const newEvent: TrackingEventX = {
      status: status as ShipmentXStatus,
      location,
      timestamp: buildTimestampX(evDate, evTime),
      eventDate: evDate,
      eventTime: evTime,
      description,
    };

    const updatedEvents = [...shipment.events, newEvent];

    const latestEvent = [...updatedEvents].reduce((latest, ev) => {
      const evTime = new Date(
        `${ev.eventDate || "2000-01-01"}T${ev.eventTime || "00:00"}`
      ).getTime();
      const latestTime = new Date(
        `${latest.eventDate || "2000-01-01"}T${latest.eventTime || "00:00"}`
      ).getTime();
      return evTime > latestTime ? ev : latest;
    });

    const updated: ShipmentX = {
      ...shipment,
      currentStatus: latestEvent.status,
      events: updatedEvents,
    };

    await redis.set(shipmentXKey(trackingNumber), updated);
    return NextResponse.json({ shipment: updated });
  } catch (error) {
    console.error("PATCH /api/shipmentsx/[id] error:", error);
    return NextResponse.json({ error: "Failed to update shipment." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trackingNumber = id.toUpperCase().trim();

    const exists = await redis.get(shipmentXKey(trackingNumber));
    if (!exists) {
      return NextResponse.json({ error: "Shipment not found." }, { status: 404 });
    }

    await redis.del(shipmentXKey(trackingNumber));
    await redis.srem(shipmentsXIndexKey, trackingNumber);

    return NextResponse.json({ message: "Shipment deleted." });
  } catch (error) {
    console.error("DELETE /api/shipmentsx/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete shipment." }, { status: 500 });
  }
}