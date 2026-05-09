// app/api/shipments/[id]/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  redis,
  shipmentKey,
  buildTimestamp,
  Shipment,
} from "@/lib/shipments";

export async function DELETE(
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
    const { eventIndex } = body;

    if (eventIndex === undefined || eventIndex < 0 || eventIndex >= shipment.events.length) {
      return NextResponse.json({ error: "Invalid eventIndex." }, { status: 400 });
    }

    const events = shipment.events.filter((_, i) => i !== eventIndex);

    // Recalculate currentStatus from remaining events (latest by date/time)
    let currentStatus = shipment.currentStatus;
    if (events.length > 0) {
      const sorted = [...events].sort((a, b) => {
        const da = new Date(`${a.eventDate || "2000-01-01"}T${a.eventTime || "00:00"}`).getTime();
        const db = new Date(`${b.eventDate || "2000-01-01"}T${b.eventTime || "00:00"}`).getTime();
        return db - da;
      });
      currentStatus = sorted[0].status;
    }

    const updated: Shipment = {
      ...shipment,
      currentStatus,
      events,
    };

    await redis.set(shipmentKey(trackingNumber), updated);
    return NextResponse.json({ shipment: updated });
  } catch (error) {
    console.error("DELETE /api/shipments/[id]/events error:", error);
    return NextResponse.json({ error: "Failed to delete event." }, { status: 500 });
  }
}