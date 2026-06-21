import type { ReactNode } from "react";
import Link from "next/link";
import { TonyLogo } from "../tony-logo";
import { SidebarProjects } from "./sidebar-projects";
import { RootBackground } from "./root-background";

type SidebarTheme = "home" | "tiktok-tv" | "light";

type PortfolioShellProps = {
  children: ReactNode;
  sidebarTheme?: SidebarTheme;
  mainClassName?: string;
  contentClassName?: string;
  /** Colour for the overscroll/rubber-band canvas — set on dark pages so they
   *  don't flash white when you bounce past the top or bottom. */
  rootBg?: string;
};

const sidebarThemes: Record<
  SidebarTheme,
  {
    panel: string;
    logo: string;
    muted: string;
    nav: string;
    navHover: string;
    status: string;
    copyright: string;
  }
> = {
  home: {
    panel: "border-white/10 bg-[#111111] text-white",
    logo: "brightness-0 invert",
    muted: "text-white/48",
    nav: "text-white/48",
    navHover: "hover:text-white",
    status:
      "bg-white/[0.08] text-white/66 hover:bg-white/[0.14] hover:text-white",
    copyright: "text-white/32",
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
  },
};

export function PortfolioShell({
  children,
  sidebarTheme = "home",
  mainClassName = "bg-white text-[#171717]",
  contentClassName = "min-w-0 px-6 pb-5 pt-2 sm:px-10 lg:px-14 lg:pb-9 lg:pt-3 2xl:px-16",
  rootBg,
}: PortfolioShellProps) {
  const theme = sidebarThemes[sidebarTheme];

  return (
    <main className={`min-h-screen md:grid md:grid-cols-[324px_1fr] ${mainClassName}`}>
      {rootBg ? <RootBackground color={rootBg} /> : null}
      <aside
        className={`m-3 overflow-hidden rounded-[1.75rem] border px-5 py-5 transition-colors duration-500 sm:px-7 md:sticky md:top-3 md:flex md:h-[calc(100vh-1.5rem)] md:flex-col md:justify-between md:px-7 md:py-8 ${theme.panel}`}
      >
        <div>
          <nav className="flex items-center justify-between gap-4 text-sm font-medium">
            <Link
              href="/"
              className={`block w-fit ${theme.logo}`}
              aria-label="Tony Xing"
            >
              <TonyLogo />
            </Link>
            <div className="flex items-center gap-4">
              <a
                href="mailto:xingtong198907216810@gmail.com"
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition hover:-translate-y-0.5 ${theme.status}`}
              >
                <span className="availability-dot" aria-hidden="true" />
                Available to connect
              </a>
            </div>
          </nav>

          <SidebarProjects tone={sidebarTheme === "light" ? "light" : "dark"} />
        </div>

        <div className="mt-8 flex flex-col gap-8 md:mt-0">
          <div className="flex flex-wrap gap-x-4 gap-y-2 md:flex-col md:items-start md:gap-4">
            {["LinkedIn", "About"].map((item) => {
              const className = `text-[11px] font-semibold uppercase tracking-[0.16em] transition ${theme.nav} ${theme.navHover}`;

              if (item === "LinkedIn" || item === "About") {
                return (
                  <a
                    key={item}
                    href={
                      item === "LinkedIn"
                        ? "https://www.linkedin.com/in/tongxingdesign/"
                        : "https://drive.google.com/file/d/1-GoTcB9ZYxMW_vwdvF5KdgT0OveWcOhM/view?usp=sharing"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className={className}
                  >
                    {item} ↗
                  </a>
                );
              }

              return (
                <Link key={item} href={`/#${item.toLowerCase()}`} className={className}>
                  {item}
                </Link>
              );
            })}
          </div>
          <p className={`hidden text-[11px] leading-5 md:block ${theme.copyright}`}>
            © 2026
            <br />
            Tony Xing
          </p>
        </div>
      </aside>

      <section className={contentClassName}>{children}</section>
    </main>
  );
}
