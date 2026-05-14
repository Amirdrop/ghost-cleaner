"use client";

export default function CreatorBadge() {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <a
        href="https://farcaster.xyz/0xrin"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[#232330] bg-[#13131a]/90 backdrop-blur-md hover:border-[#8A63D2]/30 transition-all"
      >
        <div className="w-6 h-6 rounded-full bg-[#8A63D2]/10 border border-[#8A63D2]/20 flex items-center justify-center">
          <svg className="w-3 h-3 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <div>
          <div className="text-[11px] text-[#9393A8] font-semibold group-hover:text-white transition-colors">
            @0xrin
          </div>
          <div className="text-[9px] text-[#5C5C72]">
            FID 421125 · Follow
          </div>
        </div>
      </a>
    </div>
  );
}
