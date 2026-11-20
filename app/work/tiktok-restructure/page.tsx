import Image from "next/image";
import { ArrowRight, Waves } from "lucide-react";
import { ScrollThemeShell } from "../../components/scroll-theme-shell";
import { TikTokEmbed } from "../../components/tiktok-embed";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { Board, BoardGallery, type BoardImage } from "../../components/board-viewer";
import {
  CaseHeader,
  CaseStudyFooter,
  Chapter,
  StatRow,
  SubHeading,
  SubPair,
  VideoFrame,
  WIDE_GRID,
} from "../../components/case-study";
import { TT_ACCENT, TT_RED } from "../../lib/tiktok-tv";
import { eyebrowMeta, bodyMd, bodySm, emphasis } from "../../lib/tokens";

const A = "/portfolio/tiktok-restructure";

/** A quiet card that works on both the light page and its dark run. */
const CARD = "rounded-[1.25rem] bg-[var(--cs-surface-2)]";

// Boards in page order: every one opens full screen, ← → walks them.
const B = {
  flow: { src: `${A}/tr-04.jpg`, alt: "WebApp visitors flow — social and referral, organic search and direct visitors split into potential native app users and web-only users, who download the app or experience the WebApp, share it and return", width: 4000, height: 2126 },
  annotated: { src: `${A}/tr-09.jpg`, alt: "Annotated redesign of the embed player — show the creator card and actions, more actions and video covers after the video, and the banner before the video finishes", width: 4000, height: 2580 },
  states: { src: `${A}/tr-10.jpg`, alt: "Responsive for mobile and web — Hover shows the creator avatar, Pause shows related videos, Creator cards show hover states on caption and avatar", width: 2880, height: 1698 },
  beforeAfter: { src: `${A}/tr-11.jpg`, alt: "Embed player before and after the redesign", width: 2880, height: 1460 },
  browser: { src: `${A}/tr-03.png`, alt: "Browser mode — a large player with the comments on the right", width: 1851, height: 1046 },
  browserLogin: { src: `${A}/tr-12.jpg`, alt: "Browser mode logged out and logged in", width: 2880, height: 1800 },
  feedLogin: { src: `${A}/tr-14.jpg`, alt: "For You feed — Log in and actions lead to sign up", width: 6770, height: 3200 },
  followingLogin: { src: `${A}/tr-15.jpg`, alt: "Following page — Log in and Follow lead to sign up", width: 6770, height: 3200 },
  flows: { src: `${A}/tr-13.png`, alt: "Every sign-up and log-in flow — phone and email sign-up, digit code, password, QR code log-in and password reset", width: 2140, height: 1764 },
  breakpoints: { src: `${A}/tr-19.jpg`, alt: "Five breakpoints, from extra large screens of 1920px down to phones under 480px, with the maximum height of vertical video and maximum width of horizontal video at each", width: 2596, height: 1136 },
  feed: { src: `${A}/tr-18.jpg`, alt: "The responsive For You feed on desktop", width: 2328, height: 1640 },
  multiFeed: { src: `${A}/tr-21.jpg`, alt: "Multitasking — the WebApp feed beside a design tool on a desktop", width: 2880, height: 1800 },
  multiPlayer: { src: `${A}/tr-22.jpg`, alt: "Multitasking — browser mode beside a design tool, with related content search", width: 2880, height: 1800 },
} satisfies Record<string, BoardImage>;

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design / Motion"],
  ["Platform", "WebApp"],
];

const reasons = [
  {
    title: "Serve non-app users",
    body: "Including mobile web and desktop visitors. We’d only been serving our native app users so far, while other products (e.g. Facebook, Instagram, Pinterest, YouTube) find that up to 30% of their traffic comes from mobile web and desktop.",
  },
  {
    title: "Improve brand image",
    body: "Exposing the TikTok community and content to the world via the web could raise brand awareness. A full product experience and more content for prospective users on the web can improve our brand and increase conversion.",
  },
  {
    title: "Indexable content for SEO",
    body: "Proper Progressive WebApps are indexable and have strong technical SEO profiles that can help TikTok gain more exposure on the web and drive organic visitors.",
  },
];

