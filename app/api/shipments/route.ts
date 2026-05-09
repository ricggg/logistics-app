// app/api/shipments/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  redis,
  shipmentKey,
  shipmentsIndexKey,
  generateTrackingNumber,
  buildTimestamp,
  Shipment,
  TrackingEvent,
} from "@/lib/shipments";

export async function GET() {
  try {
    const ids = await redis.smembers(shipmentsIndexKey);

    if (!ids || ids.length === 0) {
      return NextResponse.json({ shipments: [] });
    }

    const pipeline = redis.pipeline();
    ids.forEach((id) => pipeline.get(shipmentKey(id)));
    const results = await pipeline.exec();

    const shipments = (results as (Shipment | null)[])
      .filter((s): s is Shipment => s !== null)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return NextResponse.json({ shipments });
  } catch (error) {
    console.error("GET /api/shipments error:", error);
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
      estimatedDeliveryTime,
      // first event date/time (the "Order Placed" event)
      orderDate,
      orderTime,
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

    const trackingNumber = generateTrackingNumber();
    const now = new Date().toISOString();

    // Use admin-supplied date/time or fall back to now
    const evDate = orderDate || new Date().toISOString().slice(0, 10);
    const evTime = orderTime || new Date().toTimeString().slice(0, 5);

    const firstEvent: TrackingEvent = {
      status: "Order Placed",
      location: senderAddress,
      timestamp: buildTimestamp(evDate, evTime),
      eventDate: evDate,
      eventTime: evTime,
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
      estimatedDeliveryTime: estimatedDeliveryTime || "",
      currentStatus: "Order Placed",
      events: [firstEvent],
      createdAt: now,
    };

    await redis.set(shipmentKey(trackingNumber), shipment);
    await redis.sadd(shipmentsIndexKey, trackingNumber);

    return NextResponse.json({ trackingNumber, shipment }, { status: 201 });
  } catch (error) {
    console.error("POST /api/shipments error:", error);
    return NextResponse.json(
      { error: "Failed to create shipment." },
      { status: 500 }
    );
  }
}