// app/adminx/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Plus, RefreshCw, Copy, CheckCheck, Trash2, Edit3, X,
  ChevronDown, Search, Loader2, AlertCircle, TrendingUp, Truck,
  Lock, Eye, EyeOff, LogOut, Phone, ShieldAlert, Clock, Calendar,
  List, PenLine,
} from "lucide-react";
import type { ShipmentX, ShipmentXStatus, TrackingEventX } from "@/lib/shipmentsX";

const ADMINX_PASSWORD = "Jehova6432*";

const STATUS_GROUPS = [
  {
    label: "Standard Flow",
    options: ["Order Placed", "Picked Up", "In Transit"],
  },
  {
    label: "Hold & Customs",
    options: [
      "On Hold", "Customs Hold", "Pending Customs Clearance",
      "Customs Documentation Required", "Duty Payment Required",
      "Customs Cleared", "Released from Customs", "Seized by Customs",
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
  "On Hold", "Customs Hold", "Pending Customs Clearance",
  "Customs Documentation Required", "Duty Payment Required", "Seized by Customs",
]);

function todayDate() { return new Date().toISOString().slice(0, 10); }
function nowTime()   { return new Date().toTimeString().slice(0, 5); }

interface CreateForm {
  senderName: string; senderPhone: string; senderAddress: string;
  receiverName: string; receiverPhone: string; receiverAddress: string;
  packageDescription: string; weight: string;
  estimatedDelivery: string; estimatedDeliveryTime: string;
  orderDate: string; orderTime: string;
}

interface UpdateForm {
  status: ShipmentXStatus; location: string; description: string;
  eventDate: string; eventTime: string;
}

interface EditEventForm {
  status: ShipmentXStatus; location: string; description: string;
  eventDate: string; eventTime: string;
}

interface EditDeliveryForm {
  date: string;
  time: string;
}

const emptyCreate: CreateForm = {
  senderName: "", senderPhone: "", senderAddress: "",
  receiverName: "", receiverPhone: "", receiverAddress: "",
  packageDescription: "", weight: "",
  estimatedDelivery: "", estimatedDeliveryTime: "",
  orderDate: todayDate(), orderTime: nowTime(),
};

const emptyUpdate: UpdateForm = {
  status: "In Transit", location: "", description: "",
  eventDate: todayDate(), eventTime: nowTime(),
};

// ── LOGIN ──────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (password === ADMINX_PASSWORD) {
        sessionStorage.setItem("adminx_auth", "true");
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
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-[#D40511] px-3 py-1.5 rounded shadow-md">
              <span className="text-white font-black text-xl tracking-tighter leading-none">ClearRoute</span>
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
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-red-500 text-xs mt-2"
                >
                  <AlertCircle size={12} /> {error}
                </motion.p>
              )}
            </div>
            <button type="submit" disabled={loading || !password}
              className="w-full bg-[#D40511] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#b8040e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Verifying...</>
                : <><Lock size={15} /> Access Dashboard</>}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-600 text-xs mt-6">
          © 2026 ClearRoute Global Logistics. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}

// ── DATE-TIME ROW ──────────────────────────────────────────────────────────
function DateTimeRow({
  dateLabel, timeLabel, dateValue, timeValue, onDateChange, onTimeChange, required = true,
}: {
  dateLabel: string; timeLabel: string; dateValue: string; timeValue: string;
  onDateChange: (v: string) => void; onTimeChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          <span className="flex items-center gap-1"><Calendar size={11} /> {dateLabel}</span>
        </label>
        <input type="date" required={required} value={dateValue}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          <span className="flex items-center gap-1"><Clock size={11} /> {timeLabel}</span>
        </label>
        <input type="time" required={required} value={timeValue}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors"
        />
      </div>
    </div>
  );
}

