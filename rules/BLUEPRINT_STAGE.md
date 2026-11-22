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
- **Environment grows and turns with the subject.** Supporting environment
  objects are ordinary `parts` in the same figure and sway group. They use the
  same per-part height sweep for building and rewinding, with no squash/scale
  growth. `drawing: false` hides them completely in the patent state, including
  their shadow. Keep freestanding pieces clear of one another and the subject;
  validate both the resting pose and the carousel turn.

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
| Light is the room | The background is one seamless floor with **no wall and no line anywhere**: bright where the figure on stage stands and dimmer with distance in every direction (`studioPaper()`). The distance is measured along the floor — a step away from the viewer is shorter on screen than a step sideways — so the pool of light lies on a plane, and that plane is the space the figure stands in (Tony, 2026-11-17: "as if the model were set on a platform, or on the ground"). Away from the light the page is one flat tone (`STUDIO_PAPER` of the wall colour), which is also the header's colour and so the headline's seam. Tried and dropped, do not bring back: a back wall behind the figure (it had to fade out again before the header and read as "a smear across the middle"), a wall running to the top (a horizon cut the page in two), and a drafting grid on the floor (a layer of lines competing with the neighbours' drawings). Tony chose light alone, 2026-11-18. |
| Shared studio | The figures share a seamless studio sweep. The wall, floor, and reflected light interpolate between the palettes of adjacent exhibits as the carousel moves. Draft fills and faded ink sample the same background at their screen position. |
| One sheet of paper | The page is the studio's paper, not white with a coloured patch on it (Tony, 2026-11-17: a tinted stage over a white index band read as cut in two). The backdrop fades into a flat paper colour — `STUDIO_PAPER` of the wall colour, the rest white — at the header, the copy column and the foot, and the scene hands that colour to CSS as `--studio-paper` on `<main>` every time it changes. The sidebar's column and other flat surfaces outside or over the canvas use it, so nothing on the homepage has a background of its own: no white bands, no boxed strips. The canvas is wider than the stage: it runs on to the left edge of the window, under the navigation panel (`-left-[268px] xl:-left-[312px]` on its wrapper; the scene measures the overhang as `stageInset` and lays everything out in the stage's own pixels, and `uStudioFrame` tells the backdrop where the stage starts). So a neighbour leaving to the left passes beneath the panel instead of being cut off at its edge, and it goes out of focus on the way: three sheets of backdrop blur over the stage's left, each stronger and narrower than the last and fading out to the right, make a blur that grows towards the panel (Tony, 2026-11-17: "more blur on the left, less on the right"). The sidebar is a sheet of frosted glass on it (`sidebarTheme="stage"`: a little white, a lighter edge, a backdrop blur, the tint and the passing figure showing through) — the grey card sat against the colour, and no card at all dissolved the navigation into the page (Tony tried both, 2026-11-17). The header band is pure paper (the backdrop's top fade ends below it). The hero text group uses `mix-blend-mode: multiply` with white glyph outlines: the white separates overlapping letters within the group, then blends away over the actual model or paper instead of covering it with a fixed paper-colour halo. Below `lg` and before the scene runs the variable is unset and the page is white. |
| Built like the thing | A roof is boards with thickness that overhang the walls, not a prism with stripes; a window is a frame standing proud with the glass set back, not a disc on the wall. If a part would look stuck on in real life, model how it is actually made. |
| Matte clay | Default finish is `clay`. `soft` for small pressable things, `print` for paper, `screen` / `led` for things that glow. No metal, no gloss. |
| Every exhibit has surroundings | Tony, 2026-11-20: the TV, with its focus surrounds, filled its frame and the others looked bare beside it — "make the picture fuller; give the other models environment elements that belong to their projects, not exaggerated or unreal, physically true; the back row does not have to be the tallest; what matters is that the overall sizes sit in harmony". So each figure has one or two supporting objects from its project's world, made like the real thing and standing where it would (`surround()` in `figures.ts`): a pickup shelf of bagged orders (Lutra), an index-card cabinet (Restructure), a keyboard, pencil and floor lamp (Multi-Platform), a parts organiser (Design System), a speaker on a stand with a record leaning on it (TikCode: sounds are one of the four things a code shares — a poster with a third code made the figure "all QR codes", Tony, 2026-11-20), suitcases (Wishlist), a ring light (Effect House), a roll-up banner (Host Promotion), type blocks "文 / 字 / Aa" (DLS), a pinboard (Supply Tool). Most stand on the floor beside the base, to the left or right, not behind it; their fronts are turned towards the camera (a right-hand object turned to face the centre shows the camera its side). Keep them sturdy and in the figure's mid tones: thin poles and the deep tone read as ink lines next to the TV's chunky surrounds. With them every figure is about 3.7–4.0 wide; keep each within about ±2.5 of its centre, so it stays clear of its neighbours (`GAP` 4.4). A numeral that would land on a new object is moved, and its leader keeps an angle — a vertical leader looks like a mistake beside the curved ones. Some figures also hide one small surprise from their project's world, found on a second look (Tony asked for "something fun in the details"): Lutra's lucky cat on top of the pickup shelf, Multi-Platform's popcorn by the keyboard, Effect House's cat-ear headband (its AR effect, as the real thing), Wishlist's sun hat by the luggage. One per figure at most, small, real, and never a repeat of what the figure already shows. The TV's focus surrounds were lowered (outer 2.48 to 2.2, inner 2.07 to 1.84) so the TV no longer towers over the rest; the inner arch still clears the screen's top edge on screen. |
| Okou is its interface as objects, not a device | Tony, 2026-11-22: Okou (FIG. 1, first because it is the most recent work) "looks too much like the other projects", its little agent "looks nothing like Okou; it is an AI agent product, so its model can be more different"; then, of a version with a small phone: "every project is some device, and Okou's device is so small that nothing on its screen can be seen", and "the model seems to have a perspective problem"; then, of a version with the greeting, a prompt and the result card printed as readable text: "more shapes is better, not so much text". So Okou has no device and no words. Its parts stand on the table as solids: the avatar (the real artwork `okou-avatar.jpg` on a thick squircle tile, the figure's one printed picture, with a bubble of three dots set into its corner the way a badge sits on an app icon), a task list on a widget-shaped tile (two green ticks, one blue ring still running, a bar for each title), the composer as a pill in front (plus, a bar for the line being typed, the amber send button with its arrow), and the deck it hands back as a card with a dark cover whose chart stands in relief. The base is a round turntable, the only one. Its surroundings are three blocks printed with Okou's own textures (`okou-tex-*.jpg`, one tile each), which makes it the one figure in the brand's full colours rather than a single hue. **Every piece faces the same way** (one `YAW` for all, blocks included): under the stage's parallel camera, pieces turned towards each other (a phone turned right, boards turned left) read as a mistake in perspective. The TV's reference studio is found by id (`REFERENCE_INDEX` in `scene.tsx`), not by being first in the list. |
| A 3D model is also a graphic | Tony, 2026-11-20, on a roll-up banner whose print was a heavy dark door, a chart repeating the one beside it, and an empty lower half: "don't model casually; look at the 3D model from a flat, graphic point of view — the visual UI has to be beautiful". So every printed or patterned face is laid out like a page: one centred grid, even margins and even gaps, a clear hierarchy (a title, one image, a supporting graphic, a footer), and one matte `print` finish for all of it. Rows of the same thing are spaced evenly and ordered (an organiser's drawers by column, a pinboard's cards on a grid), not sprinkled with colours. What is symmetric in life is symmetric here: ribs are centred, and a tag that would break them moves to the side. A small dark part on a light object reads as a hole or a mistake; feet and fittings take the object's own tone. Check each object close up, at full resolution, before calling a figure done. |
| Approved TV reference | FIG. 2 has a scoped smooth satin-resin recipe, broad softbox reflections, and orange/yellow focus surrounds sampled from Tony's approved image. Preserve its planar faces and continuous bevel normals. Compare an actual WebGL screenshot at the reference viewport before claiming a match or extending the treatment to other figures. |
| Local light relationships | Passive TV props have no emissive brightness compensation. Their tighter shadow frusta and small receiver bias preserve contact shadows. After building and turning, `reference-irradiance.ts` captures the real scene at 36 local positions and projects one-bounce diffuse radiance into a spatial SH volume. Materials replace room-only diffuse irradiance with this captured illumination; specular reflections still use the studio environment. This is a local approximation, not complete multi-bounce GI. |
| Detail earns the close-up | A figure needs three scales: the big masses, the mid parts (drawer fronts, lids, rims), and the small things (pulls, grille dots, knobs, glazing bars). If a part is one plain block, it is not finished. |
| Make the design decision visible | Start from the case study's distinctive interaction or insight. The main object should communicate it at homepage size. For a forthcoming case study, base the model on the public project description and cover. |
| Shared plinth | Every exhibit uses two centred rounded rectangles with an even inset. Size the deck to the model's projected footprint on the ground, including rotated parts. Leave visible clearance inside the rounded deck edge while preserving the scale and placement of the subject. |
| Screen textures | FIG. 2 uses the TV dynamic-background demo (`tv-01.mp4`) and FIG. 3 uses the Order Booster demo (`ck-16.mp4`). Crop to the active UI at the aspect ratio of the model's display. Cut off the source device frame, status bar or letterboxing, and let the picture meet the single physical bezel. |
| Detail in relief | For a motif that loses its detail at model scale, use geometry sized for the homepage. In FIG. 7 a thin square rim makes the code area distinct from the plaque and its label. The three Code Eyes sit at the top-left, top-right, and bottom-left within that rim. The main panel and phone share the framed relief. |
| Listing photos | FIG. 8 uses two high-resolution photos for its illustrative listings. Each gets the same aspect ratio, inset, and corner radius. The examples use [Antonio Araujo's pool photo](https://unsplash.com/photos/a-small-pool-with-lounge-chairs-next-to-it-A12OW0VfVMo) and [andy chiu's interior photo](https://unsplash.com/photos/modern-living-room-with-arched-doorways-and-comfortable-seating-NDDArq0m0-Q) under the [Unsplash License](https://unsplash.com/license). |
| Soft shadows | Shadows are strongest at the point of contact and widen with distance. A faint cool tint on the studio floor keeps the monochrome figures neutral. |

## 3. How it is built

| File | Role |
| --- | --- |
| `figures.ts` | Data: `THEMES` (one palette per figure), `AGENTS`, and `FIGURES` — each figure is parts, each part is a list of solids (`box`, `slab`, `cyl`, `ball`, `torus`, `arch`, `poly`). |
| `figure-builder.ts` | Turns that data into meshes, ink lines and silhouette hulls; the build shader; finishes and clay grain. Each part is drawn as one mesh per material (its shapes' placements baked in and merged, indexed and unindexed geometry apart), one ink line object and one hull — not one of each per shape. `sync()` hides, each frame, what would draw nothing: a built part's ink and hull, an unbuilt part's shadow, an unbuilt surrounding's fill. |
| `studio-atmosphere.ts` | Display-space wall and floor lighting shared by the backdrop and patent drawing shaders. |
| `soft-shadows.ts` | Replaces three.js's basic shadow lookup with area-light shadows (PCSS); TV contacts can resolve down to half a shadow texel. |
| `reference-ground.ts` | TV floor shadow catcher compares actual received diffuse energy with the unoccluded room; unshadowed pixels match the studio paper. Other figures retain their legacy shadow blend. |
| `scene.tsx` | Canvas, the carousel's position and camera, the lights, accumulation, and the frame loop that drives builds, agents and labels. |
| `engine.ts` | State shared by the scene and the DOM layer. Must stay free of three.js imports, or three lands in every page's first load. |
| `construction.ts` | Construction plans for every figure, traced from the actual shape surfaces, in figure-local coordinates: the TV's tuned part by part, the others from `constructionChoice`. |
| `construction-timing.ts` | Which gesture builds each part (`constructionChoice`) and its draw and fill durations (`TV_CONSTRUCTION_TIMING`, `constructionTiming`). No three.js, so the build schedule can read it. |
| `construction-overlay.ts` | Projected SVG tool gestures and cursor poses; consumes progress from the scene and owns no animation clock or three.js imports. |
| `blueprint-stage.tsx` | The DOM layer: page loader, headline, position and arrows, project details and case-study link, agent stickers, keyboard. It publishes the figure on stage through `engine.focus` / `engine.select` for the navigation panel. |
| `loader-art.ts` | The page loader's three SVG layers (drawing, object, light). Generated by `scripts/blueprint-loader-art.py`; never edited by hand. |
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
changes the picture from outside the loop must set `engine.dirty`. The studio
is opaque for accumulation. Match the paper-white edges to the page.

The layout around it (`blueprint-stage.tsx`): one strong headline line with one
quiet line of proof under it (not the full statement at display size — twelve
words with four overlapping italics in two lines fought the figure) top left, position and
arrows top right, project details bottom left, the agents' dock bottom right,
and no index of its own: the navigation panel is the stage's index (see
"The panel is the index" below). An 80px band of numbers along the bottom,
then a thin line in eleven parts, were both tried there and dropped. The figure
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
its two neighbours are smaller line drawings, faded but still plainly there
(`GHOST`, `NEIGHBOUR_SCALE` — at 0.84 faded they were "too faint", Tony
2026-11-17; a neighbour is always a drawing now, so it needs its ink), the
right one cut by the edge, which is what says "there is more this way"; the
rest are not drawn. The focused exhibit stays sharp while
previews soften with distance. Apply the softness to the displayed frame after
shadow accumulation so it stays consistent as shadows refine and captions stay
sharp. Position along the row is continuous, so fade, size, focus and camera
follow the distance to the middle. It moves by dragging or throwing the stage, a sideways swipe on
a trackpad, the arrows, the arrow keys, the navigation panel, or clicking a
neighbour; a small drag falls back, a real one or a flick lands on the next.

From `lg` up the stage is the whole homepage: exactly one screen, with nothing
under it and no page to scroll (Experience and Contact are on the About page).
So the gesture that would scroll a page turns the row instead — wheel or swipe
down for the next figure, up for the one before, as do ↓ ↑ and Page Down / Up.
One gesture turns it once, however long a trackpad keeps coasting; the next
turn needs a pause or a fresh push. This only happens while the page cannot
scroll (`scrollHeight` ≤ the window's height): on a window too short for the
stage's minimum height the wheel scrolls the page as usual.

**The stage can be hidden.** The homepage has a second view, Tony's cards
(2026-11-20; `PORTFOLIO_WORKING_RULES.md`, Structure Reference). While the
cards show, the stage's wrapper is `display: none` and the stage stays
mounted, so that coming back is immediate and the figure is as it was left. So
the stage must keep working with no size: the keyboard handler already steps
aside when `#stage` has no `offsetParent`; the scene measures its inset every
frame and redraws when it comes back; nothing may assume a non-zero canvas or
divide by the stage's width without a guard. A visit that reloads in the cards
view has not mounted the stage at all (`HomeStage`, `useStageWanted`): the
first switch to it plays the loader, like a first visit.
The row is a loop: each figure stands at whichever copy of its slot is nearest
the camera (`shifts`), so the last figure is the first one's left neighbour and
going past either end just carries on. The page opens far enough out to show
the row as light drawings, holds a moment, then closes in on the first figure
(`INTRO_HOLD`, `INTRO_MOVE`) while it starts to build. The lights travel
with the camera.

**The panel is the index** (Tony chose this of three navigations,
2026-11-18). The stage used to sit beside a second list of the same projects.
Now the navigation panel (`sidebar-projects.tsx`, list in
`app/lib/projects.ts` — same ids and order as `FIGURES`, and the stage warns
in development if they drift) *is* the index: all twelve, numbered, the one
on stage marked; resting the pointer on a row brings its figure on; clicking
opens the case study (a "Soon" row only shows its figure). The panel must not
import `figures.ts`: it is on every page, and the geometry is not.

**Arriving builds, leaving rewinds** (Tony, 2026-11-17, in place of a Replay
button). Whenever a figure comes on stage the agents build it from its
drawing. Whenever the visitor leaves it — built or half-built — it plays its
own schedule backwards, part by part, in about `REWIND` seconds, and is a
drawing again by the time it has slid aside (`engine.rewinds`, advanced by the
clock in the frame loop). Coming back to a figure that is still on its way
back carries on from where it is. So only the figure on stage is ever built,
every arrival shows the idea again, and there is nothing to replay. With
reduced motion both are instant. A build takes about 3–3.6 seconds, drawing
gestures included, the TV's about 5 (`TRAVEL`, `STAGGER` in `planBuild`, the
gestures in `construction-timing.ts`): Tony found 3–6 seconds a little long,
2026-11-20, so the schedule was tightened — but not the gestures themselves
(see "Construction gestures").
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
When the main surface needs a higher view (such as FIG. 6's tray), use the
figure's `presentation` settings. The carousel blends elevation and scale
between its neighbours while keeping one horizontal axis. ← → switch projects.

### Construction gestures

The agents draw each part with a tool before it fills: they drag out a box and
trace the outline, draw with the pen, duplicate a copy, or type a label. It
began as a FIG. 2 / `tv` trial; Tony asked for it on every figure, 2026-11-20.
It extends the drawing-to-object reveal without changing the homepage layout.

- **Every figure, two ways.** The TV's plans and timings are tuned part by part
  (`TV_CONSTRUCTION_TIMING` and the cases in `createConstruction`). Every other
  figure gets its gesture from its shapes (`constructionChoice`): a printed
  label nearly as big as the part is typed; three or more copies of one solid
  that make up a good share of the part are drawn once and duplicated (drawer
  fronts, keys, shelves); surroundings are drawn with the pen; everything else
  starts with a dragged box. A cylinder taller than it is wide is traced by its
  side silhouette, not its end rim. These plans keep to two paths a part.
- **A calm tempo.** Generic gestures take 0.65 s (drag), 0.8 s (pen), 0.6 s
  (duplicate), 0.4 s plus 0.035 s a character (type). At 0.4 s the cursors
  darted from box to box and looked "a bit crazy" (Tony, 2026-11-20). Builds
  stay short by giving each surrounding to the agent that is free soonest, not
  by hurrying the gestures: about 3–3.6 s a figure, the TV 4.9 s.
- **Trace the object.** `construction.ts` derives each plan from the actual
  part and shape definitions: rounded face caps, the rug's top plane, cabinet
  front and extrusion edges, and the surrounds' closed polygon paths. Apply
  shape transforms and the part's frame once, leaving points figure-local.
  `scene.tsx` applies the figure group's current world matrix and camera
  projection every frame, so tools stay attached through carousel motion.
- **Use the appropriate tool.** Drag gestures establish a face selection, then
  trace its contour; pen gestures follow the real paths by arc length. The
  soundbar duplicates matching grille circles, while the different props are
  drawn separately with the pen. The plaque types `Focus` along its projected
  face. Keep construction paths limited to four per part.
- **Keep the original ink.** The TV starts as its full black patent drawing, including hidden-line removal. Temporary coloured construction tools work over that drawing; do not hide the initial outlines to make the tool trace appear. Environment surrounds remain excluded from the patent drawing.
- **Draw, then build.** The existing schedule supplies `tGo` (approach),
  `tDraw` (tool gesture), `tStart` (solid reveal), and `tEnd`. Draw/fill durations
  come from `constructionTiming`. Once drawing finishes, the original eased
  `rt.h` height sweep reveals the real solid; the overlay fades during that
  fill. The tool handle follows the same world-Y `rt.h` clipping plane, not the outline's separate height range. Do not replace the sweep with squash, height scaling, or an independent extrusion animation.
- **Keep the environment in the same model.** Both surrounds remain ordinary
  `drawing: false` parts under the subject's sway parent. Their temporary pen
  paths appear only during construction; they never join the patent drawing
  shown by background previews. They build and rewind through the same height
  sweep and turn rigidly with the subject, preserving their physical clearance.
- **One clock and lifecycle.** Tool progress, cursor work, and solid reveal use
  the existing build clock, including `pausedAt` / resume's `t0` adjustment.
  The SVG owns no timer, animation loop, or CSS transition. Empty/completed
  tasks clear its paths and cursor poses; leaving a figure clears the construction
  overlay while the model follows its existing rewind. Unmount disposes the
  SVG. Reduced motion completes the build immediately, skips construction
  gestures and the presentation turn, and leaves no tool overlay behind.

### The page loader

three.js has to download and its shaders compile on the first draw, so from
`lg` up a loader covers the whole page (sidebar included) until the stage's
first frame is painted. It is not a spinner: it shows FIG. 0 — the logo as a
clay block on the same plinth the projects stand on — first as a patent
drawing that draws itself (the plinth, then the logo in one line, then the
callouts), then built from the ground up while two agents, flown in from
either side, ride the build front; a seam of light runs along that front, and
once the object stands one sweep of light crosses the logo. It is the stage's
mechanic in miniature, so the wait is the first demonstration of the idea.
When the scene is ready it clears, and the row of drawings is there at about
the same scale, about to close in.

- The art is generated, not drawn: `scripts/blueprint-loader-art.py` projects
  real geometry with the stage's camera and writes `loader-art.ts` with three
  layers that register exactly — line, colour, and glint (the seam and the
  sweep). Re-run it after changing the palette, the logo or the plinth; never
  edit the output by hand.
- It is modelled by the stage's rules, so it reads as one of the figures (Tony,
  2026-11-20: "based on the current model … a bit more detail, a bit rounder"):
  the logo stays square like the mark — its outer corners only just softened,
  its inner ones sharp — with a tight bevel on its front edge (rounder corners,
  0.07 outside and 0.03 inside, made it look odd: Tony, 2026-11-20; the
  roundness belongs to the plinth and the props, not the logo); every face is
  lit by its normal from the key
  light, so tops, fronts and sides take the stage's three tones and the bevels
  catch the soft box; the plinth is the stage's `plinth()` (a lilac tier under
  a deck, even setback, rounded) a little thicker for the smaller scale, with
  the deck in the world's ground colour — that is how the mist deck reads on
  the stage, and on the loader's white a mist deck disappears. Two of the
  stage's props stand in front of the block, a yellow ball and a plum ring.
  The drawing shows each rounded edge by its middle line, as the stage does.
- Keep the file small: it is inlined in the homepage's HTML and its script
  (about 40 KB, under 8 KB gzipped). Faces of one fill that cannot overlap
  are written as one path, and the outlines that light is clipped to are a
  hull and the drawing, not every face.
- The drawing draws itself with a dash pulled along each outline (`pathLength`
  1; `.bp-pen` in `globals.css`, its start and length written into the art as
  `--d` and `--t`). Its fills are white on white, so a line only ever appears
  where it will stay. The pen's round cap would leave a dot where a line has
  not started yet, so each stroke stays hidden until its pen sets off.
- The object is revealed with a plain `clip-path` animation. (A cleverer
  version — a clipping window moving one way and its contents the other, to
  stay on the compositor — left the object unpainted in a real browser. Do not
  bring it back.) To keep everything smooth, the 3D scene is not started until
  the sweep of light has played (`ENTRANCE`): assembling it and compiling its
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

- **There are no per-shape meshes.** Since 2026-11-20 a part's shapes are
  merged per material at build time (draw calls fell about 3x, frame cost
  about a fifth; the picture is pixel-identical). Anything that needs one
  shape — a construction path, a measurement — reads the shape definitions in
  `figures.ts`, not the scene graph. If a shader's discard rule changes (ink
  above the build front, fills and shadows below it), change `sync()` to
  match, or it will hide something that should draw.
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
3. Go through every figure (← →, or the navigation panel) and look at each enlarged, about
   ten seconds after it is built, when the frames have accumulated. Scale the
   `<canvas>` element only (`#stage canvas`, CSS transform). Scaling `#stage`
   makes the renderer re-measure and blanks the view. Compare it to the case
   study, then check which detail reads first at the original size.
4. Look at the drawing state too (either neighbour: only the figure on stage
   is built). Check the outline and how the fill meets the studio. Then step
   away and back, and step three times quickly: the figure left behind must
   run back to its drawing, and the one arrived at must build.
5. Pause a drag between two distinct palettes and check for an intermediate
   colour. Loop past the last figure and verify the first palette returns.
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
   On every figure the page must be one colour edge to edge: no seam where
   the sidebar's column meets the canvas, no band at the foot, no white
   outline round the headline's letters.
   And at 1440 × 900 the page must not scroll at all (`scrollHeight` equals the
   window's height): scrolling down over the figure, the project text and the
   index each turns the row by one.
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
