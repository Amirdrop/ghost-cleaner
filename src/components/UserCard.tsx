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
          ? "border-[#8A63D2]/40 bg-[#8A63D2]/[0.06]"
          : "border-[#232330]/60 bg-[#17171f]/30 hover:border-[#2a2a3a] hover:bg-[#17171f]/60"
      }`}
    >
      {/* Checkbox */}
      <div
        className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          selected
            ? "bg-[#8A63D2] border-[#8A63D2]"
            : "border-[#2a2a3a] group-hover:border-[#5C5C72]"
        }`}
      >
        {selected && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#232330] flex-shrink-0 ring-1 ring-[#2a2a3a]">
        {user.pfpUrl ? (
          <img src={user.pfpUrl} alt={user.username} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#5C5C72] text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-white text-sm truncate">{user.displayName}</h3>
          <span className="text-xs text-[#5C5C72] truncate">@{user.username}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`badge ${inactivityColor}`}>{inactivityLabel}</span>
          <span className="text-[11px] text-[#5C5C72]">{user.inactiveDays}d</span>
        </div>
        {user.bio && (
          <p className="text-xs text-[#5C5C72] mt-1 truncate">{user.bio}</p>
        )}
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 text-right hidden sm:block">
        <div className="text-xs text-[#9393A8] font-semibold">
          {user.followerCount.toLocaleString()}
        </div>
        <div className="text-[10px] text-[#5C5C72]">followers</div>
      </div>
    </div>
  );
}
