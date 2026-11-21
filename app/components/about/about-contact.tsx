"use client";

import { useRef, useState, type ReactNode, type PointerEvent } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { CV_HREF, EMAIL_HREF, LINKEDIN_HREF } from "../../lib/site-links";

/**
 * Contact for the About page. "Copy email" puts the address on the clipboard
 * and says so (also to screen readers); "Say hi" stays a real mailto link.
 * On a mouse the buttons lean a few pixels toward the pointer; not on touch,
 * not with reduced motion.
 */

const EMAIL = EMAIL_HREF.replace(/^mailto:/, "");

function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const move = (ev: PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || ev.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = ((ev.clientX - r.left) / r.width - 0.5) * 8;
    const dy = ((ev.clientY - r.top) / r.height - 0.5) * 6;
    el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <span ref={ref} onPointerMove={move} onPointerLeave={leave} className="inline-flex transition-transform duration-300 ease-out motion-reduce:transition-none">
      {children}
    </span>
  );
}

const pill =
  "inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold transition-[background-color,border-color,color,transform] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export function AboutContact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = EMAIL_HREF;
    }
  };

  return (
    <section id="contact" data-case-section className="scroll-mt-8 py-12 lg:py-16">
      <div className="border-t border-black/10 pt-8">
        <p className="section-label">Contact</p>
        <h2 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.075em] sm:text-7xl">
          Let&apos;s connect if you want to dive deeper.
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Magnetic>
            <a href={EMAIL_HREF} className={`${pill} bg-[#171717] text-white hover:bg-black`}>
              Say hi
              <ArrowUpRight aria-hidden className="size-4" strokeWidth={2.25} />
            </a>
          </Magnetic>
          <Magnetic>
            <button type="button" onClick={copy} className={`${pill} border border-black/12 text-black/70 hover:border-black hover:text-black`}>
              {copied ? <Check aria-hidden className="size-4" strokeWidth={2.25} /> : <Copy aria-hidden className="size-4" strokeWidth={2} />}
              {copied ? "Copied" : "Copy email"}
            </button>
          </Magnetic>
          <Magnetic>
            <a href={LINKEDIN_HREF} target="_blank" rel="noreferrer" className={`${pill} border border-black/12 text-black/70 hover:border-black hover:text-black`}>
              LinkedIn
            </a>
          </Magnetic>
          <Magnetic>
            <a href={CV_HREF} target="_blank" rel="noreferrer" className={`${pill} border border-black/12 text-black/70 hover:border-black hover:text-black`}>
              CV
            </a>
          </Magnetic>
          <span className="sr-only" aria-live="polite">
            {copied ? "Email address copied" : ""}
          </span>
        </div>
      </div>

      <footer className="mt-16 flex flex-col gap-3 text-sm text-black/42 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Tony Xing</p>
        <p>Product Designer · TikTok · CloudKitchens · Airbnb</p>
      </footer>
    </section>
  );
}
