import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { ScrollThemeShell } from "../../components/scroll-theme-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { Board, BoardGallery, type BoardImage } from "../../components/board-viewer";
import {
  CaseHeader,
  CaseStudyFooter,
  Chapter,
  SubHeading,
  SubPair,
  WIDE_GRID,
  WIDE_LEFT,
  WIDE_RIGHT,
} from "../../components/case-study";
import { TT_ACCENT, TT_RED } from "../../lib/tiktok-tv";
import { eyebrowMeta, surfaceDefault, bodyMd, bodySm, emphasis } from "../../lib/tokens";

// A dark page in the chapter layout (CloudKitchens / TikTok TV). The run of
// white boards — the two basic rules, the tracking and wiki docs and the
// component gallery (chapters 03–06) — is ONE data-light-zone: the whole page
// turns light while it is on screen and dark again after it (Tony's call).
// Boards whose own background is white are `framed` there. Every board opens
// full screen (BoardGallery); TikTok red is the accent, as on the TV pages.

const A = "/portfolio/tiktok-design-system";

const B = {
  library: { src: `${A}/ds-03.jpg`, alt: "WebApp component library — the full set of TikTok WebApp components", width: 2880, height: 1800 },
  variants: { src: `${A}/ds-07.jpg`, alt: "Build with variants — find and switch components in the variants panel", width: 1720, height: 1800 },
  adaptive: { src: `${A}/ds-08.jpg`, alt: "Adaptive components that stay responsive across device sizes", width: 1720, height: 1800 },
  tracking: { src: `${A}/ds-09.jpg`, alt: "Components tracking doc — design status, priority, wiki and development status", width: 1534, height: 850 },
  docs: { src: `${A}/ds-10.jpg`, alt: "Per-component documentation — Anatomy, Type, Layout, Motion", width: 1534, height: 850 },
  motionGuide: { src: `${A}/ds-31.jpg`, alt: "TikTok Motion Guide — cubic easing curves and duration tokens", width: 2880, height: 1800 },
  motionSpecs: { src: `${A}/ds-32.jpg`, alt: "Motion guidelines — duration, curve and position for each component", width: 2346, height: 2500 },
} satisfies Record<string, BoardImage>;

// The component sheets in the gallery (all 1662×2048), named by their own titles.
const gallery: BoardImage[] = (
  [
    [11, "Buttons"],
    [12, "Avatar"],
    [13, "Dropdown"],
    [14, "Tooltip"],
    [15, "Tabs"],
    [16, "Video player"],
    [17, "LIVE player"],
    [18, "Comments"],
    [19, "Datepicker"],
    [20, "Text field"],
    [21, "Select"],
    [22, "Radio & CheckBox & Switch"],
    [23, "Upload"],
    [24, "Toast & Notification & Banner"],
    [25, "Table"],
    [26, "Badge"],
    [27, "Side navigation & Header"],
    [28, "Skeleton & Loading"],
    [29, "Search"],
  ] as const
).map(([n, name]) => ({ src: `${A}/ds-${n}.jpg`, alt: `Component sheet — ${name}`, width: 1662, height: 2048 }));

const BOARDS: BoardImage[] = [B.library, B.variants, B.adaptive, B.tracking, B.docs, ...gallery, B.motionGuide, B.motionSpecs];

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "Design system / Visual design"],
  ["Platform", "Cross-platform"],
];

// Formerly an image (ds-05): the teams the design system serves.
const teams = ["Live Stream ToC", "Live Stream ToB", "Commercialization", "Core Product"];

// Formerly an image (ds-06): the roadmap, on an eight-column timeline. On a
// phone the bars are full width and a small track under each shows its span.
const roadmap = [
  { title: "Redesign the Structure", items: "Feed structure, Browser mode", span: "sm:col-start-1 sm:col-span-4", track: "col-start-1 col-span-4" },
  { title: "Responsive Design", items: "Responsive for Videos, Responsive for pages", span: "sm:col-start-3 sm:col-span-4", track: "col-start-3 col-span-4" },
  { title: "TikTok Live Stream", items: "Live stream, Live setting up, Live home", span: "sm:col-start-5 sm:col-span-4", track: "col-start-5 col-span-4" },
  { title: "TikTok WebApp Components Building", items: "Components doc, Components responsive, Motion principle", span: "sm:col-start-1 sm:col-span-8", track: "col-start-1 col-span-8" },
];

