"use client";

interface BulkActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onUnfollow: () => void;
  isUnfollowing: boolean;
}

export default function BulkActions({
  selectedCount, totalCount, onSelectAll, onDeselectAll, onUnfollow, isUnfollowing,
}: BulkActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-[#232330] bg-[#17171f]/40">
      <div className="flex items-center gap-3">
        <button
          onClick={onSelectAll}
          className="px-3 py-1.5 text-xs font-semibold text-[#A78BFA] bg-[#8A63D2]/10 border border-[#8A63D2]/20 rounded-lg hover:bg-[#8A63D2]/20 transition-colors"
        >
          Select All
        </button>
        <button
          onClick={onDeselectAll}
          className="px-3 py-1.5 text-xs font-semibold text-[#9393A8] bg-[#232330]/50 border border-[#232330] rounded-lg hover:bg-[#232330] transition-colors"
        >
          Deselect
        </button>
        <span className="text-xs text-[#5C5C72]">
          {selectedCount > 0 ? (
            <>
              <span className="text-white font-semibold">{selectedCount}</span> of {totalCount} selected
            </>
          ) : (
            `${totalCount} accounts`
          )}
        </span>
      </div>

      <button
        onClick={onUnfollow}
        disabled={selectedCount === 0 || isUnfollowing}
        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
          selectedCount > 0 && !isUnfollowing
            ? "bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20 hover:bg-[#F87171]/20"
            : "bg-[#17171f] text-[#5C5C72] border border-[#232330] cursor-not-allowed"
        }`}
      >
        {isUnfollowing ? (
          <>
            <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Unfollowing...
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Unfollow ({selectedCount})
          </>
        )}
      </button>
    </div>
  );
}
