# Tony Portfolio — Design System

The **token reference** for this site: the real values in use, extracted from the code, plus a few gaps filled in. This is the source of truth for *what the values are*.

- For **how / when / why** (judgment rules, anti-patterns, process, content voice), see [`PORTFOLIO_WORKING_RULES.md`](./PORTFOLIO_WORKING_RULES.md). That doc owns the narrative rules; this one owns the value tables. When they overlap, values here win and rules there win.
- Stack: Next.js (App Router) · React · Tailwind v4 (`@theme` in `app/globals.css`, no `tailwind.config`).
- Two surface modes: **light** (homepage, `#ffffff` canvas, `text-black/*`) and **dark** (case studies, `#161616`/`#0E0E0E` canvas, `text-white/*`). Every token below has a light and a dark form.

Legend: ✅ = standard, in use · ➕ = added/normalized by this doc (adopt going forward) · ⚠️ = inconsistency or cleanup flagged.

---

## 1. Typography

### Fonts (`app/layout.tsx`)

| Role | Family | Loaded as | CSS var |
|---|---|---|---|
| Primary (UI, headings, body) | **Geist** | `next/font` Geist, latin | `--font-geist-sans` |
| Serif accent | **Newsreader** | italic 500 / 600 | `--font-serif` |
| Mono | Geist Mono | latin | `--font-geist-mono` ⚠️ **defined but unused — dead code, remove or use** |

- Body `font-feature-settings: "ss01","ss03","cv01"`; `text-rendering: geometricPrecision`; `antialiased` on `<html>`.
- Newsreader is reserved for the hero's italic connective words (the "i" segments). Do not spread it; it's the editorial-italic accent that contrasts against the black sans.
- ⚠️ Avoid Inter/Roboto/Arial per the working rules — Geist is the committed face.

### Type scale (semantic → class)

| Token | Class | Use |
|---|---|---|
| Display XL | `text-7xl` / `text-6xl` | Homepage contact & work headline |
| Display L | `text-5xl` | Homepage section headline |
| H1 (case title) | `text-[clamp(2rem,3.4vw,3rem)]` | Case study title |
| H2 (section) | `text-3xl sm:text-4xl` | Case study section title |
| Hero copy | `text-[36px]` → `2xl:text-[44px]` | Homepage hero paragraph |
| Stat number | `text-[clamp(2.25rem,4vw,3.5rem)]` | KPI figures (cap ≈ 3.5rem) |
| H3 sub-heading | `text-[1.5rem]` / `text-[1.375rem]` | In-chapter sub-unit |
| H3 card title | `text-xl` / `text-[1.25rem]` | Card / in-page label |
| Lead paragraph | `text-lg` | Overview / hero copy |
| Body | `text-base` (leading `1.55`) | Default paragraph (`bodyMd`) |
| Body S | `text-sm` / `text-[15px]` | Smaller body / dense copy (`bodySm`) |
| Stat sub-value | `text-[17px]` | Secondary figure |
| Eyebrow (section) | `text-[11px]` | Above H2 |
| Eyebrow (meta) | `text-[10px]` | Above metadata/stat |

➕ Rule: never jump H2 (30–36px) → card title (20px) directly; use the H3 sub-heading (22–24px) as the in-between.

### Weight

| Weight | Class | Use |
|---|---|---|
| Normal 400 | `font-normal` | Body |
| Medium 500 | `font-medium` | **All H1/H2 headings — the editorial signature** |
| SemiBold 600 | `font-semibold` | H3 sub-heads, card titles, eyebrows, labels, inline emphasis |
| Bold 700 | `font-bold` | ⚠️ Only the hero brand names (`hero-intro.tsx`). Avoid elsewhere; do not use on H1/H2. |

### Letter-spacing (tracking)

| Context | Values in use |
|---|---|
| Large headings (tighten) | `-0.075em` · `-0.06em` · `-0.045em` · `-0.04em` |
| Mid headings / titles | `-0.03em` · `-0.025em` · `-0.02em` |
| Body fine-tune | `-0.015em` · `-0.01em` |
| Eyebrows / caps (open up) | `0.11em` · `0.12em` · `0.14em` (meta) · `0.16em` · `0.18em` (section) · `0.2em` (`.section-label`) |

➕ Convention: the bigger the type, the more negative the tracking; uppercase eyebrows open to `0.14–0.2em`.

---

## 2. Color

### Theming — light / dark case studies (`--cs-*`)

