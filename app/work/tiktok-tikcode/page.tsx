import Image from "next/image";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import {
  CaseSection,
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

const A = "/portfolio/tiktok-tikcode";

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design"],
  ["Platform", "Native App"],
];

export default function TikTokTikcodePage() {
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
            src={`${A}/tk-02.jpg`}
            alt="TikCode — personal profile QR page with a scannable code on a colourful gradient"
            width={2700}
            height={1605}
            priority
            className="h-auto w-full"
          />
        </figure>

        {/* TITLE + OVERVIEW */}
        <section className="pb-12 pt-14 lg:pb-16 lg:pt-20">
          <p className={eyebrowMeta}>Feb 2021 - Jul 2021</p>

          <h1 className="mt-6 max-w-[20ch] text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1] tracking-[-0.03em] text-[var(--cs-heading)] text-balance">
            TikCode Redesign
          </h1>

          <div className="mt-12">
            <p className={eyebrowSection}>Overview</p>
            <p className="mt-6 max-w-3xl text-lg leading-[1.5] tracking-[-0.01em] text-[var(--cs-body)]">
              A QR code for users to connect with their friends. Provide QR codes
              for users to access various pages such as Hashtags, Sounds, and
              Effects. Showcase the brand style and creativity, offering users a
              unique experience when interacting with the TikTok QR code.
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

          {/* Recognition — design patent badge */}
          <Reveal className="mt-10">
            <div
              className={`flex items-start gap-4 rounded-[var(--r-md)] border border-[var(--cs-border-2)] px-6 py-5 sm:max-w-md ${surfaceQuiet}`}
            >
              <Image
                src={`${A}/tk-03.png`}
                alt=""
                width={64}
                height={64}
                className="h-7 w-7 shrink-0"
              />
              <div>
                <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--cs-heading)]">
                  Design Patent
                </h3>
                <p className="mt-1 text-sm leading-[1.4] text-[var(--cs-body)]">
                  QR code and Motion related
                </p>
                <p className={`mt-2 ${eyebrowMeta}`}>Mar 2021</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* SECTION FLOW */}
        <div className="mt-24 flex flex-col gap-32 lg:mt-28 lg:gap-40">
          {/* BACKGROUND */}
          <CaseSection eyebrow="Background" title="Design for Creativity">
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                With numerous other apps, TikTok has crafted a distinctive
                visualized Tikcode, representing a unique URL. Users can employ
                their camera for scanning or utilize the in-app scanning feature
                to navigate to the relevant page. Simply put, any code serves as
                a visual representation of a URL.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/tk-04.jpg`}
                alt="Tikcode variants for personal profile, hashtag, sounds and effects — each a visual TikTok URL"
                width={5760}
                height={3069}
              />
            </Reveal>
          </CaseSection>

          {/* CURRENT STAGE */}
          <CaseSection eyebrow="Current stage" title="Customized TikTok QR code">
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                We propose transitioning from the Tikcode to a standard QR code.
                Using the conventional QR format, out-of-app users can access
                information without opening or having the TikTok app. This
                broadening of sharing touchpoints aims to attract new users (to
                download TT through WebApp) and re-engage existing users with the
                app.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/tk-05.jpg`}
                alt="QR approaches across apps — Spotify and Snapchat are in-app only, Instagram and Twitter support the native camera"
                width={3840}
                height={2046}
              />
            </Reveal>
          </CaseSection>

          {/* PRINCIPLE */}
          <CaseSection
            eyebrow="Principle"
            title="Guiding users through the QR code"
          >
            <div className={`mt-8 max-w-3xl flex flex-col gap-7 ${bodyMd}`}>
              <Reveal>
                <p>
                  If the user has already installed TikTok, scanning the code
                  with the native camera will redirect them to launch the app.
                </p>
              </Reveal>
              <Reveal>
                <p>
                  If the user has already installed TikTok and scans the QR code
                  through the camera embedded in a third-party application,
                  whether the app launches depends on the block strategy. If the
                  third party hasn’t blocked:
                </p>
                <ul className="mt-4 flex list-disc flex-col gap-2 pl-5">
                  <li>Scan and recognize;</li>
                  <li>Launch the app, redirecting the user to the TikTok app.</li>
                </ul>
              </Reveal>
              <Reveal>
                <p>
                  If the user hasn’t installed TikTok, scanning the code will
                  allow them to browse the WebApp (*with guidelines to download
                  the app).
                </p>
              </Reveal>
            </div>

            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/tk-06.jpg`}
                alt="Tikcode anatomy — Code Eye 4-dot anchoring, Pattern and Pattern+ dot rules tinted Main Light / Primary #FE2C50"
                width={5234}
                height={1934}
              />
            </Reveal>
            <Reveal className="mt-12">
              <ImageFrame
                src={`${A}/tk-07.jpg`}
                alt="User journey to the code — feed, scan, Settings & privacy QR entry, and the redesigned profile QR page"
                width={5000}
                height={2480}
              />
            </Reveal>
          </CaseSection>

          {/* QR VISUAL */}
          <CaseSection eyebrow="QR Visual" title="Redesigned TikCode">
            <Reveal className={`mt-8 max-w-3xl ${bodyMd}`}>
              <p>
                We redesigned the personal profile QR page, as well as the QR
                codes for sharing hashtag, sounds, and effects pages.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/tk-08.jpg`}
                alt="Redesigned TikCode pages — personal profile, hashtag, sounds and effects with refreshed share panels"
                width={5760}
                height={5928}
              />
            </Reveal>
          </CaseSection>

          {/* AB TEST */}
          <CaseSection eyebrow="AB test" title="Improving share experience">
            <Reveal className={`mt-8 max-w-3xl flex flex-col gap-5 ${bodyMd}`}>
              <p>
                Five groups were configured to test the impact of button layout
                and the share panel on share penetration.
              </p>
              <p>
                The final data reveals that, while the V4 group, which exposes
                sharing channels by default, shows a positive impact on the
                sharing rate of personal page QR codes, the improvement is
                limited overall due to its low base (personal page QR code
                sharing penetration increased from{" "}
                <strong className={emphasis}>0.002% to 0.009%</strong>). The
                overall sharing rate of profile QR pages fluctuates.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/tk-09.jpg`}
                alt="A/B test results across V1–V4 — click-share and click-share-channel deltas for each share-panel variant"
                width={3840}
                height={4084}
              />
            </Reveal>
          </CaseSection>

          {/* TIKCODE ANIMATION */}
          <CaseSection eyebrow="Motion" title="Tikcode animation">
            <Reveal className={`mt-8 max-w-3xl flex flex-col gap-5 ${bodyMd}`}>
              <p>
                To encourage user sharing, we experimented with adding animation
                design to the QR code, creating a more interactive, diverse, and
                personalized QR card. You can preview the animation mock below.
              </p>
              <p>
                Click on the TikCode background, with the click point at 40×40
                pixels as the center, expanding to the maximum radius of the
                screen as the mask.
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <ImageFrame
                src={`${A}/tk-10.jpg`}
                alt="Personalized TikCode cards across vibrant animated gradient backgrounds"
                width={6266}
                height={3724}
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
