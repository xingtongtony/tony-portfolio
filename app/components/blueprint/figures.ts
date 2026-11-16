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

/**
 * A figure's colours, by role. Every figure uses the same roles, so the names
 * in the definitions below mean "the mid tone of this world", not a fixed hue.
 */
export type Palette = {
  /** The base everything stands on, and its lighter inlay. */
  ground: string;
  mist: string;
  /** The world's mid tone and its deep tone, which own most of the area. */
  lilac: string;
  plum: string;
  /** The darkest tone, for small marks and print. */
  inky: string;
  /** Neutrals. */
  cream: string;
  sand: string;
  /** The two accents — small, and the only strong colours. */
  coral: string;
  yellow: string;
  /** Quiet: glass, and plants. */
  blue: string;
  green: string;
  white: string;
};

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
  | ({
      k: "slab";
      size: [number, number];
      t: number;
      r: number;
      rot?: Vec3;
      bevel?: number;
    } & Surface)
  // Upright cylinder; bevel = r makes it a capsule.
  | ({ k: "cyl"; r: number; h: number; rot?: Vec3; bevel?: number } & Surface)
  | ({ k: "ball"; r: number } & Surface)
  // Ring of radius `R` and tube radius `tube`, standing in its XY plane.
  | ({ k: "torus"; R: number; tube: number; rot?: Vec3 } & Surface)
  // A tube arching between (-span/2, 0, 0) and (span/2, 0, 0), `rise` high.
  | ({
      k: "arch";
      span: number;
      rise: number;
      tube: number;
      rot?: Vec3;
    } & Surface)
  // Arbitrary outline (corners rounded by `r`) extruded by `t`.
  | ({
      k: "poly";
      pts: [number, number][];
      t: number;
      r?: number;
      rot?: Vec3;
      bevel?: number;
    } & Surface);

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
  /** The figure's own colours; the scene tints the floor around it with `ground`. */
  palette: Palette;
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
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    pts.push([(x / 32) * w, ((y + 2.5) / 32) * w]);
  }
  return pts;
}

