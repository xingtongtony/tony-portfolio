"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Pause, Play, RotateCcw } from "lucide-react";
import { engine, now, setPartBuilt, type BuildItem } from "./engine";
import { AGENTS, FIGURES } from "./figures";
import { LOADER_ART } from "./loader-art";
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
  "inline-flex size-9 items-center justify-center rounded-full border border-black/10 text-black/70 transition-colors hover:border-black/25 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40";
const GHOST =
  "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium text-black/55 transition-colors hover:bg-black/[0.05] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2";
// The agents' pointer: a present-day multiplayer cursor — no tail, soft corners.
const CURSOR =
  "M4.2 3.4 18.6 9.1c.5.2.5.9 0 1.1l-5.6 2.1c-.3.1-.5.3-.6.6l-2.2 5.6c-.2.5-.9.5-1.1 0L3.4 4.2c-.2-.5.3-1 .8-.8Z";

// The loader plays once per visit: coming back to the homepage from a case
// study should not sit through it again. (Module state survives client-side
// navigation; a reload starts over.)
let loaderPlayed = false;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const DRAW = 1000; // the drawing appears, left to right
const BUILD_AT = 900; // then the object is built from the ground up...
const BUILD = 1600; // ...over this long
// The 3D scene is only started once that has played: assembling it and
// compiling its shaders ties up the main thread, which would stall the
// animation half-way. Its code is fetched meanwhile, so little time is lost.
const ENTRANCE = BUILD_AT + BUILD + 150;

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
 * is built in turn. The visitor can pause, move on mid-build, replay, or open
 * the selected case study while its figure builds.
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
  // shaders compile on the first draw. Until that draw is on screen a loader
  // covers the whole page; then it clears and the scene opens up behind it.
  const [painted, setPainted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [playEntrance] = useState(() => !loaderPlayed);
  const [loader, setLoader] = useState(playEntrance);
  // With the loader on screen the scene waits for its entrance to finish.
  const [sceneOn, setSceneOn] = useState(!playEntrance);
  const onPainted = useCallback(() => {
    loaderPlayed = true;
    setPainted(true);
  }, []);
  useEffect(() => {
    // Wait for the desktop query to hydrate. The timer can be cancelled and
    // restarted without marking the visit as played before anything paints.
    if (!desktop || sceneOn) return;
    void import("./scene");
    const timer = window.setTimeout(() => setSceneOn(true), reducedMotion ? 0 : ENTRANCE);
    return () => window.clearTimeout(timer);
  }, [desktop, reducedMotion, sceneOn]);
  // Never hold the page hostage: if the scene has not arrived in a while, show the page anyway.
  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), 9000 + ENTRANCE);
    return () => window.clearTimeout(timer);
  }, []);
  const revealed = painted || timedOut;
  useEffect(() => {
    if (!revealed) return;
    const timer = window.setTimeout(() => setLoader(false), reducedMotion ? 0 : 800);
    return () => window.clearTimeout(timer);
  }, [reducedMotion, revealed]);

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
    <>
      {/* Page loader. It covers the whole page — sidebar included — until the
          stage's first frame is painted, so nothing is seen half-arrived.

          What it shows is FIG. 0: the logo as a clay block on the same plinth
          the projects stand on, drawn with the stage's camera, line weight
          and numerals (loader-art.ts, generated from real geometry). The
          drawing is wiped in; then two agents carry the build front up it and
          the object appears from the ground — the stage's own mechanic, so
          the loader is the first demonstration of the idea, not a spinner.
          When the scene is ready it clears, and the row of drawings is there
          at about the same scale, about to close in.

          It is in the server HTML and shown by CSS from lg up, so the page
          never flashes before it; below lg there is nothing heavy to wait for
          and it never shows. It sits outside #stage because a container-query
          root would capture a fixed child. The left padding is the sidebar's
          column, so the art sits where the stage's centre will be. */}
      {loader ? (
        <div
          role="status"
          aria-label="Loading"
          className={`fixed inset-0 z-[100] hidden items-center justify-center bg-white transition-opacity duration-700 lg:flex ${
            revealed ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          {/* Centred on the page while it loads. As it clears it drifts to
              where the stage's centre is (half the sidebar's width to the
              right), so it hands over to the first figure instead of
              vanishing beside it. */}
          <div
            className={`flex flex-col items-center transition-transform duration-700 ease-out ${
              revealed ? "scale-[1.06] lg:translate-x-[140px] xl:translate-x-[162px]" : "scale-100"
            }`}
          >
            {/* At its natural size: the art is generated at the size it is shown. */}
            <div className="relative max-w-[80vw]" style={{ width: LOADER_ART.width, aspectRatio: `${LOADER_ART.width} / ${LOADER_ART.height}` }}>
              {/* The drawing appears left to right... */}
              <svg
                viewBox={`0 0 ${LOADER_ART.width} ${LOADER_ART.height}`}
                className="bp-anim absolute inset-0 block size-full"
                style={{ animation: `bp-draw ${DRAW}ms ${EASE} both` }}
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: LOADER_ART.line }}
              />
              {/* ...and the object is built over it from the ground up. */}
              <svg
                viewBox={`0 0 ${LOADER_ART.width} ${LOADER_ART.height}`}
                className="bp-anim absolute inset-0 block size-full"
                style={{ animation: `bp-build ${BUILD}ms ${EASE} ${BUILD_AT}ms both` }}
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: LOADER_ART.colour }}
              />
              {/* Two agents ride the build front up the block's front edges,
                  then stay with it, bobbing, until the page is ready. */}
              {[
                { agent: AGENTS[2], path: LOADER_ART.left, outward: -1 },
                { agent: AGENTS[1], path: LOADER_ART.right, outward: 1 },
              ].map(({ agent, path, outward }, i) => (
                // A layer the size of the art: moving it by a share of its own
                // height keeps the agent on the build front at any size.
                <div
                  key={agent.id}
                  className="bp-anim pointer-events-none absolute inset-0"
                  style={
                    {
                      "--bp-lift": `${((path.to - path.from) * 100).toFixed(2)}%`,
                      animation: `bp-lift ${BUILD}ms ${EASE} ${BUILD_AT}ms both`,
                    } as CSSProperties
                  }
                  aria-hidden="true"
                >
                  <div
                    className="bp-anim absolute"
                    style={{
                      left: `${(path.x * 100).toFixed(2)}%`,
                      top: `${(path.from * 100).toFixed(2)}%`,
                      animation: `bp-fade 300ms ease-out ${BUILD_AT - 300 + i * 120}ms both`,
                    }}
                  >
                    <div className="bp-anim" style={{ animation: `bp-bob 2600ms ease-in-out ${BUILD_AT + BUILD + i * 400}ms infinite` }}>
                      <div
                        className="bp-anim relative"
                        style={{
                          // The pointer's tip sits on the edge; the name tag hangs away from the block.
                          transform: outward < 0 ? "translateX(-100%)" : undefined,
                          animation: `bp-scribble 640ms ease-in-out ${BUILD_AT}ms ${Math.round(BUILD / 640)}`,
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 22 22"
                          className="block drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                          style={outward < 0 ? { transform: "scaleX(-1)" } : undefined}
                        >
                          <path d={CURSOR} fill={agent.stroke} stroke="#ffffff" strokeWidth="1.6" strokeLinejoin="round" />
                        </svg>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={agent.src}
                          alt=""
                          width={agent.w}
                          height={38}
                          draggable={false}
                          className={`absolute top-[13px] block select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)] ${outward < 0 ? "right-[11px]" : "left-[11px]"}`}
                          style={{ height: 16, width: "auto", maxWidth: "none", transform: `rotate(${outward < 0 ? 2 : -2}deg)` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Captioned like every figure on the stage. */}
            <div className="bp-anim -mt-1 text-center" style={{ animation: `bp-fade 500ms ease-out 400ms both` }}>
              <span className="block text-[15px] italic leading-none text-[#151515]" style={SERIF}>
                FIG. 0
              </span>
              <span className="mt-2 block text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-black/45">Tony Xing — Portfolio</span>
              {/* Real milestones, not a made-up percentage: the drawing is up, the scene is assembled, its first frame is drawn. */}
              <span className="mx-auto mt-4 block h-px w-16 overflow-hidden bg-black/10">
                <span
                  className="block h-px origin-left bg-[#151515] transition-transform duration-700 ease-out"
                  style={{ transform: `scaleX(${painted ? 1 : ready ? 0.75 : sceneOn ? 0.45 : 0.15})` }}
                />
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Exactly one screen, with the same margin under the project index as over the eyebrow line. It reaches 12px further left than the page column, to the sidebar's edge, so a neighbouring figure comes out from under the sidebar with no gap. */}
    <div
      id="stage"
      className="@container relative -mx-10 -ml-[3.25rem] -mt-3 h-svh min-h-[640px] overflow-hidden xl:-mx-14 xl:-ml-[4.25rem] 2xl:-mx-16 2xl:-ml-[4.75rem]"
    >
      <div className={`absolute inset-0 transition-opacity duration-700 ${painted ? "opacity-100" : "opacity-0"}`}>
        {desktop && sceneOn ? (
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
              disabled={!ready}
              onClick={() => select(f.id)}
              aria-label={`Show ${f.title}`}
              title={f.title}
              className="pointer-events-auto -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded px-2 py-1 text-center text-black/75 hover:text-black focus-visible:outline-2"
            >
              <span className="block text-[15px] italic leading-none" style={SERIF}>
                {f.fig}
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

      {/* Keep project access anchored below the description or build log. */}
      <div
        inert={loader && !revealed}
        className="pointer-events-none absolute bottom-[108px] left-[3.25rem] isolate z-20 w-[min(340px,36%)] before:absolute before:-inset-x-4 before:-inset-y-3 before:-z-10 before:bg-white before:blur-lg xl:left-[4.25rem]"
      >
        {focused ? (
          <>
            <p className={LABEL}>
              {focused.fig}
              <span className="mx-2 text-black/20">—</span>
              {buildingHere ? (paused ? "Paused" : "Building") : !focusedBuilt ? "Drawing" : built[focused.id] >= 0.1 ? `Built in ${built[focused.id].toFixed(1)}s` : "Built"}
            </p>
            <h2 className={TITLE}>{focused.title}</h2>
            {buildingHere ? (
              // On a narrow stage, keep the log's ticks clear of the figure.
              <ul className="mt-5 flex max-w-[clamp(220px,37.5cqw-83px,340px)] flex-col gap-2">
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
            ) : (
              <p className="mt-4 text-sm leading-6 text-black/60">{focused.desc}</p>
            )}
            <div className={`flex items-center gap-2 ${buildingHere ? "mt-2" : "mt-5"}`}>
              {focused.href ? (
                <Link
                  href={focused.href}
                  aria-label={`Open case study for ${focused.title}`}
                  data-cursor="view"
                  className="pointer-events-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#171717] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717]"
                >
                  Open case study
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              ) : (
                <span className="inline-flex shrink-0 items-center rounded-full border border-black/15 px-4 py-2.5 text-sm font-semibold text-black/60">
                  {focused.status ?? "Coming soon"}
                </span>
              )}
              {buildingHere ? (
                <button type="button" onClick={togglePause} className={`${GHOST} pointer-events-auto shrink-0`}>
                  {paused ? <Play className="size-3" strokeWidth={2.4} aria-hidden="true" /> : <Pause className="size-3" strokeWidth={2.4} aria-hidden="true" />}
                  {paused ? "Resume" : "Pause"}
                </button>
              ) : null}
            </div>
          </>
        ) : null}
      </div>

      {/* Bottom: the index of projects, the stage's own table of contents. */}
      <nav aria-label="Projects" className="absolute bottom-0 left-[3.25rem] right-10 z-30 grid h-20 grid-cols-11 border-t border-black/10 bg-white xl:left-[4.25rem] xl:right-14">
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
              className={`group relative flex min-w-0 items-center justify-center transition-colors focus-visible:outline-2 focus-visible:-outline-offset-4 disabled:opacity-40 ${
                isFocus ? "text-[#151515]" : "text-black/55 hover:bg-black/[0.025] hover:text-black"
              }`}
            >
              <span aria-hidden="true" className={`absolute inset-x-0 -top-px h-0.5 origin-center bg-[#151515] transition-transform duration-300 ${isFocus ? "scale-x-100" : "scale-x-0 group-hover:scale-x-25"}`} />
              <span className="text-[11px] font-semibold tabular-nums tracking-[0.1em]">{String(i + 1).padStart(2, "0")}</span>
              <span aria-hidden="true" className="absolute top-[calc(50%+12px)] flex h-3 items-center">
                {isBuilding ? <span className="availability-dot" /> : isBuilt ? <Check className="size-3 opacity-60" strokeWidth={2.3} /> : null}
              </span>
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
            className="absolute left-0 top-0 opacity-0 transition-opacity duration-300 will-change-transform"
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
    </>
  );
}
