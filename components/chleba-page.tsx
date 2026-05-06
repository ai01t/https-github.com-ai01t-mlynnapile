"use client"

import { Cormorant_Garamond, Manrope, Rock_Salt } from "next/font/google"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Flame, Guitar, HandHeart, Heart, ShoppingCart, Skull, Sparkles, Wheat, Zap } from "lucide-react"
import styles from "@/components/chleba-page.module.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
})

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
})

const rockSalt = Rock_Salt({
  subsets: ["latin"],
  weight: ["400"],
})

const VARIANT_STORAGE_KEY = "mlyn_chleba_variant"

type Locale = "cs" | "en" | "de"
type Variant = "solid" | "wild"

type Bread = {
  name: string
  weight: string
  character: string
  image: string
  backTitle: string
  backText: string
}

const breads: Bread[] = [
  {
    name: "Usmrkanec",
    weight: "250 g",
    character: "Malý bochník s velkým egem. Kapsový riff ke kávě, máslu i výletu.",
    image: "/images/chleba-cards/usmrkanec.svg",
    backTitle: "Hlavní vrstva",
    backText: "Opravdový chleba je vždycky první. Fotka, kůrka, střídka, chuť. Postava jen přidává charakter.",
  },
  {
    name: "Princ Kvasoň",
    weight: "840 g",
    character: "Dvorní kváskový favorit. Zlatá kůrka, vláčná střídka, čistý střed.",
    image: "/images/chleba-cards/princ-kvason.svg",
    backTitle: "Druhá vrstva",
    backText: "Chlebová postavička může žít jako ikonka, badge, samolepka, reels grafika nebo plakát.",
  },
  {
    name: "Jeho Výsost",
    weight: "1200 g",
    character: "Král mlýna. Velký rodinný bochník pro dlouhý stůl a hladovou partu.",
    image: "/images/chleba-cards/jeho-vysost.svg",
    backTitle: "Třetí vrstva",
    backText: "Naming a copy mají vlastní hlas. Každý bochník má povahu, váhu i jasnou roli.",
  },
  {
    name: "Drahá Polovička",
    weight: "cca 600 g",
    character: "Lepší polovička. Menší kus, pořád dost důstojnosti na další krajíc.",
    image: "/images/chleba-cards/draha-polovicka.svg",
    backTitle: "Food-first",
    backText: "Solidní verze nechá černý plakát ustoupit a nechá mluvit fotku chleba.",
  },
  {
    name: "Flint Firestarter",
    weight: "917 g",
    character: "Ohnivá legenda. Kůrka s názorem, temnější tón a pec v krvi.",
    image: "/images/chleba-cards/flint-firestarter.svg",
    backTitle: "Oheň",
    backText: "Kámen. Voda. Oheň. Kvas. Ruce. Rock'n'roll. Tady se nepeče normálně.",
  },
  {
    name: "Mlýnský Prašan",
    weight: "1000 g",
    character: "Rustikální prašan z mlýna. Moučný podpis a chuť bez okecávání.",
    image: "/images/chleba-cards/mlynsky-prasan.svg",
    backTitle: "Mlýn",
    backText: "Mouka z českých mlýnů, voda z vlastního zdroje a místo, které má zvuk.",
  },
]

const localeCopy = {
  cs: {
    homePath: "/",
    contactPath: "/kontakt",
    nav: ["Chleby", "O mlýně", "Andrea", "Kde nás najdeš", "Kontakt"],
    title: ["Chleba", "z rockového", "mlýna"],
    lead: "Peče Andrea Kohoutová z kapely Anteater. Kvásek zrovna nedrží basu, ale drží chleba při životě.",
    cta: "Naše chleby",
    deckTitle: "Namíchej si karty",
    stamp: "Kvas. Oheň. Čas. A trochu rock'n'rollu.",
    solid: "Solidní verze",
    wild: "Rocková verze",
  },
  en: {
    homePath: "/en",
    contactPath: "/en/contact",
    nav: ["Breads", "The mill", "Andrea", "Find us", "Contact"],
    title: ["Bread", "from the rock", "mill"],
    lead: "Baked by Andrea Kohoutová from Anteater. The starter may not hold the bass, but it keeps bread alive.",
    cta: "Our breads",
    deckTitle: "Mix the cards",
    stamp: "Starter. Fire. Time. And a little rock'n'roll.",
    solid: "Refined",
    wild: "Rock version",
  },
  de: {
    homePath: "/de",
    contactPath: "/de/kontakt",
    nav: ["Brote", "Die Muhle", "Andrea", "Wo wir sind", "Kontakt"],
    title: ["Brot", "aus der Rock", "Muhle"],
    lead: "Gebacken von Andrea Kohoutová von Anteater. Der Sauerteig hält nicht den Bass, aber das Brot am Leben.",
    cta: "Unsere Brote",
    deckTitle: "Karten mischen",
    stamp: "Sauerteig. Feuer. Zeit. Und etwas Rock'n'Roll.",
    solid: "Serios",
    wild: "Rock-Version",
  },
} satisfies Record<Locale, {
  homePath: string
  contactPath: string
  nav: string[]
  title: string[]
  lead: string
  cta: string
  deckTitle: string
  stamp: string
  solid: string
  wild: string
}>

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ")
}

