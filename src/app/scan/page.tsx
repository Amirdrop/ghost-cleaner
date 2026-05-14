"use client";

import { useState } from "react";
import Link from "next/link";
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
  const [input, setInput] = useState("");
  const [inputMode, setInputMode] = useState<"fid" | "username">("username");
  const [progress, setProgress] = useState(0);
  const [scannedUser, setScannedUser] = useState<string | null>(null);

  const resolveFid = async (): Promise<number | null> => {
    if (inputMode === "fid") {
      const fid = parseInt(input);
      if (isNaN(fid) || fid <= 0) {
        setError("Enter a valid FID (number)");
        return null;
      }
      return fid;
    } else {
      const username = input.replace("@", "").trim();
      if (!username) {
        setError("Enter a Farcaster username");
        return null;
      }
      try {
        const res = await fetch(`/api/user?username=${username}`);
        if (!res.ok) {
          setError(`Username @${username} not found`);
          return null;
        }
        const data = await res.json();
        setScannedUser(data.displayName || data.username);
        return data.fid;
      } catch {
        setError("Failed to search username");
        return null;
      }
    }
  };

  const scanFollowing = async () => {
    setError(null);
    setProgress(0);
    setSelectedUsers(new Set());
    setUnfollowResult(null);

    const fid = await resolveFid();
    if (!fid) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/following?fid=${fid}`);
      if (!res.ok) throw new Error("Failed to fetch following");
      const data = await res.json();
      setUsers(data.users);
      setProgress(100);
      if (!scannedUser) setScannedUser(`FID ${fid}`);
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
    const next = new Set(selectedUsers);
    next.has(fid) ? next.delete(fid) : next.add(fid);
    setSelectedUsers(next);
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
          signerUuid: "user-signer-uuid",
          targetFids: Array.from(selectedUsers),
        }),
      });
      if (!res.ok) throw new Error("Unfollow failed");
      const data = await res.json();
      setUnfollowResult(
        `✅ Unfollowed ${data.success} accounts, ${data.failed} failed`
      );
      setUsers((prev) => prev.filter((u) => !selectedUsers.has(u.fid)));
      setSelectedUsers(new Set());
    } catch (err) {
      setUnfollowResult(
        `❌ Error: ${err instanceof Error ? err.message : "Something went wrong"}`
      );
    } finally {
      setIsUnfollowing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-xs">👻</span>
            </div>
            <span className="font-bold text-white text-sm tracking-tight">
              Ghost Cleaner
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Back
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        {/* Scan Card */}
        <div className="animate-fadeIn">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Scan Following
            </h1>
            <p className="text-zinc-500 text-sm">
              Enter a Farcaster username or FID to analyze their following list
            </p>
          </div>

          {/* Input Area */}
          <div className="p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
            {/* Mode Toggle */}
            <div className="flex gap-1 p-1 bg-zinc-800/50 rounded-lg w-fit mb-5">
              {[
                { key: "username" as const, label: "@ Username" },
                { key: "fid" as const, label: "# FID" },
              ].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => {
                    setInputMode(mode.key);
                    setInput("");
                    setError(null);
                  }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    inputMode === mode.key
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Input + Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium pointer-events-none text-sm">
                  {inputMode === "username" ? "@" : "#"}
                </span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && scanFollowing()}
                  placeholder={
                    inputMode === "username"
                      ? "dwr"
                      : "1234"
                  }
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-white text-sm font-medium placeholder:text-zinc-600 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  style={{
                    color: "#ffffff",
                    WebkitTextFillColor: "#ffffff",
                    caretColor: "#a78bfa",
                  }}
                />
              </div>
              <button
                onClick={scanFollowing}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all glow-purple-hover flex items-center justify-center gap-2 min-w-[140px]"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Scan Following
                  </>
                )}
              </button>
            </div>

            {/* Progress */}
            {loading && (
              <div className="mt-5">
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2.5 text-center">
                  Analyzing accounts — this may take a moment...
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {users.length > 0 && (
          <div className="mt-8 animate-slideUp">
            {/* Info Bar */}
            <div className="flex items-center justify-between mb-6 p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/30">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">
                  Results for
                </p>
                <p className="text-white font-semibold text-sm mt-0.5">
                  {scannedUser}{" "}
                  <span className="text-zinc-500 font-normal">
                    · {users.length} following
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  setUsers([]);
                  setScannedUser(null);
                  setSelectedUsers(new Set());
                  setInput("");
                }}
                className="text-xs text-zinc-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-red-500/30"
              >
                Reset
              </button>
            </div>

            {/* Filters */}
            <div className="mb-5">
              <FilterTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                counts={counts}
              />
            </div>

            {/* Bulk Actions */}
            <div className="mb-5">
              <BulkActions
                selectedCount={selectedUsers.size}
                totalCount={filteredUsers.length}
                onSelectAll={() =>
                  setSelectedUsers(new Set(filteredUsers.map((u) => u.fid)))
                }
                onDeselectAll={() => setSelectedUsers(new Set())}
                onUnfollow={handleUnfollow}
                isUnfollowing={isUnfollowing}
              />
            </div>

            {/* Unfollow Result */}
            {unfollowResult && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-sm">
                {unfollowResult}
              </div>
            )}

            {/* User List */}
            <div className="space-y-2">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-zinc-800/40 bg-zinc-900/20">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="text-zinc-400 font-medium">
                    No inactive accounts with this filter
                  </p>
                  <p className="text-zinc-600 text-sm mt-1">
                    Try a longer inactivity period
                  </p>
                </div>
              ) : (
                filteredUsers.map((user, i) => (
                  <div
                    key={user.fid}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <UserCard
                      user={user}
                      selected={selectedUsers.has(user.fid)}
                      onToggle={toggleUser}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
