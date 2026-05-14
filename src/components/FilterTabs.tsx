"use client";

import { InactivityFilter } from "@/types/user";

interface FilterTabsProps {
  activeFilter: InactivityFilter;
  onFilterChange: (filter: InactivityFilter) => void;
  counts: Record<InactivityFilter, number>;
}

const filters: { value: InactivityFilter; label: string; emoji: string }[] = [
  { value: 30, label: "30 hari", emoji: "📅" },
  { value: 60, label: "60 hari", emoji: "📆" },
  { value: 90, label: "90 hari", emoji: "📋" },
  { value: 365, label: "1 tahun", emoji: "🗓️" },
];

export default function FilterTabs({
  activeFilter,
  onFilterChange,
  counts,
}: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeFilter === filter.value
              ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
              : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600"
          }`}
        >
          <span>{filter.emoji}</span>
          <span>{filter.label}</span>
          <span
            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
              activeFilter === filter.value
                ? "bg-white text-purple-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {counts[filter.value] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}
