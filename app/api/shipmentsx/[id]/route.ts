// app/api/shipmentsx/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  shipmentsXStore,
  ShipmentStatus,
  TrackingEvent,
} from "@/lib/shipmentsX";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const trackingNumber = id.toUpperCase().trim();
  const shipment = shipmentsXStore.get(trackingNumber);

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

  shipment.currentStatus = status as ShipmentStatus;
  shipment.events.push(newEvent);
  shipmentsXStore.set(trackingNumber, shipment);

  return NextResponse.json({ shipment });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const trackingNumber = id.toUpperCase().trim();

  if (!shipmentsXStore.has(trackingNumber)) {
    return NextResponse.json(
      { error: "Shipment not found." },
      { status: 404 }
    );
  }

  shipmentsXStore.delete(trackingNumber);
  return NextResponse.json({ message: "Shipment deleted." });
}