(() => {
const BG_ROOT = "/videos/bg";

const BACKGROUNDS = {
  hero: {
    day: { landscape: "VDj9aKHnpcw_hq", portrait: "yYFR6g6jlaA" },
    night: { landscape: "bPBM5J8v_aQ", portrait: "M4QkWhz7CDo" },
  },
  place: {
    day: { landscape: "b4tTKrUevzM", portrait: "b4tTKrUevzM" },
    night: { landscape: "b4tTKrUevzM", portrait: "b4tTKrUevzM" },
    overlay: "M4QapdIvjkM",
  },
  studio: {
    day: { landscape: "O431B93W9UY", portrait: "PNnMOPbABZo" },
    night: { landscape: "b4tTKrUevzM", portrait: "PNnMOPbABZo" },
  },
  equipment: {
    day: { landscape: "MczOR3DstPg", portrait: "PNnMOPbABZo" },
    night: { landscape: "h4IbWPSWMJE", portrait: "DY09nnytbjc" },
  },
  location: {
    day: { landscape: "tWtT7cB1Tus", portrait: "yYFR6g6jlaA" },
    night: { landscape: "bPBM5J8v_aQ", portrait: "DY09nnytbjc" },
  },
  residency: {
    day: { landscape: "gTqXu9xU_7k", portrait: "gTqXu9xU_7k" },
    night: { landscape: "gTqXu9xU_7k", portrait: "gTqXu9xU_7k" },
    bread: "NYqybmh85G4",
  },
  contact: {
    day: { landscape: "7UU7KmxEE6s", portrait: "t7PjeLMeBKc" },
    night: { landscape: "CJzYKr3JWC8", portrait: "QsHqEEj4-60" },
  },
};

const PACKAGE_OVERLAYS = {
  into: "7RVXPBnHb-c",
  underwater: "uQiXLcspREY",
  otherside: "X7lvikbWnMQ",
  fuel: "5INpfHr0lu4",
};

const IMAGES = {
  founders: "/images/founders-jindrich-andrea.jpg",
  foundersFixed: "/images/founders-jindrich-andrea-fixed.jpg",
  foundersPortrait: "/images/founders-jindrich-andrea-portrait.jpg",
  hydroCurves: "/images/hydro-curves-white.png",
  businessCard: "/images/business-card.png",
};

function assetUrl(path, depth = 0) {
  if (!path) return "";
  if (/^(https?:|mailto:|tel:|#)/i.test(path)) return path;
  if (window.location.protocol !== "file:") return path;
  const prefix = depth > 0 ? "../".repeat(depth) : "./";
  return `${prefix}${path.replace(/^\/+/, "")}`;
}

function routeUrl(path, depth = 0) {
  if (!path) return "";
  if (/^(https?:|mailto:|tel:|#)/i.test(path)) return path;
  if (window.location.protocol !== "file:") return path;

  const [baseAndQuery, hash = ""] = path.split("#");
  const [base, query = ""] = baseAndQuery.split("?");
  const clean = base.replace(/^\/+/, "").replace(/\/+$/, "");
  const prefix = depth > 0 ? "../".repeat(depth) : "./";
  const suffix = `${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;

  if (clean === "" || clean === "index.html") return `${prefix}index.html${suffix}`;
  if (clean === "en") return `${prefix}en/index.html${suffix}`;
  if (clean === "de") return `${prefix}de/index.html${suffix}`;
  if (clean === "historie") return `${prefix}historie/index.html${suffix}`;
  if (clean === "booking") return `${prefix}booking/index.html${suffix}`;
  if (clean === "en/booking") return `${prefix}en/booking/index.html${suffix}`;
  if (clean === "de/buchung") return `${prefix}de/buchung/index.html${suffix}`;
  if (clean === "chleba") return `${prefix}chleba-kalkulace.html${suffix}`;
  return `${prefix}${clean}${suffix}`;
}

function mediaPaths(id, depth = 0) {
  return {
    video: assetUrl(`${BG_ROOT}/${id}.mp4`, depth),
    poster: assetUrl(`${BG_ROOT}/${id}.jpg`, depth),
    gif: assetUrl(`${BG_ROOT}/${id}.gif`, depth),
  };
}

function chooseBackground(key, theme = "day") {
  const media = BACKGROUNDS[key];
  if (!media) return null;
  const mode = media[theme] || media.day;
  const portrait = window.matchMedia("(orientation: portrait)").matches;
  return portrait ? mode.portrait : mode.landscape;
}

window.MlynMedia = {
  BACKGROUNDS,
  IMAGES,
  PACKAGE_OVERLAYS,
  assetUrl,
  chooseBackground,
  mediaPaths,
  routeUrl,
};
})();
