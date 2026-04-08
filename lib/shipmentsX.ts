// lib/shipmentsX.ts

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
  senderAddress: string;
  receiverName: string;
  receiverAddress: string;
  packageDescription: string;
  weight: string;
  estimatedDelivery: string;
  currentStatus: ShipmentStatus;
  events: TrackingEvent[];
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var shipmentsXStore: Map<string, Shipment> | undefined;
}

if (!global.shipmentsXStore) {
  global.shipmentsXStore = new Map<string, Shipment>();
}

export const shipmentsXStore = global.shipmentsXStore;

export function generateTrackingNumberX(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const random = Array.from({ length: 8 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
  return `TGX-2026-${random}`;
}