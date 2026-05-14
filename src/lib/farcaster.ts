const WARPCAST_BASE = "https://api.warpcast.com/v2";

export async function getFollowing(
  fid: number,
  limit: number = 50,
  cursor?: string
) {
  const params = new URLSearchParams();
  params.set("fid", fid.toString());
  params.set("limit", Math.min(limit, 50).toString());
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(`${WARPCAST_BASE}/following?${params}`, {
    headers: { "User-Agent": "GhostCleaner/1.0" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch following: ${res.status}`);
  }

  const data = await res.json();
  const users = (data.result?.users || []).map((u: any) => ({
    fid: u.fid,
    username: u.username,
    display_name: u.displayName,
    pfp_url: u.pfp?.url || "",
    follower_count: u.followerCount || 0,
    following_count: u.followingCount || 0,
    profile: { bio: { text: u.profile?.bio?.text || "" } },
  }));

  return {
    users,
    next: data.result?.next ? { cursor: data.result.next.cursor } : undefined,
  };
}

export async function getUserByFid(fid: number) {
  const res = await fetch(`${WARPCAST_BASE}/user?fid=${fid}`, {
    headers: { "User-Agent": "GhostCleaner/1.0" },
  });

  if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);

  const data = await res.json();
  const u = data.result?.user;
  if (!u) throw new Error("User not found");

  return {
    fid: u.fid,
    username: u.username,
    display_name: u.displayName,
    pfp_url: u.pfp?.url || "",
    follower_count: u.followerCount || 0,
    following_count: u.followingCount || 0,
    profile: { bio: { text: u.profile?.bio?.text || "" } },
  };
}

export async function getUserByUsername(username: string) {
  const res = await fetch(
    `${WARPCAST_BASE}/user-by-username?username=${username}`,
    { headers: { "User-Agent": "GhostCleaner/1.0" } }
  );

  if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);

  const data = await res.json();
  const u = data.result?.user;
  if (!u) throw new Error("User not found");

  return {
    fid: u.fid,
    username: u.username,
    display_name: u.displayName,
    pfp_url: u.pfp?.url || "",
    follower_count: u.followerCount || 0,
    following_count: u.followingCount || 0,
    profile: { bio: { text: u.profile?.bio?.text || "" } },
  };
}

export async function getUserCasts(fid: number, limit: number = 1) {
  const res = await fetch(
    `${WARPCAST_BASE}/casts?fid=${fid}&limit=${limit}`,
    { headers: { "User-Agent": "GhostCleaner/1.0" } }
  );

  if (!res.ok) throw new Error(`Failed to fetch casts: ${res.status}`);

  const data = await res.json();
  const casts = (data.result?.casts || []).map((c: any) => ({
    timestamp: c.timestamp ? new Date(c.timestamp).toISOString() : null,
    text: c.text || "",
  }));

  return { casts };
}

export async function unfollowUser(signerUuid: string, targetFid: number) {
  throw new Error(
    "Unfollow belum didukung tanpa Neynar API key. Fitur ini coming soon."
  );
}
