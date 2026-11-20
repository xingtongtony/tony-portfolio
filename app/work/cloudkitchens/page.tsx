import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight, TrendingUp } from "lucide-react";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import { SmoothAnchor } from "../../components/smooth-anchor";
import { Board, BoardGallery, type BoardImage } from "../../components/board-viewer";
import { SubHeading, GradientTag, VideoFrame, CaseStudyFooter } from "../../components/case-study";
import { eyebrowSection, eyebrowMeta, bodyMd, bodySm, emphasis } from "../../lib/tokens";

// The page is the grey of Lutra's own design boards (#f3f3f3). Every board
// keeps a hairline frame: their phone screens are long screenshots cut off
// mid-screen, and with no edge round the board a cut screen looked as if the
// page had cut it (Tony, 2026-11-20). Every board opens full screen
// (BoardGallery). Lutra's
// orange is the accent: #f05536 for graphics and large type, #c13d22 for
// small text (it keeps 4.5:1 on the grey).

const A = "/portfolio/cloudkitchens";
const PAPER = "#f3f3f3";
const ORANGE = "#f05536";
const ORANGE_TEXT = "text-[#c13d22]";

const B = {
  posters: { src: `${A}/ck-05.jpg`, alt: "Lutra brand posters — the first all-in-one dashboard built for restaurants", width: 3842, height: 2160 },
  field: { src: `${A}/ck-06.jpg`, alt: "Field research — merchant photos and verbatim feedback", width: 4000, height: 2030 },
  core: { src: `${A}/ck-09.jpg`, alt: "Lutra — the core product screens", width: 5942, height: 2480 },
  mvp: { src: `${A}/ck-10.jpg`, alt: "MVP Order Booster — set coupon value and view distribution results", width: 4000, height: 2400 },
  flow: { src: `${A}/ck-11.jpg`, alt: "Order Booster user flow — from opening the app to checking history", width: 4952, height: 1580 },
  subscribe: { src: `${A}/ck-12.png`, alt: "Unsubscribed → Subscribe flow", width: 3088, height: 1608 },
  history: { src: `${A}/ck-13.png`, alt: "After subscribed & coupon history", width: 3086, height: 1608 },
  goal1: { src: `${A}/ck-14.jpg`, alt: "Order Booster states when a new merchant first opens the app", width: 4000, height: 3048 },
  goal2: { src: `${A}/ck-15.jpg`, alt: "Coupon settings — recommended values and multiple coupons", width: 4000, height: 2400 },
  goal3: { src: `${A}/ck-18.jpg`, alt: "Coupon distribution, history and order list", width: 4000, height: 3048 },
  dashboard: { src: `${A}/ck-19.jpg`, alt: "Central dashboard — store info and all delivery-platform data", width: 4000, height: 3048 },
  reviews: { src: `${A}/ck-20.jpg`, alt: "Review management, review analysis and review reply", width: 4000, height: 3048 },
  monitor: { src: `${A}/ck-21.jpg`, alt: "Store monitor, monitor settings and auto ad bidding", width: 4000, height: 3048 },
  tabs: { src: `${A}/ck-22.jpg`, alt: "Core tabs — Order, Printer and Me", width: 4000, height: 3048 },
} satisfies Record<string, BoardImage>;

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design / Motion"],
  ["Platform", "Native / Mobile"],
  ["Timeline", "Aug 2022 — Oct 2023"],
];

// The product map (formerly an image): who owned which module, and its features.
// Features this case study covers link to where it covers them.
type Owner = "tony" | "yf" | "xx";
const productMap: { module: string; owners: Owner[]; features: [string, `#${string}`?][] }[] = [
  { module: "Core Flow", owners: ["tony"], features: [["Lutra Academy"], ["Order Booster", "#order-booster"], ["AI Assistant", "#operation-automation"], ["Me Tab", "#core-tabs"]] },
  { module: "Order Manager", owners: ["yf", "xx"], features: [["Order Manager", "#core-tabs"]] },
  { module: "Analyze", owners: ["tony"], features: [["Store Monitor", "#operation-automation"], ["Review Analyze", "#operation-automation"], ["Review Manager", "#operation-automation"], ["Ad Bidding", "#operation-automation"]] },
  { module: "Printer", owners: ["yf", "xx"], features: [["Printer Pair"], ["Receipt Customize"]] },
];

