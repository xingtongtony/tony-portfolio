/**
 * Construction-tool choreography inspired by MIT-licensed swarm-page-builder
 * (Copyright (c) 2026 程序员阿鑫). This is a new 3D surface-path adapter, not a
 * copy of DrawingEngine. All returned points stay in FIGURE LOCAL space.
 */
import { Euler, Matrix4, Quaternion, Vector3 } from "three";
import type { BuiltFigure } from "./figure-builder";
import type { PartDef, ShapeDef, Vec3 } from "./figures";

export type ConstructionPlan = {
  partId: string;
  kind: "drag" | "pen" | "duplicate" | "type";
  paths: Vector3[][];
  corners?: Vector3[];
  text?: string;
};

type SurfacePath = { outline: Vector3[]; corners?: Vector3[] };
const ZERO: Vec3 = [0, 0, 0];
const ARC_STEPS = 16;

function transform(pos: Vec3, rot: Vec3 = ZERO, scale = 1) {
  return new Matrix4().compose(
    new Vector3(...pos),
    new Quaternion().setFromEuler(new Euler(...rot)),
    new Vector3(scale, scale, scale),
  );
}

function matrix(part: PartDef, shape: ShapeDef) {
  const frame = part.frame;
  return transform(frame?.pos ?? ZERO, frame?.rot ?? ZERO, frame?.scale ?? 1)
    .multiply(transform(shape.pos, "rot" in shape ? shape.rot : ZERO));
}

function close(points: Vector3[]) {
  const continuous = points.filter((point, i) => i === 0 || point.distanceToSquared(points[i - 1]) > 1e-20);
  if (continuous.length > 1 && continuous[0].distanceToSquared(continuous[continuous.length - 1]) < 1e-20) {
    continuous[continuous.length - 1] = continuous[0].clone();
  } else if (continuous.length) continuous.push(continuous[0].clone());
  return continuous;
}

/** Same circular corner construction as figure-builder, sixteen steps per arc. */
function rectangle(w: number, h: number, radius: number, z: number): Vector3[] {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  if (r < 1e-8) return close([
    new Vector3(-w / 2, -h / 2, z), new Vector3(w / 2, -h / 2, z),
    new Vector3(w / 2, h / 2, z), new Vector3(-w / 2, h / 2, z),
  ]);
  const points = [new Vector3(-w / 2 + r, -h / 2, z)];
  for (const [cx, cy, start] of [
    [w / 2 - r, -h / 2 + r, -Math.PI / 2],
    [w / 2 - r, h / 2 - r, 0],
    [-w / 2 + r, h / 2 - r, Math.PI / 2],
    [-w / 2 + r, -h / 2 + r, Math.PI],
  ]) {
    for (let i = 0; i <= ARC_STEPS; i++) {
      const a = start + (Math.PI / 2) * i / ARC_STEPS;
      points.push(new Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z));
    }
  }
  return close(points);
}

function circle(radius: number, plane: "xy" | "xz", offset: number) {
  return Array.from({ length: 4 * ARC_STEPS + 1 }, (_, i) => {
    const angle = i * Math.PI * 2 / (4 * ARC_STEPS);
    const x = Math.cos(angle) * radius, v = Math.sin(angle) * radius;
    return plane === "xy" ? new Vector3(x, v, offset) : new Vector3(x, offset, v);
  }).map((p, i, all) => i === all.length - 1 ? all[0].clone() : p);
}

/** An inset selection quad whose corners lie on the flat face itself. */
function quad(w: number, h: number, radius: number, z: number) {
  const x = Math.max(0, w / 2 - radius), y = Math.max(0, h / 2 - radius);
  return [new Vector3(-x, y, z), new Vector3(x, y, z), new Vector3(x, -y, z), new Vector3(-x, -y, z)];
}

function bevel(given: number | undefined, smallest: number, maximum: number) {
  return Math.min(given ?? Math.min(0.024, smallest * 0.2), maximum);
}

