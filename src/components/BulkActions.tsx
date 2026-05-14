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
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onSelectAll}
          className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          ✅ Pilih Semua
        </button>
        <button
          onClick={onDeselectAll}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ❌ Batal Pilih
        </button>
        <span className="text-sm text-gray-500">
          {selectedCount} dari {totalCount} dipilih
        </span>
      </div>

      <button
        onClick={onUnfollow}
        disabled={selectedCount === 0 || isUnfollowing}
        className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
          selectedCount > 0 && !isUnfollowing
            ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isUnfollowing ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Unfollowing...
          </span>
        ) : (
          `🗑️ Unfollow (${selectedCount})`
        )}
      </button>
    </div>
  );
}
