"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Box, LayoutGrid } from "lucide-react";
import { engine } from "./blueprint/engine";
import { PROJECTS, type Project } from "../lib/projects";
import { getHomeView, point, switchHomeView, useHomeView, usePointed, type HomeView } from "../lib/home-view";

/**
 * The project list of the navigation: the panel beside every page from lg,
 * and the full-screen menu on phones. Two designs, one list.
 *
 * `sidebar` — THE INDEX. The panel always says where you are:
 * - On the homepage it is the blueprint stage's index. All eleven projects,
 *   numbered; the one on stage is marked; resting the pointer on a row brings
 *   its figure on stage; clicking opens the case study. (A project whose case
 *   study is not written yet says "Soon", and clicking it only shows the
 *   figure.) The stage has no index of its own.
 * - The homepage has a second view, Tony's cards (app/lib/home-view.ts), and
 *   the switch between the two sits on the index's own "Work" line — the one
 *   place that is on screen, and in the same spot, in both. In the cards view
 *   the index points instead of driving: resting on a row lights its card and
 *   scrolls it into sight, and the card under the pointer marks its row.
 * - On a case study it marks the case study being read, and under that row
 *   lists the case study's own sections, the one on screen marked — the same
 *   "where am I", one level down, since there is no stage to point at. Only
 *   projects with a case study are listed there.
 * - On any other page (About) it is the list of case studies, nothing marked.
 *
 * `sheet` — the phone menu: finger-sized rows at title scale, a hand-drawn
 * squiggle under the row of the case study being read. Touch screens never
 * hover, so idle rows start near full strength or they read as disabled.
 *
 * Active matching: a project with `match` is active when the pathname starts
 * with that prefix (every TikTok TV sub-page keeps "TikTok TV Revamp" lit);
 * otherwise on an exact href match. Client component for `usePathname`.
 */

type Tone = "dark" | "light";
type Size = "sidebar" | "sheet";

const isActive = (p: Project, pathname: string) => (p.match ? pathname.startsWith(p.match) : !!p.href && pathname === p.href);

export function SidebarProjects({
  tone = "dark",
  size = "sidebar",
  onNavigate,
}: {
  tone?: Tone;
  size?: Size;
  /** Called when a row is tapped — the mobile menu closes itself with it. */
  onNavigate?: () => void;
} = {}) {
  return size === "sheet" ? <SheetList tone={tone} onNavigate={onNavigate} /> : <IndexList tone={tone} />;
}

// ── The index (panel, from lg) ──────────────────────────────────────────────

const INK = {
  light: {
    label: "text-black/40",
    on: "bg-white/70 text-[#151515]",
    idle: "text-black/50 hover:text-black",
    soon: "text-black/35 hover:text-black/60",
    number: "text-black/35",
    numberOn: "text-black/70",
    tag: "text-black/35",
    rule: "border-black/10",
    mark: "border-black/40",
    sectionOn: "text-[#151515]",
    sectionIdle: "text-black/45 hover:text-black",
  },
  dark: {
    label: "text-white/40",
    on: "bg-white/[0.09] text-white",
    idle: "text-white/50 hover:text-white",
    soon: "text-white/30 hover:text-white/55",
    number: "text-white/30",
    numberOn: "text-white/65",
    tag: "text-white/30",
    rule: "border-white/12",
    mark: "border-white/45",
    sectionOn: "text-white",
    sectionIdle: "text-white/45 hover:text-white",
  },
};

const subscribeFocus = (listener: () => void) => {
  engine.focusListeners.add(listener);
  return () => {
    engine.focusListeners.delete(listener);
  };
};

const VIEWS: { id: HomeView; label: string; Icon: typeof Box }[] = [
  { id: "stage", label: "Stage view", Icon: Box },
  { id: "cards", label: "Cards view", Icon: LayoutGrid },
];

/**
 * Stage or cards. Two icons and a thumb, on the index's "Work" line and no
 * taller than it. Which side is lit comes from `<html data-home-view>` in CSS
 * (globals.css), like the views themselves, so it is right before React is.
 */
