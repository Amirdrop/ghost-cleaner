import { FarcasterUser, InactivityFilter } from "@/types/user";

export function calculateInactiveDays(lastActiveDate: string | null): number {
  if (!lastActiveDate) return 999;

  const now = new Date();
  const lastActive = new Date(lastActiveDate);
  const diffTime = now.getTime() - lastActive.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export function filterByInactivity(
  users: FarcasterUser[],
  filter: InactivityFilter
): FarcasterUser[] {
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
  if (days >= 365) return "text-red-400 bg-red-500/10 border border-red-500/20";
  if (days >= 90) return "text-orange-400 bg-orange-500/10 border border-orange-500/20";
  if (days >= 60) return "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20";
  if (days >= 30) return "text-blue-400 bg-blue-500/10 border border-blue-500/20";
  return "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20";
}
