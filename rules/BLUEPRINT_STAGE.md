# Blueprint Stage — 3D rules

The homepage's first screen from `lg` up: a carousel of patent-style line
drawings, one per project, that sticker "agents" build into small clay
dioramas. From `lg` up it is also the work section — there is no card grid
below it. Code lives in `app/components/blueprint/`. Phones and tablets keep
the sticker hero and the card grid, and never download three.js.

Read this before touching anything in that folder. The modelling standard — what
Tony has sent back and the rule each became — and the step-by-step for a
figure are in the `blueprint-figure` skill
(`.claude/skills/blueprint-figure/SKILL.md`); keep the two in step.

## 1. What it must stay

- **Real work only.** Every figure is a case study that has a page on the site
  and links to it. Finished work that is not written up yet may be shown only
  when Tony asks for it: in the grey `mono` palette, with "Coming soon" where
  the link would be. Never add a figure, chip or placeholder because a project
  was mentioned (this was done once with "Agent products" and removed).
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
| A world each | Every figure has its own palette (`THEMES` in `figures.ts`), so the sheet is not one object repeated; unwritten work uses the grey `mono` one. The palettes share the same roles and the same recipe, which is what keeps them a set. |
| Two accents | Inside a world, its own hue (ground, mist, mid, deep) owns most of the area, cream and sand are the neutrals, and only two accents are strong — small, and no others. Green is for plants and "on", blue for glass; both are muted. A figure that uses every colour at equal weight looks busy however nice each colour is. |
| A scene, not a backdrop | A built figure sits in a pool of the ground colour on the floor that fades to the white page (`makePoolTexture` in `scene.tsx`). The accents then read against lilac instead of white. It must stop short of the neighbouring figures: unbuilt ones are white paper and would show as white shapes on it. |
| Built like the thing | A roof is boards with thickness that overhang the walls, not a prism with stripes; a window is a frame standing proud with the glass set back, not a disc on the wall. If a part would look stuck on in real life, model how it is actually made. |
| Matte clay | Default finish is `clay`. `soft` for small pressable things, `print` for paper, `screen` / `led` for things that glow. No metal, no gloss. |
| Detail earns the close-up | A figure needs three scales: the big masses, the mid parts (drawer fronts, lids, rims), and the small things (pulls, grille dots, knobs, glazing bars). If a part is one plain block, it is not finished. |
| Make the design decision visible | Start from the case study's distinctive interaction or insight. The main object should communicate it at homepage size. For a forthcoming case study, base the model on the public project description and cover. |
| Shared plinth | Every exhibit uses two centred rounded rectangles with an even inset. Size the deck to the model's projected footprint on the ground, including rotated parts. Leave visible clearance inside the rounded deck edge while preserving the scale and placement of the subject. |
| Screen textures | FIG. 1 uses the TV dynamic-background demo (`tv-01.mp4`) and FIG. 2 uses the Order Booster demo (`ck-16.mp4`). Crop to the active UI at the aspect ratio of the model's display. Cut off the source device frame, status bar or letterboxing, and let the picture meet the single physical bezel. |
| Detail in relief | For a motif that loses its detail at model scale, use geometry sized for the homepage. In FIG. 6 a thin square rim makes the code area distinct from the plaque and its label. The three Code Eyes sit at the top-left, top-right, and bottom-left within that rim. The main panel and phone share the framed relief. |
| Listing photos | FIG. 7 uses two high-resolution photos for its illustrative listings. Each gets the same aspect ratio, inset, and corner radius. The examples use [Antonio Araujo's pool photo](https://unsplash.com/photos/a-small-pool-with-lounge-chairs-next-to-it-A12OW0VfVMo) and [andy chiu's interior photo](https://unsplash.com/photos/modern-living-room-with-arched-doorways-and-comfortable-seating-NDDArq0m0-Q) under the [Unsplash License](https://unsplash.com/license). |
| Soft shadows | Shadows are strongest at the point of contact and widen with distance. A faint cool tint on the studio floor keeps the monochrome figures neutral. |

## 3. How it is built

| File | Role |
| --- | --- |
| `figures.ts` | Data: `THEMES` (one palette per figure), `AGENTS`, and `FIGURES` — each figure is parts, each part is a list of solids (`box`, `slab`, `cyl`, `ball`, `torus`, `arch`, `poly`). |
| `figure-builder.ts` | Turns that data into meshes, ink lines and silhouette hulls; the build shader; finishes and clay grain. |
| `soft-shadows.ts` | Replaces three.js's basic shadow lookup with area-light shadows (PCSS). |
| `scene.tsx` | Canvas, the carousel's position and camera, the lights, accumulation, and the frame loop that drives builds, agents and labels. |
| `engine.ts` | State shared by the scene and the DOM layer. Must stay free of three.js imports, or three lands in every page's first load. |
| `blueprint-stage.tsx` | The DOM layer: page loader, headline, position and arrows, project details and case-study link, agent stickers, the numbered rail, keyboard. |
| `loader-art.ts` | The page loader's two SVG layers. Generated by `scripts/blueprint-loader-art.py`; never edited by hand. |
| `textures.ts` | Printed surfaces drawn on a canvas (ticket, QR card, TikCode, labels). |
| `scripts/blueprint-coplanar.mjs` | Finds faces two shapes share exactly (they flicker). Runs in `npm run check`. |

Lighting, in `Studio` (`scene.tsx`): a warm KEY soft box high and front-left, a
SKY light straight overhead whose shadow reads as ambient occlusion, and a FILL
(room environment, warm from above with a quiet ground fill). `shadow-radius`
is each light's size. On top of that the fill
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

The layout around it (`blueprint-stage.tsx`): one strong headline line with one
quiet line of proof under it (not the full statement at display size — twelve
words with four overlapping italics in two lines fought the figure) top left, position and
arrows top right, project details bottom left, the agents' dock bottom right,
and an evenly spaced rail of project numbers along the bottom. The figure
caption shows its reference number, and the details carry the full project
name. Recess the left preview along the floor as it leaves centre so its
base and caption clear the details. Keep the focused figure unobstructed
at every viewport and during carousel movement. Anchor the case-study link
(or "Coming soon" status) below the description and build log. It stays in
place as the log grows and is available as soon as the page loader clears.
Pause and Resume sit beside it during the build. Docked agents are quieter
after the build.
The stage is a carousel, not an overview. The figures stand in a single row
(`GAP` in `scene.tsx`). The one in the middle is full size and full colour;
its two neighbours are smaller and faded almost into the paper (`GHOST`,
`NEIGHBOUR_SCALE`), the right one cut by the edge, which is what says "there is
more this way"; the rest are not drawn. The focused exhibit stays sharp while
previews soften with distance. Apply the softness to the displayed frame after
shadow accumulation so it stays consistent as shadows refine and captions stay
sharp. Position along the row is continuous, so fade, size, focus and camera
follow the distance to the middle. It moves by dragging or throwing the stage, a sideways swipe on
a trackpad, the arrows, the arrow keys, the numbered rail, or clicking a
neighbour; a small drag falls back, a real one or a flick lands on the next.
The row is a loop: each figure stands at whichever copy of its slot is nearest
the camera (`shifts`), so the last figure is the first one's left neighbour and
going past either end just carries on. The page opens far enough out to show
the row as light drawings, holds a moment, then closes in on the first figure
(`INTRO_HOLD`, `INTRO_MOVE`) while it starts to build. Replay takes every
figure back to its drawing and rebuilds the one on stage. The lights travel
with the camera.
A grid of every drawing was tried and dropped — past four figures it was a
crowd of small drawings with their labels on top of each other — and so was a
single figure alone, which felt empty and gave no sign of the others.
From `lg` up there is no card grid below:
the stage is the work section.
The stage reaches left to the sidebar's edge, so a neighbour comes out from
under it with no gap. It is exactly one screen tall, with the same margin under the index as
over the eyebrow. The camera aims at the middle of each figure as seen on
screen (`centers` in `scene.tsx`), so a flat figure and a tall one both sit
centred. The figure sits right of centre and above the details. The camera's
horizontal shift and padding in `scene.tsx` must agree with those blocks.
When the main surface needs a higher view (such as FIG. 5's tray), use the
figure's `presentation` settings. The carousel blends elevation and scale
between its neighbours while keeping one horizontal axis. ← → switch projects.

### The page loader

three.js has to download and its shaders compile on the first draw, so from
`lg` up a loader covers the whole page (sidebar included) until the stage's
first frame is painted. It is not a spinner: it shows FIG. 0 — the logo as a
clay block on the same plinth the projects stand on — first as a patent
drawing wiped in, then built from the ground up while two agents ride the
build front. It is the stage's mechanic in miniature, so the wait is the first
demonstration of the idea. When the scene is ready it clears, and the row of
drawings is there at about the same scale, about to close in.

- The art is generated, not drawn: `scripts/blueprint-loader-art.py` projects
  real geometry with the stage's camera and writes `loader-art.ts` with a line
  layer and a colour layer that register exactly. Re-run it after changing the
  palette or the logo; never edit the output by hand.
- The drawing and the object are revealed with plain `clip-path` animations.
  (A cleverer version — a clipping window moving one way and its contents the
  other, to stay on the compositor — left the object unpainted in a real
  browser. Do not bring it back.) To keep them smooth, the 3D scene is not
  started until they have played (`ENTRANCE`): assembling it and compiling its
  shaders would otherwise stall the animation half-way. Its code is fetched
  meanwhile. After that only the agents' bob moves, which is a transform.
- The plinth is sized from the block (same margin on all four sides, two
  layers clearly different in size and height) and the canvas is centred on
  the object, so centring the image centres the object. The loader itself is
  centred on the page, not on the stage: while it shows there is no sidebar.
  As it clears it drifts to the stage's centre to hand over to the first figure.
- It plays once per visit, skips the timed entrance under reduced motion,
  gives up 9s after its entrance, and its progress line marks real
  milestones (page live, scene assembled, first frame drawn), not a made-up
  percentage. Below `lg` it never shows.
- New `@keyframes` in `globals.css` need a clean dev-server restart to appear.

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

1. Make the preview visible and at least 1440 × 900. A hidden pane paints
   nothing: the loader's animations do not start and the page looks blank.
2. On a fresh load the page loader plays first, then the camera closes in on
   the first figure and it builds itself. Wait until the arrows are enabled.
3. Go through every figure (← →, or the rail) and look at each enlarged, about
   ten seconds after it is built, when the frames have accumulated. Scale the
   `<canvas>` element only (`#stage canvas`, CSS transform). Scaling `#stage`
   makes the renderer re-measure and blanks the view. Compare it to the case
   study, then check which detail reads first at the original size.
4. Look at the drawing state too (Replay, or a neighbour that is not built
   yet): outlines continuous, no stray or doubled lines.
5. Go past the last figure and before the first: the row loops with no jump.
6. Check the widths between the breakpoint and the design size, in both the
   building and the built state. The figure's base starts at about 37.5% of
   the stage's width, and the stage is the viewport minus the sidebar (756px
   wide in a 1024px window, 968px at 1280, 1128px at 1440):
   - 1024 × 768 — the project text and the log's ticks must not sit on the
     figure; agents wait as bare cursors.
   - 1180 × 800 and 1280 × 800 — the five name tags in the dock must not
     overlap each other or the block's button.
   - 1440 × 900 — the design size; nothing here should move when a narrower
     width is fixed.
   Then a phone-width viewport: the sticker hero and the card grid, with no
   canvas and no loader.
7. `npx tsc --noEmit`, `npm run lint`, `npm run check`, `npm run build`. New
   `@keyframes` or utilities may need a clean restart (`rm -rf .next`) to show.

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
