/* ---------------------------------------------------------------
   Styly webu — každý mění nejen barvy, ale i rozvržení,
   typografii, menu, poměry fotek a mřížky.
   Přepínají se v editoru (Vzhled → Styl webu).
----------------------------------------------------------------*/

const STYLE_PRESETS = {

  klasik: {
    label: "Klasik",
    note: "Text vedle fotky, teplá paleta, klidná serifová typografie.",
    theme: {
      fontDisplay: "Cormorant Garamond", fontBody: "Inter",
      baseSize: 17, scale: 1.24, letterDisplay: 0, letterNav: 0.14,
      colorBg: "#faf8f5", colorSurface: "#f2ede6", colorInk: "#221f1c",
      colorMuted: "#7a736b", colorAccent: "#8a6f4e", colorLine: "#e0d8cd",
      radius: 2, imgRadius: 2, maxWidth: 1240, sectionSpace: 128
    },
    palettes: {
      light: { bg: "#faf8f5", surface: "#f2ede6", ink: "#221f1c", muted: "#7a736b", accent: "#8a6f4e", line: "#e0d8cd" },
      dark:  { bg: "#17150f", surface: "#211d16", ink: "#f2ece1", muted: "#a89d8d", accent: "#c39a68", line: "#2f2a21" }
    },
    nav: { style: "underline", align: "center", size: 12.5, sticky: true },
    hero: { layout: "split", align: "left", height: 88, overlay: 0.34 },
    heroImage: { ratio: "4 / 5" },
    categories: { columns: 3, ratio: "4 / 5", captionPos: "below" },
    gallery: { layout: "mosaic", columns: 3, gap: 14 },
    social: { glyph: "line", shape: "none", size: 20 }
  },

  galerie: {
    label: "Galerie",
    note: "Fotka přes celou obrazovku, průhledné menu nad ní, čtvercová mřížka na sraz.",
    header: "over",
    theme: {
      fontDisplay: "Cormorant Garamond", fontBody: "Inter",
      baseSize: 17, scale: 1.3, letterDisplay: 0.01, letterNav: 0.2,
      colorBg: "#fbfaf8", colorSurface: "#f1efeb", colorInk: "#1b1a18",
      colorMuted: "#7c766f", colorAccent: "#458AC1", colorLine: "#e6e2dc",
      radius: 0, imgRadius: 0, maxWidth: 1520, sectionSpace: 112
    },
    palettes: {
      light: { bg: "#fbfaf8", surface: "#f1efeb", ink: "#1b1a18", muted: "#7c766f", accent: "#458AC1", line: "#e6e2dc" },
      dark:  { bg: "#111112", surface: "#1a1a1c", ink: "#f4f2ee", muted: "#a09c96", accent: "#6aa9d8", line: "#27272a" }
    },
    nav: { style: "plain", align: "center", size: 11.5, sticky: true },
    hero: { layout: "overlay", align: "center", height: 100, overlay: 0.42 },
    categories: { columns: 3, ratio: "1 / 1", captionPos: "over" },
    gallery: { layout: "grid", columns: 4, gap: 4 },
    social: { glyph: "line", shape: "none", size: 19 }
  },

  editorial: {
    label: "Editorial",
    note: "Velká typografie, menu vlevo, široké fotky na šířku — jako v časopise.",
    theme: {
      fontDisplay: "Playfair Display", fontBody: "Karla",
      baseSize: 18, scale: 1.34, letterDisplay: -0.015, letterNav: 0.1,
      colorBg: "#f7f5f1", colorSurface: "#ecE7df", colorInk: "#14130f",
      colorMuted: "#6f6960", colorAccent: "#458AC1", colorLine: "#ddd6ca",
      radius: 0, imgRadius: 0, maxWidth: 1180, sectionSpace: 150
    },
    palettes: {
      light: { bg: "#f7f5f1", surface: "#ecE7df", ink: "#14130f", muted: "#6f6960", accent: "#458AC1", line: "#ddd6ca" },
      dark:  { bg: "#141311", surface: "#1d1c19", ink: "#f6f2ea", muted: "#a29a8d", accent: "#7ab3de", line: "#2b2924" }
    },
    nav: { style: "plain", align: "left", size: 12, sticky: true },
    hero: { layout: "split", align: "left", height: 88, overlay: 0.3 },
    heroImage: { ratio: "3 / 2" },
    categories: { columns: 2, ratio: "3 / 2", captionPos: "below" },
    gallery: { layout: "mosaic", columns: 3, gap: 26 },
    social: { glyph: "line", shape: "none", size: 20 }
  },

  studio: {
    label: "Studio (video)",
    note: "Tmavá scéna s videem přes celou obrazovku. Video se přidává v editoru.",
    header: "over",
    dark: true,
    theme: {
      fontDisplay: "Marcellus", fontBody: "Jost",
      baseSize: 16.5, scale: 1.28, letterDisplay: 0.02, letterNav: 0.24,
      colorBg: "#100f0e", colorSurface: "#1a1917", colorInk: "#f4f1ec",
      colorMuted: "#a29a90", colorAccent: "#6aa9d8", colorLine: "#2b2724",
      radius: 0, imgRadius: 0, maxWidth: 1400, sectionSpace: 132
    },
    palettes: {
      light: { bg: "#f7f6f4", surface: "#edebe7", ink: "#171614", muted: "#736d66", accent: "#3f7fae", line: "#e2dfd9" },
      dark:  { bg: "#100f0e", surface: "#1a1917", ink: "#f4f1ec", muted: "#a29a90", accent: "#6aa9d8", line: "#2b2724" }
    },
    nav: { style: "plain", align: "center", size: 11, sticky: true },
    hero: { layout: "overlay", align: "left", height: 100, overlay: 0.5 },
    heroMedia: "video",
    categories: { columns: 3, ratio: "4 / 5", captionPos: "over" },
    gallery: { layout: "grid", columns: 3, gap: 10 },
    social: { glyph: "solid", shape: "circle", size: 18 }
  },

  minimal: {
    label: "Minimal",
    note: "Hodně bílého prostoru, drobné bezpatkové písmo, přísná mřížka.",
    theme: {
      fontDisplay: "Jost", fontBody: "Jost",
      baseSize: 15.5, scale: 1.22, letterDisplay: 0.04, letterNav: 0.26,
      colorBg: "#ffffff", colorSurface: "#f6f6f4", colorInk: "#131313",
      colorMuted: "#8b8b87", colorAccent: "#458AC1", colorLine: "#ececea",
      radius: 0, imgRadius: 0, maxWidth: 1080, sectionSpace: 165
    },
    palettes: {
      light: { bg: "#ffffff", surface: "#f6f6f4", ink: "#131313", muted: "#8b8b87", accent: "#458AC1", line: "#ececea" },
      dark:  { bg: "#0e0e0e", surface: "#171717", ink: "#f4f4f4", muted: "#9a9a98", accent: "#6aa9d8", line: "#242424" }
    },
    nav: { style: "plain", align: "center", size: 10.5, sticky: true },
    hero: { layout: "split", align: "center", height: 82, overlay: 0.3 },
    heroImage: { ratio: "1 / 1" },
    categories: { columns: 4, ratio: "1 / 1", captionPos: "below" },
    gallery: { layout: "grid", columns: 4, gap: 8 },
    social: { glyph: "line", shape: "none", size: 17 }
  },

  keramika: {
    label: "Hlína",
    note: "Zemitá paleta, oblé tvary, měkké stíny — nejblíž materiálu.",
    theme: {
      fontDisplay: "Lora", fontBody: "DM Sans",
      baseSize: 17, scale: 1.22, letterDisplay: 0, letterNav: 0.12,
      colorBg: "#f6f1ea", colorSurface: "#eee5d9", colorInk: "#2b2119",
      colorMuted: "#877565", colorAccent: "#a2694a", colorLine: "#e2d5c4",
      radius: 18, imgRadius: 20, maxWidth: 1200, sectionSpace: 120
    },
    palettes: {
      light: { bg: "#f6f1ea", surface: "#eee5d9", ink: "#2b2119", muted: "#877565", accent: "#a2694a", line: "#e2d5c4" },
      dark:  { bg: "#1b140f", surface: "#251c15", ink: "#f5ece1", muted: "#b09a86", accent: "#d08b62", line: "#33271e" }
    },
    nav: { style: "pill", align: "center", size: 12.5, sticky: true },
    hero: { layout: "split", align: "left", height: 86, overlay: 0.32 },
    heroImage: { ratio: "4 / 5" },
    categories: { columns: 3, ratio: "4 / 5", captionPos: "below" },
    gallery: { layout: "mosaic", columns: 3, gap: 18 },
    social: { glyph: "solid", shape: "soft", size: 19 }
  }
};

