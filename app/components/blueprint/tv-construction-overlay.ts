/**
 * Local, independently implemented drawing tools following the Swarm task protocol.
 * Motion/design inspiration: Joel Califa's Swarm (https://califa.github.io/swarm-site/)
 * and https://github.com/DhvanilPatel/swarm-cursors; no upstream runtime is bundled.
 */
type Point = [number, number];

export type ProjectedConstruction = {
  id: string;
  agent: number;
  color: string;
  kind: "drag" | "pen" | "duplicate" | "type";
  paths: Point[][];
  corners?: Point[];
  text?: string;
  /** Projected point on the real 3D height-sweep front during extrusion. */
  fillPoint?: Point;
  drawProgress: number;
  fillProgress: number;
  opacity: number;
};

export type CursorPose = {
  x: number;
  y: number;
  tool: "arrow" | "cross" | "pen" | "duplicate" | "type";
  press: number;
};

const NS = "http://www.w3.org/2000/svg";
const clamp = (v: number) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
const ease = (p: number) => p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
const distance = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const lerp = (a: Point, b: Point, t: number): Point => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const valid = (p: Point) => Number.isFinite(p[0]) && Number.isFinite(p[1]);
const length = (points: Point[]) => points.reduce((sum, p, i) => sum + (i ? distance(points[i - 1], p) : 0), 0);
const pathD = (points: Point[]) => points.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");

/** Arc-length clipping keeps both the line and its cursor on the same point. */
function prefix(points: Point[], budget: number): { points: Point[]; end: Point } {
  const out = points.length ? [points[0]] : [];
  let end = points[0] ?? [0, 0] as Point;
  for (let i = 1; i < points.length; i++) {
    const segment = distance(points[i - 1], points[i]);
    if (segment <= 1e-6) continue;
    if (budget < segment) {
      end = lerp(points[i - 1], points[i], Math.max(0, budget) / segment);
      if (budget > 0) out.push(end);
      return { points: out, end };
    }
    budget -= segment;
    end = points[i];
    out.push(end);
  }
  return { points: out, end };
}

