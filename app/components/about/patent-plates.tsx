import { useId, type CSSProperties } from "react";
import type { PlateKind } from "../../lib/patents";

/**
 * The plates: each patent as a line drawing, 400 × 250, the way a design
 * patent draws a screen. Dashed lines are the screen and whatever is not
 * claimed (`u`), solid lines the claimed design (`c`), and the part the patent
 * is about is in the page accent (`h`). Every claimed stroke has pathLength 1,
 * so one dash offset draws the plate (globals.css, `.patent-plate`).
 *
 * The tablet designs come in two orientations of the same screens, so they are
 * drawn by one function from the screen's size. Redrawn from the registered
 * drawings (US D983,822, D986,264–266, D990,500–501, EP 4 258 165) and the
 * screens they were filed from. The plates of the pending inventions are
 * illustrations of the idea, not figures from the applications.
 */

type K = "c" | "h" | "u";
type Shape = { t: "rect" | "circle" | "line" | "path"; k: K; p: Record<string, number | string> };
type Drawing = {
  shapes: Shape[];
  /** Where the screen sits in the plate, when it is not the whole plate. */
  at?: [number, number];
  scale?: number;
  /** The accent runs across the drawing between these x (in the drawing's own units). */
  span: [number, number];
  /** The reference numeral: from this point on the drawing to its number. */
  ref: [number, number, number, number, string];
};

const R = (x: number, y: number, w: number, h: number, r: number, k: K): Shape => ({ t: "rect", k, p: { x, y, width: w, height: h, rx: r } });
const C = (cx: number, cy: number, r: number, k: K): Shape => ({ t: "circle", k, p: { cx, cy, r } });
const L = (x1: number, y1: number, x2: number, y2: number, k: K): Shape => ({ t: "line", k, p: { x1, y1, x2, y2 } });
const D = (d: string, k: K): Shape => ({ t: "path", k, p: { d } });
const times = (n: number) => Array.from({ length: n }, (_, i) => i);

// ─── TikTok on tablet ──────────────────────────────────────────────────────

type TabletKind = "feed" | "comments" | "share" | "menu" | "following";

