"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FarcasterUser, InactivityFilter } from "@/types/user";
import { filterByInactivity } from "@/lib/scoring";
import UserCard from "@/components/UserCard";
import FilterTabs from "@/components/FilterTabs";
import BulkActions from "@/components/BulkActions";

const SIGNER_STORAGE = "ghost-cleaner-signer";

interface StoredSigner {
  fid: number;
  signerId: string;
  publicKey: string;
  privateKey: string;
}

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

  // Farcaster Auth State
  const [signer, setSigner] = useState<StoredSigner | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState<"input" | "creating" | "approve" | "done">("input");
  const [authFid, setAuthFid] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Load signer from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIGNER_STORAGE);
      if (stored) setSigner(JSON.parse(stored));
    } catch {}
  }, []);

  // Generate ed25519 key pair in browser using Web Crypto API
  const generateEd25519Keys = async (): Promise<{ privateKey: Uint8Array; publicKey: Uint8Array }> => {
    const keyPair = await crypto.subtle.generateKey(
      "Ed25519",
      true,
      ["sign", "verify"]
    );
    const privKeyBuffer = await crypto.subtle.exportKey("raw", keyPair.privateKey);
    const pubKeyBuffer = await crypto.subtle.exportKey("raw", keyPair.publicKey);
    return {
      privateKey: new Uint8Array(privKeyBuffer),
      publicKey: new Uint8Array(pubKeyBuffer),
    };
  };

  const connectFarcaster = async () => {
    const fid = parseInt(authFid);
    if (isNaN(fid) || fid <= 0) {
      setAuthError("Enter a valid FID");
      return;
    }

    setAuthStep("creating");
    setAuthError(null);

    try {
      // Generate key pair in browser
      const { privateKey, publicKey } = await generateEd25519Keys();
      const privateKeyHex = Buffer.from(privateKey).toString("hex");
      const publicKeyHex = Buffer.from(publicKey).toString("hex");

      // Register public key with server
      const res = await fetch("/api/signer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid, publicKey: publicKeyHex }),
      });

      if (!res.ok) throw new Error("Failed to register signer");

      const signerData: StoredSigner = {
        fid,
        signerId: publicKeyHex.slice(0, 24),
        publicKey: publicKeyHex,
        privateKey: privateKeyHex,
      };

      // Store in localStorage (private key stays in browser!)
      localStorage.setItem(SIGNER_STORAGE, JSON.stringify(signerData));
      setSigner(signerData);
      setAuthStep("approve");
    } catch (err: any) {
      setAuthError(err.message);
      setAuthStep("input");
    }
  };

  const disconnectFarcaster = () => {
    localStorage.removeItem(SIGNER_STORAGE);
    setSigner(null);
    setShowAuthModal(false);
    setAuthStep("input");
    setAuthFid("");
  };

  const handleUnfollow = async () => {
    if (!signer || selectedUsers.size === 0) return;

    setIsUnfollowing(true);
    setUnfollowResult(null);

    try {
      const res = await fetch("/api/unfollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: signer.fid,
          privateKey: signer.privateKey,
          targetFids: Array.from(selectedUsers),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Unfollow failed");
      }

      const data = await res.json();
      setUnfollowResult(
        `Unfollowed ${data.success} accounts${data.failed > 0 ? `, ${data.failed} failed` : ""}`
      );
      setUsers((prev) => prev.filter((u) => !selectedUsers.has(u.fid)));
      setSelectedUsers(new Set());
    } catch (err: any) {
      setUnfollowResult(`Error: ${err.message}`);
    } finally {
      setIsUnfollowing(false);
    }
  };

  // --- Scan Logic ---
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
    } catch (err: any) {
      setError(err.message || "Something went wrong");
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

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg fc-gradient flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-xs">👻</span>
            </div>
            <span className="font-extrabold text-white text-sm tracking-tight">Ghost Cleaner</span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Connect / Connected Button */}
            {signer ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20 hover:bg-[#34D399]/20 transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                FID {signer.fid}
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-fc px-4 py-1.5 text-xs"
              >
                Connect Farcaster
              </button>
            )}
            <Link href="/" className="text-xs text-[#5C5C72] hover:text-[#9393A8] transition-colors">
              ← Back
            </Link>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-[#232330] bg-[#13131a] shadow-2xl animate-fadeIn overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#232330]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg fc-gradient flex items-center justify-center">
                  <span className="text-sm">👻</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Connect Farcaster</h3>
                  <p className="text-[#5C5C72] text-[11px]">Required to unfollow accounts</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5C5C72] hover:text-white hover:bg-[#232330] transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              {signer ? (
                // Connected state
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#34D399]/[0.06] border border-[#34D399]/20">
                    <div className="w-2 h-2 rounded-full bg-[#34D399]" />
                    <div>
                      <div className="text-[#34D399] font-semibold text-sm">Connected</div>
                      <div className="text-[#5C5C72] text-xs">FID {signer.fid}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0d0d12] border border-[#232330]">
                    <div className="text-[10px] text-[#5C5C72] uppercase tracking-wider mb-1">Public Key</div>
                    <div className="text-xs text-[#9393A8] font-mono break-all">{signer.publicKey}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#8A63D2]/[0.06] border border-[#8A63D2]/20">
                    <p className="text-xs text-[#A78BFA]">
                      <strong>How to approve:</strong>
                    </p>
                    <ol className="text-xs text-[#9393A8] mt-2 space-y-1.5 list-decimal list-inside">
                      <li>Open <a href="https://farcaster.xyz/~/settings/developer" target="_blank" className="text-[#A78BFA] underline">Warpcast Settings → Developer</a></li>
                      <li>Go to <strong>Registered Signers</strong></li>
                      <li>Click <strong>Register New Signer</strong></li>
                      <li>Paste the public key above</li>
                      <li>Approve the transaction</li>
                      <li>Come back here and start unfollowing!</li>
                    </ol>
                  </div>

                  <button
                    onClick={disconnectFarcaster}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-[#F87171] bg-[#F87171]/10 border border-[#F87171]/20 hover:bg-[#F87171]/20 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : authStep === "approve" ? (
                // Waiting for approval
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full fc-gradient flex items-center justify-center animate-pulse">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h4 className="text-white font-bold mb-2">Approve Signer</h4>
                    <p className="text-[#5C5C72] text-sm mb-4">
                      Register this public key in your Farcaster account:
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0d0d12] border border-[#232330]">
                    <div className="text-[10px] text-[#5C5C72] uppercase tracking-wider mb-1">Your Public Key</div>
                    <div className="text-xs text-[#A78BFA] font-mono break-all">{signer!.publicKey}</div>
                  </div>

                  <a
                    href="https://farcaster.xyz/~/settings/developer"
                    target="_blank"
                    className="btn-fc w-full py-3 text-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open Warpcast Settings
                  </a>

                  <div className="p-3 rounded-xl bg-[#FBBF24]/[0.06] border border-[#FBBF24]/20">
                    <p className="text-xs text-[#FBBF24]">
                      ⚠️ After approving, come back and refresh. The signer will be active.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setAuthStep("input");
                      disconnectFarcaster();
                    }}
                    className="w-full text-xs text-[#5C5C72] hover:text-white transition-colors py-2"
                  >
                    ← Start over
                  </button>
                </div>
              ) : (
                // Input FID
                <div className="space-y-4">
                  <p className="text-[#9393A8] text-sm">
                    Enter your Farcaster FID to generate a signer. This allows the app to unfollow accounts on your behalf.
                  </p>

                  <div>
                    <label className="text-[11px] text-[#5C5C72] font-semibold uppercase tracking-wider mb-2 block">
                      Your FID
                    </label>
                    <input
                      type="number"
                      value={authFid}
                      onChange={(e) => {
                        setAuthFid(e.target.value);
                        setAuthError(null);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && connectFarcaster()}
                      placeholder="421125"
                      className="w-full px-4 py-3 rounded-xl bg-[#0d0d12] border border-[#232330] text-white text-sm font-semibold placeholder:text-[#2a2a3a] focus:border-[#8A63D2]/50 focus:ring-2 focus:ring-[#8A63D2]/20 outline-none transition-all"
                      style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff", caretColor: "#8A63D2" }}
                    />
                  </div>

                  {authError && (
                    <div className="p-3 rounded-xl bg-[#F87171]/[0.06] border border-[#F87171]/20 text-[#F87171] text-sm">
                      {authError}
                    </div>
                  )}

                  <button
                    onClick={connectFarcaster}
                    disabled={authStep === "creating" || !authFid}
                    className="btn-fc w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {authStep === "creating" ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating Signer...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 6v12a3 3 0 11-3-3H8a3 3 0 01-3-3V6a3 3 0 013-3h4a3 3 0 013 3z" />
                        </svg>
                        Generate Signer
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-[#5C5C72] text-center">
                    Your keys are stored locally. We never send them to our servers.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="animate-fadeIn">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-white mb-2">Scan Following</h1>
            <p className="text-[#5C5C72] text-sm">
              Enter a Farcaster username or FID to analyze their following list
            </p>
          </div>

          {/* Input Area */}
          <div className="p-6 rounded-2xl border border-[#232330] bg-[#17171f]">
            <div className="flex gap-1 p-1 bg-[#0d0d12] rounded-lg w-fit mb-5">
              {[
                { key: "username" as const, label: "@ Username" },
                { key: "fid" as const, label: "# FID" },
              ].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => { setInputMode(mode.key); setInput(""); setError(null); }}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                    inputMode === mode.key ? "bg-[#8A63D2] text-white shadow-sm" : "text-[#5C5C72] hover:text-white"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C72] font-semibold pointer-events-none text-sm">
                  {inputMode === "username" ? "@" : "#"}
                </span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(null); }}
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

            {loading && (
              <div className="mt-5">
                <div className="w-full bg-[#0d0d12] rounded-full h-1.5 overflow-hidden">
                  <div className="fc-gradient h-1.5 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-[#5C5C72] mt-2.5 text-center">Analyzing accounts...</p>
              </div>
            )}

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
            <div className="flex items-center justify-between mb-6 p-4 rounded-xl border border-[#232330] bg-[#17171f]/50">
              <div>
                <p className="text-[10px] text-[#5C5C72] uppercase tracking-widest font-semibold">Results for</p>
                <p className="text-white font-bold text-sm mt-0.5">
                  {scannedUser} <span className="text-[#5C5C72] font-normal">· {users.length} following</span>
                </p>
              </div>
              <button
                onClick={() => { setUsers([]); setScannedUser(null); setSelectedUsers(new Set()); setInput(""); }}
                className="text-xs text-[#5C5C72] hover:text-[#F87171] transition-colors px-3 py-1.5 rounded-lg border border-[#232330] hover:border-[#F87171]/30"
              >
                Reset
              </button>
            </div>

            <div className="mb-5">
              <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />
            </div>

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

            {/* Auth warning for unfollow */}
            {!signer && selectedUsers.size > 0 && (
              <div className="mb-5 p-3.5 rounded-xl bg-[#FBBF24]/[0.06] border border-[#FBBF24]/20 text-[#FBBF24] text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>
                  <strong>Connect Farcaster</strong> to unfollow selected accounts.
                  <button onClick={() => setShowAuthModal(true)} className="ml-1 underline text-[#A78BFA] hover:text-white transition-colors">
                    Connect now →
                  </button>
                </span>
              </div>
            )}

            {unfollowResult && (
              <div className="mb-5 p-3.5 rounded-xl bg-[#34D399]/[0.06] border border-[#34D399]/20 text-[#34D399] text-sm">
                {unfollowResult}
              </div>
            )}

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
