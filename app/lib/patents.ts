// Tony's patents, as the About page shows them (app/components/about/recognition.tsx).
//
// One DESIGN is one patent family: the same registered design, filed first in
// China and then country by country. So the unit a person counts is the
// design (12), and a country is only where it is registered (319
// registrations in 14 jurisdictions). INVENTIONS are the invention patents.
//
// Source: ByteDance's patent register export for Tony (30 Apr 2025) — the rows
// with status "granted"; abandoned and lapsed filings are left out. Numbers
// are the registration numbers as each office prints them. Dates and the
// United States, China, Japan and Canada links were checked against Google
// Patents on 23 Nov 2026. Nothing here is from an internal docket.

export const JURISDICTIONS = [
  { code: "CN", name: "China" },
  { code: "EU", name: "European Union" },
  { code: "GB", name: "United Kingdom" },
  { code: "ZA", name: "South Africa" },
  { code: "SG", name: "Singapore" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "ID", name: "Indonesia" },
  { code: "AU", name: "Australia" },
  { code: "US", name: "United States" },
  { code: "MX", name: "Mexico" },
  { code: "RU", name: "Russia" },
  { code: "CA", name: "Canada" },
  { code: "BR", name: "Brazil" },
] as const;

export type Code = (typeof JURISDICTIONS)[number]["code"];

/** Which drawing a patent's plate shows (app/components/about/patent-plates.tsx). */
export type PlateKind =
  | "feed"
  | "comments"
  | "share"
  | "menu"
  | "following"
  | "fyp"
  | "live"
  | "code"
  | "tv-pin"
  | "tv-profile"
  | "tv-keyboard"
  | "tv-cards"
  | "playback";

export type Design = {
  id: string;
  surface: "tablet" | "web";
  orientation?: "landscape" | "portrait";
  name: string;
  plate: PlateKind;
  /** The first filing, in China: the family's priority date. */
  filed: string;
  related: { title: string; href: string };
  registrations: Partial<Record<Code, string[]>>;
};

