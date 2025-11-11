"use client";
import { useState } from "react";
import { Camera, Plus, Package, DollarSign, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/Modal";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function EquipmentPage() {
  const { data } = useSWR("/api/equipment", fetcher, { keepPreviousData: true });
  const equipment = data ?? [];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    serial_number: "",
    purchase_date: "",
    purchase_price: "",
    status: "available",
    location: "",
    notes: "",
  });

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        category: formData.category || null,
        serial_number: formData.serial_number || null,
        purchase_date: formData.purchase_date || null,
        purchase_price: formData.purchase_price ? Number(formData.purchase_price) : null,
        status: formData.status,
        location: formData.location || null,
        notes: formData.notes || null,
      };
      const res = await fetch("/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to create equipment: ${err?.error ?? res.statusText}`);
        return;
      }
      (await import("swr")).mutate("/api/equipment");
      setShowModal(false);
      setFormData({ name: "", category: "", serial_number: "", purchase_date: "", purchase_price: "", status: "available", location: "", notes: "" });
    } catch (err: any) {
      alert(`Failed to create equipment: ${String(err?.message ?? err)}`);
    }
  }

  const totalItems = equipment.length;
  const totalValue = equipment.reduce((sum: number, e: any) => sum + Number(e.purchase_price || 0), 0);
  const inUse = equipment.filter((e: any) => e.status === "in_use").length;
  const maintenanceDue = 0; // placeholder for future logic

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Equipment & Studio Catalog</h1>
          <p className="text-sm text-zinc-400 mt-1">Track all gear, equipment, and studio assets</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add Equipment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Total Items</div>
              <div className="text-2xl font-bold text-white">{totalItems}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <Package className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Total Value</div>
              <div className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">In Use</div>
              <div className="text-2xl font-bold text-white">{inUse}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Camera className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Maintenance Due</div>
              <div className="text-2xl font-bold text-white">{maintenanceDue}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div className="card p-8 text-center">
        <Camera className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Equipment Catalog Coming Soon</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Track cameras, lenses, lights, audio gear, and all studio equipment with maintenance schedules.
        </p>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add Equipment
        </button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Equipment">
        <form onSubmit={onCreate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
              Name *
            </label>
            <input
              id="name"
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Sony A7SIII"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-2">
                Category
              </label>
              <input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                placeholder="Camera, Lens, Light..."
              />
            </div>
            <div>
              <label htmlFor="serial_number" className="block text-sm font-medium text-zinc-300 mb-2">
                Serial Number
              </label>
              <input
                id="serial_number"
                type="text"
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="purchase_date" className="block text-sm font-medium text-zinc-300 mb-2">
                Purchase Date
              </label>
              <input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              />
            </div>
            <div>
              <label htmlFor="purchase_price" className="block text-sm font-medium text-zinc-300 mb-2">
                Purchase Price
              </label>
              <input
                id="purchase_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                placeholder="2499.00"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-zinc-300 mb-2">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              >
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-zinc-300 mb-2">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Studio A, Storage, On-site..."
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-zinc-300 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Condition, accessories, maintenance cycle..."
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-500/15 transition-colors font-medium"
            >
              Create Equipment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

