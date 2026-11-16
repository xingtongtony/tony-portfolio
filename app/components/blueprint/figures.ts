// Data for the blueprint stage: four "patent figures", each a small clay
// diorama made of soft solids and split into PARTS. A part is the unit an
// agent builds — it starts as line art and fills with its colour bottom-up.
//
// Art direction (see rules/BLUEPRINT_STAGE.md): matte clay, generous radii,
// nothing sharp, and ONE palette shared by all four figures. Colour is chosen
// for harmony, not realism — a TV may be plum, a counter lilac.
//
// Every figure is a case study that exists on the site. Do not add a figure
// for work that has no page yet.
//
// Coordinates are in each figure's own space: ground at y = 0, front faces +z,
// footprint roughly 2.9 wide by 1.9 deep.

export type Vec3 = [number, number, number];

/** Surface recipe for the built object (see FINISHES in figure-builder). */
export type Finish = "clay" | "soft" | "print" | "screen" | "led";

type Surface = {
  pos: Vec3;
  color?: string;
  finish?: Finish;
  /** Texture key (see textures.ts): an image path, "proc:<name>" or "label:<text>". */
  map?: string;
};

// Every solid is rounded. `bevel` is the edge radius; leave it out to get a
// generous default, set it only to make something rounder or crisper.
export type ShapeDef =
  // Soft box, `size` = width, height, depth.
  | ({ k: "box"; size: Vec3; rot?: Vec3; bevel?: number } & Surface)
  // Rounded rectangle `size` (in its own XY plane, corner radius `r`) extruded
  // by thickness `t`. Use rot = flat() to lay it on the ground.
  | ({ k: "slab"; size: [number, number]; t: number; r: number; rot?: Vec3; bevel?: number } & Surface)
  // Upright cylinder; bevel = r makes it a capsule.
  | ({ k: "cyl"; r: number; h: number; rot?: Vec3; bevel?: number } & Surface)
  | ({ k: "ball"; r: number } & Surface)
  // Ring of radius `R` and tube radius `tube`, standing in its XY plane.
  | ({ k: "torus"; R: number; tube: number; rot?: Vec3 } & Surface)
  // A tube arching between (-span/2, 0, 0) and (span/2, 0, 0), `rise` high.
  | ({ k: "arch"; span: number; rise: number; tube: number; rot?: Vec3 } & Surface)
  // Arbitrary outline (corners rounded by `r`) extruded by `t`.
  | ({ k: "poly"; pts: [number, number][]; t: number; r?: number; rot?: Vec3; bevel?: number } & Surface);

export type PartDef = {
  id: string;
  /** Shown in the agent log, e.g. "Remote". */
  label: string;
  /** Index into AGENTS — who builds this part. */
  agent: number;
  /** Default colour and finish for the part's shapes. */
  color: string;
  finish?: Finish;
  /** Optional local frame, so shapes can be authored on a tilted surface. */
  frame?: { pos: Vec3; rot: Vec3 };
  shapes: ShapeDef[];
};

/** A patent-style reference numeral: a leader from `at` (on the object) to `to`. */
export type CalloutDef = { n: string; at: Vec3; to: Vec3 };

export type FigureDef = {
  id: string;
  fig: string;
  title: string;
  desc: string;
  href?: string;
  status?: string;
  parts: PartDef[];
  callouts: CalloutDef[];
};

/** Lay a slab / poly / torus on the ground; the value is yaw. */
const flat = (yaw = 0): Vec3 => [-Math.PI / 2, 0, yaw];
/** Lay a cylinder on its side, pointing along x, then turn it by yaw. */
const lying = (yaw = 0): Vec3 => [0, yaw, Math.PI / 2];
/** A disc facing the viewer (front face). */
const FACE: Vec3 = [Math.PI / 2, 0, 0];

/** A heart outline `w` wide, centred on its own middle. */
function heart(w: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < 96; i++) {
    const t = (i / 96) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    pts.push([(x / 32) * w, ((y + 2.5) / 32) * w]);
  }
  return pts;
}

/** `n` copies of a shape, the first at `pos`, each next one moved by `step`. */
function row(n: number, step: Vec3, shape: ShapeDef): ShapeDef[] {
  return Array.from({ length: n }, (_, i) => ({
    ...shape,
    pos: [shape.pos[0] + step[0] * i, shape.pos[1] + step[1] * i, shape.pos[2] + step[2] * i] as Vec3,
  }));
}

const CHECK: [number, number][] = [
  [-0.09, 0.0],
  [-0.03, -0.07],
  [0.1, 0.08],
  [0.07, 0.1],
  [-0.03, -0.02],
  [-0.065, 0.025],
];

export const INK = "#151515";

