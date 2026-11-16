"use client";

import { Environment, QuadraticBezierLine } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { engine, now, type BuildItem } from "./engine";
import { createFigure, HULL_U, measureFigure, type BuiltFigure } from "./figure-builder";
import { AGENTS, FIGURES, INK, PALETTE, type CalloutDef, type Vec3 } from "./figures";
import { installSoftShadows } from "./soft-shadows";

installSoftShadows();

// One fixed axonometric view, like a sheet of patent drawings: an orthographic
// camera looking down from the front-right. Figures are laid out along the
// camera's own right axis, so every one is seen from the same angle.
const AZ = 0.56;
const EL = 0.5;
const DIR = new THREE.Vector3(Math.sin(AZ) * Math.cos(EL), Math.sin(EL), Math.cos(AZ) * Math.cos(EL));
const RIGHT = new THREE.Vector3(Math.cos(AZ), 0, -Math.sin(AZ));
const CAM_UP = new THREE.Vector3().crossVectors(DIR, RIGHT);

const CAPTION_OFFSET = new THREE.Vector3(0.2, 0, 1.75);

// A carousel. The figures stand in a single row along the camera's right axis.
// The one in the middle is full size and full colour; its neighbours are
// smaller and faded almost into the paper, enough to say "there is more this
// way"; the rest are not drawn. Where the camera is along the row is a
// continuous number (`pos`), so it can be dragged, thrown and snapped.
const GAP = 4.4;
/** How far a neighbour is faded into the paper (1 = gone), and how much smaller it is. */
const GHOST = 0.84;
const NEIGHBOUR_SCALE = 0.84;
const smooth = (x: number) => x * x * (3 - 2 * x);

function slotPosition(i: number): THREE.Vector3 {
  return new THREE.Vector3().addScaledVector(RIGHT, i * GAP);
}

// The key light's place relative to what the camera looks at.
const KEY_OFFSET = new THREE.Vector3(-5, 14, 7);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const damp = (from: number, to: number, k: number, dt: number) => from + (to - from) * (1 - Math.exp(-k * dt));

/** Where an idle agent waits: a row along the bottom right, clear of the project text on the left. */
function dock(i: number, w: number, h: number): [number, number] {
  // A narrow stage has no room for five name tags side by side: the agents
  // wait as bare cursors there, and show their tags when they go to work.
  if (w < 896) return [w - 66 - (4 - i) * 34, h - 128];
  const gap = Math.min(150, (w - 570) / 4);
  return [w - 190 - (4 - i) * gap, h - 138];
}

// The shadow-casting lights, so the frame loop can ask them for a finer
// shadow on the frame that stays on screen (see soft-shadows.ts).
const shadowLights: (THREE.DirectionalLight | null)[] = [null, null];

// Accumulation (see the end of the frame loop): how many frames are averaged
// once the picture is still, how far from straight overhead the sky light
// wanders while they are drawn, and a full-screen quad that lays the running
// average back over each new frame.
const SAMPLES = 56;
const SKY_SPREAD = 1.05;
const SKY_INTENSITY = 1.1;
const blendMaterial = new THREE.ShaderMaterial({
  uniforms: { map: { value: null as THREE.Texture | null }, opacity: { value: 1 } },
  vertexShader: "varying vec2 vUv;\nvoid main() {\n  vUv = uv;\n  gl_Position = vec4(position.xy, 0.0, 1.0);\n}",
  // Straight through: the copy is already display colour, as the canvas is.
  fragmentShader:
    "uniform sampler2D map;\nuniform float opacity;\nvarying vec2 vUv;\nvoid main() {\n  gl_FragColor = vec4(texture2D(map, vUv).rgb, opacity);\n}",
  transparent: true,
  depthTest: false,
  depthWrite: false,
});
const blendScene = new THREE.Scene();
const blendQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blendMaterial);
blendQuad.frustumCulled = false;
blendScene.add(blendQuad);
const blendCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
blendCamera.position.z = 1;
const bufferSize = new THREE.Vector2();

/**
 * The scene around a built figure: a pool of the ground colour on the floor
 * that fades out to the white page. It gives the object a world to sit in —
 * the accents read against lilac instead of against white, which is most of
 * what keeps them from looking loud — without competing with the object.
 */