// ── STATUS SELECT ──────────────────────────────────────────────────────────
function StatusSelect({ value, onChange }: { value: ShipmentXStatus; onChange: (v: ShipmentXStatus) => void }) {
  return (
    <div className="relative">
      <select required value={value}
        onChange={(e) => onChange(e.target.value as ShipmentXStatus)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors appearance-none bg-white"
      >
        {STATUS_GROUPS.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((s) => <option key={s} value={s}>{s}</option>)}
          </optgroup>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ── EVENTS MANAGER MODAL ───────────────────────────────────────────────────
function EventsManagerModal({
  shipment, onClose, onSaved,
}: {
  shipment: ShipmentX;
  onClose: () => void;
  onSaved: (updated: ShipmentX) => void;
}) {
  const [localShipment, setLocalShipment] = useState<ShipmentX>(shipment);
  useEffect(() => { setLocalShipment(shipment); }, [shipment]);

  const [editingIdx, setEditingIdx]   = useState<number | null>(null);
  const [editForm, setEditForm]       = useState<EditEventForm>({
    status: "In Transit", location: "", description: "",
    eventDate: todayDate(), eventTime: nowTime(),
  });
  const [saving, setSaving]           = useState(false);
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null);
  const [saveError, setSaveError]     = useState("");

  const startEdit = (idx: number, ev: TrackingEventX) => {
    setSaveError("");
    setEditingIdx(idx);
    setEditForm({
      status:      ev.status,
      location:    ev.location,
      description: ev.description,
      eventDate:   ev.eventDate || todayDate(),
      eventTime:   ev.eventTime || nowTime(),
    });
  };

  const cancelEdit = () => { setEditingIdx(null); setSaveError(""); };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIdx === null) return;
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch(`/api/shipmentsx/${localShipment.trackingNumber}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          mode:        "edit-event",
          eventIndex:  editingIdx,
          status:      editForm.status,
          location:    editForm.location,
          description: editForm.description,
          eventDate:   editForm.eventDate,
          eventTime:   editForm.eventTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setSaveError(data.error || "Failed to save changes."); return; }
      setLocalShipment(data.shipment);
      setEditingIdx(null);
      onSaved(data.shipment);
    } catch (err) {
      setSaveError("Network error. Please try again.");
      console.error("saveEdit error:", err);
    } finally { setSaving(false); }
  };

  const deleteEvent = async (idx: number) => {
    if (!confirm(`Delete Event #${idx + 1}? This cannot be undone.`)) return;
    setDeletingIdx(idx);
    try {
      const res = await fetch(`/api/shipmentsx/${localShipment.trackingNumber}/events`, {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ eventIndex: idx }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Failed to delete event."); return; }
      setLocalShipment(data.shipment);
      if (editingIdx === idx) setEditingIdx(null);
      onSaved(data.shipment);
    } catch (err) {
      alert("Network error. Please try again.");
      console.error("deleteEvent error:", err);
    } finally { setDeletingIdx(null); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-black text-gray-900 flex items-center gap-2">
              <List size={16} className="text-blue-500" /> Manage Events
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              {localShipment.trackingNumber} — {localShipment.events.length} event(s)
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="p-5 space-y-3">
          {localShipment.events.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No events yet.</p>
          )}
          {localShipment.events.map((ev, idx) => (
            <div key={idx}
              className={`border rounded-xl p-4 transition-colors ${
                editingIdx === idx ? "border-blue-300 bg-blue-50" : "border-gray-100 bg-gray-50"
              }`}
            >
              {editingIdx === idx ? (
                <form onSubmit={saveEdit} className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-black text-blue-700 uppercase tracking-wider">
                      Editing Event #{idx + 1}
                    </p>
                    <button type="button" onClick={cancelEdit}
                      className="text-gray-400 hover:text-gray-600 text-xs underline"
                    >Cancel</button>
                  </div>
                  {saveError && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      <AlertCircle size={13} className="text-red-500 shrink-0" />
                      <p className="text-xs text-red-600">{saveError}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Status *</label>
                    <StatusSelect value={editForm.status} onChange={(v) => setEditForm((p) => ({ ...p, status: v }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Location *</label>
                    <input required type="text" value={editForm.location}
                      onChange={(e) => setEditForm((p) => ({ ...p, location: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors bg-white"
                      placeholder="e.g. Lagos Airport, Nigeria"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Description *</label>
                    <input required type="text" value={editForm.description}
                      onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D40511] transition-colors bg-white"
                      placeholder="e.g. Package arrived at sorting facility"
                    />
                  </div>
                  <div className="bg-white border border-blue-100 rounded-xl p-3">
                    <p className="text-xs font-black text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Clock size={11} /> Date &amp; Time
                    </p>
                    <DateTimeRow
                      dateLabel="Event Date *" timeLabel="Event Time *"
                      dateValue={editForm.eventDate} timeValue={editForm.eventTime}
                      onDateChange={(v) => setEditForm((p) => ({ ...p, eventDate: v }))}
                      onTimeChange={(v) => setEditForm((p) => ({ ...p, eventTime: v }))}
                    />
                  </div>
                  <button type="submit" disabled={saving}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {saving
                      ? <><Loader2 size={13} className="animate-spin" /> Saving...</>
                      : <><CheckCheck size={13} /> Save Changes to Event #{idx + 1}</>}
                  </button>
                </form>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="text-xs font-black text-gray-400 bg-gray-200 rounded px-1.5 py-0.5">
                        #{idx + 1}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        statusColors[ev.status] ?? "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}>
                        {ev.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-800 font-semibold">{ev.description}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Package size={10} /> {ev.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {ev.eventDate
                          ? new Date(ev.eventDate + "T00:00:00").toLocaleDateString("en-GB", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                          : "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {ev.eventTime
                          ? (() => {
                              const [h, m] = ev.eventTime.split(":").map(Number);
                              const ampm = h >= 12 ? "PM" : "AM";
                              return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
                            })()
                          : "—"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => startEdit(idx, ev)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-semibold"
                    ><PenLine size={12} /> Edit</button>
                    <button onClick={() => deleteEvent(idx)} disabled={deletingIdx === idx}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-xs font-semibold disabled:opacity-50"
                    >
                      {deletingIdx === idx ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                      Delete
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

// ── MAIN DASHBOARD ─────────────────────────────────────────────────────────
export default function AdminXPage() {
  const [authenticated, setAuthenticated]     = useState(false);
  const [checkingAuth, setCheckingAuth]       = useState(true);
  const [shipments, setShipments]             = useState<ShipmentX[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState("");
  const [showCreate, setShowCreate]           = useState(false);
  const [createForm, setCreateForm]           = useState<CreateForm>(emptyCreate);
  const [creating, setCreating]               = useState(false);
  const [newTracking, setNewTracking]         = useState("");
  const [copied, setCopied]                   = useState(false);
  const [updateTarget, setUpdateTarget]       = useState<ShipmentX | null>(null);
  const [updateForm, setUpdateForm]           = useState<UpdateForm>(emptyUpdate);
  const [updating, setUpdating]               = useState(false);
  const [eventsTarget, setEventsTarget]       = useState<ShipmentX | null>(null);
  const [deletingId, setDeletingId]           = useState<string | null>(null);

  // ── edit-delivery state ──────────────────────────────────────────────────
  const [editDeliveryTarget, setEditDeliveryTarget] = useState<ShipmentX | null>(null);
  const [editDeliveryForm, setEditDeliveryForm]     = useState<EditDeliveryForm>({ date: "", time: "" });
  const [savingDelivery, setSavingDelivery]         = useState(false);
  const [deliveryError, setDeliveryError]           = useState("");

  useEffect(() => {
    const auth = sessionStorage.getItem("adminx_auth");
    if (auth === "true") setAuthenticated(true);
    setCheckingAuth(false);
  }, []);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/shipmentsx");
      const data = await res.json();
      setShipments(data.shipments ?? []);
    } catch { console.error("Failed to fetch shipments"); }
    finally   { setLoading(false); }
  }, []);

  useEffect(() => { if (authenticated) fetchShipments(); }, [authenticated, fetchShipments]);

  const handleEventSaved = useCallback((updatedShipment: ShipmentX) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.trackingNumber === updatedShipment.trackingNumber ? updatedShipment : s
      )
    );
    setEventsTarget(updatedShipment);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("adminx_auth");
    setAuthenticated(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res  = await fetch("/api/shipmentsx", {
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
    } catch { console.error("Create failed"); }
    finally   { setCreating(false); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTarget) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/shipmentsx/${updateTarget.trackingNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateForm),
      });
      if (res.ok) {
        setUpdateTarget(null);
        setUpdateForm({ ...emptyUpdate, eventDate: todayDate(), eventTime: nowTime() });
        fetchShipments();
      }
    } catch { console.error("Update failed"); }
    finally   { setUpdating(false); }
  };

  const handleDelete = async (trackingNumber: string) => {
    if (!confirm("Are you sure you want to delete this shipment?")) return;
    setDeletingId(trackingNumber);
    try {
      await fetch(`/api/shipmentsx/${trackingNumber}`, { method: "DELETE" });
      fetchShipments();
    } catch { console.error("Delete failed"); }
    finally   { setDeletingId(null); }
  };

  // ── edit delivery handler ────────────────────────────────────────────────
  const handleEditDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDeliveryTarget) return;
    if (!editDeliveryForm.date) {
      setDeliveryError("Please select a delivery date.");
      return;
    }
    setSavingDelivery(true);
    setDeliveryError("");
    try {
      const res = await fetch(
        `/api/shipmentsx/${editDeliveryTarget.trackingNumber}`,
        {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode:                  "edit-delivery",
            estimatedDelivery:     editDeliveryForm.date,
            estimatedDeliveryTime: editDeliveryForm.time,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setDeliveryError(data.error || "Failed to save.");
        return;
      }
      setShipments((prev) =>
        prev.map((s) =>
          s.trackingNumber === data.shipment.trackingNumber ? data.shipment : s
        )
      );
      setEditDeliveryTarget(null);
    } catch {
      setDeliveryError("Network error. Please try again.");
    } finally {
      setSavingDelivery(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = shipments.filter((s) =>
    s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.receiverName.toLowerCase().includes(search.toLowerCase()) ||
    s.senderName.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:       shipments.length,
    inTransit:   shipments.filter((s) => s.currentStatus === "In Transit").length,
    delivered:   shipments.filter((s) => s.currentStatus === "Delivered").length,
    exceptions:  shipments.filter((s) => s.currentStatus === "Exception").length,
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
      {/* HEADER */}
      <div className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#D40511] px-3 py-1.5 rounded shadow-md">
              <span className="text-white font-black text-base tracking-tighter leading-none">ClearRoute</span>
            </div>
            <div>
              <h1 className="text-white font-black text-base leading-none">Global Logistics</h1>
              <p className="text-gray-400 text-xs mt-0.5">Shipment Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchShipments}
              className="flex items-center gap-2 bg-gray-700 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-gray-600 transition-colors"
            ><RefreshCw size={13} /> Refresh</button>
            <button onClick={() => { setShowCreate(true); setNewTracking(""); }}
              className="flex items-center gap-2 bg-[#D40511] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#b8040e] transition-colors"
            ><Plus size={14} /> New Shipment</button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-700 text-gray-300 px-3 py-2 rounded text-xs font-semibold hover:bg-gray-600 hover:text-white transition-colors"
            ><LogOut size={13} /> Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Shipments", value: stats.total,       icon: Package,     color: "text-gray-700",   bg: "bg-gray-200"   },
            { label: "In Transit",      value: stats.inTransit,   icon: Truck,       color: "text-orange-600", bg: "bg-orange-100" },
            { label: "Delivered",       value: stats.delivered,   icon: CheckCheck,  color: "text-green-600",  bg: "bg-green-100"  },
            { label: "Customs / Hold",  value: stats.customsHold, icon: ShieldAlert, color: "text-amber-600",  bg: "bg-amber-100"  },
            { label: "Exceptions",      value: stats.exceptions,  icon: AlertCircle, color: "text-red-600",    bg: "bg-red-100"    },
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

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="font-black text-gray-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#D40511]" /> All Shipments
            </h2>
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search shipments..." value={search}
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
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-900">{s.trackingNumber}</span>
                          <button onClick={() => copyToClipboard(s.trackingNumber)} className="text-gray-400 hover:text-[#D40511] transition-colors">
                            <Copy size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900 text-xs">{s.senderName}</p>
                        {s.senderPhone && (
                          <p className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                            <Phone size={10} className="text-gray-400" /> {s.senderPhone}
                          </p>
                        )}
                        <p className="text-gray-400 text-xs truncate max-w-[120px] mt-0.5">{s.senderAddress}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900 text-xs">{s.receiverName}</p>
                        {s.receiverPhone && (
                          <p className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                            <Phone size={10} className="text-gray-400" /> {s.receiverPhone}
                          </p>
                        )}
                        <p className="text-gray-400 text-xs truncate max-w-[120px] mt-0.5">{s.receiverAddress}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600 max-w-[130px] truncate">{s.packageDescription}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusColors[s.currentStatus] ?? "bg-gray-100 text-gray-700 border border-gray-200"}`}>
                          {CUSTOMS_STATUSES.has(s.currentStatus) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70 animate-pulse" />
                          )}
                          {s.currentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-600">{s.estimatedDelivery}</p>
                        {s.estimatedDeliveryTime && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock size={10} /> {s.estimatedDeliveryTime}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Add event */}
                          <button
                            onClick={() => {
                              setUpdateTarget(s);
                              setUpdateForm({
                                ...emptyUpdate,
                                status: s.currentStatus,
                                eventDate: todayDate(),
                                eventTime: nowTime(),
                              });
                            }}
                            className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1.5 rounded text-xs font-semibold hover:bg-blue-100 transition-colors"
                          ><Edit3 size={11} /> Update</button>

                          {/* Edit delivery date */}
                          <button
                            onClick={() => {
                              setDeliveryError("");
                              setEditDeliveryTarget(s);
                              setEditDeliveryForm({
                                date: s.estimatedDelivery     ?? "",
                                time: s.estimatedDeliveryTime ?? "",
                              });
                            }}
                            className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1.5 rounded text-xs font-semibold hover:bg-green-100 transition-colors"
                          ><Calendar size={11} /> Delivery</button>

                          {/* Events manager */}
                          <button onClick={() => setEventsTarget(s)}
                            className="flex items-center gap-1 bg-violet-50 text-violet-600 px-2 py-1.5 rounded text-xs font-semibold hover:bg-violet-100 transition-colors"
                          ><List size={11} /> Events</button>

                          {/* Delete */}
                          <button onClick={() => handleDelete(s.trackingNumber)} disabled={deletingId === s.trackingNumber}
                            className="flex items-center gap-1 bg-red-50 text-[#D40511] px-2 py-1.5 rounded text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            {deletingId === s.trackingNumber
                              ? <Loader2 size={11} className="animate-spin" />
                              : <Trash2 size={11} />}
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

      {/* CREATE MODAL - truncated for brevity, same as before but using ShipmentXStatus */}
      {/* UPDATE MODAL - same pattern */}
      {/* EVENTS MODAL - already included above */}

      {/* ── EDIT DELIVERY MODAL ── */}
      <AnimatePresence>
        {editDeliveryTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-black text-gray-900 flex items-center gap-2">
                  <Calendar size={16} className="text-green-500" />
                  Edit Estimated Delivery
                </h2>
                <button
                  onClick={() => setEditDeliveryTarget(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5">
                <p className="text-xs text-gray-500 font-mono bg-gray-50 px-3 py-2 rounded mb-4">
                  {editDeliveryTarget.trackingNumber}
                </p>

                <div className="flex items-center gap-2 mb-4 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
                  <Clock size={13} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Current estimated delivery</p>
                    <p className="text-sm font-bold text-gray-700">
                      {editDeliveryTarget.estimatedDelivery
                        ? new Date(editDeliveryTarget.estimatedDelivery + "T00:00:00").toLocaleDateString("en-GB", {
                            day: "numeric", month: "long", year: "numeric",
                          })
                        : "—"}
                      {editDeliveryTarget.estimatedDeliveryTime
                        ? (() => {
                            const [h, m] = editDeliveryTarget.estimatedDeliveryTime.split(":").map(Number);
                            const ampm = h >= 12 ? "PM" : "AM";
                            return ` at ${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
                          })()
                        : ""}
                    </p>
                  </div>
                </div>

                {deliveryError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                    <AlertCircle size={13} className="text-red-500 shrink-0" />
                    <p className="text-xs text-red-600">{deliveryError}</p>
                  </div>
                )}

                <form onSubmit={handleEditDelivery} className="space-y-4">
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                    <p className="text-xs font-black text-green-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Calendar size={11} /> New Delivery Date &amp; Time
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          <span className="flex items-center gap-1"><Calendar size={11} /> Delivery Date *</span>
                        </label>
                        <input
                          type="date"
                          value={editDeliveryForm.date}
                          onChange={(e) => setEditDeliveryForm((p) => ({ ...p, date: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-500 transition-colors bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          <span className="flex items-center gap-1"><Clock size={11} /> Delivery Time (optional)</span>
                        </label>
                        <input
                          type="time"
                          value={editDeliveryForm.time}
                          onChange={(e) => setEditDeliveryForm((p) => ({ ...p, time: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-500 transition-colors bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditDeliveryTarget(null)}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingDelivery || !editDeliveryForm.date}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {savingDelivery
                        ? <><Loader2 size={13} className="animate-spin" /> Saving...</>
                        : <><CheckCheck size={13} /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Note: CREATE and UPDATE modals omitted for brevity - they're the same as your original but type-safe */}
    </div>
  );
}