function bounds(points: Point[]) {
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

/** Closed rounded paths start at the dragged diagonal, avoiding a long jump. */
function startNear(points: Point[], corner: Point): Point[] {
  if (points.length < 3 || distance(points[0], points[points.length - 1]) > 1) return points;
  const ring = points.slice(0, -1);
  let at = 0;
  for (let i = 1; i < ring.length; i++) if (distance(ring[i], corner) < distance(ring[at], corner)) at = i;
  const result = [...ring.slice(at), ...ring.slice(0, at)];
  return [...result, result[0]];
}

/**
 * Points are host-local CSS pixels. No timer, animation loop, CSS transition,
 * or random offset is owned here: a paused task is an identical SVG frame.
 * Duplicate tasks use paths[0] as source and paths[1..] as destinations.
 */
export function createTVConstructionOverlay(host: HTMLElement) {
  const doc = host.ownerDocument;
  const element = <K extends keyof SVGElementTagNameMap>(tag: K, attributes: Record<string, string | number> = {}) => {
    const node = doc.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
    return node;
  };
  const svg = element("svg", { "aria-hidden": "true", focusable: "false", "data-tv-construction-overlay": "" });
  Object.assign(svg.style, { position: "absolute", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "15", overflow: "hidden" });
  host.appendChild(svg);
  let disposed = false;
  let previous = "";
  let poses = new Map<number, CursorPose>();

  const stroke = (group: SVGGElement, points: Point[], color: string, opacity = 1, dash?: string) => {
    if (points.length < 2) return;
    const path = element("path", { d: pathD(points), fill: "none", stroke: color, "stroke-width": 1.6, "stroke-linecap": "round", "stroke-linejoin": "round", "vector-effect": "non-scaling-stroke", opacity });
    if (dash) path.setAttribute("stroke-dasharray", dash);
    group.appendChild(path);
  };
  const node = (group: SVGGElement, p: Point, color: string) => {
    group.appendChild(element("circle", { cx: p[0], cy: p[1], r: 3, fill: "white", stroke: color, "stroke-width": 1.4 }));
  };
  const guides = (group: SVGGElement, p: Point, color: string) => {
    stroke(group, [[p[0] - 10, p[1]], [p[0] + 10, p[1]]], color, 0.42, "2 3");
    stroke(group, [[p[0], p[1] - 9], [p[0], p[1] + 9]], color, 0.42, "2 3");
  };
  const dimensions = (group: SVGGElement, points: Point[], color: string) => {
    if (!points.length) return;
    const box = bounds(points);
    if (box.w < 24 || box.h < 12) return;
    const center = box.x + box.w / 2, y = box.y + box.h + 9;
    const half = Math.min(20, box.w / 3);
    stroke(group, [[center - half, y], [center + half, y]], color, 0.65);
    stroke(group, [[center - half, y - 3], [center - half, y + 3]], color, 0.65);
    stroke(group, [[center + half, y - 3], [center + half, y + 3]], color, 0.65);
  };
  const controls = (group: SVGGElement, points: Point[], end: Point, color: string) => {
    if (points.length) {
      node(group, points[0], color);
      let last = points[0], shown = 1;
      for (let i = 1; i < points.length - 1 && shown < 5; i++) {
        if (distance(last, points[i]) < 34) continue;
        node(group, points[i], color); last = points[i]; shown++;
      }
    }
    if (!points.length || distance(points[0], end) > 4) node(group, end, color);
    guides(group, end, color);
  };
  const trace = (group: SVGGElement, paths: Point[][], progress: number, color: string): Point => {
    const lengths = paths.map(length);
    let budget = lengths.reduce((a, b) => a + b, 0) * clamp(progress);
    let endpoint = paths[0]?.[0] ?? [0, 0] as Point;
    for (let i = 0; i < paths.length; i++) {
      const partial = prefix(paths[i], budget);
      stroke(group, partial.points, color);
      endpoint = partial.end;
      if (budget <= lengths[i]) { controls(group, partial.points, endpoint, color); break; }
      budget -= lengths[i];
    }
    return endpoint;
  };
  const miniCursor = (group: SVGGElement, p: Point, color: string) => {
    const cursor = element("path", { d: "M0 0 L0 11 L3.2 8 L5.5 13 L7.8 12 L5.5 7.2 L10 7 Z", fill: color, stroke: "white", "stroke-width": 1.5, "stroke-linejoin": "round", transform: `translate(${p[0]} ${p[1]}) scale(.65)` });
    group.appendChild(cursor);
  };

  function clear() {
    svg.replaceChildren();
    poses = new Map();
    previous = "";
  }

  function update(tasks: ProjectedConstruction[], width: number, height: number): Map<number, CursorPose> {
    if (disposed) return new Map();
    if (!tasks.length || tasks.every(task => task.drawProgress >= 1 && task.fillProgress >= 1)) { clear(); return poses; }
    const signature = JSON.stringify([width, height, tasks]);
    if (signature === previous) return poses;
    previous = signature;
    svg.setAttribute("viewBox", `0 0 ${Math.max(1, width)} ${Math.max(1, height)}`);
    const fragment = doc.createDocumentFragment();
    const nextPoses = new Map<number, CursorPose>();
    const priorities = new Map<number, number>();
    let auxiliaryCursors = 0;

    for (const task of tasks) {
      const p = clamp(task.drawProgress), fill = clamp(task.fillProgress);
      const opacity = clamp(task.opacity) * (1 - ease(fill));
      if (opacity <= 0 || (p >= 1 && fill >= 1)) continue;
      const paths = task.paths.map(path => path.filter(valid)).filter(path => path.length > 0);
      const corners = task.corners?.filter(valid);
      if (!paths.length && !corners?.length) continue;
      const group = element("g", { opacity, "data-construction": task.id, "data-tool": task.kind });
      const color = task.color;
      let point = paths[0]?.[0] ?? corners![0];
      let tool: CursorPose["tool"] = "pen";
      let press = p > 0 && p < 1 ? 1 : 0;

      if (task.kind === "drag" && corners && corners.length >= 4) {
        const boxProgress = ease(clamp(p / 0.28));
        const quad = corners.slice(0, 4).map(corner => lerp(corners[0], corner, boxProgress));
        point = quad[2]; tool = "cross";
        if (p > 0) {
          stroke(group, [...quad, quad[0]], color, p < 0.28 ? 1 : 0.32, p < 0.28 ? undefined : "3 3");
          quad.forEach(corner => node(group, corner, color));
          guides(group, point, color);
          dimensions(group, quad, color);
        }
        if (p >= 0.28 && paths.length) {
          point = trace(group, [startNear(paths[0], corners[2]), ...paths.slice(1)], (p - 0.28) / 0.72, color);
          tool = p < 1 ? "pen" : "arrow";
        }
      } else if (task.kind === "duplicate") {
        tool = "duplicate";
        const source = paths[0];
        if (!source) continue;
        if (p > 0) stroke(group, source, color, 0.5, "3 3");
        const destinations = paths.length > 1 ? paths.slice(1) : [source];
        for (let copy = 0; copy < destinations.length; copy++) {
          const target = destinations[copy];
          const sourceLength = length(source), targetLength = length(target);
          const count = Math.max(2, Math.min(64, Math.max(source.length, target.length)));
          const shape = Array.from({ length: count }, (_, i) => lerp(prefix(source, sourceLength * i / (count - 1)).end, prefix(target, targetLength * i / (count - 1)).end, ease(p)));
          if (p > 0) stroke(group, shape, color);
          const end = shape[shape.length - 1];
          if (copy === 0) {
            point = end;
            if (p > 0) { controls(group, [shape[0]], end, color); dimensions(group, shape, color); }
            const origin = source[source.length - 1];
            const displacement = distance(origin, end);
            if (p > 0 && displacement > 12) {
              const a = lerp(origin, end, 0.23), b = lerp(origin, end, 0.77);
              stroke(group, [a, b], color, 0.6, "3 3");
              const angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
              stroke(group, [[b[0] - Math.cos(angle - 0.55) * 6, b[1] - Math.sin(angle - 0.55) * 6], b, [b[0] - Math.cos(angle + 0.55) * 6, b[1] - Math.sin(angle + 0.55) * 6]], color, 0.7);
            }
          } else if (p > 0 && p < 1 && auxiliaryCursors < 3) {
            miniCursor(group, end, color); auxiliaryCursors++;
          }
        }
      } else if (task.kind === "type") {
        tool = "type";
        const frame = corners && corners.length >= 4 ? corners.slice(0, 4) : paths[0];
        if (!frame?.length) continue;
        // Use the plaque's middle horizontal axis, rather than its lower
        // edge. Reserve the full word's width so typing does not recenter it.
        const face = frame.length >= 4 ? frame.slice(0, 4) : frame;
        let a = face.length >= 4 ? lerp(face[0], face[3], 0.5) : face[0];
        let b = face.length >= 4 ? lerp(face[1], face[2], 0.5) : face[face.length - 1];
        if (a[0] > b[0]) [a, b] = [b, a];
        const edge = Math.max(1, distance(a, b));
        const faceHeight = face.length >= 4
          ? (distance(face[0], face[3]) + distance(face[1], face[2])) / 2
          : bounds(frame).h;
        const letters = Array.from(task.text ?? "Focus");
        const size = Math.max(8, Math.min(13, faceHeight * 0.65, edge * 0.82 / Math.max(1, letters.length) / 0.6));
        const shown = letters.slice(0, p >= 1 ? letters.length : Math.floor(p * letters.length)).join("");
        const angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
        const along: Point = [Math.cos(angle), Math.sin(angle)];
        const normal: Point = [along[1], -along[0]];
        const center = lerp(a, b, 0.5);
        const fullAdvance = letters.length * size * 0.6;
        const anchor: Point = [center[0] - along[0] * fullAdvance / 2, center[1] - along[1] * fullAdvance / 2];
        const advance = shown.length * size * 0.6;
        point = [anchor[0] + along[0] * advance, anchor[1] + along[1] * advance];
        if (p > 0) {
          const text = element("text", { x: anchor[0], y: anchor[1], fill: color, "font-size": size, "font-family": "ui-monospace, SFMono-Regular, monospace", "font-weight": 600, "dominant-baseline": "central", transform: `rotate(${angle * 180 / Math.PI} ${anchor[0]} ${anchor[1]})` });
          text.textContent = shown;
          if (advance > 0) { text.setAttribute("textLength", String(advance)); text.setAttribute("lengthAdjust", "spacingAndGlyphs"); }
          group.appendChild(text);
          if (p < 1) stroke(group, [[point[0] + normal[0] * size * 0.55, point[1] + normal[1] * size * 0.55], [point[0] - normal[0] * size * 0.55, point[1] - normal[1] * size * 0.55]], color);
        }
      } else {
        if (p > 0) point = trace(group, paths, p, color);
        if (p > 0 && corners?.length) dimensions(group, corners, color);
        if (p >= 1) tool = "arrow";
      }

      if (p >= 1 && fill < 1 && task.fillPoint && valid(task.fillPoint)) {
        point = task.fillPoint;
        tool = "cross";
        press = 1;
        // The host supplies the exact 3D build-front projection. Only a short
        // local handle is drawn here; no independent extrusion clock exists.
        stroke(group, [[point[0], point[1] + 13], point], color, 0.85);
        stroke(group, [[point[0] - 3, point[1] + 4], point, [point[0] + 3, point[1] + 4]], color, 0.85);
        stroke(group, [[point[0] - 7, point[1]], [point[0] + 7, point[1]]], color, 0.5);
        node(group, point, color);
      }

      const priority = p > 0 && p < 1 ? 3 : p >= 1 ? 2 : 1;
      if (priority >= (priorities.get(task.agent) ?? -1)) {
        nextPoses.set(task.agent, { x: point[0], y: point[1], tool, press });
        priorities.set(task.agent, priority);
      }
      if (p > 0) fragment.appendChild(group);
    }
    svg.replaceChildren(fragment);
    poses = nextPoses;
    return poses;
  }

  return {
    update,
    clear,
    dispose() { if (disposed) return; disposed = true; clear(); svg.remove(); },
  };
}
