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
      return NextResponse.json(
        { error: "Shipment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ shipment });
  } catch (error) {
    console.error("GET /api/shipments/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipment." },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: "Shipment not found." },
        { status: 404 }
      );
    }

    const body = await req.json();

    // ── MODE 1: Edit an existing event by index ──────────────────────────
    if (body.mode === "edit-event") {
      const { eventIndex, status, location, description, eventDate, eventTime } = body;

      if (
        eventIndex === undefined ||
        !status ||
        !location ||
        !description ||
        !eventDate ||
        !eventTime
      ) {
        return NextResponse.json(
          { error: "eventIndex, status, location, description, eventDate and eventTime are required." },
          { status: 400 }
        );
      }

      const events = [...shipment.events];
      if (eventIndex < 0 || eventIndex >= events.length) {
        return NextResponse.json(
          { error: "Invalid eventIndex." },
          { status: 400 }
        );
      }

      events[eventIndex] = {
        status: status as ShipmentStatus,
        location,
        description,
        eventDate,
        eventTime,
        timestamp: buildTimestamp(eventDate, eventTime),
      };

      // Recalculate currentStatus from the latest event (by date/time)
      const sorted = [...events].sort((a, b) => {
        const da = new Date(`${a.eventDate}T${a.eventTime}`).getTime();
        const db = new Date(`${b.eventDate}T${b.eventTime}`).getTime();
        return db - da;
      });

      const updated: Shipment = {
        ...shipment,
        currentStatus: sorted[0].status,
        events,
      };

      await redis.set(shipmentKey(trackingNumber), updated);
      return NextResponse.json({ shipment: updated });
    }

    // ── MODE 2: Add a new tracking event ─────────────────────────────────
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
    const sorted = [...updatedEvents].sort((a, b) => {
      const da = new Date(`${a.eventDate || "2000-01-01"}T${a.eventTime || "00:00"}`).getTime();
      const db = new Date(`${b.eventDate || "2000-01-01"}T${b.eventTime || "00:00"}`).getTime();
      return db - da;
    });

    const updated: Shipment = {
      ...shipment,
      currentStatus: sorted[0].status,
      events: updatedEvents,
    };

    await redis.set(shipmentKey(trackingNumber), updated);
    return NextResponse.json({ shipment: updated });
  } catch (error) {
    console.error("PATCH /api/shipments/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update shipment." },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: "Shipment not found." },
        { status: 404 }
      );
    }

    await redis.del(shipmentKey(trackingNumber));
    await redis.srem(shipmentsIndexKey, trackingNumber);

    return NextResponse.json({ message: "Shipment deleted." });
  } catch (error) {
    console.error("DELETE /api/shipments/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete shipment." },
      { status: 500 }
    );
  }
}