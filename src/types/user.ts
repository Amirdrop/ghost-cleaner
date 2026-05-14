export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  followerCount: number;
  followingCount: number;
  lastActiveDate: string | null;
  inactiveDays: number;
  bio: string;
}

export type InactivityFilter = 30 | 60 | 90 | 365;

export interface ScanResult {
  users: FarcasterUser[];
  totalFollowing: number;
  filteredCount: number;
  scannedAt: string;
}

export interface UnfollowResult {
  fid: number;
  success: boolean;
  error?: string;
}
