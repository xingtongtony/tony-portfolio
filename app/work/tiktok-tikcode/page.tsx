import type { ReactNode } from "react";
import Image from "next/image";
import { TrendingDown, TrendingUp } from "lucide-react";
import { PortfolioShell } from "../../components/portfolio-shell";
import { Reveal, StaggerGrid, StaggerItem } from "../../components/motion";
import { NextSectionButton } from "../../components/next-section-button";
import { Board, BoardGallery, type BoardImage } from "../../components/board-viewer";
import { CaseHeader, CaseStudyFooter, Chapter } from "../../components/case-study";
import { TT_ACCENT } from "../../lib/tiktok-tv";
import { eyebrowMeta, bodyMd, bodySm, emphasis } from "../../lib/tokens";

// White page, the CloudKitchens / TikTok TV chapter layout. The boards carry
// their own light grey and read as panels by that background: rounded
// corners, no border, every one opens full screen (BoardGallery). Cards are
// the light grey used on CloudKitchens. TikTok red (TT_ACCENT) marks the
// chapter numbers only: the A/B board below the table writes drops in red, so
// the table's arrows stay in the text colour.

const A = "/portfolio/tiktok-tikcode";
const CARD = "rounded-[1.25rem] bg-[#f6f6f6]";

const B = {
  codes: {
    src: `${A}/tk-04.jpg`,
    alt: "TikCode variants for personal profile, hashtag, sounds and effects — each a visual TikTok URL",
    width: 5760,
    height: 3069,
  },
  apps: {
    src: `${A}/tk-05.jpg`,
    alt: "QR approaches across apps — Spotify and Snapchat are in-app only, Instagram and Twitter support the native camera",
    width: 3840,
    height: 2046,
  },
  anatomy: {
    src: `${A}/tk-06.jpg`,
    alt: "TikCode anatomy — Code Eye 8-dot anchoring, Pattern and Pattern+ dot rules in Main-Light/Primary #FE2C55",
    width: 5234,
    height: 1934,
  },
  journey: {
    src: `${A}/tk-07.jpg`,
    alt: "User journey to the code — Discover, scan, Settings and privacy QR code entry, and the redesigned profile QR page",
    width: 5000,
    height: 2480,
  },
  pages: {
    src: `${A}/tk-08.jpg`,
    alt: "The old TikCode pages for personal profile, hashtag, sounds and effects, and their redesigned QR pages with share panels",
    width: 5760,
    height: 5928,
  },
  abTest: {
    src: `${A}/tk-09.jpg`,
    alt: "A/B test variants V1–V4 of the profile QR page and share panel, with click-share and click-share-channel changes",
    width: 3840,
    height: 4084,
  },
  motion: {
    src: `${A}/tk-10.jpg`,
    alt: "Personalized TikCode cards on red, orange, green and purple animated gradient backgrounds",
    width: 6266,
    height: 3724,
  },
} satisfies Record<string, BoardImage>;

const projectStats = [
  ["Role", "Lead Product Designer"],
  ["Skills", "UX design / Visual design"],
  ["Platform", "Native App"],
];

// What a scan opens, case by case.
const scanCases: ReactNode[] = [
  <p key="native">
    If the user has already installed TikTok, scanning the code with the native camera will redirect them to launch the
    app.
  </p>,
  <div key="third-party" className="flex flex-col gap-3">
    <p>
      If the user has already installed TikTok and scans the QR code through the camera embedded in a third-party
      application, whether the app launches depends on the block strategy. If the third party hasn’t blocked it:
    </p>
    <ul className="flex list-disc flex-col gap-1.5 pl-5">
      <li>Scan and recognize;</li>
      <li>Launch the app, redirecting the user to the TikTok app.</li>
    </ul>
  </div>,
  <p key="webapp">
    If the user hasn’t installed TikTok, scanning the code will allow them to browse the WebApp (with guidelines to
    download the app).
  </p>,
];

// The A/B test figures, transcribed from the board (tk-09) so they can be read
// and compared; the board stays for the screens. V4 shows no click-share figure.
const abResults: { group: string; note?: string; share?: string; channel: string }[] = [
  { group: "V1", share: "−5.08%", channel: "−6.61%" },
  { group: "V2", share: "+39.51%", channel: "+30.31%" },
  { group: "V3", share: "+21.74%", channel: "+16.02%" },
  { group: "V4", note: "Sharing channels exposed by default", channel: "+298.59%" },
];

// The closing recap, each line taken from its section above.
const recap = [
  ["Proposal", "Move from the TikCode to a standard QR code, so out-of-app users can open it without the TikTok app."],
  ["Redesign", "A redesigned personal profile QR page, and redesigned QR codes for sharing hashtag, sounds and effects pages."],
  [
    "A/B test",
    "Exposing sharing channels by default (V4) raised personal page QR code sharing penetration from 0.002% to 0.009%; the overall improvement was limited by the low base.",
  ],
  ["Motion", "An animated, personalized QR card, as an experiment to encourage sharing."],
];

