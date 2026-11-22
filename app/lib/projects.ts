// The projects, in the order the site shows them. One list for the
// navigation panel and the phone menu; the blueprint stage's figures
// (app/components/blueprint/figures.ts) use the same ids in the same order,
// and the stage warns in development if the two drift apart.
//
// Only entries with a route are case studies. The rest are finished work
// whose write-up is still to come: the homepage shows them as "Soon", and
// other pages leave them out.

export type Project = {
  id: string;
  title: string;
  href?: string;
  /** A path prefix that also counts as this project (all the TikTok TV pages). */
  match?: string;
};

export const PROJECTS: Project[] = [
  { id: "okou", title: "Okou iOS App", href: "/work/okou-ios" },
  { id: "tv", title: "TikTok TV Revamp", href: "/work/tiktok-tv-visual", match: "/work/tiktok-tv" },
  { id: "lutra", title: "CloudKitchens Lutra App", href: "/work/cloudkitchens" },
  { id: "restructure", title: "TikTok Web Restructure", href: "/work/tiktok-restructure" },
  { id: "multi", title: "TikTok Multi-Platform", href: "/work/tiktok-multi-platform" },
  { id: "ds", title: "TikTok Design System", href: "/work/tiktok-design-system" },
  { id: "tikcode", title: "TikCode Redesign", href: "/work/tiktok-tikcode" },
  { id: "wishlist", title: "Airbnb Wishlist", href: "/work/airbnb-wishlist" },
  { id: "effects", title: "TikTok Effect House" },
  { id: "hostpromo", title: "Airbnb Host Promotion" },
  { id: "dls", title: "Airbnb DLS19 for China" },
  { id: "supply", title: "Airbnb Supply Tool" },
];
