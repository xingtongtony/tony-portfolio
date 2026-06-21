"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Hero — dramatic mixed-weight statement with floating color tags.
 *
 * Layout language (from the reference board):
 * - "b" segments: heavy black UPPERCASE sans (Geist) — the structural words
 * - "i" segments: medium serif italic lowercase (Newsreader) — the connectives
 *   The hard contrast between the two is the whole point; italics overlap the
 *   neighbouring black words with a white seam (see H1_STYLE).
 * - floating tags: glossy SVG stickers (designed in Figma, exported to
 *   public/portfolio/stickers, text already outlined). Each is a THREE-part
 *   stack so transforms don't collide:
 *     L1 outer — absolute placement (left/top set by JS, see layoutTags) +
 *                JS-driven transform (base rotation + cursor parallax).
 *     L2 inner — the per-tag reveal (`hero-token-pulse`, animation transform).
 *     img      — the sticker SVG itself.
 *   Because L1 (parallax) and L2 (reveal) are separate elements, the two
 *   transforms never fight. Tags are absolute → zero layout height.
 *
 *   Placement is WORD-ANCHORED, not a fixed %: each tag names a headline
 *   segment and an edge to press, and `layoutTags` positions it against that
 *   word's live rect (recomputed on resize / font / image load). A % relative
 *   to the container drifts away from the text when the headline reflows at
 *   narrow widths — anchoring keeps every sticker kissing its word at any size.
 *   The "slight overlap, never far, never covering letter bodies" rule is
 *   enforced by scripts/hero-tag-overlap.js (BOTH bounds — see the rules docs).
 *
 * Motion (all preserved): per-token reveal on words + tags, tag landing pop,
 * and now a cursor parallax where tags drift OPPOSITE to the pointer (varied
 * `depth` per tag for layering). Parallax is disabled under reduced-motion.
 * Greeting is computed client-side (placeholder on server).
 */

type Seg =
  | { k: "b"; t: string }
  | { k: "i"; t: string }
  | { k: "grad"; t: string } // gradient-flash word ("10+")
  | { k: "br" };

type Tag = {
  src: string; // sticker SVG path under /public
  alt: string; // readable label (the outlined text)
  w: number; // intrinsic width hint (desktop px) — sets the SVG aspect ratio
  h: number; // intrinsic height hint (desktop px)
  seg: number; // index into SEGMENTS — the headline word this tag anchors to
  side: "top" | "bottom" | "left" | "right"; // which edge of that word to press
  align?: "left" | "center" | "right"; // horizontal align (top/bottom sides only)
  nx?: number; // fine x nudge in px (default 0)
  ny?: number; // fine y nudge in px (default 0)
  rot: number; // base rotation, degrees
  depth: number; // parallax strength, px of max travel
  // Narrow-screen override. The headline reflows to many short lines on small
  // widths, where a top/bottom sticker spills onto the adjacent line — so those
  // re-anchor (usually to a line-end word's right side, into the margin) below
  // NARROW_BP. Anything omitted falls back to the desktop anchor.
  narrow?: { seg?: number; side?: Tag["side"]; align?: Tag["align"] };
};

// px; below this the `narrow` anchor override applies. Set near the width where
// the headline stops holding its wide 4-line layout (content gets too narrow and
// reflows), so the narrow anchors take over before the desktop ones break.
const NARROW_BP = 1024;

// How far a sticker presses INTO its anchor word, as a fraction of the sticker's
// own size. Small enough to "kiss" an edge, never cover the letter bodies.
const PRESS_V = 0.32; // top/bottom: vertical intrusion ÷ sticker height
const PRESS_H = 0.1; // left/right: horizontal intrusion ÷ sticker width

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  if (hour >= 18 && hour < 23) return "Good evening";
  return "Up late?";
}

const SEGMENTS: Seg[] = [
  { k: "grad", t: "10+" },
  { k: "b", t: "years" },
  { k: "i", t: "shaping" },
  { k: "br" },
  { k: "b", t: "interfaces" },
  { k: "i", t: "for" },
  { k: "b", t: "millions" },
  { k: "br" },
  { k: "i", t: "at" },
  { k: "b", t: "TikTok, Airbnb," },
  { k: "br" },
  { k: "b", t: "CloudKitchens" },
  { k: "i", t: "&" },
  { k: "b", t: "DiDi" },
];

