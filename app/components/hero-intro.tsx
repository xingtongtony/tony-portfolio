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
 *                JS-driven transform (base rotation + parallax drift).
 *     L2 inner — the per-tag reveal (`hero-token-pulse`, animation transform).
 *     img      — the sticker SVG itself.
 *   Because L1 (parallax) and L2 (reveal) are separate elements, the two
 *   transforms never fight. Tags are absolute → zero layout height.
 *
 *   Placement is WORD-ANCHORED, not a fixed %: each tag names a headline
 *   segment and an edge to press, and `layoutTags` positions it against that
 *   word's live rect (recomputed on resize / font / image load). A % relative
 *   to the container drifts away from the text when the headline reflows —
 *   anchoring keeps every sticker kissing its word at any size. The "slight
 *   overlap, never far, never covering letter bodies" rule is enforced by
 *   scripts/hero-tag-overlap.js (BOTH bounds — see the rules docs).
 *
 * Two layouts of the SAME hero (one collage, not a desktop hero and a
 * simplified mobile one — Tony, 2026-11-09):
 * - `wide` (tablet + desktop, ≥ sm): the 4-line statement. Below lg the type
 *   and stickers scale with the CONTENT width (cqw), so a 768 tablet shows the
 *   exact composition a 1024 screen does; from lg it's the original vw sizing.
 * - `compact` (phone, < sm): 6 fixed lines, each italic on the same line as a
 *   bold neighbour so the seam still works, and its own sticker anchors that
 *   press line ends, the top and the bottom of the block — the same collage,
 *   rearranged for 327px.
 *
 * Motion: per-token reveal on words + tags, tag landing pop, the "10+"
 * gradient flash (hover or tap replays it), and parallax — tags drift opposite
 * the pointer on a mouse, and drift up at their own depth as you scroll on
 * touch. Both are off under reduced-motion. Greeting is computed client-side.
 */

type Seg =
  | { k: "b"; t: string }
  | { k: "i"; t: string }
  | { k: "grad"; t: string } // gradient-flash word ("10+")
  | { k: "br" };

type Side = "top" | "bottom" | "left" | "right";

type Anchor = {
  seg: number; // index into the layout's segments — the word this tag presses
  side: Side; // which edge of that word to press
  align?: "left" | "center" | "right"; // horizontal align (top/bottom sides only)
  nx?: number; // fine x nudge in px (default 0)
  ny?: number; // fine y nudge in px (default 0)
};

type Tag = {
  src: string; // sticker SVG path under /public
  alt: string; // readable label (the outlined text)
  w: number; // intrinsic width hint (desktop px) — sets the SVG aspect ratio
  h: number; // intrinsic height hint (desktop px)
  rot: number; // base rotation, degrees
  depth: number; // parallax strength, px of max travel
  wide: Anchor;
  compact: Anchor;
};

type Layout = "wide" | "compact";

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

const SEGMENTS: Record<Layout, Seg[]> = {
  wide: [
    { k: "grad", t: "10+" }, // 0
    { k: "b", t: "years" }, // 1
    { k: "i", t: "shaping" }, // 2
    { k: "br" },
    { k: "b", t: "interfaces" }, // 4
    { k: "i", t: "for" }, // 5
    { k: "b", t: "millions" }, // 6
    { k: "br" },
    { k: "i", t: "at" }, // 8
    { k: "b", t: "TikTok, Airbnb," }, // 9
    { k: "br" },
    { k: "b", t: "CloudKitchens" }, // 11
    { k: "i", t: "&" }, // 12
    { k: "b", t: "DiDi" }, // 13
  ],
  // The longest line is the single word CLOUDKITCHENS, so the cqw font is
  // bound only by that.
  compact: [
    { k: "grad", t: "10+" }, // 0
    { k: "b", t: "years" }, // 1
    { k: "i", t: "shaping" }, // 2
    { k: "br" },
    { k: "b", t: "interfaces" }, // 4
    { k: "i", t: "for" }, // 5
    { k: "br" },
    { k: "b", t: "millions" }, // 7
    { k: "i", t: "at" }, // 8
    { k: "br" },
    { k: "b", t: "TikTok, Airbnb," }, // 10
    { k: "br" },
    { k: "b", t: "CloudKitchens" }, // 12
    { k: "br" },
    { k: "i", t: "&" }, // 14
    { k: "b", t: "DiDi" }, // 15
  ],
};

