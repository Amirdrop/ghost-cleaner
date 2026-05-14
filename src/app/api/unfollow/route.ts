import { NextRequest, NextResponse } from "next/server";
import {
  NobleEd25519Signer,
  FarcasterNetwork,
  getSSLHubRpcClient,
  makeLinkRemove,
} from "@farcaster/hub-nodejs";

const HUB_URL = "hub.pinata.cloud:2283";

export async function POST(req: NextRequest) {
  try {
    const { fid, targetFids, privateKey } = await req.json();

    if (!fid || !targetFids || !Array.isArray(targetFids) || !privateKey) {
      return NextResponse.json(
        { error: "fid, privateKey, and targetFids array required" },
        { status: 400 }
      );
    }

    // Create signer from private key (sent from browser)
    const privateKeyBytes = Uint8Array.from(Buffer.from(privateKey, "hex"));
    const signer = new NobleEd25519Signer(privateKeyBytes);

    const client = getSSLHubRpcClient(HUB_URL);
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const targetFid of targetFids) {
      try {
        // Create link remove message (unfollow)
        const linkRemoveResult = await makeLinkRemove(
          { type: "follow", targetFid },
          { fid, network: FarcasterNetwork.MAINNET },
          signer
        );

        if (linkRemoveResult.isErr()) {
          results.failed++;
          results.errors.push(`FID ${targetFid}: ${linkRemoveResult.error}`);
          continue;
        }

        // Submit to Hub
        const submitResult = await client.submitMessage(linkRemoveResult.value);

        if (submitResult.isErr()) {
          results.failed++;
          results.errors.push(`FID ${targetFid}: Hub rejected - ${submitResult.error}`);
          continue;
        }

        results.success++;
      } catch (err: any) {
        results.failed++;
        results.errors.push(`FID ${targetFid}: ${err.message}`);
      }
    }

    client.close();

    return NextResponse.json({
      success: results.success,
      failed: results.failed,
      errors: results.errors,
    });
  } catch (error: any) {
    console.error("Unfollow error:", error);
    return NextResponse.json(
      { error: `Unfollow failed: ${error.message}` },
      { status: 500 }
    );
  }
}
