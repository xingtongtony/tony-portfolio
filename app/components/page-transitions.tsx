"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

type DocVT = Document & {
  startViewTransition?: (cb: () => Promise<void> | void) => unknown;
};

/**
 * Page-transition crossfade via the native View Transitions API.
 *
 * On a click of any internal link we snapshot the current page, navigate, and
 * once the new route commits, cross-dissolve old → new — so the sidebar colour
 * AND the page background morph between light and dark pages instead of
 * snapping. (A plain CSS `transition` can't do this across routes: the sidebar
 * is a brand-new element on the new page, so there's no "from" colour to ease
 * from. The View Transitions API animates between the two page snapshots.)
 *
 * Implemented as ONE global click interceptor — no need to swap every `<Link>`,
 * since Next renders a plain `<a href>` that this catches. `router.push` is
 * wrapped in `startViewTransition`; the transition's "new snapshot" waits on a
 * promise we resolve when `usePathname()` reports the new route. Browsers
 * without the API (Firefox today) just navigate normally; reduced-motion users
 * get an instant swap (see globals.css).
 */
export function PageTransitions({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const finishRef = useRef<(() => void) | null>(null);

  // The new route has committed — let the captured transition take its "after"
  // snapshot and run the crossfade.
  useEffect(() => {
    finishRef.current?.();
    finishRef.current = null;
  }, [pathname]);

  useEffect(() => {
    // Capture phase: run BEFORE Next's <Link> bubble-phase handler so we can
    // take over the navigation. (In the bubble phase Link has already called
    // preventDefault + started routing, leaving nothing to wrap.)
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;

      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      // Only internal route changes — skip externals, new-tab, downloads, and
      // same-page hash/anchor links (those keep their normal smooth-scroll).
      if (
        !href ||
        !href.startsWith("/") ||
        href.includes("#") ||
        a.getAttribute("target") === "_blank" ||
        a.hasAttribute("download") ||
        href === pathname
      )
        return;

      const start = (document as DocVT).startViewTransition;
      if (typeof start !== "function") return; // unsupported → let Next navigate

      // Take over: stop the event reaching Next's Link handler, then run the
      // same navigation ourselves inside a view transition.
      e.preventDefault();
      e.stopPropagation();
      start.call(
        document,
        () =>
          new Promise<void>((resolve) => {
            finishRef.current = resolve;
            router.push(href);
            // Safety net: never let the transition hang if the route effect
            // somehow doesn't fire (e.g. navigation aborted).
            window.setTimeout(() => {
              if (finishRef.current === resolve) {
                resolve();
                finishRef.current = null;
              }
            }, 800);
          }),
      );
    };

    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, [router, pathname]);

  return <>{children}</>;
}
