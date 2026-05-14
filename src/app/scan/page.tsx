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
          setError(`@${username} not found`);
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
      setUnfollowResult(`Unfollowed ${data.success} accounts, ${data.failed} failed`);
      setUsers((prev) => prev.filter((u) => !selectedUsers.has(u.fid)));
      setSelectedUsers(new Set());
    } catch (err) {
      setUnfollowResult(`Error: ${err instanceof Error ? err.message : "Something went wrong"}`);
    } finally {
      setIsUnfollowing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg fc-gradient flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
            </div>
            <span className="font-extrabold text-white text-sm tracking-tight">
              Ghost Cleaner
            </span>
          </Link>
          <Link href="/" className="text-xs text-[#5C5C72] hover:text-[#9393A8] transition-colors">
            ← Back
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        {/* Scan Card */}
        <div className="animate-fadeIn">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-white mb-2">
              Scan Following
            </h1>
            <p className="text-[#5C5C72] text-sm">
              Enter a Farcaster username or FID to analyze their following list
            </p>
          </div>

          {/* Input Area */}
          <div className="p-6 rounded-2xl border border-[#232330] bg-[#17171f]">
            {/* Mode Toggle */}
            <div className="flex gap-1 p-1 bg-[#0d0d12] rounded-lg w-fit mb-5">
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
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                    inputMode === mode.key
                      ? "bg-[#8A63D2] text-white shadow-sm"
                      : "text-[#5C5C72] hover:text-white"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Input + Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C72] font-semibold pointer-events-none text-sm">
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
                  placeholder={inputMode === "username" ? "dwr" : "1234"}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#0d0d12] border border-[#232330] text-white text-sm font-semibold placeholder:text-[#2a2a3a] focus:border-[#8A63D2]/50 focus:ring-2 focus:ring-[#8A63D2]/20 outline-none transition-all"
                  style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff", caretColor: "#8A63D2" }}
                />
              </div>
              <button
                onClick={scanFollowing}
                disabled={loading || !input.trim()}
                className="btn-fc px-6 py-3 text-sm flex items-center justify-center gap-2 min-w-[150px] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Scan Following
                  </>
                )}
              </button>
            </div>

            {/* Progress */}
            {loading && (
              <div className="mt-5">
                <div className="w-full bg-[#0d0d12] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="fc-gradient h-1.5 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-[#5C5C72] mt-2.5 text-center">
                  Analyzing accounts — this may take a moment...
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-3.5 rounded-xl bg-[#F87171]/[0.06] border border-[#F87171]/20 text-[#F87171] text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
            <div className="flex items-center justify-between mb-6 p-4 rounded-xl border border-[#232330] bg-[#17171f]/50">
              <div>
                <p className="text-[10px] text-[#5C5C72] uppercase tracking-widest font-semibold">
                  Results for
                </p>
                <p className="text-white font-bold text-sm mt-0.5">
                  {scannedUser}{" "}
                  <span className="text-[#5C5C72] font-normal">
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
                className="text-xs text-[#5C5C72] hover:text-[#F87171] transition-colors px-3 py-1.5 rounded-lg border border-[#232330] hover:border-[#F87171]/30"
              >
                Reset
              </button>
            </div>

            {/* Filters */}
            <div className="mb-5">
              <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />
            </div>

            {/* Bulk Actions */}
            <div className="mb-5">
              <BulkActions
                selectedCount={selectedUsers.size}
                totalCount={filteredUsers.length}
                onSelectAll={() => setSelectedUsers(new Set(filteredUsers.map((u) => u.fid)))}
                onDeselectAll={() => setSelectedUsers(new Set())}
                onUnfollow={handleUnfollow}
                isUnfollowing={isUnfollowing}
              />
            </div>

            {/* Unfollow Result */}
            {unfollowResult && (
              <div className="mb-5 p-3.5 rounded-xl bg-[#34D399]/[0.06] border border-[#34D399]/20 text-[#34D399] text-sm">
                {unfollowResult}
              </div>
            )}

            {/* User List */}
            <div className="space-y-2">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-[#232330]/40 bg-[#13131a]/30">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="text-[#9393A8] font-semibold">No inactive accounts</p>
                  <p className="text-[#5C5C72] text-sm mt-1">Try a longer inactivity period</p>
                </div>
              ) : (
                filteredUsers.map((user, i) => (
                  <div key={user.fid} className="animate-fadeIn" style={{ animationDelay: `${i * 25}ms` }}>
                    <UserCard user={user} selected={selectedUsers.has(user.fid)} onToggle={toggleUser} />
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