export const DESIGNS: Design[] = [
  {
    id: "tablet-landscape-feed",
    surface: "tablet",
    orientation: "landscape",
    name: "Home feed",
    plate: "feed",
    filed: "2021-04-06",
    related: { title: "Multi-Platform", href: "/work/tiktok-multi-platform" },
    registrations: {
      CN: ["306802760S"],
      EU: ["008712533-0005", "008712533-0006", "008712533-0007", "008712533-0008"],
      GB: ["6167506", "6167507", "6167508", "6167509"],
      ZA: ["A2021/01242", "A2021/01243", "A2021/01245", "A2021/01247"],
      SG: ["30202109857U", "30202109858X"],
      KR: ["30-1198439-0001", "30-1198439-0002"],
      ID: ["IDD0000062350", "IDD0000062351"],
      AU: ["202116073", "202116074"],
      MX: ["66894"],
      RU: ["134172"],
      CA: ["206893"],
      BR: ["30 2021 004873-6"],
    },
  },
  {
    id: "tablet-landscape-comments",
    surface: "tablet",
    orientation: "landscape",
    name: "Comment panel",
    plate: "comments",
    filed: "2021-04-06",
    related: { title: "Multi-Platform", href: "/work/tiktok-multi-platform" },
    registrations: {
      CN: ["306802759S"],
      EU: ["008712533-0009", "008712533-0010", "008712533-0011", "008712533-0012", "008712533-0013", "008712533-0014"],
      GB: ["6167510", "6167511", "6167512", "6167513", "6167514", "6167515"],
      ZA: ["A2021/01248", "A2021/01251", "A2021/01253", "A2021/01255", "A2021/01256", "A2021/01257"],
      SG: ["30202109859Q", "30202109860V", "30202109861Q", "30202109862R", "30202109863S", "30202109864P"],
      JP: ["1722125", "1722191", "1722192", "1722193", "1722194", "1722195"],
      KR: ["30-1184058-0001", "30-1184058-0002", "30-1184058-0003", "30-1184058-0004", "30-1184058-0005", "30-1184058-0006"],
      ID: ["IDD0000062120", "IDD0000062121", "IDD0000062353", "IDD0000062355", "IDD0000062599", "IDD0000063347"],
      AU: ["202116075", "202116076"],
      US: ["D986,265"],
      MX: ["67350"],
      RU: ["132736"],
      CA: ["206894"],
      BR: ["30 2021 004877-9"],
    },
  },
  {
    id: "tablet-landscape-share",
    surface: "tablet",
    orientation: "landscape",
    name: "Share sheet",
    plate: "share",
    filed: "2021-04-06",
    related: { title: "Multi-Platform", href: "/work/tiktok-multi-platform" },
    registrations: {
      CN: ["306915495S"],
      EU: ["008712533-0003", "008712533-0004"],
      GB: ["6167504", "6167505"],
      ZA: ["A2021/01233", "A2021/01240"],
      SG: ["30202109847X", "30202109848V"],
      JP: ["1723373", "1723457"],
      KR: ["30-1198438-0001", "30-1198438-0002"],
      ID: ["IDD0000062349", "IDD0000062352"],
      AU: ["202116071", "202116072"],
      US: ["D986,264"],
      MX: ["67354"],
      RU: ["134171"],
      CA: ["206892"],
      BR: ["30 2021 004846-9"],
    },
  },
  {
    id: "tablet-landscape-menu",
    surface: "tablet",
    orientation: "landscape",
    name: "Long-press menu",
    plate: "menu",
    filed: "2021-04-06",
    related: { title: "Multi-Platform", href: "/work/tiktok-multi-platform" },
    registrations: {
      CN: ["306802757S"],
      EU: ["008712533-0015", "008712533-0016"],
      GB: ["6167516", "6167517"],
      ZA: ["A2021/01252", "A2021/01254"],
      SG: ["30202109865T", "30202109866U"],
      JP: ["1723374", "1723458"],
      KR: ["30-1184059-0001", "30-1184059-0002"],
      ID: ["IDD0000062122", "IDD0000062123"],
      AU: ["202116077", "202116078"],
      US: ["D986,266"],
      MX: ["66893"],
      RU: ["134173"],
      CA: ["206895"],
      BR: ["30 2021 004893-0"],
    },
  },
  {
    id: "tablet-landscape-following",
    surface: "tablet",
    orientation: "landscape",
    name: "Following",
    plate: "following",
    filed: "2021-04-06",
    related: { title: "Multi-Platform", href: "/work/tiktok-multi-platform" },
    registrations: {
      CN: ["307048749S"],
      EU: ["008712533-0001", "008712533-0002"],
      GB: ["6167502", "6167503"],
      ZA: ["A2021/01224", "A2021/01229"],
      SG: ["30202109846T"],
      JP: ["1722124"],
      KR: ["30-1184057"],
      ID: ["IDD0000062348"],
      AU: ["202116070"],
      US: ["D983,822"],
      MX: ["66895"],
      RU: ["133188"],
      CA: ["206890"],
      BR: ["30 2021 004839-6"],
    },
  },
  {
    id: "tablet-portrait-feed",
    surface: "tablet",
    orientation: "portrait",
    name: "Home feed",
    plate: "feed",
    filed: "2021-04-06",
    related: { title: "Multi-Platform", href: "/work/tiktok-multi-platform" },
    registrations: {
      CN: ["306915496S"],
      EU: ["008712533-0021", "008712533-0022", "008712533-0023", "008712533-0024"],
      GB: ["6167522", "6167523", "6167524", "6167525"],
      ZA: ["A2021/01226", "A2021/01227", "A2021/01228", "A2021/01230"],
      SG: ["30202109871T", "30202109872S"],
      AU: ["202116080"],
      MX: ["68188"],
      RU: ["134175"],
      CA: ["206898"],
      BR: ["30 2021 004900-7"],
    },
  },
  {
    id: "tablet-portrait-comments",
    surface: "tablet",
    orientation: "portrait",
    name: "Comment panel",
    plate: "comments",
    filed: "2021-04-06",
    related: { title: "Multi-Platform", href: "/work/tiktok-multi-platform" },
    registrations: {
      CN: ["306915493S"],
      EU: ["008712533-0025", "008712533-0026", "008712533-0027", "008712533-0028", "008712533-0029", "008712533-0030"],
      GB: ["6167526", "6167527", "6167528", "6167529", "6167530", "6167531"],
      ZA: ["A2021/01231", "A2021/01232", "A2021/01234", "A2021/01235", "A2021/01236", "A2021/01241"],
      SG: ["30202109873X", "30202109874V", "30202109875Q", "30202109876W", "30202109877R", "30202109878P"],
      AU: ["202116081"],
      MX: ["67348"],
      RU: ["134176"],
      CA: ["206900"],
      BR: ["30 2021 004902-3"],
    },
  },
  {
    id: "tablet-portrait-share",
    surface: "tablet",
    orientation: "portrait",
    name: "Share sheet",
    plate: "share",
    filed: "2021-04-06",
    related: { title: "Multi-Platform", href: "/work/tiktok-multi-platform" },
    registrations: {
      CN: ["306915494S"],
      EU: ["008712533-0019", "008712533-0020"],
      GB: ["6167520", "6167521"],
      ZA: ["A2021/01222", "A2021/01223"],
      SG: ["30202109869X", "30202109870Y"],
      AU: ["202116079"],
      MX: ["66892"],
      RU: ["134174"],
      CA: ["206897"],
      BR: ["30 2021 004892-2"],
    },
  },
  {
    id: "tablet-portrait-menu",
    surface: "tablet",
    orientation: "portrait",
    name: "Long-press menu",
    plate: "menu",
    filed: "2021-04-06",
    related: { title: "Multi-Platform", href: "/work/tiktok-multi-platform" },
    registrations: {
      CN: ["306802758S"],
      EU: ["008712533-0031", "008712533-0032"],
      GB: ["6167532", "6167533"],
      ZA: ["A2021/01244", "A2021/01246"],
      SG: ["30202109849S", "30202109850S"],
      AU: ["202116082"],
      MX: ["65890"],
      RU: ["134177"],
      CA: ["206899"],
      BR: ["30 2021 004903-1"],
    },
  },
  {
    id: "tablet-portrait-following",
    surface: "tablet",
    orientation: "portrait",
    name: "Following",
    plate: "following",
    filed: "2021-04-06",
    related: { title: "Multi-Platform", href: "/work/tiktok-multi-platform" },
    registrations: {
      CN: ["307048747S"],
      EU: ["008712533-0017", "008712533-0018"],
      GB: ["6167518", "6167519"],
      ZA: ["A2021/01219", "A2021/01221"],
      SG: ["30202109867Y"],
      JP: ["1722196"],
      KR: ["30-1184060"],
      ID: ["IDD0000062124"],
      MX: ["67349"],
      RU: ["134566"],
      CA: ["206896"],
      BR: ["30 2021 004888-4"],
    },
  },
  {
    id: "web-fyp",
    surface: "web",
    name: "For You feed",
    plate: "fyp",
    filed: "2021-04-13",
    related: { title: "Web Restructure", href: "/work/tiktok-restructure" },
    registrations: {
      CN: ["306541819S"],
      EU: ["008713341-0007", "008713341-0008", "008713341-0009", "008713341-0010", "008713341-0011"],
      GB: ["6167487", "6167488", "6167489", "6167490", "6167491"],
      ZA: ["A2021/01266", "A2021/01267", "A2021/01269", "A2021/01270", "A2021/01271"],
      SG: ["30202109932W", "30202109933T", "30202109934R", "30202109935P", "30202109936Y"],
      KR: ["30-1184063-0001", "30-1184063-0002", "30-1184063-0003", "30-1184063-0004", "30-1184063-0005"],
      ID: ["IDD0000062043", "IDD0000062045", "IDD0000062046", "IDD0000062235", "IDD0000062236"],
      AU: ["202116089", "202116090", "202116091"],
      US: ["D990,500"],
      MX: ["67351"],
      RU: ["133191"],
      CA: ["207099"],
      BR: ["30 2021 004985-6"],
    },
  },
  {
    id: "web-live",
    surface: "web",
    name: "Live page",
    plate: "live",
    filed: "2021-04-13",
    related: { title: "Web Restructure", href: "/work/tiktok-restructure" },
    registrations: {
      CN: ["306541818S"],
      EU: ["008713341-0012", "008713341-0013", "008713341-0014", "008713341-0015", "008713341-0016", "008713341-0017"],
      GB: ["6167492", "6167493", "6167494", "6167495", "6167496", "6167497"],
      ZA: ["A2021/01280", "A2021/01281", "A2021/01282", "A2021/01283", "A2021/01284", "A2021/01285"],
      SG: ["30202109937U", "30202109938X", "30202109939Q", "30202109940Q", "30202109941W", "30202109942U"],
      JP: ["1719517", "1719576", "1719577", "1719578", "1719579", "1719580"],
      KR: ["30-1184064-0001", "30-1184064-0002", "30-1184064-0003", "30-1184064-0004", "30-1184064-0005", "30-1184064-0006"],
      ID: ["IDD0000062047", "IDD0000062048", "IDD0000062049", "IDD0000062050", "IDD0000062051", "IDD0000062052"],
      AU: ["202116092", "202116093", "202116094"],
      US: ["D990,501"],
      MX: ["65889"],
      RU: ["133192"],
      CA: ["207100"],
      BR: ["30 2021 005016-1"],
    },
  },
];

