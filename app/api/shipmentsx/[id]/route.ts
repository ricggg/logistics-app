// app/api/shipmentsx/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  redis,
  shipmentXKey,
  shipmentsXIndexKey,
  Shipment,
  ShipmentStatus,
  TrackingEvent,
} from "@/lib/shipmentsX";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trackingNumber = id.toUpperCase().trim();

    const shipment = await redis.get<Shipment>(shipmentXKey(trackingNumber));

    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { status, location, description } = body;

    if (!status || !location || !description) {
      return NextResponse.json(
        { error: "status, location, and description are required." },
        { status: 400 }
      );
    }

    const newEvent: TrackingEvent = {
      status: status as ShipmentStatus,
      location,
      timestamp: new Date().toLocaleString("en-GB"),
      description,
    };

    const updated: Shipment = {
      ...shipment,
      currentStatus: status as ShipmentStatus,
      events: [...shipment.events, newEvent],
    };

    await redis.set(shipmentXKey(trackingNumber), updated);

    return NextResponse.json({ shipment: updated });
  } catch {
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

    const exists = await redis.get<Shipment>(shipmentXKey(trackingNumber));

    if (!exists) {
      return NextResponse.json(
        { error: "Shipment not found." },
        { status: 404 }
      );
    }

    await redis.del(shipmentXKey(trackingNumber));
    await redis.lrem(shipmentsXIndexKey, 1, trackingNumber);

    return NextResponse.json({ message: "Shipment deleted." });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete shipment." },
      { status: 500 }
    );
  }
}