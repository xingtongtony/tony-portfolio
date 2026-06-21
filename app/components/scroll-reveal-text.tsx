"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

/**
 * Scroll-driven text highlight — one paragraph that starts dim/grey and fills to
 * white word-by-word as it scrolls through the viewport (the effect Tony built
 * on the source site: a grey base layer with the same text lighting up to white
 * line by line, tied to scroll position).
 *
 * It is ONE paragraph at ONE size — emphasis is weight only (`bold`), never a
 * size or colour change, so the reveal stays uniform. Implemented as per-word
 * opacity over white text on a dark surface (low opacity reads grey, full reads
 * white), driven by the section's scroll progress.
 */

type Seg = { text: string; bold?: boolean };

function Word({
  children,
  bold,
  progress,
  range,
}: {
  children: string;
  bold?: boolean;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  return (
    <motion.span style={{ opacity }} className={bold ? "font-semibold" : undefined}>
      {children}{" "}
    </motion.span>
  );
}

export function ScrollRevealText({
  segments,
  className = "",
}: {
  segments: Seg[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });

  if (reduce) {
    return (
      <p ref={ref} className={`text-white ${className}`}>
        {segments.map((s, i) =>
          s.bold ? (
            <strong key={i} className="font-semibold">
              {s.text}{" "}
            </strong>
          ) : (
            <span key={i}>{s.text} </span>
          ),
        )}
      </p>
    );
  }

  const words: { w: string; bold?: boolean }[] = [];
  for (const s of segments) {
    for (const w of s.text.split(/\s+/).filter(Boolean)) {
      words.push({ w, bold: s.bold });
    }
  }
  const n = words.length;

  return (
    <p ref={ref} className={`text-white ${className}`}>
      {words.map((wd, i) => (
        <Word
          key={i}
          bold={wd.bold}
          progress={scrollYProgress}
          range={[i / n, (i + 1) / n]}
        >
          {wd.w}
        </Word>
      ))}
    </p>
  );
}
