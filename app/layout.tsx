import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "./components/custom-cursor";
import { ScrollReset } from "./components/scroll-reset";
import { PageTransitions } from "./components/page-transitions";
import { HOME_VIEW_SCRIPT } from "./lib/home-view-key";

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
      // The script below sets `data-home-view` on this element before React
      // starts, so its attributes may differ from what the server sent.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Which of the homepage's two views this visit is on (app/lib/
            home-view.ts), said before anything is painted. It is here, not in
            the homepage, because a layout is only ever rendered by the server:
            React does not run a script it renders in the browser, and warns
            about one it finds there. */}
        <script dangerouslySetInnerHTML={{ __html: HOME_VIEW_SCRIPT }} />
        <ScrollReset />
        <PageTransitions>{children}</PageTransitions>
        <CustomCursor />
      </body>
    </html>
  );
}
