"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { EDUCATION, ROLES, type Craft } from "../../lib/about";

/**
 * The About page's middle: a bio whose skills you can press, and a career
 * ruler with the roles listed under it. The three are one piece of state:
 * - pressing a skill in the bio dims every role (bar and row) that didn't use it;
 * - pointing at a row lights its bar; scrubbing along the ruler lights the row
 *   of the month under the pointer (also with the arrow keys — it is a slider);
 * - a row opens to its points and the case studies it led to.
 * Reduced motion: every change is instant.
 */

// The hero's "10+" gradient, the page's one accent.
const ACCENT = "linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #f2784b 100%)";
const BLUE = "#3b82f6";

const LOGOS: Record<string, string> = {
  TikTok: "/portfolio/tony-work-19.png",
  CloudKitchens: "/portfolio/tony-work-18.png",
  Airbnb: "/portfolio/tony-work-17.png",
  DiDi: "/portfolio/tony-work-16.png",
  // From each company's LinkedIn page (21 Nov 2026).
  Okou: "/portfolio/about/logos/okou.png",
  extend: "/portfolio/about/logos/extend.png",
  Otter: "/portfolio/about/logos/otter.png",
  GrowingIO: "/portfolio/about/logos/growingio.png",
  Pond5: "/portfolio/about/logos/pond5.png",
  "Cranbrook Academy of Art": "/portfolio/about/logos/cranbrook.png",
  "Beijing Institute of Graphic Communication": "/portfolio/about/logos/bigc.png",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const toMonth = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m ? m - 1 : 0);
};
const fmtMonth = (n: number) => `${MONTHS[n % 12]} ${Math.floor(n / 12)}`;

type Entry = {
  key: string;
  label: string; // on the bar
  name: string; // company or school
  org?: string; // the company a brand belongs to
  title: string; // role or degree
  kind: "work" | "study";
  contract?: boolean;
  start: number;
  end: number; // exclusive month index; "now" for current roles
  current: boolean;
  dates: string;
  place?: string;
  points: string[];
  note?: string;
  work?: { title: string; href: string; cover: string }[];
  craft: Craft[];
  lane: number;
};

// Short names that fit a bar; the row always shows the full one.
const SHORT: Record<string, string> = {
  "Beijing Institute of Graphic Communication": "BIGC",
  "Cranbrook Academy of Art": "Cranbrook",
  CloudKitchens: "CloudKitchens",
};

function buildEntries(nowYm: string): Entry[] {
  const now = toMonth(nowYm) + 1;
  const work: Entry[] = ROLES.map((r, i) => {
    const start = toMonth(r.start);
    // The end month is the next role's first month: end there, so the career is one line.
    const end = r.end ? Math.max(toMonth(r.end), start + 1) : now;
    return {
      key: `w${i}`,
      label: SHORT[r.company] ?? r.company,
      name: r.company,
      org: r.org,
      title: r.role,
      kind: "work",
      contract: r.kind === "Contract",
      start,
      end,
      current: !r.end,
      dates: `${fmtMonth(start)} — ${r.end ? fmtMonth(toMonth(r.end)) : "Now"}`,
      place: r.place,
      points: r.points,
      work: r.work,
      craft: r.craft,
      lane: 0,
    };
  });
  const study: Entry[] = EDUCATION.map((e, i) => {
    const [a, b] = e.years.split("–").map((s) => Number(s.trim()));
    return {
      key: `s${i}`,
      label: SHORT[e.school] ?? e.school,
      name: e.school,
      title: e.degree,
      kind: "study",
      start: a * 12,
      end: b * 12,
      current: false,
      dates: `${a} — ${b}`,
      points: [],
      note: e.note,
      craft: e.school.startsWith("Cranbrook") ? ["Visual", "Motion", "Brand"] : ["Visual"],
      lane: 0,
    };
  });
  // Lanes: one track for a whole career; a role that overlaps another drops to the next lane.
  const all = [...study, ...work].sort((x, y) => x.start - y.start || x.end - y.end);
  const laneEnds: number[] = [];
  for (const e of all) {
    let lane = laneEnds.findIndex((end) => end <= e.start);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = e.end;
    e.lane = lane;
  }
  return [...work, ...study];
}

