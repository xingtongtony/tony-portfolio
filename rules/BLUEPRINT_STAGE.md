# Blueprint Stage — 3D rules

The homepage's first screen from `lg` up: four patent-style line drawings that
sticker "agents" build into small clay dioramas, one per case study. Code lives
in `app/components/blueprint/`. Phones and tablets keep the sticker hero and
never download three.js.

Read this before touching anything in that folder. For the step-by-step of
adding or restyling a figure, use the `blueprint-figure` skill
(`.claude/skills/blueprint-figure/SKILL.md`).

## 1. What it must stay

- **Real work only.** Every figure is a case study that already has a page on
  the site and links to it. Never add a figure, chip or placeholder for work
  that is not published (this was done once with "Agent products" and removed).
- **One concept.** Drawing → object. Each solid exists as a line drawing and as
  a clay object; a per-part height uniform sweeps one into the other. Do not
  add a second mechanic.
- **Desktop only.** Mounted from `lg` (1024px). Below that the hero is the page.
- **Choreographed, and said so.** The agents follow a schedule in
  `blueprint-stage.tsx`; no model is called. Do not describe it as live AI.

## 2. Art direction (Tony's brief, Nov 2026)

Reference: soft matte clay renders — toy-block worlds, rounded forms, a single
harmonious palette, big soft light. In his words: likes the roundness and the
colour harmony; dislikes sharp shapes, hard shadows, sparse detail, and anything
that looks rough.

| Rule | In practice |
| --- | --- |
| Flat faces, tight bevels | A solid is flat planes with a small bevel (the default, about 0.02) that catches a line of light — not a big fillet on everything, which reads as an inflated blob and hides the three tones of top, front and side. Nothing is razor-sharp either; hairline plates (< 0.02) are the only unbevelled things. Round things (balls, capsules, rings) are round because the object is, not because the edge was softened. |
| Harmony over realism | Colour comes from the figure's palette roles in `figures.ts` only. A TV may be plum, a counter lilac. Never add a one-off hex to a shape. |
| A world each | Every figure has its own palette (`THEMES` in `figures.ts`: lilac, peach, blue, mint), so the four are not one object repeated. The palettes share the same roles and the same recipe, which is what keeps them a set. |
| Two accents | Inside a world, its own hue (ground, mist, mid, deep) owns most of the area, cream and sand are the neutrals, and only two accents are strong — small, and no others. Green is for plants and "on", blue for glass; both are muted. A figure that uses every colour at equal weight looks busy however nice each colour is. |
| A scene, not a backdrop | A built figure sits in a pool of the ground colour on the floor that fades to the white page (`makePoolTexture` in `scene.tsx`). The accents then read against lilac instead of white. It must stop short of the neighbouring figures: unbuilt ones are white paper and would show as white shapes on it. |
| Built like the thing | A roof is boards with thickness that overhang the walls, not a prism with stripes; a window is a frame standing proud with the glass set back, not a disc on the wall. If a part would look stuck on in real life, model how it is actually made. |
| Matte clay | Default finish is `clay`. `soft` for small pressable things, `print` for paper, `screen` / `led` for things that glow. No metal, no gloss. |
| Detail earns the close-up | A figure needs three scales: the big masses, the mid parts (drawer fronts, lids, rims), and the small things (pulls, grille dots, knobs, glazing bars). If a part is one plain block, it is not finished. |
| Real UI on screens | Screens show a crop of the actual case-study UI from `public/portfolio/blueprints/`, never a mock. |
| Soft, tinted shadows | Shadows are crisp only at the point of contact and widen with distance; they are plum-tinted, never black. |

## 3. How it is built

| File | Role |
| --- | --- |
| `figures.ts` | Data: `PALETTE`, `AGENTS`, and `FIGURES` — each figure is parts, each part is a list of soft solids (`box`, `slab`, `cyl`, `ball`, `torus`, `arch`, `poly`). |
| `figure-builder.ts` | Turns that data into meshes, ink lines and silhouette hulls; the build shader; finishes and clay grain. |
| `soft-shadows.ts` | Replaces three.js's basic shadow lookup with area-light shadows (PCSS). |
| `scene.tsx` | Canvas, camera framing, the three lights, the frame loop that drives builds, agents and labels. |
| `blueprint-stage.tsx` | The DOM layer: intro, chips, agent stickers, log and result card. |
| `textures.ts` | Printed surfaces drawn on a canvas (ticket, QR card, labels). |

Lighting, in `Studio` (`scene.tsx`): a warm KEY soft box high and front-left, a
SKY light straight overhead whose shadow reads as ambient occlusion, and a FILL
(room environment, warm from above and lilac from below, so shade is coloured,
never grey). `shadow-radius` is each light's size. On top of that the fill
shader dims each figure with distance from the key light — nearest and highest
is brightest, furthest and lowest is darkest — which is what gives the forms
their gradient. Lit tops should land near the palette colour, fronts about
three-quarters of it, shaded sides a little over half. If colours look washed
out, there is too much ambient light — lower it, do not darken the palette.

