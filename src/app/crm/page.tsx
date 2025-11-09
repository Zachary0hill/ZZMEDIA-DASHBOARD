"use client";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Modal } from "@/components/Modal";
import { ClientDetailsModal } from "@/components/ClientDetailsModal";
import { QuickFilters } from "@/components/QuickFilters";
import { ExportButton } from "@/components/ExportButton";
import { Building2, Mail, Phone, Trash2, UserPlus, Eye } from "lucide-react";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Client = {
  id: string;
  name: string;
  status: string;
  industry: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  notes?: string | null;
  website?: string | null;
  address?: string | null;
  contact_person?: string | null;
};

export default function CRMPage() {
  const { data, mutate } = useSWR("/api/clients", fetcher, { keepPreviousData: true });
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [formData, setFormData] = useState({
    name: "",
    status: "prospect",
    industry: "",
    email: "",
    phone: "",
  });

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          status: formData.status,
          industry: formData.industry || null,
          email: formData.email || null,
          phone: formData.phone || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to create client: ${err?.error ?? res.statusText}`);
        return;
      }
      mutate();
      setShowModal(false);
      setFormData({ name: "", status: "prospect", industry: "", email: "", phone: "" });
    } catch (err: any) {
      alert(`Failed to create client: ${String(err?.message ?? err)}`);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this client?")) return;
    try {
      const res = await fetch(`/api/clients?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to delete client: ${err?.error ?? res.statusText}`);
        return;
      }
      mutate();
    } catch (err: any) {
      alert(`Failed to delete client: ${String(err?.message ?? err)}`);
    }
  }

  const clients: Client[] = data ?? [];
  
  // Filter clients
  const filteredClients = clients.filter((c) => {
    if (activeFilter === "all") return true;
    return c.status === activeFilter;
  });

  const statusGroups = {
    active: clients.filter((c) => c.status === "active"),
    prospect: clients.filter((c) => c.status === "prospect"),
    paused: clients.filter((c) => c.status === "paused"),
  };

  const filterOptions = [
    { value: "all", label: "All Clients", count: clients.length },
    { value: "active", label: "Active", count: statusGroups.active.length },
    { value: "prospect", label: "Prospects", count: statusGroups.prospect.length },
    { value: "paused", label: "Paused", count: statusGroups.paused.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">CRM</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your client relationships</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton data={filteredClients} filename="clients" label="Export" />
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                viewMode === "cards"
                  ? "bg-purple-500/20 text-purple-300"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-purple-500/20 text-purple-300"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              Table
            </button>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-500/15 transition-colors font-medium"
          >
            <UserPlus className="h-4 w-4" />
            New Client
          </button>
        </div>
      </div>

      {/* Create Client Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Client">
        <form onSubmit={onCreate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
              Client Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="Enter client name"
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
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-zinc-300 mb-2">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="e.g. SaaS, Fintech"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="client@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="555-1234"
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
              Add Client
            </button>
          </div>
        </form>
      </Modal>

      {/* Client Details Modal */}
      <ClientDetailsModal
        client={selectedClient}
        isOpen={!!selectedClient}
        onClose={() => setSelectedClient(null)}
        onUpdate={() => mutate()}
      />

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(statusGroups).map(([status, items]: [string, any[]]) => (
          <div key={status} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">{status}</div>
                <div className="text-3xl font-bold text-white">{items.length}</div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                status === "active" ? "bg-emerald-500/15" :
                status === "prospect" ? "bg-fuchsia-500/15" :
                "bg-zinc-500/15"
              }`}>
                <Building2 className={`h-6 w-6 ${
                  status === "active" ? "text-emerald-400" :
                  status === "prospect" ? "text-fuchsia-400" :
                  "text-zinc-400"
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <QuickFilters
        filters={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Cards View */}
      {viewMode === "cards" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {activeFilter === "all" ? "All Clients" : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Clients`}
            </h2>
            <div className="text-sm text-zinc-400">
              {filteredClients.length} {filteredClients.length === 1 ? "client" : "clients"}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <div key={client.id} className="card p-5 hover:bg-white/5 transition-all group relative">
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => setSelectedClient(client)}
                    className="text-purple-400 hover:text-purple-300 transition-all"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(client.id)}
                    className="text-rose-400 hover:text-rose-300 transition-all"
                    title="Delete client"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div 
                  className="flex items-start gap-3 mb-4 cursor-pointer"
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-zinc-100 truncate">{client.name}</h3>
                    {client.industry && (
                      <p className="text-xs text-zinc-500 mt-0.5">{client.industry}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {client.contact_person && (
                    <div className="text-xs text-zinc-400">
                      <span className="text-zinc-500">Contact:</span> {client.contact_person}
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                  <StatusBadge status={client.status} />
                </div>
              </div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No clients found</p>
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Detailed View</h2>
          <DataTable
            columns={[
              { 
                key: "name", 
                header: "Client", 
                format: (v) => <span className="font-medium">{v}</span> 
              },
              { key: "industry", header: "Industry" },
              { 
                key: "status", 
                header: "Status", 
                format: (v) => <StatusBadge status={String(v)} /> 
              },
              { key: "email", header: "Email" },
              { key: "phone", header: "Phone" },
              {
                key: "created_at",
                header: "Created",
                format: (v) => {
                  const date = new Date(v);
                  return date.toLocaleDateString();
                },
              },
            ]}
            rows={filteredClients as any}
            actionsHeader="Actions"
            renderActions={(row: any) => (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedClient(row)} 
                  className="text-xs text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  View
                </button>
                <button 
                  onClick={() => onDelete(row.id)} 
                  className="text-xs text-rose-400 hover:text-rose-300 inline-flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}
