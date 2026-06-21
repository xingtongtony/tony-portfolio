import Image from "next/image";
import { ScrollThemeShell } from "../../components/scroll-theme-shell";
import { Reveal } from "../../components/motion";
import {
  CaseSection,
  SubHeading,
  ImageFrame,
  CaseStudyFooter,
} from "../../components/case-study";
import {
  eyebrowSection,
  eyebrowMeta,
  surfaceQuiet,
  bodyMd,
  emphasis,
} from "../../lib/tokens";

const A = "/portfolio/tiktok-design-system";

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "Design system / Visual design"],
  ["Platform", "Cross platform"],
];

// The "32 components" showcase — component spec sheets (all 1662×2048).
const gallery = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];

const sectionTitle =
  "max-w-4xl text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-[var(--cs-heading)] sm:text-4xl";

export default function TikTokDesignSystemPage() {
  return (
    <ScrollThemeShell>
      <article className="mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 lg:px-14 lg:pb-24 lg:pt-14">
        {/* HERO */}
        <figure className="overflow-hidden rounded-[1.75rem] border border-[var(--cs-border)]">
          <Image
            src={`${A}/ds-02.jpg`}
            alt="TikTok WebApp design system — component library overview"
            width={2700}
            height={1602}
            priority
            className="h-auto w-full"
          />
        </figure>

        {/* TITLE + OVERVIEW */}
        <section className="pb-12 pt-14 lg:pb-16 lg:pt-20">
          <p className={eyebrowMeta}>Jul 2020 - Apr 2021</p>
          <h1 className="mt-6 max-w-[20ch] text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1] tracking-[-0.03em] text-[var(--cs-heading)] text-balance">
            TikTok Design System
          </h1>

          <div className="mt-12">
            <p className={eyebrowSection}>Overview</p>
            <p className="mt-6 max-w-3xl text-lg leading-[1.5] tracking-[-0.01em] text-[var(--cs-body)]">
              TikTok WebApp Design system is supporting central design team which
              including the LIVE design team (to C), LIVE design team (to B),
              commercialization design team, Core product UX team etc.
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

        {/* ===== DARK INTRO ===== */}
        <div className="mt-24 flex flex-col gap-32 lg:mt-28 lg:gap-40">
          <CaseSection eyebrow="Context" title="The Lifecycle of an Element">
            <Reveal className="mt-8 max-w-3xl">
              <SubHeading>A typical development process</SubHeading>
              <p className={`mt-5 ${bodyMd}`}>
                To ensure the well-organized development of the design system,
                our designers must undergo the entire component design process,
                starting from scope definition to component testing, usability
                testing, further documentation, and usability validation.
                Components usually have a long lifecycle within a design team.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ds-03.jpg`}
                alt="WebApp component library — the full set of TikTok WebApp components"
                width={2880}
                height={1800}
              />
            </Reveal>
            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/ds-04.jpg`}
                alt="Design-system deliverables — Build with Variants, Adaptive component, Design principle doc, Motion guide rules"
                width={2880}
                height={1800}
              />
            </Reveal>

            <Reveal className="mt-16 max-w-3xl">
              <SubHeading>Design system scope</SubHeading>
              <p className={`mt-5 ${bodyMd}`}>
                The TikTok Design System supports multiple teams and boasts a
                sophisticated workflow catering to their needs.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ds-05.jpg`}
                alt="Design-system scope — LIVE stream (ToB / ToC), commercialization and core product"
                width={2400}
                height={1200}
              />
            </Reveal>
            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/ds-06.png`}
                alt="Roadmap — Redesign the Structure, Responsive Design, TikTok Live Stream, WebApp Components Building"
                width={2000}
                height={1112}
              />
            </Reveal>
          </CaseSection>

          {/* ===== CONTINUOUS LIGHT RUN =====
              Build with variants → Keeping it simple is one unbroken stretch of
              white imagery. Wrap it in a SINGLE data-light-zone so the page
              turns light when you enter it and STAYS light through every section
              — including the dark-text gaps between images — until the Motion
              section below, instead of flip-flopping per image. The wrapper
              mirrors the parent's flex/gap so section spacing is unchanged. */}
          <div data-light-zone className="flex flex-col gap-32 lg:gap-40">
          {/* BUILD WITH VARIANTS — text left / image right */}
            <section data-case-section>
              <div className="grid items-start gap-x-12 gap-y-10 lg:grid-cols-2">
                <Reveal>
                  <p className={eyebrowSection}>Basic rules</p>
                  <h2 className={`mt-4 ${sectionTitle}`}>Build with variants</h2>
                  <div className="mt-8 flex flex-col gap-7">
                    <div>
                      <SubHeading>Easier to find the components</SubHeading>
                      <p className={`mt-4 ${bodyMd}`}>
                        Designers could find the components just in the variants
                        and switch the same component faster and easier.
                      </p>
                    </div>
                    <div>
                      <SubHeading>Efficient to manage the components</SubHeading>
                      <p className={`mt-4 ${bodyMd}`}>
                        It will automatically revise components in all screens, if
                        designers are using the components master piece.
                      </p>
                    </div>
                  </div>
                </Reveal>
                <Reveal>
                  <ImageFrame
                    src={`${A}/ds-07.jpg`}
                    alt="Build with variants — find and switch components in the variants panel"
                    width={1720}
                    height={1800}
                  />
                </Reveal>
              </div>
            </section>

            {/* ADAPTIVE COMPONENT — text left / image right */}
            <section data-case-section>
              <div className="grid items-start gap-x-12 gap-y-10 lg:grid-cols-2">
                <Reveal>
                  <p className={eyebrowSection}>Basic rules</p>
                  <h2 className={`mt-4 ${sectionTitle}`}>Adaptive component</h2>
                  <div className="mt-8">
                    <SubHeading>Adjustable and responsive</SubHeading>
                    <p className={`mt-4 ${bodyMd}`}>
                      The WebApp components should responsive on any size of
                      device. Designer don’t need to change the entire component.
                    </p>
                  </div>
                </Reveal>
                <Reveal>
                  <ImageFrame
                    src={`${A}/ds-08.jpg`}
                    alt="Adaptive components that stay responsive across device sizes"
                    width={1720}
                    height={1800}
                  />
                </Reveal>
              </div>
            </section>

            {/* COMPONENTS TRACKING DOC */}
            <CaseSection eyebrow="Process" title="Components tracking doc">
              <Reveal className={`mt-8 max-w-3xl flex flex-col gap-5 ${bodyMd}`}>
                <p>
                  To track the whole design system process is also a part of the
                  work we do.
                </p>
                <p>
                  The tracking doc includes design status, priority, design Wiki,
                  and development status. The components tracking doc are helping
                  design team and front engineer team to have better knowledge
                  about the whole design system process.
                </p>
              </Reveal>
              <Reveal className="mt-10">
                <ImageFrame
                  src={`${A}/ds-09.jpg`}
                  alt="Components tracking doc — design status, priority, wiki and development status"
                  width={1534}
                  height={850}
                />
              </Reveal>
            </CaseSection>

            {/* STRUCTURE OF THE DOCUMENT */}
            <CaseSection eyebrow="Documentation" title="Structure of the document">
              <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
                <p>
                  Each components will have there own documentation to help our
                  designer better understanding of all the components. The
                  documentation have pretty similar structure: Anatomy, Type(size,
                  functionality, interactions), Layout, and Motion.
                </p>
              </Reveal>
              <Reveal className="mt-10">
                <ImageFrame
                  src={`${A}/ds-10.jpg`}
                  alt="Per-component documentation structure — Anatomy, Type, Layout, Motion"
                  width={1534}
                  height={850}
                />
              </Reveal>
            </CaseSection>

            {/* KEEPING IT SIMPLE — 32-component gallery */}
            <CaseSection
              eyebrow="Design file"
              title="Keeping it simple yet scalable"
            >
              <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
                <p>
                  We’ve built 32 different components, all designed with
                  responsive and adaptive rules, ensuring compatibility across
                  various devices and viewport sizes.
                </p>
              </Reveal>
              {/* Infinite horizontal marquee — fades on the left edge only.
                  (Light mode is driven by the enclosing data-light-zone run.) */}
              <div
                className="marquee-fade-left -mx-6 mt-10 overflow-hidden sm:-mx-10 lg:-mx-14"
              >
                <div
                  className="marquee-track flex min-w-max gap-5"
                  style={{ animationDuration: "90s" }}
                >
                  {[...gallery, ...gallery].map((n, i) => (
                    <Image
                      key={i}
                      src={`${A}/ds-${n}.jpg`}
                      alt=""
                      aria-hidden
                      width={1662}
                      height={2048}
                      sizes="340px"
                      className="h-[400px] w-auto border border-[var(--cs-border)]"
                    />
                  ))}
                </div>
              </div>
            </CaseSection>
          </div>
          {/* ===== END CONTINUOUS LIGHT RUN ===== */}

          {/* MOTION */}
          <CaseSection eyebrow="Motion" title="Give the components emotions">
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                Haptic feedback can be defined as the “
                <strong className={emphasis}>
                  use of the sense of touch in a user interface design to provide
                  information to an end user
                </strong>
                .” one of the most understudied fields in user experience. As our
                everyday device interactions shift from keyboard+mouse to phones.
                Combining haptic touch with interactive motion can offer users a
                wider range of emotional expression.
              </p>
            </Reveal>

            {/* Design principle doc — text left / flow right */}
            <div className="mt-16 grid items-start gap-x-12 gap-y-10 lg:grid-cols-2">
              <Reveal>
                <SubHeading>Design principle doc</SubHeading>
                <div className="mt-8 flex flex-col gap-7">
                  <div>
                    <h4 className="text-base font-semibold tracking-[-0.01em] text-[var(--cs-heading)]">
                      Haptic Touch
                    </h4>
                    <p className={`mt-3 ${bodyMd}`}>
                      Establishing the principles of IOS &amp; Android Haptic
                      Effects. Engineers can directly incorporate effects when our
                      designers designate the specific haptic variant name in
                      their designs prior to shipping.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold tracking-[-0.01em] text-[var(--cs-heading)]">
                      Components Wiki
                    </h4>
                    <p className={`mt-3 ${bodyMd}`}>
                      Organized all component interaction documents, including
                      extreme cases, while collaborating closely with engineers.
                    </p>
                  </div>
                </div>
              </Reveal>
              <Reveal>
                <ImageFrame
                  src={`${A}/ds-30.jpg`}
                  alt="Design principle docs — Haptic Touch and Components Wiki flows"
                  width={1720}
                  height={1800}
                />
              </Reveal>
            </div>

            <Reveal className={`mt-16 max-w-3xl ${bodyMd}`}>
              <p>
                The TikTok motion system comprises transition patterns designed
                to assist users in comprehending and navigating through in the
                TikTok app.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/ds-31.jpg`}
                alt="TikTok Motion Guide — cubic easing curves and duration tokens"
                width={2880}
                height={1800}
              />
            </Reveal>

            {/* Motion guidelines — text left / component-motion grid right */}
            <div className="mt-16 grid items-start gap-x-12 gap-y-10 lg:grid-cols-2">
              <Reveal>
                <SubHeading>Motion guidelines for components</SubHeading>
                <div className="mt-8 flex flex-col gap-7">
                  <div>
                    <h4 className="text-base font-semibold tracking-[-0.01em] text-[var(--cs-heading)]">
                      Easy to manipulate
                    </h4>
                    <p className={`mt-3 ${bodyMd}`}>
                      How the components interact and enter or exit the page — is
                      up to each product team to implement. Use this guidance to
                      customize, combine, coordinate, and choreograph this aspect
                      of motion in the UI.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold tracking-[-0.01em] text-[var(--cs-heading)]">
                      Principles to guide designer
                    </h4>
                    <p className={`mt-3 ${bodyMd}`}>
                      We also support other request when designer have build a new
                      component that need to add motion on it. The curve and
                      duration principle will help then make the decisions.
                    </p>
                  </div>
                </div>
              </Reveal>
              <Reveal>
                <ImageFrame
                  src={`${A}/ds-32.jpg`}
                  alt="Motion guidelines — curve and duration principles for components"
                  width={2346}
                  height={2500}
                />
              </Reveal>
            </div>
          </CaseSection>

          {/* TESTING */}
          <CaseSection
            eyebrow="Testing"
            title="Testing components back to design file"
          >
            <ul className={`mt-8 flex max-w-3xl list-disc flex-col gap-3 pl-5 ${bodyMd}`}>
              <li>Less time spent on coding new components.</li>
              <li>
                Handoff is a lot more efficient (less explanation needed to
                describe elements).
              </li>
              <li>Less back and forth during QA.</li>
              <li>Coded design is a lot more consistent.</li>
            </ul>
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                <strong className={emphasis}>
                  Create a single source of truth
                </strong>
                , reduce operation burdens, and minimize errors with a
                code-to-design design system workflow from UXPin Merge.
              </p>
            </Reveal>
          </CaseSection>
        </div>
        <CaseStudyFooter />
      </article>
    </ScrollThemeShell>
  );
}
