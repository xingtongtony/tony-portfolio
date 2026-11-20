---
name: blueprint-figure
description: Build, restyle or refine a 3D clay figure on the homepage blueprint stage (app/components/blueprint). Use when asked to add a project to the 3D stage, make a model more detailed, more real or better shaped, change its colours or materials, or fix its lighting, shadows, flicker or line drawing.
---

# Blueprint figure

`rules/BLUEPRINT_STAGE.md` explains how the stage works and why. This file is
the modelling standard and the procedure. Both came out of Tony's reviews —
when they disagree with a hunch, they win.

## The standard

Tony judges these against offline clay renders, by eye, enlarged. What he has
sent back, and the rule each became:

| He said | Rule |
| --- | --- |
| "It looks like 3D modelling, not real" | A solid is **flat faces with a tight bevel** (default ≈ 0.02) that catches a line of light. A big fillet on everything reads as an inflated blob and hides the three tones of top, front and side. Round things are round because the object is. |
| "The roof is fake. The window is fake." | **Build it the way it is made.** A roof is boards with thickness that overhang the walls; a window is a frame standing proud with the glass set back; a chimney comes through the roof and has a cap. If a part would look stuck on in real life, it will here. |
| "Too little detail, it's crude" | **Three scales, always**: the big masses, the mid parts (drawer fronts, lids, rims, steps), and the small things (pulls, grille dots, knobs, glazing bars). A part that is one plain block is not finished. |
| "Other renders have gaps between things" | Contact and crevice darkening comes from the renderer (the still frame is accumulated with a wandering sky light). It only shows if parts actually **sit on, in or against** each other — let small things sink 0.002–0.01 into their support; never float them. |
| "It keeps flickering" | **No two faces in one plane.** An overlay must be clearly proud of its base (≥ 0.004) on every side, and never the same width, end or height as it. `npm run check` finds these in axis-aligned shapes. |
| "The shape looks lopsided" | **Keep symmetric things square to the viewer.** Do not tilt a heart, a face or a logo for liveliness; turn it about the vertical axis only. |
| "The colours are too busy" | **Per figure: one hue owns the area, two neutrals, two accents.** Green is for plants and "on", blue for glass. Never a colour per part. |
| "Now it's monotonous" | **Every figure has its own palette** (`THEMES`). Same roles, same recipe, different hue. |
| "The interface is too small, and the padding round the screen is uneven" | **A screen fills its body up to one even bezel.** Size the body to the screen, not the other way round: body = screen + 2 × bezel on both axes (the screen keeps the image's aspect ratio), and screen corner radius = body radius − bezel so the corners are concentric. Keep the bezel thin; the interface is the subject. |
| "Some figures sit low" | Nothing to do per figure: the camera centres on each figure's extent on screen. But keep floating things (clouds, hearts) inside a sensible height — they move the centre. |
| "The shadows are too hard / too real" | Compare the shared studio lighting across a pale, saturated and monochrome model. Keep contact edges grounded and the shadows beyond them soft. |

Two more that are his decisions, not style:

- A figure is a **published case study** with a link. Work that is finished but
  not written up may be added **only when Tony asks**, in the `mono` palette,
  with `status: SOON` and no `href`. Never add one because he mentioned a project.
- Screens show the **real UI** (a crop in `public/portfolio/blueprints/`) when
  the project is one product. When the subject is structure or layout
  (a restructure, a cross-platform system), clay blocks stand in for the UI.
  Crop inside any frame already present in the source image. For motifs
  that turn to noise at model scale, sculpt the key forms in relief.
- **Approved render references must be verified in the real scene.** Compare
  screenshots at the reference viewport, including camera, silhouette, colour,
  bevels, shadows and materials. An image-generation concept is not proof that
  the WebGL implementation matches. Finish and show one real scene before
  extending its treatment to the other figures.
- **Environment pieces follow the subject.** Use ordinary parts and the same
  height-sweep build/rewind shader and sway parent; never scale their height to
  imitate growth. `drawing: false` omits their ink and discards their unbuilt
  surfaces and shadows. Leave real clearance between freestanding objects,
  including during the carousel's turn. FIG. 1's approved double surrounds
  use a smooth satin-resin finish and reference colours rather than matte grain.
- **Passive scenery must receive light.** Do not use strong self-emission to
  match a concept image's bright colour: it masks shadowing without lighting
  neighbouring surfaces. A room-only PMREM also cannot supply local colour
  bounce or local occlusion. Verify real shadow-map contributions and compare
  neighbour-colour captures when adding indirect lighting. FIG. 1 uses a local
  one-bounce irradiance volume after its build/turn settles; it is an
  approximation, not a full multi-bounce renderer.

## Procedure

### 1. Compose it in words

- **Design decision** — identify the interaction or insight in the case study
  that the visitor should recognize at homepage size. Use the published
  description and cover as the reference for work marked Coming soon.
- **Hero object** — the one thing that says what the project is.
- **Two or three supporting objects** that tell the story around it.
- **Small things** — at least six.
- **One or two toy accents** — a ball, a ring, an arch, a cloud.
- **Surroundings** — one or two objects from the project's world, beside the
  base rather than behind it, so the figure fills its frame like the TV with
  its surrounds (`surround()`; see "Every exhibit has surroundings" in
  `rules/BLUEPRINT_STAGE.md`). Real objects, standing the way they would;
  fronts turned to the camera; sturdy, in the mid tones.

Split it into 5–8 **parts**. A part is what one agent builds and one line of
the log names ("Console", "Order ticket"), so name them like objects.

### 2. Author it in `figures.ts`

A figure is one entry in `BUILDERS`: a palette from `THEMES` and a function of
that palette, `(c) => ({ id, fig, title, desc, href, parts, callouts })`. Start
`parts` with `{ id: "ground", ..., shapes: plinth(c) }`.

- **Space**: ground at `y = 0`, front faces `+z`, tallest point about 2.1.
  The camera looks from the front-right and above. Tall objects read best at
  the back or left.
- **Plinth**: `plinth()` supplies two centred rounded tiers with an even inset.
  The default top height is 0.107. Adjust the deck's width and depth so the
  whole footprint, including rotated parts, has clearance inside its rounded
  edge.
- **Shapes**: `box`, `slab` (rounded rectangle, extruded; `r` = half its size
  makes a disc), `cyl` (`bevel = r` for a capsule), `ball`, `torus`, `arch`,
  `poly` (`r` rounds its corners). Helpers: `flat()`, `lying()`, `FACE`,
  `row()`, `heart()`, `sparkle()`, `plinth()`, `screenBlocks()`.
- **Colour**: palette roles only — `c.ground / mist / lilac / plum / inky`
  (the world's hue, light to dark), `c.cream / sand` (neutrals),
  `c.coral / yellow` (the two accents), `c.green / blue` (plants, glass).
- **Finish**: leave it `clay` unless pressed (`soft`), printed (`print`) or
  glowing (`screen`, `led`). No metal, no gloss.
- **Tilted things** go in a part with a `frame`, authored upright inside it.
- **Camera** — when a flat figure's main face foreshortens too much, use
  `presentation` to give it a higher view at the centre of the carousel.
- **Stack by arithmetic**: centre `y` = top of the support + half the height.
- **Callouts**: three, numbered `n02 / n04 / n06` for figure `n`, on three
  different parts, with leaders that do not cross the figure.
- **Order**: figures stand in a row in `BUILDERS` order, one on stage at a
  time. Adding one needs no layout work; it just needs the next `FIG.` number.

### Construction gestures (every figure)

Agents draw each part with a tool before it fills: drag a box and trace,
pen, duplicate, or type. Source: `construction.ts`, `construction-timing.ts`,
`construction-overlay.ts`. The TV's gestures are tuned part by part; every
other figure's come from `constructionChoice` (see "Construction gestures" in
`rules/BLUEPRINT_STAGE.md`). A new figure needs no construction code — check
that its parts get sensible gestures, and that no gesture is hurried (keep the
generic durations; at 0.4 s the cursors look frantic).

- Derive paths from actual shape surfaces and their rounded caps. Apply the
  shape's position/rotation and part frame, including scale, once. Keep output
  points figure-local; the scene projects them through the live figure group
  and camera every frame. TV plans keep to four paths, the others to two.
- Drag establishes a face selection before tracing. Pen traces real contours;
  duplicate only matching objects, and draw different props separately. Type a
  label's own text on its projected face.
- Preserve the full initial black patent drawing and hidden-line removal.
  Coloured tool paths draw over it; keep surroundings excluded from patent ink.
- Schedule approach → draw → height sweep with `tGo`, `tDraw`, `tStart`, and
  `tEnd`, from `constructionTiming`. Keep the existing eased `rt.h` solid
  reveal and fade the construction overlay during fill; never squash or scale
  objects to imitate their growth.
- Keep surroundings under the same sway parent as the subject. Their temporary
  construction paths do not become background patent ink: preserve
  `drawing: false`, the shared build/rewind sweep, and real clearance when the
  whole figure turns.
- Pause/Resume uses the same build clock for tools and solids. The SVG must
  not own another timer or animation loop. Clear completed/absent tasks and
  cursor poses, clear tools when leaving a figure, and dispose the SVG on unmount.
  Reduced motion builds instantly and skips the tools and presentation turn.

### 3. Look at it

The stage needs ≥ 1024px and a visible browser pane (a hidden one does not
animate). Wait until the index buttons are enabled, build the figure, then
**wait about ten seconds**: the picture is only final after the turn ends and
the frames have accumulated. Enlarge by scaling the `<canvas>` (`#stage canvas`,
CSS transform), never `#stage`.

- [ ] Flat faces, tight bevels; three tones on every block.
- [ ] Nothing floats; nothing is hidden by accident; nothing strobes when it turns.
- [ ] Every part has small detail.
- [ ] Parts are made the way the real thing is made.
- [ ] One hue, two neutrals, two accents; sits well beside the other figures.
- [ ] The main design decision reads in the normal homepage composition.
- [ ] Drawing state: continuous ink and a fill that matches the studio behind it.
- [ ] Studio light stays behind the object and its shadows. While dragging,
      the environment moves continuously between adjacent palette colours.
- [ ] Numerals and caption clear of the object, at 1440 × 900 and 1024 × 768.

### 4. Finish

- `npx tsc --noEmit`, `npm run lint`, `npm run check` (includes the shared-face
  check), `npm run build`.
- If a review changes a rule, change this file and `rules/BLUEPRINT_STAGE.md`
  in the same commit.
- Push to a branch and show Tony before `main`. He reviews this by eye, and a
  new look is not approved until he has seen it.
