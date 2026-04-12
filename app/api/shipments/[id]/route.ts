// app/api/shipments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  redis,
  shipmentKey,
  shipmentsIndexKey,
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