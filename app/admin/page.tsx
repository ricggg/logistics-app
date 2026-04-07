// app/admin/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  RefreshCw,
  Copy,
  CheckCheck,
  Trash2,
  Edit3,
  X,
  ChevronDown,
  Search,
  Loader2,
  AlertCircle,
  TrendingUp,
  Truck,
} from "lucide-react";
import type { Shipment, ShipmentStatus } from "@/lib/shipments";

const STATUS_OPTIONS: ShipmentStatus[] = [
  "Order Placed",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Exception",
];

const statusColors: Record<string, string> = {
  "Order Placed": "bg-blue-100 text-blue-700",
  "Picked Up": "bg-yellow-100 text-yellow-700",
  "In Transit": "bg-orange-100 text-orange-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Exception: "bg-red-100 text-red-700",
};

interface CreateForm {
  senderName: string;
  senderAddress: string;
  receiverName: string;
  receiverAddress: string;
  packageDescription: string;
  weight: string;
  estimatedDelivery: string;
}

interface UpdateForm {
  status: ShipmentStatus;
  location: string;
  description: string;
}

const emptyCreate: CreateForm = {
  senderName: "",
  senderAddress: "",
  receiverName: "",
  receiverAddress: "",
  packageDescription: "",
  weight: "",
  estimatedDelivery: "",
};

const emptyUpdate: UpdateForm = {
  status: "In Transit",
  location: "",
  description: "",
};

