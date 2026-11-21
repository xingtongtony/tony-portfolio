"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DESIGN_PATENT_TOTAL, HONORS, PATENTS, type Patent } from "../../lib/about";

/**
 * Recognition: 325 design patents as 325 dots, the five patents that can be
 * listed as a register, and each one redrawn from its own patent drawing.
 *
 * - The dots: one per design patent. The four listed design patents are the
 *   coloured dots; they and the register rows point at each other.
 * - The plates follow the patent drawing convention: dashed lines are the
 *   screen (not claimed), solid lines the claimed design; the element each
 *   patent is about is drawn in the page accent. A plate draws itself when it
 *   is chosen. Reduced motion: dots and plates are simply there.
 */

const ACCENT = "linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #f2784b 100%)";
const COLS = 25; // 25 × 13 = 325
// Where the listed design patents sit in the field (row-major index), spread out by eye.
const LISTED_AT: Record<string, number> = { d986264: 2 * COLS + 5, d986265: 5 * COLS + 18, d990500: 8 * COLS + 9, d990501: 10 * COLS + 21 };

function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

export function Recognition() {
  const [active, setActive] = useState(PATENTS[0].id);
  const current = PATENTS.find((p) => p.id === active)!;
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // Below lg the plate sits above the list: a tap on a row further down brings it into view.
  const showPlate = () => {
    const plate = document.getElementById("patent-plate");
    if (!plate || window.matchMedia("(min-width: 1024px)").matches) return;
    const r = plate.getBoundingClientRect();
    if (r.top >= 0 && r.bottom <= window.innerHeight) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    plate.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
  };

  const onKey = (ev: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = PATENTS.length;
    let next = -1;
    if (ev.key === "ArrowDown" || ev.key === "ArrowRight") next = (i + 1) % n;
    if (ev.key === "ArrowUp" || ev.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (ev.key === "Home") next = 0;
    if (ev.key === "End") next = n - 1;
    if (next >= 0) {
      ev.preventDefault();
      setActive(PATENTS[next].id);
      tabs.current[next]?.focus();
    }
  };

  return (
    <section id="recognition" data-case-section className="scroll-mt-8 py-16 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="section-label">Recognition</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
            {DESIGN_PATENT_TOTAL} design patents
          </h2>
          <p className="mt-6 max-w-[30rem] text-base leading-[1.6] text-black/55">
            Each dot is one design patent. The four in color are listed below with an invention patent, each redrawn
            from its own patent drawing.
          </p>
        </div>
        <div className="lg:col-span-7 lg:pt-2">
          <DotField active={active} onPick={setActive} />
        </div>
      </div>

      {/* Register + plate */}
      <div className="mt-16 grid gap-6 lg:grid-cols-12 lg:gap-12">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <div role="tablist" aria-orientation="vertical" aria-label="Patents" className="border-t border-black/10">
            {PATENTS.map((p, i) => {
              const on = p.id === active;
              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${p.id}`}
                  aria-selected={on}
                  aria-controls="patent-plate"
                  tabIndex={on ? 0 : -1}
                  onClick={() => {
                    setActive(p.id);
                    showPlate();
                  }}
                  onPointerEnter={(ev) => ev.pointerType === "mouse" && setActive(p.id)}
                  onKeyDown={(ev) => onKey(ev, i)}
                  className={`relative block w-full border-b border-black/10 py-4 pl-4 pr-2 text-left transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black ${
                    on ? "bg-black/[0.03]" : "hover:bg-black/[0.02]"
                  }`}
                >
                  <span aria-hidden className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`} style={{ background: ACCENT }} />
                  <span className="block font-mono text-[11px] tabular-nums tracking-[0.02em] text-black/45">{p.number}</span>
                  <span className={`mt-1 block text-[16px] font-semibold leading-snug tracking-[-0.015em] ${on ? "text-black" : "text-black/70"}`}>{p.name}</span>
                  <span className="mt-1 block text-[13px] text-black/45">
                    {p.kind} · Granted {p.granted.replace(/ \d+,/, "")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-7">
          <div className="lg:sticky lg:top-6">
            <Plate patent={current} />
          </div>
        </div>
      </div>

      {/* Before design: two wall labels */}
      <div className="mt-20">
        <p className="section-label">Art</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {HONORS.map((h) => (
            <div key={h.title} className="rounded-[1.25rem] border border-black/10 px-6 py-6">
              <p className="font-[family-name:var(--font-serif)] text-[26px] italic leading-tight tracking-[-0.01em]">{h.title}</p>
              <p className="mt-3 text-[15px] font-medium text-black/80">{h.what}</p>
              <p className="mt-1 font-mono text-xs tabular-nums text-black/45">{h.date}</p>
              <p className="mt-4 text-sm leading-[1.55] text-black/55">{h.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DotField({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.25);
  const byIndex = new Map(Object.entries(LISTED_AT).map(([id, i]) => [i, id]));
  return (
    <figure>
      <div
        ref={ref}
        data-on={seen || undefined}
        className="dot-field grid gap-[clamp(3px,0.5vw,6px)]"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        role="img"
        aria-label={`${DESIGN_PATENT_TOTAL} dots, one for each design patent; four are listed below.`}
      >
        {Array.from({ length: DESIGN_PATENT_TOTAL }, (_, i) => {
          const id = byIndex.get(i);
          const d = { "--d": `${(Math.floor(i / COLS) + (i % COLS)) * 14}ms` } as CSSProperties;
          if (!id) return <span key={i} data-dot style={d} className="aspect-square rounded-full border border-black/[0.16]" />;
          const p = PATENTS.find((x) => x.id === id)!;
          const on = id === active;
          return (
            <button
              key={i}
              type="button"
              data-dot
              style={{ ...d, background: ACCENT }}
              onClick={() => onPick(id)}
              onPointerEnter={(ev) => ev.pointerType === "mouse" && onPick(id)}
              aria-label={`${p.number}, ${p.name}`}
              title={p.number}
              className={`relative aspect-square rounded-full transition-[box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                on ? "shadow-[0_0_0_3px_#fff,0_0_0_4.5px_#171717]" : ""
              }`}
            />
          );
        })}
      </div>
      <figcaption className="mt-4 flex justify-between font-mono text-[11px] tabular-nums text-black/40">
        <span>
          {DESIGN_PATENT_TOTAL} = {COLS} × {DESIGN_PATENT_TOTAL / COLS}
        </span>
        <span>
          <span aria-hidden className="mr-1.5 inline-block size-2 rounded-full align-[0.05em]" style={{ background: ACCENT }} />
          Listed below
        </span>
      </figcaption>
    </figure>
  );
}

// ─── Plates ────────────────────────────────────────────────────────────────
// 400 × 250, redrawn by hand from each patent's figure. Classes: u = unclaimed
// (dashed), c = claimed, h = the claimed element the patent is about.

type Draw = (cls: { c: string; h: string; u: string }) => ReactNode;

const tabBar: Draw = ({ c }) => (
  <>
    <line x1="10" y1="212" x2="390" y2="212" className={c} pathLength={1} />
    <path d="M54 230 V223 L60 218 L66 223 V230 Z" className={c} pathLength={1} />
    <circle cx="129" cy="224" r="4.5" className={c} pathLength={1} />
    <line x1="132.5" y1="227.5" x2="136" y2="231" className={c} pathLength={1} />
    <rect x="191" y="218" width="18" height="12" rx="3" className={c} pathLength={1} />
    <path d="M200 221 V227 M197 224 H203" className={c} pathLength={1} />
    <rect x="264" y="219" width="12" height="10" rx="2" className={c} pathLength={1} />
    <circle cx="340" cy="221" r="3" className={c} pathLength={1} />
    <path d="M334 231 Q340 224 346 231" className={c} pathLength={1} />
  </>
);

function rail({ c }: { c: string }, y0: number, step: number) {
  return (
  <>
    <circle cx="364" cy={y0} r="10" className={c} pathLength={1} />
    <circle cx="364" cy={y0 + 10} r="3.5" className={c} pathLength={1} />
    <path d={`M364 ${y0 + step + 7} l-7 -7 a4 4 0 0 1 7 -5 a4 4 0 0 1 7 5 Z`} className={c} pathLength={1} />
    <path d={`M357 ${y0 + 2 * step - 4} h14 v9 h-9 l-3 3 v-3 h-2 Z`} className={c} pathLength={1} />
    <path d={`M357 ${y0 + 3 * step + 4} q4 -8 12 -8 v-3 l5 6 l-5 6 v-3 q-7 0 -12 2`} className={c} pathLength={1} />
    <circle cx="364" cy={y0 + 4 * step} r="9" className={c} pathLength={1} />
    <circle cx="364" cy={y0 + 4 * step} r="3.5" className={c} pathLength={1} />
  </>
  );
}

const screen: Draw = ({ u }) => <rect x="10" y="10" width="380" height="230" rx="6" className={u} />;

const PLATES: Record<string, { draw: Draw; ref: [number, number, number, number, string] }> = {
  // Tablet, landscape: the share sheet beside the action rail.
  d986264: {
    ref: [290, 104, 300, 92, "20"],
    draw: (k) => (
      <>
        {screen(k)}
        <line x1="90" y1="10" x2="90" y2="212" className={k.c} pathLength={1} />
        <line x1="310" y1="10" x2="310" y2="104" className={k.c} pathLength={1} />
        {tabBar(k)}
        {rail(k, 70, 30)}
        <rect x="224" y="104" width="124" height="102" rx="6" className={k.h} pathLength={1} />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <circle cx={242 + i * 22} cy="126" r="8" className={k.h} pathLength={1} />
            <circle cx={247.5 + i * 22} cy="131.5" r="2.5" className={k.h} pathLength={1} />
            <circle cx={242 + i * 22} cy="155" r="8" className={k.h} pathLength={1} />
          </g>
        ))}
        <circle cx="242" cy="186" r="7" className={k.h} pathLength={1} />
        <path d="M239.5 190 v-8 h6 l-1.5 2 l1.5 2 h-6" className={k.h} pathLength={1} />
        <circle cx="264" cy="186" r="7" className={k.h} pathLength={1} />
        <path d="M261.5 182 h5 v8 l-2.5 -2 l-2.5 2 Z" className={k.h} pathLength={1} />
        <path d="M286 190 l-5 -5 a3 3 0 0 1 5 -3.5 a3 3 0 0 1 5 3.5 Z M286 182 l-1.5 3 l2 1.5" className={k.h} pathLength={1} />
        <path d="M308 181 v7 M305 185.5 l3 3 l3 -3 M304 191 h8" className={k.h} pathLength={1} />
        <rect x="324" y="182.5" width="12" height="7" rx="3.5" className={k.h} pathLength={1} />
      </>
    ),
  },
  // Tablet, landscape: the comment panel opening from the action rail.
  d986265: {
    ref: [214, 60, 186, 44, "30"],
    draw: (k) => (
      <>
        {screen(k)}
        <line x1="90" y1="10" x2="90" y2="212" className={k.c} pathLength={1} />
        <line x1="310" y1="186" x2="310" y2="212" className={k.c} pathLength={1} />
        {tabBar(k)}
        {rail(k, 40, 30)}
        <rect x="214" y="28" width="134" height="156" rx="6" className={k.h} pathLength={1} />
        <line x1="230" y1="28" x2="230" y2="184" className={k.h} pathLength={1} />
        <line x1="330" y1="28" x2="330" y2="184" className={k.h} pathLength={1} />
        <path d="M240 40 l6 4 l-6 4 Z M268 40 l6 4 l-6 4 Z" className={k.h} pathLength={1} />
        <circle cx="339" cy="44" r="4.5" className={k.h} pathLength={1} />
        <circle cx="339" cy="62" r="4.5" className={k.h} pathLength={1} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx="244" cy={78 + i * 26} r="6" className={k.h} pathLength={1} />
            <line x1="256" y1={75 + i * 26} x2={300 - i * 10} y2={75 + i * 26} className={k.h} pathLength={1} />
            <line x1="256" y1={82 + i * 26} x2="284" y2={82 + i * 26} className={k.h} pathLength={1} />
          </g>
        ))}
        <circle cx="246" cy="168" r="6" className={k.h} pathLength={1} />
        <circle cx="270" cy="168" r="6" className={k.h} pathLength={1} />
      </>
    ),
  },
  // Web: the For You feed — top bar, left navigation, a vertical video and its actions.
  d990500: {
    ref: [232, 92, 276, 74, "40"],
    draw: (k) => (
      <>
        <rect x="10" y="10" width="380" height="230" rx="4" className={k.u} />
        <line x1="10" y1="34" x2="390" y2="34" className={k.c} pathLength={1} />
        <circle cx="30" cy="22" r="6" className={k.c} pathLength={1} />
        <rect x="150" y="15" width="100" height="14" rx="7" className={k.c} pathLength={1} />
        <circle cx="240" cy="21.5" r="3" className={k.c} pathLength={1} />
        <circle cx="370" cy="22" r="6" className={k.c} pathLength={1} />
        <path d="M322 25 l4 -6 l4 6 Z M336 19 l8 3 l-8 3 l2 -3 Z M350 18 h8 v7 h-8 Z" className={k.c} pathLength={1} />
        <path d="M36 54 V49 L41 45 L46 49 V54 Z" className={k.c} pathLength={1} />
        <path d="M36 68 l5 -5 l5 5 M38 64 h6" className={k.c} pathLength={1} />
        <line x1="30" y1="80" x2="112" y2="80" className={k.c} pathLength={1} />
        <circle cx="38" cy="94" r="5" className={k.c} pathLength={1} />
        <circle cx="38" cy="108" r="5" className={k.c} pathLength={1} />
        {[122, 136, 150, 164, 178].map((y) => (
          <circle key={y} cx="38" cy={y} r="5" className={k.u} />
        ))}
        <line x1="30" y1="190" x2="112" y2="190" className={k.c} pathLength={1} />
        {[30, 56, 82].map((x) => (
          <rect key={x} x={x} y="198" width="22" height="7" rx="3.5" className={k.c} pathLength={1} />
        ))}
        {[30, 56, 82].map((x) => (
          <rect key={`u${x}`} x={x} y="210" width="22" height="7" rx="3.5" className={k.u} />
        ))}
        <circle cx="152" cy="54" r="9" className={k.c} pathLength={1} />
        <rect x="300" y="46" width="32" height="12" rx="2" className={k.c} pathLength={1} />
        <rect x="160" y="72" width="72" height="128" rx="2" className={k.h} pathLength={1} />
        {[156, 176, 196].map((y, i) => (
          <g key={y}>
            <circle cx="248" cy={y} r="7" className={k.h} pathLength={1} />
            {i === 0 ? <path d={`M248 ${y + 3} l-3.5 -3.5 a2 2 0 0 1 3.5 -2.5 a2 2 0 0 1 3.5 2.5 Z`} className={k.h} pathLength={1} /> : null}
            {i === 1 ? <path d={`M244.5 ${y - 2} h7 v4 h-4 l-2 2 v-2 h-1 Z`} className={k.h} pathLength={1} /> : null}
            {i === 2 ? <path d={`M244.5 ${y + 2} q2 -4 6 -4 v-2 l3 3 l-3 3 v-2`} className={k.h} pathLength={1} /> : null}
          </g>
        ))}
        <line x1="140" y1="210" x2="340" y2="210" className={k.c} pathLength={1} />
        <circle cx="152" cy="226" r="7" className={k.u} />
        <rect x="300" y="221" width="32" height="10" rx="2" className={k.u} />
      </>
    ),
  },
  // Web: the player page — a large landscape player, a column of thumbnails, four cards.
  d990501: {
    ref: [302, 60, 330, 46, "50"],
    draw: (k) => (
      <>
        <rect x="10" y="10" width="380" height="230" rx="4" className={k.u} />
        <line x1="10" y1="34" x2="390" y2="34" className={k.c} pathLength={1} />
        <circle cx="26" cy="22" r="6" className={k.c} pathLength={1} />
        <rect x="150" y="15" width="100" height="14" rx="7" className={k.c} pathLength={1} />
        <circle cx="370" cy="22" r="6" className={k.c} pathLength={1} />
        <path d="M306 25 V20 L310 17 L314 20 V25 Z M322 25 l4 -6 l4 6 Z M336 19 l8 3 l-8 3 l2 -3 Z M350 18 h8 v7 h-8 Z" className={k.c} pathLength={1} />
        <line x1="72" y1="34" x2="72" y2="240" className={k.c} pathLength={1} />
        <path d="M22 54 V49 L27 45 L32 49 V54 Z M22 68 l5 -5 l5 5 M22 76 h10 v6 h-10 Z" className={k.c} pathLength={1} />
        <line x1="16" y1="92" x2="64" y2="92" className={k.c} pathLength={1} />
        <circle cx="26" cy="104" r="5" className={k.c} pathLength={1} />
        <circle cx="26" cy="118" r="5" className={k.c} pathLength={1} />
        {[132, 146, 160].map((y) => (
          <circle key={y} cx="26" cy={y} r="5" className={k.u} />
        ))}
        <line x1="16" y1="176" x2="64" y2="176" className={k.c} pathLength={1} />
        <circle cx="26" cy="188" r="5" className={k.c} pathLength={1} />
        <circle cx="26" cy="202" r="5" className={k.c} pathLength={1} />
        {[216, 230].map((y) => (
          <circle key={y} cx="26" cy={y} r="5" className={k.u} />
        ))}
        <rect x="88" y="42" width="214" height="112" rx="3" className={k.h} pathLength={1} />
        <circle cx="98" cy="52" r="5" className={k.h} pathLength={1} />
        <rect x="280" y="48" width="14" height="7" rx="1.5" className={k.h} pathLength={1} />
        {[42, 70, 98, 126].map((y, i) => (
          <rect key={y} x="310" y={y} width="66" height="24" rx="2" className={i === 0 ? k.h : k.c} pathLength={1} />
        ))}
        <line x1="72" y1="164" x2="390" y2="164" className={k.c} pathLength={1} />
        {[86, 160, 234, 308].map((x) => (
          <g key={x}>
            <rect x={x} y="172" width="66" height="48" rx="2" className={k.c} pathLength={1} />
            <rect x={x + 4} y="210" width="28" height="5" rx="1" className={k.c} pathLength={1} />
            <rect x={x + 52} y="210" width="9" height="5" rx="1" className={k.c} pathLength={1} />
            <circle cx={x + 6} cy="230" r="5" className={k.c} pathLength={1} />
          </g>
        ))}
      </>
    ),
  },
  // Two-dimensional code: round-dot modules, and positioning points made of two overlapped points.
  ep4258165: {
    ref: [170, 85, 96, 40, "110"],
    draw: (k) => (
      <g className="plate-scaled" transform="translate(200 125) scale(1.32) translate(-200 -125)">
        <rect x="140" y="10" width="120" height="230" rx="16" className={k.u} />
        <rect x="152" y="62" width="96" height="126" rx="8" className={k.c} pathLength={1} />
        <circle cx="200" cy="62" r="9" className={k.c} pathLength={1} />
        <line x1="176" y1="176" x2="224" y2="176" className={k.c} pathLength={1} />
        {[
          [160, 78],
          [218, 78],
          [160, 136],
        ].map(([x, y]) => (
          <g key={`${x}${y}`}>
            <rect x={x} y={y} width="22" height="22" rx="4" className={k.c} pathLength={1} />
            {[
              [3, 3],
              [11, 3],
              [19, 3],
              [3, 11],
              [19, 11],
              [3, 19],
              [11, 19],
              [19, 19],
            ].map(([dx, dy]) => (
              <circle key={`${dx}${dy}`} cx={x + dx} cy={y + dy} r="1.1" className={k.c} pathLength={1} />
            ))}
            <circle cx={x + 11} cy={y + 11} r="5" className={k.c} pathLength={1} />
            <circle cx={x + 9.5} cy={y + 11} r="5" className={k.h} pathLength={1} />
          </g>
        ))}
        {CODE_DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" className={k.c} pathLength={1} />
        ))}
      </g>
    ),
  },
};

// The code's modules: a fixed pattern on a 6px grid, skipping the three positioning corners.
const CODE_DOTS: [number, number][] = (() => {
  const out: [number, number][] = [];
  let seed = 7;
  for (let gy = 0; gy < 13; gy++) {
    for (let gx = 0; gx < 13; gx++) {
      const x = 163 + gx * 6.2;
      const y = 81 + gy * 6.2;
      const inEye = (x < 186 && y < 104) || (x > 214 && y < 104) || (x < 186 && y > 132);
      seed = (seed * 9301 + 49297) % 233280;
      if (!inEye && seed / 233280 < 0.5) out.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
    }
  }
  return out;
})();

function Plate({ patent }: { patent: Patent }) {
  const gid = useId().replace(/:/g, "");
  const plate = PLATES[patent.id];
  const [lx, ly, tx, ty, num] = plate.ref;
  const cls = { c: "pc", h: "ph", u: "pu" };
  return (
    <figure id="patent-plate" role="tabpanel" aria-labelledby={`tab-${patent.id}`} className="rounded-[1.5rem] bg-[#f6f6f6] p-5 sm:p-7">
      <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.1em] text-black/45">
        <span>{patent.figure}</span>
        <span className="tabular-nums">{patent.number}</span>
      </div>
      {/* key: a new patent remounts the drawing, so it draws again. */}
      <svg
        key={patent.id}
        viewBox="0 0 400 250"
        role="img"
        aria-label={`Line drawing redrawn from ${patent.number}: ${patent.name}`}
        className="patent-plate mt-4 h-auto w-full text-black/70"
        fill="none"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ "--accent": `url(#${gid})` } as CSSProperties}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="0.5" stopColor="#a855f7" />
            <stop offset="1" stopColor="#f2784b" />
          </linearGradient>
        </defs>
        {plate.draw(cls)}
        {/* Reference numeral, the way a patent figure points at its parts. */}
        <path d={`M${lx} ${ly} Q${(lx + tx) / 2} ${ly - 8} ${tx} ${ty + 4}`} className="pc" pathLength={1} />
        <text x={tx + 2} y={ty} className="pt fill-current stroke-none font-mono text-[10px]">
          {num}
        </text>
      </svg>
      <figcaption className="mt-5 border-t border-black/10 pt-5">
        <p className="text-[17px] font-semibold leading-snug tracking-[-0.02em]">{patent.name}</p>
        <p className="mt-1 text-sm leading-[1.5] text-black/55">
          {patent.kind}: “{patent.title}”. Filed {patent.filed}, granted {patent.granted}.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium">
          <Link href={patent.related.href} className="inline-flex items-center gap-1 text-black/70 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black hover:decoration-black">
            Case study: {patent.related.title}
          </Link>
          <a href={patent.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-black/50 transition-colors hover:text-black">
            Google Patents
            <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={2.25} />
          </a>
        </div>
        <p className="mt-4 text-[11px] leading-[1.5] text-black/40">
          Redrawn from the patent figure. Dashed lines show the screen, which is not claimed; solid lines show the claimed design.
        </p>
      </figcaption>
    </figure>
  );
}