export type Invention = {
  id: string;
  name: string;
  product: string;
  plate: PlateKind;
  /** People named as inventors beside Tony. */
  coInventors: number;
  related?: { title: string; href: string };
  /** Granted patents, newest first; or where an application is pending. */
  grants: { office: string; number: string; date: string; url: string }[];
  pending?: { office: string; filed: string };
};

export const INVENTIONS: Invention[] = [
  {
    id: "tikcode",
    name: "Two-dimensional code with overlapped positioning points",
    product: "TikCode",
    plate: "code",
    coInventors: 1,
    related: { title: "TikCode", href: "/work/tiktok-tikcode" },
    grants: [
      { office: "US", number: "12,561,541 B2", date: "2026-02-24", url: "https://patents.google.com/patent/US12561541B2/en" },
      { office: "EP", number: "4 258 165 B1", date: "2025-07-09", url: "https://patents.google.com/patent/EP4258165B1/en" },
      { office: "JP", number: "7553211 B2", date: "2024-09-18", url: "https://patents.google.com/patent/JP7553211B2/en" },
      { office: "CN", number: "112651475 B", date: "2022-09-23", url: "https://patents.google.com/patent/CN112651475B/en" },
    ],
  },
  {
    id: "tv-pin",
    name: "Birthday PIN pad for TV",
    product: "TikTok TV",
    plate: "tv-pin",
    coInventors: 0,
    grants: [],
    pending: { office: "PCT", filed: "2024" },
  },
  {
    id: "tv-profile",
    name: "Own and others’ profiles on TV",
    product: "TikTok TV",
    plate: "tv-profile",
    coInventors: 0,
    related: { title: "TV Profile", href: "/work/tiktok-tv-profile" },
    grants: [],
    pending: { office: "PCT", filed: "2024" },
  },
  {
    id: "tv-keyboard",
    name: "Keyboard interactions for TV search",
    product: "TikTok TV",
    plate: "tv-keyboard",
    coInventors: 2,
    related: { title: "TV Search", href: "/work/tiktok-tv-search" },
    grants: [],
    pending: { office: "PCT", filed: "2024" },
  },
  {
    id: "tv-cards",
    name: "Top user cards in TV search results",
    product: "TikTok TV",
    plate: "tv-cards",
    coInventors: 2,
    related: { title: "TV Search", href: "/work/tiktok-tv-search" },
    grants: [],
    pending: { office: "PCT", filed: "2024" },
  },
  {
    id: "playback",
    name: "Playback control",
    product: "TikTok",
    plate: "playback",
    coInventors: 1,
    grants: [],
    pending: { office: "CN", filed: "2025" },
  },
];

