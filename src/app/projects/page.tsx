"use client";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Modal } from "@/components/Modal";
import { Clock, Users, Calendar, Trash2 } from "lucide-react";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProjectsPage() {
  const { data } = useSWR("/api/projects", fetcher, { keepPreviousData: true });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "active",
    budget_hours: "",
    hours_used: "",
    start_date: "",
    due_date: "",
  });

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          status: formData.status,
          budget_hours: Number(formData.budget_hours) || 0,
          hours_used: Number(formData.hours_used) || 0,
          start_date: formData.start_date || null,
          due_date: formData.due_date || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to create project: ${err?.error ?? res.statusText}`);
        return;
      }

      (await import("swr")).mutate("/api/projects");
      setShowModal(false);
      setFormData({ name: "", status: "active", budget_hours: "", hours_used: "", start_date: "", due_date: "" });
    } catch (err: any) {
      alert(`Failed to create project: ${String(err?.message ?? err)}`);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Failed to delete project: ${err?.error ?? res.statusText}`);
        return;
      }
      (await import("swr")).mutate("/api/projects");
    } catch (err: any) {
      alert(`Failed to delete project: ${String(err?.message ?? err)}`);
    }
  }

  const projects = data ?? [];
  const statusGroups = {
    active: projects.filter((p: any) => p.status === "active"),
    planned: projects.filter((p: any) => p.status === "planned"),
    blocked: projects.filter((p: any) => p.status === "blocked"),
    complete: projects.filter((p: any) => p.status === "complete"),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your project pipeline</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-500/15 transition-colors font-medium"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Create Project Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Project">
        <form onSubmit={onCreate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="Enter project name"
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
              <option value="active">Active</option>
              <option value="planned">Planned</option>
              <option value="blocked">Blocked</option>
              <option value="complete">Complete</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="budget_hours" className="block text-sm font-medium text-zinc-300 mb-2">
                Budget Hours
              </label>
              <input
                type="number"
                id="budget_hours"
                value={formData.budget_hours}
                onChange={(e) => setFormData({ ...formData, budget_hours: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="0"
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
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="0"
                min="0"
              />
            </div>
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
              Create Project
            </button>
          </div>
        </form>
      </Modal>

      {/* Kanban-style board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Object.entries(statusGroups).map(([status, items]: [string, any[]]) => (
          <div key={status} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  status === "active" ? "bg-emerald-500" :
                  status === "planned" ? "bg-blue-500" :
                  status === "blocked" ? "bg-amber-500" :
                  "bg-zinc-500"
                }`} />
                <h3 className="text-sm font-semibold text-zinc-200 capitalize">{status}</h3>
                <span className="text-xs text-zinc-500">({items.length})</span>
              </div>
            </div>
            <div className="space-y-2">
              {items.map((project: any) => {
                const progress = project.budget_hours > 0 
                  ? Math.min(100, Math.round((project.hours_used / project.budget_hours) * 100))
                  : 0;
                return (
                  <div key={project.id} className="card p-4 hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-zinc-100 text-sm">{project.name}</h4>
                      <button 
                        onClick={() => onDelete(project.id)}
                        className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{project.hours_used || 0}h / {project.budget_hours || 0}h</span>
                      </div>
                      
                      {project.budget_hours > 0 && (
                        <div>
                          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                            <div 
                              className={`h-1.5 rounded-full transition-all ${
                                progress >= 90 ? "bg-rose-500" :
                                progress >= 70 ? "bg-amber-500" :
                                "bg-purple-500"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-zinc-500 mt-1">{progress}% complete</div>
                        </div>
                      )}

                      {project.due_date && (
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Due {project.due_date}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Table view toggle */}
      <div className="pt-4">
        <h2 className="text-xl font-semibold text-white mb-4">All Projects</h2>
        <DataTable
          columns={[
            { key: "name", header: "Project", format: (v) => <span className="font-medium">{v}</span> },
            { key: "status", header: "Status", format: (v) => <StatusBadge status={String(v)} /> },
            { 
              key: "budget_hours", 
              header: "Progress", 
              format: (v, row: any) => {
                const progress = v > 0 ? Math.min(100, Math.round((row.hours_used / v) * 100)) : 0;
                return (
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs text-zinc-400">{progress}%</span>
                  </div>
                );
              }
            },
            { key: "hours_used", header: "Hours", format: (v, row: any) => `${v || 0}h / ${row.budget_hours || 0}h` },
            { key: "due_date", header: "Due Date" },
          ]}
          rows={projects as any}
          actionsHeader=""
          renderActions={(row: any) => (
            <button onClick={() => onDelete(row.id)} className="text-xs text-rose-400 hover:text-rose-300 inline-flex items-center gap-1">
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          )}
        />
      </div>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}