// Figma sticker pills (native aspect 29px tall). w/h are the desktop size and
// the intrinsic aspect-ratio hint; rendered height is responsive (--sticker-h).
// The arrangement spreads top → bottom, left ↔ right around the statement in
// both layouts. Compact: line ends with free space are "for", "at" and the
// short last line, so stickers sit there, above line 1 and below the block.
const TAGS: Tag[] = [
  {
    src: "/portfolio/stickers/bilingual-global.svg",
    alt: "Bilingual, global",
    w: 160,
    h: 38,
    rot: -3,
    depth: 20,
    wide: { seg: 2, side: "top", align: "center" }, // over "shaping"
    compact: { seg: 2, side: "top", align: "right" }, // over "shaping", right
  },
  {
    src: "/portfolio/stickers/design-patents.svg",
    alt: "325 design patents",
    w: 162,
    h: 38,
    rot: 3,
    depth: 30,
    wide: { seg: 6, side: "top", align: "right" }, // over "millions", right
    // "at" is two letters, so a full PRESS_H would hide the t: ease off to a kiss.
    compact: { seg: 8, side: "right", nx: 7 }, // after "at"
  },
  {
    src: "/portfolio/stickers/detail-obsessed.svg",
    alt: "Detail obsessed",
    w: 144,
    h: 38,
    rot: -5,
    depth: 24,
    wide: { seg: 9, side: "right" }, // after "TikTok, Airbnb,"
    compact: { seg: 5, side: "right", nx: 7 }, // after "for" (same kiss as "at")
  },
  {
    src: "/portfolio/stickers/agent-workflow.svg",
    alt: "Agent workflow",
    w: 156,
    h: 38,
    rot: -4,
    depth: 16,
    wide: { seg: 11, side: "bottom", align: "left" }, // under "CloudKitchens", left
    compact: { seg: 14, side: "bottom", align: "left", ny: 3 }, // under "& DiDi", left
  },
  {
    src: "/portfolio/stickers/design-systems.svg",
    alt: "Design systems nerd",
    w: 185,
    h: 38,
    rot: 2,
    depth: 13,
    wide: { seg: 13, side: "bottom", align: "right" }, // under "DiDi", right
    compact: { seg: 12, side: "bottom", align: "right" }, // under "CloudKitchens", right
  },
];

// Per-layout sizing. Sticker height stays the same fraction of the headline at
// every width: 38/68 on wide (3vw ≈ 5.4vw × 38/68; 4.6cqw ≈ 8.3cqw × 38/68),
// a touch larger on compact so the outlined sticker text stays legible.
// `wide` keeps the original vw sizing from lg up, so desktop is unchanged; 8.3cqw
// matches 5.4vw at 1024 (664px of content), so there is no jump at lg.
const SIZING: Record<Layout, { root: string; h1: string; stroke: string }> = {
  wide: {
    root: "max-w-[920px] [--sticker-h:clamp(18px,4.6cqw,38px)] lg:[--sticker-h:clamp(18px,3vw,38px)]",
    h1: "leading-[0.92] text-[clamp(2rem,8.3cqw,4.25rem)] lg:text-[clamp(2rem,5.4vw,4.25rem)]",
    stroke: "4px #ffffff",
  },
  compact: {
    root: "[--sticker-h:clamp(24px,7.5cqw,40px)]",
    h1: "leading-[1.02] text-[clamp(2rem,11cqw,4rem)]",
    stroke: "3px #ffffff",
  },
};

