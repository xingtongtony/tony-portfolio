"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Screen, Stage, type Tone } from "./brand";
import { A } from "./brand-paths";

export type StoryStep = {
  /** Small label above the title, e.g. "Ask". */
  label: string;
  title: string;
  body: ReactNode;
  /** Loop (without extension) under /portfolio/okou-ios. */
  video: string;
  alt: string;
  /** The stage's colour while this step is read. */
  tone: Tone;
};

/**
 * One task told in steps. From `lg` the stage stays in view while the text
 * scrolls past it: its screen plays the loop of the step being read and its
 * colour changes with the step. Below `lg` each step has its own stage.
 */
export function Story({ steps }: { steps: StoryStep[] }) {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  // The step crossing the middle of the window is the one being read.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const item of items.current) if (item) observer.observe(item);
    return () => observer.disconnect();
  }, []);

  // Only the step being read plays, from its start.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && !reduced) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active]);

  const jump = (i: number) => items.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <div className="mt-16 lg:grid lg:grid-cols-12 lg:gap-12">
      {/* The pinned stage (lg and up). */}
      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-0 flex h-screen items-center py-8">
          <Stage tone={steps[active].tone} className="flex h-full max-h-[760px] w-full items-center justify-center">
            <div className="flex items-center justify-center gap-10 px-10">
              <div className="okou-screen w-[min(290px,36vh)] shrink-0">
                {/* The first loop sets the height; the others lie over it. */}
                {steps.map((step, i) => (
                  <video
                    key={step.video}
                    ref={(el) => {
                      videos.current[i] = el;
                    }}
                    src={`${A}/${step.video}.mp4`}
                    poster={`${A}/${step.video}-poster.jpg`}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={step.alt}
                    className={`transition-opacity duration-500 ${i === 0 ? "" : "absolute inset-0"} ${i === active ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
              </div>
              {/* Where you are in the task; each mark jumps to its step. */}
              <ol className="flex flex-col gap-4">
                {steps.map((step, i) => (
                  <li key={step.label}>
                    <button
                      type="button"
                      onClick={() => jump(i)}
                      aria-current={i === active ? "step" : undefined}
                      className={`group flex items-center gap-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] transition-opacity duration-300 ${i === active ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
                    >
                      <span className={`h-px bg-[var(--okou-ink)] transition-all duration-500 ${i === active ? "w-8" : "w-3"}`} aria-hidden />
                      <span className="text-[var(--okou-ink)]">{step.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </Stage>
        </div>
      </div>

      <ol className="flex flex-col gap-20 lg:col-span-5 lg:gap-0">
        {steps.map((step, i) => (
          <li
            key={step.label}
            data-step={i}
            ref={(el) => {
              items.current[i] = el;
            }}
            className="flex flex-col justify-center lg:min-h-[82vh] lg:first:pt-[9vh] lg:last:pb-[9vh]"
          >
            <div className={`transition-opacity duration-500 ${i === active ? "lg:opacity-100" : "lg:opacity-30"}`}>
              <p className="text-[clamp(3.5rem,6vw,5.5rem)] font-medium leading-none tracking-[-0.05em] text-[rgb(37_33_33/0.12)]" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--okou-amber-text)]">{step.label}</p>
              <h3 className="mt-4 max-w-[14ch] text-[clamp(1.875rem,2.8vw,2.75rem)] font-medium leading-[1.03] tracking-[-0.035em] text-[var(--cs-heading)] text-balance">
                {step.title}
              </h3>
              <p className="mt-5 max-w-[38ch] text-base leading-[1.55] text-[var(--cs-body)]">{step.body}</p>
            </div>
            <Stage tone={step.tone} className="mt-8 px-8 py-12 lg:hidden">
              <Screen video={step.video} alt={step.alt} className="mx-auto max-w-[260px]" />
            </Stage>
          </li>
        ))}
      </ol>
    </div>
  );
}