Case-study colour routes through CSS variables (`--cs-heading`, `--cs-body`, `--cs-body-sm`, `--cs-emphasis`, `--cs-eyebrow`, `--cs-eyebrow-meta`, `--cs-lead`, `--cs-cap`, `--cs-border(-2)`, `--cs-surface(-2)`, `--cs-hover-*`), defined in `app/globals.css`. **DARK is the `:root` default**, so the TikTok TV dark cases need no markup change. A **LIGHT** case study sets `data-cs-theme="light"` on its `<article>` root (and a light `mainClassName`/`contentClassName` on `PortfolioShell`) — that single attribute flips every token (`bodyMd`, `surfaceQuiet`, `MediaCaption`, …) to dark-ink-on-white. Never hardcode `text-white/…` / `border-white/…` in a case study that needs to theme — use the tokens so it follows `--cs-*`. A LIGHT case study must ALSO: pass `sidebarTheme="light"` to `PortfolioShell` (light sidebar panel + dark project list — the `home`/`tiktok-tv` sidebars are dark and look wrong next to a white page), and pass `theme="light"` to `<NextSectionButton>` (it defaults to `dark` — a dark frosted pill is invisible on white). (Migration light/dark per page: see `rules/PORTFOLIO_WORKING_RULES.md` / project memory.) **Keep a light page fully light** — do NOT reproduce the old site's per-section dark bands as actual dark backgrounds; carry over only their *layout* (e.g. a two-column "paragraph + icon cards" block) using the light `--cs-*` tokens.

**Overscroll canvas — a DARK page must set `rootBg`.** The rubber-band / overscroll gutter (revealed when you bounce past the top or bottom of the page) is painted from the **`<html>`** element's background — or `<body>`'s if `<html>` has none. `<body>` is white (`--background`), and the dark `<main>` doesn't cover the bounce area, so a dark page **flashes white** when you scroll past the bottom and back up (Tony, 2026-06-21). Fix: pass `rootBg="#161616"` to `PortfolioShell` on every dark page — it renders `<RootBackground>` (`app/components/root-background.tsx`), which sets `document.documentElement.style.backgroundColor` and restores it on unmount so the next (light) route reverts to white. `ScrollThemeShell` passes `rootBg` dynamically (`light ? "#ffffff" : "#161616"`) so the gutter tracks the scroll-driven theme. Light pages need nothing — the white body is already correct. `check.mjs` warns if a `PortfolioShell` with a dark `bg-[#…]` `mainClassName` is missing `rootBg`.

### Base

| Token | Value | Source |
|---|---|---|
| `--background` | `#ffffff` | light canvas |
| `--foreground` | `#151515` | light text base |
| `::selection` | bg `#151515` / text `#fff` | global |

### Canvas surfaces (dark case studies)

| Surface | Value | Use |
|---|---|---|
| Case canvas | `#161616` | Case study main + content (TikTok TV) |
| Sidebar `home` | `#111111` | Homepage sidebar panel |
| Sidebar `tiktok-tv` | `#0E0E0E` | Dark case sidebar (≈8 units darker than canvas) |

➕ Rule: in dark cases the sidebar must be **darker** than the canvas; keep a 6–12 unit RGB gap.

### Text opacity ramp ➕ (normalized — adopt these 8 steps)

The code currently uses ~14 ad-hoc `white/*` values and ~8 `black/*`. Collapse to one ramp:

| Step | Dark (`text-white/…`) | Light (`text-black/…`) | Use |
|---|---|---|---|
| Title | `text-white` (100) | `text-[#151515]` | Headings, pure-white card titles |
| Emphasis | `/90` | `/90` | Inline `<strong>` highlight |
| Strong | `/82` | `/78` | Stat values, badge text |
| Lead | `/72` | `/62` | Lead paragraph |
| Body | `/64` | `/60` | Default paragraph |
| Secondary | `/56` | `/56` | Captions, list items, card body |
| Muted | `/46` | `/44` | Sidebar nav, `.section-label` |
| Faint | `/36`–`/30` | `/40`–`/18` | Eyebrow-meta, copyright, marquee |

⚠️ Drift to fold in next time you touch a file: `white/85→/82`, `/70→/72`, `/66→/64`, `/48`&`/46`→pick one muted, `black/42/40→/44 or /40`.

### Surfaces & borders (on dark)

| Token | Value | Use |
|---|---|---|
| `surfaceQuiet` | `border-white/[0.05] bg-white/[0.025]` | Metadata strip, quiet containers |
| `surfaceDefault` | `border-white/[0.06] bg-white/[0.04]` | Standard cards (credits, stat, feature) |
| Glass | `bg-white/[0.06] border-white/12 backdrop-blur-xl backdrop-saturate-150` | Floating pill, status hover |
| Status chip states | `bg-white/[0.075]` → hover `/0.13`–`/0.14` | "Available to connect" |
| Sidebar hairline | `border-white/10` | Panel edge |

⚠️ Borders below `white/[0.05]` are invisible on dark — never go quieter for a real surface.

### Accent & status

