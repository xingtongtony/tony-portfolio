"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Pause, Play, RotateCcw } from "lucide-react";
import { engine, now, setPartBuilt, type BuildItem } from "./engine";
import { AGENTS, FIGURES, INK } from "./figures";
import { getGreeting } from "../hero-intro";

// three.js only runs in the browser, and it is heavy: load the scene as its
// own client-only chunk.
const Scene = dynamic(() => import("./scene"), { ssr: false });

type LogLine = { partId: string; agent: number; label: string; done: boolean };

const SERIF = { fontFamily: "var(--font-serif), Georgia, serif" };

const TRAVEL = 0.5; // seconds an agent takes to reach its part
const STAGGER = 0.25; // seconds between consecutive parts setting off

// The log while building and the result card afterwards share one slot, to the
// right of the figure. It narrows on a narrow stage (container width, because
// the sidebar eats into the viewport).
const PANEL =
  "absolute right-6 top-1/2 z-20 w-[280px] -translate-y-1/2 rounded-[1.25rem] border border-black/[0.06] bg-white/90 p-5 shadow-[0_14px_36px_rgba(35,29,16,0.1)] backdrop-blur-xl @4xl:right-10 @4xl:w-[320px] @4xl:p-6 xl:right-14";

const DESKTOP = "(min-width: 1024px)";
const subscribeDesktop = (onChange: () => void) => {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/** Italic serif connective of the hero statement, overlapping its bold neighbours. */
function I({ children, start = false }: { children: ReactNode; start?: boolean }) {
  return (
    <span
      className={`relative z-10 font-medium normal-case italic tracking-[-0.03em] -mr-[0.14em] ${start ? "" : "-ml-[0.22em]"}`}
      style={SERIF}
    >
      {children}
    </span>
  );
}

/**
 * The homepage's first screen from lg up — "blueprints built by agents".
 *
 * A sheet of patent-style line drawings, one per project. The visitor asks for
 * one (chip, caption or the drawing itself); the five sticker agents fly over
 * and build it part by part into the real object, logging what they do. The
 * visitor can pause, redirect to another drawing mid-build, or reset. When a
 * figure is built, its case study is one click away.
 *
 * The "agents" are choreographed, not a model: the schedule below decides who
 * builds what and when.
 *
 * Below lg the stage is not shown (the page keeps the sticker hero), and the
 * 3D scene — three.js is heavy — is never downloaded there.
 */
export function BlueprintStage() {
  const reducedMotion = useReducedMotion() ?? false;
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP).matches,
    () => false,
  );
  const [greeting, setGreeting] = useState("Hello");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  // Leaving the page drops any build in flight.
  useEffect(
    () => () => {
      engine.build = null;
    },
    [],
  );

  const [ready, setReady] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);
  const [building, setBuilding] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [built, setBuilt] = useState<Record<string, number>>({}); // figure id → seconds it took
  const [log, setLog] = useState<LogLine[]>([]);

  const startBuild = useCallback(
    (figId: string) => {
      const eng = engine;
      const def = FIGURES.find((f) => f.id === figId)!;
      const agentFree = AGENTS.map(() => 0);
      const items: BuildItem[] = def.parts.map((part, i) => {
        const rt = eng.parts[`${figId}/${part.id}`];
        const tGo = reducedMotion ? 0 : Math.max(agentFree[part.agent], i * STAGGER);
        const tStart = reducedMotion ? 0 : tGo + TRAVEL;
        // Taller parts take a little longer to fill.
        const tEnd = reducedMotion ? 0 : tStart + 0.55 + Math.min(0.5, (rt.maxY - rt.minY) * 0.35);
        agentFree[part.agent] = tEnd + 0.05;
        return { figId, partId: part.id, label: part.label, agent: part.agent, tGo, tStart, tEnd, started: false, ended: false };
      });
      eng.build = { figId, t0: now(), items, paused: false, pausedAt: 0 };
      setBuilding(figId);
      setPaused(false);
      setLog([]);
    },
    [reducedMotion],
  );

  const select = useCallback(
    (figId: string) => {
      const eng = engine;
      if (!ready) return;
      // Redirecting mid-build: the agents finish the old figure at once and
      // move on, so nothing is left half-drawn.
      if (eng.build && eng.build.figId !== figId) {
        const old = eng.build;
        for (const item of old.items) setPartBuilt(eng.parts[`${item.figId}/${item.partId}`], true);
        eng.build = null;
        setBuilt((b) => ({ ...b, [old.figId]: 0 }));
        setBuilding(null);
      }
      setFocus(figId);
      const alreadyBuilt = Object.values(FIGURES.find((f) => f.id === figId)!.parts).every(
        (part) => eng.parts[`${figId}/${part.id}`].progress >= 1,
      );
      if (!alreadyBuilt && eng.build?.figId !== figId) startBuild(figId);
    },
    [ready, startBuild],
  );

  const togglePause = () => {
    const b = engine.build;
    if (!b) return;
    if (b.paused) {
      b.t0 += now() - b.pausedAt;
      b.paused = false;
    } else {
      b.pausedAt = now();
      b.paused = true;
    }
    setPaused(b.paused);
  };

  const reset = () => {
    const eng = engine;
    eng.build = null;
    for (const rt of Object.values(eng.parts)) setPartBuilt(rt, false);
    setBuilt({});
    setBuilding(null);
    setPaused(false);
    setFocus(null);
    setLog([]);
  };

  const onPartEvent = useCallback((type: "start" | "end", item: BuildItem) => {
    setLog((lines) => {
      if (type === "start") return [...lines, { partId: item.partId, agent: item.agent, label: item.label, done: false }];
      return lines.map((l) => (l.partId === item.partId ? { ...l, done: true } : l));
    });
  }, []);

  const onBuilt = useCallback((figId: string, seconds: number) => {
    setBuilt((b) => ({ ...b, [figId]: seconds }));
    setBuilding(null);
    setPaused(false);
  }, []);

  const onReady = useCallback(() => setReady(true), []);

  const focused = focus ? FIGURES.find((f) => f.id === focus)! : null;
  const focusedBuilt = focused ? built[focused.id] !== undefined : false;
  const buildingDef = building ? FIGURES.find((f) => f.id === building)! : null;
  const anyBuilt = Object.keys(built).length > 0 || building !== null;

  return (
    // A little short of the full screen, so the next section peeks in and
    // says "there is more below".
    <div
      id="stage"
      className="@container relative -mx-10 -mt-3 h-[calc(100svh-64px)] min-h-[620px] overflow-hidden xl:-mx-14 2xl:-mx-16"
    >
      <div className="absolute inset-0">
        {desktop ? (
          <Scene
            focus={focus}
            reducedMotion={reducedMotion}
            onReady={onReady}
            onSelect={select}
            onPartEvent={onPartEvent}
            onBuilt={onBuilt}
          />
        ) : null}
      </div>

      {/* Captions and reference numerals, pinned to 3D points by the scene. */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {FIGURES.map((f) => (
          <div
            key={f.id}
            ref={(el) => {
              engine.labelEls[`cap/${f.id}`] = el;
            }}
            className="absolute left-0 top-0 opacity-0"
          >
            <button
              type="button"
              onClick={() => select(f.id)}
              className="group pointer-events-auto -translate-x-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 text-center"
            >
              <span className="block text-[15px] italic leading-none text-[#151515]" style={SERIF}>
                {f.fig}
              </span>
              <span className="mt-1.5 block text-[10px] font-semibold uppercase leading-none tracking-[0.14em] text-black/45 transition group-hover:text-black">
                {f.title}
              </span>
            </button>
          </div>
        ))}
        {FIGURES.flatMap((f) =>
          f.callouts.map((c) => (
            <div
              key={`${f.id}/${c.n}`}
              ref={(el) => {
                engine.labelEls[`n/${f.id}/${c.n}`] = el;
              }}
              className="absolute left-0 top-0 opacity-0"
              aria-hidden="true"
            >
              <span className="block -translate-x-1/2 -translate-y-1/2 text-[13px] italic leading-none text-[#151515]" style={SERIF}>
                {c.n}
              </span>
            </div>
          )),
        )}
      </div>

      {/* Intro: the hero statement, small, so the sheet has the stage. */}
      <div className="pointer-events-none absolute left-10 top-8 z-10 xl:left-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">{greeting} — I&apos;m Tony</p>
        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/70">A Staff Product Designer</p>
        <h1
          className="mt-4 text-[clamp(1.2rem,2.05vw,1.85rem)] font-black uppercase leading-[0.98] tracking-[-0.06em] text-[#151515]"
          style={{ WebkitTextStroke: "2px #ffffff", paintOrder: "stroke" }}
        >
          10+ years<I>shaping</I> interfaces<I>for</I> millions
          <br />
          <I start>at</I> TikTok, Airbnb, CloudKitchens<I>&amp;</I> DiDi
        </h1>
        {/* The hint has done its job once the visitor has picked something. */}
        {!focused && !anyBuilt ? <p className="mt-4 text-[12px] font-medium text-black/45">Pick a drawing. My agents build it.</p> : null}
      </div>

      <div className="absolute right-10 top-8 z-30 flex items-center gap-2 xl:right-14">
        {focused ? (
          <button
            type="button"
            onClick={() => setFocus(null)}
            className="inline-flex h-9 items-center rounded-full bg-black/[0.05] px-3.5 text-[12px] font-medium text-black/66 transition hover:bg-black/[0.1] hover:text-black"
          >
            ← Whole sheet
          </button>
        ) : null}
        {anyBuilt ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-black/[0.05] px-3.5 text-[12px] font-medium text-black/66 transition hover:bg-black/[0.1] hover:text-black"
          >
            <RotateCcw className="size-3.5" strokeWidth={2.2} aria-hidden="true" />
            Reset
          </button>
        ) : null}
      </div>

      {/* Agent log: what each agent is doing, with a pause — the visitor stays
          in charge. It sits where the result card will appear, so the log
          turns into the card when the build is done. */}
      {buildingDef && focus === building ? (
        <div className={PANEL}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
              Building {buildingDef.fig}
            </p>
            <button
              type="button"
              onClick={togglePause}
              className="inline-flex h-7 items-center gap-1.5 rounded-full bg-black/[0.05] px-2.5 text-[11px] font-medium text-black/66 transition hover:bg-black/[0.1] hover:text-black"
            >
              {paused ? <Play className="size-3" strokeWidth={2.4} aria-hidden="true" /> : <Pause className="size-3" strokeWidth={2.4} aria-hidden="true" />}
              {paused ? "Resume" : "Pause"}
            </button>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {log.map((line) => (
              <li key={line.partId} className="flex items-center gap-2 text-[12px] leading-none">
                <span className="size-2 shrink-0 rounded-full" style={{ background: AGENTS[line.agent].fill, boxShadow: `inset 0 0 0 1px ${AGENTS[line.agent].stroke}` }} />
                <span className="font-medium text-black/80">{AGENTS[line.agent].short}</span>
                <span className="truncate text-black/50">{line.label}</span>
                <span className="ml-auto text-black/40">
                  {line.done ? <Check className="size-3.5" strokeWidth={2.4} aria-label="done" /> : <span aria-label="working">…</span>}
                </span>
              </li>
            ))}
            {log.length === 0 ? <li className="text-[12px] leading-none text-black/40">Agents on their way…</li> : null}
          </ul>
        </div>
      ) : null}

      {/* Result card: the built figure's case study. */}
      {focused && focusedBuilt ? (
        <div className={PANEL}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
            {focused.fig}
            {built[focused.id] > 0 ? ` · Built in ${built[focused.id].toFixed(1)}s` : " · Built"}
          </p>
          <h2 className="mt-3 text-2xl font-medium leading-[1.1] tracking-[-0.025em] text-[#151515]">{focused.title}</h2>
          <p className="mt-3 text-sm leading-6 text-black/60">{focused.desc}</p>
          <div className="mt-5 flex items-center gap-3">
            {focused.href ? (
              <Link
                href={focused.href}
                data-cursor="view"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black/75"
              >
                Open case study
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            ) : (
              <span className="inline-flex items-center rounded-full bg-black/[0.05] px-3.5 py-2 text-[12px] font-medium text-black/60">
                {focused.status}
              </span>
            )}
          </div>
        </div>
      ) : null}

      {/* Prompt: ask the agents for a figure. */}
      <div className="absolute inset-x-0 bottom-6 z-30 flex flex-col items-center gap-2 px-4">
        <div className="flex max-w-full items-center gap-2 overflow-x-auto rounded-full border border-black/[0.08] bg-white/80 p-1.5 shadow-[0_10px_32px_rgba(35,29,16,0.1)] backdrop-blur-xl">
          <span className="shrink-0 pl-3 pr-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">Build</span>
          {FIGURES.map((f) => {
            const isBuilt = built[f.id] !== undefined;
            const isBuilding = building === f.id;
            const isFocus = focus === f.id;
            return (
              <button
                key={f.id}
                type="button"
                disabled={!ready}
                onClick={() => select(f.id)}
                aria-pressed={isFocus}
                className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium transition disabled:opacity-40 ${
                  isFocus ? "bg-[#171717] text-white" : "bg-black/[0.05] text-black/70 hover:bg-black/[0.1] hover:text-black"
                }`}
              >
                {isBuilt ? (
                  <Check className="size-3.5" strokeWidth={2.6} aria-label="built" />
                ) : isBuilding ? (
                  <span className="availability-dot" aria-label="building" />
                ) : null}
                {f.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* The five sticker agents. The scene moves them every frame. */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
        {AGENTS.map((agent, i) => (
          <div
            key={agent.id}
            ref={(el) => {
              engine.agentEls[i] = el;
            }}
            className="absolute left-0 top-0 opacity-0 will-change-transform"
          >
            <svg width="18" height="21" viewBox="0 0 18 21" className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.18)]">
              <path d="M1.2 1.2v15.6l4.3-3.7 2.9 6.3 2.6-1.2-2.9-6.2h5.6L1.2 1.2Z" fill={agent.fill} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={agent.src}
              alt=""
              width={agent.w}
              height={38}
              draggable={false}
              className="absolute left-[13px] top-[17px] block select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
              style={{ height: 22, width: "auto", maxWidth: "none", transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
