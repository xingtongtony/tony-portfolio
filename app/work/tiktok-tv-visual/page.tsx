import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import { Board, BoardGallery, type BoardImage } from "../../components/board-viewer";
import {
  CaseHeader,
  CaseStudyFooter,
  Chapter,
  StatRow,
  SubHeading,
  VideoFrame,
  WIDE_GRID,
} from "../../components/case-study";
import { TT_ACCENT, TV_CANVAS } from "../../lib/tiktok-tv";
import { surfaceQuiet, surfaceDefault, bodyMd, bodySm, emphasis, cardHoverDark } from "../../lib/tokens";

const A = "/portfolio/tiktok-tv";

const B = {
  feed: { src: `${A}/tv-20.jpg`, alt: "TikTok TV video consumption interface", width: 3200, height: 3200 },
  profile: { src: `${A}/tv-14.jpg`, alt: "TikTok TV profile interface", width: 3200, height: 3200 },
  feedLayers: { src: `${A}/tv-19.jpg`, alt: "Spatial layer concept for TikTok TV video consumption", width: 3200, height: 3200 },
  profileLayers: { src: `${A}/tv-11.jpg`, alt: "Spatial layer concept for TikTok TV profile", width: 3200, height: 3200 },
  coldStart: { src: `${A}/tv-09.png`, alt: "Cold start loading strategy diagram", width: 2446, height: 1738 },
} satisfies Record<string, BoardImage>;

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design"],
  ["Platform", "TV"],
  ["Patents", "6 Design Patents"],
];

const focusRules: { label: string; body: ReactNode; video: string }[] = [
  {
    label: "Horizontal Focus",
    body: (
      <>
        The static position of focus states consistently highlights the <strong className={emphasis}>second item</strong>{" "}
        in a horizontal row, ensuring a fixed point of interest along the horizontal axis.
      </>
    ),
    video: `${A}/tv-08.mp4`,
  },
  {
    label: "Vertical Focus",
    body: (
      <>
        The static position of focus states remains <strong className={emphasis}>centered</strong> on the list, ensuring
        the focal point stays in the middle of the vertical layout.
      </>
    ),
    video: `${A}/tv-07.mp4`,
  },
];

const features: { title: string; body: string; image: string; href?: string }[] = [
  {
    title: "Navigation",
    body: "A flexible navigation structure that improves the experience and usage.",
    image: `${A}/tv-12.png`,
    href: "/work/tiktok-tv-navigation",
  },
  {
    title: "My & Others Profile",
    body: "Differentiated profile designs meet user consumption needs across different scenarios.",
    image: `${A}/tv-18.png`,
    href: "/work/tiktok-tv-profile",
  },
  {
    title: "Search & Result",
    body: "The first TV search feature specifically designed for short videos.",
    image: `${A}/tv-10.png`,
    href: "/work/tiktok-tv-search",
  },
];

/** A patent or credits card under the title block. */
function MetaCard({ icon, iconSize, title, lines }: { icon: string; iconSize: number; title: string; lines: string[] }) {
  return (
    <article className={`rounded-[1.25rem] px-6 py-6 ${surfaceQuiet}`}>
      <Image src={icon} alt="" width={iconSize} height={iconSize} className="block size-[22px] rounded-[0.4rem] object-contain opacity-65 grayscale" />
      <h2 className="mt-5 text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--cs-heading)]">{title}</h2>
      <ul className="mt-3 flex flex-col gap-1 text-[15px] font-medium leading-6 text-[var(--cs-body-sm)]">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </article>
  );
}

