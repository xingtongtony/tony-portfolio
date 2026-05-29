# Tony Portfolio Working Rules

This document records the rules and lessons from rebuilding Tony Xing's portfolio from Framer to a self-hosted Next.js site. Follow these rules before making future design or code changes.

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

### Case Study Theming

A case study may set its own right-canvas background color. The sidebar must adapt to maintain tonal separation.

TikTok TV defaults:
- Right canvas: `#161616` (main + content)
- Sidebar (`tiktok-tv` theme panel): `#0E0E0E` — about 8 units darker, gives an inset "deeper rail" feel

Rules:
- In dark case studies, the sidebar must NOT be lighter than the canvas (feels inverted)
- Maintain a ~6-12 unit RGB difference for visible tonal separation without competing contrast
- Translucent surface tokens (`bg-white/[0.04]` etc.) render at different intensities depending on the base — verify card visibility after changing the canvas color

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

## Design Skills To Apply

For every future task, decide which skills are relevant before editing. Use the smallest useful combination, but do not skip design judgment when the task affects the portfolio experience.

### Default Skill Stack

Use these by default for portfolio design work:

- Portfolio Design: judge hierarchy, project presentation, credibility, and designer-personal-brand fit.
- Website Reverse Engineering: compare structure, spacing, typography, and interaction patterns against the reference site before changing layout.
- Typography: tune type scale, line height, tracking, rhythm, and readability.
- Visual Design: tune spacing, color, image treatment, card design, composition, visual rhythm, and overall polish.
- Motion Design: use subtle motion for transitions, hover states, scrolling moments, reveals, and interaction feedback when it improves clarity or delight.
- Responsive Web Design: ensure desktop, tablet, and mobile layouts all work.

### Visual And Motion Usage

Use Visual Design whenever changing:

- Layout composition.
- Color, contrast, surface treatment, borders, shadows, or image presentation.
- Typography hierarchy and spacing rhythm.
- Portfolio card design, section transitions, and overall page polish.

Use Motion Design whenever changing:

- Hover states.
- Scroll-based movement or marquee behavior.
- Section reveals, page transitions, or micro-interactions.
- Any interaction where motion can make the experience feel more crafted.

Keep motion restrained and portfolio-appropriate. Prefer subtle, fast, accessible transitions over heavy animation. Do not add motion that hurts readability, performance, or reduced-motion accessibility.

### Migration Skill Stack

Use these when moving old Framer content into the new site:

- Framer to Code Migration: extract old content and assets, then rebuild them as local Next.js pages.
- Image Optimization: move assets into `public/portfolio/`, use `next/image`, and avoid remote production dependencies.
- Next.js App Router: create local routes, layouts, metadata, and static case study pages.
- Tailwind CSS: implement styles consistently with local utility patterns.

### Content Skill Stack

Use these when writing or restructuring case studies:

- Case Study Writing: organize work around context, problem, role, process, solution, and impact.
- Product Design Storytelling: make the project narrative clear, credible, and outcome-oriented.
- Content Wiring: decide which content belongs in navigation, first-screen intro, work feed, experience, and case study detail pages so the site does not repeat itself.
- UX Writing: keep labels, CTAs, descriptions, and section copy concise and natural.
- Personal Branding: keep tone aligned with Tony Xing as a senior product designer.

### Quality Skill Stack

Use these before considering a task done:

- Accessibility: check semantic structure, link behavior, contrast, and keyboard-friendly interactions.
- Performance: avoid unnecessary scripts, oversized images, and remote dependencies.
- Reduced Motion: respect users who prefer less animation and avoid essential information depending on motion.
- QA Review: check for broken links, Framer leftovers, responsive layout issues, and lint errors.

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

## Validation Rules

After substantive edits:

- Run `npm run lint`.
- Check for remaining Framer dependencies with a search for `tongxingdesign.com`, `framer`, `framerusercontent.com`, `Source site`, and `Current site`.
- Confirm the preview port before telling the user where to view the site.

## Communication Rules

- Be clear when something is temporary.
- Do not say the redesign is complete if the page still depends on Framer project links.
- If only the homepage is implemented, say that local case study pages still need to be created.
- When the user reports a browser issue, first distinguish between code problems, dev server problems, and wrong-port problems.
