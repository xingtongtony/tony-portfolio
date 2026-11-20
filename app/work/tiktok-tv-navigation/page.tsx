import Image from "next/image";
import Link from "next/link";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import { Board, BoardGallery, type BoardImage } from "../../components/board-viewer";
import { CaseHeader, CaseStudyFooter, Chapter, StatRow, SubHeading, VideoFrame, WIDE_GRID } from "../../components/case-study";
import { TT_ACCENT, TT_RED, TV_CANVAS } from "../../lib/tiktok-tv";
import { eyebrowSection, eyebrowMeta, surfaceDefault, bodyMd, bodySm, emphasis, cardHoverDark } from "../../lib/tokens";

const A = "/portfolio/tiktok-tv-navigation";

const B = {
  netflix: { src: `${A}/tv-nav-02.jpg`, alt: "TikTok TV navigation concept supporting Netflix's 90-second discovery rule", width: 1920, height: 1080 },
  v1: { src: `${A}/tv-nav-03.jpg`, alt: "V1 iteration of TikTok TV navigation", width: 1920, height: 1080 },
  v2: { src: `${A}/tv-nav-04.jpg`, alt: "V2 iteration of TikTok TV navigation", width: 1920, height: 1080 },
  v3: { src: `${A}/tv-nav-05.jpg`, alt: "V3 iteration of TikTok TV navigation", width: 1920, height: 1080 },
  v4: { src: `${A}/tv-nav-06.jpg`, alt: "V4 iteration of TikTok TV navigation", width: 1920, height: 1080 },
  minimized: { src: `${A}/tv-nav-07.jpg`, alt: "TikTok TV feed with the navigation minimized", width: 1920, height: 1080 },
  revealed: { src: `${A}/tv-nav-08.jpg`, alt: "TikTok TV navigation revealed for category discovery", width: 1920, height: 1080 },
} satisfies Record<string, BoardImage>;

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design"],
  ["Platform", "TV"],
  ["Problem", "Choice impact"],
];

