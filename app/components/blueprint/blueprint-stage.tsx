"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Pause, Play, RotateCcw } from "lucide-react";
import { engine, now, setPartBuilt, type BuildItem } from "./engine";
import { AGENTS, FIGURES } from "./figures";
import { getGreeting } from "../hero-intro";

// three.js only runs in the browser, and it is heavy: load the scene as its
// own client-only chunk.
const Scene = dynamic(() => import("./scene"), { ssr: false });

type LogLine = { partId: string; agent: number; label: string; done: boolean };

const SERIF = { fontFamily: "var(--font-serif), Georgia, serif" };

const TRAVEL = 0.5; // seconds an agent takes to reach its part
const STAGGER = 0.25; // seconds between consecutive parts setting off

// Small text label above a block: "FIG. 1 — BUILT IN 3.2S".
const LABEL = "text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45";
// The big line of the bottom-left block: a project title, or the invitation.
// Smaller on a narrow stage, where the sheet of drawings needs the room.
const TITLE = "mt-3 text-[1.3rem] font-medium leading-[1.04] tracking-[-0.035em] text-[#151515] @4xl:text-[clamp(1.6rem,2.7vw,2.5rem)]";
const ROUND =
  "inline-flex size-9 items-center justify-center rounded-full border border-black/10 text-black/70 transition hover:border-black/25 hover:text-black disabled:opacity-40";
const GHOST =
  "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium text-black/55 transition hover:bg-black/[0.05] hover:text-black";
