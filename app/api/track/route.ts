// app/api/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redis, shipmentKey, Shipment } from "@/lib/shipments";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const number = searchParams.get("number")?.toUpperCase().trim();

  if (!number) {
    return NextResponse.json(
      { error: "Tracking number required." },
      { status: 400 }
    );
  }

  try {
    const shipment = await redis.get<Shipment>(shipmentKey(number));

    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ shipment });
  } catch (error) {
    console.error("GET /api/track error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tracking data." },
      { status: 500 }
    );
  }
}