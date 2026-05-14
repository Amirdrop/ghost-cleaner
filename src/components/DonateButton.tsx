"use client";

import { useState } from "react";

const CHAINS = [
  { id: "base", name: "Base", symbol: "ETH", icon: "🔵" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: "⟠" },
  { id: "solana", name: "Solana", symbol: "SOL", icon: "◎" },
  { id: "bsc", name: "BNB Chain", symbol: "BNB", icon: "◆" },
];

const TOKENS: Record<string, { symbol: string; name: string }[]> = {
  base: [
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "USDT", name: "Tether" },
  ],
  ethereum: [
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "USDT", name: "Tether" },
  ],
  solana: [
    { symbol: "SOL", name: "Solana" },
    { symbol: "USDC", name: "USD Coin" },
  ],
  bsc: [
    { symbol: "BNB", name: "BNB" },
    { symbol: "USDT", name: "Tether" },
    { symbol: "USDC", name: "USD Coin" },
  ],
};

export default function DonateButton() {
  const [open, setOpen] = useState(false);
  const [chain, setChain] = useState("base");
  const [token, setToken] = useState("ETH");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "connecting" | "sending" | "done" | "error">("idle");
  const [txHash, setTxHash] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    setStatus("connecting");
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setStatus("idle");
      } else {
        setStatus("error");
        alert("No wallet detected. Please install MetaMask or another Web3 wallet.");
      }
    } catch {
      setStatus("idle");
    }
  };

  const sendDonation = async () => {
    if (!walletAddress || !amount || parseFloat(amount) < 0) return;
    setStatus("sending");
    try {
      if (chain === "solana") {
        setStatus("error");
        alert("Solana donations coming soon! Use Base, Ethereum, or BNB for now.");
        return;
      }

      const provider = (window as any).ethereum;
      const value = "0x" + (parseFloat(amount) * 1e18).toString(16);

      const tx = await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: walletAddress,
            to: "0x065836dA2db1B48E526F91aAd599a9647d11058f",
            value: value,
          },
        ],
      });
      setTxHash(tx);
      setStatus("done");
    } catch (err: any) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#232330] bg-[#13131a]/90 backdrop-blur-md hover:border-[#8A63D2]/30 transition-all group"
        >
          <svg className="w-4 h-4 text-[#A78BFA] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <span className="text-xs font-semibold text-[#9393A8] group-hover:text-white transition-colors">
            Donate
          </span>
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md rounded-2xl border border-[#232330] bg-[#13131a] shadow-2xl animate-fadeIn overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#232330]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg fc-gradient flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Support Ghost Cleaner</h3>
                  <p className="text-[#5C5C72] text-[11px]">Any amount helps 💜</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5C5C72] hover:text-white hover:bg-[#232330] transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Connect Wallet */}
              {!walletAddress ? (
                <button
                  onClick={connectWallet}
                  disabled={status === "connecting"}
                  className="w-full btn-fc py-3 text-sm flex items-center justify-center gap-2"
                >
                  {status === "connecting" ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                      </svg>
                      Connect Wallet
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0d0d12] border border-[#232330]">
                  <div className="w-2 h-2 rounded-full bg-[#34D399]" />
                  <span className="text-xs text-[#9393A8] font-mono truncate">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                  <button
                    onClick={() => { setWalletAddress(""); setToken("ETH"); setChain("base"); }}
                    className="ml-auto text-[10px] text-[#5C5C72] hover:text-[#F87171] transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              )}

              {/* Chain Select */}
              {walletAddress && (
                <>
                  <div>
                    <label className="text-[11px] text-[#5C5C72] font-semibold uppercase tracking-wider mb-2 block">
                      Chain
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {CHAINS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setChain(c.id);
                            setToken(TOKENS[c.id][0].symbol);
                          }}
                          className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                            chain === c.id
                              ? "bg-[#8A63D2]/15 text-[#A78BFA] border border-[#8A63D2]/30"
                              : "bg-[#0d0d12] text-[#5C5C72] border border-[#232330] hover:text-white"
                          }`}
                        >
                          {c.icon} {c.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Token Select */}
                  <div>
                    <label className="text-[11px] text-[#5C5C72] font-semibold uppercase tracking-wider mb-2 block">
                      Token
                    </label>
                    <div className="flex gap-1.5">
                      {TOKENS[chain]?.map((t) => (
                        <button
                          key={t.symbol}
                          onClick={() => setToken(t.symbol)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                            token === t.symbol
                              ? "bg-[#8A63D2]/15 text-[#A78BFA] border border-[#8A63D2]/30"
                              : "bg-[#0d0d12] text-[#5C5C72] border border-[#232330] hover:text-white"
                          }`}
                        >
                          {t.symbol}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="text-[11px] text-[#5C5C72] font-semibold uppercase tracking-wider mb-2 block">
                      Amount ({token})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full px-4 py-3 rounded-xl bg-[#0d0d12] border border-[#232330] text-white text-sm font-semibold placeholder:text-[#2a2a3a] focus:border-[#8A63D2]/50 focus:ring-2 focus:ring-[#8A63D2]/20 outline-none transition-all"
                      style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff", caretColor: "#8A63D2" }}
                    />
                  </div>

                  {/* Send */}
                  {status === "done" ? (
                    <div className="p-4 rounded-xl bg-[#34D399]/[0.06] border border-[#34D399]/20 text-center">
                      <div className="text-[#34D399] font-bold text-sm mb-1">Thank you! 💜</div>
                      <a
                        href={`https://etherscan.io/tx/${txHash}`}
                        target="_blank"
                        className="text-[10px] text-[#5C5C72] hover:text-[#A78BFA] font-mono break-all transition-colors"
                      >
                        {txHash.slice(0, 20)}...
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={sendDonation}
                      disabled={!amount || parseFloat(amount) <= 0 || status === "sending"}
                      className="w-full btn-fc py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {status === "sending" ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                          </svg>
                          Send {amount || "0"} {token}
                        </>
                      )}
                    </button>
                  )}

                  {status === "error" && (
                    <p className="text-xs text-[#F87171] text-center">Transaction failed or cancelled</p>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[#232330] bg-[#0d0d12]/50">
              <p className="text-[10px] text-[#5C5C72] text-center">
                0x065836dA2db1B48E526F91aAd599a9647d11058f
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
