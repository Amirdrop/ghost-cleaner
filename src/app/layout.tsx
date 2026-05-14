import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import DonateButton from "@/components/DonateButton";
import CreatorBadge from "@/components/CreatorBadge";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Ghost Cleaner — Farcaster Following Manager",
  description:
    "Detect and unfollow inactive Farcaster accounts. Keep your following list clean.",
  keywords: ["farcaster", "ghost", "unfollow", "cleaner", "web3"],
  openGraph: {
    title: "Ghost Cleaner",
    description: "Find and unfollow inactive Farcaster accounts",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.className} bg-[#0d0d12] text-[#E8E8ED] min-h-screen antialiased`}
      >
        <div className="relative min-h-screen">
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#8A63D2]/[0.04] rounded-full blur-[100px]" />
            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#5B8DEF]/[0.04] rounded-full blur-[100px]" />
          </div>
          {children}
          <CreatorBadge />
          <DonateButton />
        </div>
      </body>
    </html>
  );
}
