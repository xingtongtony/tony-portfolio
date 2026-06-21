import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioShell } from "../../components/portfolio-shell";
import { CaseStudyFooter } from "../../components/case-study";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import {
  eyebrowSection,
  eyebrowMeta,
  surfaceQuiet,
  surfaceDefault,
  bodyMd,
  bodySm,
  emphasis,
  cardHoverDark,
} from "../../lib/tokens";

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design"],
  ["Platform", "TV"],
  ["Problem", "Choice impact"],
];

const iterations = [
  ["V1", "Nav covered on videos too much", "/portfolio/tiktok-tv-navigation/tv-nav-03.jpg"],
  ["V2", "Transition of animation on large screen is too dramatic", "/portfolio/tiktok-tv-navigation/tv-nav-04.jpg"],
  ["V3", "Go to setting & feedback tab take too much effort", "/portfolio/tiktok-tv-navigation/tv-nav-05.jpg"],
  ["V4", "Covered too much on landscape videos", "/portfolio/tiktok-tv-navigation/tv-nav-06.jpg"],
];

const categoryPenetration: [string, string][] = [
  ["FYF", "48.59%"],
  ["Trending", "6.79%"],
  ["Following", "6.09%"],
  ["Comedy", "4.88%"],
  ["Dancing", "4.51%"],
  ["Entertainment", "3.81%"],
  ["Fashion", "0.96%"],
  ["News", "0.65%"],
  ["Family", "0.58%"],
];

const relatedCases = [
  {
    title: "TV Visual Revamp",
    body: "Redefine the TikTok TV visual and motion system, improve fundamental principles.",
    image: "/portfolio/tiktok-tv-navigation/tv-nav-09.png",
    href: "/work/tiktok-tv-visual",
  },
  {
    title: "My & Others Profile",
    body: "Differentiated profile designs meet user consumption needs across different scenarios.",
    image: "/portfolio/tiktok-tv-navigation/tv-nav-10.png",
    href: "/work/tiktok-tv-profile",
  },
  {
    title: "Search & Result",
    body: "The first TV search feature specifically designed for short videos.",
    image: "/portfolio/tiktok-tv-navigation/tv-nav-11.png",
    href: "/work/tiktok-tv-search",
  },
];

function CaseSection({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className} data-case-section>
      <Reveal>
        <p className={eyebrowSection}>{eyebrow}</p>
        <h2 className="mt-4 max-w-4xl text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-white sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[1.375rem] font-semibold leading-[1.2] tracking-[-0.02em] text-white sm:text-[1.5rem]">
      {children}
    </h3>
  );
}

