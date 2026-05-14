import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DonateButton from "@/components/DonateButton";
import CreatorBadge from "@/components/CreatorBadge";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ghost Cleaner — Farcaster Following Manager",
  description:
    "Detect and unfollow inactive Farcaster accounts. Keep your following list clean.",
  keywords: ["farcaster", "ghost", "unfollow", "cleaner", "web3"],
  icons: {
    icon: "/ghost-icon.svg",
    shortcut: "/ghost-icon.svg",
    apple: "/ghost-icon.svg",
  },
  openGraph: {
    title: "Ghost Cleaner",
    description: "Find and unfollow inactive Farcaster accounts",
    type: "website",
    images: ["/ghost-icon.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.className} bg-[#0d0d12] text-[#E8E8ED] min-h-screen antialiased`}
        style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
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
