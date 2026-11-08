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
    phone: "+420 775 237 325",
    email: "fenchak1903@gmail.com",
    // bankovní spojení na faktury (kód 0300 = ČSOB)
    account: "311898284/0300",
    bank: "ČSOB",
    logo: FENCHAK_LOGO_URL,
  },
}

// Jménem se dá na instanci dostat i bez pamatování IČO: /jindra/bac/fenchak.
// Alias míří na stejný profil i stejné úložiště jako číselná adresa.
export const COMPANY_ALIASES: Record<string, string> = {
  fenchak: "21693021",
}

export const resolveCompanyKey = (slug: string) => COMPANY_ALIASES[slug.toLowerCase()] ?? slug
