import { cn } from "@/lib/utils";

export function KpiCard({ 
  label, 
  value, 
  delta, 
  className,
  gradient = "purple"
}: { 
  label: string; 
  value: string; 
  delta?: string; 
  className?: string;
  gradient?: "purple" | "blue" | "emerald" | "amber";
}) {
  const gradientClasses = {
    purple: "gradient-purple border-purple-400/30 shadow-lg shadow-purple-500/10",
    blue: "gradient-blue border-blue-400/30 shadow-lg shadow-blue-500/10",
    emerald: "gradient-emerald border-emerald-400/30 shadow-lg shadow-emerald-500/10",
    amber: "gradient-amber border-amber-400/30 shadow-lg shadow-amber-500/10"
  };

  return (
    <div className={cn("glass-card p-5 hover:scale-[1.02] transition-transform", gradientClasses[gradient], className)}>
      <div className="text-xs uppercase tracking-wider text-zinc-400 mb-3 font-semibold">{label}</div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-black text-white">{value}</div>
        {delta && (
          <div className="flex items-center gap-1 text-xs rounded-full px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold backdrop-blur-xl">
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}


