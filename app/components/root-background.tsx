"use client";

import { useEffect } from "react";

/**
 * Paints the document root so the overscroll / rubber-band canvas matches the
 * page surface.
 *
 * The viewport "canvas" (the area revealed when you scroll past the top/bottom
 * and the page bounces) takes its colour from the `<html>` element's
 * background — or, if `<html>` has none, from `<body>`. Our `<body>` is white
 * (`--background`), so a dark page flashes white in the overscroll gutter. The
 * page's dark `<main>` doesn't cover it because the bounce happens *outside*
 * `<main>`. Setting `<html>`'s background to the page colour makes the canvas
 * match. Cleanup restores the previous value so the next route (e.g. a light
 * page) reverts to the white default.
 */
export function RootBackground({ color }: { color: string }) {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.backgroundColor;
    html.style.backgroundColor = color;
    return () => {
      html.style.backgroundColor = prev;
    };
  }, [color]);

  return null;
}
