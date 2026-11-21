import type { ReactNode } from "react";
import Image from "next/image";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import { Board, BoardGallery, type BoardImage } from "../../components/board-viewer";
import {
  CaseHeader,
  CaseStudyFooter,
  Chapter,
  SubHeading,
  SubPair,
  VideoFrame,
  WIDE_LEFT,
  WIDE_RIGHT,
} from "../../components/case-study";
import { TT_ACCENT, TT_RED } from "../../lib/tiktok-tv";
import { eyebrowMeta, bodyMd, bodySm, emphasis } from "../../lib/tokens";

// White page, the CloudKitchens / TikTok TV chapter layout. The boards carry
// their own light grey (one is dark) and read as panels by that background:
// rounded corners, no border, every one opens full screen (BoardGallery).
// Cards are the light grey used on CloudKitchens. TikTok red: TT_ACCENT for
// small text, TT_RED for large numerals and graphics.

const A = "/portfolio/tiktok-multi-platform";
const CARD = "rounded-[1.25rem] bg-[#f6f6f6]";

const B = {
  principles: {
    src: `${A}/mp-06.jpg`,
    alt: "The four iPad design principles — Flatten the navigation, Show more content, Stay in context, Immersive experiences",
    width: 2880,
    height: 1800,
  },
  inbox: { src: `${A}/mp-07.jpg`, alt: "Direct Message and Inbox laid out across iPad and iPhone", width: 2880, height: 1800 },
  video: {
    src: `${A}/mp-08.jpg`,
    alt: "The video beside comments, a profile, or a one- or two-column overview, with the nav on the left side",
    width: 2880,
    height: 1800,
  },
  grid: { src: `${A}/mp-09.jpg`, alt: "Top Search and Sound Search in a three-column grid on iPad, beside the phone layout", width: 2880, height: 1800 },
  camera: { src: `${A}/mp-11.jpg`, alt: "Immersive iPad camera with the icons outside the content, beside the phone camera", width: 2880, height: 1800 },
  multitask: { src: `${A}/mp-12.jpg`, alt: "Picture in Picture and Split View on iPad", width: 2880, height: 1800 },
  apple: { src: `${A}/mp-05.jpg`, alt: "TikTok featured at Apple’s September 14 event, in the iPad segment", width: 2388, height: 1616 },
} satisfies Record<string, BoardImage>;

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design"],
  ["Platform", "Tablet"],
];

const recognition = [
  { icon: "mp-03.png", title: "10 Design Patents", lines: ["Video-related interactive patent", "Apr 2021"] },
  { icon: "mp-04.png", title: "Featured on Apple Events", lines: ["What you can do with your iPad", "Sep 2021"] },
];

const dauStats = [
  ["All device DAU", "433 million"],
  ["iOS DAU", "140 million"],
  ["iPad DAU", "7 million"],
];

const designRules: ReactNode[] = [
  <>Dynamic layout system optimized for touch interactions on displays ≥&nbsp;10&nbsp;inches.</>,
  <>Support for multiple input methods like the keyboard, trackpad and Apple Pencil.</>,
  <>
    iPadOS provides system-level technologies like <strong className={emphasis}>Multi-Touch gestures</strong> and{" "}
    <strong className={emphasis}>Drag and Drop APIs</strong>, which enable interface patterns such as{" "}
    <strong className={emphasis}>Split View</strong> and <strong className={emphasis}>Stage Manager</strong>, along with
    system services like <strong className={emphasis}>Picture in Picture</strong>.
  </>,
  <>Use toolbars to position buttons and actions.</>,
];

// The closing recap: one line per idea, each taken from its section above.
const recap = [
  ["Flatten the navigation", "Content fills the display, and the bottom nav moves to the left side."],
  ["Show more content", "A 3-column grid uses the iPad’s 300% capacity."],
  ["Stay in context", "Watch videos and browse profiles at the same time."],
  ["Create an immersive experience", "The icons sit outside the content, and on both sides of the screen when shooting."],
  ["Keep watching while multitasking", "Watch TikTok while doing other tasks; in Split View the video moves on to the next."],
];

/** A patent or recognition card under the title block. */
function MetaCard({ icon, title, lines }: { icon: string; title: string; lines: string[] }) {
  return (
    <article className={`h-full px-6 py-6 ${CARD}`}>
      <Image src={`${A}/${icon}`} alt="" width={64} height={64} className="block size-[22px] rounded-[0.3rem] opacity-65 grayscale" />
      <h2 className="mt-5 text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--cs-heading)]">{title}</h2>
      <ul className="mt-3 flex flex-col gap-1 text-[15px] font-medium leading-6 text-[var(--cs-body-sm)]">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </article>
  );
}

