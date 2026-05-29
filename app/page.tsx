import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioShell } from "./components/portfolio-shell";

const work = [
  {
    title: "TikTok TV Visual",
    company: "TikTok",
    period: "Case Study",
    href: "/work/tiktok-tv-visual",
    image: "/portfolio/tony-work-04.jpg",
    hoverColor: "#151515",
    glowColor: "rgba(0, 0, 0, 0.22)",
  },
  {
    title: "CloudKitchens",
    company: "CloudKitchens",
    period: "Case Study",
    image: "/portfolio/tony-work-06.jpg",
    hoverColor: "#dfeaf4",
    glowColor: "rgba(92, 142, 183, 0.24)",
  },
  {
    title: "TikTok Web Restructure",
    company: "TikTok",
    period: "Case Study",
    image: "/portfolio/tony-work-21.jpg",
    hoverColor: "#151515",
    glowColor: "rgba(0, 0, 0, 0.22)",
  },
  {
    title: "TikTok Multi-Platform",
    company: "TikTok",
    period: "Case Study",
    image: "/portfolio/tony-work-08.jpg",
    hoverColor: "#e7e7e5",
    glowColor: "rgba(0, 0, 0, 0.12)",
  },
  {
    title: "TikTok Design System",
    company: "TikTok",
    period: "Case Study",
    image: "/portfolio/tony-work-09.jpg",
    hoverColor: "#161616",
    glowColor: "rgba(0, 0, 0, 0.22)",
  },
  {
    title: "TikCode Redesign",
    company: "TikTok",
    period: "Case Study",
    image: "/portfolio/tony-work-10.jpg",
    hoverColor: "#2367d4",
    glowColor: "rgba(35, 103, 212, 0.22)",
  },
  {
    title: "TikTok Effect House",
    company: "TikTok",
    period: "Coming Soon",
    image: "/portfolio/tony-work-11.jpg",
    hoverColor: "#111111",
    glowColor: "rgba(0, 0, 0, 0.24)",
  },
  {
    title: "Airbnb Wishlist",
    company: "Airbnb",
    period: "Case Study",
    image: "/portfolio/tony-work-12.jpg",
    hoverColor: "#eaffab",
    glowColor: "rgba(127, 180, 70, 0.18)",
  },
  {
    title: "Airbnb Host Promotion",
    company: "Airbnb",
    period: "Coming Soon",
    image: "/portfolio/tony-work-13.jpg",
    hoverColor: "#ff5a7a",
    glowColor: "rgba(255, 90, 122, 0.22)",
  },
  {
    title: "Airbnb DLS19 for China",
    company: "Airbnb",
    period: "Coming Soon",
    image: "/portfolio/tony-work-14.jpg",
    hoverColor: "#1e1e1e",
    glowColor: "rgba(0, 0, 0, 0.2)",
  },
  {
    title: "Airbnb Supply Tool",
    company: "Airbnb",
    period: "Coming Soon",
    image: "/portfolio/tony-work-15.jpg",
    hoverColor: "#ffc37b",
    glowColor: "rgba(255, 145, 54, 0.2)",
  },
];

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
    skills: ["Visual Design", "Brand Systems", "UI Design", "Craft"],
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

const companies = [
  "TikTok",
  "Airbnb",
  "CloudKitchens",
  "DiDi",
];

const marqueeCompanies = [
  ...companies,
  ...companies,
  ...companies,
  ...companies,
];

