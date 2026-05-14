import { NextRequest, NextResponse } from "next/server";
import { getFollowing, getUserCasts } from "@/lib/farcaster";
import { calculateInactiveDays } from "@/lib/scoring";
import { FarcasterUser } from "@/types/user";

// Rate limiter: max 9 requests per 10 seconds for Warpcast API
const RATE_LIMIT_INTERVAL = 1100; // 1.1 seconds between requests
let lastRequestTime = 0;

async function rateLimitedGetCasts(fid: number) {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < RATE_LIMIT_INTERVAL) {
    await new Promise((r) => setTimeout(r, RATE_LIMIT_INTERVAL - elapsed));
  }
  lastRequestTime = Date.now();
  return getUserCasts(fid, 1);
}

export async function GET(req: NextRequest) {
  const fid = req.nextUrl.searchParams.get("fid");

  if (!fid) {
    return NextResponse.json({ error: "FID is required" }, { status: 400 });
  }

  try {
    const allUsers: FarcasterUser[] = [];
    let cursor: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const data = await getFollowing(parseInt(fid), 50, cursor);

      if (!data.users || data.users.length === 0) break;

      for (const user of data.users) {
        let lastActiveDate: string | null = null;

        try {
          const casts = await rateLimitedGetCasts(user.fid);
          if (casts.casts && casts.casts.length > 0) {
            lastActiveDate = casts.casts[0].timestamp;
          }
        } catch {
          // Skip if can't fetch casts
        }

        const inactiveDays = calculateInactiveDays(lastActiveDate);

        allUsers.push({
          fid: user.fid,
          username: user.username,
          displayName: user.display_name || user.username,
          pfpUrl: user.pfp_url || "",
          followerCount: user.follower_count || 0,
          followingCount: user.following_count || 0,
          lastActiveDate,
          inactiveDays,
          bio: user.profile?.bio?.text || "",
        });
      }

      cursor = data.next?.cursor;
      hasMore = !!cursor && data.users.length === 50;
    }

    return NextResponse.json({
      users: allUsers,
      totalFollowing: allUsers.length,
      scannedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json(
      { error: "Failed to fetch following" },
      { status: 500 }
    );
  }
}
