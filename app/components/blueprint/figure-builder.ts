// Turns a FigureDef into three.js objects that exist in two states at once:
//
//   DRAWING — a patent figure. Every solid is filled with the PAPER colour,
//   unlit, so it hides the lines behind it (hidden-line removal) but reads as
//   blank paper. The outline of each soft solid is a back-face hull pushed
//   out along the normals; constant-width ink lines run along the middle of
//   its rounded edges, so the drawing is as soft as the object.
//
//   OBJECT — a clay toy: every edge rounded, matte surfaces in one shared
//   palette, real screens showing the case study's UI, lit by a large soft
//   light and casting soft, tinted shadows.
//
// One uniform per part, `h`, separates the two. Below world height `h` a
// fragment shows the object; above it, the drawing. Ink lines, the hull and
// the shadow-casting depth pass use the same test, so as `h` sweeps up the
// part, the drawing turns into the object from the ground up — lines vanish,
// material appears, the shadow grows — with a thin band of the building
// agent's colour at the front.

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";
import { AGENTS, INK, type FigureDef, type Finish, type ShapeDef } from "./figures";
import { displayRgb, STUDIO_ATMOSPHERE, type StudioAtmosphere } from "./studio-atmosphere";
import { getTexture } from "./textures";
import { createIndirectUniforms, type ReferenceIndirectUniforms } from "./reference-irradiance";
import { INDIRECT_FRAGMENT, INDIRECT_LIGHTING, INDIRECT_VERTEX } from "./reference-irradiance-shader";

/** What the build engine reads and writes for one part. */
export type PartRuntime = {
  /** World height below which the part is "built". -1e3 = drawing, 1e3 = built. */
  h: { value: number };
  /** 1 while the build front is moving through the part. */
  bandOn: { value: number };
  band: { value: THREE.Vector3 };
  minY: number;
  maxY: number;
  /** World point the agent's cursor goes to (top centre of the part). */
  anchor: THREE.Vector3;
  /** 0..1, kept after the build for "built" checks. */
  progress: number;
  object: THREE.Object3D;
};

/** Hull thickness in world units; the scene sets it to (px / camera zoom). */
export const HULL_U = { value: 0.015 };

// ── Materials ──────────────────────────────────────────────────────────────

/**
 * Surface recipes. Clay is the default: fully matte, with a little sheen so
 * the form turns softly at its edges. `screen` and `led` glow.
 */
const FINISHES: Record<Finish, THREE.MeshPhysicalMaterialParameters> = {
  clay: { roughness: 0.65, metalness: 0, specularIntensity: 0.48, sheen: 0.18, sheenRoughness: 0.65, sheenColor: "#ffffff" },
  // Moulded plastic for the small things you press.
  soft: { roughness: 0.45, metalness: 0, clearcoat: 0.25, clearcoatRoughness: 0.4 },
  // Printed card and paper.
  print: { roughness: 0.94, metalness: 0, specularIntensity: 0.22 },
  screen: { roughness: 0.25, metalness: 0, clearcoat: 0.42, clearcoatRoughness: 0.24 },
  led: { roughness: 0.4, metalness: 0 },
};

// The TV reference uses smooth satin resin, with broad, restrained highlights.
// Keep this separate from the other exhibits' matte clay recipes.
const TV_FINISHES: Record<Finish, THREE.MeshPhysicalMaterialParameters> = {
  clay: { roughness: 0.44, metalness: 0, specularIntensity: 0.5, clearcoat: 0.2, clearcoatRoughness: 0.36 },
  soft: { roughness: 0.34, metalness: 0, specularIntensity: 0.5, clearcoat: 0.24, clearcoatRoughness: 0.32 },
  print: { roughness: 0.9, metalness: 0, specularIntensity: 0.2 },
  screen: { roughness: 0.18, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.2 },
  led: { roughness: 0.35, metalness: 0 },
};

/**
 * Clay is not perfectly smooth. A fine noise, fixed to the object, tilts the
 * shading normal a few degrees, so matte surfaces catch the light with a
 * slight tooth instead of looking like flat vector fills. It fades out long
 * before a grain gets as small as a pixel, so nothing shimmers in motion.
 */
