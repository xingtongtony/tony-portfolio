import type { Metadata } from "next";
import { PortfolioShell } from "../components/portfolio-shell";
import { HeroIntro } from "../components/hero-intro";
import { ContactSection, ExperienceSection } from "../components/home-sections";

export const metadata: Metadata = {
  title: "About - Tony Xing",
  description: "Tony Xing is a Lead Product Designer at TikTok, previously at Airbnb and CloudKitchens.",
};

/**
 * About: who Tony is, where he has worked, how to reach him.
 *
 * From lg the homepage is the blueprint stage alone — one screen that moves
 * sideways and does not scroll — so what used to sit under it lives here:
 * the statement (the sticker collage phones still open with), Experience and
 * Contact. One page, one scroll.
 */
export default function About() {
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
        <ExperienceSection />
        <ContactSection />
      </div>
    </PortfolioShell>
  );
}
