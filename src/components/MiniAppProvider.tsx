"use client";

import { useEffect, useState } from "react";

export default function MiniAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initMiniApp = async () => {
      try {
        // Dynamically import the SDK to avoid SSR issues
        const { sdk } = await import("@farcaster/miniapp-sdk");

        // Call ready() to hide the splash screen
        await sdk.actions.ready();
        setIsReady(true);
      } catch (err) {
        // Not running inside a Farcaster client, that's fine
        console.log("Not in Farcaster Mini App context");
        setIsReady(true);
      }
    };

    initMiniApp();
  }, []);

  return <>{children}</>;
}