function tablet(W: number, H: number, kind: TabletKind): Shape[] {
  const wide = W > H;
  const s: Shape[] = [R(0, 0, W, H, 6, "u")];
  // The tab bar: home, search, create, inbox, me.
  const bar = H - 28;
  const y = bar + 14;
  const [a, b, c, d, e] = times(5).map((i) => (W * (i + 0.5)) / 5);
  s.push(
    L(0, bar, W, bar, "c"),
    D(`M${a - 6} ${y + 5} v-7 l6 -5 l6 5 v7 Z`, "c"),
    C(b - 1, y - 1, 4.5, "c"),
    L(b + 2.5, y + 2.5, b + 6, y + 6, "c"),
    R(c - 9, y - 6, 18, 12, 3, "c"),
    D(`M${c} ${y - 3} v6 M${c - 3} ${y} h6`, "c"),
    R(d - 6, y - 5, 12, 10, 2, "c"),
    C(e, y - 3, 3, "c"),
    D(`M${e - 6} ${y + 7} q6 -7 12 0`, "c"),
  );
  if (kind === "following") {
    // Creators to follow: cards with a portrait and a Follow button; the next ones peek in.
    const card = (x: number, top: number, w: number, h: number) => [
      R(x, top, w, h, 5, "h"),
      C(x + w / 2, top + h * 0.58, 10, "h"),
      R(x + w * 0.22, top + h - 24, w * 0.56, 12, 2, "h"),
    ];
    if (wide) {
      for (const i of times(3)) s.push(...card(33 + i * 110, 66, 94, 106));
      s.push(D("M0 74 h10 a4 4 0 0 1 4 4 v82 a4 4 0 0 1 -4 4 h-10", "u"), D(`M${W} 74 h-10 a4 4 0 0 0 -4 4 v82 a4 4 0 0 0 4 4 h10`, "u"));
    } else {
      s.push(...card(55, 70, 62, 98));
      s.push(D("M0 78 h40 a4 4 0 0 1 4 4 v74 a4 4 0 0 1 -4 4 h-40", "u"), D(`M${W} 78 h-40 a4 4 0 0 0 -4 4 v74 a4 4 0 0 0 4 4 h40`, "u"));
    }
    return s;
  }
  // Landscape leaves the video in the middle of the screen: its two edges are part of the design.
  // A panel that opens over the right edge hides that part of it.
  if (wide) {
    const [from, to] = kind === "comments" ? [bar - 28, bar] : kind === "share" ? [0, bar - 108] : [0, bar];
    s.push(L(W * 0.29, 0, W * 0.29, bar, "c"), L(W * 0.71, from, W * 0.71, to, "c"));
  }
  // The action rail: creator, like, comment, share, sound.
  const k: K = kind === "feed" ? "h" : "c";
  const x = W - (wide ? 26 : 20);
  const top = wide ? 58 : 66;
  const step = wide ? 30 : 29;
  s.push(
    C(x, top, 10, k),
    C(x, top + 10, 3.5, k),
    D(`M${x} ${top + step + 7} l-7 -7 a4 4 0 0 1 7 -5 a4 4 0 0 1 7 5 Z`, k),
    D(`M${x - 7} ${top + 2 * step - 4} h14 v9 h-9 l-3 3 v-3 h-2 Z`, k),
    D(`M${x - 7} ${top + 3 * step + 4} q4 -8 12 -8 v-3 l5 6 l-5 6 v-3 q-7 0 -12 2`, k),
    C(x, top + 4 * step, 9, k),
    C(x, top + 4 * step, 3.5, k),
  );
  // The caption, bottom left of the video.
  const left = wide ? W * 0.29 + 10 : 12;
  // Beside an open panel there is less of it to see.
  const [l1, l2, l3] = kind === "feed" ? [40, wide ? 104 : 96, 56] : wide ? [40, 74, 56] : [26, 34, 30];
  if (kind !== "menu") s.push(L(left, bar - 34, left + l1, bar - 34, k), L(left, bar - 24, left + l2, bar - 24, k), L(left, bar - 14, left + l3, bar - 14, k));

  const edge = x - 16; // panels open beside the rail
  if (kind === "comments") {
    const [w, h, gap, r] = wide ? [134, 156, 26, 6] : [78, 124, 21, 5];
    const px = edge - w;
    const py = bar - (wide ? 28 : 10) - h;
    s.push(R(px, py, w, h, 6, "h"), L(px + w / 2 - w / 6, py + 12, px + w / 2 + w / 6, py + 12, "h"));
    for (const i of times(4)) {
      const cy = py + (wide ? 38 : 31) + i * gap;
      s.push(C(px + r + 9, cy, r, "h"), L(px + 2 * r + 15, cy - 3, px + w - (wide ? 26 : 20) - i * (wide ? 8 : 4), cy - 3, "h"), L(px + 2 * r + 15, cy + 4, px + w * 0.56, cy + 4, "h"));
      s.push(D(`M${px + w - 11} ${cy + 3} l-3 -3 a1.8 1.8 0 0 1 3 -2 a1.8 1.8 0 0 1 3 2 Z`, "h"));
    }
    s.push(R(px + 8, py + h - (wide ? 19 : 16), w - 16, wide ? 12 : 10, wide ? 6 : 5, "h"));
  }
  if (kind === "share") {
    const [w, h, r] = wide ? [124, 102, 8] : [84, 74, 5];
    const px = edge - w;
    const py = bar - (wide ? 6 : 10) - h;
    const gap = (w - 20) / 5;
    const ix = (i: number) => px + 10 + gap * (i + 0.5);
    s.push(R(px, py, w, h, 6, "h"));
    for (const i of times(5)) s.push(C(ix(i), py + (wide ? 22 : 16), r, "h"), C(ix(i) + r * 0.7, py + (wide ? 22 : 16) + r * 0.7, r * 0.32, "h"), C(ix(i), py + (wide ? 51 : 37), r, "h"));
    const iy = py + (wide ? 82 : 59);
    if (wide) {
      s.push(
        C(ix(0), iy, 7, "h"),
        D(`M${ix(0) - 2.5} ${iy + 4} v-8 h6 l-1.5 2 l1.5 2 h-6`, "h"),
        C(ix(1), iy, 7, "h"),
        D(`M${ix(1) - 2.5} ${iy - 4} h5 v8 l-2.5 -2 l-2.5 2 Z`, "h"),
        D(`M${ix(2)} ${iy + 4} l-5 -5 a3 3 0 0 1 5 -3.5 a3 3 0 0 1 5 3.5 Z M${ix(2)} ${iy - 4} l-1.5 3 l2 1.5`, "h"),
        D(`M${ix(3)} ${iy - 5} v7 M${ix(3) - 3} ${iy - 0.5} l3 3 l3 -3 M${ix(3) - 4} ${iy + 5} h8`, "h"),
        R(ix(4) - 6, iy - 3.5, 12, 7, 3.5, "h"),
      );
    } else {
      // The same five actions, too small here to tell apart.
      for (const i of times(5)) s.push(i < 2 ? C(ix(i), iy, 4.2, "h") : R(ix(i) - 4, iy - 3, 8, 6, 2, "h"));
    }
  }
  if (kind === "menu") {
    // Held down on a video: four actions, then friends to send it to.
    const [w, h, rowGap, faceGap, r] = wide ? [146, 136, 12.5, 13, 5] : [92, 112, 10.5, 10.5, 4];
    const px = (W - w) / 2 - (wide ? 0 : 4);
    const py = (bar - h) / 2 + (wide ? 4 : 0);
    const split = py + 4 * rowGap + (wide ? 5 : 4);
    s.push(R(px, py, w, h, 5, "h"));
    const glyphs = [
      (gx: number, gy: number) => `M${gx} ${gy - 4} v6 M${gx - 2.5} ${gy - 0.5} l2.5 2.5 l2.5 -2.5 M${gx - 3.5} ${gy + 4} h7`,
      (gx: number, gy: number) => `M${gx - 2.5} ${gy - 4} h5 v8 l-2.5 -2 l-2.5 2 Z`,
      (gx: number, gy: number) => `M${gx - 2.5} ${gy + 4} v-8 h6 l-1.5 2 l1.5 2 h-6`,
      (gx: number, gy: number) => `M${gx} ${gy + 4} l-4 -4 a2.4 2.4 0 0 1 4 -2.8 a2.4 2.4 0 0 1 4 2.8 Z`,
    ];
    glyphs.forEach((g, i) => {
      const gy = py + rowGap * (i + 0.5) + 4;
      if (wide) s.push(D(g(px + 11, gy), "h"));
      else s.push(R(px + 6.5, gy - 3, 6, 6, 1.5, "h"));
      if (i < 3) s.push(L(px + 5, gy + rowGap / 2, px + w - 5, gy + rowGap / 2, "u"));
    });
    s.push(L(px, split, px + w, split, "h"), L(px, split + 2.5, px + w, split + 2.5, "h"));
    for (const i of times(5)) {
      const cy = split + 2.5 + faceGap * (i + 0.5) + 2;
      s.push(C(px + (wide ? 11 : 9.5), cy, r, i === 4 ? "u" : "h"));
      if (i < 4) s.push(L(px + 5, cy + faceGap / 2, px + w - 5, cy + faceGap / 2, "u"));
    }
  }
  return s;
}

