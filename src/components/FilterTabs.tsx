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

export default function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-[#0d0d12] border border-[#232330] rounded-xl w-fit">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeFilter === filter.value
              ? "bg-[#8A63D2] text-white shadow-sm"
              : "text-[#5C5C72] hover:text-white hover:bg-[#17171f]"
          }`}
        >
          <span>{filter.label}</span>
          <span
            className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md text-[10px] font-bold ${
              activeFilter === filter.value
                ? "bg-white/20 text-white"
                : "bg-[#17171f] text-[#5C5C72]"
            }`}
          >
            {counts[filter.value] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}
