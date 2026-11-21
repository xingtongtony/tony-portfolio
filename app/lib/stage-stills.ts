// Stills of the blueprint stage's figures for phones and tablets, where the
// 3D stage is not loaded. Rendered from the stage itself (21 Nov 2026) and
// cropped square: public/portfolio/stage/<id>.jpg. `labels` are the figure's
// reference numerals where its leader lines end, as fractions of the still.
// Descriptions are the figures' own (app/components/blueprint/figures.ts);
// re-render the stills when a figure changes.

export type Still = {
  id: string;
  fig: string;
  desc: string;
  /** The color along the still's bottom edge, so the caption under it continues the paper. */
  paper: string;
  labels: [string, number, number][];
};

export const STILLS: Still[] = [
  {
    id: "tv",
    fig: "FIG. 1",
    desc: "A more immersive TV feed, with layered backgrounds and clearer remote focus.",
    paper: "#E7E3FA",
    labels: [["102", 0.7033, 0.38], ["104", 0.6723, 0.6431], ["106", 0.0858, 0.5884]],
  },
  {
    id: "lutra",
    fig: "FIG. 2",
    desc: "An operating dashboard for restaurants, from live orders to recommended coupons.",
    paper: "#FBE6DF",
    labels: [["202", 0.1403, 0.2242], ["204", 0.646, 0.4791], ["206", 0.5963, 0.7238]],
  },
  {
    id: "restructure",
    fig: "FIG. 3",
    desc: "A video-first browser mode that makes every post discoverable and shareable.",
    paper: "#FBF0D1",
    labels: [["302", 0.1788, 0.2276], ["304", 0.7353, 0.4968], ["306", 0.601, 0.7713]],
  },
  {
    id: "multi",
    fig: "FIG. 4",
    desc: "An iPad experience that keeps videos, navigation and conversation in view.",
    paper: "#FAE1EB",
    labels: [["402", 0.207, 0.2566], ["404", 0.7515, 0.4964], ["406", 0.0864, 0.5132]],
  },
  {
    id: "ds",
    fig: "FIG. 5",
    desc: "Reusable component variants, with adaptive layouts and shared motion rules.",
    paper: "#E3ECF9",
    labels: [["502", 0.0863, 0.4228], ["504", 0.7945, 0.3358], ["506", 0.5765, 0.2635]],
  },
  {
    id: "tikcode",
    fig: "FIG. 6",
    desc: "A new shareable code for TikTok profiles, sounds, hashtags and effects.",
    paper: "#DBF1EF",
    labels: [["602", 0.2013, 0.2769], ["604", 0.6754, 0.5584], ["606", 0.0859, 0.5713]],
  },
  {
    id: "wishlist",
    fig: "FIG. 7",
    desc: "Compare saved stays, share a shortlist and decide together where to book.",
    paper: "#E0F0E6",
    labels: [["702", 0.3778, 0.2554], ["704", 0.7373, 0.4852], ["706", 0.6064, 0.6984]],
  },
  {
    id: "effects",
    fig: "FIG. 8",
    desc: "An AR effect creation tool for TikTok creators.",
    paper: "#EDEDED",
    labels: [["802", 0.4256, 0.2276], ["804", 0.6061, 0.7408], ["806", 0.6104, 0.4816]],
  },
  {
    id: "hostpromo",
    fig: "FIG. 9",
    desc: "Campaign tools to attract and allocate traffic to listings from hosts in China.",
    paper: "#EDEDED",
    labels: [["902", 0.4641, 0.2886], ["904", 0.1207, 0.3168], ["906", 0.302, 0.646]],
  },
  {
    id: "dls",
    fig: "FIG. 10",
    desc: "A localized component library for the China design team.",
    paper: "#EDEDED",
    labels: [["1002", 0.7147, 0.3847], ["1004", 0.4639, 0.7194], ["1006", 0.0961, 0.2941]],
  },
  {
    id: "supply",
    fig: "FIG. 11",
    desc: "A workspace for the China supply team to track listings and their performance.",
    paper: "#EDEDED",
    labels: [["1102", 0.7162, 0.4534], ["1104", 0.5913, 0.7546], ["1106", 0.3983, 0.2119]],
  },
];
