import { ScrollThemeShell } from "../../components/scroll-theme-shell";
import { TikTokEmbed } from "../../components/tiktok-embed";
import { Waves } from "lucide-react";
import Image from "next/image";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import {
  CaseSection,
  SubHeading,
  GradientTag,
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

const A = "/portfolio/tiktok-restructure";

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design / Motion"],
  ["Platform", "WebApp"],
];

// Job to be done — the three todos (verbatim from source).
const todos = [
  {
    n: 1,
    title: "Discoverable Index",
    lead: "Improve SEO",
    body: "Identifiable as “applications” allowing search engines to find them.",
  },
  {
    n: 2,
    title: "Level up Acquisition",
    lead: "Overall Experience",
    body: "Better promote and guide user login and sign up to TikTok.",
  },
  {
    n: 3,
    title: "Immersive Experience",
    lead: "Browser mode & Responsive",
    body: "Improve the consuming experience in WebApp but not like a version of native.",
  },
];

const embedResults = [
  ["+82%", "Click on Video cover"],
  ["+3.41%", "Redirect to webapp"],
  ["+3.2%", "Click red button"],
];

const signUpResults = [
  ["+8.2%", "Sign Up"],
  ["+38.2%", "View Duration"],
  ["+47.8%", "Video view over 1+ video"],
];

function ResultGrid({ items, cols = 3 }: { items: string[][]; cols?: 3 | 4 }) {
  const colClass = cols === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3";
  return (
    <StaggerGrid
      className={`mt-8 grid overflow-hidden rounded-[1.25rem] ${colClass} ${surfaceQuiet}`}
    >
      {items.map(([value, label], i) => (
        <StaggerItem
          key={label}
          index={i}
          className={`px-6 py-6 ${
            i > 0 ? "border-t border-[var(--cs-border)] sm:border-t-0 sm:border-l" : ""
          }`}
        >
          <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-none tracking-[-0.03em] text-[var(--cs-heading)]">
            {value}
          </p>
          <p className={`mt-3 ${bodySm}`}>{label}</p>
        </StaggerItem>
      ))}
    </StaggerGrid>
  );
}

/** Todo recap card — the "Todo N / title / lead / body" block used both in the
 * Goal grid and as the single recap card heading each Todo deep-dive section. */
function TodoCard({
  n,
  title,
  lead,
  body,
}: {
  n: number;
  title: string;
  lead: string;
  body: string;
}) {
  return (
    <div
      className={`flex h-full flex-col gap-3 rounded-[var(--r-md)] border border-[var(--cs-border-2)] px-6 py-6 ${surfaceQuiet}`}
    >
      <GradientTag tone="cool">Todo {n}</GradientTag>
      <div>
        <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--cs-heading)]">
          {title}
        </h3>
        <p className="mt-1 text-sm font-medium text-[var(--cs-lead)]">{lead}</p>
      </div>
      <p className="text-sm leading-[1.5] text-[var(--cs-body)]">{body}</p>
    </div>
  );
}

