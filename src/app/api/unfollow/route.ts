import { NextRequest, NextResponse } from "next/server";
import { unfollowUser } from "@/lib/farcaster";

export async function POST(req: NextRequest) {
  const { signerUuid, targetFids } = await req.json();

  if (!signerUuid || !targetFids || !Array.isArray(targetFids)) {
    return NextResponse.json(
      { error: "signerUuid and targetFids array are required" },
      { status: 400 }
    );
  }

  try {
    const results = await Promise.allSettled(
      targetFids.map(async (targetFid: number) => {
        try {
          await unfollowUser(signerUuid, targetFid);
          return { fid: targetFid, success: true };
        } catch (error) {
          return {
            fid: targetFid,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      })
    );

    const unfollowResults = results.map((result) =>
      result.status === "fulfilled"
        ? result.value
        : { fid: 0, success: false, error: "Request failed" }
    );

    const successCount = unfollowResults.filter((r) => r.success).length;

    return NextResponse.json({
      results: unfollowResults,
      total: targetFids.length,
      success: successCount,
      failed: targetFids.length - successCount,
    });
  } catch (error) {
    console.error("Error unfollowing:", error);
    return NextResponse.json(
      { error: "Failed to unfollow" },
      { status: 500 }
    );
  }
}
