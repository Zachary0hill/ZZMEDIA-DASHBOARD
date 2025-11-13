"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Play, Bug, Share2, BoxSelect, ZoomIn, ZoomOut } from "lucide-react";
import dynamic from "next/dynamic";
import type { Graph } from "@/lib/workflows/types";

function Fit() {
  // lucide does not have FitIcon; fallback to ZoomOut as placeholder
  return <ZoomOut className="h-4 w-4" />;
}

const FlowCanvas = dynamic(() => import("./FlowCanvas"), { ssr: false });

export default function WorkflowBuilderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const workflowId = useMemo(() => String(params?.id || ""), [params]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("Assistant");
  const [description, setDescription] = useState<string>("");
  const [version, setVersion] = useState<number | null>(null);
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = useMemo(
    () => graph.nodes.find((n) => n.id === selectedNodeId) || null,
    [graph.nodes, selectedNodeId]
  );
  const [runMessage, setRunMessage] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/workflows/${workflowId}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const json = await res.json();
        if (!isMounted) return;
        setName(json.workflow?.name ?? "Assistant");
        setDescription(json.workflow?.description ?? "");
        setVersion(json.workflow?.version ?? null);
        setGraph(json.version?.graph ?? { nodes: [], edges: [] });
        setError(null);
      } catch (e: any) {
        if (!isMounted) return;
        setError(String(e?.message ?? e));
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (workflowId) load();
    return () => {
      isMounted = false;
    };
  }, [workflowId]);

  async function saveVersion() {
    try {
      setSaving(true);
      const res = await fetch(`/api/workflows/${workflowId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ graph }),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      const j = await res.json();
      setVersion(j.version ?? version);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setSaving(false);
    }
  }
  async function runOnce() {
    try {
      setRunMessage("Starting run…");
      const res = await fetch(`/api/workflows/${workflowId}/run`, { method: "POST" });
      if (!res.ok) throw new Error(`Run failed: ${res.status}`);
      const j = await res.json();
      setRunMessage(`Run ${j.runId} ${j.status} in ${j.durationMs}ms`);
    } catch (e: any) {
      setRunMessage(String(e?.message ?? e));
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Topbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/automations"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div>
            <div className="text-sm font-black text-white">{name || "Assistant Builder"}</div>
            <div className="text-xs text-zinc-500">
              {version ? `v${version}` : "Draft"} • ID: {workflowId.slice(0, 8)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={saving}
            onClick={saveVersion}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10 transition-all disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={runOnce} className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300 hover:bg-emerald-400/15 transition-all">
            <Play className="h-4 w-4" />
            Run
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-300 hover:bg-amber-400/15 transition-all">
            <Bug className="h-4 w-4" />
            Debug
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10 transition-all">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      {/* Builder Shell */}
      <div className="grid grid-rows-[1fr_200px] grid-cols-1 gap-4 min-h-[70vh]">
        {/* Canvas row */}
        <div className="grid grid-cols-[260px_1fr_320px] gap-4">
          {/* Left Library */}
          <aside className="glass-card p-4 border-white/20">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
              Library
            </div>
            <div className="space-y-1 text-sm text-zinc-400">
              <div className="font-semibold text-zinc-300">Triggers</div>
              <div>Webhook, Cron, Manual</div>
              <div className="font-semibold text-zinc-300 mt-3">Logic</div>
              <div>If/Branch, Delay, Loop</div>
              <div className="font-semibold text-zinc-300 mt-3">AI</div>
              <div>OpenAI, Embeddings, Moderation</div>
              <div className="font-semibold text-zinc-300 mt-3">HTTP & Data</div>
              <div>HTTP Request, Map/Transform, Logger</div>
            </div>
          </aside>

          {/* Canvas */}
          <main className="glass-card border-white/20 relative overflow-hidden">
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <button className="px-2 py-1.5 text-xs rounded-md bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10">
                <ZoomOut className="h-4 w-4" />
              </button>
              <button className="px-2 py-1.5 text-xs rounded-md bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button className="px-2 py-1.5 text-xs rounded-md bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10">
                <Fit />
              </button>
              <button className="px-2 py-1.5 text-xs rounded-md bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10">
                <BoxSelect className="h-4 w-4" />
              </button>
            </div>
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-xs text-zinc-500">Loading…</div>
              </div>
            ) : (
              <FlowCanvas
                graph={graph}
                onChange={setGraph}
                onSelectNode={setSelectedNodeId}
              />
            )}
          </main>

          {/* Right Inspector */}
          <aside className="glass-card p-4 border-white/20">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
              Inspector
            </div>
            {error && <div className="text-xs text-rose-300 mb-2">{error}</div>}
            {!selectedNode && (
              <div className="text-sm text-zinc-400">Select a node to configure it.</div>
            )}
            {selectedNode && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-zinc-400">Label</label>
                  <input
                    className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200"
                    value={selectedNode.label}
                    onChange={(e) => {
                      const label = e.target.value;
                      setGraph((g) => ({
                        ...g,
                        nodes: g.nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, label } : n
                        ),
                      }));
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400">Type</label>
                  <input
                    className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200"
                    value={selectedNode.type}
                    onChange={(e) => {
                      const type = e.target.value;
                      setGraph((g) => ({
                        ...g,
                        nodes: g.nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, type } : n
                        ),
                      }));
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400">Config (JSON)</label>
                  <textarea
                    rows={6}
                    className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 font-mono"
                    value={JSON.stringify(selectedNode.config ?? {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const cfg = JSON.parse(e.target.value || "{}");
                        setGraph((g) => ({
                          ...g,
                          nodes: g.nodes.map((n) =>
                            n.id === selectedNode.id ? { ...n, config: cfg } : n
                          ),
                        }));
                        setError(null);
                      } catch (err: any) {
                        setError("Invalid JSON in config");
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Bottom Console */}
        <section className="glass-card p-4 border-white/20">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Console / Logs
          </div>
          <div className="text-sm text-zinc-500">
            Execution logs will appear here during runs.
          </div>
          {runMessage && (
            <div className="mt-2 text-xs text-zinc-400">{runMessage}</div>
          )}
        </section>
      </div>
    </div>
  );
}


