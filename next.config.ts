import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/.well-known/farcaster.json",
        destination:
          "https://api.farcaster.xyz/miniapps/hosted-manifest/019e28bd-fe4b-ff19-085b-3001416b1eca",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
