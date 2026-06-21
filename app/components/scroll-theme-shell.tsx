"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PortfolioShell } from "./portfolio-shell";
import { NextSectionButton } from "./next-section-button";

type Theme = "dark" | "light";

/**
 * Scroll-driven theme shell for case studies that flip the ENTIRE page —
 * left sidebar, main background, article tokens AND the locator pill — between
 * light and dark as you scroll past a marked region, then back to the base
 * theme when it leaves the viewport.
 *
 * - `base` is the page's default theme. The shell starts there and returns to
 *   it whenever no zone is active (also the SSR/first-paint value, so no flash).
 * - Mark a contiguous stretch that should read in the OPPOSITE theme with
 *   `data-light-zone` (force light — e.g. the all-white component gallery on the
 *   dark TikTok Design System page) or `data-dark-zone` (force dark — e.g. the
 *   Problems→Success-metric block on the light TikTok Web Restructure page).
 *   A zone engages while it overlaps the central band of the viewport (30%–70%
 *   of its height) — a generous window so the flip fires a touch before the zone
 *   reaches dead-center and holds while it dominates the screen, not at a single
 *   razor-thin line. Wrap a whole run as ONE zone (never per-image/section) so
 *   the page doesn't flip-flop in the gaps between blocks.
 */
export function ScrollThemeShell({
  base = "dark",
  children,
}: {
  base?: Theme;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(base);

  useEffect(() => {
    const lightZones = Array.from(
      document.querySelectorAll<HTMLElement>("[data-light-zone]"),
    );
    const darkZones = Array.from(
      document.querySelectorAll<HTMLElement>("[data-dark-zone]"),
    );
    if (lightZones.length === 0 && darkZones.length === 0) return;

    const overlaps = (zones: HTMLElement[], top: number, bottom: number) => {
      for (const z of zones) {
        const r = z.getBoundingClientRect();
        if (r.top <= bottom && r.bottom >= top) return true;
      }
      return false;
    };

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const h = window.innerHeight;
      const bandTop = h * 0.3;
      const bandBottom = h * 0.7;
      let next: Theme = base;
      if (overlaps(lightZones, bandTop, bandBottom)) next = "light";
      else if (overlaps(darkZones, bandTop, bandBottom)) next = "dark";
      setTheme((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [base]);

  const light = theme === "light";
  const surface = light ? "bg-white text-[#171717]" : "bg-[#161616] text-white";

  return (
    <>
      <PortfolioShell
        sidebarTheme={light ? "light" : "tiktok-tv"}
        mainClassName={`transition-colors duration-500 ${surface}`}
        contentClassName={`min-w-0 transition-colors duration-500 ${surface}`}
        rootBg={light ? "#ffffff" : "#161616"}
      >
        <div className="cs-page-fade" data-cs-theme={light ? "light" : undefined}>
          {children}
        </div>
      </PortfolioShell>
      <NextSectionButton theme={light ? "light" : "dark"} />
    </>
  );
}