// Figma sticker pills (native aspect 29px tall). w/h are the desktop size and
// the intrinsic aspect-ratio hint; rendered height is responsive (STICKER_H).
// Each tag is ANCHORED to a headline segment (seg → index in SEGMENTS) and
// presses one of its edges, so the layout holds as the headline reflows. The
// arrangement spreads top → bottom, left ↔ right around the statement.
const TAGS: Tag[] = [
  {
    src: "/portfolio/stickers/bilingual-global.svg",
    alt: "Bilingual, global",
    w: 160,
    h: 38,
    seg: 2, // "shaping" (line 1) — pressed on top
    side: "top",
    align: "center",
    rot: -3,
    depth: 20,
  },
  {
    src: "/portfolio/stickers/design-patents.svg",
    alt: "325 design patents",
    w: 162,
    h: 38,
    seg: 6, // "millions" (line 2) — top-right
    side: "top",
    align: "right",
    narrow: { side: "right" }, // narrow: beside MILLIONS (own line) in the margin
    rot: 3,
    depth: 30,
  },
  {
    src: "/portfolio/stickers/detail-obsessed.svg",
    alt: "Detail obsessed",
    w: 144,
    h: 38,
    seg: 9, // "TikTok, Airbnb," (line 3) — to the right
    side: "right",
    rot: -5,
    depth: 24,
  },
  {
    src: "/portfolio/stickers/agent-workflow.svg",
    alt: "Agent workflow",
    w: 156,
    h: 38,
    seg: 11, // "CloudKitchens" (line 4) — bottom-left
    side: "bottom",
    align: "left",
    narrow: { seg: 12, side: "right" }, // narrow: beside "&" (line end) in the margin
    rot: -4,
    depth: 16,
  },
  {
    src: "/portfolio/stickers/design-systems.svg",
    alt: "Design systems nerd",
    w: 185,
    h: 38,
    seg: 13, // "DiDi" (line 4) — bottom-right
    side: "bottom",
    align: "right",
    rot: 2,
    depth: 13,
  },
];

// Responsive sticker height. Tracks the headline's clamp(2rem,5.4vw,4.25rem):
// capped at 38px on large screens (so the desktop look is unchanged), scaling
// down by viewport width to a 18px floor on small screens. 3vw ≈ 5.4vw × 38/68,
// so a sticker stays the same fraction of the headline at every width. Width is
// auto, so each sticker keeps its own aspect from the SVG.
const STICKER_H = "clamp(18px, 3vw, 38px)";

const BASE_DELAY_MS = 100;
const STAGGER_MS = 70;

const H1_CLASS =
  "font-black uppercase leading-[0.92] tracking-[-0.06em] text-[#151515] text-[clamp(2rem,5.4vw,4.25rem)]";

// White stroke under the fill: on a white page it's invisible except where
// letters overlap, where the back letter shows a clean white gap — that's the
// "overlap with a seam" look. paintOrder:stroke keeps the glyph core solid.
const H1_STYLE: CSSProperties = {
  WebkitTextStroke: "4px #ffffff",
  paintOrder: "stroke",
};

// Medium display-serif italic, pulled tight and nudged hard into the
// neighbouring black words so the two faces actually overlap (reference look).
const ITALIC_CLASS = "relative z-10 font-medium normal-case italic tracking-[-0.03em] -ml-[0.22em] -mr-[0.14em]";

// Line-start italics (e.g. "at") must NOT carry the overlap -ml: with no
// preceding word to overlap, that negative margin shoves them left past the
// alignment edge of the bold lines above/below. Keep -mr so the next bold
// word still overlaps the italic's right side.
const ITALIC_LINESTART_CLASS = "relative z-10 font-medium normal-case italic tracking-[-0.03em] -mr-[0.14em]";

type TagPos = { left: number; top: number };

