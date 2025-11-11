"use client";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import useSWR from "swr";
import { Flame, Plus, Mail, Phone, DollarSign, Calendar } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LeadsPage() {
  const { data } = useSWR("/api/leads", fetcher, { keepPreviousData: true });
  const leads = data ?? [];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "hot",
    email: "",
    phone: "",
    estimated_value: "",
    source: "",
    next_action_date: "",
    notes: "",
  });

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        status: formData.status,
        email: formData.email || null,
        phone: formData.phone || null,
        estimated_value: formData.estimated_value ? Number(formData.estimated_value) : null,
        source: formData.source || null,
        next_action_date: formData.next_action_date || null,
        notes: formData.notes || null,
      };
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to create lead: ${err?.error ?? res.statusText}`);
        return;
      }
      (await import("swr")).mutate("/api/leads");
      setShowModal(false);
      setFormData({ name: "", status: "hot", email: "", phone: "", estimated_value: "", source: "", next_action_date: "", notes: "" });
    } catch (err: any) {
      alert(`Failed to create lead: ${String(err?.message ?? err)}`);
    }
  }

  const hotCount = leads.filter((l: any) => l.status === "hot").length;
  const warmCount = leads.filter((l: any) => l.status === "warm").length;
  const pipelineValue = leads.reduce((s: number, l: any) => s + Number(l.estimated_value || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Leads / Hot Prospects</h1>
          <p className="text-sm text-zinc-400 mt-1">Track and manage your sales pipeline</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-300 hover:bg-amber-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add Lead
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Hot Leads</div>
              <div className="text-2xl font-bold text-white">{hotCount}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Flame className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Warm Leads</div>
              <div className="text-2xl font-bold text-white">{warmCount}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Pipeline Value</div>
              <div className="text-2xl font-bold text-emerald-400">${pipelineValue.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Conversion Rate</div>
              <div className="text-2xl font-bold text-white">0%</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Leads Placeholder */}
      <div className="card p-8 text-center">
        <Flame className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Lead Management Coming Soon</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Track hot prospects, manage your sales pipeline, and convert leads into clients.
        </p>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-300 hover:bg-amber-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add Your First Lead
        </button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Lead">
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
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              placeholder="Acme Corp - Marketing Lead"
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
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              >
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>
            <div>
              <label htmlFor="estimated_value" className="block text-sm font-medium text-zinc-300 mb-2">
                Est. Value
              </label>
              <input
                id="estimated_value"
                type="number"
                min="0"
                step="0.01"
                value={formData.estimated_value}
                onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                placeholder="5000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                placeholder="lead@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-2">
                Phone
              </label>
              <input
                id="phone"
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-zinc-300 mb-2">
                Source
              </label>
              <input
                id="source"
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                placeholder="Referral, Website, Event..."
              />
            </div>
            <div>
              <label htmlFor="next_action_date" className="block text-sm font-medium text-zinc-300 mb-2">
                Next Action
              </label>
              <input
                id="next_action_date"
                type="date"
                value={formData.next_action_date}
                onChange={(e) => setFormData({ ...formData, next_action_date: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              />
            </div>
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
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              placeholder="Background, needs, timeline..."
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
              className="flex-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-300 hover:bg-amber-500/15 transition-colors font-medium"
            >
              Create Lead
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

