import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Phones and tablets: a short "who" between the work and contact, pointing to
 * the About page — which holds the career, patents and honors, so the
 * homepage no longer keeps its own (older) copy of them.
 */

const LOGOS = [
  ["TikTok", "/portfolio/tony-work-19.png"],
  ["CloudKitchens", "/portfolio/tony-work-18.png"],
  ["Airbnb", "/portfolio/tony-work-17.png"],
  ["DiDi", "/portfolio/tony-work-16.png"],
];

export function HomeAboutTeaser() {
  return (
    <section id="about-me" data-case-section className="scroll-mt-8 py-16 lg:hidden">
      <p className="section-label">About</p>
      <h2 className="mt-2 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">From illustration to AI agents</h2>
      <p className="mt-6 max-w-[40rem] text-[17px] leading-[1.55] text-black/60 sm:text-lg">
        I started as an illustrator, made motion graphics in New York, then designed products at DiDi, Airbnb,
        CloudKitchens and TikTok, where I led the TikTok TV design team. Today I design AI agent products at Okou
        and extend.
      </p>
      <div className="mt-8 flex items-center gap-2.5" aria-label="TikTok, CloudKitchens, Airbnb and DiDi">
        {LOGOS.map(([name, src]) => (
          <Image key={name} src={src} alt="" width={40} height={40} className="size-10 rounded-[0.75rem] ring-1 ring-black/[0.06]" />
        ))}
        <span className="ml-1 text-sm text-black/45">and four more</span>
      </div>
      <Link
        href="/about"
        className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-black/12 px-5 py-3 text-sm font-semibold text-black/75 transition-colors hover:border-black hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        Career, patents and more
        <ArrowRight aria-hidden className="size-4" strokeWidth={2.25} />
      </Link>
    </section>
  );
}
