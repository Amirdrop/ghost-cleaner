import { NextRequest, NextResponse } from "next/server";
import { getUserCasts } from "@/lib/farcaster";
import { calculateInactiveDays } from "@/lib/scoring";

export async function POST(req: NextRequest) {
  const { fids } = await req.json();

  if (!fids || !Array.isArray(fids)) {
    return NextResponse.json({ error: "FIDs array is required" }, { status: 400 });
  }

  try {
    const results = await Promise.all(
      fids.map(async (fid: number) => {
        try {
          const casts = await getUserCasts(fid, 1);
          let lastActiveDate: string | null = null;

          if (casts.casts && casts.casts.length > 0) {
            lastActiveDate = casts.casts[0].timestamp;
          }

          return {
            fid,
            lastActiveDate,
            inactiveDays: calculateInactiveDays(lastActiveDate),
          };
        } catch {
          return {
            fid,
            lastActiveDate: null,
            inactiveDays: 999,
          };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error analyzing:", error);
    return NextResponse.json(
      { error: "Failed to analyze" },
      { status: 500 }
    );
  }
}
