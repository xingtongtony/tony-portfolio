import Image from "next/image";
import Link from "next/link";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import {
  CaseSection,
  SubHeading,
  MediaCaption,
  ImageFrame,
  VideoFrame,
  CaseStudyFooter,
} from "../../components/case-study";
import { HoverVideo } from "../../components/hover-video";
import { ScrollRevealText } from "../../components/scroll-reveal-text";
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

const A = "/portfolio/tiktok-tv-profile";

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
            src={`${A}/pf-01.jpg`}
            alt="TikTok TV profile redesign in a living room TV interface"
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
            TikTok TV Profile
          </h1>

          <div className="mt-12">
            <p className={eyebrowSection}>Overview</p>
            <p className="mt-6 max-w-3xl text-lg leading-[1.5] tracking-[-0.01em] text-white/72">
              We are optimizing the &apos;My Profile&apos; and &apos;Other&apos;s
              Profile&apos; features to deliver enhanced value to TikTok TV
              users. The updated profiles will allow users to effortlessly access
              their curated content assets and quickly build relationships
              through other creators&apos; profiles.
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
              src={`${A}/pf-02.png`}
              alt=""
              width={72}
              height={72}
              className="block size-[22px] opacity-65 grayscale"
            />
            <h2 className="mt-5 text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.02em] text-white">
              1 Design Patent
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
          {/* PROBLEMS */}
          <CaseSection eyebrow="Problems" title="What's the difference?">
            <Reveal className={`mt-8 max-w-3xl flex flex-col gap-7 ${bodyMd}`}>
              <p>
                The initial profile pages were built in 2020. It&apos;s an MVP
                version for users to view the creator&apos;s details.
              </p>
              <p>
                We found out that interactions vary between &apos;My
                Profile&apos; and &apos;Others Profile&apos;: focus on Liked and
                Favorited video consumption in &apos;My Profile&apos;, with no
                social features. In &apos;Others Profiles&apos;, prioritize
                social attributes, placing user info at the top visual area.
              </p>
            </Reveal>

            <StaggerGrid className="mt-10 grid gap-x-12 gap-y-5 sm:grid-cols-2">
              {[
                { src: `${A}/pf-03.png`, label: "My Profile" },
                { src: `${A}/pf-04.png`, label: "Others Profile" },
              ].map((it, i) => (
                <StaggerItem key={it.label} index={i}>
                  <ImageFrame
                    src={it.src}
                    alt={`${it.label} — original 2020 MVP layout`}
                    width={1600}
                    height={1000}
                  />
                  <p className={`mt-5 ${bodySm}`}>
                    <span className="font-semibold text-white">{it.label}</span>
                  </p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>

          {/* THE FACT — ONE paragraph, ONE size. Scroll-driven highlight:
              grey base fills to white word-by-word as it scrolls through view
              (the source's two-layer effect). Emphasis is weight only. */}
          <section data-case-section>
            <Reveal>
              <p className={eyebrowSection}>The fact</p>
            </Reveal>
            <ScrollRevealText
              className="mt-6 max-w-4xl text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-[1.4] tracking-[-0.015em]"
              segments={[
                { text: "On TV, around" },
                { text: "20% of logged-in users", bold: true },
                {
                  text: "access their profile daily, averaging 2.6 visits per day. Among them,",
                },
                {
                  text: "73% consume videos from “My Videos” and “Liked Videos,”",
                  bold: true,
                },
                { text: "while" },
                {
                  text: "32% visit other profiles via “Following” and “Followers.”",
                  bold: true,
                },
                {
                  text: "My profile, the place for logged-in users to consume videos,",
                },
                {
                  text: "shouldn’t have the same structure",
                  bold: true,
                },
                { text: "as other’s profile." },
              ]}
            />
          </section>

          {/* POSSIBILITY — four wireframe directions (hover to play) */}
          <CaseSection eyebrow="Possibility" title="Wireframing">
            <StaggerGrid className="mt-10 grid gap-x-12 gap-y-12 sm:grid-cols-2">
              {wireframes.map((w, i) => (
                <StaggerItem key={w.title} index={i}>
                  <HoverVideo src={w.src} />
                  <MediaCaption className="mt-5">{w.title}</MediaCaption>
                  <ul className="mt-3 flex flex-col gap-1 text-sm leading-[1.4] text-white/56">
                    {w.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>

          {/* CONCLUSION */}
          <CaseSection eyebrow="Conclusion" title="Waterfall, left & right">
            <StaggerGrid className="mt-10 grid gap-x-12 gap-y-5 sm:grid-cols-2">
              {[
                {
                  src: `${A}/pf-09.png`,
                  title: "Waterfall Format",
                  body: (
                    <>
                      The waterfall format allows users to search certain
                      content, but the rows format will enable users to consume
                      content continuously. In the case of the profile page,{" "}
                      <strong className={emphasis}>
                        the waterfall format is the best solution.
                      </strong>
                    </>
                  ),
                },
                {
                  src: `${A}/pf-10.png`,
                  title: "Left & Right",
                  body: (
                    <>
                      To{" "}
                      <strong className={emphasis}>improve the capacity</strong>{" "}
                      of the screen but not too overwhelming, we are using left &
                      right structures for both my profile & other&apos;s
                      profiles. The right side of the content area can show{" "}
                      <strong className={emphasis}>8-12 videos</strong> at a
                      maximum.
                    </>
                  ),
                },
              ].map((c, i) => (
                <StaggerItem key={c.title} index={i}>
                  <div
                    className={`h-full rounded-[1.25rem] px-6 py-6 ${surfaceDefault}`}
                  >
                    <Image
                      src={c.src}
                      alt=""
                      width={256}
                      height={256}
                      className="block size-12 opacity-80"
                    />
                    <MediaCaption className="mt-5">{c.title}</MediaCaption>
                    <p className={`mt-3 ${bodyMd}`}>{c.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>

          {/* NEW EXPERIENCE */}
          <CaseSection eyebrow="New experience" title="Differentiated profile">
            <Reveal>
              <p className={`mt-8 max-w-3xl ${bodyMd}`}>
                In &apos;my profile&apos;, users are already somewhat familiar
                with the content they have previously viewed. In this scenario,
                they are more concerned with{" "}
                <strong className={emphasis}>
                  searching for videos rather than consuming them.
                </strong>
              </p>
            </Reveal>

            <Reveal className="mt-16">
              <SubHeading>My profile</SubHeading>
              <p className={`mt-4 max-w-3xl ${bodyMd}`}>
                To allow users to access their collected videos more quickly, the
                user <strong className={emphasis}>bio is no longer emphasized</strong>{" "}
                on TV. Instead,{" "}
                <strong className={emphasis}>navigation is prioritized</strong>{" "}
                to help users find the right content.
              </p>
            </Reveal>
            <Reveal className="mt-8">
              <VideoFrame src={`${A}/pf-11.mp4`} />
            </Reveal>

            <Reveal className="mt-16">
              <SubHeading>Others profile</SubHeading>
              <p className={`mt-4 max-w-3xl ${bodyMd}`}>
                Keep the social genes as the core content on other&apos;s
                profiles. Users can press &apos;left&apos; for at most{" "}
                <strong className={emphasis}>5 steps</strong> to follow the
                creators no matter how many videos they browsed.
              </p>
            </Reveal>
            <Reveal className="mt-8">
              <VideoFrame src={`${A}/pf-12.mp4`} />
            </Reveal>
          </CaseSection>

          {/* PROTOTYPE */}
          <CaseSection eyebrow="Prototype" title="Inner flow">
            <StaggerGrid className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {[
                { src: `${A}/pf-13.mp4`, label: "My profile" },
                { src: `${A}/pf-14.mp4`, label: "Others profile" },
              ].map((it, i) => (
                <StaggerItem key={it.label} index={i}>
                  <VideoFrame src={it.src} />
                  <p className={`mt-5 ${bodySm}`}>
                    <span className="font-semibold text-white">{it.label}</span>
                  </p>
                </StaggerItem>
              ))}
            </StaggerGrid>
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
