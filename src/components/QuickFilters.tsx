"use client";

type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

export function QuickFilters({
  filters,
  activeFilter,
  onFilterChange,
}: {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-zinc-300"
              }
            `}
          >
            {filter.label}
            {filter.count !== undefined && (
              <span className={`ml-2 ${isActive ? "text-purple-400" : "text-zinc-500"}`}>
                ({filter.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

