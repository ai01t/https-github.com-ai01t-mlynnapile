// Přednastavené profily podnikatele podle IČO (varianta 3 — bez backendu).
// Použité na /jindra/bac/{ico} pro nabrandování kalkulačky.

// Originální logo Fenchak (public/fenchak-logo.png) — reálný soubor, ostrý všude.
export const FENCHAK_LOGO_URL = "/fenchak-logo.png"

export const COMPANY_PRESETS: Record<string, Record<string, any>> = {
  "21693021": {
    name: "Yurii Fenchak",
    subtitle: "ZEDNICKÉ PRÁCE",
    ico: "21693021",
    address: "č.p. 6, 345 32 Česká Kubice",
    register: "Fyzická osoba zapsaná v živnostenském rejstříku.",
    vatNote: "Nejsem plátce DPH.",
    web: "fenchak.cz",
    logo: FENCHAK_LOGO_URL,
  },
}
