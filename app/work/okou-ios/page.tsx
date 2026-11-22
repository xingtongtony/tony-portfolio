import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import { CaseStudyFooter } from "../../components/case-study";
import { bodyMd, eyebrowMeta, eyebrowSection } from "../../lib/tokens";
import { Avatar, Mark, MoodWall, Screen, Shot, Stage, Texture, Wordmark, type Mood, type Tone } from "./brand";
import { A } from "./brand-paths";
import { Story, type StoryStep } from "./story";
import { SystemSpecimen } from "./system";
import "./okou.css";

// Okou's own page (Tony, 2026-11-22): it sets its own layout rather than
// following the shared case-study template. Three rules hold it together:
// 1. A screen is always whole and phone-shaped — never cropped or enlarged.
// 2. A screen never sits on the white page: it stands on a stage in one of
//    Okou's colours, so it reads as an object.
// 3. No device, no Dynamic Island, no Chinese: every screen is recorded from
//    the app's demo mode on fictional content.

const facts = [
  ["Role", "Founding Designer"],
  ["Platform", "iOS · SwiftUI"],
  ["Scope", "App, widgets, design system"],
  ["Year", "2026"],
];

const story: StoryStep[] = [
  {
    label: "Ask",
    title: "Start with a sentence",
    body: "A new chat opens with the keyboard up and one composer. The +, the model and the mic are in it, so there is nothing to set up before asking.",
    video: "story-ask",
    alt: "Starting a new chat and typing a request",
    tone: "warm",
  },
  {
    label: "Leave",
    title: "Okou keeps working",
    body: "The task runs on Okou’s side, so the phone can go back in a pocket. The chat list shows what is still running, and the Home Screen widget does too.",
    video: "story-work",
    alt: "The chat list with a chat still running, then the running chat",
    tone: "sky",
  },
  {
    label: "Check",
    title: "See what it did, in one line",
    body: "Minutes of work fold into a single quiet line: how long, how many steps. It opens in place when the detail matters, and stays out of the way when it does not.",
    video: "story-steps",
    alt: "Opening the run summary to see each step",
    tone: "butter",
  },
  {
    label: "Pick up",
    title: "A result you can open",
    body: "A deck comes back as a deck: a card with its first slide as the cover. Follow-ups sit under the answer, so the next step is one tap.",
    video: "story-result",
    alt: "Scrolling to the result card and the follow-ups",
    tone: "lime",
  },
];

const details: { title: string; note: string; video?: string; image?: string; alt: string; tone: Tone }[] = [
  {
    title: "A composer with one way in",
    note: "A single +, then the model, the mic and send in one slot. Each control is centred on its corner’s own arc, open or closed.",
    video: "composer",
    alt: "The composer opening from one line to its full height and folding back",
    tone: "pink",
  },
  {
    title: "Amber means one thing",
    note: "Only the action that commits is amber: Add, Done, Send. Everything else stays neutral.",
    video: "add",
    alt: "Selecting photos turns the sheet’s button into Add 2",
    tone: "butter",
  },
  {
    title: "A greeting, word by word",
    note: "Okou’s avatar, then the line, each word a beat after the last. It plays every time you come home.",
    video: "greet",
    alt: "The greeting animating in above the composer",
    tone: "sky",
  },
  {
    title: "Minutes of work, one line",
    note: "A run folds into how long it took and how many steps. Tap, and the steps open in place.",
    video: "story-steps",
    alt: "The run summary opening to show six steps and closing again",
    tone: "lime",
  },
  {
    title: "Projects that fold",
    note: "A soft spring with no bounce, and the list remembers what you folded.",
    video: "fold",
    alt: "Projects folding and unfolding in the chat list",
    tone: "warm",
  },
  {
    title: "Search that filters in place",
    note: "One field, then chips for chats, messages, workflows and artifacts.",
    video: "search",
    alt: "Searching for pricing, then filtering the results",
    tone: "pink",
  },
  {
    title: "It asks before it acts",
    note: "When a task needs your mail or files, Okou stops and says exactly what it wants.",
    image: "permission",
    alt: "Okou asking for permission to read Gmail before it continues",
    tone: "sky",
  },
  {
    title: "The model, one tap away",
    note: "The model lives in the composer, next to the mic. Its sheet is a short form: model, effort, Done.",
    video: "model",
    alt: "Opening Model settings from the composer",
    tone: "butter",
  },
  {
    title: "Answers shaped for a phone",
    note: "Tables, lists and bold lead-ins set to read at arm’s length, with follow-ups underneath.",
    image: "metrics",
    alt: "A weekly metrics digest with a small table and two notes",
    tone: "lime",
  },
];

