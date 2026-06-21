"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * Pinned scroll-story: the right image panel stays fixed in the viewport while
 * the left column of text steps scrolls up through it. The step nearest the
 * center brightens from gray → white (continuous, scroll-linked). The image,
 * by contrast, SNAPS to the active step with a short fade — it is driven by a
 * discrete active index, not by scroll progress, so there is no half-faded
 * mid-scroll state. Mirrors the TikTok TV search "Keyboard" interaction.
 *
 * Desktop (lg+) only — below lg and under reduced-motion we render a plain
 * stacked list (image + caption per step), which keeps the content readable
 * without a broken pin. CSS, not JS measurement, drives the split, so it works
 * even when rAF / ResizeObserver are throttled in a backgrounded preview tab.
 */

export type ScrollStep = {
  /** Small label, e.g. "Only 3 steps". */
  value: string;
  /** Large phrase, e.g. "From center keyboard to suggestion". */
  caption: string;
  /** Image shown on the right when this step is active. */
  image: string;
};

// Vertical room reserved per step in the moving column (px). Sized for the
// small label + a paragraph-scale caption (a couple of lines), kept tight so
// neighbouring steps read as a list, not isolated cards.
const SLOT = 200;

export function ScrollSteps({ steps }: { steps: ScrollStep[] }) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const N = steps.length;
  // Called unconditionally (rules of hooks) even though only the pinned branch
  // below uses it.
  const columnY = useColumnY(scrollYProgress, N);

  // Discrete active step: the image switches on this index (a snap + short
  // fade), NOT on continuous scroll progress, so it never sits half-faded
  // mid-scroll. Band i owns progress [i/N, (i+1)/N).
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(N - 1, Math.max(0, Math.floor(v * N))));
  });

  return (
    <>
      {/* Mobile / reduced-motion: plain stacked list. */}
      <div className={prefersReduced ? "flex flex-col gap-14" : "flex flex-col gap-14 lg:hidden"}>
        {steps.map((s) => (
          <div key={s.caption}>
            <Image
              src={s.image}
              alt={s.caption}
              width={1920}
              height={1080}
              className="h-auto w-full rounded-[1.25rem]"
            />
            <p className="mt-5 text-sm font-medium tracking-[0.02em] text-white/45">
              {s.value}
            </p>
            <p className="mt-2 max-w-[40ch] text-[clamp(1.0625rem,4vw,1.375rem)] font-medium leading-[1.4] tracking-[-0.01em] text-white">
              {s.caption}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop: pinned scroll-story. */}
      {!prefersReduced && (
        <div
          ref={ref}
          className="hidden lg:block"
          style={{ height: `${N * 80}vh` }}
        >
          <div className="sticky top-0 h-screen">
            <div className="grid h-full items-center gap-12 lg:grid-cols-[2fr_3fr]">
              {/* LEFT — text column that scrolls up */}
              <div className="relative flex h-full items-center overflow-hidden">
                <motion.div style={{ y: columnY }} className="w-full">
                  {steps.map((s, i) => (
                    <StepText
                      key={s.caption}
                      step={s}
                      i={i}
                      n={N}
                      progress={scrollYProgress}
                    />
                  ))}
                </motion.div>
              </div>

              {/* RIGHT — fixed image panel, crossfades per active step */}
              <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem]">
                {steps.map((s, i) => (
                  <StepImage key={s.caption} step={s} i={i} active={active} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Translate the column so the active step sits at the viewport center. */
function useColumnY(progress: MotionValue<number>, n: number) {
  const span = (SLOT * n) / 2;
  return useTransform(progress, [0, 1], [span, -span]);
}

/**
 * Scroll window for step i: a band centered at (i+0.5)/n, clamped so the first
 * and last bands stay inside [0, 1]. Keeping every input offset within [0, 1]
 * avoids framer-motion's WAAPI "offsets must be monotonically non-decreasing"
 * crash that negative / >1 ranges trigger.
 */
function bandRange(i: number, n: number): [number, number, number] {
  const b = 1 / n;
  const c = (i + 0.5) * b;
  const lo = i === 0 ? 0 : c - b;
  const hi = i === n - 1 ? 1 : c + b;
  return [lo, c, hi];
}

function StepText({
  step,
  i,
  n,
  progress,
}: {
  step: ScrollStep;
  i: number;
  n: number;
  progress: MotionValue<number>;
}) {
  const range = bandRange(i, n);
  const label = useTransform(progress, range, ["#525252", "#9a9a9a", "#525252"]);
  const title = useTransform(progress, range, ["#5a5a5a", "#ffffff", "#5a5a5a"]);
  return (
    <div className="flex flex-col justify-center" style={{ height: SLOT }}>
      <motion.p
        initial={false}
        style={{ color: label }}
        className="text-sm font-medium tracking-[0.02em]"
      >
        {step.value}
      </motion.p>
      <motion.p
        initial={false}
        style={{ color: title }}
        className="mt-2 max-w-[26ch] text-[clamp(1.0625rem,1.5vw,1.5rem)] font-medium leading-[1.4] tracking-[-0.01em]"
      >
        {step.caption}
      </motion.p>
    </div>
  );
}

function StepImage({
  step,
  i,
  active,
}: {
  step: ScrollStep;
  i: number;
  active: number;
}) {
  // Snap to the active step with a short fade — opacity is bound to a discrete
  // index, not to scroll progress, so there is no scroll-linked mid-state.
  return (
    <motion.div
      initial={false}
      animate={{ opacity: i === active ? 1 : 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute inset-0"
      style={{ zIndex: i === active ? 1 : 0 }}
    >
      <Image
        src={step.image}
        alt={step.caption}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
    </motion.div>
  );
}
