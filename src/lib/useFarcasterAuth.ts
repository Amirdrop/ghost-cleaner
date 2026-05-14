"use client";

import { useState, useCallback, useEffect } from "react";

interface FarcasterAuth {
  fid: number | null;
  signerId: string | null;
  publicKey: string | null;
  privateKey: string | null;
  status: "idle" | "creating" | "pending" | "approved" | "error";
  approvalUrl: string | null;
  error: string | null;
  connect: (fid: number) => Promise<void>;
  disconnect: () => void;
  unfollow: (targetFids: number[]) => Promise<{ success: number; failed: number }>;
}

const STORAGE_KEY = "ghost-cleaner-signer";

export function useFarcasterAuth(): FarcasterAuth {
  const [fid, setFid] = useState<number | null>(null);
  const [signerId, setSignerId] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [status, setStatus] = useState<FarcasterAuth["status"]>("idle");
  const [approvalUrl, setApprovalUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setFid(data.fid);
        setSignerId(data.signerId);
        setPublicKey(data.publicKey);
        setPrivateKey(data.privateKey);
        setStatus("approved"); // Assume approved if stored
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const connect = useCallback(async (userFid: number) => {
    setStatus("creating");
    setError(null);

    try {
      // Create signer via API
      const res = await fetch("/api/signer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid: userFid }),
      });

      if (!res.ok) {
        throw new Error("Failed to create signer");
      }

      const data = await res.json();

      setFid(userFid);
      setSignerId(data.signerId);
      setPublicKey(data.publicKey);
      setApprovalUrl(data.approvalUrl);
      setStatus("pending");

      // Store in localStorage (in production, use secure storage)
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          fid: userFid,
          signerId: data.signerId,
          publicKey: data.publicKey,
          privateKey: null, // Private key should be generated client-side
        })
      );
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
    }
  }, []);

  const disconnect = useCallback(() => {
    setFid(null);
    setSignerId(null);
    setPublicKey(null);
    setPrivateKey(null);
    setStatus("idle");
    setApprovalUrl(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const unfollow = useCallback(
    async (targetFids: number[]) => {
      if (!fid || !privateKey) {
        throw new Error("Not connected or signer not approved");
      }

      const res = await fetch("/api/unfollow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-signer-key": privateKey,
        },
        body: JSON.stringify({
          fid,
          signerId,
          targetFids,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Unfollow failed");
      }

      return res.json();
    },
    [fid, privateKey, signerId]
  );

  return {
    fid,
    signerId,
    publicKey,
    privateKey,
    status,
    approvalUrl,
    error,
    connect,
    disconnect,
    unfollow,
  };
}
