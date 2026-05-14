"use client";

import { FarcasterUser } from "@/types/user";
import { getInactivityLabel, getInactivityColor } from "@/lib/scoring";

interface UserCardProps {
  user: FarcasterUser;
  selected: boolean;
  onToggle: (fid: number) => void;
}

export default function UserCard({ user, selected, onToggle }: UserCardProps) {
  const inactivityLabel = getInactivityLabel(user.inactiveDays);
  const inactivityColor = getInactivityColor(user.inactiveDays);

  return (
    <div
      onClick={() => onToggle(user.fid)}
      className={`group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
        selected
          ? "border-purple-500/40 bg-purple-500/5"
          : "border-zinc-800/50 bg-zinc-900/20 hover:border-zinc-700/60 hover:bg-zinc-900/40"
      }`}
    >
      {/* Checkbox */}
      <div
        className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          selected
            ? "bg-purple-600 border-purple-600"
            : "border-zinc-600 group-hover:border-zinc-500"
        }`}
      >
        {selected && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 ring-1 ring-zinc-700/50">
        {user.pfpUrl ? (
          <img
            src={user.pfpUrl}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm">
            👻
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white text-sm truncate">
            {user.displayName}
          </h3>
          <span className="text-xs text-zinc-500 truncate">
            @{user.username}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${inactivityColor}`}
          >
            {inactivityLabel}
          </span>
          <span className="text-[11px] text-zinc-600">
            {user.inactiveDays}d
          </span>
        </div>
        {user.bio && (
          <p className="text-xs text-zinc-500 mt-1 truncate">{user.bio}</p>
        )}
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 text-right hidden sm:block">
        <div className="text-xs text-zinc-400 font-medium">
          {user.followerCount.toLocaleString()}
        </div>
        <div className="text-[10px] text-zinc-600">followers</div>
      </div>
    </div>
  );
}