/** One of the four layout principles: its numeral (as on the board), title and text, then its media. */
function Principle({ n, title, children, media }: { n: number; title: string; children: ReactNode; media: ReactNode }) {
  return (
    <div className={n === 1 ? "mt-20" : "mt-24"}>
      <Reveal className="grid gap-5 min-[1180px]:grid-cols-12 min-[1180px]:gap-10">
        <div className={`flex items-baseline gap-4 ${WIDE_LEFT}`}>
          <span aria-hidden className="text-[3.5rem] font-medium leading-none tracking-[-0.04em]" style={{ color: TT_RED }}>
            {String(n).padStart(2, "0")}
          </span>
          <SubHeading>{title}</SubHeading>
        </div>
        <div className={`flex flex-col gap-5 ${WIDE_RIGHT} ${bodyMd}`}>{children}</div>
      </Reveal>
      <div className="mt-10 flex flex-col gap-12">{media}</div>
    </div>
  );
}

export default function TikTokMultiPlatformPage() {
  return (
    <PortfolioShell sidebarTheme="light" mainClassName="bg-white text-[#171717]" contentClassName="min-w-0 bg-white text-[#171717]">
      <BoardGallery boards={Object.values(B)}>
        <article data-cs-theme="light" className="mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 xl:px-14 lg:pb-24 lg:pt-14">
          {/* HERO */}
          <figure className="overflow-hidden rounded-[1.75rem]">
            <Image
              src={`${A}/mp-02.jpg`}
              alt="TikTok for iPad floating above a real suspension-bridge scene"
              width={2700}
              height={1606}
              priority
              className="h-auto w-full"
            />
          </figure>

          <CaseHeader
            date="Feb 2021 — Jul 2021"
            title="TikTok Multi-platform"
            overview="It’s essential to explore optimal LTV at the UID level for TikTok users. To optimize cross-end user experience, we need to adapt the product framework to different ends, as well as define the key issue of “cross-end experience”."
            facts={projectStats}
          >
            <StaggerGrid className="mt-14 grid auto-rows-fr gap-4 lg:grid-cols-2">
              {recognition.map((r, i) => (
                <StaggerItem key={r.title} index={i} className="h-full">
                  <MetaCard {...r} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseHeader>

          {/* CHAPTERS */}
          <div className="mt-28 flex flex-col gap-28 sm:gap-36 lg:mt-36 lg:gap-44">
            <Chapter
              id="background"
              n="01"
              eyebrow="Background"
              title="The iPad is more than a touch screen"
              accent={TT_ACCENT}
              intro={
                <div className={`flex flex-col gap-6 ${bodyMd}`}>
                  <p>
                    In recent years, the iPad has undergone a significant transformation. From being a large touch screen
                    device, it has evolved to support multiple inputs and adapt to diverse situations. This evolution has
                    revolutionized how users engage with their applications.
                  </p>
                  <p>
                    An exceptional iPad app experience goes beyond an adaptive interface that adjusts to various window
                    sizes. It encompasses technologies such as multi-window functionality, drag and drop capabilities, and
                    support for diverse input modes available on the iPad.
                  </p>
                </div>
              }
            >
              {/* Daily active users: one panel, one type scale, each number sized to its cell. */}
              <StaggerGrid className="mt-14 grid gap-px overflow-hidden rounded-[1.25rem] bg-black/[0.05] sm:grid-cols-3">
                {dauStats.map(([label, value], i) => (
                  <StaggerItem key={label} index={i} className="@container bg-[#f6f6f6] px-6 py-7">
                    {/* bodySm, not the uppercase eyebrow: it would print "IOS" and "IPAD". */}
                    <p className={bodySm}>{label}</p>
                    <p className="mt-3 whitespace-nowrap text-[clamp(1.5rem,14cqw,2.75rem)] font-medium leading-none tracking-[-0.04em] text-[var(--cs-heading)]">
                      {value}
                    </p>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>

            <Chapter
              id="design-rules"
              n="02"
              eyebrow="Design rules"
              title="A great iPad app rests on four parts"
              accent={TT_ACCENT}
              intro={
                <ol className="flex flex-col border-t border-black/[0.08]">
                  {designRules.map((rule, i) => (
                    <li key={i} className="flex gap-5 border-b border-black/[0.08] py-5">
                      <span aria-hidden className={`text-xs font-semibold tabular-nums leading-[1.55rem] ${TT_ACCENT}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className={bodyMd}>{rule}</p>
                    </li>
                  ))}
                </ol>
              }
            />

            <Chapter
              id="dynamic-layout"
              n="03"
              eyebrow="Dynamic layout"
              title="Four principles for the larger display"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  For TikTok, the dynamic layout comes down to four principles: flatten the navigation, show more content,
                  stay in context, and create an immersive experience.
                </p>
              }
            >
              <Reveal className="mt-14">
                <Board {...B.principles} />
              </Reveal>

              <Principle
                n={1}
                title="Flatten the navigation"
                media={
                  <>
                    <Reveal>
                      <Board {...B.inbox} />
                    </Reveal>
                    <SubPair title="Larger video aspect ratio" className="mt-4">
                      <p>
                        Bottom nav to the left side. Approximately 90% of iPad users also utilize mobile devices. They are
                        well-versed in the functionality of bottom tab icons. By relocating the bottom tab to the left side of
                        the screen, we’ve optimized space utilization for greater efficiency. The iPad layout serves as a
                        foundational blueprint for potential TikTok Mac OS versions in the future.
                      </p>
                      <p>
                        Multitasking is the cornerstone of TikTok’s iPad design. It enables users to watch videos, read
                        comments, and make comments simultaneously.
                      </p>
                    </SubPair>
                    <Reveal>
                      <Board {...B.video} />
                    </Reveal>
                  </>
                }
              >
                <p>
                  The first step is to take advantage of the display, to show the content and user interface in the best
                  possible light. Instead of empty space, it fills the display with content like notifications, messages,
                  comments.
                </p>
              </Principle>

              <Principle
                n={2}
                title="Show more content"
                media={
                  <Reveal>
                    <Board {...B.grid} />
                  </Reveal>
                }
              >
                <p>
                  iPad can take up <strong className={emphasis}>300% capacity</strong> to present a lot more content. Use the
                  grid system to show more content. On iPad, we use a 3-column grid; the video cover and sound track are still
                  plenty big enough to see, read and tap on.
                </p>
              </Principle>

              <Principle
                n={3}
                title="Stay in context"
                media={
                  <Reveal>
                    <VideoFrame src={`${A}/mp-10.mp4`} className="border-0" />
                  </Reveal>
                }
              >
                <p>
                  In TikTok, there’s an increasing trend of segmented videos, where users divide a long video into several
                  short ones. Tapping ‘profile’ will redirect to a new page on mobile. However, on the iPad, we enable users to
                  watch videos and browse profiles at the same time.
                </p>
              </Principle>

              <Principle
                n={4}
                title="Create an immersive experience"
                media={
                  <Reveal>
                    <Board {...B.camera} />
                  </Reveal>
                }
              >
                <p>
                  The customized immersive layout is specific to iPad design; the icons are outside the content, which makes
                  the video cleaner. <strong className={emphasis}>The entire device becomes a piece of content</strong>.
                </p>
                <p>
                  <strong className={emphasis}>Gestures specific to iPad</strong>: the icons are placed on both sides of the
                  screen when you shoot a video. It’s easy to use with 2 hands when holding an iPad.
                </p>
              </Principle>
            </Chapter>

            <Chapter
              id="multitasking"
              n="04"
              eyebrow="Multi-task"
              title="Keep watching while multitasking"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  On iPad, many people tend to multitask while watching videos, such as writing documents, drawing, or even
                  cooking… Users can watch TikTok while doing other tasks, and the video will automatically switch to the next
                  in split view.
                </p>
              }
            >
              <Reveal className="mt-14">
                <Board {...B.multitask} />
              </Reveal>
            </Chapter>

            <Chapter
              id="outcome"
              n="05"
              eyebrow="Outcome"
              title="Featured on Apple’s September event"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  In September 2021, Apple Events featured TikTok in “What you can do with your iPad”.
                </p>
              }
            >
              <Reveal className="mt-14">
                <Board {...B.apple} />
              </Reveal>

              {/* Recap: the five ideas, each in a line taken from its section. */}
              <Reveal className={`mt-16 px-6 py-6 sm:px-8 sm:py-7 ${CARD}`}>
                <p className={eyebrowMeta}>Recap</p>
                <ol className="mt-4 flex flex-col">
                  {recap.map(([title, line], i) => (
                    <li
                      key={title}
                      className="grid gap-1 border-t border-black/[0.07] py-4 first:border-t-0 first:pt-2 sm:grid-cols-[2rem_15rem_1fr] sm:gap-4 min-[1180px]:grid-cols-[2rem_17rem_1fr]"
                    >
                      <span aria-hidden className={`hidden text-xs font-semibold tabular-nums leading-6 sm:block ${TT_ACCENT}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[15px] font-semibold leading-6 text-[var(--cs-heading)]">{title}</p>
                      <p className={`${bodySm} sm:leading-6`}>{line}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>

              <Reveal className="mt-16 border-t border-black/[0.08] pt-8">
                <p className="text-[clamp(1.25rem,2.4vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--cs-lead)]">
                  Mac OS &amp; TikTok TV to be continued…
                </p>
              </Reveal>
            </Chapter>
          </div>
          <CaseStudyFooter />
        </article>
      </BoardGallery>
      <NextSectionButton theme="light" />
    </PortfolioShell>
  );
}
