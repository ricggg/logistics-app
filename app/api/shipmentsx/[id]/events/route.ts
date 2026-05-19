// app/api/shipmentsx/[id]/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redis, shipmentXKey, ShipmentX } from "@/lib/shipmentsX";

export async function DELETE(
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
    const { eventIndex } = body;
    const idx = Number(eventIndex);

    if (
      eventIndex === undefined ||
      isNaN(idx) ||
      idx < 0 ||
      idx >= shipment.events.length
    ) {
      return NextResponse.json(
        { error: `Invalid eventIndex: ${eventIndex}` },
        { status: 400 }
      );
    }

    const events = shipment.events.filter((_, i) => i !== idx);

    let currentStatus = shipment.currentStatus;
    if (events.length > 0) {
      const latestEvent = [...events].reduce((latest, ev) => {
        const evTime = new Date(
          `${ev.eventDate || "2000-01-01"}T${ev.eventTime || "00:00"}`
        ).getTime();
        const latestTime = new Date(
          `${latest.eventDate || "2000-01-01"}T${latest.eventTime || "00:00"}`
        ).getTime();
        return evTime > latestTime ? ev : latest;
      });
      currentStatus = latestEvent.status;
    }

    const updated: ShipmentX = { ...shipment, currentStatus, events };
    await redis.set(shipmentXKey(trackingNumber), updated);
    return NextResponse.json({ shipment: updated });
  } catch (error) {
    console.error("DELETE /api/shipmentsx/[id]/events error:", error);
    return NextResponse.json({ error: "Failed to delete event." }, { status: 500 });
  }
}