| Token | Value | Use |
|---|---|---|
| Available green | `#24c55e` (+ `rgb(36 197 94 / .18/.34)` pulse) | Availability dot |
| Card hover/glow | per-card `--card-hover` / `--card-glow` CSS vars | Work-grid hover tint |
| Button (dark fill) | `#171717` → hover `black/75` | Primary CTA |
| Button (outline) | `border-black/12` → hover `border-black` | Secondary CTA |

### Shadows

| Token | Use |
|---|---|
| `0_18px_40px_rgba(0,0,0,0.35)` | Card hover lift (dark) |
| `0_10px_32px_rgba(0,0,0,0.4)` | Floating next-section pill (dark) |
| `0_4px_24px_rgba(35,29,16,0.035)` | Card rest (light, warm-black base) |
| `0_6px_28px_rgba(35,29,16,0.035)` | Work card rest (light) |
| `0_14px_36px_rgba(35,29,16,0.07)` | Card hover (light) |
| `0_8px_28px_rgba(0,0,0,0.055)` | Button rest (light) |
| `0_8px_24px_rgba(0,0,0,0.1)` | Period badge (light) |

➕ Light-mode shadows use the warm-black base `rgb(35,29,16)`, not pure black — keep that for warmth.

---

## 3. Radius

Named scale (CSS vars in `app/globals.css`). **Leans round — Tony likes generous corners.** Use `rounded-[var(--r-md)]` etc.; never hand-pick a one-off px radius (a small `rounded-[8px]` card reads as "off-system" — the cards must use the scale).

| Token | Value | Use |
|---|---|---|
| `--r-xs` | `0.75rem` (12px) | Chips, tags, badges, small labels |
| `--r-sm` | `1rem` (16px) | Small cards, inputs |
| `--r-md` | `1.25rem` (20px) | **Standard cards** · metadata blocks · work card · sticky-note / hypothesis cards |
| `--r-lg` | `1.5rem` (24px) | Media frames (image/video/diagram) · experience card |
| `--r-xl` | `1.75rem` (28px) | Hero image · sidebar panel · large containers |
| `--r-2xl` | `2rem` (32px) | Extra-round feature block |
| `--r-pill` | `9999px` | Pills · chips · dots · cursor |

Existing `rounded-[1.25rem]` / `rounded-[1.5rem]` / `rounded-[1.75rem]` usages map onto `--r-md` / `--r-lg` / `--r-xl` — migrate to the vars when you touch a file. Logo/avatar `rounded-[0.85rem]` is a deliberate small-element exception.

**Media-frame hairline border.** `ImageFrame`/`VideoFrame`/`HoverVideo` (and the per-page hero `<figure>`) carry a built-in **1px theme-aware border `border-[var(--cs-border)]`** — a *very light* stroke (≈8% ink on light pages, ≈5% white on dark) that delineates the media edge from the page canvas (esp. light/white screenshots on a white page). It adapts automatically via `--cs-border`, so it works in both light and dark case studies. Tony 2026-06-20. The `square` prop drops the corner radius but keeps the border. **Every media surface gets the stroke — videos too, not just images** (`HoverVideo` border added 2026-06-21 per Tony). Raw `<Image>` (e.g. marquee tiles) should also use `border-[var(--cs-border)]`, not a hardcoded `border-white/…`.

**`ImageFrame screen` — floating-screen treatment.** A LIGHT/white image on a DARK page reads as a harsh white cut-out. Pass `screen` to swap the hairline border for a brighter edge (`border-white/10`) + a soft deep drop shadow (`.screen-shadow` = `0 26px 70px -26px rgba(0,0,0,.85)` in globals.css) so the bright image lifts off the dark canvas like a screen. Dark-on-dark images don't need it. Light-only — the white edge is wrong on a light canvas. Tony 2026-06-20. **Note:** on a page that flips to light around its white images (see `ScrollThemeShell` below), do NOT use `screen` — the dark floating shadow is wrong once the canvas under the image turns white; the plain hairline border is correct there. The TikTok Design System white screenshots (ds-07/08/09/10) used `screen` until 2026-06-21, when they became light-zones and dropped it.

