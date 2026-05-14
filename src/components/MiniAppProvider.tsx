"use client";

import { useEffect } from "react";

export default function MiniAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const initMiniApp = async () => {
      try {
        const mod = await import("@farcaster/miniapp-sdk");
        const sdk = (mod as any).default;
        if (sdk && typeof sdk.ready === "function") {
          await sdk.ready();
          console.log("Mini App ready!");
        }
      } catch (err) {
        console.log("Not in Farcaster Mini App context:", err);
      }
    };

    initMiniApp();
  }, []);

  return <>{children}</>;
}
