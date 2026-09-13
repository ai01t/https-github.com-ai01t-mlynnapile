// Obsah stránky /chleba, který jde měnit v /chleba/admin.
// Výchozí texty žijí dál v komponentě; tady se drží jen to, co správce přepsal,
// takže úprava textu v kódu se projeví všude, kde ho nikdo ručně nepřebil.

export type Locale = "cs" | "en" | "de"
export const LOCALES: Locale[] = ["cs", "en", "de"]

/** Textová pole, která jde v administraci přepsat. */
export const TEXT_FIELDS = [
  { id: "eyebrow", label: "Nadtitulek", rows: 1 },
  { id: "titleTop", label: "Titulek — první řádek", rows: 1 },
  { id: "titleAccent", label: "Titulek — kurzíva", rows: 1 },
  { id: "lead", label: "Perex", rows: 3 },
  { id: "purityTitle", label: "Bez zkratek — nadpis", rows: 1 },
  { id: "purityText", label: "Bez zkratek — text", rows: 3 },
  { id: "craftTitle", label: "Řemeslo — nadtitulek", rows: 1 },
  { id: "benefitsTitle", label: "Co dává kvásek — nadpis", rows: 1 },
  { id: "benefitsText", label: "Co dává kvásek — text", rows: 4 },
  { id: "ingredientsTitle", label: "Čisté složení — nadpis", rows: 1 },
  { id: "ingredientsText", label: "Čisté složení — text", rows: 4 },
  { id: "processEyebrow", label: "Postup — nadtitulek", rows: 1 },
  { id: "processTitle", label: "Postup — nadpis", rows: 1 },
  { id: "processLead", label: "Postup — text nad osou", rows: 3 },
  { id: "detailsTitle", label: "Detaily — nadpis", rows: 1 },
] as const

export type TextFieldId = (typeof TEXT_FIELDS)[number]["id"]

/** Odstavce v levém sloupci — jeden na řádek. */
export type LocaleContent = Partial<Record<TextFieldId, string>> & {
  paragraphs?: string[]
}

/** Úprava fotky na pozadí — řeší mimo jiné to, že je moc tmavá. */
export type MediaConfig = {
  /** jas fotky v %, 100 = beze změny */
  brightness: number
  /** kontrast v %, 100 = beze změny */
  contrast: number
  /** sytost barev v %, 100 = beze změny */
  saturate: number
  /** síla ztmavení přes fotku v %, 100 = původní, 0 = žádné */
  shade: number
  /** vlastní fotka (cesta v /public nebo URL); prázdné = výchozí */
  image: string
}

export type ChlebaContent = {
  media: MediaConfig
  locales: Partial<Record<Locale, LocaleContent>>
  updatedAt?: string
  updatedBy?: string
}

export const defaultMedia: MediaConfig = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  shade: 100,
  image: "",
}

export const emptyContent: ChlebaContent = { media: { ...defaultMedia }, locales: {} }

const num = (value: unknown, fallback: number, min: number, max: number) => {
  const n = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, Math.round(n)))
}

const str = (value: unknown, max = 4000) =>
  typeof value === "string" ? value.slice(0, max) : undefined

/** Očistí cokoli, co přijde z API nebo z úložiště, na známý tvar. */
export function normalizeContent(raw: unknown): ChlebaContent {
  const input = (raw ?? {}) as Partial<ChlebaContent>
  const media = (input.media ?? {}) as Partial<MediaConfig>
  const locales: ChlebaContent["locales"] = {}

  LOCALES.forEach((locale) => {
    const entry = (input.locales ?? {})[locale]
    if (!entry || typeof entry !== "object") return
    const out: LocaleContent = {}
    TEXT_FIELDS.forEach(({ id }) => {
      const value = str((entry as Record<string, unknown>)[id])
      if (value !== undefined) out[id] = value
    })
    const paragraphs = (entry as LocaleContent).paragraphs
    if (Array.isArray(paragraphs)) {
      const cleaned = paragraphs.map((p) => str(p) ?? "").filter((p) => p.trim())
      if (cleaned.length) out.paragraphs = cleaned
    }
    if (Object.keys(out).length) locales[locale] = out
  })

  return {
    media: {
      brightness: num(media.brightness, 100, 20, 200),
      contrast: num(media.contrast, 100, 20, 200),
      saturate: num(media.saturate, 100, 0, 200),
      shade: num(media.shade, 100, 0, 150),
      image: str(media.image, 500) ?? "",
    },
    locales,
    updatedAt: str(input.updatedAt, 40),
    updatedBy: str(input.updatedBy, 200),
  }
}

/** CSS filtr pro fotku na pozadí. */
export function mediaFilter(media: MediaConfig): string | undefined {
  const parts: string[] = []
  if (media.brightness !== 100) parts.push(`brightness(${media.brightness}%)`)
  if (media.contrast !== 100) parts.push(`contrast(${media.contrast}%)`)
  if (media.saturate !== 100) parts.push(`saturate(${media.saturate}%)`)
  return parts.length ? parts.join(" ") : undefined
}

export const CONTENT_KEY = "content:chleba"

/** Živý náhled: administrace posílá rozpracovaný obsah do rámečku se stránkou. */
export const PREVIEW_EVENT = "mlyn.chleba.preview"