// The bio, written from the LinkedIn profile. Pressable words carry a craft.
const BIO: (string | { word: string; craft: Craft })[] = [
  "I started as an illustrator. After an MFA in graphic design at Cranbrook, I made motion graphics in New York, then moved into product design in Beijing and San Jose — at DiDi, Airbnb, CloudKitchens and TikTok, most recently leading the TikTok TV design team. I care about ",
  { word: "product thinking", craft: "Product" },
  ", ",
  { word: "design systems", craft: "Systems" },
  " that scale and ",
  { word: "leading teams", craft: "Leadership" },
  " — and I never stopped caring about ",
  { word: "visual craft", craft: "Visual" },
  ", ",
  { word: "motion", craft: "Motion" },
  " and ",
  { word: "brand", craft: "Brand" },
  ".",
];

const CRAFT_WORD: Record<Craft, string> = {
  Product: "product thinking",
  Systems: "design systems",
  Leadership: "leading teams",
  Visual: "visual craft",
  Motion: "motion",
  Brand: "brand",
};

export function Career({ now }: { now: string }) {
  const entries = useMemo(() => buildEntries(now), [now]);
  const [craft, setCraft] = useState<Craft | null>(null);
  // The entries pointed at: one row, or every role at the scrubbed month (two at once from Apr 2026).
  const [hot, setHot] = useState<string[]>([]);
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  const matches = (e: Entry) => !craft || e.craft.includes(craft);
  const workCount = entries.filter((e) => e.kind === "work" && matches(e)).length;

  return (
    <>
      {/* BIO */}
      <section id="bio" data-case-section className="scroll-mt-8 py-16 lg:py-24">
        <p className="section-label">About</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">From illustration to TikTok TV</h2>
        <p className="mt-10 max-w-[46rem] text-[clamp(1.25rem,2.1vw,1.625rem)] font-medium leading-[1.45] tracking-[-0.02em] text-black/45">
          {BIO.map((part, i) =>
            typeof part === "string" ? (
              <span key={i}>{part}</span>
            ) : (
              <CraftWord key={i} active={craft === part.craft} dimmed={!!craft && craft !== part.craft} onToggle={() => setCraft((c) => (c === part.craft ? null : part.craft))}>
                {part.word}
              </CraftWord>
            ),
          )}
        </p>
        <p className="mt-5 text-sm text-black/45" aria-live="polite">
          {craft ? (
            <>
              {workCount} of {ROLES.length} roles involved {CRAFT_WORD[craft]}.{" "}
              <button type="button" onClick={() => setCraft(null)} className="font-medium text-black underline decoration-black/25 underline-offset-4 hover:decoration-black">
                Show all
              </button>
            </>
          ) : (
            "Press a highlighted word to see where I used it."
          )}
        </p>

      </section>

      {/* CAREER */}
      <section id="career" data-case-section className="scroll-mt-8 py-16 lg:py-24">
        <p className="section-label">Career</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Where I&apos;ve designed</h2>

        {/* From md the ruler stays on screen while the rows scroll under it, so a
            row far down still shows its bar. The white band above it masks the rows. */}
        <div className="z-20 mt-12 bg-white md:sticky md:top-0 md:-mx-3 md:px-3 md:pb-3 md:pt-3 md:after:pointer-events-none md:after:absolute md:after:inset-x-0 md:after:top-full md:after:h-6 md:after:bg-gradient-to-b md:after:from-white md:after:to-white/0">
          <Ruler entries={entries} now={toMonth(now) + 1} hot={hot} setHot={setHot} matches={matches} />
        </div>

        <ol className="mt-6 border-t border-black/10">
          {entries.map((e, i) => {
            const first = e.kind === "study" && entries[i - 1]?.kind === "work";
            return (
              <li key={e.key} className={first ? "mt-12 border-t border-black/10" : ""}>
                {first ? <p className="section-label pb-3 pt-6">Education</p> : null}
                <Row
                  e={e}
                  hot={hot.includes(e.key)}
                  dimmed={!matches(e)}
                  open={open.has(e.key)}
                  onHot={(on) => setHot(on ? [e.key] : [])}
                  onToggle={() =>
                    setOpen((s) => {
                      const next = new Set(s);
                      if (next.has(e.key)) next.delete(e.key);
                      else next.add(e.key);
                      return next;
                    })
                  }
                />
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}

function CraftWord({ active, dimmed, onToggle, children }: { active: boolean; dimmed: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={`relative inline rounded-[0.3em] px-[0.12em] font-semibold transition-[color,background-color] duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
        active ? "text-white" : dimmed ? "text-black/55" : "text-black hover:bg-black/[0.05]"
      }`}
      style={active ? { background: ACCENT } : undefined}
    >
      {/* Underline that says "press me" without a button's chrome. */}
      {!active ? <span aria-hidden className="pointer-events-none absolute inset-x-[0.12em] bottom-[0.06em] h-[2px] rounded-full opacity-70" style={{ background: ACCENT }} /> : null}
      {children}
    </button>
  );
}

const START = 2009 * 12;

function Ruler({
  entries,
  now,
  hot,
  setHot,
  matches,
}: {
  entries: Entry[];
  now: number;
  hot: string[];
  setHot: (keys: string[]) => void;
  matches: (e: Entry) => boolean;
}) {
  const end = (Math.floor((now - 1) / 12) + 1) * 12; // to the end of this year
  const span = end - START;
  const pct = (m: number) => ((m - START) / span) * 100;
  const lanes = Math.max(...entries.map((e) => e.lane)) + 1;
  const years = Array.from({ length: span / 12 + 1 }, (_, i) => 2009 + i);

  const box = useRef<HTMLDivElement>(null);
  const [scrub, setScrub] = useState<number | null>(null); // month under the pointer / keyboard

  // Bar names show only when every one of them fits whole: some cut off, some
  // missing reads worse than none (the scrub label names every bar anyway).
  const [labels, setLabels] = useState(true);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const check = () => {
      const spans = [...el.querySelectorAll<HTMLElement>("[data-bar-label]")];
      setLabels(spans.every((sp) => sp.scrollWidth <= (sp.parentElement?.clientWidth ?? 0)));
    };
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Everything at a month: every role then (two at once from Apr 2026), else the school.
  const at = (m: number) => {
    const here = entries.filter((e) => m >= e.start && m < e.end);
    const work = here.filter((e) => e.kind === "work");
    return work.length ? work : here;
  };

  const scrubTo = (m: number | null) => {
    setScrub(m);
    setHot(m === null ? [] : at(m).map((e) => e.key));
  };
  const fromPointer = (ev: PointerEvent<HTMLDivElement>) => {
    const r = box.current!.getBoundingClientRect();
    const x = Math.min(Math.max(ev.clientX - r.left, 0), r.width);
    scrubTo(Math.min(START + Math.floor((x / r.width) * span), end - 1));
  };
  const onKey = (ev: KeyboardEvent<HTMLDivElement>) => {
    const step = ev.shiftKey ? 12 : 3;
    const cur = scrub ?? now - 1;
    let next: number | null = null;
    if (ev.key === "ArrowRight" || ev.key === "ArrowUp") next = Math.min(cur + step, end - 1);
    if (ev.key === "ArrowLeft" || ev.key === "ArrowDown") next = Math.max(cur - step, START);
    if (ev.key === "Home") next = START;
    if (ev.key === "End") next = now - 1;
    if (ev.key === "Escape") return scrubTo(null);
    if (next !== null) {
      ev.preventDefault();
      scrubTo(next);
    }
  };

  const hotEntries = entries.filter((e) => hot.includes(e.key));
  const hotNames = [...new Set(hotEntries.map((e) => e.name))].join(" + ");
  const study = entries.filter((e) => e.kind === "study");
  const work = entries.filter((e) => e.kind === "work");
  const workFrom = Math.min(...work.map((e) => e.start));
  const studyFrom = Math.min(...study.map((e) => e.start));
  const studyTo = Math.max(...study.map((e) => e.end));
  const spans = [
    { label: "Art school", detail: `${(studyTo - studyFrom) / 12} years, two schools`, from: studyFrom, to: studyTo },
    {
      label: "Design",
      detail: `${Math.floor((now - workFrom) / 12)} years, ${new Set(work.map((e) => e.org ?? e.name)).size} companies`,
      from: workFrom,
      to: now,
    },
  ];
  const marker = scrub ?? null;
  const LANE = 30;
  const BRACKET = 34;

  return (
    <div className="rounded-[1.5rem] bg-[#f6f6f6] px-5 pb-4 pt-11 sm:px-8">
      <div
        ref={box}
        role="slider"
        tabIndex={0}
        aria-label="Career timeline"
        aria-valuemin={START}
        aria-valuemax={end - 1}
        aria-valuenow={marker ?? now - 1}
        aria-valuetext={`${fmtMonth(marker ?? now - 1)}${hotEntries.map((e) => `, ${e.name}, ${e.title}`).join("")}`}
        onPointerMove={fromPointer}
        onPointerDown={fromPointer}
        onPointerLeave={(ev) => ev.pointerType === "mouse" && scrubTo(null)}
        onKeyDown={onKey}
        onBlur={() => scrubTo(null)}
        className="relative cursor-crosshair touch-pan-y select-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-8 focus-visible:ring-offset-[#f6f6f6]"
        style={{ height: lanes * LANE + 34 + BRACKET }}
      >
        {/* Year grid */}
        {years.map((y) => (
          <div key={y} aria-hidden className="absolute bottom-0 top-0" style={{ left: `${pct(y * 12)}%` }}>
            <div className="absolute top-0 w-px bg-black/[0.07]" style={{ bottom: 24 + BRACKET }} />
            {/* Every 4th year on a phone, every 2nd from md, all from xl; the ruler's end needs no label. */}
            {y < end / 12 ? (
              <span
                style={{ bottom: BRACKET }}
                className={`absolute font-mono text-[10px] tabular-nums text-black/40 ${y === 2009 ? "" : "-translate-x-1/2"} ${
                  y % 4 === 1 ? "" : y % 2 === 1 ? "hidden md:inline" : "hidden xl:inline"
                }`}
              >
                {y}
              </span>
            ) : null}
          </div>
        ))}

        {/* Bars */}
        {entries.map((e) => {
          const isHot = hot.includes(e.key);
          const on = matches(e);
          const width = pct(e.end) - pct(e.start);
          return (
            <div
              key={e.key}
              aria-hidden
              className="absolute flex items-center overflow-hidden rounded-[6px] transition-[opacity,background-color] duration-200 motion-reduce:transition-none"
              style={{
                left: `calc(${pct(e.start)}% + 1px)`,
                width: `calc(${width}% - 2px)`,
                top: e.lane * LANE,
                height: LANE - 8,
                opacity: on ? 1 : 0.18,
                background: isHot
                  ? ACCENT
                  : e.kind === "study"
                    ? "repeating-linear-gradient(135deg, rgb(0 0 0 / 0.16) 0 1px, transparent 1px 5px)"
                    : "#1b1b1b",
                boxShadow: e.kind === "study" && !isHot ? "inset 0 0 0 1px rgb(0 0 0 / 0.18)" : undefined,
              }}
            >
              {e.end - e.start >= 10 ? (
                <span
                  data-bar-label
                  className={`whitespace-nowrap px-1.5 text-[11px] font-semibold leading-none ${labels ? "" : "invisible"} ${e.kind === "study" && !isHot ? "text-black/60" : "text-white"}`}
                >
                  {e.label}
                </span>
              ) : null}
            </div>
          );
        })}

        {/* Now */}
        <div aria-hidden className="absolute top-[-14px] w-px border-l border-dashed border-black/30" style={{ left: `${pct(now)}%`, bottom: 24 + BRACKET }}>
          <span className="absolute -top-1 left-1 -translate-y-full font-mono text-[10px] uppercase tracking-[0.1em] text-black/45">Now</span>
        </div>

        {/* Scrub hairline + label */}
        {marker !== null ? (
          <div aria-hidden className="pointer-events-none absolute top-[-34px]" style={{ left: `${pct(marker + 0.5)}%`, bottom: 24 + BRACKET }}>
            <div className="absolute bottom-0 top-6 w-px" style={{ background: BLUE }} />
            <span
              className={`absolute top-0 whitespace-nowrap rounded-full bg-black px-2.5 py-1 text-[11px] font-medium text-white ${
                pct(marker) > 70 ? "-translate-x-full" : pct(marker) < 12 ? "" : "-translate-x-1/2"
              }`}
            >
              <span className="font-mono tabular-nums text-white/60">{fmtMonth(marker)}</span>
              {hotNames ? <span className="ml-1.5">{hotNames}</span> : null}
            </span>
          </div>
        ) : null}

        {/* What the two spans add up to, read off the ruler itself. */}
        {spans.map((b) => (
          <div key={b.label} aria-hidden className="absolute bottom-0" style={{ left: `${pct(b.from)}%`, width: `${pct(b.to) - pct(b.from)}%`, height: BRACKET - 6 }}>
            <div className="absolute inset-x-0 top-0 h-2 rounded-b-[3px] border-x border-b border-black/25" />
            <p className="absolute inset-x-0 top-3.5 truncate text-center text-[11px] text-black/50">
              <span className="font-semibold text-black/75">{b.label}</span>
              <span className="hidden sm:inline"> · {b.detail}</span>
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-black/40">
        <span className="hidden sm:inline">Drag along the ruler, or focus it and use the arrow keys.</span>
        <span className="sm:hidden">Tap or drag along the ruler.</span>
      </p>
    </div>
  );
}

function Row({
  e,
  hot,
  dimmed,
  open,
  onHot,
  onToggle,
}: {
  e: Entry;
  hot: boolean;
  dimmed: boolean;
  open: boolean;
  onHot: (on: boolean) => void;
  onToggle: () => void;
}) {
  const hasMore = e.points.length > 0 || !!e.note || !!e.work;
  const id = `row-${e.key}`;
  const head = (
    <>
      <Logo name={e.name} study={e.kind === "study"} />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-[17px] font-semibold tracking-[-0.02em] text-black">{e.name}</span>
          {e.org ? <span className="text-sm text-black/40">by {e.org}</span> : null}
          {e.contract ? <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-black/50">Contract</span> : null}
        </span>
        <span className="mt-0.5 block text-sm text-black/55">
          {e.title}
          {e.place ? <span className="hidden text-black/35 md:inline"> · {e.place}</span> : null}
        </span>
        <span className="mt-1 block font-mono text-[11px] tabular-nums text-black/40 sm:hidden">{e.dates}</span>
      </span>
      <span className="hidden shrink-0 text-right font-mono text-xs tabular-nums text-black/45 sm:block">{e.dates}</span>
      <span aria-hidden className={`grid size-7 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-300 motion-reduce:transition-none ${hasMore ? "" : "invisible"} ${open ? "rotate-45 bg-black text-white" : "bg-black/[0.04] text-black/60"}`}>
        <Plus className="size-3.5" strokeWidth={2.25} />
      </span>
    </>
  );
  const rowClass = `relative flex w-full items-center gap-4 py-4 pl-1 pr-1 text-left transition-[opacity] duration-200 motion-reduce:transition-none sm:gap-5`;

  return (
    <div
      className={`border-b border-black/10 transition-opacity duration-200 motion-reduce:transition-none ${dimmed ? "opacity-35" : ""}`}
      onPointerEnter={() => onHot(true)}
      onPointerLeave={() => onHot(false)}
    >
      {/* The row's accent edge while its bar is lit. */}
      <div className="relative">
        <span aria-hidden className={`absolute -left-3 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-full transition-opacity duration-200 sm:-left-5 ${hot ? "opacity-100" : "opacity-0"}`} style={{ background: ACCENT }} />
        {/* The work this role led to fans out beside it while it is lit (wide screens; the open row lists it instead). */}
        {e.work ? (
          <span aria-hidden className="pointer-events-none absolute right-[14rem] top-1/2 z-10 hidden h-0 w-0 lg:block">
            {e.work.slice(0, 3).map((w, i, arr) => {
              const show = hot && !open;
              const mid = (arr.length - 1) / 2;
              return (
                <span
                  key={w.href}
                  className="absolute right-0 top-0 w-[150px] overflow-hidden rounded-[10px] bg-white shadow-[0_14px_34px_rgba(0,0,0,0.16)] ring-1 ring-black/5 transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none"
                  style={{
                    zIndex: i,
                    opacity: show ? 1 : 0,
                    transform: show
                      ? `translate(${-(arr.length - 1 - i) * 52}px, -50%) rotate(${(i - mid) * 6}deg)`
                      : `translate(${-(arr.length - 1 - i) * 18}px, -42%) rotate(0deg) scale(0.92)`,
                    transitionDelay: show ? `${i * 40}ms` : "0ms",
                  }}
                >
                  <Image src={w.cover} alt="" width={300} height={178} sizes="150px" loading="eager" className="block h-auto w-full" />
                </span>
              );
            })}
          </span>
        ) : null}
        {hasMore ? (
          <button type="button" aria-expanded={open} aria-controls={id} onClick={onToggle} onFocus={() => onHot(true)} onBlur={() => onHot(false)} className={`${rowClass} rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}>
            {head}
          </button>
        ) : (
          <div className={rowClass}>{head}</div>
        )}
      </div>
      {hasMore ? (
        <div id={id} className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden" inert={!open}>
            <div className="pb-7 pl-[3.25rem] pr-2 sm:pl-[3.75rem]">
              {e.points.length ? (
                <ul className="flex max-w-[44rem] flex-col gap-2.5 text-[15px] leading-[1.55] text-black/65">
                  {e.points.map((p) => (
                    <li key={p} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:size-1 before:rounded-full before:bg-black/30">
                      {p}
                    </li>
                  ))}
                </ul>
              ) : null}
              {e.note ? <p className="max-w-[44rem] text-[15px] leading-[1.55] text-black/65">{e.note}</p> : null}
              {e.work ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {e.work.map((w) => (
                    <Link
                      key={w.href}
                      href={w.href}
                      className="group inline-flex items-center gap-1 rounded-full border border-black/12 px-3 py-1.5 text-[13px] font-medium text-black/70 transition-colors hover:border-black hover:text-black"
                    >
                      {w.title}
                      <ArrowUpRight aria-hidden className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" strokeWidth={2.25} />
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Logo({ name, study }: { name: string; study: boolean }) {
  const src = LOGOS[name];
  if (src) return <Image src={src} alt="" width={36} height={36} className="size-9 shrink-0 rounded-[0.7rem] ring-1 ring-black/[0.08]" />;
  return (
    <span aria-hidden className={`grid size-9 shrink-0 place-items-center rounded-[0.7rem] text-[13px] font-bold uppercase ${study ? "border border-black/15 text-black/50" : "bg-black/[0.06] text-black/70"}`}>
      {name.charAt(0)}
    </span>
  );
}