// The five hero stickers are the agents. Colours are the stickers' own fills
// and strokes (public/portfolio/stickers/*.svg).
export const AGENTS = [
  { id: "global", name: "Bilingual, global", short: "Global", fill: "#CEE800", stroke: "#A2B700", src: "/portfolio/stickers/bilingual-global.svg", w: 160 },
  { id: "patents", name: "325 design patents", short: "Patents", fill: "#CDB0ED", stroke: "#A479D4", src: "/portfolio/stickers/design-patents.svg", w: 162 },
  { id: "detail", name: "Detail obsessed", short: "Detail", fill: "#FFE37D", stroke: "#DBB52B", src: "/portfolio/stickers/detail-obsessed.svg", w: 144 },
  { id: "workflow", name: "Agent workflow", short: "Workflow", fill: "#49D2FC", stroke: "#1BA0C9", src: "/portfolio/stickers/agent-workflow.svg", w: 156 },
  { id: "systems", name: "Design systems nerd", short: "Systems", fill: "#FF9393", stroke: "#A52422", src: "/portfolio/stickers/design-systems.svg", w: 185 },
];

// ── Palette ────────────────────────────────────────────────────────────────
// One family for everything: a lilac ground, two neutrals, four accents and
// two deep tones. Every figure stands on GROUND, so the four read as a set.
export const PALETTE = {
  ground: "#DCD3F8",
  mist: "#EDE8FD",
  lilac: "#BDAFF1",
  plum: "#5E50A8",
  inky: "#3B3270",
  cream: "#FFF7EA",
  sand: "#F2D2AE",
  coral: "#FF8C6B",
  yellow: "#FFD25E",
  blue: "#8EC5F6",
  green: "#98D68C",
  white: "#FFFFFF",
};
const { ground: GROUND, mist: MIST, lilac: LILAC, plum: PLUM, inky: INKY, cream: CREAM, sand: SAND, coral: CORAL, yellow: YELLOW, blue: BLUE, green: GREEN, white: WHITE } = PALETTE;

const TV_SCREEN = "/portfolio/blueprints/tv-screen.jpg";
const LUTRA_SCREEN = "/portfolio/blueprints/lutra-screen.jpg";

const REMOTE_FRAME = { pos: [0.9, 0.62, 0.0] as Vec3, rot: [0, 0.35, 0] as Vec3 };
const PHONE_FRAME = { pos: [-0.62, 0.12, 0.3] as Vec3, rot: [-0.3, 0, 0] as Vec3 };
const TICKET_FRAME = { pos: [0.74, 0.62, 0.02] as Vec3, rot: [0.42, 0, 0] as Vec3 };
const QR_FRAME = { pos: [0.95, 0.12, 0.58] as Vec3, rot: [-0.18, 0.3, 0] as Vec3 };
const CARD_FRAME = { pos: [-0.7, 0.15, 0.42] as Vec3, rot: [0, 0.12, 0] as Vec3 };