export default function ChlebaPage({ locale }: { locale: Locale }) {
  const copy = localeCopy[locale]
  const [variant, setVariant] = useState<Variant>("wild")
  const [flippedCards, setFlippedCards] = useState<string[]>([])

  useEffect(() => {
    document.documentElement.lang = locale

    try {
      const savedVariant = window.localStorage.getItem(VARIANT_STORAGE_KEY)
      if (savedVariant === "solid" || savedVariant === "wild") {
        setVariant(savedVariant)
      }
    } catch {}
  }, [locale])

  useEffect(() => {
    try {
      window.localStorage.setItem(VARIANT_STORAGE_KEY, variant)
    } catch {}
  }, [variant])

  function toggleCard(name: string) {
    setFlippedCards((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    )
  }

  return (
    <main className={cx(styles.page, manrope.className, variant === "solid" && styles.pageSolid)}>
      <div className={styles.grain} />

      <section className={styles.poster}>
        <header className={styles.nav}>
          <Link href={copy.homePath} className={cx(styles.logo, cormorant.className)}>
            <span>Mlýn</span>
            <span>na Pile</span>
            <small>Založeno 2020</small>
          </Link>

          <nav className={styles.navLinks} aria-label="Chleba navigace">
            <a href="#karty">{copy.nav[0]}</a>
            <a href="#o-mlyne">{copy.nav[1]}</a>
            <a href="#andrea">{copy.nav[2]}</a>
            <a href="#kde">{copy.nav[3]}</a>
            <Link href={copy.contactPath}>{copy.nav[4]}</Link>
          </nav>

          <div className={styles.navIcons} aria-label="Verze webu">
            <button
              type="button"
              className={cx(styles.modeButton, variant === "solid" && styles.modeButtonActive)}
              onClick={() => setVariant("solid")}
            >
              {copy.solid}
            </button>
            <button
              type="button"
              className={cx(styles.modeButton, variant === "wild" && styles.modeButtonActive)}
              onClick={() => setVariant("wild")}
            >
              {copy.wild}
            </button>
            <Zap className={styles.topIcon} />
            <span className={styles.horns}>🤘</span>
            <span className={styles.cartWrap}>
              <ShoppingCart className={styles.cart} />
              <small>0</small>
            </span>
          </div>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1 className={cx(styles.title, rockSalt.className)}>
              <span>{copy.title[0]}</span>
              <span>{copy.title[1]}</span>
              <span>{copy.title[2]}</span>
            </h1>
            <p>{copy.lead}</p>
            <a href="#karty" className={cx(styles.heroButton, rockSalt.className)}>
              {copy.cta} <span>→</span>
            </a>
          </div>

          <div className={styles.heroPhoto}>
            <img src="/images/chleba-hero.jpeg" alt="Kváskový chleba z Mlýna na Pile" />
          </div>

          <aside className={styles.paperNote}>
            <span className={styles.noteCrown}>♕</span>
            <p>{copy.stamp}</p>
          </aside>

          <Zap className={styles.bigBolt} />
          <Sparkles className={styles.heroSparkle} />
        </section>

        <section className={styles.promiseBar} aria-label="Slib značky">
          <article>
            <Skull />
            <div>
              <h2>Přirozený kvásek</h2>
              <p>Žádné droždí. Čas, trpělivost a živej kvásek.</p>
            </div>
          </article>
          <article>
            <Wheat />
            <div>
              <h2>Lokální suroviny</h2>
              <p>Mouky z českých mlýnů, voda z vlastního zdroje.</p>
            </div>
          </article>
          <article>
            <Heart />
            <div>
              <h2>Žádné zkratky</h2>
              <p>Poctivá práce, dlouhé kvašení, opravdová chuť.</p>
            </div>
          </article>
        </section>

        <section id="karty" className={styles.deck}>
          <div className={styles.deckLabel}>
            <span>★</span>
            <h2 className={rockSalt.className}>{copy.deckTitle}</h2>
            <span>★</span>
          </div>

          <div className={styles.cards}>
            {breads.map((bread, index) => {
              const isFlipped = flippedCards.includes(bread.name)

              return (
                <button
                  type="button"
                  key={bread.name}
                  className={cx(styles.card, isFlipped && styles.cardFlipped)}
                  onClick={() => toggleCard(bread.name)}
                  aria-pressed={isFlipped}
                >
                  <span className={styles.cardInner}>
                    <span className={styles.cardFace}>
                      <span className={styles.cardNumber}>{index + 1}.</span>
                      <span className={styles.character}>
                        <img src={bread.image} alt="" />
                      </span>
                      <span className={styles.cardBread}>
                        <img src="/images/chleba-hero.jpeg" alt="" />
                      </span>
                      <strong>{bread.name}</strong>
                      <em>{bread.weight}</em>
                    </span>

                    <span className={cx(styles.cardFace, styles.cardBack)}>
                      <b>{bread.backTitle}</b>
                      <span>{bread.character}</span>
                      <p>{bread.backText}</p>
                      <small>Klikni zpět</small>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <footer className={styles.footerBar}>
          <article>
            <Flame />
            <div>
              <h2>Pečeme na ohni</h2>
              <p>Chléb má oheň v krvi. Kůrka, co křupe a duše, co hřeje.</p>
            </div>
          </article>
          <article id="o-mlyne">
            <Wheat />
            <div>
              <h2>Z mlýna na Pile</h2>
              <p>Meleme vlastní mouku z lokálního obilí. Čerstvě. Poctivě. Na místě.</p>
            </div>
          </article>
          <article id="andrea">
            <HandHeart />
            <div>
              <h2>Ručně a poctivě</h2>
              <p>Žádné zkratky. Jen ruce, čas a cit pro správné těsto.</p>
            </div>
          </article>
          <article id="kde">
            <Guitar />
            <div>
              <h2>Hudba v nás je</h2>
              <p>Zní to v peci. Zní to v nás. Zní to i mimo ni.</p>
            </div>
          </article>
        </footer>
      </section>
    </main>
  )
}
