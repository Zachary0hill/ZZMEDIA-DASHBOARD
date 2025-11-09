"use client";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Money } from "@/components/Money";
import { Modal } from "@/components/Modal";
import { CreditCard, DollarSign, TrendingUp, Calendar, Trash2, Edit } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ExpensesPage() {
  const { data } = useSWR("/api/expenses", fetcher, { keepPreviousData: true });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    category: "software",
    description: "",
    amount: "",
    vendor: "",
    status: "paid",
  });

  function openCreateModal() {
    setEditingId(null);
    setFormData({ date: "", category: "software", description: "", amount: "", vendor: "", status: "paid" });
    setShowModal(true);
  }

  function openEditModal(expense: any) {
    setEditingId(expense.id);
    setFormData({
      date: expense.date || "",
      category: expense.category || "software",
      description: expense.description || "",
      amount: String(expense.amount || ""),
      vendor: expense.vendor || "",
      status: expense.status || "paid",
    });
    setShowModal(true);
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        date: formData.date || new Date().toISOString().slice(0, 10),
        category: formData.category,
        description: formData.description,
        amount: Number(formData.amount) || 0,
        vendor: formData.vendor,
        status: formData.status,
      };

      const url = editingId ? `/api/expenses?id=${editingId}` : "/api/expenses";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to ${editingId ? "update" : "create"} expense: ${err?.error ?? res.statusText}`);
        return;
      }
      (await import("swr")).mutate("/api/expenses");
      setShowModal(false);
      setEditingId(null);
      setFormData({ date: "", category: "software", description: "", amount: "", vendor: "", status: "paid" });
    } catch (err: any) {
      alert(`Failed to ${editingId ? "update" : "create"} expense: ${String(err?.message ?? err)}`);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this expense?")) return;
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to delete expense: ${err?.error ?? res.statusText}`);
        return;
      }
      (await import("swr")).mutate("/api/expenses");
    } catch (err: any) {
      alert(`Failed to delete expense: ${String(err?.message ?? err)}`);
    }
  }

  const expenses = data ?? [];
  
  // Calculate current month stats
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonthExpenses = expenses.filter((e: any) => (e.date || "").startsWith(thisMonth));
  
  const stats = {
    total: expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0),
    thisMonth: thisMonthExpenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0),
    count: expenses.length,
    avgPerMonth: expenses.length > 0 ? Math.round(expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0) / 12) : 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Expenses</h1>
          <p className="text-sm text-zinc-400 mt-1">Track business expenses and costs</p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="inline-flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300 hover:bg-rose-500/15 transition-colors font-medium"
        >
          <CreditCard className="h-4 w-4" />
          Add Expense
        </button>
      </div>

      {/* Create/Edit Expense Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingId(null); }} title={editingId ? "Edit Expense" : "Add New Expense"}>
        <form onSubmit={onCreate} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-zinc-300 mb-2">
              Date *
            </label>
            <input
              type="date"
              id="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
            >
              <option value="software">Software</option>
              <option value="equipment">Equipment</option>
              <option value="marketing">Marketing</option>
              <option value="contractor">Contractor</option>
              <option value="travel">Travel</option>
              <option value="office">Office</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="vendor" className="block text-sm font-medium text-zinc-300 mb-2">
              Vendor
            </label>
            <input
              type="text"
              id="vendor"
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
              placeholder="Adobe, Amazon, etc."
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">
              Description *
            </label>
            <input
              type="text"
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
              placeholder="Monthly subscription"
            />
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
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
              placeholder="0"
              min="0"
              step="0.01"
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
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="reimbursed">Reimbursed</option>
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
              className="flex-1 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300 hover:bg-rose-500/15 transition-colors font-medium"
            >
              {editingId ? "Update Expense" : "Add Expense"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">This Month</div>
              <div className="text-2xl font-bold text-rose-400">
                <Money amount={stats.thisMonth} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-rose-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Total YTD</div>
              <div className="text-2xl font-bold text-white">
                <Money amount={stats.total} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Avg/Month</div>
              <div className="text-2xl font-bold text-white">
                <Money amount={stats.avgPerMonth} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Total Expenses</div>
              <div className="text-2xl font-bold text-white">{stats.count}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Expenses table */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">All Expenses</h2>
        <DataTable
          columns={[
            { 
              key: "date", 
              header: "Date",
              format: (v) => v ? new Date(v).toLocaleDateString() : "—"
            },
            { 
              key: "category", 
              header: "Category",
              format: (v) => <span className="capitalize">{v}</span>
            },
            { 
              key: "vendor", 
              header: "Vendor",
              format: (v) => v || "—"
            },
            { 
              key: "description", 
              header: "Description",
              format: (v) => <span className="font-medium">{v}</span>
            },
            { 
              key: "amount", 
              header: "Amount", 
              format: (v) => <span className="font-semibold text-rose-400"><Money amount={Number(v)} /></span>
            },
            { key: "status", header: "Status", format: (v) => <StatusBadge status={String(v)} /> },
          ]}
          rows={expenses as any}
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

