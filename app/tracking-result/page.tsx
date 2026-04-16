// app/tracking-result/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  User,
  Calendar,
  Weight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Phone,
} from "lucide-react";
import TrackingTimeline from "@/components/TrackingTimeline";
import type { Shipment } from "@/lib/shipments";

const statusColors: Record<string, string> = {
  "Order Placed":                   "bg-blue-100 text-blue-700",
  "Picked Up":                      "bg-yellow-100 text-yellow-700",
  "In Transit":                     "bg-orange-100 text-orange-700",
  "Out for Delivery":               "bg-purple-100 text-purple-700",
  "Delivered":                      "bg-green-100 text-green-700",
  "Exception":                      "bg-red-100 text-red-700",
  "On Hold":                        "bg-orange-100 text-orange-800",
  "Customs Hold":                   "bg-red-100 text-red-800",
  "Pending Customs Clearance":      "bg-amber-100 text-amber-800",
  "Customs Documentation Required": "bg-rose-100 text-rose-800",
  "Duty Payment Required":          "bg-orange-200 text-orange-900",
  "Customs Cleared":                "bg-emerald-100 text-emerald-700",
  "Released from Customs":          "bg-teal-100 text-teal-700",
  "Seized by Customs":              "bg-red-200 text-red-900",
};

// Route to correct API based on tracking number prefix
function resolveTrackingAPI(number: string): string {
  if (number.startsWith("CRX-")) {
    return `/api/tracking-x?number=${encodeURIComponent(number)}`;
  }
  return `/api/track?number=${encodeURIComponent(number)}`;
}

function TrackingResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const number = searchParams.get("number") ?? "";

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!number) {
      setError("No tracking number provided.");
      setLoading(false);
      return;
    }

    const fetchShipment = async () => {
      try {
        const apiUrl = resolveTrackingAPI(number.toUpperCase().trim());
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Shipment not found.");
        } else {
          setShipment(data.shipment);
        }
      } catch {
        setError("Failed to fetch tracking data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [number]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-[#D40511] mx-auto mb-4"
          />
          <p className="text-gray-600 font-semibold">
            Fetching shipment data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md border border-red-100"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-[#D40511]" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">
            Shipment Not Found
          </h2>
          <p className="text-gray-500 text-sm mb-3">{error}</p>
          <p className="text-xs text-gray-400 mb-2">
            Tracking number searched:{" "}
            <span className="font-mono font-bold text-gray-600">
              {number}
            </span>
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Need help? Contact{" "}
            <a
              href="mailto:support@clearrouteglobal.com"
              className="text-[#D40511] font-semibold hover:underline"
            >
              support@clearrouteglobal.com
            </a>
          </p>
          <button
            onClick={() => router.push("/track")}
            className="bg-[#D40511] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#b8040e] transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => router.push("/track")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#D40511] mb-6 transition-colors font-semibold"
        >
          <ArrowLeft size={16} />
          Back to tracking
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                Tracking Number
              </p>
              <p className="font-mono font-black text-xl text-gray-900">
                {shipment.trackingNumber}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ClearRoute Global Logistics — Shipment Status
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                statusColors[shipment.currentStatus] ??
                "bg-gray-100 text-gray-700"
              }`}
            >
              {shipment.currentStatus === "Delivered" ? (
                <CheckCircle2 size={14} />
              ) : (
                <Clock size={14} />
              )}
              {shipment.currentStatus}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left — Shipment details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-5"
          >
            {/* Sender */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">
                Sender
              </h3>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <User size={14} className="text-[#D40511]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900">
                    {shipment.senderName}
                  </p>
                  {"senderPhone" in shipment && shipment.senderPhone && (
                    <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Phone size={10} className="shrink-0" />
                      {(shipment as Shipment & { senderPhone: string }).senderPhone}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-0.5 flex items-start gap-1">
                    <MapPin size={10} className="mt-0.5 shrink-0" />
                    {shipment.senderAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Receiver */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">
                Recipient
              </h3>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                  <User size={14} className="text-yellow-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900">
                    {shipment.receiverName}
                  </p>
                  {"receiverPhone" in shipment && shipment.receiverPhone && (
                    <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Phone size={10} className="shrink-0" />
                      {(shipment as Shipment & { receiverPhone: string }).receiverPhone}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-0.5 flex items-start gap-1">
                    <MapPin size={10} className="mt-0.5 shrink-0" />
                    {shipment.receiverAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Package info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">
                Package Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Package size={14} className="text-gray-400 shrink-0" />
                  <span className="text-gray-600">
                    {shipment.packageDescription}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Weight size={14} className="text-gray-400 shrink-0" />
                  <span className="text-gray-600">{shipment.weight}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-gray-400 shrink-0" />
                  <span className="text-gray-600">
                    Est. Delivery:{" "}
                    <span className="font-bold text-gray-900">
                      {shipment.estimatedDelivery}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-6">
              Tracking History
            </h3>
            <TrackingTimeline
              events={shipment.events}
              currentStatus={shipment.currentStatus}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function TrackingResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-[#D40511]" />
        </div>
      }
    >
      <TrackingResultContent />
    </Suspense>
  );
}