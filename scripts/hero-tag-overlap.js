/**
 * Hero tag-overlap detector — the runtime backstop for the placement rule:
 * floating stickers must "press the headline's edges" — i.e. keep a SLIGHT
 * overlap with a word, NEVER drift far from the text, and NEVER cover letter
 * bodies (DESIGN_SYSTEM §8). This is pure runtime geometry (absolute stickers
 * vs. the rendered glyph boxes), so a grep can't see it — you RUN it.
 *
 * It checks BOTH bounds, because getting only the upper bound (don't cover too
 * much) is what let stickers float away from the text on narrow screens:
 *   - TOO FAR  — a sticker that overlaps no word AND sits more than GAP_TOL px
 *                from the nearest word edge. Violates "press the edges".
 *   - COVERS   — a sticker that hides more than MAX_COVER of any single word.
 *                Violates "never cover letter bodies".
 * A sticker that overlaps a little (0 < coverage ≤ MAX_COVER) is the target.
 *
 * How to run: eval this on the homepage (or via the preview eval tool) at
 * several widths. PROCESS RULE: run it after any change to sticker placement,
 * anchoring, size, or the headline copy, and fix anything flagged before
 * calling the hero done. (See PORTFOLIO_WORKING_RULES — Motion System.)
 */
(() => {
  const MAX_COVER = 0.4; // upper bound: max fraction of a word a sticker may hide
  const GAP_TOL = 10; // lower bound: max px a non-overlapping sticker may sit from text

  const h1 = document.querySelector("h1");
  const tags = [...document.querySelectorAll("h1 ~ span[data-depth]")];
  if (!h1 || !tags.length) return { error: "hero h1 or tags not found" };

  const wordRects = [];
  for (const span of h1.querySelectorAll(".hero-token")) {
    const node = span.firstChild;
    if (!node || node.nodeType !== 3) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (r.width > 1 && r.height > 1)
        wordRects.push({ text: (span.textContent || "").trim(), r });
    }
  }

  const overlapArea = (a, b) => {
    const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return x * y;
  };
  // Shortest gap between two rects (0 if they intersect).
  const gap = (a, b) => {
    const dx = Math.max(0, a.left - b.right, b.left - a.right);
    const dy = Math.max(0, a.top - b.bottom, b.top - a.bottom);
    return Math.round(Math.hypot(dx, dy));
  };

  const report = tags.map((tag) => {
    const tr = tag.getBoundingClientRect();
    let cover = 0; // max coverage of any single word
    let coverWord = null;
    let nearest = Infinity; // smallest gap to any word
    for (const { text, r } of wordRects) {
      const frac = overlapArea(tr, r) / (r.width * r.height);
      if (frac > cover) {
        cover = frac;
        coverWord = text;
      }
      nearest = Math.min(nearest, gap(tr, r));
    }
    const tooFar = cover === 0 && nearest > GAP_TOL;
    const covers = cover > MAX_COVER;
    return {
      tag: tag.querySelector("img")?.alt,
      coveredFraction: +cover.toFixed(2),
      coversWord: coverWord,
      gapPx: nearest,
      verdict: tooFar ? "TOO_FAR" : covers ? "COVERS_TOO_MUCH" : "ok",
    };
  });

  const flagged = report.filter((t) => t.verdict !== "ok");
  return {
    pass: flagged.length === 0,
    bounds: { maxCover: MAX_COVER, gapTolPx: GAP_TOL },
    flagged: flagged.map((t) =>
      t.verdict === "TOO_FAR"
        ? `"${t.tag}" is ${t.gapPx}px from the nearest word (no overlap) — too far`
        : `"${t.tag}" hides ${Math.round(t.coveredFraction * 100)}% of "${t.coversWord}" — covers too much`,
    ),
    report,
  };
})();
