// lib/shipmentsX.ts
import { Redis } from "@upstash/redis";

export type ShipmentStatus =
  | "Order Placed"
  | "Picked Up"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Exception";

export interface TrackingEvent {
  status: ShipmentStatus;
  location: string;
  timestamp: string;
  description: string;
}

export interface Shipment {
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  packageDescription: string;
  weight: string;
  estimatedDelivery: string;
  currentStatus: ShipmentStatus;
  events: TrackingEvent[];
  createdAt: string;
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Separate namespace from regular shipments
export const shipmentXKey = (id: string) => `shipmentx:${id}`;
export const shipmentsXIndexKey = "shipmentsx:index";

export function generateTrackingNumberX(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const random = Array.from({ length: 8 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
  return `TGX-2026-${random}`;
}