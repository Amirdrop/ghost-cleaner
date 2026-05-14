import { NextRequest, NextResponse } from "next/server";
import { getFollowing, getUserCasts } from "@/lib/farcaster";
import { calculateInactiveDays } from "@/lib/scoring";
import { FarcasterUser } from "@/types/user";

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
      const data = await getFollowing(parseInt(fid), 100, cursor);

      if (!data.users || data.users.length === 0) break;

      for (const user of data.users) {
        let lastActiveDate: string | null = null;

        try {
          const casts = await getUserCasts(user.fid, 1);
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
      hasMore = !!cursor && data.users.length === 100;
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
