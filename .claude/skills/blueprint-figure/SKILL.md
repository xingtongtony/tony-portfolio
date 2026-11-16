---
name: blueprint-figure
description: Add, restyle or refine one of the 3D clay figures on the homepage blueprint stage (app/components/blueprint). Use when asked to add a project to the 3D stage, make a model more detailed or rounder, change its colours, or fix its lighting, shadows or line drawing.
---

# Blueprint figure

Read `rules/BLUEPRINT_STAGE.md` first. It holds the art direction and the
things that break; this file is the procedure.

## Before you start

- The figure must be a case study that already has a page under `app/work/`.
  If it does not, stop and say so — do not add a placeholder.
- The stage shows four figures in a 2 × 2 grid (`SLOTS` in `scene.tsx`). A fifth
  needs a layout decision from Tony, not just data.

## 1. Compose it on paper

Write the scene as a short list before any coordinates:

- **Ground** — a `ground` slab with a `mist` inlay. Same for every figure.
- **Hero object** — the one thing that says what the project is (a TV, a phone
  on a stand, a tray of components, a house).
- **Two or three supporting objects** that tell the story around it.
- **Small things** — pulls, knobs, dots, rims, bars. Plan at least six.
- **One or two toy accents** — a ball, a ring, an arch, a cloud.

Then split it into 5–8 **parts**. A part is what one agent builds and what one
line of the log names ("Console", "Order ticket"), so name them like objects.

## 2. Author it in `figures.ts`

Figure space: ground at `y = 0`, front faces `+z`, footprint about 2.9 × 1.9,
tallest point about 2.1. The camera looks from the front-right and above, so
tall things go at the back or left, and anything behind a taller object to its
front-right is hidden.

- Shapes: `box`, `slab` (rounded rectangle, extruded), `cyl` (set
  `bevel = r` for a capsule), `ball`, `torus`, `arch`, `poly` (give `r` to
  round its corners). Helpers: `flat()`, `lying()`, `FACE`, `row()`, `heart()`.
- Colour: `PALETTE` constants only. Check the figure against the other three —
  the same five accents, no new hue.
- Finish: leave it as `clay` unless the thing is pressed (`soft`), printed
  (`print`) or glows (`screen`, `led`).
- A screen is a thin `slab` with `finish: "screen"` and `map` set to a crop of
  the real UI in `public/portfolio/blueprints/`, on a dark `inky` lip one size
  larger. Keep the crop's aspect ratio in the slab's size.
- Stack by arithmetic: an object's centre `y` is the top of what it stands on
  plus half its height. Let small things sink a hair (0.002–0.01) into their
  support rather than float.
- Add three `callouts` (numerals `n02 / n04 / n06` for figure `n`) pointing at
  three different parts, with leaders that do not cross the figure.

## 3. Look at it

Follow "Checking your work" in the rules file. For each figure, check:

- [ ] Drawing state: outlines are rounded and continuous; no doubled lines.
- [ ] Nothing floats, nothing is hidden behind something else by accident.
- [ ] Every part has small detail; no plain blocks.
- [ ] Shadows: crisp at contact, wide and soft further out, never black.
- [ ] Colours sit in the same family as the other three figures.
- [ ] The callout numerals and the caption do not overlap the object.
- [ ] 1440 × 900 and 1024 × 768 both frame it with the result card clear.

## 4. Finish

- `npx tsc --noEmit`, `npm run lint`, `npm run check`, `npm run build`.
- If the art direction or a rule changed, record it in
  `rules/BLUEPRINT_STAGE.md` in the same change.
- Show Tony screenshots before it goes to `main`. He reviews this by eye.
