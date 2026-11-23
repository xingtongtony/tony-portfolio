"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { HONORS } from "../../lib/about";
import {
  DESIGNS,
  INVENTIONS,
  JURISDICTIONS,
  OFFICES,
  REGISTRATION_TOTAL,
  count,
  countries,
  recordUrl,
  total,
  type Code,
  type Design,
  type Invention,
} from "../../lib/patents";
import { gesture, play } from "../../lib/sound";
import { Plate } from "./patent-plates";

/**
 * Recognition: the patents as a register. Twelve designs down, fourteen
 * countries across, and a dot for every registration — a design is one
 * family, registered country by country, so the row is the patent and the
 * columns are only where it holds. Under it, the six inventions.
 *
 * Choosing a row shows its plate (the design redrawn as a patent figure, which
 * draws itself) and every registration number, linked to its public record
 * where one could be checked. Where the plate sits follows the room there is
 * (globals.css, `.patents`): beside the table when it is wide, where it also
 * follows the pointer and a square picks its country; otherwise it opens under
 * the row. Reduced motion: plates are simply there.
 */

const ACCENT = "linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #f2784b 100%)";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};
const NAMES = Object.fromEntries(JURISDICTIONS.map((j) => [j.code, j.name])) as Record<Code, string>;
const COLUMN_TOTAL = Object.fromEntries(JURISDICTIONS.map((j) => [j.code, DESIGNS.reduce((sum, d) => sum + count(d, j.code), 0)])) as Record<Code, number>;
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const words = ["no", "one", "two", "three"];

const groupOf = (d: Design) => (d.surface === "web" ? "Web" : `Tablet · ${d.orientation === "portrait" ? "Portrait" : "Landscape"}`);
const GROUPS = ["Tablet · Landscape", "Tablet · Portrait", "Web"].map((label) => ({ label, designs: DESIGNS.filter((d) => groupOf(d) === label) }));
/** Every row a person can choose, in the order they are on the page. */
const ORDER = [...DESIGNS.map((d) => d.id), ...INVENTIONS.map((v) => v.id)];

