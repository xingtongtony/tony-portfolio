// Data for the blueprint stage's patent figures, each a small clay
// diorama made of soft solids and split into PARTS. A part is the unit an
// agent builds — it starts as line art and fills with its colour bottom-up.
//
// Art direction (see rules/BLUEPRINT_STAGE.md): matte clay, tight bevels,
// and one palette per figure. Published work has a case-study route; finished
// work awaiting a write-up uses the monochrome palette.
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
  /** Supporting objects are revealed directly as solids, with no patent ink. */
  drawing?: boolean;
  /** Optional local frame, so shapes can be authored on a tilted surface. */
  frame?: { pos: Vec3; rot: Vec3; scale?: number };
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
  /** Camera adjustments for an exhibit whose main surface needs a different view. */
  presentation?: { elevation?: number; scale?: number };
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
const WISHLIST_STAYS = ["/portfolio/blueprints/wishlist-pool.jpg", "/portfolio/blueprints/wishlist-interior.jpg"];

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
const TV_ANGLE = { pos: [0, 0, -0.02] as Vec3, rot: [0, 0.18, 0] as Vec3 };
// Sampled from the approved TV reference; the surrounds have their own resin tint.
const TV_FOCUS = { coral: "#FF835F", yellow: "#FFDC8E" };

/** Constant-width upright focus surround, open at the floor. */
function tvFocusFrame(width: number, height: number, stroke: number, radius: number): ShapeDef {
  const half = width / 2;
  const points: [number, number][] = [[-half, 0], [-half, height - radius]];
  const arc = (cx: number, cy: number, r: number, start: number, end: number) => {
    for (let i = 1; i <= 24; i++) {
      const angle = start + ((end - start) * i) / 24;
      points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
    }
  };
  arc(-half + radius, height - radius, radius, Math.PI, Math.PI / 2);
  points.push([half - radius, height]);
  arc(half - radius, height - radius, radius, Math.PI / 2, 0);
  points.push([half, 0], [half - stroke, 0], [half - stroke, height - radius]);
  arc(half - radius, height - radius, radius - stroke, 0, Math.PI / 2);
  points.push([-half + radius, height - stroke]);
  arc(-half + radius, height - radius, radius - stroke, Math.PI / 2, Math.PI);
  points.push([-half + stroke, 0]);
  return { k: "poly", pts: points, t: 0.20, bevel: 0.026, pos: [0, 0.026, 0] };
}

/** Two centered tiers with an even setback, sized to fit each figure's props. */
function plinth(c: Palette, [width, depth]: [number, number] = [2.8, 1.9], top = 0.107): ShapeDef[] {
  const radius = 0.29;
  const setback = 0.13;
  const lowerThickness = 0.04;
  const deckBottom = 0.034; // Slight overlap joins the tiers below the bevel.
  return [
    {
      k: "slab",
      size: [width + 2 * setback, depth + 2 * setback],
      t: lowerThickness,
      r: radius + setback,
      pos: [0, lowerThickness / 2, 0],
      rot: flat(),
      color: c.lilac,
    },
    {
      k: "slab",
      size: [width, depth],
      t: top - deckBottom,
      r: radius,
      pos: [0, (top + deckBottom) / 2, 0],
      rot: flat(),
      color: c.mist,
      bevel: 0.012,
    },
  ];
}

/**
 * A supporting object in the exhibit's surroundings — the TV's focus
 * surrounds, a pickup shelf, a ring light. It belongs to the project's
 * story, stands on the floor or the deck the way the real thing would, and
 * is built as a solid with no patent ink (it is not part of the drawing).
 * Authored upright in its own frame, turned about the vertical only.
 */
function surround(id: string, label: string, agent: number, color: string, at: Vec3, yaw: number, shapes: ShapeDef[]): PartDef {
  return { id, label, agent, color, drawing: false, frame: { pos: at, rot: [0, yaw, 0] }, shapes };
}

/** A paper takeaway bag standing on `y`: its top folded over and sealed, an order label below. */
function takeawayBag(c: Palette, [x, y, z]: Vec3, [w, h, d]: Vec3): ShapeDef[] {
  return [
    { k: "box", size: [w, h, d], pos: [x, y + h / 2, z], color: c.sand, bevel: 0.012 },
    // The folded-over top, a touch proud of the bag, and the sticker that seals it.
    { k: "box", size: [w + 0.008, 0.07, 0.016], pos: [x, y + h - 0.031, z + d / 2 + 0.004], color: c.sand, bevel: 0.006 },
    { k: "cyl", r: 0.022, h: 0.008, pos: [x, y + h - 0.031, z + d / 2 + 0.015], rot: FACE, color: c.coral },
    { k: "slab", size: [w * 0.5, h * 0.22], t: 0.006, r: 0.01, pos: [x, y + h * 0.42, z + d / 2 + 0.002], color: c.white },
  ];
}

