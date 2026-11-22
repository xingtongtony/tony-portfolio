"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "../lib/projects";
import { STILLS, STILL_VERSION } from "../lib/stage-stills";
import { WorkGrid } from "./home-cards";
import { play } from "../lib/sound";

/**
 * The homepage's Work on phones and tablets, where the 3D stage is not loaded.
 * The same two views the desktop has (app/lib/home-view.ts), as a switch:
 *
 * - Models — the stage's figures as stills rendered from the stage itself, one
 *   at a time in a row you swipe, each with its reference numerals where its
 *   leader lines end and its caption on the figure's own paper colour. A
 *   figure "lands" the first time it comes into view: the still settles, then
 *   its numerals appear. Reduced motion: it is simply there.
 * - Cards — Tony's hand-made cards (WorkGrid).
 */

const ITEMS = STILLS.map((s) => ({ ...s, project: PROJECTS.find((p) => p.id === s.id)! }));

export function HomeMobileWork() {
  const [view, setView] = useState<"models" | "cards">("models");
  return (
    <section id="work" data-case-section className="scroll-mt-8 py-10 lg:hidden">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
        <div>
          <p className="section-label">Work</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">Case studies</h2>
        </div>
        <div role="tablist" aria-label="How to show the work" className="inline-flex rounded-full bg-black/[0.05] p-1 text-[13px] font-semibold">
          {(["models", "cards"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              aria-controls={`work-${v}`}
              onClick={() => {
                if (v !== view) play(v === "cards" ? "toggle-on" : "toggle-off");
                setView(v);
              }}
              className={`rounded-full px-4 py-2 capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                view === v ? "bg-white text-black shadow-[0_1px_3px_rgba(0,0,0,0.12)]" : "text-black/50"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div id="work-models" role="tabpanel" hidden={view !== "models"}>
        <Carousel />
      </div>
      <div id="work-cards" role="tabpanel" hidden={view !== "cards"}>
        <WorkGrid />
      </div>
    </section>
  );
}

function Carousel() {
  const track = useRef<HTMLOListElement>(null);
  const [index, setIndex] = useState(0);
  const shown = useRef(0); // the card in front, for the snap's tick
  const [landed, setLanded] = useState<Set<number>>(() => new Set([0]));

  // Which card is in front, and which have been seen (they land once).
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = Number((entry.target as HTMLElement).dataset.i);
          if (shown.current !== i) {
            shown.current = i;
            play("tick");
          }
          setIndex(i);
          setLanded((s) => (s.has(i) ? s : new Set(s).add(i)));
        }
      },
      { root: el, threshold: 0.6 },
    );
    el.querySelectorAll("[data-i]").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>(`[data-i="${Math.max(0, Math.min(ITEMS.length - 1, i))}"]`);
    if (!el || !card) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <div>
      <ol
        ref={track}
        aria-label="Figures"
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-2 [scrollbar-width:none] sm:-mx-10 sm:scroll-px-10 sm:px-10"
      >
        {ITEMS.map((it, i) => (
          <li key={it.id} data-i={i} className="w-[84%] shrink-0 snap-start sm:w-[56%] md:w-[46%]">
            <Figure item={it} landed={landed.has(i)} priority={i === 0} />
          </li>
        ))}
      </ol>

      <div className="mt-5 flex items-center gap-4">
        <span className="font-mono text-xs tabular-nums text-black/50">
          {String(index + 1).padStart(2, "0")} / {ITEMS.length}
        </span>
        <span aria-hidden className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-black/[0.08]">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-black transition-[width] duration-300 ease-out motion-reduce:transition-none"
            style={{ width: `${((index + 1) / ITEMS.length) * 100}%` }}
          />
        </span>
        <span className="flex gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous figure"
            className="grid size-9 place-items-center rounded-full border border-black/12 text-black/70 transition-colors enabled:hover:border-black enabled:hover:text-black disabled:opacity-30"
          >
            <ArrowLeft className="size-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === ITEMS.length - 1}
            aria-label="Next figure"
            className="grid size-9 place-items-center rounded-full border border-black/12 text-black/70 transition-colors enabled:hover:border-black enabled:hover:text-black disabled:opacity-30"
          >
            <ArrowRight className="size-4" strokeWidth={2.25} />
          </button>
        </span>
      </div>
    </div>
  );
}

function Figure({ item, landed, priority }: { item: (typeof ITEMS)[number]; landed: boolean; priority: boolean }) {
  const { project } = item;
  const soon = !project.href;
  const body = (
    <>
      <div className="relative aspect-square overflow-hidden" style={{ background: item.paper }}>
        <Image
          src={`/portfolio/stage/${item.id}-v${STILL_VERSION}.jpg`}
          alt={`${item.fig}: ${project.title}, a clay model of the project`}
          width={1200}
          height={1200}
          sizes="(min-width: 768px) 46vw, (min-width: 640px) 56vw, 84vw"
          priority={priority}
          className={`still h-full w-full object-cover ${landed ? "still-landed" : ""}`}
        />
        {/* Reference numerals, where the leader lines in the still end. */}
        {item.labels.map(([n, x, y], k) => (
          <span
            key={n}
            aria-hidden
            className={`still-label absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] tabular-nums text-black/70 sm:text-[11px] ${landed ? "still-landed" : ""}`}
            style={{ left: `${x * 100}%`, top: `${y * 100}%`, "--k": k } as CSSProperties}
          >
            {n}
          </span>
        ))}
        {soon ? <span className="absolute right-4 top-3.5 rounded-full bg-black/[0.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/55">Soon</span> : null}
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4" style={{ background: item.paper }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-black/45">{item.fig}</p>
        <h3 className="mt-1.5 text-lg font-semibold leading-snug tracking-[-0.02em]">{project.title}</h3>
        <p className="mt-1.5 text-sm leading-[1.5] text-black/60">{item.desc}</p>
        <p className="mt-auto pt-3 text-[13px] font-semibold text-black/80">
          {soon ? (
            <span className="text-black/40">Case study coming soon</span>
          ) : (
            <span className="inline-flex items-center gap-1">
              View case study <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={2.25} />
            </span>
          )}
        </p>
      </div>
    </>
  );
  const shell = "flex h-full flex-col overflow-hidden rounded-[1.5rem] ring-1 ring-black/[0.04]";
  return soon ? (
    <div className={shell}>{body}</div>
  ) : (
    <Link href={project.href!} className={`${shell} transition-transform active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black`}>
      {body}
    </Link>
  );
}
