// app/api/tracking-x/route.ts
import { NextRequest, NextResponse } from "next/server";
import { shipmentsXStore } from "@/lib/shipmentsX";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const number = searchParams.get("number")?.toUpperCase().trim();

  if (!number) {
    return NextResponse.json(
      { error: "Tracking number required." },
      { status: 400 }
    );
  }

  const shipment = shipmentsXStore.get(number);

  if (!shipment) {
    return NextResponse.json(
      { error: "Shipment not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ shipment });
}