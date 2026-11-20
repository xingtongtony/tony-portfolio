import type { ReactNode } from "react";
import Image from "next/image";
import { Heart, TrendingUp } from "lucide-react";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import { Board, BoardGallery, type BoardImage } from "../../components/board-viewer";
import { CaseHeader, CaseStudyFooter, Chapter, GradientTag } from "../../components/case-study";
import { eyebrowMeta, bodyMd, bodySm, emphasis } from "../../lib/tokens";

// A white page in the chapter layout (CloudKitchens). The boards carry their
// own light grey (#f4f4f4), so they sit on the white page as panels: rounded,
// no border, and every one opens full screen (BoardGallery). Cards take a
// light grey to sit with them. The goal list was a dark image — a dark band on
// a light page — and is text now. Airbnb red is the accent: #ff385c for
// graphics, #e00b41 for small text (4.9:1 on white, 4.5:1 on the cards).

const A = "/portfolio/airbnb-wishlist";
const AB_RED = "#ff385c";
const AB_ACCENT = "text-[#e00b41]";
const CARD = "rounded-[1.25rem] bg-[#f6f6f6]";

const B = {
  painPoints: { src: `${A}/ab-03.jpg`, alt: "Wishlist pain points — same destination spread across multiple folders, hard to find a listing, no share or delete", width: 2880, height: 1800 },
  flow: { src: `${A}/ab-05.jpg`, alt: "Wishlist flow — like a listing, single- or multi-select, save to list or folder, share and vote", width: 2880, height: 1420 },
  states: { src: `${A}/ab-06.jpg`, alt: "Onboarding wishlist & states — onboarding, loading, empty and saved states", width: 2880, height: 1800 },
  multiSelect: { src: `${A}/ab-07.jpg`, alt: "Multi-select — activated, move to wishlist, success and remove states", width: 2880, height: 1800 },
  filter: { src: `${A}/ab-08.jpg`, alt: "Improving the filter — date, guest and city selectors on the listing cards", width: 2880, height: 1758 },
  topCity: { src: `${A}/ab-09.jpg`, alt: "Top City list — category, filter and city tabs driving users to collect listings and share for booking lift", width: 2880, height: 1800 },
} satisfies Record<string, BoardImage>;

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design"],
  ["Platform", "Native / Mobile"],
];

const problems = [
  {
    title: "Unexpected flow",
    body: "To ‘Save Listing’, users have to create or select a folder, a flow that falls outside user expectations, reducing the efficiency of saving listings.",
  },
  {
    title: "Multiple folders for the same destination",
    body: "Creation of multiple folders for the same destination, such as ‘Tokyo’ and ‘Shinjuku City’.",
  },
  {
    title: "City folder messed up",
    body: "Renaming folders results in the creation of a new city folder when saving accommodations for the same destination.",
  },
  {
    title: "Confused when sharing",
    body: "While folders emphasize inviting friends to collect inspiration together, users feel confused when attempting to share.",
  },
];

// The goal, stage by stage — formerly an image (ab-04), transcribed.
const journey: { stage: string; items: [string, ReactNode][] }[] = [
  {
    stage: "Search",
    items: [
      [
        "Faster Collection",
        <>
          Save listings with just one click on{" "}
          <Heart role="img" aria-label="the heart" className="inline-block size-4 align-[-0.15em]" fill={AB_RED} stroke={AB_RED} />.
        </>,
      ],
    ],
  },
  {
    stage: "Save",
    items: [
      ["Comparison Feature", "Easily compare multiple listings and promotions on a single screen."],
      ["Collaboration Tools", "Share listings quickly and check them effortlessly."],
    ],
  },
  {
    stage: "Decide",
    items: [
      ["Improved Sharing Experience", "Users can share listings directly without using folders or share folders."],
      ["Enhanced Checking Experience", "Check listings directly from WeChat."],
      ["Additional Filters", "Add date and number of guests filters."],
      ["Improved Management Post Collection", "Streamline the management of collected listings."],
    ],
  },
  {
    stage: "Book",
    items: [["Display Discounted Prices", "Clearly present discounted prices."]],
  },
];