// Formerly an image (ds-04).
const parts = ["Build with Variants", "Adaptive component", "Design principle doc", "Motion guide rules"];

// The two design principle docs; their structure was an image (ds-30).
const principleDocs = [
  {
    title: "Haptic Touch",
    body: "Establishing the principles of iOS & Android Haptic Effects. Engineers can directly incorporate effects when our designers designate the specific haptic variant name in their designs prior to shipping.",
    fields: ["Type", "TimeMs", "Amplitude", "Description"],
    outcome: "Select the right Haptic",
  },
  {
    title: "Components Wiki",
    body: "Organized all component interaction documents, including extreme cases, while collaborating closely with engineers.",
    fields: ["Anatomy", "Type", "Layout", "Interaction", "Motion"],
    outcome: "Select the right component",
  },
];

const motionGuidelines = [
  [
    "Easy to manipulate",
    "How the components interact and enter or exit the page is up to each product team to implement. Use this guidance to customize, combine, coordinate, and choreograph this aspect of motion in the UI.",
  ],
  [
    "Principles to guide designers",
    "We also support other requests when designers have built a new component that needs motion added to it. The curve and duration principle will help them make the decisions.",
  ],
];

const benefits = [
  "Less time spent on coding new components.",
  "Handoff is a lot more efficient (less explanation needed to describe elements).",
  "Less back and forth during QA.",
  "Coded design is a lot more consistent.",
];

// The closing recap: facts from the chapters above, nothing new.
const recap = [
  ["Teams", "LIVE (to C), LIVE (to B), commercialization and core product UX"],
  ["Basic rules", "Built with variants, responsive on any size of device"],
  ["Docs", "One doc per component — Anatomy, Type, Layout, Motion — and one tracking doc"],
  ["Motion", "Haptic variants, plus curve and duration principles"],
  ["Workflow", "Code-to-design with UXPin Merge"],
];

const line = "bg-[var(--cs-body-sm)] opacity-40";
const pill = "rounded-full bg-[var(--cs-surface-2)] text-[var(--cs-lead)]";

