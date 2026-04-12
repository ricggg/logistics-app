// app/api/shipmentsx/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  redis,
  shipmentXKey,
  shipmentsXIndexKey,
  generateTrackingNumberX,
  Shipment,
  TrackingEvent,
} from "@/lib/shipmentsX";

export async function GET() {
  try {
    const ids = await redis.lrange(shipmentsXIndexKey, 0, -1);

    if (!ids || ids.length === 0) {
      return NextResponse.json({ shipments: [] });
    }

    const shipments = await Promise.all(
      ids.map((id) => redis.get<Shipment>(shipmentXKey(id)))
    );

    const valid = shipments
      .filter((s): s is Shipment => s !== null)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return NextResponse.json({ shipments: valid });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch shipments." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      senderName,
      senderPhone,
      senderAddress,
      receiverName,
      receiverPhone,
      receiverAddress,
      packageDescription,
      weight,
      estimatedDelivery,
    } = body;

    if (
      !senderName ||
      !senderPhone ||
      !senderAddress ||
      !receiverName ||
      !receiverPhone ||
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
      senderPhone,
      senderAddress,
      receiverName,
      receiverPhone,
      receiverAddress,
      packageDescription,
      weight,
      estimatedDelivery,
      currentStatus: "Order Placed",
      events: [firstEvent],
      createdAt: now,
    };

    await redis.set(shipmentXKey(trackingNumber), shipment);
    await redis.lpush(shipmentsXIndexKey, trackingNumber);

    return NextResponse.json({ trackingNumber, shipment }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create shipment." },
      { status: 500 }
    );
  }
}