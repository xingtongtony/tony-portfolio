/**
 * Shared design tokens — the single source of truth for repeated class strings.
 *
 * Why this file exists: these tokens were re-declared (byte-for-byte) at the top
 * of every case-study page. Duplication let the values drift apart silently. By
 * importing from here instead, a change lands once and applies everywhere, and
 * there is no value to mis-remember when generating a new page.
 *
 * Scope: this captures the *deterministic* part of the design system — fixed
 * class strings with one correct value. The *judgment* part (when to use which,
 * tag placement, content voice, anti-patterns) stays in `rules/DESIGN_SYSTEM.md`
 * and `rules/PORTFOLIO_WORKING_RULES.md`, because code can't encode judgment.
 *
 * Mirrors the value tables in `rules/DESIGN_SYSTEM.md` — when a value changes,
 * change it here and update that doc's table in the same edit.
 */

// All colours route through the `--cs-*` CSS variables (defined in
// app/globals.css). DARK is the `:root` default — so dark case studies are
// unchanged — and a LIGHT case study flips every token by setting
// `data-cs-theme="light"` on its <article> root.

// ─── Eyebrows (2 only — see DESIGN_SYSTEM §7) ──────────────────────────────
/** Section eyebrow — sits above an H2. */
export const eyebrowSection =
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--cs-eyebrow)]";
/** Meta eyebrow — sits above a stat/metadata value. Smaller, fainter. */
export const eyebrowMeta =
  "text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--cs-eyebrow-meta)]";

// ─── Surfaces (case studies — see DESIGN_SYSTEM §2) ────────────────────────
/** Quiet container: metadata strips, low-emphasis blocks. */
export const surfaceQuiet =
  "border border-[var(--cs-border)] bg-[var(--cs-surface)]";
/** Standard card: credits, stat, feature cards. One step brighter. */
export const surfaceDefault =
  "border border-[var(--cs-border-2)] bg-[var(--cs-surface-2)]";

// ─── Body copy (see DESIGN_SYSTEM §1) ──────────────────────────────────────
/** Default paragraph. */
export const bodyMd = "text-base leading-[1.55] text-[var(--cs-body)]";
/** Smaller / denser body copy. */
export const bodySm = "text-sm leading-[1.5] text-[var(--cs-body-sm)]";

// ─── Card lead title (see DESIGN_SYSTEM §1 title hierarchy) ─────────────────
/**
 * Title that leads a paragraph INSIDE a two-column comparison/problem card
 * (e.g. search → "Frustrated users" → "Users Get Lost Between Pages"). Same
 * font *size* as the body paragraph it introduces (`text-base`), set apart only
 * by heavier weight + a brighter colour. NOT a section heading — keep it body-
 * sized.
 */
export const cardLeadTitle =
  "text-base font-medium leading-[1.3] tracking-[-0.01em] text-[var(--cs-lead)]";

// ─── Inline emphasis ───────────────────────────────────────────────────────
/**
 * Inline highlight inside body copy — mirrors the source page's "SemiBold +
 * brighter color" treatment. Apply to `<strong>` inside a `bodyMd`/`bodySm`.
 */
export const emphasis = "font-semibold text-[var(--cs-emphasis)]";

// ─── Card interaction (see DESIGN_SYSTEM §7) ───────────────────────────────
/**
 * Hover treatment for a `surfaceDefault` card: lift + brighten + shadow.
 * Compose AFTER surfaceDefault, e.g. `${surfaceDefault} ${cardHoverDark}`.
 * Theme-aware via `--cs-hover-*` (name kept for back-compat).
 */
export const cardHoverDark =
  "transition duration-300 ease-out hover:-translate-y-1 hover:border-[var(--cs-hover-border)] hover:bg-[var(--cs-hover-surface)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)]";