const GRAIN: Record<Finish, number> = { clay: 0.03, soft: 0.015, print: 0.02, screen: 0, led: 0 };
const GRAIN_NOISE = /* glsl */ `
float grainHash( vec3 p ) {
  p = fract( p * 0.3183099 + 0.1 );
  p *= 17.0;
  return fract( p.x * p.y * p.z * ( p.x + p.y + p.z ) );
}
float grainNoise( vec3 x ) {
  vec3 i = floor( x );
  vec3 f = fract( x );
  f = f * f * ( 3.0 - 2.0 * f );
  return mix(
    mix( mix( grainHash( i ), grainHash( i + vec3( 1, 0, 0 ) ), f.x ), mix( grainHash( i + vec3( 0, 1, 0 ) ), grainHash( i + vec3( 1, 1, 0 ) ), f.x ), f.y ),
    mix( mix( grainHash( i + vec3( 0, 0, 1 ) ), grainHash( i + vec3( 1, 0, 1 ) ), f.x ), mix( grainHash( i + vec3( 0, 1, 1 ) ), grainHash( i + vec3( 1, 1, 1 ) ), f.x ), f.y ),
    f.z );
}
`;
const GRAIN_NORMAL = /* glsl */ `
if ( uGrain > 0.0 ) {
  // Each grain must cover several pixels. At a pixel or less the noise is
  // sampled differently every frame and the whole surface sparkles when the
  // figure turns, so the grain is coarse and fades out well before that.
  vec3 gp = vGrainPos * 52.0;
  float gw = max( fwidth( gp.x ), max( fwidth( gp.y ), fwidth( gp.z ) ) );
  float ga = uGrain * ( 1.0 - smoothstep( 0.2, 0.34, gw ) );
  vec3 g = vec3( grainNoise( gp ), grainNoise( gp + 19.7 ), grainNoise( gp + 43.3 ) ) - 0.5;
  normal = normalize( normal + g * ga );
}
`;

const WORLD_Y_VERTEX = "#include <project_vertex>\nvWorldY = (modelMatrix * vec4(transformed, 1.0)).y;";

