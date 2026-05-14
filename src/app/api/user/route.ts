import { NextRequest, NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || "";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/user/by_username?username=${username}`,
      {
        headers: {
          "x-api-key": NEYNAR_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json({
      fid: data.user.fid,
      username: data.user.username,
      displayName: data.user.display_name,
      pfpUrl: data.user.pfp_url,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