export const OFFICES: Record<string, string> = {
  US: "United States",
  EP: "Europe (EPO)",
  JP: "Japan",
  CN: "China",
  PCT: "International (PCT)",
};

export const count = (d: Design, code: Code) => d.registrations[code]?.length ?? 0;
export const total = (d: Design) => JURISDICTIONS.reduce((sum, j) => sum + count(d, j.code), 0);
export const countries = (d: Design) => JURISDICTIONS.filter((j) => count(d, j.code) > 0);

export const REGISTRATION_TOTAL = DESIGNS.reduce((sum, d) => sum + total(d), 0);

/** Indonesia's public record is filed under the application number, not the registration's. */
const ID_APPLICATION: Record<string, string> = {
  IDD0000062043: "A002021003141",
  IDD0000062045: "A002021003142",
  IDD0000062046: "A002021003143",
  IDD0000062047: "A002021003144",
  IDD0000062048: "A002021003146",
  IDD0000062049: "A002021003147",
  IDD0000062050: "A002021003148",
  IDD0000062051: "A002021003149",
  IDD0000062052: "A002021003150",
  IDD0000062120: "A002021003105",
  IDD0000062121: "A002021003106",
  IDD0000062122: "A002021003108",
  IDD0000062123: "A002021003113",
  IDD0000062124: "A002021003114",
  IDD0000062235: "A002021003139",
  IDD0000062236: "A002021003140",
  IDD0000062348: "A002021003096",
  IDD0000062349: "A002021003098",
  IDD0000062350: "A002021003099",
  IDD0000062351: "A002021003100",
  IDD0000062352: "A002021003097",
  IDD0000062353: "A002021003104",
  IDD0000062355: "A002021003101",
  IDD0000062599: "A002021003102",
  IDD0000063347: "A002021003103",
};