/** `n` copies of a shape, the first at `pos`, each next one moved by `step`. */
function row(n: number, step: Vec3, shape: ShapeDef): ShapeDef[] {
  return Array.from({ length: n }, (_, i) => ({
    ...shape,
    pos: [
      shape.pos[0] + step[0] * i,
      shape.pos[1] + step[1] * i,
      shape.pos[2] + step[2] * i,
    ] as Vec3,
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
  {
    id: "global",
    name: "Bilingual, global",
    short: "Global",
    fill: "#CEE800",
    stroke: "#A2B700",
    src: "/portfolio/stickers/bilingual-global.svg",
    w: 160,
  },
  {
    id: "patents",
    name: "325 design patents",
    short: "Patents",
    fill: "#CDB0ED",
    stroke: "#A479D4",
    src: "/portfolio/stickers/design-patents.svg",
    w: 162,
  },
  {
    id: "detail",
    name: "Detail obsessed",
    short: "Detail",
    fill: "#FFE37D",
    stroke: "#DBB52B",
    src: "/portfolio/stickers/detail-obsessed.svg",
    w: 144,
  },
  {
    id: "workflow",
    name: "Agent workflow",
    short: "Workflow",
    fill: "#49D2FC",
    stroke: "#1BA0C9",
    src: "/portfolio/stickers/agent-workflow.svg",
    w: 156,
  },
  {
    id: "systems",
    name: "Design systems nerd",
    short: "Systems",
    fill: "#FF9393",
    stroke: "#A52422",
    src: "/portfolio/stickers/design-systems.svg",
    w: 185,
  },
];

// ── Palettes ───────────────────────────────────────────────────────────────
// Each figure is its own small world with its own hue, so the four do not
// look like one object repeated. Inside a world the recipe is always the
// same: the world's hue (ground, mist, mid, deep) owns most of the area, cream
// and sand are the neutrals, and only two accents are strong. A figure that
// uses every colour at equal weight looks busy, however nice each colour is.
export const THEMES = {
  lilac: {
    ground: "#DCD3F8",
    mist: "#EDE8FD",
    lilac: "#BDAFF1",
    plum: "#5E50A8",
    inky: "#3B3270",
    cream: "#FBF3E8",
    sand: "#EFD3B4",
    coral: "#F58D74",
    yellow: "#F7CF6E",
    blue: "#A9C3EC",
    green: "#A8CFA6",
    white: "#FFFFFF",
  },
  peach: {
    ground: "#FAD8CB",
    mist: "#FDECE5",
    lilac: "#F1B5A1",
    plum: "#B05A44",
    inky: "#5E2A20",
    cream: "#FFF6EA",
    sand: "#F4DDB9",
    coral: "#86BBA8",
    yellow: "#F7CF6E",
    blue: "#B9CDEB",
    green: "#9CCB9B",
    white: "#FFFFFF",
  },
  blue: {
    ground: "#D2E1F6",
    mist: "#E8F0FB",
    lilac: "#AEC7EE",
    plum: "#4563B0",
    inky: "#2A3C73",
    cream: "#FBF6EC",
    sand: "#EFD9BC",
    coral: "#F58D74",
    yellow: "#F7CF6E",
    blue: "#C3D6F3",
    green: "#A8CFA6",
    white: "#FFFFFF",
  },
  mint: {
    ground: "#D1EBDC",
    mist: "#E8F5EE",
    lilac: "#A8D5BB",
    plum: "#3E7F66",
    inky: "#23503F",
    cream: "#FFF7EA",
    sand: "#F1D7B5",
    coral: "#F4876F",
    yellow: "#F7CF6E",
    blue: "#A9C8EC",
    green: "#7DBB8C",
    white: "#FFFFFF",
  },
  butter: {
    ground: "#FAE9B5",
    mist: "#FDF3D6",
    lilac: "#F1D27E",
    plum: "#A9792C",
    inky: "#5A3E13",
    cream: "#FFF9EE",
    sand: "#F3DFC0",
    coral: "#F58D74",
    yellow: "#B9AEEA",
    blue: "#B8CCEC",
    green: "#A8CFA6",
    white: "#FFFFFF",
  },
  rose: {
    ground: "#F9D4E2",
    mist: "#FCE9F0",
    lilac: "#EFADC7",
    plum: "#AD4A76",
    inky: "#5C2340",
    cream: "#FFF7EE",
    sand: "#F3DCC1",
    coral: "#F28C5B",
    yellow: "#F7CF6E",
    blue: "#B9C8F0",
    green: "#A8CFA6",
    white: "#FFFFFF",
  },
  teal: {
    ground: "#C9ECEA",
    mist: "#E4F6F4",
    lilac: "#9DD8D2",
    plum: "#2F8782",
    inky: "#1C4E4B",
    cream: "#FFF8EC",
    sand: "#F1DBBB",
    coral: "#F58D74",
    yellow: "#F7CF6E",
    blue: "#B6D3EE",
    green: "#9CCB9B",
    white: "#FFFFFF",
  },
  // Work whose case study is not written yet: the same roles in greys, so it
  // reads as "not open yet" beside the coloured ones.
  mono: {
    ground: "#E6E6E6",
    mist: "#F3F3F3",
    lilac: "#CACACA",
    plum: "#3C3C3C",
    inky: "#1E1E1E",
    cream: "#FAFAFA",
    sand: "#DDDDDD",
    coral: "#8A8A8A",
    yellow: "#B8B8B8",
    blue: "#D4D4D4",
    green: "#ACACAC",
    white: "#FFFFFF",
  },
} satisfies Record<string, Palette>;

/** For anything that is not part of one figure (print ink, light colour). */
export const PALETTE: Palette = THEMES.lilac;

// The definitions below are written with these role names. They hold the
// palette of the figure being defined; FIGURES sets them before each one.
let GROUND = "";
let MIST = "";
let LILAC = "";
let PLUM = "";
let INKY = "";
let CREAM = "";
let SAND = "";
let CORAL = "";
let YELLOW = "";
let BLUE = "";
let GREEN = "";
let WHITE = "";
function use(p: Palette) {
  GROUND = p.ground;
  MIST = p.mist;
  LILAC = p.lilac;
  PLUM = p.plum;
  INKY = p.inky;
  CREAM = p.cream;
  SAND = p.sand;
  CORAL = p.coral;
  YELLOW = p.yellow;
  BLUE = p.blue;
  GREEN = p.green;
  WHITE = p.white;
}

const TV_SCREEN = "/portfolio/blueprints/tv-screen.jpg";
const LUTRA_SCREEN = "/portfolio/blueprints/lutra-screen.jpg";

const REMOTE_FRAME = {
  pos: [0.9, 0.62, 0.0] as Vec3,
  rot: [0, 0.35, 0] as Vec3,
};
const PHONE_FRAME = {
  pos: [-0.62, 0.12, 0.3] as Vec3,
  rot: [-0.3, 0, 0] as Vec3,
};
const TICKET_FRAME = {
  pos: [0.74, 0.62, 0.02] as Vec3,
  rot: [0.42, 0, 0] as Vec3,
};
const QR_FRAME = {
  pos: [0.95, 0.12, 0.58] as Vec3,
  rot: [-0.18, 0.3, 0] as Vec3,
};
const CARD_FRAME = {
  pos: [-0.7, 0.15, 0.42] as Vec3,
  rot: [0, 0.12, 0] as Vec3,
};

/** The base every figure stands on: a lower step, the base, and its lighter inlay. */
function plinth(c: Palette): ShapeDef[] {
  return [
    { k: "slab", size: [2.9, 1.9], t: 0.1, r: 0.36, pos: [0, 0.05, 0], rot: flat() },
    { k: "slab", size: [2.6, 1.6], t: 0.012, r: 0.26, pos: [0, 0.101, 0], rot: flat(), color: c.mist },
    { k: "slab", size: [3.2, 2.2], t: 0.04, r: 0.46, pos: [0, 0.02, 0], rot: flat(), color: c.lilac },
  ];
}

/**
 * One small interface — a bar, a hero and two cards — sized to a screen
 * `w` × `h` centred at height `cy`, standing on a face at `z`. The same blocks
 * on every device is the point of a cross-platform system.
 */
function screenBlocks(c: Palette, w: number, h: number, cy: number, z: number): ShapeDef[] {
  const t = 0.014;
  return [
    { k: "slab", size: [w * 0.84, h * 0.1], t, r: h * 0.03, pos: [0, cy + h * 0.36, z + t / 2], color: c.plum },
    { k: "slab", size: [w * 0.84, h * 0.36], t: t * 2, r: h * 0.04, pos: [0, cy + h * 0.08, z + t], color: c.coral },
    { k: "slab", size: [w * 0.4, h * 0.26], t, r: h * 0.035, pos: [-w * 0.22, cy - h * 0.28, z + t / 2], color: c.yellow },
    { k: "slab", size: [w * 0.4, h * 0.26], t, r: h * 0.035, pos: [w * 0.22, cy - h * 0.28, z + t / 2], color: c.lilac },
  ];
}

/** A four-pointed sparkle, `s` from centre to tip. */
function sparkle(s: number): [number, number][] {
  const q = s * 0.26;
  return [
    [0, s],
    [q, q],
    [s, 0],
    [q, -q],
    [0, -s],
    [-q, -q],
    [-s, 0],
    [-q, q],
  ];
}

const SOON = "Coming soon";

const BUILDERS: [Palette, (c: Palette) => Omit<FigureDef, "palette">][] = [
  [
    THEMES.lilac,
    () => ({
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
            {
              k: "slab",
              size: [2.9, 1.8],
              t: 0.08,
              r: 0.42,
              pos: [0, 0.04, 0],
              rot: flat(),
            },
            // A lighter field woven into the rug.
            {
              k: "slab",
              size: [2.56, 1.46],
              t: 0.012,
              r: 0.3,
              pos: [0, 0.082, 0],
              rot: flat(),
              color: MIST,
            },
            // A lower, wider step under the base, as on a plinth.
            {
              k: "slab",
              size: [3.2, 2.1],
              t: 0.04,
              r: 0.5,
              pos: [0, 0.02, 0],
              rot: flat(),
              color: LILAC,
            },
          ],
        },
        {
          id: "console",
          label: "Console",
          agent: 4,
          color: SAND,
          shapes: [
            {
              k: "cyl",
              r: 0.07,
              h: 0.16,
              pos: [-1.0, 0.15, 0.22],
              color: CORAL,
            },
            {
              k: "cyl",
              r: 0.07,
              h: 0.16,
              pos: [1.0, 0.15, 0.22],
              color: CORAL,
            },
            {
              k: "cyl",
              r: 0.07,
              h: 0.16,
              pos: [-1.0, 0.15, -0.22],
              color: CORAL,
            },
            {
              k: "cyl",
              r: 0.07,
              h: 0.16,
              pos: [1.0, 0.15, -0.22],
              color: CORAL,
            },
            {
              k: "box",
              size: [2.5, 0.4, 0.74],
              pos: [0, 0.42, 0],
              bevel: 0.045,
            },
            // Two drawers: raised fronts and their pulls.
            {
              k: "slab",
              size: [1.08, 0.26],
              t: 0.03,
              r: 0.07,
              pos: [-0.6, 0.42, 0.376],
            },
            {
              k: "slab",
              size: [1.08, 0.26],
              t: 0.03,
              r: 0.07,
              pos: [0.6, 0.42, 0.376],
            },
            {
              k: "slab",
              size: [0.36, 0.07],
              t: 0.05,
              r: 0.035,
              pos: [-0.6, 0.42, 0.405],
              color: CORAL,
            },
            {
              k: "slab",
              size: [0.36, 0.07],
              t: 0.05,
              r: 0.035,
              pos: [0.6, 0.42, 0.405],
              color: CORAL,
            },
            // A plant behind the console's far end.
            {
              k: "cyl",
              r: 0.13,
              h: 0.2,
              pos: [1.15, 0.18, -0.62],
              color: CREAM,
              bevel: 0.018,
            },
            {
              k: "cyl",
              r: 0.055,
              h: 0.4,
              pos: [1.15, 0.46, -0.62],
              color: GREEN,
              bevel: 0.055,
            },
            {
              k: "cyl",
              r: 0.05,
              h: 0.34,
              pos: [1.06, 0.4, -0.6],
              rot: [0, 0, 0.5],
              color: GREEN,
              bevel: 0.05,
            },
            {
              k: "cyl",
              r: 0.05,
              h: 0.34,
              pos: [1.24, 0.4, -0.64],
              rot: [0, 0, -0.5],
              color: GREEN,
              bevel: 0.05,
            },
          ],
        },
        {
          id: "tv-body",
          label: "TV body",
          agent: 0,
          color: PLUM,
          shapes: [
            {
              k: "slab",
              size: [0.84, 0.34],
              t: 0.06,
              r: 0.17,
              pos: [0, 0.65, -0.06],
              rot: flat(),
            },
            { k: "cyl", r: 0.08, h: 0.16, pos: [0, 0.74, -0.08] },
            {
              k: "slab",
              size: [2.2, 1.3],
              t: 0.18,
              r: 0.16,
              pos: [0, 1.45, -0.08],
              bevel: 0.025,
            },
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
            {
              k: "slab",
              size: [1.9, 1.095],
              t: 0.003,
              r: 0.09,
              pos: [0, 1.45, 0.0115],
              color: INKY,
              finish: "soft",
            },
            {
              k: "slab",
              size: [1.84, 1.035],
              t: 0.006,
              r: 0.07,
              pos: [0, 1.45, 0.0135],
              map: TV_SCREEN,
            },
            {
              k: "cyl",
              r: 0.012,
              h: 0.006,
              pos: [0.9, 0.893, 0.012],
              rot: FACE,
              color: CORAL,
              finish: "led",
            },
          ],
        },
        {
          id: "soundbar",
          label: "Soundbar",
          agent: 2,
          color: CREAM,
          shapes: [
            {
              k: "slab",
              size: [1.1, 0.14],
              t: 0.14,
              r: 0.07,
              pos: [-0.4, 0.69, 0.21],
              bevel: 0.02,
            },
            {
              k: "slab",
              size: [0.12, 0.016],
              t: 0.006,
              r: 0.008,
              pos: [-0.4, 0.69, 0.282],
              color: YELLOW,
              finish: "led",
            },
            // Speaker grilles either side of the light.
            ...row(6, [0.05, 0, 0], {
              k: "cyl",
              r: 0.012,
              h: 0.006,
              pos: [-0.83, 0.69, 0.282],
              rot: FACE,
              color: PLUM,
            }),
            ...row(6, [0.05, 0, 0], {
              k: "cyl",
              r: 0.012,
              h: 0.006,
              pos: [-0.22, 0.69, 0.282],
              rot: FACE,
              color: PLUM,
            }),
          ],
        },
        {
          id: "remote",
          label: "Remote",
          agent: 1,
          color: CREAM,
          frame: REMOTE_FRAME,
          shapes: [
            {
              k: "slab",
              size: [0.22, 0.52],
              t: 0.08,
              r: 0.11,
              pos: [0, 0.04, 0],
              rot: flat(),
              bevel: 0.015,
            },
            {
              k: "torus",
              R: 0.078,
              tube: 0.01,
              pos: [0, 0.082, -0.13],
              rot: flat(),
              color: LILAC,
              finish: "soft",
            },
            {
              k: "cyl",
              r: 0.06,
              h: 0.03,
              pos: [0, 0.088, -0.13],
              color: CORAL,
              finish: "soft",
            },
            {
              k: "cyl",
              r: 0.026,
              h: 0.024,
              pos: [-0.05, 0.086, 0.01],
              color: LILAC,
              finish: "soft",
            },
            {
              k: "cyl",
              r: 0.026,
              h: 0.024,
              pos: [0.05, 0.086, 0.01],
              color: LILAC,
              finish: "soft",
            },
            {
              k: "slab",
              size: [0.06, 0.16],
              t: 0.024,
              r: 0.03,
              pos: [0, 0.086, 0.15],
              rot: flat(),
              color: LILAC,
              finish: "soft",
            },
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
            {
              k: "cyl",
              r: 0.05,
              h: 0.26,
              pos: [-0.52, 0.21, 0.68],
              color: YELLOW,
              bevel: 0.05,
            },
            {
              k: "cyl",
              r: 0.05,
              h: 0.26,
              pos: [-0.38, 0.21, 0.68],
              color: YELLOW,
              bevel: 0.05,
            },
            {
              k: "torus",
              R: 0.13,
              tube: 0.06,
              pos: [1.0, 0.14, 0.64],
              rot: flat(),
              color: LILAC,
            },
            // The queue: three cards, loosely stacked.
            {
              k: "slab",
              size: [0.46, 0.32],
              t: 0.035,
              r: 0.05,
              pos: [0.22, 0.106, 0.66],
              rot: flat(0.1),
              color: LILAC,
            },
            {
              k: "slab",
              size: [0.46, 0.32],
              t: 0.035,
              r: 0.05,
              pos: [0.2, 0.141, 0.67],
              rot: flat(-0.12),
              color: CREAM,
            },
            {
              k: "slab",
              size: [0.46, 0.32],
              t: 0.035,
              r: 0.05,
              pos: [0.21, 0.176, 0.655],
              rot: flat(0.04),
              color: CORAL,
            },
            {
              k: "slab",
              size: [0.2, 0.03],
              t: 0.008,
              r: 0.015,
              pos: [0.16, 0.1975, 0.7],
              rot: flat(0.04),
              color: INKY,
            },
            {
              k: "slab",
              size: [0.12, 0.03],
              t: 0.008,
              r: 0.015,
              pos: [0.12, 0.1975, 0.75],
              rot: flat(0.04),
              color: WHITE,
            },
          ],
        },
      ],
      callouts: [
        { n: "102", at: [1.02, 2.1, -0.08], to: [1.7, 2.45, 0] },
        { n: "104", at: [0.98, 0.74, 0.1], to: [1.9, 1.0, 0.6] },
        { n: "106", at: [-1.26, 0.45, 0.25], to: [-2.0, 0.3, 0.75] },
      ],
    }),
  ],
  [
    THEMES.peach,
    () => ({
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
            {
              k: "slab",
              size: [2.8, 1.7],
              t: 0.12,
              r: 0.36,
              pos: [0, 0.06, 0],
              rot: flat(),
            },
            {
              k: "slab",
              size: [2.5, 1.4],
              t: 0.012,
              r: 0.26,
              pos: [0, 0.121, 0],
              rot: flat(),
              color: MIST,
            },
            {
              k: "slab",
              size: [3.1, 2.0],
              t: 0.045,
              r: 0.46,
              pos: [0, 0.0225, 0],
              rot: flat(),
              color: LILAC,
            },
          ],
        },
        {
          id: "phone",
          label: "Phone",
          agent: 4,
          color: PLUM,
          shapes: [
            {
              k: "box",
              size: [0.42, 0.55, 0.3],
              pos: [-0.62, 0.395, -0.06],
              color: SAND,
              bevel: 0.036,
            },
            // Leaning back 0.3 rad on its stand (same tilt as PHONE_FRAME).
            {
              k: "slab",
              size: [0.76, 1.5],
              t: 0.12,
              r: 0.15,
              pos: [-0.62, 0.8365, 0.0784],
              rot: [-0.3, 0, 0],
              bevel: 0.02,
            },
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
            {
              k: "slab",
              size: [0.66, 1.338],
              t: 0.003,
              r: 0.115,
              pos: [0, 0.75, 0.0615],
              color: INKY,
              finish: "soft",
            },
            {
              k: "slab",
              size: [0.62, 1.298],
              t: 0.006,
              r: 0.1,
              pos: [0, 0.75, 0.0635],
              map: LUTRA_SCREEN,
            },
          ],
        },
        {
          id: "printer",
          label: "Printer",
          agent: 0,
          color: CREAM,
          shapes: [
            {
              k: "slab",
              size: [0.9, 0.8],
              t: 0.5,
              r: 0.18,
              pos: [0.74, 0.37, -0.18],
              rot: flat(),
              bevel: 0.027,
            },
            {
              k: "slab",
              size: [0.74, 0.4],
              t: 0.05,
              r: 0.12,
              pos: [0.74, 0.64, -0.32],
              rot: flat(),
              color: LILAC,
            },
            // Grip ridges on the lid, a lip around the paper slot.
            ...row(3, [0, 0, 0.07], {
              k: "slab",
              size: [0.46, 0.028],
              t: 0.014,
              r: 0.014,
              pos: [0.74, 0.668, -0.39],
              rot: flat(),
              color: LILAC,
            }),
            {
              k: "slab",
              size: [0.66, 0.15],
              t: 0.016,
              r: 0.06,
              pos: [0.74, 0.624, 0.02],
              rot: flat(),
            },
            {
              k: "box",
              size: [0.56, 0.02, 0.07],
              pos: [0.74, 0.627, 0.02],
              color: INKY,
            },
            {
              k: "cyl",
              r: 0.022,
              h: 0.012,
              pos: [0.94, 0.3, 0.224],
              rot: FACE,
              color: YELLOW,
              finish: "led",
            },
            {
              k: "cyl",
              r: 0.022,
              h: 0.012,
              pos: [0.86, 0.3, 0.224],
              rot: FACE,
              color: LILAC,
            },
            {
              k: "slab",
              size: [0.18, 0.07],
              t: 0.016,
              r: 0.035,
              pos: [0.6, 0.3, 0.226],
              color: YELLOW,
              finish: "soft",
            },
          ],
        },
        {
          id: "ticket",
          label: "Order ticket",
          agent: 2,
          color: WHITE,
          finish: "print",
          frame: TICKET_FRAME,
          shapes: [
            {
              k: "slab",
              size: [0.5, 0.7],
              t: 0.02,
              r: 0.04,
              pos: [0, 0.33, 0],
              map: "proc:receipt",
            },
          ],
        },
        {
          id: "qr",
          label: "QR stand",
          agent: 1,
          color: WHITE,
          finish: "print",
          frame: QR_FRAME,
          shapes: [
            {
              k: "box",
              size: [0.38, 0.08, 0.2],
              pos: [0, 0.04, 0],
              color: PLUM,
              finish: "clay",
              bevel: 0.015,
            },
            {
              k: "slab",
              size: [0.3, 0.386],
              t: 0.03,
              r: 0.045,
              pos: [0, 0.263, 0],
              map: "proc:qr",
            },
          ],
        },
        {
          id: "bowl",
          label: "Bowl",
          agent: 0,
          color: CORAL,
          shapes: [
            { k: "cyl", r: 0.34, h: 0.18, pos: [0.1, 0.21, 0.5], bevel: 0.038 },
            {
              k: "torus",
              R: 0.312,
              tube: 0.028,
              pos: [0.1, 0.3, 0.5],
              rot: flat(),
            },
            {
              k: "cyl",
              r: 0.27,
              h: 0.03,
              pos: [0.1, 0.305, 0.5],
              color: SAND,
              bevel: 0.005,
            },
            // An egg and two scallions.
            {
              k: "cyl",
              r: 0.085,
              h: 0.018,
              pos: [0.0, 0.326, 0.48],
              color: WHITE,
            },
            { k: "ball", r: 0.04, pos: [0.0, 0.338, 0.48], color: YELLOW },
            { k: "ball", r: 0.03, pos: [-0.02, 0.326, 0.63], color: GREEN },
            { k: "ball", r: 0.03, pos: [0.12, 0.326, 0.67], color: GREEN },
            {
              k: "cyl",
              r: 0.02,
              h: 0.84,
              pos: [0.22, 0.362, 0.42],
              rot: lying(0.9),
              color: CREAM,
              bevel: 0.02,
            },
            {
              k: "cyl",
              r: 0.02,
              h: 0.84,
              pos: [0.28, 0.362, 0.37],
              rot: lying(0.98),
              color: CREAM,
              bevel: 0.02,
            },
            // A dish of sauce.
            {
              k: "cyl",
              r: 0.09,
              h: 0.04,
              pos: [0.54, 0.147, 0.74],
              color: CREAM,
            },
            {
              k: "cyl",
              r: 0.062,
              h: 0.012,
              pos: [0.54, 0.167, 0.74],
              color: PLUM,
              bevel: 0.002,
            },
            // A counter bell.
            {
              k: "cyl",
              r: 0.1,
              h: 0.03,
              pos: [-1.02, 0.142, 0.42],
              color: PLUM,
            },
            { k: "ball", r: 0.082, pos: [-1.02, 0.16, 0.42], color: YELLOW },
            { k: "ball", r: 0.022, pos: [-1.02, 0.25, 0.42], color: PLUM },
            // A cup of tea.
            {
              k: "cyl",
              r: 0.1,
              h: 0.17,
              pos: [-0.72, 0.205, 0.64],
              color: CREAM,
              bevel: 0.016,
            },
            {
              k: "torus",
              R: 0.05,
              tube: 0.018,
              pos: [-0.83, 0.205, 0.64],
              color: CREAM,
            },
            {
              k: "cyl",
              r: 0.074,
              h: 0.012,
              pos: [-0.72, 0.287, 0.64],
              color: SAND,
              bevel: 0.002,
            },
          ],
        },
      ],
      callouts: [
        { n: "202", at: [-0.62, 1.56, -0.14], to: [-1.5, 2.0, -0.2] },
        { n: "204", at: [0.92, 1.15, 0.28], to: [1.65, 1.6, 0.2] },
        { n: "206", at: [1.14, 0.42, 0.6], to: [1.85, 0.6, 0.95] },
      ],
    }),
  ],
  [
    THEMES.butter,
    (c) => ({
      id: "restructure",
      fig: "FIG. 3",
      title: "TikTok Web Restructure",
      desc: "Restructuring TikTok's WebApp to unlock its substantial potential.",
      href: "/work/tiktok-restructure",
      parts: [
        { id: "ground", label: "Ground", agent: 1, color: c.ground, shapes: plinth(c) },
        {
          id: "window",
          label: "Browser window",
          agent: 4,
          color: c.cream,
          shapes: [
            { k: "slab", size: [1.1, 0.34], t: 0.06, r: 0.1, pos: [-0.15, 0.137, -0.45], rot: flat(), color: c.plum },
            { k: "box", size: [0.14, 0.2, 0.08], pos: [-0.15, 0.26, -0.47], color: c.plum },
            { k: "slab", size: [2.3, 1.44], t: 0.1, r: 0.09, pos: [-0.15, 1.06, -0.45] },
            // Title bar: three dots and the address field.
            { k: "slab", size: [2.2, 0.17], t: 0.02, r: 0.05, pos: [-0.15, 1.645, -0.39], color: c.plum },
            { k: "cyl", r: 0.026, h: 0.012, pos: [-1.13, 1.645, -0.377], rot: FACE, color: c.coral },
            { k: "cyl", r: 0.026, h: 0.012, pos: [-1.04, 1.645, -0.377], rot: FACE, color: c.lilac },
            { k: "cyl", r: 0.026, h: 0.012, pos: [-0.95, 1.645, -0.377], rot: FACE, color: c.green },
            { k: "slab", size: [0.9, 0.07], t: 0.012, r: 0.035, pos: [-0.1, 1.645, -0.376] },
          ],
        },
        {
          id: "layout",
          label: "New structure",
          agent: 3,
          color: c.sand,
          shapes: [
            // Sidebar with its menu.
            { k: "slab", size: [0.5, 1.12], t: 0.04, r: 0.05, pos: [-0.98, 0.95, -0.38], color: c.lilac },
            ...row(4, [0, -0.14, 0], { k: "slab", size: [0.32, 0.055], t: 0.012, r: 0.027, pos: [-0.98, 1.36, -0.354], color: c.cream }),
            // Hero.
            { k: "slab", size: [1.62, 0.5], t: 0.05, r: 0.06, pos: [0.14, 1.26, -0.375], color: c.coral },
            { k: "cyl", r: 0.11, h: 0.02, pos: [0.72, 1.28, -0.342], rot: FACE, color: c.cream },
            { k: "slab", size: [0.6, 0.06], t: 0.012, r: 0.03, pos: [-0.25, 1.33, -0.344], color: c.cream },
            { k: "slab", size: [0.4, 0.05], t: 0.012, r: 0.025, pos: [-0.35, 1.21, -0.344], color: c.cream },
            // Three cards.
            ...row(3, [0.56, 0, 0], { k: "slab", size: [0.5, 0.52], t: 0.04, r: 0.05, pos: [-0.42, 0.68, -0.38] }),
            ...row(3, [0.56, 0, 0], { k: "slab", size: [0.3, 0.045], t: 0.012, r: 0.022, pos: [-0.5, 0.5, -0.354], color: c.inky }),
            ...row(3, [0.56, 0, 0], { k: "slab", size: [0.38, 0.2], t: 0.012, r: 0.04, pos: [-0.42, 0.75, -0.354], color: c.mist }),
          ],
        },
        {
          id: "sitemap",
          label: "Sitemap",
          agent: 2,
          color: c.lilac,
          shapes: [
            { k: "slab", size: [0.34, 0.22], t: 0.09, r: 0.05, pos: [0.7, 0.152, 0.3], rot: flat(), color: c.plum },
            { k: "slab", size: [0.34, 0.22], t: 0.09, r: 0.05, pos: [0.35, 0.152, 0.68], rot: flat() },
            { k: "slab", size: [0.34, 0.22], t: 0.09, r: 0.05, pos: [1.05, 0.152, 0.68], rot: flat() },
            // The branches between them.
            { k: "slab", size: [0.03, 0.1], t: 0.02, r: 0.01, pos: [0.7, 0.117, 0.455], rot: flat(), color: c.inky },
            { k: "slab", size: [0.73, 0.03], t: 0.02, r: 0.01, pos: [0.7, 0.117, 0.5], rot: flat(), color: c.inky },
            { k: "slab", size: [0.03, 0.08], t: 0.02, r: 0.01, pos: [0.35, 0.117, 0.54], rot: flat(), color: c.inky },
            { k: "slab", size: [0.03, 0.08], t: 0.02, r: 0.01, pos: [1.05, 0.117, 0.54], rot: flat(), color: c.inky },
          ],
        },
        {
          id: "blocks",
          label: "Old navigation",
          agent: 0,
          color: c.sand,
          shapes: [
            // What was taken out, set aside.
            { k: "slab", size: [0.8, 0.2], t: 0.08, r: 0.06, pos: [-0.75, 0.147, 0.55], rot: flat(0.35) },
            { k: "slab", size: [0.3, 0.3], t: 0.08, r: 0.06, pos: [-0.25, 0.147, 0.72], rot: flat(-0.3), color: c.cream },
            { k: "ball", r: 0.075, pos: [0.02, 0.18, 0.48], color: c.coral },
          ],
        },
      ],
      callouts: [
        { n: "302", at: [0.95, 1.78, -0.45], to: [1.75, 2.2, -0.3] },
        { n: "304", at: [1.25, 0.2, 0.68], to: [1.95, 0.5, 1.0] },
        { n: "306", at: [-1.1, 0.2, 0.6], to: [-1.9, 0.4, 0.95] },
      ],
    }),
  ],
  [
    THEMES.rose,
    (c) => ({
      id: "multi",
      fig: "FIG. 4",
      title: "TikTok Multi-Platform",
      desc: "Adapting TikTok's product framework across ends, and defining the cross-end experience.",
      href: "/work/tiktok-multi-platform",
      parts: [
        { id: "ground", label: "Ground", agent: 1, color: c.ground, shapes: plinth(c) },
        {
          id: "laptop",
          label: "Laptop",
          agent: 4,
          color: c.cream,
          shapes: [
            { k: "slab", size: [1.5, 1.0], t: 0.07, r: 0.08, pos: [-0.4, 0.142, -0.2], rot: flat() },
            { k: "slab", size: [1.3, 0.46], t: 0.012, r: 0.04, pos: [-0.4, 0.18, -0.38], rot: flat(), color: c.lilac },
            { k: "slab", size: [0.44, 0.26], t: 0.012, r: 0.04, pos: [-0.4, 0.18, 0.08], rot: flat(), color: c.mist },
          ],
        },
        {
          id: "desktop",
          label: "Desktop layout",
          agent: 3,
          color: c.plum,
          frame: { pos: [-0.4, 0.177, -0.68], rot: [-0.22, 0, 0] },
          shapes: [
            { k: "slab", size: [1.5, 1.0], t: 0.06, r: 0.08, pos: [0, 0.5, 0] },
            { k: "slab", size: [1.36, 0.86], t: 0.012, r: 0.04, pos: [0, 0.5, 0.034], color: c.cream },
            ...screenBlocks(c, 1.36, 0.86, 0.5, 0.04),
          ],
        },
        {
          id: "tablet",
          label: "Tablet layout",
          agent: 2,
          color: c.cream,
          frame: { pos: [0.85, 0.107, 0.1], rot: [-0.28, -0.3, 0] },
          shapes: [
            { k: "box", size: [0.3, 0.5, 0.2], pos: [0, 0.25, -0.2], color: c.sand },
            { k: "slab", size: [0.8, 1.04], t: 0.06, r: 0.09, pos: [0, 0.52, 0] },
            { k: "slab", size: [0.68, 0.9], t: 0.012, r: 0.04, pos: [0, 0.52, 0.034], color: c.mist },
            ...screenBlocks(c, 0.68, 0.9, 0.52, 0.04),
          ],
        },
        {
          id: "phone",
          label: "Phone layout",
          agent: 0,
          color: c.plum,
          frame: { pos: [0.1, 0.107, 0.62], rot: [-0.3, 0.15, 0] },
          shapes: [
            { k: "box", size: [0.2, 0.36, 0.18], pos: [0, 0.18, -0.17], color: c.sand },
            { k: "slab", size: [0.38, 0.76], t: 0.06, r: 0.08, pos: [0, 0.38, 0] },
            { k: "slab", size: [0.3, 0.64], t: 0.012, r: 0.05, pos: [0, 0.38, 0.034], color: c.cream },
            ...screenBlocks(c, 0.3, 0.64, 0.38, 0.04),
          ],
        },
        {
          id: "tokens",
          label: "Shared components",
          agent: 1,
          color: c.coral,
          shapes: [
            // The pieces every layout above is made of.
            { k: "slab", size: [0.42, 0.1], t: 0.1, r: 0.04, pos: [-0.9, 0.157, 0.42], rot: flat(), color: c.plum },
            { k: "slab", size: [0.42, 0.3], t: 0.1, r: 0.05, pos: [-0.9, 0.157, 0.66], rot: flat() },
            { k: "slab", size: [0.2, 0.2], t: 0.1, r: 0.05, pos: [-0.5, 0.157, 0.74], rot: flat(), color: c.yellow },
          ],
        },
      ],
      callouts: [
        { n: "402", at: [-1.0, 1.1, -0.88], to: [-1.8, 1.6, -0.7] },
        { n: "404", at: [1.2, 0.9, 0.0], to: [1.9, 1.2, 0.3] },
        { n: "406", at: [-1.1, 0.22, 0.66], to: [-1.9, 0.4, 1.0] },
      ],
    }),
  ],
  [
    THEMES.blue,
    () => ({
      id: "ds",
      fig: "FIG. 5",
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
            {
              k: "slab",
              size: [2.9, 2.0],
              t: 0.12,
              r: 0.36,
              pos: [0, 0.06, 0],
              rot: flat(),
            },
            // The tray's lighter well, where the components sit.
            {
              k: "slab",
              size: [2.66, 1.66],
              t: 0.012,
              r: 0.26,
              pos: [0, 0.121, -0.1],
              rot: flat(),
              color: MIST,
            },
            {
              k: "slab",
              size: [3.2, 2.3],
              t: 0.045,
              r: 0.46,
              pos: [0, 0.0225, 0],
              rot: flat(),
              color: LILAC,
            },
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
            {
              k: "slab",
              size: [0.95, 0.36],
              t: 0.16,
              r: 0.18,
              pos: [-0.8, 0.2, 0.5],
              rot: flat(),
              bevel: 0.023,
            },
            {
              k: "slab",
              size: [0.4, 0.08],
              t: 0.012,
              r: 0.04,
              pos: [-0.74, 0.286, 0.5],
              rot: flat(),
              color: CREAM,
            },
            { k: "ball", r: 0.045, pos: [-1.06, 0.29, 0.5], color: CREAM },
          ],
        },
        {
          id: "switches",
          label: "Toggle + checkbox",
          agent: 2,
          color: GREEN,
          shapes: [
            {
              k: "slab",
              size: [0.64, 0.34],
              t: 0.12,
              r: 0.17,
              pos: [0.2, 0.18, 0.5],
              rot: flat(),
              bevel: 0.018,
            },
            {
              k: "cyl",
              r: 0.13,
              h: 0.09,
              pos: [0.35, 0.265, 0.5],
              color: WHITE,
              bevel: 0.016,
            },
            {
              k: "slab",
              size: [0.34, 0.34],
              t: 0.12,
              r: 0.1,
              pos: [0.95, 0.18, 0.5],
              rot: flat(),
              color: PLUM,
              bevel: 0.018,
            },
            {
              k: "poly",
              pts: CHECK,
              r: 0.012,
              t: 0.014,
              pos: [0.95, 0.247, 0.5],
              rot: flat(),
              color: WHITE,
            },
            // Radio group: three rings, the first one chosen.
            ...row(3, [0, 0, 0.26], {
              k: "torus",
              R: 0.085,
              tube: 0.024,
              pos: [0.14, 0.15, -0.62],
              rot: flat(),
              color: PLUM,
            }),
            { k: "ball", r: 0.045, pos: [0.14, 0.16, -0.62], color: CORAL },
          ],
        },
        {
          id: "tabs",
          label: "Tabs",
          agent: 0,
          color: CREAM,
          shapes: [
            {
              k: "slab",
              size: [0.8, 0.17],
              t: 0.07,
              r: 0.085,
              pos: [0.85, 0.155, 0.82],
              rot: flat(),
            },
            // The chosen tab stands proud of the bar; the others are just their labels.
            {
              k: "slab",
              size: [0.24, 0.12],
              t: 0.078,
              r: 0.06,
              pos: [0.6, 0.159, 0.82],
              rot: flat(),
              color: PLUM,
            },
            {
              k: "slab",
              size: [0.12, 0.03],
              t: 0.008,
              r: 0.015,
              pos: [0.6, 0.202, 0.82],
              rot: flat(),
              color: WHITE,
            },
            {
              k: "slab",
              size: [0.12, 0.03],
              t: 0.008,
              r: 0.015,
              pos: [0.86, 0.194, 0.82],
              rot: flat(),
              color: LILAC,
            },
            {
              k: "slab",
              size: [0.12, 0.03],
              t: 0.008,
              r: 0.015,
              pos: [1.1, 0.194, 0.82],
              rot: flat(),
              color: LILAC,
            },
          ],
        },
        {
          id: "slider",
          label: "Slider",
          agent: 3,
          color: CREAM,
          shapes: [
            {
              k: "slab",
              size: [1.25, 0.1],
              t: 0.07,
              r: 0.05,
              pos: [-0.65, 0.155, -0.02],
              rot: flat(),
            },
            // The fill wraps the track: wider, taller and past its end, so no two faces share a plane.
            {
              k: "slab",
              size: [0.62, 0.124],
              t: 0.086,
              r: 0.062,
              pos: [-0.975, 0.163, -0.02],
              rot: flat(),
              color: PLUM,
            },
            {
              k: "cyl",
              r: 0.12,
              h: 0.12,
              pos: [-0.65, 0.2, -0.02],
              color: YELLOW,
              bevel: 0.023,
            },
            // The value tooltip floating over the thumb.
            {
              k: "slab",
              size: [0.26, 0.14],
              t: 0.07,
              r: 0.05,
              pos: [-0.65, 0.46, -0.02],
              color: PLUM,
              bevel: 0.022,
            },
            {
              k: "slab",
              size: [0.12, 0.028],
              t: 0.006,
              r: 0.014,
              pos: [-0.65, 0.46, 0.018],
              color: WHITE,
            },
          ],
        },
        {
          id: "input",
          label: "Text field",
          agent: 1,
          color: CREAM,
          shapes: [
            {
              k: "slab",
              size: [1.1, 0.26],
              t: 0.09,
              r: 0.08,
              pos: [-0.72, 0.165, -0.4],
              rot: flat(),
            },
            {
              k: "slab",
              size: [0.018, 0.13],
              t: 0.008,
              r: 0.009,
              pos: [-1.1, 0.214, -0.4],
              rot: flat(),
              color: INKY,
            },
            {
              k: "slab",
              size: [0.4, 0.05],
              t: 0.008,
              r: 0.025,
              pos: [-0.85, 0.214, -0.4],
              rot: flat(),
              color: LILAC,
            },
          ],
        },
        {
          id: "card",
          label: "Card",
          agent: 0,
          color: CREAM,
          shapes: [
            {
              k: "slab",
              size: [0.95, 0.82],
              t: 0.1,
              r: 0.12,
              pos: [0.8, 0.17, -0.32],
              rot: flat(),
              bevel: 0.015,
            },
            {
              k: "slab",
              size: [0.79, 0.38],
              t: 0.03,
              r: 0.07,
              pos: [0.8, 0.232, -0.47],
              rot: flat(),
              color: LILAC,
            },
            { k: "ball", r: 0.05, pos: [1.02, 0.25, -0.55], color: YELLOW },
            {
              k: "slab",
              size: [0.5, 0.055],
              t: 0.01,
              r: 0.027,
              pos: [0.655, 0.224, -0.19],
              rot: flat(),
              color: INKY,
            },
            {
              k: "slab",
              size: [0.34, 0.05],
              t: 0.01,
              r: 0.025,
              pos: [0.575, 0.224, -0.09],
              rot: flat(),
              color: LILAC,
            },
            {
              k: "slab",
              size: [0.24, 0.09],
              t: 0.03,
              r: 0.045,
              pos: [1.06, 0.232, -0.1],
              rot: flat(),
              color: CORAL,
            },
          ],
        },
        {
          id: "tokens",
          label: "Colour tokens",
          agent: 2,
          color: CORAL,
          shapes: [
            {
              k: "cyl",
              r: 0.13,
              h: 0.1,
              pos: [-1.1, 0.17, -0.74],
              bevel: 0.018,
            },
            {
              k: "cyl",
              r: 0.13,
              h: 0.1,
              pos: [-0.8, 0.17, -0.74],
              color: YELLOW,
              bevel: 0.018,
            },
            {
              k: "cyl",
              r: 0.13,
              h: 0.1,
              pos: [-0.5, 0.17, -0.74],
              color: LILAC,
              bevel: 0.018,
            },
            {
              k: "cyl",
              r: 0.13,
              h: 0.1,
              pos: [-0.2, 0.17, -0.74],
              color: PLUM,
              bevel: 0.018,
            },
          ],
        },
      ],
      callouts: [
        { n: "502", at: [-1.16, 0.28, 0.62], to: [-1.95, 0.7, 0.95] },
        { n: "504", at: [1.27, 0.22, -0.5], to: [2.0, 0.75, -0.6] },
        { n: "506", at: [-0.2, 0.24, -0.84], to: [-0.1, 0.95, -1.2] },
      ],
    }),
  ],
  [
    THEMES.teal,
    (c) => ({
      id: "tikcode",
      fig: "FIG. 6",
      title: "TikCode Redesign",
      desc: "A QR code for users to connect with friends and reach Hashtags, Sounds and Effects, in TikTok's own style.",
      href: "/work/tiktok-tikcode",
      parts: [
        { id: "ground", label: "Ground", agent: 1, color: c.ground, shapes: plinth(c) },
        {
          id: "code",
          label: "TikCode",
          agent: 4,
          color: c.cream,
          shapes: [
            { k: "slab", size: [0.7, 0.34], t: 0.08, r: 0.1, pos: [-0.45, 0.147, -0.35], rot: flat(), color: c.plum },
            { k: "box", size: [0.12, 0.16, 0.08], pos: [-0.45, 0.25, -0.37], color: c.plum },
            // The medallion: a disc, a rim that stands proud, the printed code, the badge.
            { k: "slab", size: [1.3, 1.3], t: 0.1, r: 0.65, pos: [-0.45, 0.97, -0.35] },
            { k: "torus", R: 0.63, tube: 0.035, pos: [-0.45, 0.97, -0.3], color: c.plum },
            { k: "slab", size: [1.1, 1.1], t: 0.012, r: 0.55, pos: [-0.45, 0.97, -0.293], color: c.white, finish: "print", map: `proc:tikcode|${c.inky}` },
            { k: "cyl", r: 0.17, h: 0.03, pos: [-0.45, 0.97, -0.275], rot: FACE, color: c.coral },
            { k: "cyl", r: 0.07, h: 0.012, pos: [-0.45, 0.97, -0.255], rot: FACE, color: c.white },
          ],
        },
        {
          id: "scanner",
          label: "Scanner",
          agent: 3,
          color: c.cream,
          frame: { pos: [0.8, 0.107, 0.3], rot: [-0.3, -0.45, 0] },
          shapes: [
            { k: "box", size: [0.3, 0.6, 0.22], pos: [0, 0.3, -0.2], color: c.sand },
            { k: "slab", size: [0.6, 1.2], t: 0.08, r: 0.1, pos: [0, 0.6, 0] },
            { k: "slab", size: [0.5, 1.06], t: 0.012, r: 0.06, pos: [0, 0.6, 0.044], color: c.inky, finish: "soft" },
            // The viewfinder: four corners around the code it has found.
            ...[-1, 1].flatMap((sx) =>
              [-1, 1].flatMap((sy): ShapeDef[] => [
                { k: "slab", size: [0.08, 0.018], t: 0.01, r: 0.006, pos: [sx * 0.11, 0.68 + sy * 0.15, 0.055], color: c.yellow },
                { k: "slab", size: [0.018, 0.08], t: 0.01, r: 0.006, pos: [sx * 0.15, 0.68 + sy * 0.11, 0.055], color: c.yellow },
              ]),
            ),
            { k: "slab", size: [0.2, 0.2], t: 0.01, r: 0.1, pos: [0, 0.68, 0.055], color: c.white },
            { k: "cyl", r: 0.05, h: 0.014, pos: [0, 0.2, 0.057], rot: FACE, color: c.coral },
          ],
        },
        {
          id: "profile",
          label: "Profile card",
          agent: 2,
          color: c.cream,
          shapes: [
            { k: "slab", size: [0.8, 0.5], t: 0.06, r: 0.08, pos: [-0.65, 0.137, 0.6], rot: flat() },
            { k: "cyl", r: 0.1, h: 0.03, pos: [-0.9, 0.182, 0.56], color: c.coral },
            { k: "slab", size: [0.34, 0.05], t: 0.012, r: 0.025, pos: [-0.52, 0.173, 0.5], rot: flat(), color: c.inky },
            { k: "slab", size: [0.24, 0.045], t: 0.012, r: 0.022, pos: [-0.57, 0.173, 0.6], rot: flat(), color: c.lilac },
            { k: "slab", size: [0.22, 0.09], t: 0.03, r: 0.045, pos: [-0.4, 0.182, 0.75], rot: flat(), color: c.plum },
          ],
        },
        {
          id: "links",
          label: "Hashtags, sounds, effects",
          agent: 0,
          color: c.yellow,
          shapes: [
            // What a code can open, as three tokens.
            { k: "cyl", r: 0.11, h: 0.08, pos: [0.1, 0.147, 0.72] },
            { k: "cyl", r: 0.11, h: 0.08, pos: [0.36, 0.147, 0.82], color: c.lilac },
            { k: "cyl", r: 0.11, h: 0.08, pos: [-0.05, 0.147, 0.46], color: c.coral },
            { k: "ball", r: 0.032, pos: [0.1, 0.195, 0.72], color: c.white },
            { k: "ball", r: 0.032, pos: [0.36, 0.195, 0.82], color: c.white },
            { k: "ball", r: 0.032, pos: [-0.05, 0.195, 0.46], color: c.white },
          ],
        },
      ],
      callouts: [
        { n: "602", at: [-0.45, 1.62, -0.35], to: [-1.2, 2.1, -0.3] },
        { n: "604", at: [1.0, 1.15, 0.0], to: [1.8, 1.5, 0.2] },
        { n: "606", at: [-1.05, 0.2, 0.75], to: [-1.85, 0.35, 1.05] },
      ],
    }),
  ],
  [
    THEMES.mint,
    () => ({
      id: "wishlist",
      fig: "FIG. 7",
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
            {
              k: "slab",
              size: [2.8, 1.9],
              t: 0.1,
              r: 0.36,
              pos: [0, 0.05, 0],
              rot: flat(),
            },
            {
              k: "slab",
              size: [2.5, 1.6],
              t: 0.012,
              r: 0.26,
              pos: [0, 0.101, 0],
              rot: flat(),
              color: MIST,
            },
            {
              k: "slab",
              size: [3.1, 2.2],
              t: 0.04,
              r: 0.46,
              pos: [0, 0.02, 0],
              rot: flat(),
              color: LILAC,
            },
            // Stepping stones up to the door.
            {
              k: "cyl",
              r: 0.075,
              h: 0.03,
              pos: [0.38, 0.112, 0.36],
              color: CREAM,
              bevel: 0.012,
            },
            {
              k: "cyl",
              r: 0.075,
              h: 0.03,
              pos: [0.33, 0.112, 0.55],
              color: CREAM,
              bevel: 0.012,
            },
            {
              k: "cyl",
              r: 0.075,
              h: 0.03,
              pos: [0.4, 0.112, 0.74],
              color: CREAM,
              bevel: 0.012,
            },
          ],
        },
        {
          id: "listing",
          label: "Listing",
          agent: 4,
          color: CREAM,
          shapes: [
            {
              k: "box",
              size: [1.0, 0.56, 0.78],
              pos: [0.55, 0.38, -0.25],
              bevel: 0.02,
            },
            // The gable: the walls carried up to the ridge.
            {
              k: "poly",
              pts: [
                [-0.5, 0],
                [0.5, 0],
                [0, 0.4],
              ],
              t: 0.78,
              bevel: 0.012,
              pos: [0.55, 0.65, -0.25],
            },
            // The roof is two boards with real thickness that overhang the walls
            // at the eaves and the gables, and cross at the ridge.
            {
              k: "box",
              size: [0.8, 0.07, 0.98],
              pos: [0.8687, 0.8398, -0.25],
              rot: [0, 0, -0.6747],
              color: PLUM,
              bevel: 0.016,
            },
            {
              k: "box",
              size: [0.8, 0.07, 0.98],
              pos: [0.2313, 0.8398, -0.25],
              rot: [0, 0, 0.6747],
              color: PLUM,
              bevel: 0.016,
            },
            // A chimney that comes up through the roof, with its cap.
            {
              k: "box",
              size: [0.16, 0.44, 0.16],
              pos: [0.86, 1.02, -0.45],
              color: CORAL,
              bevel: 0.014,
            },
            {
              k: "box",
              size: [0.215, 0.045, 0.215],
              pos: [0.86, 1.255, -0.45],
              color: CREAM,
              bevel: 0.012,
            },
            // Attic window: a frame that stands out, glass that sits back.
            {
              k: "torus",
              R: 0.068,
              tube: 0.016,
              pos: [0.55, 0.83, 0.158],
              color: WHITE,
            },
            {
              k: "cyl",
              r: 0.062,
              h: 0.012,
              pos: [0.55, 0.83, 0.156],
              rot: FACE,
              color: BLUE,
              finish: "soft",
              bevel: 0.002,
            },
            // An arched door (its lower end is sunk in the ground) with a knob and a step.
            {
              k: "slab",
              size: [0.24, 0.36],
              t: 0.04,
              r: 0.12,
              pos: [0.38, 0.24, 0.15],
              color: CORAL,
            },
            { k: "ball", r: 0.02, pos: [0.45, 0.26, 0.175], color: YELLOW },
            {
              k: "slab",
              size: [0.36, 0.14],
              t: 0.04,
              r: 0.06,
              pos: [0.38, 0.117, 0.22],
              rot: flat(),
              color: SAND,
            },
            // Front window: frame proud of the wall, glass set back inside it, glazing bars between.
            {
              k: "torus",
              R: 0.105,
              tube: 0.021,
              pos: [0.8, 0.42, 0.148],
              color: WHITE,
            },
            {
              k: "cyl",
              r: 0.096,
              h: 0.012,
              pos: [0.8, 0.42, 0.144],
              rot: FACE,
              color: BLUE,
              finish: "soft",
              bevel: 0.002,
            },
            {
              k: "slab",
              size: [0.2, 0.018],
              t: 0.012,
              r: 0.006,
              pos: [0.8, 0.42, 0.156],
              color: WHITE,
            },
            {
              k: "slab",
              size: [0.018, 0.2],
              t: 0.012,
              r: 0.006,
              pos: [0.8, 0.42, 0.156],
              color: WHITE,
            },
            // The same window in the side wall.
            {
              k: "torus",
              R: 0.085,
              tube: 0.018,
              pos: [1.058, 0.4, -0.3],
              rot: [0, Math.PI / 2, 0],
              color: WHITE,
            },
            {
              k: "cyl",
              r: 0.078,
              h: 0.012,
              pos: [1.054, 0.4, -0.3],
              rot: lying(),
              color: BLUE,
              finish: "soft",
              bevel: 0.002,
            },
          ],
        },
        {
          id: "garden",
          label: "Garden",
          agent: 0,
          color: GREEN,
          shapes: [
            {
              k: "cyl",
              r: 0.045,
              h: 0.3,
              pos: [-1.12, 0.25, -0.62],
              color: SAND,
            },
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
            {
              k: "arch",
              span: 0.5,
              rise: 0.25,
              tube: 0.04,
              pos: [1.0, 0.09, 0.56],
              color: CORAL,
            },
            {
              k: "arch",
              span: 0.32,
              rise: 0.16,
              tube: 0.04,
              pos: [1.0, 0.09, 0.56],
              color: YELLOW,
            },
          ],
        },
        {
          id: "saved",
          label: "Saved list",
          agent: 3,
          color: LILAC,
          shapes: [
            {
              k: "slab",
              size: [0.62, 0.78],
              t: 0.05,
              r: 0.09,
              pos: [-0.82, 0.125, 0.46],
              rot: flat(-0.28),
            },
          ],
        },
        {
          id: "card",
          label: "Listing card",
          agent: 2,
          color: CREAM,
          frame: CARD_FRAME,
          shapes: [
            {
              k: "slab",
              size: [0.62, 0.78],
              t: 0.05,
              r: 0.09,
              pos: [0, 0.025, 0],
              rot: flat(),
            },
            {
              k: "slab",
              size: [0.5, 0.36],
              t: 0.024,
              r: 0.06,
              pos: [0, 0.058, -0.15],
              rot: flat(),
              color: SAND,
            },
            {
              k: "slab",
              size: [0.3, 0.05],
              t: 0.01,
              r: 0.025,
              pos: [-0.1, 0.054, 0.14],
              rot: flat(),
              color: INKY,
            },
            {
              k: "slab",
              size: [0.2, 0.045],
              t: 0.01,
              r: 0.022,
              pos: [-0.15, 0.054, 0.24],
              rot: flat(),
              color: LILAC,
            },
            {
              k: "poly",
              pts: heart(0.12),
              t: 0.016,
              pos: [0.19, 0.056, 0.19],
              rot: flat(),
              color: CORAL,
            },
          ],
        },
        {
          id: "heart",
          label: "Save heart",
          agent: 1,
          color: CORAL,
          // Upright and facing the viewer: tilting it made it look lopsided.
          shapes: [
            {
              k: "poly",
              pts: heart(0.56),
              t: 0.17,
              bevel: 0.04,
              pos: [-0.12, 0.82, 0.58],
              rot: [0, 0.3, 0],
            },
          ],
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
        { n: "702", at: [-0.36, 1.02, 0.58], to: [-1.2, 1.55, 0.3] },
        { n: "704", at: [1.06, 0.5, -0.1], to: [1.9, 0.85, 0.3] },
        { n: "706", at: [-1.0, 0.2, 0.75], to: [-1.75, 0.3, 1.15] },
      ],
    }),
  ],
  [
    THEMES.mono,
    (c) => ({
      id: "effects",
      fig: "FIG. 8",
      title: "TikTok Effect House",
      desc: "An AR effect creation tool for TikTok creators.",
      status: SOON,
      parts: [
        { id: "ground", label: "Ground", agent: 1, color: c.ground, shapes: plinth(c) },
        {
          id: "phone",
          label: "Camera",
          agent: 4,
          color: c.plum,
          frame: { pos: [-0.5, 0.107, 0.1], rot: [-0.28, 0.25, 0] },
          shapes: [
            { k: "box", size: [0.3, 0.6, 0.22], pos: [0, 0.3, -0.2], color: c.sand },
            { k: "slab", size: [0.7, 1.4], t: 0.08, r: 0.11, pos: [0, 0.7, 0] },
            { k: "slab", size: [0.58, 1.24], t: 0.012, r: 0.07, pos: [0, 0.7, 0.044], color: c.cream },
            // A face in the viewfinder, wearing the effect.
            { k: "slab", size: [0.44, 0.26], t: 0.02, r: 0.12, pos: [0, 0.47, 0.058], color: c.lilac },
            { k: "cyl", r: 0.2, h: 0.02, pos: [0, 0.82, 0.06], rot: FACE, color: c.lilac },
            { k: "cyl", r: 0.075, h: 0.016, pos: [-0.085, 0.85, 0.078], rot: FACE, color: c.inky },
            { k: "cyl", r: 0.075, h: 0.016, pos: [0.085, 0.85, 0.078], rot: FACE, color: c.inky },
            { k: "cyl", r: 0.05, h: 0.014, pos: [0, 0.2, 0.057], rot: FACE, color: c.coral },
          ],
        },
        {
          id: "sparkles",
          label: "Effects",
          agent: 2,
          color: c.coral,
          shapes: [
            { k: "poly", pts: sparkle(0.17), t: 0.06, bevel: 0.015, pos: [0.3, 1.3, 0.1], rot: [0, 0.3, 0] },
            { k: "poly", pts: sparkle(0.1), t: 0.05, bevel: 0.012, pos: [0.72, 0.95, 0.3], rot: [0, 0.3, 0], color: c.yellow },
            { k: "poly", pts: sparkle(0.12), t: 0.05, bevel: 0.012, pos: [-1.1, 1.35, -0.1], rot: [0, 0.3, 0], color: c.yellow },
          ],
        },
        {
          id: "assets",
          label: "3D assets",
          agent: 0,
          color: c.lilac,
          shapes: [
            { k: "box", size: [0.36, 0.36, 0.36], pos: [0.7, 0.287, 0.45] },
            { k: "ball", r: 0.17, pos: [1.05, 0.277, 0.02], color: c.coral },
            { k: "torus", R: 0.15, tube: 0.05, pos: [0.22, 0.157, 0.7], rot: flat(), color: c.plum },
            { k: "cyl", r: 0.12, h: 0.3, pos: [1.05, 0.257, -0.5], color: c.sand },
          ],
        },
      ],
      callouts: [
        { n: "802", at: [-0.75, 1.42, -0.25], to: [-1.6, 1.9, -0.3] },
        { n: "804", at: [0.9, 0.4, 0.5], to: [1.8, 0.7, 0.8] },
        { n: "806", at: [0.45, 1.35, 0.1], to: [1.3, 1.8, 0.1] },
      ],
    }),
  ],
  [
    THEMES.mono,
    (c) => ({
      id: "hostpromo",
      fig: "FIG. 9",
      title: "Airbnb Host Promotion",
      desc: "More traffic and attention for our China hosts.",
      status: SOON,
      parts: [
        { id: "ground", label: "Ground", agent: 1, color: c.ground, shapes: plinth(c) },
        {
          id: "listing",
          label: "Listing",
          agent: 4,
          color: c.cream,
          shapes: [
            { k: "box", size: [0.8, 0.5, 0.6], pos: [-0.6, 0.357, -0.3] },
            {
              k: "poly",
              pts: [
                [-0.4, 0],
                [0.4, 0],
                [0, 0.32],
              ],
              t: 0.6,
              bevel: 0.012,
              pos: [-0.6, 0.6, -0.3],
            },
            { k: "box", size: [0.64, 0.06, 0.78], pos: [-0.3469, 0.7559, -0.3], rot: [0, 0, -0.6747], color: c.plum, bevel: 0.014 },
            { k: "box", size: [0.64, 0.06, 0.78], pos: [-0.8531, 0.7559, -0.3], rot: [0, 0, 0.6747], color: c.plum, bevel: 0.014 },
            { k: "slab", size: [0.2, 0.3], t: 0.04, r: 0.1, pos: [-0.74, 0.23, 0.01], color: c.coral },
            { k: "torus", R: 0.08, tube: 0.016, pos: [-0.42, 0.38, 0.008], color: c.white },
            { k: "cyl", r: 0.072, h: 0.012, pos: [-0.42, 0.38, 0.004], rot: FACE, color: c.blue, bevel: 0.002 },
          ],
        },
        {
          id: "traffic",
          label: "Traffic",
          agent: 3,
          color: c.lilac,
          shapes: [
            { k: "box", size: [0.24, 0.4, 0.24], pos: [0.25, 0.307, -0.35] },
            { k: "box", size: [0.24, 0.7, 0.24], pos: [0.6, 0.457, -0.35], color: c.coral },
            { k: "box", size: [0.24, 1.0, 0.24], pos: [0.95, 0.607, -0.35], color: c.plum },
            // Up.
            {
              k: "poly",
              pts: [
                [-0.13, 0],
                [0, 0.19],
                [0.13, 0],
                [0.05, 0],
                [0.05, -0.2],
                [-0.05, -0.2],
                [-0.05, 0],
              ],
              r: 0.012,
              t: 0.07,
              bevel: 0.014,
              pos: [0.95, 1.43, -0.35],
              color: c.coral,
            },
          ],
        },
        {
          id: "promo",
          label: "Promotion",
          agent: 2,
          color: c.yellow,
          frame: { pos: [0.35, 0.107, 0.5], rot: [-0.35, 0.3, 0] },
          shapes: [
            // A price tag, with the ring its string goes through.
            { k: "slab", size: [0.6, 0.36], t: 0.06, r: 0.08, pos: [0, 0.2, 0] },
            { k: "torus", R: 0.045, tube: 0.014, pos: [-0.2, 0.27, 0.036], color: c.plum },
            { k: "cyl", r: 0.036, h: 0.014, pos: [0.02, 0.26, 0.037], rot: FACE, color: c.plum },
            { k: "cyl", r: 0.036, h: 0.014, pos: [0.16, 0.14, 0.037], rot: FACE, color: c.plum },
            { k: "slab", size: [0.24, 0.022], t: 0.012, r: 0.01, pos: [0.09, 0.2, 0.036], rot: [0, 0, 0.75], color: c.plum },
          ],
        },
        {
          id: "coins",
          label: "Earnings",
          agent: 0,
          color: c.sand,
          shapes: [
            { k: "cyl", r: 0.12, h: 0.04, pos: [-0.3, 0.127, 0.72] },
            { k: "cyl", r: 0.12, h: 0.04, pos: [-0.29, 0.167, 0.71], color: c.lilac },
            { k: "cyl", r: 0.12, h: 0.04, pos: [-0.31, 0.207, 0.725] },
            { k: "cyl", r: 0.12, h: 0.04, pos: [-0.62, 0.127, 0.62], color: c.lilac },
          ],
        },
      ],
      callouts: [
        { n: "902", at: [1.08, 1.1, -0.35], to: [1.85, 1.5, -0.2] },
        { n: "904", at: [-1.0, 0.5, -0.1], to: [-1.8, 0.9, 0.2] },
        { n: "906", at: [0.62, 0.4, 0.55], to: [1.5, 0.45, 1.0] },
      ],
    }),
  ],
  [
    THEMES.mono,
    (c) => ({
      id: "dls",
      fig: "FIG. 10",
      title: "Airbnb DLS19 for China",
      desc: "A localised, consistent component library for the China design team.",
      status: SOON,
      parts: [
        { id: "ground", label: "Ground", agent: 1, color: c.ground, shapes: plinth(c) },
        {
          id: "shelf",
          label: "Library",
          agent: 4,
          color: c.plum,
          shapes: [
            { k: "box", size: [1.8, 0.07, 0.3], pos: [0, 0.142, -0.4] },
            { k: "slab", size: [2.0, 1.3], t: 0.08, r: 0.08, pos: [0, 0.82, -0.47], color: c.cream },
            { k: "box", size: [1.9, 0.05, 0.3], pos: [0, 0.55, -0.28] },
            { k: "box", size: [1.9, 0.05, 0.3], pos: [0, 0.98, -0.28] },
          ],
        },
        {
          id: "components",
          label: "Components",
          agent: 3,
          color: c.sand,
          shapes: [
            // Bottom: button, toggle, checkbox.
            { k: "slab", size: [0.6, 0.22], t: 0.14, r: 0.11, pos: [-0.6, 0.287, -0.27], color: c.coral },
            { k: "slab", size: [0.44, 0.22], t: 0.14, r: 0.11, pos: [0.1, 0.287, -0.27], color: c.lilac },
            { k: "cyl", r: 0.08, h: 0.03, pos: [0.2, 0.287, -0.186], rot: FACE, color: c.white },
            { k: "box", size: [0.22, 0.22, 0.14], pos: [0.65, 0.287, -0.27], color: c.plum },
            // Middle: card, avatar, field.
            { k: "slab", size: [0.5, 0.34], t: 0.1, r: 0.05, pos: [-0.6, 0.745, -0.27] },
            { k: "slab", size: [0.4, 0.14], t: 0.012, r: 0.03, pos: [-0.6, 0.8, -0.214], color: c.lilac },
            { k: "slab", size: [0.3, 0.04], t: 0.012, r: 0.02, pos: [-0.65, 0.66, -0.214], color: c.inky },
            { k: "cyl", r: 0.14, h: 0.1, pos: [0.05, 0.715, -0.27], rot: FACE, color: c.coral },
            { k: "slab", size: [0.6, 0.18], t: 0.1, r: 0.05, pos: [0.6, 0.665, -0.27], color: c.white },
            { k: "slab", size: [0.014, 0.1], t: 0.008, r: 0.006, pos: [0.38, 0.665, -0.216], color: c.inky },
            // Top: colour tokens and a type block.
            { k: "ball", r: 0.1, pos: [-0.75, 1.105, -0.27], color: c.plum },
            { k: "ball", r: 0.1, pos: [-0.45, 1.105, -0.27], color: c.coral },
            { k: "ball", r: 0.1, pos: [-0.15, 1.105, -0.27], color: c.lilac },
            { k: "ball", r: 0.1, pos: [0.15, 1.105, -0.27], color: c.yellow },
            { k: "box", size: [0.3, 0.3, 0.14], pos: [0.6, 1.155, -0.27] },
          ],
        },
        {
          id: "tools",
          label: "Spec ruler",
          agent: 2,
          color: c.yellow,
          shapes: [
            { k: "slab", size: [0.9, 0.12], t: 0.03, r: 0.02, pos: [0.4, 0.122, 0.5], rot: flat(0.2) },
            { k: "slab", size: [0.9, 0.1125], t: 0.006, r: 0.03, pos: [-0.6, 0.11, 0.7], rot: flat(), map: `label:DLS19 · CHINA|${c.lilac}|${c.inky}`, finish: "print" },
          ],
        },
      ],
      callouts: [
        { n: "1002", at: [0.9, 1.47, -0.47], to: [1.7, 1.9, -0.4] },
        { n: "1004", at: [0.85, 0.16, 0.6], to: [1.7, 0.4, 1.0] },
        { n: "1006", at: [-0.95, 0.3, -0.2], to: [-1.8, 0.6, 0.1] },
      ],
    }),
  ],
  [
    THEMES.mono,
    (c) => ({
      id: "supply",
      fig: "FIG. 11",
      title: "Airbnb Supply Tool",
      desc: "A tool for the China supply team to track listing info and performance.",
      status: SOON,
      parts: [
        { id: "ground", label: "Ground", agent: 1, color: c.ground, shapes: plinth(c) },
        {
          id: "monitor",
          label: "Dashboard",
          agent: 4,
          color: c.plum,
          shapes: [
            { k: "slab", size: [0.9, 0.34], t: 0.06, r: 0.1, pos: [-0.2, 0.137, -0.45], rot: flat() },
            { k: "box", size: [0.14, 0.26, 0.08], pos: [-0.2, 0.29, -0.47] },
            { k: "slab", size: [2.0, 1.2], t: 0.1, r: 0.08, pos: [-0.2, 1.0, -0.45] },
            { k: "slab", size: [1.84, 1.04], t: 0.012, r: 0.04, pos: [-0.2, 1.0, -0.394], color: c.cream },
          ],
        },
        {
          id: "data",
          label: "Listings table",
          agent: 3,
          color: c.lilac,
          shapes: [
            ...row(4, [0, -0.17, 0], { k: "slab", size: [0.9, 0.09], t: 0.012, r: 0.03, pos: [-0.62, 1.36, -0.382] }),
            ...row(4, [0, -0.17, 0], { k: "cyl", r: 0.03, h: 0.012, pos: [-0.02, 1.36, -0.382], rot: FACE, color: c.coral }),
            // Performance: a ring and four bars.
            { k: "torus", R: 0.2, tube: 0.06, pos: [0.42, 1.2, -0.36], color: c.coral },
            { k: "slab", size: [0.07, 0.12], t: 0.012, r: 0.02, pos: [0.2, 0.68, -0.382], color: c.plum },
            { k: "slab", size: [0.07, 0.2], t: 0.012, r: 0.02, pos: [0.31, 0.72, -0.382], color: c.plum },
            { k: "slab", size: [0.07, 0.16], t: 0.012, r: 0.02, pos: [0.42, 0.7, -0.382], color: c.plum },
            { k: "slab", size: [0.07, 0.26], t: 0.012, r: 0.02, pos: [0.53, 0.75, -0.382], color: c.plum },
          ],
        },
        {
          id: "cards",
          label: "Listings",
          agent: 2,
          color: c.cream,
          shapes: [
            { k: "slab", size: [0.5, 0.36], t: 0.05, r: 0.05, pos: [-0.85, 0.132, 0.5], rot: flat(0.2) },
            { k: "slab", size: [0.36, 0.14], t: 0.012, r: 0.03, pos: [-0.86, 0.163, 0.45], rot: flat(0.2), color: c.lilac },
            { k: "slab", size: [0.5, 0.36], t: 0.05, r: 0.05, pos: [-0.3, 0.132, 0.72], rot: flat(-0.15), color: c.sand },
            { k: "slab", size: [0.36, 0.14], t: 0.012, r: 0.03, pos: [-0.3, 0.163, 0.67], rot: flat(-0.15), color: c.plum },
          ],
        },
        {
          id: "pin",
          label: "Map pin",
          agent: 0,
          color: c.coral,
          shapes: [
            { k: "cyl", r: 0.22, h: 0.03, pos: [0.85, 0.122, 0.45], color: c.lilac },
            { k: "cyl", r: 0.03, h: 0.4, pos: [0.85, 0.32, 0.45], color: c.plum },
            { k: "ball", r: 0.15, pos: [0.85, 0.62, 0.45] },
            { k: "ball", r: 0.05, pos: [0.9, 0.67, 0.57], color: c.white },
          ],
        },
      ],
      callouts: [
        { n: "1102", at: [0.75, 1.6, -0.45], to: [1.6, 2.0, -0.3] },
        { n: "1104", at: [1.0, 0.6, 0.45], to: [1.85, 0.8, 0.8] },
        { n: "1106", at: [-1.1, 0.18, 0.6], to: [-1.9, 0.35, 0.95] },
      ],
    }),
  ],
];

export const FIGURES: FigureDef[] = BUILDERS.map(([palette, build]) => {
  use(palette);
  return { ...build(palette), palette };
});
