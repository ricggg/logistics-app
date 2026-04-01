// lib/shipments.ts

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

// Extend NodeJS global so the store survives hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var shipmentsStore: Map<string, Shipment> | undefined;
}

if (!global.shipmentsStore) {
  global.shipmentsStore = new Map<string, Shipment>();

  // Seed demo shipment
  const demo: Shipment = {
    trackingNumber: "SWX-2026-DEMO01",
    senderName: "TechCorp Industries",
    senderAddress: "45 Commerce Street, Lagos, Nigeria",
    receiverName: "John Adebayo",
    receiverAddress: "12 Palm Avenue, Abuja, Nigeria",
    packageDescription: "Electronics — Laptop & Accessories",
    weight: "3.2 kg",
    estimatedDelivery: "2026-02-15",
    currentStatus: "In Transit",
    createdAt: new Date().toISOString(),
    events: [
      {
        status: "Order Placed",
        location: "Lagos, Nigeria",
        timestamp: "2026-02-10 08:00",
        description: "Shipment order created and confirmed.",
      },
      {
        status: "Picked Up",
        location: "Lagos Hub, Nigeria",
        timestamp: "2026-02-11 10:30",
        description: "Package picked up by courier.",
      },
      {
        status: "In Transit",
        location: "Ibadan Sorting Center, Nigeria",
        timestamp: "2026-02-12 14:00",
        description: "Package in transit to destination city.",
      },
    ],
  };

  global.shipmentsStore.set(demo.trackingNumber, demo);
}

export const shipmentsStore = global.shipmentsStore;

export function generateTrackingNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const random = Array.from({ length: 8 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
  return `SWX-2026-${random}`;
}