function fillMaterial(
  color: string,
  finish: Finish,
  map: string | undefined,
  rt: PartRuntime,
  fade: { value: number },
  origin: { value: THREE.Vector3 },
  atmosphere: StudioAtmosphere,
  reference: boolean,
  drawing: boolean,
  reflectance: number,
  indirect?: ReferenceIndirectUniforms,
) {
  const params: THREE.MeshPhysicalMaterialParameters = {
    ...(reference ? TV_FINISHES : FINISHES)[finish],
    color: new THREE.Color(color).multiplyScalar(reflectance),
    // Push the fill back a hair so the ink lines always win the depth test.
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  };
  if (reference) params.shadowSide = THREE.FrontSide;
  if (finish === "screen" && map) {
    // A lit display: the picture is emitted, the glass on top reflects.
    params.color = "#050505";
    params.emissive = "#ffffff";
    params.emissiveMap = getTexture(map);
    params.emissiveIntensity = 1;
  } else if (finish === "led") {
    params.emissive = color;
    params.emissiveIntensity = 1.6;
  } else if (map) {
    params.color = "#ffffff";
    params.map = getTexture(map);
  } else if (finish === "clay" || finish === "soft") {
    // Clay and soft plastic let a little light through, so their shade keeps
    // its colour instead of going grey. A trace of self-colour stands in for that.
    params.emissive = color;
    params.emissiveIntensity = reference ? 0 : 0.045;
  }
  if (reference && !drawing && (finish === "clay" || finish === "soft")) {
    params.envMapIntensity = 1;
    params.clearcoat = 0.3;
    params.clearcoatRoughness = 0.3;
  }
  const m = new THREE.MeshPhysicalMaterial(params);
  m.customProgramCacheKey = () => `figure-fill:${reference ? "tv-indirect" : "clay"}:${drawing ? "drawing" : "environment"}`;
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uH = rt.h;
    shader.uniforms.uBandOn = rt.bandOn;
    shader.uniforms.uBand = rt.band;
    Object.assign(shader.uniforms, atmosphere);
    shader.uniforms.uFade = fade;
    shader.uniforms.uGrain = { value: reference ? 0 : GRAIN[finish] };
    shader.uniforms.uOrigin = origin;
    if (indirect) Object.assign(shader.uniforms, indirect);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vWorldY;\nvarying vec3 vGrainPos;\nvarying vec3 vFig;\nuniform vec3 uOrigin;")
      .replace(
        "#include <project_vertex>",
        WORLD_Y_VERTEX + "\nvGrainPos = position;\nvFig = (modelMatrix * vec4(transformed, 1.0)).xyz - uOrigin;",
      );
    if (indirect) {
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\n" + INDIRECT_VERTEX)
        .replace("#include <project_vertex>", "#include <project_vertex>\nvIndirectPosition = (uIndirectWorldToLocal * modelMatrix * vec4(transformed, 1.0)).xyz;");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\n" + INDIRECT_FRAGMENT)
        .replace("#include <lights_fragment_maps>", "#include <lights_fragment_maps>\n" + INDIRECT_LIGHTING)
        .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\nif (uIndirectCapture > 0.5 && vWorldY > uH) discard;");
    }
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>" + (drawing ? "" : "\nif (vWorldY > uH) discard;"))
      .replace(
        "#include <common>",
        "#include <common>\nvarying float vWorldY;\nvarying vec3 vGrainPos;\nvarying vec3 vFig;\nuniform float uH;\nuniform float uBandOn;\nuniform float uFade;\nuniform float uGrain;\nuniform vec3 uBand;\n" +
          GRAIN_NOISE + STUDIO_ATMOSPHERE,
      )
      .replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\n" + GRAIN_NORMAL)
      // Hand-made surfaces are never one flat colour: broad, faint unevenness.
      .replace(
        "#include <color_fragment>",
        "#include <color_fragment>\nif ( uGrain > 0.0 ) diffuseColor.rgb *= 1.0 + 1.4 * uGrain * ( grainNoise( vGrainPos * 7.0 ) - 0.5 );",
      )
      .replace(
        "#include <dithering_fragment>",
        [
          // Light falls off across the figure, as it does under a real soft
          // box: brightest on what is nearest the key light, dimmer on what
          // is furthest from it and close to the ground.
          ...(reference ? [] : [
            "float reach = dot(vFig - vec3(0.0, 0.9, 0.0), vec3(-0.304, 0.852, 0.426));",
            "gl_FragColor.rgb *= mix(0.84, 1.09, smoothstep(-1.5, 1.5, reach));",
          ]),
          "float built = 1.0 - smoothstep(uH - 0.003, uH + 0.003, vWorldY);",
          "float band = uBandOn * (1.0 - smoothstep(0.012, 0.03, abs(vWorldY - uH)));",
          "if (built < 1.0 || band > 0.0 || uFade > 0.0) {",
          "  vec3 paper = studioPaper();",
          "  vec3 surface = mix(paper, gl_FragColor.rgb, built);",
          "  gl_FragColor.rgb = mix(mix(surface, uBand, band), paper, uFade);",
          "}",
          "#include <dithering_fragment>",
        ].join("\n"),
      );
  };
  return m;
}

/** Shadow pass: only the built portion of a part casts a shadow. */
function depthMaterial(rt: PartRuntime) {
  const m = new THREE.MeshDepthMaterial();
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uH = rt.h;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vWorldY;")
      .replace("#include <project_vertex>", WORLD_Y_VERTEX);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vWorldY;\nuniform float uH;")
      .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\nif (vWorldY > uH) discard;");
  };
  return m;
}

function fadeInk(shader: THREE.WebGLProgramParametersWithUniforms, fade: { value: number }, atmosphere: StudioAtmosphere) {
  Object.assign(shader.uniforms, atmosphere);
  shader.uniforms.uFade = fade;
  shader.fragmentShader = shader.fragmentShader
    .replace("#include <common>", "#include <common>\nuniform float uFade;\n" + STUDIO_ATMOSPHERE)
    .replace("#include <colorspace_fragment>", "#include <colorspace_fragment>\nif (uFade > 0.0) gl_FragColor.rgb = mix(gl_FragColor.rgb, studioPaper(), 1.0 - pow(1.0 - uFade, 1.65));");
}

