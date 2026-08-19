/**
 * Omezení překladové routy.
 *
 * Klíč k Anthropic API platí majitel webu, ale editor životopisů je veřejný.
 * Cílem není nikoho odříznout, jen zajistit, že se účet nedá vyčerpat
 * opakovaným voláním zvenčí.
 */

/** Kolik polí smí jeden požadavek obsahovat. */
export const MAX_ITEMS = 40
/** Kolik znaků dohromady smí jeden požadavek obsahovat. */
export const MAX_CHARS = 12_000
/** Kolik požadavků zvládne jedna IP adresa za hodinu. */
export const PER_IP_HOURLY = 6
/** Kolik požadavků zvládne jedna IP adresa za den. */
export const PER_IP_DAILY = 20
/** Strop pro všechny dohromady za den — poslední pojistka proti vyčerpání kreditu. */
export const GLOBAL_DAILY = 200

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

type Hits = { hourly: number[]; daily: number[] }

// Počítadlo žije v paměti běžící instance. Na Vercelu instancí může být víc
// a po uspání se vynulují, takže je to zpomalovač, ne trezor — tvrdý strop
// je měsíční limit útraty nastavený v Anthropic Console.
const byIp = new Map<string, Hits>()
const globalHits: number[] = []

function prune(list: number[], window: number, now: number) {
  while (list.length > 0 && now - list[0] > window) list.shift()
}

export type LimitVerdict = { ok: true } | { ok: false; reason: string; retryAfter: number }

export function checkRateLimit(ip: string, now = Date.now()): LimitVerdict {
  prune(globalHits, DAY, now)
  if (globalHits.length >= GLOBAL_DAILY) {
    return { ok: false, reason: "Denní limit překladů pro celý web je vyčerpaný. Zkus to zítra.", retryAfter: 3600 }
  }

  const hits = byIp.get(ip) ?? { hourly: [], daily: [] }
  prune(hits.hourly, HOUR, now)
  prune(hits.daily, DAY, now)

  if (hits.hourly.length >= PER_IP_HOURLY) {
    return { ok: false, reason: "Příliš mnoho překladů za hodinu. Zkus to prosím později.", retryAfter: 900 }
  }
  if (hits.daily.length >= PER_IP_DAILY) {
    return { ok: false, reason: "Denní limit překladů je vyčerpaný. Zkus to prosím zítra.", retryAfter: 3600 }
  }

  hits.hourly.push(now)
  hits.daily.push(now)
  byIp.set(ip, hits)
  globalHits.push(now)

  // ať mapa neroste donekonečna
  if (byIp.size > 5000) {
    for (const [key, value] of byIp) {
      if (value.daily.length === 0) byIp.delete(key)
    }
  }

  return { ok: true }
}

/** Požadavek musí přijít ze stránky na našem webu, ne z cizího skriptu. */
export function isAllowedOrigin(origin: string | null, host: string | null) {
  if (!origin) return true // přímé volání bez Originu (např. curl při ladění) řeší limity výše
  try {
    const url = new URL(origin)
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return true
    if (url.hostname.endsWith("mlynnapile.cz")) return true
    return host !== null && url.host === host
  } catch {
    return false
  }
}
