"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Bot, Play, Clock, MoreVertical } from "lucide-react";
import { workflowTemplates } from "@/lib/fixtures/workflowTemplates";

type Assistant = {
  id: string;
  name: string;
  description?: string;
  status: "active" | "disabled" | "draft";
  runs: number;
  updatedAt: string;
};

const LS_KEY = "zz.assistants";

export default function AutomationsPage() {
  const router = useRouter();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"assistants" | "templates">("assistants");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setAssistants(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(assistants));
    } catch {}
  }, [assistants]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return assistants;
    return assistants.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.description || "").toLowerCase().includes(q)
    );
  }, [assistants, query]);

  async function createAssistant(name?: string, description?: string, templateId?: string) {
    const now = new Date().toISOString();
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Untitled Assistant",
          description: description || "Click to configure this assistant.",
          templateId: templateId || null,
        }),
      });
      if (res.ok) {
        const wf = await res.json();
        // Optimistically add to local list
        setAssistants((prev) => [
          {
            id: wf.id,
            name: wf.name,
            description: wf.description,
            status: "draft",
            runs: 0,
            updatedAt: now,
          },
          ...prev,
        ]);
        router.push(`/workflows/${wf.id}`);
        return;
      }
    } catch {}
    // Fallback local-only create if API fails
    const id = crypto.randomUUID();
    setAssistants((prev) => [
      {
        id,
        name: name || "Untitled Assistant",
        description: description || "Click to configure this assistant.",
        status: "draft",
        runs: 0,
        updatedAt: now,
      },
      ...prev,
    ]);
    router.push(`/workflows/${id}`);
  }

  function useTemplate(templateId: string) {
    const tmpl = workflowTemplates.find((t) => t.id === templateId);
    if (!tmpl) return;
    createAssistant(tmpl.name, tmpl.description, templateId);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
            AI Assistants / Agents
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Create, manage, and run AI-powered agents and workflow automations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => createAssistant()}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-400/15 transition-all font-medium"
          >
            <Plus className="h-4 w-4" />
            New Assistant
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="inline-flex rounded-xl border border-white/10 bg-white/5 overflow-hidden w-full sm:w-auto">
          <button
            onClick={() => setTab("assistants")}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === "assistants"
                ? "text-white bg-white/10"
                : "text-zinc-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Assistants
          </button>
          <button
            onClick={() => setTab("templates")}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === "templates"
                ? "text-white bg-white/10"
                : "text-zinc-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Templates
          </button>
        </div>

        <div className="flex-1" />

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === "assistants" ? "Search assistants..." : "Search templates..."}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-white/10 bg-white/5 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </div>
      </div>

      {/* Content */}
      {tab === "assistants" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Quick create card */}
          <button
            onClick={() => createAssistant()}
            className="glass-card p-5 group border-white/20 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all text-left"
          >
            <div className="flex items-center justify-center h-28 rounded-lg bg-white/5 border border-white/10 group-hover:border-cyan-400/20">
              <Plus className="h-8 w-8 text-zinc-400 group-hover:text-cyan-300" />
            </div>
            <div className="mt-3">
              <div className="text-sm font-bold text-white">New Assistant</div>
              <div className="text-xs text-zinc-500">Create a blank assistant</div>
            </div>
          </button>

          {filtered.map((a) => (
            <div
              key={a.id}
              className="glass-card p-4 border-white/20 hover:border-white/30 hover:bg-white/5 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{a.name}</div>
                    <div className="text-xs text-zinc-500 line-clamp-1">
                      {a.description}
                    </div>
                  </div>
                </div>
                <button className="p-1.5 rounded-md hover:bg-white/5 text-zinc-400 hover:text-zinc-200">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Play className="h-3.5 w-3.5 text-emerald-300" />
                    {a.runs} runs
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    {new Date(a.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => router.push(`/workflows/${a.id}`)}
                  className="text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  Open
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && assistants.length > 0 && (
            <div className="col-span-full glass-card p-6 text-center text-sm text-zinc-400 border-white/20">
              No assistants match your search.
            </div>
          )}
          {assistants.length === 0 && (
            <div className="col-span-full glass-card p-8 text-center border-white/20">
              <div className="text-zinc-300 font-semibold">
                No assistants yet
              </div>
              <div className="text-zinc-500 text-sm mt-1">
                Get started by creating a new assistant or use a template.
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => createAssistant()}
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-400/15 transition-all font-medium"
                >
                  <Plus className="h-4 w-4" />
                  New Assistant
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {workflowTemplates
            .filter((t) => {
              const q = query.trim().toLowerCase();
              if (!q) return true;
              return (
                t.name.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q)
              );
            })
            .map((t) => (
              <button
                key={t.id}
                onClick={() => useTemplate(t.id)}
                className="glass-card p-4 border-white/20 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all text-left"
              >
                <div className="h-28 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  {/* Placeholder thumbnail area */}
                  <Bot className="h-8 w-8 text-cyan-300" />
                </div>
                <div className="mt-3">
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-zinc-500 line-clamp-2">
                    {t.description}
                  </div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
