import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import { SmoothAnchor } from "../../components/smooth-anchor";
import { Board, BoardGallery, type BoardImage } from "../../components/board-viewer";
import { SubHeading, GradientTag, VideoFrame, CaseStudyFooter } from "../../components/case-study";
import { eyebrowSection, eyebrowMeta, bodyMd, bodySm, emphasis } from "../../lib/tokens";
import { EMAIL_HREF } from "../../lib/site-links";

// White page, so every design board (grey, #f3f3f3) and video (#eeeeee)
// reads as a panel by its own background: rounded corners, no border. Tried
// and dropped the same day: a grey page with unframed boards (screens
// cropped mid-screen looked cut off by the page), then a hairline frame on
// every board (a double grey edge on boards and videos with a tint of their
// own). Cards are a light grey to sit with the boards. Every board opens
// full screen (BoardGallery). Lutra's
// orange is the accent: #f05536 for graphics and large type, #c13d22 for
// small text (it keeps 4.5:1 on the grey).

const A = "/portfolio/cloudkitchens";
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
type Owner = "tony" | "yf" | "xx";
const productMap: { module: string; owners: Owner[]; features: string[] }[] = [
  { module: "Core Flow", owners: ["tony"], features: ["Lutra Academy", "Order Booster", "AI Assistant", "Me Tab"] },
  { module: "Order Manager", owners: ["yf", "xx"], features: ["Order Manager"] },
  { module: "Analyze", owners: ["tony"], features: ["Store Monitor", "Review Analyze", "Review Manager", "Ad Bidding"] },
  { module: "Printer", owners: ["yf", "xx"], features: ["Printer Pair", "Receipt Customize"] },
];

const personas = [
  "Most of them are new merchants.",
  "They spend a lot of labor and money on personal assistants.",
  "They have difficulty managing their data across several platforms.",
  "Their education level is not high, so they’re not used to technology products.",
  "They would rather spend money on buying traffic than on features.",
  "They see us only as a printing app.",
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
    Provide a <strong className={strong}>Coupon Distribution feature</strong> that helps new merchants{" "}
    <strong className={strong}>boost their business within a short period.</strong>
  </span>,
  <span key="h2">
    <strong className={strong}>Develop an AI assistant</strong> that guides users through various scenarios and helps merchants make fundamental decisions.
  </span>,
  <span key="h3">
    Bring the data from all delivery platforms into a <strong className={strong}>central dashboard</strong>, so users don’t need to check each platform.
  </span>,
];

const phasedOutcome: ReactNode[] = [
  <span key="o1">
    They <strong className={emphasis}>don’t come back to review</strong> and improve their coupon{" "}
    <strong className={emphasis}>strategy</strong>.
  </span>,
  <span key="o2">Merchants have no clear sense of how to set the coupon value, so the coupons don’t perform well in practice.</span>,
  <span key="o3">
    Our merchants <strong className={emphasis}>don’t believe in the product</strong>, so we need to show them that{" "}
    <strong className={emphasis}>we can provide all the eater data</strong> and that the coupons really reach eaters.
  </span>,
];

const iterationGoals: ReactNode[] = [
  <span key="g1">
    The AI Assistant suggests actions on the <strong className={emphasis}>homepage card</strong>, gives more detailed data on coupon results, and prompts users to change their coupon strategy when performance is poor. Add a coupon{" "}
    <strong className={emphasis}>history comparison</strong> page.
  </span>,
  <span key="g2">
    Offer a list of <strong className={emphasis}>AI-recommended</strong> coupon values to choose from, and let users build several coupons.
  </span>,
  <span key="g3">
    <strong className={emphasis}>Show on a map</strong> where the coupons go.
  </span>,
];

// The outcome recap: each hypothesis, what shipped for it, and the results
// already reported above. Hypotheses 2 and 3 shipped together in the analysis
// dashboard (Operation Automation), so they share its results.
const outcomes: { hypotheses: [number, string][]; shipped: string; href: `#${string}`; results: string[][] }[] = [
  {
    hypotheses: [[1, "Coupons that help new merchants grow fast"]],
    shipped: "Order Booster",
    href: "#final-design",
    results: [
      ["+31.5%", "Monthly orders"],
      ["+23.2%", "Monthly revenue"],
      ["+14.8%", "Monthly new eaters"],
    ],
  },
  {
    hypotheses: [
      [2, "An AI assistant for everyday decisions"],
      [3, "One dashboard for every delivery platform"],
    ],
    shipped: "Analysis dashboard & AI Assistant",
    href: "#operation-automation",
    results: [
      ["+0.5", "Monthly rating"],
      ["+7.2%", "Monthly revenue"],
      ["+9.7%", "Monthly orders"],
      ["+11.3%", "Monthly new eaters"],
    ],
  },
];

