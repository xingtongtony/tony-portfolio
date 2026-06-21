import Image from "next/image";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
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

const A = "/portfolio/cloudkitchens";

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design / Motion"],
  ["Platform", "Native / Mobile"],
  ["Timeline", "Aug 2022 — Oct 2023"],
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

export default function CloudKitchensPage() {
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
            src={`${A}/ck-02.jpg`}
            alt="Lutra app dashboard on a phone in a restaurant setting"
            width={2700}
            height={1419}
            priority
            className="h-auto w-full"
          />
        </figure>

        {/* TITLE + OVERVIEW */}
        <section className="pb-12 pt-14 lg:pb-16 lg:pt-20">
          <p className={eyebrowMeta}>Aug 2022 — Oct 2023</p>

          <h1 className="mt-6 max-w-[20ch] text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1] tracking-[-0.03em] text-[var(--cs-heading)] text-balance">
            CloudKitchens — Lutra App
          </h1>

          <div className="mt-12">
            <p className={eyebrowSection}>Overview</p>
            <p className="mt-6 max-w-3xl text-lg leading-[1.5] tracking-[-0.01em] text-[var(--cs-body)]">
              Lutra is the first all-in-one restaurant management solution —
              covering everything from location selection to day-to-day
              operations and performance analysis for merchants.
            </p>
          </div>

          <dl
            className={`mt-10 grid overflow-hidden rounded-[1.25rem] sm:grid-cols-2 lg:grid-cols-4 ${surfaceQuiet}`}
          >
            {projectStats.map(([label, value], i) => (
              <div
                key={label}
                className={`px-6 py-5 ${
                  i > 0 ? "border-t border-[var(--cs-border)] sm:border-t-0" : ""
                } ${i % 2 === 1 ? "sm:border-l sm:border-[var(--cs-border)]" : ""} ${
                  i >= 2
                    ? "sm:border-t sm:border-[var(--cs-border)] lg:border-t-0 lg:border-l lg:border-[var(--cs-border)]"
                    : ""
                } ${i === 1 ? "lg:border-l lg:border-[var(--cs-border)]" : ""} ${
                  i === 3 ? "lg:border-l lg:border-[var(--cs-border)]" : ""
                }`}
              >
                <dt className={eyebrowMeta}>{label}</dt>
                <dd className="mt-3 text-[15px] font-medium leading-6 text-[var(--cs-heading)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Team / credits */}
          <Reveal className="mt-5">
            <ImageFrame
              src={`${A}/ck-03.jpg`}
              alt="Project team — Tony Xing (Lead Product Designer), Yifan and Xinxuan"
              width={4000}
              height={1296}
            />
          </Reveal>

          {/* Feature map */}
          <Reveal className="mt-12">
            <ImageFrame
              src={`${A}/ck-04.jpg`}
              alt="Lutra product map — Core Flow, Order Manager, Analyze and Printer"
              width={4000}
              height={1816}
            />
          </Reveal>
        </section>

        {/* SECTION FLOW */}
        <div className="mt-24 flex flex-col gap-32 lg:mt-28 lg:gap-40">
          {/* BACKGROUND */}
          <CaseSection
            eyebrow="Background"
            title="The potential of Chinese merchants"
          >
            <Reveal className={`mt-8 max-w-3xl flex flex-col gap-7 ${bodyMd}`}>
              <p>
                The Chinese restaurant industry is vast, There are many
                individual merchants and chain stores. Operating in this sector
                poses various challenges, including site selection, data
                analysis, operational strategies, and growth. The average
                business cycle of a new kitchen only survive six months in a
                extremely competitive environment.
              </p>
              <p>
                Our mission is to assist merchants in enhancing their operational
                capabilities, fostering profitability and growth.
              </p>
              <p>
                We initially drove got 200,000 small and medium-sized merchants
                by selling printers. Our goal is to better utilize our merchant
                resources and achieve our mission through our product, thereby
                helping businesses improve their operations.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ck-05.jpg`}
                alt="Lutra brand posters — the first all-in-one dashboard built for restaurants"
                width={3842}
                height={2160}
              />
            </Reveal>
          </CaseSection>

          {/* RESEARCH */}
          <CaseSection eyebrow="Research" title="User Feedback">
            <StaggerGrid className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-3">
              {[
                ["Interview: 30 min", "32 Calls"],
                ["Interview: 30 min", "24 Visits"],
                ["Form: 5 min to finish", "160 Surveys"],
              ].map(([label, value], i) => (
                <StaggerItem key={value} index={i}>
                  <p className={bodySm}>{label}</p>
                  <p className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-none tracking-[-0.03em] text-[var(--cs-heading)]">
                    {value}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGrid>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ck-06.jpg`}
                alt="Field research — merchant photos and verbatim feedback"
                width={4000}
                height={2030}
              />
            </Reveal>

            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/ck-07.jpg`}
                alt="User personas — characteristics of the typical Lutra merchant"
                width={4000}
                height={2000}
              />
            </Reveal>
          </CaseSection>

          {/* IDENTIFY PROBLEMS — yellow sticky-note cards (source #ffe563) */}
          <CaseSection
            eyebrow="Identify problems"
            title="Experience vs. data-informed decisions"
          >
            <Reveal className={`mt-8 max-w-3xl flex flex-col gap-7 ${bodyMd}`}>
              <p>
                Over 70% of merchant terminate their leases annually, and over
                50% of merchants have a monthly order volume of less than 100 in
                China. They entered the catering industry without sufficient
                preparation.
              </p>
              <p>
                We need to improve their data-driven mindset and educate
                merchants group, meanwhile, help them increase their store orders
                and revenue at beginning.
              </p>
            </Reveal>

            <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-3">
              {[
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
              ].map((c, i) => (
                <StaggerItem
                  key={c.title}
                  index={i}
                  className="flex h-full flex-col gap-2.5 rounded-[var(--r-md)] border border-[#d1c70a] bg-[#ffe563] px-6 py-5 text-[#1a1a1a] shadow-[2px_2px_8px_#00000029]"
                >
                  <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em]">
                    {c.title}
                  </h3>
                  <p className="text-sm leading-[1.5] text-[#1a1a1a]/80">
                    {c.body}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>

          {/* HYPOTHESIS — white cards (source #fff) with red #f75757 label */}
          <CaseSection eyebrow="Hypothesis" title="Hypothesis">
            <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-3">
              {[
                {
                  n: 1,
                  body: (
                    <>
                      Providing the{" "}
                      <strong className="font-semibold text-[#1a1a1a]">
                        Coupon Distribution feature
                      </strong>{" "}
                      for new merchants and helping them{" "}
                      <strong className="font-semibold text-[#1a1a1a]">
                        boost their business within a short period.
                      </strong>
                    </>
                  ),
                },
                {
                  n: 2,
                  body: (
                    <>
                      <strong className="font-semibold text-[#1a1a1a]">
                        Develop an AI assistant
                      </strong>{" "}
                      that could guide users through various scenarios, assisting
                      merchants in making fundamental decisions.
                    </>
                  ),
                },
                {
                  n: 3,
                  body: (
                    <>
                      Collect the data from all delivery platforms in a{" "}
                      <strong className="font-semibold text-[#1a1a1a]">
                        central dashboard
                      </strong>
                      . Users don’t need to check data on each platform.
                    </>
                  ),
                },
              ].map((c) => (
                <StaggerItem
                  key={c.n}
                  index={c.n - 1}
                  className="flex h-full flex-col gap-4 rounded-[var(--r-md)] border border-[#e6e6e6] bg-white p-6 text-[#1a1a1a] shadow-[2px_2px_8px_#0000001a]"
                >
                  <GradientTag tone="warm">Hypothesis {c.n}</GradientTag>
                  <p className="text-[15px] leading-[1.5] text-[#1a1a1a]/85">
                    {c.body}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>

          {/* DESIGN PROCESS */}
          <CaseSection
            eyebrow="Design process"
            title="Build an MVP to verify the hypothesis"
          >
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                From this 0-1 project, I worked on many more projects during my
                time at CloudKitchens; if you’re interested, please reach out to
                me.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ck-09.jpg`}
                alt="Lutra — the core product screens"
                width={5942}
                height={2480}
              />
            </Reveal>

            <Reveal className="mt-16 max-w-3xl">
              <SubHeading>Order Booster</SubHeading>
              <div className={`mt-5 flex flex-col gap-5 ${bodyMd}`}>
                <p>
                  The design from Storyboarding, Ideations, Prototyping. After
                  extensive research and experimentation, we arrived at the final
                  design, and we are still iterating based on AB test, user
                  feedback and product research.
                </p>
                <p>
                  The MVP of Order Booster is helping merchants boost store
                  orders and revenue by allowing them to set coupon values before
                  initiating the distribution of coupons.
                </p>
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ck-10.jpg`}
                alt="MVP Order Booster — set coupon value and view distribution results"
                width={4000}
                height={2400}
              />
            </Reveal>

            <Reveal className="mt-16 max-w-3xl">
              <SubHeading>Phased Outcome</SubHeading>
              <ol className={`mt-5 flex list-decimal flex-col gap-3 pl-5 ${bodyMd}`}>
                <li>
                  They{" "}
                  <strong className={emphasis}>don’t come back to review</strong>{" "}
                  and improve their coupon{" "}
                  <strong className={emphasis}>strategy</strong>.
                </li>
                <li>
                  Merchant have no clear concept of how to set the coupon value.
                  The coupons don’t perform well in practical usage.
                </li>
                <li>
                  Our merchant does{" "}
                  <strong className={emphasis}>not believe in the product</strong>
                  , so we need to give users the clue that{" "}
                  <strong className={emphasis}>
                    we are capable of providing all the eaters data
                  </strong>
                  , and the coupons are truly sent to the eaters’ hands.
                </li>
              </ol>
            </Reveal>

            <Reveal className="mt-12 max-w-3xl">
              <SubHeading>Iteration Goals</SubHeading>
              <ol className={`mt-5 flex list-decimal flex-col gap-3 pl-5 ${bodyMd}`}>
                <li>
                  AI Assistant could give user actions on the{" "}
                  <strong className={emphasis}>homepage card</strong>, give them
                  more detailed data for their coupon result and lead the user to
                  change the coupon strategy when the performance is not good.
                  Give them the coupon{" "}
                  <strong className={emphasis}>history comparison</strong> page.
                </li>
                <li>
                  Give the user a list of AI{" "}
                  <strong className={emphasis}>recommendation</strong> coupon
                  values for the user to choose from, give user the opportunity to
                  build several coupons.
                </li>
                <li>
                  We will{" "}
                  <strong className={emphasis}>
                    indicate the locations on the map
                  </strong>{" "}
                  where the coupon goes.
                </li>
              </ol>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ck-11.jpg`}
                alt="Order Booster user flow — from opening the app to checking history"
                width={4952}
                height={1580}
              />
            </Reveal>
            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/ck-12.png`}
                alt="Unsubscribed → Subscribe flow"
                width={3088}
                height={1608}
              />
            </Reveal>
            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/ck-13.png`}
                alt="After subscribed & coupon history"
                width={3086}
                height={1608}
              />
            </Reveal>
          </CaseSection>

          {/* FINAL DESIGN */}
          <CaseSection eyebrow="Final design" title="Final design & Visual craft">
            <Reveal className="mt-8 max-w-3xl">
              <SubHeading>Iterate Goal 1</SubHeading>
              <p className={`mt-5 ${bodyMd}`}>
                AI Assistant could give user actions on the{" "}
                <strong className={emphasis}>homepage card</strong>, give them
                more detailed data for their coupon result and lead the user to
                change the coupon strategy when the performance is not good. Give
                them the coupon{" "}
                <strong className={emphasis}>history comparison</strong> page.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ck-14.jpg`}
                alt="Order Booster states when a new merchant first opens the app"
                width={4000}
                height={3048}
              />
            </Reveal>

            <Reveal className="mt-16 max-w-3xl">
              <SubHeading>Iterate Goal 2</SubHeading>
              <p className={`mt-5 ${bodyMd}`}>
                Give the user a list of AI{" "}
                <strong className={emphasis}>recommendation</strong> coupon values
                for the user to choose from, give user the opportunity to build
                several coupons.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ck-15.jpg`}
                alt="Coupon settings — recommended values and multiple coupons"
                width={4000}
                height={2400}
              />
            </Reveal>
            <Reveal className="mt-12">
              <VideoFrame src={`${A}/ck-16.mp4`} />
            </Reveal>
            <Reveal className="mt-12">
              <VideoFrame src={`${A}/ck-17.mp4`} />
            </Reveal>

            <Reveal className="mt-16 max-w-3xl">
              <SubHeading>Iterate Goal 3</SubHeading>
              <p className={`mt-5 ${bodyMd}`}>
                We will{" "}
                <strong className={emphasis}>
                  indicate the locations on the map
                </strong>{" "}
                where the coupon goes, and provide a central dashboard of their
                coupon data. They don’t need to go back and forth on different
                platforms.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ck-18.jpg`}
                alt="Coupon distribution, history and order list"
                width={4000}
                height={3048}
              />
            </Reveal>

            <Reveal className="mt-12">
              <SubHeading>From business goal</SubHeading>
            </Reveal>
            <ResultGrid items={businessResults} />

            <Reveal className="mt-10">
              <SubHeading>From merchant goal</SubHeading>
            </Reveal>
            <ResultGrid items={merchantResults} />
          </CaseSection>

          {/* OPERATION AUTOMATION */}
          <CaseSection title="Operation Automation">
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                The analysis dashboard encompasses all restaurant data, utilizing
                AI to provide stage-specific recommendations based on each dataset
                for the current merchant’s store. Users can take corresponding
                actions in the analyze sub-features to enhance store ratings. It
                includes various sub-features such as Store Monitor, Review
                Management, Ad Bidding, etc.
              </p>
            </Reveal>

            <StaggerGrid className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              <StaggerItem index={0}>
                <SubHeading>Auto Ad Bidding</SubHeading>
                <p className={`mt-5 ${bodyMd}`}>
                  Assisting users in securing the most cost-effective advertising
                  placements on delivery platforms.
                </p>
              </StaggerItem>
              <StaggerItem index={1}>
                <SubHeading>Lutra AI Assistant</SubHeading>
                <p className={`mt-5 ${bodyMd}`}>
                  Offering store optimization and guidance plans within various
                  features for user.
                </p>
              </StaggerItem>
            </StaggerGrid>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ck-19.jpg`}
                alt="Central dashboard — store info and all delivery-platform data"
                width={4000}
                height={3048}
              />
            </Reveal>
            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/ck-20.jpg`}
                alt="Review management, review analysis and review reply"
                width={4000}
                height={3048}
              />
            </Reveal>
            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/ck-21.jpg`}
                alt="Store monitor, monitor settings and auto ad bidding"
                width={4000}
                height={3048}
              />
            </Reveal>

            <ResultGrid items={assistantResults} cols={4} />
          </CaseSection>

          {/* CORE TABS */}
          <CaseSection title="Core Tabs">
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                Me Tab, Printer, and Orders. Reach out to me if you are
                interested in more details.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ck-22.jpg`}
                alt="Core tabs — Order, Printer and Me"
                width={4000}
                height={3048}
              />
            </Reveal>
          </CaseSection>
        </div>
        <CaseStudyFooter />
      </article>
      <NextSectionButton theme="light" />
    </PortfolioShell>
  );
}
