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
  ["Patents", "6 Design Patents"],
];

const focusRules: { label: string; body: ReactNode; video: string }[] = [
  {
    label: "Horizontal Focus",
    body: (
      <>
        The static position of focus states consistently highlights the{" "}
        <strong className={emphasis}>second item</strong> in a horizontal row,
        ensuring a fixed point of interest along the horizontal axis.
      </>
    ),
    video: "/portfolio/tiktok-tv/tv-08.mp4",
  },
  {
    label: "Vertical Focus",
    body: (
      <>
        The static position of focus states remains{" "}
        <strong className={emphasis}>centered</strong> on the list, ensuring the
        focal point stays in the middle of the vertical layout.
      </>
    ),
    video: "/portfolio/tiktok-tv/tv-07.mp4",
  },
];

const features: {
  title: string;
  body: string;
  image: string;
  href?: string;
}[] = [
  {
    title: "Navigation",
    body: "Flexible navigation structure, improve user experience and usage.",
    image: "/portfolio/tiktok-tv/tv-12.png",
    href: "/work/tiktok-tv-navigation",
  },
  {
    title: "My & Others Profile",
    body: "Differentiated profile designs meet user consumption needs across different scenarios.",
    image: "/portfolio/tiktok-tv/tv-18.png",
  },
  {
    title: "Search & Result",
    body: "The first TV search feature specifically designed for short videos.",
    image: "/portfolio/tiktok-tv/tv-10.png",
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

export default function TikTokTvVisualPage() {
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
            src="/portfolio/tiktok-tv/tv-17.jpg"
            alt="TikTok TV interface shown on a living room television"
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
            TikTok TV revamp
          </h1>

          <div className="mt-12">
            <p className={eyebrowSection}>Overview</p>
            <p className="mt-6 max-w-3xl text-lg leading-[1.5] tracking-[-0.01em] text-white/72">
              TikTok is a fast growing product, and we started to realize that
              TikTok TV can showcase a wider variety of content better suited
              for TV viewing experiences — such as longer videos, series, and
              subscription-based videos.
            </p>
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
                i % 2 === 1
                  ? "sm:border-l sm:border-white/[0.05]"
                  : ""
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

        {/* PATENTS + CREDITS */}
        <section className="mt-4 grid gap-x-12 gap-y-4 lg:grid-cols-2">
          <article className={`rounded-[1.25rem] px-6 py-6 ${surfaceQuiet}`}>
            <Image
              src="/portfolio/tiktok-tv/tv-15.png"
              alt=""
              width={72}
              height={72}
              className="block size-[22px] rounded-[0.4rem] opacity-65 grayscale"
            />
            <h2 className="mt-5 text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.02em] text-white">
              6 Design Patent
            </h2>
            <ul className="mt-3 flex flex-col gap-1 text-[15px] font-medium leading-6 text-white/56">
              <li>Video related interactive patent</li>
              <li>Design inventions</li>
              <li>Apr 2024 — Oct 2024</li>
            </ul>
          </article>

          <article className={`rounded-[1.25rem] px-6 py-6 ${surfaceQuiet}`}>
            <Image
              src="/portfolio/tiktok-tv/tv-13.png"
              alt=""
              width={112}
              height={112}
              className="block size-[22px] object-contain opacity-65 grayscale"
            />
            <h2 className="mt-5 text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.02em] text-white">
              Special thanks
            </h2>
            <ul className="mt-3 flex flex-col gap-1 text-[15px] font-medium leading-6 text-white/56">
              <li>Nina Ding</li>
              <li>Zhanchen Zhang</li>
              <li>Weilong Gao</li>
            </ul>
          </article>
        </section>

        {/* SECTION FLOW */}
        <div className="mt-32 flex flex-col gap-32 lg:mt-40 lg:gap-40">
          {/* BACKGROUND — WHY TV? */}
          <CaseSection eyebrow="Background" title="Why TV?">
            <Reveal className={`mt-8 max-w-3xl flex flex-col gap-7 ${bodyMd}`}>
              <p>
                Since its successful launch in the North American market in
                November 2021, TikTok TV has successively landed on Android and
                webOS platforms. We have continuously optimized the product
                during this period and accumulated valuable market experience.
              </p>
              <p>
                By the second half of 2023, as the TV business gradually became
                one of the core segments of PGC, we began significantly
                increasing our investment in this field.
              </p>
            </Reveal>

            <Reveal
              className={`mt-10 rounded-[1.25rem] p-7 sm:p-9 ${surfaceDefault}`}
            >
              <div className="grid gap-10 sm:grid-cols-3 sm:items-end">
                <div>
                  <p className={eyebrowMeta}>All device DAU</p>
                  <p className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-white">
                    1.9M
                  </p>
                </div>
                <div>
                  <p className={eyebrowMeta}>Android TV</p>
                  <p className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-white">
                    70%
                  </p>
                </div>
                <div>
                  <p className={eyebrowMeta}>Web TV</p>
                  <p className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-white/72">
                    30%
                  </p>
                </div>
              </div>
              <div className="mt-9 flex h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="bg-white/80" style={{ width: "70%" }} />
                <div className="bg-white/30" style={{ width: "30%" }} />
              </div>
            </Reveal>
          </CaseSection>

          {/* THE NEW VISUAL — VAST WINDOW */}
          <CaseSection eyebrow="The new visual" title="A vast window of TV">
            <Reveal>
              <p className={`mt-8 max-w-3xl ${bodyMd}`}>
                We wanted TikTok TV to feel like a vast window — turning the
                screen into a spatial medium that connects the user&apos;s
                room to what&apos;s playing on it. The goal was a sensation
                of depth that carries through every layer of the interface,
                not just a flat surface to scroll on.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <VideoFrame src="/portfolio/tiktok-tv/tv-05.mp4" />
            </Reveal>

            <Reveal>
              <p className={`mt-10 max-w-3xl ${bodyMd}`}>
                True depth is expensive. On Web TV and Android TV, real blur
                effects and color-driven motion cause significant performance
                issues. We solved it with layered transparent color —
                spotlight backgrounds bleed through the layers above,
                creating depth without the cost.
              </p>
            </Reveal>

            <StaggerGrid className="mt-10 grid gap-x-12 gap-y-5 sm:grid-cols-2">
              {[
                ["/portfolio/tiktok-tv/tv-20.jpg", "TikTok TV video consumption interface"],
                ["/portfolio/tiktok-tv/tv-14.jpg", "TikTok TV profile interface"],
                ["/portfolio/tiktok-tv/tv-19.jpg", "Spatial layer concept for TikTok TV video consumption"],
                ["/portfolio/tiktok-tv/tv-11.jpg", "Spatial layer concept for TikTok TV profile"],
              ].map(([src, alt], i) => (
                <StaggerItem key={src} index={i}>
                  <ImageFrame
                    src={src}
                    alt={alt}
                    width={3200}
                    height={3200}
                  />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>

          {/* THE NEW IDENTITY — INTERACTIONS & ANIMATION */}
          <CaseSection
            eyebrow="The new identity"
            title="Interactions & Animation"
          >
            <Reveal className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-2">
              <p className={bodyMd}>
                On TV, animation isn&apos;t decoration. It&apos;s the feedback
                layer — what just happened, what&apos;s next — and the
                identity layer that gives the interface its tone across a
                10-foot living room.
              </p>
              <p className={bodyMd}>
                This iteration pushes further. Motion now responds to remote
                input, organized around three principles covered below:
                dynamic backgrounds, in &amp; out transitions, and cold-start
                loading.
              </p>
            </Reveal>

            {/* Sub-section: Dynamic background */}
            <Reveal className="mt-20 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
              <div>
                <SubHeading>
                  Dynamic background &amp; video consumption
                </SubHeading>
                <p className={`mt-5 ${bodyMd}`}>
                  As the most important element on TikTok TV video feeds, users
                  spend nearly 90% of their time on the feed and engaging in
                  video interactions. We introduced an immersive background
                  based on the current video to improve the spatial watching
                  experience.
                </p>
              </div>
              <VideoFrame src="/portfolio/tiktok-tv/tv-01.mp4" />
            </Reveal>

            {/* Sub-section: Feeling of In & Out */}
            <Reveal className="mt-20 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
              <div>
                <SubHeading>Feeling of In &amp; out</SubHeading>
                <p className={`mt-5 ${bodyMd}`}>
                  To create an immersive TV consumption experience, we added
                  smoother animation when entering and exiting pages, allowing
                  users to perceive the spatial relationships between pages.
                </p>
              </div>
              <VideoFrame src="/portfolio/tiktok-tv/tv-02.mp4" />
            </Reveal>

            {/* Sub-row: 30% scaling rule */}
            <Reveal className="mt-10">
              <p className={`max-w-3xl ${bodyMd}`}>
                Scaling the interface by 30% from top to bottom makes the
                transition more noticeable — without being overly dramatic
                on the TV screen.
              </p>
              <VideoFrame
                src="/portfolio/tiktok-tv/tv-03.mp4"
                className="mt-7"
              />
            </Reveal>

            {/* Sub-section: Cold start loading — sticky media */}
            <div className="mt-20 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
              <div className="flex flex-col gap-8">
                <div>
                  <SubHeading>Cold start loading</SubHeading>
                  <p className={`mt-5 ${bodyMd}`}>
                    Due to the product&apos;s modality, TikTok TV requires
                    additional time to preload FYF videos during the cold start
                    phase. To address this, we implemented two animations that
                    serve to extend the cold start period across various TV
                    devices.
                  </p>
                </div>
                <p className={bodyMd}>
                  We have observed that users enter the feed before the
                  interface has fully loaded, and they tend to lose patience
                  after a prolonged wait.
                </p>
                <p className={bodyMd}>
                  Loop loading should commence once the TikTok logo is hidden.
                  It is essential to ensure that all content and components are
                  fully prepared prior to the conclusion of the cold start
                  video playback.
                </p>
              </div>
              <div className="lg:sticky lg:top-8 lg:self-start">
                <VideoFrame src="/portfolio/tiktok-tv/tv-06.mp4" />
              </div>
            </div>

            <Reveal className="mt-10">
              <ImageFrame
                src="/portfolio/tiktok-tv/tv-09.png"
                alt="Cold start loading strategy diagram"
                width={2446}
                height={1738}
              />
            </Reveal>
          </CaseSection>

          {/* THE NEW LOOKS — COMPONENTS & FOCUS */}
          <CaseSection eyebrow="The new looks" title="Components & Focus">
            {/* Sub-section: Components */}
            <Reveal className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
              <div>
                <SubHeading>Components</SubHeading>
                <div className={`mt-5 flex flex-col gap-6 ${bodyMd}`}>
                  <p>
                    We apply the new TV visual system while maintaining
                    consistency with TikTok&apos;s design system in component
                    proportions, corners, and gradients.
                  </p>
                  <p>
                    To align with the TV interface&apos;s spatial design, we
                    extensively use transparent colors across components for a
                    unified look.
                  </p>
                </div>
              </div>
              <VideoFrame src="/portfolio/tiktok-tv/tv-04.mp4" />
            </Reveal>

            {/* Sub-section: Focus */}
            <Reveal className="mt-20">
              <SubHeading>Focus</SubHeading>
              <p className={`mt-5 max-w-3xl ${bodyMd}`}>
                Compared with touch-based interfaces, television interfaces
                emphasize default, focused, and pressed states to capture
                attention on the selected element. This approach forms the
                foundation for initiating navigation.
              </p>
            </Reveal>

            <StaggerGrid className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-2">
              {focusRules.map(({ label, body, video }, i) => (
                <StaggerItem key={label} index={i}>
                  <VideoFrame src={video} />
                  <h4 className="mt-6 text-xl font-semibold leading-[1.25] tracking-[-0.02em] text-white">
                    {label}
                  </h4>
                  <p className={`mt-3 ${bodyMd}`}>{body}</p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>

          {/* FEATURES */}
          <CaseSection eyebrow="Highlights" title="Features">
            <StaggerGrid className="mt-8 grid gap-5 lg:grid-cols-3">
              {features.map(({ title, body, image, href }, i) => {
                const cardClass = `group flex h-full flex-col overflow-hidden rounded-[1.25rem] ${surfaceDefault} ${cardHoverDark}`;
                const cardInner = (
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
                      <h3 className="text-lg font-semibold leading-[1.25] tracking-[-0.02em] text-white">
                        {title}
                      </h3>
                      <p className={`mt-2 ${bodySm}`}>{body}</p>
                    </div>
                  </>
                );

                if (href) {
                  return (
                    <StaggerItem key={title} index={i} className="h-full">
                      <Link
                        href={href}
                        data-cursor="view"
                        aria-label={`Open ${title} case study`}
                        className={cardClass}
                      >
                        {cardInner}
                      </Link>
                    </StaggerItem>
                  );
                }

                return (
                  <StaggerItem key={title} index={i} className="h-full">
                    <article className={cardClass}>{cardInner}</article>
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