Drawing is on demand, and the still picture is accumulated. The frame loop
redraws only when something in the 3D picture moved (camera, a build, a fade,
the turn of a newly built figure); the agents and labels are DOM and keep
moving for free. When the picture stops, it is refined the way an offline
renderer works: several dozen frames are drawn, each with the sky light
somewhere else overhead and the shadow samples turned, and averaged into the
frame on screen (`SAMPLES`, `SKY_SPREAD` in `scene.tsx`). That average is what
makes it look rendered rather than real-time: shadows have no grain, and
creases and contact lines darken because the sky light has come from all
around (ambient occlusion). Then drawing stops altogether. Anything that
changes the picture from outside the loop must set `engine.dirty`. The canvas
is opaque white for this; the page behind the stage must stay white.

The layout around it (`blueprint-stage.tsx`): headline top left, position and
arrows top right, one text block bottom left (invitation → agents' log → case
study), the agents' dock bottom right, and the project index along the bottom.
The stage is exactly one screen tall, with the same margin under the index as
over the eyebrow. The camera aims at the middle of each figure as seen on
screen (`centers` in `scene.tsx`), so a flat figure and a tall one both sit
centred. The figure sits right of centre; the camera's `shiftRight` and paddings in
`scene.tsx` must agree with those blocks. ← → switch projects, Esc returns to
the sheet.

## 4. Things that will bite

- **three.js 0.18x shadows are not the ones in older tutorials.**
  `PCFSoftShadowMap` is gone, drei's `<SoftShadows>` targets the old shader, and
  the published build strips GLSL comments. `soft-shadows.ts` patches by
  matching code, and falls back to hard shadows with a console warning if a
  future version changes that code — check the console after any three upgrade.
- **Ink lines must sit on the surface.** Lines are drawn along the middle of
  each fillet (`softBoxLines`, the inset outline for slabs). A line inside the
  mesh is hidden by the paper fill; one outside it floats.
- **Two faces in one plane flicker.** If two shapes share a face — same width,
  same end, same top — the renderer cannot tell which is in front and the
  surface strobes as soon as anything moves (the slider's fill on its track did
  this). Make one clearly proud of the other (≥ 0.004) on every side; never
  give an overlay its base's exact size or height. `npm run check` runs
  `scripts/blueprint-coplanar.mjs`, which finds these in axis-aligned shapes;
  tilted and round ones still need a look by eye.
- **A shimmering model means continuous redraw.** The shadow samples are laid
  out per screen pixel; redraw a moving figure every frame and its penumbras
  crawl. Nothing should move forever — the built figure turns once and stops.
- **Only what is built casts a shadow.** The depth material discards above the
  build height. Any new material path must keep that.
- **Do not mutate props in the frame loop** — the repo's lint forbids it. Shared
  state lives in the module-level `engine`.
- **New Tailwind utilities may not appear under Turbopack HMR.** Restart the dev
  server (see the working rules) before concluding a class is broken.

## 5. Checking your work

The stage only exists at ≥ 1024px wide, and a hidden browser pane does not
animate, so:

1. Make the preview visible and at least 1440 × 900.
2. Wait until the chips are enabled before clicking — the first shader compile
   takes a few seconds.
3. Build each figure and look at it enlarged. Scale the `<canvas>` element
   only (`#stage canvas`, CSS transform). Scaling `#stage` makes the renderer
   re-measure and blanks the view.
4. Look at the drawing state too (reload, do not build): rounded outlines, no
   stray or doubled lines.
5. Check 1024 × 768 (the result card must not cover the figure) and that a
   phone-width viewport still shows the sticker hero with no canvas.
6. `npx tsc --noEmit`, `npm run lint`, `npm run check`, `npm run build`.

## 6. References

Look at these for form, colour and light — do not import assets from them
without checking the licence, and prefer building from the shape vocabulary so
the drawing/object pair stays in sync.

- Tony's reference set: clay toy-block worlds (pink / lavender), a blue
  isometric UI city, flat-lit 3D shape posters on warm white.
- Poly Haven (CC0 HDRIs, materials, models) and ambientCG (CC0 materials) if a
  real texture is ever needed; Kenney (CC0) for stylised form ideas.
- three.js guidance worth reading before lighting or material work:
  `CloudAI-X/threejs-skills` (lighting, materials, geometry). A Blender route
  (`ahujasid/blender-mcp`) exists for authored meshes, but needs Blender
  installed and would bypass the line-drawing pipeline.
