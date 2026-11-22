// The site's sounds — all synthesized with Web Audio, no audio files.
//
// Rules (from the research on portfolio sites, and the browser's own):
// - Nothing sounds before the visitor's first click, tap or key: the browser
//   would not allow it, and a page that starts making noise by itself is rude.
//   The first gesture unlocks the audio; after that the stage's drawing, the
//   ruler and the buttons all have their sounds.
// - One switch, in the navigation panel (and the phone header), remembered in
//   this browser. On by default — still silent until that first gesture.
// - Quiet and short: UI sounds sit under speech level, nothing over a second
//   but the "built" chime. A cue that is already playing is not stacked
//   (each has a minimum interval).
// - No sound while the tab is hidden.

export type Cue =
  | "tick" // a detent: the ruler passing a year, a card snapping into place
  | "click" // a button, a row opening
  | "toggle-on"
  | "toggle-off"
  | "pop" // a clay part settling into place (opts.step picks the note)
  | "whoosh" // moving between figures, a board opening (opts.dir: 1 or -1)
  | "chime" // a figure built
  | "success" // email copied
  | "blip" // pointing at something small and live (opts.step picks the note)
  | "shimmer"; // the "10+" catching the light

export type Gesture = "drag" | "pen" | "duplicate" | "type";

const KEY = "tx-sound";
const MIN_GAP: Partial<Record<Cue, number>> = { tick: 0.035, blip: 0.05, pop: 0.04, whoosh: 0.12, click: 0.04 };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let unlocked = false;
let enabled = true;
const listeners = new Set<() => void>();
const lastAt: Partial<Record<Cue, number>> = {};

if (typeof window !== "undefined") {
  try {
    enabled = window.localStorage.getItem(KEY) !== "off";
  } catch {
    /* storage blocked: keep the default */
  }
  const unlock = () => {
    unlocked = true;
    ensure()?.resume().catch(() => {});
    window.removeEventListener("pointerdown", unlock, true);
    window.removeEventListener("keydown", unlock, true);
  };
  window.addEventListener("pointerdown", unlock, true);
  window.addEventListener("keydown", unlock, true);
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend().catch(() => {});
    else if (unlocked) ctx.resume().catch(() => {});
  });
}

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 3;
  master = ctx.createGain();
  master.gain.value = 0.7;
  master.connect(comp).connect(ctx.destination);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
}

/** Ready to sound now: switched on, unlocked by a gesture, tab in front. */
function live(): AudioContext | null {
  if (!enabled || !unlocked || (typeof document !== "undefined" && document.hidden)) return null;
  const c = ensure();
  if (!c || c.state !== "running") {
    c?.resume().catch(() => {});
    return c && c.state === "running" ? c : null;
  }
  return c;
}

// ─── Building blocks ────────────────────────────────────────────────────────

type ToneOpts = { at?: number; dur: number; gain: number; type?: OscillatorType; to?: number; attack?: number; pan?: number };
function tone(c: AudioContext, freq: number, o: ToneOpts) {
  const t = c.currentTime + (o.at ?? 0);
  const osc = c.createOscillator();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(freq, t);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + o.dur);
  const g = c.createGain();
  const a = o.attack ?? 0.004;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(o.gain, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  const p = c.createStereoPanner();
  p.pan.value = o.pan ?? 0;
  osc.connect(g).connect(p).connect(master!);
  osc.start(t);
  osc.stop(t + o.dur + 0.02);
}

type NoiseOpts = { at?: number; dur: number; gain: number; filter: BiquadFilterType; freq: number; to?: number; q?: number; attack?: number; pan?: number };
function noise(c: AudioContext, o: NoiseOpts) {
  const t = c.currentTime + (o.at ?? 0);
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  const f = c.createBiquadFilter();
  f.type = o.filter;
  f.frequency.setValueAtTime(o.freq, t);
  if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + o.dur);
  f.Q.value = o.q ?? 1;
  const g = c.createGain();
  const a = o.attack ?? 0.002;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(o.gain, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  const p = c.createStereoPanner();
  p.pan.value = o.pan ?? 0;
  src.connect(f).connect(g).connect(p).connect(master!);
  src.start(t, Math.random() * 0.5);
  src.stop(t + o.dur + 0.02);
}

// A major pentatonic, so notes picked by step always sit well together.
const PENTA = [0, 2, 4, 7, 9];
const note = (base: number, step: number) => base * 2 ** ((PENTA[((step % 5) + 5) % 5] + 12 * Math.floor(step / 5)) / 12);

// ─── Cues ───────────────────────────────────────────────────────────────────

