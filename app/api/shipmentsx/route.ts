// app/api/shipmentsx/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  redis,
  shipmentXKey,
  shipmentsXIndexKey,
  generateTrackingNumberX,
  buildTimestampX,
  ShipmentX,
  ShipmentXStatus,
  TrackingEventX,
} from "@/lib/shipmentsX";

export async function GET() {
  try {
    const trackingNumbers = await redis.smembers(shipmentsXIndexKey);
    const shipments: ShipmentX[] = [];

    for (const number of trackingNumbers) {
      const shipment = await redis.get<ShipmentX>(shipmentXKey(number));
      if (shipment) {
        shipments.push(shipment);
      }
    }

    return NextResponse.json({ shipments });
  } catch (error) {
    console.error("GET /api/shipmentsx error:", error);
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
      orderDate,
      orderTime,
    } = body;

    // Validate required fields
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
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const trackingNumber = generateTrackingNumberX();
    const evDate = orderDate || new Date().toISOString().slice(0, 10);
    const evTime = orderTime || new Date().toTimeString().slice(0, 5);

    const initialEvent: TrackingEventX = {
      status: "Order Placed",
      location: senderAddress,
      timestamp: buildTimestampX(evDate, evTime),
      eventDate: evDate,
      eventTime: evTime,
      description: "Order has been placed and is being prepared for shipment",
    };

    const shipment: ShipmentX = {
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
      events: [initialEvent],
      createdAt: new Date().toISOString(),
    };

    await redis.set(shipmentXKey(trackingNumber), shipment);
    await redis.sadd(shipmentsXIndexKey, trackingNumber);

    return NextResponse.json({ trackingNumber, shipment }, { status: 201 });
  } catch (error) {
    console.error("POST /api/shipmentsx error:", error);
    return NextResponse.json(
      { error: "Failed to create shipment." },
      { status: 500 }
    );
  }
}