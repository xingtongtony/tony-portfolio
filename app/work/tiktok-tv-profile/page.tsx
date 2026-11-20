import Image from "next/image";
import Link from "next/link";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import { Board, BoardGallery, type BoardImage } from "../../components/board-viewer";
import { CaseHeader, CaseStudyFooter, Chapter, MediaCaption, SubPair, VideoFrame } from "../../components/case-study";
import { HoverVideo } from "../../components/hover-video";
import { ScrollRevealText } from "../../components/scroll-reveal-text";
import { TT_ACCENT, TV_CANVAS } from "../../lib/tiktok-tv";
import { eyebrowSection, surfaceQuiet, surfaceDefault, bodyMd, bodySm, emphasis, cardHoverDark } from "../../lib/tokens";

const A = "/portfolio/tiktok-tv-profile";

const B = {
  mine: { src: `${A}/pf-03.png`, alt: "My Profile — original 2020 MVP layout", width: 1280, height: 720 },
  others: { src: `${A}/pf-04.png`, alt: "Others Profile — original 2020 MVP layout", width: 1164, height: 670 },
} satisfies Record<string, BoardImage>;

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design"],
  ["Platform", "TV"],
  ["Patents", "1 Design Patent"],
];

// Possibility — four wireframe directions, each a hover-to-play clip + a
// pros/cons checklist (✅/❎ preserved from the source).
const wireframes: { src: string; title: string; points: string[] }[] = [
  {
    src: `${A}/pf-05.mp4`,
    title: "Left-right & Waterfall",
    points: [
      "✅ Show 8 videos",
      "✅ Easy to follow the creators",
      "✅ Intentionally feeling of searching consuming",
      "❎ Return to the Nav will take two steps",
      "❎ Focus position is not stable",
    ],
  },
  {
    src: `${A}/pf-06.mp4`,
    title: "Left-right & Rows",
    points: [
      "❎ Show 4.5 videos",
      "❎ Hard to follow if the users browse too many videos",
      "✅ Return to the Nav can be only one step",
      "❎ Other rows may disturb the user",
      "❎ Returning to the front of the row is hard after focusing a history video",
    ],
  },
  {
    src: `${A}/pf-07.mp4`,
    title: "Up-down & Waterfall",
    points: [
      "❎ Show 5 videos",
      "❎ Waste too much white space",
      "✅ Intentionally feeling of searching not consuming",
      "✅ Always show the creator's info and follow the button",
      "❎ Hard to follow if the users browse too many videos",
    ],
  },
  {
    src: `${A}/pf-08.mp4`,
    title: "Up-down & Rows",
    points: [
      "❎ Show 5.5 videos",
      "❎ Waste too much white space",
      "✅ Return to the Nav can be only one step",
      "❎ Returning to the front of the row is hard after focusing a history video",
    ],
  },
];

const relatedCases = [
  {
    title: "TV Visual Revamp",
    body: "Redefine the TikTok TV visual and motion system, improve fundamental principles.",
    image: `${A}/pf-15.png`,
    href: "/work/tiktok-tv-visual",
  },
  {
    title: "Navigation",
    body: "Flexible navigation structure, improve user experience, and usage.",
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
            overview="We are optimizing the 'My Profile' and 'Other's Profile' features to deliver enhanced value to TikTok TV users. The updated profiles will allow users to effortlessly access their curated content assets and quickly build relationships through other creators' profiles."
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
              title="What's the difference?"
              accent={TT_ACCENT}
              intro={
                <div className={`flex flex-col gap-6 ${bodyMd}`}>
                  <p>
                    The initial profile pages were built in 2020. It&apos;s an MVP version for users to view the
                    creator&apos;s details.
                  </p>
                  <p>
                    We found out that interactions vary between &apos;My Profile&apos; and &apos;Others Profile&apos;:
                    focus on Liked and Favorited video consumption in &apos;My Profile&apos;, with no social features. In
                    &apos;Others Profiles&apos;, prioritize social attributes, placing user info at the top visual area.
                  </p>
                </div>
              }
            >
              <StaggerGrid className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
                {[
                  { board: B.mine, label: "My Profile" },
                  { board: B.others, label: "Others Profile" },
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
                  { text: "as other’s profile." },
                ]}
              />
            </section>

            <Chapter id="wireframing" n="03" eyebrow="Possibility" title="Wireframing" accent={TT_ACCENT}>
              <StaggerGrid className="mt-12 grid gap-x-12 gap-y-12 sm:grid-cols-2">
                {wireframes.map((w, i) => (
                  <StaggerItem key={w.title} index={i}>
                    <HoverVideo src={w.src} />
                    <MediaCaption className="mt-5">{w.title}</MediaCaption>
                    <ul className="mt-3 flex flex-col gap-1 text-sm leading-[1.4] text-[var(--cs-body-sm)]">
                      {w.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>

            <Chapter id="conclusion" n="04" eyebrow="Conclusion" title="Waterfall, left & right" accent={TT_ACCENT}>
              <StaggerGrid className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-2">
                {[
                  {
                    src: `${A}/pf-09.png`,
                    title: "Waterfall Format",
                    body: (
                      <>
                        The waterfall format allows users to search certain content, but the rows format will enable users
                        to consume content continuously. In the case of the profile page,{" "}
                        <strong className={emphasis}>the waterfall format is the best solution.</strong>
                      </>
                    ),
                  },
                  {
                    src: `${A}/pf-10.png`,
                    title: "Left & Right",
                    body: (
                      <>
                        To <strong className={emphasis}>improve the capacity</strong> of the screen but not too
                        overwhelming, we are using left &amp; right structures for both my profile &amp; other&apos;s
                        profiles. The right side of the content area can show <strong className={emphasis}>8-12 videos</strong>{" "}
                        at a maximum.
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
              title="Differentiated profile"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  In &apos;my profile&apos;, users are already somewhat familiar with the content they have previously
                  viewed. In this scenario, they are more concerned with{" "}
                  <strong className={emphasis}>searching for videos rather than consuming them.</strong>
                </p>
              }
            >
              <SubPair title="My profile" className="mt-20">
                <p>
                  To allow users to access their collected videos more quickly, the user{" "}
                  <strong className={emphasis}>bio is no longer emphasized</strong> on TV. Instead,{" "}
                  <strong className={emphasis}>navigation is prioritized</strong> to help users find the right content.
                </p>
              </SubPair>
              <Reveal className="mt-10">
                <VideoFrame src={`${A}/pf-11.mp4`} className="border-0" />
              </Reveal>

              <SubPair title="Others profile" className="mt-20">
                <p>
                  Keep the social genes as the core content on other&apos;s profiles. Users can press &apos;left&apos; for
                  at most <strong className={emphasis}>5 steps</strong> to follow the creators no matter how many videos
                  they browsed.
                </p>
              </SubPair>
              <Reveal className="mt-10">
                <VideoFrame src={`${A}/pf-12.mp4`} className="border-0" />
              </Reveal>
            </Chapter>

            <Chapter id="inner-flow" n="06" eyebrow="Prototype" title="Inner flow" accent={TT_ACCENT}>
              <StaggerGrid className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
                {[
                  { src: `${A}/pf-13.mp4`, label: "My profile" },
                  { src: `${A}/pf-14.mp4`, label: "Others profile" },
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
              title="The Result"
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
