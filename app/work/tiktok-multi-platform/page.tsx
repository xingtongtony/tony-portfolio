import Image from "next/image";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import {
  CaseSection,
  SubHeading,
  ImageFrame,
  VideoFrame,
  CaseStudyFooter,
} from "../../components/case-study";
import {
  eyebrowSection,
  eyebrowMeta,
  surfaceQuiet,
  bodyMd,
  bodySm,
  emphasis,
} from "../../lib/tokens";

const A = "/portfolio/tiktok-multi-platform";

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design"],
  ["Platform", "Tablet"],
];

// Recognition badges — icon + title + subtitle + date.
const recognition = [
  {
    icon: "mp-03.png",
    title: "10 Design Patent",
    subtitle: "Video related interactive patent",
    date: "Apr 2021",
  },
  {
    icon: "mp-04.png",
    title: "Featured on Apple Events",
    subtitle: "What you can do with your iPad",
    date: "Set 2021",
  },
];

const dauStats = [
  ["All device DAU", "433 million"],
  ["iOS DAU", "140 million"],
  ["iPad DAU", "7 million"],
];

export default function TikTokMultiPlatformPage() {
  return (
    <PortfolioShell
      sidebarTheme="light"
      mainClassName="bg-white text-[#171717]"
      contentClassName="min-w-0 bg-white text-[#171717]"
    >
      <article
        data-cs-theme="light"
        className="mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 lg:px-14 lg:pb-24 lg:pt-14"
      >
        {/* HERO */}
        <figure className="overflow-hidden rounded-[1.75rem] border border-[var(--cs-border)]">
          <Image
            src={`${A}/mp-02.jpg`}
            alt="TikTok for iPad floating above a real suspension-bridge scene"
            width={2700}
            height={1606}
            priority
            className="h-auto w-full"
          />
        </figure>

        {/* TITLE + OVERVIEW */}
        <section className="pb-12 pt-14 lg:pb-16 lg:pt-20">
          <p className={eyebrowMeta}>Feb 2021 - Jul 2021</p>

          <h1 className="mt-6 max-w-[20ch] text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1] tracking-[-0.03em] text-[var(--cs-heading)] text-balance">
            TikTok Multi-platform
          </h1>

          <div className="mt-12">
            <p className={eyebrowSection}>Overview</p>
            <p className="mt-6 max-w-3xl text-lg leading-[1.5] tracking-[-0.01em] text-[var(--cs-body)]">
              It’s essential to explore optimal LTV on UID level for TikTok
              users. To optimize cross-end user experience, we need adapt product
              framework in different ends, as well as define the key issue of
              “cross-end experience”.
            </p>
          </div>

          <dl
            className={`mt-10 grid overflow-hidden rounded-[1.25rem] sm:grid-cols-3 ${surfaceQuiet}`}
          >
            {projectStats.map(([label, value], i) => (
              <div
                key={label}
                className={`px-6 py-5 ${
                  i > 0
                    ? "border-t border-[var(--cs-border)] sm:border-t-0 sm:border-l sm:border-[var(--cs-border)]"
                    : ""
                }`}
              >
                <dt className={eyebrowMeta}>{label}</dt>
                <dd className="mt-3 text-[15px] font-medium leading-6 text-[var(--cs-heading)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Recognition badges */}
          <StaggerGrid className="mt-10 grid gap-x-12 gap-y-5 sm:grid-cols-2">
            {recognition.map((r, i) => (
              <StaggerItem
                key={r.title}
                index={i}
                className={`flex items-start gap-4 rounded-[var(--r-md)] border border-[var(--cs-border-2)] px-6 py-5 ${surfaceQuiet}`}
              >
                <Image
                  src={`${A}/${r.icon}`}
                  alt=""
                  width={64}
                  height={64}
                  className="h-7 w-7 shrink-0"
                />
                <div>
                  <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--cs-heading)]">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-sm leading-[1.4] text-[var(--cs-body)]">
                    {r.subtitle}
                  </p>
                  <p className={`mt-2 ${eyebrowMeta}`}>{r.date}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal className="mt-10">
            <ImageFrame
              src={`${A}/mp-05.jpg`}
              alt="TikTok featured at Apple’s September 14 event"
              width={2388}
              height={1616}
            />
          </Reveal>
        </section>

        {/* SECTION FLOW */}
        <div className="mt-24 flex flex-col gap-32 lg:mt-28 lg:gap-40">
          {/* BACKGROUND */}
          <CaseSection eyebrow="Background" title="Design for iPad">
            <Reveal className={`mt-8 max-w-3xl flex flex-col gap-7 ${bodyMd}`}>
              <p>
                In recent years, the iPad has undergone a significant
                transformation. From being a large touch screen device, it has
                evolved to support multiple inputs and adapt to diverse
                situations. This evolution has revolutionized how users engage
                with their applications.
              </p>
              <p>
                An exceptional iPad app experience goes beyond an adaptive
                interface that adjusts to various window sizes. It encompasses
                technologies such as multi-window functionality, drag and drop
                capabilities, and support for diverse input modes available on
                the iPad.
              </p>
            </Reveal>

            <StaggerGrid className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-3">
              {dauStats.map(([label, value], i) => (
                <StaggerItem key={label} index={i}>
                  <p className={bodySm}>{label}</p>
                  <p className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-none tracking-[-0.03em] text-[var(--cs-heading)]">
                    {value}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>

          {/* DESIGN RULES */}
          <CaseSection
            eyebrow="Design rules"
            title="Designing a great iPad app: 4 parts"
          >
            <ol
              className={`mt-8 flex max-w-3xl list-decimal flex-col gap-5 pl-5 ${bodyMd}`}
            >
              <li>
                Dynamic layout system optimized for touch interactions on
                displays ≥ 10 inches.
              </li>
              <li>
                Support for multiple input methods like the Keyboard, Trackpad
                and Apple Pencil.
              </li>
              <li>
                iPadOS provides system-level technologies like{" "}
                <strong className={emphasis}>Multi-Touch gestures</strong> and{" "}
                <strong className={emphasis}>Drag and Drop APIs</strong>, which
                enable interface patterns such as{" "}
                <strong className={emphasis}>Split View</strong> and{" "}
                <strong className={emphasis}>Stage Manager</strong>, along with
                system services like{" "}
                <strong className={emphasis}>Picture in Picture</strong>.
              </li>
              <li>Use toolbars to position buttons and actions.</li>
            </ol>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/mp-06.jpg`}
                alt="The four iPad design principles — Flatten the navigation, Show more content, Stay in context, Immersive experiences"
                width={2880}
                height={1800}
              />
            </Reveal>
          </CaseSection>

          {/* 01 — FLATTEN THE NAVIGATION */}
          <CaseSection
            eyebrow="Dynamic layout"
            title="01 · Flatten the navigation"
          >
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                The first step is to take the advantage of the display, to show
                the content and user interface in the best possible light.
                Instead of empty space, it fills the display with the content
                like notifications, messages, comments.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/mp-07.jpg`}
                alt="Direct Message and Inbox laid out across iPad and iPhone"
                width={2880}
                height={1800}
              />
            </Reveal>

            <Reveal className="mt-16 max-w-3xl">
              <SubHeading>Larger video aspect ratio</SubHeading>
              <div className={`mt-5 flex flex-col gap-5 ${bodyMd}`}>
                <p>
                  Bottom nav to the left side. Approximately 90% of iPad users
                  also utilize mobile devices. They are well-versed in the
                  functionality of bottom tab icons. By relocating the bottom tab
                  to the left side of the screen, we’ve optimized space
                  utilization for greater efficiency. The iPad layout serves as a
                  foundational blueprint for potential TikTok Mac OS versions in
                  the future.
                </p>
                <p>
                  Multitasking is the cornerstone of TikTok’s iPad design. It
                  enables users to watch videos, read comments, and make comments
                  simultaneously.
                </p>
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/mp-08.jpg`}
                alt="Larger video aspect ratio with the bottom nav moved to the left side"
                width={2880}
                height={1800}
              />
            </Reveal>
          </CaseSection>

          {/* 02 — SHOW MORE CONTENT */}
          <CaseSection eyebrow="Dynamic layout" title="02 · Show more content">
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                iPad can take up <strong className={emphasis}>300% capacity</strong>{" "}
                to presenting a lot more contents, use the grid system to show
                more content. In iPad, we user 3 column grid, the video cover and
                sounds track are still plenty big enough to see, read and tap on.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/mp-09.jpg`}
                alt="Three-column grid showing more content per screen on iPad"
                width={2880}
                height={1800}
              />
            </Reveal>
          </CaseSection>

          {/* 03 — STAY IN CONTEXT */}
          <CaseSection eyebrow="Dynamic layout" title="03 · Stay in context">
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                In TikTok, there’s an increasing trend of segmented videos, where
                users divide a long video into several short ones. Tapping
                ‘profile’ will redirects to new page on mobile. However, on the
                iPad, we enable users to watch videos and browse profiles in the
                same time.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <VideoFrame src={`${A}/mp-10.mp4`} />
            </Reveal>
          </CaseSection>

          {/* 04 — CREATE IMMERSIVE EXPERIENCE */}
          <CaseSection
            eyebrow="Dynamic layout"
            title="04 · Create immersive experience"
          >
            <Reveal className={`mt-8 max-w-3xl flex flex-col gap-5 ${bodyMd}`}>
              <p>
                The customized immersive layout is specific for iPad design, the
                icons are in the outside of the content which make the video is
                more clean.{" "}
                <strong className={emphasis}>
                  The entire device becoming a piece of content
                </strong>
                .
              </p>
              <p>
                <strong className={emphasis}>Gesture specific for iPad</strong>,
                The icons are placed in the both side of the screen when you
                Shooting a video. it’s easy to use with 2 hands when holding an
                iPad.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/mp-11.jpg`}
                alt="Immersive iPad layout with the icons placed outside the content"
                width={2880}
                height={1800}
              />
            </Reveal>
          </CaseSection>

          {/* 05 — MULTI WINDOW */}
          <CaseSection
            eyebrow="Multi-task"
            title="05 · Multi-window & split view"
          >
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                From iPad, many people tend to multitask while watching videos,
                such as writing documents, drawing, or even cooking… Users can
                watch TikTok while doing other tasks, and the video will
                automatically switch to the next in split view.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/mp-12.jpg`}
                alt="Multi-window, split view and picture in picture on iPad"
                width={2880}
                height={1800}
              />
            </Reveal>
          </CaseSection>

          {/* CLOSING */}
          <Reveal className="text-center">
            <p className="text-[clamp(1.25rem,2.4vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--cs-lead)]">
              Mac OS &amp; TikTok TV to be continue…
            </p>
          </Reveal>
        </div>
        <CaseStudyFooter />
      </article>
      <NextSectionButton theme="light" />
    </PortfolioShell>
  );
}
