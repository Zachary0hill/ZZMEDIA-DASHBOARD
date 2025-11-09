"use client";
import { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";

const STAGES = ["Pre-Production", "Shoot", "Edit", "Review", "Publish"] as const;
const seed = Array.from({ length: 10 }).map((_, i) => ({ id: `t${i + 1}`, title: `Job ${i + 1}`, stage: STAGES[i % STAGES.length] }));

export default function PipelinePage() {
  const [items, setItems] = useState(seed);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Production Pipeline</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {STAGES.map((stage) => (
          <div key={stage} className="card p-3">
            <div className="mb-2 text-sm font-medium text-white">{stage}</div>
            <div className="space-y-2 min-h-40">
              {items.filter((x) => x.stage === stage).map((x) => (
                <div key={x.id} className="rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-zinc-200">
                  {x.title}
                </div>
              ))}
              {items.filter((x) => x.stage === stage).length === 0 && (
                <div className="text-xs text-zinc-500">No jobs</div>
              )}
            </div>
            <div className="mt-3 text-xs text-zinc-500">WIP limit: 3</div>
          </div>
        ))}
      </div>
      <div className="text-xs text-zinc-500 flex items-center gap-2">
        <StatusBadge status="active" /> Drag-and-drop placeholder (non-functional)
      </div>
    </div>
  );
}


