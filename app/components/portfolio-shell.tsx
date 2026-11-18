import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TonyLogo } from "../tony-logo";
import { SidebarProjects } from "./sidebar-projects";
import { RootBackground } from "./root-background";
import { MobileHeader, type ShellTheme } from "./mobile-header";
import { ABOUT_HREF, EMAIL_HREF, EXTERNAL_LINKS } from "../lib/site-links";

type SidebarTheme = "home" | "tiktok-tv" | "light" | "stage";

type PortfolioShellProps = {
  children: ReactNode;
  sidebarTheme?: SidebarTheme;
  mainClassName?: string;
  contentClassName?: string;
  /** Colour for the overscroll/rubber-band canvas — set on dark pages so they
   *  don't flash white when you bounce past the top or bottom. */
  rootBg?: string;
  /** The page being shown, when it is one the sidebar links to. */
  current?: "about";
};

const sidebarThemes: Record<SidebarTheme, ShellTheme> = {
  home: {
    panel: "border-white/10 bg-[#111111] text-white",
    logo: "brightness-0 invert",
    muted: "text-white/48",
    nav: "text-white/48",
    navHover: "hover:text-white",
    status:
      "bg-white/[0.08] text-white/66 hover:bg-white/[0.14] hover:text-white",
    copyright: "text-white/32",
    bar: "border-white/[0.06] bg-[#111111]/80",
    sheet: "bg-[#111111] text-white",
    tone: "dark",
  },
  "tiktok-tv": {
    panel: "border-white/10 bg-[#0E0E0E] text-white",
    logo: "brightness-0 invert",
    muted: "text-white/46",
    nav: "text-white/46",
    navHover: "hover:text-white",
    status:
      "bg-white/[0.075] text-white/64 hover:bg-white/[0.13] hover:text-white",
    copyright: "text-white/30",
    bar: "border-white/[0.06] bg-[#161616]/80",
    sheet: "bg-[#0E0E0E] text-white",
    tone: "dark",
  },
  // Light sidebar for white/light case studies (e.g. CloudKitchens).
  light: {
    panel: "border-black/[0.08] bg-[#f6f6f6] text-[#171717]",
    logo: "brightness-0",
    muted: "text-black/45",
    nav: "text-black/45",
    navHover: "hover:text-black",
    status:
      "bg-black/[0.05] text-black/66 hover:bg-black/[0.1] hover:text-black",
    copyright: "text-black/35",
    bar: "border-black/[0.06] bg-white/80",
    sheet: "bg-[#f6f6f6] text-[#171717]",
    tone: "light",
  },
  // The homepage. From lg the page is the blueprint stage's tinted paper
  // (`--studio-paper`) and the stage's canvas runs under this panel, so it
  // is a sheet of frosted glass: a little white, a lighter edge, the tint
  // showing through, and a neighbouring figure passing beneath it as a soft
  // blur. (Tony, 2026-11-17: the grey card sat against the colour; no card
  // at all dissolved the navigation into the page. This is between the two.)
  // `z-10` keeps it above the canvas, which comes later in the page.
  stage: {
    panel: "z-10 border-white/55 bg-white/45 text-[#171717] backdrop-blur-xl",
    logo: "brightness-0",
    muted: "text-black/45",
    nav: "text-black/45",
    navHover: "hover:text-black",
    status:
      "bg-black/[0.05] text-black/66 hover:bg-black/[0.1] hover:text-black",
    copyright: "text-black/35",
    bar: "border-black/[0.06] bg-white/80",
    sheet: "bg-[#f6f6f6] text-[#171717]",
    tone: "light",
  },
};

export function PortfolioShell({
  children,
  sidebarTheme = "home",
  mainClassName = "bg-white text-[#171717]",
  contentClassName = "min-w-0 px-6 pb-5 pt-2 sm:px-10 xl:px-14 lg:pb-9 lg:pt-3 2xl:px-16",
  rootBg,
  current,
}: PortfolioShellProps) {
  const theme = sidebarThemes[sidebarTheme];

  return (
    // The sidebar sits beside the content only from lg (1024px, iPad
    // landscape) up, at 280px until xl and 324px from xl. Below lg the page
    // gets the full width under a slim header whose Menu opens the same
    // sidebar content as a full-screen sheet (MobileHeader).
    <main className={`min-h-screen lg:grid lg:grid-cols-[280px_1fr] xl:grid-cols-[324px_1fr] ${mainClassName}`}>
      {rootBg ? <RootBackground color={rootBg} /> : null}
      <MobileHeader theme={theme} />
      <aside
        className={`m-3 hidden overflow-hidden rounded-[1.75rem] border px-6 py-8 transition-colors duration-500 lg:sticky lg:top-3 lg:flex lg:h-[calc(100vh-1.5rem)] lg:flex-col xl:px-7 ${theme.panel}`}
      >
        {/* Three parts. The logo and the status stay at the top and the links
            at the bottom, always. Only the index between them moves: with a
            case study's sections under its row it can be taller than a short
            window, and then it scrolls on its own — no bar, its rows fading
            out at the two edges rather than being cut off (Tony, 2026-11-18:
            the whole top scrolling, logo and all, and ending in a hard cut,
            was wrong to look at and to use). */}
        <nav className="flex shrink-0 items-center justify-between gap-4 text-sm font-medium">
          <Link
            href="/"
            className={`block w-fit ${theme.logo}`}
            aria-label="Tony Xing"
          >
            <TonyLogo />
          </Link>
          <div className="flex items-center gap-4">
            <a
              href={EMAIL_HREF}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition hover:-translate-y-0.5 ${theme.status}`}
            >
              <span className="availability-dot" aria-hidden="true" />
              Available to connect
            </a>
          </div>
        </nav>

        <div
          data-panel-index
          className="no-scrollbar -mx-2 min-h-0 flex-1 overflow-y-auto px-2 [scrollbar-width:none] [mask-image:linear-gradient(to_bottom,transparent,#000_22px,#000_calc(100%_-_30px),transparent)]"
        >
          <SidebarProjects tone={theme.tone} />
        </div>

        <div className="flex shrink-0 flex-col gap-6 pt-4">
          <div className="flex flex-col items-start gap-4">
            <Link
              href={ABOUT_HREF}
              aria-current={current === "about" ? "page" : undefined}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                current === "about" ? (theme.tone === "dark" ? "text-white" : "text-black") : `${theme.nav} ${theme.navHover}`
              }`}
            >
              About
            </Link>
            {EXTERNAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${theme.nav} ${theme.navHover}`}
              >
                {link.label}
                <ArrowUpRight className="size-3.5" />
              </a>
            ))}
          </div>
          <p className={`text-[11px] leading-5 ${theme.copyright}`}>© 2026 Tony Xing</p>
        </div>
      </aside>

      <section className={contentClassName}>{children}</section>
    </main>
  );
}
