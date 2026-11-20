import Image from "next/image";
import Link from "next/link";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import { CaseHeader, CaseSection, CaseStudyFooter, Chapter, MediaCaption, SubHeading, VideoFrame, WIDE_GRID } from "../../components/case-study";
import { HoverVideo } from "../../components/hover-video";
import { ScrollSteps } from "../../components/scroll-steps";
import { TT_ACCENT, TV_CANVAS } from "../../lib/tiktok-tv";
import { eyebrowMeta, surfaceQuiet, surfaceDefault, bodyMd, bodySm, emphasis, cardLeadTitle, cardHoverDark } from "../../lib/tokens";

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
  { value: "Max 5 steps", caption: "From keyboard to suggestion", image: `${A}/sr-08.jpg` },
  { value: "Only 3 steps", caption: "From center keyboard to suggestion", image: `${A}/sr-09.jpg` },
  { value: "Only 2 steps", caption: "Back from result to suggestion", image: `${A}/sr-10.jpg` },
  { value: "Only 1 step", caption: "To keyboard and result", image: `${A}/sr-11.jpg` },
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
    body: "A flexible navigation structure that improves the experience and usage.",
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
    <PortfolioShell {...TV_CANVAS.shell}>
      <article data-cs-theme={TV_CANVAS.theme} className="mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 sm:pt-10 xl:px-14 lg:pb-24 lg:pt-14">
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

        <CaseHeader
          date="Apr 2024 — Oct 2024"
          title="TikTok TV Search"
          overview="Search is a fundamental core feature in all TV products, but using a remote control for searching adds significant complexity for users. Making it easier for users to search on TV and guiding them to quickly find the content they want has become crucial."
          facts={projectStats}
        >
          <article className={`mt-14 rounded-[1.25rem] px-6 py-6 ${surfaceQuiet}`}>
            <Image src={`${A}/sr-02.png`} alt="" width={72} height={72} className="block size-[22px] opacity-65 grayscale" />
            <h2 className="mt-5 text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--cs-heading)]">2 Design Patents</h2>
            <ul className="mt-3 flex flex-col gap-1 text-[15px] font-medium leading-6 text-[var(--cs-body-sm)]">
              <li>Video related interactive patent</li>
              <li>Design inventions</li>
              <li>Apr 2024 — Oct 2024</li>
            </ul>
          </article>
        </CaseHeader>

        <div className="mt-28 flex flex-col gap-28 sm:gap-36 lg:mt-36 lg:gap-44">
          <Chapter
            id="dissatisfied"
            n="01"
            eyebrow="Background"
            title="Many users gave up on search"
            accent={TT_ACCENT}
            intro={
              <p className={bodyMd}>
                <strong className={emphasis}>27%</strong> of Web users and <strong className={emphasis}>12%</strong> of
                Android TV users clicked the search icon but didn&apos;t search. Around{" "}
                <strong className={emphasis}>48%</strong> of Web TV and <strong className={emphasis}>42%</strong> of
                Android TV users used search only once, indicating dissatisfaction and room for improvement.
              </p>
            }
          >
            {/* The paragraph's figures, grouped by what they measure. */}
            <StaggerGrid className="mt-14 grid gap-5 sm:grid-cols-2">
              {[
                { what: "Opened search but didn't search", rows: [["Web", "27%"], ["Android TV", "12%"]] },
                { what: "Used search only once", rows: [["Web TV", "48%"], ["Android TV", "42%"]] },
              ].map(({ what, rows }, i) => (
                <StaggerItem key={what} index={i} className={`h-full rounded-[1.25rem] px-6 py-6 ${surfaceDefault}`}>
                  <p className={eyebrowMeta}>{what}</p>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    {rows.map(([platform, value]) => (
                      <div key={platform} className="@container">
                        <p className="whitespace-nowrap text-[clamp(1.75rem,26cqw,3rem)] font-medium leading-none tracking-[-0.04em] text-[var(--cs-heading)]">
                          {value}
                        </p>
                        <p className={`mt-2 ${bodySm}`}>{platform}</p>
                      </div>
                    ))}
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </Chapter>

          <Chapter id="frustrated" n="02" eyebrow="Problems" title="Search made users work too hard" accent={TT_ACCENT}>
            {/* Each paragraph pairs with the clip below it. */}
            <StaggerGrid className="mt-12 grid gap-x-12 gap-y-12 sm:grid-cols-2">
              <StaggerItem index={0} className="flex h-full flex-col">
                <h3 className={cardLeadTitle}>Users Get Lost Between Pages</h3>
                <p className={`mt-4 ${bodyMd}`}>
                  TikTok TV separates search input and results onto different pages, slowing the process and causing
                  frustration, which may lead users to stop using the search feature.
                </p>
                <div className="mt-auto pt-6">
                  <HoverVideo src={`${A}/sr-03.mp4`} />
                </div>
              </StaggerItem>
              <StaggerItem index={1} className="flex h-full flex-col">
                <h3 className={cardLeadTitle}>&quot;Waterfall&quot; Format Distracts Users</h3>
                <p className={`mt-4 ${bodyMd}`}>
                  Only <strong className={emphasis}>67.88%</strong> of users play a video after reaching the results page.
                  We mix Top Search User cards, videos, and users in an uncategorized &apos;Waterfall&apos; format.
                </p>
                <div className="mt-auto pt-6">
                  <HoverVideo src={`${A}/sr-04.mp4`} />
                </div>
              </StaggerItem>
            </StaggerGrid>
          </Chapter>

          <Chapter id="structure" n="03" eyebrow="New Structure" title="Left-right rows suit search best" accent={TT_ACCENT}>
            <Reveal className={`mt-14 ${WIDE_GRID}`}>
              <div className="min-[1180px]:col-span-5">
                <SubHeading>Structure</SubHeading>
              </div>
              <div className={`flex flex-col gap-6 min-[1180px]:col-span-7 ${bodyMd}`}>
                <p>
                  Based on previous profile research, the <strong className={emphasis}>left-right structure</strong> is the best option for a short-video platform because it has more capacity.
                </p>
                <p>
                  The row layout is more suitable for search scenarios, giving users a feeling of continuous video
                  consumption. This is the opposite of the profile structure. Waterfall layouts, on the other hand, are
                  generally designed to help users quickly find specific content.
                </p>
              </div>
            </Reveal>

            <StaggerGrid className="mt-12 grid gap-x-12 gap-y-12 sm:grid-cols-2">
              {[
                { src: `${A}/sr-05.mp4`, title: "Up-down", points: ["· Less intuitive interactions", "· Shows only 1 row at a time"] },
                { src: `${A}/sr-06.mp4`, title: "Left-right", points: ["· More intuitive interactions", "· Shows more rows at a time"] },
              ].map((c, i) => (
                <StaggerItem key={c.title} index={i}>
                  <HoverVideo src={c.src} />
                  <MediaCaption className="mt-5">{c.title}</MediaCaption>
                  <ul className="mt-3 flex flex-col gap-1 text-sm leading-[1.4] text-[var(--cs-body-sm)]">
                    {c.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </Chapter>

          {/* KEYBOARD — a sub-feature of the new structure: a smaller title, no number. */}
          <CaseSection title="A keyboard with fewer steps" compact>
            <Reveal>
              <p className={`mt-8 max-w-3xl ${bodyMd}`}>
                After typing a keyword, focus should land on the <strong className={emphasis}>&apos;Search Button&apos;</strong>, not &apos;Clear&apos;; when users come back from the results, we move focus to the{" "}
                <strong className={emphasis}>&apos;Clear Button&apos;</strong> automatically.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <VideoFrame src={`${A}/sr-07.mp4`} className="border-0" />
            </Reveal>
            <Reveal>
              <p className={`mt-12 max-w-3xl ${bodyMd}`}>
                To give users a better, smoother experience on TV, we minimize the steps they have to take when searching. The TikTok keyboard is the most efficient keyboard among all competitors.
              </p>
            </Reveal>
            <div className="mt-10">
              <ScrollSteps steps={keyboardSteps} />
            </div>
          </CaseSection>

          <Chapter
            id="top-user-card"
            n="04"
            eyebrow="Result design"
            title="Creators’ videos without the detour"
            accent={TT_ACCENT}
            intro={
              <p className={bodyMd}>
                A top user card in the search results cuts the steps to a creator&apos;s videos: users just keep pressing &apos;right&apos;, without opening the profile.
              </p>
            }
          >
            <Reveal className="mt-14">
              <VideoFrame src={`${A}/sr-14.mp4`} className="border-0" />
            </Reveal>
          </Chapter>

          <Chapter id="animation" n="05" eyebrow="Animation" title="Suggestions and results in motion" accent={TT_ACCENT}>
            <Reveal className="mt-12">
              <VideoFrame src={`${A}/sr-15.mp4`} className="border-0" />
            </Reveal>
          </Chapter>

          <Chapter
            id="result"
            n="06"
            eyebrow="Impact"
            title="Results are still coming in"
            accent={TT_ACCENT}
            intro={<p className={bodyMd}>To be continued…</p>}
          />

          <Chapter id="continue" n="07" eyebrow="Features" title="Continue exploring" accent={TT_ACCENT}>
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
      <NextSectionButton theme={TV_CANVAS.theme === "light" ? "light" : "dark"} />
    </PortfolioShell>
  );
}