export function HeroIntro() {
  const [greeting, setGreeting] = useState<string>("Hello");
  // Computed sticker positions (word-anchored, see the layout effect). Kept in
  // state — not set imperatively — so a re-render (e.g. the greeting update)
  // re-applies them via the style prop instead of wiping the inline left/top.
  const [tagPos, setTagPos] = useState<(TagPos | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const gradRef = useRef<HTMLSpanElement>(null);

  // Replay the "10+" gradient flash (hover) by restarting its CSS animation.
  const replayGrad = () => {
    const el = gradRef.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth; // force reflow so the animation can restart
    el.style.animation = "grad-flash 1200ms ease-out both";
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  // Word-anchored sticker placement. Each tag is pinned to its headline word's
  // live rect and pressed into one edge by PRESS_V/PRESS_H, so it keeps kissing
  // the text (slight overlap, never far) at every width. Recomputed on resize
  // and once fonts / sticker images have settled their sizes.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // The TIGHT glyph box of a word (its text node's client rect), not the
    // span's line box — the span includes line-height leading, so pressing into
    // it would leave a gap to the actual letters. Using the glyph box means the
    // press value IS the real overlap, matching scripts/hero-tag-overlap.js.
    const glyphRect = (word: HTMLElement): DOMRect | null => {
      const node = word.firstChild;
      if (!node || node.nodeType !== Node.TEXT_NODE) return null;
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = [...range.getClientRects()].filter(
        (r) => r.width > 1 && r.height > 1,
      );
      if (!rects.length) return null;
      const left = Math.min(...rects.map((r) => r.left));
      const top = Math.min(...rects.map((r) => r.top));
      const right = Math.max(...rects.map((r) => r.right));
      const bottom = Math.max(...rects.map((r) => r.bottom));
      // The word carries the `.hero-token` reveal animation (translateY 14→0),
      // and getClientRects() includes that live transform — so on first paint
      // (and any time before the per-word animation settles) the glyph box reads
      // ~14px LOW, anchoring the stickers too far down until the next resize
      // recomputes them. Undo the word's own translateY so we always anchor to
      // the RESTING text position, at any animation frame. No jump on load.
      const t = getComputedStyle(word).transform;
      const ty = t && t !== "none" ? new DOMMatrixReadOnly(t).m42 : 0;
      return new DOMRect(left, top - ty, right - left, bottom - top);
    };

    const layoutTags = () => {
      const crect = container.getBoundingClientRect();
      const narrow = window.innerWidth < NARROW_BP;
      const next = TAGS.map((tag, i): TagPos | null => {
        const el = tagRefs.current[i];
        // Resolve the effective anchor (desktop, or the narrow override below BP).
        // NB: a plain `(narrow && x) ?? y` is wrong — when narrow is false the
        // `&&` yields `false`, which `??` does NOT treat as nullish, so it would
        // leak `false` instead of falling back to `y`. Gate on the object first.
        const o = narrow ? tag.narrow : undefined;
        const seg = o?.seg ?? tag.seg;
        const side = o?.side ?? tag.side;
        const align = o?.align ?? tag.align;
        const word = container.querySelector<HTMLElement>(
          `.hero-token[data-seg="${seg}"]`,
        );
        const wr = word && glyphRect(word);
        if (!el || !wr) return null;
        const wl = wr.left - crect.left;
        const wt = wr.top - crect.top;
        const cx = wl + wr.width / 2;
        const cy = wt + wr.height / 2;
        const right = wl + wr.width;
        const bottom = wt + wr.height;
        const sw = el.offsetWidth;
        const sh = el.offsetHeight;
        let left: number;
        let top: number;
        if (side === "top" || side === "bottom") {
          const press = Math.round(sh * PRESS_V);
          left =
            align === "left"
              ? wl
              : align === "right"
                ? right - sw
                : cx - sw / 2;
          top = side === "top" ? wt - sh + press : bottom - press;
        } else {
          const press = Math.round(sw * PRESS_H);
          top = cy - sh / 2;
          left = side === "right" ? right - press : wl - sw + press;
        }
        return {
          left: Math.round(left + (tag.nx ?? 0)),
          top: Math.round(top + (tag.ny ?? 0)),
        };
      });
      // Only commit a COMPLETE layout. During a reflow (or before refs/images
      // settle) some tags can momentarily resolve to null; committing then would
      // wipe good positions back to the top-left default. Skipping keeps the
      // last good layout until the next observer tick resolves them all.
      if (next.every(Boolean)) setTagPos(next);
    };

    // Run once synchronously on mount so positions exist immediately, without
    // waiting on any frame-tied callback (rAF/ResizeObserver delivery is paused
    // while the tab is backgrounded — the sync call is what works there).
    layoutTags();

    // ResizeObserver then keeps it in sync on any later size change (headline
    // reflow at a new width, font swap). It fires on observe and on resize and
    // catches reflow that a window 'resize' event misses.
    const ro = new ResizeObserver(layoutTags);
    ro.observe(container);
    const headline = container.querySelector("h1");
    if (headline) ro.observe(headline);
    if (document.fonts?.ready) document.fonts.ready.then(layoutTags).catch(() => {});
    const imgs = container.querySelectorAll("img");
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", layoutTags, { once: true });
    });
    return () => ro.disconnect();
  }, []);

  // Cursor parallax: tags drift opposite the pointer, each by its own depth.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        for (const el of tagRefs.current) {
          if (!el) continue;
          const d = Number(el.dataset.depth);
          const r = el.dataset.rot;
          el.style.transform = `translate3d(${(-nx * d).toFixed(1)}px, ${(-ny * d).toFixed(1)}px, 0) rotate(${r}deg)`;
        }
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  let idx = 0;
  const delay = () => `${BASE_DELAY_MS + idx++ * STAGGER_MS}ms`;

  const words: ReactNode[] = SEGMENTS.map((s, i) => {
    if (s.k === "br") return <br key={i} />;
    const style: CSSProperties = { animationDelay: delay() };
    if (s.k === "grad") {
      return (
        <span key={i}>
          <span
            className="hero-token relative inline-block"
            data-seg={i}
            style={{ ...style, WebkitTextStroke: "0px" }}
            onMouseEnter={replayGrad}
          >
            {s.t}
            <span
              ref={gradRef}
              aria-hidden
              className="grad-flash pointer-events-none absolute inset-0"
            >
              {s.t}
            </span>
          </span>{" "}
        </span>
      );
    }
    if (s.k === "i") {
      style.fontFamily = "var(--font-serif), Georgia, serif";
      const lineStart = i === 0 || SEGMENTS[i - 1].k === "br";
      return (
        <span key={i}>
          <span
            className={`hero-token inline-block ${lineStart ? ITALIC_LINESTART_CLASS : ITALIC_CLASS}`}
            data-seg={i}
            style={style}
          >
            {s.t}
          </span>{" "}
        </span>
      );
    }
    return (
      <span key={i}>
        <span className="hero-token inline-block" data-seg={i} style={style}>
          {s.t}
        </span>{" "}
      </span>
    );
  });

  // Tags reveal after the headline words have landed.
  const tagBase = BASE_DELAY_MS + SEGMENTS.length * STAGGER_MS;

  return (
    <div ref={containerRef} className="relative max-w-[920px]">
      <div className="mb-6 flex flex-col gap-1.5">
        <p
          className="hero-token text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40"
          style={{ animationDelay: "0ms" }}
        >
          {greeting} — I&apos;m Tony
        </p>
        <p
          className="hero-token text-[11px] font-semibold uppercase tracking-[0.18em] text-black/70"
          style={{ animationDelay: "70ms" }}
        >
          A Staff Product Designer
        </p>
      </div>

      <h1 className={H1_CLASS} style={H1_STYLE}>{words}</h1>

      {TAGS.map((tag, i) => (
        <span
          key={tag.src}
          ref={(el) => {
            tagRefs.current[i] = el;
          }}
          data-depth={tag.depth}
          data-rot={tag.rot}
          className="absolute left-0 top-0 z-10"
          style={{
            ...(tagPos[i] ? { left: tagPos[i]!.left, top: tagPos[i]!.top } : null),
            transform: `rotate(${tag.rot}deg)`,
            transition: "transform 250ms ease-out",
            willChange: "transform",
          }}
        >
          <span
            className="hero-token-pulse inline-block"
            style={{ animationDelay: `${tagBase + i * 90}ms` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tag.src}
              alt={tag.alt}
              width={tag.w}
              height={tag.h}
              draggable={false}
              className="block select-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.14)]"
              style={{ height: STICKER_H, width: "auto" }}
            />
          </span>
        </span>
      ))}
    </div>
  );
}

