// Výchozí texty stránky /chleba. Sdílí je stránka i editor v /chleba/admin,
// aby bylo v administraci vidět, co se zobrazí, když pole zůstane prázdné.

export type Locale = "cs" | "en" | "de"

export const CHLEBA_DEFAULT_COPY = {
  cs: {
    homePath: "/",
    contactPath: "/kontakt",
    eyebrow: "Domácí chléb",
    title: "Chleba ze mlýna",
    titleTop: "Chleba ze",
    titleAccent: "mlýna",
    lead:
      "Součástí každého pobytu i nahrávání je snídaně nebo brunch. Všechno kolem chleba bereme stejně poctivě jako samotné studio: pomalu, řemeslně a z dobrých surovin.",
    paragraphs: [],
    craftTitle: "Řemeslný kváskový chleba z naší pece",
    processEyebrow: "Postup",
    processTitle: "Jak pečeme chleba",
    processLead: "",
    benefitsTitle: "Co dává kvásek chlebu",
    ingredientsTitle: "Čisté složení",
    purityTitle: "",
    purityText: "",
    benefitsText:
      "Kvásek pracuje pomalu a chlebu dává chuť, strukturu i lepší stravitelnost. Díky fermentaci se sacharidy uvolňují pozvolněji, chleba déle zasytí a tělo z něj umí lépe využít minerály. Přirozeně kyselé prostředí navíc pomáhá, aby vydržel déle čerstvý i bez konzervantů.",
    ingredientsText:
      "Mouku bereme od českých mlýnů a pracujeme s vlastním poměrem různých typů. Přidáváme vodu z místa, živý kvásek, himalájskou sůl a bio kmín. Bez dochucovadel a bez přísad, které v chlebu nemají co dělat.",
    benefits: [
      "přirozené kvašení z živého kvásku",
      "lepší stravitelnost díky fermentaci",
      "lepší využitelnost minerálů",
      "zasytí na delší dobu a má nižší glykemickou odezvu",
      "delší čerstvost bez konzervantů",
    ],
    ingredients: [
      { text: "kvalitní mouka od českých mlýnů", kind: "ok" },
      { text: "voda, kvásek, himalájská sůl a bio kmín z farmy", kind: "ok" },
      { text: "bez éček, zlepšovadel a zbytečných přísad", kind: "no" },
    ],
    detailsTitle: "Proč právě kváskový chleba",
    details: [
      {
        title: "Proč kvásek",
        body:
          "Kvásek dává chlebu čas. Dlouhá fermentace umožňuje částečný rozklad některých složek obilí, například složitějších sacharidů a bílkovin, takže bývá pro trávení šetrnější než běžné pečivo z droždí.",
      },
      {
        title: "Přispívá kváskový chleba k hubnutí?",
        body:
          "Ano i ne. :-) Kváskový chléb sám o sobě hubnutí nezpůsobuje, ale díky tomu, že ho stačí sníst méně a zasytí vás na delší dobu, k lepší postavě i trávení nepřímo skutečně pomáhá.\n\nJak je to možné? Klíčem je zasycení a pozvolná glykemická odezva. Oproti běžnému bílému pečivu se sacharidy z kváskového chleba uvolňují do těla mnohem pomaleji. V praxi to znamená, že vám hladina cukru v krvi nevyskočí prudce nahoru a vy tak máte delší pocit sytosti, sníte menší množství a nedostanete tak rychlý hlad.",
      },
      {
        title: "Hmotnost a sytost",
        body:
          "Z chleba samotného se nepřibírá, rozhoduje celkový příjem energie. Protože je kváskový chleba sytější, příjem energie bývá nižší a v konečném důsledku má pozitivnější vliv než běžné drožďové pečivo.",
      },
      {
        title: "Minerály, které tělo využije",
        body:
          "Fermentace pomáhá snižovat obsah kyseliny fytové, která omezuje vstřebávání minerálů. Tělo tak může lépe využít například železo, zinek nebo hořčík.",
      },
      {
        title: "Proč vydrží déle",
        body:
          "Přirozeně kyselé prostředí vzniklé fermentací zpomaluje vysychání i kažení chleba, takže vydrží déle bez použití konzervantů.",
      },
      {
        title: "Co v chlebu (ne)najdete",
        body:
          "Používáme jen základní suroviny: kvalitní mouku od českých mlýnů, námi ozkoušený poměr různých typů, vodu z vlastního zdroje, kvásek, himalájskou sůl a bio kmín z farmy. Bez dochucovadel, bez éček, bez zlepšovadel, bez konzervantů a bez zbytečných přísad.",
      },
      {
        title: "Patří chleba ke každému pobytu ve studiu?",
        body: "Ano. A pečeme zde také pizzu.",
      },
    ],
    back: "Zpět na Mlýn",
    contact: "Kontakt",
  },
  en: {
    homePath: "/en",
    contactPath: "/en/contact",
    eyebrow: "Homemade bread",
    title: "Bread from the mill",
    titleTop: "Bread from",
    titleAccent: "the mill",
    lead:
      "Breakfast or brunch is part of every stay and recording session. Everything around the bread follows the same approach as the studio itself: slow, crafted, and built on good ingredients.",
    paragraphs: [],
    craftTitle: "Craft sourdough bread from our oven",
    processEyebrow: "The process",
    processTitle: "How we bake our bread",
    processLead: "",
    benefitsTitle: "Why sourdough",
    ingredientsTitle: "Clean ingredients",
    purityTitle: "",
    purityText: "",
    benefitsText:
      "Sourdough works slowly and gives the bread flavour, structure and gentler digestion. Fermentation helps carbohydrates release more gradually, keeps you full for longer and makes minerals easier for the body to use. Its naturally acidic environment also helps the bread stay fresh without preservatives.",
    ingredientsText:
      "The base is simple: quality flour from Czech mills, local water, living sourdough starter, Himalayan salt and organic caraway. No flavour enhancers and no ingredients that do not belong in bread.",
    benefits: [
      "natural fermentation from a living starter",
      "gentler digestion thanks to fermentation",
      "better mineral availability",
      "keeps you full for longer with a lower glycaemic response",
      "stays fresh longer without preservatives",
    ],
    ingredients: [
      { text: "quality flour from Czech mills", kind: "ok" },
      { text: "water, sourdough starter, Himalayan salt and organic caraway", kind: "ok" },
      { text: "no additives, improvers or unnecessary ingredients", kind: "no" },
    ],
    detailsTitle: "A little more about the bread",
    details: [
      {
        title: "Why sourdough",
        body:
          "Sourdough gives bread time. Long fermentation helps break down some components of grain, including more complex carbohydrates and proteins, so it is often gentler to digest than ordinary yeast bread.",
      },
      {
        title: "Does sourdough bread help with weight loss?",
        body:
          "Yes and no. :-) Sourdough bread does not cause weight loss on its own, but because you need less of it and it keeps you full for longer, it does help indirectly — both with your figure and with digestion.\n\nHow does that work? The key is satiety and a gradual glycaemic response. Compared to ordinary white bread, the carbohydrates in sourdough are released into the body far more slowly. In practice your blood sugar does not spike, you stay full for longer, you eat less and you don't get hungry again so quickly.",
      },
      {
        title: "Weight and fullness",
        body:
          "Bread itself is not the issue; overall energy intake is. Because sourdough bread is more filling, people often eat less of it than ordinary yeast bread.",
      },
      {
        title: "Minerals the body can use",
        body:
          "Fermentation helps reduce phytic acid, which can limit mineral absorption. The body can then make better use of minerals such as iron, zinc and magnesium.",
      },
      {
        title: "Why it lasts longer",
        body:
          "The naturally acidic environment created by fermentation slows drying and spoilage, so the bread lasts longer without preservatives.",
      },
      {
        title: "What you will and will not find in it",
        body:
          "We use basic ingredients only: quality flour from Czech mills, our tested mix of flour types, water, starter, Himalayan salt and organic caraway. No additives, no improvers, no unnecessary ingredients.",
      },
      {
        title: "Is bread part of every studio stay?",
        body: "Yes. And we also bake pizza here.",
      },
    ],
    back: "Back to the Mill",
    contact: "Contact",
  },
  de: {
    homePath: "/de",
    contactPath: "/de/kontakt",
    eyebrow: "Hausgemachtes Brot",
    title: "Brot aus der Mühle",
    titleTop: "Brot aus",
    titleAccent: "der Mühle",
    lead:
      "Zu jedem Aufenthalt und jeder Recording-Session gehört ein Frühstück oder Brunch. Alles rund um das Brot folgt demselben Ansatz wie das Studio selbst: langsam, handwerklich und aus guten Zutaten.",
    paragraphs: [],
    craftTitle: "Handwerkliches Sauerteigbrot aus unserem Ofen",
    processEyebrow: "Der Ablauf",
    processTitle: "Wie wir unser Brot backen",
    processLead: "",
    benefitsTitle: "Vorteile von Sauerteig",
    ingredientsTitle: "Klare Zutaten",
    purityTitle: "",
    purityText: "",
    benefitsText:
      "Sauerteig arbeitet langsam und gibt dem Brot Geschmack, Struktur und eine bessere Bekömmlichkeit. Durch die Fermentation werden Kohlenhydrate gleichmäßiger freigesetzt, das Brot sättigt länger und Mineralstoffe können besser genutzt werden. Das natürlich saure Milieu hilft außerdem, dass es ohne Konservierungsstoffe länger frisch bleibt.",
    ingredientsText:
      "Die Grundlage ist einfach: hochwertiges Mehl aus tschechischen Mühlen, Wasser vom Ort, lebendiger Sauerteig, Himalayasalz und Bio-Kümmel. Keine Geschmacksverstärker und keine Zutaten, die in Brot nichts zu suchen haben.",
    benefits: [
      "natürliche Fermentation mit lebendigem Sauerteig",
      "oft bekömmlicher durch lange Fermentation",
      "bessere Verfügbarkeit von Mineralstoffen",
      "sättigt länger und sorgt für eine ruhigere glykämische Reaktion",
      "bleibt ohne Konservierungsstoffe länger frisch",
    ],
    ingredients: [
      { text: "hochwertiges Mehl aus tschechischen Mühlen", kind: "ok" },
      { text: "Wasser, Sauerteig, Himalayasalz und Bio-Kümmel", kind: "ok" },
      { text: "ohne Zusatzstoffe, Verbesserer und unnötige Zutaten", kind: "no" },
    ],
    detailsTitle: "Warum Sauerteigbrot",
    details: [
      {
        title: "Warum Sauerteig",
        body:
          "Sauerteig gibt dem Brot Zeit. Die lange Fermentation hilft, einige Bestandteile des Getreides teilweise abzubauen, darunter komplexere Kohlenhydrate und Proteine. Deshalb ist es oft bekömmlicher als gewöhnliches Hefebrot.",
      },
      {
        title: "Hilft Sauerteigbrot beim Abnehmen?",
        body:
          "Ja und nein. :-) Sauerteigbrot lässt die Kilos nicht von allein purzeln, aber weil man weniger davon braucht und länger satt bleibt, hilft es indirekt tatsächlich — der Figur wie der Verdauung.\n\nWie kommt das? Der Schlüssel sind Sättigung und eine langsame glykämische Reaktion. Im Vergleich zu gewöhnlichem Weißbrot gelangen die Kohlenhydrate aus dem Sauerteigbrot viel langsamer in den Körper. In der Praxis schießt der Blutzucker nicht nach oben, man bleibt länger satt, isst weniger und bekommt nicht so schnell wieder Hunger.",
      },
      {
        title: "Gewicht und Sättigung",
        body:
          "Vom Brot allein nimmt man nicht zu, entscheidend ist die gesamte Energieaufnahme. Da Sauerteigbrot besser sättigt, isst man davon oft weniger.",
      },
      {
        title: "Mineralstoffe",
        body:
          "Die Fermentation kann den Gehalt an Phytinsäure senken, die die Aufnahme von Mineralstoffen begrenzt. So kann der Körper Eisen, Zink oder Magnesium besser nutzen.",
      },
      {
        title: "Warum es länger hält",
        body:
          "Das natürlich saure Milieu der Fermentation verlangsamt Austrocknen und Verderb. Das Brot hält dadurch länger ohne Konservierungsstoffe.",
      },
      {
        title: "Was im Brot ist und was nicht",
        body:
          "Wir verwenden nur Grundzutaten: hochwertiges Mehl aus tschechischen Mühlen, unsere erprobte Mischung verschiedener Mehltypen, Wasser, Sauerteig, Himalayasalz und Bio-Kümmel. Ohne Zusatzstoffe, ohne Verbesserer, ohne unnötige Zutaten.",
      },
      {
        title: "Gehört Brot zu jedem Studioaufenthalt?",
        body: "Ja. Und wir backen hier auch Pizza.",
      },
    ],
    back: "Zurück zur Mühle",
    contact: "Kontakt",
  },
} satisfies Record<Locale, {
  homePath: string
  contactPath: string
  eyebrow: string
  title: string
  titleTop: string
  titleAccent: string
  lead: string
  paragraphs: string[]
  craftTitle: string
  processEyebrow: string
  processTitle: string
  processLead: string
  benefitsTitle: string
  ingredientsTitle: string
  purityTitle: string
  purityText: string
  benefitsText: string
  ingredientsText: string
  benefits: string[]
  ingredients: { text: string; kind: "ok" | "no" }[]
  detailsTitle: string
  details: { title: string; body: string }[]
  back: string
  contact: string
}>
