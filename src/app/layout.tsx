import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DonateButton from "@/components/DonateButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ghost Cleaner - Farcaster Following Manager",
  description:
    "Find and unfollow inactive Farcaster accounts. Keep your following list clean.",
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
      <body className={inter.className}>
        {children}
        <DonateButton />
      </body>
    </html>
  );
}
