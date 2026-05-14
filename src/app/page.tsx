"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-sm">👻</span>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Ghost Cleaner
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Amirdrop/ghost-cleaner"
              target="_blank"
              className="text-zinc-400 hover:text-white text-sm transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/scan"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-all glow-purple-hover"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-purple-400 text-xs font-medium">
              Powered by Farcaster Protocol
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            Clean your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              following list
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Detect ghost accounts that stopped posting. Filter by inactivity
            period. Unfollow in bulk. Keep your feed meaningful.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/scan"
              className="group relative px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all glow-purple glow-purple-hover"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
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
                Start Scanning
              </span>
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 text-zinc-400 hover:text-white font-medium rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all"
            >
              How it works →
            </a>
          </div>
        </div>

        {/* Stats / Preview */}
        <div className="mt-20 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { value: "Free", label: "No API key needed" },
            { value: "Fast", label: "Real-time scanning" },
            { value: "Safe", label: "No data stored" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30"
            >
              <div className="text-white font-bold text-lg">{stat.value}</div>
              <div className="text-zinc-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div id="how-it-works" className="mt-32 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            How it works
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Enter your FID or username",
                desc: "We'll look up your Farcaster following list",
              },
              {
                step: "02",
                title: "We check every account",
                desc: "Each following is checked for their last cast activity",
              },
              {
                step: "03",
                title: "Filter by inactivity",
                desc: "Choose 30, 60, 90, or 365 day threshold",
              },
              {
                step: "04",
                title: "Select & unfollow",
                desc: "Pick the ghosts and remove them in one click",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-6 p-5 rounded-xl border border-zinc-800/50 bg-zinc-900/20 card-hover"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-400 text-sm font-bold font-mono">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-zinc-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 pt-8 border-t border-zinc-800/50 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-[10px]">👻</span>
            </div>
            <span className="text-zinc-400 text-sm font-medium">
              Ghost Cleaner
            </span>
          </div>
          <p className="text-zinc-600 text-xs">
            Built for the Farcaster community. Not affiliated with Farcaster.
          </p>
        </footer>
      </div>
    </div>
  );
}