const widgetMoods: { mood: string; label: string; when: string }[] = [
  { mood: "working", label: "Working", when: "An agent is on a task" },
  { mood: "needs", label: "Needs you", when: "It is waiting for an answer" },
  { mood: "done", label: "Finished", when: "A result is ready to read" },
  { mood: "ready", label: "Ready", when: "Nothing running, by day" },
  { mood: "evening", label: "Evening", when: "Nothing running, after five" },
  { mood: "sleep", label: "Asleep", when: "All quiet at night" },
];

const moods: Mood[] = [
  "happy", "think", "wink", "party", "sleepy", "surprise", "shy", "laugh", "focus", "cool", "please", "nod",
  "confused", "sweat", "pout", "kiss", "dizzy", "cry", "angry", "shake", "idle",
];

const textures = [
  "drop-lightblue-blue", "dash-pink-orange", "stripe-teal-green", "loop-yellow-orange",
  "drop-blue-lightblue", "stripe-lime-green", "dash-pink-pink", "loop-blue-yellow",
];

/** A chapter opening: its number and name, a large title, and its text beside it. */
function Opening({ n, name, title, children }: { n: string; name: string; title: ReactNode; children?: ReactNode }) {
  return (
    <Reveal className="grid gap-8 min-[1180px]:grid-cols-12 min-[1180px]:gap-10">
      <div className="min-[1180px]:col-span-7">
        <p className={eyebrowSection}>
          <span className="text-[var(--okou-amber-text)]">{n}</span>
          <span aria-hidden className="mx-2 opacity-50">/</span>
          {name}
        </p>
        <h2 className="mt-5 max-w-[14ch] text-[clamp(2.5rem,4.8vw,4.5rem)] font-medium leading-[0.96] tracking-[-0.045em] text-[var(--cs-heading)] text-balance">
          {title}
        </h2>
      </div>
      {children ? <div className={`flex flex-col gap-5 min-[1180px]:col-span-5 min-[1180px]:pt-14 ${bodyMd}`}>{children}</div> : null}
    </Reveal>
  );
}

/** One Home Screen widget, cut from the app's own render, with the shadow a widget casts on a wallpaper. */
function Widget({ src, alt, width, height, className = "" }: { src: string; alt: string; width: number; height: number; className?: string }) {
  return (
    <Image
      src={`${A}/widget/${src}.png`}
      alt={alt}
      width={width}
      height={height}
      sizes="(min-width: 640px) 360px, 90vw"
      className={`h-auto w-full drop-shadow-[0_18px_28px_rgba(24,60,110,0.28)] ${className}`}
    />
  );
}

