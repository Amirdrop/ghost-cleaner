"use client";

import { InactivityFilter } from "@/types/user";

interface FilterTabsProps {
  activeFilter: InactivityFilter;
  onFilterChange: (filter: InactivityFilter) => void;
  counts: Record<InactivityFilter, number>;
}

const filters: { value: InactivityFilter; label: string }[] = [
  { value: 30, label: "30d" },
  { value: 60, label: "60d" },
  { value: 90, label: "90d" },
  { value: 365, label: "1y" },
];

export default function FilterTabs({
  activeFilter,
  onFilterChange,
  counts,
}: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-zinc-900/50 border border-zinc-800/50 rounded-xl w-fit">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeFilter === filter.value
              ? "bg-purple-600 text-white shadow-sm"
              : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
          }`}
        >
          <span>{filter.label}</span>
          <span
            className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md text-[10px] font-bold ${
              activeFilter === filter.value
                ? "bg-white/20 text-white"
                : "bg-zinc-800 text-zinc-500"
            }`}
          >
            {counts[filter.value] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}