**`ScrollThemeShell` — scroll-driven whole-page light/dark switch.** The TikTok Design System page is mostly-dark but **most of its imagery is white** (the four mid-page Figma screenshots ds-07/08/09/10 *and* the component-gallery marquee ds-11–29 — verified by sampling: ds-02–06 and ds-30–32 are dark, the rest white). Treating each white image individually (the `screen` float) still leaves it sitting awkwardly between a black sidebar + black canvas. What Tony asked for: flip the **entire page** — sidebar panel, main background, article tokens **and** the locator pill — to light while a white image is on screen, then back to dark when it scrolls away. `app/components/scroll-theme-shell.tsx` is a client wrapper that owns a `light` state, watches every `[data-light-zone]` element, and turns light ON while any zone overlaps the **central band of the viewport (30%–70% of its height)** — a generous window (not a razor-thin center line) so the flip fires a touch early and holds while the white image dominates, instead of only at dead-center. It re-renders `PortfolioShell` with `sidebarTheme` `tiktok-tv ↔ light`, a light/dark `mainClassName`/`contentClassName`, wraps children in `.cs-page-fade` + `data-cs-theme`, and passes the matching `theme` to `<NextSectionButton>`. Smoothness: `PortfolioShell`'s `<aside>`/`<main>` carry `transition-colors duration-500`; `.cs-page-fade *` (globals.css) transitions `background/color/border/fill` over 0.5s so the token-driven article fades in step (framer-motion uses the Web Animations API, not CSS transitions, so this doesn't clobber reveals).

**It works in BOTH directions — `base` prop + two zone attributes.** `ScrollThemeShell` takes `base="dark"` (default) or `base="light"`; it starts there (also the SSR/first-paint value, so no flash) and returns to it whenever no zone is active. A `[data-light-zone]` in the central band forces **light**, a `[data-dark-zone]` forces **dark**. So a dark page (Design System, `base="dark"`) flips light around its white imagery, and a **light** page (TikTok Web Restructure, `base="light"`) flips **dark** around a dark stretch — same component, opposite polarity. When you adopt it on a page, **drop the page's own `data-cs-theme` on `<article>` and the per-prop `sidebarTheme`/`mainClassName`/`<NextSectionButton theme>`** — the shell now owns all of them; leaving `data-cs-theme="light"` on the article would pin it light and defeat the dark zone. (TikTok Web Restructure: `base="light"`, one `data-dark-zone` wrapping *Commonness and Differences → Job to be done → How to measure success?* → exactly two flips: light→dark on entry, dark→light at *Redesign the TikTok Structure*. Tony 2026-06-21.) This is a deliberate full-page theme switch, NOT the static per-section dark *band* that the "keep a light page fully light" rule forbids — that rule still stands for bands you'd carry over from the old Framer site.

**Zone granularity — wrap a CONTIGUOUS white STRETCH as ONE zone, never per-image.** A `data-light-zone` per white image makes the page flip back to dark in the dark-text gaps *between* the images — Tony's words: "每个 section 都会变黑一下" (it goes dark for a beat at every section). The fix: span the whole unbroken white run with a SINGLE wrapper so the page goes light when you enter it and **stays light across the in-between text** until the next genuinely-dark section. On the TikTok Design System page that's one `<div data-light-zone className="flex flex-col gap-32 lg:gap-40">` (the wrapper must re-mirror the parent flex/gap, since it becomes one flex child) around the five sections from *Build with variants* through *Keeping it simple*; *Give the components emotions* (Motion, dark imagery) below it is where dark returns. Net result on that page: exactly two flips — dark→light on entry, light→dark at Motion. The same one-wrapper rule applies to a `data-dark-zone` on a light page (the Web Restructure dark run is one wrapper around three sections). **Do NOT use `display:contents` on the wrapper** — a contents box has no `getBoundingClientRect`, so the detector can't see it. Reveal doesn't forward `data-*`, so put `data-light-zone`/`data-dark-zone` on a real wrapping `<div>` whose `flex`/`gap` mirrors the parent. This supersedes the old `data-pill-invert`-on-the-marquee approach (the pill now follows the page theme directly). Tony 2026-06-21.

---

## 4. Spacing & layout

### Shell

- Grid: `md:grid-cols-[324px_1fr]`.
- Sidebar: `m-3 rounded-[1.75rem]`, `md:sticky md:top-3 md:h-[calc(100vh-1.5rem)]`, inset margin (no heavy shadow).
- Content padding: `px-6 sm:px-10 lg:px-14 2xl:px-16`.
- Page container: `max-w-[1280px] mx-auto` (both homepage and case `<article>`).

### Vertical rhythm (full scale in working rules — Layout Patterns)

`mt-4` eyebrow→H2 · `mt-8` H→content · `mt-5` sub-head→para · `gap-7` between paras · `mt-10` para→media · **`mt-5` media→its caption/title** · `mt-3` caption-title→its list · `mt-20` sub-section · `gap-40` chapter→chapter.

⚠️ A caption or title that sits **under** a media block (image/video/HoverVideo card) must NEVER be flush against it — always `mt-5`. `MediaCaption`/`SubHeading`/`VideoFrame`/`ImageFrame` carry **no** built-in margin, so the caller owns the gap; placing the caption directly after `<HoverVideo>` with no `mt-*` is the "title glued to the image" bug. This is part of the spacing system — apply the scale, don't eyeball.