function VideoFrame({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  return (
    <video
      src={src}
      className={`block h-auto w-full rounded-[1.5rem] ${className}`}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
    />
  );
}

function ImageFrame({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={`h-auto w-full rounded-[1.5rem] ${className}`}
    />
  );
}

export default function TikTokTvNavigationPage() {
  return (
    <PortfolioShell
      sidebarTheme="tiktok-tv"
      mainClassName="bg-[#161616] text-white"
      rootBg="#161616"
      contentClassName="min-w-0 bg-[#161616] text-white"
    >
      <article className="mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 sm:pt-10 lg:px-14 lg:pb-24 lg:pt-14">
        {/* HERO */}
        <figure className="overflow-hidden rounded-[1.75rem]">
          <Image
            src="/portfolio/tiktok-tv-navigation/tv-nav-01.jpg"
            alt="TikTok TV navigation in a living room TV interface"
            width={2700}
            height={1605}
            priority
            className="h-auto w-full"
          />
        </figure>

        {/* TITLE + OVERVIEW */}
        <section className="pb-12 pt-14 lg:pb-16 lg:pt-20">
          <p className={eyebrowMeta}>Apr 2024 — Oct 2024</p>

          <h1 className="mt-6 max-w-[18ch] text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1] tracking-[-0.03em] text-white text-balance">
            TikTok TV Navigation
          </h1>

          <div className="mt-12">
            <p className={eyebrowSection}>Overview</p>
            <p className="mt-6 max-w-3xl text-lg leading-[1.5] tracking-[-0.01em] text-white/72">
              We are enhancing the left navigation bar by removing features
              that are less used and elevating specific categories from the
              Categories page. This initiative aims to deliver a streamlined
              watching experience, minimizing user decision fatigue.
            </p>
          </div>

          {/* METADATA STRIP — sits between the lead summary and the
              supporting Netflix-research paragraph, matching the source
              page's reading order. */}
          <dl
            className={`mt-10 grid overflow-hidden rounded-[1.25rem] sm:grid-cols-2 lg:grid-cols-4 ${surfaceQuiet}`}
          >
            {projectStats.map(([label, value], i) => (
              <div
                key={label}
                className={`px-6 py-5 ${
                  i > 0 ? "border-t border-white/[0.05] sm:border-t-0" : ""
                } ${
                  i % 2 === 1 ? "sm:border-l sm:border-white/[0.05]" : ""
                } ${
                  i >= 2
                    ? "sm:border-t sm:border-white/[0.05] lg:border-t-0 lg:border-l lg:border-white/[0.05]"
                    : ""
                } ${
                  i === 1 ? "lg:border-l lg:border-white/[0.05]" : ""
                } ${
                  i === 3 ? "lg:border-l lg:border-white/[0.05]" : ""
                }`}
              >
                <dt className={eyebrowMeta}>{label}</dt>
                <dd className="mt-3 text-[15px] font-medium leading-6 text-white/82">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

        </section>

        {/* SECTION FLOW */}
        <div className="mt-32 flex flex-col gap-32 lg:mt-40 lg:gap-40">
          {/* PROBLEMS — Choice impact */}
          <CaseSection eyebrow="Problems" title="Choice impact">
            <Reveal>
              <p className={`mt-8 max-w-3xl ${bodyMd}`}>
                According to Netflix research, streaming services should help
                users find something to watch in{" "}
                <strong className={emphasis}>90 seconds</strong> to keep them
                from looking elsewhere. Too many choices slow down how fast
                users
                pick something to watch, and may push them off the platform
                entirely.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src="/portfolio/tiktok-tv-navigation/tv-nav-02.jpg"
                alt="TikTok TV navigation concept supporting Netflix's 90-second discovery rule"
                width={1920}
                height={1080}
              />
            </Reveal>
          </CaseSection>

          {/* BACKGROUND — Necessary but not important */}
          <CaseSection eyebrow="The fact" title="Necessary but not important">
            <Reveal>
              <p className={`mt-8 max-w-3xl ${bodyMd}`}>
                Not all categories get the same attention. Most categories —
                Family, News, Fashion, Daily Life, Beauty, Autos, Animals,
                Food, Lip Sync, and Animation — attract less than 2% of users
                who check out the Categories tab.
              </p>
            </Reveal>

            <StaggerGrid className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {categoryPenetration.map(([name, pct], i) => (
                <StaggerItem key={name} index={i}>
                  <div
                    className={`h-full rounded-[1.25rem] px-5 py-5 ${surfaceDefault}`}
                  >
                    <p className="text-base font-medium leading-[1.2] text-white">
                      {name}
                    </p>
                    <p className={`mt-3 ${eyebrowMeta}`}>Penetration</p>
                    <p className="mt-1 text-[17px] font-medium leading-[1.3] text-white/82">
                      {pct}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>

          {/* ITERATIONS */}
          <CaseSection eyebrow="Process" title="Four iterations in">
            <Reveal>
              <p className={`mt-8 max-w-3xl ${bodyMd}`}>
                <strong className={emphasis}>
                  Upon arrival, users should be able to start watching a video
                  promptly.
                </strong>{" "}
                Shortening the search time matters because TikTok
                operates differently from subscription platforms: users
                don&apos;t browse for a specific title — they expect immediate
                content.
              </p>
            </Reveal>

            <StaggerGrid className="mt-10 grid gap-x-12 gap-y-12 sm:grid-cols-2">
              {iterations.map(([label, body, image], i) => (
                <StaggerItem key={label} index={i}>
                  <Image
                    src={image}
                    alt={`${label} iteration of TikTok TV navigation`}
                    width={1920}
                    height={1080}
                    className="h-auto w-full rounded-[1.5rem]"
                  />
                  <p className={`mt-5 ${bodyMd}`}>
                    <span className="font-semibold text-white">{label}:</span>{" "}
                    {body}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>

          {/* SOLUTION — Reduce visual disruption.
              Block order mirrors the source case study (tongxingdesign.com):
              para → two screenshots → two paras → video → "animation /
              Tracking user attention" subsection → video. Do not reshuffle. */}
          <CaseSection eyebrow="The new visual" title="Reduce visual disruption">
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                Video content is the top priority on TikTok TV. We aimed to
                minimize the impact of other elements on the page that could
                distract from the viewing experience.
              </p>
            </Reveal>

            <Reveal className="mt-10 grid gap-x-12 gap-y-5 sm:grid-cols-2">
              <ImageFrame
                src="/portfolio/tiktok-tv-navigation/tv-nav-07.jpg"
                alt="TikTok TV feed with the navigation minimized"
                width={1920}
                height={1080}
              />
              <ImageFrame
                src="/portfolio/tiktok-tv-navigation/tv-nav-08.jpg"
                alt="TikTok TV navigation revealed for category discovery"
                width={1920}
                height={1080}
              />
            </Reveal>

            <Reveal className={`mt-10 max-w-3xl ${bodyMd}`}>
              <p>
                But we still wanted{" "}
                <strong className={emphasis}>users to explore</strong> content
                from other categories. The navigation became a vessel for
                category discovery: because short videos tolerate partial
                occlusion, it stays partially visible during consumption rather
                than fully hidden.
              </p>
            </Reveal>

            {/* Only this paragraph is left-right with its video (per source). */}
            <Reveal className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
              <p className={bodyMd}>
                We{" "}
                <strong className={emphasis}>simplified the interface</strong>{" "}
                around a dark aesthetic and line iconography to{" "}
                <strong className={emphasis}>reduce visual disruption</strong>{" "}
                and emphasize the feed, using a red bar to mark which category
                the user is watching.
              </p>
              <VideoFrame src="/portfolio/tiktok-tv-navigation/tv-nav-01.mp4" />
            </Reveal>

            {/* Sub-section: Animation / Tracking user attention */}
            <Reveal className="mt-20 max-w-3xl">
              <p className={eyebrowSection}>Animation</p>
              <div className="mt-3">
                <SubHeading>Tracking user attention</SubHeading>
              </div>
              <p className={`mt-5 ${bodyMd}`}>
                The navigation has a 48-pixel offset animation to more
                effectively capture and track the user&apos;s attention. The
                same logic applies to the secondary navigation.
              </p>
            </Reveal>

            <Reveal className="mt-8">
              <VideoFrame src="/portfolio/tiktok-tv-navigation/tv-nav-02.mp4" />
            </Reveal>
          </CaseSection>

          {/* RESULTS */}
          <CaseSection eyebrow="Impact" title="Results">
            <Reveal>
              <p className={`mt-8 max-w-3xl ${bodyMd}`}>
                After the full launch of the new navigation, TikTok TV
                playback time, video views, and active days all improved.
              </p>
            </Reveal>

            <Reveal
              className={`mt-10 rounded-[1.25rem] p-7 sm:p-9 ${surfaceDefault}`}
            >
              <div className="grid gap-10 sm:grid-cols-3 sm:items-end">
                <div>
                  <p className={eyebrowMeta}>Play duration</p>
                  <p className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-white">
                    +1.02%
                  </p>
                </div>
                <div>
                  <p className={eyebrowMeta}>Video view</p>
                  <p className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-white">
                    +1.2%
                  </p>
                </div>
                <div>
                  <p className={eyebrowMeta}>14-day active days</p>
                  <p className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-white/72">
                    +0.7%
                  </p>
                </div>
              </div>
            </Reveal>
          </CaseSection>

          {/* RELATED CASE STUDIES */}
          <CaseSection eyebrow="More work" title="Continue exploring">
            <StaggerGrid className="mt-8 grid gap-5 lg:grid-cols-3">
              {relatedCases.map((c, i) => {
                const cardContent = (
                  <>
                    <div className="overflow-hidden">
                      <Image
                        src={c.image}
                        alt={`${c.title} case study preview`}
                        width={1600}
                        height={1200}
                        className="h-auto w-full transition duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold leading-[1.25] tracking-[-0.02em] text-white">
                        {c.title}
                      </h3>
                      <p className={`mt-2 ${bodySm}`}>{c.body}</p>
                    </div>
                  </>
                );

                if (c.href) {
                  return (
                    <StaggerItem
                      key={c.title}
                      index={i}
                      className="h-full"
                    >
                      <Link
                        href={c.href}
                        data-cursor="view"
                        className={`group flex h-full flex-col overflow-hidden rounded-[1.25rem] ${surfaceDefault} ${cardHoverDark}`}
                      >
                        {cardContent}
                      </Link>
                    </StaggerItem>
                  );
                }

                return (
                  <StaggerItem
                    key={c.title}
                    index={i}
                    className="h-full"
                  >
                    <article
                      className={`group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] ${surfaceDefault}`}
                    >
                      <span className="absolute right-4 top-4 z-10 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70 backdrop-blur-sm">
                        Coming soon
                      </span>
                      {cardContent}
                    </article>
                  </StaggerItem>
                );
              })}
            </StaggerGrid>
          </CaseSection>
        </div>
        <CaseStudyFooter />
      </article>
      <NextSectionButton />
    </PortfolioShell>
  );
}
