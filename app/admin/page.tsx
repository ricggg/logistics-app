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
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Phone,
  ShieldAlert,
  Clock,
  Calendar,
  List,
  PenLine,
} from "lucide-react";
import type { Shipment, ShipmentStatus, TrackingEvent } from "@/lib/shipments";

// ─────────────────────────────────────────
// 🔐 PASSWORD
// ─────────────────────────────────────────
const ADMIN_PASSWORD = "Christ643";

// ─────────────────────────────────────────
// STATUS OPTIONS
// ─────────────────────────────────────────
const STATUS_OPTIONS: ShipmentStatus[] = [
  "Order Placed",
  "Picked Up",
  "In Transit",
  "On Hold",
  "Customs Hold",
  "Pending Customs Clearance",
  "Customs Documentation Required",
  "Duty Payment Required",
  "Customs Cleared",
  "Released from Customs",
  "Seized by Customs",
  "Out for Delivery",
  "Delivered",
  "Exception",
];

const STATUS_GROUPS = [
  {
    label: "Standard Flow",
    options: ["Order Placed", "Picked Up", "In Transit"],
  },
  {
    label: "Hold & Customs",
    options: [
      "On Hold",
      "Customs Hold",
      "Pending Customs Clearance",
      "Customs Documentation Required",
      "Duty Payment Required",
      "Customs Cleared",
      "Released from Customs",
      "Seized by Customs",
    ],
  },
  {
    label: "Final States",
    options: ["Out for Delivery", "Delivered", "Exception"],
  },
];

const statusColors: Record<string, string> = {
  "Order Placed":                   "bg-blue-100 text-blue-700 border border-blue-200",
  "Picked Up":                      "bg-yellow-100 text-yellow-700 border border-yellow-200",
  "In Transit":                     "bg-orange-100 text-orange-700 border border-orange-200",
  "Out for Delivery":               "bg-purple-100 text-purple-700 border border-purple-200",
  "Delivered":                      "bg-green-100 text-green-700 border border-green-200",
  "Exception":                      "bg-red-100 text-red-700 border border-red-200",
  "On Hold":                        "bg-orange-100 text-orange-800 border border-orange-300",
  "Customs Hold":                   "bg-red-100 text-red-800 border border-red-300",
  "Pending Customs Clearance":      "bg-amber-100 text-amber-800 border border-amber-300",
  "Customs Documentation Required": "bg-rose-100 text-rose-800 border border-rose-300",
  "Duty Payment Required":          "bg-orange-200 text-orange-900 border border-orange-400",
  "Customs Cleared":                "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Released from Customs":          "bg-teal-100 text-teal-700 border border-teal-200",
  "Seized by Customs":              "bg-red-200 text-red-900 border border-red-500",
};

const CUSTOMS_STATUSES = new Set([
  "On Hold",
  "Customs Hold",
  "Pending Customs Clearance",
  "Customs Documentation Required",
  "Duty Payment Required",
  "Seized by Customs",
]);

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
function todayDate() {
  return new Date().toISOString().slice(0, 10);
}
function nowTime() {
  return new Date().toTimeString().slice(0, 5);
}

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
interface CreateForm {
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  packageDescription: string;
  weight: string;
  estimatedDelivery: string;
  estimatedDeliveryTime: string;
  orderDate: string;
  orderTime: string;
}

interface UpdateForm {
  status: ShipmentStatus;
  location: string;
  description: string;
  eventDate: string;
  eventTime: string;
}

interface EditEventForm {
  status: ShipmentStatus;
  location: string;
  description: string;
  eventDate: string;
  eventTime: string;
}

const emptyCreate: CreateForm = {
  senderName: "",
  senderPhone: "",
  senderAddress: "",
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  packageDescription: "",
  weight: "",
  estimatedDelivery: "",
  estimatedDeliveryTime: "",
  orderDate: todayDate(),
  orderTime: nowTime(),
};

const emptyUpdate: UpdateForm = {
  status: "In Transit",
  location: "",
  description: "",
  eventDate: todayDate(),
  eventTime: nowTime(),
};

