// Experience and Contact. They close the homepage on phones and tablets; from
// lg up the homepage is the blueprint stage alone — one screen that does not
// scroll — and these two live on the About page (app/about/page.tsx).

import Image from "next/image";
import { CV_HREF, EMAIL_HREF, LINKEDIN_HREF } from "../lib/site-links";

const experience = [
  {
    company: "TikTok",
    role: "Lead Product Designer",
    date: "Jul 2020 - Present",
    logo: "/portfolio/tony-work-19.png",
    description:
      "Leading and contributing to design across cross-end, multi-platform features, design systems, promotion tools, and product experiences at scale.",
    skills: ["Product Strategy", "UX Design", "Design Systems", "Leadership"],
  },
  {
    company: "CloudKitchens",
    role: "Lead Product Designer",
    date: "Sep 2021 - Dec 2023",
    logo: "/portfolio/tony-work-18.png",
    description:
      "Worked on product experiences for operational platforms and tools, translating complex service workflows into user-friendly systems.",
    skills: ["B2B Products", "Operations", "Platform UX", "Systems Thinking"],
  },
  {
    company: "Airbnb",
    role: "Senior Visual Designer",
    date: "Apr 2019 - Jul 2020",
    logo: "/portfolio/tony-work-17.png",
    description:
      "Created refined visual and interface design work for high-quality product experiences in a global hospitality brand.",
    skills: ["Product Design", "Visual Design", "Design Systems", "Craft"],
  },
  {
    company: "DiDi",
    role: "Product Designer",
    date: "Jan 2017 - Apr 2019",
    logo: "/portfolio/tony-work-16.png",
    description:
      "Designed product experiences across mobility platforms, helping users move through complex service journeys with more confidence.",
    skills: ["Product Design", "Mobility", "UX", "Interaction Design"],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" data-case-section className="scroll-mt-8 py-16 lg:py-24">
      <div className="mb-6">
        <p className="section-label">Experience</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
          Where I&apos;ve designed
        </h2>
      </div>
      <div className="grid max-w-[1030px] gap-4 md:grid-cols-2">
        {experience.map((job) => (
          <article
            key={job.company}
            className="group rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_4px_24px_rgba(35,29,16,0.035)] transition duration-300 ease-out hover:-translate-y-0.5 hover:border-black/[0.1] hover:shadow-[0_14px_36px_rgba(35,29,16,0.07)]"
          >
            <div className="flex items-start gap-4">
              <Image
                src={job.logo}
                alt={`${job.company} logo`}
                width={48}
                height={48}
                className="shrink-0 rounded-[0.85rem]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                  <h3 className="text-xl font-semibold leading-[1.2] tracking-[-0.03em]">
                    {job.company}
                  </h3>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40 sm:shrink-0">
                    {job.date}
                  </p>
                </div>
                <p className="mt-2 text-sm font-medium tracking-[-0.015em] text-black/60 sm:mt-1">
                  {job.role}
                </p>
              </div>
            </div>
            <div>
              <p className="mt-5 text-sm leading-6 text-black/58">
                {job.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-black/[0.04] px-3 py-1.5 text-[11px] font-medium text-black/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" data-case-section className="scroll-mt-8 py-12 lg:py-16">
      <div className="border-t border-black/10 pt-8">
        <p className="section-label">Contact</p>
        <h2 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.075em] sm:text-7xl">
          Let&apos;s connect if you want to dive deeper.
        </h2>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={EMAIL_HREF}
            className="rounded-full bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/75"
          >
            Say Hi
          </a>
          <a
            href={LINKEDIN_HREF}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-black/12 px-5 py-3 text-sm font-semibold text-black/62 transition hover:border-black hover:text-black"
          >
            LinkedIn
          </a>
          <a
            href={CV_HREF}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-black/12 px-5 py-3 text-sm font-semibold text-black/62 transition hover:border-black hover:text-black"
          >
            CV
          </a>
        </div>
      </div>

      <footer className="mt-16 flex flex-col gap-3 text-sm text-black/42 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Tony Xing</p>
        <p>Product Designer · TikTok · Airbnb · CloudKitchens</p>
      </footer>
    </section>
  );
}
