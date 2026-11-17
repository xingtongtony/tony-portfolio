"use client";

import { Environment, QuadraticBezierLine } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { engine, now, rewindTime, type BuildItem } from "./engine";
import { createFigure, HULL_U, measureFigure, type BuiltFigure } from "./figure-builder";
import { AGENTS, FIGURES, INK, type CalloutDef, type Vec3 } from "./figures";
import { installSoftShadows } from "./soft-shadows";
import { createStudioAtmosphere, displayRgb, paperCss, STUDIO_ATMOSPHERE, STUDIO_DEPTH, type StudioAtmosphere } from "./studio-atmosphere";

installSoftShadows();

// The fixed azimuth keeps the carousel on one axis. Flat exhibits can lift
// the camera to show their face as they come into focus.
const AZ = 0.56;
const EL = 0.5;
const DIR = new THREE.Vector3(Math.sin(AZ) * Math.cos(EL), Math.sin(EL), Math.cos(AZ) * Math.cos(EL));
const RIGHT = new THREE.Vector3(Math.cos(AZ), 0, -Math.sin(AZ));
const BACK = new THREE.Vector3(-Math.sin(AZ), 0, -Math.cos(AZ));
const direction = new THREE.Vector3();
const cameraUp = new THREE.Vector3();

const CAPTION_OFFSET = new THREE.Vector3(0.2, 0, 1.75);

// A carousel. The figures stand in a single row along the camera's right axis.
// The one in the middle is full size and full colour; its neighbours are
// smaller and faded almost into the paper, enough to say "there is more this
// way"; the rest are not drawn. Where the camera is along the row is a
// continuous number (`pos`), so it can be dragged, thrown and snapped.
const GAP = 4.4;
/** How far a neighbour is faded into the paper (1 = gone), and how much smaller it is. */
const GHOST = 0.7;
const NEIGHBOUR_SCALE = 0.84;
const smooth = (x: number) => x * x * (3 - 2 * x);
const wrap = (i: number, n: number) => ((i % n) + n) % n;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
// The opening move: the camera starts far enough out to show the row, holds
// for a moment, then closes in on the first figure.
const INTRO_HOLD = 0.7;
const INTRO_MOVE = 1.6;
const scratch = new THREE.Vector3();

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
  if (w < 896) return [w - 66 - (4 - i) * 34, h - 88];
  const roomy = Math.min(150, (w - 570) / 4);
  // A tag and its cursor need about 115px. Where the stage cannot give them
  // that to the right of the text block, the row runs further left, as far
  // as the block's button (which ends at about 235px), rather than letting
  // the tags overlap.
  const gap = Math.max(roomy, Math.min(117, (w - 450) / 4));
  return [w - 190 - (4 - i) * gap, h - 98];
}

// The shadow-casting lights, so the frame loop can ask them for a finer
// shadow on the frame that stays on screen (see soft-shadows.ts).
const shadowLights: (THREE.DirectionalLight | null)[] = [null, null];
const neutralBounce = new THREE.Color("#d4ced0");
const studioWhite = new THREE.Vector3(1, 1, 1);
const studioThemes = FIGURES.map(({ palette }) => ({
  wall: displayRgb(palette.ground).lerp(displayRgb(palette.lilac), 0.54),
  bounce: displayRgb(palette.lilac),
  fill: neutralBounce.clone().lerp(new THREE.Color(palette.ground), 0.43),
}));