export default function OkouIosPage() {
  return (
    <PortfolioShell sidebarTheme="light" mainClassName="bg-white text-[#171717]" contentClassName="min-w-0 bg-white text-[#171717]">
      <article data-cs-theme="light" className="okou-page mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 xl:px-14 lg:pb-24 lg:pt-14">
        {/* HERO — the product as a family of things: the app, its widgets, its character */}
        <Stage tone="warm" className="px-7 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <Wordmark id="hero" className="w-[min(240px,56%)]" />
              <h1 className="mt-10 max-w-[10ch] text-[clamp(3rem,6.2vw,5.75rem)] font-medium leading-[0.92] tracking-[-0.055em] text-[var(--okou-ink)] text-balance">
                Your agents, in your pocket.
              </h1>
              <p className="mt-8 max-w-[40ch] text-lg leading-[1.5] tracking-[-0.01em] text-[rgb(37_33_33/0.7)]">
                Okou is a workspace of AI agents that research, write, design and build across your tools. As its founding
                designer I designed the iPhone app, its widgets and the native design system they are built on.
              </p>
              <dl className="mt-10 grid max-w-[460px] grid-cols-2 gap-x-8 gap-y-5 border-t border-[rgb(37_33_33/0.12)] pt-6">
                {facts.map(([label, value]) => (
                  <div key={label}>
                    <dt className={eyebrowMeta}>{label}</dt>
                    <dd className="mt-1.5 text-[15px] font-medium leading-6 text-[var(--okou-ink)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative mx-auto w-full max-w-[460px] lg:col-span-6">
              <Screen video="hero" alt="Opening a chat from the list, reading the answer and going back" className="mx-auto w-[64%]" />
              <div className="okou-float absolute -left-[2%] top-[9%] w-[31%]" style={{ "--okou-tilt": "-7deg" } as CSSProperties}>
                <Widget src="busy-s" alt="The small widget: a chat that just finished" width={474} height={474} />
              </div>
              <div className="okou-float absolute -right-[4%] bottom-[11%] w-[58%] [animation-delay:-2.4s]" style={{ "--okou-tilt": "4deg" } as CSSProperties}>
                <Widget src="quiet-m" alt="The medium widget: Okou’s greeting above two pinned chats" width={1014} height={474} />
              </div>
              <div className="okou-float absolute -right-[1%] top-[3%] w-[19%] [animation-delay:-4s]" style={{ "--okou-tilt": "9deg" } as CSSProperties}>
                <Avatar mood="happy" className="w-full shadow-[0_18px_36px_-18px_rgba(37,33,33,0.5)]" />
              </div>
            </div>
          </div>
        </Stage>

        <div className="mt-28 flex flex-col gap-32 sm:gap-40 lg:mt-40 lg:gap-52">
          {/* 01 — PREMISE */}
          <section id="premise" data-case-section className="scroll-mt-8">
            <Opening n="01" name="Premise" title="Minutes of work. Seconds of attention.">
              <p>
                On the web, a task can run long after the laptop closes. The phone is where people come back to it: on a
                train, between meetings, in a queue.
              </p>
              <p>
                So the app is built around three short visits rather than one long session — ask for something, see how far
                it got, pick up what it made.
              </p>
            </Opening>
            <Reveal className="mt-16">
              <Stage tone="sky" texture="drop-lightblue-blue" className="px-7 py-14 sm:px-12 sm:py-20">
                <StaggerGrid className="grid gap-x-8 gap-y-14 sm:grid-cols-3">
                  <StaggerItem index={0}>
                    <Shot n="01" title="Ask" note="One composer, ready the moment the app opens." image="ask-typed" alt="A new chat with a request typed into the composer" />
                  </StaggerItem>
                  <StaggerItem index={1}>
                    <Shot n="02" title="Check" note="The list says what is running, unread or done." image="list" alt="The chat list: projects, pinned chats, a running chat and an unread one" />
                  </StaggerItem>
                  <StaggerItem index={2}>
                    <Shot n="03" title="Pick up" note="Results arrive as things to open, not text to scroll." image="chat" alt="A finished answer with a slides result card and follow-ups" />
                  </StaggerItem>
                </StaggerGrid>
              </Stage>
            </Reveal>
          </section>

          {/* 02 — ONE TASK, START TO FINISH */}
          <section id="task" data-case-section className="scroll-mt-8">
            <Opening n="02" name="Flow" title="One task, start to finish">
              <p>
                A pricing teardown for Monday, asked for from a phone. Four moments, and the app only needs attention in the
                first and the last.
              </p>
            </Opening>
            <Story steps={story} />
          </section>

          {/* 03 — DETAILS */}
          <section id="details" data-case-section className="scroll-mt-8">
            <Opening n="03" name="Details" title="The small things carry it">
              <p>
                A chat app is mostly one screen, so its quality is in the details: where a control sits, how a line folds,
                what colour is allowed to shout.
              </p>
            </Opening>
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {details.map((detail, i) => (
                <Reveal key={detail.title} delay={(i % 3) * 0.08}>
                  <Stage tone={detail.tone} className="h-full px-7 pb-9 pt-10 sm:px-8">
                    <Screen video={detail.video} image={detail.image} alt={detail.alt} className="mx-auto w-[74%] max-w-[250px]" />
                    <h3 className="mt-9 text-[1.0625rem] font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--okou-ink)]">{detail.title}</h3>
                    <p className="mt-1.5 text-sm leading-[1.5] text-[rgb(37_33_33/0.66)]">{detail.note}</p>
                  </Stage>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-5">
              <Stage tone="warm" className="p-7 sm:p-12">
                <div className="grid items-center gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <h3 className="text-[1.5rem] font-medium leading-[1.1] tracking-[-0.03em] text-[var(--okou-ink)] sm:text-[1.875rem]">Results with real covers</h3>
                    <p className="mt-4 max-w-[34ch] text-base leading-[1.55] text-[rgb(37_33_33/0.7)]">
                      A site is covered by its live page, a deck by its first slide. The card tells you what it is before you open it.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-8">
                    {[
                      // Cut on the card's own edge, with its corners: the cover meets the card on three sides.
                      ["result-site", "A website result card whose cover is the live page"],
                      ["result-deck", "A slides result card whose cover is the first slide"],
                    ].map(([src, alt]) => (
                      <Image
                        key={src}
                        src={`${A}/${src}.png`}
                        alt={alt}
                        width={1110}
                        height={824}
                        sizes="(min-width: 1180px) 340px, 45vw"
                        className="h-auto w-full drop-shadow-[0_16px_22px_rgba(60,40,20,0.18)]"
                      />
                    ))}
                  </div>
                </div>
              </Stage>
            </Reveal>
          </section>

          {/* 04 — WIDGETS */}
          <section id="widgets" data-case-section className="scroll-mt-8">
            <Opening n="04" name="Widgets" title="A widget with a face">
              <p>
                Most visits should not need the app at all. The Home Screen widget shows the one chat that matters now —
                what needs you, then what finished, then what is still running.
              </p>
              <p>Okou’s mood says it before the words do: thinking while it works, pleading when it needs you, asleep at night.</p>
            </Opening>
            <Reveal className="mt-16">
              <Texture name="drop-lightblue-blue" size={300} className="relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-12 sm:py-20">
                {/* The widgets at their real proportions, on the Home Screen grid:
                    large (338 x 354 pt) beside medium (338 x 158) over two smalls (158). */}
                <div className="mx-auto grid max-w-[760px] gap-x-12 gap-y-8 sm:grid-cols-2">
                  <Widget src="needs-l" alt="The large widget: one chat needs you, one is working, then the chats you come back to" width={1014} height={1062} />
                  <div className="flex flex-col justify-between gap-6">
                    <Widget src="quiet-m" alt="The medium widget when nothing is running: Okou’s greeting above two pinned chats" width={1014} height={474} />
                    <div className="grid grid-cols-2 gap-x-12 max-sm:gap-x-6">
                      <Widget src="busy-s" alt="The small widget: a chat that just finished" width={474} height={474} />
                      <Widget src="night-s" alt="The small widget at night: Okou asleep" width={474} height={474} />
                    </div>
                  </div>
                </div>
              </Texture>
            </Reveal>
            <StaggerGrid className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
              {widgetMoods.map((item, i) => (
                <StaggerItem key={item.mood} index={i} className="flex flex-col items-center text-center">
                  <Image src={`${A}/widget/avatar-${item.mood}.png`} alt="" width={252} height={252} className="size-20 rounded-full" />
                  <p className="mt-4 text-sm font-semibold tracking-[-0.01em] text-[var(--cs-heading)]">{item.label}</p>
                  <p className="mt-1 text-[13px] leading-[1.4] text-[var(--cs-body-sm)]">{item.when}</p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </section>

          {/* 05 — BRAND */}
          <section id="brand" data-case-section className="scroll-mt-8">
            <Opening n="05" name="Brand" title="The brand, made native">
              <p>
                Okou already had a voice on the web: a hopping wordmark, a character with twenty-one moods, eight brush
                textures. The app does not redraw any of it.
              </p>
              <p>
                The character runs on the same rig as the web’s, the colours come from the same tokens, and the textures
                sit behind every avatar — so the phone feels like Okou, not like a port.
              </p>
            </Opening>
            <div className="mt-16 grid gap-5 lg:grid-cols-12">
              <Reveal className="lg:col-span-7">
                <Stage tone="warm" className="flex h-full min-h-[320px] flex-col justify-between p-8 sm:p-10">
                  <Wordmark id="brand" loop className="mx-auto my-12 w-[min(420px,78%)]" />
                  <p className={eyebrowMeta}>The loading mark · each letter hops 80 ms after the last</p>
                </Stage>
              </Reveal>
              <Reveal delay={0.08} className="lg:col-span-5">
                <Stage tone="ink" className="flex h-full min-h-[320px] flex-col justify-between p-8 sm:p-10">
                  <div className="my-12 flex items-center justify-center gap-5">
                    <Mark className="w-[26%]" />
                    <Avatar mood="wink" className="w-[26%]" />
                    <Texture name="dash-pink-orange" size={120} className="aspect-square w-[26%] rounded-[29.5%]" />
                  </div>
                  <p className={`${eyebrowMeta} !text-white/45`}>Mark · avatar · texture</p>
                </Stage>
              </Reveal>
            </div>
            <Reveal className="mt-5">
              <Stage tone="warm">
                <MoodWall moods={moods} className="grid grid-cols-3 gap-x-3 gap-y-5 p-5 sm:grid-cols-7 sm:gap-x-4 sm:p-8" />
              </Stage>
            </Reveal>
            <div className="okou-marquee-mask mt-5">
              <div className="okou-marquee gap-4" style={{ "--okou-marquee-time": "48s" } as CSSProperties}>
                {[...textures, ...textures].map((name, i) => (
                  <Texture key={`${name}-${i}`} name={name} size={164} className="h-28 w-44 shrink-0 rounded-[1.25rem] sm:h-36 sm:w-56" />
                ))}
              </div>
            </div>
          </section>

          {/* 06 — SYSTEM */}
          <section id="system" data-case-section className="scroll-mt-8">
            <Opening n="06" name="System" title="One system under every screen">
              <p>
                Every screen is assembled from one native design system, ordered the way Apple’s HIG and Material 3 are:
                foundations, then components grouped by what they do, then the product’s patterns.
              </p>
              <p>Its colours are generated from the web’s tokens, so light and dark never drift from the web.</p>
            </Opening>
            <Reveal className="mt-16">
              <SystemSpecimen />
            </Reveal>
            <Reveal className="mt-5">
              <Stage tone="sky" className="px-7 py-14 sm:px-12 sm:py-20">
                <p className="mx-auto max-w-[44ch] text-center text-[1.25rem] font-medium leading-[1.3] tracking-[-0.02em] text-[var(--okou-ink)] sm:text-[1.5rem]">
                  It ships inside the app as a catalog, so a component is checked where it will live: on the device, in light
                  and dark.
                </p>
                <StaggerGrid className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
                  {[
                    { image: "ds-actions", title: "Actions", tone: "light" as const },
                    { image: "ds-identity", title: "Identity", tone: "light" as const },
                    { image: "ds-color-dark", title: "Colour", tone: "dark" as const },
                    { image: "ds-status-dark", title: "Status & feedback", tone: "dark" as const },
                  ].map((page, i) => (
                    <StaggerItem key={page.image} index={i} className="flex flex-col items-center">
                      <Screen image={page.image} tone={page.tone} alt={`The ${page.title} page of the design-system catalog`} className="w-full max-w-[236px]" />
                      <p className="mt-6 text-sm font-medium text-[rgb(37_33_33/0.7)]">{page.title}</p>
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </Stage>
            </Reveal>
          </section>
        </div>

        <CaseStudyFooter />
      </article>
      <NextSectionButton theme="light" />
    </PortfolioShell>
  );
}
