"use client";

import { useState, useEffect } from "react";
import { FarcasterUser, InactivityFilter } from "@/types/user";
import { filterByInactivity } from "@/lib/scoring";
import UserCard from "@/components/UserCard";
import FilterTabs from "@/components/FilterTabs";
import BulkActions from "@/components/BulkActions";

export default function ScanPage() {
  const [users, setUsers] = useState<FarcasterUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<InactivityFilter>(30);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [isUnfollowing, setIsUnfollowing] = useState(false);
  const [unfollowResult, setUnfollowResult] = useState<string | null>(null);
  const [fid, setFid] = useState("");
  const [progress, setProgress] = useState(0);

  const scanFollowing = async () => {
    if (!fid) {
      setError("Please enter your Farcaster FID");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const res = await fetch(`/api/following?fid=${fid}`);
      if (!res.ok) throw new Error("Failed to fetch following");

      const data = await res.json();
      setUsers(data.users);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = filterByInactivity(users, activeFilter);

  const counts: Record<InactivityFilter, number> = {
    30: filterByInactivity(users, 30).length,
    60: filterByInactivity(users, 60).length,
    90: filterByInactivity(users, 90).length,
    365: filterByInactivity(users, 365).length,
  };

  const toggleUser = (fid: number) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(fid)) {
      newSelected.delete(fid);
    } else {
      newSelected.add(fid);
    }
    setSelectedUsers(newSelected);
  };

  const selectAll = () => {
    setSelectedUsers(new Set(filteredUsers.map((u) => u.fid)));
  };

  const deselectAll = () => {
    setSelectedUsers(new Set());
  };

  const handleUnfollow = async () => {
    if (selectedUsers.size === 0) return;

    setIsUnfollowing(true);
    setUnfollowResult(null);

    try {
      const res = await fetch("/api/unfollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signerUuid: "user-signer-uuid", // This should come from auth
          targetFids: Array.from(selectedUsers),
        }),
      });

      if (!res.ok) throw new Error("Failed to unfollow");

      const data = await res.json();
      setUnfollowResult(
        `✅ Unfollowed ${data.success} accounts, ${data.failed} failed`
      );

      // Remove unfollowed users from list
      setUsers((prev) => prev.filter((u) => !selectedUsers.has(u.fid)));
      setSelectedUsers(new Set());
    } catch (err) {
      setUnfollowResult(
        `❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsUnfollowing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            👻 Ghost Cleaner
          </h1>
          <p className="text-gray-500 mt-2">
            Find and unfollow inactive Farcaster accounts
          </p>
        </div>

        {/* Scan Input */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="number"
              value={fid}
              onChange={(e) => setFid(e.target.value)}
              placeholder="Enter your Farcaster FID (e.g. 1234)"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            />
            <button
              onClick={scanFollowing}
              disabled={loading}
              className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Scanning...
                </span>
              ) : (
                "🔍 Scan Following"
              )}
            </button>
          </div>

          {loading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Analyzing accounts... This may take a moment.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Results */}
        {users.length > 0 && (
          <>
            {/* Filter Tabs */}
            <div className="mb-6">
              <FilterTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                counts={counts}
              />
            </div>

            {/* Bulk Actions */}
            <div className="mb-6">
              <BulkActions
                selectedCount={selectedUsers.size}
                totalCount={filteredUsers.length}
                onSelectAll={selectAll}
                onDeselectAll={deselectAll}
                onUnfollow={handleUnfollow}
                isUnfollowing={isUnfollowing}
              />
            </div>

            {/* Unfollow Result */}
            {unfollowResult && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm">
                {unfollowResult}
              </div>
            )}

            {/* User List */}
            <div className="space-y-3">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-400 text-lg">
                    🎉 No inactive accounts found with this filter!
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <UserCard
                    key={user.fid}
                    user={user}
                    selected={selectedUsers.has(user.fid)}
                    onToggle={toggleUser}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