// Accumulation (see the end of the frame loop): how many frames are averaged
// once the picture is still, how far from straight overhead the sky light
// wanders while they are drawn, and a full-screen quad that lays the running
// average back over each new frame.
const SAMPLES = 56;
const SKY_SPREAD = 1.05;
const SKY_INTENSITY = 0.96;
const fullscreenVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;
const blendMaterial = new THREE.ShaderMaterial({
  uniforms: { map: { value: null as THREE.Texture | null }, opacity: { value: 1 } },
  vertexShader: fullscreenVertex,
  // Straight through: the copy is already display colour, as the canvas is.
  fragmentShader:
    "uniform sampler2D map;\nuniform float opacity;\nvarying vec2 vUv;\nvoid main() {\n  gl_FragColor = vec4(texture2D(map, vUv).rgb, opacity);\n}",
  transparent: true,
  depthTest: false,
  depthWrite: false,
});
const previewFocusMaterial = new THREE.ShaderMaterial({
  uniforms: {
    map: { value: null as THREE.Texture | null },
    cssPixel: { value: new THREE.Vector2() },
    slotCenter: { value: 0 },
    slotSpacing: { value: 1 },
    slotProgress: { value: 0 },
    focusHalfWidth: { value: 0 },
  },
  vertexShader: fullscreenVertex,
  fragmentShader: /* glsl */ `
    varying vec2 vUv;
    uniform sampler2D map;
    uniform vec2 cssPixel;
    uniform float slotCenter;
    uniform float slotSpacing;
    uniform float slotProgress;
    uniform float focusHalfWidth;

    float blurRadius(float distanceFromCenter) {
      return 0.9 * smoothstep(0.12, 1.0, distanceFromCenter)
           + 2.4 * smoothstep(1.0, 2.65, distanceFromCenter);
    }

    vec3 pairedSample(vec2 offset) {
      return texture2D(map, vUv + offset).rgb + texture2D(map, vUv - offset).rgb;
    }

    void main() {
      float slot = (vUv.x - slotCenter) / slotSpacing;
      float left = floor(slot);
      // Switch between whole previews in the gap between them. As a figure
      // moves towards the centre, its entire preview comes into focus.
      float radius = mix(
        blurRadius(abs(left - slotProgress)),
        blurRadius(abs(left + 1.0 - slotProgress)),
        smoothstep(0.45, 0.55, fract(slot))
      );
      float nearest = floor(slotProgress + 0.5);
      float settled = 1.0 - smoothstep(0.05, 0.30, abs(nearest - slotProgress));
      float outsideFigure = smoothstep(focusHalfWidth, focusHalfWidth + 0.04, abs(slot - nearest));
      radius *= mix(1.0, outsideFigure, settled);

      vec3 color = texture2D(map, vUv).rgb;
      if (radius > 0.04) {
        vec2 spread = cssPixel * radius;
        // Stagger samples across the width of the blur to soften fine lines.
        color = color * 0.188
          + pairedSample(spread * vec2( 0.31,  0.06)) * 0.123
          + pairedSample(spread * vec2(-0.08,  0.39)) * 0.100
          + pairedSample(spread * vec2( 0.46,  0.52)) * 0.068
          + pairedSample(spread * vec2(-0.66,  0.19)) * 0.052
          + pairedSample(spread * vec2( 0.18, -0.72)) * 0.042
          + pairedSample(spread * vec2( 0.91, -0.37)) * 0.021;
      }
      gl_FragColor = vec4(color, 1.0);
    }
  `,
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

export type SceneProps = {
  focus: string | null;
  reducedMotion: boolean;
  onReady: () => void;
  /** The first frame is on screen (shaders compiled): the loader can go. */
  onPainted: () => void;
  onSelect: (figId: string) => void;
  onPartEvent: (type: "start" | "end", item: BuildItem) => void;
  onBuilt: (figId: string, seconds: number) => void;
};

export default function Scene(props: SceneProps) {
  const atmosphere = useMemo(() => createStudioAtmosphere(), []);
  const bounce = useRef<THREE.HemisphereLight>(null);
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
      <Studio atmosphere={atmosphere} bounce={bounce} />
      <Stage {...props} atmosphere={atmosphere} bounce={bounce} />
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
 *          plus a warm sky and a quiet, neutral ground fill.
 *
 * `shadow-radius` is each light's size (see soft-shadows.ts). An invisible
 * floor catches the shadows on the white page with a faint cool tint.
 */
type StudioProps = {
  atmosphere: StudioAtmosphere;
  bounce: RefObject<THREE.HemisphereLight | null>;
};

function Studio({ atmosphere, bounce }: StudioProps) {
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
      {/* The opaque backdrop fills the frame behind the models and shadow catcher. */}
      <mesh frustumCulled={false} renderOrder={-10}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          uniforms={atmosphere}
          vertexShader={fullscreenVertex}
          fragmentShader={STUDIO_ATMOSPHERE + "void main() { gl_FragColor = vec4(studioPaper(), 1.0); }"}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* Little light that nothing can block: most of the ambient comes from
          the sky light, which casts shadows, so creases and contacts darken. */}
      <Environment map={environment} environmentIntensity={0.22} />
      {/* The floor fill is quiet enough to keep the grey models neutral. */}
      <hemisphereLight ref={bounce} args={["#fff5e8", neutralBounce, 0.36]} />
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
        shadow-normalBias={0.012}
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
        shadow-normalBias={0.012}
        shadow-radius={0.48}
      >
        {/* Deep enough for the light to lean a long way over (see SKY_SPREAD). */}
        <orthographicCamera attach="shadow-camera" args={[-9, 9, 9, -9, 8, 32]} />
      </directionalLight>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        {/* Long enough for the whole row. */}
        <planeGeometry args={[400, 400]} />
        <shadowMaterial transparent color="#584f67" opacity={0.40} />
      </mesh>
    </>
  );
}

function Stage({ focus, reducedMotion, onReady, onPainted, onSelect, onPartEvent, onBuilt, atmosphere, bounce }: SceneProps & StudioProps) {
  const figs = useMemo<BuiltFigure[]>(() => FIGURES.map((figure) => createFigure(figure, atmosphere)), [atmosphere]);
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
  const focusHalfWidths = useRef<number[]>([]);
  // The row is a loop: each figure stands at whichever copy of its slot is
  // nearest the camera. `shifts` is how far along the row that copy is.
  const outerRefs = useRef<(THREE.Group | null)[]>([]);
  const shifts = useRef(FIGURES.map(() => 0));
  const intro = useRef(0);
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
    pending: 0,
    pendingUntil: 0,
    timer: 0,
    // An up-and-down wheel gesture: how far it has gone, whether it has
    // already turned the row, when, and how big its last event was.
    wheelSum: 0,
    wheelStepped: false,
    wheelAt: 0,
    wheelLast: 0,
    wheelIdle: 0,
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
  const live = useRef({ focus, reducedMotion, onPartEvent, onBuilt, onSelect, onPainted });
  useEffect(() => {
    live.current = { focus, reducedMotion, onPartEvent, onBuilt, onSelect, onPainted };
  }, [focus, reducedMotion, onPartEvent, onBuilt, onSelect, onPainted]);
  const painted = useRef(false);

  // The page the stage is on, to paint it the studio's paper colour.
  const page = useRef<HTMLElement | null>(null);
  const paperShown = useRef("");
  const stageCanvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    const el = stageCanvas.closest("main");
    page.current = el;
    paperShown.current = "";
    return () => {
      el?.style.removeProperty("--studio-paper");
      page.current = null;
    };
  }, [stageCanvas]);
  // The canvas is wider than the stage: it runs on to the left, under the
  // navigation panel, so a neighbour leaving that way passes beneath it
  // instead of being cut off at its edge. Everything below is laid out in
  // the stage's own pixels; this is how far the canvas starts before them.
  const stageInset = useRef(0);
  const canvasWidth = useThree((state) => state.size.width);
  useLayoutEffect(() => {
    const stage = stageCanvas.closest("#stage");
    stageInset.current = stage ? Math.max(0, stage.getBoundingClientRect().left - stageCanvas.getBoundingClientRect().left) : 0;
    engine.dirty = true;
  }, [stageCanvas, canvasWidth]);

  // Drag, throw, or swipe sideways on a trackpad to move along the row. A
  // small drag falls back to where it was; a real one, or a quick flick,
  // lands on the next figure.
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    const sc = scrub.current;
    const perFigure = () => GAP * sc.zoom; // pixels between two figures
    const settle = (at: number) => {
      // The row is a loop, so any whole number is a figure.
      const index = Math.round(at);
      sc.dragging = false;
      sc.pending = index;
      sc.pendingUntil = now() + 0.5;
      sc.target = index;
      engine.dirty = true;
      live.current.onSelect(FIGURES[wrap(index, FIGURES.length)].id);
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
      sc.target = sc.startTarget - dx / perFigure();
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
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Sideways: the row follows the fingers.
        e.preventDefault();
        sc.dragging = true;
        sc.target = sc.target + e.deltaX / perFigure();
        engine.dirty = true;
        window.clearTimeout(sc.timer);
        sc.timer = window.setTimeout(() => settle(sc.target), 140);
        return;
      }
      // Up and down scrolls the page wherever there is page to scroll. On the
      // desktop homepage the stage is the whole page, and that gesture would
      // do nothing — so there it turns the row instead: down for the next
      // figure, up for the one before.
      if (document.documentElement.scrollHeight > window.innerHeight + 1) return;
      e.preventDefault();
      const size = Math.abs(e.deltaY) * (e.deltaMode === 1 ? 16 : 1);
      // A trackpad keeps sending events while it coasts. One gesture turns
      // the row once; the next turn needs a pause, or a fresh push (an event
      // much bigger than the one before it, which a coast never has).
      const freshPush = sc.wheelStepped && now() - sc.wheelAt > 0.45 && size >= 12 && size > sc.wheelLast * 2.5;
      sc.wheelLast = size;
      window.clearTimeout(sc.wheelIdle);
      sc.wheelIdle = window.setTimeout(() => {
        sc.wheelSum = 0;
        sc.wheelStepped = false;
      }, 180);
      if (freshPush) {
        sc.wheelSum = 0;
        sc.wheelStepped = false;
      }
      if (sc.wheelStepped || sc.pressed || sc.dragging) return;
      sc.wheelSum += Math.sign(e.deltaY) * size;
      if (Math.abs(sc.wheelSum) < 20) return;
      sc.wheelStepped = true;
      sc.wheelAt = now();
      settle(Math.round(sc.target) + Math.sign(sc.wheelSum));
    };
    // Over the whole stage, not only the canvas: the pointer may be on the
    // project text or the index when the visitor scrolls.
    const surface = canvas.closest<HTMLElement>("#stage") ?? canvas;
    canvas.style.setProperty("touch-action", "pan-y");
    canvas.style.setProperty("cursor", "grab");
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    surface.addEventListener("wheel", wheel, { passive: false });
    return () => {
      window.clearTimeout(sc.timer);
      window.clearTimeout(sc.wheelIdle);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      surface.removeEventListener("wheel", wheel);
    };
  }, [canvas]);

  // Measure every part once the figures sit in their slots, and hand the
  // runtimes to the engine so the overlay can schedule builds.
  useLayoutEffect(() => {
    const box = new THREE.Box3();
    const extent = new THREE.Vector3();
    figs.forEach((fig, i) => {
      measureFigure(fig);
      for (const [partId, rt] of Object.entries(fig.parts)) {
        engine.parts[`${fig.def.id}/${partId}`] = rt;
      }
      box.setFromObject(fig.group);
      const center = box.getCenter(new THREE.Vector3());
      centers.current[i] = center;
      box.getSize(extent);
      const projectedHalfWidth = (extent.x * Math.abs(RIGHT.x) + extent.z * Math.abs(RIGHT.z)) / 2;
      const centerOffset = Math.abs(center.clone().sub(positions[i]).dot(RIGHT));
      // Leave room for the small display turn after the figure is built.
      focusHalfWidths.current[i] = (projectedHalfWidth + centerOffset + 0.14) / GAP;
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
    // `w` is the stage's width; the canvas is `inset` pixels wider, on the left.
    const canvasW = state.size.width;
    const inset = Math.min(stageInset.current, canvasW * 0.5);
    const w = canvasW - inset;
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
    const padBottom = 118; // caption, index and clear space beside the project text
    const focusIndex = focusId ? FIGURES.findIndex((f) => f.id === focusId) : -1;
    const sc = scrub.current;
    const count = FIGURES.length;
    if (!sc.dragging) {
      // After a drag, hold where it landed until the overlay has caught up
      // with the choice.
      if (sc.pendingUntil > 0 && (wrap(sc.pending, count) === focusIndex || time > sc.pendingUntil)) sc.pendingUntil = 0;
      if (sc.pendingUntil > 0) {
        sc.target = sc.pending;
      } else {
        // Go to the nearest copy of the chosen figure, whichever way that is:
        // from the last, the first is one step to the right.
        const chosen = Math.max(0, focusIndex);
        sc.target = chosen + count * Math.round((sc.target - chosen) / count);
      }
    }
    if (reduced || Math.abs(sc.pos - sc.target) < 0.0008) {
      if (sc.pos !== sc.target) dirty = true;
      sc.pos = sc.target;
    } else {
      // Tight to the hand while dragging, eased when let go.
      sc.pos = damp(sc.pos, sc.target, sc.dragging ? 26 : 6.5, dt);
      dirty = true;
    }
    for (let i = 0; i < count; i++) shifts.current[i] = count * Math.round((sc.pos - i) / count) * GAP;
    // 1 at the start of the opening move, 0 once it is over.
    let opening = 0;
    // Timed by the clock, not by counting frames, so it takes the same time
    // on a slow machine or a throttled tab.
    if (intro.current === 0) intro.current = time;
    if (!reduced && time - intro.current < INTRO_HOLD + INTRO_MOVE) {
      opening = 1 - ease(clamp01((time - intro.current - INTRO_HOLD) / INTRO_MOVE));
      dirty = true;
    }
    // The figure in the middle sits a little right of centre — the left is
    // the headline and the project text — leaving the next one peeking in.
    // (The camera looks at the middle of the canvas, which is half the inset
    // to the left of the middle of the stage.)
    const shiftX = -inset / 2 - w * (wide ? 0.1 : 0.115) * (1 - opening);
    const shiftY = (padBottom - padTop) / 2;
    const slotCentre = (slot: number, out: THREE.Vector3) => {
      const i = wrap(slot, count);
      return out.copy(centers.current[i] ?? positions[i]).addScaledVector(RIGHT, (slot - i) * GAP);
    };
    const lo = Math.floor(sc.pos);
    const currentIndex = wrap(lo, count);
    const nextIndex = wrap(lo + 1, count);
    const current = FIGURES[currentIndex].presentation;
    const next = FIGURES[nextIndex].presentation;
    const blend = smooth(sc.pos - lo);
    const elevation = mix(mix(current?.elevation ?? EL, next?.elevation ?? EL, blend), EL, opening);
    const scale = mix(mix(current?.scale ?? 1, next?.scale ?? 1, blend), 1, opening);
    direction.set(Math.sin(AZ) * Math.cos(elevation), Math.sin(elevation), Math.cos(AZ) * Math.cos(elevation));
    cameraUp.crossVectors(direction, RIGHT);
    const base = slotCentre(lo, new THREE.Vector3()).lerp(slotCentre(lo + 1, scratch), sc.pos - lo);
    const zoomTo = Math.min(210, Math.max(22, Math.min((w * 0.58) / 4.9, (h - padTop - padBottom) / 3.7) * scale)) * (1 - 0.6 * opening);
    // Looking at a point to the right of / below the subject moves it left / up.
    base.addScaledVector(RIGHT, shiftX / zoomTo).addScaledVector(cameraUp, -shiftY / zoomTo);
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
    cam.position.copy(camTarget.current).addScaledVector(direction, 40);
    cam.lookAt(camTarget.current);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
    HULL_U.value = 1.3 / cam.zoom;
    // Keep the cove behind the figure as the camera moves, and carry its
    // light through the same fractional position used by the carousel.
    const wallFoot = scratch.copy(positions[0]).addScaledVector(RIGHT, sc.pos * GAP).addScaledVector(BACK, STUDIO_DEPTH).project(cam);
    const currentStudio = studioThemes[currentIndex];
    const nextStudio = studioThemes[nextIndex];
    atmosphere.uStudioSweep.value.set((wallFoot.x + 1) / 2, (wallFoot.y + 1) / 2, Math.max(0.12, cam.zoom * 1.04 / h));
    atmosphere.uStudioWall.value.lerpVectors(currentStudio.wall, nextStudio.wall, blend).lerp(studioWhite, opening * 0.65);
    atmosphere.uStudioBounce.value.lerpVectors(currentStudio.bounce, nextStudio.bounce, blend).lerp(studioWhite, opening * 0.65);
    // The page around the canvas is the same sheet of paper: hand its colour
    // to CSS (the sidebar's column, the headline's seam) whenever it changes.
    const paper = paperCss(atmosphere.uStudioWall.value);
    if (paper !== paperShown.current) {
      paperShown.current = paper;
      page.current?.style.setProperty("--studio-paper", paper);
    }
    bounce.current?.groundColor.lerpColors(currentStudio.fill, nextStudio.fill, blend);
    // The lights travel with the camera, so their shadow maps only ever have
    // to cover the figure on stage — however long the row gets.
    for (const light of shadowLights) {
      if (!light) continue;
      light.target.position.copy(camTarget.current);
      light.target.updateMatrixWorld();
    }
    shadowLights[0]?.position.copy(camTarget.current).add(KEY_OFFSET);

    // ── Build engine: advance every scheduled part ──
    // A part at `t` seconds into its figure's schedule: how far it is built.
    const showPart = (item: BuildItem, t: number) => {
      const rt = eng.parts[`${item.figId}/${item.partId}`];
      const p = item.tEnd > item.tStart ? clamp01((t - item.tStart) / (item.tEnd - item.tStart)) : t >= item.tStart ? 1 : 0;
      rt.progress = p;
      rt.h.value = p <= 0 ? -1e3 : p >= 1 ? 1e3 : rt.minY - 0.02 + (rt.maxY - rt.minY + 0.04) * ease(p);
      rt.bandOn.value = p > 0 && p < 1 ? 1 : 0;
      return p;
    };
    // Figures the visitor has left play their schedule backwards, part by
    // part, until they are drawings again.
    if (eng.rewinds.length > 0) {
      dirty = true;
      for (const rewind of eng.rewinds) {
        const t = rewindTime(rewind, time);
        for (const item of rewind.items) showPart(item, t);
      }
      eng.rewinds = eng.rewinds.filter((rewind) => rewindTime(rewind, time) > 0);
    }
    const build = eng.build;
    if (build) {
      if (!build.paused) dirty = true;
      const t = (build.paused ? build.pausedAt : time) - build.t0;
      let allDone = true;
      for (const item of build.items) {
        const p = showPart(item, t);
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
          const figureIndex = FIGURES.findIndex((f) => f.id === item.figId);
          const outer = outerRefs.current[figureIndex];
          v.copy(rt.anchor);
          if (outer) v.add(outer.position).sub(positions[figureIndex]);
          v.project(cam);
          // Spread agents that share a spot so their name tags don't stack.
          tx = ((v.x + 1) / 2) * canvasW - inset + (i - 2) * 26;
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
      el.style.opacity = build ? "1" : "0.50";
      const tag = el.lastElementChild as HTMLElement | null;
      if (tag) tag.style.opacity = docked && !wide ? "0" : "1";
    }

    // ── Labels: captions and numerals are DOM elements pinned to 3D points ──
    const place = (el: HTMLElement | null | undefined, p: THREE.Vector3, opacity: number) => {
      if (!el) return;
      p.project(cam);
      el.style.transform = `translate3d(${(((p.x + 1) / 2) * canvasW - inset).toFixed(1)}px, ${(((1 - p.y) / 2) * h).toFixed(1)}px, 0)`;
      el.style.opacity = opacity.toFixed(2);
      el.style.visibility = opacity < 0.05 ? "hidden" : "visible";
    };
    figs.forEach((fig, i) => {
      // Distance from the middle of the stage, in figures, decides everything:
      // 0 is full colour and full size, 1 is a faint, smaller neighbour, and
      // much beyond that is gone.
      const shift = shifts.current[i];
      const outer = outerRefs.current[i];
      const distance = i + shift / GAP - sc.pos;
      // Recess the left preview along the floor so its base and caption sit
      // above the project details. The focused figure stays on the main axis.
      const recess = smooth(clamp01(-distance)) * (1 - opening);
      const depth = recess * Math.min(92, h * 0.12) / (cam.zoom * Math.sin(elevation));
      v.copy(positions[i]).addScaledVector(RIGHT, shift).addScaledVector(BACK, depth);
      if (outer && outer.position.distanceToSquared(v) > 1e-7) {
        outer.position.copy(v);
        fig.origin.value.copy(outer.position);
        dirty = true;
      }
      const away = Math.abs(distance);
      const settled = away <= 1 ? GHOST * smooth(away) : GHOST + (1 - GHOST) * smooth(Math.min(1, (away - 1) / 0.6));
      // During the opening every figure in view is an equal, light drawing.
      const fadeTo = mix(settled, away <= 3.4 ? 0.3 : 1, opening);
      if (Math.abs(fades.current[i] - fadeTo) > 0.002) {
        fades.current[i] = fadeTo;
        dirty = true;
      }
      const fade = fades.current[i];
      swayRefs.current[i]?.scale.setScalar(1 - (1 - NEIGHBOUR_SCALE) * smooth(Math.min(1, away)) * (1 - opening));
      fig.setFade(fade);
      // Skip figures whose silhouettes have faded into the studio.
      fig.group.visible = fade < 0.985;
      const callouts = calloutRefs.current[i];
      if (callouts) callouts.visible = fade < 0.5;
      place(eng.labelEls[`cap/${fig.def.id}`], v.add(CAPTION_OFFSET), 1 - fade);
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
    atmosphere.uStudioBuffer.value.copy(bufferSize);
    atmosphere.uStudioFrame.value.set(inset / canvasW, canvasW / w);
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
      if (!seen.texture) {
        seen.texture = new THREE.FramebufferTexture(bufferSize.x, bufferSize.y);
        seen.texture.magFilter = THREE.LinearFilter;
        seen.texture.minFilter = THREE.LinearFilter;
      }
      // Keep the sharp frame for shadow accumulation. Apply preview blur to
      // the displayed copy so it never compounds across samples.
      gl.copyFramebufferToTexture(seen.texture);
      if (!dirty) seen.count = k + 1;

      const preview = previewFocusMaterial.uniforms;
      v.copy(positions[0]).addScaledVector(RIGHT, lo * GAP).project(cam);
      preview.map.value = seen.texture;
      preview.cssPixel.value.set(1 / canvasW, 1 / h);
      preview.slotCenter.value = (v.x + 1) / 2;
      preview.slotSpacing.value = GAP * cam.zoom / w;
      preview.slotProgress.value = sc.pos - lo;
      preview.focusHalfWidth.value = focusHalfWidths.current[wrap(Math.round(sc.pos), count)] ?? 0;
      blendQuad.material = previewFocusMaterial;
      gl.render(blendScene, blendCamera);
      blendQuad.material = blendMaterial;
      if (!painted.current) {
        // The first draw compiles the scene and the display pass.
        painted.current = true;
        live.current.onPainted();
      }
    }
    // Priority 1 hands rendering to this callback (see above).
  }, 1);

  return (
    <>
      {figs.map((fig, i) => (
        <group
          key={fig.def.id}
          position={positions[i]}
          ref={(el) => {
            outerRefs.current[i] = el;
          }}
        >
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
