"use client";
import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { StatusBadge } from "./StatusBadge";
import { Building2, Mail, Phone, Calendar, Edit2, Save, X } from "lucide-react";
import { format } from "date-fns";

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

export function ClientDetailsModal({
  client,
  isOpen,
  onClose,
  onUpdate,
}: {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({});

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  if (!client) return null;

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    // Guard against rare race where props become null after initial render.
    if (!client) return;
    try {
      const res = await fetch(`/api/clients?id=${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to update client: ${err?.error ?? res.statusText}`);
        return;
      }
      setIsEditing(false);
      onUpdate();
    } catch (err: any) {
      alert(`Failed to update client: ${String(err?.message ?? err)}`);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsEditing(false);
        onClose();
      }}
      title={isEditing ? "Edit Client" : "Client Details"}
    >
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-xl font-semibold text-white bg-white/5 border border-white/10 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              ) : (
                <h3 className="text-xl font-semibold text-white">{client.name}</h3>
              )}
              <p className="text-sm text-zinc-400 mt-1">
                Added {format(new Date(client.created_at), "MMM dd, yyyy")}
              </p>
            </div>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Status:</span>
          {isEditing ? (
            <select
              value={formData.status || "prospect"}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          ) : (
            <StatusBadge status={client.status} />
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">
            Contact Information
          </h4>
          
          <div className="space-y-2">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Industry</label>
                  <input
                    type="text"
                    value={formData.industry || ""}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g. SaaS, Fintech"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contact_person || ""}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    placeholder="Primary contact name"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@example.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="555-1234"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website || ""}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St, City, State"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </>
            ) : (
              <>
                {client.industry && (
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="text-zinc-500">Industry:</span>
                    <span>{client.industry}</span>
                  </div>
                )}
                {client.contact_person && (
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="text-zinc-500">Contact:</span>
                    <span>{client.contact_person}</span>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                    <a href={`mailto:${client.email}`} className="text-purple-400 hover:text-purple-300 transition-colors">
                      {client.email}
                    </a>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                    <a href={`tel:${client.phone}`} className="text-zinc-300 hover:text-white transition-colors">
                      {client.phone}
                    </a>
                  </div>
                )}
                {client.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-500">Website:</span>
                    <a 
                      href={client.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {client.website}
                    </a>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-zinc-500">Address:</span>
                    <span>{client.address}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">Notes</h4>
          {isEditing ? (
            <textarea
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Add notes about this client..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
            />
          ) : (
            <p className="text-sm text-zinc-400">
              {client.notes || "No notes available"}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData(client);
              }}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 transition-colors font-medium inline-flex items-center justify-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-500/15 transition-colors font-medium inline-flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
}

