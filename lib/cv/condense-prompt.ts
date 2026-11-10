/**
 * Pravidla pro zkracování životopisu — protějšek `translate-prompt.ts` pro akci
 * „Stručná verze" v CV Studiu na /jindra/cvapp.
 *
 * Zkracuje se tím, že se totéž řekne méně slovy, a tím, že se nejméně podstatné
 * řádky vypustí. Nikdy sloučením dvou faktů do věty, která tvrdí něco, co neřekl
 * ani jeden z nich.
 */

import { GLOSSARY, PROTECTED_TERMS } from "@/lib/cv/translate-prompt"

const CV_EDITING_RULES = `Upravuješ text životopisu. Smíš měnit pouze formulaci, gramatiku a stručnost.
NIKDY nevymýšlej ani nepřidávej: úspěchy, čísla, procenta, certifikace,
technologie, názvy nástrojů, názvy pozic, jména firem ani odpovědnosti,
které nejsou v původním textu.
Nezesiluj míru odpovědnosti (např. "podílel se" -> "vedl").
Nepiš prodejním tónem. Cíl je kredibilní, seniorní, stručný text.
Zachovej všechny odborné termíny a názvy produktů přesně tak, jak jsou napsané.
Pokud nejde text zlepšit beze změny významu, vrať ho beze změny.`

const LANGUAGE_NAMES = { cs: "česky", en: "anglicky" } as const

export function buildCondenseSystemPrompt(language: "cs" | "en", targetRole: string) {
  const relevant = GLOSSARY.filter((rule) => rule.scope === "both" || rule.scope === language)
  const glossaryBlock =
    relevant.length > 0
      ? `\n\nGlosář — nikdy nepiš vlevo, piš vpravo:\n${relevant
          .map((rule) => `- "${rule.forbidden}" -> "${rule.preferred}"`)
          .join("\n")}`
      : ""

  const roleBlock = targetRole.trim()
    ? `\n\nCílová role životopisu: ${targetRole.trim()}. Podle ní posuzuj, co je relevantní.`
    : ""

  return `${CV_EDITING_RULES}

Tvůj úkol je zkrátit životopis, aby se vešel zhruba na jednu stranu. Píšeš ${LANGUAGE_NAMES[language]}.

Pro každou položku, kterou dostaneš, se rozhodni jedno ze dvou:
- "drop": true — řádek je pro cílovou roli nejméně přínosný a v kratší verzi chybět nebude.
- "drop": false a "text" se zkrácenou formulací téhož řádku.

Pravidla zkracování:
- Zkracuj vypuštěním vaty, ne vypuštěním faktů. Když věta obsahuje konkrétní systém, proces nebo
  odpovědnost, musí ten údaj ve zkrácené verzi zůstat.
- Nikdy neslučuj dvě položky do jedné. Každý řádek zpracuj samostatně.
- Nikdy nezesiluj roli ani nedoplňuj výsledky a čísla.
- Odrážka ať má ideálně jeden řádek, nejvýš dva. Odstavec profilu nejvýš tři věty.
- Když řádek už kratší být nemůže, vrať ho beze změny a "drop": false.
- Zahoď spíš obecné a opakující se řádky než ty s konkrétním obsahem.
- Zahazuj střídmě: cílem je asi třetina řádků pryč, ne polovina životopisu.

Termíny, které se nepřekládají a přepisují se přesně:
${PROTECTED_TERMS.map((t) => `- ${t}`).join("\n")}${glossaryBlock}${roleBlock}`
}
