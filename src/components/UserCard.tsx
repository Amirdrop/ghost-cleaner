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
      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? "border-purple-500 bg-purple-50 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
      onClick={() => onToggle(user.fid)}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggle(user.fid)}
        className="w-5 h-5 rounded accent-purple-500"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        {user.pfpUrl ? (
          <img
            src={user.pfpUrl}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
            👻
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 truncate">
            {user.displayName}
          </h3>
          <span className="text-sm text-gray-500">@{user.username}</span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${inactivityColor}`}
          >
            {inactivityLabel}
          </span>
          <span className="text-xs text-gray-400">
            {user.inactiveDays} hari
          </span>
        </div>

        {user.bio && (
          <p className="text-sm text-gray-500 mt-1 truncate">{user.bio}</p>
        )}
      </div>

      <div className="text-right text-sm text-gray-400 flex-shrink-0">
        <div>{user.followerCount.toLocaleString()} followers</div>
        <div>{user.followingCount.toLocaleString()} following</div>
      </div>
    </div>
  );
}
