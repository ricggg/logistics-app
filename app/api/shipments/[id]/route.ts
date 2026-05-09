// app/api/shipments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  redis,
  shipmentKey,
  shipmentsIndexKey,
  buildTimestamp,
  Shipment,
  ShipmentStatus,
  TrackingEvent,
} from "@/lib/shipments";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trackingNumber = id.toUpperCase().trim();
    const shipment = await redis.get<Shipment>(shipmentKey(trackingNumber));

    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found." }, { status: 404 });
    }

    return NextResponse.json({ shipment });
  } catch (error) {
    console.error("GET /api/shipments/[id] error:", error);
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

    const shipment = await redis.get<Shipment>(shipmentKey(trackingNumber));
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

      // Validate
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
          { error: `Invalid eventIndex: ${eventIndex}. Shipment has ${shipment.events.length} events.` },
          { status: 400 }
        );
      }

      // Build updated events array — replace only the target index
      const updatedEvents: TrackingEvent[] = shipment.events.map((ev, i) => {
        if (i === idx) {
          return {
            status: status as ShipmentStatus,
            location,
            description,
            eventDate,
            eventTime,
            timestamp: buildTimestamp(eventDate, eventTime),
          };
        }
        return ev;
      });

      // Recalculate currentStatus = status of the chronologically LATEST event
      const latestEvent = [...updatedEvents].reduce((latest, ev) => {
        const evTime = new Date(
          `${ev.eventDate || "2000-01-01"}T${ev.eventTime || "00:00"}`
        ).getTime();
        const latestTime = new Date(
          `${latest.eventDate || "2000-01-01"}T${latest.eventTime || "00:00"}`
        ).getTime();
        return evTime > latestTime ? ev : latest;
      });

      const updated: Shipment = {
        ...shipment,
        currentStatus: latestEvent.status,
        events: updatedEvents,
      };

      await redis.set(shipmentKey(trackingNumber), updated);
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

    const newEvent: TrackingEvent = {
      status: status as ShipmentStatus,
      location,
      timestamp: buildTimestamp(evDate, evTime),
      eventDate: evDate,
      eventTime: evTime,
      description,
    };

    const updatedEvents = [...shipment.events, newEvent];

    // currentStatus = the event with the latest date+time
    const latestEvent = [...updatedEvents].reduce((latest, ev) => {
      const evTime = new Date(
        `${ev.eventDate || "2000-01-01"}T${ev.eventTime || "00:00"}`
      ).getTime();
      const latestTime = new Date(
        `${latest.eventDate || "2000-01-01"}T${latest.eventTime || "00:00"}`
      ).getTime();
      return evTime > latestTime ? ev : latest;
    });

    const updated: Shipment = {
      ...shipment,
      currentStatus: latestEvent.status,
      events: updatedEvents,
    };

    await redis.set(shipmentKey(trackingNumber), updated);
    return NextResponse.json({ shipment: updated });
  } catch (error) {
    console.error("PATCH /api/shipments/[id] error:", error);
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

    const exists = await redis.get(shipmentKey(trackingNumber));
    if (!exists) {
      return NextResponse.json({ error: "Shipment not found." }, { status: 404 });
    }

    await redis.del(shipmentKey(trackingNumber));
    await redis.srem(shipmentsIndexKey, trackingNumber);

    return NextResponse.json({ message: "Shipment deleted." });
  } catch (error) {
    console.error("DELETE /api/shipments/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete shipment." }, { status: 500 });
  }
}