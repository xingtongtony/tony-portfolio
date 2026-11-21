// Stills of the blueprint stage's figures for phones and tablets, where the
// 3D stage is not loaded. Rendered from the stage itself (21 Nov 2026) and
// cropped square around the point where the stage centres every figure: public/portfolio/stage/<id>.jpg. `labels` are the figure's
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
    paper: "#E8E3FA",
    labels: [["102", 0.6931, 0.3786], ["104", 0.6609, 0.6523], ["106", 0.0506, 0.5954]],
  },
  {
    id: "lutra",
    fig: "FIG. 2",
    desc: "An operating dashboard for restaurants, from live orders to recommended coupons.",
    paper: "#FBE5DD",
    labels: [["202", 0.2016, 0.2261], ["204", 0.6794, 0.467], ["206", 0.6324, 0.6982]],
  },
  {
    id: "restructure",
    fig: "FIG. 3",
    desc: "A video-first browser mode that makes every post discoverable and shareable.",
    paper: "#FBF0D1",
    labels: [["302", 0.1627, 0.2068], ["304", 0.7437, 0.4879], ["306", 0.6034, 0.7745]],
  },
  {
    id: "multi",
    fig: "FIG. 4",
    desc: "An iPad experience that keeps videos, navigation and conversation in view.",
    paper: "#FAE2EB",
    labels: [["402", 0.1836, 0.2532], ["404", 0.7569, 0.5057], ["406", 0.0566, 0.5234]],
  },
  {
    id: "ds",
    fig: "FIG. 5",
    desc: "Reusable component variants, with adaptive layouts and shared motion rules.",
    paper: "#E3ECF9",
    labels: [["502", 0.0488, 0.4057], ["504", 0.7664, 0.3175], ["506", 0.5455, 0.2443]],
  },
  {
    id: "tikcode",
    fig: "FIG. 6",
    desc: "A new shareable code for TikTok profiles, sounds, hashtags and effects.",
    paper: "#DBF1EF",
    labels: [["602", 0.1696, 0.2822], ["604", 0.6625, 0.5749], ["606", 0.0495, 0.5884]],
  },
  {
    id: "wishlist",
    fig: "FIG. 7",
    desc: "Compare saved stays, share a shortlist and decide together where to book.",
    paper: "#DFF0E7",
    labels: [["702", 0.3641, 0.21], ["704", 0.7435, 0.4525], ["706", 0.6053, 0.6775]],
  },
  {
    id: "effects",
    fig: "FIG. 8",
    desc: "An AR effect creation tool for TikTok creators.",
    paper: "#EDEDED",
    labels: [["802", 0.4395, 0.208], ["804", 0.6213, 0.7246], ["806", 0.6256, 0.4637]],
  },
  {
    id: "hostpromo",
    fig: "FIG. 9",
    desc: "Campaign tools to attract and allocate traffic to listings from hosts in China.",
    paper: "#ECECEC",
    labels: [["902", 0.5032, 0.302], ["904", 0.1756, 0.3288], ["906", 0.3486, 0.6429]],
  },
  {
    id: "dls",
    fig: "FIG. 10",
    desc: "A localized component library for the China design team.",
    paper: "#EDEDED",
    labels: [["1002", 0.7438, 0.4322], ["1004", 0.507, 0.7483], ["1006", 0.1597, 0.3467]],
  },
  {
    id: "supply",
    fig: "FIG. 11",
    desc: "A workspace for the China supply team to track listings and their performance.",
    paper: "#EDEDED",
    labels: [["1102", 0.7363, 0.4421], ["1104", 0.6133, 0.7387], ["1106", 0.4233, 0.2042]],
  },
];
