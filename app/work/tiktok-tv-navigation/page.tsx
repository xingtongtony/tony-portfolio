import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioShell } from "../../components/portfolio-shell";

const eyebrowSection =
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40";
const eyebrowMeta =
  "text-[10px] font-semibold uppercase tracking-[0.14em] text-white/36";

const surfaceQuiet = "border border-white/[0.05] bg-white/[0.025]";
const surfaceDefault = "border border-white/[0.06] bg-white/[0.04]";

const bodyMd = "text-base leading-[1.55] text-white/64";
const bodySm = "text-sm leading-[1.5] text-white/56";

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
    href: null,
  },
  {
    title: "Search & Result",
    body: "The first TV search feature specifically designed for short videos.",
    image: "/portfolio/tiktok-tv-navigation/tv-nav-11.png",
    href: null,
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
    <section className={className}>
      <p className={eyebrowSection}>{eyebrow}</p>
      <h2 className="mt-4 max-w-4xl text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-white sm:text-4xl">
        {title}
      </h2>
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
      contentClassName="right-pane-enter min-w-0 bg-[#161616] text-white"
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
            <div className="mt-6 max-w-3xl flex flex-col gap-6 text-lg leading-[1.5] tracking-[-0.01em] text-white/72">
              <p>
                We are enhancing the left navigation bar by removing features
                that are less used and elevating specific categories from the
                Categories page. This initiative aims to deliver a streamlined
                watching experience, minimizing user decision fatigue.
              </p>
              <p>
                According to Netflix research, streaming services should help
                users find something to watch in 90 seconds to keep them from
                looking elsewhere. Too many choices slow down how fast users
                pick something to watch, and may push them off the platform
                entirely.
              </p>
            </div>
          </div>
        </section>

        {/* METADATA STRIP */}
        <dl
          className={`grid overflow-hidden rounded-[1.25rem] sm:grid-cols-2 lg:grid-cols-4 ${surfaceQuiet}`}
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

        {/* SECTION FLOW */}
        <div className="mt-32 flex flex-col gap-32 lg:mt-40 lg:gap-40">
          {/* BACKGROUND — Necessary but not important */}
          <CaseSection eyebrow="Background" title="Necessary but not important">
            <div className={`mt-8 max-w-3xl flex flex-col gap-7 ${bodyMd}`}>
              <p>
                Not all categories get the same attention. Most categories —
                Family, News, Fashion, Daily Life, Beauty, Autos, Animals,
                Food, Lip Sync, and Animation — attract less than 2% of users
                who check out the Categories tab.
              </p>
              <p>
                Upon arrival, users should be able to start watching a video
                promptly. Shortening the search time matters because TikTok
                operates differently from subscription platforms: users
                don&apos;t browse for a specific title — they expect immediate
                content.
              </p>
            </div>

            <ImageFrame
              src="/portfolio/tiktok-tv-navigation/tv-nav-02.jpg"
              alt="TikTok TV with the original category-heavy navigation"
              width={1920}
              height={1080}
              className="mt-10"
            />
          </CaseSection>

          {/* ITERATIONS */}
          <CaseSection eyebrow="Process" title="Four iterations in">
            <p className={`mt-8 max-w-3xl ${bodyMd}`}>
              Each round of the navigation surfaced its own trade-off — too
              much occlusion, too dramatic on large screens, too many steps to
              reach settings. We kept the visual changes small and the
              feedback loop tight.
            </p>

            <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2">
              {iterations.map(([label, body, image]) => (
                <div key={label}>
                  <Image
                    src={image}
                    alt={`${label} iteration of TikTok TV navigation`}
                    width={1920}
                    height={1080}
                    className="h-auto w-full rounded-[1.5rem]"
                  />
                  <p className={`mt-5 ${bodyMd}`}>
                    <span className="font-medium text-white">{label}:</span>{" "}
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </CaseSection>

          {/* SOLUTION — Reduce visual disruption */}
          <CaseSection eyebrow="The new visual" title="Reduce visual disruption">
            <div className={`mt-8 max-w-3xl flex flex-col gap-7 ${bodyMd}`}>
              <p>
                Video content is the top priority on TikTok TV. We aimed to
                minimize the impact of other elements on the page that could
                distract from the viewing experience.
              </p>
              <p>
                But we still wanted users to explore content from other
                categories. The navigation became a vessel for category
                discovery: because short videos tolerate partial occlusion, it
                stays partially visible during consumption rather than fully
                hidden.
              </p>
              <p>
                We simplified the interface around a dark aesthetic and line
                iconography to reduce visual disruption and emphasize the
                feed, using a red bar to mark which category the user is
                watching.
              </p>
            </div>

            <ImageFrame
              src="/portfolio/tiktok-tv-navigation/tv-nav-07.jpg"
              alt="TikTok TV with the simplified dark navigation rail"
              width={1920}
              height={1080}
              className="mt-10"
            />

            {/* Sub-section: Animation */}
            <div className="mt-20 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
              <div>
                <SubHeading>Animation</SubHeading>
                <p className={`mt-5 ${bodyMd}`}>
                  The navigation has a 48-pixel offset animation to more
                  effectively capture and track the user&apos;s attention. The
                  same logic applies to the secondary navigation.
                </p>
              </div>
              <VideoFrame src="/portfolio/tiktok-tv-navigation/tv-nav-01.mp4" />
            </div>

            {/* Sub-section: Tracking user attention */}
            <div className="mt-20 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
              <div>
                <SubHeading>Tracking user attention</SubHeading>
                <p className={`mt-5 ${bodyMd}`}>
                  Focus and offset cues stay consistent across primary and
                  secondary nav — wherever the user lands, the active item is
                  obvious without breaking the spatial logic of the feed.
                </p>
              </div>
              <VideoFrame src="/portfolio/tiktok-tv-navigation/tv-nav-02.mp4" />
            </div>

            <ImageFrame
              src="/portfolio/tiktok-tv-navigation/tv-nav-08.jpg"
              alt="TikTok TV navigation states across primary and secondary nav"
              width={1920}
              height={1080}
              className="mt-10"
            />
          </CaseSection>

          {/* RESULTS */}
          <CaseSection eyebrow="Impact" title="Results">
            <p className={`mt-8 max-w-3xl ${bodyMd}`}>
              After the full launch of the new navigation, TikTok TV playback
              time, video views, and active days all improved.
            </p>

            <div
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
            </div>
          </CaseSection>

          {/* RELATED CASE STUDIES */}
          <CaseSection eyebrow="More work" title="Continue exploring">
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {relatedCases.map((c) => {
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
                    <Link
                      key={c.title}
                      href={c.href}
                      data-cursor="view"
                      className={`group block overflow-hidden rounded-[1.25rem] transition duration-300 ease-out hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)] ${surfaceDefault}`}
                    >
                      {cardContent}
                    </Link>
                  );
                }

                return (
                  <article
                    key={c.title}
                    className={`group relative overflow-hidden rounded-[1.25rem] ${surfaceDefault}`}
                  >
                    <span className="absolute right-4 top-4 z-10 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70 backdrop-blur-sm">
                      Coming soon
                    </span>
                    {cardContent}
                  </article>
                );
              })}
            </div>
          </CaseSection>
        </div>
      </article>
    </PortfolioShell>
  );
}
