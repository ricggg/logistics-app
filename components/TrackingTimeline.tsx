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
  ShieldAlert,
} from "lucide-react";
import type { TrackingEvent, ShipmentStatus } from "@/lib/shipments";

const statusOrder: ShipmentStatus[] = [
  "Order Placed",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

const statusIcons: Partial<Record<ShipmentStatus, React.ReactNode>> = {
  "Order Placed":                   <Package size={16} />,
  "Picked Up":                      <CheckCircle2 size={16} />,
  "In Transit":                     <Truck size={16} />,
  "Out for Delivery":               <MapPin size={16} />,
  "Delivered":                      <CheckCircle2 size={16} />,
  "Exception":                      <Clock size={16} />,
  "On Hold":                        <ShieldAlert size={16} />,
  "Customs Hold":                   <ShieldAlert size={16} />,
  "Pending Customs Clearance":      <ShieldAlert size={16} />,
  "Customs Documentation Required": <ShieldAlert size={16} />,
  "Duty Payment Required":          <ShieldAlert size={16} />,
  "Customs Cleared":                <CheckCircle2 size={16} />,
  "Released from Customs":          <CheckCircle2 size={16} />,
  "Seized by Customs":              <ShieldAlert size={16} />,
};

const CUSTOMS_STATUSES = new Set([
  "On Hold",
  "Customs Hold",
  "Pending Customs Clearance",
  "Customs Documentation Required",
  "Duty Payment Required",
  "Seized by Customs",
]);

const CUSTOMS_RESOLVED = new Set([
  "Customs Cleared",
  "Released from Customs",
]);

interface Props {
  events: TrackingEvent[];
  currentStatus: ShipmentStatus;
}

export default function TrackingTimeline({ events, currentStatus }: Props) {
  const currentIdx = statusOrder.indexOf(currentStatus);

  return (
    <div className="w-full">

      {/* Progress bar — standard flow only */}
      {currentIdx >= 0 && (
        <div className="hidden sm:flex items-center justify-between mb-8 relative">
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0">
            <motion.div
              className="h-full bg-[#D40511]"
              initial={{ width: "0%" }}
              animate={{
                width: `${Math.max(
                  0,
                  (currentIdx / (statusOrder.length - 1)) * 100
                )}%`,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          {statusOrder.map((status, idx) => {
            const done = idx <= currentIdx;
            return (
              <div
                key={status}
                className="flex flex-col items-center z-10 gap-2"
              >
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
      )}

      {/* Customs hold banner */}
      {CUSTOMS_STATUSES.has(currentStatus) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
        >
          <ShieldAlert
            size={18}
            className="text-amber-600 mt-0.5 shrink-0"
          />
          <div>
            <p className="text-sm font-bold text-amber-800">
              Shipment is currently in a hold or customs status
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Our team is monitoring this shipment. If action is required
              from you, you will be contacted at your registered email. For
              urgent help, contact{" "}
              <a
                href="mailto:support@clearrouteglobal.com"
                className="font-bold underline"
              >
                support@clearrouteglobal.com
              </a>{" "}
              or call{" "}
              <a
                href="tel:+46766920874"
                className="font-bold underline"
              >
                +46 766 920 874
              </a>
            </p>
          </div>
        </motion.div>
      )}

      {/* Customs cleared banner */}
      {CUSTOMS_RESOLVED.has(currentStatus) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3"
        >
          <CheckCircle2
            size={18}
            className="text-emerald-600 mt-0.5 shrink-0"
          />
          <div>
            <p className="text-sm font-bold text-emerald-800">
              Customs clearance completed
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Your shipment has been cleared by customs and is resuming its
              journey to the destination.
            </p>
          </div>
        </motion.div>
      )}

      {/* Timeline events */}
      <div className="space-y-0">
        {[...events].reverse().map((event, idx) => {
          const isCustomsEvent = CUSTOMS_STATUSES.has(event.status);
          const isResolvedEvent = CUSTOMS_RESOLVED.has(event.status);
          const isLatest = idx === 0;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-4 relative"
            >
              {/* Connector line */}
              {idx !== events.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-200 z-0" />
              )}

              {/* Dot */}
              <div
                className={`relative z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isLatest && isCustomsEvent
                    ? "bg-amber-500 border-amber-500 text-white"
                    : isLatest && isResolvedEvent
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isLatest
                    ? "bg-[#D40511] border-[#D40511] text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {statusIcons[event.status] ?? <Circle size={16} />}
              </div>

              {/* Content */}
              <div className="pb-8 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-sm font-bold ${
                      isLatest && isCustomsEvent
                        ? "text-amber-700"
                        : isLatest && isResolvedEvent
                        ? "text-emerald-700"
                        : isLatest
                        ? "text-[#D40511]"
                        : "text-gray-700"
                    }`}
                  >
                    {event.status}
                  </span>
                  {isLatest && (
                    <span
                      className={`text-white text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isCustomsEvent
                          ? "bg-amber-500"
                          : isResolvedEvent
                          ? "bg-emerald-500"
                          : "bg-[#D40511]"
                      }`}
                    >
                      Latest
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">
                  {event.description}
                </p>
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
          );
        })}
      </div>
    </div>
  );
}