const TABLET_REF: Record<TabletKind, { landscape: Drawing["ref"]; portrait: Drawing["ref"] }> = {
  feed: { landscape: [354, 62, 330, 44, "10"], portrait: [278, 70, 300, 52, "10"] },
  comments: { landscape: [214, 60, 186, 44, "20"], portrait: [172, 112, 98, 92, "20"] },
  share: { landscape: [290, 104, 300, 88, "30"], portrait: [166, 150, 98, 130, "30"] },
  menu: { landscape: [273, 66, 298, 48, "40"], portrait: [150, 86, 98, 66, "40"] },
  following: { landscape: [137, 96, 150, 62, "50"], portrait: [231, 104, 300, 84, "50"] },
};

// ─── TikTok on the web ─────────────────────────────────────────────────────

/** For You: the top bar, the left navigation, a vertical video and its actions. */
function forYou(): Shape[] {
  const s: Shape[] = [
    R(10, 10, 380, 230, 4, "u"),
    L(10, 34, 390, 34, "c"),
    C(30, 22, 6, "c"),
    R(150, 15, 100, 14, 7, "c"),
    C(240, 21.5, 3, "c"),
    C(370, 22, 6, "c"),
    D("M322 25 l4 -6 l4 6 Z M336 19 l8 3 l-8 3 l2 -3 Z M350 18 h8 v7 h-8 Z", "c"),
    D("M36 54 V49 L41 45 L46 49 V54 Z", "c"),
    D("M36 68 l5 -5 l5 5 M38 64 h6", "c"),
    L(30, 80, 112, 80, "c"),
    C(38, 94, 5, "c"),
    C(38, 108, 5, "c"),
    L(30, 190, 112, 190, "c"),
    C(152, 54, 9, "c"),
    R(300, 46, 32, 12, 2, "c"),
    R(160, 72, 72, 128, 2, "h"),
    L(140, 210, 340, 210, "c"),
    C(152, 226, 7, "u"),
    R(300, 221, 32, 10, 2, "u"),
  ];
  for (const y of [122, 136, 150, 164, 178]) s.push(C(38, y, 5, "u"));
  for (const x of [30, 56, 82]) s.push(R(x, 198, 22, 7, 3.5, "c"), R(x, 210, 22, 7, 3.5, "u"));
  [156, 176, 196].forEach((y, i) => {
    s.push(C(248, y, 7, "h"));
    if (i === 0) s.push(D(`M248 ${y + 3} l-3.5 -3.5 a2 2 0 0 1 3.5 -2.5 a2 2 0 0 1 3.5 2.5 Z`, "h"));
    if (i === 1) s.push(D(`M244.5 ${y - 2} h7 v4 h-4 l-2 2 v-2 h-1 Z`, "h"));
    if (i === 2) s.push(D(`M244.5 ${y + 2} q2 -4 6 -4 v-2 l3 3 l-3 3 v-2`, "h"));
  });
  return s;
}

