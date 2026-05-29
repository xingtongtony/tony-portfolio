import type { ReactNode } from "react";
import Link from "next/link";
import { TonyLogo } from "../tony-logo";

type SidebarTheme = "home" | "tiktok-tv";

type PortfolioShellProps = {
  children: ReactNode;
  sidebarTheme?: SidebarTheme;
  mainClassName?: string;
  contentClassName?: string;
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
};

export function PortfolioShell({
  children,
  sidebarTheme = "home",
  mainClassName = "bg-white text-[#171717]",
  contentClassName = "min-w-0 px-6 pb-5 pt-2 sm:px-10 lg:px-14 lg:pb-9 lg:pt-3 2xl:px-16",
}: PortfolioShellProps) {
  const theme = sidebarThemes[sidebarTheme];

  return (
    <main className={`min-h-screen md:grid md:grid-cols-[324px_1fr] ${mainClassName}`}>
      <aside
        className={`m-3 overflow-hidden rounded-[1.75rem] border px-5 py-5 sm:px-8 md:sticky md:top-3 md:flex md:h-[calc(100vh-1.5rem)] md:flex-col md:justify-between md:px-9 md:py-10 ${theme.panel}`}
      >
        <div>
          <nav className="flex items-start justify-between text-sm font-medium md:block">
            <Link
              href="/#about"
              className={`block w-fit ${theme.logo}`}
              aria-label="Tony Xing"
            >
              <TonyLogo />
            </Link>
            <div className={`hidden gap-5 sm:flex md:hidden ${theme.nav}`}>
              <Link href="/#work" className={`transition ${theme.navHover}`}>
                Work
              </Link>
              <Link href="/#experience" className={`transition ${theme.navHover}`}>
                Experience
              </Link>
              <a
                href="https://www.linkedin.com/in/tongxingdesign/"
                target="_blank"
                rel="noreferrer"
                className={`transition ${theme.navHover}`}
              >
                LinkedIn
              </a>
            </div>
          </nav>

          <div className="mt-5 space-y-3">
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.11em] ${theme.muted}`}
            >
              Staff Product Designer
            </p>
            <a
              href="mailto:xingtong198907216810@gmail.com"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition hover:-translate-y-0.5 ${theme.status}`}
            >
              <span className="availability-dot" aria-hidden="true" />
              Available to connect
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-8 md:mt-0">
          <div className="flex flex-wrap gap-x-4 gap-y-2 md:flex-col md:items-start md:gap-4">
            {["Work", "Experience", "LinkedIn", "About"].map((item) => {
              const className = `text-[11px] font-semibold uppercase tracking-[0.16em] transition ${theme.nav} ${theme.navHover}`;

              if (item === "LinkedIn" || item === "About") {
                return (
                  <a
                    key={item}
                    href={
                      item === "LinkedIn"
                        ? "https://www.linkedin.com/in/tongxingdesign/"
                        : "https://drive.google.com/file/d/1cK3rWh4no14awCdSfYfgvAAEqOb5L1fk/view?usp=sharing"
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