export default function TikTokDesignSystemPage() {
  return (
    <ScrollThemeShell>
      <BoardGallery boards={BOARDS}>
        <article className="mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 sm:pt-10 xl:px-14 lg:pb-24 lg:pt-14">
          {/* HERO */}
          <figure className="overflow-hidden rounded-[1.75rem]">
            <Image
              src={`${A}/ds-02.jpg`}
              alt="TikTok WebApp design system — component library overview"
              width={2700}
              height={1602}
              priority
              className="h-auto w-full"
            />
          </figure>

          <CaseHeader
            date="Jul 2020 — Apr 2021"
            title="TikTok Design System"
            overview="The TikTok WebApp Design System is supporting the central design team, which includes the LIVE design team (to C), LIVE design team (to B), commercialization design team, Core product UX team, etc."
            facts={projectStats}
          />

          <div className="mt-28 flex flex-col gap-28 sm:gap-36 lg:mt-36 lg:gap-44">
            <Chapter
              id="scope"
              n="01"
              eyebrow="Scope"
              title="One system for many teams"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  The TikTok Design System supports multiple teams and boasts a sophisticated workflow catering to their
                  needs.
                </p>
              }
            >
              {/* The teams it serves — formerly an image. */}
              <Reveal className={`mt-14 rounded-[1.25rem] px-5 py-8 sm:px-8 sm:py-10 ${surfaceDefault}`}>
                <div className="mx-auto max-w-[46rem]">
                  <p className="mx-auto w-fit rounded-full border border-[#fe2c55]/60 px-5 py-2.5 text-center text-[15px] font-medium text-[var(--cs-heading)]">
                    TikTok Design System
                  </p>
                  <div aria-hidden className="relative hidden h-7 sm:block">
                    <span className={`absolute left-1/2 top-0 h-full w-px ${line}`} />
                    <span className={`absolute bottom-0 left-[12.5%] right-[12.5%] h-px ${line}`} />
                  </div>
                  <ArrowDown aria-hidden className="mx-auto my-3 size-4 sm:hidden" style={{ color: TT_RED }} strokeWidth={2.25} />
                  <ul className="grid gap-2 sm:grid-cols-4 sm:gap-0">
                    {teams.map((team) => (
                      <li key={team} className="relative sm:px-1.5 sm:pt-7">
                        <span aria-hidden className={`absolute left-1/2 top-0 hidden h-7 w-px sm:block ${line}`} />
                        <p className={`flex h-full items-center justify-center px-3 py-2.5 text-center text-[14px] font-medium leading-5 ${pill}`}>
                          {team}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* The roadmap — formerly an image. */}
              <Reveal className={`mt-4 rounded-[1.25rem] px-4 py-6 sm:px-8 sm:py-8 ${surfaceDefault}`}>
                <p className={eyebrowMeta}>Roadmap</p>
                <ol
                  aria-label="Roadmap"
                  className="mt-5 grid gap-y-3 sm:grid-cols-8 sm:border-r sm:border-[var(--cs-border-2)] sm:py-2 sm:[background-image:linear-gradient(to_right,var(--cs-border-2)_1px,transparent_1px)] sm:[background-size:12.5%_100%]"
                >
                  {roadmap.map((row) => (
                    <li
                      key={row.title}
                      className={`${row.span} rounded-[0.875rem] border border-[var(--cs-border-2)] bg-[var(--cs-surface-2)] px-4 py-3.5 sm:mx-1.5`}
                    >
                      <p className="text-[15px] font-semibold leading-5 text-[var(--cs-heading)]">{row.title}</p>
                      <p className={`mt-1 ${bodySm}`}>{row.items}</p>
                      <span aria-hidden className="mt-3 grid h-1 grid-cols-8 overflow-hidden rounded-full bg-[var(--cs-border-2)] sm:hidden">
                        <span className={`${row.track} rounded-full`} style={{ background: TT_RED }} />
                      </span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </Chapter>

            <Chapter
              id="lifecycle"
              n="02"
              eyebrow="Development process"
              title="Components have a long lifecycle"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  To ensure the well-organized development of the design system, our designers must undergo the entire
                  component design process, starting from scope definition to component testing, usability testing,
                  further documentation, and usability validation. Components usually have a long lifecycle within a
                  design team.
                </p>
              }
            >
              <Reveal className="mt-14">
                <Board {...B.library} />
              </Reveal>

              {/* The four parts — formerly an image. */}
              <Reveal className={`mt-16 ${WIDE_GRID}`}>
                <p className={`${WIDE_LEFT} ${bodyMd}`}>Four parts of the system are covered below.</p>
                <ol className={`${WIDE_RIGHT} border-t border-[var(--cs-border-2)]`}>
                  {parts.map((part, i) => (
                    <li key={part} className="flex items-baseline gap-5 border-b border-[var(--cs-border-2)] py-4">
                      <span aria-hidden className={`text-xs font-semibold tabular-nums ${TT_ACCENT}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xl font-medium tracking-[-0.02em] text-[var(--cs-heading)]">{part}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </Chapter>

            {/* ===== LIGHT RUN — one zone, chapters 03–06 ===== */}
            <div data-light-zone className="flex flex-col gap-28 sm:gap-36 lg:gap-44">
              <Chapter id="variants" n="03" eyebrow="Basic rules" title="Build with variants" accent={TT_ACCENT}>
                <Reveal className={`mt-12 ${WIDE_GRID} min-[1180px]:items-start`}>
                  <div className={`flex flex-col gap-8 ${WIDE_LEFT}`}>
                    <div>
                      <SubHeading>Easier to find the components</SubHeading>
                      <p className={`mt-4 ${bodyMd}`}>
                        Designers could find the components just in the variants and switch the same component faster and
                        easier.
                      </p>
                    </div>
                    <div>
                      <SubHeading>Efficient to manage the components</SubHeading>
                      <p className={`mt-4 ${bodyMd}`}>
                        It will automatically revise components in all screens if designers are using the master component.
                      </p>
                    </div>
                  </div>
                  <div className={WIDE_RIGHT}>
                    <Board {...B.variants} framed />
                  </div>
                </Reveal>
              </Chapter>

              <Chapter id="adaptive" n="04" eyebrow="Basic rules" title="Adaptive components fit any device" accent={TT_ACCENT}>
                <Reveal className={`mt-12 ${WIDE_GRID} min-[1180px]:items-start`}>
                  <div className={WIDE_LEFT}>
                    <SubHeading>Adjustable and responsive</SubHeading>
                    <p className={`mt-4 ${bodyMd}`}>
                      The WebApp components should be responsive on any size of device. Designers don’t need to change the
                      entire component.
                    </p>
                  </div>
                  <div className={WIDE_RIGHT}>
                    <Board {...B.adaptive} framed />
                  </div>
                </Reveal>
              </Chapter>

              <Chapter
                id="tracking"
                n="05"
                eyebrow="Process"
                title="Tracking keeps both teams informed"
                accent={TT_ACCENT}
                intro={
                  <div className={`flex flex-col gap-5 ${bodyMd}`}>
                    <p>To track the whole design system process is also a part of the work we do.</p>
                    <p>
                      The tracking doc includes design status, priority, design wiki, and development status. The
                      components tracking doc is helping the design team and front-end engineering team to have better
                      knowledge about the whole design system process.
                    </p>
                  </div>
                }
              >
                <Reveal className="mt-14">
                  <Board {...B.tracking} />
                </Reveal>
                <SubPair title="Every doc follows a similar structure" className="mt-20">
                  <p>
                    Each component will have its own documentation to help our designers better understand all the
                    components. The documentation has a pretty similar structure: Anatomy, Type (size, functionality,
                    interactions), Layout, and Motion.
                  </p>
                </SubPair>
                <Reveal className="mt-10">
                  <Board {...B.docs} />
                </Reveal>
              </Chapter>

              <Chapter
                id="components"
                n="06"
                eyebrow="Design file"
                title="Keeping it simple yet scalable"
                accent={TT_ACCENT}
                intro={
                  <p className={bodyMd}>
                    We’ve built 32 different components, all designed with responsive and adaptive rules, ensuring
                    compatibility across various devices and viewport sizes.
                  </p>
                }
              >
                {/* An endless row of the component sheets, fading on the left
                    edge only. Each sheet opens full screen; the row pauses
                    under the pointer or keyboard focus. The second copy is
                    there only for the loop, so it is inert. Spacing is padding,
                    not gap, so -50% lands exactly one copy along. */}
                <div className="marquee-fade-left -mx-6 mt-14 overflow-hidden sm:-mx-10 xl:-mx-14">
                  <ul
                    className="marquee-track flex w-max hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
                    style={{ animationDuration: "90s" }}
                  >
                    {[...gallery, ...gallery].map((board, i) => {
                      const copy = i >= gallery.length;
                      return (
                        <li key={i} className="w-[260px] shrink-0 pr-5 sm:w-[345px]" inert={copy || undefined} aria-hidden={copy || undefined}>
                          <Board {...board} framed />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Chapter>
            </div>
            {/* ===== END LIGHT RUN ===== */}

            <Chapter
              id="motion"
              n="07"
              eyebrow="Motion"
              title="Give the components emotions"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  Haptic feedback can be defined as the “
                  <strong className={emphasis}>
                    use of the sense of touch in a user interface design to provide information to an end user
                  </strong>
                  ,” one of the most understudied fields in user experience. As our everyday device interactions shift
                  from keyboard+mouse to phones, combining haptic touch with interactive motion can offer users a wider
                  range of emotional expression.
                </p>
              }
            >
              {/* Design principle doc: each doc's structure was an image (ds-30). */}
              <div className="mt-20">
                <Reveal>
                  <SubHeading>Design principle doc</SubHeading>
                </Reveal>
                <StaggerGrid className="mt-6 grid auto-rows-fr gap-4 sm:grid-cols-2">
                  {principleDocs.map((doc, i) => (
                    <StaggerItem key={doc.title} index={i} className={`flex h-full flex-col rounded-[1.25rem] p-6 sm:p-7 ${surfaceDefault}`}>
                      <h4 className="text-base font-semibold tracking-[-0.01em] text-[var(--cs-heading)]">{doc.title}</h4>
                      <p className={`mt-3 ${bodyMd}`}>{doc.body}</p>
                      <div className="mt-auto pt-8">
                        <ul className="flex flex-wrap gap-2">
                          {doc.fields.map((field) => (
                            <li key={field} className={`px-3 py-1.5 text-[13px] font-medium leading-5 ${pill}`}>
                              {field}
                            </li>
                          ))}
                        </ul>
                        <ArrowDown aria-hidden className="my-2.5 ml-3 size-4" style={{ color: TT_RED }} strokeWidth={2.25} />
                        <p className="w-fit rounded-full border border-[#fe2c55]/60 px-3.5 py-1.5 text-[13px] font-medium leading-5 text-[var(--cs-heading)]">
                          {doc.outcome}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>

              <SubPair title="Motion guide rules" className="mt-20">
                <p>
                  The TikTok motion system comprises transition patterns designed to assist users in comprehending and
                  navigating through the TikTok app.
                </p>
              </SubPair>
              <Reveal className="mt-10">
                <Board {...B.motionGuide} />
              </Reveal>

              <Reveal className={`mt-20 ${WIDE_GRID} min-[1180px]:items-start`}>
                <div className={WIDE_LEFT}>
                  <SubHeading>Motion guidelines for components</SubHeading>
                  <div className="mt-6 flex flex-col gap-6">
                    {motionGuidelines.map(([title, body]) => (
                      <div key={title}>
                        <h4 className="text-base font-semibold tracking-[-0.01em] text-[var(--cs-heading)]">{title}</h4>
                        <p className={`mt-2 ${bodyMd}`}>{body}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={WIDE_RIGHT}>
                  <Board {...B.motionSpecs} />
                </div>
              </Reveal>
            </Chapter>

            <Chapter
              id="testing"
              n="08"
              eyebrow="Testing"
              title="Code-to-design cuts time and errors"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  <strong className={emphasis}>Create a single source of truth</strong>, reduce operation burdens, and
                  minimize errors with a code-to-design design system workflow from UXPin Merge.
                </p>
              }
            >
              <StaggerGrid className="mt-14 grid auto-rows-fr gap-3 sm:grid-cols-2">
                {benefits.map((benefit, i) => (
                  <StaggerItem key={benefit} index={i} className={`flex h-full gap-4 rounded-[1.25rem] px-5 py-5 ${surfaceDefault}`}>
                    <span aria-hidden className={`text-xs font-semibold tabular-nums leading-6 ${TT_ACCENT}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[15px] leading-6 text-[var(--cs-heading)]">{benefit}</p>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Chapter>

            <Chapter id="recap" n="09" eyebrow="Recap" title="32 components, one source of truth" accent={TT_ACCENT}>
              <Reveal className={`mt-12 grid gap-8 rounded-[1.25rem] p-6 sm:p-8 min-[1180px]:grid-cols-12 min-[1180px]:gap-10 ${surfaceDefault}`}>
                <div className="min-[1180px]:col-span-4">
                  <p className={eyebrowMeta}>Components</p>
                  <p className="mt-4 whitespace-nowrap text-[3.5rem] font-medium leading-none tracking-[-0.04em] text-[var(--cs-heading)]">
                    32
                  </p>
                  <p className={`mt-3 max-w-[30ch] ${bodySm}`}>Responsive and adaptive across devices and viewport sizes.</p>
                </div>
                <dl className="border-t border-[var(--cs-border-2)] min-[1180px]:col-span-8">
                  {recap.map(([label, value]) => (
                    <div key={label} className="grid gap-1 border-b border-[var(--cs-border-2)] py-3.5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                      <dt className={`${eyebrowMeta} sm:pt-1`}>{label}</dt>
                      <dd className="text-[15px] leading-6 text-[var(--cs-heading)]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </Chapter>
          </div>
          <CaseStudyFooter />
        </article>
      </BoardGallery>
    </ScrollThemeShell>
  );
}