/** Aplikuje styl na data. Texty, fotky a odkazy zůstávají beze změny. */
function applyPreset(id, data) {
  const p = STYLE_PRESETS[id];
  if (!p) return;
  Object.assign(data.theme, p.theme);
  Object.assign(data.nav, p.nav);
  Object.assign(data.hero, p.hero);
  if (p.heroImage) Object.assign(data.hero.image, p.heroImage);
  data.hero.media = p.heroMedia || "image";   // video jen tam, kde ho styl chce
  Object.assign(data.categories, p.categories);
  Object.assign(data.gallery, p.gallery);
  Object.assign(data.social, p.social);
  data.theme.preset = id;
  if (p.palettes) data.theme.palettes = JSON.parse(JSON.stringify(p.palettes));
  data.theme.defaultMode = p.dark ? "dark" : "light";
  data.theme.headerMode = p.header || "normal";
  data.theme.mode = p.dark ? "dark" : "light";
  // zaoblení fotek podle stylu (u všech obrázků na webu)
  const r = data.theme.imgRadius;
  const imgs = [data.hero.image, data.feature.image, data.about.image, data.footer.bg.image]
    .concat(data.categories.items.map((i) => i.image))
    .concat(data.gallery.items.map((i) => i.image));
  imgs.forEach((im) => { if (im) im.radius = r; });

  // modrá z loga jako sekundární barva textu zůstává napříč styly
  data.theme.colorBrand = data.theme.colorBrand || "#458AC1";
}
