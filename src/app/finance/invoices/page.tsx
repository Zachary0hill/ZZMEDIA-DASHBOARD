"use client";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Money } from "@/components/Money";
import { Modal } from "@/components/Modal";
import { FileText, DollarSign, AlertCircle, CheckCircle2, Clock, Trash2, Edit } from "lucide-react";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function InvoicesPage() {
  const { data } = useSWR("/api/invoices", fetcher, { keepPreviousData: true });
  const { data: clients } = useSWR("/api/clients", fetcher, { keepPreviousData: true });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    client_id: "",
    number: "",
    status: "draft",
    issue_date: "",
    due_date: "",
    subtotal: "",
    tax: "",
    amount_paid: "",
  });

  function openCreateModal() {
    setEditingId(null);
    setFormData({ client_id: "", number: "", status: "draft", issue_date: "", due_date: "", subtotal: "", tax: "", amount_paid: "" });
    setShowModal(true);
  }

  function openEditModal(invoice: any) {
    setEditingId(invoice.id);
    setFormData({
      client_id: invoice.client_id || "",
      number: invoice.number || "",
      status: invoice.status || "draft",
      issue_date: invoice.issue_date || "",
      due_date: invoice.due_date || "",
      subtotal: String(invoice.subtotal || ""),
      tax: String(invoice.tax || ""),
      amount_paid: String(invoice.amount_paid || ""),
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
        number: formData.number,
        status: formData.status,
        issue_date: formData.issue_date || null,
        due_date: formData.due_date || null,
        subtotal,
        tax,
        total,
        amount_paid: Number(formData.amount_paid) || 0,
      };

      const url = editingId ? `/api/invoices?id=${editingId}` : "/api/invoices";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to ${editingId ? "update" : "create"} invoice: ${err?.error ?? res.statusText}`);
        return;
      }
      (await import("swr")).mutate("/api/invoices");
      setShowModal(false);
      setEditingId(null);
      setFormData({ client_id: "", number: "", status: "draft", issue_date: "", due_date: "", subtotal: "", tax: "", amount_paid: "" });
    } catch (err: any) {
      alert(`Failed to ${editingId ? "update" : "create"} invoice: ${String(err?.message ?? err)}`);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this invoice?")) return;
    try {
      const res = await fetch(`/api/invoices?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to delete invoice: ${err?.error ?? res.statusText}`);
        return;
      }
      (await import("swr")).mutate("/api/invoices");
    } catch (err: any) {
      alert(`Failed to delete invoice: ${String(err?.message ?? err)}`);
    }
  }

  const invoices = data ?? [];
  const stats = {
    total: invoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0),
    paid: invoices.filter((inv: any) => inv.status === "paid").reduce((sum: number, inv: any) => sum + (inv.amount_paid || 0), 0),
    outstanding: invoices.filter((inv: any) => inv.status === "sent" || inv.status === "overdue").reduce((sum: number, inv: any) => sum + ((inv.total || 0) - (inv.amount_paid || 0)), 0),
    overdue: invoices.filter((inv: any) => inv.status === "overdue").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Invoices & Payments</h1>
          <p className="text-sm text-zinc-400 mt-1">Track and manage your invoices</p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-500/15 transition-colors font-medium"
        >
          <FileText className="h-4 w-4" />
          New Invoice
        </button>
      </div>

      {/* Create/Edit Invoice Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingId(null); }} title={editingId ? "Edit Invoice" : "Create New Invoice"}>
        <form onSubmit={onCreate} className="space-y-4">
          <div>
            <label htmlFor="client_id" className="block text-sm font-medium text-zinc-300 mb-2">
              Client
            </label>
            <select
              id="client_id"
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
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
            <label htmlFor="number" className="block text-sm font-medium text-zinc-300 mb-2">
              Invoice Number *
            </label>
            <input
              type="text"
              id="number"
              required
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono"
              placeholder="INV-2025-001"
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
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
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
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>

            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-zinc-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
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
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
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
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
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
            <label htmlFor="amount_paid" className="block text-sm font-medium text-zinc-300 mb-2">
              Amount Paid
            </label>
            <input
              type="number"
              id="amount_paid"
              value={formData.amount_paid}
              onChange={(e) => setFormData({ ...formData, amount_paid: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="0"
              min="0"
              step="0.01"
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
              className="flex-1 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-500/15 transition-colors font-medium"
            >
              {editingId ? "Update Invoice" : "Create Invoice"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Total Revenue</div>
              <div className="text-2xl font-bold text-white">
                <Money amount={stats.total} />
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
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Paid</div>
              <div className="text-2xl font-bold text-emerald-400">
                <Money amount={stats.paid} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Outstanding</div>
              <div className="text-2xl font-bold text-amber-400">
                <Money amount={stats.outstanding} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Overdue</div>
              <div className="text-2xl font-bold text-rose-400">{stats.overdue}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-rose-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Invoices table */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">All Invoices</h2>
        <DataTable
          columns={[
            { 
              key: "number", 
              header: "Invoice #", 
              format: (v) => <span className="font-mono font-medium">{v}</span> 
            },
            { key: "status", header: "Status", format: (v) => <StatusBadge status={String(v)} /> },
            { 
              key: "issue_date", 
              header: "Issued",
              format: (v) => v ? new Date(v).toLocaleDateString() : "-"
            },
            { 
              key: "due_date", 
              header: "Due",
              format: (v) => v ? new Date(v).toLocaleDateString() : "-"
            },
            { 
              key: "total", 
              header: "Total", 
              format: (v) => <span className="font-semibold"><Money amount={Number(v)} /></span>
            },
            { 
              key: "amount_paid", 
              header: "Paid", 
              format: (v, row: any) => (
                <div className="flex items-center gap-2">
                  <Money amount={Number(v)} />
                  {row.status === "paid" && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </div>
              )
            },
          ]}
          rows={invoices as any}
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


