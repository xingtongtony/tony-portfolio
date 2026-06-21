# Tony Portfolio Working Rules

This document records the rules and lessons from rebuilding Tony Xing's portfolio from Framer to a self-hosted Next.js site. Follow these rules before making future design or code changes.

> **How to use this doc.** Before any visual task, do two things: (1) follow the rules below — the **Visual Tokens**, **Layout Patterns**, and **Motion System** are the binding design system; and (2) auto-invoke the installed design skills per **Design Skills To Apply** — `frontend-design` for building new UI, `ui-ux-pro-max` for patterns / charts / UX review, `web-design-guidelines` for the final accessibility audit. The skills enhance the work; when a skill default conflicts with a token in this doc, **this doc wins.** For the full token tables (color ramp, type scale, radii, shadows, motion, component specs), see the companion **[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)** — that file owns the *values*; this file owns the *rules*. When they overlap, defer to DESIGN_SYSTEM for a value and to this doc for a judgment.

> **Recording rules (standing instruction).** Tony has authorized auto-recording rules. Whenever a conversation produces a decision worth keeping — a new token, a reusable pattern, a naming/behavior convention, a process rule, a gotcha, or a fix that should apply beyond the one file being edited — record it as part of the same task and note it in the wrap-up. **Always decide where it belongs:**
>
> - **Rules docs (md)** — principles, judgment criteria, token *values*, anti-patterns, gotchas, process. The "what / when / why" you read before acting. Put it in the right place: token values → `rules/DESIGN_SYSTEM.md`; judgment, process, anti-patterns → `rules/PORTFOLIO_WORKING_RULES.md` (correct section: tokens → Visual Tokens, layout → Layout Patterns, etc.).
> - **Code (a script / module)** — when the rule is better expressed as reusable, executable code: a config-driven component, a shared token module (e.g. `app/lib/tokens.ts`), a generator, a parameterized recipe. If the rule encodes a *repeatable build*, make it runnable so future work executes it instead of re-deriving it from prose — then point at that file from the md.
>
> Default: judgment / principle → md; parameterizable / executable implementation → code; **often both** (md records the principle and links to the code). Skip one-off, page-specific choices — those stay in the case study's own file. When unsure, lean toward recording and flag it for review.

## Contents