/** Live: a large landscape player, the next streams beside it, four cards under it. */
function live(): Shape[] {
  const s: Shape[] = [
    R(10, 10, 380, 230, 4, "u"),
    L(10, 34, 390, 34, "c"),
    C(26, 22, 6, "c"),
    R(150, 15, 100, 14, 7, "c"),
    C(370, 22, 6, "c"),
    D("M306 25 V20 L310 17 L314 20 V25 Z M322 25 l4 -6 l4 6 Z M336 19 l8 3 l-8 3 l2 -3 Z M350 18 h8 v7 h-8 Z", "c"),
    L(72, 34, 72, 240, "c"),
    D("M22 54 V49 L27 45 L32 49 V54 Z M22 68 l5 -5 l5 5 M22 76 h10 v6 h-10 Z", "c"),
    L(16, 92, 64, 92, "c"),
    C(26, 104, 5, "c"),
    C(26, 118, 5, "c"),
    L(16, 176, 64, 176, "c"),
    C(26, 188, 5, "c"),
    C(26, 202, 5, "c"),
    R(88, 42, 214, 112, 3, "h"),
    C(98, 52, 5, "h"),
    R(280, 48, 14, 7, 1.5, "h"),
    L(72, 164, 390, 164, "c"),
  ];
  for (const y of [132, 146, 160, 216, 230]) s.push(C(26, y, 5, "u"));
  [42, 70, 98, 126].forEach((y, i) => s.push(R(310, y, 66, 24, 2, i === 0 ? "h" : "c")));
  for (const x of [86, 160, 234, 308]) s.push(R(x, 172, 66, 48, 2, "c"), R(x + 4, 210, 28, 5, 1, "c"), R(x + 52, 210, 9, 5, 1, "c"), C(x + 6, 230, 5, "c"));
  return s;
}

