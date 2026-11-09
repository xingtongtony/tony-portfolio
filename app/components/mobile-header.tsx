"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { TonyLogo } from "../tony-logo";
import { SidebarProjects } from "./sidebar-projects";
import { EMAIL_HREF, EXTERNAL_LINKS } from "../lib/site-links";

/** The shell's per-page palette (see PortfolioShell `sidebarThemes`). */
export type ShellTheme = {
  panel: string;
  logo: string;
  muted: string;
  nav: string;
  navHover: string;
  status: string;
  copyright: string;
  /** Header surface once the page has scrolled (frosted page colour). */
  bar: string;
  /** Full-screen menu surface — the sidebar panel colour. */
  sheet: string;
  tone: "dark" | "light";
};

const EASE = [0.22, 1, 0.36, 1] as const;

// The Menu and Close pills sit in the same spot with the same box, so opening
// the sheet reads as one control changing state, not a new one appearing.
const PILL =
  "inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium transition";

/**
 * Below lg the desktop sidebar is replaced by this: a borderless header row
 * (logo · "● Menu") that slides away while you scroll down and comes back on
 * the way up, and a full-screen sheet holding the sidebar's own content — the
 * project list with its active state, LinkedIn / About, availability.
 *
 * - The header is transparent at the top of the page and turns into a frosted
 *   strip of the page colour once you scroll (`theme.bar`).
 * - The sheet is open only for the path it was opened on, so any navigation —
 *   a tapped project, the back gesture — closes it without an effect.
 * - While open: page scroll is locked, Escape closes, Tab stays inside, and
 *   focus returns to the Menu button on close. Widening past lg closes it.
 */
export function MobileHeader({ theme }: { theme: ShellTheme }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const open = openPath === pathname;
  const close = () => setOpenPath(null);

  // Hide on the way down, show on the way up. Small jitters (< 8px) and the
  // first 80px of the page never hide it.
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y < 80) {
        setHidden(false);
        lastY = y;
        return;
      }
      const dy = y - lastY;
      if (Math.abs(dy) < 8) return;
      setHidden(dy > 0);
      lastY = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenPath(null);
        return;
      }
      if (e.key !== "Tab" || !sheetRef.current) return;
      const items = sheetRef.current.querySelectorAll<HTMLElement>("a[href], button");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => {
      if (wide.matches) setOpenPath(null);
    };
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    const menuButton = menuRef.current;
    return () => {
      html.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      menuButton?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-[translate,background-color,border-color] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          hidden && !open ? "-translate-y-full" : ""
        } ${scrolled ? `${theme.bar} backdrop-blur-xl backdrop-saturate-150` : "border-transparent"}`}
      >
        <div className="flex h-14 items-center justify-between px-6 sm:px-10">
          <Link href="/" className={`-m-2 block p-2 ${theme.logo}`} aria-label="Tony Xing">
            <TonyLogo />
          </Link>
          <button
            ref={menuRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpenPath(pathname)}
            className={`${PILL} ${theme.status}`}
          >
            <span className="availability-dot" aria-hidden="true" />
            Menu
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="site-menu"
            id="site-menu"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: EASE }}
            className={`fixed inset-0 z-50 flex flex-col overflow-y-auto lg:hidden ${theme.sheet}`}
          >
            <div className="flex h-14 shrink-0 items-center justify-between px-6 sm:px-10">
              <Link href="/" onClick={close} className={`-m-2 block p-2 ${theme.logo}`} aria-label="Tony Xing">
                <TonyLogo />
              </Link>
              <button ref={closeRef} type="button" onClick={close} className={`${PILL} ${theme.status}`}>
                <X className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                Close
              </button>
            </div>

            <motion.nav
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05, ease: EASE }}
              className="flex flex-1 flex-col px-6 pb-8 pt-8 sm:px-10"
              aria-label="Site"
            >
              <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${theme.nav}`}>
                Work
              </p>
              <SidebarProjects tone={theme.tone} size="sheet" onNavigate={close} />

              <div className="mt-auto flex flex-col gap-5 pt-14">
                <div className="flex flex-wrap gap-x-6">
                  {EXTERNAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${theme.nav} ${theme.navHover}`}
                    >
                      {link.label}
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <a
                    href={EMAIL_HREF}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-medium transition ${theme.status}`}
                  >
                    <span className="availability-dot" aria-hidden="true" />
                    Available to connect
                  </a>
                  <p className={`text-[11px] ${theme.copyright}`}>© 2026 Tony Xing</p>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