function makePoolTexture(color: string): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d")!;
  const n = parseInt(color.slice(1), 16);
  const rgba = (a: number) => `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  const fade = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  fade.addColorStop(0, rgba(0.82));
  fade.addColorStop(0.3, rgba(0.66));
  fade.addColorStop(0.62, rgba(0.26));
  fade.addColorStop(0.85, rgba(0.06));
  fade.addColorStop(1, rgba(0));
  g.fillStyle = fade;
  g.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export type SceneProps = {
  focus: string | null;
  reducedMotion: boolean;
  onReady: () => void;
  onSelect: (figId: string) => void;
  onPartEvent: (type: "start" | "end", item: BuildItem) => void;
  onBuilt: (figId: string, seconds: number) => void;
};

export default function Scene(props: SceneProps) {
  return (
    <Canvas
      orthographic
      // "basic" is the lookup that soft-shadows.ts replaces with area-light
      // shadows: crisp at the point of contact, wider with distance.
      shadows="basic"
      dpr={[1, 2]}
      camera={{ position: DIR.clone().multiplyScalar(40).toArray(), zoom: 60, near: 0.1, far: 200 }}
      // Neutral tone mapping is made for product rendering: it keeps the
      // sticker colours true instead of washing them out like a filmic curve.
      gl={{ antialias: true, toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1 }}
    >
      <Studio />
      <Stage {...props} />
    </Canvas>
  );
}

/**
 * Soft-box lighting for the clay, after the reference renders: big lights,
 * matte surfaces, shadows that are never black.
 *
 *   KEY  — a large soft box, high and front-left. Gives the forms their
 *          direction; its shadows fall behind and to the right.
 *   SKY  — a wider light straight overhead. It adds little light, but what it
 *          cannot reach — the foot of every object, the gaps between parts —
 *          darkens a touch, which reads as ambient occlusion.
 *   FILL — a neutral room environment (generated in code, no HDR to download)
 *          plus a sky/ground fill whose ground colour is the lilac of the
 *          bases, so shaded sides pick up a little of it.
 *
 * `shadow-radius` is each light's size (see soft-shadows.ts). An invisible
 * floor catches the shadows on the white page, tinted plum.
 */
function Studio() {
  const gl = useThree((state) => state.gl);
  const environment = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const texture = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    pmrem.dispose();
    return texture;
  }, [gl]);
  useEffect(() => () => environment.dispose(), [environment]);

  return (
    <>
      {/* The page is white and so is the paper; an opaque canvas lets frames be averaged exactly. */}
      <color attach="background" args={["#ffffff"]} />
      {/* Little light that nothing can block: most of the ambient comes from
          the sky light, which casts shadows, so creases and contacts darken. */}
      <Environment map={environment} environmentIntensity={0.25} />
      {/* Warm from above, lilac from below: shaded sides stay coloured, never grey. */}
      <hemisphereLight args={["#fff5e8", PALETTE.lilac, 0.45]} />
      <directionalLight
        ref={(light) => {
          shadowLights[0] = light;
        }}
        color="#fff3e2"
        position={[-5, 14, 7]}
        intensity={1.35}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.02}
        shadow-radius={0.22}
        shadow-intensity={0.8}
      >
        {/* Depth range kept tight around the scene: precision, and it is the
            unit the light size is measured in. */}
        <orthographicCamera attach="shadow-camera" args={[-9, 9, 9, -9, 8, 26]} />
      </directionalLight>
      <directionalLight
        ref={(light) => {
          shadowLights[1] = light;
        }}
        position={[0, 20, 0]}
        intensity={SKY_INTENSITY}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={0.48}
      >
        {/* Deep enough for the light to lean a long way over (see SKY_SPREAD). */}
        <orthographicCamera attach="shadow-camera" args={[-9, 9, 9, -9, 8, 32]} />
      </directionalLight>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        {/* Long enough for the whole row. */}
        <planeGeometry args={[400, 400]} />
        <shadowMaterial transparent color={PALETTE.plum} opacity={0.4} />
      </mesh>
    </>
  );
}

function Stage({ focus, reducedMotion, onReady, onSelect, onPartEvent, onBuilt }: SceneProps) {
  const figs = useMemo<BuiltFigure[]>(() => FIGURES.map(createFigure), []);
  const positions = useMemo(() => FIGURES.map((_, i) => slotPosition(i)), []);
  const swayRefs = useRef<(THREE.Group | null)[]>([]);
  const calloutRefs = useRef<(THREE.Group | null)[]>([]);
  const fades = useRef(FIGURES.map(() => 0));
  const camTarget = useRef<THREE.Vector3 | null>(null);
  const agentPos = useRef(AGENTS.map(() => ({ x: 0, y: 0, placed: false })));
  const swayStart = useRef(FIGURES.map(() => -1));
  // Where the camera aims for each figure: the middle of what it looks like
  // on screen, so a flat figure and a tall one both sit centred.
  const centers = useRef<THREE.Vector3[]>([]);
  const pools = useMemo(() => FIGURES.map((figure) => makePoolTexture(figure.palette.ground)), []);
  useEffect(() => () => pools.forEach((texture) => texture.dispose()), [pools]);
  const poolRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  // The carousel's position along the row, in figures; see the pointer handlers below.
  const scrub = useRef({
    pos: 0,
    target: 0,
    zoom: 100,
    pressed: false,
    dragging: false,
    startX: 0,
    startTarget: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    pending: -1,
    pendingUntil: 0,
    timer: 0,
  });
  // What the last drawn frame looked like, to tell when a new one is needed.
  const drawn = useRef({ w: 0, h: 0, count: 0, texture: null as THREE.FramebufferTexture | null });
  useEffect(() => {
    const seen = drawn.current;
    return () => {
      seen.texture?.dispose();
      seen.texture = null;
      seen.count = 0;
    };
  }, []);
  // The frame loop reads the latest props through this ref.
  const live = useRef({ focus, reducedMotion, onPartEvent, onBuilt, onSelect });
  useEffect(() => {
    live.current = { focus, reducedMotion, onPartEvent, onBuilt, onSelect };
  }, [focus, reducedMotion, onPartEvent, onBuilt, onSelect]);

  // Drag, throw, or swipe sideways on a trackpad to move along the row. A
  // small drag falls back to where it was; a real one, or a quick flick,
  // lands on the next figure.
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    const sc = scrub.current;
    const last = FIGURES.length - 1;
    const perFigure = () => GAP * sc.zoom; // pixels between two figures
    const within = (v: number) => Math.min(last + 0.35, Math.max(-0.35, v));
    const settle = (at: number) => {
      const index = Math.min(last, Math.max(0, Math.round(at)));
      sc.dragging = false;
      sc.pending = index;
      sc.pendingUntil = now() + 0.5;
      sc.target = index;
      engine.dirty = true;
      live.current.onSelect(FIGURES[index].id);
    };
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      sc.pressed = true;
      sc.startX = e.clientX;
      sc.startTarget = sc.target;
      sc.lastX = e.clientX;
      sc.lastT = e.timeStamp;
      sc.velocity = 0;
    };
    const move = (e: PointerEvent) => {
      if (!sc.pressed) return;
      const dx = e.clientX - sc.startX;
      if (!sc.dragging) {
        if (Math.abs(dx) < 8) return;
        sc.dragging = true;
        canvas.setPointerCapture(e.pointerId);
        canvas.style.setProperty("cursor", "grabbing");
      }
      const ms = Math.max(1, e.timeStamp - sc.lastT);
      sc.velocity = -(e.clientX - sc.lastX) / perFigure() / (ms / 1000);
      sc.lastX = e.clientX;
      sc.lastT = e.timeStamp;
      sc.target = within(sc.startTarget - dx / perFigure());
      engine.dirty = true;
    };
    const up = (e: PointerEvent) => {
      if (!sc.pressed) return;
      sc.pressed = false;
      if (!sc.dragging) return;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      canvas.style.setProperty("cursor", "grab");
      settle(sc.target + Math.min(0.6, Math.max(-0.6, sc.velocity * 0.22)));
    };
    const wheel = (e: WheelEvent) => {
      // Sideways only: vertical scrolling still scrolls the page.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      sc.dragging = true;
      sc.target = within(sc.target + e.deltaX / perFigure());
      engine.dirty = true;
      window.clearTimeout(sc.timer);
      sc.timer = window.setTimeout(() => settle(sc.target), 140);
    };
    canvas.style.setProperty("touch-action", "pan-y");
    canvas.style.setProperty("cursor", "grab");
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("wheel", wheel, { passive: false });
    return () => {
      window.clearTimeout(sc.timer);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("wheel", wheel);
    };
  }, [canvas]);

  // Measure every part once the figures sit in their slots, and hand the
  // runtimes to the engine so the overlay can schedule builds.
  useLayoutEffect(() => {
    const box = new THREE.Box3();
    const corner = new THREE.Vector3();
    figs.forEach((fig, i) => {
      measureFigure(fig);
      for (const [partId, rt] of Object.entries(fig.parts)) {
        engine.parts[`${fig.def.id}/${partId}`] = rt;
      }
      // The figure's extent as the camera sees it: across (RIGHT) and up (CAM_UP).
      box.setFromObject(fig.group);
      const across = [Infinity, -Infinity];
      const up = [Infinity, -Infinity];
      for (let c = 0; c < 8; c++) {
        corner.set(c & 1 ? box.max.x : box.min.x, c & 2 ? box.max.y : box.min.y, c & 4 ? box.max.z : box.min.z);
        across[0] = Math.min(across[0], corner.dot(RIGHT));
        across[1] = Math.max(across[1], corner.dot(RIGHT));
        up[0] = Math.min(up[0], corner.dot(CAM_UP));
        up[1] = Math.max(up[1], corner.dot(CAM_UP));
      }
      const origin = positions[i];
      centers.current[i] = origin
        .clone()
        .addScaledVector(RIGHT, (across[0] + across[1]) / 2 - origin.dot(RIGHT))
        .addScaledVector(CAM_UP, (up[0] + up[1]) / 2 - origin.dot(CAM_UP));
    });
    onReady();
    // Runs once: the figures never move after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const eng = engine;
    const { focus: focusId, reducedMotion: reduced } = live.current;
    const cam = state.camera as THREE.OrthographicCamera;
    const w = state.size.width;
    const h = state.size.height;
    const time = now();
    // The 3D picture is expensive to draw (soft shadows on every pixel), so it
    // is only redrawn when something in it moved. The agents and labels are
    // DOM and keep animating for free.
    let dirty = eng.dirty;
    eng.dirty = false;

    // ── Camera: where we are along the row ──
    // Same threshold as the overlay's `@4xl` container query (56rem).
    const wide = w >= 896;
    const padTop = 140; // the headline
    const padBottom = 120; // the project index
    const focusIndex = focusId ? FIGURES.findIndex((f) => f.id === focusId) : -1;
    const sc = scrub.current;
    const last = FIGURES.length - 1;
    if (!sc.dragging) {
      // Follow the chosen figure. After a drag, hold where it landed until
      // the overlay has caught up with the choice.
      if (sc.pending >= 0 && (focusIndex === sc.pending || time > sc.pendingUntil)) sc.pending = -1;
      sc.target = sc.pending >= 0 ? sc.pending : Math.max(0, focusIndex);
    }
    if (reduced || Math.abs(sc.pos - sc.target) < 0.0008) {
      if (sc.pos !== sc.target) dirty = true;
      sc.pos = sc.target;
    } else {
      // Tight to the hand while dragging, eased when let go.
      sc.pos = damp(sc.pos, sc.target, sc.dragging ? 26 : 6.5, dt);
      dirty = true;
    }
    // The figure in the middle sits a little right of centre — the left is
    // the headline and the project text — leaving the next one peeking in.
    const shiftX = -w * (wide ? 0.08 : 0.1);
    const shiftY = (padBottom - padTop) / 2;
    const lo = Math.min(last, Math.max(0, Math.floor(sc.pos)));
    const hi = Math.min(last, lo + 1);
    const base = new THREE.Vector3()
      .copy(centers.current[lo] ?? positions[lo])
      .lerp(centers.current[hi] ?? positions[hi], Math.min(1, Math.max(0, sc.pos - lo)));
    // Dragged past either end: keep going a little, so the end can be felt.
    if (sc.pos < 0) base.addScaledVector(RIGHT, sc.pos * GAP);
    if (sc.pos > last) base.addScaledVector(RIGHT, (sc.pos - last) * GAP);
    const zoomTo = Math.min(210, Math.max(22, Math.min((w * 0.58) / 4.9, (h - padTop - padBottom) / 3.7)));
    // Looking at a point to the right of / below the subject moves it left / up.
    base.addScaledVector(RIGHT, shiftX / zoomTo).addScaledVector(CAM_UP, -shiftY / zoomTo);
    if (!camTarget.current) {
      camTarget.current = base.clone();
      cam.zoom = zoomTo;
    } else {
      camTarget.current.copy(base);
      if (reduced || Math.abs(cam.zoom - zoomTo) <= 0.01) {
        cam.zoom = zoomTo;
      } else {
        cam.zoom = damp(cam.zoom, zoomTo, 4.2, dt);
        dirty = true;
      }
    }
    sc.zoom = cam.zoom;
    cam.position.copy(camTarget.current).addScaledVector(DIR, 40);
    cam.lookAt(camTarget.current);
    cam.updateProjectionMatrix();
    HULL_U.value = 1.3 / cam.zoom;
    // The lights travel with the camera, so their shadow maps only ever have
    // to cover the figure on stage — however long the row gets.
    for (const light of shadowLights) {
      if (!light) continue;
      light.target.position.copy(camTarget.current);
      light.target.updateMatrixWorld();
    }
    shadowLights[0]?.position.copy(camTarget.current).add(KEY_OFFSET);

    // ── Build engine: advance every scheduled part ──
    const build = eng.build;
    if (build) {
      if (!build.paused) dirty = true;
      const t = (build.paused ? build.pausedAt : time) - build.t0;
      let allDone = true;
      for (const item of build.items) {
        const rt = eng.parts[`${item.figId}/${item.partId}`];
        const p = item.tEnd > item.tStart ? clamp01((t - item.tStart) / (item.tEnd - item.tStart)) : t >= item.tStart ? 1 : 0;
        rt.progress = p;
        rt.h.value = p <= 0 ? -1e3 : p >= 1 ? 1e3 : rt.minY - 0.02 + (rt.maxY - rt.minY + 0.04) * ease(p);
        rt.bandOn.value = p > 0 && p < 1 ? 1 : 0;
        if (p > 0 && !item.started) {
          item.started = true;
          live.current.onPartEvent("start", item);
        }
        if (p >= 1 && !item.ended) {
          item.ended = true;
          live.current.onPartEvent("end", item);
        }
        if (p < 1) allDone = false;
      }
      if (allDone) {
        eng.build = null;
        live.current.onBuilt(build.figId, t);
      }
    }

    // ── Agents: each cursor goes to the part it is building, else waits in the dock ──
    const buildTime = build ? (build.paused ? build.pausedAt : time) - build.t0 : 0;
    const v = new THREE.Vector3();
    for (let i = 0; i < AGENTS.length; i++) {
      const el = eng.agentEls[i];
      if (!el) continue;
      let [tx, ty] = dock(i, w, h);
      let working = false;
      let docked = true;
      if (build && !eng.build?.paused) {
        const item = build.items.find((it) => it.agent === i && !it.ended);
        if (item && buildTime >= item.tGo) {
          const rt = eng.parts[`${item.figId}/${item.partId}`];
          v.copy(rt.anchor).project(cam);
          // Spread agents that share a spot so their name tags don't stack.
          tx = ((v.x + 1) / 2) * w + (i - 2) * 26;
          ty = ((1 - v.y) / 2) * h + (i % 2) * 24 - 6;
          working = item.started;
          docked = false;
        }
      } else if (build?.paused) {
        // Paused: hold wherever the agent is.
        tx = agentPos.current[i].x;
        ty = agentPos.current[i].y;
      }
      if (!reduced) {
        if (working) {
          // A small scribble while the part fills in.
          tx += Math.cos(time * 13 + i) * 5;
          ty += Math.sin(time * 11 + i * 2) * 4;
        } else if (!build?.paused) {
          ty += Math.sin(time * 1.6 + i * 1.3) * 3;
        }
      }
      const pos = agentPos.current[i];
      if (!pos.placed || reduced) {
        pos.x = tx;
        pos.y = ty;
        pos.placed = true;
      } else {
        pos.x = damp(pos.x, tx, 7, dt);
        pos.y = damp(pos.y, ty, 7, dt);
      }
      el.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
      el.style.opacity = "1";
      const tag = el.lastElementChild as HTMLElement | null;
      if (tag) tag.style.opacity = docked && !wide ? "0" : "1";
    }

    // ── Labels: captions and numerals are DOM elements pinned to 3D points ──
    const place = (el: HTMLElement | null | undefined, p: THREE.Vector3, opacity: number) => {
      if (!el) return;
      p.project(cam);
      el.style.transform = `translate3d(${(((p.x + 1) / 2) * w).toFixed(1)}px, ${(((1 - p.y) / 2) * h).toFixed(1)}px, 0)`;
      el.style.opacity = opacity.toFixed(2);
      el.style.visibility = opacity < 0.05 ? "hidden" : "visible";
    };
    figs.forEach((fig, i) => {
      // Distance from the middle of the stage, in figures, decides everything:
      // 0 is full colour and full size, 1 is a faint, smaller neighbour, and
      // much beyond that is gone.
      const away = Math.abs(i - sc.pos);
      const fadeTo = away <= 1 ? GHOST * smooth(away) : GHOST + (1 - GHOST) * smooth(Math.min(1, (away - 1) / 0.6));
      if (Math.abs(fades.current[i] - fadeTo) > 0.002) {
        fades.current[i] = fadeTo;
        dirty = true;
      }
      const fade = fades.current[i];
      swayRefs.current[i]?.scale.setScalar(1 - (1 - NEIGHBOUR_SCALE) * smooth(Math.min(1, away)));
      fig.setFade(fade);
      // Fully faded is gone: otherwise its paper would cover the focused figure's pool.
      fig.group.visible = fade < 0.985;
      // The pool of colour under the figure appears as it is built.
      const poolMaterial = poolRefs.current[i];
      if (poolMaterial) {
        const parts = Object.values(fig.parts);
        const to = (parts.reduce((sum, rt) => sum + rt.progress, 0) / parts.length) * (1 - fade);
        if (Math.abs(poolMaterial.opacity - to) > 0.004) {
          poolMaterial.opacity = reduced ? to : damp(poolMaterial.opacity, to, 5, dt);
          dirty = true;
        } else {
          poolMaterial.opacity = to;
        }
      }
      const callouts = calloutRefs.current[i];
      if (callouts) callouts.visible = fade < 0.5;
      place(eng.labelEls[`cap/${fig.def.id}`], v.copy(positions[i]).add(CAPTION_OFFSET), 1 - fade);
      const sway = swayRefs.current[i];
      if (!sway) return;
      for (const c of fig.def.callouts) {
        // Numerals belong to the figure on stage only; a neighbour keeps just its caption.
        place(eng.labelEls[`n/${fig.def.id}/${c.n}`], sway.localToWorld(numeralPoint(c, v)), fade < 0.5 ? 1 - fade : 0);
      }
    });

    // ── A figure that has just been built turns once, slowly, so it reads as
    // an object rather than a picture — then comes to rest, and so does the GPU.
    figs.forEach((fig, i) => {
      const sway = swayRefs.current[i];
      if (!sway) return;
      const built = Object.values(fig.parts).every((rt) => rt.progress >= 1);
      const presenting = !reduced && built && fig.def.id === focusId;
      if (!presenting) swayStart.current[i] = -1;
      else if (swayStart.current[i] < 0) swayStart.current[i] = time;
      const age = presenting ? time - swayStart.current[i] : 0;
      // Brief: the refined picture only starts once it is over.
      const turn = presenting && age < 4.5 ? 0.2 * Math.sin(age * 1.4) * Math.exp(-age / 1.8) : 0;
      if (turn !== 0 || Math.abs(sway.rotation.y) > 1e-4) {
        sway.rotation.y = damp(sway.rotation.y, turn, 3, dt);
        dirty = true;
      } else {
        sway.rotation.y = 0;
      }
    });

    // ── Draw ──
    // While anything moves: one frame per tick. Once it stops, the picture is
    // refined the way an offline renderer does it — several dozen frames, each
    // with the sky light somewhere else overhead and the shadow samples
    // turned, averaged into the frame on screen. The average has soft shadows
    // with no grain and, because the sky light has come from all around,
    // darker creases and contact lines: ambient occlusion. Then drawing stops.
    const seen = drawn.current;
    const gl = state.gl;
    gl.getDrawingBufferSize(bufferSize);
    if (seen.w !== bufferSize.x || seen.h !== bufferSize.y) {
      seen.w = bufferSize.x;
      seen.h = bufferSize.y;
      seen.texture?.dispose();
      seen.texture = null;
      dirty = true;
    }
    if (dirty) seen.count = 0;
    if (seen.count < SAMPLES) {
      const k = seen.count;
      const [key, sky] = shadowLights;
      if (key) key.shadow.radius = (key.shadow.radius % 1) + k;
      if (sky) {
        // Sample k of a cone around straight up. Sample 0 is straight up,
        // which is also what every moving frame uses.
        const cos = 1 - (k / SAMPLES) * (1 - Math.cos(SKY_SPREAD));
        const sin = Math.sqrt(1 - cos * cos);
        const around = k * 2.3999632;
        sky.position.set(sin * Math.cos(around) * 20, cos * 20, sin * Math.sin(around) * 20).add(sky.target.position);
        // Flat tops get the same light from every sample; only what is in the way differs.
        sky.intensity = SKY_INTENSITY / cos;
        sky.shadow.radius = (sky.shadow.radius % 1) + k;
      }
      gl.render(state.scene, state.camera);
      if (k > 0 && seen.texture) {
        blendMaterial.uniforms.map.value = seen.texture;
        blendMaterial.uniforms.opacity.value = k / (k + 1);
        gl.autoClear = false;
        gl.render(blendScene, blendCamera);
        gl.autoClear = true;
      }
      if (!dirty) {
        if (!seen.texture) seen.texture = new THREE.FramebufferTexture(bufferSize.x, bufferSize.y);
        gl.copyFramebufferToTexture(seen.texture);
        seen.count = k + 1;
      }
    }
    // Priority 1 hands rendering to this callback (see above).
  }, 1);

  return (
    <>
      {figs.map((fig, i) => (
        <group key={fig.def.id} position={positions[i]}>
          {/* The floor's pool of colour: below the shadow catcher, drawn first. */}
          {/* Sized to stop short of the neighbouring figures: an unbuilt one is
              white paper, and would show as a white shape against the colour. */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, -0.006, -0.1]} renderOrder={-1}>
            <planeGeometry args={[6.2, 6.2]} />
            <meshBasicMaterial
              ref={(material) => {
                poolRefs.current[i] = material;
              }}
              map={pools[i]}
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          <group
            ref={(el) => {
              swayRefs.current[i] = el;
            }}
          >
            <primitive object={fig.group} />
            <group
              ref={(el) => {
                calloutRefs.current[i] = el;
              }}
            >
              {fig.def.callouts.map((c) => (
                <Callout key={c.n} callout={c} />
              ))}
            </group>
          </group>

          {/* Invisible click target around the whole figure. */}
          <mesh
            position={[0, 1.05, 0]}
            onClick={(e) => {
              // A faded figure (another one is in focus) is not clickable.
              const current = live.current.focus;
              if (current && current !== fig.def.id) return;
              e.stopPropagation();
              onSelect(fig.def.id);
            }}
          >
            <boxGeometry args={[3.2, 2.2, 2.2]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

        </group>
      ))}
    </>
  );
}

/** The leader line of a patent-style reference numeral (the numeral itself is a DOM label). */
function Callout({ callout }: { callout: CalloutDef }) {
  const { at, to } = callout;
  const mid: Vec3 = [(at[0] + to[0]) / 2, (at[1] + to[1]) / 2 + 0.12, (at[2] + to[2]) / 2];
  return <QuadraticBezierLine start={at} end={to} mid={mid} color={INK} lineWidth={1} />;
}

/** Where a callout's numeral sits: just past the end of its leader. */
function numeralPoint(c: CalloutDef, out: THREE.Vector3) {
  out.set(c.to[0] - c.at[0], c.to[1] - c.at[1], c.to[2] - c.at[2]).normalize().multiplyScalar(0.17);
  return out.set(c.to[0] + out.x, c.to[1] + out.y, c.to[2] + out.z);
}