function Change({ value }: { value?: string }) {
  if (!value) {
    return (
      <span className="text-[var(--cs-body-sm)]">
        <span aria-hidden>—</span>
        <span className="sr-only">No figure</span>
      </span>
    );
  }
  const up = value.startsWith("+");
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center justify-end gap-2 whitespace-nowrap ${up ? "text-[var(--cs-heading)]" : "text-[var(--cs-body)]"}`}
    >
      {value}
      <Icon aria-hidden className="size-5 shrink-0" strokeWidth={2.5} />
    </span>
  );
}

export default function TikTokTikcodePage() {
  return (
    <PortfolioShell sidebarTheme="light" mainClassName="bg-white text-[#171717]" contentClassName="min-w-0 bg-white text-[#171717]">
      <BoardGallery boards={Object.values(B)}>
        <article data-cs-theme="light" className="mx-auto max-w-[1280px] px-6 pb-14 pt-6 sm:px-10 xl:px-14 lg:pb-24 lg:pt-14">
          {/* HERO */}
          <figure className="overflow-hidden rounded-[1.75rem]">
            <Image
              src={`${A}/tk-02.jpg`}
              alt="TikCode — personal profile QR page with a scannable code on a colorful gradient"
              width={2700}
              height={1605}
              priority
              className="h-auto w-full"
            />
          </figure>

          <CaseHeader
            date="Feb 2021 — Jul 2021"
            title="TikCode Redesign"
            overview="A QR code for users to connect with their friends. It provides QR codes for users to access various pages such as Hashtags, Sounds, and Effects. It showcases the brand style and creativity, offering users a unique experience when interacting with the TikTok QR code."
            facts={projectStats}
          >
            <div className="mt-14 grid gap-4 lg:grid-cols-2">
              <article className={`px-6 py-6 ${CARD}`}>
                <Image src={`${A}/tk-03.png`} alt="" width={64} height={64} className="block size-[22px] rounded-[0.3rem] opacity-65 grayscale" />
                <h2 className="mt-5 text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--cs-heading)]">Design Patent</h2>
                <ul className="mt-3 flex flex-col gap-1 text-[15px] font-medium leading-6 text-[var(--cs-body-sm)]">
                  <li>QR code and motion related</li>
                  <li>Mar 2021</li>
                </ul>
              </article>
            </div>
          </CaseHeader>

          {/* CHAPTERS */}
          <div className="mt-28 flex flex-col gap-28 sm:gap-36 lg:mt-36 lg:gap-44">
            <Chapter
              id="background"
              n="01"
              eyebrow="Background"
              title="Every TikCode is a visual URL"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  Like numerous other apps, TikTok has crafted a distinctive visualized TikCode, representing a unique URL.
                  Users can employ their camera for scanning or utilize the in-app scanning feature to navigate to the
                  relevant page. Simply put, any code serves as a visual representation of a URL.
                </p>
              }
            >
              <Reveal className="mt-14">
                <Board {...B.codes} />
              </Reveal>
            </Chapter>

            <Chapter
              id="current-stage"
              n="02"
              eyebrow="Current stage"
              title="Standard QR codes work without the app"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  We propose transitioning from the TikCode to a standard QR code. Using the conventional QR format, out-of-app
                  users can access information without opening or having the TikTok app. This broadening of sharing
                  touchpoints aims to attract new users (to download TT through the WebApp) and re-engage existing users with
                  the app.
                </p>
              }
            >
              <Reveal className="mt-14">
                <Board {...B.apps} />
              </Reveal>
            </Chapter>

            <Chapter
              id="principle"
              n="03"
              eyebrow="Principle"
              title="A scan opens the app or the WebApp"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  What a scan opens depends on whether TikTok is installed, and on which camera reads the code.
                </p>
              }
            >
              {/* Side by side only where all three fit; stacked, each takes its own height. */}
              <StaggerGrid className="mt-14 grid gap-3 min-[1180px]:auto-rows-fr min-[1180px]:grid-cols-3">
                {scanCases.map((body, i) => (
                  <StaggerItem key={i} index={i} className={`flex h-full gap-4 px-5 py-5 ${CARD}`}>
                    <span aria-hidden className={`text-xs font-semibold tabular-nums leading-6 ${TT_ACCENT}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="text-[15px] leading-6 text-[var(--cs-heading)]">{body}</div>
                  </StaggerItem>
                ))}
              </StaggerGrid>
              <div className="mt-12 flex flex-col gap-12">
                <Reveal>
                  <Board {...B.anatomy} />
                </Reveal>
                <Reveal>
                  <Board {...B.journey} />
                </Reveal>
              </div>
            </Chapter>

            <Chapter
              id="qr-visual"
              n="04"
              eyebrow="QR visual"
              title="The redesign goes beyond the profile"
              accent={TT_ACCENT}
              intro={
                <p className={bodyMd}>
                  We redesigned the personal profile QR page, as well as the QR codes for sharing hashtag, sounds, and effects
                  pages.
                </p>
              }
            >
              <Reveal className="mt-14">
                <Board {...B.pages} />
              </Reveal>
            </Chapter>

            <Chapter
              id="ab-test"
              n="05"
              eyebrow="A/B test"
              title="Default channels gave a small lift"
              accent={TT_ACCENT}
              intro={
                <div className={`flex flex-col gap-6 ${bodyMd}`}>
                  <p>Five groups were configured to test the impact of button layout and the share panel on share penetration.</p>
                  <p>
                    The final data reveals that, while the V4 group, which exposes sharing channels by default, shows a
                    positive impact on the sharing rate of personal page QR codes, the improvement is limited overall due to
                    its low base (personal page QR code sharing penetration increased from{" "}
                    <strong className={emphasis}>0.002% to 0.009%</strong>). The overall sharing rate of profile QR pages
                    fluctuates.
                  </p>
                </div>
              }
            >
              {/* The variants' figures, as on the board below: a table from sm up,
                  so the variants can be compared; on a phone, one block per variant. */}
              <Reveal className={`mt-14 px-5 py-2 sm:hidden ${CARD}`}>
                <ul>
                  {abResults.map((r) => (
                    <li key={r.group} className="border-t border-black/[0.07] py-4 first:border-t-0">
                      <p className="text-[15px] font-semibold leading-6 text-[var(--cs-heading)]">{r.group}</p>
                      {r.note ? <p className={bodySm}>{r.note}</p> : null}
                      <dl className="mt-2 flex flex-col gap-1.5">
                        {(
                          [
                            ["Click share", r.share],
                            ["Click share channel", r.channel],
                          ] as const
                        ).map(([label, value]) => (
                          <div key={label} className="flex items-baseline justify-between gap-4">
                            <dt className={bodySm}>{label}</dt>
                            <dd className="text-[1.25rem] font-medium leading-7 tracking-[-0.03em] tabular-nums">
                              <Change value={value} />
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className={`mt-14 hidden overflow-hidden sm:block ${CARD}`}>
                <table className="w-full border-collapse text-left">
                  <caption className="sr-only">A/B test results by variant</caption>
                  <thead>
                    <tr className={eyebrowMeta}>
                      <th scope="col" className="px-5 pb-3 pt-6 font-semibold sm:px-8">
                        Variant
                      </th>
                      <th scope="col" className="px-3 pb-3 pt-6 text-right font-semibold sm:px-8">
                        Click share
                      </th>
                      <th scope="col" className="px-5 pb-3 pt-6 text-right font-semibold sm:px-8">
                        Click share channel
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {abResults.map((r) => (
                      <tr key={r.group} className="border-t border-black/[0.07]">
                        <th scope="row" className="px-5 py-4 align-middle font-normal sm:px-8 sm:py-5">
                          <span className="block text-[15px] font-semibold leading-6 text-[var(--cs-heading)]">{r.group}</span>
                          {r.note ? <span className={`block ${bodySm}`}>{r.note}</span> : null}
                        </th>
                        <td className="px-3 py-4 text-right align-middle text-[clamp(1.125rem,2.4vw,1.75rem)] font-medium leading-none tracking-[-0.03em] tabular-nums sm:px-8 sm:py-5">
                          <Change value={r.share} />
                        </td>
                        <td className="px-5 py-4 text-right align-middle text-[clamp(1.125rem,2.4vw,1.75rem)] font-medium leading-none tracking-[-0.03em] tabular-nums sm:px-8 sm:py-5">
                          <Change value={r.channel} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Reveal>
              <Reveal className="mt-12">
                <Board {...B.abTest} />
              </Reveal>
            </Chapter>

            <Chapter
              id="motion"
              n="06"
              eyebrow="Motion"
              title="Animation makes the card more personal"
              accent={TT_ACCENT}
              intro={
                <div className={`flex flex-col gap-6 ${bodyMd}`}>
                  <p>
                    To encourage user sharing, we experimented with adding animation design to the QR code, creating a more
                    interactive, diverse, and personalized QR card. You can preview the animation mock below.
                  </p>
                  <p>
                    Click on the TikCode background: with the click point at 40×40 pixels as the center, the mask expands to
                    the maximum radius of the screen.
                  </p>
                </div>
              }
            >
              <Reveal className="mt-14">
                <Board {...B.motion} />
              </Reveal>

              {/* Recap: the project in four lines, each taken from its section. */}
              <Reveal className={`mt-16 px-6 py-6 sm:px-8 sm:py-7 ${CARD}`}>
                <p className={eyebrowMeta}>Recap</p>
                <dl className="mt-4 flex flex-col">
                  {recap.map(([label, line]) => (
                    <div
                      key={label}
                      className="grid gap-1 border-t border-black/[0.07] py-4 first:border-t-0 first:pt-2 sm:grid-cols-[9rem_1fr] sm:gap-4"
                    >
                      <dt className="text-[15px] font-semibold leading-6 text-[var(--cs-heading)]">{label}</dt>
                      <dd className={`${bodySm} sm:leading-6`}>{line}</dd>
                    </div>
                  ))}
                </dl>
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