const personas = [
  "Most of them are new merchant.",
  "They require a lot of labor costs and money on a personal assistant.",
  "They are having difficulty to manage their data in several platforms.",
  "Their education is not too high, so They’re not use to technology products.",
  "They are willing to spend money on purchasing traffic rather than functionalities.",
  "They view us exclusively as an application for printing.",
];

const problems = [
  {
    title: "New merchants are hard to get started and grow",
    body: "Most of the merchants are new businesses; they need to quickly boost store visibility and orders within a short period.",
  },
  {
    title: "Lack of operational mindset",
    body: "Most merchants are still using traditional methods for marketing — they would rather have a personal human assistant than explore the product.",
  },
  {
    title: "Complex to operate on multiple platforms",
    body: "Multiple food delivery platforms require restaurants to equip multiple tablets, increasing costs and potentially reducing efficiency.",
  },
];

const strong = "font-semibold text-[#1a1a1a]";
const hypotheses: ReactNode[] = [
  <span key="h1">
    Providing the <strong className={strong}>Coupon Distribution feature</strong> for new merchants and helping them{" "}
    <strong className={strong}>boost their business within a short period.</strong>
  </span>,
  <span key="h2">
    <strong className={strong}>Develop an AI assistant</strong> that could guide users through various scenarios, assisting
    merchants in making fundamental decisions.
  </span>,
  <span key="h3">
    Collect the data from all delivery platforms in a <strong className={strong}>central dashboard</strong>. Users don’t need
    to check data on each platform.
  </span>,
];

const phasedOutcome: ReactNode[] = [
  <span key="o1">
    They <strong className={emphasis}>don’t come back to review</strong> and improve their coupon{" "}
    <strong className={emphasis}>strategy</strong>.
  </span>,
  <span key="o2">Merchant have no clear concept of how to set the coupon value. The coupons don’t perform well in practical usage.</span>,
  <span key="o3">
    Our merchant does <strong className={emphasis}>not believe in the product</strong>, so we need to give users the clue
    that <strong className={emphasis}>we are capable of providing all the eaters data</strong>, and the coupons are truly
    sent to the eaters’ hands.
  </span>,
];

const iterationGoals: ReactNode[] = [
  <span key="g1">
    AI Assistant could give user actions on the <strong className={emphasis}>homepage card</strong>, give them more
    detailed data for their coupon result and lead the user to change the coupon strategy when the performance is not
    good. Give them the coupon <strong className={emphasis}>history comparison</strong> page.
  </span>,
  <span key="g2">
    Give the user a list of AI <strong className={emphasis}>recommendation</strong> coupon values for the user to choose
    from, give user the opportunity to build several coupons.
  </span>,
  <span key="g3">
    We will <strong className={emphasis}>indicate the locations on the map</strong> where the coupon goes.
  </span>,
];

const businessResults = [
  ["+75.7%", "Click Rate"],
  ["+12.2%", "Adjusting Coupon"],
  ["92%", "Satisfaction"],
];
const merchantResults = [
  ["+31.5%", "Monthly Order"],
  ["+23.2%", "Monthly Revenue"],
  ["+14.8%", "Monthly New Eater"],
];
const assistantResults = [
  ["+0.5", "Monthly Rating"],
  ["+7.2%", "Monthly Revenue"],
  ["+9.7%", "Monthly Order"],
  ["+11.3%", "Monthly New Eater"],
];

// Two columns (heading left, text right) only where the content area is wide
// enough for both (min-[1180px]); below that, stacked.

/** A chapter: number and eyebrow, the title, and its opening text beside it. */
function Chapter({
  id,
  n,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  n: string;
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section id={id} data-case-section className="scroll-mt-8">
      <Reveal className={`grid gap-8 min-[1180px]:grid-cols-12 min-[1180px]:gap-10`}>
        <div className={`min-[1180px]:col-span-5`}>
          <p className={eyebrowSection}>
            <span className={ORANGE_TEXT}>{n}</span>
            {eyebrow ? (
              <>
                <span aria-hidden className="mx-2 text-black/20">/</span>
                {eyebrow}
              </>
            ) : null}
          </p>
          <h2 className="mt-4 max-w-[18ch] text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-[var(--cs-heading)] text-balance sm:text-4xl">
            {title}
          </h2>
        </div>
        {intro ? <div className={`min-[1180px]:col-span-7 min-[1180px]:pt-8`}>{intro}</div> : null}
      </Reveal>
      {children}
    </section>
  );
}

