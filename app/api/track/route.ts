// app/api/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { shipmentsStore } from "@/lib/shipments";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trackingNumber = searchParams.get("number");

  if (!trackingNumber) {
    return NextResponse.json(
      { error: "Tracking number is required." },
      { status: 400 }
    );
  }

  const shipment = shipmentsStore.get(trackingNumber.toUpperCase().trim());

  if (!shipment) {
    return NextResponse.json(
      { error: "No shipment found with that tracking number." },
      { status: 404 }
    );
  }

  return NextResponse.json({ shipment });
}