/** Ink lines: drawn only above the build front. */
function lineMaterial(rt: PartRuntime, fade: { value: number }, atmosphere: StudioAtmosphere) {
  const m = new LineMaterial({ color: INK, linewidth: 1.25, toneMapped: false });
  m.onBeforeCompile = (shader) => {
    fadeInk(shader, fade, atmosphere);
    shader.uniforms.uH = rt.h;
    shader.vertexShader = shader.vertexShader
      .replace("#include <fog_pars_vertex>", "#include <fog_pars_vertex>\nvarying float vLineY;")
      .replace(
        "#include <fog_vertex>",
        "#include <fog_vertex>\nvLineY = (modelMatrix * vec4((position.y < 0.5) ? instanceStart : instanceEnd, 1.0)).y;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <fog_pars_fragment>", "#include <fog_pars_fragment>\nvarying float vLineY;\nuniform float uH;")
      .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\nif (vLineY < uH) discard;");
  };
  return m;
}

/** Silhouette hull for curved surfaces: also only above the build front. */
function hullMaterial(rt: PartRuntime, fade: { value: number }, atmosphere: StudioAtmosphere) {
  const m = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide, toneMapped: false });
  m.onBeforeCompile = (shader) => {
    fadeInk(shader, fade, atmosphere);
    shader.uniforms.uHull = HULL_U;
    shader.uniforms.uH = rt.h;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uHull;\nvarying float vWorldY;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed += normalize(normal) * uHull;")
      .replace("#include <project_vertex>", WORLD_Y_VERTEX);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vWorldY;\nuniform float uH;")
      .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\nif (vWorldY < uH) discard;");
  };
  return m;
}

// ── Geometry ───────────────────────────────────────────────────────────────
//
// Each shape yields a MESH — soft, smooth-shaded, nothing sharp — and the
// LINES of its drawing: the middle of every rounded edge, which sits exactly
// on the mesh. Outlines come from the hull.

const K = 1 - Math.SQRT1_2; // how far the middle of a fillet sits inside the sharp edge, per radius

function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  const rr = Math.max(0.0005, Math.min(r, w / 2, h / 2));
  s.moveTo(x + rr, y);
  s.lineTo(x + w - rr, y);
  s.absarc(x + w - rr, y + rr, rr, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - rr);
  s.absarc(x + w - rr, y + h - rr, rr, 0, Math.PI / 2, false);
  s.lineTo(x + rr, y + h);
  s.absarc(x + rr, y + h - rr, rr, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + rr);
  s.absarc(x + rr, y + rr, rr, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** A closed outline; `r` rounds every corner (clamped to the shorter edge). */
function polygon(pts: [number, number][], r = 0): THREE.Shape {
  const s = new THREE.Shape();
  const n = pts.length;
  if (r <= 0) {
    pts.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)));
    s.closePath();
    return s;
  }
  const toward = (from: [number, number], to: [number, number], d: number): [number, number] => {
    const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
    const t = Math.min(d, len / 2) / len;
    return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
  };
  for (let i = 0; i < n; i++) {
    const corner = pts[i];
    const enter = toward(corner, pts[(i + n - 1) % n], r);
    const leave = toward(corner, pts[(i + 1) % n], r);
    if (i === 0) s.moveTo(enter[0], enter[1]);
    else s.lineTo(enter[0], enter[1]);
    s.quadraticCurveTo(corner[0], corner[1], leave[0], leave[1]);
  }
  s.closePath();
  return s;
}

/** Extrude centred on z, total thickness `t`, with a rounded bevel inside that thickness. */
function extrude(shape: THREE.Shape, t: number, bevel: number, curveSegments: number, bevelSegments = 6): THREE.BufferGeometry {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: t - 2 * bevel,
    bevelEnabled: bevel > 0,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments,
    curveSegments,
  });
  g.translate(0, 0, -(t - 2 * bevel) / 2);
  return g;
}

