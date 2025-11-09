"use client";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Money } from "@/components/Money";
import { Modal } from "@/components/Modal";
import { FileText, Send, CheckCircle2, XCircle, Clock, Trash2, DollarSign, Edit } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProposalsPage() {
  const { data } = useSWR("/api/proposals", fetcher, { keepPreviousData: true });
  const { data: clients } = useSWR("/api/clients", fetcher, { keepPreviousData: true });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    client_id: "",
    title: "",
    number: "",
    status: "draft",
    issue_date: "",
    expiry_date: "",
    subtotal: "",
    tax: "",
    notes: "",
  });

  function openCreateModal() {
    setEditingId(null);
    setFormData({ client_id: "", title: "", number: "", status: "draft", issue_date: "", expiry_date: "", subtotal: "", tax: "", notes: "" });
    setShowModal(true);
  }

  function openEditModal(proposal: any) {
    setEditingId(proposal.id);
    setFormData({
      client_id: proposal.client_id || "",
      title: proposal.title || "",
      number: proposal.number || "",
      status: proposal.status || "draft",
      issue_date: proposal.issue_date || "",
      expiry_date: proposal.expiry_date || "",
      subtotal: String(proposal.subtotal || ""),
      tax: String(proposal.tax || ""),
      notes: proposal.notes || "",
    });
    setShowModal(true);
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const subtotal = Number(formData.subtotal) || 0;
    const tax = Number(formData.tax) || 0;
    const total = subtotal + tax;
    try {
      const payload = {
        client_id: formData.client_id || null,
        title: formData.title,
        number: formData.number,
        status: formData.status,
        issue_date: formData.issue_date || null,
        expiry_date: formData.expiry_date || null,
        subtotal,
        tax,
        total,
        notes: formData.notes,
      };

      const url = editingId ? `/api/proposals?id=${editingId}` : "/api/proposals";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to ${editingId ? "update" : "create"} proposal: ${err?.error ?? res.statusText}`);
        return;
      }
      (await import("swr")).mutate("/api/proposals");
      setShowModal(false);
      setEditingId(null);
      setFormData({ client_id: "", title: "", number: "", status: "draft", issue_date: "", expiry_date: "", subtotal: "", tax: "", notes: "" });
    } catch (err: any) {
      alert(`Failed to ${editingId ? "update" : "create"} proposal: ${String(err?.message ?? err)}`);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this proposal?")) return;
    try {
      const res = await fetch(`/api/proposals?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to delete proposal: ${err?.error ?? res.statusText}`);
        return;
      }
      (await import("swr")).mutate("/api/proposals");
    } catch (err: any) {
      alert(`Failed to delete proposal: ${String(err?.message ?? err)}`);
    }
  }

  const proposals = data ?? [];
  const stats = {
    total: proposals.length,
    sent: proposals.filter((p: any) => p.status === "sent").length,
    accepted: proposals.filter((p: any) => p.status === "accepted").length,
    value: proposals.filter((p: any) => p.status === "sent" || p.status === "accepted").reduce((sum: number, p: any) => sum + (p.total || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quotes & Proposals</h1>
          <p className="text-sm text-zinc-400 mt-1">Create and track client proposals</p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm text-blue-300 hover:bg-blue-500/15 transition-colors font-medium"
        >
          <FileText className="h-4 w-4" />
          New Proposal
        </button>
      </div>

      {/* Create/Edit Proposal Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingId(null); }} title={editingId ? "Edit Proposal" : "Create New Proposal"}>
        <form onSubmit={onCreate} className="space-y-4">
          <div>
            <label htmlFor="client_id" className="block text-sm font-medium text-zinc-300 mb-2">
              Client
            </label>
            <select
              id="client_id"
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
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
            <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Video Production Package"
            />
          </div>

          <div>
            <label htmlFor="number" className="block text-sm font-medium text-zinc-300 mb-2">
              Proposal Number
            </label>
            <input
              type="text"
              id="number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
              placeholder="PROP-2025-001"
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
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="issue_date" className="block text-sm font-medium text-zinc-300 mb-2">
                Issue Date
              </label>
              <input
                type="date"
                id="issue_date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            <div>
              <label htmlFor="expiry_date" className="block text-sm font-medium text-zinc-300 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiry_date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="subtotal" className="block text-sm font-medium text-zinc-300 mb-2">
                Subtotal
              </label>
              <input
                type="number"
                id="subtotal"
                value={formData.subtotal}
                onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="tax" className="block text-sm font-medium text-zinc-300 mb-2">
                Tax
              </label>
              <input
                type="number"
                id="tax"
                value={formData.tax}
                onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-zinc-300">Total</label>
              <span className="text-lg font-semibold text-white">
                ${((Number(formData.subtotal) || 0) + (Number(formData.tax) || 0)).toFixed(2)}
              </span>
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
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              placeholder="Additional details..."
            />
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
              className="flex-1 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm text-blue-300 hover:bg-blue-500/15 transition-colors font-medium"
            >
              {editingId ? "Update Proposal" : "Create Proposal"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Total Proposals</div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Sent</div>
              <div className="text-2xl font-bold text-amber-400">{stats.sent}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Send className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Accepted</div>
              <div className="text-2xl font-bold text-emerald-400">{stats.accepted}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Pipeline Value</div>
              <div className="text-2xl font-bold text-white">
                <Money amount={stats.value} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Proposals table */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">All Proposals</h2>
        <DataTable
          columns={[
            { 
              key: "number", 
              header: "Proposal #", 
              format: (v) => <span className="font-mono font-medium">{v || "—"}</span> 
            },
            { 
              key: "title", 
              header: "Title",
              format: (v) => <span className="font-medium">{v}</span>
            },
            { key: "status", header: "Status", format: (v) => <StatusBadge status={String(v)} /> },
            { 
              key: "issue_date", 
              header: "Issued",
              format: (v) => v ? new Date(v).toLocaleDateString() : "—"
            },
            { 
              key: "expiry_date", 
              header: "Expires",
              format: (v) => v ? new Date(v).toLocaleDateString() : "—"
            },
            { 
              key: "total", 
              header: "Value", 
              format: (v) => <span className="font-semibold"><Money amount={Number(v)} /></span>
            },
          ]}
          rows={proposals as any}
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

