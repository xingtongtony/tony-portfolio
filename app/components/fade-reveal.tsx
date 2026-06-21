"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

/**
 * Single-element entrance: fades in, lifts a few pixels, and un-blurs.
 * Pure CSS keyframe so animation is guaranteed to fire on mount regardless
 * of JS / hydration timing. Use when you want a block of content to arrive
 * as one unit — complements `WordReveal` for per-word stagger.
 */
export function FadeReveal({
  children,
  as = "p",
  className,
  delay = 0,
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
  /** Delay before the animation fires (seconds). */
  delay?: number;
}) {
  const Tag = as as ElementType;
  return (
    <Tag
      className={`fade-reveal ${className ?? ""}`}
      style={{ animationDelay: `${delay}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