const businessResults = [
  ["+75.7%", "Click rate"],
  ["+12.2%", "Coupon adjustments"],
  ["92%", "Satisfaction"],
];
const merchantResults = [
  ["+31.5%", "Monthly orders"],
  ["+23.2%", "Monthly revenue"],
  ["+14.8%", "Monthly new eaters"],
];
const assistantResults = [
  ["+0.5", "Monthly rating"],
  ["+7.2%", "Monthly revenue"],
  ["+9.7%", "Monthly orders"],
  ["+11.3%", "Monthly new eaters"],
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
      <StaggerGrid className={`mt-5 grid gap-px overflow-hidden rounded-[1.25rem] bg-black/[0.05] ${cols}`}>
        {items.map(([value, name], i) => (
          <StaggerItem key={name} index={i} className="@container bg-[#f6f6f6] px-6 py-7">
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
      sidebarTheme="light"
      mainClassName="bg-white text-[#171717]"
      contentClassName="min-w-0 bg-white text-[#171717]"
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
            <Reveal className={`mt-14 grid gap-8 rounded-[1.25rem] bg-[#f6f6f6] p-6 sm:p-8 min-[1180px]:grid-cols-12 min-[1180px]:gap-10`}>
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
              <ul className={`flex flex-col gap-5 sm:max-[1179px]:flex-row sm:max-[1179px]:gap-10 min-[1180px]:col-span-5 min-[1180px]:border-l min-[1180px]:border-black/[0.07] min-[1180px]:pl-10`}>
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

            {/* Product map — formerly an image */}
            <StaggerGrid className="mt-5 grid grid-cols-2 gap-x-2 gap-y-10 rounded-[1.25rem] bg-[#f6f6f6] px-3 py-8 sm:grid-cols-4 sm:gap-x-4 sm:px-8">
              {productMap.map((column, i) => (
                <StaggerItem key={column.module} index={i} className="flex flex-col items-center gap-3">
                  <div className="flex -space-x-1.5">
                    <span className="sr-only">
                      Owned by {column.owners.map((o) => (o === "tony" ? "Tony Xing" : o === "yf" ? "Yifan" : "Xinxuan")).join(" and ")}
                    </span>
                    {column.owners.map((o) => (
                      <span key={o} className="rounded-full ring-2 ring-[#f6f6f6]">
                        <Avatar who={o} size="size-9" />
                      </span>
                    ))}
                  </div>
                  <p className="rounded-full px-4 py-2 text-sm font-medium text-white" style={{ background: ORANGE }}>
                    {column.module}
                  </p>
                  <ul className="flex flex-col items-center gap-2">
                    {column.features.map((feature) => (
                      <li key={feature} className="whitespace-nowrap rounded-full bg-white px-2.5 py-1.5 text-[12px] text-black/75 sm:px-3.5 sm:text-[13px]">
                        {feature}
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
              title="A vast market where kitchens fail fast"
              intro={
                <div className={`flex flex-col gap-6 ${bodyMd}`}>
                  <p>
                    The Chinese restaurant industry is vast, with many individual merchants and chain stores.
                    Operating in this sector poses various challenges, including site selection, data analysis,
                    operational strategies, and growth. In an extremely competitive environment, the average new kitchen survives only six months.
                  </p>
                  <p>
                    Our mission is to assist merchants in enhancing their operational capabilities, fostering profitability
                    and growth.
                  </p>
                  <p>
                    We initially reached 200,000 small and medium-sized merchants by selling printers. Our goal is to
                    better utilize our merchant resources and achieve our mission through our product, thereby helping
                    businesses improve their operations.
                  </p>
                </div>
              }
            >
              <Reveal className="mt-14">
                <Board {...B.posters} />
              </Reveal>
            </Chapter>

            <Chapter
              id="research"
              n="02"
              eyebrow="Research"
              title="Merchants want help, not another tool"
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
                <Board {...B.field} />
              </Reveal>
              {/* User personas — formerly an image, now text */}
              <div className="mt-16">
                <Reveal>
                  <SubHeading>User Personas</SubHeading>
                </Reveal>
                <StaggerGrid className="mt-6 grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {personas.map((line, i) => (
                    <StaggerItem key={line} index={i} className="flex h-full gap-4 rounded-[1.25rem] bg-[#f6f6f6] px-5 py-5">
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
              title="Merchants run on instinct, not data"
              intro={
                <div className={`flex flex-col gap-6 ${bodyMd}`}>
                  <p>
                    In China, over 70% of merchants terminate their leases each year, and over 50% have fewer than 100 orders a month. They entered the catering industry without sufficient preparation.
                  </p>
                  <p>
                    We need to build their data-driven mindset and, at the same time, help them increase orders and revenue from the start.
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

            <Chapter id="hypothesis" n="04" eyebrow="Hypothesis" title="Three bets to help merchants grow">
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
            >
              <Reveal className="mt-14">
                <Board {...B.core} />
              </Reveal>

              <div id="order-booster" className="mt-20 scroll-mt-8">
                <Reveal className={`grid gap-5 min-[1180px]:grid-cols-12 min-[1180px]:gap-10`}>
                  <div className={`min-[1180px]:col-span-5`}>
                    <SubHeading>Order Booster</SubHeading>
                  </div>
                  <div className={`flex flex-col gap-5 min-[1180px]:col-span-7 ${bodyMd}`}>
                    <p>
                      The design went through storyboarding, ideation and prototyping. After extensive research and experimentation we arrived at the final design, and we keep iterating based on A/B tests, user feedback and product research.
                    </p>
                    <p>
                      The Order Booster MVP helps merchants boost store orders and revenue by letting them set coupon values before coupons are distributed.
                    </p>
                  </div>
                </Reveal>
                <Reveal className="mt-10">
                  <Board {...B.mvp} />
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
                <Board {...B.flow} />
              </Reveal>
              <Reveal className="mt-12">
                <Board {...B.subscribe} />
              </Reveal>
              <Reveal className="mt-12">
                <Board {...B.history} />
              </Reveal>
            </Chapter>

            <Chapter id="final-design" n="06" eyebrow="Final design" title="Smarter coupons, visible results">
              <Goal
                n={1}
                board={
                  <Reveal>
                    <Board {...B.goal1} />
                  </Reveal>
                }
              >
                The AI Assistant suggests actions on the <strong className={emphasis}>homepage card</strong>, gives more detailed data on coupon results, and prompts users to change their coupon strategy when performance is poor. Add a coupon{" "}
    <strong className={emphasis}>history comparison</strong> page.
              </Goal>
              <Goal
                n={2}
                board={
                  <>
                    <Reveal>
                      <Board {...B.goal2} />
                    </Reveal>
                    <Reveal>
                      <VideoFrame src={`${A}/ck-16.mp4`} className="border-0" />
                    </Reveal>
                    <Reveal>
                      <VideoFrame src={`${A}/ck-17.mp4`} className="border-0" />
                    </Reveal>
                  </>
                }
              >
                Offer a list of <strong className={emphasis}>AI-recommended</strong> coupon values to choose from, and let users build several coupons.
              </Goal>
              <Goal
                n={3}
                board={
                  <Reveal>
                    <Board {...B.goal3} />
                  </Reveal>
                }
              >
                <strong className={emphasis}>Show on a map</strong> where the coupons go, and provide a central dashboard of coupon data, so users don’t need to go back and forth between platforms.
              </Goal>

              <div className="mt-20 flex flex-col gap-8">
                <Results label="Business results" items={businessResults} />
                <Results label="Merchant results" items={merchantResults} />
              </div>
            </Chapter>

            <Chapter
              id="operation-automation"
              n="07"
              title="AI turns store data into next steps"
              intro={
                <p className={bodyMd}>
                  The analysis dashboard brings together all of a restaurant’s data and uses AI to give stage-specific recommendations for the merchant’s store. Users act on them in the Analyze sub-features — Store Monitor, Review Management, Ad Bidding and more — to improve their store ratings.
                </p>
              }
            >
              <StaggerGrid className="mt-14 grid gap-3 sm:grid-cols-2">
                {[
                  ["Auto Ad Bidding", "Helps users secure the most cost-effective ad placements on delivery platforms."],
                  ["Lutra AI Assistant", "Offers store optimization and guidance plans across features."],
                ].map(([title, body], i) => (
                  <StaggerItem key={title} index={i} className="h-full rounded-[1.25rem] bg-[#f6f6f6] px-6 py-6">
                    <SubHeading>{title}</SubHeading>
                    <p className={`mt-3 ${bodyMd}`}>{body}</p>
                  </StaggerItem>
                ))}
              </StaggerGrid>
              <div className="mt-12 flex flex-col gap-12">
                <Reveal>
                  <Board {...B.dashboard} />
                </Reveal>
                <Reveal>
                  <Board {...B.reviews} />
                </Reveal>
                <Reveal>
                  <Board {...B.monitor} />
                </Reveal>
              </div>
              <div className="mt-6">
                <Results items={assistantResults} />
              </div>
            </Chapter>

            <Chapter
              id="core-tabs"
              n="08"
              title="Core tabs cover the daily basics"
              intro={<p className={bodyMd}>Orders, Printer and Me.</p>}
            >
              <Reveal className="mt-14">
                <Board {...B.tabs} />
              </Reveal>
            </Chapter>

            <Chapter id="outcome" n="09" eyebrow="Outcome" title="What the three bets delivered">
              <div className="mt-12 flex flex-col gap-4">
                {outcomes.map((o, i) => (
                  <Reveal key={o.shipped} className="grid gap-6 rounded-[1.25rem] bg-[#f6f6f6] p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-8">
                    <ul className="flex flex-col gap-3 lg:col-span-4">
                      {o.hypotheses.map(([n, text]) => (
                        <li key={n} className="flex flex-col gap-1.5">
                          <GradientTag tone="warm">Hypothesis {n}</GradientTag>
                          <span className="text-[15px] leading-6 text-[var(--cs-heading)]">{text}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-3 lg:col-span-3">
                      <ArrowRight aria-hidden className="hidden size-5 shrink-0 lg:block" style={{ color: ORANGE }} strokeWidth={2.25} />
                      <div>
                        <p className={eyebrowMeta}>Shipped</p>
                        <SmoothAnchor
                          href={o.href}
                          className={`mt-1 inline-block text-base font-semibold ${ORANGE_TEXT} hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c13d22]`}
                        >
                          {/* The arrow stays with the last word, so a wrapped name ends in it. */}
                          {o.shipped.split(" ").slice(0, -1).join(" ")}{" "}
                          <span className="whitespace-nowrap">
                            {o.shipped.split(" ").at(-1)}
                            <ArrowDown aria-hidden className="ml-1 inline-block size-3.5 -rotate-180 align-[-0.1em]" strokeWidth={2.5} />
                          </span>
                        </SmoothAnchor>
                      </div>
                    </div>
                    <dl className={`grid grid-cols-2 gap-x-6 gap-y-4 lg:col-span-5 ${i === 1 ? "sm:grid-cols-4 lg:grid-cols-2" : "sm:grid-cols-3 lg:grid-cols-3"}`}>
                      {o.results.map(([value, name]) => (
                        <div key={name}>
                          <dd className="whitespace-nowrap text-[1.75rem] font-medium leading-none tracking-[-0.03em] text-[var(--cs-heading)]">{value}</dd>
                          <dt className={`mt-1.5 ${bodySm}`}>{name}</dt>
                        </div>
                      ))}
                    </dl>
                  </Reveal>
                ))}
              </div>
              <Reveal className="mt-16 flex flex-col gap-4 border-t border-black/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className={`max-w-[52ch] ${bodyMd}`}>
                  Beyond this 0-1 project, I worked on many more projects during my time at CloudKitchens. If you’d like to
                  hear about them, please reach out.
                </p>
                <a
                  href={EMAIL_HREF}
                  className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c13d22]"
                >
                  Say hi
                  <ArrowUpRight aria-hidden className="size-4" strokeWidth={2.25} />
                </a>
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
        <div className="flex h-full gap-4 rounded-[1.25rem] bg-[#f6f6f6] px-5 py-5">
          <span aria-hidden className="text-xs font-semibold tabular-nums leading-7 text-black/35">{n}</span>
          <p className={bodyMd}>{outcome}</p>
        </div>
      </Reveal>
      <div aria-hidden className="hidden items-center lg:flex">
        <ArrowRight className="size-5" style={{ color: ORANGE }} strokeWidth={2.25} />
      </div>
      <Reveal className={`${["order-6", "order-7", "order-8"][i]} lg:order-none`}>
        <div className="flex h-full gap-4 rounded-[1.25rem] bg-[#f6f6f6] px-5 py-5">
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