export default function TikTokTvVisualPage() {
  return (
    <PortfolioShell {...TV_CANVAS.shell}>
      <BoardGallery boards={Object.values(B)}>
        <article data-cs-theme={TV_CANVAS.theme} className="mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 sm:pt-10 xl:px-14 lg:pb-24 lg:pt-14">
          {/* HERO */}
          <figure className="overflow-hidden rounded-[1.75rem]">
            <Image
              src={`${A}/tv-17.jpg`}
              alt="TikTok TV interface shown on a living room television"
              width={2700}
              height={1605}
              priority
              className="h-auto w-full"
            />
          </figure>

          <CaseHeader
            date="Apr 2024 — Oct 2024"
            title="TikTok TV revamp"
            overview="TikTok is a fast-growing product, and we started to realize that TikTok TV can showcase a wider variety of content better suited for TV viewing experiences — such as longer videos, series, and subscription-based videos."
            facts={projectStats}
          >
            <div className="mt-14 grid gap-4 lg:grid-cols-2">
              <MetaCard
                icon={`${A}/tv-15.png`}
                iconSize={72}
                title="6 Design Patents"
                lines={["Video related interactive patent", "Design inventions", "Apr 2024 — Oct 2024"]}
              />
              <MetaCard icon={`${A}/tv-13.png`} iconSize={112} title="Special thanks" lines={["Nina Ding", "Zhanchen Zhang", "Weilong Gao"]} />
            </div>
          </CaseHeader>

          {/* CHAPTERS */}
          <div className="mt-28 flex flex-col gap-28 sm:gap-36 lg:mt-36 lg:gap-44">
            <Chapter
              id="why-tv"
              n="01"
              eyebrow="Background"
              title="TV became a core business for TikTok"
              accent={TT_ACCENT}
              intro={
                <div className={`flex flex-col gap-6 ${bodyMd}`}>
                  <p>
                    Since its successful launch in the North American market in November 2021, TikTok TV has
                    successively landed on Android and webOS platforms. We have continuously optimized the product during
                    this period and accumulated valuable market experience.
                  </p>
                  <p>
                    By the second half of 2023, as the TV business gradually became one of the core segments of PGC, we
                    began significantly increasing our investment in this field.
                  </p>
                </div>
              }
            >
              <div className="mt-14">
                <StatRow
                  items={[
                    { label: "All device DAU", value: "1.9M" },
                    { label: "Android TV", value: "70%" },
                    { label: "Web TV", value: "30%", dim: true },
                  ]}
                  bar={[70, 30]}
                />
              </div>
            </Chapter>

            <Chapter
              id="vast-window"
              n="02"
              eyebrow="The new visual"
              title="The screen as a window, not a surface"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  We wanted TikTok TV to feel like a vast window — turning the screen into a spatial medium that connects
                  the user&apos;s room to what&apos;s playing on it. The goal was a sensation of depth that carries through
                  every layer of the interface, not just a flat surface to scroll on.
                </p>
              }
            >
              <Reveal className="mt-14">
                <VideoFrame src={`${A}/tv-05.mp4`} className="border-0" />
              </Reveal>
              <Reveal className={`mt-14 ${WIDE_GRID}`}>
                <p className={`min-[1180px]:col-span-7 min-[1180px]:col-start-6 ${bodyMd}`}>
                  True depth is expensive. On Web TV and Android TV, real blur effects and color-driven motion cause
                  significant performance issues. We solved it with layered transparent color — spotlight backgrounds
                  bleed through the layers above, creating depth without the cost.
                </p>
              </Reveal>
              <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-2">
                {[B.feed, B.profile, B.feedLayers, B.profileLayers].map((board, i) => (
                  <StaggerItem key={board.src} index={i}>
                    <Board {...board} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>

            <Chapter
              id="interactions"
              n="03"
              eyebrow="The new identity"
              title="Motion that answers the remote"
              accent={TT_ACCENT}
              intro={
                <div className={`flex flex-col gap-6 ${bodyMd}`}>
                  <p>
                    On TV, animation isn&apos;t decoration. It&apos;s the feedback layer — what just happened,
                    what&apos;s next — and the identity layer that gives the interface its tone across a 10-foot living
                    room.
                  </p>
                  <p>
                    This iteration pushes further. Motion now responds to remote input, organized around three principles
                    covered below: dynamic backgrounds, in &amp; out transitions, and cold-start loading.
                  </p>
                </div>
              }
            >
              <Reveal className="mt-20 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
                <div>
                  <SubHeading>Dynamic background &amp; video consumption</SubHeading>
                  <p className={`mt-5 ${bodyMd}`}>
                    As the most important element on TikTok TV video feeds, users spend nearly 90% of their time on the
                    feed and engaging in video interactions. We introduced an immersive background based on the current
                    video to improve the spatial watching experience.
                  </p>
                </div>
                <VideoFrame src={`${A}/tv-01.mp4`} className="border-0" />
              </Reveal>

              <Reveal className="mt-20 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
                <div>
                  <SubHeading>Feeling of In &amp; out</SubHeading>
                  <p className={`mt-5 ${bodyMd}`}>
                    To create an immersive TV consumption experience, we added smoother animation when entering and
                    exiting pages, allowing users to perceive the spatial relationships between pages.
                  </p>
                </div>
                <VideoFrame src={`${A}/tv-02.mp4`} className="border-0" />
              </Reveal>

              <Reveal className="mt-10">
                <p className={`max-w-3xl ${bodyMd}`}>
                  Scaling the interface by 30% from top to bottom makes the transition more noticeable — without being
                  overly dramatic on the TV screen.
                </p>
                <VideoFrame src={`${A}/tv-03.mp4`} className="mt-7 border-0" />
              </Reveal>

              {/* Cold start loading — the video pins while the three paragraphs scroll. */}
              <div className="mt-20 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
                <div className={`flex flex-col gap-8 ${bodyMd}`}>
                  <div>
                    <SubHeading>Cold start loading</SubHeading>
                    <p className="mt-5">
                      Due to the product&apos;s modality, TikTok TV requires additional time to preload FYF videos during
                      the cold start phase. To address this, we implemented two animations that serve to extend the cold
                      start period across various TV devices.
                    </p>
                  </div>
                  <p>
                    We have observed that users enter the feed before the interface has fully loaded, and they tend to
                    lose patience after a prolonged wait.
                  </p>
                  <p>
                    Loop loading should commence once the TikTok logo is hidden. It is essential to ensure that all
                    content and components are fully prepared prior to the conclusion of the cold start video playback.
                  </p>
                </div>
                <div className="lg:sticky lg:top-8 lg:self-start">
                  <VideoFrame src={`${A}/tv-06.mp4`} className="border-0" />
                </div>
              </div>

              <Reveal className="mt-10">
                <Board {...B.coldStart} />
              </Reveal>
            </Chapter>

            <Chapter id="components-focus" n="04" eyebrow="The new looks" title="Focus that stays where you expect" accent={TT_ACCENT}>
              <Reveal className="mt-14 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
                <div>
                  <SubHeading>Components</SubHeading>
                  <div className={`mt-5 flex flex-col gap-6 ${bodyMd}`}>
                    <p>
                      We apply the new TV visual system while maintaining consistency with TikTok&apos;s design system in
                      component proportions, corners, and gradients.
                    </p>
                    <p>
                      To align with the TV interface&apos;s spatial design, we extensively use transparent colors across
                      components for a unified look.
                    </p>
                  </div>
                </div>
                <VideoFrame src={`${A}/tv-04.mp4`} className="border-0" />
              </Reveal>

              <Reveal className={`mt-20 ${WIDE_GRID}`}>
                <div className="min-[1180px]:col-span-5">
                  <SubHeading>Focus</SubHeading>
                </div>
                <p className={`min-[1180px]:col-span-7 ${bodyMd}`}>
                  Compared with touch-based interfaces, television interfaces emphasize default, focused, and pressed
                  states to capture attention on the selected element. This approach forms the foundation for initiating
                  navigation.
                </p>
              </Reveal>

              <StaggerGrid className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-2">
                {focusRules.map(({ label, body, video }, i) => (
                  <StaggerItem key={label} index={i}>
                    <VideoFrame src={video} className="border-0" />
                    <h4 className="mt-6 text-xl font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--cs-heading)]">{label}</h4>
                    <p className={`mt-3 ${bodyMd}`}>{body}</p>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>

            <Chapter id="features" n="05" eyebrow="Highlights" title="Features" accent={TT_ACCENT}>
              <StaggerGrid className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-3">
                {features.map(({ title, body, image, href }, i) => {
                  const cardClass = `group flex h-full flex-col overflow-hidden rounded-[1.25rem] ${surfaceDefault} ${href ? cardHoverDark : ""}`;
                  const inner = (
                    <>
                      <div className="overflow-hidden">
                        <Image
                          src={image}
                          alt={`${title} feature preview`}
                          width={1600}
                          height={1200}
                          className="h-auto w-full transition duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--cs-heading)]">{title}</h3>
                        <p className={`mt-2 ${bodySm}`}>{body}</p>
                      </div>
                    </>
                  );
                  return (
                    <StaggerItem key={title} index={i} className="h-full">
                      {href ? (
                        <Link href={href} data-cursor="view" aria-label={`Open ${title} case study`} className={cardClass}>
                          {inner}
                        </Link>
                      ) : (
                        <article className={cardClass}>{inner}</article>
                      )}
                    </StaggerItem>
                  );
                })}
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