const GOOGLE = "https://patents.google.com/patent";
const WIPO = "https://designdb.wipo.int/designdb/en/showData.jsp?ID=";

/**
 * The public record of a registration, where one can be linked by its number
 * alone. Only patterns that were opened and checked (23 Nov 2026) are here —
 * the office's own register where it has a stable address, else Google
 * Patents or WIPO's Global Design Database. A number with no pattern is shown
 * without a link: the United Kingdom's register answers a direct link with a
 * security check, South Africa's and Brazil's need an account, and Mexico's is
 * not addressed by registration number.
 */
export function recordUrl(code: Code, number: string): string | null {
  switch (code) {
    case "US":
      return `${GOOGLE}/US${number.replace(",", "")}S1/en`;
    case "CN":
      return `${GOOGLE}/CN${number}/en`;
    case "JP":
      return `${GOOGLE}/JP${number}S/en`;
    case "CA":
      return `${GOOGLE}/CA${number}S/en`;
    case "EU":
      return `https://euipo.europa.eu/eSearch/#details/designs/${number}`;
    case "AU":
      return `https://search.ipaustralia.gov.au/designs/search/details/${number}`;
    case "RU":
      return `https://fips.ru/registers-doc-view/fips_servlet?DB=RUDE&DocNumber=${number}`;
    case "SG":
      return `${WIPO}SGID.${number}`;
    case "ID":
      return ID_APPLICATION[number] ? `${WIPO}IDID.${ID_APPLICATION[number]}` : null;
    case "KR": {
      // KIPRIS finds a design by 30 + its seven digits + the design's place in a multiple registration.
      const [, serial, part = "0000"] = number.split("-");
      const query = encodeURIComponent(`RN=[30${serial}${part}]`);
      return `https://www.kipris.or.kr/khome/search/searchResult.do?searchKind=keywordSearch&searchRight=kdg&queryText=${query}`;
    }
    default:
      return null;
  }
}