/** Preserve planar caps and weld fine bevel normals without coarse position bins. */
function referenceExtrusion(g: THREE.BufferGeometry, thickness: number): THREE.BufferGeometry {
  const positions = g.getAttribute("position");
  const normals = g.getAttribute("normal");
  const sums = new Map<string, THREE.Vector3>();
  const keys: string[] = [];
  for (let i = 0; i < positions.count; i++) {
    const key = [positions.getX(i), positions.getY(i), positions.getZ(i)].map(v => Math.round(v * 1e6)).join(",");
    keys.push(key);
    const sum = sums.get(key) ?? new THREE.Vector3();
    sum.add(new THREE.Vector3(normals.getX(i), normals.getY(i), normals.getZ(i)));
    sums.set(key, sum);
  }
  for (const normal of sums.values()) normal.normalize();
  for (let i = 0; i < positions.count; i++) {
    const z = positions.getZ(i);
    const normal = sums.get(keys[i])!;
    // Both the flat cap and the last bevel ring meet with the cap normal.
    if (Math.abs(Math.abs(z) - thickness / 2) < 1e-5) normals.setXYZ(i, 0, 0, Math.sign(z));
    else normals.setXYZ(i, normal.x, normal.y, normal.z);
  }
  normals.needsUpdate = true;
  return g;
}

/** Map the texture once across the shape's face, instead of in shape units. */
function fitUv(g: THREE.BufferGeometry, w: number, h: number) {
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  uv.needsUpdate = true;
}

/**
 * Edge radius: the author's, or a small default. Real objects have flat faces
 * and a tight bevel that catches a line of light; a big fillet on everything
 * reads as an inflated blob.
 */
function bevelFor(given: number | undefined, smallest: number, max: number): number {
  return Math.min(given ?? Math.min(0.024, smallest * 0.2), max);
}

function edgePositions(g: THREE.BufferGeometry): number[] {
  return Array.from(new THREE.EdgesGeometry(g, 30).attributes.position.array);
}

/**
 * The twelve edges of a soft box, each drawn along the middle of its fillet,
 * joined at every corner by three short arcs — a wireframe with no points.
 */
function softBoxLines(w: number, h: number, d: number, r: number): number[] {
  const out: number[] = [];
  const hx = w / 2;
  const hy = h / 2;
  const hz = d / 2;
  const k = r * K;
  const signs = [-1, 1];
  for (const a of signs) {
    for (const b of signs) {
      out.push(-(hx - r), a * (hy - k), b * (hz - k), hx - r, a * (hy - k), b * (hz - k));
      out.push(a * (hx - k), -(hy - r), b * (hz - k), a * (hx - k), hy - r, b * (hz - k));
      out.push(a * (hx - k), b * (hy - k), -(hz - r), a * (hx - k), b * (hy - k), hz - r);
    }
  }
  const mid = new THREE.Vector3();
  const from = new THREE.Vector3();
  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  const STEPS = 4;
  for (const sx of signs) {
    for (const sy of signs) {
      for (const sz of signs) {
        const cx = sx * (hx - r);
        const cy = sy * (hy - r);
        const cz = sz * (hz - r);
        mid.set(sx, sy, sz).normalize();
        for (const end of [
          [0, sy, sz],
          [sx, 0, sz],
          [sx, sy, 0],
        ]) {
          from.set(end[0], end[1], end[2]).normalize();
          for (let i = 0; i < STEPS; i++) {
            p0.copy(from).lerp(mid, i / STEPS).normalize().multiplyScalar(r);
            p1.copy(from).lerp(mid, (i + 1) / STEPS).normalize().multiplyScalar(r);
            out.push(cx + p0.x, cy + p0.y, cz + p0.z, cx + p1.x, cy + p1.y, cz + p1.z);
          }
        }
      }
    }
  }
  return out;
}

type Built = { mesh: THREE.BufferGeometry; edges: LineSegmentsGeometry; hull: boolean };
const cache = new Map<string, Built>();

