"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-100 mb-6">
            <span className="text-6xl">👻</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Ghost{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Cleaner
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Find and unfollow inactive Farcaster accounts. Keep your following
            list clean and meaningful.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Detection</h3>
            <p className="text-sm text-gray-500">
              Automatically detect accounts inactive for 30, 60, 90, or 365 days.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Bulk Actions</h3>
            <p className="text-sm text-gray-500">
              Select and unfollow multiple accounts at once. Save time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
            <p className="text-sm text-gray-500">
              Your data stays private. No data stored on our servers.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/scan"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-xl shadow-purple-200 hover:shadow-2xl hover:scale-105"
          >
            <span>🚀</span>
            Start Scanning
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            Connect your Farcaster account to get started
          </p>
        </div>

        {/* How it works */}
        <div className="mt-20 bg-white rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How it works
          </h2>
          <div className="space-y-4">
            {[
              { step: "1", text: "Enter your Farcaster FID", emoji: "📝" },
              { step: "2", text: "We scan your following list", emoji: "🔍" },
              { step: "3", text: "Filter by inactivity period", emoji: "📊" },
              { step: "4", text: "Select accounts to unfollow", emoji: "✅" },
              { step: "5", text: "Bulk unfollow ghost accounts", emoji: "🗑️" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold flex-shrink-0">
                  {item.step}
                </div>
                <span className="text-gray-700">
                  {item.emoji} {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
