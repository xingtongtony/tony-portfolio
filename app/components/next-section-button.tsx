"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Section = { el: HTMLElement; title: string };

const EASE = [0.22, 1, 0.36, 1] as const;

// Pill chrome per surface: dark frosted (case studies) / light frosted (home).
const THEME = {
  dark: "border-white/12 bg-white/[0.06] text-white/85 shadow-[0_10px_32px_rgba(0,0,0,0.4)] hover:border-white/20 hover:bg-white/[0.1] hover:text-white",
  light: "border-black/[0.08] bg-white/70 text-black/70 shadow-[0_10px_32px_rgba(35,29,16,0.14)] hover:border-black/20 hover:bg-white/90 hover:text-black",
} as const;

/**
 * Floating glassmorphic button anchored at the bottom of the case study
 * canvas. Auto-detects each `<section>` with an H2 inside the page's
 * `<article>`, tracks which section is currently active via
 * IntersectionObserver, and points the user at the next one.
 *
 * Click → smooth scroll to that next section.
 *
 * Visual style: dark frosted pill (`backdrop-filter: blur + saturate`).
 * Motion: pill itself fades + lifts on mount; the title text inside
 * crossfades each time the active section changes.
 */
export function NextSectionButton({
  theme = "dark",
  rootSelector = "article",
}: {
  theme?: "dark" | "light";
  rootSelector?: string;
} = {}) {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  // True while the pill overlaps a bright/light surface (marked `data-pill-invert`
  // or a `.screen-shadow` light image) — flip the pill to its light variant so
  // the dark frosted chrome stays legible on top of white imagery.
  const [overLight, setOverLight] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const sectionEls = Array.from(
      root.querySelectorAll("section[data-case-section]"),
    );
    const list: Section[] = sectionEls
      .map((el) => {
        const h2 = el.querySelector("h2");
        return h2
          ? { el: el as HTMLElement, title: h2.textContent?.trim() ?? "" }
          : null;
      })
      .filter((s): s is Section => s !== null && s.title.length > 0);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSections(list);
    if (list.length === 0) return;

    // Scroll-driven detection. IntersectionObserver with a thin band can
    // miss short sections (the band passes through them before any callback
    // fires). A direct rAF-throttled scroll handler is simpler and reliable:
    // "active" = the last section whose top has crossed the upper-third
    // trigger line. Sections are in document order, so we can break early.
    let rafId = 0;
    const update = () => {
      rafId = 0;
      const triggerY = window.innerHeight * 0.35;
      let active = -1;
      for (let i = 0; i < list.length; i++) {
        if (list[i].el.getBoundingClientRect().top <= triggerY) {
          active = i;
        } else {
          break;
        }
      }
      // If the user has reached the bottom of the page, force-mark the last
      // section as active. Otherwise a short final section may never be able
      // to scroll its top past the trigger line (there isn't enough page below
      // it), leaving the button perpetually pointed at it.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) active = list.length - 1;
      setActiveIdx((prev) => (prev === active ? prev : active));

      // Is a bright/light surface directly behind the pill? Sample a few points
      // across the pill and look at the topmost element that isn't the pill (or
      // one of its ancestors). If it sits inside a light region, invert the pill.
      const btn = btnRef.current;
      if (btn) {
        const r = btn.getBoundingClientRect();
        const cy = r.top + r.height / 2;
        let light = false;
        for (const x of [r.left + 12, (r.left + r.right) / 2, r.right - 12]) {
          for (const el of document.elementsFromPoint(x, cy)) {
            if (el === btn || btn.contains(el) || el.contains(btn)) continue;
            light = !!el.closest("[data-pill-invert], .screen-shadow");
            break; // only the topmost surface behind the pill matters
          }
          if (light) break;
        }
        setOverLight((prev) => (prev === light ? prev : light));
      }
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
  }, [rootSelector]);

  const nextSection = sections[activeIdx + 1];
  const activeTheme = overLight ? "light" : theme;

  const handleClick = () => {
    if (!nextSection) return;
    nextSection.el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 sm:bottom-8">
      <AnimatePresence>
        {nextSection && (
          <motion.button
            key="next-section-btn"
            ref={btnRef}
            onClick={handleClick}
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.94 }}
            transition={{ duration: 0.45, ease: EASE }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96, y: 0 }}
            aria-label={`Skip to next section: ${nextSection.title}`}
            className={`pointer-events-auto inline-flex items-center gap-3 rounded-full border py-2.5 pr-4 pl-5 text-sm font-medium backdrop-blur-xl backdrop-saturate-150 transition-colors ${THEME[activeTheme]}`}
          >
            <span className="relative block min-w-0">
              {/* Invisible width-reserver so the pill stays a stable size
                  while the visible label crossfades inside. */}
              <span aria-hidden="true" className="block whitespace-nowrap opacity-0">
                {nextSection.title}
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={nextSection.title}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="absolute inset-0 block whitespace-nowrap"
                >
                  {nextSection.title}
                </motion.span>
              </AnimatePresence>
            </span>
            <motion.svg
              viewBox="0 0 24 24"
              fill="currentColor"
              width="14"
              height="14"
              aria-hidden="true"
              className="shrink-0"
              animate={{ y: [0, 2, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Material Design — arrow_downward */}
              <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
            </motion.svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
