"use client";

export default function DonateButton() {
  const walletAddress = "0x065836dA2db1B48E526F91aAd599a9647d11058f";

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Address copied! 📋");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="group relative">
        <button
          onClick={copyAddress}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <span className="text-lg">☕</span>
          <span className="font-semibold text-sm">Buy me a coffee</span>
        </button>

        <div className="absolute bottom-full right-0 mb-2 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <p className="font-medium mb-1">Support Ghost Cleaner 👻</p>
          <p className="text-gray-300 break-all font-mono">{walletAddress}</p>
          <p className="text-gray-400 mt-1">Click to copy address</p>
        </div>
      </div>
    </div>
  );
}
