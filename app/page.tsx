import { PortfolioShell } from "./components/portfolio-shell";
import { HeroIntro } from "./components/hero-intro";
import { NextSectionButton } from "./components/next-section-button";
import { HomeStage } from "./components/home-stage";
import { HomeCards } from "./components/home-cards";
import { HomeMobileWork } from "./components/home-mobile-work";
import { HomeAboutTeaser } from "./components/home-about-teaser";
import { AboutContact } from "./components/about/about-contact";

const companies = [
  "TikTok",
  "Airbnb",
  "CloudKitchens",
  "DiDi",
];

const marqueeCompanies = [
  ...companies,
  ...companies,
  ...companies,
  ...companies,
];

export default function Home() {
  return (
    // No padding under the stage from lg: with it the page would be a few
    // pixels taller than the screen, and scroll.
    <PortfolioShell
      sidebarTheme="stage"
      // From lg the stage paints the page its studio's paper colour; in the
      // cards view `home-page` makes it a plain sheet (globals.css).
      mainClassName="home-page bg-[var(--studio-paper,#ffffff)] text-[#171717]"
      contentClassName="min-w-0 px-6 pb-5 pt-2 sm:px-10 xl:px-14 lg:pb-0 lg:pt-3 2xl:px-16"
    >
      {/* From lg the page has two views of the same twelve projects, and shows
          one (app/lib/home-view.ts; the switch is in the navigation panel, on
          the index's "Work" line):

          - the stage — patent drawings that the sticker agents build into
            objects, one at a time, filling one screen with no page to scroll;
          - the cards — Tony's hand-made cards, all at once, in a page that
            scrolls.

          Both are in the page and CSS shows one, by `<html data-home-view>`,
          which a script in the root layout sets before anything is painted —
          so a visit that reloads in the cards view does not see the stage's
          loader first. Below lg there are no views: the sticker hero, the
          cards, experience and contact in one scroll (the 3D stage is neither
          shown nor downloaded there). */}
      <div data-home="stage" className="hidden lg:block">
        <HomeStage />
      </div>
      <div data-home="cards" className="hidden lg:block">
        <HomeCards />
      </div>
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="marquee-viewport -mx-6 hidden overflow-hidden py-1 sm:-mx-10 sm:block lg:hidden">
          <div className="marquee-track flex min-w-max text-lg font-semibold tracking-[-0.045em] text-black/18 sm:text-2xl">
            {[0, 1].map((group) => (
              <div
                key={group}
                className="flex shrink-0 gap-7 pr-7"
                aria-hidden={group === 1}
              >
                {marqueeCompanies.map((company, index) => (
                  <span key={`${group}-${company}-${index}`} className="shrink-0">
                    {company}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section
          id="about"
          className="flex min-h-[calc(100svh-48px)] scroll-mt-8 items-center py-14 lg:hidden"
        >
          {/* pb biases the centered block upward: the bottom-hanging stickers
              add visual weight below the headline, so true optical center sits
              lower than the flex center. The padding lifts content to balance. */}
          <div className="w-full pb-[12vh]">
            {/* One collage hero in two arrangements: the 4-line statement from
                sm (tablet + desktop) and 6 lines on phones, both with
                word-anchored stickers and the same motion. */}
            <div className="hidden sm:block">
              <HeroIntro layout="wide" />
            </div>
            <div className="sm:hidden">
              <HeroIntro layout="compact" />
            </div>
          </div>
        </section>

        {/* Phones and tablets only: the stage's figures as stills you swipe,
            or Tony's cards — the desktop's two views as a switch. */}
        <HomeMobileWork />

        {/* Phones and tablets only. From lg up the page is the stage alone and
            does not scroll. Career and patents live on the About page. */}
        <div className="lg:hidden">
          <HomeAboutTeaser />
          <AboutContact />
        </div>
      </div>
      {/* The pill points at the next section down; from lg there is none. */}
      <div className="lg:hidden">
        <NextSectionButton theme="light" rootSelector="main" yieldTo="#stage" />
      </div>
    </PortfolioShell>
  );
}
