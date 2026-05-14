"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg fc-gradient flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">
              Ghost Cleaner
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Amirdrop/ghost-cleaner"
              target="_blank"
              className="text-[#9393A8] hover:text-white text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <Link href="/scan" className="btn-fc px-5 py-2 text-sm">
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8A63D2]/20 bg-[#8A63D2]/[0.06] mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8A63D2] animate-pulse" />
            <span className="text-[#A78BFA] text-xs font-semibold">
              Powered by Farcaster
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Clean your
            <br />
            <span className="fc-gradient-text">following list</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[#9393A8] max-w-2xl mx-auto mb-10 leading-relaxed">
            Find ghost accounts that stopped posting. Filter by inactivity.
            Unfollow in bulk. Keep your Farcaster feed meaningful.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/scan"
              className="btn-fc px-8 py-4 text-base flex items-center gap-2.5 animate-pulse-glow"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Start Scanning
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 text-[#9393A8] hover:text-white font-medium rounded-xl border border-[#232330] hover:border-[#8A63D2]/30 transition-all"
            >
              How it works →
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { value: "Free", label: "No API key needed" },
            { value: "Fast", label: "Real-time scanning" },
            { value: "Safe", label: "No data stored" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl border border-[#232330] bg-[#13131a]/50"
            >
              <div className="text-white font-bold text-lg">{stat.value}</div>
              <div className="text-[#5C5C72] text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div id="how-it-works" className="mt-32 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            How it works
          </h2>
          <div className="space-y-4">
            {[
              { step: "01", title: "Enter your FID or username", desc: "We look up your Farcaster following list" },
              { step: "02", title: "We check every account", desc: "Each following is checked for their last cast" },
              { step: "03", title: "Filter by inactivity", desc: "Choose 30, 60, 90, or 365 day threshold" },
              { step: "04", title: "Select & unfollow", desc: "Pick the ghosts and remove them in one click" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-5 p-5 rounded-xl border border-[#232330]/50 bg-[#13131a]/30 card-hover"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#8A63D2]/10 border border-[#8A63D2]/20 flex items-center justify-center">
                  <span className="text-[#A78BFA] text-sm font-bold font-mono">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-[#5C5C72] text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 pt-8 border-t border-[#232330]/50 text-center pb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-5 h-5 rounded fc-gradient flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
            </div>
            <span className="text-[#9393A8] text-sm font-semibold">
              Ghost Cleaner
            </span>
          </div>
          <p className="text-[#5C5C72] text-xs">
            Built for the Farcaster community · Not affiliated with Farcaster
          </p>
        </footer>
      </div>
    </div>
  );
}