// ─── Inventions ────────────────────────────────────────────────────────────

/** A two-dimensional code of round modules, whose positioning points are two overlapped points. */
function code(): Shape[] {
  const s: Shape[] = [R(140, 10, 120, 230, 16, "u"), R(152, 62, 96, 126, 8, "c"), C(200, 62, 9, "c"), L(176, 176, 224, 176, "c")];
  for (const [x, y] of [
    [160, 78],
    [218, 78],
    [160, 136],
  ]) {
    s.push(R(x, y, 22, 22, 4, "c"));
    for (const [dx, dy] of [[3, 3], [11, 3], [19, 3], [3, 11], [19, 11], [3, 19], [11, 19], [19, 19]]) s.push(C(x + dx, y + dy, 1.1, "c"));
    s.push(C(x + 11, y + 11, 5, "c"), C(x + 9.5, y + 11, 5, "h"));
  }
  // The modules: a fixed pattern on a 6.2 grid, skipping the three positioning corners.
  let seed = 7;
  for (const gy of times(13)) {
    for (const gx of times(13)) {
      const x = 163 + gx * 6.2;
      const y = 81 + gy * 6.2;
      const eye = (x < 186 && y < 104) || (x > 214 && y < 104) || (x < 186 && y > 132);
      seed = (seed * 9301 + 49297) % 233280;
      if (!eye && seed / 233280 < 0.5) s.push(C(Math.round(x * 10) / 10, Math.round(y * 10) / 10, 1.6, "c"));
    }
  }
  return s;
}

const SCREEN: Shape[] = [R(30, 20, 340, 196, 5, "u"), L(160, 230, 240, 230, "u")];

function television(kind: "tv-pin" | "tv-profile" | "tv-keyboard" | "tv-cards" | "playback"): Shape[] {
  const s = [...SCREEN];
  if (kind === "tv-pin") {
    s.push(L(170, 46, 230, 46, "c"));
    for (const i of times(4)) s.push(R(149 + i * 27, 58, 20, 24, 4, "h"));
    for (const r of times(4)) for (const c of times(3)) s.push(R(158 + c * 30, 98 + r * 26, 24, 20, 5, r === 3 && c !== 1 ? "c" : "h"));
  }
  if (kind === "tv-profile") {
    s.push(C(82, 70, 18, "h"), L(110, 60, 190, 60, "h"), L(110, 72, 160, 72, "h"), R(110, 82, 46, 13, 6.5, "h"), R(162, 82, 13, 13, 6.5, "h"));
    for (const r of times(2)) for (const i of times(5)) s.push(R(56 + i * 58, 110 + r * 50, 50, 42, 3, "c"));
  }
  if (kind === "tv-keyboard") {
    s.push(R(56, 40, 116, 16, 8, "c"));
    for (const r of times(6)) for (const c of times(6)) s.push(R(56 + c * 20, 66 + r * 20, 16, 16, 3, "h"));
    s.push(R(56, 188, 56, 14, 3, "h"), R(116, 188, 56, 14, 3, "h"));
    for (const r of times(2)) for (const c of times(3)) s.push(R(196 + c * 50, 40 + r * 82, 44, 76, 3, "c"));
  }
  if (kind === "tv-cards") {
    s.push(R(56, 36, 288, 14, 7, "c"), L(56, 64, 110, 64, "c"));
    for (const i of times(4)) {
      const x = 56 + i * 74;
      s.push(R(x, 74, 66, 56, 5, "h"), C(x + 33, 94, 10, "h"), L(x + 18, 116, x + 48, 116, "h"));
    }
    for (const i of times(5)) s.push(R(56 + i * 59, 142, 51, 60, 3, "c"));
  }
  if (kind === "playback") {
    s.push(L(56, 44, 150, 44, "c"), L(56, 54, 116, 54, "c"), D("M186 96 l32 19 l-32 19 Z", "c"), D("M150 108 l-10 7 l10 7 M250 108 l10 7 l-10 7", "h"));
    s.push(L(56, 184, 344, 184, "c"), L(56, 184, 176, 184, "h"), C(176, 184, 5.5, "h"), R(56, 194, 22, 6, 2, "c"), R(322, 194, 22, 6, 2, "c"));
  }
  return s;
}