// ─────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem("admin_auth", "true");
        onLogin();
      } else {
        setError("Incorrect password. Please try again.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-[#D40511] px-3 py-1.5 rounded shadow-md">
              <span className="text-white font-black text-xl tracking-tighter leading-none">TRAC</span>
            </div>
            <span className="font-black text-xl tracking-tight text-[#FFCC00] leading-none">GLOBAL LOGISTICS</span>
          </div>
          <p className="text-gray-400 text-sm">Secure Admin Access</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center w-14 h-14 bg-[#D40511]/10 rounded-full mx-auto mb-6">
            <Lock size={24} className="text-[#D40511]" />
          </div>
          <h2 className="text-xl font-black text-gray-900 text-center mb-1">Admin Login</h2>
          <p className="text-gray-500 text-xs text-center mb-6">Enter your password to access the dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter admin password"
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#D40511] transition-colors pr-11"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-red-500 text-xs mt-2"
                >
                  <AlertCircle size={12} /> {error}
                </motion.p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#D40511] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#b8040e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={15} className="animate-spin" /> Verifying...</> : <><Lock size={15} /> Access Dashboard</>}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-600 text-xs mt-6">© 2026 Trac Global Logistics. All rights reserved.</p>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────
// DATE-TIME ROW COMPONENT
// ─────────────────────────────────────────
function DateTimeRow({
  dateLabel,
  timeLabel,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  required = true,
}: {
  dateLabel: string;
  timeLabel: string;
  dateValue: string;
  timeValue: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          <span className="flex items-center gap-1">
            <Calendar size={11} /> {dateLabel}
          </span>
        </label>
        <input
          type="date"
          required={required}
          value={dateValue}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          <span className="flex items-center gap-1">
            <Clock size={11} /> {timeLabel}
          </span>
        </label>
        <input
          type="time"
          required={required}
          value={timeValue}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// GROUPED STATUS SELECT
// ─────────────────────────────────────────
function StatusSelect({
  value,
  onChange,
}: {
  value: ShipmentStatus;
  onChange: (v: ShipmentStatus) => void;
}) {
  return (
    <div className="relative">
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value as ShipmentStatus)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors appearance-none bg-white"
      >
        {STATUS_GROUPS.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </optgroup>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ─────────────────────────────────────────
// EVENTS MANAGER MODAL
// ─────────────────────────────────────────
function EventsManagerModal({
  shipment,
  onClose,
  onRefresh,
}: {
  shipment: Shipment;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditEventForm>({
    status: "In Transit",
    location: "",
    description: "",
    eventDate: todayDate(),
    eventTime: nowTime(),
  });
  const [saving, setSaving] = useState(false);
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null);

  const startEdit = (idx: number, ev: TrackingEvent) => {
    setEditingIdx(idx);
    setEditForm({
      status: ev.status,
      location: ev.location,
      description: ev.description,
      eventDate: ev.eventDate || todayDate(),
      eventTime: ev.eventTime || nowTime(),
    });
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIdx === null) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/shipments/${shipment.trackingNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "edit-event",
          eventIndex: editingIdx,
          ...editForm,
        }),
      });
      if (res.ok) {
        setEditingIdx(null);
        onRefresh();
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (idx: number) => {
    if (!confirm("Delete this event?")) return;
    setDeletingIdx(idx);
    try {
      // We'll do a full replace via edit-event with a flag — 
      // simplest: filter out and PUT all events back via a custom endpoint.
      // Instead: we re-fetch, splice, and PATCH with mode=replace-all
      const res = await fetch(`/api/shipments/${shipment.trackingNumber}/events`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventIndex: idx }),
      });
      if (res.ok) {
        onRefresh();
      }
    } finally {
      setDeletingIdx(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-black text-gray-900 flex items-center gap-2">
              <List size={16} className="text-blue-500" />
              Manage Events
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{shipment.trackingNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {shipment.events.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No events yet.</p>
          )}

          {[...shipment.events].map((ev, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              {editingIdx === idx ? (
                /* ── EDIT FORM ── */
                <form onSubmit={saveEdit} className="space-y-3">
                  <p className="text-xs font-bold text-blue-600 mb-2">Editing Event #{idx + 1}</p>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Status *</label>
                    <StatusSelect
                      value={editForm.status}
                      onChange={(v) => setEditForm((p) => ({ ...p, status: v }))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Location *</label>
                    <input
                      required
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm((p) => ({ ...p, location: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                      placeholder="e.g. Lagos Airport, Nigeria"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Description *</label>
                    <input
                      required
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                    />
                  </div>

                  <DateTimeRow
                    dateLabel="Event Date"
                    timeLabel="Event Time"
                    dateValue={editForm.eventDate}
                    timeValue={editForm.eventTime}
                    onDateChange={(v) => setEditForm((p) => ({ ...p, eventDate: v }))}
                    onTimeChange={(v) => setEditForm((p) => ({ ...p, eventTime: v }))}
                  />

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-1"
                    >
                      {saving ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={12} />}
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIdx(null)}
                      className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold text-xs hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* ── EVENT DISPLAY ── */
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                          statusColors[ev.status] ?? "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {ev.status}
                      </span>
                      <span className="text-xs text-gray-400">Event #{idx + 1}</span>
                    </div>
                    <p className="text-xs text-gray-700 font-medium">{ev.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Package size={10} /> {ev.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} /> {ev.eventDate || "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {ev.eventTime || "—"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-0.5 font-mono">{ev.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => startEdit(idx, ev)}
                      className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Edit event"
                    >
                      <PenLine size={13} />
                    </button>
                    <button
                      onClick={() => deleteEvent(idx)}
                      disabled={deletingIdx === idx}
                      className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                      title="Delete event"
                    >
                      {deletingIdx === idx ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN ADMIN DASHBOARD
// ─────────────────────────────────────────
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>(emptyCreate);
  const [creating, setCreating] = useState(false);
  const [newTracking, setNewTracking] = useState("");
  const [copied, setCopied] = useState(false);

  const [updateTarget, setUpdateTarget] = useState<Shipment | null>(null);
  const [updateForm, setUpdateForm] = useState<UpdateForm>(emptyUpdate);
  const [updating, setUpdating] = useState(false);

  const [eventsTarget, setEventsTarget] = useState<Shipment | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") setAuthenticated(true);
    setCheckingAuth(false);
  }, []);

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
    if (authenticated) fetchShipments();
  }, [authenticated, fetchShipments]);

  // After refresh in events modal, also sync local state
  const handleEventsRefresh = useCallback(async () => {
    await fetchShipments();
    // Re-sync eventsTarget so the modal shows fresh data
    if (eventsTarget) {
      const res = await fetch(`/api/shipments/${eventsTarget.trackingNumber}`);
      const data = await res.json();
      if (data.shipment) setEventsTarget(data.shipment);
    }
  }, [eventsTarget, fetchShipments]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthenticated(false);
  };

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
        setCreateForm({ ...emptyCreate, orderDate: todayDate(), orderTime: nowTime() });
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
      const res = await fetch(`/api/shipments/${updateTarget.trackingNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateForm),
      });
      if (res.ok) {
        setUpdateTarget(null);
        setUpdateForm({ ...emptyUpdate, eventDate: todayDate(), eventTime: nowTime() });
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
    customsHold: shipments.filter((s) => CUSTOMS_STATUSES.has(s.currentStatus)).length,
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#D40511]" />
      </div>
    );
  }

  if (!authenticated) return <LoginScreen onLogin={() => setAuthenticated(true)} />;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ── HEADER ── */}
      <div className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#D40511] px-3 py-1.5 rounded shadow-md">
              <span className="text-white font-black text-base tracking-tighter leading-none">TRAC</span>
            </div>
            <div>
              <h1 className="text-white font-black text-base leading-none">Global Logistics</h1>
              <p className="text-gray-400 text-xs mt-0.5">Shipment Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchShipments}
              className="flex items-center gap-2 bg-gray-700 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-gray-600 transition-colors"
            >
              <RefreshCw size={13} /> Refresh
            </button>
            <button
              onClick={() => { setShowCreate(true); setNewTracking(""); }}
              className="flex items-center gap-2 bg-[#D40511] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#b8040e] transition-colors"
            >
              <Plus size={14} /> New Shipment
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-700 text-gray-300 px-3 py-2 rounded text-xs font-semibold hover:bg-gray-600 hover:text-white transition-colors"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Shipments", value: stats.total,      icon: Package,     color: "text-gray-700",   bg: "bg-gray-200"   },
            { label: "In Transit",      value: stats.inTransit,  icon: Truck,       color: "text-orange-600", bg: "bg-orange-100" },
            { label: "Delivered",       value: stats.delivered,  icon: CheckCheck,  color: "text-green-600",  bg: "bg-green-100"  },
            { label: "Customs / Hold",  value: stats.customsHold,icon: ShieldAlert, color: "text-amber-600",  bg: "bg-amber-100"  },
            { label: "Exceptions",      value: stats.exceptions, icon: AlertCircle, color: "text-red-600",    bg: "bg-red-100"    },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon size={14} className={stat.color} />
                </div>
              </div>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── TABLE ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="font-black text-gray-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#D40511]" /> All Shipments
            </h2>
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
              <Loader2 size={32} className="animate-spin text-[#D40511] mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading shipments...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Package size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-semibold">No shipments found</p>
              <p className="text-gray-400 text-xs mt-1">Create your first shipment to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Tracking #", "Sender", "Receiver", "Description", "Status", "Est. Delivery", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-black uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((s) => (
                    <tr key={s.trackingNumber} className="hover:bg-gray-50 transition-colors">
                      {/* Tracking # */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-900">{s.trackingNumber}</span>
                          <button onClick={() => copyToClipboard(s.trackingNumber)} className="text-gray-400 hover:text-[#D40511] transition-colors">
                            <Copy size={12} />
                          </button>
                        </div>
                      </td>

                      {/* Sender */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900 text-xs">{s.senderName}</p>
                        {s.senderPhone && (
                          <p className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                            <Phone size={10} className="text-gray-400" /> {s.senderPhone}
                          </p>
                        )}
                        <p className="text-gray-400 text-xs truncate max-w-[120px] mt-0.5">{s.senderAddress}</p>
                      </td>

                      {/* Receiver */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900 text-xs">{s.receiverName}</p>
                        {s.receiverPhone && (
                          <p className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                            <Phone size={10} className="text-gray-400" /> {s.receiverPhone}
                          </p>
                        )}
                        <p className="text-gray-400 text-xs truncate max-w-[120px] mt-0.5">{s.receiverAddress}</p>
                      </td>

                      {/* Description */}
                      <td className="px-5 py-4 text-xs text-gray-600 max-w-[130px] truncate">{s.packageDescription}</td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusColors[s.currentStatus] ?? "bg-gray-100 text-gray-700 border border-gray-200"}`}>
                          {CUSTOMS_STATUSES.has(s.currentStatus) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70 animate-pulse" />
                          )}
                          {s.currentStatus}
                        </span>
                      </td>

                      {/* Est. Delivery */}
                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-600">{s.estimatedDelivery}</p>
                        {s.estimatedDeliveryTime && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock size={10} /> {s.estimatedDeliveryTime}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => {
                              setUpdateTarget(s);
                              setUpdateForm({ ...emptyUpdate, status: s.currentStatus, eventDate: todayDate(), eventTime: nowTime() });
                            }}
                            className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1.5 rounded text-xs font-semibold hover:bg-blue-100 transition-colors"
                          >
                            <Edit3 size={11} /> Update
                          </button>
                          <button
                            onClick={() => setEventsTarget(s)}
                            className="flex items-center gap-1 bg-violet-50 text-violet-600 px-2 py-1.5 rounded text-xs font-semibold hover:bg-violet-100 transition-colors"
                          >
                            <List size={11} /> Events
                          </button>
                          <button
                            onClick={() => handleDelete(s.trackingNumber)}
                            disabled={deletingId === s.trackingNumber}
                            className="flex items-center gap-1 bg-red-50 text-[#D40511] px-2 py-1.5 rounded text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            {deletingId === s.trackingNumber ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
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
                  <Plus size={18} className="text-[#D40511]" /> Create New Shipment
                </h2>
                <button onClick={() => { setShowCreate(false); setNewTracking(""); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {newTracking ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCheck size={28} className="text-green-600" />
                    </div>
                    <h3 className="font-black text-xl text-gray-900 mb-2">Shipment Created!</h3>
                    <p className="text-gray-500 text-sm mb-1">Share this tracking number with your customer:</p>
                    <p className="text-xs text-gray-400 mb-5">Trac Global Logistics — Tracking Reference</p>
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border-2 border-dashed border-gray-200 mb-5">
                      <span className="font-mono font-black text-lg text-gray-900">{newTracking}</span>
                      <button
                        onClick={() => copyToClipboard(newTracking)}
                        className="flex items-center gap-2 bg-[#D40511] text-white px-4 py-2 rounded font-bold text-sm hover:bg-[#b8040e] transition-colors"
                      >
                        {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setNewTracking("")}
                        className="bg-[#D40511] text-white px-5 py-2.5 rounded font-bold text-sm hover:bg-[#b8040e] transition-colors"
                      >
                        Create Another
                      </button>
                      <button
                        onClick={() => { setShowCreate(false); setNewTracking(""); }}
                        className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded font-bold text-sm hover:bg-gray-200 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleCreate} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                      {/* ── Sender ── */}
                      <div className="sm:col-span-2">
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Sender Details</h3>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Sender Name *</label>
                        <input required type="text" value={createForm.senderName}
                          onChange={(e) => setCreateForm((p) => ({ ...p, senderName: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                          placeholder="e.g. John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Sender Phone *</label>
                        <div className="relative">
                          <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input required type="tel" value={createForm.senderPhone}
                            onChange={(e) => setCreateForm((p) => ({ ...p, senderPhone: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                            placeholder="e.g. +234 801 234 5678"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Sender Address *</label>
                        <input required type="text" value={createForm.senderAddress}
                          onChange={(e) => setCreateForm((p) => ({ ...p, senderAddress: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                          placeholder="e.g. 123 Main St, Lagos, Nigeria"
                        />
                      </div>

                      {/* ── Receiver ── */}
                      <div className="sm:col-span-2">
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 mt-2">Recipient Details</h3>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Receiver Name *</label>
                        <input required type="text" value={createForm.receiverName}
                          onChange={(e) => setCreateForm((p) => ({ ...p, receiverName: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                          placeholder="e.g. Jane Smith"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Receiver Phone *</label>
                        <div className="relative">
                          <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input required type="tel" value={createForm.receiverPhone}
                            onChange={(e) => setCreateForm((p) => ({ ...p, receiverPhone: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                            placeholder="e.g. +1 415 987 6543"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Receiver Address *</label>
                        <input required type="text" value={createForm.receiverAddress}
                          onChange={(e) => setCreateForm((p) => ({ ...p, receiverAddress: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                          placeholder="e.g. 456 Oak Ave, New York, USA"
                        />
                      </div>

                      {/* ── Package ── */}
                      <div className="sm:col-span-2">
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 mt-2">Package Details</h3>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Package Description *</label>
                        <input required type="text" value={createForm.packageDescription}
                          onChange={(e) => setCreateForm((p) => ({ ...p, packageDescription: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                          placeholder="e.g. Electronics — Smartphone"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Weight *</label>
                        <input required type="text" value={createForm.weight}
                          onChange={(e) => setCreateForm((p) => ({ ...p, weight: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                          placeholder="e.g. 2.5 kg"
                        />
                      </div>

                      {/* Estimated Delivery date + time */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          <span className="flex items-center gap-1"><Calendar size={11} /> Estimated Delivery Date *</span>
                        </label>
                        <input required type="date" value={createForm.estimatedDelivery}
                          onChange={(e) => setCreateForm((p) => ({ ...p, estimatedDelivery: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          <span className="flex items-center gap-1"><Clock size={11} /> Estimated Delivery Time</span>
                        </label>
                        <input type="time" value={createForm.estimatedDeliveryTime}
                          onChange={(e) => setCreateForm((p) => ({ ...p, estimatedDeliveryTime: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                        />
                      </div>

                      {/* ── Order Placed event date/time ── */}
                      <div className="sm:col-span-2">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <h3 className="text-xs font-black uppercase tracking-wider text-blue-700 mb-3 flex items-center gap-1.5">
                            <Clock size={12} /> "Order Placed" Event — Date &amp; Time
                          </h3>
                          <p className="text-xs text-blue-600 mb-3">
                            Set the exact date and time this shipment was placed. You can backdate this.
                          </p>
                          <DateTimeRow
                            dateLabel="Order Date *"
                            timeLabel="Order Time *"
                            dateValue={createForm.orderDate}
                            timeValue={createForm.orderTime}
                            onDateChange={(v) => setCreateForm((p) => ({ ...p, orderDate: v }))}
                            onTimeChange={(v) => setCreateForm((p) => ({ ...p, orderTime: v }))}
                          />
                        </div>
                      </div>

                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={creating}
                        className="flex-1 bg-[#D40511] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#b8040e] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="font-black text-gray-900 flex items-center gap-2">
                  <Edit3 size={16} className="text-blue-500" /> Add Tracking Event
                </h2>
                <button onClick={() => setUpdateTarget(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <p className="text-xs text-gray-500 mb-4 font-mono bg-gray-50 px-3 py-2 rounded">
                  {updateTarget.trackingNumber}
                </p>

                <form onSubmit={handleUpdate} className="space-y-4">
                  {/* Status */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">New Status *</label>
                    <StatusSelect
                      value={updateForm.status}
                      onChange={(v) => setUpdateForm((p) => ({ ...p, status: v }))}
                    />
                    {/* Badge preview */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-400">Preview:</span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[updateForm.status] ?? "bg-gray-100 text-gray-700 border border-gray-200"}`}>
                        {CUSTOMS_STATUSES.has(updateForm.status) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70 animate-pulse" />
                        )}
                        {updateForm.status}
                      </span>
                    </div>
                    {/* Customs warning */}
                    {CUSTOMS_STATUSES.has(updateForm.status) && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5"
                      >
                        <ShieldAlert size={14} className="text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800 font-medium">
                          This status indicates a customs or hold situation. Make sure the description clearly explains what action is needed.
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Current Location *</label>
                    <input
                      required type="text" value={updateForm.location}
                      onChange={(e) => setUpdateForm((p) => ({ ...p, location: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                      placeholder="e.g. Lagos International Airport, Nigeria"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Status Description *</label>
                    <input
                      required type="text" value={updateForm.description}
                      onChange={(e) => setUpdateForm((p) => ({ ...p, description: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
                      placeholder={
                        CUSTOMS_STATUSES.has(updateForm.status)
                          ? "e.g. Package held at customs — import documents required"
                          : "e.g. Package arrived at sorting facility"
                      }
                    />
                  </div>

                  {/* ── Event Date & Time ── */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-blue-700 mb-3 flex items-center gap-1.5">
                      <Clock size={12} /> Event Date &amp; Time
                    </h4>
                    <p className="text-xs text-blue-600 mb-3">
                      Set the exact date and time for this event. You can backdate entries.
                    </p>
                    <DateTimeRow
                      dateLabel="Event Date *"
                      timeLabel="Event Time *"
                      dateValue={updateForm.eventDate}
                      timeValue={updateForm.eventTime}
                      onDateChange={(v) => setUpdateForm((p) => ({ ...p, eventDate: v }))}
                      onTimeChange={(v) => setUpdateForm((p) => ({ ...p, eventTime: v }))}
                    />
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {updating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                      {updating ? "Adding..." : "Add Event"}
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

      {/* ─── EVENTS MANAGER MODAL ─── */}
      <AnimatePresence>
        {eventsTarget && (
          <EventsManagerModal
            shipment={eventsTarget}
            onClose={() => setEventsTarget(null)}
            onRefresh={handleEventsRefresh}
          />
        )}
      </AnimatePresence>
    </div>
  );
}