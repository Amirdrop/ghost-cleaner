import { FarcasterUser, InactivityFilter } from "@/types/user";

export function calculateInactiveDays(lastActiveDate: string | null): number {
  if (!lastActiveDate) return 999;
  const now = new Date();
  const lastActive = new Date(lastActiveDate);
  const diffTime = now.getTime() - lastActive.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function filterByInactivity(users: FarcasterUser[], filter: InactivityFilter): FarcasterUser[] {
  return users.filter((user) => user.inactiveDays >= filter);
}

export function getInactivityLabel(days: number): string {
  if (days >= 365) return "1y+ inactive";
  if (days >= 90) return "3m+ inactive";
  if (days >= 60) return "2m+ inactive";
  if (days >= 30) return "1m+ inactive";
  return "Active";
}

export function getInactivityColor(days: number): string {
  if (days >= 365) return "text-[#F87171] bg-[#F87171]/[0.08] border border-[#F87171]/15";
  if (days >= 90) return "text-[#FB923C] bg-[#FB923C]/[0.08] border border-[#FB923C]/15";
  if (days >= 60) return "text-[#FBBF24] bg-[#FBBF24]/[0.08] border border-[#FBBF24]/15";
  if (days >= 30) return "text-[#5B8DEF] bg-[#5B8DEF]/[0.08] border border-[#5B8DEF]/15";
  return "text-[#34D399] bg-[#34D399]/[0.08] border border-[#34D399]/15";
}
