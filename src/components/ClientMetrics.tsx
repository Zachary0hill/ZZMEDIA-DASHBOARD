"use client";
import { DollarSign, FileText, TrendingUp, Clock } from "lucide-react";

type Metrics = {
  totalRevenue: number;
  activeProjects: number;
  avgProjectValue: number;
  clientSince: string;
};

export function ClientMetrics({ metrics }: { metrics: Metrics }) {
  const stats = [
    {
      label: "Total Revenue",
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-400 bg-emerald-500/15",
    },
    {
      label: "Active Projects",
      value: metrics.activeProjects.toString(),
      icon: FileText,
      color: "text-purple-400 bg-purple-500/15",
    },
    {
      label: "Avg Project Value",
      value: `$${metrics.avgProjectValue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-blue-400 bg-blue-500/15",
    },
    {
      label: "Client Since",
      value: metrics.clientSince,
      icon: Clock,
      color: "text-amber-400 bg-amber-500/15",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-zinc-400 mb-1">{stat.label}</div>
              <div className="text-lg font-semibold text-white truncate">{stat.value}</div>
            </div>
            <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