// Static hero for tablet + mobile (< lg). No pointer on touch devices, so the
// desktop hero's word-anchored stickers + cursor parallax buy nothing here and
// are fiddly to lay out at narrow widths. Instead: a bigger, freely-wrapping
// headline (comfortable to read) with the stickers dropped into a simple
// wrapping row below — placed in the open space under the statement. No JS
// positioning, no hover. The desktop interactive hero is untouched.
export function HeroStatic() {
  const [greeting, setGreeting] = useState<string>("Hello");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  return (
    // @container: the headline sizes from the CONTENT column width (cqw), not
    // the viewport — so it never overflows when the sidebar narrows the column
    // on tablet, yet still scales up nicely as the column grows.
    <div className="@container relative">
      <div className="mb-6 flex flex-col gap-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
          {greeting} — I&apos;m Tony
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/70">
          A Staff Product Designer
        </p>
      </div>

      {/* Bigger + freely wrapping. Keeps the black-uppercase / serif-italic
          contrast, but drops the desktop overlap-seam so it wraps cleanly.
          `cqw` keeps the longest word (CLOUDKITCHENS) inside the column. */}
      <h1 className="font-black uppercase leading-[1.02] tracking-[-0.04em] text-[#151515] text-[clamp(2rem,11cqw,4rem)] text-balance">
        {SEGMENTS.map((s, i) => {
          if (s.k === "br") return null;
          if (s.k === "i") {
            return (
              <span key={i}>
                <span
                  className="font-medium normal-case italic"
                  style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
                >
                  {s.t}
                </span>{" "}
              </span>
            );
          }
          return (
            <span key={i}>
              {s.t}
              {" "}
            </span>
          );
        })}
      </h1>

      {/* Stickers as a wrapping row in the open space below the headline. */}
      <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-4">
        {TAGS.map((tag) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={tag.src}
            src={tag.src}
            alt={tag.alt}
            width={tag.w}
            height={tag.h}
            draggable={false}
            className="block select-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
            style={{
              height: "clamp(28px, 7vw, 40px)",
              width: "auto",
              transform: `rotate(${tag.rot}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
