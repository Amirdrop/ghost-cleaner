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
  if (days >= 365) return "1+ tahun tidak aktif";
  if (days >= 90) return "3+ bulan tidak aktif";
  if (days >= 60) return "2+ bulan tidak aktif";
  if (days >= 30) return "1+ bulan tidak aktif";
  return "Aktif";
}

export function getInactivityColor(days: number): string {
  if (days >= 365) return "text-red-600 bg-red-50";
  if (days >= 90) return "text-orange-600 bg-orange-50";
  if (days >= 60) return "text-yellow-600 bg-yellow-50";
  if (days >= 30) return "text-blue-600 bg-blue-50";
  return "text-green-600 bg-green-50";
}
