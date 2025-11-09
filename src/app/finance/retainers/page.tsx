"use client";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Money } from "@/components/Money";
import { Modal } from "@/components/Modal";
import { Repeat, DollarSign, Clock, Users, Trash2, Calendar, Edit } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function RetainersPage() {
  const { data } = useSWR("/api/retainers", fetcher, { keepPreviousData: true });
  const { data: clients } = useSWR("/api/clients", fetcher, { keepPreviousData: true });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    client_id: "",
    name: "",
    status: "active",
    amount: "",
    billing_cycle: "monthly",
    start_date: "",
    end_date: "",
    hours_included: "",
    hours_used: "0",
    auto_renew: true,
  });

  function openCreateModal() {
    setEditingId(null);
    setFormData({ client_id: "", name: "", status: "active", amount: "", billing_cycle: "monthly", start_date: "", end_date: "", hours_included: "", hours_used: "0", auto_renew: true });
    setShowModal(true);
  }

  function openEditModal(retainer: any) {
    setEditingId(retainer.id);
    setFormData({
      client_id: retainer.client_id || "",
      name: retainer.name || "",
      status: retainer.status || "active",
      amount: String(retainer.amount || ""),
      billing_cycle: retainer.billing_cycle || "monthly",
      start_date: retainer.start_date || "",
      end_date: retainer.end_date || "",
      hours_included: retainer.hours_included ? String(retainer.hours_included) : "",
      hours_used: String(retainer.hours_used || "0"),
      auto_renew: retainer.auto_renew ?? true,
    });
    setShowModal(true);
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        client_id: formData.client_id || null,
        name: formData.name,
        status: formData.status,
        amount: Number(formData.amount) || 0,
        billing_cycle: formData.billing_cycle,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        hours_included: formData.hours_included ? Number(formData.hours_included) : null,
        hours_used: Number(formData.hours_used) || 0,
        auto_renew: formData.auto_renew,
      };

      const url = editingId ? `/api/retainers?id=${editingId}` : "/api/retainers";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to ${editingId ? "update" : "create"} retainer: ${err?.error ?? res.statusText}`);
        return;
      }
      (await import("swr")).mutate("/api/retainers");
      setShowModal(false);
      setEditingId(null);
      setFormData({ client_id: "", name: "", status: "active", amount: "", billing_cycle: "monthly", start_date: "", end_date: "", hours_included: "", hours_used: "0", auto_renew: true });
    } catch (err: any) {
      alert(`Failed to ${editingId ? "update" : "create"} retainer: ${String(err?.message ?? err)}`);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this retainer?")) return;
    try {
      const res = await fetch(`/api/retainers?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to delete retainer: ${err?.error ?? res.statusText}`);
        return;
      }
      (await import("swr")).mutate("/api/retainers");
    } catch (err: any) {
      alert(`Failed to delete retainer: ${String(err?.message ?? err)}`);
    }
  }

  const retainers = data ?? [];
  const stats = {
    active: retainers.filter((r: any) => r.status === "active").length,
    mrr: retainers.filter((r: any) => r.status === "active" && r.billing_cycle === "monthly").reduce((sum: number, r: any) => sum + (r.amount || 0), 0),
    totalValue: retainers.filter((r: any) => r.status === "active").reduce((sum: number, r: any) => sum + (r.amount || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Retainers</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage recurring client agreements</p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300 hover:bg-emerald-500/15 transition-colors font-medium"
        >
          <Repeat className="h-4 w-4" />
          New Retainer
        </button>
      </div>

      {/* Create/Edit Retainer Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingId(null); }} title={editingId ? "Edit Retainer" : "Create New Retainer"}>
        <form onSubmit={onCreate} className="space-y-4">
          <div>
            <label htmlFor="client_id" className="block text-sm font-medium text-zinc-300 mb-2">
              Client
            </label>
            <select
              id="client_id"
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            >
              <option value="">Select Client (Optional)</option>
              {(clients ?? []).map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

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
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="Acme Corp - Content Retainer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-zinc-300 mb-2">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div>
              <label htmlFor="billing_cycle" className="block text-sm font-medium text-zinc-300 mb-2">
                Billing Cycle
              </label>
              <select
                id="billing_cycle"
                value={formData.billing_cycle}
                onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-zinc-300 mb-2">
              Amount *
            </label>
            <input
              type="number"
              id="amount"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="3500"
              min="0"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-zinc-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="start_date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-zinc-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                id="end_date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="hours_included" className="block text-sm font-medium text-zinc-300 mb-2">
                Hours Included
              </label>
              <input
                type="number"
                id="hours_included"
                value={formData.hours_included}
                onChange={(e) => setFormData({ ...formData, hours_included: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="20"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="hours_used" className="block text-sm font-medium text-zinc-300 mb-2">
                Hours Used
              </label>
              <input
                type="number"
                id="hours_used"
                value={formData.hours_used}
                onChange={(e) => setFormData({ ...formData, hours_used: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.auto_renew}
                onChange={(e) => setFormData({ ...formData, auto_renew: e.target.checked })}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
              />
              <span className="text-sm text-zinc-300">Auto-renew</span>
            </label>
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
              className="flex-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300 hover:bg-emerald-500/15 transition-colors font-medium"
            >
              {editingId ? "Update Retainer" : "Create Retainer"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Active Retainers</div>
              <div className="text-2xl font-bold text-white">{stats.active}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Users className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Monthly Recurring</div>
              <div className="text-2xl font-bold text-emerald-400">
                <Money amount={stats.mrr} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-400/15 flex items-center justify-center">
              <Repeat className="h-6 w-6 text-teal-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Total Value</div>
              <div className="text-2xl font-bold text-white">
                <Money amount={stats.totalValue} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Retainers table */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">All Retainers</h2>
        <DataTable
          columns={[
            { 
              key: "name", 
              header: "Name",
              format: (v) => <span className="font-medium">{v}</span>
            },
            { key: "status", header: "Status", format: (v) => <StatusBadge status={String(v)} /> },
            { 
              key: "amount", 
              header: "Amount", 
              format: (v) => <span className="font-semibold"><Money amount={Number(v)} /></span>
            },
            { 
              key: "billing_cycle", 
              header: "Cycle",
              format: (v) => <span className="capitalize">{v}</span>
            },
            { 
              key: "hours_used", 
              header: "Hours",
              format: (v, row: any) => {
                const used = Number(v) || 0;
                const total = Number(row.hours_included) || 0;
                if (!total) return "—";
                const pct = Math.round((used / total) * 100);
                return (
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{used}/{total}</span>
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              }
            },
            { 
              key: "next_billing_date", 
              header: "Next Billing",
              format: (v) => v ? new Date(v).toLocaleDateString() : "—"
            },
          ]}
          rows={retainers as any}
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

