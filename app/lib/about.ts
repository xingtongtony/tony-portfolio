// About page content, from Tony's LinkedIn profile (read 21 Nov 2026).
// Wording is LinkedIn's, with spelling and grammar fixed; nothing added.
// Months are "YYYY-MM"; `end: null` means the role is current. LinkedIn's end
// month is usually the next role's start month, so the ruler ends a role at the
// start of its end month.

export type Role = {
  company: string;
  role: string;
  kind?: "Contract";
  start: string;
  end: string | null;
  place: string;
  points: string[];
  /** Case studies on this site from this role. */
  work?: { title: string; href: string; cover: string }[];
  /** What the role was mostly about, drawn from its points — used to filter the timeline. */
  craft: Craft[];
};

export const CRAFTS = ["Product", "Systems", "Leadership", "Visual", "Motion", "Brand"] as const;
export type Craft = (typeof CRAFTS)[number];

export const ROLES: Role[] = [
  {
    company: "Okou",
    role: "Founding Designer",
    kind: "Contract",
    start: "2026-04",
    end: null,
    place: "Beijing · Remote",
    points: [],
    craft: ["Product"],
  },
  {
    company: "extend",
    role: "Lead Product Designer",
    start: "2026-04",
    end: null,
    place: "Shanghai",
    points: [],
    craft: ["Product", "Leadership"],
  },
  {
    company: "Otter",
    role: "Lead Product Designer",
    kind: "Contract",
    start: "2025-09",
    end: "2026-02",
    place: "Remote",
    points: [],
    craft: ["Product"],
  },
  {
    company: "TikTok",
    role: "Lead Product Designer",
    start: "2024-03",
    end: "2025-07",
    place: "San Jose, California",
    points: [
      "Led the TikTok TV product design team, mentoring junior designers and guiding the team.",
      "Redesigned the visual language of TikTok TV into a distinctive product that stands out in the global market.",
      "Worked with cross-functional teams on TV Search, Creator Profile, the Video Player and Navigation — DAU more than doubled in 2024.",
      "Partnered with other OS platforms on TV casting, and introduced a short-video display format made for the OS.",
    ],
    work: [
      { title: "TV Visual", href: "/work/tiktok-tv-visual", cover: "/portfolio/tiktok-tv/tv-17.jpg" },
      { title: "TV Navigation", href: "/work/tiktok-tv-navigation", cover: "/portfolio/tiktok-tv-navigation/tv-nav-01.jpg" },
      { title: "TV Profile", href: "/work/tiktok-tv-profile", cover: "/portfolio/tiktok-tv-profile/pf-01.jpg" },
      { title: "TV Search", href: "/work/tiktok-tv-search", cover: "/portfolio/tiktok-tv-search/sr-01.jpg" },
    ],
    craft: ["Product", "Leadership", "Visual"],
  },
  {
    company: "CloudKitchens",
    role: "Lead Product Designer",
    start: "2021-11",
    end: "2024-01",
    place: "Hybrid",
    points: [
      "Led a team of designers building an all-in-one restaurant automation platform for the Chinese market.",
      "Ran localization, market and user research into the pain points of small and medium-sized merchants, and set priorities with leadership.",
      "Worked with the global CSDS team on a consistent, scalable design system.",
      "Built a location selection tool that makes operations more efficient and maps the competition around a site.",
    ],
    work: [{ title: "Lutra App", href: "/work/cloudkitchens", cover: "/portfolio/cloudkitchens/ck-02.jpg" }],
    craft: ["Product", "Leadership", "Systems"],
  },
  {
    company: "TikTok",
    role: "Senior Product Designer",
    start: "2020-07",
    end: "2021-11",
    place: "Beijing",
    points: [
      "Led TikTok’s cross-platform design — iPad, TV, the WebApp and landing pages — and the growth design around them.",
      "Directed the TikTok Web design system with a compact team, documenting how multi-platform components behave.",
      "Explored new platforms, including Effect Studio, where advertisers create effects made for their needs.",
    ],
    work: [
      { title: "Web Restructure", href: "/work/tiktok-restructure", cover: "/portfolio/tiktok-restructure/tr-02.jpg" },
      { title: "Multi-Platform", href: "/work/tiktok-multi-platform", cover: "/portfolio/tiktok-multi-platform/mp-02.jpg" },
      { title: "Design System", href: "/work/tiktok-design-system", cover: "/portfolio/tiktok-design-system/ds-02.jpg" },
      { title: "TikCode", href: "/work/tiktok-tikcode", cover: "/portfolio/tiktok-tikcode/tk-02.jpg" },
    ],
    craft: ["Product", "Systems", "Leadership"],
  },
  {
    company: "Airbnb",
    role: "Senior Visual Designer",
    start: "2019-04",
    end: "2020-07",
    place: "Beijing",
    points: [
      "Localized the Airbnb app for China: the promotion center, the hosts’ promotion tools and a mini app.",
      "Worked with cross-functional and operations teams on one visual style and interaction model for guests and hosts.",
      "Built and maintained the Airbnb DLS design system for the China market.",
      "Designed an internal tool that made the local sales team faster and cheaper to run.",
    ],
    work: [{ title: "Wishlist", href: "/work/airbnb-wishlist", cover: "/portfolio/airbnb-wishlist/ab-02.jpg" }],
    craft: ["Visual", "Systems", "Product"],
  },
  {
    company: "DiDi",
    role: "Senior Product Designer",
    start: "2018-01",
    end: "2019-04",
    place: "Beijing",
    points: [
      "Shipped feature iterations with product managers, from wireframes and prototypes to user research.",
      "Designed the DiDi AI chatbot and the mobile driver assistant end to end — UI and UX, branding and motion.",
      "Redesigned DiDi’s internal feature and tag systems.",
    ],
    craft: ["Product", "Brand", "Motion"],
  },
  {
    company: "GrowingIO",
    role: "Visual Designer",
    start: "2016-05",
    end: "2018-01",
    place: "Beijing",
    points: [
      "Owned the brand identity and built the design system.",
      "Made product motion graphics, built the website with developers, and delivered wireframes for new features.",
    ],
    craft: ["Brand", "Systems", "Motion", "Visual"],
  },
  {
    company: "Pond5",
    role: "Visual Designer",
    start: "2015-05",
    end: "2016-05",
    place: "New York",
    points: [
      "Developed the brand’s motion graphics style and edited video.",
      "Designed promotions for print and digital — typography and motion for Instagram and Facebook.",
      "Made a series of advanced After Effects tutorials.",
    ],
    craft: ["Motion", "Brand", "Visual"],
  },
];

