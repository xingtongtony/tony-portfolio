/**
 * Paints the document root so the overscroll / rubber-band canvas — and, on
 * iPhone Safari, the status-bar area above the page — match the page surface.
 *
 * Both take their colour from `<html>` / `<body>`, not from the page's dark
 * `<main>`. Our `<body>` is white (`--background`), so without this a dark
 * page shows a white band under the iPhone status bar and flashes white when
 * it bounces.
 *
 * It renders a `<style>` rather than setting the colour in an effect: the
 * style is in the server HTML, so Safari sees the dark root on first paint
 * (an effect only ran after hydration, and Safari had already sampled white).
 * React removes the element when the page unmounts, so the next route (e.g. a
 * light page) falls back to the white default; `ScrollThemeShell` changes
 * `color` and React updates the rule in place.
 */
export function RootBackground({ color }: { color: string }) {
  return <style>{`html,body{background-color:${color}}`}</style>;
}
