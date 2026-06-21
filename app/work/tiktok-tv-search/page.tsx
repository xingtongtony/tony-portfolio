import Image from "next/image";
import Link from "next/link";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import {
  CaseSection,
  SubHeading,
  MediaCaption,
  VideoFrame,
  CaseStudyFooter,
} from "../../components/case-study";
import { HoverVideo } from "../../components/hover-video";
import { ScrollSteps } from "../../components/scroll-steps";
import {
  eyebrowSection,
  eyebrowMeta,
  surfaceQuiet,
  surfaceDefault,
  bodyMd,
  bodySm,
  emphasis,
  cardLeadTitle,
  cardHoverDark,
} from "../../lib/tokens";

const A = "/portfolio/tiktok-tv-search";

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design"],
  ["Platform", "TV"],
  ["Patents", "2 Design Patents"],
];

// Keyboard flow — each step count pairs with the frame that demonstrates it.
// Scroll-synced: the left text scrolls up & brightens while the right image
// crossfades to the matching screen.
const keyboardSteps = [
  {
    value: "Max 5 steps",
    caption: "From keyboard to suggestion",
    image: `${A}/sr-08.jpg`,
  },
  {
    value: "Only 3 steps",
    caption: "From center keyboard to suggestion",
    image: `${A}/sr-09.jpg`,
  },
  {
    value: "Only 2 steps",
    caption: "Back from result to suggestion",
    image: `${A}/sr-10.jpg`,
  },
  {
    value: "Only 1 step",
    caption: "To keyboard and result",
    image: `${A}/sr-11.jpg`,
  },
];

const relatedCases = [
  {
    title: "TV Visual Revamp",
    body: "Redefine the TikTok TV visual and motion system, improve fundamental principles.",
    image: `${A}/sr-16.png`,
    href: "/work/tiktok-tv-visual",
  },
  {
    title: "Navigation",
    body: "Flexible navigation structure, improve user experience, and usage.",
    image: `${A}/sr-17.png`,
    href: "/work/tiktok-tv-navigation",
  },
  {
    title: "My & Others Profile",
    body: "Differentiated profile designs meet user consumption needs across different scenarios.",
    image: `${A}/sr-18.png`,
    href: "/work/tiktok-tv-profile",
  },
];

