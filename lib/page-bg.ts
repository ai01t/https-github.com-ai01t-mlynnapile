// Konfigurace pozadí a textu pro jednotlivé stránky (editovatelné v /admin).
// Bez backendu — ukládá se do localStorage prohlížeče.

export type Side = "top" | "right" | "bottom" | "left"
export type SideMap = Record<Side, number>

export type BgConfig = {
  /** obrázek na pozadí (data URL nebo cesta) */
  image: string
  /** volitelné video na pozadí (cesta/URL) — má přednost před obrázkem */
  video: string
  /** barva zatmavení (hex) */
  color: string
  /** celková korekce zatmavení v % (100 = podle presetu) */
  opacity: number
  /** dosah zatmavení z každé strany v % (0 = vypnuto, 100 = přes celou fotku) */
  edges: SideMap
  /** krytí u kraje pro každou stranu zvlášť v % */
  edgeOpacity: SideMap
  /** vinětace (ztmavení rohů) v % */
  vignette: number
  /** rozostření okrajů v px (stejný princip jako zatmavení) */
  blur: number
  /** převod do ČB, 0–100 */
  grayscale: number
  /** jas fotky, 0–200 (100 = beze změny) */
  brightness: number
  /** kontrast fotky, 0–200 (100 = beze změny) */
  contrast: number
  /** volný text (HTML z redakčního editoru) */
  text: string
  /** popis pro vyhledávače (AI popis / .txt) */
  seoText: string
}

export const PAGE_KEYS = [
  { id: "chleba", label: "Chleba", path: "/chleba" },
  { id: "jindra", label: "Jindra", path: "/jindra" },
  { id: "andrea", label: "Andrea", path: "/andrea" },
  { id: "booking", label: "Booking", path: "/booking" },
  { id: "bread_calculator", label: "Bread calculator", path: "/bread_calculator" },
  { id: "slepicky", label: "Slepičky", path: "/slepicky" },
] as const

export type PageId = (typeof PAGE_KEYS)[number]["id"]

/** Přesně odvozeno ze sekce /chleba — ideální tmavé nastavení. */
export const CHLEBA_DARK: Pick<BgConfig, "color" | "opacity" | "edges" | "edgeOpacity" | "vignette"> = {
  color: "#070605",
  opacity: 100,
  edges: { top: 100, right: 100, bottom: 100, left: 100 },
  edgeOpacity: { top: 42, right: 22, bottom: 90, left: 90 },
  vignette: 60,
}

export const defaultBgConfig: BgConfig = {
  image: "",
  video: "",
  ...CHLEBA_DARK,
  blur: 0,
  grayscale: 0,
  brightness: 100,
  contrast: 100,
  text: "",
  seoText: "",
}

export const PRESETS: Array<{ id: string; label: string; patch: Partial<BgConfig> }> = [
  { id: "chleba", label: "Chleba (tmavé)", patch: { ...CHLEBA_DARK } },
  {
    id: "soft",
    label: "Jemné",
    patch: { color: "#07060a", opacity: 100, edges: { top: 60, right: 40, bottom: 80, left: 60 }, edgeOpacity: { top: 25, right: 12, bottom: 55, left: 45 }, vignette: 25 },
  },
  {
    id: "left",
    label: "Text zleva",
    patch: { color: "#07060a", opacity: 100, edges: { top: 40, right: 0, bottom: 60, left: 100 }, edgeOpacity: { top: 20, right: 0, bottom: 60, left: 92 }, vignette: 20 },
  },
  {
    id: "bottom",
    label: "Text zdola",
    patch: { color: "#07060a", opacity: 100, edges: { top: 30, right: 0, bottom: 100, left: 0 }, edgeOpacity: { top: 18, right: 0, bottom: 92, left: 0 }, vignette: 20 },
  },
  {
    id: "none",
    label: "Bez zatmavení",
    patch: { opacity: 100, edges: { top: 0, right: 0, bottom: 0, left: 0 }, edgeOpacity: { top: 0, right: 0, bottom: 0, left: 0 }, vignette: 0 },
  },
]

