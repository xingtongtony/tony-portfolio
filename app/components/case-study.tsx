import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./motion";
import { eyebrowSection } from "../lib/tokens";

/**
 * Shared case-study building blocks. Mirrors the helpers the TikTok TV
 * navigation/visual pages define inline, extracted so newer case studies don't
 * re-declare them. Server-compatible (Reveal is the only client part, imported).
 */

export function CaseSection({
  eyebrow,
  title,
  children,
  className = "",
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  className?: string;
  /**
   * Render the title one level down (h3, smaller) for a sub-feature/demo
   * section that should read as subordinate to the main h2 section titles.
   */
  compact?: boolean;
}) {
  const mt = eyebrow ? "mt-4 " : "";
  return (
    <section className={className} data-case-section>
      <Reveal>
        {eyebrow ? <p className={eyebrowSection}>{eyebrow}</p> : null}
        {compact ? (
          <h3 className={`${mt}max-w-4xl text-2xl font-medium leading-[1.1] tracking-[-0.02em] text-[var(--cs-heading)] sm:text-[1.75rem]`}>
            {title}
          </h3>
        ) : (
          <h2 className={`${mt}max-w-4xl text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-[var(--cs-heading)] sm:text-4xl`}>
            {title}
          </h2>
        )}
      </Reveal>
      {children}
    </section>
  );
}

export function SubHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`text-[1.125rem] font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--cs-heading)] sm:text-[1.25rem] ${className}`}
    >
      {children}
    </h3>
  );
}

/**
 * Small title that sits UNDER a media block (the caption below an image/video
 * card, e.g. "Up-down" / "Left-right"). Deliberately smaller than `SubHeading`
 * — a media caption is a label, not a sub-section heading. Pair with `mt-5`
 * (the media→caption gap). See DESIGN_SYSTEM §4.
 */
export function MediaCaption({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`text-base font-semibold leading-[1.35] tracking-[-0.01em] text-[var(--cs-cap)] sm:text-[1.0625rem] ${className}`}
    >
      {children}
    </h3>
  );
}

/**
 * Small pill tag / label (shadcn-Badge pattern, restyled to our tokens). Base
 * is a rounded-full pill; pass colour via `className` (e.g. a solid accent), or
 * omit it for a neutral theme-aware tag. Use for category/label chips like the
 * "Hypothesis 1" markers. See DESIGN_SYSTEM §7.
 */
export function Tag({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none tracking-[0.02em] ${
        className || "bg-[var(--cs-surface-2)] text-[var(--cs-body)]"
      }`}
    >
      {children}
    </span>
  );
}

// Two-tone gradient label tags, carried over from the old Airbnb Wishlist site:
// a faint ~12% two-colour gradient tint behind gradient-clipped text, 6px
// radius. `warm` = red→purple (Problem / Hypothesis labels), `cool` = teal→blue
// (To-do labels). Endpoints are THEME-AWARE CSS vars (`--gtag-*` in globals.css)
// — the verbatim old-site colours on a light surface, brightened on dark so
// both ends stay legible (the same tag rides both a light and a dark zone on
// the Web Restructure page). `color-mix` derives the 12% tint from the same var.
const GRADIENT_TAG = {
  warm: { from: "var(--gtag-warm-from)", to: "var(--gtag-warm-to)" },
  cool: { from: "var(--gtag-cool-from)", to: "var(--gtag-cool-to)" },
} as const;

export function GradientTag({
  children,
  tone = "warm",
}: {
  children: ReactNode;
  tone?: keyof typeof GRADIENT_TAG;
}) {
  const { from, to } = GRADIENT_TAG[tone];
  return (
    <span
      className="inline-flex w-fit items-center rounded-[6px] px-2 py-1 text-[10.5px] font-semibold uppercase leading-none tracking-[0.1em]"
      style={{
        backgroundImage: `linear-gradient(91deg, color-mix(in srgb, ${from} 12%, transparent) 0%, color-mix(in srgb, ${to} 12%, transparent) 100%)`,
      }}
    >
      <span
        className="bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(91deg, ${from} 0%, ${to} 100%)`,
        }}
      >
        {children}
      </span>
    </span>
  );
}

export function VideoFrame({
  src,
  className = "",
  square = false,
}: {
  src: string;
  className?: string;
  /** Drop the default rounded corners — for full-bleed browser/device mockups
   * whose own chrome reads better with square edges. */
  square?: boolean;
}) {
  return (
    <video
      src={src}
      className={`block h-auto w-full border border-[var(--cs-border)] ${square ? "" : "rounded-[1.5rem]"} ${className}`}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
    />
  );
}

export function ImageFrame({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  square = false,
  screen = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  /** Drop the default rounded corners — see VideoFrame.square. */
  square?: boolean;
  /**
   * "Floating screen" treatment for a LIGHT/white image sitting on a DARK page
   * (TikTok Design System): a brighter edge + soft deep drop shadow so the
   * bright image reads as a lifted screen instead of a harsh white cut-out.
   * Dark-page only — the white edge is wrong on a light canvas.
   */
  screen?: boolean;
}) {
  const edge = screen
    ? "border border-white/10 screen-shadow"
    : "border border-[var(--cs-border)]";
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={`h-auto w-full ${edge} ${square ? "" : "rounded-[1.5rem]"} ${className}`}
    />
  );
}

/**
 * Closing footer for a case study — a single meta/nav row: signature on the
 * left, a link back to all work on the right. Theme-aware via `--cs-*` tokens
 * (reads on both light and dark pages). Drop it in as the last child of the
 * `<article>`.
 */
export function CaseStudyFooter() {
  return (
    <footer className="mt-28 flex flex-col gap-3 border-t border-[var(--cs-border)] pt-6 text-sm text-[var(--cs-body-sm)] sm:flex-row sm:items-center sm:justify-between lg:mt-36">
      <p>© 2026 Tony Xing · Staff Product Designer</p>
      <Link
        href="/#work"
        className="w-fit transition hover:text-[var(--cs-heading)]"
      >
        ← All work
      </Link>
    </footer>
  );
}