// The agents' pointer: a present-day multiplayer cursor — no tail, soft corners.
const CURSOR =
  "M4.2 3.4 18.6 9.1c.5.2.5.9 0 1.1l-5.6 2.1c-.3.1-.5.3-.6.6l-2.2 5.6c-.2.5-.9.5-1.1 0L3.4 4.2c-.2-.5.3-1 .8-.8Z";

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
 * One exhibit at a time. A patent-style line drawing of a project stands on
 * the stage; the five sticker agents fly over and build it part by part into
 * the object, logging what they do. The first one builds itself; arrows, keys
 * or the numbered rail bring on the next, which slides in from the side and
 * is built in turn. The visitor can pause, move on mid-build, or replay. When
 * a figure is built, its case study is one click away.
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
  // One exhibit at a time: there is always a figure on stage.
  const [focus, setFocus] = useState<string | null>(FIGURES[0].id);
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

  /** Take every figure back to its drawing, and build the one on stage again. */
  const replay = () => {
    const eng = engine;
    if (!focus || !ready) return;
    eng.build = null;
    for (const rt of Object.values(eng.parts)) setPartBuilt(rt, false);
    setBuilt({});
    startBuild(focus);
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

  // The scene takes a moment to arrive: three.js has to download and its
  // shaders compile on the first draw. Until that draw is on screen a small
  // loader stands in; then it clears and the scene opens up behind it.
  const [painted, setPainted] = useState(false);
  const [loader, setLoader] = useState(true);
  const onPainted = useCallback(() => setPainted(true), []);
  useEffect(() => {
    if (!painted) return;
    const timer = window.setTimeout(() => setLoader(false), 700);
    return () => window.clearTimeout(timer);
  }, [painted]);

  /** The next or previous figure; from the whole sheet, the first or the last. */
  const step = useCallback(
    (dir: 1 | -1) => {
      const i = focus ? FIGURES.findIndex((f) => f.id === focus) : dir === 1 ? -1 : 0;
      select(FIGURES[(i + dir + FIGURES.length) % FIGURES.length].id);
    },
    [focus, select],
  );

  // The first figure builds itself, so the idea is clear without a word of
  // instruction — unless the visitor has already moved on.
  const started = useRef(false);
  useEffect(() => {
    if (!ready || started.current) return;
    if (focus !== FIGURES[0].id) {
      started.current = true;
      return;
    }
    const timer = window.setTimeout(() => {
      started.current = true;
      select(FIGURES[0].id);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [ready, focus, select]);

  // ← → flip through the projects — but only while the stage is what the
  // visitor is looking at, and never while typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      const stage = document.getElementById("stage");
      if (!stage || stage.offsetParent === null || stage.getBoundingClientRect().bottom < window.innerHeight * 0.5) return;
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const focused = focus ? FIGURES.find((f) => f.id === focus)! : null;
  const focusedBuilt = focused ? built[focused.id] !== undefined : false;
  const buildingDef = building ? FIGURES.find((f) => f.id === building)! : null;
  const focusIndex = focused ? FIGURES.indexOf(focused) : -1;
  const buildingHere = buildingDef !== null && focus === building;

  return (
    // Exactly one screen, with the same margin under the project index as
    // over the eyebrow line. It reaches 12px further left than the page
    // column, to the sidebar's edge, so a neighbouring figure comes out from
    // under the sidebar with no gap.
    <div
      id="stage"
      className="@container relative -mx-10 -ml-[3.25rem] -mt-3 h-svh min-h-[640px] overflow-hidden xl:-mx-14 xl:-ml-[4.25rem] 2xl:-mx-16 2xl:-ml-[4.75rem]"
    >
      <div className={`absolute inset-0 transition-opacity duration-700 ${painted ? "opacity-100" : "opacity-0"}`}>
        {desktop ? (
          <Scene
            focus={focus}
            reducedMotion={reducedMotion}
            onReady={onReady}
            onPainted={onPainted}
            onSelect={select}
            onPartEvent={onPartEvent}
            onBuilt={onBuilt}
          />
        ) : null}
      </div>

      {/* Loading: the five agents circle a blank spot on the sheet. Only
          transform and opacity move, so it keeps turning while the main thread
          is busy compiling. When the scene is painted they fly apart and fade. */}
      {desktop && loader ? (
        <div
          role="status"
          aria-label="Loading the 3D stage"
          className={`pointer-events-none absolute left-[58%] top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${
            painted ? "scale-[1.7] opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <div className="relative size-[176px]">
            <div className="absolute inset-0 rounded-full border border-dashed border-black/15" />
            <div className="absolute inset-0 animate-spin [animation-duration:2.6s]">
              {AGENTS.map((agent, i) => (
                <span key={agent.id} className="absolute left-1/2 top-1/2 block size-0" style={{ transform: `rotate(${i * 72}deg) translateY(-88px)` }}>
                  <svg width="20" height="20" viewBox="0 0 22 22" className="-ml-[10px] -mt-[10px] block drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                    <path d={CURSOR} fill={agent.stroke} stroke="#ffffff" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                </span>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[17px] italic leading-none text-[#151515]" style={SERIF}>
                FIG. 0
              </span>
              <span className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">Setting the stage</span>
            </div>
          </div>
        </div>
      ) : null}

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

      {/* Top left: the hero statement, at headline size. The figure sits to
          the right of and below it. */}
      <div className="pointer-events-none absolute left-[3.25rem] top-8 z-10 xl:left-[4.25rem]">
        <p className={LABEL}>
          {/* On a narrow stage the controls need the room: keep the role, drop the greeting. */}
          <span className="hidden @4xl:inline">
            {greeting} — I&apos;m Tony<span className="mx-2 text-black/20">/</span>
          </span>
          <span className="text-black/75">A Staff Product Designer</span>
        </p>
        {/* One strong line and one quiet one. The statement used to be twelve
            words with four overlapping italics packed into two lines at full
            weight; now the claim is the headline and the proof sits under it. */}
        <h1
          className="mt-5 text-[clamp(1.9rem,3.6vw,3.4rem)] font-black uppercase leading-[0.92] tracking-[-0.065em] text-[#151515]"
          style={{ WebkitTextStroke: "3px #ffffff", paintOrder: "stroke" }}
        >
          Shaping interfaces<I>for</I> millions
        </h1>
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium tracking-[-0.01em] text-black/50">
          <span className="text-black/80">10+ years</span>
          <span aria-hidden="true" className="h-px w-6 bg-black/20" />
          {["TikTok", "Airbnb", "CloudKitchens", "DiDi"].map((name, i) => (
            <span key={name} className="flex items-center gap-x-3">
              {i > 0 ? <span aria-hidden="true" className="size-[3px] rounded-full bg-black/25" /> : null}
              {name}
            </span>
          ))}
        </p>
      </div>

      {/* Top right: where you are in the set, and the way through it. */}
      <div className="absolute right-10 top-6 z-30 flex items-center gap-1 xl:right-14">
        {Object.keys(built).length > 0 ? (
          <button type="button" onClick={replay} className={GHOST}>
            <RotateCcw className="size-3.5" strokeWidth={2.2} aria-hidden="true" />
            Replay
          </button>
        ) : null}
        <span className="mx-2 text-[11px] font-semibold tabular-nums tracking-[0.1em] text-black/45">
          <span className="text-black/80">{String(focusIndex + 1).padStart(2, "0")}</span> / {String(FIGURES.length).padStart(2, "0")}
        </span>
        <button type="button" disabled={!ready} onClick={() => step(-1)} aria-label="Previous project" className={ROUND}>
          <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
        </button>
        <button type="button" disabled={!ready} onClick={() => step(1)} aria-label="Next project" className={`${ROUND} ml-1`}>
          <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      {/* Bottom left: one block of text that is always about what is on the
          stage — the invitation, then the agents' log, then the case study. */}
      <div
        className={`absolute bottom-[108px] left-[3.25rem] z-20 w-[min(340px,40%)] transition-opacity duration-700 xl:left-[4.25rem] ${
          painted ? "opacity-100" : "opacity-0"
        }`}
      >
        {focused ? (
          <>
            <p className={LABEL}>
              {focused.fig}
              <span className="mx-2 text-black/20">—</span>
              {buildingHere ? (paused ? "Paused" : "Building") : !focusedBuilt ? "Drawing" : built[focused.id] > 0 ? `Built in ${built[focused.id].toFixed(1)}s` : "Built"}
            </p>
            <h2 className={TITLE}>{focused.title}</h2>
            {buildingHere ? (
              // The agents' log, with a pause: the visitor stays in charge.
              <>
                <ul className="mt-5 flex flex-col gap-2">
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
                <button type="button" onClick={togglePause} className={`${GHOST} -ml-3 mt-3`}>
                  {paused ? <Play className="size-3" strokeWidth={2.4} aria-hidden="true" /> : <Pause className="size-3" strokeWidth={2.4} aria-hidden="true" />}
                  {paused ? "Resume" : "Pause"}
                </button>
              </>
            ) : (
              <>
                <p className="mt-4 text-sm leading-6 text-black/60">{focused.desc}</p>
                {focused.href ? (
                  <Link
                    href={focused.href}
                    data-cursor="view"
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black/75"
                  >
                    Open case study
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                ) : (
                  // Finished work whose case study is not written up yet.
                  <span className="mt-5 inline-flex items-center rounded-full border border-black/15 px-4 py-2.5 text-sm font-semibold text-black/60">
                    {focused.status ?? "Coming soon"}
                  </span>
                )}
              </>
            )}
          </>
        ) : null}
      </div>

      {/* Bottom: the index of projects, the stage's own table of contents. */}
      <nav aria-label="Projects" className="absolute bottom-0 left-[3.25rem] right-10 z-30 flex h-20 items-stretch border-t border-black/10 xl:left-[4.25rem] xl:right-14">
        {FIGURES.map((f, i) => {
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
              aria-label={f.title}
              title={f.title}
              // A rail of numbers; the current project opens to show its name.
              className={`group relative flex min-w-0 items-center gap-2 text-left transition disabled:opacity-40 ${
                isFocus ? "flex-1 pr-4 text-[#151515]" : "w-[3.25rem] shrink-0 text-black/45 hover:text-black"
              }`}
            >
              <span className={`absolute -top-px left-0 h-[2px] bg-[#151515] transition-all duration-300 ${isFocus ? "w-full" : "w-0 group-hover:w-5"}`} />
              <span className="text-[11px] font-semibold tabular-nums tracking-[0.1em]">{String(i + 1).padStart(2, "0")}</span>
              {isFocus ? <span className="truncate text-[13px] font-medium">{f.title}</span> : null}
              {isFocus && !f.href ? (
                <span className="shrink-0 rounded-full bg-black/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-black/55">Soon</span>
              ) : null}
              {isBuilt ? (
                <Check className="size-3.5 shrink-0 opacity-60" strokeWidth={2.6} aria-label="built" />
              ) : isBuilding ? (
                <span className="availability-dot shrink-0" aria-label="building" />
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* The five sticker agents. The scene moves them every frame. The
          pointer is a present-day multiplayer cursor: no tail, soft corners,
          the agent's colour with a white edge. */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
        {AGENTS.map((agent, i) => (
          <div
            key={agent.id}
            ref={(el) => {
              engine.agentEls[i] = el;
            }}
            className="absolute left-0 top-0 opacity-0 will-change-transform"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.22)]">
              <path
                d={CURSOR}
                fill={agent.stroke}
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={agent.src}
              alt=""
              width={agent.w}
              height={38}
              draggable={false}
              className="absolute left-[16px] top-[17px] block select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)] transition-opacity duration-300"
              style={{ height: 22, width: "auto", maxWidth: "none", transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