### Title hierarchy (the levels)

1. **Section title** — `CaseSection` h2 (`text-3xl sm:text-4xl`). The default for every top-level section (Background, Problems, …).
2. **Compact / sub-feature section title** — `CaseSection … compact` → h3 (`text-2xl sm:text-[1.75rem]`). For a demo/sub-feature section that should read as subordinate to the main h2s (e.g. search → **Keyboard**). Don't leave it at the default h2 size. `eyebrow` is optional — omit it for a bare sub-feature title (Keyboard has no eyebrow); only the top-level h2 sections carry an eyebrow label.
3. **Sub-section heading** — `SubHeading` (`text-[1.125rem] sm:text-[1.25rem]`, i.e. 18→20px), introduces a text+media block (heading **above** its paragraph, e.g. "Dynamic background", "My profile", the CONTEXT "Serve non-app users / Improve brand image / …" sub-points, and the search "Structure" heading). Deliberately kept clearly subordinate to the h2 section title — at the old 22→24px it competed with the section heading (Tony, 2026-06-20).
4. **Media caption** — `MediaCaption` (`text-base sm:text-[1.0625rem]`, `text-white/85`), the small title **under** an image/video card (e.g. "Up-down" / "Left-right"). It is a label, NOT a sub-heading — keep it small and slightly greyed. Use `MediaCaption`, never `SubHeading`, for an under-media title. Enforced by `npm run check`. The bullet list under such a caption stays tight (`gap-1`, `leading-[1.4]`) — it's a label list, not body paragraphs, so don't give it paragraph line-height.
5. **Card lead title** — token `cardLeadTitle` (`text-base font-medium text-white/80`), the title that leads a paragraph **inside a two-column comparison/problem card** (e.g. search "Users Get Lost Between Pages"). **Same size as the body paragraph it introduces** — set apart only by heavier weight + brighter colour, not by size. Import the token; don't inline the class string.

➕ Use `flex flex-col gap-N`, **not** `space-y-*` (unreliable under Tailwind v4 + Turbopack here).

### Two-column gap (horizontal)

**Media-to-media gap is 48px on whichever axis separates them.** Side-by-side → `gap-x-12`; **stacked image→image (or video→video) → `mt-12`** (and a two-column *image* grid that stacks on mobile → `gap-y-12` too). Only applies between two media blocks — a text→media gap keeps the vertical-rhythm scale (`mt-10` para→media, `mt-5` media→caption), it does NOT become 48px.

Every **two-column side-by-side layout** in a case study uses a **48px column gap** — `gap-x-12` (or the uniform `lg:gap-12` idiom on `lg:grid-cols-2` blocks). This covers image pairs, text+image splits, video+caption pairs, card pairs — anything that reads as two columns next to each other. Keep the row gap (`gap-y-*`) at whatever the stacked/mobile rhythm needs; the rule is only about the *horizontal* gap between the two columns. Enforced by `npm run check` (warns on a `grid-cols-2` line without `gap-x-12`/`gap-12`). Out of scope: stat tables (`sm:grid-cols-2 lg:grid-cols-4`, border-divided, gap 0) and custom track grids (`grid-cols-[2fr_3fr]`). The homepage Experience **card gallery** (`app/page.tsx`) is a multi-row card grid, not side-by-side content, so it is intentionally left tighter (`gap-4`).

**Even card grids are exempt — use a uniform `gap-N` (h == v).** A multi-card grid that reads as a *block of cards* rather than two side-by-side content columns (e.g. the Airbnb Wishlist Problem cards and To-do cards — `surfaceQuiet` boxes in `sm:grid-cols-3`) should have its **horizontal gap equal its vertical gap** — Tony, 2026-06-21: "让左右间距跟上下间距对齐". Write a single `gap-5` (20px both), NOT `gap-x-12 gap-y-5`; the wide 48px column gap is for two reading columns, and looks lopsided between small repeated cards. Use a real CSS `grid` with a fixed `grid-cols-N` (not flex-wrap) so a partial last row keeps each card at `1/N` width aligned under the columns above instead of stretching — Tony wanted the 2 trailing To-do cards (5 cards = 3 + 2) to match the top row's width at every breakpoint; `grid-cols-3` does this for free, flex `flex-1`/`justify-between` does not. `check.mjs` exempts these automatically: a `grid-cols-2` line carrying a uniform `gap-\d` shorthand with no separate `gap-x-` is treated as an even card grid and skips the 48px rule.

### Breakpoints

- Content area ≈ **1004px @ 1440** (after 324px sidebar + margins).
- Use `sm:` (640) / `lg:` (1024) for case-study grids. ⚠️ **Do not use `xl:` (1280)** — content is narrower than xl, columns collapse.
- Work grid: `[grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]`.