const STORAGE_PREFIX = "mlyn.pagebg."
const SIDES: Array<[Side, string]> = [
  ["top", "to bottom"],
  ["right", "to left"],
  ["bottom", "to top"],
  ["left", "to right"],
]

function hexToRgb(hex: string) {
  const clean = (hex || "#000000").replace("#", "")
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean
  const num = parseInt(full, 16)
  if (Number.isNaN(num)) return { r: 0, g: 0, b: 0 }
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, Number.isFinite(v) ? v : 0))

/** Vrstvy zatmavení: u okraje plná barva, směrem dovnitř plynule do průhledna. */
export function buildOverlayGradients(cfg: BgConfig): string {
  const { r, g, b } = hexToRgb(cfg.color)
  const master = clamp(cfg.opacity ?? 100, 0, 200) / 100
  const rgba = (alpha: number) => `rgba(${r},${g},${b},${Math.min(1, Math.max(0, alpha)).toFixed(3)})`
  const layers: string[] = []

  if ((cfg.vignette ?? 0) > 0) {
    const v = (clamp(cfg.vignette) / 100) * master
    layers.push(`radial-gradient(circle at 70% 46%, ${rgba(v * 0.05)}, ${rgba(v * 0.49)} 34%, ${rgba(v)} 78%)`)
  }

  SIDES.forEach(([side, dir]) => {
    const reach = clamp(cfg.edges?.[side] ?? 0)
    const strength = clamp(cfg.edgeOpacity?.[side] ?? 0)
    if (reach <= 0 || strength <= 0) return
    const a = (strength / 100) * master
    layers.push(`linear-gradient(${dir}, ${rgba(a)} 0%, ${rgba(a * 0.55)} ${(reach * 0.48).toFixed(1)}%, ${rgba(0)} ${reach}%)`)
  })

  return layers.join(", ")
}

/** CSS filtr pro samotnou fotku. */
export function buildMediaFilter(cfg: BgConfig): string {
  const parts: string[] = []
  if ((cfg.grayscale ?? 0) > 0) parts.push(`grayscale(${cfg.grayscale}%)`)
  if ((cfg.brightness ?? 100) !== 100) parts.push(`brightness(${cfg.brightness}%)`)
  if ((cfg.contrast ?? 100) !== 100) parts.push(`contrast(${cfg.contrast}%)`)
  return parts.length ? parts.join(" ") : "none"
}

/** Maska pro rozostření okrajů — stejný princip jako zatmavení. */
export function buildBlurMask(cfg: BgConfig): string {
  const active = SIDES.filter(([side]) => (cfg.edges?.[side] ?? 0) > 0)
  if (!active.length) return ""
  return active.map(([side, dir]) => `linear-gradient(${dir}, #000 0%, transparent ${clamp(cfg.edges[side])}%)`).join(", ")
}

export function loadBgConfig(pageId: string): BgConfig {
  if (typeof window === "undefined") return { ...defaultBgConfig }
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + pageId)
    if (!raw) return { ...defaultBgConfig }
    const p = JSON.parse(raw)
    return {
      ...defaultBgConfig,
      ...p,
      edges: { ...defaultBgConfig.edges, ...(p.edges || {}) },
      edgeOpacity: { ...defaultBgConfig.edgeOpacity, ...(p.edgeOpacity || {}) },
    }
  } catch {
    return { ...defaultBgConfig }
  }
}

export function saveBgConfig(pageId: string, cfg: BgConfig) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_PREFIX + pageId, JSON.stringify(cfg))
  } catch {
    throw new Error("Úložiště je plné — zkus menší obrázek.")
  }
}

export function clearBgConfig(pageId: string) {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_PREFIX + pageId)
}
