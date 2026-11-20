import Image from "next/image";
import Link from "next/link";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import { Board, BoardGallery, type BoardImage } from "../../components/board-viewer";
import { CaseHeader, CaseStudyFooter, Chapter, MediaCaption, SubHeading, SubPair, VideoFrame } from "../../components/case-study";
import { HoverVideo } from "../../components/hover-video";
import { ScrollRevealText } from "../../components/scroll-reveal-text";
import { TT_ACCENT, TV_CANVAS } from "../../lib/tiktok-tv";
import { eyebrowSection, surfaceQuiet, surfaceDefault, bodyMd, bodySm, emphasis, cardHoverDark } from "../../lib/tokens";

const A = "/portfolio/tiktok-tv-profile";

const B = {
  mine: { src: `${A}/pf-03.png`, alt: "My Profile — original 2020 MVP layout", width: 1280, height: 720 },
  others: { src: `${A}/pf-04.png`, alt: "Others' Profile — original 2020 MVP layout", width: 1164, height: 670 },
} satisfies Record<string, BoardImage>;

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design"],
  ["Platform", "TV"],
  ["Patents", "1 Design Patent"],
];

// Possibility — four wireframe directions, each a hover-to-play clip and its
// pros (✅) and cons (❎). From md up the points are lined up in one table
// (COMPARISON) so the four can be compared; on a phone each keeps its list.
const wireframes: { src: string; title: string; points: string[] }[] = [
  {
    src: `${A}/pf-05.mp4`,
    title: "Left-right & Waterfall",
    points: [
      "✅ Shows 8 videos",
      "✅ Easy to follow the creators",
      "✅ Intentionally feels like searching and consuming",
      "❎ Returning to the nav takes two steps",
      "❎ Focus position is not stable",
    ],
  },
  {
    src: `${A}/pf-06.mp4`,
    title: "Left-right & Rows",
    points: [
      "❎ Shows 4.5 videos",
      "❎ Hard to keep track if users browse too many videos",
      "✅ Returning to the nav takes only one step",
      "❎ Other rows may distract the user",
      "❎ Hard to return to the start of a row after focusing a history video",
    ],
  },
  {
    src: `${A}/pf-07.mp4`,
    title: "Up-down & Waterfall",
    points: [
      "❎ Shows 5 videos",
      "❎ Wastes too much white space",
      "✅ Intentionally feels like searching, not consuming",
      "✅ Always shows the creator's info and the Follow button",
      "❎ Hard to keep track if users browse too many videos",
    ],
  },
  {
    src: `${A}/pf-08.mp4`,
    title: "Up-down & Rows",
    points: [
      "❎ Shows 5.5 videos",
      "❎ Wastes too much white space",
      "✅ Returning to the nav takes only one step",
      "❎ Hard to return to the start of a row after focusing a history video",
    ],
  },
];

/** The same points by criterion: [good?, note] per option, or null where that option's list doesn't say. */
type Cell = [boolean, string] | null;
const COMPARISON: { criterion: string; cells: Cell[] }[] = [
  { criterion: "Videos on screen", cells: [[true, "8"], [false, "4.5"], [false, "5"], [false, "5.5"]] },
  { criterion: "Back to the nav", cells: [[false, "Two steps"], [true, "One step"], null, [true, "One step"]] },
  { criterion: "Following the creator", cells: [[true, "Easy"], null, [true, "Info and Follow always shown"], null] },
  { criterion: "Keeping track of many videos", cells: [null, [false, "Hard"], [false, "Hard"], null] },
  { criterion: "Feels like", cells: [[true, "Searching and consuming"], null, [true, "Searching, not consuming"], null] },
  { criterion: "Focus position", cells: [[false, "Not stable"], null, null, null] },
  { criterion: "Use of the screen", cells: [null, [false, "Other rows distract"], [false, "Too much white space"], [false, "Too much white space"]] },
  { criterion: "Back to the start of a row", cells: [null, [false, "Hard after a history video"], null, [false, "Hard after a history video"]] },
];
/** The direction the Conclusion chapter settles on: waterfall, left & right. */
const CHOSEN = 0;

const relatedCases = [
  {
    title: "TV Visual Revamp",
    body: "Redefine the TikTok TV visual and motion system, improve fundamental principles.",
    image: `${A}/pf-15.png`,
    href: "/work/tiktok-tv-visual",
  },
  {
    title: "Navigation",
    body: "A flexible navigation structure that improves the experience and usage.",
    image: `${A}/pf-16.png`,
    href: "/work/tiktok-tv-navigation",
  },
  {
    title: "Search & Result",
    body: "The first TV search feature specifically designed for short videos.",
    image: `${A}/pf-17.png`,
    href: "/work/tiktok-tv-search",
  },
];

