import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DonateButton from "@/components/DonateButton";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ghost Cleaner — Farcaster Following Manager",
  description:
    "Detect and unfollow inactive Farcaster accounts. Keep your following list clean and meaningful.",
  keywords: ["farcaster", "ghost", "unfollow", "cleaner", "web3"],
  openGraph: {
    title: "Ghost Cleaner",
    description: "Find and unfollow inactive Farcaster accounts",
    type: "website",
    siteName: "Ghost Cleaner",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-[#0a0a0f] text-zinc-200 min-h-screen antialiased`}
      >
        <div className="relative min-h-screen">
          {/* Background gradient */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
          </div>
          {children}
          <DonateButton />
        </div>
      </body>
    </html>
  );
}
