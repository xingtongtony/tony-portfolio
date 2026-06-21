import Image from "next/image";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import {
  CaseSection,
  ImageFrame,
  GradientTag,
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

const A = "/portfolio/airbnb-wishlist";

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design"],
  ["Platform", "Native / Mobile"],
];

const problems = [
  {
    n: "Problem 1",
    title: "Unexpected flow",
    body: "‘Save Listing’ have to create or select a folder, a flow that falls beyond user expectations, reducing the efficiency of saving listing.",
  },
  {
    n: "Problem 2",
    title: "Multiple folders for same destination",
    body: "Creation of multiple folders for the same destination, such as ‘Tokyo’ and ‘Shinjuku City’.",
  },
  {
    n: "Problem 3",
    title: "City folder messed up",
    body: "Renaming folders results in the creation of a new city folder when saving accommodations for the same destination.",
  },
  {
    n: "Problem 4",
    title: "Confused when share",
    body: "While folders emphasize inviting friends to collect inspiration together, users feel confused when attempting to share.",
  },
];

const todos = [
  {
    n: "To-do 1",
    title: "Efficient Saving Process",
    body: "One-click to save favorites listings, moving away from folder-based logic. Folders become separate entities.",
  },
  {
    n: "To-do 2",
    title: "Enhanced Listing Cards",
    body: "Easy comparison of property information and efficient filtering. Implement different filters for large quantities of listings: organize by city, time etc.",
  },
  {
    n: "To-do 3",
    title: "Improved Sharing Experience",
    body: "Introduce multi-select sharing without folders. Optimize WeChat viewing through sharing as a mini-app. Refining invitation prompts; View the listing without login.",
  },
  {
    n: "To-do 4",
    title: "Long-term",
    body: "Enable efficient management of saved content with too many favorites listing, including easy deletion and add into folders.",
  },
  {
    n: "To-do 5",
    title: "Additional Factors",
    body: "Display current available discounts and promotions based on selected dates to aid users in their decision-making process.",
  },
];

const resultStats = [
  { group: "Native", label: "Wishlist bookings", value: "+2.8%" },
  { group: "Native", label: "Bookings from China", value: "+1.8%" },
  { group: "Mini App", label: "Wishlist bookings", value: "+1.7%" },
  { group: "Mini App", label: "Bookings from China", value: "+1.3%" },
];