function Avatar({ who, size = "size-10" }: { who: Owner; size?: string }) {
  if (who === "tony") {
    return <Image src={`${A}/ck-tony.jpg`} alt="" width={160} height={160} className={`${size} rounded-full`} />;
  }
  const [initials, bg] = who === "yf" ? ["YF", "bg-[#7c62ff]"] : ["XX", "bg-[#f4b91d]"];
  return (
    <span aria-hidden className={`${size} ${bg} flex items-center justify-center rounded-full text-[13px] font-semibold text-white`}>
      {initials}
    </span>
  );
}

/** Results: one white panel, one type scale; an arrow marks a rise. */
function Results({ items, label }: { items: string[][]; label?: string }) {
  const cols = items.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3";
  return (
    <div className="mt-6">
      {label ? (
        <Reveal>
          <SubHeading>{label}</SubHeading>
        </Reveal>
      ) : null}
      <StaggerGrid className={`mt-5 grid gap-px overflow-hidden rounded-[1.25rem] bg-black/[0.06] ${cols}`}>
        {items.map(([value, name], i) => (
          <StaggerItem key={name} index={i} className="@container bg-white px-6 py-7">
            <p className="flex items-center gap-2 whitespace-nowrap text-[clamp(1.75rem,19cqw,3.5rem)] font-medium leading-none tracking-[-0.04em] text-[var(--cs-heading)]">
              {value}
              {value.startsWith("+") ? (
                <TrendingUp aria-hidden className="size-6 shrink-0" style={{ color: ORANGE }} strokeWidth={2.5} />
              ) : null}
            </p>
            <p className={`mt-3 ${bodySm}`}>{name}</p>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
}

/** "Iterate Goal N": a large numeral, the goal, then its board. */
function Goal({ n, children, board }: { n: number; children: ReactNode; board: ReactNode }) {
  return (
    <div id={`goal-${n}`} className={`scroll-mt-8 ${n === 1 ? "mt-14" : "mt-20"}`}>
      <Reveal className={`grid gap-5 min-[1180px]:grid-cols-12 min-[1180px]:gap-10`}>
        <div className={`flex items-baseline gap-4 min-[1180px]:col-span-5`}>
          <span aria-hidden className="text-[3.5rem] font-medium leading-none tracking-[-0.04em]" style={{ color: ORANGE }}>
            {String(n).padStart(2, "0")}
          </span>
          <SubHeading>Iterate Goal {n}</SubHeading>
        </div>
        <p className={`min-[1180px]:col-span-7 ${bodyMd}`}>{children}</p>
      </Reveal>
      <div className="mt-10 flex flex-col gap-12">{board}</div>
    </div>
  );
}

export default function CloudKitchensPage() {
  return (
    <PortfolioShell
      sidebarTheme="paper"
      rootBg={PAPER}
      mainClassName="bg-[#f3f3f3] text-[#171717]"
      contentClassName="min-w-0 bg-[#f3f3f3] text-[#171717]"
    >
      <BoardGallery boards={Object.values(B)}>
        <article
          data-cs-theme="light"
          className="mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 xl:px-14 lg:pb-24 lg:pt-14"
        >
          {/* HERO */}
          <figure className="overflow-hidden rounded-[1.75rem]">
            <Image
              src={`${A}/ck-02.jpg`}
              alt="Lutra app dashboard on a phone in a restaurant setting"
              width={2700}
              height={1419}
              priority
              className="h-auto w-full"
            />
          </figure>

          {/* TITLE, OVERVIEW AND FACTS */}
          <section className="pt-14 lg:pt-20">
            <div className={`grid gap-12 min-[1180px]:grid-cols-12 min-[1180px]:gap-10`}>
              <div className={`min-[1180px]:col-span-7`}>
                <p className={eyebrowMeta}>Aug 2022 — Oct 2023</p>
                <h1 className="mt-6 max-w-[20ch] text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1] tracking-[-0.03em] text-[var(--cs-heading)] text-balance">
                  CloudKitchens — Lutra App
                </h1>
                <p className={`mt-12 ${eyebrowSection}`}>Overview</p>
                <p className="mt-5 max-w-[46ch] text-lg leading-[1.5] tracking-[-0.01em] text-[var(--cs-body)]">
                  Lutra is the first all-in-one restaurant management solution — covering everything from location
                  selection to day-to-day operations and performance analysis for merchants.
                </p>
              </div>
              <dl className={`border-t border-black/[0.08] min-[1180px]:col-span-5 min-[1180px]:mt-14`}>
                {projectStats.map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-6 border-b border-black/[0.08] py-4">
                    <dt className={eyebrowMeta}>{label}</dt>
                    <dd className="text-right text-[15px] font-medium leading-6 text-[var(--cs-heading)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Team — formerly an image, now text */}
            <Reveal className={`mt-14 grid gap-8 rounded-[1.25rem] bg-white p-6 sm:p-8 min-[1180px]:grid-cols-12 min-[1180px]:gap-10`}>
              <figure className={`flex gap-4 min-[1180px]:col-span-7`}>
                <Avatar who="tony" size="size-12 shrink-0" />
                <div>
                  <p className="text-base font-semibold leading-6 text-[var(--cs-heading)]">Tony Xing</p>
                  <p className={bodySm}>Lead Product Designer</p>
                  <blockquote className="mt-4 text-lg leading-[1.45] tracking-[-0.01em] text-[var(--cs-heading)]">
                    I take responsibility for reviewing all design assets, providing feedback, and leading team members to
                    deliver valuable designs.
                  </blockquote>
                </div>
              </figure>
              <ul className={`flex flex-col gap-5 sm:max-[1179px]:flex-row sm:max-[1179px]:gap-10 min-[1180px]:col-span-5 min-[1180px]:border-l min-[1180px]:border-black/[0.06] min-[1180px]:pl-10`}>
                {(
                  [
                    ["yf", "Yifan"],
                    ["xx", "Xinxuan"],
                  ] as const
                ).map(([who, name]) => (
                  <li key={who} className="flex items-center gap-4">
                    <Avatar who={who} size="size-12 shrink-0" />
                    <div>
                      <p className="text-base font-semibold leading-6 text-[var(--cs-heading)]">{name}</p>
                      <p className={bodySm}>Senior Product Designer</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Product map — formerly an image; covered features link to their part of the story */}
            <StaggerGrid className="mt-5 grid grid-cols-2 gap-x-2 gap-y-10 rounded-[1.25rem] bg-white px-3 py-8 sm:grid-cols-4 sm:gap-x-4 sm:px-8">
              {productMap.map((column, i) => (
                <StaggerItem key={column.module} index={i} className="flex flex-col items-center gap-3">
                  <div className="flex -space-x-1.5">
                    <span className="sr-only">
                      Owned by {column.owners.map((o) => (o === "tony" ? "Tony Xing" : o === "yf" ? "Yifan" : "Xinxuan")).join(" and ")}
                    </span>
                    {column.owners.map((o) => (
                      <span key={o} className="rounded-full ring-2 ring-white">
                        <Avatar who={o} size="size-9" />
                      </span>
                    ))}
                  </div>
                  <p className="rounded-full px-4 py-2 text-sm font-medium text-white" style={{ background: ORANGE }}>
                    {column.module}
                  </p>
                  <ul className="flex flex-col items-center gap-2">
                    {column.features.map(([feature, href]) => (
                      <li key={feature}>
                        {href ? (
                          <SmoothAnchor
                            href={href}
                            className="group inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#f3f3f3] px-2.5 py-1.5 text-[12px] sm:px-3.5 sm:text-[13px] text-black/75 transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c13d22]"
                          >
                            {feature}
                            <ArrowDown aria-hidden className="size-3 opacity-40 transition-opacity group-hover:opacity-100" strokeWidth={2.5} />
                          </SmoothAnchor>
                        ) : (
                          <span className="inline-flex whitespace-nowrap rounded-full bg-[#f3f3f3] px-2.5 py-1.5 text-[12px] text-black/55 sm:px-3.5 sm:text-[13px]">{feature}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </section>

          {/* CHAPTERS */}
          <div className="mt-28 flex flex-col gap-28 sm:gap-36 lg:mt-36 lg:gap-44">
            <Chapter
              id="background"
              n="01"
              eyebrow="Background"
              title="The potential of Chinese merchants"
              intro={
                <div className={`flex flex-col gap-6 ${bodyMd}`}>
                  <p>
                    The Chinese restaurant industry is vast, There are many individual merchants and chain stores.
                    Operating in this sector poses various challenges, including site selection, data analysis,
                    operational strategies, and growth. The average business cycle of a new kitchen only survive six
                    months in a extremely competitive environment.
                  </p>
                  <p>
                    Our mission is to assist merchants in enhancing their operational capabilities, fostering profitability
                    and growth.
                  </p>
                  <p>
                    We initially drove got 200,000 small and medium-sized merchants by selling printers. Our goal is to
                    better utilize our merchant resources and achieve our mission through our product, thereby helping
                    businesses improve their operations.
                  </p>
                </div>
              }
            >
              <Reveal className="mt-14">
                <Board {...B.posters} framed />
              </Reveal>
            </Chapter>

            <Chapter
              id="research"
              n="02"
              eyebrow="Research"
              title="User Feedback"
            >
              <StaggerGrid className="mt-10 grid gap-6 sm:grid-cols-3">
                {[
                  ["Interview: 30 min", "32 Calls"],
                  ["Interview: 30 min", "24 Visits"],
                  ["Form: 5 min to finish", "160 Surveys"],
                ].map(([label, value], i) => (
                  <StaggerItem key={value} index={i} className="@container">
                    <p className={bodySm}>{label}</p>
                    <p className="mt-2 whitespace-nowrap text-[clamp(1.75rem,15cqw,2.75rem)] font-medium leading-none tracking-[-0.03em] text-[var(--cs-heading)]">
                      {value}
                    </p>
                  </StaggerItem>
                ))}
              </StaggerGrid>
              <Reveal className="mt-14">
                <Board {...B.field} framed />
              </Reveal>
              {/* User personas — formerly an image, now text */}
              <div className="mt-16">
                <Reveal>
                  <SubHeading>User Personas</SubHeading>
                </Reveal>
                <StaggerGrid className="mt-6 grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {personas.map((line, i) => (
                    <StaggerItem key={line} index={i} className="flex h-full gap-4 rounded-[1.25rem] bg-white px-5 py-5">
                      <span aria-hidden className={`text-xs font-semibold tabular-nums leading-6 ${ORANGE_TEXT}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[15px] leading-6 text-[var(--cs-heading)]">{line}</p>
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            </Chapter>

            <Chapter
              id="identify-problems"
              n="03"
              eyebrow="Identify problems"
              title="Experience vs. data-informed decisions"
              intro={
                <div className={`flex flex-col gap-6 ${bodyMd}`}>
                  <p>
                    Over 70% of merchant terminate their leases annually, and over 50% of merchants have a monthly order
                    volume of less than 100 in China. They entered the catering industry without sufficient preparation.
                  </p>
                  <p>
                    We need to improve their data-driven mindset and educate merchants group, meanwhile, help them increase
                    their store orders and revenue at beginning.
                  </p>
                </div>
              }
            >
              {/* Sticky notes (the source's own #ffe563 cards), numbered so each
                  lines up with the hypothesis that answers it, below. */}
              <StaggerGrid className="mt-14 grid gap-5 sm:grid-cols-3">
                {problems.map((c, i) => (
                  <StaggerItem
                    key={c.title}
                    index={i}
                    className="relative flex h-full flex-col gap-2.5 rounded-[var(--r-md)] border border-[#d1c70a] bg-[#ffe563] px-6 pb-6 pt-5 text-[#1a1a1a] shadow-[2px_2px_8px_#00000029]"
                  >
                    <span aria-hidden className="text-xs font-semibold tabular-nums text-[#1a1a1a]/45">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em]">{c.title}</h3>
                    <p className="text-sm leading-[1.5] text-[#1a1a1a]/80">{c.body}</p>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>

            <Chapter id="hypothesis" n="04" eyebrow="Hypothesis" title="Hypothesis">
              <StaggerGrid className="mt-12 grid gap-5 sm:grid-cols-3">
                {hypotheses.map((body, i) => (
                  <StaggerItem
                    key={i}
                    index={i}
                    className="flex h-full flex-col gap-4 rounded-[var(--r-md)] border border-[#e6e6e6] bg-white p-6 text-[#1a1a1a] shadow-[2px_2px_8px_#0000001a]"
                  >
                    <GradientTag tone="warm">Hypothesis {i + 1}</GradientTag>
                    <p className="text-[15px] leading-[1.5] text-[#1a1a1a]/85">{body}</p>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>

            <Chapter
              id="design-process"
              n="05"
              eyebrow="Design process"
              title="Build an MVP to verify the hypothesis"
              intro={
                <p className={bodyMd}>
                  From this 0-1 project, I worked on many more projects during my time at CloudKitchens; if you’re
                  interested, please reach out to me.
                </p>
              }
            >
              <Reveal className="mt-14">
                <Board {...B.core} framed />
              </Reveal>

              <div id="order-booster" className="mt-20 scroll-mt-8">
                <Reveal className={`grid gap-5 min-[1180px]:grid-cols-12 min-[1180px]:gap-10`}>
                  <div className={`min-[1180px]:col-span-5`}>
                    <SubHeading>Order Booster</SubHeading>
                  </div>
                  <div className={`flex flex-col gap-5 min-[1180px]:col-span-7 ${bodyMd}`}>
                    <p>
                      The design from Storyboarding, Ideations, Prototyping. After extensive research and
                      experimentation, we arrived at the final design, and we are still iterating based on AB test, user
                      feedback and product research.
                    </p>
                    <p>
                      The MVP of Order Booster is helping merchants boost store orders and revenue by allowing them to set
                      coupon values before initiating the distribution of coupons.
                    </p>
                  </div>
                </Reveal>
                <Reveal className="mt-10">
                  <Board {...B.mvp} framed />
                </Reveal>
              </div>

              {/* What the MVP taught, and what each lesson set as the next goal:
                  read across, outcome → goal. Stacked below lg, in order. */}
              <div className="mt-20 grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-4">
                <Reveal className="order-1 lg:order-none">
                  <SubHeading>Phased Outcome</SubHeading>
                </Reveal>
                <span className="hidden lg:block" />
                <Reveal className="order-5 mt-10 lg:order-none lg:mt-0">
                  <SubHeading>Iteration Goals</SubHeading>
                </Reveal>
                {phasedOutcome.map((outcome, i) => (
                  <PairRow key={i} i={i} outcome={outcome} goal={iterationGoals[i]} />
                ))}
              </div>

              <Reveal className="mt-20">
                <Board {...B.flow} framed />
              </Reveal>
              <Reveal className="mt-12">
                <Board {...B.subscribe} framed />
              </Reveal>
              <Reveal className="mt-12">
                <Board {...B.history} framed />
              </Reveal>
            </Chapter>

            <Chapter id="final-design" n="06" eyebrow="Final design" title="Final design & Visual craft">
              <Goal
                n={1}
                board={
                  <Reveal>
                    <Board {...B.goal1} framed />
                  </Reveal>
                }
              >
                AI Assistant could give user actions on the <strong className={emphasis}>homepage card</strong>, give them
                more detailed data for their coupon result and lead the user to change the coupon strategy when the
                performance is not good. Give them the coupon <strong className={emphasis}>history comparison</strong> page.
              </Goal>
              <Goal
                n={2}
                board={
                  <>
                    <Reveal>
                      <Board {...B.goal2} framed />
                    </Reveal>
                    <Reveal>
                      <VideoFrame src={`${A}/ck-16.mp4`} className="border-black/[0.04]" />
                    </Reveal>
                    <Reveal>
                      <VideoFrame src={`${A}/ck-17.mp4`} className="border-black/[0.04]" />
                    </Reveal>
                  </>
                }
              >
                Give the user a list of AI <strong className={emphasis}>recommendation</strong> coupon values for the user
                to choose from, give user the opportunity to build several coupons.
              </Goal>
              <Goal
                n={3}
                board={
                  <Reveal>
                    <Board {...B.goal3} framed />
                  </Reveal>
                }
              >
                We will <strong className={emphasis}>indicate the locations on the map</strong> where the coupon goes, and
                provide a central dashboard of their coupon data. They don’t need to go back and forth on different
                platforms.
              </Goal>

              <div className="mt-20 flex flex-col gap-8">
                <Results label="From business goal" items={businessResults} />
                <Results label="From merchant goal" items={merchantResults} />
              </div>
            </Chapter>

            <Chapter
              id="operation-automation"
              n="07"
              title="Operation Automation"
              intro={
                <p className={bodyMd}>
                  The analysis dashboard encompasses all restaurant data, utilizing AI to provide stage-specific
                  recommendations based on each dataset for the current merchant’s store. Users can take corresponding
                  actions in the analyze sub-features to enhance store ratings. It includes various sub-features such as
                  Store Monitor, Review Management, Ad Bidding, etc.
                </p>
              }
            >
              <StaggerGrid className="mt-14 grid gap-3 sm:grid-cols-2">
                {[
                  ["Auto Ad Bidding", "Assisting users in securing the most cost-effective advertising placements on delivery platforms."],
                  ["Lutra AI Assistant", "Offering store optimization and guidance plans within various features for user."],
                ].map(([title, body], i) => (
                  <StaggerItem key={title} index={i} className="h-full rounded-[1.25rem] bg-white px-6 py-6">
                    <SubHeading>{title}</SubHeading>
                    <p className={`mt-3 ${bodyMd}`}>{body}</p>
                  </StaggerItem>
                ))}
              </StaggerGrid>
              <div className="mt-12 flex flex-col gap-12">
                <Reveal>
                  <Board {...B.dashboard} framed />
                </Reveal>
                <Reveal>
                  <Board {...B.reviews} framed />
                </Reveal>
                <Reveal>
                  <Board {...B.monitor} framed />
                </Reveal>
              </div>
              <div className="mt-6">
                <Results items={assistantResults} />
              </div>
            </Chapter>

            <Chapter
              id="core-tabs"
              n="08"
              title="Core Tabs"
              intro={<p className={bodyMd}>Me Tab, Printer, and Orders. Reach out to me if you are interested in more details.</p>}
            >
              <Reveal className="mt-14">
                <Board {...B.tabs} framed />
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

/** One outcome and the goal it set, side by side from lg; the goal links to its design. */
function PairRow({ i, outcome, goal }: { i: number; outcome: ReactNode; goal: ReactNode }) {
  const n = String(i + 1).padStart(2, "0");
  return (
    <>
      <Reveal className={`${["order-2", "order-3", "order-4"][i]} lg:order-none`}>
        <div className="flex h-full gap-4 rounded-[1.25rem] bg-white px-5 py-5">
          <span aria-hidden className="text-xs font-semibold tabular-nums leading-7 text-black/35">{n}</span>
          <p className={bodyMd}>{outcome}</p>
        </div>
      </Reveal>
      <div aria-hidden className="hidden items-center lg:flex">
        <ArrowRight className="size-5" style={{ color: ORANGE }} strokeWidth={2.25} />
      </div>
      <Reveal className={`${["order-6", "order-7", "order-8"][i]} lg:order-none`}>
        <div className="flex h-full gap-4 rounded-[1.25rem] bg-white px-5 py-5">
          <span aria-hidden className={`text-xs font-semibold tabular-nums leading-7 ${ORANGE_TEXT}`}>{n}</span>
          <div className="flex flex-1 flex-col gap-3">
            <p className={bodyMd}>{goal}</p>
            <SmoothAnchor
              href={`#goal-${i + 1}`}
              className={`inline-flex w-fit items-center gap-1 text-[13px] font-medium ${ORANGE_TEXT} hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c13d22]`}
              aria-label={`Iterate Goal ${i + 1} in Final design`}
            >
              Iterate Goal {i + 1}
              <ArrowDown aria-hidden className="size-3.5" strokeWidth={2.5} />
            </SmoothAnchor>
          </div>
        </div>
      </Reveal>
    </>
  );
}
