// The Work cards: Tony's hand-made card for each project (the title and the
// one-line description are part of the artwork). Shown by WorkGrid
// (app/components/home-cards.tsx) — on the phone and tablet homepage and in
// the desktop cards view — always in the order of the index
// (app/lib/projects.ts), whatever the order here. `id` is the project's id there.

export type WorkCard = {
  id: string;
  title: string;
  company: string;
  period: "Case Study" | "Coming Soon";
  href?: string;
  image: string;
  /** The colour that glows behind the card under the pointer. */
  hoverColor: string;
  /** The colour of its shadow then. */
  glowColor: string;
};

export const WORK_CARDS: WorkCard[] = [
  {
    id: "tv",
    title: "TikTok TV Visual",
    company: "TikTok",
    period: "Case Study",
    href: "/work/tiktok-tv-visual",
    image: "/portfolio/tony-work-04.jpg",
    hoverColor: "#151515",
    glowColor: "rgba(0, 0, 0, 0.22)",
  },
  {
    id: "lutra",
    title: "CloudKitchens",
    company: "CloudKitchens",
    period: "Case Study",
    href: "/work/cloudkitchens",
    image: "/portfolio/tony-work-06.jpg",
    hoverColor: "#dfeaf4",
    glowColor: "rgba(92, 142, 183, 0.24)",
  },
  {
    id: "restructure",
    title: "TikTok Web Restructure",
    company: "TikTok",
    period: "Case Study",
    href: "/work/tiktok-restructure",
    image: "/portfolio/tony-work-21.jpg",
    hoverColor: "#151515",
    glowColor: "rgba(0, 0, 0, 0.22)",
  },
  {
    id: "multi",
    title: "TikTok Multi-Platform",
    company: "TikTok",
    period: "Case Study",
    href: "/work/tiktok-multi-platform",
    image: "/portfolio/tony-work-08.jpg",
    hoverColor: "#e7e7e5",
    glowColor: "rgba(0, 0, 0, 0.12)",
  },
  {
    id: "ds",
    title: "TikTok Design System",
    company: "TikTok",
    period: "Case Study",
    href: "/work/tiktok-design-system",
    image: "/portfolio/tony-work-09.jpg",
    hoverColor: "#161616",
    glowColor: "rgba(0, 0, 0, 0.22)",
  },
  {
    id: "tikcode",
    title: "TikCode Redesign",
    company: "TikTok",
    period: "Case Study",
    href: "/work/tiktok-tikcode",
    image: "/portfolio/tony-work-10.jpg",
    hoverColor: "#2367d4",
    glowColor: "rgba(35, 103, 212, 0.22)",
  },
  {
    id: "effects",
    title: "TikTok Effect House",
    company: "TikTok",
    period: "Coming Soon",
    image: "/portfolio/tony-work-11.jpg",
    hoverColor: "#111111",
    glowColor: "rgba(0, 0, 0, 0.24)",
  },
  {
    id: "wishlist",
    title: "Airbnb Wishlist",
    company: "Airbnb",
    period: "Case Study",
    href: "/work/airbnb-wishlist",
    image: "/portfolio/tony-work-12.jpg",
    hoverColor: "#eaffab",
    glowColor: "rgba(127, 180, 70, 0.18)",
  },
  {
    id: "hostpromo",
    title: "Airbnb Host Promotion",
    company: "Airbnb",
    period: "Coming Soon",
    image: "/portfolio/tony-work-13.jpg",
    hoverColor: "#ff5a7a",
    glowColor: "rgba(255, 90, 122, 0.22)",
  },
  {
    id: "dls",
    title: "Airbnb DLS19 for China",
    company: "Airbnb",
    period: "Coming Soon",
    image: "/portfolio/tony-work-14.jpg",
    hoverColor: "#1e1e1e",
    glowColor: "rgba(0, 0, 0, 0.2)",
  },
  {
    id: "supply",
    title: "Airbnb Supply Tool",
    company: "Airbnb",
    period: "Coming Soon",
    image: "/portfolio/tony-work-15.jpg",
    hoverColor: "#ffc37b",
    glowColor: "rgba(255, 145, 54, 0.2)",
  },
];
