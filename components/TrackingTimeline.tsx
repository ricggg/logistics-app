// components/TrackingTimeline.tsx
"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Package,
  Truck,
  MapPin,
  Clock,
} from "lucide-react";
import type { TrackingEvent, ShipmentStatus } from "@/lib/shipments";

const statusOrder: ShipmentStatus[] = [
  "Order Placed",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

const statusIcons: Record<ShipmentStatus, React.ReactNode> = {
  "Order Placed": <Package size={16} />,
  "Picked Up": <CheckCircle2 size={16} />,
  "In Transit": <Truck size={16} />,
  "Out for Delivery": <MapPin size={16} />,
  Delivered: <CheckCircle2 size={16} />,
  Exception: <Clock size={16} />,
};

interface Props {
  events: TrackingEvent[];
  currentStatus: ShipmentStatus;
}

export default function TrackingTimeline({ events, currentStatus }: Props) {
  const currentIdx = statusOrder.indexOf(currentStatus);

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="hidden sm:flex items-center justify-between mb-8 relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0">
          <motion.div
            className="h-full bg-[#D40511]"
            initial={{ width: "0%" }}
            animate={{
              width: `${Math.max(0, (currentIdx / (statusOrder.length - 1)) * 100)}%`,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        {statusOrder.map((status, idx) => {
          const done = idx <= currentIdx;
          return (
            <div key={status} className="flex flex-col items-center z-10 gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.15 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-sm ${
                  done
                    ? "bg-[#D40511] border-[#D40511] text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {statusIcons[status]}
              </motion.div>
              <span
                className={`text-xs font-semibold text-center max-w-[80px] leading-tight ${
                  done ? "text-[#D40511]" : "text-gray-400"
                }`}
              >
                {status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Timeline events */}
      <div className="space-y-0">
        {[...events].reverse().map((event, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex gap-4 relative"
          >
            {/* Line */}
            {idx !== events.length - 1 && (
              <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-200 z-0" />
            )}

            {/* Dot */}
            <div
              className={`relative z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                idx === 0
                  ? "bg-[#D40511] border-[#D40511] text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {statusIcons[event.status] ?? <Circle size={16} />}
            </div>

            {/* Content */}
            <div className="pb-8">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-sm font-bold ${
                    idx === 0 ? "text-[#D40511]" : "text-gray-700"
                  }`}
                >
                  {event.status}
                </span>
                {idx === 0 && (
                  <span className="bg-[#D40511] text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                    Latest
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin size={11} />
                  {event.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {event.timestamp}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}