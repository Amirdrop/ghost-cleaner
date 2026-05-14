const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || process.env.NEXT_PUBLIC_NEYNAR_API_KEY || "";
const NEYNAR_BASE = "https://api.neynar.com/v2/farcaster";

export async function getFollowing(
  fid: number,
  limit: number = 100,
  cursor?: string
) {
  const params = new URLSearchParams();
  params.set("fid", fid.toString());
  params.set("limit", limit.toString());
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(`${NEYNAR_BASE}/following?${params}`, {
    headers: {
      "x-api-key": NEYNAR_API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch following: ${res.status}`);
  }

  return res.json();
}

export async function getUserByFid(fid: number) {
  const res = await fetch(`${NEYNAR_BASE}/user?fid=${fid}`, {
    headers: {
      "x-api-key": NEYNAR_API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status}`);
  }

  return res.json();
}

export async function getUserCasts(fid: number, limit: number = 1) {
  const res = await fetch(
    `${NEYNAR_BASE}/casts?fid=${fid}&limit=${limit}`,
    {
      headers: {
        "x-api-key": NEYNAR_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch casts: ${res.status}`);
  }

  return res.json();
}

export async function unfollowUser(signerUuid: string, targetFid: number) {
  const res = await fetch(`${NEYNAR_BASE}/follow`, {
    method: "DELETE",
    headers: {
      "x-api-key": NEYNAR_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      signer_uuid: signerUuid,
      target_fids: [targetFid],
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to unfollow: ${res.status} - ${error}`);
  }

  return res.json();
}