const todos = [
  {
    title: "Efficient saving process",
    body: "One click to save favorite listings, moving away from folder-based logic. Folders become separate entities.",
  },
  {
    title: "Enhanced listing cards",
    body: "Easy comparison of property information and efficient filtering. Implement different filters for large quantities of listings: organize by city, time, etc.",
  },
  {
    title: "Improved sharing experience",
    body: "Introduce multi-select sharing without folders. Optimize WeChat viewing through sharing as a mini app. Refine invitation prompts; view the listing without login.",
  },
  {
    title: "Long-term",
    body: "Enable efficient management of saved content with too many favorite listings, including easy deletion and adding to folders.",
  },
  {
    title: "Additional factors",
    body: "Display currently available discounts and promotions based on selected dates to aid users in their decision-making process.",
  },
];

const resultStats = [
  { group: "Native", label: "Wishlist bookings", value: "+2.8%" },
  { group: "Native", label: "Bookings from China", value: "+1.8%" },
  { group: "Mini App", label: "Wishlist bookings", value: "+1.7%" },
  { group: "Mini App", label: "Bookings from China", value: "+1.3%" },
];

const cardTitle = "text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--cs-heading)]";

export default function AirbnbWishlistPage() {
  return (
    <PortfolioShell
      sidebarTheme="light"
      mainClassName="bg-white text-[#171717]"
      contentClassName="min-w-0 bg-white text-[#171717]"
    >
      <BoardGallery boards={Object.values(B)}>
        <article
          data-cs-theme="light"
          className="mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 sm:pt-10 xl:px-14 lg:pb-24 lg:pt-14"
        >
          {/* HERO */}
          <figure className="overflow-hidden rounded-[1.75rem]">
            <Image
              src={`${A}/ab-02.jpg`}
              alt="Localization for Airbnb Wishlist — better manage and bookmark listings for Chinese users"
              width={1800}
              height={1070}
              priority
              className="h-auto w-full"
            />
          </figure>

          <CaseHeader
            date="Aug 2022 — Oct 2023"
            title="Airbnb Wishlist"
            overview="Wishlists help you keep track of all the wonderful things you discover on Airbnb. Simply click or tap the heart on any listing you want to keep top of mind. You’ll have the option to create and name a new wishlist or add it to an existing wishlist."
            facts={projectStats}
          />

          <div className="mt-28 flex flex-col gap-28 sm:gap-36 lg:mt-36 lg:gap-44">
            <Chapter
              id="background"
              n="01"
              eyebrow="Background"
              title="China guests use the Wishlist to book"
              accent={AB_ACCENT}
              intro={
                <p className={bodyMd}>
                  The original intent behind the ‘Wishlist’ feature was to assist users in gathering{" "}
                  <strong className={emphasis}>travel destination inspiration</strong>. However, in practice, China
                  guests prefer using the Wishlist as a tool for making{" "}
                  <strong className={emphasis}>reservation decisions</strong>: collecting multiple preferred
                  accommodations within a destination, comparing, sharing, and eventually completing bookings.
                </p>
              }
            />

            <Chapter
              id="problem"
              n="02"
              eyebrow="Problem"
              title="Folders get in the guests’ way"
              accent={AB_ACCENT}
              intro={
                <p className={bodyMd}>
                  This mismatch between the intended design and user behavior has resulted in several pain points from
                  the guest’s perspective:
                </p>
              }
            >
              <StaggerGrid className="mt-14 grid auto-rows-fr gap-4 sm:grid-cols-2">
                {problems.map((p, i) => (
                  <StaggerItem key={p.title} index={i} className={`flex h-full flex-col gap-3 px-6 py-6 ${CARD}`}>
                    <GradientTag tone="warm">Problem {i + 1}</GradientTag>
                    <h3 className={cardTitle}>{p.title}</h3>
                    <p className={bodySm}>{p.body}</p>
                  </StaggerItem>
                ))}
              </StaggerGrid>
              <Reveal className="mt-12">
                <Board {...B.painPoints} />
              </Reveal>
            </Chapter>

            <Chapter
              id="goal"
              n="03"
              eyebrow="Goal"
              title="Restructure the wishlist end to end"
              accent={AB_ACCENT}
              intro={
                <p className={bodyMd}>
                  From collecting listings to finally completing order payment, completely restructuring the Airbnb
                  wishlist system to better serve local guests.
                </p>
              }
            >
              {/* Search → Save → Decide → Book — formerly an image. */}
              <Reveal className={`mt-14 px-6 py-8 sm:px-10 sm:py-10 ${CARD}`}>
                <ol>
                  {journey.map((s, i) => (
                    <li
                      key={s.stage}
                      className="relative grid gap-3 pb-9 pl-9 last:pb-0 sm:grid-cols-[8rem_1fr] sm:gap-8"
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-[0.45rem] size-3.5 rounded-full border-2 bg-white"
                        style={{ borderColor: AB_RED }}
                      />
                      {i < journey.length - 1 ? (
                        <span aria-hidden className="absolute bottom-1 left-[6.5px] top-[1.6rem] w-px bg-black/15" />
                      ) : null}
                      <p className="text-lg font-semibold leading-7 tracking-[-0.01em] text-[var(--cs-heading)]">
                        {s.stage}
                      </p>
                      <ul className="flex flex-col gap-3 sm:pt-0.5">
                        {s.items.map(([label, text]) => (
                          <li key={label} className={bodyMd}>
                            <strong className={emphasis}>{label}:</strong> {text}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </Chapter>

            <Chapter id="how" n="04" eyebrow="How to do it?" title="Five to-dos to get there" accent={AB_ACCENT}>
              <StaggerGrid className="mt-14 grid auto-rows-fr gap-4 sm:grid-cols-2 min-[1180px]:grid-cols-3">
                {todos.map((t, i) => (
                  <StaggerItem key={t.title} index={i} className={`flex h-full flex-col gap-3 px-6 py-6 ${CARD}`}>
                    <GradientTag tone="cool">To-do {i + 1}</GradientTag>
                    <h3 className={cardTitle}>{t.title}</h3>
                    <p className={bodySm}>{t.body}</p>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>

            <Chapter
              id="design-process"
              n="05"
              eyebrow="Design process"
              title="One flow from collecting to voting"
              accent={AB_ACCENT}
              intro={
                <div className={`flex flex-col gap-5 ${bodyMd}`}>
                  <p>
                    All the listings, experiences, stories, host listings, and city ranks can be collected in the
                    wishlist and list folders. This is a basic flow of how the wishlist works from collecting to voting.
                  </p>
                  <p>
                    From Empathize, Define, Ideate, to Final Deliver, and Test the design, we have been through the whole
                    design process to achieve the goal.
                  </p>
                </div>
              }
            >
              <div className="mt-14 flex flex-col gap-12">
                {[B.flow, B.states, B.multiSelect, B.filter].map((board) => (
                  <Reveal key={board.src}>
                    <Board {...board} />
                  </Reveal>
                ))}
              </div>
            </Chapter>

            <Chapter
              id="result"
              n="06"
              eyebrow="Result"
              title="Bookings rose in both apps"
              accent={AB_ACCENT}
              intro={
                <p className={bodyMd}>
                  We released the new designs in phases. For confidentiality purposes, I’ve excluded the specific values
                  associated with these metrics. The result is actually fascinating. There has been a significant
                  increase in data for both the native app and mini app.
                </p>
              }
            >
              {/* One panel, one type scale; an arrow marks a rise. */}
              <StaggerGrid className="mt-14 grid gap-px overflow-hidden rounded-[1.25rem] bg-black/[0.05] sm:grid-cols-2 lg:grid-cols-4">
                {resultStats.map((s, i) => (
                  <StaggerItem key={s.group + s.label} index={i} className="@container bg-[#f6f6f6] px-6 py-7">
                    <p className={eyebrowMeta}>{s.group}</p>
                    <p className="mt-4 flex items-center gap-2 whitespace-nowrap text-[clamp(1.75rem,19cqw,3.5rem)] font-medium leading-none tracking-[-0.04em] text-[var(--cs-heading)]">
                      {s.value}
                      <TrendingUp aria-hidden className="size-6 shrink-0" style={{ color: AB_RED }} strokeWidth={2.5} />
                    </p>
                    <p className={`mt-3 ${bodySm}`}>{s.label}</p>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>

            <Chapter
              id="long-term"
              n="07"
              eyebrow="Long-term"
              title="Next: lists for cities and hosts"
              accent={AB_ACCENT}
              intro={
                <p className={bodyMd}>
                  For our long-term goals, we plan to create a Top City list, host storefronts, etc., aiming to enhance
                  the experience for users interested in specific hosts or cities. Additionally, we aim to encourage
                  users to share listings on third-party social communication platforms.
                </p>
              }
            >
              <Reveal className="mt-14">
                <Board {...B.topCity} />
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