const TV_REF: Record<string, Drawing["ref"]> = {
  "tv-pin": [244, 110, 276, 92, "210"],
  "tv-profile": [100, 60, 86, 38, "220"],
  "tv-keyboard": [56, 110, 24, 92, "230"],
  "tv-cards": [122, 76, 132, 60, "240"],
  playback: [176, 178, 190, 160, "250"],
};

function drawing(kind: PlateKind, orientation?: "landscape" | "portrait"): Drawing {
  switch (kind) {
    case "fyp":
      return { shapes: forYou(), span: [60, 360], ref: [232, 92, 276, 74, "60"] };
    case "live":
      return { shapes: live(), span: [60, 360], ref: [250, 42, 266, 22, "70"] };
    case "code":
      return { shapes: code(), scale: 1.32, span: [150, 250], ref: [170, 85, 96, 40, "110"] };
    case "tv-pin":
    case "tv-profile":
    case "tv-keyboard":
    case "tv-cards":
    case "playback":
      return { shapes: television(kind), span: [60, 340], ref: TV_REF[kind] };
    default:
      return orientation === "portrait"
        ? { shapes: tablet(172, 234, kind), at: [114, 8], span: [10, 162], ref: TABLET_REF[kind].portrait }
        : { shapes: tablet(380, 230, kind), at: [10, 10], span: [50, 350], ref: TABLET_REF[kind].landscape };
  }
}

/**
 * One plate. `draw` makes it draw itself when it mounts — give it a `key` to
 * draw again; without it the plate is simply there (thumbnails).
 */
export function Plate({
  kind,
  orientation,
  draw = false,
  label,
  className = "",
}: {
  kind: PlateKind;
  orientation?: "landscape" | "portrait";
  draw?: boolean;
  /** What the drawing shows, for a screen reader; without it the plate is decoration. */
  label?: string;
  className?: string;
}) {
  const gid = useId().replace(/:/g, "");
  const { shapes, at, scale, span, ref } = drawing(kind, orientation);
  const [lx, ly, tx, ty, num] = ref;
  const back = tx < lx; // the numeral sits to the left of what it points at
  const transform = at ? `translate(${at[0]} ${at[1]})` : scale ? `translate(200 125) scale(${scale}) translate(-200 -125)` : undefined;
  return (
    <svg
      viewBox="0 0 400 250"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`patent-plate h-auto w-full ${draw ? "is-drawn" : ""} ${className}`}
      fill="none"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ "--accent": `url(#${gid})` } as CSSProperties}
    >
      <defs>
        {/* In the drawing's own units, so a horizontal line takes the accent too. */}
        <linearGradient id={gid} x1={span[0]} y1="0" x2={span[1]} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="0.5" stopColor="#a855f7" />
          <stop offset="1" stopColor="#f2784b" />
        </linearGradient>
      </defs>
      {/* An enlarged drawing keeps the line weight of the others. */}
      <g transform={transform} className={scale ? "plate-scaled" : undefined} strokeWidth={scale ? 1.2 / scale : undefined} style={scale ? ({ "--plate-scale": scale } as CSSProperties) : undefined}>
        {shapes.map(({ t: Tag, k, p }, i) => (
          <Tag key={i} className={k === "c" ? "pc" : k === "h" ? "ph" : "pu"} pathLength={k === "u" ? undefined : 1} {...p} />
        ))}
      </g>
      {/* The reference numeral, the way a patent figure points at its parts. */}
      <path d={`M${lx} ${ly} Q${(lx + tx) / 2} ${ly - 8} ${tx} ${ty + 4}`} className="pc" pathLength={1} />
      <text x={back ? tx - 2 : tx + 2} y={ty} textAnchor={back ? "end" : "start"} className="pt fill-current stroke-none font-mono text-[10px]">
        {num}
      </text>
    </svg>
  );
}
