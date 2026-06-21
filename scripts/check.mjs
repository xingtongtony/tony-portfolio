#!/usr/bin/env node
/**
 * Static design-rule guard. Zero dependencies — pure Node + fs.
 *
 * Enforces the *deterministically checkable* rules from rules/ that I keep
 * re-deriving by hand (and occasionally breaking). Run with `npm run check`.
 * Exits non-zero on any error so it can gate a commit / CI.
 *
 * This only covers rules a grep can verify. Judgment rules (tag placement,
 * content voice, "don't cover letter bodies") live in the md docs and can't be
 * statically enforced — see scripts/hero-tag-overlap.js for the runtime check
 * that backstops the tag-overlap rule.
 *
 * Each rule below cites the doc clause it enforces, so the two stay in sync.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const APP = join(ROOT, "app");
const TOKENS_FILE = "app/lib/tokens.ts"; // the one place tokens may be declared

/** Recursively collect .ts/.tsx files under a dir. */
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(full)) out.push(full);
  }
  return out;
}

const files = walk(APP);
const errors = [];
const warnings = [];

/** Push a finding for every line matching `re` in `file`. */
function scan(file, re, level, msg) {
  const rel = relative(ROOT, file);
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (re.test(line)) {
        (level === "error" ? errors : warnings).push(
          `${rel}:${i + 1}  ${msg}\n      ${line.trim()}`,
        );
      }
    });
}

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");

  // RULE (DESIGN_SYSTEM §4): use `flex flex-col gap-N`, never `space-y-*`
  // (unreliable under Tailwind v4 + Turbopack here).
  scan(file, /\bspace-y-[\d.]/, "error", "space-y-* is banned — use flex gap-N");

  // RULE (PORTFOLIO_WORKING_RULES): no Framer residue should survive migration.
  scan(
    file,
    /data-framer|__framer|className="[^"]*\bframer-/,
    "error",
    "Framer residue — strip migrated markup",
  );

  // RULE (DESIGN_SYSTEM §7): shared tokens live ONLY in app/lib/tokens.ts.
  // Re-declaring them in a page is the duplication this refactor removed.
  if (rel !== TOKENS_FILE) {
    scan(
      file,
      /\bconst\s+(eyebrowSection|eyebrowMeta|surfaceQuiet|surfaceDefault|bodyMd|bodySm|emphasis|cardLeadTitle|cardHoverDark)\s*=/,
      "error",
      "re-declared shared token — import it from app/lib/tokens instead",
    );
  }

  // RULE (DESIGN_SYSTEM §4): don't use the `xl:` (1280) breakpoint in case
  // studies — content is narrower than xl, so columns collapse.
  if (rel.startsWith("app/work/")) {
    scan(file, /\bxl:/, "warn", "xl: breakpoint in a case study — columns may collapse");
  }

  // RULE (DESIGN_SYSTEM §4): a caption/title under a media block must not be
  // flush — needs `mt-5`. Flag a bare `<MediaCaption>`/`<SubHeading>` (no
  // className, so no margin) whose previous line is a self-closing tag (a media
  // element like HoverVideo/VideoFrame/ImageFrame ends with `/>`). The "title
  // glued to the image" bug.
  const lines = readFileSync(file, "utf8").split("\n");
  let prev = "";
  lines.forEach((line, i) => {
    const t = line.trim();
    if (/^<(MediaCaption|SubHeading)>/.test(t) && /\/>$/.test(prev)) {
      warnings.push(
        `${rel}:${i + 1}  caption flush under media — add a className with mt-5 (DESIGN_SYSTEM §4)\n      ${t}`,
      );
    }
    // RULE (DESIGN_SYSTEM §4): the small title UNDER an image is a media
    // caption, not a sub-section heading — use <MediaCaption> (smaller), not
    // <SubHeading>. A `<SubHeading className="mt-5">` is the media→caption gap,
    // so it is almost certainly a misused caption.
    if (/^<SubHeading\b[^>]*\bmt-5\b/.test(t)) {
      warnings.push(
        `${rel}:${i + 1}  <SubHeading> used as a media caption — use <MediaCaption> instead (DESIGN_SYSTEM §4)\n      ${t}`,
      );
    }
    if (t) prev = t;
  });

  // RULE (DESIGN_SYSTEM §4): in case studies, every two-column side-by-side
  // layout uses a 48px column gap — `gap-x-12` (or the uniform `lg:gap-12`
  // idiom). Flags a literal `grid-cols-2` line missing that marker. Stat tables
  // (`grid-cols-4`) and custom track grids (`grid-cols-[…]`) are out of scope —
  // the rule is the gap *between two side-by-side content columns*.
  if (rel.startsWith("app/work/")) {
    lines.forEach((line, i) => {
      if (!/grid-cols-2/.test(line)) return;
      if (/grid-cols-[34]/.test(line)) return;
      if (/gap-x-12/.test(line) || /gap-12/.test(line)) return;
      // Card grids with EQUAL spacing on both axes — a uniform `gap-N`
      // shorthand and no separate `gap-x-` — are intentionally exempt. The 48px
      // rule governs two side-by-side CONTENT columns, not an even grid of
      // cards (e.g. problem / to-do cards), where matching h/v gaps read better.
      if (/\bgap-\d/.test(line) && !/\bgap-x-/.test(line)) return;
      warnings.push(
        `${rel}:${i + 1}  two-column layout missing the 48px column gap — add gap-x-12 (or lg:gap-12) (DESIGN_SYSTEM §4)\n      ${line.trim()}`,
      );
    });
  }

  // RULE (DESIGN_SYSTEM §7 / working rules → Next-Section Button): the locator ("定位器")
  // auto-derives its pill label from each section's H2 at runtime, so it always
  // stays in sync — but the pill is `whitespace-nowrap`, so an over-long section
  // title overflows it (esp. mobile ~375px). Keep `CaseSection title="…"` ≤ 38
  // chars. Warns (doesn't fail) so pre-existing long titles surface as debt.
  if (rel.startsWith("app/work/")) {
    lines.forEach((line, i) => {
      const m = line.match(/\btitle="([^"]+)"/);
      if (m && m[1].length > 38) {
        warnings.push(
          `${rel}:${i + 1}  section title ${m[1].length} chars — overflows the NextSectionButton pill; shorten to ≤38 (DESIGN_SYSTEM §7)\n      "${m[1]}"`,
        );
      }
    });
  }

  // RULE (DESIGN_SYSTEM §3): a DARK page's overscroll/rubber-band gutter is
  // painted from <html> (white <body> by default), so it flashes white on
  // bounce unless the page sets rootBg. If a PortfolioShell has a dark
  // `mainClassName` (bg-[#0…]/[#1…]) but no `rootBg`, warn.
  if (rel.startsWith("app/work/")) {
    const src = readFileSync(file, "utf8");
    const darkMain = /mainClassName="[^"]*bg-\[#[01][^"]*"/.test(src);
    if (darkMain && !/\brootBg=/.test(src)) {
      warnings.push(
        `${rel}  dark PortfolioShell missing rootBg — overscroll gutter will flash white; add rootBg="#161616" (DESIGN_SYSTEM §3)`,
      );
    }
  }
}

const G = "\x1b[32m", R = "\x1b[31m", Y = "\x1b[33m", X = "\x1b[0m";
if (warnings.length) {
  console.log(`${Y}⚠ ${warnings.length} warning(s):${X}`);
  warnings.forEach((w) => console.log("  " + w));
}
if (errors.length) {
  console.log(`${R}✖ ${errors.length} error(s):${X}`);
  errors.forEach((e) => console.log("  " + e));
  console.log(`\n${R}Design-rule check failed.${X}`);
  process.exit(1);
}
console.log(`${G}✓ Design-rule check passed${X} (${files.length} files scanned).`);