function shapeGeometry(s: ShapeDef, reference = false): Built {
  const key = JSON.stringify({ ...s, pos: 0, rot: 0, color: 0, finish: 0, map: 0, reference });
  const hit = cache.get(key);
  if (hit) return hit;

  let lines: number[] = [];
  let mesh: THREE.BufferGeometry;
  let hull = true;

  if (s.k === "box") {
    const [w, h, d] = s.size;
    const smallest = Math.min(w, h, d);
    if (smallest < 0.02) {
      // Hairline plates stay as they are.
      mesh = new THREE.BoxGeometry(w, h, d);
      lines = edgePositions(mesh);
      hull = false;
    } else {
      const r = bevelFor(s.bevel, smallest, smallest / 2);
      mesh = new RoundedBoxGeometry(w, h, d, reference ? 10 : 6, r);
      lines = softBoxLines(w, h, d, r);
    }
  } else if (s.k === "slab") {
    const [w, h] = s.size;
    const b = s.t < 0.02 ? 0 : bevelFor(s.bevel, Math.min(s.t, w, h), Math.min(s.t, w, h) / 2);
    // The wall's corners can never be tighter than the bevel that rounds them.
    const r = Math.max(s.r, b);
    const slab = extrude(roundedRect(w - 2 * b, h - 2 * b, r - b), s.t, b, reference ? 32 : 20, reference ? 10 : 6);
    mesh = reference && b > 0 ? referenceExtrusion(slab, s.t) : toCreasedNormals(slab, 0.7);
    fitUv(mesh, w, h);
    const k = b * K;
    lines = edgePositions(extrude(roundedRect(w - 2 * k, h - 2 * k, r - k), s.t - 2 * k, 0, 14));
    // Thin tiles read fine from their two outlines alone.
    hull = s.t >= 0.04;
  } else if (s.k === "cyl") {
    const b = bevelFor(s.bevel, Math.min(s.r, s.h), Math.min(s.r, s.h / 2));
    // A lathe profile with rounded top and bottom rims.
    const pts: THREE.Vector2[] = [];
    if (s.r - b > 1e-4) pts.push(new THREE.Vector2(0, -s.h / 2));
    for (let i = 0; i <= 8; i++) {
      const a = -Math.PI / 2 + (i / 8) * (Math.PI / 2);
      pts.push(new THREE.Vector2(s.r - b + Math.cos(a) * b, -s.h / 2 + b + Math.sin(a) * b));
    }
    for (let i = 0; i <= 8; i++) {
      const a = (i / 8) * (Math.PI / 2);
      pts.push(new THREE.Vector2(s.r - b + Math.cos(a) * b, s.h / 2 - b + Math.sin(a) * b));
    }
    if (s.r - b > 1e-4) pts.push(new THREE.Vector2(0, s.h / 2));
    const lathe = new THREE.LatheGeometry(pts, reference ? 80 : 56);
    // LatheGeometry already has analytic smooth profile normals. Coarse
    // crease welding merges neighbouring rings on small TV buttons/leaves.
    mesh = reference ? lathe : toCreasedNormals(lathe, 0.7);
    // Rim lines, unless the end is so round that it is a dome.
    if (b < s.r * 0.6) {
      const k = b * K;
      lines = edgePositions(new THREE.CylinderGeometry(s.r - k, s.r - k, s.h - 2 * k, 56));
    }
  } else if (s.k === "ball") {
    mesh = new THREE.SphereGeometry(s.r, reference ? 64 : 48, reference ? 40 : 32);
  } else if (s.k === "torus") {
    mesh = new THREE.TorusGeometry(s.R, s.tube, reference ? 32 : 20, reference ? 96 : 64);
  } else if (s.k === "arch") {
    // A circular arc through the two feet and the top.
    const half = s.span / 2;
    const radius = (half * half + s.rise * s.rise) / (2 * s.rise);
    const drop = radius - s.rise;
    const start = Math.atan2(drop, half);
    mesh = new THREE.TorusGeometry(radius, s.tube, 16, 48, Math.PI - 2 * start);
    mesh.rotateZ(start);
    mesh.translate(0, -drop, 0);
  } else {
    const b = s.t < 0.02 ? 0 : bevelFor(s.bevel, s.t, s.t / 2);
    const outline = polygon(s.pts, s.r);
    const flatGeo = extrude(outline, s.t, 0, 8);
    const poly = b > 0 ? extrude(outline, s.t, b, reference ? 16 : 8, reference ? 10 : 6) : flatGeo;
    mesh = b > 0 ? (reference ? referenceExtrusion(poly, s.t) : toCreasedNormals(poly, 0.7)) : flatGeo;
    lines = edgePositions(flatGeo);
    hull = s.t >= 0.04;
  }

  const edges = new LineSegmentsGeometry();
  if (lines.length) edges.setPositions(lines);
  const built = { mesh, edges, hull };
  cache.set(key, built);
  return built;
}