/** Polygon rounding follows the same quadratic corner joins as the real mesh. */
function polygon(shape: Extract<ShapeDef, { k: "poly" }>) {
  const pts = shape.pts, z = shape.t / 2;
  if (!shape.r) return close(pts.map(([x, y]) => new Vector3(x, y, z)));
  const points: Vector3[] = [];
  const toward = (from: number[], to: number[]) => {
    const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
    const t = length ? Math.min(shape.r!, length / 2) / length : 0;
    return new Vector3(from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t, z);
  };
  pts.forEach((corner, i) => {
    const enter = toward(corner, pts[(i + pts.length - 1) % pts.length]);
    const leave = toward(corner, pts[(i + 1) % pts.length]);
    points.push(enter);
    for (let j = 1; j <= ARC_STEPS; j++) {
      const t = j / ARC_STEPS, u = 1 - t;
      points.push(new Vector3(u * u * enter.x + 2 * u * t * corner[0] + t * t * leave.x,
        u * u * enter.y + 2 * u * t * corner[1] + t * t * leave.y, z));
    }
  });
  return close(points);
}

function surface(shape: ShapeDef): SurfacePath {
  if (shape.k === "slab") {
    const [w, h] = shape.size;
    const b = shape.t < 0.02 ? 0 : bevel(shape.bevel, Math.min(shape.t, w, h), Math.min(shape.t, w, h) / 2);
    // The flat cap is inset by the bevel; using the full silhouette at z=t/2
    // would place the cursor outside the physical rounded edge.
    const cw = w - 2 * b, ch = h - 2 * b, r = Math.max(0.0005, Math.max(shape.r, b) - b);
    return { outline: rectangle(cw, ch, r, shape.t / 2), corners: quad(cw, ch, r, shape.t / 2) };
  }
  if (shape.k === "box") {
    const [w, h, d] = shape.size, smallest = Math.min(w, h, d);
    const b = smallest < 0.02 ? 0 : bevel(shape.bevel, smallest, smallest / 2);
    return { outline: rectangle(w - 2 * b, h - 2 * b, 0, d / 2), corners: quad(w - 2 * b, h - 2 * b, 0, d / 2) };
  }
  if (shape.k === "poly") return { outline: polygon(shape) };
  if (shape.k === "torus") return { outline: circle(shape.R + shape.tube, "xy", 0) };
  if (shape.k === "ball") return { outline: circle(shape.r, "xy", 0) };
  if (shape.k === "cyl") {
    const b = bevel(shape.bevel, Math.min(shape.r, shape.h), Math.min(shape.r, shape.h / 2));
    // Flat-ended buttons use the end-cap rim; domed pause blocks use the
    // meridian, which lies on the cylinder's actual lathed surface.
    return { outline: b < shape.r * 0.6 ? circle(shape.r - b, "xz", shape.h / 2) : rectangle(shape.r * 2, shape.h, b, 0) };
  }
  const half = shape.span / 2, radius = (half * half + shape.rise * shape.rise) / (2 * shape.rise);
  const drop = radius - shape.rise, start = Math.atan2(drop, half);
  const points = Array.from({ length: 2 * ARC_STEPS + 1 }, (_, i) => {
    const a = start + (Math.PI - 2 * start) * i / (2 * ARC_STEPS);
    return new Vector3(Math.cos(a) * radius, Math.sin(a) * radius - drop, shape.tube);
  });
  return { outline: points };
}