function ViewSwitch() {
  const view = useHomeView();
  return (
    <div role="group" aria-label="Show the work as" className="view-switch relative -my-[5px] -mr-1 flex rounded-full bg-black/[0.055] p-0.5">
      <span aria-hidden="true" className="view-switch-thumb pointer-events-none absolute left-0.5 top-0.5 h-5 w-7 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.14)]" />
      {VIEWS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          data-view={id}
          aria-pressed={view === id}
          aria-label={label}
          title={label}
          onClick={() => switchHomeView(id)}
          className="relative flex h-5 w-7 items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-1"
        >
          <Icon className="size-3" strokeWidth={2.2} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

function IndexList({ tone }: { tone: Tone }) {
  const pathname = usePathname();
  const home = pathname === "/";
  const ink = INK[tone];
  // The figure on stage (homepage only; null until the stage is up).
  const onStage = useSyncExternalStore(
    subscribeFocus,
    () => engine.focus,
    () => null,
  );
  // The homepage's other view: the cards. There the index points at a card
  // rather than bringing a figure on, and the card under the pointer points back.
  const cards = useHomeView() === "cards" && home;
  const pointed = usePointed();
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    if (!home || pointed?.from !== "card") return;
    revealInPanel(list.current?.querySelector<HTMLElement>(`[data-project="${pointed.id}"]`) ?? null, true);
  }, [home, pointed]);
  // Asked at the moment of acting, not of rendering: the view may have changed
  // while the pointer was resting.
  const show = (id: string) => {
    if (getHomeView() === "cards") point({ id, from: "index" });
    else engine.select?.(id);
  };
  // Resting on a row, not brushing past it, brings its figure on.
  const timer = useRef(0);
  const rest = (id: string) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => show(id), 160);
  };
  const leave = () => {
    window.clearTimeout(timer.current);
    if (getHomeView() === "cards") point(null);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const rows = home ? PROJECTS : PROJECTS.filter((p) => p.href);
  return (
    <div className="hidden pb-7 pt-10 lg:block">
      <div className="flex items-center justify-between">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${ink.label}`}>Work</p>
        {home ? <ViewSwitch /> : null}
      </div>
      {/* Pulled out by the rows' own padding, so the numbers line up with the
          logo and the mark of the current row reaches a little past the text. */}
      <ol ref={list} className="-mx-2 mt-2 flex flex-col" onPointerLeave={home ? leave : undefined}>
        {rows.map((p) => {
          const on = cards ? pointed?.id === p.id : home ? (onStage ?? PROJECTS[0].id) === p.id : isActive(p, pathname);
          const row = `group flex w-full items-center gap-3 rounded-xl px-2 py-[7px] text-left text-[13px] tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 ${
            on ? ink.on : p.href ? ink.idle : ink.soon
          }`;
          const inner = (
            <>
              <span className={`w-5 shrink-0 text-[10px] font-semibold tabular-nums tracking-[0.08em] ${on ? ink.numberOn : ink.number}`}>
                {String(PROJECTS.indexOf(p) + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 truncate">{p.title}</span>
              {p.href ? (
                <ArrowUpRight className={`size-3.5 shrink-0 transition-opacity duration-200 ${on ? "opacity-60" : "opacity-0 group-hover:opacity-60"}`} aria-hidden="true" />
              ) : (
                <span className={`shrink-0 text-[9px] font-semibold uppercase tracking-[0.12em] ${ink.tag}`}>Soon</span>
              )}
            </>
          );
          return (
            <li key={p.id} data-project={p.id}>
              {p.href ? (
                <Link
                  href={p.href}
                  aria-label={`Open ${p.title} case study`}
                  // In the cards view a lit row is only pointed at: nothing is "current".
                  aria-current={on && !cards ? (home ? "true" : "page") : undefined}
                  data-cursor={home ? "view" : undefined}
                  onPointerEnter={home ? () => rest(p.id) : undefined}
                  onFocus={home ? () => show(p.id) : undefined}
                  onBlur={home ? leave : undefined}
                  className={row}
                >
                  {inner}
                </Link>
              ) : (
                <button
                  type="button"
                  aria-pressed={on}
                  onPointerEnter={() => rest(p.id)}
                  onFocus={() => show(p.id)}
                  onBlur={leave}
                  onClick={() => show(p.id)}
                  className={row}
                >
                  {inner}
                </button>
              )}
              {on && !home ? <Sections tone={tone} /> : null}
              {on && !home ? <KeepInView /> : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Inside the panel's scrolling index only: never moves the page. */
function revealInPanel(el: HTMLElement | null, smooth: boolean) {
  const panel = el?.closest<HTMLElement>("[data-panel-index]");
  if (!el || !panel || panel.scrollHeight <= panel.clientHeight) return;
  const box = panel.getBoundingClientRect();
  const row = el.getBoundingClientRect();
  // Clear of the fades at the two edges.
  const over = row.top - (box.top + 34);
  const under = row.bottom - (box.bottom - 44);
  const by = over < 0 ? over : under > 0 ? under : 0;
  if (by !== 0) panel.scrollBy({ top: by, behavior: smooth ? "smooth" : "auto" });
}

/** On a short window the row of the case study being read may start out of sight. */
function KeepInView() {
  const mark = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    revealInPanel(mark.current?.parentElement ?? null, false);
  }, []);
  return <span ref={mark} hidden />;
}

type SectionMark = { el: HTMLElement; title: string };

/**
 * The sections of the case study being read, under its row: which one is on
 * screen, and a way to jump to another. Found the same way the "next
 * section" pill finds them — every `section[data-case-section]` with an h2.
 */
function Sections({ tone }: { tone: Tone }) {
  const ink = INK[tone];
  const [sections, setSections] = useState<SectionMark[]>([]);
  const [current, setCurrent] = useState(-1);
  const rows = useRef<(HTMLButtonElement | null)[]>([]);
  // As the page scrolls on, the section being read stays in sight in the panel.
  useEffect(() => {
    revealInPanel(rows.current[current] ?? null, true);
  }, [current]);

  useEffect(() => {
    const found = Array.from(document.querySelectorAll<HTMLElement>("article section[data-case-section]"))
      .map((el) => ({ el, title: el.querySelector("h2")?.textContent?.trim() ?? "" }))
      .filter((s) => s.title.length > 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSections(found);
    if (found.length === 0) return;

    // The section on screen is the last one whose top has passed a line a
    // third of the way down; at the very bottom of the page it is the last.
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let at = -1;
      for (let i = 0; i < found.length; i++) {
        if (found[i].el.getBoundingClientRect().top <= line) at = i;
        else break;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) at = found.length - 1;
      setCurrent((before) => (before === at ? before : at));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  if (sections.length < 2) return null;
  return (
    // The rule hangs from the middle of the row's number (its two digits run
    // from 8px to 21.3px, so 14px puts the 1px line on their centre), and the
    // section titles start where the project titles do (40px).
    <ol className={`mb-1.5 ml-[14px] mt-1 flex flex-col border-l ${ink.rule}`} aria-label="Sections of this case study">
      {sections.map((section, i) => (
        <li key={section.title}>
          <button
            ref={(el) => {
              rows.current[i] = el;
            }}
            type="button"
            onClick={() => section.el.scrollIntoView({ behavior: "smooth", block: "start" })}
            aria-current={i === current ? "true" : undefined}
            className={`-ml-px block w-full truncate border-l py-1 pl-[26px] pr-2 text-left text-[12px] leading-[17px] tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 ${
              // The section being read: its stretch of the rule a shade
              // darker, not black — a mark, not a scrollbar.
              i === current ? `${ink.mark} ${ink.sectionOn}` : `border-transparent ${ink.sectionIdle}`
            }`}
          >
            {section.title}
          </button>
        </li>
      ))}
    </ol>
  );
}

// ── The phone menu ──────────────────────────────────────────────────────────

// Irregular hand-drawn squiggle (uneven control points).
const SQUIGGLE = "M2 7C16 3 30 10 46 6 62 2 78 9 98 5";

function SheetList({ tone, onNavigate }: { tone: Tone; onNavigate?: () => void }) {
  const pathname = usePathname();
  const activeColor = tone === "light" ? "text-black" : "text-white";
  const idleColor =
    tone === "light"
      ? "text-black/80 group-hover:translate-x-0.5 group-hover:text-black"
      : "text-white/80 group-hover:translate-x-0.5 group-hover:text-white";
  return (
    // max-w keeps the active row's arrow next to its title on a wide tablet
    // instead of out at the screen edge. Hovering a row (a tablet with a
    // pointer) dims its siblings and draws the squiggle in.
    <ul className="group/list mt-4 flex max-w-sm flex-col sm:max-w-md">
      {PROJECTS.filter((p) => p.href).map((p) => {
        const active = isActive(p, pathname);
        return (
          <li key={p.id}>
            <Link
              href={p.href!}
              className={`group flex items-center gap-3 py-2.5 transition-opacity duration-300 sm:py-3 ${
                active ? "" : "group-hover/list:opacity-40 hover:!opacity-100"
              }`}
              aria-label={`Open ${p.title} case study`}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
            >
              <span
                className={`relative whitespace-nowrap text-[1.375rem] font-medium leading-[1.2] tracking-[-0.02em] transition-all duration-300 sm:text-[1.75rem] ${
                  active ? activeColor : idleColor
                }`}
              >
                {p.title}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  className={`pointer-events-none absolute -bottom-[5px] left-0 h-[9px] w-full origin-left overflow-visible transition-all duration-500 ease-out ${
                    active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                  }`}
                >
                  <path d={SQUIGGLE} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                </svg>
              </span>
              <span
                className={`ml-auto flex shrink-0 items-center leading-none transition-all duration-300 ${
                  active ? "translate-x-0 text-[#3b82f6]" : "translate-x-1 text-transparent group-hover:translate-x-0 group-hover:text-[#3b82f6]"
                }`}
              >
                <ArrowUpRight className="size-5" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