export function Recognition() {
  const [active, setActive] = useState(ORDER[0]);
  // Below the wide layout a chosen row opens underneath; this is whether it is open.
  const [open, setOpen] = useState(false);
  // A country picked in the active design's row (wide layout).
  const [pick, setPick] = useState<Code | null>(null);
  // The column under the pointer.
  const [column, setColumn] = useState<Code | null>(null);
  const [wide, setWide] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const rows = useRef(new Map<string, HTMLButtonElement>());
  // The row that was pressed and where it was on screen, to hold it there while
  // the one open above it closes.
  const anchor = useRef<{ id: string; top: number } | null>(null);
  // A pressed row stays while the pointer travels to its plate; back on the
  // register the pointer leads again. It leads only where it rests, so crossing
  // rows on the way to the plate changes nothing.
  const pinned = useRef(false);
  const rest = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(rest.current), []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWide(entry.contentRect.width >= 960));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const held = anchor.current;
    anchor.current = null;
    const row = held && rows.current.get(held.id);
    if (!row) return;
    const moved = row.getBoundingClientRect().top - held.top;
    if (Math.abs(moved) > 1) window.scrollBy({ top: moved, behavior: "instant" });
  }, [active, open]);

  const loud = () => {
    play("click");
    gesture("pen", 0.85);
  };

  const press = (id: string, ev: MouseEvent<HTMLButtonElement>) => {
    if (wide) {
      // With a mouse, the square under it picks its country; a finger is too blunt for that.
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const cell = fine ? (ev.target as HTMLElement).closest<HTMLElement>("[data-code]") : null;
      const code = (cell?.hasAttribute("data-filled") ? cell.dataset.code : null) as Code | null;
      if (id !== active || code !== pick) loud();
      clearTimeout(rest.current);
      pinned.current = true;
      setActive(id);
      setPick(code);
      return;
    }
    anchor.current = { id, top: ev.currentTarget.getBoundingClientRect().top };
    if (id === active && open) {
      play("click");
      setOpen(false);
      return;
    }
    loud();
    setActive(id);
    setPick(null);
    setOpen(true);
  };

  // The pointer only leads where the plate is beside the table; sweeping it is silent.
  const point = (id: string) => {
    clearTimeout(rest.current);
    if (!wide || pinned.current) return;
    rest.current = setTimeout(() => {
      setActive((was) => {
        if (was !== id) setPick(null);
        return id;
      });
    }, 110);
  };

  const onKey = (ev: KeyboardEvent<HTMLButtonElement>, id: string) => {
    const i = ORDER.indexOf(id);
    let next = -1;
    if (ev.key === "ArrowDown") next = Math.min(ORDER.length - 1, i + 1);
    if (ev.key === "ArrowUp") next = Math.max(0, i - 1);
    if (ev.key === "Home") next = 0;
    if (ev.key === "End") next = ORDER.length - 1;
    if (next < 0 || next === i) return;
    ev.preventDefault();
    rows.current.get(ORDER[next])?.focus();
    if (wide) {
      loud();
      setActive(ORDER[next]);
      setPick(null);
    }
  };

  const design = DESIGNS.find((d) => d.id === active);
  const invention = INVENTIONS.find((v) => v.id === active);
  const detail = (place: "aside" | "inline") =>
    design ? <DesignDetail key={design.id} design={design} pick={pick} place={place} /> : invention ? <InventionDetail key={invention.id} invention={invention} place={place} /> : null;

  const rowProps = (id: string) => {
    const on = id === active;
    return {
      ref: (el: HTMLButtonElement | null) => {
        if (el) rows.current.set(id, el);
        else rows.current.delete(id);
      },
      type: "button" as const,
      "aria-expanded": wide ? undefined : on && open,
      "aria-current": wide && on ? ("true" as const) : undefined,
      "aria-controls": wide ? "patent-aside" : on && open ? "patent-inline" : undefined,
      onClick: (ev: MouseEvent<HTMLButtonElement>) => press(id, ev),
      onPointerEnter: (ev: React.PointerEvent) => ev.pointerType === "mouse" && point(id),
      onPointerLeave: () => clearTimeout(rest.current),
      onKeyDown: (ev: KeyboardEvent<HTMLButtonElement>) => onKey(ev, id),
    };
  };
  const shown = (id: string) => id === active && (wide || open);

  return (
    <section id="recognition" data-case-section className="scroll-mt-8 py-16 lg:py-24">
      <div ref={box} className="patents">
        <div className="patent-head">
          <div>
            <p className="section-label">Recognition</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-balance sm:text-5xl">
              {DESIGNS.length} designs, registered {REGISTRATION_TOTAL} times
            </h2>
            <p className="mt-6 max-w-[33rem] text-base leading-[1.6] text-black/55">
              A design is one patent family: the same drawing, registered country by country. Each dot is a registration.
              Choose a design to see its drawing and its numbers.
            </p>
          </div>
          <dl className="patent-stats">
            {[
              [DESIGNS.length, "Designs"],
              [REGISTRATION_TOTAL, "Registrations"],
              [JURISDICTIONS.length, "Countries"],
              [INVENTIONS.length, "Inventions"],
            ].map(([n, label]) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="mt-2 font-mono uppercase text-black/45">{label}</dt>
                <dd className="font-semibold leading-none tracking-[-0.05em] tabular-nums">{n}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="patent-board mt-12 sm:mt-14">
          <div className="min-w-0" onPointerEnter={() => (pinned.current = false)}>
            {/* The register */}
            <div onPointerLeave={() => setColumn(null)}>
              {GROUPS.map((group) => (
                <div key={group.label} className="mt-7 first:mt-0">
                  <div className="patent-row !py-0 pb-2" aria-hidden>
                    <span className="self-end pb-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-black/40">{group.label}</span>
                    <span data-part="cells" className="patent-cells font-mono text-[10px] tracking-[0.02em] sm:text-[11px]">
                      {JURISDICTIONS.map((j) => (
                        <span key={j.code} onPointerEnter={(ev) => ev.pointerType === "mouse" && setColumn(j.code)} className={`!min-h-7 transition-colors duration-150 ${column === j.code ? "text-black" : "text-black/40"}`}>
                          {j.code}
                        </span>
                      ))}
                    </span>
                    <span data-part="sum" />
                  </div>
                  <ul className="border-t border-black/10">
                    {group.designs.map((d) => {
                      const on = d.id === active;
                      const lit = shown(d.id);
                      const sum = total(d);
                      return (
                        <li key={d.id} className="border-b border-black/10">
                          <button
                            {...rowProps(d.id)}
                            aria-label={`${d.name}, ${group.label}: ${plural(sum, "registration")} in ${plural(countries(d).length, "country", "countries")}`}
                            className={`patent-row relative transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black ${
                              lit ? "bg-black/[0.035]" : "hover:bg-black/[0.02]"
                            }`}
                          >
                            <Bar on={lit} />
                            <span className={`text-[15px] font-medium leading-tight tracking-[-0.01em] ${lit ? "text-black" : "text-black/70"}`}>{d.name}</span>
                            <span data-part="cells" className="patent-cells">
                              {JURISDICTIONS.map((j) => {
                                const n = count(d, j.code);
                                const picked = on && pick === j.code && wide;
                                return (
                                  <span
                                    key={j.code}
                                    data-code={j.code}
                                    data-filled={n ? "" : undefined}
                                    onPointerEnter={(ev) => ev.pointerType === "mouse" && setColumn(j.code)}
                                    className={`transition-colors duration-150 ${column === j.code ? "bg-black/[0.04]" : ""} ${picked ? "rounded-md shadow-[inset_0_0_0_1.5px_#171717]" : ""}`}
                                  >
                                    {n ? <Pips n={n} /> : <i className="size-[3px] rounded-full bg-black/15" />}
                                  </span>
                                );
                              })}
                            </span>
                            <span data-part="sum" className="flex items-center justify-end gap-1.5 pr-1 font-mono text-[11.5px] tabular-nums text-black/55">
                              {sum}
                              <Chevron open={on && open} />
                            </span>
                          </button>
                          {on && open && !wide ? <div className="patent-inline px-3 pb-6 pt-2 sm:px-4">{detail("inline")}</div> : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              {/* What each country holds, and all of it. */}
              <div className="patent-row" aria-hidden>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-black/45">{column ? NAMES[column] : "All designs"}</span>
                <span data-part="cells" className="patent-cells font-mono text-[10px] tabular-nums sm:text-[11px]">
                  {JURISDICTIONS.map((j) => (
                    <span key={j.code} onPointerEnter={(ev) => ev.pointerType === "mouse" && setColumn(j.code)} className={`transition-colors duration-150 ${column === j.code ? "text-black" : "text-black/40"}`}>
                      {COLUMN_TOTAL[j.code]}
                    </span>
                  ))}
                </span>
                <span data-part="sum" className="pr-1 text-right font-mono text-[11.5px] font-medium tabular-nums">{REGISTRATION_TOTAL}</span>
              </div>
            </div>

            {/* The inventions */}
            <div className="mt-14">
              <div className="flex items-baseline justify-between gap-4">
                <p className="section-label">Inventions</p>
                <p className="flex items-center gap-4 font-mono text-[10.5px] uppercase tracking-[0.08em] text-black/45" aria-hidden>
                  <span className="flex items-center gap-1.5">
                    <i className="size-2 rounded-full bg-[#171717]" />
                    Granted
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="size-2 rounded-full border border-black/40" />
                    Pending
                  </span>
                </p>
              </div>
              <ul className="mt-4 border-t border-black/10">
                {INVENTIONS.map((v) => {
                  const on = v.id === active;
                  const lit = shown(v.id);
                  const offices = v.grants.length ? v.grants.map((g) => g.office) : v.pending ? [v.pending.office] : [];
                  return (
                    <li key={v.id} className="border-b border-black/10">
                      <button
                        {...rowProps(v.id)}
                        aria-label={`${v.name}, ${v.product}: ${v.grants.length ? `granted in ${offices.join(", ")}` : "pending"}`}
                        className={`invention-row relative transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black ${
                          lit ? "bg-black/[0.035]" : "hover:bg-black/[0.02]"
                        }`}
                      >
                        <Bar on={lit} />
                        <span data-part="name" className={`text-[15px] font-medium leading-snug tracking-[-0.01em] ${lit ? "text-black" : "text-black/70"}`}>
                          {v.name}
                        </span>
                        <span className="text-[13px] text-black/50">{v.product}</span>
                        <span className="flex items-center justify-end gap-1.5 pr-1">
                          {offices.map((office) => (
                            <span
                              key={office}
                              className={`rounded-full px-2 py-[3px] font-mono text-[10.5px] leading-none ${v.grants.length ? "bg-[#171717] text-white" : "text-black/60 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.3)]"}`}
                            >
                              {office}
                            </span>
                          ))}
                          <Chevron open={on && open} />
                        </span>
                      </button>
                      {on && open && !wide ? <div className="patent-inline px-3 pb-6 pt-2 sm:px-4">{detail("inline")}</div> : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* The plate, beside the register when there is room. */}
          <aside id="patent-aside" className="patent-aside sticky top-6" aria-label="The chosen patent">
            <div className="rounded-[1.5rem] bg-[#f6f6f6] p-6">{detail("aside")}</div>
          </aside>
        </div>
      </div>

      {/* Before design: two wall labels */}
      <div className="mt-20">
        <p className="section-label">Art</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {HONORS.map((h) => (
            <div key={h.title} className="rounded-[1.25rem] border border-black/10 px-6 py-6">
              <p className="font-[family-name:var(--font-serif)] text-[26px] italic leading-tight tracking-[-0.01em]">{h.title}</p>
              <p className="mt-3 text-[15px] font-medium text-black/80">{h.what}</p>
              <p className="mt-1 font-mono text-xs tabular-nums text-black/45">{h.date}</p>
              <p className="mt-4 text-sm leading-[1.55] text-black/55">{h.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bar({ on }: { on: boolean }) {
  return <span aria-hidden className={`absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`} style={{ background: ACCENT }} />;
}

function Chevron({ open }: { open: boolean }) {
  return <ChevronDown data-part="chevron" aria-hidden className={`size-4 text-black/35 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} strokeWidth={2} />;
}

/** One to six dots: a registration each, three to a line. */
function Pips({ n }: { n: number }) {
  const cols = n === 4 ? 2 : Math.min(n, 3);
  return (
    <span className="pips text-[#171717]" style={{ "--cols": cols } as React.CSSProperties}>
      {Array.from({ length: n }, (_, i) => (
        <i key={i} />
      ))}
    </span>
  );
}

function Shell({
  place,
  meta,
  plate,
  title,
  summary,
  children,
  related,
  note,
}: {
  place: "aside" | "inline";
  meta: [string, string];
  plate: ReactNode;
  title: string;
  summary: string;
  children: ReactNode;
  related?: { title: string; href: string };
  note: string;
}) {
  return (
    <div id={place === "inline" ? "patent-inline" : undefined} className="patent-detail">
      <figure className={place === "inline" ? "self-start rounded-[1.25rem] bg-[#f6f6f6] p-4 sm:p-5" : ""}>
        <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.1em] text-black/45">
          <span>{meta[0]}</span>
          <span>{meta[1]}</span>
        </div>
        <div className="mt-3">{plate}</div>
        <figcaption className="mt-3 text-[11px] leading-[1.5] text-black/40">{note}</figcaption>
      </figure>
      <div className={place === "aside" ? "mt-5 border-t border-black/10 pt-5" : "min-w-0"}>
        <p className="text-[19px] font-semibold leading-snug tracking-[-0.02em]">{title}</p>
        <p className="mt-1.5 text-sm leading-[1.5] text-black/55">{summary}</p>
        {children}
        {related ? (
          <p className="mt-2 text-[13px] font-medium">
            <Link href={related.href} className="inline-flex min-h-9 items-center text-black/70 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black hover:decoration-black">
              Case study: {related.title}
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}

const LIST = "mt-4 border-b border-black/10";
/** Beside the table the list scrolls in what is left of the window, so the panel never outgrows it. */
const LIST_ASIDE = `${LIST} max-h-[max(7rem,calc(100svh-36.5rem))] overflow-y-auto overscroll-contain [mask-image:linear-gradient(to_bottom,#000_calc(100%_-_28px),transparent)] pb-5`;

function Record({ number, url }: { number: string; url: string | null }) {
  if (!url) return <span className="inline-flex min-h-7 items-center whitespace-nowrap text-black/55">{number}</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-7 items-center gap-0.5 whitespace-nowrap text-black/80 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
    >
      {number}
      <ArrowUpRight aria-hidden className="size-3 text-black/40" strokeWidth={2.25} />
      <span className="sr-only"> (public record, opens in a new tab)</span>
    </a>
  );
}

function DesignDetail({ design, pick, place }: { design: Design; pick: Code | null; place: "aside" | "inline" }) {
  const where = countries(design);
  const list = useRef<HTMLUListElement>(null);
  // A picked country comes to the top of the list.
  useEffect(() => {
    const ul = list.current;
    if (!ul || place !== "aside") return;
    const li = pick ? ul.querySelector<HTMLElement>(`[data-code="${pick}"]`) : null;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ul.scrollTo({ top: li ? li.offsetTop - ul.offsetTop : 0, behavior: smooth ? "smooth" : "auto" });
  }, [pick, place]);
  const on = design.surface === "web" ? "TikTok on the web" : `TikTok on tablet, ${design.orientation}`;
  return (
    <Shell
      place={place}
      meta={[groupOf(design), "Design"]}
      plate={<Plate kind={design.plate} orientation={design.orientation} draw label={`Line drawing of the design: ${design.name}, ${on}`} className="text-black/70" />}
      title={design.name}
      summary={`${on}. Registered ${total(design)} times in ${plural(where.length, "country", "countries")}, first filed in China on ${day(design.filed)}.`}
      related={design.related}
      note="Redrawn from the registered design. Dashed lines show the screen, which is not claimed; solid lines show the claimed design."
    >
      <ul ref={list} className={place === "aside" ? LIST_ASIDE : LIST}>
        {where.map((j) => {
          const numbers = design.registrations[j.code] ?? [];
          return (
            <li
              key={j.code}
              data-code={j.code}
              className={`grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 border-t border-black/10 py-2.5 transition-opacity duration-200 ${pick && pick !== j.code ? "opacity-35" : ""}`}
            >
              <span className="pt-px font-mono text-[11px] text-black/45">{j.code}</span>
              <div className="min-w-0">
                <p className="flex items-baseline justify-between gap-3 text-[13px] font-medium leading-tight">
                  {j.name}
                  <span className="font-mono text-[11px] font-normal tabular-nums text-black/40">{numbers.length}</span>
                </p>
                <p className="mt-0.5 flex flex-wrap gap-x-3.5 font-mono text-[11.5px] tabular-nums">
                  {numbers.map((number) => (
                    <Record key={number} number={number} url={recordUrl(j.code, number)} />
                  ))}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}

function InventionDetail({ invention: v, place }: { invention: Invention; place: "aside" | "inline" }) {
  const granted = v.grants.length > 0;
  const withOthers = v.coInventors ? ` Invented with ${words[v.coInventors] ?? v.coInventors} ${v.coInventors === 1 ? "colleague" : "colleagues"}.` : "";
  return (
    <Shell
      place={place}
      meta={[v.product, "Invention"]}
      plate={<Plate kind={v.plate} draw label={`Line drawing of the invention: ${v.name}`} className="text-black/70" />}
      title={v.name}
      summary={(granted ? `Invention patent, granted in ${plural(v.grants.length, "jurisdiction")}.` : `Patent application, filed in ${v.pending?.filed} and pending.`) + withOthers}
      related={v.related}
      note={
        granted
          ? "Redrawn from the patent’s figures. Dashed lines show the phone, which is not claimed; the overlapped points are in color."
          : "An illustration of the idea, not a figure from the application."
      }
    >
      <ul className={LIST}>
        {v.grants.map((g) => (
          <li key={g.office} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 border-t border-black/10 py-2.5">
            <span className="pt-px font-mono text-[11px] text-black/45">{g.office}</span>
            <div className="min-w-0">
              <p className="flex items-baseline justify-between gap-3 text-[13px] font-medium leading-tight">
                {OFFICES[g.office]}
                <span className="font-mono text-[11px] font-normal tabular-nums text-black/40">{day(g.date)}</span>
              </p>
              <p className="mt-0.5 font-mono text-[11.5px] tabular-nums">
                <Record number={`${g.office} ${g.number}`} url={g.url} />
              </p>
            </div>
          </li>
        ))}
        {v.pending ? (
          <li className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 border-t border-black/10 py-2.5">
            <span className="pt-px font-mono text-[11px] text-black/45">{v.pending.office}</span>
            <p className="flex items-baseline justify-between gap-3 text-[13px] font-medium leading-tight">
              {OFFICES[v.pending.office]}
              <span className="font-mono text-[11px] font-normal text-black/40">Pending</span>
            </p>
          </li>
        ) : null}
      </ul>
    </Shell>
  );
}
