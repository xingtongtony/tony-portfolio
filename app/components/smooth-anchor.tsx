"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type SmoothAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: `#${string}`;
  children: ReactNode;
};

/**
 * Anchor that smooth-scrolls to a `#id` target on the same page.
 *
 * Why this exists: we tried `<html data-scroll-behavior="smooth">` + a CSS
 * rule (`[data-scroll-behavior="smooth"] { scroll-behavior: smooth }`) so
 * native anchor jumps would smooth-scroll without affecting route transitions.
 * Tailwind v4 + Turbopack's HMR has dropped that rule from the compiled
 * stylesheet more than once during this project, so the user sees an instant
 * jump instead. JS-based interception is HMR-immune and also lets us
 * `history.pushState` the hash without the browser snapping the scroll
 * position first.
 *
 * Behaviour:
 * - Cmd/Ctrl/Shift/Alt + click is left alone (open in new tab, etc.)
 * - Right/middle-click is left alone
 * - Falls back to the default anchor jump if the target id isn't on the page
 * - Preserves the user's `onClick` if they pass one
 */
export function SmoothAnchor({
  href,
  onClick,
  children,
  ...rest
}: SmoothAnchorProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.button !== 0) return;

    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    // Keep the URL in sync so back/forward and refresh behave as expected,
    // but use pushState so the browser doesn't itself jump the scroll
    // position to the anchor before our smooth scroll plays.
    if (typeof window !== "undefined" && window.history?.pushState) {
      window.history.pushState(null, "", href);
    }
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
