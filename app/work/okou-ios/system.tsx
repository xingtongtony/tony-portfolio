import {
  ArrowUp, Bell, Check, ChevronRight, Copy, Folder, Hourglass, Layers, ListFilter, MessageCircle, Mic, Pin, Plug, Plus, Search, Share2,
  ShieldCheck, SquarePen,
} from "lucide-react";
import type { ReactNode } from "react";

// The mobile design system, set out as what it is rather than photographed:
// the real tokens (ios/Okou/DesignSystem/Foundations — colours generated from
// the web's, Geist on the native type scale, Lucide icons, native geometry).

const colours: { name: string; light: string; dark: string; ring?: boolean }[] = [
  { name: "Background", light: "#FFFFFF", dark: "#242321", ring: true },
  { name: "Sidebar", light: "#FCF9F8", dark: "#353332", ring: true },
  { name: "Border", light: "#E0DDDC", dark: "#494847" },
  { name: "Foreground", light: "#242424", dark: "#FAF5F3" },
  { name: "Muted", light: "#4E4C4C", dark: "#C7C5C3" },
  { name: "Primary", light: "#FFA500", dark: "#FFA500" },
  { name: "Brand text", light: "#885600", dark: "#FFA500" },
  { name: "Link", light: "#2955BC", dark: "#8DAAEC" },
  { name: "Interrupt", light: "#FF6030", dark: "#FF6030" },
  { name: "Running", light: "#0084D1", dark: "#0084D1" },
];

const type: { role: string; size: number; weight: number }[] = [
  { role: "Large title", size: 34, weight: 600 },
  { role: "Title", size: 28, weight: 600 },
  { role: "Title 2", size: 22, weight: 600 },
  { role: "Headline", size: 17, weight: 600 },
  { role: "Body", size: 17, weight: 400 },
  { role: "Subheadline", size: 15, weight: 400 },
  { role: "Footnote", size: 13, weight: 400 },
];

const icons = [
  SquarePen, Search, Plus, Mic, ArrowUp, ListFilter, Folder, MessageCircle, Pin, Hourglass, Layers, Copy, Share2, Plug, ShieldCheck, Bell,
  Check, ChevronRight,
];

const radii = [
  { name: "Small", value: 8 },
  { name: "Control", value: 14 },
  { name: "Chat", value: 16 },
  { name: "Card", value: 20 },
  { name: "Sheet", value: 28 },
];

const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48];

function Card({ label, className = "", children, dark = false }: { label: string; className?: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className={`flex flex-col rounded-[2rem] p-7 sm:p-9 ${dark ? "bg-[#252121] text-white" : "bg-[#f4efe9] text-[#252121]"} ${className}`}>
      <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${dark ? "text-white/45" : "text-[rgb(37_33_33/0.45)]"}`}>{label}</p>
      <div className="mt-7 flex-1">{children}</div>
    </div>
  );
}

/** Colour, type, icons and geometry: the foundations every screen is built from. */
export function SystemSpecimen() {
  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <Card label="Colour · light and dark from one token" className="lg:col-span-7">
        <ul className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-5">
          {colours.map((colour) => (
            <li key={colour.name}>
              {/* One chip, split on the diagonal: its light value over its dark one. */}
              <div
                className={`aspect-[5/4] rounded-[14px] ${colour.ring ? "ring-1 ring-[rgb(37_33_33/0.1)]" : ""}`}
                style={{ background: `linear-gradient(135deg, ${colour.light} 0 50%, ${colour.dark} 50% 100%)` }}
              />
              <p className="mt-2.5 text-[13px] font-medium leading-none">{colour.name}</p>
              <p className="mt-1.5 font-mono text-[10.5px] leading-none text-[rgb(37_33_33/0.5)]">{colour.light}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card label="Type · Geist on the native scale" className="lg:col-span-5">
        <ul className="flex flex-col gap-2.5">
          {type.map((row) => (
            <li key={row.role} className="flex items-baseline justify-between gap-4 border-b border-[rgb(37_33_33/0.08)] pb-2.5 last:border-0 last:pb-0">
              <span className="truncate leading-none tracking-[-0.02em]" style={{ fontSize: row.size * 0.92, fontWeight: row.weight }}>
                {row.role}
              </span>
              <span className="shrink-0 font-mono text-[11px] text-[rgb(37_33_33/0.5)]">{row.size} pt</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card label="Icons · Lucide at native optical weight" dark className="lg:col-span-5">
        <ul className="grid grid-cols-6 gap-y-6">
          {icons.map((Icon, i) => (
            <li key={i} className="flex justify-center">
              <Icon aria-hidden className="size-6" strokeWidth={1.75} />
            </li>
          ))}
        </ul>
      </Card>

      <Card label="Shape and space · native geometry" className="lg:col-span-7">
        <div className="grid gap-8 sm:grid-cols-2">
          <ul className="flex items-end gap-3">
            {radii.map((radius) => (
              <li key={radius.name} className="flex-1">
                <div className="aspect-square border-l-2 border-t-2 border-[#252121]" style={{ borderTopLeftRadius: radius.value * 1.6 }} />
                <p className="mt-2.5 text-[12px] font-medium leading-none">{radius.name}</p>
                <p className="mt-1.5 font-mono text-[10.5px] leading-none text-[rgb(37_33_33/0.5)]">{radius.value}</p>
              </li>
            ))}
          </ul>
          <div>
            <ul className="flex items-end gap-1.5">
              {spacing.map((step) => (
                <li key={step} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-[3px] bg-[#ffa500]" style={{ height: step * 1.5 }} />
                  <span className="font-mono text-[10.5px] leading-none text-[rgb(37_33_33/0.5)]">{step}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[13px] leading-[1.45] text-[rgb(37_33_33/0.64)]">
              A 24 pt page inset, 44 pt targets, and controls centred on their corner’s own arc.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