export function play(cue: Cue, opts: { step?: number; dir?: 1 | -1; pan?: number } = {}) {
  const c = live();
  if (!c) return;
  const now = c.currentTime;
  const gap = MIN_GAP[cue];
  if (gap && lastAt[cue] !== undefined && now - lastAt[cue]! < gap) return;
  lastAt[cue] = now;
  const pan = opts.pan ?? 0;
  switch (cue) {
    case "tick":
      noise(c, { dur: 0.02, gain: 0.22, filter: "bandpass", freq: 4200, q: 5, pan });
      tone(c, 2600, { dur: 0.025, gain: 0.02, pan });
      break;
    case "click":
      noise(c, { dur: 0.014, gain: 0.16, filter: "bandpass", freq: 2400, q: 2, pan });
      tone(c, 540, { dur: 0.06, gain: 0.045, type: "triangle", to: 380, pan });
      break;
    case "toggle-on":
      noise(c, { dur: 0.012, gain: 0.14, filter: "bandpass", freq: 2600, q: 2 });
      tone(c, 660, { dur: 0.07, gain: 0.04, type: "triangle" });
      tone(c, 990, { at: 0.06, dur: 0.09, gain: 0.04, type: "triangle" });
      break;
    case "toggle-off":
      noise(c, { dur: 0.012, gain: 0.14, filter: "bandpass", freq: 2200, q: 2 });
      tone(c, 880, { dur: 0.07, gain: 0.035, type: "triangle" });
      tone(c, 587, { at: 0.06, dur: 0.09, gain: 0.035, type: "triangle" });
      break;
    case "pop": {
      // Clay settling: a soft pitched thump with a little body.
      const f = note(196, opts.step ?? 0);
      tone(c, f * 1.8, { dur: 0.14, gain: 0.11, to: f, pan });
      tone(c, f * 3.6, { dur: 0.05, gain: 0.02, to: f * 2, pan });
      noise(c, { dur: 0.06, gain: 0.05, filter: "lowpass", freq: 900, pan });
      break;
    }
    case "whoosh": {
      const up = (opts.dir ?? 1) === 1;
      noise(c, { dur: 0.34, gain: 0.09, filter: "bandpass", freq: up ? 480 : 1700, to: up ? 1700 : 480, q: 0.9, attack: 0.09, pan });
      break;
    }
    case "chime":
      // Two soft bell notes: partials at bell-like ratios, long decay.
      for (const [f, at] of [
        [1047, 0],
        [1568, 0.1],
      ] as const) {
        tone(c, f, { at, dur: 1.1, gain: 0.045 });
        tone(c, f * 2.76, { at, dur: 0.5, gain: 0.012 });
        tone(c, f * 5.4, { at, dur: 0.2, gain: 0.005 });
      }
      break;
    case "success":
      tone(c, 784, { dur: 0.16, gain: 0.05 });
      tone(c, 1175, { at: 0.08, dur: 0.24, gain: 0.05 });
      break;
    case "blip":
      tone(c, note(880, opts.step ?? 0), { dur: 0.06, gain: 0.035, pan });
      break;
    case "shimmer":
      for (let i = 0; i < 7; i++) tone(c, note(1047, i), { at: i * 0.035, dur: 0.28, gain: 0.018, pan: -0.4 + i * 0.13 });
      break;
  }
}

/** The sound of a construction gesture, lasting `seconds` (the stage's agents drawing a part). */
export function gesture(kind: Gesture, seconds: number, pan = 0) {
  const c = live();
  if (!c) return;
  const d = Math.max(0.15, Math.min(seconds, 1.6));
  if (kind === "pen") {
    // Pencil on paper: short scratchy strokes.
    let t = 0;
    while (t < d - 0.05) {
      const len = 0.06 + Math.random() * 0.09;
      noise(c, { at: t, dur: len, gain: 0.05 + Math.random() * 0.025, filter: "bandpass", freq: 1800 + Math.random() * 1400, q: 1.3, attack: 0.012, pan });
      t += len + 0.015 + Math.random() * 0.03;
    }
  } else if (kind === "drag") {
    // A box dragged out: a soft rising slide, then it lets go.
    noise(c, { dur: Math.min(d, 0.7), gain: 0.035, filter: "lowpass", freq: 600, to: 1500, attack: 0.08, pan });
    tone(c, 1400, { at: Math.min(d, 0.7), dur: 0.03, gain: 0.015, pan });
  } else if (kind === "type") {
    // Keys: light taps.
    const n = Math.max(3, Math.min(14, Math.round(d / 0.085)));
    for (let i = 0; i < n; i++) {
      const at = (i / n) * d + Math.random() * 0.02;
      noise(c, { at, dur: 0.016, gain: 0.11, filter: "bandpass", freq: 2800 + Math.random() * 900, q: 3, pan });
      tone(c, 170 + Math.random() * 30, { at, dur: 0.025, gain: 0.015, pan });
    }
  } else {
    // Duplicate: drawn once, then stamped twice.
    for (let i = 0; i < 3; i++) {
      const at = (i / 3) * d;
      tone(c, 330 + i * 40, { at, dur: 0.07, gain: 0.05, type: "triangle", to: 240, pan });
      noise(c, { at, dur: 0.02, gain: 0.08, filter: "bandpass", freq: 2000, q: 2, pan });
    }
  }
}

// ─── The switch ─────────────────────────────────────────────────────────────

export function soundOn() {
  return enabled;
}

export function setSound(on: boolean) {
  if (!on) play("toggle-off"); // the last sound before it goes quiet
  enabled = on;
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* storage blocked: the switch still works for this visit */
  }
  if (on) {
    unlocked = true; // pressing the switch is itself a gesture
    ensure()?.resume().catch(() => {});
    window.setTimeout(() => play("toggle-on"), 30);
  }
  listeners.forEach((fn) => fn());
}

export function subscribeSound(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