export default function TikTokTvProfilePage() {
  return (
    <PortfolioShell {...TV_CANVAS.shell}>
      <BoardGallery boards={Object.values(B)}>
        <article data-cs-theme={TV_CANVAS.theme} className="mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 sm:pt-10 xl:px-14 lg:pb-24 lg:pt-14">
          {/* HERO */}
          <figure className="overflow-hidden rounded-[1.75rem]">
            <Image
              src={`${A}/pf-01.jpg`}
              alt="TikTok TV profile redesign in a living room TV interface"
              width={2700}
              height={1605}
              priority
              className="h-auto w-full"
            />
          </figure>

          <CaseHeader
            date="Apr 2024 — Oct 2024"
            title="TikTok TV Profile"
            overview="We are optimizing the 'My Profile' and 'Others' Profile' features to deliver enhanced value to TikTok TV users. The updated profiles will allow users to effortlessly access their curated content assets and quickly build relationships through other creators' profiles."
            facts={projectStats}
          >
            <article className={`mt-14 rounded-[1.25rem] px-6 py-6 ${surfaceQuiet}`}>
              <Image src={`${A}/pf-02.png`} alt="" width={72} height={72} className="block size-[22px] opacity-65 grayscale" />
              <h2 className="mt-5 text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--cs-heading)]">1 Design Patent</h2>
              <ul className="mt-3 flex flex-col gap-1 text-[15px] font-medium leading-6 text-[var(--cs-body-sm)]">
                <li>Video related interactive patent</li>
                <li>Design inventions</li>
                <li>Apr 2024 — Oct 2024</li>
              </ul>
            </article>
          </CaseHeader>

          <div className="mt-28 flex flex-col gap-28 sm:gap-36 lg:mt-36 lg:gap-44">
            <Chapter
              id="difference"
              n="01"
              eyebrow="Problems"
              title="One layout can’t serve both profiles"
              accent={TT_ACCENT}
              intro={
                <div className={`flex flex-col gap-6 ${bodyMd}`}>
                  <p>
                    The initial profile pages were built in 2020. It&apos;s an MVP version for users to view the
                    creator&apos;s details.
                  </p>
                  <p>
                    We found that interactions differ between &apos;My Profile&apos; and &apos;Others&apos; Profile&apos;: &apos;My Profile&apos; centers on watching Liked and Favorited videos, with no social features, while &apos;Others&apos; Profile&apos; puts social attributes first, with user info at the top.
                  </p>
                </div>
              }
            >
              <StaggerGrid className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
                {[
                  { board: B.mine, label: "My Profile" },
                  { board: B.others, label: "Others' Profile" },
                ].map(({ board, label }, i) => (
                  <StaggerItem key={label} index={i}>
                    <Board {...board} />
                    <p className={`mt-5 ${bodySm}`}>
                      <span className="font-semibold text-[var(--cs-heading)]">{label}</span>
                    </p>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>

            {/* THE FACT — one paragraph, one size, scroll-driven highlight (the
                source's two-layer effect). A statement, not a titled chapter. */}
            <section data-case-section>
              <Reveal>
                <p className={eyebrowSection}>
                  <span className={TT_ACCENT}>02</span>
                  <span aria-hidden className="mx-2 opacity-50">/</span>
                  The fact
                </p>
              </Reveal>
              <ScrollRevealText
                className="mt-6 max-w-4xl text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-[1.4] tracking-[-0.015em]"
                segments={[
                  { text: "On TV, around" },
                  { text: "20% of logged-in users", bold: true },
                  { text: "access their profile daily, averaging 2.6 visits per day. Among them," },
                  { text: "73% consume videos from “My Videos” and “Liked Videos,”", bold: true },
                  { text: "while" },
                  { text: "32% visit other profiles via “Following” and “Followers.”", bold: true },
                  { text: "My profile, the place for logged-in users to consume videos," },
                  { text: "shouldn’t have the same structure", bold: true },
                  { text: "as others’ profiles." },
                ]}
              />
            </section>

            <Chapter id="wireframing" n="03" eyebrow="Possibility" title="Four layouts, one clear winner" accent={TT_ACCENT}>
              <StaggerGrid className="mt-12 grid gap-x-12 gap-y-12 sm:grid-cols-2">
                {wireframes.map((w, i) => (
                  <StaggerItem key={w.title} index={i}>
                    <HoverVideo src={w.src} />
                    <MediaCaption className="mt-5">
                      {w.title}
                      {i === CHOSEN ? <span className={`ml-2 text-xs font-semibold uppercase tracking-[0.12em] ${TT_ACCENT}`}>Chosen</span> : null}
                    </MediaCaption>
                    <ul className="mt-3 flex flex-col gap-1 text-sm leading-[1.4] text-[var(--cs-body-sm)] md:hidden">
                      {w.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </StaggerItem>
                ))}
              </StaggerGrid>

              {/* The four side by side, by criterion (md and up). */}
              <Reveal className="mt-14 hidden md:block">
                <SubHeading>How the four compare</SubHeading>
                <div className={`mt-6 overflow-hidden rounded-[1.25rem] ${surfaceDefault}`}>
                  <table className="w-full table-fixed border-collapse text-left text-sm leading-[1.35]">
                    <thead>
                      <tr>
                        <th scope="col" className="w-[22%] px-5 py-4 align-bottom">
                          <span className="sr-only">Criterion</span>
                        </th>
                        {wireframes.map((w, i) => (
                          <th
                            key={w.title}
                            scope="col"
                            className={`px-4 py-4 align-bottom font-semibold text-[var(--cs-heading)] ${i === CHOSEN ? "bg-[var(--cs-surface-2)]" : ""}`}
                          >
                            {i === CHOSEN ? (
                              <span className={`mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] ${TT_ACCENT}`}>Chosen</span>
                            ) : null}
                            {w.title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON.map(({ criterion, cells }) => (
                        <tr key={criterion} className="border-t border-[var(--cs-border-2)]">
                          <th scope="row" className="px-5 py-3.5 font-medium text-[var(--cs-body)]">
                            {criterion}
                          </th>
                          {cells.map((cell, i) => (
                            <td key={i} className={`px-4 py-3.5 ${i === CHOSEN ? "bg-[var(--cs-surface-2)]" : ""}`}>
                              {cell ? (
                                <span className={`inline-flex items-start gap-1.5 ${cell[0] ? "text-[var(--cs-heading)]" : "text-[var(--cs-body-sm)]"}`}>
                                  <span aria-hidden className={`mt-px shrink-0 ${cell[0] ? "text-[#2fbf71]" : "opacity-60"}`}>{cell[0] ? "✓" : "✕"}</span>
                                  <span>
                                    <span className="sr-only">{cell[0] ? "Pro: " : "Con: "}</span>
                                    {cell[1]}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-[var(--cs-eyebrow-meta)]" aria-label="Not noted">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </Chapter>

            <Chapter id="conclusion" n="04" eyebrow="Conclusion" title="Waterfall grid, split screen" accent={TT_ACCENT}>
              <StaggerGrid className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-2">
                {[
                  {
                    src: `${A}/pf-09.png`,
                    title: "Waterfall Format",
                    body: (
                      <>
                        The waterfall format helps users search for specific content, while rows let them consume content continuously. For the profile page,{" "}
                        <strong className={emphasis}>the waterfall format is the best solution.</strong>
                      </>
                    ),
                  },
                  {
                    src: `${A}/pf-10.png`,
                    title: "Left & Right",
                    body: (
                      <>
                        To <strong className={emphasis}>use more of the screen</strong> without overwhelming it, we use a left &amp; right structure for both My Profile and Others&apos; Profile. The content area on the right shows up to <strong className={emphasis}>8–12 videos</strong>.
                      </>
                    ),
                  },
                ].map((c, i) => (
                  <StaggerItem key={c.title} index={i} className="h-full">
                    <div className={`h-full rounded-[1.25rem] px-6 py-6 ${surfaceDefault}`}>
                      <Image src={c.src} alt="" width={256} height={256} className="block size-12 opacity-80" />
                      <MediaCaption className="mt-5">{c.title}</MediaCaption>
                      <p className={`mt-3 ${bodyMd}`}>{c.body}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>

            <Chapter
              id="differentiated"
              n="05"
              eyebrow="New experience"
              title="Each profile built for its job"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  In &apos;My Profile&apos;, users are already somewhat familiar with the content they have viewed before, so they care more about{" "}
                  <strong className={emphasis}>searching for videos than consuming them.</strong>
                </p>
              }
            >
              <SubPair title="My Profile" className="mt-20">
                <p>
                  To allow users to access their collected videos more quickly, the user{" "}
                  <strong className={emphasis}>bio is no longer emphasized</strong> on TV. Instead,{" "}
                  <strong className={emphasis}>navigation is prioritized</strong> to help users find the right content.
                </p>
              </SubPair>
              <Reveal className="mt-10">
                <VideoFrame src={`${A}/pf-11.mp4`} className="border-0" />
              </Reveal>

              <SubPair title="Others’ Profile" className="mt-20">
                <p>
                  Social features stay at the core of others&apos; profiles. However many videos users have browsed, they can reach Follow in at most <strong className={emphasis}>5 steps</strong> by pressing &apos;left&apos;.
                </p>
              </SubPair>
              <Reveal className="mt-10">
                <VideoFrame src={`${A}/pf-12.mp4`} className="border-0" />
              </Reveal>
            </Chapter>

            <Chapter id="inner-flow" n="06" eyebrow="Prototype" title="Both profiles in motion" accent={TT_ACCENT}>
              <StaggerGrid className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
                {[
                  { src: `${A}/pf-13.mp4`, label: "My Profile" },
                  { src: `${A}/pf-14.mp4`, label: "Others’ Profile" },
                ].map((it, i) => (
                  <StaggerItem key={it.label} index={i}>
                    <VideoFrame src={it.src} className="border-0" />
                    <p className={`mt-5 ${bodySm}`}>
                      <span className="font-semibold text-[var(--cs-heading)]">{it.label}</span>
                    </p>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>

            <Chapter
              id="result"
              n="07"
              eyebrow="Impact"
              title="Results are still coming in"
              accent={TT_ACCENT}
              intro={<p className={bodyMd}>To be continued…</p>}
            />

            <Chapter id="continue" n="08" eyebrow="Features" title="Continue exploring" accent={TT_ACCENT}>
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
