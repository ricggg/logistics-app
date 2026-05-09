// lib/shipments.ts
import { Redis } from "@upstash/redis";

export type ShipmentStatus =
  | "Order Placed"
  | "Picked Up"
  | "In Transit"
  | "On Hold"
  | "Customs Hold"
  | "Pending Customs Clearance"
  | "Customs Documentation Required"
  | "Duty Payment Required"
  | "Customs Cleared"
  | "Released from Customs"
  | "Seized by Customs"
  | "Out for Delivery"
  | "Delivered"
  | "Exception";

export interface TrackingEvent {
  status: ShipmentStatus;
  location: string;
  timestamp: string;   // display string e.g. "25/01/2026, 14:30"
  eventDate: string;   // ISO date  e.g. "2026-01-25"
  eventTime: string;   // 24h time  e.g. "14:30"
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
  estimatedDeliveryTime: string; // e.g. "14:00"
  currentStatus: ShipmentStatus;
  events: TrackingEvent[];
  createdAt: string;
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const shipmentKey = (id: string) => `shipment:${id}`;
export const shipmentsIndexKey = "shipments:index";

export function generateTrackingNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const random = Array.from({ length: 8 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
  return `CRG-2026-${random}`;
}

/**
 * Build a human-readable timestamp from a date string + time string.
 * Falls back to "now" if either is missing.
 */
export function buildTimestamp(date: string, time: string): string {
  if (date && time) {
    const dt = new Date(`${date}T${time}:00`);
    return dt.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return new Date().toLocaleString("en-GB");
}