**Foundations**
- [Primary Goal](#primary-goal) · [Structure Reference](#structure-reference)

**Case study system** (how to build a case study)
- [Case Study Page Model](#case-study-page-model)
- [Case Study Design Workflow](#case-study-design-workflow) — the 6 checkpoints
- [Case Study Visual Direction](#case-study-visual-direction)
- [Case Study Content And Motion](#case-study-content-and-motion)
- [Case Study Theming](#case-study-theming)

**Design system** (binding reference — look up while building)
- [Visual Tokens](#visual-tokens) — type scale, eyebrow, surface, body opacity, radii
- [Layout Patterns](#layout-patterns) — spacing scale, grid, sticky, card-vs-naked
- [Content Voice](#content-voice) — writing rules, source fidelity
- [Cursor System](#cursor-system)
- [Motion System](#motion-system) — Framer Motion primitives, ordering
- [Case Study Navigation: Next-Section Button](#case-study-navigation-next-section-button)

**Skills** (auto-invoke)
- [Design Skills To Apply](#design-skills-to-apply) — frontend-design / ui-ux-pro-max / web-design-guidelines, triggers, guardrail, workflow mapping

**Content & assets**
- [Content Source](#content-source) · [Asset Rules](#asset-rules) · [Link Rules](#link-rules)

**Ops & QA**
- [Dev Server Rules](#dev-server-rules) (+ [Tailwind/Turbopack HMR caveat](#tailwind-v4--turbopack-hmr-caveat))
- [Validation Rules](#validation-rules) · [Communication Rules](#communication-rules)

## Primary Goal

The goal is to fully migrate Tony Xing's portfolio away from Framer.

- Do not depend on Framer-hosted pages as the production experience.
- Project pages and case studies must be rebuilt as local Next.js experiences with local assets.
- External links are allowed only for non-Framer destinations such as LinkedIn, email, or CV files.

## Structure Reference

The desired homepage structure is inspired by Alex Nguyen's portfolio:

- Left side: fixed/sticky intro area with name, role, short bio, navigation, and contact actions.
- Right side: independently scrollable content flow with company strip, selected work, side/coming-soon projects, experience, about, and contact.
- The structure should feel close to the reference: editorial, compact, content-heavy, and portfolio-first.
- Do not replace this with a generic centered landing page unless explicitly requested.

## Case Study Page Model

Use this model for every migrated case study page unless the user explicitly asks for a different interaction.

- Case studies should use real local Next.js routes, for example `/work/tiktok-tv-visual`, instead of in-page overlays or external Framer links.
- Keep the same portfolio shell: fixed/sticky left sidebar plus right-side content canvas.
- When a user opens a case study from a homepage card, the right-side content should become the full case study page. Do not render the case study as a nested card or boxed section inside the homepage feed.
- The case study route should be shareable, support browser back/forward, and own its scroll position.
- Homepage cards with completed case studies should link to the local route. Coming-soon work should not link away.
- Reuse `app/components/portfolio-shell.tsx` for case study pages so the left sidebar remains consistent across the portfolio.

### Case Study Design Workflow

Do not jump directly from old Framer page to full implementation. Follow these checkpoints for high-quality case study work:

1. Inventory first: scan the old page and list every text block, image, icon, logo, UI fragment, video, feature link, metric, credit, and metadata item.
2. Asset map second: download assets locally, then map each local file to its original page order, nearby text, and intended narrative role.
3. Asset grading third: classify each asset as `Hero`, `Core proof`, `Supporting proof`, `UI detail`, `Icon/mark`, `Decorative`, `Feature preview`, or `Maybe omit`.
4. Wireframe before code: propose the section order, layout rhythm, asset placement, and motion treatment before writing the final UI.
5. Implement by checkpoint: first screen, then one representative section, then full page, then polish. Avoid one-shot full-page implementation when the design direction is still unvalidated.
6. Final scan: before calling the work complete, rescan the local page against the source inventory. Missing text, images, icons, videos, or feature links must be intentional and documented, not accidental.

When the user asks to fully preserve an old case study, source order is the baseline. Improve layout quality after the order and coverage are correct.

### Case Study Visual Direction

- Each case study can have its own right-side background color, surface treatment, and media rhythm.
- The left sidebar should be theme-aware and adapt to the case study background. It does not need to be identical, but it should feel related and maintain enough tonal separation from the right canvas.
- Avoid a generic one-size-fits-all case study template. Use the source project's visual language, content density, and asset types to tune layout.
- For dark case studies, prefer a full dark right canvas over a dark panel nested inside a white page.
- Keep the left inset sidebar treatment: slight page margin, comfortable radius, no heavy shadow unless specifically requested.
- Do not put every text block inside a card or container. Narrative paragraphs can sit directly on the page background; reserve cards for metadata, metrics, credits, callouts, grouped proof points, or UI/media modules that need a distinct surface.
- Use empty space, max-width, type scale, and section rhythm to create hierarchy before adding another box.
- Do not mechanically place every migrated asset into equal-weight cards just to prove it was included.
- Before placing each asset, identify its role: core hero/media proof, supporting process visual, UI component state, icon/mark, decorative detail, or navigation/link preview.
- Core visuals and meaningful videos can occupy large modules. Small icons, marks, and component-state details should appear near the specific narrative they support, usually as inline details, small chips, captions, or supporting callouts.
- Do not create a standalone row of low-information icon cards in the middle of a case study unless those icons are themselves the project deliverable.
- If an old page contains small icons or decorative assets, preserve them locally but integrate them with hierarchy and context. Do not let them interrupt the reading flow.
- Hero images should usually be treated as the first visual anchor of a case study. When the image is already a complete composition, do not wrap it in an extra card background, border, or padding; use restrained radius and enough top breathing room instead.
- Images and videos should preserve their own aspect ratio. Do not force media into arbitrary `aspect-*` boxes, do not stretch, and avoid `object-cover` unless the user explicitly asks for a crop.
- Do not wrap standalone images or videos in extra visual containers. Use the media element itself with appropriate width, height, radius, and spacing; reserve containers for mixed content modules where text and media must belong together.
- The right-side case study canvas should have a max content width on large displays so long-form pages do not stretch endlessly. Use a width that preserves cinematic media scale without making text and cards too wide.
- Metadata and credit cards are supporting information, not hero modules. Keep their padding, type size, tracking, icon size, and border contrast quieter than the main title and core media.
- Icons inside metadata cards should share a consistent optical size and color treatment. Avoid unnecessary icon background pills or hidden spacing containers unless they solve a real alignment problem.
- If an icon appears vertically misaligned with nearby text, check for invisible wrapper size, padding, line-height, and margin before changing the icon asset itself.

### Case Study Content And Motion

- Preserve key source content: title, date, overview, role, skills, platform, metrics, patents, process sections, feature links, and credits where available.
- Do not add new explanatory case study copy unless the user explicitly asks for writing help or approves the new copy. If the old source page does not contain a paragraph, do not invent one to fill layout space.
- Use local autoplay muted video loops when they explain interaction or motion design. Do not use motion as decoration only.
- Add subtle right-pane entry motion only when it supports orientation. Respect `prefers-reduced-motion`.
- Keep content readable: large hero, concise overview, strong section labels, generous media spacing, and clear image/video captions when helpful.

### Visual Tokens

> Full value tables live in **[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)** (color ramp, type scale, radii, shadows, motion, component specs). The section below keeps the rationale and the most-used tokens.

These tokens emerged from the TikTok TV revamp. Treat them as the default vocabulary for case study pages; deviate only when the source project's visual language demands it.

**Type scale**

- H1 (case title): `clamp(2rem,3.4vw,3rem)` / weight `font-medium` / tracking `-0.03em` / leading `1`
- H2 (section title): `text-3xl sm:text-4xl` / weight `font-medium` / tracking `-0.025em` / leading `1.05`
- H3 sub-heading: `text-[1.375rem] sm:text-[1.5rem]` / weight `font-semibold` / tracking `-0.02em`
- H3 card title / in-page label: `text-xl` / weight `font-semibold` / tracking `-0.02em`
- Body: `text-base leading-7 text-white/64`
- Lead paragraph (overview / hero copy): `text-lg leading-8 text-white/72`
- Stat number: `clamp(2.25rem,4vw,3.5rem)` / tracking `-0.04em`

Do not skip from H2 (30-36px) to H3 card title (20px). When a chapter has internal sub-units, use the H3 sub-heading (22-24px) as the in-between. Cap stat numbers at `~3.5rem` (56px @ 1440) — anything larger competes with the H2 and shifts the page into "data sheet" territory.

Headings use `font-medium` (500). H3 sub-headings and card titles stay at `font-semibold` (600) so they retain visual weight against denser surrounding content. Body remains `font-normal`. Avoid `font-bold` and `font-semibold` on H1/H2 — Medium weight is the portfolio's editorial signature.

**Eyebrow tokens (limit to two)**

- `eyebrowSection`: `text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40` — above H2 titles
- `eyebrowMeta`: `text-[10px] font-semibold uppercase tracking-[0.14em] text-white/36` — above metadata values and stat numbers

Do not introduce a third variant. Inconsistent eyebrow sizes are the most common visual-system bug in case study work.

**Surface tokens**

- `surfaceQuiet`: `border border-white/[0.05] bg-white/[0.025]` — metadata strip and similar quiet containers
- `surfaceDefault`: `border border-white/[0.06] bg-white/[0.04]` — standard cards (credits, patent, feature, stat)

Borders below `white/[0.05]` on dark backgrounds become invisible. If a container is supposed to read as a surface, use one of these tokens — the rounded corner alone will not communicate a boundary.

**Body opacity (limit to three)**

- `text-white/90+` — emphasized body / inline highlights
- `text-white/64` — default paragraph (default for `bodyMd`)
- `text-white/56` — list items / card body / captions

**Inline emphasis (`<strong>`)**

Source Framer pages mark in-paragraph emphasis by switching the run from the body font (e.g. Matter Regular, dim) to a SemiBold variant **and** brightening the color. Migrate that as a single reusable token, not ad-hoc per page:

```tsx
const emphasis = "font-semibold text-white/90"; // brighter + heavier than bodyMd
// usage — always the semantic tag, never a styled <span>, for accessibility:
<strong className={emphasis}>90 seconds</strong>
```

- Use the semantic `<strong>` element (not a `<span>`) so the emphasis is conveyed to assistive tech.
- Emphasis = **both** weight (`font-semibold` / 600, matching the source SemiBold) **and** brightness (`text-white/90`, the inline-highlight opacity). Do not bump only one.
- When migrating a case study, recover emphasis from the **source byte order**, not memory — see *Verify by source byte order*. Map it to the equivalent words even if the copy was lightly rewritten; do not invent new emphasis the source didn't have.
- Keep it restrained: mirror how few words the source bolded. Structural labels (e.g. `V1:`) may use `font-semibold text-white` (pure white) since a label can read brighter than inline body emphasis.
- On a light case-study canvas, invert to the black-scale equivalent (`font-semibold text-black/90`).

**Radii**

- `rounded-[1.75rem]` — hero image
- `rounded-[1.5rem]` — media (image / video / diagram)
- `rounded-[1.25rem]` — cards / metadata blocks

### Layout Patterns

**Vertical spacing scale**

Settle on one hierarchy across the whole portfolio. Default values that read as "editorial, not cramped":

- Eyebrow → H2: **16px** (`mt-4`) — tight on purpose, eyebrow + title is one unit
- H1 / H2 → first content (paragraph or grid): **32px** (`mt-8`)
- SubHeading (H3) → first paragraph: **20px** (`mt-5`)
- Between paragraphs in a stack: **28px** (`gap-7` on a `flex flex-col`)
- Between paragraph block and media: **40px** (`mt-10`)
- Sub-section → sub-section inside a chapter: **80px** (`mt-20`)
- Major chapter → chapter: **160px** (`gap-40` on the chapter container)

Paragraph stacks at 16-20px on `text-base leading-7` body read as cramped because line-height already eats most of the gap — push to 24-28px for editorial pacing. Conversely, eyebrow → H2 at 8-16px is correct, because the eyebrow exists to introduce the title (they are one unit).

**Use flex + gap, not space-y**

Tailwind v4 + Turbopack in this project does NOT generate `space-y-*` reliably (verified missing for `space-y-32`, `space-y-40`, possibly others). Use `flex flex-col gap-N` for any vertical sibling spacing. Migrate any existing `space-y-N` if it appears not to apply.

**Sub-heading + media row**

For a sub-section with a single paragraph + media, put the SubHeading INSIDE the left column alongside the paragraph, so it top-aligns with the right column media:

```tsx
<div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
  <div>
    <SubHeading>...</SubHeading>
    <p className="mt-6 text-base leading-7 text-white/64">...</p>
  </div>
  <VideoFrame src="..." />
</div>
```

Putting the SubHeading outside / above the grid breaks the alignment between heading and media — avoid.

**Sticky media — selective**

Apply `lg:sticky lg:top-8 lg:self-start` to the media column when the LEFT column has 3+ paragraphs or ~400px+ of stacked text. The media pins while text scrolls past — appropriate for content-dense sub-sections (e.g., `Cold start loading`).

Do NOT apply sticky when:
- The left column has only 1-2 short paragraphs — the media has nothing to "stick" against and the effect is invisible
- The natural rhythm is "paragraph → video → paragraph" bracketing — sticky disrupts the framing (e.g., `A vast window of TV` rejected sticky for this reason)

**Eyebrow + paragraph alignment**

When eyebrow and paragraph sit side-by-side in a grid, add `lg:items-baseline` to the grid container. Without it, the small uppercase eyebrow and the larger paragraph's first line do not visually align — `items-baseline` is the only natural alignment.

For short paragraphs or narrow viewports, stack vertically (eyebrow above, paragraph below with `mt-5`) — equally valid.

**Text + video row rhythm**

Within one chapter that has 3+ text+video rows: break the rhythm at least once. Most rows can stay 2-col (text + video); make at least one stacked (text-top + video-bottom). Four identical 2-col rows in sequence feels monotonous.

**Card vs naked text — extended rule**

A label + paragraph does NOT need a card wrapper if it sits directly under a media element that visually "groups" them. Example: Horizontal Focus / Vertical Focus labels + descriptions sit naked under their videos — the video is the visual container.

Use card chrome only when:
- The text needs to separate from surrounding visual flow (metadata, credits, callout)
- Multiple text blocks need grouping without an accompanying media
- The card itself is a stat/feature container (not just paragraph storage)

**Stat card pairing**

When multiple stats share semantic context (e.g., DAU + Android share + Web share), put them in ONE card with one shared type scale, not separate cards with different visual weight. Each stat: eyebrow + number at the same size token. Soften less-emphasized stats with opacity (`text-white/72` for the smaller share, etc.). Do not give equal-weight cards to one absolute number and two percentages — the reader will read all three as independent KPIs.

**Grid breakpoints**

Content area is ~1004px on a 1440 viewport (after 324px sidebar + margins). Tailwind `xl:` (1280px) does NOT match this content width, so `xl:grid-cols-N` will collapse to single column on most desktops. Use `lg:` (1024px) or `sm:` (640px) for case study multi-col grids.

**Page container max-width is shared across pages**

Both the homepage and every case study constrain content to `max-w-[1280px]` with `mx-auto`. Case studies put it on the `<article>` itself; the homepage wraps `PortfolioShell` children in `<div className="mx-auto w-full max-w-[1280px]">`. On viewports under ~1716px nothing changes (content is already narrower than 1280); above that, the constraint keeps the right canvas from sprawling on wide displays.

**Experience-card pattern (Home Experience section)**

The card on the homepage uses a responsive header that stacks on mobile and lines up on `sm+`:

```tsx
<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
  <h3 className="text-xl font-semibold leading-[1.2] tracking-[-0.03em]">{company}</h3>
  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40 sm:shrink-0">
    {date}
  </p>
</div>
<p className="mt-2 text-sm font-medium tracking-[-0.015em] text-black/60 sm:mt-1">{role}</p>
```

- Date is rendered as an eyebrow (10px, 0.14em tracking, uppercase, `text-black/40`) — small enough to nest as supporting metadata, not compete with the company name.
- On `sm+` it sits in the top-right; on mobile it stacks below the company. `items-baseline` aligns the small caps to the H3 baseline.
- Skill tags use a **filled** neutral chip (`bg-black/[0.04] rounded-full px-3 py-1.5 text-[11px]`), no border. Filled chips read as a system; outline-only chips read as a checklist.
- Card hover: `hover:-translate-y-0.5` + a slightly bigger shadow. Same micro-interaction language as the work-grid cards.

### Content Voice

**Active voice + specific outcome**

Default to active verbs:
- "We wanted X to feel like Y" — not "We hope X can become Y"
- "Motion responds to remote input" — not "Motion is interactive"
- "We solved it with layered transparent color" — not "We adopted the approach of using transparent color"

Avoid corporate filler:
- "plays a crucial role"
- "influencing everything from X to Y"
- "to enhance the user experience"
- "create an experience that allows users to perceive"

**Transition phrases**

End paragraphs that precede media with a phrase that points into the media:
- "...not just a flat surface to scroll on." → next: video showing depth
- "...three principles covered below: dynamic backgrounds, in & out transitions, and cold-start loading." → next: three sub-sections

These bridges reduce the cognitive jump between text and demo.

**Don't duplicate content**

If a sentence is restated almost verbatim in both a paragraph and a card, delete one. The TextCard "Cold start loading rule" was removed for duplicating the body paragraph.

**Source fidelity over compression**

When migrating a case study, preserve every old sub-heading and paragraph by default. Collapsing structure during migration is a common regression — it costs the reader navigational anchors and removes narrative breaks the original author intended. Restore separated sub-headings unless the user explicitly approves the collapse.

**Verify by source byte order, not by AI summary**

Tools like WebFetch run an LLM over the rendered text and tend to flatten structure (multiple `<h2>` get merged into "the overview"; images and charts disappear because they're not text). For any case study migration, also do a raw scan:

```bash
curl -sL <source-url> > /tmp/page.html
python3 -c "import re; d=open('/tmp/page.html','rb').read();
  marks = ['Overview', 'According to', 'PROBLEMS', 'NEW', '%', ...some image hash];
  for m in marks:
    for x in re.finditer(re.escape(m.encode()), d): print(x.start(), m)"
```

Then sort by byte position. The resulting order is the truth — if "Choice impact" sits between paragraph 1 and paragraph 2, the original page had two distinct sections, not one Overview with two paragraphs. We discovered three full case-study sections this way that the WebFetch summary had silently collapsed.

**Data visualizations are core proof, not decoration**

When the source has a chart, percentage breakdown, or numeric callout next to a claim, that visualization IS the evidence. Migrate it as-is (e.g., the 9-card category-penetration breakdown that proves "Categories tab is a dead zone"). Don't summarize it into a sentence. The numbers carry weight that prose can't.

**Image-text adjacency is meaningful**

If an image sits in the source HTML between paragraph A and paragraph B, it belongs WITH paragraph A (it's the visual proof for the claim just made). Don't push the image down to "introduce the next section". The original author placed it deliberately. Use byte-offset scanning to find which paragraph each image is adjacent to.

### Case Study Theming

A case study may set its own right-canvas background color. The sidebar must adapt to maintain tonal separation.

TikTok TV defaults:
- Right canvas: `#161616` (main + content)
- Sidebar (`tiktok-tv` theme panel): `#0E0E0E` — about 8 units darker, gives an inset "deeper rail" feel

Rules:
- In dark case studies, the sidebar must NOT be lighter than the canvas (feels inverted)
- Maintain a ~6-12 unit RGB difference for visible tonal separation without competing contrast
- Translucent surface tokens (`bg-white/[0.04]` etc.) render at different intensities depending on the base — verify card visibility after changing the canvas color

**A light page stays fully light — no dark bands.** Some old-site case studies render a section on a dark background (e.g. TikTok Restructure "Problems"). Do NOT copy that dark background onto a light migration page. Carry over only the section's *layout* (e.g. a two-column "left paragraph + right icon cards" block) rendered with the light `--cs-*` tokens. (Tony, 2026-06-20: "如果它全是 light mode 的话，就不要有黑色背景出现了。") Ref: `app/work/tiktok-restructure/page.tsx` Problems section.

**Icons come from `lucide-react`.** The installed icon library is `lucide-react` (works in server components — no `"use client"`). Match the old-site glyph by shape (e.g. red stacked waves → `Waves` tinted `text-[#f75757]`), size with `size-5`, `strokeWidth={2.5}`, `aria-hidden` when decorative. Don't hand-roll inline `<svg>` for standard glyphs. DESIGN_SYSTEM §7 (Icons).

### Cursor System

The portfolio uses a custom cursor (`app/components/custom-cursor.tsx` + styles in `app/globals.css`). Native cursor is hidden on `pointer: fine` devices; touch devices fall back to the system cursor.

**Three states**:

| State | Trigger | Visual |
|---|---|---|
| `default` | Anywhere not interactive | 6px white dot + 32px white-border ring, `mix-blend-mode: difference` |
| `hover` | Auto-detected on `<a>`, `<button>`, `<input>`, `<textarea>`, `<select>`, `<label>`, `<summary>` | Ring grows to 44px, border brightens |
| `view` | Explicit `data-cursor="view"` on the element | Ring grows to 48px filled white, with a black eyeball SVG that double-blinks every 3.6s |

**Rule: case study cards always use the eye cursor**

Every card on the homepage Work grid that represents a real case study (`period: "Case Study"`) must carry `data-cursor="view"` — whether it is already a live `Link` (route exists) or still an `article` placeholder (route coming later). Visual hover language is shared across the work grid; the eye cursor is the portfolio's signal for "this is a case study to open".

Cards with `period: "Coming Soon"` should NOT get the eye cursor — they aren't viewable yet, and the eye is a promise that the click leads somewhere.

When a sub-feature card (e.g. the Features grid inside a case study) gets converted into its own case-study Link in the future, swap `<article>` → `<Link href="...">` and add `data-cursor="view"` in the same change.

**Implementation reminders**:
- The auto-detect for `hover` state means standard `<a>` and `<button>` elements don't need `data-cursor` attributes
- Reserve `data-cursor="view"` for case study openers (homepage work grid, future sub-feature cards) — do not over-apply it
- Respect `prefers-reduced-motion`: lerp smoothing already falls back to 1:1 in the cursor component; eye blink animation is paused via the project-wide reduced-motion media query in `globals.css`

### Motion System

Animations use **Framer Motion** (`framer-motion`, imported as `motion` / `useReducedMotion`). Three reusable primitives live in `app/components/motion.tsx`. Each must stay a client component (`"use client"`) and is imported into server-component pages as a child.

**Three primitives**:

| Primitive | Use | Behavior |
|---|---|---|
| `Reveal` | Wrap each individual content block — paragraph stack, media, sub-section, stat card | Renders `motion.div` (or `motion.section` via `as="section"`). Fades + slides up 48px when *that* block scrolls into view. Each instance has its own `whileInView once: true` trigger |
| `StaggerGrid` + `StaggerItem` | Any multi-card grid (homepage work, 2×2 image grid, 3-col features, related case studies) | `StaggerGrid` auto-detects its `grid-template-columns` via `ResizeObserver` and provides `cols` via Context. `StaggerItem` reads `cols` and computes `delay = (index % cols) * 0.08` so cards cascade **left → right** within each row, and each row resets the cascade |
| `app/template.tsx` | Page transition | Re-mounts on every route change; whole page fades opacity 0→1 (550ms). No y-slide so it does NOT compete with Reveal's slide |

**Animation ordering rule (top → bottom, left → right)**:

All scroll-reveal animations must fire in **top-to-bottom, left-to-right** reading order:

- Stacked single-column blocks: each `<Reveal>` has its own viewport trigger, so naturally top blocks fire first as you scroll down. Good by default.
- Multi-card grids: ALWAYS use `<StaggerGrid>` + `<StaggerItem index={i}>` (never roll your own `index % N` — `StaggerGrid` knows the real column count). The cascade resets row-by-row so each row reads left → right.
- Two side-by-side blocks (e.g. text-left + media-right): wrap *both* in a single `<Reveal>` if they're a coherent unit; do not stagger them separately — visually they should arrive together.

**Other rules**:
- Standard ease across the system: `cubic-bezier(0.22, 1, 0.36, 1)`. Reveal 750ms, stagger item 700ms, page transition 550ms.
- Every primitive checks `useReducedMotion()` and renders static (no transform/opacity animation) when the user prefers reduced motion. Any new motion component MUST do the same.
- Do NOT stack `Reveal` first-paint animation on top of the `template` page transition. `right-pane-enter` (the old CSS entrance) was removed for this reason. The template owns first-paint fade; Reveal owns scroll-into-view slide.
- Smooth in-page anchor scroll uses the `<SmoothAnchor>` client component (`app/components/smooth-anchor.tsx`), NOT CSS `scroll-behavior`. Use it in place of a raw `<a href="#...">` whenever you want the click to scroll smoothly instead of jump.
  - It intercepts left-click without modifiers, calls `target.scrollIntoView({behavior: "smooth", block: "start"})`, and `history.pushState`s the hash so the URL updates without snapping the page.
  - Cmd/Ctrl/Shift/Alt-click, right-click, and missing-target cases fall through to the native anchor behaviour, so accessibility and "open in new tab" still work.
  - Why JS instead of CSS: we previously tried `<html data-scroll-behavior="smooth">` + `[data-scroll-behavior="smooth"] { scroll-behavior: smooth }` in `globals.css`. Tailwind v4 + Turbopack HMR has dropped that attribute-selector rule from the compiled stylesheet multiple times during this project, silently breaking smooth scroll. JS interception is HMR-immune. The CSS `data-scroll-behavior` plumbing in `layout.tsx` / `globals.css` is kept as a belt-and-suspenders fallback, but `<SmoothAnchor>` is what we rely on.
  - The target section should still set `scroll-mt-8` (or similar) so the section's top lands a comfortable distance below the floating header instead of flush against the viewport edge.
- **Programmatic scroll resets must pass `behavior: "instant"`.** Because `<html>` carries the global `scroll-behavior: smooth`, a bare `window.scrollTo(0, 0)` *animates* up from wherever the page was restored — the visible "scrolling up from the middle" bug. `ScrollReset` (`app/components/scroll-reset.tsx`) lands every load at the top and must stay instant. It also listens to `pageshow` with `persisted`: back/forward **bfcache** restores re-show the page without re-running React effects, so a mount effect alone leaves the old scroll position stuck — `pageshow` is the only reset signal for that case.
- `motion.*` components require `"use client"`. Keep them in small wrapper components so the page files can stay server components.
- **`ScrollRevealText`** (`app/components/scroll-reveal-text.tsx`) — scroll-driven text highlight for fact/stat statements: one paragraph, one size, grey→white word-by-word via `useScroll` + per-word `useTransform` opacity (0.22→1). Takes `segments: {text, bold?}[]` so emphasis is weight-only. Respects reduced-motion (renders fully white, no scroll binding).
- **`HoverVideo`** (`app/components/hover-video.tsx`) — "Hover to play" clips (the source's wireframe/comparison demos): plays on pointer-enter, pauses+rewinds on leave, taps toggle on touch, with a "Hover to play" badge that fades while playing. Use for demo clips the source only plays on hover; use the autoplay `VideoFrame` for ambient loops.
- **`ScrollSteps`** (`app/components/scroll-steps.tsx`) — pinned scroll-story: the right image panel stays fixed (`sticky top-0 h-screen`) while a left column of text steps scrolls up through it; the step nearest the viewport center brightens grey→white (continuous, scroll-linked). The image **snaps** to the active step (discrete index via `useMotionValueEvent` → `animate` opacity + a 0.2s fade), NOT bound to scroll progress, so it never sits half-faded mid-scroll. Takes `steps: {value, caption, image}[]` — `value` = small grey label (e.g. "Only 3 steps"), `caption` = a paragraph-scale line describing the image (NOT a big title; ~18px). Source captions here are descriptive paragraphs, not headings — size them as body, not as `SubHeading`. Desktop (`lg+`) only — below `lg` and under reduced-motion it renders a plain stacked list (image + caption per step, `mt-5` gap). Use for the source's "decreasing-step" / synced text-and-image scroll narratives (e.g. TikTok TV search Keyboard). The CSS split (`hidden lg:block` / `lg:hidden`), not JS measurement, drives responsive — needed because rAF/ResizeObserver are throttled in a backgrounded preview tab.
- **Framer `useTransform` input ranges MUST stay within `[0, 1]` and be strictly increasing.** A range like `[-0.33, 0, 0.33]` or `[0.66, 1, 1.33]` (peaks placed at `i/(n-1)` for the first/last item) makes framer-motion crash at runtime with `Failed to execute 'animate' on 'Element': Offsets must be monotonically non-decreasing` — it normalises out-of-bound inputs into negative WAAPI keyframe offsets. Put peaks at band centers `(i+0.5)/n` and clamp the first/last band to `0`/`1` (see `bandRange` in `scroll-steps.tsx`). Also pass `initial={false}` on scroll-driven `motion` elements so no mount animation fires. This bug renders fine on the server (SSR HTML is produced) but throws on client hydration → "This page couldn't load" overlay; check `preview_logs`/the nextjs-portal shadow DOM for the real error.
- **Shared case-study blocks** live in `app/components/case-study.tsx` (`CaseSection`, `SubHeading`, `MediaCaption`, `ImageFrame`, `VideoFrame`) — import these in new case studies instead of re-declaring them. Title hierarchy: `CaseSection` = h2 section title; `CaseSection … compact` = smaller h3 for a subordinate sub-feature/demo section (e.g. search → Keyboard); `SubHeading` = sub-section heading **above** a text+media block; `MediaCaption` = the small title **under** an image/video card (smaller than SubHeading — it's a label, not a heading). Never use `SubHeading` for an under-media caption (use `MediaCaption`); `npm run check` enforces both this and the `mt-5` media→caption gap.
- Do NOT wrap a `<Reveal>` around an element whose descendants use `position: sticky` — the motion transform creates a containing block that breaks sticky behavior.

### Case Study Navigation: Next-Section Button

Every case study page mounts `<NextSectionButton />` (`app/components/next-section-button.tsx`) as a sibling of the `<article>` inside `PortfolioShell`. It's a single floating glassmorphic pill anchored at viewport-bottom-center that tells the reader what's next and one-clicks them there.

**Rule: every CaseSection MUST mark itself with `data-case-section`**

The button discovers navigable sections by querying `article section[data-case-section]`. Without that attribute, the section is invisible to the navigator. Conversely, do NOT add `data-case-section` to layout wrappers that happen to be `<section>` elements (e.g., the Patents/Credits row, the title section with H1) — only the real chapters of the case study get marked.

The `CaseSection` helper component in each case study page applies the attribute automatically, so anything wrapped in it is fine. Sections built ad-hoc need the attribute added by hand.

**Behavior**:
- Scroll-based detection (rAF-throttled), NOT IntersectionObserver. The handler reads each section's `getBoundingClientRect().top` against a single trigger line at `window.innerHeight * 0.35`. Active = the last (highest-index) section whose top has crossed that line. Sections are in document order so the loop breaks early once we hit one that hasn't.
- Why not IO: a thin observer band (e.g. `rootMargin: "-35% 0px -55% 0px"`) has a "dead zone" — short sections can pass through it between scroll events without ever firing the `isIntersecting: true` callback. With ~450px-tall chapters in this case study, that left `activeIdx` stuck on the previous section. A scroll-driven check has no such gap.
- The button always points to `sections[activeIdx + 1]`.
- **The pill label IS the section's H2 text, read from the DOM at runtime.** It is NOT hardcoded — so the locator auto-stays-in-sync as you add/remove/reorder sections; there is nothing to manually update. (Standing rule, Tony 2026-06-20: any time you add a section or content, the locator content is auto-checked — and because it derives from the live H2, "checking" = making sure the section is a `data-case-section` with a sane H2.)
- **Section-title length matters for the pill.** The pill is `whitespace-nowrap`, so an over-long H2 widens it and overflows on mobile (~375px). Keep `CaseSection title="…"` **≤ 38 chars**. `scripts/check.mjs` warns (doesn't fail) on any `app/work/**` section title over 38. The H1 / page title is NOT in the locator (only `data-case-section` H2s are), so its length is irrelevant to the pill. If a section title must be long for the page, shorten the visible H2 itself (preferred per Tony) — the pill follows automatically.
- **Auto-invert over light surfaces (Tony 2026-06-20).** The pill samples what's directly behind it each scroll frame (`document.elementsFromPoint` at 3 points, skipping the pill + its ancestors) and flips to its **light** variant while the topmost surface behind it is light — i.e. inside `[data-pill-invert]` or a `.screen-shadow` image. So the dark frosted chrome stays legible when it overlaps white imagery (e.g. the Design System component marquee, which carries `data-pill-invert`). Mark any full-bleed bright band the pill can overlap with `data-pill-invert`; single light images already self-mark via `.screen-shadow`. Other pages have neither marker, so the pill never inverts there.
- Initial `activeIdx = -1`, so before any section crosses the trigger line (page top), the button correctly points at the *first* section.
- **Bottom-of-page guard**: if `window.innerHeight + window.scrollY >= scrollHeight - 2`, force `active = list.length - 1`. Otherwise a short final section whose top can never reach the 35% trigger (not enough page below it) would leave the button perpetually pointed at itself.
- When the last section becomes active, `activeIdx + 1` is out of range → the button unmounts via `AnimatePresence` exit.
- Click triggers `scrollIntoView({ behavior: "smooth", block: "start" })`. The `<html data-scroll-behavior="smooth">` attribute is what makes that smooth scroll work without breaking Next route-transition behavior.

**Visual contract (glassmorphic pill)**:
- `bg-white/[0.06]` + `border-white/12` + `backdrop-blur-xl backdrop-saturate-150` — sits on the dark canvas without dominating it
- `shadow-[0_10px_32px_rgba(0,0,0,0.4)]` — a soft floor shadow that signals "floating"
- Material Design `arrow_downward` SVG path (NOT a unicode arrow) at 14px, with a slow `y: [0, 2, 0]` infinite breathing loop to imply "down"
- Pill width is stabilized by an invisible width-reserver span behind the animated label, so the pill never resizes mid-crossfade

**Motion contract**:
- Mount: `opacity 0 + y 28 + scale 0.94 → opacity 1 + y 0 + scale 1`, 450ms `cubic-bezier(0.22, 1, 0.36, 1)`
- Hover: `whileHover={{ y: -3 }}` — lifts the entire pill, no Tailwind transform on the button itself (would conflict with framer-motion's transform)
- Tap: `whileTap={{ scale: 0.96, y: 0 }}` — small press
- Label change: `AnimatePresence mode="wait"` crossfades the title — old label slides up 10px and fades out, new label fades in from below
- Exit: opposite of mount when no next section exists

**Anti-patterns**:
- Don't combine Tailwind `hover:-translate-y-*` with `whileHover={{ y }}` on the same element — pick one source of truth for transform.
- Don't position the button via `transform: translateX(-50%)` on the same element that gets motion transforms — wrap with a positioning div, animate the inner element only.
- Don't apply `data-case-section` to layout-only sections — the navigator will surface meaningless titles.
- Don't switch active-section detection back to a thin IntersectionObserver band — short sections will slip through and the button will lag/freeze. Keep the rAF-throttled scroll handler + bottom-of-page guard.

## Design Skills To Apply

Three design skills are **installed and callable** for this portfolio. For any task that touches the visual experience, decide which to invoke **before** editing — they are real tools, not just mindsets. Invoke them through the `Skill` tool (or, for `ui-ux-pro-max`, its `search.py` CLI). They supplement the rules in this doc; **they never override the established design system above.** When a skill's generic default conflicts with a token, layout pattern, or motion rule defined in this doc, **this doc wins.**

### The three installed skills and when to auto-invoke them

| Skill | Role | Auto-invoke when the task is… |
|---|---|---|
| `frontend-design` | **Generative** — creative composition, atmosphere, motion choreography, distinctive layout | Building a NEW section, case study page, or homepage module from scratch; any "make this feel more crafted / less generic / more polished" request |
| `ui-ux-pro-max` | **Reference + review** — searchable DB: 67 styles, 96 palettes, 57 font pairings, 99 UX guidelines, 25 chart types, per-stack best practices | Choosing a chart / data-viz for a case study; weighing spacing, type, palette, or pattern options; auditing a page for UX or accessibility issues; "what pattern fits here?" |
| `web-design-guidelines` | **QA gate** — audits files against the Vercel Web Interface Guidelines, returns terse `file:line` findings | Before calling any page "done"; "review my UI", "check accessibility", "audit this page", "review UX" |

`deep-research` is also available — use it to source reference patterns (competitor portfolios, interaction precedents) when a creative direction is unvalidated and the Alex Nguyen reference is not enough.

### Guardrail: this portfolio is NOT a blank canvas

`frontend-design` is tuned to push **bold, unexpected, maximalist** directions and to avoid fonts like Inter. This portfolio has already committed to a specific aesthetic: **editorial-minimal, Medium-weight (500) headings, restrained dark/light case-study canvases, subtle Framer Motion reveals.** So when you invoke `frontend-design`:

- Treat the **Visual Tokens**, **Layout Patterns**, and **Motion System** sections above as the brief, not a blank starting point.
- Use the skill for *composition, rhythm, atmosphere, and motion choreography within those constraints* — not to swap the type system, introduce a loud palette, or add decorative motion the Motion System forbids.
- The one place bold creative direction belongs is a case study's own canvas: per **Case Study Visual Direction**, each case study may set its own background color, surface treatment, and media rhythm. Push creativity there, inside the token vocabulary.
- After a `frontend-design` pass, re-check the output against the Type scale, Eyebrow, Surface, Body-opacity, and Radii tokens. Reconcile any drift back to the tokens before moving on.

### How to query `ui-ux-pro-max`

This portfolio's design system is already defined in this doc, so do **not** regenerate one with `--design-system`. Use targeted domain searches instead (stack is `nextjs` + Tailwind v4):

```bash
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<keywords>" --domain chart        # case study data viz (penetration %, funnels, trends)
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<keywords>" --domain ux           # accessibility / animation / loading best practices
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<keywords>" --domain typography   # font-pairing alternatives
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<keywords>" --domain landing      # section order / CTA structure
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<keywords>" --stack nextjs        # Next.js implementation best practices
```

Charts matter most here — see **Data visualizations are core proof**. When a case study has a percentage breakdown, funnel, or trend, query `--domain chart` to pick the right chart type and its accessibility/library guidance before hand-building it.

### Skill-to-workflow mapping (case study build)

Tie the skills to the **Case Study Design Workflow** checkpoints:

1. **Inventory / Asset map / grading** — no skill; manual source scan. Use `deep-research` only if the creative direction is unclear and needs precedent.
2. **Wireframe** — `ui-ux-pro-max --domain landing` to validate section order; `--domain chart` to pick data-viz; `frontend-design` to set the canvas's creative direction (bounded by tokens).
3. **Implement** — `frontend-design` for composition + motion choreography, bounded by Visual Tokens / Motion System.
4. **Polish** — `ui-ux-pro-max --domain ux` for interaction and accessibility refinement.
5. **Final scan / QA** — `web-design-guidelines` audit (returns `file:line` findings) **plus** the manual Quality Checklist below, then `npm run lint`.

### Judgment lenses (applied through the skills, not as separate tools)

Keep these lenses active when the skills run — they are how to judge the output:

- **Portfolio / brand fit** — hierarchy, project presentation, credibility, senior-product-designer tone (Tony Xing).
- **Reference alignment** — compare structure, spacing, typography, and interaction against the Alex Nguyen-inspired reference before changing layout.
- **Typography & Visual** — type scale, line height, tracking, rhythm, color, surface, image treatment per the Visual Tokens.
- **Motion** — subtle, fast, accessible, reduced-motion-safe per the Motion System; motion must support clarity, never decorate.
- **Responsive** — desktop, tablet, mobile all work (content area is ~1004px at 1440; use `lg:` / `sm:`, not `xl:`).

### Migration concerns (moving old Framer content in)

- Extract old content + assets, rebuild as local Next.js routes (see **Case Study Page Model**).
- Move assets into `public/portfolio/`, use `next/image`, no remote production dependencies (see **Asset Rules**).
- Implement styles with the local Tailwind utility patterns and tokens above.
- **Match the source's content-block order EXACTLY** — the top-to-bottom sequence of every heading, paragraph, image, and video, including how text and media interleave (e.g. a paragraph split by two screenshots, a video between two paragraphs). Do **not** lump paragraphs together, move a media block to the end, or split one subsection into two. Don't invent paragraphs or captions to fill a layout (a "Tracking user attention" filler block once got added that wasn't in the source). Sequence is content — re-flowing it changes the story.
- **Match the source's text/media pairing layout too**, not just the vertical order: if the source puts a paragraph and its video side-by-side (text left, media right), build it as a two-column block (`grid lg:grid-cols-2`), not a stacked text-then-full-width-video. Stacked vs. side-by-side reads as a different design intent. The static HTML doesn't reveal this reliably (Framer uses breakpoint layout variants) — confirm it against the live rendered source visually.
- **Native (non-image) cards/components don't appear in the downloaded media — reconstruct them from the source CSS.** Framer renders things like the CloudKitchens "Identify problems" yellow sticky-note cards and "Hypothesis" white cards as HTML+CSS, not exported images, so they're missing from the `curl ... framerusercontent` asset list and easy to skip. When a section is text-in-styled-cards, `curl` the page HTML and grep the `<style>` rules for the card class (`grep -oE '\{[^{}]*#ffe563[^{}]*\}'`, or resolve the `framer-xxxx` class on the text element) to lift the exact `background-color` / `border` / `border-radius` / `box-shadow` / `padding`. Real values recovered this way: problem cards `#ffe563` bg / `#d1c70a` border / 8px radius / `2px 2px 8px #00000029` shadow; hypothesis cards `#fff` / `#e6e6e6` border / 8px / `2px 2px 8px #0000001a` with a `#f75757` label. These are fixed brand colours — hardcode them, don't route through `--cs-*`.
- **Only the TikTok TV Revamp case studies show a bottom "More work" / related-cases section** (`/work/tiktok-tv-visual|navigation|profile|search`). Every OTHER case study (CloudKitchens, TikTok Restructure, Multi-Platform, Design System, TikCode, …) ends at its last content section — do NOT add a "More work" / "Continue exploring" related grid. (Tony's call: the TV sub-features cross-link each other; standalone cases don't.)
- **When Tony says a heading/section/title is missing or different, GO LOOK at the old live site before answering — do not claim from memory that "it never existed" or guess placement.** The old Framer site is at `https://tongxingdesign.com/<slug>` (e.g. `/tiktok-tv-search`, `/tiktok-tv-navigation`). `WebFetch` returns its **text** reliably (headings/sub-headings/copy/order come through even though images lazy-load), so it is the fast way to verify presence and order of a sub-heading. Real example: the search "Redefine the user purpose" section has a `Structure` sub-heading (h3) above the Up-down/Left-right comparison; I repeatedly insisted it wasn't there instead of fetching the source — fetch first.
- **Animations must be ported too, and they're invisible in the source's static HTML.** The published Framer HTML only hints at scroll *appear* effects (look for `opacity:0` + `transform: ... translateY(20px)` → `transform:none`, i.e. fade + slide-up — replicate with `<Reveal>`, staggering fragments via its `delay` prop). Anything richer (the specific motion of a section, count-ups, sequenced reveals) you CANNOT read from code — you must watch the rendered source (Chrome / a screen recording). Building an animated section blind produces a static, restyled mismatch — if you can't observe it, say so and ask rather than inventing.
- **Don't impose the generic section chrome on a section that doesn't have it.** Not every section is `CaseSection` (eyebrow + big H2). Some are a kicker + a statement "moment" with no H2 — forcing the titled layout (and inventing a title like "Two profiles, two jobs") is a restyle. Match the source's actual section treatment.
- **A single paragraph stays a single paragraph, at one size.** Don't split one paragraph into multiple blocks, and don't make one part small and another part big — emphasis inside a statement is **weight only** (`font-semibold`), never a size or colour change. Restructuring a statement's typography is a restyle even if every word is preserved.
- **The "fact / stat statement" sections use a scroll-driven highlight** (grey base text that fills to white word-by-word as it scrolls through view — the source's two-layer effect). Render these with `<ScrollRevealText>` (see Motion System), NOT as a static paragraph and NOT with a plain `<Reveal>` fade. Tony described this effect himself; recognise stat/fact statements as candidates for it.
- **Do NOT guess a layout, and do NOT touch blocks outside the request.** Left-right vs. stacked, and which paragraphs group together, are facts about the source — never invent them. If a block's pairing is one you've actually verified, replicate it; otherwise leave it exactly as-is and ask. When the user points at ONE block, change only that block: don't also re-pair its neighbours (e.g. don't merge the preceding paragraph into the same column) or restyle a different subsection "for consistency." Over-reaching by guessing is the failure mode here — scope tightly.
- **How to recover the exact source order** (Framer lazy-loads media, so a plain fetch/`WebFetch` shows text but drops images). Pull the published HTML and tokenize it in DOM order:
  ```bash
  curl -s -A "Mozilla/5.0" <source-url> -o /tmp/src.html
  # then walk tags in order, emitting text + each <img>/<video> framerusercontent URL
  ```
  Local `tv-*` asset numbering already follows that DOM order (excluding the cover/thumbnail), so the Nth media in the source maps to the Nth-numbered local file. Verify after building by reading the rendered page's block order (`section.querySelectorAll('p,h2,h3,img,video')`) against the source list — they must match 1:1.

### Content concerns (writing / restructuring case studies)

- Organize around context, problem, role, process, solution, impact — but **preserve source structure first** (see **Source fidelity over compression**).
- Keep narrative clear, credible, outcome-oriented; do not invent copy (see **Case Study Content And Motion**).
- Decide what belongs in nav vs intro vs work feed vs experience vs detail page so the site does not repeat itself.
- Keep labels, CTAs, and section copy concise; tone aligned with Tony Xing as a senior product designer.

### Quality Checklist (before "done")

- Run `web-design-guidelines` on the changed files for an accessibility / Web Interface Guidelines audit.
- Accessibility: semantic structure, link behavior, contrast, keyboard-friendly interactions, focus states.
- Performance: no unnecessary scripts, no oversized images, no remote dependencies.
- Reduced motion: every motion primitive respects `prefers-reduced-motion`; no essential info depends on motion.
- QA: no broken links, no Framer leftovers, responsive layout holds, `npm run lint` passes (see **Validation Rules**).

## Content Source

Use Tony's existing portfolio content as source material:

- Name: Tony Xing.
- Role: Product Designer / Lead Product Designer.
- Current company: TikTok.
- Previous companies: Airbnb and CloudKitchens.
- Experience: DiDi, Airbnb, CloudKitchens, TikTok.
- About copy: 10+ years of design experience, cross-end multi-platform features, design systems, promotion tools, user-friendly and innovative solutions.
- Work items from the old site should be migrated into local pages and local assets, not linked back to Framer.

## Asset Rules

- Store migrated images under `public/portfolio/`.
- Reference images using local paths such as `/portfolio/tony-work-04.jpg`.
- If an asset still needs to be pulled from the old site, download it into the project first, then use the local version.
- Do not leave production UI dependent on `framerusercontent.com` URLs unless the user explicitly approves a temporary fallback.

## Link Rules

- Homepage project cards should point to local routes, not external Framer pages.
- If a local case study page does not exist yet, either:
  - point to the planned local route and create the page next, or
  - mark it clearly as coming soon without linking away.
- Do not add "Source site", "Current site", or similar links back to the old Framer portfolio.

## Dev Server Rules

To preview the site:

```bash
cd ~/Downloads/tony-portfolio
npm run dev
```

Open the exact `Local:` URL shown in the terminal.

- Usually this is `http://localhost:3000`.
- If port `3000` is occupied, Next may use `3001` or `3002`.
- Do not assume `3000` is always correct; confirm the terminal output or active port.

### Tailwind v4 + Turbopack HMR caveat

Some CSS edits (new custom class selectors, new `@keyframes`, new attribute selectors like `[data-scroll-behavior="smooth"]`, and several `space-y-*` / `lg:space-y-*` variants) are intermittently skipped by Turbopack's hot reload — the browser keeps serving the pre-edit stylesheet even though `globals.css` on disk is correct.

Symptoms:
- A newly added class / keyframe name doesn't appear in `Array.from(document.styleSheets).flatMap(s => [...s.cssRules]).map(r => r.cssText)`.
- A CSS animation/keyframe stays at its initial frame (`currentTime: 0`) even though `animationPlayState: 'running'`.
- A new utility like `lg:space-y-40` resolves to `0px` even though the parent has the class.

Recovery: stop the dev server, `rm -rf .next`, `npm run dev`. This has happened 3+ times on this project — it's the build tool, not the CSS. Don't waste time refactoring working CSS to "fix" a hot-reload miss.

Also worth knowing: the preview server's tab visibility freezes the document animation timeline. If `eval`-based debugging shows `document.hidden: true` and `currentTime: 0` on every keyframe, the animations are fine — the tab is just backgrounded. Verify on the user's actual visible browser tab before chasing phantom bugs.

## Validation Rules

After substantive edits:

- Run `npm run lint`.
- Run **`npm run check`** (`scripts/check.mjs`) — the static design-rule guard. It enforces the deterministically-checkable rules and fails the build on any violation: `space-y-*` banned (use flex gap), Framer residue, shared tokens re-declared instead of imported from `app/lib/tokens.ts`, and `xl:` in case studies. Add a new rule here whenever a rule becomes grep-checkable, rather than relying on memory.
- Check for remaining Framer dependencies with a search for `tongxingdesign.com`, `framer`, `framerusercontent.com`, `Source site`, and `Current site` (now also covered by `npm run check`).
- Confirm the preview port before telling the user where to view the site.

### Hero sticker placement + overlap check (process rule)

Hero stickers are **word-anchored**, not placed at a fixed `%`: each `TAGS` entry names a headline segment (`seg`), an edge to press (`side`), and an `align`, and `layoutTags` in `hero-intro.tsx` pins it to that word's live glyph rect (recomputed via `ResizeObserver`). A `%` relative to the container drifts off the text when the headline reflows; anchoring keeps every sticker kissing its word at any width. Below `NARROW_BP` a `narrow` override re-anchors the tags whose desktop edge would spill onto an adjacent line once the headline wraps.

The placement rule itself — **slight overlap, never far, never covering letter bodies** — is runtime geometry a grep can't see, so it is NOT in `npm run check`. It is enforced by **`scripts/hero-tag-overlap.js`**, which now checks **BOTH bounds**: `TOO_FAR` (a sticker that overlaps no word and sits > ~10px from the nearest one) and `COVERS_TOO_MUCH` (hides > 40% of any word). **After any change to sticker placement, anchoring, size, the headline copy, or `NARROW_BP`, run it via the preview eval tool at a wide AND a narrow width, and fix anything flagged before calling the hero done.** Checking only the upper bound is what once let stickers float away from the text — both bounds are the rule now, and running the check is part of the task, not a thing to remember.

> Preview caveat: a backgrounded preview tab pauses rAF AND ResizeObserver delivery and throttles timers, so positions may look stale/empty in a screenshot. The geometry returned by the detector is the source of truth; `layoutTags` also runs once synchronously on mount so a real (focused) browser positions immediately.

## Communication Rules

- Be clear when something is temporary.
- Do not say the redesign is complete if the page still depends on Framer project links.
- If only the homepage is implemented, say that local case study pages still need to be created.
- When the user reports a browser issue, first distinguish between code problems, dev server problems, and wrong-port problems.