const goals = [
  { n: 1, title: "Discoverable index", lead: "Improve SEO", body: "Identifiable as “applications”, allowing search engines to find them." },
  { n: 2, title: "Level up acquisition", lead: "Overall experience", body: "Better promote and guide user login and sign-up to TikTok." },
  { n: 3, title: "Immersive experience", lead: "Browser mode & responsive", body: "Improve the consuming experience in the WebApp, but not like a version of native." },
];

// The success metrics, from the metric board (tr-07).
const metrics = [
  "Retention",
  "Video view",
  "DAU, WAU, MAU",
  "Login rate",
  "Download rate",
  "New users",
  "Share of users who view more than 1 video",
  "Share of users who view more than 1 page",
];

// Click rate of each element on the old embed player (from tr-08).
const embedClicks: [string, string][] = [
  ["Related video", "1.2300%"],
  ["Name", "0.1384%"],
  ["Head", "0.1004%"],
  ["Mobile discover button", "0.0997%"],
  ["Like", "0.0869%"],
  ["Share", "0.0722%"],
  ["Comment button", "0.0608%"],
];
const maxClick = Math.max(...embedClicks.map(([, v]) => parseFloat(v)));

const outcomes: { goal: [number, string]; shipped: string; results: string[][] }[] = [
  {
    goal: [1, "Discoverable index"],
    shipped: "Embed redesign",
    results: [
      ["+82%", "Click on video cover"],
      ["+3.41%", "Redirect to WebApp"],
      ["+3.2%", "Click red button"],
    ],
  },
  {
    goal: [2, "Level up acquisition"],
    shipped: "Sign-up in browser mode",
    results: [["+8.2%", "Sign-ups"]],
  },
  {
    goal: [3, "Immersive experience"],
    shipped: "Autoplay & responsive feed",
    results: [
      ["+38.2%", "View duration"],
      ["+47.8%", "Viewing more than 1 video"],
    ],
  },
];

const lessons: [string, string][] = [
  [
    "Build on the clicks users already make.",
    "Related videos were the one part of the old embed people clicked. Giving them more room did more than adding new buttons would have.",
  ],
  [
    "Freedom and conversion pull against each other.",
    "Browser mode was the best way to watch and the weakest at sign-ups, until joining in asked for an account.",
  ],
  [
    "Design for the screens people really use.",
    "One video per viewport on a 13–15 inch laptop was enough to send first-time visitors away.",
  ],
];

