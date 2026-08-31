"use client"

import { useEffect, useState } from "react"
import { Cormorant_Garamond, Manrope } from "next/font/google"
import Link from "next/link"
import BreadProcessTimeline from "@/components/bread-process-timeline"
import styles from "@/components/chleba-page.module.css"
import { buildMediaFilter, buildOverlayGradients } from "@/lib/page-bg"
import { useLiveBgConfig } from "@/lib/use-live-bg"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
})

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

type Locale = "cs" | "en" | "de"

const copy = {
  cs: {
    homePath: "/",
    contactPath: "/kontakt",
    eyebrow: "Domácí chléb",
    title: "Chleba ze mlýna",
    titleTop: "Chleba ze",
    titleAccent: "mlýna",
    lead:
      "Součástí každého pobytu i nahrávání je snídaně nebo brunch. Všechno kolem chleba bereme stejně poctivě jako samotné studio: pomalu, řemeslně a z dobrých surovin.",
    paragraphs: [
      "Pečeme jak kváskový, tak i klasický chleba, vždy jen z prvotřídních surovin. Vzhledem k pozitivnímu ohlasu nakonec plánujeme dodávat i mimo studio.",
      "Kvásek dává chlebu čas, vůni a přirozenou chuť. Používáme kvalitní mouku od českých mlýnů, vodu z vlastního zdroje, himalájskou sůl a bio kmín z farmy.",
      "Bez dochucovadel, bez éček, bez zlepšovadel, bez konzervantů a bez zbytečných přísad. Jen základní suroviny, pec a čas.",
    ],
    craftTitle: "Řemeslný kváskový chleba z naší pece",
    processEyebrow: "Postup",
    processTitle: "Jak pečeme chleba",
    processLead:
      "Od rozkvašení kvásku po vychladnutí bochníku uběhne zhruba dva dny. Časová osa ukazuje hlavní úkony — většinu času pracuje kvásek sám, ale trefit ho ve správnou chvíli je celé to řemeslo.",
    benefitsTitle: "Co dává kvásek chlebu",
    ingredientsTitle: "Čisté složení",
    purityTitle: "Bez zkratek",
    purityText:
      "Žádné droždí, žádná dochucovadla, žádná éčka, žádná zlepšovadla, žádné konzervanty. Jen mouka, voda, kvásek, sůl, kmín a čas.",
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
        title: "Zasycení a glykemická odezva",
        body:
          "Oproti běžnému bílému pečivu se sacharidy uvolňují pomaleji. To znamená pozvolnější glykemickou odezvu a delší pocit sytosti. V praxi to často vede k tomu, že člověk sní menší množství a nemá tak rychlý hlad.",
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
    paragraphs: [
      "Andrea bakes it here at the mill. The dough is given time, the starter works slowly, and the result is bread with a crisp crust, soft crumb and a taste that needs no effects.",
      "We use local ingredients, water from the place and an oven that turns everyday food into a small ritual. We serve the bread with breakfast, brunch, soup, cheese or simply with butter.",
      "When time and mood allow, guests can join the baking too. Heating the oven, working with the dough and waiting for the first slice are part of the atmosphere of Mlýn na Pile.",
    ],
    craftTitle: "Craft sourdough bread from our oven",
    processEyebrow: "The process",
    processTitle: "How we bake our bread",
    processLead:
      "From refreshing the starter to the cooled loaf it takes about two days. The timeline shows the main steps — most of the time the starter works on its own, but catching it at the right moment is the whole craft.",
    benefitsTitle: "Why sourdough",
    ingredientsTitle: "Clean ingredients",
    purityTitle: "No shortcuts",
    purityText:
      "No yeast, no flavour enhancers, no additives, no improvers, no preservatives. Just flour, water, sourdough starter, salt, caraway and time.",
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
        title: "Satiety and glycaemic response",
        body:
          "Compared with ordinary white bread, carbohydrates are released more slowly. That means a steadier glycaemic response and a longer feeling of fullness.",
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
    paragraphs: [
      "Andrea backt es direkt in der Mühle. Der Teig bekommt Zeit, der Sauerteig arbeitet langsam, und am Ende steht ein Brot mit knuspriger Kruste, weicher Krume und einem Geschmack ohne Effekte.",
      "Wir verwenden lokale Zutaten, Wasser vom Ort und einen Ofen, der alltägliches Essen in ein kleines Ritual verwandelt. Das Brot servieren wir zum Frühstück, Brunch, zur Suppe, zu Käse oder einfach mit Butter.",
      "Wenn Zeit und Stimmung passen, können Gäste auch beim Backen mitmachen. Den Ofen anheizen, mit dem Teig arbeiten und auf die erste Scheibe warten: Das gehört zur Atmosphäre von Mlýn na Pile.",
    ],
    craftTitle: "Handwerkliches Sauerteigbrot aus unserem Ofen",
    processEyebrow: "Der Ablauf",
    processTitle: "Wie wir unser Brot backen",
    processLead:
      "Vom Auffrischen des Sauerteigs bis zum ausgekühlten Laib vergehen etwa zwei Tage. Die Zeitachse zeigt die wichtigsten Schritte — die meiste Zeit arbeitet der Sauerteig allein, ihn im richtigen Moment zu erwischen ist das ganze Handwerk.",
    benefitsTitle: "Vorteile von Sauerteig",
    ingredientsTitle: "Klare Zutaten",
    purityTitle: "Ohne Abkürzungen",
    purityText:
      "Keine Hefe, keine Geschmacksverstärker, keine Zusatzstoffe, keine Verbesserer, keine Konservierungsstoffe. Nur Mehl, Wasser, Sauerteig, Salz, Kümmel und Zeit.",
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
        title: "Sättigung und glykämische Reaktion",
        body:
          "Im Vergleich zu gewöhnlichem Weißbrot werden Kohlenhydrate langsamer freigesetzt. Das bedeutet eine ruhigere glykämische Reaktion und ein längeres Sättigungsgefühl.",
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

export default function ChlebaPage({ locale }: { locale: Locale }) {
  const t = copy[locale]
  const live = useLiveBgConfig("chleba")
  const bg = live && (live.image || live.video) ? live : null

  const overlay = bg ? buildOverlayGradients(bg) : ""

  return (
    <main className={`${styles.page} ${manrope.className}`}>
      {bg?.video ? (
        <video
          className={styles.backgroundImage}
          autoPlay
          muted
          loop
          playsInline
          style={{ filter: buildMediaFilter(bg) }}
        >
          <source src={bg.video} />
        </video>
      ) : (
        <img
          className={styles.backgroundImage}
          src={bg?.image || "/images/chleba-hero.jpeg"}
          alt=""
          aria-hidden="true"
          style={bg ? { filter: buildMediaFilter(bg) } : undefined}
        />
      )}
      <div className={styles.shade} style={overlay ? { background: "none", backgroundImage: overlay } : undefined} />

      <header className={styles.header}>
        <Link href={t.homePath} className={`${styles.brand} ${cormorant.className}`} aria-label="Mlýn na Pile">
          Mlýn <span>na Pile</span>
        </Link>
        <nav className={styles.nav} aria-label="Chleba">
          <Link href={t.homePath}>{t.back}</Link>
          <Link href={t.contactPath}>{t.contact}</Link>
        </nav>
      </header>

      <section className={styles.content}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h1 className={cormorant.className}>
          {t.titleTop}
          <em>{t.titleAccent}</em>
        </h1>
        <p className={styles.lead}>{t.lead}</p>

        <section className={styles.storyGrid} aria-label={t.title}>
          <div className={styles.textPanel}>
            {t.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <aside className={styles.purityNote}>
            <p className={styles.noteKicker}>{t.purityTitle}</p>
            <p>{t.purityText}</p>
          </aside>
        </section>

        <section className={styles.infoGrid} aria-label={t.craftTitle}>
          <article className={styles.infoCard}>
            <p className={styles.cardEyebrow}>{t.craftTitle}</p>
            <h2 className={cormorant.className}>{t.benefitsTitle}</h2>
            <p className={styles.infoText}>{t.benefitsText}</p>
          </article>

          <article className={styles.infoCard}>
            <p className={styles.cardEyebrow}>{t.ingredientsTitle}</p>
            <h2 className={cormorant.className}>{t.ingredientsTitle}</h2>
            <p className={styles.infoText}>{t.ingredientsText}</p>
          </article>
        </section>

        <section className={styles.processBlock} aria-label={t.processTitle}>
          <p className={styles.cardEyebrow}>{t.processEyebrow}</p>
          <h2 className={cormorant.className}>{t.processTitle}</h2>
          <p className={styles.processLead}>{t.processLead}</p>
          <div className={styles.processFrame}>
            <BreadProcessTimeline />
          </div>
        </section>

        <section className={styles.detailsBlock} aria-label={t.detailsTitle}>
          <h2 className={cormorant.className}>{t.detailsTitle}</h2>
          <div className={styles.detailsList}>
            {t.details.map((detail) => (
              <article className={styles.detailItem} key={detail.title}>
                <h3>{detail.title}</h3>
                <p>{detail.body}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
