"use client";

import { useState } from "react";
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
        setError("Masukkan FID yang valid (angka)");
        return null;
      }
      return fid;
    } else {
      // Username mode
      const username = input.replace("@", "").trim();
      if (!username) {
        setError("Masukkan username Farcaster");
        return null;
      }

      try {
        const res = await fetch(`/api/user?username=${username}`);
        if (!res.ok) {
          setError(`Username @${username} tidak ditemukan`);
          return null;
        }
        const data = await res.json();
        setScannedUser(data.displayName || data.username);
        return data.fid;
      } catch {
        setError("Gagal mencari username");
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
      if (!res.ok) throw new Error("Gagal mengambil data following");

      const data = await res.json();
      setUsers(data.users);
      setProgress(100);

      if (!scannedUser) {
        setScannedUser(`FID ${fid}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
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
          signerUuid: "user-signer-uuid",
          targetFids: Array.from(selectedUsers),
        }),
      });

      if (!res.ok) throw new Error("Gagal unfollow");

      const data = await res.json();
      setUnfollowResult(
        `✅ Berhasil unfollow ${data.success} akun, ${data.failed} gagal`
      );

      setUsers((prev) => prev.filter((u) => !selectedUsers.has(u.fid)));
      setSelectedUsers(new Set());
    } catch (err) {
      setUnfollowResult(
        `❌ Error: ${err instanceof Error ? err.message : "Terjadi kesalahan"}`
      );
    } finally {
      setIsUnfollowing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      scanFollowing();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/"
            className="text-sm text-purple-500 hover:text-purple-700 mb-2 inline-block"
          >
            ← Kembali
          </a>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            👻 Ghost Cleaner
          </h1>
          <p className="text-gray-600 mt-2">
            Cari dan unfollow akun Farcaster yang tidak aktif
          </p>
        </div>

        {/* Scan Input */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          {/* Input Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setInputMode("username");
                setInput("");
                setError(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                inputMode === "username"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              @ Username
            </button>
            <button
              onClick={() => {
                setInputMode("fid");
                setInput("");
                setError(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                inputMode === "fid"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              # FID
            </button>
          </div>

          {/* Input Field */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                {inputMode === "username" ? "@" : "#"}
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(null);
                }}
                onKeyPress={handleKeyPress}
                placeholder={
                  inputMode === "username"
                    ? "Masukkan username (contoh: dwr)"
                    : "Masukkan FID (contoh: 1234)"
                }
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-900 text-base font-medium placeholder:text-gray-400 bg-white"
                style={{ color: "#1a1a2e" }}
              />
            </div>
            <button
              onClick={scanFollowing}
              disabled={loading || !input.trim()}
              className="px-8 py-3.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-200 active:scale-95"
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
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Menganalisis akun... Mohon tunggu sebentar.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Results */}
        {users.length > 0 && (
          <>
            {/* Scan Info */}
            <div className="mb-4 p-4 bg-white rounded-xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Hasil scan untuk</p>
                <p className="font-semibold text-gray-900">
                  {scannedUser} • {users.length} following
                </p>
              </div>
              <button
                onClick={() => {
                  setUsers([]);
                  setScannedUser(null);
                  setSelectedUsers(new Set());
                  setInput("");
                }}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕ Reset
              </button>
            </div>

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
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100">
                {unfollowResult}
              </div>
            )}

            {/* User List */}
            <div className="space-y-3">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-400 text-lg">
                    🎉 Tidak ada akun tidak aktif dengan filter ini!
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