---

## 5. Motion

| Token | Value |
|---|---|
| Standard easing | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Page transition | 550ms (template fade, opacity only) |
| Reveal (scroll-in) | 750ms, +48px slide |
| Stagger item | 700ms; `delay = (index % cols) * 0.08` (left→right per row) |
| Word reveal | 720ms · Fade reveal | 850ms |
| Hero token | 720ms (neutral) / 920ms (pulse, scale overshoot 1.04) |
| Cursor transitions | 240–280ms |
| Marquee | 44s linear infinite |
| Availability pulse | 1.8s · Cursor blink | 3.6s |

- Primitives: `Reveal`, `StaggerGrid`+`StaggerItem`, `template.tsx` page fade, **`ScrollRevealText`** (scroll grey→white word highlight for fact/stat statements), **`HoverVideo`** ("hover to play" demo clips), **`ScrollSteps`** (pinned scroll-story: left text steps scroll up & brighten while the right image crossfades; for synced text+image "decreasing-step" narratives) (see Motion System in working rules).
- ➕ Every motion path respects `prefers-reduced-motion` (global reset in `globals.css` kills durations).
- ⚠️ `.right-pane-enter` keyframe is dead CSS (replaced by template fade) — safe to remove.

---

## 6. Cursor (custom, `pointer: fine` only)

| State | Trigger | Visual |
|---|---|---|
| default | anywhere | 12px white dot + 32px ring, `mix-blend-difference` |
| hover | auto on `a/button/input/textarea/select/label/summary/[data-cursor]` | dot→20px, ring stays 32px |
| view | explicit `data-cursor="view"` | ring→48px filled white, black eye SVG, double-blink 3.6s |

- z-index `9999`. Hidden on `pointer: coarse` (touch → native cursor).
- `data-cursor="view"` is reserved for case-study openers only.

---

## 7. Components (inventory + key specs)

