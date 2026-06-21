"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

/**
 * Sidebar project entry points. Editorial list under the logo.
 *
 * Interaction language:
 * - row hover: title brightens + nudges right
 * - hand-drawn blue squiggle draws in under the title (scale-x from left +
 *   fade) — mirrors the hero underline, uses pre-generated utilities only
 * - sibling dim: hovering any row fades the others (ul `group/list`)
 * - ACTIVE row (the case study you're on): the hover treatment made permanent —
 *   white title + squiggle drawn + arrow shown — and exempt from the sibling
 *   dim so it stays marked while you hover other rows.
 *
 * Active matching: a project with `match` is active when the pathname starts
 * with that prefix (so every TikTok TV sub-feature page keeps "TikTok TV
 * Revamp" lit); otherwise it's active on an exact href match.
 *
 * Only entries with a real route get a Link. The rest render as non-links
 * until their case study exists. Client component for `usePathname`.
 */

type Project = { title: string; href?: string; match?: string };

const projects: Project[] = [
  // `match` prefix: all /work/tiktok-tv-* sub-features light up this one row.
  { title: "TikTok TV Revamp", href: "/work/tiktok-tv-visual", match: "/work/tiktok-tv" },
  { title: "CloudKitchens Lutra App", href: "/work/cloudkitchens" },
  { title: "TikTok Web Restructure", href: "/work/tiktok-restructure" },
  { title: "TikTok Multi-Platform", href: "/work/tiktok-multi-platform" },
  { title: "TikTok Design System", href: "/work/tiktok-design-system" },
  { title: "TikCode Redesign", href: "/work/tiktok-tikcode" },
  { title: "Airbnb Wishlist", href: "/work/airbnb-wishlist" },
];

// Irregular hand-drawn squiggle (uneven control points).
const SQUIGGLE = "M2 7C16 3 30 10 46 6 62 2 78 9 98 5";

const ROW_BASE = "group flex items-center gap-3 py-[7px] transition-opacity duration-300";
// Non-active rows dim when any sibling is hovered; the hovered one snaps back.
const ROW_DIMMABLE = "group-hover/list:opacity-40 hover:!opacity-100";

function RowInner({
  title,
  hasLink,
  active,
  tone,
}: {
  title: string;
  hasLink: boolean;
  active: boolean;
  tone: "dark" | "light";
}) {
  const activeColor = tone === "light" ? "text-black" : "text-white";
  const idleColor =
    tone === "light"
      ? "text-black/55 group-hover:translate-x-0.5 group-hover:text-black"
      : "text-white/55 group-hover:translate-x-0.5 group-hover:text-white";
  return (
    <>
      <span
        className={`relative whitespace-nowrap text-[13px] font-medium tracking-[-0.01em] transition-all duration-300 ${
          active ? activeColor : idleColor
        }`}
      >
        {title}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 12"
          preserveAspectRatio="none"
          className={`pointer-events-none absolute -bottom-[3px] left-0 h-[7px] w-full origin-left overflow-visible transition-all duration-500 ease-out ${
            active
              ? "scale-x-100 opacity-100"
              : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
          }`}
        >
          <path
            d={SQUIGGLE}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </span>
      {hasLink && (
        <span
          className={`ml-auto flex shrink-0 items-center leading-none transition-all duration-300 ${
            active
              ? "translate-x-0 text-[#3b82f6]"
              : "translate-x-1 text-transparent group-hover:translate-x-0 group-hover:text-[#3b82f6]"
          }`}
        >
          <ArrowUpRight className="size-3.5" />
        </span>
      )}
    </>
  );
}

export function SidebarProjects({
  tone = "dark",
}: {
  tone?: "dark" | "light";
} = {}) {
  const pathname = usePathname();

  const isActive = (p: Project) =>
    p.match ? pathname.startsWith(p.match) : !!p.href && pathname === p.href;

  return (
    <ul className="group/list mt-10 hidden flex-col md:flex">
      {projects.map((p) => {
        const active = isActive(p);
        const rowClass = `${ROW_BASE} ${active ? "" : ROW_DIMMABLE}`;
        return (
          <li key={p.title}>
            {p.href ? (
              <Link
                href={p.href}
                className={rowClass}
                aria-label={`Open ${p.title} case study`}
                aria-current={active ? "page" : undefined}
              >
                <RowInner title={p.title} hasLink active={active} tone={tone} />
              </Link>
            ) : (
              <span className={`${rowClass} cursor-default`}>
                <RowInner title={p.title} hasLink={false} active={active} tone={tone} />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