export default function AdminPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>(emptyCreate);
  const [creating, setCreating] = useState(false);
  const [newTracking, setNewTracking] = useState("");
  const [copied, setCopied] = useState(false);

  // Update modal
  const [updateTarget, setUpdateTarget] = useState<Shipment | null>(null);
  const [updateForm, setUpdateForm] = useState<UpdateForm>(emptyUpdate);
  const [updating, setUpdating] = useState(false);

  // Delete
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shipments");
      const data = await res.json();
      setShipments(data.shipments ?? []);
    } catch {
      console.error("Failed to fetch shipments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (res.ok) {
        setNewTracking(data.trackingNumber);
        setCreateForm(emptyCreate);
        fetchShipments();
      }
    } catch {
      console.error("Create failed");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTarget) return;
    setUpdating(true);
    try {
      const res = await fetch(
        `/api/shipments/${updateTarget.trackingNumber}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateForm),
        }
      );
      if (res.ok) {
        setUpdateTarget(null);
        setUpdateForm(emptyUpdate);
        fetchShipments();
      }
    } catch {
      console.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (trackingNumber: string) => {
    if (!confirm("Are you sure you want to delete this shipment?")) return;
    setDeletingId(trackingNumber);
    try {
      await fetch(`/api/shipments/${trackingNumber}`, { method: "DELETE" });
      fetchShipments();
    } catch {
      console.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = shipments.filter(
    (s) =>
      s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.receiverName.toLowerCase().includes(search.toLowerCase()) ||
      s.senderName.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter((s) => s.currentStatus === "In Transit").length,
    delivered: shipments.filter((s) => s.currentStatus === "Delivered").length,
    exceptions: shipments.filter((s) => s.currentStatus === "Exception").length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin header */}
      <div className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#D40511] px-3 py-1.5 rounded shadow-md">
              <span className="text-white font-black text-base tracking-tighter leading-none">
                TRAC
              </span>
            </div>
            <div>
              <h1 className="text-white font-black text-base leading-none">
                Global Logistics
              </h1>
              <p className="text-gray-400 text-xs mt-0.5">
                Shipment Management Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchShipments}
              className="flex items-center gap-2 bg-gray-700 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-gray-600 transition-colors"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
            <button
              onClick={() => {
                setShowCreate(true);
                setNewTracking("");
              }}
              className="flex items-center gap-2 bg-[#D40511] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#b8040e] transition-colors"
            >
              <Plus size={14} />
              New Shipment
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Shipments",
              value: stats.total,
              icon: Package,
              color: "text-gray-700",
              bg: "bg-gray-200",
            },
            {
              label: "In Transit",
              value: stats.inTransit,
              icon: Truck,
              color: "text-orange-600",
              bg: "bg-orange-100",
            },
            {
              label: "Delivered",
              value: stats.delivered,
              icon: CheckCheck,
              color: "text-green-600",
              bg: "bg-green-100",
            },
            {
              label: "Exceptions",
              value: stats.exceptions,
              icon: AlertCircle,
              color: "text-red-600",
              bg: "bg-red-100",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon size={14} className={stat.color} />
                </div>
              </div>
              <p className={`text-3xl font-black ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="font-black text-gray-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#D40511]" />
              All Shipments
            </h2>
            <div className="relative w-full sm:w-64">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search shipments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#D40511] transition-colors"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <Loader2
                size={32}
                className="animate-spin text-[#D40511] mx-auto mb-3"
              />
              <p className="text-gray-500 text-sm">Loading shipments...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Package size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-semibold">No shipments found</p>
              <p className="text-gray-400 text-xs mt-1">
                Create your first shipment to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[
                      "Tracking #",
                      "Sender",
                      "Receiver",
                      "Description",
                      "Status",
                      "Est. Delivery",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-black uppercase tracking-wider text-gray-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((s) => (
                    <tr
                      key={s.trackingNumber}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-900">
                            {s.trackingNumber}
                          </span>
                          <button
                            onClick={() => copyToClipboard(s.trackingNumber)}
                            className="text-gray-400 hover:text-[#D40511] transition-colors"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900 text-xs">
                          {s.senderName}
                        </p>
                        <p className="text-gray-400 text-xs truncate max-w-[120px]">
                          {s.senderAddress}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900 text-xs">
                          {s.receiverName}
                        </p>
                        <p className="text-gray-400 text-xs truncate max-w-[120px]">
                          {s.receiverAddress}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600 max-w-[130px] truncate">
                        {s.packageDescription}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            statusColors[s.currentStatus] ??
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {s.currentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600">
                        {s.estimatedDelivery}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setUpdateTarget(s);
                              setUpdateForm({
                                status: s.currentStatus,
                                location: "",
                                description: "",
                              });
                            }}
                            className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1.5 rounded text-xs font-semibold hover:bg-blue-100 transition-colors"
                          >
                            <Edit3 size={11} />
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(s.trackingNumber)}
                            disabled={deletingId === s.trackingNumber}
                            className="flex items-center gap-1 bg-red-50 text-[#D40511] px-2 py-1.5 rounded text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            {deletingId === s.trackingNumber ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              <Trash2 size={11} />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ─── CREATE MODAL ─── */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="font-black text-gray-900 flex items-center gap-2">
                  <Plus size={18} className="text-[#D40511]" />
                  Create New Shipment
                </h2>
                <button
                  onClick={() => {
                    setShowCreate(false);
                    setNewTracking("");
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {/* Success state */}
                {newTracking ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCheck size={28} className="text-green-600" />
                    </div>
                    <h3 className="font-black text-xl text-gray-900 mb-2">
                      Shipment Created!
                    </h3>
                    <p className="text-gray-500 text-sm mb-1">
                      Share this tracking number with your customer:
                    </p>
                    <p className="text-xs text-gray-400 mb-5">
                      Trac Global Logistics — Tracking Reference
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border-2 border-dashed border-gray-200 mb-5">
                      <span className="font-mono font-black text-lg text-gray-900">
                        {newTracking}
                      </span>
                      <button
                        onClick={() => copyToClipboard(newTracking)}
                        className="flex items-center gap-2 bg-[#D40511] text-white px-4 py-2 rounded font-bold text-sm hover:bg-[#b8040e] transition-colors"
                      >
                        {copied ? (
                          <CheckCheck size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => {
                          setNewTracking("");
                        }}
                        className="bg-[#D40511] text-white px-5 py-2.5 rounded font-bold text-sm hover:bg-[#b8040e] transition-colors"
                      >
                        Create Another
                      </button>
                      <button
                        onClick={() => {
                          setShowCreate(false);
                          setNewTracking("");
                        }}
                        className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded font-bold text-sm hover:bg-gray-200 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleCreate} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Sender */}
                      <div className="sm:col-span-2">
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
                          Sender Details
                        </h3>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Sender Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={createForm.senderName}
                          onChange={(e) =>
                            setCreateForm((p) => ({
                              ...p,
                              senderName: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                          placeholder="e.g. John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Sender Address *
                        </label>
                        <input
                          required
                          type="text"
                          value={createForm.senderAddress}
                          onChange={(e) =>
                            setCreateForm((p) => ({
                              ...p,
                              senderAddress: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                          placeholder="e.g. 123 Main St, Lagos"
                        />
                      </div>

                      {/* Receiver */}
                      <div className="sm:col-span-2">
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 mt-2">
                          Recipient Details
                        </h3>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Receiver Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={createForm.receiverName}
                          onChange={(e) =>
                            setCreateForm((p) => ({
                              ...p,
                              receiverName: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                          placeholder="e.g. Jane Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Receiver Address *
                        </label>
                        <input
                          required
                          type="text"
                          value={createForm.receiverAddress}
                          onChange={(e) =>
                            setCreateForm((p) => ({
                              ...p,
                              receiverAddress: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                          placeholder="e.g. 456 Oak Ave, Abuja"
                        />
                      </div>

                      {/* Package */}
                      <div className="sm:col-span-2">
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 mt-2">
                          Package Details
                        </h3>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Package Description *
                        </label>
                        <input
                          required
                          type="text"
                          value={createForm.packageDescription}
                          onChange={(e) =>
                            setCreateForm((p) => ({
                              ...p,
                              packageDescription: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                          placeholder="e.g. Electronics — Smartphone"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Weight *
                        </label>
                        <input
                          required
                          type="text"
                          value={createForm.weight}
                          onChange={(e) =>
                            setCreateForm((p) => ({
                              ...p,
                              weight: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                          placeholder="e.g. 2.5 kg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Estimated Delivery *
                        </label>
                        <input
                          required
                          type="date"
                          value={createForm.estimatedDelivery}
                          onChange={(e) =>
                            setCreateForm((p) => ({
                              ...p,
                              estimatedDelivery: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={creating}
                        className="flex-1 bg-[#D40511] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#b8040e] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {creating ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Plus size={15} />
                        )}
                        {creating ? "Creating..." : "Create Shipment"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreate(false)}
                        className="px-5 py-3 border border-gray-200 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── UPDATE MODAL ─── */}
      <AnimatePresence>
        {updateTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-black text-gray-900 flex items-center gap-2">
                  <Edit3 size={16} className="text-blue-500" />
                  Update Shipment Status
                </h2>
                <button
                  onClick={() => setUpdateTarget(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <p className="text-xs text-gray-500 mb-4 font-mono bg-gray-50 px-3 py-2 rounded">
                  {updateTarget.trackingNumber}
                </p>

                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      New Status *
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={updateForm.status}
                        onChange={(e) =>
                          setUpdateForm((p) => ({
                            ...p,
                            status: e.target.value as ShipmentStatus,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors appearance-none"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Current Location *
                    </label>
                    <input
                      required
                      type="text"
                      value={updateForm.location}
                      onChange={(e) =>
                        setUpdateForm((p) => ({
                          ...p,
                          location: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                      placeholder="e.g. Stockholm Sorting Center, Sweden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Status Description *
                    </label>
                    <input
                      required
                      type="text"
                      value={updateForm.description}
                      onChange={(e) =>
                        setUpdateForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                      placeholder="e.g. Package arrived at sorting facility"
                    />
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {updating ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Edit3 size={14} />
                      )}
                      {updating ? "Updating..." : "Update Status"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpdateTarget(null)}
                      className="px-5 py-3 border border-gray-200 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}