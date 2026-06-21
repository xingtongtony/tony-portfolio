"use client";

import { useEffect } from "react";

/**
 * Always land at the top (hero) on a fresh load. The browser's default scroll
 * restoration reopens the page at the previous scroll position, which reads as
 * "the page scrolled up from the middle" after a refresh. Switching to manual
 * restoration + jumping to the top fixes that.
 *
 * Two subtleties this handles:
 * - `behavior: "instant"` — `<html>` carries `scroll-behavior: smooth` (for
 *   in-page anchor clicks). A plain `scrollTo(0, 0)` inherits it and *animates*
 *   up from the restored position — the very "scrolling up from the middle"
 *   we're trying to kill. "instant" forces an immediate jump regardless.
 * - `pageshow` (bfcache) — on back/forward the page is restored from the
 *   bfcache without re-running React effects, so this mount effect never fires
 *   and the old scroll position sticks. `pageshow` with `persisted` is the only
 *   signal for that case, so reset there too.
 */
export function ScrollReset() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    const toTop = () =>
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    toTop();
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) toTop();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);
  return null;
}
