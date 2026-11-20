"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { StaggerGrid, StaggerItem } from "./motion";
import { getGreeting } from "./hero-intro";
import { PROJECTS, type Project } from "../lib/projects";
import { WORK_CARDS, type WorkCard } from "../lib/work-cards";
import { point, usePointed } from "../lib/home-view";

/**
 * Tony's hand-made cards, all eleven at once — the whole sheet of figures,
 * where the stage shows one at a time. The same cards at every width:
 *
 * - `HomeCards` — the cards view of the desktop homepage (app/lib/home-view.ts),
 *   under the stage's statement, word for word and in the same place, so
 *   switching views changes what is under it and nothing else.
 * - `WorkGrid` alone — the Work section of the phone and tablet homepage,
 *   under the sticker hero.
 *
 * - The cards stand in a waterfall: one column on a phone; from two columns,
 *   every other column starts lower. They are in the order of the index, and
 *   each is captioned with its figure number, as the drawings on the stage
 *   are; one whose case study is not written yet says "Soon" from the start.
 * - A card is an object: under a mouse it leans towards the pointer and
 *   catches the light, and one that opens a case study also lifts. Under a
 *   finger it presses in, and the ↗ that a mouse brings out is always there.
 * - On the desktop the navigation panel's index and the cards point at each
 *   other (`linked`). Resting on a row lights its card, dims the rest and
 *   scrolls it into sight; the card under the pointer marks its row.
 */

const SERIF = { fontFamily: "var(--font-serif), Georgia, serif" };
const LABEL = "text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45";
/** How far a card leans, in degrees, with the pointer at its edge. */
const LEAN = 3.2;

const CARDS = PROJECTS.flatMap((project, i) => {
  const card = WORK_CARDS.find((c) => c.id === project.id);
  return card ? [{ project, card, n: i + 1 }] : [];
});

/** Italic serif connective of the statement, overlapping its bold neighbours (as on the stage). */
function I({ children }: { children: ReactNode }) {
  return (
    <span className="relative z-10 -ml-[0.22em] -mr-[0.14em] font-medium normal-case italic tracking-[-0.03em]" style={SERIF}>
      {children}
    </span>
  );
}