/** A framed square relief of the case study's three Code Eyes and dot pattern. */
function tikCodeRelief(c: Palette, [x, y, z]: Vec3, pitch: number): ShapeDef[] {
  const eyeSpan = 2.2;
  const frameSpan = 10.2 * pitch;
  const insetSpan = 9.84 * pitch;
  const faceZ = z + 0.012;
  // The three Code Eyes sit just inside the square's outer rim.
  const corner = 4.65 - eyeSpan / 2;
  const eyes = [[-corner, corner], [corner, corner], [-corner, -corner]];
  const dots = [
    [-1, 3], [1, 3],
    [0, 2], [1, 2],
    [-1, 1], [2, 1], [3, 1],
    [-3, 0], [-1, 0], [0, 0], [2, 0],
    [-2, -1], [0, -1], [3, -1],
    [1, -2], [3, -2],
    [-1, -3], [1, -3], [2, -3],
  ];
  return [
    { k: "slab", size: [frameSpan, frameSpan], t: 0.01, r: 0.46 * pitch,
      pos: [x, y, z + 0.002], color: c.lilac },
    { k: "slab", size: [insetSpan, insetSpan], t: 0.008, r: 0.28 * pitch,
      pos: [x, y, faceZ - 0.004], color: c.cream },
    ...eyes.flatMap(([column, row], index): ShapeDef[] => {
      const cx = x + column * pitch;
      const cy = y + row * pitch;
      return [
        { k: "slab", size: [eyeSpan * pitch, eyeSpan * pitch], t: 0.18 * pitch, r: 0.41 * pitch,
          pos: [cx, cy, faceZ + 0.04 * pitch], color: index === 1 ? c.coral : c.lilac },
        { k: "cyl", r: 0.59 * pitch, h: 0.22 * pitch, rot: FACE,
          pos: [cx, cy, faceZ + 0.21 * pitch], color: c.inky },
      ];
    }),
    ...dots.map(([column, row], index): ShapeDef => ({
      k: "cyl", r: 0.285 * pitch, h: 0.24 * pitch, rot: FACE,
      pos: [x + column * pitch, y + row * pitch, faceZ + 0.08 * pitch],
      color: index === 4 || index === 15 ? c.coral : c.inky,
    })),
  ];
}

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
    (c) => ({
      id: "tv",
      fig: "FIG. 1",
      title: "TikTok TV Revamp",
      desc: "A more immersive TV feed, with layered backgrounds and clearer remote focus.",
      href: "/work/tiktok-tv-visual",
      parts: [
        {
          id: "rug",
          label: "Rug",
          agent: 1,
          color: c.ground,
          shapes: plinth(c, [2.95, 1.9], 0.088),
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
              size: [2.34, 0.4, 0.74],
              pos: [0, 0.42, 0],
              bevel: 0.055,
            },
            // Two drawers: raised fronts and their pulls.
            {
              k: "slab",
              size: [1.0, 0.25],
              t: 0.04,
              r: 0.07,
              pos: [-0.6, 0.42, 0.376],
              bevel: 0.012,
            },
            {
              k: "slab",
              size: [1.0, 0.25],
              t: 0.04,
              r: 0.07,
              pos: [0.6, 0.42, 0.376],
              bevel: 0.012,
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
          frame: TV_ANGLE,
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
              size: [2.23, 1.3025],
              t: 0.126,
              r: 0.109,
              pos: [0, 1.465, -0.058],
              bevel: 0.014,
            },
          ],
        },
        {
          id: "tv-ui",
          label: "Interface",
          agent: 3,
          color: "#050505",
          finish: "screen",
          frame: TV_ANGLE,
          shapes: [
            // The picture meets the physical bezel directly.
            {
              k: "slab",
              size: [2.12, 1.1925],
              t: 0.006,
              r: 0.054,
              pos: [0, 1.465, 0.0065],
              map: TV_SCREEN,
            },
            {
              k: "cyl",
              r: 0.012,
              h: 0.006,
              pos: [0.95, 0.832, 0.008],
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
          frame: { pos: [0.07, 0.023, 0.21], rot: [0, 0, 0], scale: 0.72 },
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
        {
          id: "focus-outer",
          label: "Outer focus surround",
          agent: 2,
          color: TV_FOCUS.coral,
          drawing: false,
          frame: { pos: [-0.394, 0, -1.096], rot: [0, 0.287, 0] },
          shapes: [tvFocusFrame(3.745, 2.2, 0.15, 0.33)],
        },
        {
          id: "focus-inner",
          label: "Inner focus surround",
          agent: 3,
          color: TV_FOCUS.yellow,
          drawing: false,
          frame: { pos: [-0.422, 0, -1.082], rot: [0, 0.287, 0] },
          shapes: [tvFocusFrame(3.03, 1.84, 0.14, 0.29)],
        },
        {
          id: "focus-plaque",
          label: "Focus",
          agent: 1,
          color: c.coral,
          drawing: false,
          shapes: [
            { k: "slab", size: [0.42, 0.18], t: 0.055, r: 0.025, bevel: 0.009, pos: [-1.01, 0.095, 1.04], map: `label:Focus|${c.coral}|${c.white}|2.3333333333` },
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
    (c) => ({
      id: "lutra",
      fig: "FIG. 2",
      title: "CloudKitchens Lutra App",
      desc: "An operating dashboard for restaurants, from live orders to recommended coupons.",
      href: "/work/cloudkitchens",
      parts: [
        {
          id: "counter",
          label: "Counter",
          agent: 1,
          color: c.ground,
          shapes: plinth(c, [2.8, 1.9], 0.127),
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
              size: [0.76, 1.482],
              t: 0.12,
              r: 0.15,
              pos: [-0.62, 0.8279, 0.081],
              rot: [-0.3, 0, 0],
              bevel: 0.02,
            },
          ],
        },
        {
          id: "app",
          label: "Order Booster",
          agent: 3,
          color: "#050505",
          finish: "screen",
          frame: PHONE_FRAME,
          shapes: [
            {
              k: "slab",
              size: [0.68, 1.402],
              t: 0.006,
              r: 0.11,
              pos: [0, 0.741, 0.0615],
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
              t: 0.007,
              r: 0.018,
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
          frame: { pos: [-0.02, 0.037, 0.16], rot: [0, 0, 0], scale: 0.72 },
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
        // A pickup shelf beside the counter: the orders the app is running,
        // bagged and waiting to be collected.
        surround("pickup", "Pickup shelf", 4, c.lilac, [2.0, 0, -0.62], 0.1, [
          ...[-0.405, 0.405].map((x): ShapeDef => (
            { k: "box", size: [0.05, 1.5, 0.42], pos: [x, 0.75, 0], bevel: 0.016 })),
          ...[0.06, 0.56, 1.06].map((y): ShapeDef => (
            { k: "box", size: [0.78, 0.045, 0.4], pos: [0, y, 0], bevel: 0.012 })),
          { k: "box", size: [0.9, 0.05, 0.46], pos: [0, 1.515, 0], bevel: 0.016 },
          // Bottom: two orders waiting, side by side, evenly spaced.
          ...takeawayBag(c, [-0.17, 0.0825, 0], [0.28, 0.34, 0.18]),
          ...takeawayBag(c, [0.17, 0.0825, 0], [0.28, 0.34, 0.18]),
          // Middle: a stack of takeaway boxes, centred.
          { k: "box", size: [0.36, 0.12, 0.24], pos: [0, 0.6425, 0], color: c.cream, bevel: 0.014 },
          { k: "box", size: [0.37, 0.016, 0.25], pos: [0, 0.67, 0], color: c.cream, bevel: 0.006 },
          { k: "box", size: [0.32, 0.11, 0.22], pos: [0, 0.7575, 0], color: c.mist, bevel: 0.014 },
          // Top: one order and its drink.
          ...takeawayBag(c, [0.13, 1.0825, 0], [0.26, 0.32, 0.17]),
          { k: "cyl", r: 0.07, h: 0.2, pos: [-0.17, 1.1825, 0], color: c.cream, bevel: 0.01 },
          { k: "cyl", r: 0.075, h: 0.06, pos: [-0.17, 1.18, 0], color: c.coral, bevel: 0.006 },
          { k: "cyl", r: 0.075, h: 0.024, pos: [-0.17, 1.2905, 0], color: c.mist, bevel: 0.008 },
          { k: "cyl", r: 0.009, h: 0.14, pos: [-0.155, 1.34, 0.01], color: c.plum, bevel: 0.009 },
          // A surprise on top: the lucky cat a Chinese restaurant keeps by the till,
  // one paw raised, a gold coin held in front.
  { k: "cyl", r: 0.08, h: 0.15, pos: [-0.2, 1.612, 0], color: c.white, bevel: 0.05 },
  { k: "ball", r: 0.07, pos: [-0.2, 1.737, 0.005], color: c.white },
  ...[-1, 1].map((side): ShapeDef => (
    { k: "poly", pts: [[-0.025, 0], [0.025, 0], [0, 0.045]], t: 0.02, r: 0.006, pos: [-0.2 + side * 0.04, 1.782, 0], rot: [0, 0, -side * 0.3], color: c.white })),
  { k: "cyl", r: 0.022, h: 0.08, pos: [-0.125, 1.74, 0.03], color: c.white, bevel: 0.022 },
  { k: "torus", R: 0.066, tube: 0.01, pos: [-0.2, 1.675, 0], rot: flat(), color: c.plum },
  { k: "ball", r: 0.016, pos: [-0.2, 1.66, 0.075], color: c.yellow },
  { k: "slab", size: [0.05, 0.075], t: 0.012, r: 0.02, pos: [-0.23, 1.6, 0.082], color: c.yellow },
  ...[-1, 1].map((side): ShapeDef => ({ k: "ball", r: 0.009, pos: [-0.2 + side * 0.025, 1.75, 0.068], color: c.inky })),
  { k: "ball", r: 0.007, pos: [-0.2, 1.73, 0.072], color: c.plum },
]),
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
      desc: "A video-first browser mode that makes every post discoverable and shareable.",
      href: "/work/tiktok-restructure",
      parts: [
        { id: "ground", label: "Ground", agent: 1, color: c.ground, shapes: plinth(c) },
        {
          id: "window",
          label: "Browser window",
          agent: 4,
          color: c.cream,
          shapes: [
            { k: "slab", size: [1.12, 0.42], t: 0.08, r: 0.09, pos: [0, 0.145, -0.49], rot: flat(), color: c.plum },
            { k: "box", size: [0.18, 0.28, 0.12], pos: [0, 0.3, -0.46], color: c.plum },
            { k: "slab", size: [2.54, 1.49], t: 0.112, r: 0.1, pos: [0, 1.17, -0.44] },
            { k: "slab", size: [2.38, 1.34], t: 0.014, r: 0.06, pos: [0, 1.17, -0.382], color: c.inky },
            { k: "slab", size: [2.32, 0.16], t: 0.016, r: 0.044, pos: [0, 1.738, -0.368], color: c.sand },
            ...row(3, [0.072, 0, 0], { k: "cyl", r: 0.021, h: 0.009, pos: [-1.068, 1.738, -0.354], rot: FACE, color: c.plum }),
            { k: "slab", size: [0.92, 0.083], t: 0.009, r: 0.04, pos: [-0.06, 1.735, -0.355], finish: "print", map: `label:tiktok.com/…/video/…|${c.cream}|${c.inky}` },
          ],
        },
        {
          id: "video",
          label: "Portrait video player",
          agent: 3,
          color: c.plum,
          shapes: [
            { k: "slab", size: [1.36, 1.09], t: 0.038, r: 0.044, pos: [-0.475, 1.102, -0.362] },
            { k: "slab", size: [0.53, 0.94], t: 0.02, r: 0.046, pos: [-0.48, 1.12, -0.334], color: c.coral },
            { k: "cyl", r: 0.112, h: 0.015, pos: [-0.48, 1.13, -0.315], rot: FACE, color: c.cream, finish: "soft" },
            { k: "poly", pts: [[-0.034, -0.052], [0.055, 0], [-0.034, 0.052]], t: 0.009, r: 0.011, pos: [-0.48, 1.13, -0.303], color: c.inky },
            { k: "slab", size: [0.38, 0.017], t: 0.007, r: 0.008, pos: [-0.48, 0.69, -0.318], color: c.cream },
          ],
        },
        {
          id: "discussion",
          label: "Comments and related posts",
          agent: 2,
          color: c.cream,
          shapes: [
            { k: "slab", size: [0.84, 1.09], t: 0.03, r: 0.045, pos: [0.72, 1.102, -0.365] },
            { k: "slab", size: [0.58, 0.09], t: 0.008, r: 0.024, pos: [0.69, 1.53, -0.345], finish: "print", map: `label:Comments|${c.cream}|${c.inky}|6.4` },
            ...row(3, [0, -0.155, 0], { k: "cyl", r: 0.045, h: 0.012, pos: [0.42, 1.38, -0.343], rot: FACE, color: c.lilac }),
            ...row(3, [0, -0.155, 0], { k: "slab", size: [0.46, 0.027], t: 0.013, r: 0.013, pos: [0.742, 1.402, -0.342], color: c.plum }),
            ...row(3, [0, -0.155, 0], { k: "slab", size: [0.34, 0.021], t: 0.009, r: 0.01, pos: [0.68, 1.353, -0.342], color: c.sand }),
            ...row(3, [0.23, 0, 0], { k: "slab", size: [0.15, 0.218], t: 0.017, r: 0.028, pos: [0.49, 0.765, -0.34], color: c.yellow }),
          ],
        },
        {
          id: "share",
          label: "Shareable post link",
          agent: 0,
          color: c.cream,
          shapes: [
            { k: "slab", size: [1.21, 0.39], t: 0.055, r: 0.08, pos: [-0.64, 0.133, 0.59], rot: flat(0.08), color: c.sand },
            { k: "slab", size: [1.03, 0.23], t: 0.011, r: 0.055, pos: [-0.64, 0.165, 0.59], rot: flat(0.08), finish: "print", map: `label:Copy video link|${c.cream}|${c.inky}|4.5` },
            { k: "slab", size: [0.52, 0.035], t: 0.024, r: 0.017, pos: [0.27, 0.127, 0.55], rot: flat(0.08), color: c.plum },
            { k: "slab", size: [0.33, 0.45], t: 0.073, r: 0.068, pos: [0.69, 0.143, 0.51], rot: flat(-0.18), color: c.plum },
            { k: "slab", size: [0.23, 0.31], t: 0.01, r: 0.05, pos: [0.69, 0.183, 0.51], rot: flat(-0.18), color: c.coral },
          ],
        },
        // An index-card cabinet: the "discoverable index" the restructure
        // builds, as the real thing. One drawer is out, its cards on show.
        surround("index", "Index cabinet", 1, c.plum, [-2.05, 0, -0.38], 0.35, [
          ...[[-0.26, -0.2], [0.26, -0.2], [-0.26, 0.2], [0.26, 0.2]].map(([x, z]): ShapeDef => (
            { k: "cyl", r: 0.028, h: 0.08, pos: [x, 0.04, z], color: c.inky, bevel: 0.01 })),
          { k: "box", size: [0.62, 1.06, 0.52], pos: [0, 0.6, 0], bevel: 0.02 },
          { k: "slab", size: [0.68, 0.58], t: 0.04, r: 0.04, pos: [0, 1.145, 0], rot: flat(), bevel: 0.012 },
          ...[0.27, 0.6, 0.93].flatMap((y, level) => [-0.15, 0.15].flatMap((x, side): ShapeDef[] => {
            const out = level === 2 && side === 1 ? 0.2 : 0;
            const z = 0.275 + out;
            return [
              { k: "box", size: [0.27, 0.29, 0.04], pos: [x, y, z], color: c.sand, bevel: 0.012 },
              { k: "slab", size: [0.1, 0.055], t: 0.006, r: 0.008, pos: [x, y + 0.06, z + 0.022], color: c.cream },
              { k: "cyl", r: 0.016, h: 0.1, pos: [x, y - 0.05, z + 0.03], rot: lying(), color: c.inky, bevel: 0.016 },
            ];
          })),
          // The open drawer's tray, and its cards standing on edge.
          { k: "box", size: [0.25, 0.2, 0.34], pos: [0.15, 0.91, 0.285], color: c.sand, bevel: 0.01 },
          ...[0.3, 0.325, 0.35, 0.375, 0.4, 0.425].map((z): ShapeDef => (
            { k: "slab", size: [0.21, 0.16], t: 0.006, r: 0.012, pos: [0.15, 1.03, z], color: c.cream })),
          { k: "slab", size: [0.05, 0.035], t: 0.014, r: 0.01, pos: [0.1, 1.118, 0.35], color: c.coral },
          { k: "slab", size: [0.05, 0.035], t: 0.014, r: 0.01, pos: [0.21, 1.118, 0.425], color: c.yellow },
        ]),
      ],
      callouts: [
        { n: "302", at: [-1.27, 1.82, -0.42], to: [-1.85, 2.14, -0.35] },
        { n: "304", at: [1.15, 1.26, -0.35], to: [1.9, 1.61, -0.15] },
        { n: "306", at: [0.81, 0.19, 0.65], to: [1.68, 0.28, 0.99] },
      ],
    }),
  ],
  [
    THEMES.rose,
    (c) => {
      const tablet = { pos: [0.06, 0.107, -0.39] as Vec3, rot: [-0.13, 0.17, 0] as Vec3 };
      const phone = { pos: [-0.96, 0.109, 0.48] as Vec3, rot: [-0.16, 0.27, 0] as Vec3 };
      return {
        id: "multi",
        fig: "FIG. 4",
        title: "TikTok Multi-Platform",
        desc: "An iPad experience that keeps videos, navigation and conversation in view.",
        href: "/work/tiktok-multi-platform",
        parts: [
          { id: "ground", label: "Ground", agent: 1, color: c.ground, shapes: plinth(c, [2.8, 2.2]) },
          {
            id: "tablet",
            label: "Landscape iPad",
            agent: 4,
            color: c.plum,
            frame: tablet,
            shapes: [
              { k: "slab", size: [2.12, 1.49], t: 0.09, r: 0.13, pos: [0, 0.752, 0] },
              { k: "slab", size: [2.0, 1.37], t: 0.016, r: 0.07, pos: [0, 0.752, 0.048], color: c.inky, finish: "soft" },
              { k: "slab", size: [0.64, 0.44], t: 0.11, r: 0.08, pos: [0.38, 0.05, -0.272], rot: flat(), color: c.sand },
              { k: "box", size: [0.57, 0.42, 0.17], pos: [0.38, 0.244, -0.218], rot: [-0.38, 0, 0], color: c.sand },
              ...row(2, [1.44, 0, 0], { k: "slab", size: [0.34, 0.255], t: 0.049, r: 0.058, pos: [-0.72, 0.019, 0.071], rot: flat(), color: c.sand }),
            ],
          },
          {
            id: "tablet-nav",
            label: "Side navigation",
            agent: 3,
            color: c.mist,
            frame: tablet,
            shapes: [
              { k: "slab", size: [0.206, 1.22], t: 0.029, r: 0.035, pos: [-0.839, 0.752, 0.068] },
              ...row(4, [0, -0.187, 0], { k: "cyl", r: 0.035, h: 0.01, rot: FACE, pos: [-0.84, 1.163, 0.087], color: c.plum }),
              { k: "slab", size: [0.123, 0.021], t: 0.01, r: 0.01, pos: [-0.839, 0.21, 0.085], color: c.plum },
            ],
          },
          {
            id: "tablet-content",
            label: "Video and comments side by side",
            agent: 2,
            color: c.coral,
            frame: tablet,
            shapes: [
              { k: "slab", size: [0.746, 1.22], t: 0.036, r: 0.048, pos: [-0.323, 0.752, 0.072] },
              { k: "cyl", r: 0.113, h: 0.015, pos: [-0.323, 0.8, 0.096], rot: FACE, color: c.cream },
              { k: "poly", pts: [[-0.033, -0.052], [0.057, 0], [-0.033, 0.052]], t: 0.01, r: 0.01, pos: [-0.323, 0.8, 0.106], color: c.plum },
              { k: "slab", size: [0.49, 0.031], t: 0.012, r: 0.015, pos: [-0.323, 0.24, 0.091], color: c.cream },
              { k: "slab", size: [0.82, 1.22], t: 0.03, r: 0.048, pos: [0.529, 0.752, 0.069], color: c.cream },
              { k: "slab", size: [0.48, 0.04], t: 0.009, r: 0.02, pos: [0.501, 1.239, 0.087], color: c.plum },
              ...row(3, [0, -0.215, 0], { k: "cyl", r: 0.043, h: 0.011, rot: FACE, pos: [0.251, 1.075, 0.09], color: c.lilac }),
              ...row(3, [0, -0.215, 0], { k: "slab", size: [0.429, 0.027], t: 0.011, r: 0.013, pos: [0.559, 1.104, 0.09], color: c.plum }),
              ...row(3, [0, -0.215, 0], { k: "slab", size: [0.303, 0.021], t: 0.009, r: 0.01, pos: [0.497, 1.048, 0.089], color: c.sand }),
              { k: "slab", size: [0.637, 0.097], t: 0.013, r: 0.048, pos: [0.532, 0.309, 0.09], color: c.lilac },
            ],
          },
          {
            id: "phone",
            label: "Single-column phone feed",
            agent: 0,
            color: c.plum,
            frame: phone,
            shapes: [
              { k: "slab", size: [0.475, 0.956], t: 0.076, r: 0.085, pos: [0, 0.484, 0] },
              { k: "slab", size: [0.396, 0.877], t: 0.012, r: 0.046, pos: [0, 0.484, 0.041], color: c.inky, finish: "soft" },
              { k: "slab", size: [0.344, 0.686], t: 0.015, r: 0.043, pos: [0, 0.551, 0.052], color: c.coral },
              { k: "poly", pts: [[-0.027, -0.034], [0.04, 0], [-0.027, 0.034]], t: 0.009, r: 0.009, pos: [0, 0.564, 0.066], color: c.cream },
              ...row(3, [0.115, 0, 0], { k: "cyl", r: 0.02, h: 0.009, rot: FACE, pos: [-0.115, 0.141, 0.055], color: c.mist }),
              { k: "box", size: [0.18, 0.25, 0.17], pos: [0, 0.117, -0.174], rot: [-0.23, 0, 0], color: c.sand },
            ],
          },
          // The keyboard and pencil that come with the iPad, in front of it.
          surround("keyboard", "Keyboard", 3, c.lilac, [0.34, 0.107, 0.5], 0, [
            { k: "slab", size: [1.2, 0.42], t: 0.034, r: 0.05, pos: [0, 0.014, 0], rot: flat(), bevel: 0.01 },
            ...[-0.13, -0.045, 0.04].flatMap((z) => row(10, [0.1, 0, 0], {
              k: "slab", size: [0.085, 0.07], t: 0.014, r: 0.014, pos: [-0.45, 0.035, z], rot: flat(), color: c.cream, bevel: 0.004 })),
            ...row(2, [0.1, 0, 0], { k: "slab", size: [0.085, 0.07], t: 0.014, r: 0.014, pos: [-0.45, 0.035, 0.125], rot: flat(), color: c.cream, bevel: 0.004 }),
            { k: "slab", size: [0.48, 0.07], t: 0.014, r: 0.02, pos: [0, 0.035, 0.125], rot: flat(), color: c.cream, bevel: 0.004 },
            ...row(2, [0.1, 0, 0], { k: "slab", size: [0.085, 0.07], t: 0.014, r: 0.014, pos: [0.35, 0.035, 0.125], rot: flat(), color: c.cream, bevel: 0.004 }),
            { k: "cyl", r: 0.02, h: 0.6, pos: [0.05, 0.017, 0.37], rot: lying(), color: c.white, bevel: 0.02 },
            { k: "ball", r: 0.013, pos: [-0.256, 0.017, 0.37], color: c.inky },
          ]),
          // A surprise: popcorn, for an evening of videos. One piece has escaped.
          surround("popcorn", "Popcorn", 4, c.cream, [1.12, 0.107, 0.62], 0, [
            { k: "cyl", r: 0.1, h: 0.2, pos: [0, 0.097, 0], bevel: 0.012 },
            ...[0, 1, 2, 3, 4, 5].map((i): ShapeDef => {
              const a = (i * Math.PI) / 3 + Math.PI / 6;
              return { k: "box", size: [0.03, 0.17, 0.012], pos: [Math.sin(a) * 0.1, 0.1, Math.cos(a) * 0.1], rot: [0, a, 0], color: c.coral, bevel: 0.005 };
            }),
            ...([[0, 0.232, 0, 0.035], [0.05, 0.212, 0.03, 0.03], [-0.05, 0.212, 0.02, 0.03], [0.02, 0.212, -0.05, 0.03], [-0.03, 0.218, -0.04, 0.03], [0.045, 0.248, -0.01, 0.025], [-0.02, 0.258, 0.025, 0.025]] as const).map(([x, y, z, r], i): ShapeDef => (
              { k: "ball", r, pos: [x, y, z], color: i % 3 === 2 ? c.yellow : c.white })),
            { k: "ball", r: 0.025, pos: [0.18, 0.022, 0.08], color: c.white },
          ]),
          // A floor lamp: an evening on the sofa, which is where the iPad gets used.
          surround("lamp", "Floor lamp", 1, c.plum, [1.78, 0, -1.3], 0, [
            { k: "cyl", r: 0.22, h: 0.04, pos: [0, 0.02, 0], bevel: 0.018 },
            { k: "cyl", r: 0.03, h: 1.8, pos: [0, 0.935, 0], bevel: 0.014 },
            { k: "cyl", r: 0.27, h: 0.34, pos: [0, 1.95, 0], color: c.cream, bevel: 0.02 },
            // The shade's wire rims.
            { k: "torus", R: 0.268, tube: 0.012, pos: [0, 1.79, 0], rot: flat() },
            { k: "torus", R: 0.268, tube: 0.012, pos: [0, 2.11, 0], rot: flat() },
          ]),
        ],
        callouts: [
          { n: "402", at: [-0.97, 1.42, -0.21], to: [-1.64, 1.81, -0.24] },
          { n: "404", at: [1.14, 1.04, -0.43], to: [1.91, 1.32, -0.25] },
          { n: "406", at: [-1.17, 0.56, 0.51], to: [-1.84, 0.56, 0.73] },
        ],
      };
    },
  ],
  [
    THEMES.blue,
    (c) => ({
      id: "ds",
      fig: "FIG. 5",
      title: "TikTok Design System",
      desc: "Reusable component variants, with adaptive layouts and shared motion rules.",
      presentation: { elevation: 0.70, scale: 1.11 },
      href: "/work/tiktok-design-system",
      parts: [
        {
          id: "tray",
          label: "Tray",
          agent: 1,
          color: c.ground,
          shapes: [
            ...plinth(c, [3, 2.1], 0.127),
            // Silk-screened nameplate.
            {
              k: "slab",
              size: [0.9, 0.1125],
              t: 0.006,
              r: 0.03,
              pos: [-0.82, 0.128, 0.84],
              rot: flat(),
              map: `label:TIKTOK DS · KIT 01|${LILAC}|${INKY}`,
              finish: "print",
            },
          ],
        },
        {
          id: "button",
          label: "Button variant family",
          agent: 4,
          color: CORAL,
          shapes: [
            { k: "slab", size: [1.21, 1.21], t: 0.056, r: 0.075, pos: [-0.754, 0.151, 0.168], rot: flat(), color: CREAM },
            ...[
              { label: "Default", z: -0.198, t: 0.107, surface: CORAL, ink: INKY },
              { label: "Pressed", z: 0.16, t: 0.075, surface: PLUM, ink: WHITE },
              { label: "Disabled", z: 0.517, t: 0.056, surface: LILAC, ink: INKY },
            ].flatMap(({ label, z, t, surface, ink }): ShapeDef[] => [
              { k: "slab", size: [0.93, 0.25], t, r: 0.125, pos: [-0.754, 0.177 + t / 2, z], rot: flat(), color: surface, finish: "soft", bevel: 0.014 },
              { k: "slab", size: [0.55, 0.1], t: 0.006, r: 0.026, pos: [-0.754, 0.179 + t, z], rot: flat(), finish: "print", map: `label:${label}|${surface}|${ink}|5.5` },
            ]),
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
        // A small-parts organiser beside the tray: the system's components,
        // one drawer each.
        surround("organiser", "Parts organiser", 1, c.lilac, [2.05, 0, -0.35], 0.25, [
          ...[[-0.26, -0.14], [0.26, -0.14], [-0.26, 0.14], [0.26, 0.14]].map(([x, z]): ShapeDef => (
            { k: "cyl", r: 0.025, h: 0.03, pos: [x, 0.015, z], color: c.inky, bevel: 0.01 })),
          { k: "box", size: [0.62, 0.9, 0.36], pos: [0, 0.47, 0], bevel: 0.02 },
          // Three columns by four rows on one grid: even margins, even gaps. Each
          // column holds one colour, like a token scale, so the face reads as order.
          ...[0.1494, 0.3631, 0.5769, 0.7906].flatMap((y) => [-0.1917, 0, 0.1917].flatMap((x, column): ShapeDef[] => [
            { k: "box", size: [0.1667, 0.1888, 0.03], pos: [x, y, 0.191], color: c.cream, bevel: 0.01 },
            { k: "slab", size: [0.08, 0.05], t: 0.008, r: 0.012, pos: [x, y + 0.025, 0.208], color: [c.plum, c.blue, c.coral][column] },
            { k: "box", size: [0.06, 0.016, 0.02], pos: [x, y - 0.055, 0.212], color: c.plum, bevel: 0.006 },
          ])),
        ]),
      ],
      callouts: [
        { n: "502", at: [-1.21, 0.25, 0.16], to: [-1.91, 0.38, 0.5] },
        { n: "504", at: [1.27, 0.22, -0.5], to: [1.2, 0.9, -1.35] },
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
      desc: "A new shareable code for TikTok profiles, sounds, hashtags and effects.",
      href: "/work/tiktok-tikcode",
      parts: [
        { id: "ground", label: "Ground", agent: 1, color: c.ground, shapes: plinth(c) },
        {
          id: "holder",
          label: "TikCode display stand",
          agent: 4,
          color: c.plum,
          frame: { pos: [-0.53, 0.107, -0.19], rot: [0, 0.14, 0] },
          shapes: [
            { k: "slab", size: [1.12, 0.47], t: 0.09, r: 0.11, pos: [0, 0.045, 0], rot: flat() },
            { k: "box", size: [0.43, 0.24, 0.14], pos: [0, 0.148, 0] },
            { k: "slab", size: [1.21, 1.36], t: 0.065, r: 0.11, pos: [0, 0.885, 0.045], color: c.coral },
          ],
        },
        {
          id: "code",
          label: "Raised Code Eyes and dots",
          agent: 2,
          color: c.cream,
          frame: { pos: [-0.53, 0.107, -0.19], rot: [0, 0.14, 0] },
          shapes: [
            { k: "slab", size: [1.085, 1.22], t: 0.025, r: 0.085, pos: [0, 0.885, 0.082] },
            ...tikCodeRelief(c, [0, 0.972, 0.0945], 0.097),
            { k: "slab", size: [0.51, 0.112], t: 0.006, r: 0.03, pos: [0, 0.398, 0.096], finish: "print", map: `label:TikCode|${c.cream}|${c.inky}|4.55` },
          ],
        },
        {
          id: "scanner",
          label: "Phone scan viewfinder",
          agent: 3,
          color: c.cream,
          frame: { pos: [0.81, 0.107, 0.38], rot: [-0.19, 0.20, 0] },
          shapes: [
            { k: "box", size: [0.26, 0.43, 0.22], pos: [0, 0.206, -0.19], rot: [-0.19, 0, 0], color: c.sand },
            { k: "slab", size: [0.62, 1.17], t: 0.079, r: 0.094, pos: [0, 0.596, 0] },
            { k: "slab", size: [0.516, 1.066], t: 0.012, r: 0.042, pos: [0, 0.596, 0.043],
              finish: "screen", map: `proc:scan-view|${c.inky}` },
            { k: "slab", size: [0.415, 0.47], t: 0.01, r: 0.048, pos: [0, 0.692, 0.052], color: c.plum },
            ...tikCodeRelief(c, [0, 0.692, 0.057], 0.0235),
            ...[-1, 1].flatMap((sx) => [-1, 1].map((sy): ShapeDef => ({
              k: "poly",
              pts: [[0, 0], [0.063, 0], [0.063, 0.01], [0.01, 0.01], [0.01, 0.063], [0, 0.063]]
                .map(([x, y]) => [-sx * x, -sy * y]),
              t: 0.005,
              r: 0.003,
              pos: [sx * 0.157, 0.692 + sy * 0.162, 0.059],
              color: c.white,
            }))),
            { k: "slab", size: [0.15, 0.013], t: 0.005, r: 0.006, pos: [0, 0.139, 0.05], color: c.lilac },
          ],
        },
        {
          id: "links",
          label: "Hashtag, sound and effect destinations",
          agent: 0,
          color: c.yellow,
          shapes: [
            ...["#", "♪", "✦"].flatMap((label, i): ShapeDef[] => {
              const x = -0.985 + i * 0.37;
              const background = [c.lilac, c.yellow, c.coral][i];
              return [
                { k: "slab", size: [0.30, 0.29], t: 0.057, r: 0.064, pos: [x, 0.134, 0.64], rot: flat(), color: background },
                { k: "slab", size: [0.167, 0.114], t: 0.006, r: 0.026, pos: [x, 0.165, 0.64], rot: flat(), finish: "print", map: `label:${label}|${background}|${c.inky}|1.46` },
              ];
            }),
          ],
        },
        // A speaker on its stand: sounds are one of the four things a TikCode
        // shares, and the figure has its codes already. A record leans on the stand.
        surround("speaker", "Speaker", 1, c.plum, [1.95, 0, -0.7], 0.15, [
          { k: "slab", size: [0.42, 0.36], t: 0.04, r: 0.05, pos: [0, 0.02, 0], rot: flat(), bevel: 0.012 },
          { k: "box", size: [0.12, 0.79, 0.12], pos: [0, 0.43, 0], bevel: 0.02 },
          { k: "slab", size: [0.4, 0.34], t: 0.035, r: 0.04, pos: [0, 0.8325, 0], rot: flat(), bevel: 0.01 },
          { k: "box", size: [0.46, 0.68, 0.4], pos: [0, 1.186, 0], color: c.lilac, bevel: 0.03 },
          // Woofer, tweeter and port on the front, and one small light.
          { k: "cyl", r: 0.12, h: 0.03, pos: [0, 1.08, 0.205], rot: FACE, color: c.inky, bevel: 0.008 },
          { k: "torus", R: 0.13, tube: 0.022, pos: [0, 1.08, 0.208] },
          { k: "ball", r: 0.035, pos: [0, 1.08, 0.218] },
          { k: "cyl", r: 0.06, h: 0.02, pos: [0, 1.37, 0.204], rot: FACE, color: c.inky, bevel: 0.006 },
          { k: "torus", R: 0.055, tube: 0.014, pos: [0, 1.37, 0.208] },
          { k: "ball", r: 0.032, pos: [0, 1.37, 0.207], color: c.cream },
          { k: "cyl", r: 0.03, h: 0.012, pos: [-0.14, 0.92, 0.202], rot: FACE, color: c.inky, bevel: 0.004 },
          { k: "cyl", r: 0.012, h: 0.008, pos: [0.16, 0.92, 0.202], rot: FACE, color: c.coral, finish: "led" },
          // The record in its sleeve, its foot on the stand's base, its top on the column.
          { k: "slab", size: [0.34, 0.34], t: 0.012, r: 0.012, pos: [0, 0.2065, 0.1], rot: [-0.2, 0, 0], color: c.cream },
          { k: "cyl", r: 0.12, h: 0.006, pos: [0, 0.2065 + 0.009 * Math.sin(0.2), 0.1 + 0.009 * Math.cos(0.2)], rot: [Math.PI / 2 - 0.2, 0, 0], color: c.inky },
          { k: "cyl", r: 0.04, h: 0.006, pos: [0, 0.2065 + 0.013 * Math.sin(0.2), 0.1 + 0.013 * Math.cos(0.2)], rot: [Math.PI / 2 - 0.2, 0, 0], color: c.coral },
        ]),
      ],
      callouts: [
        { n: "602", at: [-0.94, 1.48, -0.04], to: [-1.66, 1.83, 0.03] },
        { n: "604", at: [1.07, 1.0, 0.38], to: [1.82, 1.22, 0.54] },
        { n: "606", at: [-1.1, 0.18, 0.7], to: [-1.82, 0.27, 1.06] },
      ],
    }),
  ],
  [
    THEMES.mint,
    (c) => ({
      id: "wishlist",
      fig: "FIG. 7",
      title: "Airbnb Wishlist",
      desc: "Compare saved stays, share a shortlist and decide together where to book.",
      href: "/work/airbnb-wishlist",
      parts: [
        {
          id: "ground",
          label: "Ground",
          agent: 1,
          color: c.ground,
          shapes: [
            ...plinth(c, [2.95, 2.1]),
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
          label: "Destination cottage",
          agent: 4,
          color: CREAM,
          frame: { pos: [0.43, 0.041, -0.36], rot: [0, 0.05, 0], scale: 0.66 },
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
          label: "Destination garden",
          agent: 0,
          color: GREEN,
          shapes: [
            { k: "cyl", r: 0.034, h: 0.3, pos: [1.19, 0.257, -0.73], color: SAND },
            { k: "ball", r: 0.155, pos: [1.19, 0.47, -0.73] },
            { k: "ball", r: 0.073, pos: [0.45, 0.166, -0.38], color: LILAC },
            { k: "ball", r: 0.055, pos: [0.54, 0.145, -0.29] },
          ],
        },
        ...WISHLIST_STAYS.map((photo, index): PartDef => {
          const selected = index === 1;
          const trim = selected ? PLUM : LILAC;
          return {
            id: `stay-${index + 1}`,
            label: selected ? "Voted stay" : "Saved stay",
            agent: index + 2,
            color: CREAM,
            frame: {
              pos: selected ? [0.32, 0.107, 0.49] : [-0.67, 0.107, 0.34],
              rot: selected ? [-0.3, 0.14, 0] : [-0.24, 0.26, 0],
            },
            shapes: [
              { k: "box", size: [0.42, 0.23, 0.27], pos: [0, 0.1, -0.18], color: SAND },
              { k: "slab", size: [0.9, 1.03], t: 0.072, r: 0.108, pos: [0, 0.525, 0], color: trim },
              { k: "slab", size: [0.825, 0.95], t: 0.012, r: 0.07, pos: [0, 0.525, 0.041] },
              { k: "slab", size: [0.734, 0.508], t: 0.007, r: 0.042, pos: [0, 0.692, 0.049], finish: "print", map: photo },
              { k: "slab", size: [0.392, 0.044], t: 0.01, r: 0.022, pos: [-0.139, 0.355, 0.05], color: INKY },
              { k: "slab", size: [0.281, 0.026], t: 0.01, r: 0.013, pos: [-0.193, 0.284, 0.05], color: LILAC },
              { k: "slab", size: [0.27, 0.129], t: 0.016, r: 0.054, pos: [0.186, 0.17, 0.056], finish: "print",
                map: `label:${selected ? "Voted" : "Saved"}|${selected ? PLUM : MIST}|${selected ? WHITE : INKY}|2.1` },
            ],
          };
        }),
        {
          id: "shared",
          label: "Shared shortlist",
          agent: 4,
          color: PLUM,
          shapes: [
            { k: "slab", size: [0.98, 0.19], t: 0.041, r: 0.077, pos: [-0.43, 0.126, 0.84], rot: flat() },
            { k: "slab", size: [0.63, 0.116], t: 0.006, r: 0.025, pos: [-0.43, 0.149, 0.84], rot: flat(), finish: "print", map: `label:Shared shortlist|${PLUM}|${WHITE}|5.4` },
            { k: "ball", r: 0.07, pos: [0.32, 0.174, 0.83], color: CORAL },
            { k: "ball", r: 0.055, pos: [0.43, 0.16, 0.85], color: LILAC },
          ],
        },
        // Packed and waiting: the trip the shortlist is deciding.
        surround("suitcase", "Suitcase", 0, c.lilac, [-2.0, 0, -0.5], 0.3, [
          { k: "box", size: [0.6, 0.86, 0.3], pos: [0, 0.51, 0], bevel: 0.05 },
          ...[[-0.22, -0.1], [0.22, -0.1], [-0.22, 0.1], [0.22, 0.1]].flatMap(([x, z]): ShapeDef[] => [
            { k: "cyl", r: 0.038, h: 0.03, pos: [x, 0.038, z], rot: lying(), color: c.inky, bevel: 0.01 },
            { k: "box", size: [0.07, 0.06, 0.07], pos: [x, 0.085, z], color: c.plum, bevel: 0.015 },
          ]),
          // Ribs centred on the front; the tag hangs on the side, out of their way.
          ...[-0.15, 0, 0.15].map((x): ShapeDef => (
            { k: "slab", size: [0.035, 0.74], t: 0.02, r: 0.017, pos: [x, 0.51, 0.156], bevel: 0.008 })),
          ...[-0.15, 0.15].map((x): ShapeDef => (
            { k: "cyl", r: 0.015, h: 0.52, pos: [x, 1.19, -0.09], color: c.inky, bevel: 0.006 })),
          { k: "box", size: [0.36, 0.05, 0.06], pos: [0, 1.46, -0.09], color: c.plum, bevel: 0.02 },
          { k: "box", size: [0.2, 0.035, 0.05], pos: [0, 0.955, 0.05], color: c.plum, bevel: 0.015 },
          { k: "slab", size: [0.11, 0.15], t: 0.012, r: 0.02, pos: [0.304, 0.74, 0], rot: [0, Math.PI / 2, 0], color: c.coral },
          { k: "slab", size: [0.07, 0.05], t: 0.006, r: 0.01, pos: [0.312, 0.76, 0], rot: [0, Math.PI / 2, 0], color: c.white },
        ]),
        surround("carry-on", "Carry-on", 1, c.sand, [-1.97, 0, 0.22], 0.15, [
          { k: "box", size: [0.44, 0.6, 0.24], pos: [0, 0.37, 0], bevel: 0.045 },
          ...[[-0.16, -0.08], [0.16, -0.08], [-0.16, 0.08], [0.16, 0.08]].flatMap(([x, z]): ShapeDef[] => [
            { k: "cyl", r: 0.032, h: 0.026, pos: [x, 0.032, z], rot: lying(), color: c.inky, bevel: 0.008 },
            { k: "box", size: [0.06, 0.05, 0.06], pos: [x, 0.07, z], color: c.plum, bevel: 0.012 },
          ]),
          ...[-0.08, 0.08].map((x): ShapeDef => (
            { k: "slab", size: [0.03, 0.5], t: 0.016, r: 0.014, pos: [x, 0.37, 0.125], bevel: 0.006 })),
          { k: "box", size: [0.16, 0.03, 0.045], pos: [0, 0.68, 0], color: c.plum, bevel: 0.012 },
        ]),
        // A surprise: a sun hat, put down by the luggage.
        surround("sun-hat", "Sun hat", 2, c.sand, [-1.95, 0, 0.74], 0, [
          { k: "cyl", r: 0.22, h: 0.016, pos: [0, 0.008, 0], bevel: 0.008 },
          { k: "cyl", r: 0.105, h: 0.1, pos: [0, 0.063, 0], bevel: 0.045 },
          { k: "cyl", r: 0.11, h: 0.026, pos: [0, 0.03, 0], color: c.coral, bevel: 0.004 },
        ]),
      ],
      callouts: [
        { n: "702", at: [-1.05, 0.98, 0.24], to: [-0.75, 2.0, -0.35] },
        { n: "704", at: [1.02, 0.86, -0.54], to: [1.77, 1.3, -0.36] },
        { n: "706", at: [0.7, 0.45, 0.59], to: [1.66, 0.5, 0.94] },
      ],
    }),
  ],
  [
    THEMES.mono,
    (c) => {
      const camera = { pos: [-0.43, 0.107, -0.22] as Vec3, rot: [-0.19, 0.22, 0] as Vec3 };
      return {
        id: "effects",
        fig: "FIG. 8",
        title: "TikTok Effect House",
        desc: "An AR effect creation tool for TikTok creators.",
        status: SOON,
        parts: [
          { id: "ground", label: "Ground", agent: 1, color: c.ground, shapes: plinth(c, [2.9, 1.9]) },
          {
            id: "phone",
            label: "AR preview",
            agent: 4,
            color: c.coral,
            frame: camera,
            shapes: [
              { k: "box", size: [0.35, 0.48, 0.29], pos: [0, 0.24, -0.22], rot: [-0.18, 0, 0], color: c.sand },
              { k: "slab", size: [0.83, 1.55], t: 0.084, r: 0.12, pos: [0, 0.79, 0] },
              { k: "slab", size: [0.732, 1.45], t: 0.012, r: 0.071, pos: [0, 0.79, 0.044], color: c.inky, finish: "soft" },
              { k: "slab", size: [0.635, 1.06], t: 0.013, r: 0.058, pos: [0, 0.87, 0.053], color: c.cream },
              { k: "cyl", r: 0.057, h: 0.015, pos: [0, 0.214, 0.056], rot: FACE, color: c.white, finish: "soft" },
            ],
          },
          {
            id: "effect-preview",
            label: "Face effect in the viewfinder",
            agent: 2,
            color: c.coral,
            frame: camera,
            shapes: [
              { k: "slab", size: [0.429, 0.199], t: 0.02, r: 0.085, pos: [0, 0.631, 0.066], color: c.lilac },
              { k: "slab", size: [0.386, 0.402], t: 0.024, r: 0.183, pos: [0, 0.92, 0.073] },
              { k: "poly", pts: [[-0.142, -0.053], [0, 0.13], [0.142, -0.053]], t: 0.023, r: 0.012, pos: [-0.139, 1.111, 0.075], color: c.plum },
              { k: "poly", pts: [[-0.142, -0.053], [0, 0.13], [0.142, -0.053]], t: 0.023, r: 0.012, pos: [0.139, 1.111, 0.075], color: c.plum },
              ...row(2, [0.149, 0, 0], { k: "cyl", r: 0.029, h: 0.012, pos: [-0.0745, 0.942, 0.09], rot: FACE, color: c.inky }),
              { k: "cyl", r: 0.026, h: 0.013, pos: [0, 0.871, 0.092], rot: FACE, color: c.white },
            ],
          },
          {
            id: "materials",
            label: "Effect assets",
            agent: 3,
            color: c.sand,
            shapes: [
              { k: "slab", size: [1.04, 0.91], t: 0.06, r: 0.113, pos: [0.76, 0.137, 0.38], rot: flat() },
              { k: "slab", size: [0.42, 0.62], t: 0.036, r: 0.092, pos: [0.525, 0.181, 0.32], rot: flat(), color: c.plum },
              { k: "slab", size: [0.406, 0.62], t: 0.043, r: 0.099, pos: [0.98, 0.183, 0.32], rot: flat(), color: c.cream },
              { k: "poly", pts: heart(0.271), t: 0.04, r: 0.02, pos: [0.98, 0.22, 0.28], rot: flat(), color: c.coral },
              { k: "poly", pts: [[-0.132, -0.049], [0, 0.145], [0.132, -0.049]], t: 0.034, r: 0.02, pos: [0.524, 0.215, 0.228], rot: flat(), color: c.cream },
              { k: "slab", size: [0.26, 0.079], t: 0.007, r: 0.016, pos: [0.525, 0.2, 0.511], rot: flat(), finish: "print", map: `label:Mask|${c.plum}|${c.white}|3.3` },
              { k: "slab", size: [0.278, 0.079], t: 0.007, r: 0.016, pos: [0.98, 0.206, 0.511], rot: flat(), finish: "print", map: `label:Sticker|${c.cream}|${c.inky}|3.5` },
            ],
          },
          {
            id: "sparkles",
            label: "Effect markers",
            agent: 0,
            color: c.coral,
            shapes: [
              { k: "poly", pts: sparkle(0.145), t: 0.045, bevel: 0.012, pos: [0.346, 1.282, -0.06], rot: [0, 0.3, 0] },
              { k: "poly", pts: sparkle(0.077), t: 0.039, bevel: 0.01, pos: [-0.947, 1.354, -0.12], rot: [0, 0.28, 0], color: c.yellow },
            ],
          },
          // A ring light on its tripod, beside the phone: how creators
          // light the face an effect goes on.
          surround("ring-light", "Ring light", 1, c.lilac, [-1.95, 0, -0.42], 0.55, [
            { k: "cyl", r: 0.022, h: 0.528, pos: [0, 0.21, 0.16], rot: [-0.651, 0, 0], bevel: 0.01 },
            { k: "cyl", r: 0.022, h: 0.528, pos: [0.1386, 0.21, -0.08], rot: [0.364, 0, 0.553], bevel: 0.01 },
            { k: "cyl", r: 0.022, h: 0.528, pos: [-0.1386, 0.21, -0.08], rot: [0.364, 0, -0.553], bevel: 0.01 },
            ...[[0, 0.32], [0.277, -0.16], [-0.277, -0.16]].map(([x, z]): ShapeDef => (
              { k: "ball", r: 0.03, pos: [x, 0.028, z], color: c.plum })),
            { k: "cyl", r: 0.05, h: 0.1, pos: [0, 0.42, 0], color: c.plum, bevel: 0.02 },
            { k: "cyl", r: 0.03, h: 0.92, pos: [0, 0.85, 0], bevel: 0.014 },
            { k: "box", size: [0.08, 0.12, 0.07], pos: [0, 1.33, 0], color: c.plum, bevel: 0.02 },
            { k: "torus", R: 0.36, tube: 0.06, pos: [0, 1.74, 0] },
            { k: "torus", R: 0.36, tube: 0.04, pos: [0, 1.74, 0.03], color: c.cream, finish: "led" },
            // A surprise: the ring light wears the effect on the phone — a cat-ear
            // headband clipped over its top.
            { k: "arch", span: 0.504, rise: 0.0796, tube: 0.016, pos: [0, 2.1, 0], color: c.plum },
            ...[-1, 1].map((side): ShapeDef => (
              { k: "poly", pts: [[-0.07, 0], [0.07, 0], [0, 0.15]], t: 0.03, r: 0.02, pos: [side * 0.241, 2.064, 0], rot: [0, 0, -side * 0.61], color: c.plum })),
            ...[-1, 1].map((side): ShapeDef => (
              { k: "poly", pts: [[-0.038, 0], [0.038, 0], [0, 0.085]], t: 0.01, r: 0.012, pos: [side * (0.241 + 0.014), 2.084, 0.019], rot: [0, 0, -side * 0.61], color: c.coral })),
          ]),
        ],
        callouts: [
          { n: "802", at: [-0.76, 1.62, -0.24], to: [-0.35, 2.35, -0.5] },
          { n: "804", at: [1.08, 0.27, 0.61], to: [1.81, 0.49, 0.99] },
          { n: "806", at: [0.43, 1.31, -0.06], to: [1.22, 1.56, 0.07] },
        ],
      };
    },
  ],
  [
    THEMES.mono,
    (c) => ({
      id: "hostpromo",
      fig: "FIG. 9",
      title: "Airbnb Host Promotion",
      desc: "Campaign tools to attract and allocate traffic to listings from hosts in China.",
      status: SOON,
      parts: [
        { id: "ground", label: "Ground", agent: 1, color: c.ground, shapes: plinth(c, [2.85, 2]) },
        {
          id: "listing",
          label: "Promoted listing",
          agent: 4,
          color: c.cream,
          shapes: [
            { k: "box", size: [0.8, 0.5, 0.62], pos: [-0.4, 0.357, -0.36] },
            { k: "poly", pts: [[-0.4, 0], [0.4, 0], [0, 0.32]], t: 0.62, bevel: 0.012, pos: [-0.4, 0.6, -0.36] },
            { k: "box", size: [0.55, 0.048, 0.774], pos: [-0.184, 0.782, -0.36], rot: [0, 0, -0.6747], color: c.coral, bevel: 0.012 },
            { k: "box", size: [0.55, 0.048, 0.774], pos: [-0.616, 0.782, -0.36], rot: [0, 0, 0.6747], color: c.coral, bevel: 0.012 },
            { k: "slab", size: [0.185, 0.30], t: 0.028, r: 0.09, pos: [-0.539, 0.247, -0.034], color: c.plum },
            { k: "torus", R: 0.079, tube: 0.018, pos: [-0.237, 0.404, -0.036], color: c.white },
            { k: "cyl", r: 0.07, h: 0.012, rot: FACE, pos: [-0.237, 0.404, -0.032], color: c.lilac },
          ],
        },
        {
          id: "campaign",
          label: "Host campaign card",
          agent: 2,
          color: c.plum,
          frame: { pos: [-0.63, 0.107, 0.58], rot: [-0.42, 0.16, 0] },
          shapes: [
            { k: "box", size: [0.6, 0.19, 0.25], pos: [0, 0.092, -0.115], color: c.lilac },
            { k: "slab", size: [1.05, 0.62], t: 0.075, r: 0.093, pos: [0, 0.311, 0] },
            { k: "slab", size: [0.94, 0.51], t: 0.015, r: 0.058, pos: [0, 0.311, 0.041], color: c.cream },
            { k: "slab", size: [0.67, 0.105], t: 0.007, r: 0.022, pos: [0, 0.437, 0.052], finish: "print", map: `label:Host campaign|${c.cream}|${c.inky}|6.4` },
            { k: "slab", size: [0.58, 0.052], t: 0.013, r: 0.025, pos: [-0.067, 0.299, 0.054], color: c.coral },
            { k: "slab", size: [0.40, 0.045], t: 0.011, r: 0.021, pos: [-0.156, 0.196, 0.054], color: c.lilac },
          ],
        },
        {
          id: "exposure",
          label: "Listing exposure",
          agent: 3,
          color: c.lilac,
          shapes: [
            { k: "slab", size: [1.05, 0.53], t: 0.046, r: 0.078, pos: [0.78, 0.13, -0.29], rot: flat() },
            { k: "box", size: [0.19, 0.32, 0.25], pos: [0.466, 0.311, -0.29], color: c.cream },
            { k: "box", size: [0.19, 0.55, 0.25], pos: [0.773, 0.426, -0.29], color: c.yellow },
            { k: "box", size: [0.19, 0.81, 0.25], pos: [1.075, 0.556, -0.29], color: c.coral },
            { k: "slab", size: [0.65, 0.128], t: 0.016, r: 0.025, pos: [0.782, 0.114, 0.1], rot: flat(), finish: "print", map: `label:Listing exposure|${c.mist}|${c.inky}|5.1` },
          ],
        },
        {
          id: "traffic",
          label: "Traffic directed to a listing",
          agent: 0,
          color: c.coral,
          shapes: [
            { k: "slab", size: [0.91, 0.28], t: 0.047, r: 0.095, pos: [0.63, 0.13, 0.63], rot: flat(-0.34), color: c.sand },
            ...row(3, [0.208, 0, -0.074], { k: "poly", pts: [[-0.069, -0.064], [0.03, 0], [-0.069, 0.064], [-0.027, 0]], t: 0.024, r: 0.009, pos: [0.455, 0.162, 0.7], rot: flat(0.34) }),
          ],
        },
        // A roll-up banner: the campaign, promoted.
        surround("banner", "Roll-up banner", 1, c.cream, [2.03, 0, -0.55], 0.12, [
          ...[-0.34, 0.34].map((x): ShapeDef => (
            { k: "box", size: [0.06, 0.024, 0.3], pos: [x, 0.012, 0], color: c.lilac, bevel: 0.01 })),
          { k: "box", size: [0.86, 0.1, 0.2], pos: [0, 0.072, 0], color: c.lilac, bevel: 0.035 },
          { k: "slab", size: [0.8, 1.6], t: 0.014, r: 0.012, pos: [0, 0.912, 0], bevel: 0.005 },
          { k: "cyl", r: 0.014, h: 1.6, pos: [0, 0.912, -0.04], color: c.plum, bevel: 0.006 },
          { k: "cyl", r: 0.022, h: 0.84, pos: [0, 1.712, 0], rot: lying(), color: c.lilac, bevel: 0.022 },
          // The print, all one matte finish, on a centred grid with even gaps: the
          // title printed on its band, the listing's house in a tile, its exposure
          // rising on a baseline, and a footer band.
          { k: "slab", size: [0.78, 0.17], t: 0.006, r: 0.008, pos: [0, 1.617, 0.009], finish: "print", map: `label:Host campaign|${c.plum}|${c.white}|4.6` },
          { k: "slab", size: [0.48, 0.48], t: 0.006, r: 0.075, pos: [0, 1.145, 0.009], color: c.sand, finish: "print" },
          { k: "poly", pts: [[-0.14, 0], [0.14, 0], [0.14, 0.16], [0, 0.27], [-0.14, 0.16]], t: 0.012, r: 0.016, pos: [0, 1.01, 0.016], color: c.plum, finish: "print", bevel: 0.004 },
          { k: "slab", size: [0.065, 0.1], t: 0.006, r: 0.013, pos: [0, 1.064, 0.024], color: c.sand, finish: "print" },
          { k: "slab", size: [0.36, 0.012], t: 0.006, r: 0.006, pos: [0, 0.452, 0.009], color: c.lilac, finish: "print" },
          ...[[-0.125, 0.13, c.coral], [0, 0.21, c.coral], [0.125, 0.3, c.plum]].map(([x, h, color]): ShapeDef => (
            { k: "box", size: [0.085, (h as number) + 0.004, 0.012], pos: [x as number, 0.454 + ((h as number) + 0.004) / 2, 0.012], color: color as string, finish: "print", bevel: 0.004 })),
          { k: "slab", size: [0.78, 0.16], t: 0.006, r: 0.008, pos: [0, 0.219, 0.009], color: c.lilac, finish: "print" },
        ]),
      ],
      callouts: [
        { n: "902", at: [1.08, 0.92, -0.31], to: [0.3, 1.55, -0.5] },
        { n: "904", at: [-0.79, 0.66, -0.28], to: [-1.6, 1.06, -0.12] },
        { n: "906", at: [-0.3, 0.52, 0.46], to: [0.18, 0.36, 1.17] },
      ],
    }),
  ],
  [
    THEMES.mono,
    (c) => ({
      id: "dls",
      fig: "FIG. 10",
      title: "Airbnb DLS19 for China",
      desc: "A localized component library for the China design team.",
      status: SOON,
      parts: [
        { id: "ground", label: "Ground", agent: 1, color: c.ground, shapes: plinth(c) },
        {
          id: "shelf",
          label: "Library mounting board",
          agent: 4,
          color: c.cream,
          shapes: [
            { k: "slab", size: [2.39, 1.43], t: 0.104, r: 0.092, pos: [0, 0.87, -0.49] },
            { k: "slab", size: [2.32, 0.39], t: 0.076, r: 0.115, pos: [0, 0.142, -0.35], rot: flat(), color: c.coral },
            { k: "slab", size: [2.24, 0.295], t: 0.051, r: 0.075, pos: [0, 0.577, -0.32], rot: flat(), color: c.coral },
            { k: "slab", size: [0.048, 0.872], t: 0.012, r: 0.023, pos: [0, 0.969, -0.433], color: c.lilac },
          ],
        },
        ...[false, true].map((localized, i): PartDef => {
          const x = i === 0 ? -0.576 : 0.576;
          const header = localized ? "China" : "Core";
          const background = localized ? c.yellow : c.lilac;
          return {
            id: `library-${header.toLowerCase()}`,
            label: `${header} component set`,
            agent: i + 2,
            color: background,
            shapes: [
              { k: "slab", size: [0.81, 0.17], t: 0.026, r: 0.045, pos: [x, 1.39, -0.423], finish: "print", map: `label:${header}|${background}|${c.inky}|4.8` },
              { k: "slab", size: [0.935, 0.565], t: 0.083, r: 0.066, pos: [x, 0.885, -0.41] },
              { k: "slab", size: [0.721, 0.13], t: 0.03, r: 0.038, pos: [x, 1.034, -0.356], color: c.cream },
              { k: "slab", size: [localized ? 0.49 : 0.60, 0.029], t: 0.014, r: 0.014, pos: [x, 0.909, -0.361], color: c.coral },
              { k: "slab", size: [0.63, 0.145], t: 0.048, r: 0.064, pos: [x, 0.747, -0.348], color: localized ? c.coral : c.plum },
              { k: "slab", size: [0.33, 0.03], t: 0.009, r: 0.014, pos: [x, 0.747, -0.32], color: c.cream },
              { k: "slab", size: [0.72, 0.19], t: 0.059, r: 0.082, pos: [x, 0.272, -0.335], color: c.coral },
              { k: "slab", size: [localized ? 0.45 : 0.33, 0.034], t: 0.013, r: 0.016, pos: [x, 0.273, -0.297], color: c.cream },
            ],
          };
        }),
        {
          id: "tools",
          label: "Shared layout spec",
          agent: 0,
          color: c.yellow,
          shapes: [
            { k: "slab", size: [1.27, 0.38], t: 0.045, r: 0.052, pos: [-0.52, 0.13, 0.56], rot: flat(), color: c.coral },
            { k: "slab", size: [1.016, 0.16], t: 0.007, r: 0.027, pos: [-0.52, 0.155, 0.49], rot: flat(), finish: "print", map: `label:DLS19 · CHINA|${c.coral}|${c.white}` },
            ...row(6, [0.17, 0, 0], { k: "slab", size: [0.018, 0.072], t: 0.006, r: 0.007, pos: [-0.945, 0.155, 0.672], rot: flat(), color: c.cream }),
            { k: "slab", size: [0.64, 0.182], t: 0.039, r: 0.06, pos: [0.698, 0.126, 0.55], rot: flat(), color: c.lilac },
            { k: "slab", size: [0.37, 0.041], t: 0.011, r: 0.019, pos: [0.698, 0.148, 0.55], rot: flat(), color: c.plum },
          ],
        },
        // Two type blocks: the library's Latin and Chinese type.
        surround("type-blocks", "Type blocks", 1, c.sand, [2.0, 0, 0.15], 0.2, [
          { k: "box", size: [0.62, 0.62, 0.62], pos: [0, 0.31, 0], bevel: 0.04 },
          { k: "slab", size: [0.48, 0.48], t: 0.008, r: 0.034, pos: [0, 0.31, 0.312], finish: "print", map: `label:文|${c.cream}|${c.inky}|1` },
          { k: "slab", size: [0.48, 0.48], t: 0.008, r: 0.034, pos: [0.312, 0.31, 0], rot: [0, Math.PI / 2, 0], finish: "print", map: `label:字|${c.cream}|${c.inky}|1` },
          { k: "box", size: [0.48, 0.48, 0.48], pos: [-0.03, 0.857, 0], rot: [0, 0.4, 0], color: c.lilac, bevel: 0.034 },
          { k: "slab", size: [0.36, 0.36], t: 0.008, r: 0.026, pos: [-0.03 + 0.242 * Math.sin(0.4), 0.857, 0.242 * Math.cos(0.4)], rot: [0, 0.4, 0], finish: "print", map: `label:Aa|${c.cream}|${c.inky}|1` },
        ]),
      ],
      callouts: [
        { n: "1002", at: [1.0, 1.41, -0.38], to: [1.8, 1.72, -0.28] },
        { n: "1004", at: [0.87, 0.18, 0.68], to: [1.3, 0.3, 1.25] },
        { n: "1006", at: [-1.02, 0.9, -0.34], to: [-1.77, 1.18, -0.21] },
      ],
    }),
  ],
  [
    THEMES.mono,
    (c) => ({
      id: "supply",
      fig: "FIG. 11",
      title: "Airbnb Supply Tool",
      desc: "A workspace for the China supply team to track listings and their performance.",
      status: SOON,
      parts: [
        { id: "ground", label: "Ground", agent: 1, color: c.ground, shapes: plinth(c, [2.8, 2]) },
        {
          id: "monitor",
          label: "Listing workspace",
          agent: 4,
          color: c.coral,
          shapes: [
            { k: "slab", size: [1.03, 0.405], t: 0.068, r: 0.095, pos: [0, 0.14, -0.36], rot: flat() },
            { k: "box", size: [0.16, 0.306, 0.115], pos: [0, 0.315, -0.45] },
            { k: "slab", size: [2.34, 1.37], t: 0.108, r: 0.105, pos: [0, 1.135, -0.46] },
            { k: "slab", size: [2.196, 1.226], t: 0.014, r: 0.054, pos: [0, 1.135, -0.402], color: c.cream },
          ],
        },
        {
          id: "data",
          label: "Selected listing",
          agent: 3,
          color: c.lilac,
          shapes: [
            { k: "slab", size: [0.76, 0.113], t: 0.006, r: 0.028, pos: [-0.575, 1.609, -0.393], finish: "print", map: `label:Listings|${c.cream}|${c.inky}` },
            ...row(3, [0, -0.236, 0], { k: "slab", size: [0.938, 0.146], t: 0.014, r: 0.038, pos: [-0.555, 1.384, -0.39] }),
            ...row(2, [0, -0.472, 0], { k: "slab", size: [0.18, 0.072], t: 0.009, r: 0.022, pos: [-0.884, 1.384, -0.38], color: c.coral }),
            { k: "slab", size: [0.932, 0.14], t: 0.024, r: 0.037, pos: [-0.555, 1.149, -0.38], color: c.plum },
            { k: "slab", size: [0.728, 0.093], t: 0.008, r: 0.024, pos: [-0.56, 1.148, -0.365], finish: "print", map: `label:Listing 02|${c.plum}|${c.white}` },
          ],
        },
        {
          id: "performance",
          label: "Selected listing performance",
          agent: 0,
          color: c.sand,
          shapes: [
            { k: "slab", size: [0.99, 0.996], t: 0.04, r: 0.058, pos: [0.528, 1.13, -0.383] },
            { k: "slab", size: [0.709, 0.112], t: 0.008, r: 0.026, pos: [0.524, 1.508, -0.359], finish: "print", map: `label:Performance · 02|${c.sand}|${c.inky}|6.3` },
            { k: "slab", size: [0.704, 0.026], t: 0.006, r: 0.011, pos: [0.521, 0.847, -0.359], color: c.coral },
            ...[0.16, 0.27, 0.229, 0.368].map((height, i): ShapeDef => ({
              k: "slab",
              size: [0.1, height],
              t: 0.017,
              r: 0.021,
              pos: [0.277 + i * 0.167, 0.883 + height / 2, -0.352],
              color: i === 3 ? c.plum : c.coral,
            })),
          ],
        },
        {
          id: "cards",
          label: "Matching listing record",
          agent: 2,
          color: c.cream,
          shapes: [
            { k: "slab", size: [1.06, 0.56], t: 0.075, r: 0.077, pos: [0.512, 0.144, 0.56], rot: flat(-0.09), color: c.plum },
            { k: "slab", size: [0.87, 0.158], t: 0.006, r: 0.029, pos: [0.512, 0.185, 0.45], rot: flat(-0.09), finish: "print", map: `label:Listing 02|${c.plum}|${c.white}` },
            { k: "slab", size: [0.35, 0.043], t: 0.012, r: 0.021, pos: [0.422, 0.187, 0.669], rot: flat(-0.09), color: c.lilac },
            { k: "slab", size: [0.58, 0.38], t: 0.05, r: 0.056, pos: [-0.775, 0.132, 0.421], rot: flat(0.13), color: c.sand },
            { k: "slab", size: [0.38, 0.08], t: 0.012, r: 0.029, pos: [-0.774, 0.16, 0.386], rot: flat(0.13), color: c.coral },
          ],
        },
        // A pinboard: listings being tracked by hand beside the dashboard.
        surround("pinboard", "Pinboard", 1, c.lilac, [-2.0, 0, -0.4], 0.45, [
          ...[-0.3, 0.3].flatMap((x): ShapeDef[] => [
            { k: "box", size: [0.06, 1.66, 0.06], pos: [x, 0.85, 0], bevel: 0.016 },
            { k: "box", size: [0.07, 0.05, 0.36], pos: [x, 0.025, 0], bevel: 0.016 },
          ]),
          { k: "slab", size: [0.7, 0.8], t: 0.05, r: 0.04, pos: [0, 1.23, 0.051], bevel: 0.014 },
          { k: "slab", size: [0.62, 0.72], t: 0.012, r: 0.03, pos: [0, 1.23, 0.08], color: c.sand },
          // A two-by-two grid with even margins: three listing cards and a note.
          ...([[-0.14, 1.393, c.white], [0.14, 1.393, c.cream], [-0.14, 1.067, c.white]] as const).flatMap(([x, y, paper]): ShapeDef[] => [
            { k: "slab", size: [0.22, 0.26], t: 0.006, r: 0.014, pos: [x, y, 0.088], color: paper },
            { k: "slab", size: [0.17, 0.09], t: 0.008, r: 0.01, pos: [x, y + 0.055, 0.094], color: c.lilac },
            { k: "slab", size: [0.17, 0.018], t: 0.008, r: 0.009, pos: [x, y - 0.035, 0.094], color: c.lilac },
            { k: "slab", size: [0.11, 0.018], t: 0.008, r: 0.009, pos: [x - 0.03, y - 0.07, 0.094], color: c.lilac },
            { k: "ball", r: 0.02, pos: [x, y + 0.115, 0.1], color: c.coral },
          ]),
          { k: "slab", size: [0.18, 0.18], t: 0.006, r: 0.012, pos: [0.14, 1.067, 0.088], color: c.yellow },
          { k: "ball", r: 0.02, pos: [0.14, 1.137, 0.1], color: c.coral },
        ]),
      ],
      callouts: [
        { n: "1102", at: [0.99, 1.49, -0.36], to: [1.78, 1.79, -0.23] },
        { n: "1104", at: [0.94, 0.21, 0.67], to: [1.72, 0.43, 0.96] },
        { n: "1106", at: [-1.06, 1.15, -0.36], to: [-0.6, 2.25, -0.75] },
      ],
    }),
  ],
];

export const FIGURES: FigureDef[] = BUILDERS.map(([palette, build]) => {
  use(palette);
  return { ...build(palette), palette };
});
