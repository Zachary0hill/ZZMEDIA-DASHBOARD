"use client";
import * as React from "react";

type Column<T> = {
  key: keyof T;
  header: string;
  format?: (v: any, row: T) => React.ReactNode;
};

export function DataTable<T extends { id: string }>({
	columns,
	rows,
	renderActions,
	actionsHeader = "Actions",
}: {
	columns: Column<T>[];
	rows: T[];
	renderActions?: (row: T) => React.ReactNode;
	actionsHeader?: string;
}) {
  const [q, setQ] = React.useState("");
  const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
  const [asc, setAsc] = React.useState(true);

  const filtered = React.useMemo(() => {
    const f = rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
    if (!sortKey) return f;
    return [...f].sort((a, b) => {
      const av = a[sortKey] as any;
      const bv = b[sortKey] as any;
      if (av < bv) return asc ? -1 : 1;
      if (av > bv) return asc ? 1 : -1;
      return 0;
    });
  }, [rows, q, sortKey, asc]);

	return (
		<div className="card overflow-hidden">
			<div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
				<div className="flex items-center gap-3">
					<input
						value={q}
						onChange={(e) => setQ(e.target.value)}
						placeholder="Search..."
						className="w-64 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
					/>
					<div className="text-xs text-zinc-400">
						{filtered.length} {filtered.length === 1 ? "item" : "items"}
					</div>
				</div>
			</div>
			<div className="overflow-auto">
				<table className="w-full text-sm">
					<thead className="bg-white/5 border-b border-white/5">
						<tr className="text-left text-zinc-300">
							{columns.map((c) => (
								<th key={String(c.key)} className="px-5 py-3.5 font-semibold">
									<button
										className="hover:text-white transition-colors inline-flex items-center gap-1"
										onClick={() => {
											if (sortKey === c.key) setAsc(!asc);
											else {
												setSortKey(c.key);
												setAsc(true);
											}
										}}
									>
										{c.header}
										{sortKey === c.key && (
											<span className="text-purple-400">{asc ? "↑" : "↓"}</span>
										)}
									</button>
								</th>
							))}
							{renderActions && <th className="px-5 py-3.5 font-semibold">{actionsHeader}</th>}
						</tr>
					</thead>
					<tbody>
						{filtered.map((row) => (
							<tr key={row.id} className="border-t border-white/5 text-zinc-200 hover:bg-white/5 transition-colors">
								{columns.map((c) => (
									<td key={String(c.key)} className="px-5 py-4">
										{c.format ? c.format(row[c.key], row) : (row[c.key] as any)}
									</td>
								))}
								{renderActions && <td className="px-5 py-4">{renderActions(row)}</td>}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}


