// app/api/shipmentsx/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  shipmentsXStore,
  generateTrackingNumberX,
  Shipment,
  TrackingEvent,
} from "@/lib/shipmentsX";

export async function GET() {
  const all = Array.from(shipmentsXStore.values()).sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json({ shipments: all });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      senderName,
      senderAddress,
      receiverName,
      receiverAddress,
      packageDescription,
      weight,
      estimatedDelivery,
    } = body;

    if (
      !senderName ||
      !senderAddress ||
      !receiverName ||
      !receiverAddress ||
      !packageDescription ||
      !weight ||
      !estimatedDelivery
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const trackingNumber = generateTrackingNumberX();
    const now = new Date().toISOString();

    const firstEvent: TrackingEvent = {
      status: "Order Placed",
      location: senderAddress,
      timestamp: new Date().toLocaleString("en-GB"),
      description: "Shipment order created and confirmed.",
    };

    const shipment: Shipment = {
      trackingNumber,
      senderName,
      senderAddress,
      receiverName,
      receiverAddress,
      packageDescription,
      weight,
      estimatedDelivery,
      currentStatus: "Order Placed",
      events: [firstEvent],
      createdAt: now,
    };

    shipmentsXStore.set(trackingNumber, shipment);

    return NextResponse.json({ trackingNumber, shipment }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create shipment." },
      { status: 500 }
    );
  }
}