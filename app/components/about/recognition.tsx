"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { HONORS, PATENTS } from "../../lib/about";

/**
 * Patents and honours. Each patent is a line drawing that draws itself the
 * first time it scrolls into view — the way the homepage's cursors draw the
 * models. Every stroke has pathLength 1, so one dash offset animates them all.
 * Reduced motion: the drawings are simply there.
 */

function useDrawn<T extends Element>() {
  const ref = useRef<T>(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion: the CSS shows the finished drawing; nothing to watch.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, drawn] as const;
}

function Drawing({ title, children }: { title: string; children: ReactNode }) {
  const [ref, drawn] = useDrawn<SVGSVGElement>();
  return (
    <svg
      ref={ref}
      viewBox="0 0 240 160"
      role="img"
      aria-label={title}
      data-drawn={drawn || undefined}
      className="patent-drawing h-auto w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

// Fig. 1 — a two-dimensional code: frame, three finder marks, a scatter of modules.
const MODULES = [
  [104, 52], [116, 52], [128, 52], [110, 64], [134, 64], [104, 76], [122, 76], [140, 76],
  [116, 88], [128, 88], [104, 100], [134, 100], [146, 100], [110, 112], [122, 112], [146, 112],
  [86, 88], [92, 100], [80, 76],
];
function CodeFigure() {
  return (
    <Drawing title="Line drawing of a two-dimensional code">
      <rect x="62" y="26" width="116" height="108" rx="14" pathLength={1} style={{ transitionDelay: "0s" }} />
      {[
        [74, 38],
        [144, 38],
        [74, 108],
      ].map(([x, y]) => (
        <g key={`${x}${y}`} style={{ "--pd": "0.35s" } as CSSProperties}>
          <rect x={x - 2} y={y - 2} width="24" height="24" rx="5" pathLength={1} />
          <rect x={x + 5} y={y + 5} width="10" height="10" rx="2" pathLength={1} />
        </g>
      ))}
      {MODULES.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" pathLength={1} style={{ transitionDelay: `${0.7 + (x + y) / 600}s` }} />
      ))}
      {/* Leader and label, like a patent figure. */}
      <path d="M178 46 L206 30" pathLength={1} style={{ transitionDelay: "1.2s" }} />
      <path d="M62 120 L30 138" pathLength={1} style={{ transitionDelay: "1.2s" }} />
      <text x="208" y="28" className="fill-current stroke-none font-mono text-[9px]">10</text>
      <text x="16" y="146" className="fill-current stroke-none font-mono text-[9px]">12</text>
    </Drawing>
  );
}

// Fig. 2 — a display screen with a graphical user interface, four times over.
function ScreenFigure() {
  return (
    <Drawing title="Line drawing of four display screens with a graphical user interface">
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${36 + i * 12} ${18 + i * 10})`} opacity={0.35 + i * 0.2} style={{ "--pd": `${i * 0.25}s` } as CSSProperties}>
          <rect x="0" y="0" width="132" height="84" rx="6" pathLength={1} />
          {i === 3 ? (
            <>
              <path d="M10 12 H44" pathLength={1} />
              <rect x="10" y="22" width="34" height="52" rx="3" pathLength={1} />
              <rect x="52" y="22" width="34" height="52" rx="3" pathLength={1} />
              <rect x="94" y="22" width="28" height="52" rx="3" pathLength={1} />
              <path d="M64 42 L76 48 L64 54 Z" pathLength={1} />
            </>
          ) : null}
        </g>
      ))}
      <path d="M190 120 L214 136" pathLength={1} style={{ transitionDelay: "1.2s" }} />
      <text x="216" y="144" className="fill-current stroke-none font-mono text-[9px]">20</text>
    </Drawing>
  );
}

export function Recognition() {
  const [code, ...screens] = PATENTS;
  return (
    <section id="recognition" data-case-section className="scroll-mt-8 py-16 lg:py-24">
      <p className="section-label">Recognition</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Patents and honors</h2>

      <div className="mt-12 grid auto-rows-fr gap-4 md:grid-cols-2">
        <figure className="flex h-full flex-col rounded-[1.5rem] bg-[#f6f6f6] p-6 sm:p-8">
          <div className="text-black/75">
            <CodeFigure />
          </div>
          <figcaption className="mt-6 border-t border-black/10 pt-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-black/40">Fig. 1 · Patent {code.number}</p>
            <p className="mt-2 text-[17px] font-semibold leading-snug tracking-[-0.02em] first-letter:uppercase">{code.title.toLowerCase()}</p>
            <p className="mt-1 text-sm text-black/50">Issued {code.issued}</p>
          </figcaption>
        </figure>
        <figure className="flex h-full flex-col rounded-[1.5rem] bg-[#f6f6f6] p-6 sm:p-8">
          <div className="text-black/75">
            <ScreenFigure />
          </div>
          <figcaption className="mt-6 border-t border-black/10 pt-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-black/40">Fig. 2 · {screens.length} US design patents</p>
            <p className="mt-2 text-[17px] font-semibold leading-snug tracking-[-0.02em]">{screens[0].title}</p>
            <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[12px] tabular-nums text-black/50">
              {screens.map((p) => (
                <li key={p.number}>
                  {p.number} <span className="text-black/35">· {p.issued.replace(/, \d{4}$/, "")}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-black/50">Issued Oct 2021</p>
          </figcaption>
        </figure>
      </div>

      <ul className="mt-10 border-t border-black/10">
        {HONORS.map((h) => (
          <li key={h.title} className="grid gap-1 border-b border-black/10 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
            <span className="font-mono text-xs tabular-nums text-black/45">{h.date}</span>
            <span>
              <span className="block text-[17px] font-semibold tracking-[-0.02em]">{h.title}</span>
              <span className="mt-1 block text-sm text-black/55">{h.note}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