export default function TikTokRestructurePage() {
  return (
    <ScrollThemeShell base="light">
      <BoardGallery boards={Object.values(B)}>
        <article className="mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 sm:pt-10 xl:px-14 lg:pb-24 lg:pt-14">
          {/* HERO */}
          <figure className="overflow-hidden rounded-[1.75rem]">
            <Image
              src={`${A}/tr-02.jpg`}
              alt="TikTok WebApp For You feed in a desktop browser"
              width={2400}
              height={1419}
              priority
              className="h-auto w-full"
            />
          </figure>

          <CaseHeader
            date="Jul 2020 — Apr 2021"
            title="TikTok Web Restructure"
            overview="The TikTok WebApp reached a fraction of the app’s audience. I led its restructure around three jobs: help search engines find TikTok’s videos, turn more web visitors into TikTok users, and make watching on a large screen feel immersive."
            facts={projectStats}
          />

          <div className="mt-28 flex flex-col gap-28 sm:gap-36 lg:mt-36 lg:gap-44">
            {/* 01 — why the web */}
            <Chapter
              id="context"
              n="01"
              eyebrow="Context"
              title="The web reaches users the app can’t"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  The WebApp’s DAU was around 10 million, against the app’s 500 million: a 1:50 ratio. Yet on platforms
                  like Facebook and Instagram, WebApp users already account for up to 30% of mobile users.{" "}
                  <strong className={emphasis}>TikTok’s WebApp had room to grow.</strong>
                </p>
              }
            >
              <div className="mt-14">
                <StatRow
                  items={[
                    { label: "WebApp DAU", value: "~10M" },
                    { label: "App DAU", value: "500M", dim: true },
                    { label: "Web share, Facebook & Instagram", value: "Up to 30%" },
                  ]}
                />
              </div>

              <StaggerGrid className="mt-20 grid gap-x-12 gap-y-10 sm:grid-cols-3">
                {reasons.map((r, i) => (
                  <StaggerItem key={r.title} index={i}>
                    <SubHeading>{r.title}</SubHeading>
                    <p className={`mt-4 ${bodyMd}`}>{r.body}</p>
                  </StaggerItem>
                ))}
              </StaggerGrid>

              <SubPair title="The WebApp’s role" className="mt-20">
                <p>
                  We use the WebApp as a tool for referrals and organic search, directing users to download the native
                  TikTok app, while also serving the users who watch videos on the web.
                </p>
              </SubPair>
              <Reveal className="mt-10">
                <Board {...B.flow} />
              </Reveal>
            </Chapter>

            {/* The problem and the goals read as one dark run on this light page:
                a single data-dark-zone flips the whole page while it is on screen.
                The wrapper repeats the chapter gap so spacing is unchanged. */}
            <div data-dark-zone className="flex flex-col gap-28 sm:gap-36 lg:gap-44">
              {/* 02 — the problem */}
              <Chapter
                id="problem"
                n="02"
                eyebrow="Problem"
                title="Short videos aren’t enough on the web"
                accent={TT_ACCENT}
                intro={
                  <p className={bodyMd}>
                    Users know TikTok as a short video platform, and that’s true. But compared with Douyin (the Chinese
                    TikTok), it is still at an early stage: TikTok doesn’t want to be a pure entertainment app. We aim to
                    have over 40% of landscape videos on TikTok be long videos, which are more educational. The next step
                    is serving those creators and improving how their videos are watched.
                  </p>
                }
              >
                <StaggerGrid className="mt-14 grid auto-rows-fr gap-5 sm:grid-cols-3">
                  {[
                    <>
                      TikTok has <strong className={emphasis}>extensive text and video resources.</strong> Using them
                      better can <strong className={emphasis}>promote its SEO profile and grow TikTok’s traffic.</strong>
                    </>,
                    <>
                      It’s <strong className={emphasis}>hard for users to engage with short videos</strong> for long on
                      the web.
                    </>,
                    <>
                      Meeting users’ needs means{" "}
                      <strong className={emphasis}>balancing short and long videos</strong> across scenarios. On larger
                      screens users naturally watch long videos, as they need to interact with the device less.
                    </>,
                  ].map((body, i) => (
                    <StaggerItem key={i} index={i} className="h-full">
                      <div className={`flex h-full flex-col gap-4 px-6 py-6 ${CARD}`}>
                        <Waves aria-hidden className="size-5 shrink-0" style={{ color: TT_RED }} strokeWidth={2.5} />
                        <p className={bodyMd}>{body}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </Chapter>

              {/* 03 — goals and how we measure them */}
              <Chapter
                id="goals"
                n="03"
                eyebrow="Goals"
                title="Three jobs: SEO, sign-ups, immersion"
                accent={TT_ACCENT}
                intro={
                  <p className={bodyMd}>
                    Three goals shaped the restructure, each with numbers that would tell us whether it worked.
                  </p>
                }
              >
                <StaggerGrid className="mt-14 grid auto-rows-fr gap-5 sm:grid-cols-3">
                  {goals.map((g, i) => (
                    <StaggerItem key={g.n} index={i} className="h-full">
                      <div className={`flex h-full flex-col px-6 py-6 ${CARD}`}>
                        <p className={eyebrowMeta}>
                          <span className={TT_ACCENT}>Goal {g.n}</span>
                        </p>
                        <h3 className="mt-4 text-lg font-semibold leading-snug tracking-[-0.015em] text-[var(--cs-heading)]">
                          {g.title}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-[var(--cs-lead)]">{g.lead}</p>
                        <p className={`mt-4 ${bodySm}`}>{g.body}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGrid>

                <SubPair title="How we measure success" className="mt-20">
                  <ul className="grid border-t border-[var(--cs-border-2)] sm:grid-cols-2 sm:gap-x-12">
                    {metrics.map((m) => (
                      <li key={m} className="border-b border-[var(--cs-border-2)] py-3 text-[15px] font-medium leading-6 text-[var(--cs-heading)]">
                        {m}
                      </li>
                    ))}
                  </ul>
                </SubPair>

                <SubPair title="Competitor research" className="mt-20">
                  <p>
                    We stand apart from subscription video services, traditional long video sites and typical social
                    media platforms, but we still learned from how they are built. We listed their strengths and
                    weaknesses and judged which would work in the TikTok WebApp.
                  </p>
                </SubPair>
              </Chapter>
            </div>

            {/* 04 — embed (goal 1) */}
            <Chapter
              id="embed"
              n="04"
              eyebrow="Embed"
              title="The embed redesign lifted clicks"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  Embedded videos put TikTok videos into any article or website. The custom player credits the creator,
                  the description and the sound, and links back to the video on TikTok. It helps storytelling, and it
                  improves <strong className={emphasis}>acquisition and SEO</strong>.
                </p>
              }
            >
              <div className="mt-14">
                <StatRow
                  items={[
                    { label: "Daily average PV", value: "14.46M" },
                    { label: "Daily average UV", value: "8.30M" },
                  ]}
                />
              </div>

              <SubPair title="Seen by millions, clicked by few" className="mt-20">
                <p>
                  Embed video has huge exposure outside the TikTok WebApp, but its click-through rate is low, and so is
                  the DAU it brings to the WebApp. Meanwhile WebApp DNU was slowing down: it needed a new source of
                  users.
                </p>
              </SubPair>

              <SubPair title="Users click related videos" className="mt-20">
                <p>
                  On the old player, <strong className={emphasis}>related videos after playback</strong> got far more
                  clicks than anything else, while sharing and commenting were rare. My hypothesis: users are ready to
                  act once a video ends. So we strengthened what happens after the video.
                </p>
              </SubPair>

              {/* The click rates from the old embed player, as a bar chart: one element per row, bar to scale. */}
              <Reveal className={`mt-10 px-6 py-6 sm:px-8 sm:py-7 ${CARD}`}>
                <div className="flex items-baseline justify-between">
                  <p className={eyebrowMeta}>Element on the old player</p>
                  <p className={eyebrowMeta}>Click rate</p>
                </div>
                <ul className="mt-4 flex flex-col">
                  {embedClicks.map(([name, pct], i) => (
                    <li
                      key={name}
                      className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-t border-[var(--cs-border)] py-2.5 sm:grid-cols-[12rem_1fr_5rem]"
                    >
                      <span className="text-[15px] font-medium text-[var(--cs-heading)]">{name}</span>
                      <span className="col-span-2 row-start-2 h-2 overflow-hidden rounded-full bg-[var(--cs-border)] sm:col-span-1 sm:row-start-1 sm:col-start-2">
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${(parseFloat(pct) / maxClick) * 100}%`,
                            background: i === 0 ? TT_RED : "var(--cs-body)",
                            opacity: i === 0 ? 1 : 0.5,
                          }}
                        />
                      </span>
                      <span className="text-right text-[15px] font-medium tabular-nums text-[var(--cs-lead)] sm:col-start-3 sm:row-start-1">
                        {pct}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="mt-14">
                <Board {...B.annotated} />
              </Reveal>
              <Reveal className="mt-5">
                <Board {...B.states} />
              </Reveal>

              <SubPair title="Tested until the layout settled" className="mt-20">
                <ul className="flex list-disc flex-col gap-3 pl-5">
                  <li>On the pause screen: the play button as before, or video covers.</li>
                  <li>On the finished screen: 1 cover, 4 covers, or 3 covers without an action button.</li>
                  <li>The banner’s content and the number of related video covers.</li>
                </ul>
                <p>Several rounds of A/B tests led to the final layout.</p>
              </SubPair>

              <Reveal className="mt-10">
                <Board {...B.beforeAfter} />
              </Reveal>

              <div className="mt-14">
                <StatRow
                  accent={TT_RED}
                  items={[
                    { label: "Click on video cover", value: "+82%" },
                    { label: "Redirect to WebApp", value: "+3.41%" },
                    { label: "Click red button", value: "+3.2%" },
                  ]}
                />
              </div>

              <Reveal className="mt-14 flex flex-col items-center">
                <p className={eyebrowMeta}>A live TikTok embed</p>
                <div className="mt-4 w-full">
                  <TikTokEmbed
                    videoId="7571104580046490902"
                    username="camping.7day"
                    videoUrl="https://www.tiktok.com/@camping.7day/video/7571104580046490902"
                    caption="Bushcraft skill. Building survival shelter from wheels and reeds"
                  />
                </div>
              </Reveal>
            </Chapter>

            {/* 05 — browser mode (goals 1 and 3) */}
            <Chapter
              id="browser-mode"
              n="05"
              eyebrow="Browser mode"
              title="Browser mode helps SEO and immersion"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  Browser mode is <strong className={emphasis}>helping SEO dramatically</strong>. Every video has its own
                  URL and can be shared and embedded, and its content and comments bring a lot of organic traffic to the
                  website.
                </p>
              }
            >
              <Reveal className="mt-14">
                <Board {...B.browser} />
              </Reveal>
              <StaggerGrid className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
                <StaggerItem index={0}>
                  <SubHeading>An immersive player</SubHeading>
                  <p className={`mt-4 ${bodyMd}`}>
                    Users get a larger player with the comments on the right. They can comment, like, follow and move to
                    the next video in their feed. It’s a more immersive way to watch TikTok.
                  </p>
                </StaggerItem>
                <StaggerItem index={1}>
                  <SubHeading>A player for short video</SubHeading>
                  <p className={`mt-4 ${bodyMd}`}>
                    Autoplay reduces how much users need to interact with the device. A square player keeps landscape and
                    portrait videos consistent.
                  </p>
                </StaggerItem>
              </StaggerGrid>
            </Chapter>

            {/* 06 — sign-up (goal 2) */}
            <Chapter
              id="sign-up"
              n="06"
              eyebrow="Sign-up"
              title="Too much freedom kept sign-ups low"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  In browser mode, users focus on the video instead of the many entries around it. But giving them{" "}
                  <strong className={emphasis}>this much freedom led to low sign-up and engagement</strong>.
                </p>
              }
            >
              <StaggerGrid className="mt-14 grid auto-rows-fr gap-5 sm:grid-cols-2">
                {[
                  [
                    "Low sign-up & sign-in rate",
                    "Users leave the page after watching or commenting. They can comment and watch in browser mode at no cost, so they have little reason to sign up.",
                  ],
                  [
                    "No way to keep watching while multitasking",
                    "Users like watching while they work on other things in browser mode, but they have to switch to the next video by hand.",
                  ],
                ].map(([title, body], i) => (
                  <StaggerItem key={title} index={i} className="h-full">
                    <div className={`h-full px-6 py-6 ${CARD}`}>
                      <p className={eyebrowMeta}>Problem {i + 1}</p>
                      <h3 className="mt-4 text-lg font-semibold leading-snug tracking-[-0.015em] text-[var(--cs-heading)]">{title}</h3>
                      <p className={`mt-3 ${bodySm}`}>{body}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGrid>

              <SubPair title="Every action leads to sign-up" className="mt-20">
                <p>
                  In the next iteration, users sign up before they comment. Logging in, liking and following, on the
                  feed and in browser mode, all lead to sign-up.
                </p>
              </SubPair>
              <Reveal className="mt-10">
                <Board {...B.browserLogin} />
              </Reveal>
              <div className="mt-5 flex flex-col gap-5">
                <Reveal>
                  <Board {...B.feedLogin} />
                </Reveal>
                <Reveal>
                  <Board {...B.followingLogin} />
                </Reveal>
                <Reveal>
                  <Board {...B.flows} />
                </Reveal>
              </div>

              <SubPair title="Watching without touching" className="mt-20">
                <p>
                  In browser mode, users can let the next video play automatically or switch with a button, so short
                  videos can be watched like long ones, without constant interaction.
                </p>
                <Image
                  src={`${A}/tr-16.png`}
                  alt="Auto scroll off and auto scroll on toggle"
                  width={664}
                  height={350}
                  className="h-auto w-full max-w-[320px]"
                />
                <p>The login prompt appears when a video finishes, once every 5 videos.</p>
              </SubPair>
              <Reveal className="mt-10">
                <VideoFrame src={`${A}/tr-17.mp4`} className="border-0" />
              </Reveal>

              <div className="mt-14">
                <StatRow
                  accent={TT_RED}
                  items={[
                    { label: "Sign-ups", value: "+8.2%" },
                    { label: "View duration", value: "+38.2%" },
                    { label: "Viewing more than 1 video", value: "+47.8%" },
                  ]}
                />
              </div>
            </Chapter>

            {/* 07 — responsive (goal 3) */}
            <Chapter
              id="responsive"
              n="07"
              eyebrow="Responsive"
              title="The next video, on every screen"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  The <strong className={emphasis}>bounce rate was very high</strong> on a first visit to the WebApp. We
                  tried several fixes, then found that on 13–15 inch screens the WebApp showed only one video in the
                  viewport. We needed to <strong className={emphasis}>adapt the player to every viewport</strong>.
                </p>
              }
            >
              <SubPair title="Five breakpoints" className="mt-14">
                <p>
                  Five breakpoints give users the same experience on every device. The video in the viewport is always
                  as large as it can be, and the next video is always in view.
                </p>
              </SubPair>
              <Reveal className="mt-10">
                <Board {...B.breakpoints} />
              </Reveal>

              <Reveal className={`mt-14 ${WIDE_GRID}`}>
                <p className={`min-[1180px]:col-span-6 ${bodyMd}`}>
                  The <strong className={emphasis}>action buttons outside the video</strong> get{" "}
                  <strong className={emphasis}>far more clicks</strong>, so the WebApp keeps that layout.
                </p>
                <p className={`min-[1180px]:col-span-6 ${bodyMd}`}>
                  TikTok has both landscape and portrait videos. A square player{" "}
                  <strong className={emphasis}>gives every video the same viewing experience</strong>.
                </p>
              </Reveal>
              <Reveal className="mt-10">
                <VideoFrame src={`${A}/tr-20.mp4`} className="border-0" />
              </Reveal>
              <Reveal className="mt-5">
                <Board {...B.feed} framed />
              </Reveal>

              <SubPair title="Multitasking on the PC WebApp" className="mt-20">
                <p>
                  Users can watch TikTok while they work on something else, making good use of the desktop. The feed page
                  also keeps every entry point in view.
                </p>
              </SubPair>
              <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-2">
                {[B.multiFeed, B.multiPlayer].map((board, i) => (
                  <StaggerItem key={board.src} index={i}>
                    <Board {...board} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>

            {/* 08 — what each goal got */}
            <Chapter id="outcome" n="08" eyebrow="Outcome" title="What the restructure delivered" accent={TT_ACCENT}>
              <div className="mt-12 flex flex-col gap-4">
                {outcomes.map((o) => (
                  <Reveal key={o.shipped} className={`grid gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-8 ${CARD}`}>
                    <div className="flex flex-col gap-1.5 lg:col-span-4">
                      <p className={eyebrowMeta}>
                        <span className={TT_ACCENT}>Goal {o.goal[0]}</span>
                      </p>
                      <span className="text-[15px] font-medium leading-6 text-[var(--cs-heading)]">{o.goal[1]}</span>
                    </div>
                    <div className="flex items-center gap-3 lg:col-span-3">
                      <ArrowRight aria-hidden className="hidden size-5 shrink-0 lg:block" style={{ color: TT_RED }} strokeWidth={2.25} />
                      <div>
                        <p className={eyebrowMeta}>Shipped</p>
                        <p className="mt-1 text-base font-semibold text-[var(--cs-heading)]">{o.shipped}</p>
                      </div>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:col-span-5">
                      {o.results.map(([value, name]) => (
                        <div key={name}>
                          <dd className="whitespace-nowrap text-[1.75rem] font-medium leading-none tracking-[-0.03em] text-[var(--cs-heading)]">
                            {value}
                          </dd>
                          <dt className={`mt-1.5 ${bodySm}`}>{name}</dt>
                        </div>
                      ))}
                    </dl>
                  </Reveal>
                ))}
              </div>

              <SubPair title="What I took away" className="mt-20">
                <ul className="flex flex-col gap-5">
                  {lessons.map(([lead, body]) => (
                    <li key={lead}>
                      <strong className={emphasis}>{lead}</strong> {body}
                    </li>
                  ))}
                </ul>
              </SubPair>
            </Chapter>
          </div>
          <CaseStudyFooter />
        </article>
      </BoardGallery>
    </ScrollThemeShell>
  );
}
