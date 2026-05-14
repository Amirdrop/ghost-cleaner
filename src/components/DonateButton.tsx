"use client";

export default function DonateButton() {
  const walletAddress = "0x065836dA2db1B48E526F91aAd599a9647d11058f";

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Address copied!");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="group relative">
        <button
          onClick={copyAddress}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-purple-500/30 text-zinc-300 hover:text-white rounded-xl shadow-lg transition-all duration-200"
        >
          <span className="text-sm">☕</span>
          <span className="font-medium text-xs">Donate</span>
        </button>

        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-zinc-900 border border-zinc-800 text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <p className="text-zinc-400 font-medium mb-1.5">Support Ghost Cleaner</p>
          <p className="text-zinc-500 break-all font-mono text-[10px]">{walletAddress}</p>
          <p className="text-zinc-600 mt-1.5">Click to copy address</p>
        </div>
      </div>
    </div>
  );
}
