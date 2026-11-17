// Textures for the blueprint figures.
//
// Real content first: screens show the actual case-study UI (cropped into
// public/portfolio/blueprints). The clay itself is plain colour; the only
// drawn textures are printed things — the order ticket, the QR stand,
// silk-screened labels — made on a canvas, so there are no extra image files
// to ship and the style stays consistent.
//
// Keys:  "/…jpg"       an image under /public
//        "proc:<name>" a drawing below
//        "label:<text>|<background>|<ink>"  a silk-screened label

import * as THREE from "three";
import { engine } from "./engine";
import { PALETTE } from "./figures";

const cache = new Map<string, THREE.Texture>();

/** Small deterministic random, so a texture looks the same on every load. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!];
}

const SANS = '"Geist", "Helvetica Neue", Arial, sans-serif';
const MONO = '"Geist Mono", "SF Mono", Menlo, monospace';
// Print is in the palette's deepest tone rather than black.
const INK = PALETTE.inky;

function receipt(): HTMLCanvasElement {
  const [c, g] = canvas(360, 504);
  g.fillStyle = "#FFFFFF";
  g.fillRect(0, 0, 360, 504);
  g.fillStyle = INK;
  g.textBaseline = "top";
  g.font = `700 34px ${SANS}`;
  g.fillText("LUTRA", 28, 26);
  g.font = `500 15px ${MONO}`;
  g.fillText("ORDER #1024", 28, 72);
  g.fillText("TABLE 07", 240, 72);
  g.fillRect(28, 102, 304, 2);
  const rows: [string, string][] = [
    ["Beef noodle  x1", "32.0"],
    ["Dumplings    x2", "36.0"],
    ["Cold tofu    x1", "12.0"],
    ["Plum juice   x2", "16.0"],
  ];
  rows.forEach(([name, price], i) => {
    g.fillText(name, 28, 122 + i * 30);
    g.fillText(price, 284, 122 + i * 30);
  });
  for (let x = 28; x < 332; x += 12) g.fillRect(x, 252, 6, 2);
  g.font = `700 20px ${MONO}`;
  g.fillText("TOTAL", 28, 270);
  g.fillText("¥96.0", 258, 270);
  // Barcode.
  const r = rng(3);
  let x = 28;
  while (x < 332) {
    const w = 1 + Math.floor(r() * 4);
    g.fillRect(x, 330, w, 70);
    x += w + 1 + Math.floor(r() * 4);
  }
  g.font = `500 13px ${MONO}`;
  g.fillText("THANK YOU · 谢谢惠顾", 28, 420);
  return c;
}

function qr(): HTMLCanvasElement {
  const [c, g] = canvas(280, 360);
  g.fillStyle = "#FFFFFF";
  g.fillRect(0, 0, 280, 360);
  g.fillStyle = INK;
  g.textBaseline = "top";
  g.font = `700 24px ${SANS}`;
  g.fillText("Scan to order", 34, 28);
  // A QR-like matrix: three finder squares and deterministic noise.
  const r = rng(11);
  const n = 21;
  const cell = 10;
  const ox = 35;
  const oy = 82;
  const finder = (cx: number, cy: number) => {
    g.fillRect(ox + cx * cell, oy + cy * cell, 7 * cell, 7 * cell);
    g.fillStyle = "#FFFFFF";
    g.fillRect(ox + (cx + 1) * cell, oy + (cy + 1) * cell, 5 * cell, 5 * cell);
    g.fillStyle = INK;
    g.fillRect(ox + (cx + 2) * cell, oy + (cy + 2) * cell, 3 * cell, 3 * cell);
  };
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inFinder = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
      if (!inFinder && r() > 0.52) g.fillRect(ox + x * cell, oy + y * cell, cell, cell);
    }
  }
  finder(0, 0);
  finder(n - 7, 0);
  finder(0, n - 7);
  g.font = `600 15px ${SANS}`;
  g.fillText("LUTRA · QR ORDER", 34, 314);
  return c;
}

/** The handset display carries plain type beneath the modelled viewfinder. */
function scanView(background: string): HTMLCanvasElement {
  const [c, g] = canvas(414, 856);
  g.fillStyle = background;
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = "#ffffff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `600 47px ${SANS}`;
  g.fillText("Scan", c.width / 2, c.height * 0.107);
  g.font = `500 31px ${SANS}`;
  g.fillText("Align code in frame", c.width / 2, c.height * 0.724);
  return c;
}

function label(text: string, background: string, ink: string, aspect: number): HTMLCanvasElement {
  const [c, g] = canvas(Math.round(112 * aspect), 112);
  g.fillStyle = background;
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = ink;
  g.textBaseline = "middle";
  g.textAlign = "center";
  g.font = `600 ${text.length === 1 ? 74 : 58}px ${MONO}`;
  g.fillText(text, c.width / 2, c.height * 0.51, c.width * 0.86);
  return c;
}

const DRAWINGS: Record<string, (color: string) => HTMLCanvasElement> = { receipt, qr, "scan-view": scanView };

export function getTexture(key: string): THREE.Texture {
  let tex = cache.get(key);
  if (tex) return tex;
  if (key.startsWith("/")) {
    tex = new THREE.TextureLoader().load(key, () => {
      engine.dirty = true;
    });
  } else if (key.startsWith("label:")) {
    const [text, background = PALETTE.cream, ink = INK, aspect = "8"] = key.slice(6).split("|");
    tex = new THREE.CanvasTexture(label(text, background, ink, Number(aspect)));
  } else {
    // "proc:<name>" or "proc:<name>|<colour>".
    const [name, color = INK] = key.slice(5).split("|");
    tex = new THREE.CanvasTexture(DRAWINGS[name](color));
  }
  // Colour maps are sRGB; a little anisotropy keeps them crisp at the
  // glancing angle the camera looks from.
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(key, tex);
  return tex;
}