export const FIGURES: FigureDef[] = [
  {
    id: "tv",
    fig: "FIG. 1",
    title: "TikTok TV Revamp",
    desc: "Redesign the whole experience of TikTok TV and Design system.",
    href: "/work/tiktok-tv-visual",
    parts: [
      {
        id: "rug",
        label: "Rug",
        agent: 1,
        color: GROUND,
        shapes: [
          { k: "slab", size: [2.9, 1.8], t: 0.08, r: 0.42, pos: [0, 0.04, 0], rot: flat() },
          // A lighter field woven into the rug.
          { k: "slab", size: [2.56, 1.46], t: 0.012, r: 0.3, pos: [0, 0.082, 0], rot: flat(), color: MIST },
          // A lower, wider step under the base, as on a plinth.
          { k: "slab", size: [3.2, 2.1], t: 0.04, r: 0.5, pos: [0, 0.02, 0], rot: flat(), color: LILAC },
        ],
      },
      {
        id: "console",
        label: "Console",
        agent: 4,
        color: SAND,
        shapes: [
          { k: "cyl", r: 0.07, h: 0.16, pos: [-1.0, 0.15, 0.22], color: CORAL },
          { k: "cyl", r: 0.07, h: 0.16, pos: [1.0, 0.15, 0.22], color: CORAL },
          { k: "cyl", r: 0.07, h: 0.16, pos: [-1.0, 0.15, -0.22], color: CORAL },
          { k: "cyl", r: 0.07, h: 0.16, pos: [1.0, 0.15, -0.22], color: CORAL },
          { k: "box", size: [2.5, 0.4, 0.74], pos: [0, 0.42, 0], bevel: 0.045 },
          // Two drawers: raised fronts and their pulls.
          { k: "slab", size: [1.08, 0.26], t: 0.03, r: 0.07, pos: [-0.6, 0.42, 0.376] },
          { k: "slab", size: [1.08, 0.26], t: 0.03, r: 0.07, pos: [0.6, 0.42, 0.376] },
          { k: "slab", size: [0.36, 0.07], t: 0.05, r: 0.035, pos: [-0.6, 0.42, 0.405], color: CORAL },
          { k: "slab", size: [0.36, 0.07], t: 0.05, r: 0.035, pos: [0.6, 0.42, 0.405], color: CORAL },
          // A plant behind the console's far end.
          { k: "cyl", r: 0.13, h: 0.2, pos: [1.15, 0.18, -0.62], color: CREAM, bevel: 0.018 },
          { k: "cyl", r: 0.055, h: 0.4, pos: [1.15, 0.46, -0.62], color: GREEN, bevel: 0.055 },
          { k: "cyl", r: 0.05, h: 0.34, pos: [1.06, 0.4, -0.6], rot: [0, 0, 0.5], color: GREEN, bevel: 0.05 },
          { k: "cyl", r: 0.05, h: 0.34, pos: [1.24, 0.4, -0.64], rot: [0, 0, -0.5], color: GREEN, bevel: 0.05 },
        ],
      },
      {
        id: "tv-body",
        label: "TV body",
        agent: 0,
        color: PLUM,
        shapes: [
          { k: "slab", size: [0.84, 0.34], t: 0.06, r: 0.17, pos: [0, 0.65, -0.06], rot: flat() },
          { k: "cyl", r: 0.08, h: 0.16, pos: [0, 0.74, -0.08] },
          { k: "slab", size: [2.2, 1.3], t: 0.18, r: 0.16, pos: [0, 1.45, -0.08], bevel: 0.025 },
        ],
      },
      {
        id: "tv-ui",
        label: "Interface",
        agent: 3,
        color: "#050505",
        finish: "screen",
        shapes: [
          // A dark lip around the panel, then the picture.
          { k: "slab", size: [1.9, 1.095], t: 0.003, r: 0.09, pos: [0, 1.45, 0.0115], color: INKY, finish: "soft" },
          { k: "slab", size: [1.84, 1.035], t: 0.006, r: 0.07, pos: [0, 1.45, 0.0135], map: TV_SCREEN },
          { k: "cyl", r: 0.012, h: 0.006, pos: [0.9, 0.893, 0.012], rot: FACE, color: CORAL, finish: "led" },
        ],
      },
      {
        id: "soundbar",
        label: "Soundbar",
        agent: 2,
        color: BLUE,
        shapes: [
          { k: "slab", size: [1.1, 0.14], t: 0.14, r: 0.07, pos: [-0.4, 0.69, 0.21], bevel: 0.02 },
          { k: "slab", size: [0.12, 0.016], t: 0.006, r: 0.008, pos: [-0.4, 0.69, 0.282], color: CREAM, finish: "led" },
          // Speaker grilles either side of the light.
          ...row(6, [0.05, 0, 0], { k: "cyl", r: 0.012, h: 0.006, pos: [-0.83, 0.69, 0.282], rot: FACE, color: PLUM }),
          ...row(6, [0.05, 0, 0], { k: "cyl", r: 0.012, h: 0.006, pos: [-0.22, 0.69, 0.282], rot: FACE, color: PLUM }),
        ],
      },
      {
        id: "remote",
        label: "Remote",
        agent: 1,
        color: CREAM,
        frame: REMOTE_FRAME,
        shapes: [
          { k: "slab", size: [0.22, 0.52], t: 0.08, r: 0.11, pos: [0, 0.04, 0], rot: flat(), bevel: 0.015 },
          { k: "torus", R: 0.078, tube: 0.01, pos: [0, 0.082, -0.13], rot: flat(), color: LILAC, finish: "soft" },
          { k: "cyl", r: 0.06, h: 0.03, pos: [0, 0.088, -0.13], color: CORAL, finish: "soft" },
          { k: "cyl", r: 0.026, h: 0.024, pos: [-0.05, 0.086, 0.01], color: LILAC, finish: "soft" },
          { k: "cyl", r: 0.026, h: 0.024, pos: [0.05, 0.086, 0.01], color: LILAC, finish: "soft" },
          { k: "slab", size: [0.06, 0.16], t: 0.024, r: 0.03, pos: [0, 0.086, 0.15], rot: flat(), color: LILAC, finish: "soft" },
        ],
      },
      {
        id: "props",
        label: "Play, pause, loop",
        agent: 0,
        color: CORAL,
        shapes: [
          // Play, pause and loop — the TV's verbs as toy blocks.
          {
            k: "poly",
            pts: [
              [-0.13, -0.17],
              [0.17, 0],
              [-0.13, 0.17],
            ],
            r: 0.05,
            t: 0.14,
            bevel: 0.016,
            pos: [-0.95, 0.285, 0.64],
            rot: [0, 0.25, 0],
          },
          { k: "cyl", r: 0.05, h: 0.26, pos: [-0.52, 0.21, 0.68], color: GREEN, bevel: 0.05 },
          { k: "cyl", r: 0.05, h: 0.26, pos: [-0.38, 0.21, 0.68], color: GREEN, bevel: 0.05 },
          { k: "torus", R: 0.13, tube: 0.06, pos: [1.0, 0.14, 0.64], rot: flat(), color: YELLOW },
          // The queue: three cards, loosely stacked.
          { k: "slab", size: [0.46, 0.32], t: 0.035, r: 0.05, pos: [0.22, 0.106, 0.66], rot: flat(0.1), color: BLUE },
          { k: "slab", size: [0.46, 0.32], t: 0.035, r: 0.05, pos: [0.2, 0.141, 0.67], rot: flat(-0.12), color: CREAM },
          { k: "slab", size: [0.46, 0.32], t: 0.035, r: 0.05, pos: [0.21, 0.176, 0.655], rot: flat(0.04), color: GREEN },
          { k: "slab", size: [0.2, 0.03], t: 0.008, r: 0.015, pos: [0.16, 0.1975, 0.7], rot: flat(0.04), color: INKY },
          { k: "slab", size: [0.12, 0.03], t: 0.008, r: 0.015, pos: [0.12, 0.1975, 0.75], rot: flat(0.04), color: WHITE },
        ],
      },
    ],
    callouts: [
      { n: "102", at: [1.02, 2.1, -0.08], to: [1.7, 2.45, 0] },
      { n: "104", at: [0.98, 0.74, 0.1], to: [1.9, 1.0, 0.6] },
      { n: "106", at: [-1.26, 0.45, 0.25], to: [-2.0, 0.3, 0.75] },
    ],
  },
  {
    id: "lutra",
    fig: "FIG. 2",
    title: "CloudKitchens Lutra App",
    desc: "All-in-One restaurant operations management tool in China",
    href: "/work/cloudkitchens",
    parts: [
      {
        id: "counter",
        label: "Counter",
        agent: 1,
        color: GROUND,
        shapes: [
          { k: "slab", size: [2.8, 1.7], t: 0.12, r: 0.36, pos: [0, 0.06, 0], rot: flat() },
          { k: "slab", size: [2.5, 1.4], t: 0.012, r: 0.26, pos: [0, 0.121, 0], rot: flat(), color: MIST },
          { k: "slab", size: [3.1, 2.0], t: 0.045, r: 0.46, pos: [0, 0.0225, 0], rot: flat(), color: LILAC },
        ],
      },
      {
        id: "phone",
        label: "Phone",
        agent: 4,
        color: PLUM,
        shapes: [
          { k: "box", size: [0.42, 0.55, 0.3], pos: [-0.62, 0.395, -0.06], color: YELLOW, bevel: 0.036 },
          // Leaning back 0.3 rad on its stand (same tilt as PHONE_FRAME).
          { k: "slab", size: [0.76, 1.5], t: 0.12, r: 0.15, pos: [-0.62, 0.8365, 0.0784], rot: [-0.3, 0, 0], bevel: 0.02 },
        ],
      },
      {
        id: "app",
        label: "App screens",
        agent: 3,
        color: "#050505",
        finish: "screen",
        frame: PHONE_FRAME,
        shapes: [
          { k: "slab", size: [0.66, 1.338], t: 0.003, r: 0.115, pos: [0, 0.75, 0.0615], color: INKY, finish: "soft" },
          { k: "slab", size: [0.62, 1.298], t: 0.006, r: 0.1, pos: [0, 0.75, 0.0635], map: LUTRA_SCREEN },
        ],
      },
      {
        id: "printer",
        label: "Printer",
        agent: 0,
        color: CREAM,
        shapes: [
          { k: "slab", size: [0.9, 0.8], t: 0.5, r: 0.18, pos: [0.74, 0.37, -0.18], rot: flat(), bevel: 0.027 },
          { k: "slab", size: [0.74, 0.4], t: 0.05, r: 0.12, pos: [0.74, 0.64, -0.32], rot: flat(), color: BLUE },
          // Grip ridges on the lid, a lip around the paper slot.
          ...row(3, [0, 0, 0.07], { k: "slab", size: [0.46, 0.028], t: 0.014, r: 0.014, pos: [0.74, 0.668, -0.39], rot: flat(), color: BLUE }),
          { k: "slab", size: [0.66, 0.15], t: 0.016, r: 0.06, pos: [0.74, 0.624, 0.02], rot: flat() },
          { k: "box", size: [0.56, 0.02, 0.07], pos: [0.74, 0.627, 0.02], color: INKY },
          { k: "cyl", r: 0.022, h: 0.012, pos: [0.94, 0.3, 0.224], rot: FACE, color: GREEN, finish: "led" },
          { k: "cyl", r: 0.022, h: 0.012, pos: [0.86, 0.3, 0.224], rot: FACE, color: LILAC },
          { k: "slab", size: [0.18, 0.07], t: 0.016, r: 0.035, pos: [0.6, 0.3, 0.226], color: YELLOW, finish: "soft" },
        ],
      },
      {
        id: "ticket",
        label: "Order ticket",
        agent: 2,
        color: WHITE,
        finish: "print",
        frame: TICKET_FRAME,
        shapes: [{ k: "slab", size: [0.5, 0.7], t: 0.02, r: 0.04, pos: [0, 0.33, 0], map: "proc:receipt" }],
      },
      {
        id: "qr",
        label: "QR stand",
        agent: 1,
        color: WHITE,
        finish: "print",
        frame: QR_FRAME,
        shapes: [
          { k: "box", size: [0.38, 0.08, 0.2], pos: [0, 0.04, 0], color: GREEN, finish: "clay", bevel: 0.015 },
          { k: "slab", size: [0.3, 0.386], t: 0.03, r: 0.045, pos: [0, 0.263, 0], map: "proc:qr" },
        ],
      },
      {
        id: "bowl",
        label: "Bowl",
        agent: 0,
        color: CORAL,
        shapes: [
          { k: "cyl", r: 0.34, h: 0.18, pos: [0.1, 0.21, 0.5], bevel: 0.038 },
          { k: "torus", R: 0.312, tube: 0.028, pos: [0.1, 0.3, 0.5], rot: flat() },
          { k: "cyl", r: 0.27, h: 0.03, pos: [0.1, 0.305, 0.5], color: SAND, bevel: 0.005 },
          // An egg and two scallions.
          { k: "cyl", r: 0.085, h: 0.018, pos: [0.0, 0.326, 0.48], color: WHITE },
          { k: "ball", r: 0.04, pos: [0.0, 0.338, 0.48], color: YELLOW },
          { k: "ball", r: 0.03, pos: [-0.02, 0.326, 0.63], color: GREEN },
          { k: "ball", r: 0.03, pos: [0.12, 0.326, 0.67], color: GREEN },
          { k: "cyl", r: 0.02, h: 0.84, pos: [0.22, 0.362, 0.42], rot: lying(0.9), color: CREAM, bevel: 0.02 },
          { k: "cyl", r: 0.02, h: 0.84, pos: [0.28, 0.362, 0.37], rot: lying(0.98), color: CREAM, bevel: 0.02 },
          // A dish of sauce.
          { k: "cyl", r: 0.09, h: 0.04, pos: [0.54, 0.147, 0.74], color: CREAM },
          { k: "cyl", r: 0.062, h: 0.012, pos: [0.54, 0.167, 0.74], color: PLUM, bevel: 0.002 },
          // A counter bell.
          { k: "cyl", r: 0.1, h: 0.03, pos: [-1.02, 0.142, 0.42], color: PLUM },
          { k: "ball", r: 0.082, pos: [-1.02, 0.16, 0.42], color: YELLOW },
          { k: "ball", r: 0.022, pos: [-1.02, 0.25, 0.42], color: PLUM },
          // A cup of tea.
          { k: "cyl", r: 0.1, h: 0.17, pos: [-0.72, 0.205, 0.64], color: CREAM, bevel: 0.016 },
          { k: "torus", R: 0.05, tube: 0.018, pos: [-0.83, 0.205, 0.64], color: CREAM },
          { k: "cyl", r: 0.074, h: 0.012, pos: [-0.72, 0.287, 0.64], color: SAND, bevel: 0.002 },
        ],
      },
    ],
    callouts: [
      { n: "202", at: [-0.62, 1.56, -0.14], to: [-1.5, 2.0, -0.2] },
      { n: "204", at: [0.92, 1.15, 0.28], to: [1.65, 1.6, 0.2] },
      { n: "206", at: [1.14, 0.42, 0.6], to: [1.85, 0.6, 0.95] },
    ],
  },
  {
    id: "ds",
    fig: "FIG. 3",
    title: "TikTok Design System",
    desc: "A central design system supporting with all TikTok design teams.",
    href: "/work/tiktok-design-system",
    parts: [
      {
        id: "tray",
        label: "Tray",
        agent: 1,
        color: GROUND,
        shapes: [
          { k: "slab", size: [2.9, 2.0], t: 0.12, r: 0.36, pos: [0, 0.06, 0], rot: flat() },
          // The tray's lighter well, where the components sit.
          { k: "slab", size: [2.66, 1.66], t: 0.012, r: 0.26, pos: [0, 0.121, -0.1], rot: flat(), color: MIST },
          { k: "slab", size: [3.2, 2.3], t: 0.045, r: 0.46, pos: [0, 0.0225, 0], rot: flat(), color: LILAC },
          // Silk-screened nameplate.
          {
            k: "slab",
            size: [0.9, 0.1125],
            t: 0.006,
            r: 0.03,
            pos: [-0.82, 0.124, 0.84],
            rot: flat(),
            map: `label:TIKTOK DS · KIT 01|${LILAC}|${INKY}`,
            finish: "print",
          },
        ],
      },
      {
        id: "button",
        label: "Button",
        agent: 4,
        color: CORAL,
        shapes: [
          { k: "slab", size: [0.95, 0.36], t: 0.16, r: 0.18, pos: [-0.8, 0.2, 0.5], rot: flat(), bevel: 0.023 },
          { k: "slab", size: [0.4, 0.08], t: 0.012, r: 0.04, pos: [-0.74, 0.286, 0.5], rot: flat(), color: CREAM },
          { k: "ball", r: 0.045, pos: [-1.06, 0.29, 0.5], color: CREAM },
        ],
      },
      {
        id: "switches",
        label: "Toggle + checkbox",
        agent: 2,
        color: GREEN,
        shapes: [
          { k: "slab", size: [0.64, 0.34], t: 0.12, r: 0.17, pos: [0.2, 0.18, 0.5], rot: flat(), bevel: 0.018 },
          { k: "cyl", r: 0.13, h: 0.09, pos: [0.35, 0.265, 0.5], color: WHITE, bevel: 0.016 },
          { k: "slab", size: [0.34, 0.34], t: 0.12, r: 0.1, pos: [0.95, 0.18, 0.5], rot: flat(), color: PLUM, bevel: 0.018 },
          { k: "poly", pts: CHECK, r: 0.012, t: 0.014, pos: [0.95, 0.247, 0.5], rot: flat(), color: WHITE },
          // Radio group: three rings, the first one chosen.
          ...row(3, [0, 0, 0.26], { k: "torus", R: 0.085, tube: 0.024, pos: [0.14, 0.15, -0.62], rot: flat(), color: PLUM }),
          { k: "ball", r: 0.045, pos: [0.14, 0.16, -0.62], color: CORAL },
        ],
      },
      {
        id: "tabs",
        label: "Tabs",
        agent: 0,
        color: CREAM,
        shapes: [
          { k: "slab", size: [0.8, 0.17], t: 0.07, r: 0.085, pos: [0.85, 0.155, 0.82], rot: flat() },
          // The chosen tab stands proud of the bar; the others are just their labels.
          { k: "slab", size: [0.24, 0.12], t: 0.078, r: 0.06, pos: [0.6, 0.159, 0.82], rot: flat(), color: PLUM },
          { k: "slab", size: [0.12, 0.03], t: 0.008, r: 0.015, pos: [0.6, 0.202, 0.82], rot: flat(), color: WHITE },
          { k: "slab", size: [0.12, 0.03], t: 0.008, r: 0.015, pos: [0.86, 0.194, 0.82], rot: flat(), color: LILAC },
          { k: "slab", size: [0.12, 0.03], t: 0.008, r: 0.015, pos: [1.1, 0.194, 0.82], rot: flat(), color: LILAC },
        ],
      },
      {
        id: "slider",
        label: "Slider",
        agent: 3,
        color: CREAM,
        shapes: [
          { k: "slab", size: [1.25, 0.1], t: 0.07, r: 0.05, pos: [-0.65, 0.155, -0.02], rot: flat() },
          // The fill wraps the track: wider, taller and past its end, so no two faces share a plane.
          { k: "slab", size: [0.62, 0.124], t: 0.086, r: 0.062, pos: [-0.975, 0.163, -0.02], rot: flat(), color: BLUE },
          { k: "cyl", r: 0.12, h: 0.12, pos: [-0.65, 0.2, -0.02], color: YELLOW, bevel: 0.023 },
          // The value tooltip floating over the thumb.
          { k: "slab", size: [0.26, 0.14], t: 0.07, r: 0.05, pos: [-0.65, 0.46, -0.02], color: PLUM, bevel: 0.022 },
          { k: "slab", size: [0.12, 0.028], t: 0.006, r: 0.014, pos: [-0.65, 0.46, 0.018], color: WHITE },
        ],
      },
      {
        id: "input",
        label: "Text field",
        agent: 1,
        color: CREAM,
        shapes: [
          { k: "slab", size: [1.1, 0.26], t: 0.09, r: 0.08, pos: [-0.72, 0.165, -0.4], rot: flat() },
          { k: "slab", size: [0.018, 0.13], t: 0.008, r: 0.009, pos: [-1.1, 0.214, -0.4], rot: flat(), color: INKY },
          { k: "slab", size: [0.4, 0.05], t: 0.008, r: 0.025, pos: [-0.85, 0.214, -0.4], rot: flat(), color: LILAC },
        ],
      },
      {
        id: "card",
        label: "Card",
        agent: 0,
        color: CREAM,
        shapes: [
          { k: "slab", size: [0.95, 0.82], t: 0.1, r: 0.12, pos: [0.8, 0.17, -0.32], rot: flat(), bevel: 0.015 },
          { k: "slab", size: [0.79, 0.38], t: 0.03, r: 0.07, pos: [0.8, 0.232, -0.47], rot: flat(), color: BLUE },
          { k: "ball", r: 0.05, pos: [1.02, 0.25, -0.55], color: YELLOW },
          { k: "slab", size: [0.5, 0.055], t: 0.01, r: 0.027, pos: [0.655, 0.224, -0.19], rot: flat(), color: INKY },
          { k: "slab", size: [0.34, 0.05], t: 0.01, r: 0.025, pos: [0.575, 0.224, -0.09], rot: flat(), color: LILAC },
          { k: "slab", size: [0.24, 0.09], t: 0.03, r: 0.045, pos: [1.06, 0.232, -0.1], rot: flat(), color: CORAL },
        ],
      },
      {
        id: "tokens",
        label: "Colour tokens",
        agent: 2,
        color: CORAL,
        shapes: [
          { k: "cyl", r: 0.13, h: 0.1, pos: [-1.1, 0.17, -0.74], bevel: 0.018 },
          { k: "cyl", r: 0.13, h: 0.1, pos: [-0.8, 0.17, -0.74], color: YELLOW, bevel: 0.018 },
          { k: "cyl", r: 0.13, h: 0.1, pos: [-0.5, 0.17, -0.74], color: GREEN, bevel: 0.018 },
          { k: "cyl", r: 0.13, h: 0.1, pos: [-0.2, 0.17, -0.74], color: BLUE, bevel: 0.018 },
        ],
      },
    ],
    callouts: [
      { n: "302", at: [-1.16, 0.28, 0.62], to: [-1.95, 0.7, 0.95] },
      { n: "304", at: [1.27, 0.22, -0.5], to: [2.0, 0.75, -0.6] },
      { n: "306", at: [-0.2, 0.24, -0.84], to: [-0.1, 0.95, -1.2] },
    ],
  },
  {
    id: "wishlist",
    fig: "FIG. 4",
    title: "Airbnb Wishlist",
    desc: "Keep track of the places you discover on Airbnb — tap the heart on any listing.",
    href: "/work/airbnb-wishlist",
    parts: [
      {
        id: "ground",
        label: "Ground",
        agent: 1,
        color: GROUND,
        shapes: [
          { k: "slab", size: [2.8, 1.9], t: 0.1, r: 0.36, pos: [0, 0.05, 0], rot: flat() },
          { k: "slab", size: [2.5, 1.6], t: 0.012, r: 0.26, pos: [0, 0.101, 0], rot: flat(), color: MIST },
          { k: "slab", size: [3.1, 2.2], t: 0.04, r: 0.46, pos: [0, 0.02, 0], rot: flat(), color: LILAC },
          // Stepping stones up to the door.
          { k: "cyl", r: 0.075, h: 0.03, pos: [0.38, 0.112, 0.36], color: CREAM, bevel: 0.012 },
          { k: "cyl", r: 0.075, h: 0.03, pos: [0.33, 0.112, 0.55], color: CREAM, bevel: 0.012 },
          { k: "cyl", r: 0.075, h: 0.03, pos: [0.4, 0.112, 0.74], color: CREAM, bevel: 0.012 },
        ],
      },
      {
        id: "listing",
        label: "Listing",
        agent: 4,
        color: CREAM,
        shapes: [
          { k: "box", size: [1.0, 0.56, 0.78], pos: [0.55, 0.38, -0.25], bevel: 0.036 },
          // Gable roof: a rounded triangle run front to back.
          {
            k: "poly",
            pts: [
              [-0.6, 0],
              [0.6, 0],
              [0, 0.48],
            ],
            r: 0.07,
            t: 0.9,
            bevel: 0.018,
            pos: [0.55, 0.64, -0.25],
            color: PLUM,
          },
          // Three courses of tiles on the slope the camera sees.
          { k: "box", size: [0.05, 0.024, 0.92], pos: [0.738, 1.003, -0.25], rot: [0, 0, -0.675], color: LILAC },
          { k: "box", size: [0.05, 0.024, 0.92], pos: [0.894, 0.878, -0.25], rot: [0, 0, -0.675], color: LILAC },
          { k: "box", size: [0.05, 0.024, 0.92], pos: [1.0505, 0.753, -0.25], rot: [0, 0, -0.675], color: LILAC },
          // A window in the side wall.
          { k: "cyl", r: 0.09, h: 0.03, pos: [1.056, 0.4, -0.3], rot: lying(), color: WHITE },
          { k: "cyl", r: 0.068, h: 0.04, pos: [1.058, 0.4, -0.3], rot: lying(), color: BLUE },
          // Ridge roll, chimney and a round attic vent.
          { k: "cyl", r: 0.04, h: 0.96, pos: [0.55, 1.15, -0.25], rot: FACE, color: LILAC, bevel: 0.04 },
          { k: "box", size: [0.15, 0.32, 0.15], pos: [0.86, 0.98, -0.45], color: CORAL, bevel: 0.016 },
          { k: "cyl", r: 0.055, h: 0.03, pos: [0.55, 0.86, 0.2], rot: FACE, color: CREAM, bevel: 0.012 },
          // An arched door (its lower end is sunk in the ground) with a knob and a step.
          { k: "slab", size: [0.24, 0.36], t: 0.04, r: 0.12, pos: [0.38, 0.24, 0.15], color: CORAL },
          { k: "ball", r: 0.02, pos: [0.45, 0.26, 0.175], color: YELLOW },
          { k: "slab", size: [0.36, 0.14], t: 0.04, r: 0.06, pos: [0.38, 0.117, 0.22], rot: flat(), color: SAND },
          // A round window with its glazing bars.
          { k: "cyl", r: 0.11, h: 0.03, pos: [0.8, 0.42, 0.148], rot: FACE, color: WHITE, bevel: 0.012 },
          { k: "cyl", r: 0.085, h: 0.04, pos: [0.8, 0.42, 0.15], rot: FACE, color: BLUE, bevel: 0.012 },
          { k: "slab", size: [0.17, 0.016], t: 0.008, r: 0.008, pos: [0.8, 0.42, 0.173], color: WHITE },
          { k: "slab", size: [0.016, 0.17], t: 0.008, r: 0.008, pos: [0.8, 0.42, 0.173], color: WHITE },
        ],
      },
      {
        id: "garden",
        label: "Garden",
        agent: 0,
        color: GREEN,
        shapes: [
          { k: "cyl", r: 0.045, h: 0.3, pos: [-1.12, 0.25, -0.62], color: SAND },
          { k: "cyl", r: 0.2, h: 0.5, pos: [-1.12, 0.62, -0.62], bevel: 0.2 },
          // A second tree peeks out from behind the house.
          { k: "cyl", r: 0.04, h: 0.3, pos: [1.2, 0.25, -0.75], color: SAND },
          { k: "ball", r: 0.19, pos: [1.2, 0.52, -0.75] },
          // Two bushes by the wall.
          { k: "ball", r: 0.11, pos: [-0.04, 0.17, 0.0] },
          { k: "ball", r: 0.08, pos: [-0.02, 0.15, 0.2] },
          // Flowers along the path.
          { k: "ball", r: 0.036, pos: [0.14, 0.135, 0.42], color: YELLOW },
          { k: "ball", r: 0.03, pos: [0.1, 0.13, 0.6], color: CORAL },
          { k: "ball", r: 0.036, pos: [0.62, 0.135, 0.5], color: CORAL },
          { k: "ball", r: 0.03, pos: [0.66, 0.13, 0.68], color: YELLOW },
          // A little rainbow by the door.
          { k: "arch", span: 0.5, rise: 0.25, tube: 0.04, pos: [1.0, 0.09, 0.56], color: CORAL },
          { k: "arch", span: 0.32, rise: 0.16, tube: 0.04, pos: [1.0, 0.09, 0.56], color: YELLOW },
        ],
      },
      {
        id: "saved",
        label: "Saved list",
        agent: 3,
        color: BLUE,
        shapes: [{ k: "slab", size: [0.62, 0.78], t: 0.05, r: 0.09, pos: [-0.82, 0.125, 0.46], rot: flat(-0.28) }],
      },
      {
        id: "card",
        label: "Listing card",
        agent: 2,
        color: CREAM,
        frame: CARD_FRAME,
        shapes: [
          { k: "slab", size: [0.62, 0.78], t: 0.05, r: 0.09, pos: [0, 0.025, 0], rot: flat() },
          { k: "slab", size: [0.5, 0.36], t: 0.024, r: 0.06, pos: [0, 0.058, -0.15], rot: flat(), color: GREEN },
          { k: "slab", size: [0.3, 0.05], t: 0.01, r: 0.025, pos: [-0.1, 0.054, 0.14], rot: flat(), color: INKY },
          { k: "slab", size: [0.2, 0.045], t: 0.01, r: 0.022, pos: [-0.15, 0.054, 0.24], rot: flat(), color: LILAC },
          { k: "poly", pts: heart(0.12), t: 0.016, pos: [0.19, 0.056, 0.19], rot: flat(), color: CORAL },
        ],
      },
      {
        id: "heart",
        label: "Save heart",
        agent: 1,
        color: CORAL,
        // Upright and facing the viewer: tilting it made it look lopsided.
        shapes: [{ k: "poly", pts: heart(0.56), t: 0.17, bevel: 0.04, pos: [-0.12, 0.82, 0.58], rot: [0, 0.3, 0] }],
      },
      {
        id: "cloud",
        label: "Cloud",
        agent: 0,
        color: WHITE,
        shapes: [
          { k: "ball", r: 0.16, pos: [-0.7, 1.3, -0.55] },
          { k: "ball", r: 0.21, pos: [-0.5, 1.38, -0.55] },
          { k: "ball", r: 0.15, pos: [-0.3, 1.29, -0.55] },
          { k: "ball", r: 0.13, pos: [-0.56, 1.25, -0.47] },
        ],
      },
    ],
    callouts: [
      { n: "402", at: [-0.36, 1.02, 0.58], to: [-1.2, 1.55, 0.3] },
      { n: "404", at: [1.06, 0.5, -0.1], to: [1.9, 0.85, 0.3] },
      { n: "406", at: [-1.0, 0.2, 0.75], to: [-1.75, 0.3, 1.15] },
    ],
  },
];
