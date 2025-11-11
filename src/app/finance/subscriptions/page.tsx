"use client";
import { useState } from "react";
import { RefreshCcw, Plus, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { Modal } from "@/components/Modal";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SubscriptionsPage() {
  const { data } = useSWR("/api/subscriptions", fetcher, { keepPreviousData: true });
  const subs = data ?? [];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vendor: "",
    name: "",
    amount: "",
    billing_cycle: "monthly",
    renew_date: "",
    status: "active",
    category: "",
  });

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        vendor: formData.vendor,
        name: formData.name || null,
        amount: Number(formData.amount || 0),
        billing_cycle: formData.billing_cycle,
        renew_date: formData.renew_date || null,
        status: formData.status,
        category: formData.category || null,
      };
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to create subscription: ${err?.error ?? res.statusText}`);
        return;
      }
      (await import("swr")).mutate("/api/subscriptions");
      setShowModal(false);
      setFormData({ vendor: "", name: "", amount: "", billing_cycle: "monthly", renew_date: "", status: "active", category: "" });
    } catch (err: any) {
      alert(`Failed to create subscription: ${String(err?.message ?? err)}`);
    }
  }

  const monthlyTotal = subs
    .filter((s: any) => s.status === "active" && s.billing_cycle === "monthly")
    .reduce((sum: number, s: any) => sum + Number(s.amount || 0), 0);
  const annualSpend = subs
    .filter((s: any) => s.status === "active")
    .reduce((sum: number, s: any) => {
      const amount = Number(s.amount || 0);
      const factor = s.billing_cycle === "annual" ? 1 : s.billing_cycle === "quarterly" ? 4 : 12;
      return sum + amount * factor;
    }, 0);
  const activeCount = subs.filter((s: any) => s.status === "active").length;
  const renewingSoon = subs.filter((s: any) => s.renew_date && new Date(s.renew_date) <= new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Subscriptions</h1>
          <p className="text-sm text-zinc-400 mt-1">Track recurring SaaS tools and software expenses</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm text-blue-300 hover:bg-blue-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add Subscription
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Monthly Total</div>
              <div className="text-2xl font-bold text-white">${monthlyTotal.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <RefreshCcw className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Annual Spend</div>
              <div className="text-2xl font-bold text-white">${annualSpend.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Active Subs</div>
              <div className="text-2xl font-bold text-white">{activeCount}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Renewing Soon</div>
              <div className="text-2xl font-bold text-white">{renewingSoon}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div className="card p-8 text-center">
        <RefreshCcw className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Subscription Tracking Coming Soon</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Automatically track all your SaaS tools, software subscriptions, and recurring expenses.
        </p>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm text-blue-300 hover:bg-blue-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add Your First Subscription
        </button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Subscription">
        <form onSubmit={onCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="vendor" className="block text-sm font-medium text-zinc-300 mb-2">
                Vendor *
              </label>
              <input
                id="vendor"
                required
                type="text"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Notion, Figma, Adobe..."
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                Product/Plan
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Pro, Team..."
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-zinc-300 mb-2">
                Amount *
              </label>
              <input
                id="amount"
                required
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="12.99"
              />
            </div>
            <div>
              <label htmlFor="billing_cycle" className="block text-sm font-medium text-zinc-300 mb-2">
                Billing Cycle
              </label>
              <select
                id="billing_cycle"
                value={formData.billing_cycle}
                onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            <div>
              <label htmlFor="renew_date" className="block text-sm font-medium text-zinc-300 mb-2">
                Renew Date
              </label>
              <input
                id="renew_date"
                type="date"
                value={formData.renew_date}
                onChange={(e) => setFormData({ ...formData, renew_date: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
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
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-2">
                Category
              </label>
              <input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Design, Dev, Ops..."
              />
            </div>
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
              className="flex-1 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm text-blue-300 hover:bg-blue-500/15 transition-colors font-medium"
            >
              Create Subscription
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