export default function TikTokRestructurePage() {
  return (
    <ScrollThemeShell base="light">
      <article
        className="mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 lg:px-14 lg:pb-24 lg:pt-14"
      >
        {/* HERO */}
        <figure className="overflow-hidden rounded-[1.75rem] border border-[var(--cs-border)]">
          <Image
            src={`${A}/tr-02.jpg`}
            alt="TikTok WebApp For You feed in a desktop browser"
            width={2400}
            height={1419}
            priority
            className="h-auto w-full"
          />
        </figure>

        {/* TITLE + OVERVIEW */}
        <section className="pb-12 pt-14 lg:pb-16 lg:pt-20">
          <p className={eyebrowMeta}>Jul 2020 - Apr 2021</p>

          <h1 className="mt-6 max-w-[20ch] text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1] tracking-[-0.03em] text-[var(--cs-heading)] text-balance">
            TikTok Web Restructure
          </h1>

          <div className="mt-12">
            <p className={eyebrowSection}>Overview</p>
            <p className="mt-6 max-w-3xl text-lg leading-[1.5] tracking-[-0.01em] text-[var(--cs-body)]">
              The WebApp’s DAU is around 10 million compared to our app’s 500
              million DAU, marking a 1:50 ratio. However, in comparison to
              platforms like Facebook, Instagram, etc., their WebApp users
              already account for up to 30% of their mobile users. This
              highlights the substantial potential of TikTok’s WebApp.
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

          <Reveal className="mt-10">
            <ImageFrame
              src={`${A}/tr-03.png`}
              alt="TikTok WebApp on mobile web — responsive layout"
              width={1851}
              height={1046}
            />
          </Reveal>
        </section>

        {/* SECTION FLOW */}
        <div className="mt-24 flex flex-col gap-32 lg:mt-28 lg:gap-40">
          {/* CONTEXT */}
          <CaseSection
            eyebrow="Context"
            title="Why restructure the TikTok WebApp?"
          >
            <StaggerGrid className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-3">
              <StaggerItem index={0}>
                <SubHeading>Serve non-app users</SubHeading>
                <p className={`mt-4 ${bodyMd}`}>
                  Including mobile web and desktop visitors: we’ve only been
                  serving our native app users so far, but other products (e.g.
                  Facebook, Instagram, Pinterest, Youtube) find there are 30% of
                  native App traffic also coming from mobile web and desktop.
                </p>
              </StaggerItem>
              <StaggerItem index={1}>
                <SubHeading>Improve brand image</SubHeading>
                <p className={`mt-4 ${bodyMd}`}>
                  Expose the TikTok community and contents to the world via the
                  web could raise the brand awareness; by providing a full
                  product experience and more content to prospective users via
                  web, we can drive improvement in our brand and increase the
                  conversion.
                </p>
              </StaggerItem>
              <StaggerItem index={2}>
                <SubHeading>Indexable content for SEO</SubHeading>
                <p className={`mt-4 ${bodyMd}`}>
                  Proper Progressive WebApps are indexable and have strong
                  technical SEO profiles that can help TikTok gain more exposure
                  on the web and drive organic visitors.
                </p>
              </StaggerItem>
            </StaggerGrid>

            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/tr-04.jpg`}
                alt="WebApp Visitors flow — potential native app users and web-only users"
                width={4000}
                height={2126}
              />
            </Reveal>

            <Reveal className={`mt-10 max-w-3xl ${bodyMd}`}>
              <p>
                We use the WebApp as a tool for referrals and improving organic
                search, directing users to download the native TikTok app, while
                also help to better serve users who consume videos on the
                WebApp.
              </p>
            </Reveal>
          </CaseSection>

          {/* ===== DARK RUN =====
              Problems → Goal → Success metric reads as one dark stretch on this
              otherwise-light page. A SINGLE data-dark-zone flips the whole page
              (sidebar + main + article + locator pill) to dark on entry and
              holds it across all three sections until it scrolls out, then back
              to light. The wrapper mirrors the parent flex/gap so section
              spacing is unchanged. */}
          <div data-dark-zone className="flex flex-col gap-32 lg:gap-40">
          {/* PROBLEMS — left paragraph + right icon cards */}
          <CaseSection eyebrow="Problems" title="Commonness and Differences">
            <div className="mt-12 grid gap-x-12 gap-y-10 lg:grid-cols-2">
              {/* Left — the framing paragraph */}
              <Reveal className={bodyMd}>
                <p>
                  Our users’ initial impression of TikTok is as a short video
                  platform, which is indeed true. However, this represents just
                  the early stage when compared to DouYin (the Chinese TikTok).
                  In the future, TikTok definitely doesn’t want to just build a
                  video platform as a pure entertainment app. We aim to have over
                  40%+ of landscape videos as long videos which is more
                  educational on TikTok. The next step involves serving those
                  creators and enhancing the consumption experience.
                </p>
              </Reveal>

              {/* Right — three icon cards (red Waves marker) */}
              <StaggerGrid className="flex flex-col gap-5">
                <StaggerItem
                  index={0}
                  className="flex gap-4 rounded-[var(--r-md)] border border-[var(--cs-border-2)] bg-[var(--cs-surface)] px-6 py-5"
                >
                  <Waves
                    className="mt-1 size-5 shrink-0 text-[#f75757]"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <p className={`leading-[1.5] ${bodyMd}`}>
                    TikTok possesses{" "}
                    <strong className={emphasis}>
                      extensive textual and video resources.
                    </strong>{" "}
                    Better utilization of these resources can help in{" "}
                    <strong className={emphasis}>
                      promoting SEO profiles and enhancing TikTok traffic.
                    </strong>
                  </p>
                </StaggerItem>
                <StaggerItem
                  index={1}
                  className="flex gap-4 rounded-[var(--r-md)] border border-[var(--cs-border-2)] bg-[var(--cs-surface)] px-6 py-5"
                >
                  <Waves
                    className="mt-1 size-5 shrink-0 text-[#f75757]"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <p className={`leading-[1.5] ${bodyMd}`}>
                    It’s{" "}
                    <strong className={emphasis}>
                      challenging for users to engage with short videos
                    </strong>{" "}
                    for an extended period on the web.
                  </p>
                </StaggerItem>
                <StaggerItem
                  index={2}
                  className="flex gap-4 rounded-[var(--r-md)] border border-[var(--cs-border-2)] bg-[var(--cs-surface)] px-6 py-5"
                >
                  <Waves
                    className="mt-1 size-5 shrink-0 text-[#f75757]"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <p className={`leading-[1.5] ${bodyMd}`}>
                    Satisfying user needs involves{" "}
                    <strong className={emphasis}>
                      balancing the relationship between short and long videos
                    </strong>{" "}
                    across various scenarios. Users tend to naturally watch long
                    videos on larger screens, as it reduces physical interaction
                    between the user and the device.
                  </p>
                </StaggerItem>
              </StaggerGrid>
            </div>
          </CaseSection>

          {/* GOAL */}
          <CaseSection eyebrow="Goal" title="Job to be done">
            <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-3">
              {todos.map((t) => (
                <StaggerItem
                  key={t.n}
                  index={t.n - 1}
                  className={`flex h-full flex-col gap-3 rounded-[var(--r-md)] border border-[var(--cs-border-2)] px-6 py-6 ${surfaceQuiet}`}
                >
                  <GradientTag tone="cool">Todo {t.n}</GradientTag>
                  <div>
                    <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--cs-heading)]">
                      {t.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[var(--cs-lead)]">
                      {t.lead}
                    </p>
                  </div>
                  <p className="text-sm leading-[1.5] text-[var(--cs-body)]">
                    {t.body}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>

          {/* SUCCESS METRIC */}
          <CaseSection eyebrow="Success metric" title="How to measure success?">
            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/tr-07.jpg`}
                alt="Success metrics — Retention, Video View, DAU/WAU/MAU, Login Rate, Download Rate, New User"
                width={4000}
                height={1568}
              />
            </Reveal>
          </CaseSection>
          </div>
          {/* ===== END DARK RUN ===== */}

          {/* DESIGN PROCESS */}
          <CaseSection
            eyebrow="Design process"
            title="Redesign the TikTok Structure"
          >
            <Reveal className="mt-8 max-w-3xl">
              <SubHeading>Competitor Research</SubHeading>
              <p className={`mt-5 ${bodyMd}`}>
                We stand apart from subscription video services, traditional long
                video sites, and typical social media platforms. However, we’ve
                gained insights from various product structures. We’ve assembled
                a comprehensive list of their strengths and weaknesses to
                evaluate their applicability within the TikTok WebApp.
              </p>
            </Reveal>
          </CaseSection>

          {/* TODO 1 — IMPROVE SEO */}
          <CaseSection title="Improve SEO in TT WebApp">
            <div className="mt-10 grid sm:grid-cols-3">
              <Reveal>
                <TodoCard
                  n={1}
                  title="Discoverable"
                  lead="Improve SEO"
                  body="Identifiable as “applications” allowing search engines to find them."
                />
              </Reveal>
            </div>

            <Reveal className="mt-16 max-w-3xl">
              <SubHeading>Video Share &amp; Embed</SubHeading>
              <p className={`mt-5 ${bodyMd}`}>
                Embedded Videos enable TikTok videos to be embedded into any
                articles or websites. This helps to foster storytelling, and
                provides proper attribution by showing the video creator, video
                description and background sound in the form of TikTok’s custom
                player. It also links back to the corresponding content on
                TikTok. Its improve the{" "}
                <strong className={emphasis}>acquisition and SEO</strong>.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-x-12 gap-y-8 lg:grid-cols-2">
              <Reveal className={bodyMd}>
                <p>
                  Embed video has huge exposure outside of the TikTok WebApp
                  (daily average PV 14.46M, UV 8.30M), but the conversion rate
                  CTR is low, The DAU of Embed contribute to the WebApp is low.
                </p>
              </Reveal>
              <Reveal className={bodyMd}>
                <p>
                  WebApp DNU are slowdown and it needs a new way to get
                  acquisition.
                </p>
              </Reveal>
            </div>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/tr-08.jpg`}
                alt="Embed video element click-through data and the embed card design"
                width={2880}
                height={1460}
              />
            </Reveal>

            <Reveal className="mt-16 max-w-3xl">
              <p className={bodyMd}>
                I noticed that related videos after the video playback ends,
                there’s high click rate but very low sharing and commenting
                actions. I hypothesize that users will do actions after watching
                the video. Therefore, we’ve enhanced the post-video interactions.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/tr-09.jpg`}
                alt="Annotated redesign of the post-video player and related-video covers"
                width={4000}
                height={2580}
              />
            </Reveal>

            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/tr-10.jpg`}
                alt="Responsive for mobile and web — Hover, Pause and Creator Cards states"
                width={2880}
                height={1698}
              />
            </Reveal>

            <div className={`mt-10 flex max-w-3xl flex-col gap-6 ${bodyMd}`}>
              <Reveal>
                <p>
                  AB test on pause screen, play button as previous design or show
                  video covers.
                </p>
              </Reveal>
              <Reveal>
                <p>
                  AB test on video finished screen, 1 cover, 4 covers, 3 covers
                  without action button.
                </p>
              </Reveal>
              <Reveal>
                <p>
                  Multiple AB tests were conducted to modify banner content and
                  determine the quantity of associated video thumbnails,
                  resulting in the final layout.
                </p>
              </Reveal>
            </div>

            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/tr-11.jpg`}
                alt="Embed player — before and after redesign"
                width={2880}
                height={1460}
              />
            </Reveal>

            <ResultGrid items={embedResults} />

            <Reveal className="mt-12 flex justify-center">
              <TikTokEmbed
                videoId="7571104580046490902"
                username="camping.7day"
                videoUrl="https://www.tiktok.com/@camping.7day/video/7571104580046490902"
                caption="Bushcraft skill. Building survival shelter from wheels and reeds"
              />
            </Reveal>
          </CaseSection>

          {/* TODO 2 — OVERALL EXPERIENCE */}
          <CaseSection
            eyebrow="Overall Experience"
            title="Improve sign-up & consuming experience"
          >
            <div className="mt-10 grid sm:grid-cols-3">
              <Reveal>
                <TodoCard
                  n={2}
                  title="Level up Acquisition"
                  lead="Overall Experience"
                  body="Better promote and guide user login and sign up to TikTok."
                />
              </Reveal>
            </div>

            <StaggerGrid className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-3">
              <StaggerItem index={0}>
                <SubHeading>Browser mode for SEO</SubHeading>
                <p className={`mt-4 ${bodyMd}`}>
                  Browser mode are helping SEO dramatically. It provide share and
                  embed ability, the video has it own URL, the video content and
                  video comments are bring a lot of organic traffic to the
                  website.
                </p>
              </StaggerItem>
              <StaggerItem index={1}>
                <SubHeading>Immersive experience</SubHeading>
                <p className={`mt-4 ${bodyMd}`}>
                  User get into a larger player with the comments displayed on
                  the right side of the screen. User can add comment, like,
                  follow and navigate to the next video in your feed as well.
                  It’s a more immersive way to consume TikTok content for sure.
                </p>
              </StaggerItem>
              <StaggerItem index={2}>
                <SubHeading>The player for short video</SubHeading>
                <p className={`mt-4 ${bodyMd}`}>
                  Autoplay reduce the interaction between the user and the
                  device. A square player maintains consistent experiences for
                  both landscape and portrait videos.
                </p>
              </StaggerItem>
            </StaggerGrid>
          </CaseSection>

          {/* PROBLEMS & BUSINESS GOAL */}
          <CaseSection title="Problems & Business Goal">
            <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-3">
              <StaggerItem
                index={0}
                className="flex h-full flex-col gap-2.5 rounded-[var(--r-md)] border border-[#d1c70a] bg-[#ffe563] px-6 py-5 text-[#1a1a1a] shadow-[2px_2px_8px_#00000029]"
              >
                <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em]">
                  Low Sign up &amp; Sign in rate
                </h3>
                <p className="text-sm leading-[1.5] text-[#1a1a1a]/80">
                  Users leave the page after consuming or commenting on videos.
                  Users can comment on and watch videos in browser mode at no
                  cost which
                </p>
              </StaggerItem>
              <StaggerItem
                index={1}
                className="flex h-full flex-col gap-2.5 rounded-[var(--r-md)] border border-[#d1c70a] bg-[#ffe563] px-6 py-5 text-[#1a1a1a] shadow-[2px_2px_8px_#00000029]"
              >
                <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em]">
                  Users cannot consume videos when multitasking.
                </h3>
                <p className="text-sm leading-[1.5] text-[#1a1a1a]/80">
                  Users enjoy viewing videos while concurrently handling
                  different tasks in browser mode, but they have to switch to
                  next video manually.
                </p>
              </StaggerItem>
            </StaggerGrid>

            <Reveal className={`mt-10 max-w-3xl flex flex-col gap-7 ${bodyMd}`}>
              <p>
                In Browser mode, users can focus more on the video itself rather
                than numerous entries and content. However, providing users with
                excessive freedom has resulted in low sign-up and engagement
                rates in browser mode.
              </p>
              <p>
                In the next iteration, we will require users to sign up before
                making comments.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/tr-12.jpg`}
                alt="Browser mode — logged out and logged in states"
                width={2880}
                height={1800}
              />
            </Reveal>

            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/tr-13.png`}
                alt="Full sign-up and log-in flows — digit code, password, email, QR code, reset"
                width={2140}
                height={1764}
              />
            </Reveal>

            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/tr-14.jpg`}
                alt="For You feed — log in and actions lead to sign up"
                width={6770}
                height={3200}
              />
            </Reveal>

            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/tr-15.jpg`}
                alt="Following page — log in and follow lead to sign up"
                width={6770}
                height={3200}
              />
            </Reveal>

            <Reveal className={`mt-12 max-w-3xl ${bodyMd}`}>
              <p>
                In browser mode, users can set the next video to autoplay or
                switch videos by clicking button. Short videos can be viewed
                similarly as long video without the need for frequent
                interactions.
              </p>
            </Reveal>

            <Reveal className="mt-10 sm:max-w-[380px]">
              <ImageFrame
                src={`${A}/tr-16.png`}
                alt="Auto scroll off and auto scroll on toggle"
                width={664}
                height={350}
              />
            </Reveal>

            <Reveal className={`mt-10 max-w-3xl ${bodyMd}`}>
              <p>
                The login prompt will appear when the video finishes and will
                cycle through every 5 videos.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <VideoFrame src={`${A}/tr-17.mp4`} square />
            </Reveal>

            <Reveal className="mt-16">
              <SubHeading>Result</SubHeading>
            </Reveal>
            <ResultGrid items={signUpResults} />
          </CaseSection>

          {/* TODO 3 — RESPONSIVE */}
          <CaseSection title="Responsive video player and page">
            <div className="mt-10 grid items-start gap-x-12 gap-y-8 lg:grid-cols-2">
              <Reveal>
                <TodoCard
                  n={3}
                  title="Immersive Experience"
                  lead="Responsive Video"
                  body="Improve the consuming experience in WebApp but not like a version of native."
                />
              </Reveal>
              <Reveal>
                <ImageFrame
                  src={`${A}/tr-18.jpg`}
                  alt="TikTok WebApp For You feed — final responsive design"
                  width={2328}
                  height={1640}
                  square
                />
              </Reveal>
            </div>

            <Reveal className={`mt-10 max-w-3xl ${bodyMd}`}>
              <p>
                The{" "}
                <strong className={emphasis}>
                  bounce rate was excessively high
                </strong>{" "}
                when user entry into the WebApp at first time. We attempted
                various measures to reduce this rate but discovered that the
                WebApp only displayed one video within the viewport on 13-15 inch
                devices. As a result, we needed to{" "}
                <strong className={emphasis}>
                  adapt the video player to different viewports
                </strong>
                .
              </p>
            </Reveal>
          </CaseSection>

          {/* ACTIONS */}
          <CaseSection
            eyebrow="Actions"
            title="Responsive both video and page"
          >
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                We setting up 5 different breaking point allow user to have same
                experience on different device. The video within the current
                viewport will always be maximized in size. Additionally, ensure
                that the current viewport consistently displays the next video.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/tr-19.jpg`}
                alt="Responsive breakpoints — five device sizes for vertical and horizontal video"
                width={2596}
                height={1136}
              />
            </Reveal>

            <div className="mt-10 grid gap-x-12 gap-y-8 lg:grid-cols-2">
              <Reveal className={bodyMd}>
                <p>
                  The{" "}
                  <strong className={emphasis}>
                    action button located outside
                  </strong>{" "}
                  the video has{" "}
                  <strong className={emphasis}>
                    much higher click penetration,
                  </strong>{" "}
                  so we’ve maintained that layout in the WebApp.
                </p>
              </Reveal>
              <Reveal className={bodyMd}>
                <p>
                  TikTok contains both landscape and portrait videos, put the
                  video within square player{" "}
                  <strong className={emphasis}>
                    ensures a uniform viewing experience
                  </strong>{" "}
                  across all videos.
                </p>
              </Reveal>
            </div>

            <Reveal className="mt-10">
              <VideoFrame src={`${A}/tr-20.mp4`} />
            </Reveal>

            <Reveal className="mt-16 max-w-3xl">
              <SubHeading>Multitasking on PC WebApp</SubHeading>
              <p className={`mt-5 ${bodyMd}`}>
                Users can engage in multitasking on the PC while simultaneously
                watching TikTok videos, effectively utilizing the desktop space.
                Additionally, the feed page displays all entry points for
                convenience.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/tr-21.jpg`}
                alt="Multitasking — WebApp feed alongside a design tool on desktop"
                width={2880}
                height={1800}
              />
            </Reveal>

            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/tr-22.jpg`}
                alt="Multitasking — immersive video player with related-content search"
                width={2880}
                height={1800}
              />
            </Reveal>
          </CaseSection>
        </div>
        <CaseStudyFooter />
      </article>
    </ScrollThemeShell>
  );
}
