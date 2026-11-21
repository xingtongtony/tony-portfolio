import type { Metadata } from "next";
import { PortfolioShell } from "../components/portfolio-shell";
import { HeroIntro } from "../components/hero-intro";
import { Career } from "../components/about/career";
import { Recognition } from "../components/about/recognition";
import { AboutContact } from "../components/about/about-contact";

// The career ruler runs to "now". Regenerate the page at most once a day, so
// the current roles grow by themselves between deploys.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "About - Tony Xing",
  description:
    "Tony Xing is a product designer who has led design at TikTok, CloudKitchens and Airbnb — from illustration and motion graphics to design systems and TV.",
};

/**
 * About: who Tony is, where he has worked, how to reach him. Content from his
 * LinkedIn profile (app/lib/about.ts).
 *
 * The statement (the sticker collage phones also open the homepage with), then
 * a bio whose skills you can press to light the roles that used them, a career
 * ruler you can scrub, patents that draw themselves, and contact.
 */
export default function About() {
  // The month the page was generated: the ruler's "now" (refreshed daily, see revalidate).
  const d = new Date();
  const now = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return (
    <PortfolioShell sidebarTheme="light" current="about">
      <div className="mx-auto w-full max-w-[1280px]">
        <section id="about" className="flex min-h-[72svh] scroll-mt-8 items-center py-14 lg:py-16">
          {/* The stickers hang below the headline; the padding lifts the block to its optical centre. */}
          <div className="w-full pb-[8vh]">
            <div className="hidden sm:block">
              <HeroIntro layout="wide" />
            </div>
            <div className="sm:hidden">
              <HeroIntro layout="compact" />
            </div>
          </div>
        </section>
        <Career now={now} />
        <Recognition />
        <AboutContact />
      </div>
    </PortfolioShell>
  );
}
