import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioShell } from "./components/portfolio-shell";
import { StaggerGrid, StaggerItem } from "./components/motion";
import { HeroIntro } from "./components/hero-intro";
import { NextSectionButton } from "./components/next-section-button";
import { HomeStage } from "./components/home-stage";
import { HomeCards } from "./components/home-cards";
import { ContactSection, ExperienceSection } from "./components/home-sections";
import { WORK_CARDS as work } from "./lib/work-cards";

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
      {/* From lg the page has two views of the same eleven projects, and shows
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

        {/* Phones and tablets only. From lg up the cards are the homepage's
            second view (HomeCards above), in their own layout. */}
        <section id="work" data-case-section className="scroll-mt-8 py-10 lg:hidden">
          <div className="mb-9 max-w-2xl">
            <div>
              <p className="section-label">Work</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
                Case studies
              </h2>
            </div>
          </div>

          <StaggerGrid className="grid w-full gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))] lg:gap-6 2xl:gap-7">
            {work.map((project, index) => {
              const cardContent = (
                <>
                  <div className="absolute -inset-1 rounded-[1.4rem] bg-[var(--card-hover)] opacity-0 blur-lg transition duration-500 group-hover:opacity-10" />
                  <div className="relative overflow-hidden rounded-[1.25rem] bg-white shadow-[0_6px_28px_rgba(35,29,16,0.035)] transition duration-300 group-hover:shadow-[0_10px_42px_var(--card-glow)]">
                    <div className="relative aspect-[1600/1880] overflow-hidden bg-[#e8e1d3]">
                      <Image
                        src={project.image}
                        alt={`${project.title} preview`}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.008]"
                      />
                      {/* Hover reveals the label on desktop. Touch screens have
                          no hover, so a Coming Soon card keeps its label on —
                          otherwise it looks tappable and does nothing. */}
                      <div className={`pointer-events-none absolute left-4 top-4 translate-y-1 rounded-full border border-white/45 bg-white/78 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/78 opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${project.href ? "" : "pointer-coarse:translate-y-0 pointer-coarse:opacity-100"}`}>
                        {project.period}
                      </div>
                    </div>
                  </div>
                </>
              );

              const cardStyle = {
                "--card-hover": project.hoverColor,
                "--card-glow": project.glowColor,
              } as CSSProperties;

              const isCaseStudy = project.period === "Case Study";

              if (project.href) {
                return (
                  <StaggerItem key={project.title} index={index}>
                    <Link
                      href={project.href}
                      style={cardStyle}
                      className="group relative block w-full overflow-visible rounded-[1.25rem]"
                      aria-label={`Open ${project.title} case study`}
                      data-cursor="view"
                    >
                      {cardContent}
                    </Link>
                  </StaggerItem>
                );
              }

              return (
                <StaggerItem key={project.title} index={index}>
                  <article
                    style={cardStyle}
                    className="group relative w-full overflow-visible rounded-[1.25rem]"
                    {...(isCaseStudy ? { "data-cursor": "view" } : {})}
                  >
                    {cardContent}
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        </section>

        {/* Phones and tablets only. From lg up the page is the stage alone and
            does not scroll; these two are on the About page. */}
        <div className="lg:hidden">
          <ExperienceSection />
          <ContactSection />
        </div>
      </div>
      {/* The pill points at the next section down; from lg there is none. */}
      <div className="lg:hidden">
        <NextSectionButton theme="light" rootSelector="main" yieldTo="#stage" />
      </div>
    </PortfolioShell>
  );
}
