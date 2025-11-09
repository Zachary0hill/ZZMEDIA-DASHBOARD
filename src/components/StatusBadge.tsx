export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    overdue: "bg-rose-500/15 text-rose-400 border border-rose-500/20",
    sent: "bg-sky-500/15 text-sky-400 border border-sky-500/20",
    draft: "bg-zinc-500/15 text-zinc-300 border border-zinc-500/20",
    active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    blocked: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
    prospect: "bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/20",
  };
  return <span className={`px-2 py-1 rounded-full text-xs capitalize ${map[status] ?? "bg-white/10 text-white"}`}>{status}</span>;
}


