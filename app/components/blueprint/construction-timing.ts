// Which construction gesture builds each part, and how long it takes. Data
// only (no three.js), so the build schedule in blueprint-stage can read it
// without pulling the renderer into the page's first load.
//
// The TV's gestures are tuned by hand, after swarm-page-builder's
// approach → draw/drag → style choreography. Every other figure gets one
// chosen from its shapes (constructionChoice below).
import type { PartDef, ShapeDef } from "./figures";

export type ConstructionKind = "drag" | "pen" | "duplicate" | "type";

export const TV_CONSTRUCTION_TIMING: Record<string, { draw: number; fill: number }> = {
  rug: { draw: 0.7, fill: 0.35 },
  console: { draw: 0.9, fill: 0.5 },
  "tv-body": { draw: 0.85, fill: 0.5 },
  "tv-ui": { draw: 0.7, fill: 0.4 },
  soundbar: { draw: 0.78, fill: 0.35 },
  remote: { draw: 0.7, fill: 0.35 },
  props: { draw: 1.05, fill: 0.43 },
  "focus-outer": { draw: 1.4, fill: 0.62 },
  "focus-inner": { draw: 1.2, fill: 0.62 },
  "focus-plaque": { draw: 0.47, fill: 0.31 },
};

/** Size of a shape's main face, to rank a part's shapes. */
export function shapeArea(shape: ShapeDef) {
  if (shape.k === "slab" || shape.k === "box") return shape.size[0] * shape.size[1];
  if (shape.k === "cyl") return 2 * shape.r * shape.h;
  if (shape.k === "ball") return Math.PI * shape.r ** 2;
  if (shape.k === "torus") return Math.PI * (shape.R + shape.tube) ** 2;
  if (shape.k === "arch") return shape.span * shape.rise;
  const xs = shape.pts.map(p => p[0]), ys = shape.pts.map(p => p[1]);
  return (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
}

/** The words a printed label carries ("label:<text>|…"). */
export function labelText(shape: ShapeDef) {
  return shape.map?.startsWith("label:") ? shape.map.slice(6).split("|")[0] : undefined;
}

/** Same solid at the same size, wherever it stands: drawer fronts, keys, dots. */
const sameSolid = (shape: ShapeDef) => JSON.stringify({ ...shape, pos: 0, color: 0, map: 0, finish: 0 });

export type ConstructionChoice = { kind: ConstructionKind; main: ShapeDef; label?: ShapeDef; copies?: ShapeDef[] };

/**
 * The gesture for a part of any figure but the TV, from its shapes:
 * a printed label nearly as big as the part is typed; three or more copies of
 * one solid that make up a good share of the part are drawn once and
 * duplicated; surroundings (no patent ink) are drawn with the pen; anything
 * else starts as a box dragged out over its main face.
 */
export function constructionChoice(part: PartDef): ConstructionChoice | undefined {
  const main = [...part.shapes].sort((a, b) => shapeArea(b) - shapeArea(a) || b.pos[1] - a.pos[1])[0];
  if (!main) return undefined;
  const label = part.shapes.filter(s => labelText(s)).sort((a, b) => shapeArea(b) - shapeArea(a))[0];
  if (label && shapeArea(label) >= 0.3 * shapeArea(main) && labelText(label)!.length <= 24) return { kind: "type", main, label };
  const groups = new Map<string, ShapeDef[]>();
  for (const shape of part.shapes) {
    if (shape === main) continue;
    const key = sameSolid(shape);
    groups.set(key, [...(groups.get(key) ?? []), shape]);
  }
  const copies = [...groups.values()]
    .filter(group => group.length >= 3)
    .sort((a, b) => b.length * shapeArea(b[0]) - a.length * shapeArea(a[0]))[0];
  if (copies && copies.length * shapeArea(copies[0]) >= 0.25 * shapeArea(main)) return { kind: "duplicate", main, copies };
  return { kind: part.drawing === false ? "pen" : "drag", main };
}

// About the TV's tempo. At 0.4 s a gesture the cursors darted from box to
// box and "looked a bit crazy" (Tony, 2026-11-20); a cursor should seem to
// draw, not flick. Typing takes longer the more there is to type.
const DRAW: Record<ConstructionKind, number> = { drag: 0.65, pen: 0.8, duplicate: 0.6, type: 0.4 };

/** Seconds the gesture draws, then seconds the part takes to fill. `height` is the part's own. */
export function constructionTiming(figId: string, part: PartDef, height: number) {
  if (figId === "tv") return TV_CONSTRUCTION_TIMING[part.id];
  const choice = constructionChoice(part);
  if (!choice) return undefined;
  const typing = choice.kind === "type" ? Math.min(0.6, 0.035 * (labelText(choice.label!)?.length ?? 0)) : 0;
  return { draw: DRAW[choice.kind] + typing, fill: 0.3 + Math.min(0.25, height * 0.18) };
}