export const EDUCATION = [
  {
    school: "Cranbrook Academy of Art",
    degree: "MFA, Graphic Design",
    years: "2013 – 2015",
    note: "Two years of studio practice in motion graphics, branding, posters, video editing, typography, lettering and wood type.",
  },
  {
    school: "Beijing Institute of Graphic Communication",
    degree: "Bachelor’s degree, Illustration",
    years: "2009 – 2013",
    note: "Color studies, graphic design, drawing, painting, screen print, illustration, art history and contemporary art.",
  },
];

export const PATENTS = [
  { title: "Two-dimensional code displaying method and apparatus, device, and medium", number: "21917282.2", issued: "Dec 22, 2021" },
  { title: "Display screen or portion thereof with a graphical user interface", number: "USD0990500S1", issued: "Oct 12, 2021" },
  { title: "Display screen or portion thereof with a graphical user interface", number: "USD0990501S1", issued: "Oct 12, 2021" },
  { title: "Display screen or portion thereof with a graphical user interface", number: "USD0986265S1", issued: "Oct 4, 2021" },
  { title: "Display screen or portion thereof with a graphical user interface", number: "USD0986264S1", issued: "Oct 4, 2021" },
];

export const HONORS = [
  { title: "Experiencing Perspectives Art Exhibition, Mercedes-Benz", date: "May 2014", note: "A body of my work was selected for the exhibition. With Cranbrook Academy of Art." },
  { title: "Painting Collection", date: "Sep 2012", note: "One of my paintings was collected by the Beijing Institute of Graphic Communication." },
];

export const LANGUAGES = [
  { name: "Chinese", level: "Native" },
  { name: "English", level: "Full professional" },
];

export const SKILLS = ["Product Design", "User Experience", "UI Design", "Visual Design", "Motion Graphics", "Animation", "Illustration", "After Effects", "Management"];