const BASE_DELAY_MS = 100;
const STAGGER_MS = 70;

const H1_CLASS = "font-black uppercase tracking-[-0.06em] text-[#151515]";

// Medium display-serif italic, pulled tight and nudged hard into the
// neighbouring black words so the two faces actually overlap (reference look).
const ITALIC_CLASS = "relative z-10 font-medium normal-case italic tracking-[-0.03em] -ml-[0.22em] -mr-[0.14em]";

// Line-start italics (e.g. "at", "&") must NOT carry the overlap -ml: with no
// preceding word to overlap, that negative margin shoves them left past the
// alignment edge of the bold lines above/below. Keep -mr so the next bold
// word still overlaps the italic's right side.
const ITALIC_LINESTART_CLASS = "relative z-10 font-medium normal-case italic tracking-[-0.03em] -mr-[0.14em]";

type TagPos = { left: number; top: number };

export function HeroIntro({ layout = "wide" }: { layout?: Layout }) {
  const segments = SEGMENTS[layout];
  const sizing = SIZING[layout];
  const [greeting, setGreeting] = useState<string>("Hello");
  // Computed sticker positions (word-anchored, see the layout effect). Kept in
  // state — not set imperatively — so a re-render (e.g. the greeting update)
  // re-applies them via the style prop instead of wiping the inline left/top.
  const [tagPos, setTagPos] = useState<(TagPos | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const gradRef = useRef<HTMLSpanElement>(null);

  // Replay the "10+" gradient flash (hover / tap) by restarting its animation.
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
  // and once fonts / sticker images have settled their sizes. The layout that
  // is display:none at this width resolves no rects and never commits.
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
      const next = TAGS.map((tag, i): TagPos | null => {
        const el = tagRefs.current[i];
        const { seg, side, align, nx, ny } = tag[layout];
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
          left: Math.round(left + (nx ?? 0)),
          top: Math.round(top + (ny ?? 0)),
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
    // reflow at a new width, font swap, this layout being shown). It fires on
    // observe and on resize and catches reflow a window 'resize' event misses.
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
  }, [layout]);

  // Parallax. With a mouse, tags drift opposite the pointer, each by its own
  // depth. On touch there is no pointer to follow, so the same depths drive a
  // scroll drift instead: as the hero scrolls away, each tag rises at its own
  // rate, which reads as layered stickers rather than flat print.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const apply = (x: number, y: number) => {
      for (const el of tagRefs.current) {
        if (!el) continue;
        const d = Number(el.dataset.depth);
        const r = el.dataset.rot;
        el.style.transform = `translate3d(${(x * d).toFixed(1)}px, ${(y * d).toFixed(1)}px, 0) rotate(${r}deg)`;
      }
    };

    if (window.matchMedia("(hover: none)").matches) {
      const onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const p = Math.min(window.scrollY / window.innerHeight, 1); // 0..1
          apply(0, -p * 2.5);
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(raf);
      };
    }

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        apply(-nx, -ny);
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

  const words: ReactNode[] = segments.map((s, i) => {
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
            onClick={replayGrad}
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
      const lineStart = i === 0 || segments[i - 1].k === "br";
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
  const tagBase = BASE_DELAY_MS + segments.length * STAGGER_MS;

  return (
    // @container: below lg the type and stickers size from the content column
    // (cqw), not the viewport, so the composition holds at any column width.
    <div ref={containerRef} className={`@container relative ${sizing.root}`}>
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

      {/* White stroke under the fill: invisible on the white page except where
          letters overlap, where the back letter shows a clean white gap — the
          "overlap with a seam" look. paintOrder:stroke keeps the glyph core solid. */}
      <h1
        className={`${H1_CLASS} ${sizing.h1}`}
        style={{ WebkitTextStroke: sizing.stroke, paintOrder: "stroke" }}
      >
        {words}
      </h1>

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
              style={{ height: "var(--sticker-h)", width: "auto" }}
            />
          </span>
        </span>
      ))}
    </div>
  );
}