export default function Home() {
  return (
    <PortfolioShell>
        <div className="marquee-viewport -mx-6 hidden overflow-hidden py-1 sm:-mx-10 sm:block lg:-mx-14 2xl:-mx-16">
          <div className="marquee-track flex min-w-max text-lg font-semibold tracking-[-0.045em] text-black/18 sm:text-2xl">
            {[0, 1].map((group) => (
              <div
                key={group}
                className="flex shrink-0 gap-7 pr-7"
                aria-hidden={group === 1}
              >
                {marqueeCompanies.map((company, index) => (
                  <span key={`${group}-${company}-${index}`} className="shrink-0">
                    {company}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section
          id="about"
          className="flex min-h-[calc(100vh-48px)] scroll-mt-8 items-center justify-center py-14 lg:py-16"
        >
          <div className="w-full max-w-5xl">
            <h1 className="max-w-4xl text-3xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-4xl lg:text-5xl 2xl:text-6xl">
              Hi, I&apos;m Tony.
              <br />
              I&apos;m a Lead Product Designer at TikTok,
              focused on cross-platform products, design systems, promotion
              tools, and user-friendly experiences.
            </h1>
            <p className="mt-8 max-w-2xl text-sm leading-6 tracking-[-0.015em] text-black/54 sm:text-base sm:leading-7">
              With 10+ years of design experience across TikTok, Airbnb,
              CloudKitchens, and DiDi, I bring product thinking, visual craft,
              and attention to detail to complex digital journeys.
            </p>
            <a
              href="#work"
              className="mt-10 inline-flex rounded-full border border-black/10 bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/62 shadow-[0_8px_28px_rgba(0,0,0,0.055)] transition hover:-translate-y-0.5 hover:border-black/20 hover:text-black"
            >
              Selected work ↓
            </a>
          </div>
        </section>

        <section id="work" className="scroll-mt-8 py-10 lg:py-16">
          <div className="mb-9 max-w-2xl">
            <div>
              <p className="section-label">Work</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
                Case studies
              </h2>
              <p className="mt-6 text-base leading-7 text-black/56">
                A compact index of product, systems, and visual design work.
                Local case study pages will be added one by one.
              </p>
            </div>
          </div>

          <div className="grid w-full gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))] lg:gap-6 2xl:gap-7">
            {work.map((project) => {
              const cardContent = (
                <>
                  <div className="absolute -inset-1 rounded-[1.4rem] bg-[var(--card-hover)] opacity-0 blur-lg transition duration-500 group-hover:opacity-10" />
                  <div className="relative overflow-hidden rounded-[1.25rem] bg-white shadow-[0_6px_28px_rgba(35,29,16,0.035)] transition duration-300 group-hover:shadow-[0_10px_42px_var(--card-glow)]">
                    <div className="relative aspect-[1600/1880] overflow-hidden bg-[#e8e1d3]">
                      <Image
                        src={project.image}
                        alt={`${project.title} preview`}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
                        className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.008]"
                      />
                      <div className="pointer-events-none absolute left-4 top-4 translate-y-1 rounded-full border border-white/45 bg-white/78 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/78 opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        {project.period}
                      </div>
                    </div>
                  </div>
                </>
              );

              const cardStyle = {
                "--card-hover": project.hoverColor,
                "--card-glow": project.glowColor,
              } as CSSProperties;

              const isCaseStudy = project.period === "Case Study";

              if (project.href) {
                return (
                  <Link
                    key={project.title}
                    href={project.href}
                    style={cardStyle}
                    className="group relative w-full overflow-visible rounded-[1.25rem]"
                    aria-label={`Open ${project.title} case study`}
                    data-cursor="view"
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <article
                  key={project.title}
                  style={cardStyle}
                  className="group relative w-full overflow-visible rounded-[1.25rem]"
                  {...(isCaseStudy ? { "data-cursor": "view" } : {})}
                >
                  {cardContent}
                </article>
              );
            })}
          </div>
        </section>

        <section id="experience" className="scroll-mt-8 py-16 lg:py-24">
          <div className="mb-6">
            <p className="section-label">Experience</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
              Where I&apos;ve designed
            </h2>
          </div>
          <div className="grid max-w-[1030px] gap-4 sm:grid-cols-2">
            {experience.map((job) => (
              <article
                key={job.company}
                className="rounded-[1.5rem] border border-black/[0.08] bg-[#fafafa] p-5 shadow-[0_6px_28px_rgba(35,29,16,0.028)]"
              >
                <div className="flex items-start gap-4">
                  <Image
                    src={job.logo}
                    alt={`${job.company} logo`}
                    width={52}
                    height={52}
                    className="rounded-[1rem]"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-2xl font-semibold tracking-[-0.055em]">
                        {job.company}
                      </h3>
                      <p className="text-sm text-black/44">{job.date}</p>
                    </div>
                    <p className="mt-3 text-base font-medium tracking-[-0.025em]">
                      {job.role}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="mt-5 text-sm leading-6 text-black/58">
                    {job.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-black/10 px-3 py-1.5 text-[11px] font-medium text-black/54"
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

        <section id="contact" className="scroll-mt-8 py-12 lg:py-16">
          <div className="border-t border-black/10 pt-8">
            <p className="section-label">Contact</p>
            <h2 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.075em] sm:text-7xl">
              Let&apos;s connect if you want to dive deeper.
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="mailto:xingtong198907216810@gmail.com"
                className="rounded-full bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/75"
              >
                Say Hi
              </a>
              <a
                href="https://www.linkedin.com/in/tongxingdesign/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black/12 px-5 py-3 text-sm font-semibold text-black/62 transition hover:border-black hover:text-black"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <footer className="mt-16 flex flex-col gap-3 text-sm text-black/42 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Tony Xing</p>
            <p>Product Designer · TikTok · Airbnb · CloudKitchens</p>
          </footer>
        </section>
    </PortfolioShell>
  );
}
