// app/track/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Package, AlertCircle, Clock, Globe } from "lucide-react";

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number.");
      return;
    }
    setError("");
    router.push(
      `/tracking-result?number=${encodeURIComponent(trackingNumber.trim())}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div
        className="relative py-24 flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-[#FFCC00] text-[#1a1a1a] text-xs font-black px-3 py-1 rounded mb-4 uppercase tracking-widest">
              Real-Time Tracking
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
              Track Your Shipment
            </h1>
            <p className="text-gray-200 text-sm max-w-md mx-auto">
              Enter the tracking number provided to you to get live status
              updates on your package.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#D40511] rounded-lg flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-gray-900">Shipment Tracking</h2>
              <p className="text-xs text-gray-500">
                Track up to 1 shipment at a time
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tracking Number
              </label>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Enter your tracking number"
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value.toUpperCase());
                    setError("");
                  }}
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm focus:border-[#D40511] outline-none transition-colors font-mono"
                />
              </div>
              {error && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-2">
                  <AlertCircle size={12} />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#D40511] text-white py-3.5 rounded-lg font-bold text-sm hover:bg-[#b8040e] transition-colors flex items-center justify-center gap-2"
            >
              <Search size={16} />
              Track Shipment
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Clock, label: "Real-Time Updates" },
              { icon: Globe, label: "220+ Countries" },
              { icon: Package, label: "All Shipment Types" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="text-xs text-gray-500">
                <Icon
                  size={20}
                  className="mx-auto mb-1.5 text-[#D40511]"
                />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}