export default function AirbnbWishlistPage() {
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
            src={`${A}/ab-02.jpg`}
            alt="Localization for Airbnb Wishlist — better manage and bookmark listings for Chinese users"
            width={1800}
            height={1070}
            priority
            className="h-auto w-full"
          />
        </figure>

        {/* TITLE + OVERVIEW */}
        <section className="pb-12 pt-14 lg:pb-16 lg:pt-20">
          <p className={eyebrowMeta}>Aug 2022 - Oct 2023</p>

          <h1 className="mt-6 max-w-[20ch] text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1] tracking-[-0.03em] text-[var(--cs-heading)] text-balance">
            Airbnb Wishlist
          </h1>

          <div className="mt-12">
            <p className={eyebrowSection}>Overview</p>
            <p className="mt-6 max-w-3xl text-lg leading-[1.5] tracking-[-0.01em] text-[var(--cs-body)]">
              Wishlist help you keep track of all the wonderful things you
              discover on Airbnb. Simply click or tap the heart on any listing
              you want to keep top of mind. You’ll have the option to create and
              name a new wishlist or add it to an existing wishlist.
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
        </section>

        {/* SECTION FLOW */}
        <div className="mt-24 flex flex-col gap-32 lg:mt-28 lg:gap-40">
          {/* BACKGROUND */}
          <CaseSection eyebrow="Background" title="User’s Regional Differences">
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                The original intent behind the ‘Wishlist’ feature was to assist
                users in gathering{" "}
                <strong className={emphasis}>
                  travel destination inspiration
                </strong>
                . However, in practice, China guests prefer using the Wishlist
                as a tool for making{" "}
                <strong className={emphasis}>reservation decisions</strong>:
                collecting multiple preferred accommodations within a
                destination, comparing, sharing, and eventually completing
                bookings.
              </p>
            </Reveal>
          </CaseSection>

          {/* PROBLEM */}
          <CaseSection eyebrow="Problem" title="Mismatched intention">
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                This mismatch between the intended design and user behavior has
                resulted in several pain points from the guest’s perspective:
              </p>
            </Reveal>

            <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-3">
              {problems.map((p, i) => (
                <StaggerItem
                  key={p.n}
                  index={i}
                  className={`rounded-[var(--r-md)] border border-[var(--cs-border-2)] px-6 py-5 ${surfaceQuiet}`}
                >
                  <GradientTag tone="warm">{p.n}</GradientTag>
                  <h3 className="mt-3 text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--cs-heading)]">
                    {p.title}
                  </h3>
                  <p className={`mt-2 ${bodySm}`}>{p.body}</p>
                </StaggerItem>
              ))}
            </StaggerGrid>

            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/ab-03.jpg`}
                alt="Wishlist pain points — same destination spread across multiple folders, hard to find a listing, no share or delete"
                width={2880}
                height={1800}
              />
            </Reveal>
          </CaseSection>

          {/* GOAL */}
          <CaseSection eyebrow="Goal" title="End to end sharing improvement">
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                From collecting Listings to final completing orders payment,
                completely restructuring the Airbnb wishlist system to better
                serve local guest.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ab-04.jpg`}
                alt="Goal flow — Search, Save, Decide and Book, each with its supporting improvements"
                width={2880}
                height={1800}
              />
            </Reveal>

            <Reveal className="mt-12">
              <p className={eyebrowSection}>How to do it?</p>
            </Reveal>
            <StaggerGrid className="mt-8 grid gap-5 sm:grid-cols-3">
              {todos.map((t, i) => (
                <StaggerItem
                  key={t.n}
                  index={i}
                  className={`rounded-[var(--r-md)] border border-[var(--cs-border-2)] px-6 py-5 ${surfaceQuiet}`}
                >
                  <GradientTag tone="cool">{t.n}</GradientTag>
                  <h3 className="mt-3 text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--cs-heading)]">
                    {t.title}
                  </h3>
                  <p className={`mt-2 ${bodySm}`}>{t.body}</p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>

          {/* DESIGN PROCESS */}
          <CaseSection eyebrow="Design process" title="Job to be done">
            <Reveal className={`mt-8 max-w-3xl flex flex-col gap-5 ${bodyMd}`}>
              <p>
                All the listing, experience, story, host listing, and city ranks
                can be collected in the wishlist and list folders. This is a
                basic flow of how wishlist works from collecting to voting.
              </p>
              <p>
                From Empathize, Define, Ideate, to Final Deliver, and Test the
                design we have been through all the design process to achieve the
                goal.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ab-05.jpg`}
                alt="Wishlist flow — like a listing, single- or multi-select, save to list or folder, share and vote"
                width={2880}
                height={1420}
              />
            </Reveal>
            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/ab-06.jpg`}
                alt="Onboarding wishlist & states — onboarding, loading, empty and saved states"
                width={2880}
                height={1800}
              />
            </Reveal>
            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/ab-07.jpg`}
                alt="Multi-select — activated, move to wishlist, success and remove states"
                width={2880}
                height={1800}
              />
            </Reveal>
            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/ab-08.jpg`}
                alt="Improving the filter — date, guest and city selectors on the listing cards"
                width={2880}
                height={1758}
              />
            </Reveal>
          </CaseSection>

          {/* TOP CITY LIST */}
          <CaseSection eyebrow="Long-term" title="Top city list">
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                For our long-term goals, we plan to create a Top City list, host
                storefronts, etc., aiming to enhance the experience for users
                interested in specific hosts or cities. Additionally, we aim to
                encourage users to share listings on third-party social
                communication platforms.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ab-09.jpg`}
                alt="Top city list — category, filter and city tabs driving users to collect listings and share for booking lift"
                width={2880}
                height={1800}
              />
            </Reveal>
          </CaseSection>

          {/* RESULT */}
          <CaseSection eyebrow="Result" title="The result">
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                We released the new designs in phases. For confidentiality
                purposes, I’ve excluded the specific values associated with these
                metrics. The result is actually fascinating. There has been a
                significant increase in data for both the native app and mini
                app.
              </p>
            </Reveal>

            <StaggerGrid className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {resultStats.map((s, i) => (
                <StaggerItem key={s.group + s.label} index={i}>
                  <p className={eyebrowMeta}>{s.group}</p>
                  <p className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-none tracking-[-0.03em] text-[var(--cs-heading)]">
                    {s.value}
                  </p>
                  <p className={`mt-2 ${bodySm}`}>{s.label}</p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </CaseSection>
        </div>

        <CaseStudyFooter />
      </article>
      <NextSectionButton theme="light" />
    </PortfolioShell>
  );
}