function area(shape: ShapeDef) {
  if (shape.k === "slab" || shape.k === "box") return shape.size[0] * shape.size[1];
  if (shape.k === "cyl") return 2 * shape.r * shape.h;
  if (shape.k === "ball") return Math.PI * shape.r ** 2;
  if (shape.k === "torus") return Math.PI * (shape.R + shape.tube) ** 2;
  if (shape.k === "arch") return shape.span * shape.rise;
  const xs = shape.pts.map(p => p[0]), ys = shape.pts.map(p => p[1]);
  return (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
}

function mainShape(part: PartDef) {
  if (part.id === "rug") {
    return part.shapes.filter(s => s.k === "slab").sort((a, b) => {
      const height = (s: ShapeDef) => new Vector3(0, 0, s.k === "slab" ? s.t / 2 : 0).applyMatrix4(matrix(part, s)).y;
      return height(b) - height(a);
    })[0];
  }
  return [...part.shapes].sort((a, b) => area(b) - area(a) || b.pos[1] - a.pos[1])[0];
}

/** Geometry only. The caller applies group.localToWorld and camera projection. */
export function createTVConstruction(fig: BuiltFigure): Map<string, ConstructionPlan> {
  const plans = new Map<string, ConstructionPlan>();
  if (fig.def.id !== "tv") return plans;
  for (const part of fig.def.parts) {
    const main = mainShape(part);
    if (!main) continue;
    const face = surface(main), m = matrix(part, main);
    const plan: ConstructionPlan = {
      partId: part.id,
      kind: part.id.startsWith("focus-") ? "pen" : "drag",
      paths: [face.outline.map(p => p.applyMatrix4(m))],
      corners: face.corners?.map(p => p.applyMatrix4(m)),
    };
    const append = (shape: ShapeDef) => {
      if (plan.paths.length < 4) plan.paths.push(surface(shape).outline.map(p => p.applyMatrix4(matrix(part, shape))));
    };
    if (part.id === "console" && main.k === "box") {
      const back = surface(main).outline.map(p => new Vector3(p.x, p.y, -main.size[2] / 2));
      plan.paths.push(back.map(p => p.applyMatrix4(m)));
      const [w, h, d] = main.size;
      const b = bevel(main.bevel, Math.min(w, h, d), Math.min(w, h, d) / 2);
      // Follow the two upper fillets and top surface rather than drawing a
      // straight connector through the interior of the rounded cabinet.
      for (const x of [-w / 2 + b, w / 2 - b]) {
        const edge: Vector3[] = [];
        for (let i = 0; i <= ARC_STEPS; i++) {
          const a = Math.PI / 2 * i / ARC_STEPS;
          edge.push(new Vector3(x, h / 2 - b + Math.sin(a) * b, d / 2 - b + Math.cos(a) * b));
        }
        for (let i = 0; i <= ARC_STEPS; i++) {
          const a = Math.PI / 2 * (1 - i / ARC_STEPS);
          edge.push(new Vector3(x, h / 2 - b + Math.sin(a) * b, -d / 2 + b - Math.cos(a) * b));
        }
        plan.paths.push(edge.map(p => p.applyMatrix4(m)));
      }
    } else if (part.id === "soundbar") {
      const source = part.shapes.find(s => s.k === "cyl");
      if (source?.k === "cyl") {
        plan.kind = "duplicate";
        plan.paths = [];
        plan.corners = undefined;
        part.shapes.filter(s => s.k === "cyl" && s.r === source.r && s.h === source.h).slice(0, 4).forEach(append);
      }
    } else if (part.id === "props") {
      plan.kind = "pen";
      part.shapes.filter(s => s.k === "cyl").slice(0, 2).forEach(append);
      const loop = part.shapes.find(s => s.k === "torus");
      if (loop) append(loop);
    } else if (part.id === "remote") {
      part.shapes.filter(s => s !== main && (s.k === "torus" || s.k === "cyl")).slice(0, 3).forEach(append);
    } else if (part.id === "tv-body") {
      part.shapes.filter(s => s !== main).forEach(append);
    } else if (part.id === "focus-plaque") {
      const label = part.shapes.find(s => s.map?.startsWith("label:Focus|")) ?? main;
      const labelFace = surface(label), labelMatrix = matrix(part, label);
      plan.kind = "type";
      plan.text = "Focus";
      plan.paths = [labelFace.outline.map(p => p.applyMatrix4(labelMatrix))];
      plan.corners = labelFace.corners?.map(p => p.applyMatrix4(labelMatrix));
    }
    plans.set(part.id, plan);
  }
  return plans;
}
