import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "./components/custom-cursor";
import { ScrollReset } from "./components/scroll-reset";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Newsreader — elegant serif italic for the hero's mixed-weight headline.
// Refined, medium-weight italic that contrasts against the black sans.
const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: "italic",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Tony Xing - Product Designer",
  description:
    "Tony Xing is a Lead Product Designer at TikTok, previously at Airbnb and CloudKitchens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScrollReset />
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
