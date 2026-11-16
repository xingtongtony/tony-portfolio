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
// camera's own right / away axes, so on screen they form a tidy 2 × 2 grid and
// every figure is seen from the same angle.
const AZ = 0.56;
const EL = 0.5;
const DIR = new THREE.Vector3(Math.sin(AZ) * Math.cos(EL), Math.sin(EL), Math.cos(AZ) * Math.cos(EL));
const RIGHT = new THREE.Vector3(Math.cos(AZ), 0, -Math.sin(AZ));
const AWAY = new THREE.Vector3(-Math.sin(AZ), 0, -Math.cos(AZ));
const CAM_UP = new THREE.Vector3().crossVectors(DIR, RIGHT);

const CAPTION_OFFSET = new THREE.Vector3(0.2, 0, 1.75);

const COL = 4.9; // spacing between columns, world units (= screen units)
const ROW = 5.8; // spacing between rows on the ground (foreshortened on screen)
const SLOTS: [number, number][] = [
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, -1],
];

function slotPosition(i: number): THREE.Vector3 {
  const [cx, cz] = SLOTS[i];
  return new THREE.Vector3()
    .addScaledVector(RIGHT, (cx * COL) / 2)
    .addScaledVector(AWAY, (cz * ROW) / 2);
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const damp = (from: number, to: number, k: number, dt: number) => from + (to - from) * (1 - Math.exp(-k * dt));

/** Where an idle agent waits: a row just above the prompt chips. */
function dock(i: number, w: number, h: number): [number, number] {
  const gap = Math.min(150, (w - 60) / 5);
  return [w / 2 + (i - 2) * gap - 58, h - 126];
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
      <Environment map={environment} environmentIntensity={0.3} />
      <hemisphereLight args={["#ffffff", PALETTE.ground, 0.8]} />
      <directionalLight
        position={[-5, 14, 7]}
        intensity={1.3}
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
        position={[0.6, 20, 1.2]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0012}
        shadow-normalBias={0.02}
        shadow-radius={0.16}
      >
        <orthographicCamera attach="shadow-camera" args={[-9, 9, 9, -9, 14, 22]} />
      </directionalLight>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
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
  // The frame loop reads the latest props through this ref.
  const live = useRef({ focus, reducedMotion, onPartEvent, onBuilt });
  useEffect(() => {
    live.current = { focus, reducedMotion, onPartEvent, onBuilt };
  }, [focus, reducedMotion, onPartEvent, onBuilt]);

  // Measure every part once the figures sit in their slots, and hand the
  // runtimes to the engine so the overlay can schedule builds.
  useLayoutEffect(() => {
    for (const fig of figs) {
      measureFigure(fig);
      for (const [partId, rt] of Object.entries(fig.parts)) {
        engine.parts[`${fig.def.id}/${partId}`] = rt;
      }
    }
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

    // ── Camera: overview of the sheet, or framed on the focused figure ──
    // Same threshold as the overlay's `@4xl` container query (56rem).
    const wide = w >= 896;
    const padTop = 150; // the intro
    const padBottom = 196; // the agents' dock and the prompt
    const focusIndex = focusId ? FIGURES.findIndex((f) => f.id === focusId) : -1;
    let zoomTo: number;
    let shiftX = 0;
    const shiftY = (padBottom - padTop) / 2;
    const base = new THREE.Vector3(0, 0.9, 0);
    if (focusIndex < 0) {
      zoomTo = Math.min(w / 10.2, (h - padTop - padBottom) / 6.3);
    } else {
      // Leave room for the log / result card to the right of the figure.
      const panel = wide ? 380 : 316;
      base.copy(positions[focusIndex]).setY(0.95);
      zoomTo = Math.min((w - panel) / 4.9, (h - padTop - padBottom) / 3.7);
      shiftX = panel / 2;
    }
    zoomTo = Math.min(210, Math.max(22, zoomTo));
    // Looking at a point to the right of / below the subject moves it left / up.
    base.addScaledVector(RIGHT, shiftX / zoomTo).addScaledVector(CAM_UP, -shiftY / zoomTo);
    if (!camTarget.current) {
      camTarget.current = base.clone();
      cam.zoom = zoomTo;
    } else if (reduced) {
      camTarget.current.copy(base);
      cam.zoom = zoomTo;
    } else {
      const k = 1 - Math.exp(-4.2 * dt);
      camTarget.current.lerp(base, k);
      cam.zoom = damp(cam.zoom, zoomTo, 4.2, dt);
    }
    cam.position.copy(camTarget.current).addScaledVector(DIR, 40);
    cam.lookAt(camTarget.current);
    cam.updateProjectionMatrix();
    HULL_U.value = 1.3 / cam.zoom;

    // ── Build engine: advance every scheduled part ──
    const build = eng.build;
    if (build) {
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
      if (build && !eng.build?.paused) {
        const item = build.items.find((it) => it.agent === i && !it.ended);
        if (item && buildTime >= item.tGo) {
          const rt = eng.parts[`${item.figId}/${item.partId}`];
          v.copy(rt.anchor).project(cam);
          // Spread agents that share a spot so their name tags don't stack.
          tx = ((v.x + 1) / 2) * w + (i - 2) * 26;
          ty = ((1 - v.y) / 2) * h + (i % 2) * 24 - 6;
          working = item.started;
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
      // While one figure is in focus the others fade into the paper.
      const fadeTo = focusId && fig.def.id !== focusId ? 1 : 0;
      fades.current[i] = reduced ? fadeTo : damp(fades.current[i], fadeTo, 7, dt);
      const fade = fades.current[i];
      fig.setFade(fade);
      const callouts = calloutRefs.current[i];
      if (callouts) callouts.visible = fade < 0.5;
      place(eng.labelEls[`cap/${fig.def.id}`], v.copy(positions[i]).add(CAPTION_OFFSET), 1 - fade);
      const sway = swayRefs.current[i];
      if (!sway) return;
      for (const c of fig.def.callouts) {
        place(eng.labelEls[`n/${fig.def.id}/${c.n}`], sway.localToWorld(numeralPoint(c, v)), 1 - fade);
      }
    });

    // ── The built, focused figure turns slowly so it reads as an object, not a picture ──
    figs.forEach((fig, i) => {
      const sway = swayRefs.current[i];
      if (!sway) return;
      const built = Object.values(fig.parts).every((rt) => rt.progress >= 1);
      const turn = !reduced && built && fig.def.id === focusId ? 0.3 * Math.sin(time * 0.45) : 0;
      sway.rotation.y = damp(sway.rotation.y, turn, 3, dt);
    });
  });

  return (
    <>
      {figs.map((fig, i) => (
        <group key={fig.def.id} position={positions[i]}>
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