// ── Figures ────────────────────────────────────────────────────────────────

export type BuiltFigure = {
  def: FigureDef;
  group: THREE.Group;
  parts: Record<string, PartRuntime>;
  /** Where the figure stands in the world; the light falloff is measured from it. */
  origin: { value: THREE.Vector3 };
  /** Local diffuse lighting captured from this figure's real geometry. */
  indirect?: ReferenceIndirectUniforms;
  /** 0 = drawn normally, 1 = faded into the paper (while another figure is in focus). */
  setFade: (v: number) => void;
};

export function createFigure(def: FigureDef, atmosphere: StudioAtmosphere): BuiltFigure {
  const reference = def.id === "tv";
  const indirect = reference ? createIndirectUniforms() : undefined;
  const group = new THREE.Group();
  const parts: Record<string, PartRuntime> = {};
  const fade = { value: 0 };
  const origin = { value: new THREE.Vector3() };
  const casters: THREE.Mesh[] = [];

  for (const part of def.parts) {
    const drawing = part.drawing !== false;
    const pg = new THREE.Group();
    if (part.frame) {
      pg.position.set(part.frame.pos[0], part.frame.pos[1], part.frame.pos[2]);
      pg.rotation.set(part.frame.rot[0], part.frame.rot[1], part.frame.rot[2]);
      if (part.frame.scale !== undefined) pg.scale.setScalar(part.frame.scale);
    }
    const rt: PartRuntime = {
      h: { value: -1e3 },
      bandOn: { value: 0 },
      band: { value: displayRgb(AGENTS[part.agent].fill) },
      minY: 0,
      maxY: 1,
      anchor: new THREE.Vector3(),
      progress: 0,
      object: pg,
    };
    const fills = new Map<string, THREE.Material>();
    const depth = depthMaterial(rt);
    const line = lineMaterial(rt, fade, atmosphere);
    const hullInk = hullMaterial(rt, fade, atmosphere);

    for (const s of part.shapes) {
      const { mesh: geo, edges, hull } = shapeGeometry(s, reference);
      const color = s.color ?? part.color;
      const finish = s.finish ?? part.finish ?? "clay";
      const fillKey = `${color}|${finish}|${s.map ?? ""}`;
      let fill = fills.get(fillKey);
      if (!fill) {
        const reflectance = reference ? (part.id === "rug" ? 0.85 : part.id === "tv-body" ? 1.45 : 1) : 1;
        fill = fillMaterial(color, finish, s.map, rt, fade, origin, atmosphere, reference, drawing, reflectance, indirect);
        fills.set(fillKey, fill);
      }
      const mesh = new THREE.Mesh(geo, fill);
      mesh.position.set(s.pos[0], s.pos[1], s.pos[2]);
      if (s.k !== "ball" && s.rot) mesh.rotation.set(s.rot[0], s.rot[1], s.rot[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.customDepthMaterial = depth;
      if (drawing && edges.attributes.instanceStart) mesh.add(new LineSegments2(edges, line));
      if (drawing && hull) mesh.add(new THREE.Mesh(geo, hullInk));
      casters.push(mesh);
      pg.add(mesh);
    }

    group.add(pg);
    parts[part.id] = rt;
  }

  const setFade = (v: number) => {
    fade.value = v;
    // A figure faded into the paper must not leave its shadow behind.
    const cast = v < 0.5;
    if (casters[0].castShadow !== cast) for (const mesh of casters) mesh.castShadow = cast;
  };

  return { def, group, parts, origin, setFade, indirect };
}

/** Call once the figure sits at its final place in the scene. */
export function measureFigure(fig: BuiltFigure) {
  fig.group.updateWorldMatrix(true, true);
  fig.group.getWorldPosition(fig.origin.value);
  const box = new THREE.Box3();
  for (const rt of Object.values(fig.parts)) {
    box.setFromObject(rt.object);
    rt.minY = box.min.y;
    rt.maxY = box.max.y;
    rt.anchor.set((box.min.x + box.max.x) / 2, box.max.y, (box.min.z + box.max.z) / 2);
  }
}
