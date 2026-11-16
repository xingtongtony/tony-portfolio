// Finds faces that two shapes of a blueprint figure share exactly — the cause
// of z-fighting (a surface that strobes when the figure moves).
//
//   node scripts/blueprint-coplanar.mjs
//
// It compares axis-aligned shapes that live in the same frame: if two of them
// overlap on two axes and both have a flat face at the same coordinate on the
// third, on a side the camera sees (top, front, right), and are different
// colours, that face will flicker. Shapes turned by anything but a right angle
// are skipped (reported as a count), so still look at those by eye.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const source = readFileSync(new URL("../app/components/blueprint/figures.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const mod = { exports: {} };
new Function("module", "exports", js)(mod, mod.exports);
const { FIGURES } = mod.exports;

const EPS = 0.0015;
const right = (a) => Math.abs(a / (Math.PI / 2) - Math.round(a / (Math.PI / 2))) < 1e-6;

/** Half extents in the shape's own axes, or null if it has no simple box. */
function half(s) {
  if (s.k === "box") return s.size.map((v) => v / 2);
  if (s.k === "slab") return [s.size[0] / 2, s.size[1] / 2, s.t / 2];
  if (s.k === "cyl") return [s.r, s.h / 2, s.r];
  return null;
}

/**
 * Which of the shape's own axes end in a flat face. A cylinder's sides are
 * round; a slab's sides are flat between its corners, so they count.
 */
function flatAxes(s) {
  return s.k === "cyl" ? [false, true, false] : [true, true, true];
}

/** Axis-aligned box in the frame's space, or null when the shape is turned off-axis. */
function box(s) {
  const h = half(s);
  if (!h) return null;
  const [rx, ry, rz] = s.rot ?? [0, 0, 0];
  if (!right(rx) || !right(ry) || !right(rz)) return null;
  let e = [...h];
  let flat = flatAxes(s);
  // Applied to a vector in the order z, y, x; a quarter turn swaps two axes.
  const swap = (v, i, j) => v.map((x, k) => (k === i ? v[j] : k === j ? v[i] : x));
  const quarter = (angle) => Math.round(angle / (Math.PI / 2)) % 2 !== 0;
  for (const [turned, i, j] of [
    [quarter(rz), 0, 1],
    [quarter(ry), 0, 2],
    [quarter(rx), 1, 2],
  ]) {
    if (!turned) continue;
    e = swap(e, i, j);
    flat = swap(flat, i, j);
  }
  return { min: s.pos.map((p, i) => p - e[i]), max: s.pos.map((p, i) => p + e[i]), flat };
}

let found = 0;
let skipped = 0;
for (const fig of FIGURES) {
  const items = [];
  for (const part of fig.parts) {
    const frame = part.frame ? JSON.stringify(part.frame) : "";
    for (const s of part.shapes) {
      const b = box(s);
      if (!b) {
        skipped++;
        continue;
      }
      items.push({ b, frame, color: s.color ?? part.color, name: `${part.id}:${s.k}@${s.pos.join(",")}` });
    }
  }
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const c = items[j];
      if (a.frame !== c.frame || a.color === c.color) continue;
      for (let axis = 0; axis < 3; axis++) {
        const others = [0, 1, 2].filter((k) => k !== axis);
        const overlap = others.every((k) => Math.min(a.b.max[k], c.b.max[k]) - Math.max(a.b.min[k], c.b.min[k]) > 0.004);
        if (!overlap) continue;
        // Only the sides the camera sees: top, front and right are all "max".
        if (a.b.flat[axis] && c.b.flat[axis] && Math.abs(a.b.max[axis] - c.b.max[axis]) < EPS) {
          found++;
          console.log(`${fig.id}: ${["right", "top", "front"][axis]} face shared at ${a.b.max[axis].toFixed(4)}\n   ${a.name}\n   ${c.name}`);
        }
      }
    }
  }
}
console.log(found ? `\n${found} shared face(s).` : "No shared faces.", `(${skipped} round or off-axis shapes not checked)`);
process.exit(found ? 1 : 0);