export default function TikTokTvSearchPage() {
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
            src={`${A}/sr-01.jpg`}
            alt="TikTok TV search feature in a living room TV interface"
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
            TikTok TV Search
          </h1>

          <div className="mt-12">
            <p className={eyebrowSection}>Overview</p>
            <p className="mt-6 max-w-3xl text-lg leading-[1.5] tracking-[-0.01em] text-white/72">
              Search is a fundamental core feature in all TV products, but using
              a remote control for searching adds significant complexity for
              users. Making it easier for users to search on TV and guiding them
              to quickly find the content they want has become crucial.
            </p>
          </div>

          <dl
            className={`mt-10 grid overflow-hidden rounded-[1.25rem] sm:grid-cols-2 lg:grid-cols-4 ${surfaceQuiet}`}
          >
            {projectStats.map(([label, value], i) => (
              <div
                key={label}
                className={`px-6 py-5 ${
                  i > 0 ? "border-t border-white/[0.05] sm:border-t-0" : ""
                } ${i % 2 === 1 ? "sm:border-l sm:border-white/[0.05]" : ""} ${
                  i >= 2
                    ? "sm:border-t sm:border-white/[0.05] lg:border-t-0 lg:border-l lg:border-white/[0.05]"
                    : ""
                } ${i === 1 ? "lg:border-l lg:border-white/[0.05]" : ""} ${
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

          {/* Patent card */}
          <article className={`mt-5 rounded-[1.25rem] px-6 py-6 ${surfaceQuiet}`}>
            <Image
              src={`${A}/sr-02.png`}
              alt=""
              width={72}
              height={72}
              className="block size-[22px] opacity-65 grayscale"
            />
            <h2 className="mt-5 text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.02em] text-white">
              2 Design Patents
            </h2>
            <ul className="mt-3 flex flex-col gap-1 text-[15px] font-medium leading-6 text-white/56">
              <li>Video related interactive patent</li>
              <li>Design inventions</li>
              <li>Apr 2024 — Oct 2024</li>
            </ul>
          </article>
        </section>

        {/* SECTION FLOW */}
        <div className="mt-32 flex flex-col gap-32 lg:mt-40 lg:gap-40">
          {/* BACKGROUND */}
          <CaseSection eyebrow="Background" title="Dissatisfied users">
            <Reveal>
              <p className={`mt-8 max-w-3xl ${bodyMd}`}>
                <strong className={emphasis}>27%</strong> of Web users and{" "}
                <strong className={emphasis}>12%</strong> of Android TV users
                clicked the search icon but didn&apos;t search. Around{" "}
                <strong className={emphasis}>48%</strong> of Web TV and{" "}
                <strong className={emphasis}>42%</strong> of Android TV users
                used search only once, indicating dissatisfaction and room for
                improvement.
              </p>
            </Reveal>
          </CaseSection>

          {/* PROBLEMS */}
          <CaseSection
            eyebrow="Problems"
            title="Frustrated users in search"
          >
            {/* Each paragraph pairs with the clip below it: left = "Users get
                lost", right = the "Waterfall" format. */}
            <StaggerGrid className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              <StaggerItem index={0} className="flex h-full flex-col">
                <h3 className={cardLeadTitle}>
                  Users Get Lost Between Pages
                </h3>
                <p className={`mt-4 ${bodyMd}`}>
                  TikTok TV separates search input and results onto different
                  pages, slowing the process and causing frustration, which may
                  lead users to stop using the search feature.
                </p>
                <div className="mt-auto pt-6">
                  <HoverVideo src={`${A}/sr-03.mp4`} />
                </div>
              </StaggerItem>

              <StaggerItem index={1} className="flex h-full flex-col">
                <h3 className={cardLeadTitle}>
                  &quot;Waterfall&quot; Format Distracts Users
                </h3>
                <p className={`mt-4 ${bodyMd}`}>
                  Only <strong className={emphasis}>67.88%</strong> of users play
                  a video after reaching the results page. We mix Top Search User
                  cards, videos, and users in an uncategorized
                  &apos;Waterfall&apos; format.
                </p>
                <div className="mt-auto pt-6">
                  <HoverVideo src={`${A}/sr-04.mp4`} />
                </div>
              </StaggerItem>
            </StaggerGrid>
          </CaseSection>

          {/* NEW STRUCTURE */}
          <CaseSection eyebrow="New Structure" title="Redefine the user purpose">
            <Reveal>
              <SubHeading className="mt-8">Structure</SubHeading>
            </Reveal>
            <Reveal className={`mt-5 max-w-3xl flex flex-col gap-7 ${bodyMd}`}>
              <p>
                Based on previous profile research, the{" "}
                <strong className={emphasis}>left-right structure</strong> is the
                best option for a short video platform because it has more
                capacity.
              </p>
              <p>
                The row layout is more suitable for search scenarios, giving
                users a feeling of continuous video consumption. It is the
                opposite with profile structure. Waterfall layouts, on the other
                hand, are generally designed to help users quickly find specific
                content.
              </p>
            </Reveal>

            <StaggerGrid className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {[
                {
                  src: `${A}/sr-05.mp4`,
                  title: "Up-down",
                  points: [
                    "· Not intuitive interactions",
                    "· Only show 1 row at a time",
                  ],
                },
                {
                  src: `${A}/sr-06.mp4`,
                  title: "Left-right",
                  points: [
                    "· More intuitive interactions",
                    "· Show more rows at a time",
                  ],
                },
              ].map((c, i) => (
                <StaggerItem key={c.title} index={i}>
                  <HoverVideo src={c.src} />
                  <MediaCaption className="mt-5">{c.title}</MediaCaption>
                  <ul className="mt-3 flex flex-col gap-1 text-sm leading-[1.4] text-white/56">
                    {c.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>

          {/* KEYBOARD */}
          <CaseSection title="Keyboard" compact>
            <Reveal>
              <p className={`mt-8 max-w-3xl ${bodyMd}`}>
                The user&apos;s intuition should focus on the{" "}
                <strong className={emphasis}>&apos;Search Button&apos;</strong>{" "}
                but not &apos;clear&apos; after typing the keyword, and after
                coming back from the search result, we will help the user focus
                on the{" "}
                <strong className={emphasis}>&apos;Clear Button&apos;</strong>{" "}
                automatically.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <VideoFrame src={`${A}/sr-07.mp4`} />
            </Reveal>

            <Reveal>
              <p className={`mt-12 max-w-3xl ${bodyMd}`}>
                To give the user a better and smoother experience on TV, we try
                to minimize the steps that users have to take when searching.
                The TikTok keyboard is the most efficient keyboard among all
                competitors.
              </p>
            </Reveal>

            <div className="mt-10">
              <ScrollSteps steps={keyboardSteps} />
            </div>
          </CaseSection>

          {/* TOP USER CARD */}
          <CaseSection eyebrow="Result design" title="Top user card">
            <Reveal>
              <p className={`mt-8 max-w-3xl ${bodyMd}`}>
                Adding the top user card in the search result could help users
                decrease the step of browsing videos, just keeping pressing
                &apos;right&apos; without getting into the user&apos;s profile.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <VideoFrame src={`${A}/sr-14.mp4`} />
            </Reveal>
          </CaseSection>

          {/* ANIMATION */}
          <CaseSection eyebrow="Animation" title="Suggestion & Result overview">
            <Reveal className="mt-10">
              <VideoFrame src={`${A}/sr-15.mp4`} />
            </Reveal>
          </CaseSection>

          {/* RESULT */}
          <CaseSection eyebrow="Impact" title="The Result">
            <Reveal>
              <p className={`mt-8 max-w-3xl ${bodyMd}`}>To be continued…</p>
            </Reveal>
          </CaseSection>

          {/* RELATED */}
          <CaseSection eyebrow="Features" title="Continue exploring">
            <StaggerGrid className="mt-8 grid gap-5 lg:grid-cols-3">
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
                      <h3 className="text-lg font-semibold leading-[1.25] tracking-[-0.02em] text-white">
                        {c.title}
                      </h3>
                      <p className={`mt-2 ${bodySm}`}>{c.body}</p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>
        </div>
        <CaseStudyFooter />
      </article>
      <NextSectionButton />
    </PortfolioShell>
  );
}
