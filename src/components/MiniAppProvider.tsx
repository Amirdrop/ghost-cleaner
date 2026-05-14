"use client";

import { useEffect } from "react";

export default function MiniAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    async function ready() {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.actions.ready();
      } catch (e) {
        console.log("ready() failed:", e);
      }
    }
    ready();
  }, []);

  return <>{children}</>;
}
