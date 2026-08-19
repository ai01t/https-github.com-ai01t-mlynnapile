/**
 * Pravidla a glosář pro překlad životopisu — převzato z projektu CV Studio,
 * aby překlad na webu držel stejnou terminologii jako v aplikaci samotné.
 */

export type GlossaryRule = { forbidden: string; preferred: string; scope: "cs" | "en" | "both" }

export const GLOSSARY: GlossaryRule[] = [
  { forbidden: "SAP/S/4HANA", preferred: "SAP S/4HANA", scope: "both" },
  { forbidden: "SAP S/4HANA environment", preferred: "Škoda Auto – SAP S/4HANA – ONE Log Project", scope: "en" },
  { forbidden: "automotive SAP/S/4HANA prostředí", preferred: "Škoda Auto – SAP S/4HANA – Projekt ONE Log", scope: "cs" },
  { forbidden: "kapelní organizace", preferred: "management kapely", scope: "cs" },
  { forbidden: "prakticky využívám AI", preferred: "využívám AI", scope: "cs" },
  { forbidden: "higher levels of project management", preferred: "senior project management", scope: "en" },
  { forbidden: "vyšší úrovně projektového řízení", preferred: "seniorní projektové řízení", scope: "cs" },
  { forbidden: "suppliers of connected/existing systems", preferred: "suppliers of connected and legacy systems", scope: "en" },
  { forbidden: "small hydro power plant", preferred: "small hydropower plant", scope: "en" },
  { forbidden: "Created already in 2010", preferred: "Created as early as 2010", scope: "en" },
  { forbidden: "the concept came before later trends", preferred: "the concept preceded later trends", scope: "en" },
  { forbidden: "open to new cooperation", preferred: "open to new professional opportunities", scope: "en" },
]

export const PROTECTED_TERMS = [
  "SAP S/4HANA", "SAP R/3", "PP", "MM", "SD", "WM", "JIRA", "LeanIX", "SharePoint",
  "Confluence", "Visio", "MES IMIS", "MES Hydra", "MPL", "CAQ", "BPCS", "Gebhardt", "ONE Log",
]

const CV_EDITING_RULES = `Upravuješ text životopisu. Smíš měnit pouze formulaci, gramatiku a stručnost.
NIKDY nevymýšlej ani nepřidávej: úspěchy, čísla, procenta, certifikace,
technologie, názvy nástrojů, názvy pozic, jména firem ani odpovědnosti,
které nejsou v původním textu.
Nezesiluj míru odpovědnosti (např. "podílel se" -> "vedl").
Nepiš prodejním tónem. Cíl je kredibilní, seniorní, stručný text.
Zachovej všechny odborné termíny a názvy produktů přesně tak, jak jsou napsané.
Pokud nejde text zlepšit beze změny významu, vrať ho beze změny.`

const LANGUAGE_NAMES = { cs: "češtiny", en: "angličtiny" } as const

export function buildTranslateSystemPrompt(targetLanguage: "cs" | "en") {
  const relevant = GLOSSARY.filter((rule) => rule.scope === "both" || rule.scope === targetLanguage)
  const glossaryBlock =
    relevant.length > 0
      ? `\n\nGlosář — nikdy nepiš vlevo, piš vpravo:\n${relevant
          .map((rule) => `- "${rule.forbidden}" -> "${rule.preferred}"`)
          .join("\n")}`
      : ""

  return `${CV_EDITING_RULES}

Tvůj úkol je překlad do ${LANGUAGE_NAMES[targetLanguage]}. Platí navíc:
- Překládej pouze to, co dostaneš. Nepřidávej žádnou informaci, která ve zdroji není.
- Nepřidávej ani neubírej odrážky, věty ani údaje.
- Překlad nemusí být doslovný, musí znít přirozeně a být obsahově ekvivalentní.
- Zachovej interpunkci, zkratky a formátování (pomlčky, lomítka, závorky).
- Pokud je zdrojový text prázdný, vrať prázdný řetězec.

Termíny, které se nepřekládají a přepisují se přesně:\n${PROTECTED_TERMS.map((t) => `- ${t}`).join("\n")}${glossaryBlock}`
}
