"use client";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Money } from "@/components/Money";
import { Modal } from "@/components/Modal";
import { DollarSign, Tag, TrendingUp, Package, Trash2, Edit } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function RateCardsPage() {
  const { data } = useSWR("/api/rate-cards", fetcher, { keepPreviousData: true });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "video",
    unit_type: "hour",
    rate: "",
    cost: "",
    status: "active",
  });

  function openCreateModal() {
    setEditingId(null);
    setFormData({ name: "", description: "", category: "video", unit_type: "hour", rate: "", cost: "", status: "active" });
    setShowModal(true);
  }

  function openEditModal(rateCard: any) {
    setEditingId(rateCard.id);
    setFormData({
      name: rateCard.name || "",
      description: rateCard.description || "",
      category: rateCard.category || "video",
      unit_type: rateCard.unit_type || "hour",
      rate: String(rateCard.rate || ""),
      cost: rateCard.cost ? String(rateCard.cost) : "",
      status: rateCard.status || "active",
    });
    setShowModal(true);
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        unit_type: formData.unit_type,
        rate: Number(formData.rate) || 0,
        cost: formData.cost ? Number(formData.cost) : null,
        status: formData.status,
      };

      const url = editingId ? `/api/rate-cards?id=${editingId}` : "/api/rate-cards";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to ${editingId ? "update" : "create"} rate card: ${err?.error ?? res.statusText}`);
        return;
      }
      (await import("swr")).mutate("/api/rate-cards");
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: "", description: "", category: "video", unit_type: "hour", rate: "", cost: "", status: "active" });
    } catch (err: any) {
      alert(`Failed to ${editingId ? "update" : "create"} rate card: ${String(err?.message ?? err)}`);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this rate card?")) return;
    try {
      const res = await fetch(`/api/rate-cards?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to delete rate card: ${err?.error ?? res.statusText}`);
        return;
      }
      (await import("swr")).mutate("/api/rate-cards");
    } catch (err: any) {
      alert(`Failed to delete rate card: ${String(err?.message ?? err)}`);
    }
  }

  const rateCards = data ?? [];
  const activeCards = rateCards.filter((r: any) => r.status === "active");
  
  const stats = {
    total: activeCards.length,
    avgRate: activeCards.length > 0 ? Math.round(activeCards.reduce((sum: number, r: any) => sum + (r.rate || 0), 0) / activeCards.length) : 0,
    avgMargin: activeCards.length > 0 ? Math.round(activeCards.filter((r: any) => r.cost).reduce((sum: number, r: any) => {
      const margin = ((r.rate - r.cost) / r.rate) * 100;
      return sum + margin;
    }, 0) / activeCards.filter((r: any) => r.cost).length) : 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Rate Cards & Packages</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage pricing and service rates</p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-500/15 transition-colors font-medium"
        >
          <Tag className="h-4 w-4" />
          New Rate Card
        </button>
      </div>

      {/* Create/Edit Rate Card Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingId(null); }} title={editingId ? "Edit Rate Card" : "Create New Rate Card"}>
        <form onSubmit={onCreate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="Video Production - Standard"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
              placeholder="Full video production with 2 revisions"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-2">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              >
                <option value="video">Video</option>
                <option value="photo">Photo</option>
                <option value="design">Design</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="unit_type" className="block text-sm font-medium text-zinc-300 mb-2">
                Unit Type
              </label>
              <select
                id="unit_type"
                value={formData.unit_type}
                onChange={(e) => setFormData({ ...formData, unit_type: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              >
                <option value="hour">Per Hour</option>
                <option value="day">Per Day</option>
                <option value="project">Per Project</option>
                <option value="per_video">Per Video</option>
                <option value="per_asset">Per Asset</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-zinc-300 mb-2">
                Rate (Client Price) *
              </label>
              <input
                type="number"
                id="rate"
                required
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-zinc-300 mb-2">
                Cost (Internal)
              </label>
              <input
                type="number"
                id="cost"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {formData.rate && formData.cost && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-300">Margin:</span>
                <span className="font-semibold text-emerald-400">
                  {Math.round(((Number(formData.rate) - Number(formData.cost)) / Number(formData.rate)) * 100)}%
                </span>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-zinc-300 mb-2">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-500/15 transition-colors font-medium"
            >
              {editingId ? "Update Rate Card" : "Create Rate Card"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Active Cards</div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Package className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Avg Rate</div>
              <div className="text-2xl font-bold text-blue-400">
                <Money amount={stats.avgRate} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Avg Margin</div>
              <div className="text-2xl font-bold text-emerald-400">{stats.avgMargin}%</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Rate Cards table */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">All Rate Cards</h2>
        <DataTable
          columns={[
            { 
              key: "name", 
              header: "Name",
              format: (v) => <span className="font-medium">{v}</span>
            },
            { 
              key: "category", 
              header: "Category",
              format: (v) => <span className="capitalize">{v}</span>
            },
            { 
              key: "unit_type", 
              header: "Unit",
              format: (v) => <span className="capitalize text-xs">{String(v).replace(/_/g, " ")}</span>
            },
            { 
              key: "rate", 
              header: "Rate", 
              format: (v) => <span className="font-semibold text-blue-400"><Money amount={Number(v)} /></span>
            },
            { 
              key: "cost", 
              header: "Cost", 
              format: (v) => v ? <span className="text-zinc-400"><Money amount={Number(v)} /></span> : "—"
            },
            { 
              key: "margin", 
              header: "Margin",
              format: (v, row: any) => {
                if (!row.cost) return "—";
                const margin = Math.round(((row.rate - row.cost) / row.rate) * 100);
                return <span className={margin >= 50 ? "text-emerald-400" : margin >= 30 ? "text-amber-400" : "text-rose-400"}>{margin}%</span>;
              }
            },
            { key: "status", header: "Status", format: (v) => <StatusBadge status={String(v)} /> },
          ]}
          rows={rateCards as any}
          actionsHeader="Actions"
          renderActions={(row: any) => (
            <div className="flex items-center gap-2">
              <button onClick={() => openEditModal(row)} className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                <Edit className="h-3 w-3" />
                Edit
              </button>
              <button onClick={() => onDelete(row.id)} className="text-xs text-rose-400 hover:text-rose-300 inline-flex items-center gap-1">
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}