const iterations: [string, string, BoardImage][] = [
  ["V1", "Nav covered on videos too much", B.v1],
  ["V2", "Transition of animation on large screen is too dramatic", B.v2],
  ["V3", "Go to setting & feedback tab take too much effort", B.v3],
  ["V4", "Covered too much on landscape videos", B.v4],
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
const maxPenetration = Math.max(...categoryPenetration.map(([, pct]) => parseFloat(pct)));

const relatedCases = [
  {
    title: "TV Visual Revamp",
    body: "Redefine the TikTok TV visual and motion system, improve fundamental principles.",
    image: `${A}/tv-nav-09.png`,
    href: "/work/tiktok-tv-visual",
  },
  {
    title: "My & Others Profile",
    body: "Differentiated profile designs meet user consumption needs across different scenarios.",
    image: `${A}/tv-nav-10.png`,
    href: "/work/tiktok-tv-profile",
  },
  {
    title: "Search & Result",
    body: "The first TV search feature specifically designed for short videos.",
    image: `${A}/tv-nav-11.png`,
    href: "/work/tiktok-tv-search",
  },
];

export default function TikTokTvNavigationPage() {
  return (
    <PortfolioShell {...TV_CANVAS.shell}>
      <BoardGallery boards={Object.values(B)}>
        <article data-cs-theme={TV_CANVAS.theme} className="mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 sm:pt-10 xl:px-14 lg:pb-24 lg:pt-14">
          {/* HERO */}
          <figure className="overflow-hidden rounded-[1.75rem]">
            <Image
              src={`${A}/tv-nav-01.jpg`}
              alt="TikTok TV navigation in a living room TV interface"
              width={2700}
              height={1605}
              priority
              className="h-auto w-full"
            />
          </figure>

          <CaseHeader
            date="Apr 2024 — Oct 2024"
            title="TikTok TV Navigation"
            overview="We are enhancing the left navigation bar by removing features that are less used and elevating specific categories from the Categories page. This initiative aims to deliver a streamlined watching experience, minimizing user decision fatigue."
            facts={projectStats}
          />

          <div className="mt-28 flex flex-col gap-28 sm:gap-36 lg:mt-36 lg:gap-44">
            <Chapter
              id="choice-impact"
              n="01"
              eyebrow="Problems"
              title="Choice impact"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  According to Netflix research, streaming services should help users find something to watch in{" "}
                  <strong className={emphasis}>90 seconds</strong> to keep them from looking elsewhere. Too many choices
                  slow down how fast users pick something to watch, and may push them off the platform entirely.
                </p>
              }
            >
              <Reveal className="mt-14">
                <Board {...B.netflix} />
              </Reveal>
            </Chapter>

            <Chapter
              id="not-important"
              n="02"
              eyebrow="The fact"
              title="Necessary but not important"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  Not all categories get the same attention. Most categories — Family, News, Fashion, Daily Life, Beauty,
                  Autos, Animals, Food, Lip Sync, and Animation — attract less than 2% of users who check out the
                  Categories tab.
                </p>
              }
            >
              {/* The penetration figures as a bar chart: one category per row, bar to scale. */}
              <Reveal className={`mt-14 rounded-[1.25rem] px-6 py-6 sm:px-8 sm:py-7 ${surfaceDefault}`}>
                <div className="flex items-baseline justify-between">
                  <p className={eyebrowMeta}>Category</p>
                  <p className={eyebrowMeta}>Penetration</p>
                </div>
                <ul className="mt-4 flex flex-col">
                  {categoryPenetration.map(([name, pct], i) => (
                    <li key={name} className="grid grid-cols-[6.5rem_1fr_4.25rem] items-center gap-4 border-t border-[var(--cs-border)] py-2.5 sm:grid-cols-[8rem_1fr_4.5rem]">
                      <span className="truncate text-[15px] font-medium text-[var(--cs-heading)]">{name}</span>
                      <span className="h-2 overflow-hidden rounded-full bg-[var(--cs-border)]">
                        <span
                          className="block h-full rounded-full"
                          style={{ width: `${(parseFloat(pct) / maxPenetration) * 100}%`, background: i === 0 ? TT_RED : "var(--cs-body)", opacity: i === 0 ? 1 : 0.5 }}
                        />
                      </span>
                      <span className="text-right text-[15px] font-medium tabular-nums text-[var(--cs-lead)]">{pct}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </Chapter>

            <Chapter
              id="iterations"
              n="03"
              eyebrow="Process"
              title="Four iterations in"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  <strong className={emphasis}>Upon arrival, users should be able to start watching a video promptly.</strong>{" "}
                  Shortening the search time matters because TikTok operates differently from subscription platforms:
                  users don&apos;t browse for a specific title — they expect immediate content.
                </p>
              }
            >
              <StaggerGrid className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2">
                {iterations.map(([label, body, board], i) => (
                  <StaggerItem key={label} index={i}>
                    <Board {...board} />
                    <p className={`mt-5 ${bodyMd}`}>
                      <span className="font-semibold text-[var(--cs-heading)]">{label}:</span> {body}
                    </p>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>

            {/* Block order mirrors the source: para → two screenshots → para →
                para beside its video → "Animation / Tracking user attention" → video. */}
            <Chapter
              id="visual-disruption"
              n="04"
              eyebrow="The new visual"
              title="Reduce visual disruption"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  Video content is the top priority on TikTok TV. We aimed to minimize the impact of other elements on the
                  page that could distract from the viewing experience.
                </p>
              }
            >
              <StaggerGrid className="mt-14 grid gap-5 sm:grid-cols-2">
                {[B.minimized, B.revealed].map((board, i) => (
                  <StaggerItem key={board.src} index={i}>
                    <Board {...board} />
                  </StaggerItem>
                ))}
              </StaggerGrid>

              <Reveal className={`mt-14 ${WIDE_GRID}`}>
                <p className={`min-[1180px]:col-span-7 min-[1180px]:col-start-6 ${bodyMd}`}>
                  But we still wanted <strong className={emphasis}>users to explore</strong> content from other categories.
                  The navigation became a vessel for category discovery: because short videos tolerate partial occlusion,
                  it stays partially visible during consumption rather than fully hidden.
                </p>
              </Reveal>

              {/* Only this paragraph sits beside its video (per source). */}
              <Reveal className="mt-14 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
                <p className={bodyMd}>
                  We <strong className={emphasis}>simplified the interface</strong> around a dark aesthetic and line
                  iconography to <strong className={emphasis}>reduce visual disruption</strong> and emphasize the feed,
                  using a red bar to mark which category the user is watching.
                </p>
                <VideoFrame src={`${A}/tv-nav-01.mp4`} className="border-0" />
              </Reveal>

              <Reveal className={`mt-20 ${WIDE_GRID}`}>
                <div className="min-[1180px]:col-span-5">
                  <p className={eyebrowSection}>Animation</p>
                  <div className="mt-3">
                    <SubHeading>Tracking user attention</SubHeading>
                  </div>
                </div>
                <p className={`min-[1180px]:col-span-7 min-[1180px]:pt-7 ${bodyMd}`}>
                  The navigation has a 48-pixel offset animation to more effectively capture and track the user&apos;s
                  attention. The same logic applies to the secondary navigation.
                </p>
              </Reveal>
              <Reveal className="mt-10">
                <VideoFrame src={`${A}/tv-nav-02.mp4`} className="border-0" />
              </Reveal>
            </Chapter>

            <Chapter
              id="results"
              n="05"
              eyebrow="Impact"
              title="Results"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  After the full launch of the new navigation, TikTok TV playback time, video views, and active days all
                  improved.
                </p>
              }
            >
              <div className="mt-14">
                <StatRow
                  accent={TT_RED}
                  items={[
                    { label: "Play duration", value: "+1.02%" },
                    { label: "Video view", value: "+1.2%" },
                    { label: "14-day active days", value: "+0.7%", dim: true },
                  ]}
                />
              </div>
            </Chapter>

            <Chapter id="more-work" n="06" eyebrow="More work" title="Continue exploring" accent={TT_ACCENT}>
              <StaggerGrid className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-3">
                {relatedCases.map((c, i) => (
                  <StaggerItem key={c.title} index={i} className="h-full">
                    <Link
                      href={c.href}
                      data-cursor="view"
                      className={`group flex h-full flex-col overflow-hidden rounded-[1.25rem] ${surfaceDefault} ${cardHoverDark}`}
                    >
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
                        <h3 className="text-lg font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--cs-heading)]">{c.title}</h3>
                        <p className={`mt-2 ${bodySm}`}>{c.body}</p>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>
          </div>
          <CaseStudyFooter />
        </article>
      </BoardGallery>
      <NextSectionButton theme={TV_CANVAS.theme === "light" ? "light" : "dark"} />
    </PortfolioShell>
  );
}
