// Stills of the blueprint stage's figures for phones and tablets, where the
// 3D stage is not loaded. Rendered from the stage itself (21 Nov 2026; Okou 22 Nov) and
// cropped square with the model (its own extent, measured by eye, without
// shadow or leader lines) in the middle, all at the same visual weight (the
// square root of the box's area is 60% of the side; at most 82% wide, 70% tall):
// public/portfolio/stage/<id>-v<STILL_VERSION>.jpg (bump the version with every
// re-render, so no cached image outlives its numerals). `labels` are the figure's
// reference numerals where its leader lines end, as fractions of the still.
// Descriptions are the figures' own (app/components/blueprint/figures.ts);
// re-render the stills when a figure changes.

export const STILL_VERSION = 4;

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
    id: "okou",
    fig: "FIG. 1",
    desc: "A native iPhone app for working with AI agents, wherever you are.",
    paper: "#F9EDDD",
    labels: [["102", 0.2966, 0.1247], ["104", 0.8556, 0.309], ["106", 0.1254, 0.652]],
  },
  {
    id: "tv",
    fig: "FIG. 2",
    desc: "A more immersive TV feed, with layered backgrounds and clearer remote focus.",
    paper: "#E8E2FA",
    labels: [["202", 0.7234, 0.3807], ["204", 0.6926, 0.6429], ["206", 0.108, 0.5884]],
  },
  {
    id: "lutra",
    fig: "FIG. 3",
    desc: "An operating dashboard for restaurants, from live orders to recommended coupons.",
    paper: "#FAE4DD",
    labels: [["302", 0.18, 0.1437], ["304", 0.6935, 0.4026], ["306", 0.643, 0.6511]],
  },
  {
    id: "restructure",
    fig: "FIG. 4",
    desc: "A video-first browser mode that makes every post discoverable and shareable.",
    paper: "#FBF0D1",
    labels: [["402", 0.2366, 0.1519], ["404", 0.8493, 0.4484], ["406", 0.7014, 0.7506]],
  },
  {
    id: "multi",
    fig: "FIG. 5",
    desc: "An iPad experience that keeps videos, navigation and conversation in view.",
    paper: "#FAE1EB",
    labels: [["502", 0.202, 0.2288], ["504", 0.7618, 0.4753], ["506", 0.078, 0.4927]],
  },
  {
    id: "ds",
    fig: "FIG. 6",
    desc: "Reusable component variants, with adaptive layouts and shared motion rules.",
    paper: "#E3ECF9",
    labels: [["602", 0.0503, 0.364], ["604", 0.8146, 0.2701], ["606", 0.5793, 0.1922]],
  },
  {
    id: "tikcode",
    fig: "FIG. 7",
    desc: "A new shareable code for TikTok profiles, sounds, hashtags and effects.",
    paper: "#DCF1F0",
    labels: [["702", 0.1504, 0.1991], ["704", 0.7035, 0.5276], ["706", 0.04, 0.5427]],
  },
  {
    id: "wishlist",
    fig: "FIG. 8",
    desc: "Compare saved stays, share a shortlist and decide together where to book.",
    paper: "#E0F0E7",
    labels: [["802", 0.4748, 0.2194], ["804", 0.8521, 0.4606], ["806", 0.7147, 0.6844]],
  },
  {
    id: "effects",
    fig: "FIG. 8",
    desc: "An AR effect creation tool for TikTok creators.",
    paper: "#EDEDED",
    labels: [["802", 0.5195, 0.2317], ["804", 0.6982, 0.7396], ["806", 0.7024, 0.4831]],
  },
  {
    id: "hostpromo",
    fig: "FIG. 9",
    desc: "Campaign tools to attract and allocate traffic to listings from hosts in China.",
    paper: "#ECECEC",
    labels: [["902", 0.5176, 0.2321], ["904", 0.151, 0.2621], ["906", 0.3446, 0.6135]],
  },
  {
    id: "dls",
    fig: "FIG. 10",
    desc: "A localized component library for the China design team.",
    paper: "#EDEDED",
    labels: [["1002", 0.819, 0.3837], ["1004", 0.559, 0.7307], ["1006", 0.1776, 0.2898]],
  },
  {
    id: "supply",
    fig: "FIG. 11",
    desc: "A workspace for the China supply team to track listings and their performance.",
    paper: "#EDEDED",
    labels: [["1102", 0.8342, 0.4025], ["1104", 0.7041, 0.7164], ["1106", 0.503, 0.1508]],
  },
];
