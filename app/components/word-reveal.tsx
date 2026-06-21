"use client";

import type { CSSProperties, ElementType } from "react";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

/**
 * Splits `text` on whitespace and animates each word with a CSS keyframe
 * (opacity + slide-up + un-blur). Each word's `animation-delay` is computed
 * inline as `base + index * stagger`. Uses pure CSS so it cannot be defeated
 * by JS/hydration timing issues; respect for `prefers-reduced-motion` is
 * handled by the global rule in `globals.css`.
 */
export function WordReveal({
  text,
  as = "p",
  className,
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  as?: Tag;
  className?: string;
  /** Delay before the first word fires (seconds). */
  delay?: number;
  /** Delay between adjacent words (seconds). */
  stagger?: number;
}) {
  const Tag = as as ElementType;
  const words = text.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span
            className="word-reveal inline-block"
            style={
              { animationDelay: `${delay + i * stagger}s` } as CSSProperties
            }
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
