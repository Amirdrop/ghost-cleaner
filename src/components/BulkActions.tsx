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
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onUnfollow,
  isUnfollowing,
}: BulkActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
      <div className="flex items-center gap-3">
        <button
          onClick={onSelectAll}
          className="px-3 py-1.5 text-xs font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors"
        >
          Select All
        </button>
        <button
          onClick={onDeselectAll}
          className="px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-800/50 border border-zinc-700/30 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          Deselect
        </button>
        <span className="text-xs text-zinc-500">
          {selectedCount > 0 ? (
            <>
              <span className="text-white font-medium">{selectedCount}</span>{" "}
              of {totalCount} selected
            </>
          ) : (
            `${totalCount} accounts`
          )}
        </span>
      </div>

      <button
        onClick={onUnfollow}
        disabled={selectedCount === 0 || isUnfollowing}
        className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
          selectedCount > 0 && !isUnfollowing
            ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
            : "bg-zinc-800/30 text-zinc-600 border border-zinc-800/30 cursor-not-allowed"
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
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Unfollow ({selectedCount})
          </>
        )}
      </button>
    </div>
  );
}