export function HomeCards() {
  const [greeting, setGreeting] = useState("Hello");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  // While the stage is showing, the cards are in the page but not displayed,
  // and a lazy image that is not displayed is never fetched. Once the stage
  // has had the network to itself for a while, fetch them, so that switching
  // to the cards does not wait for eleven pictures. (Desktop only: phones
  // have no cards view.)
  const [warm, setWarm] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const timer = window.setTimeout(() => setWarm(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    // The stage's statement starts 32px down the page; so does this one (the
    // page column brings 12px of that).
    <div className="mx-auto w-full max-w-[1280px] pb-24 pt-5">
      <header style={{ mixBlendMode: "multiply" }}>
        <p className={LABEL}>
          {greeting} — I&apos;m Tony<span className="mx-2.5 text-black/20">/</span>
          <span className="text-black/75">A Staff Product Designer</span>
        </p>
        <h1
          className="-ml-[0.05em] mt-5 text-[clamp(1.9rem,3.6vw,3.4rem)] font-black uppercase leading-[0.92] tracking-[-0.065em] text-[#151515]"
          style={{ WebkitTextStroke: "0.045em #ffffff", paintOrder: "stroke" }}
        >
          Shaping interfaces<I>for</I> millions
        </h1>
        <p className="mt-5 text-[13px] font-medium leading-none tracking-[-0.01em] text-black/50">
          <span className="text-black/80">10+ years</span> at TikTok, Airbnb, CloudKitchens{" "}
          <span className="text-[1.25em] font-medium italic leading-none text-black/60" style={SERIF}>
            &amp;
          </span>{" "}
          DiDi
        </p>
      </header>

      <WorkGrid linked eager={warm} className="mt-14" />
    </div>
  );
}

/**
 * The eleven cards in their waterfall. Its columns follow its own width
 * (container queries in globals.css), so it is the same grid in the desktop
 * cards view and in the phone page.
 */
export function WorkGrid({ linked = false, eager = false, className = "" }: { linked?: boolean; eager?: boolean; className?: string }) {
  const shared = usePointed();
  // Only the desktop grid answers the index (there is no index beside the
  // phone one).
  const pointed = linked ? shared : null;
  // Crossing the gap between two cards is not leaving the cards.
  const away = useRef(0);
  const enter = (id: string) => {
    if (!linked) return;
    window.clearTimeout(away.current);
    point({ id, from: "card" });
  };
  const leave = () => {
    if (!linked) return;
    window.clearTimeout(away.current);
    away.current = window.setTimeout(() => point(null), 140);
  };
  useEffect(() => {
    if (!linked) return;
    return () => {
      window.clearTimeout(away.current);
      point(null);
    };
  }, [linked]);

  return (
    <div data-pointing={pointed?.from} className={`cards-room ${className}`}>
      <StaggerGrid className="cards-grid">
        {CARDS.map(({ project, card, n }, i) => (
          <StaggerItem key={project.id} index={i}>
            <Card
              project={project}
              card={card}
              n={n}
              eager={eager}
              on={pointed?.id === project.id}
              from={pointed?.id === project.id ? pointed.from : null}
              onEnter={enter}
              onLeave={leave}
            />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
}

function Card({
  project,
  card,
  n,
  eager,
  on,
  from,
  onEnter,
  onLeave,
}: {
  project: Project;
  card: WorkCard;
  n: number;
  eager: boolean;
  on: boolean;
  from: "card" | "index" | null;
  onEnter: (id: string) => void;
  onLeave: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  // Pointed at from the index: come into sight, clear of the window's edges.
  useEffect(() => {
    if (from !== "index" || !root.current) return;
    const box = root.current.getBoundingClientRect();
    if (box.top >= 20 && box.bottom <= window.innerHeight - 20) return;
    root.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [from]);

  const lean = (e: PointerEvent<HTMLDivElement>) => {
    const el = body.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Measured on the wrapper, which stays put while the card leans.
    const box = e.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
    const y = Math.min(1, Math.max(0, (e.clientY - box.top) / box.height));
    window.cancelAnimationFrame(frame.current);
    frame.current = window.requestAnimationFrame(() => {
      el.style.setProperty("--lean-x", `${((0.5 - y) * 2 * LEAN).toFixed(2)}deg`);
      el.style.setProperty("--lean-y", `${((x - 0.5) * 2 * LEAN).toFixed(2)}deg`);
      el.style.setProperty("--light-x", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--light-y", `${(y * 100).toFixed(1)}%`);
    });
  };
  const settle = () => {
    window.cancelAnimationFrame(frame.current);
    for (const name of ["--lean-x", "--lean-y", "--light-x", "--light-y"]) body.current?.style.removeProperty(name);
    onLeave();
  };
  useEffect(() => () => window.cancelAnimationFrame(frame.current), []);

  const style = { "--card-hover": card.hoverColor, "--card-glow": card.glowColor } as CSSProperties;
  const inner = (
    <div ref={body} className="work-card-body">
      <div className="work-card-halo" aria-hidden="true" />
      <div className="work-card-frame">
        <Image
          src={card.image}
          alt={`${project.title} card`}
          // Sized by the frame (h-full w-full), not `fill`: while the stage is
          // showing this is not displayed, and `fill` warns about every
          // picture it finds with no height.
          width={1600}
          height={1880}
          loading={eager ? "eager" : "lazy"}
          // Desktop: four columns from a 1652px window, three from 1160px,
          // two below. Phone and tablet: two columns from 600px, one below.
          sizes="(min-width: 1652px) 302px, (min-width: 1160px) 24vw, (min-width: 1024px) 34vw, (min-width: 600px) 46vw, 100vw"
          className="h-full w-full object-cover object-top"
        />
        <div className="work-card-light" aria-hidden="true" />
      </div>
    </div>
  );

  return (
    <div
      ref={root}
      data-on={on ? "" : undefined}
      data-open={project.href ? "" : undefined}
      style={style}
      className="work-card group"
      // A finger on a card is a tap on its way, not pointing: it neither
      // marks the index nor leans the card.
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") onEnter(project.id);
      }}
      onPointerMove={lean}
      onPointerLeave={settle}
    >
      {project.href ? (
        <Link
          href={project.href}
          aria-label={`Open ${project.title} case study`}
          data-cursor="view"
          onFocus={() => onEnter(project.id)}
          onBlur={onLeave}
          className="block rounded-[1.25rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717]"
        >
          {inner}
        </Link>
      ) : (
        <article aria-label={`${project.title} — case study coming soon`}>{inner}</article>
      )}
      {/* The figure number, as under a drawing on the stage; and what the index says beside the same project. */}
      <p className="mt-3.5 flex items-center justify-between px-1" aria-hidden="true">
        <span className="work-card-fig text-[14px] italic leading-none" style={SERIF}>
          Fig. {n}
        </span>
        {project.href ? (
          <ArrowUpRight className="work-card-arrow size-3.5" />
        ) : (
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40">Soon</span>
        )}
      </p>
    </div>
  );
}