| Component | Spec highlights |
|---|---|
| **Sidebar** (`portfolio-shell.tsx`) | 2 themes: `home` (#111) / `tiktok-tv` (#0E0E0E). Logo, role eyebrow, status chip, nav, copyright. |
| **Work card** | aspect `1600/1880`, image `object-cover object-top`, hover glow (`--card-glow`), period badge (glass, top-left), eye cursor if Case Study. |
| **Experience card** | logo 48px `rounded-[0.85rem]`, company H3 + date eyebrow, role, filled skill chips, `hover:-translate-y-0.5`. |
| **Chip / pill** | `rounded-full`; filled neutral `bg-black/[0.04] px-3 py-1.5 text-[11px]` (light) — filled reads as a system, not a checklist. |
| **Tag / label** (`case-study.tsx` `Tag`) | shadcn-Badge pattern: `rounded-full px-2.5 py-1 text-[11px] font-semibold`. Neutral theme-aware default; pass `className` for an accent (e.g. `bg-[#f75757] text-white` for the Hypothesis-card markers). Use for category/label chips, not body text. |
| **Gradient tag** (`case-study.tsx` `GradientTag`) | The artistic two-tone gradient label from the old Airbnb Wishlist site — **the standard treatment for any card number/label chip** (Tony, 2026-06-21: make every card tag this style). `rounded-[6px] px-2 py-1 text-[10.5px] font-semibold uppercase`; a faint ~12% gradient *tint* background (`color-mix(in srgb, …12%, transparent)`) behind **gradient-clipped text** (`bg-clip-text text-transparent`). Two tones: `warm` (red→purple — Problem / Hypothesis), `cool` (teal→blue — To-do). **THEME-AWARE**: endpoints are `--gtag-{warm,cool}-{from,to}` CSS vars — the verbatim old-site colours under `[data-cs-theme="light"]` (`#d61515→#8446b8`, `#14baa1→#0f4f85`), brightened on dark in `:root` (`#ff5c5c→#c79cff`, `#2fe0c4→#5aa9e6`) so the same tag stays legible when a ScrollThemeShell page rides it through both a light and a dark zone (Web Restructure Todo cards). In use: Airbnb Problem/To-do, CloudKitchens Hypothesis, Web Restructure Todo. NOTE: only *card chips* — page-meta dates and stat-grid eyebrows stay `eyebrowMeta`, not tags. |
| **Stat / metadata card** | `surfaceQuiet`/`surfaceDefault`; eyebrow-meta + number; pair related stats in ONE card. |
| **Case-study footer** (`case-study.tsx` `CaseStudyFooter`) | Closing row at the bottom of EVERY case study (last child of `<article>`): `border-t` divider, `© 2026 Tony Xing · Staff Product Designer` left, `← All work` (→ `/#work`) right. Theme-aware `--cs-*` (`--cs-body-sm` text, `--cs-border` divider) so it reads on light and dark. Tony 2026-06-21 — deliberately just signature + back-link, NO contact CTA (the sidebar already carries email/LinkedIn) and NO next-project nav (he doesn't want More-work-style sequential browsing). |
| **Eyebrow** (2 only) | section `text-[11px] font-semibold uppercase tracking-[0.18em] /40`; meta `text-[10px] tracking-[0.14em] /36`. |
| **Buttons** | dark fill `#171717` text-white; outline `border-black/12`. Both `rounded-full px-5 py-3 text-sm font-semibold`. |
| **Next-section pill** ("定位器") | glass, `arrow_downward` SVG path, breathing y-loop, `AnimatePresence` label crossfade. Label = the next `data-case-section` **H2 text, read at runtime** (auto-syncs as sections change). Pill is `whitespace-nowrap` → keep `CaseSection title` **≤ 38 chars** or it overflows on mobile; `npm run check` warns past 38. Page H1 is not in the pill. See working rules → Next-Section Button. |
| **Inline emphasis** | `<strong className="font-semibold text-white/90">` (light: `text-black/90`). |

### Icons — `lucide-react`

The project's icon library is **`lucide-react`** (MIT, tree-shakeable, React 19-compatible). Import named icons (`import { Waves } from "lucide-react"`) — they are plain SVG components and work in **server components** (no `"use client"` needed). Size with `size-5`/`size-6` (or `width`/`height`), set stroke with `strokeWidth` (≈2.5 reads well at small sizes), colour with `text-[…]`/`text-[var(--cs-…)]`, and add `aria-hidden` when decorative. Match the **old-site icon by shape** — e.g. the red stacked-wave bullet in TikTok Restructure "Problems" → `Waves` tinted `text-[#f75757]`. Do NOT hand-roll one-off inline `<svg>` for standard glyphs (the hero squiggle / availability dot stay bespoke; everything iconographic comes from lucide). First reference: `app/work/tiktok-restructure/page.tsx`.

✅ Shared tokens (`eyebrowSection`, `eyebrowMeta`, `surfaceQuiet`, `surfaceDefault`, `bodyMd`, `bodySm`, `emphasis`, `cardHoverDark`) now live in **[`app/lib/tokens.ts`](../app/lib/tokens.ts)** — import from there, never re-declare. `npm run check` fails the build if a page re-declares one. When a value here changes, change it in that module in the same edit (it cites these tables).

### Component references (when generating new components)

When a new component is needed (tag, label, badge, tooltip, segmented control, accordion, dialog, etc.), **start from a proven, well-documented design system rather than inventing structure/markup/a11y from scratch** — then **restyle to THIS system's tokens** (radius `--r-*`, `--cs-*` colours, type scale, Newsreader/Geist). Stack-aligned (React 19 + Tailwind v4), best first:

- **shadcn/ui** — Radix + Tailwind, copy-paste components (`npx shadcn@latest add badge`). The default for Tag/Label/Badge/Tooltip/Dialog here — adopt the structure + a11y, swap its radius/colours for ours.
- **Radix UI Primitives** — unstyled accessible behaviour (menus, popovers, switches) when shadcn doesn't cover it.
- **Geist (Vercel)** & **Polaris (Shopify)** — reference for restrained, editorial visual quality (spacing, badge/label proportions) that matches this portfolio's aesthetic.
- **Material 3**, **Base Web (Uber)**, **Primer (GitHub)**, **Mantine** — broader pattern/spec references.

Rule: never paste a component at its source styling — it must end up using `--r-*`, `--cs-*`, the type scale and the motion primitives, so it reads as part of THIS system, not a foreign widget. Confirm with Tony before adding a new dependency (shadcn is copy-paste, no runtime dep; Radix adds a package).

---

## 8. Hero — editorial mixed-weight pattern

The homepage hero (`app/components/hero-intro.tsx`) is a reusable board layout: an oversized statement that alternates **heavy black UPPERCASE sans** (Geist `font-black`) with **medium serif italic lowercase** (Newsreader 500), plus **floating color tags** (short self-descriptions sourced from the résumé). These are the parts that are easy to get wrong — encode them if rebuilding the pattern:

**Overlap + white seam.** Italic words are pulled into the neighbouring black words with negative `-ml`/`-mr` so the two faces overlap. The headline carries a white `-webkit-text-stroke` (`4px`) with `paint-order: stroke`; on the white page it's invisible *except* where letters overlap, where it cuts a clean white seam between the two faces.
- The seam only appears with **real overlap** — measure it. Adjacent words must overlap by ~`+4px` (≈ the stroke width). At `-ml-[0.07em]` the words still had a `-6px` *gap* → no overlap, no seam, "stroke looks missing". `+4px` overlap reads as "overlapping with a seam" and stays legible; too much (e.g. `-ml-[0.22em]` on a short word) hides letters (`shaping` → `snaping`).

**Line-start italics must drop the `-ml`.** The overlap `-ml` assumes a preceding word to overlap. A line-start italic (e.g. `at`) has none, so the negative margin shoves it left *past* the left-alignment edge of the bold lines above/below — the line looks misaligned. Use a separate line-start class with **no `-ml`** (keep `-mr` so the next bold word still overlaps it); detect via "previous segment is a `<br>`". Verify by measuring left edges — every line should share one `left` value.

**Floating tags — placement rules.** Tags are the Figma-designed **glossy pill stickers** in [`public/portfolio/stickers/`](../public/portfolio/stickers) (SVG, text outlined, native aspect ~29px tall). Rendered height is **responsive** (`STICKER_H = clamp(18px, 3vw, 38px)`, width auto) so they scale with the headline: capped at 38px on desktop (the tuned look) and shrinking to an 18px floor on small screens — the `3vw` term mirrors the headline's `5.4vw` so each sticker stays the same fraction of the text at every width. The `w`/`h` in the `TAGS` data are the desktop size and double as the intrinsic aspect-ratio hint. Tags are `position:absolute` (zero layout height, so the headline's line-height is untouched), lightly rotated, each with its own color.
- Source of the art is Figma — to change a sticker's shape/color/text, edit it there and re-export the SVG; don't recreate it as a CSS chip.
- **Placement is word-anchored, not a fixed `%`.** Each `TAGS` entry names a headline segment (`seg`), an edge (`side`: top/bottom/left/right), and `align`; `layoutTags` pins it to that word's live glyph rect and presses it in by `PRESS_V`/`PRESS_H`. This keeps each sticker kissing its word as the headline reflows — a `%` drifts off the text at narrow widths. A `narrow` override (below `NARROW_BP`) re-anchors the few whose desktop edge would spill onto an adjacent line once the headline wraps to many short lines.
- **Anchor to the RESTING word, not the mid-animation one.** The headline words carry the `.hero-token` reveal (translateY 14→0 over ~720ms, staggered), and `getClientRects()` includes that live transform. The first synchronous `layoutTags()` runs at 0ms, so it would read every glyph box ~14px LOW and anchor the stickers too far down — they'd only snap up on the next resize (Tony, 2026-06-21: "刚进页面 tag 偏下,调宽度又往上跳"). Fix in `glyphRect`: subtract the word's own computed `translateY` (`DOMMatrixReadOnly(getComputedStyle(word).transform).m42`) from the measured top, so the anchor is the settled position at ANY animation frame → correct on first paint, zero jump. If you change the reveal animation or `layoutTags`, keep this subtraction.
- **Both bounds are the rule:** keep a *slight* overlap (kiss the edge — never stranded far from the text) AND never cover a readable letter's middle (≤ 40% of any word). Enforced by `scripts/hero-tag-overlap.js`, which flags BOTH `TOO_FAR` and `COVERS_TOO_MUCH`. **Run it at a wide and a narrow width after any placement/size/copy change** (see PORTFOLIO_WORKING_RULES). Checking only "doesn't cover too much" is what once let stickers float into empty space.
- **Distribute** around the headline (top / sides / bottom); don't stack two in the same corner.
- The soft lift is a CSS `drop-shadow` filter on the `<img>` (follows the pill outline), not a `box-shadow`.

---

## 9. Gaps filled / flagged (the "补齐" list)

**Added (➕):** unified 8-step text-opacity ramp; light/dark pairing for every color token; tracking convention; warm-black shadow rule; component inventory with specs; shared-token-module suggestion.

**Cleanup (⚠️):**
1. Geist Mono — loaded but never used (dead font).
2. `.right-pane-enter` — dead keyframe.
3. `rounded-[0.4rem]` — orphan radius off the scale.
4. `font-bold` on hero brand — the one bold exception; confirm it's intentional vs. the Medium signature.
5. Opacity drift (`white/85,70,66`, split `48/46`) — fold into the ramp.

**Recommended to add next (aligns with `ui-ux-pro-max` accessibility priorities):**
- **Focus-visible ring** — the custom cursor hides the native pointer, but there is no defined keyboard `:focus-visible` ring. Add one (e.g. `outline-2 outline-offset-2` in an accent) for keyboard users. CRITICAL for a11y.
- **z-index scale** — only `9999` (cursor) is defined; name layers (base / sticky sidebar / badges / floating pill / cursor) before they collide.
- **Contrast check** — verify `text-white/36` eyebrows and `text-black/18` marquee meet/relax intentionally against WCAG (decorative vs. informational).
