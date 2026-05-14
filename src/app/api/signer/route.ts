import { NextRequest, NextResponse } from "next/server";
import {
  NobleEd25519Signer,
  FarcasterNetwork,
  getSSLHubRpcClient,
  makeLinkRemove,
} from "@farcaster/hub-nodejs";

const HUB_URL = "hub.pinata.cloud:2283";

// Store registered signers (public key -> fid mapping)
const registeredSigners = new Map<string, { fid: number; registeredAt: number }>();

// Register a public key for a FID (called after user approves in Warpcast)
export async function POST(req: NextRequest) {
  try {
    const { fid, publicKey } = await req.json();

    if (!fid || !publicKey) {
      return NextResponse.json({ error: "fid and publicKey required" }, { status: 400 });
    }

    // Store the mapping
    registeredSigners.set(publicKey, { fid, registeredAt: Date.now() });

    return NextResponse.json({
      success: true,
      fid,
      publicKey,
      message: "Signer registered. Make sure you've approved it in Warpcast.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Check signer status
export async function GET(req: NextRequest) {
  const publicKey = req.nextUrl.searchParams.get("publicKey");

  if (!publicKey) {
    return NextResponse.json({ error: "publicKey required" }, { status: 400 });
  }

  const registered = registeredSigners.get(publicKey);

  return NextResponse.json({
    registered: !!registered,
    fid: registered?.fid || null,
  });
}
