"use client"

import { Cormorant_Garamond, Manrope } from "next/font/google"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import styles from "@/components/chleba-page.module.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
})

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

const LOCAL_VIDEO_SRC = "/videos/bg/NYqybmh85G4_hq.mp4"
const LOCAL_VIDEO_POSTER = "/videos/bg/NYqybmh85G4_hq.jpg"
const MODE_STORAGE_KEY = "mlyn_mode"
const LANG_STORAGE_KEY = "mlyn_lang"

type Locale = "cs" | "en" | "de"

type Copy = {
  mill: string
  studio: string
  equipment: string
  accommodation: string
  location: string
  history: string
  contact: string
  pause: string
  resume: string
  switchToNight: string
  switchToDay: string
  selectLanguage: string
  menu: string
  close: string
  label: string
  titleTop: string
  titleAccent: string
  intro1: string
  intro2: string
  craftTitle: string
  benefits: string[]
  ingredients: Array<{ text: string; kind: "ok" | "no" }>
  faqTitle: string
  faqSubtitle: string
  details: Array<{ title: string; body: string }>
  backToPackages: string
  contactCta: string
}

const copyByLocale: Record<Locale, Copy> = {
  cs: {
    mill: "Mlýn",
    studio: "Studio",
    equipment: "Vybavení",
    accommodation: "Ubytování",
    location: "Lokalita",
    history: "Historie",
    contact: "Kontakt",
    pause: "Pauza",
    resume: "Přehrát",
    switchToNight: "Přepnout na noční režim",
    switchToDay: "Přepnout na denní režim",
    selectLanguage: "Vybrat jazyk",
    menu: "Menu",
    close: "Zavřít",
    label: "Domácí chléb",
    titleTop: "Chleba ze",
    titleAccent: "mlýna",
    intro1:
      "Součástí každého pobytu i nahrávání je snídaně nebo brunch. Všechno kolem chleba bereme stejně poctivě jako samotné studio: pomalu, řemeslně a z dobrých surovin.",
    intro2:
      "Pečeme jak kváskový, tak i klasický chleba, vždy jen z prvotřídních surovin. Vzhledem k pozitivnímu ohlasu nakonec plánujeme dodávat i mimo studio... ;)",
    craftTitle: "Řemeslný kváskový chleba z naší pece",
    benefits: [
      "přirozené kvašení z živého kvásku",
      "lepší stravitelnost díky fermentaci",
      "lepší využitelnost minerálů",
      "zasytí na delší dobu (nižší glykemická odezva)",
      "delší čerstvost bez konzervantů",
    ],
    ingredients: [
      { text: "kvalitní mouka od českých mlýnů", kind: "ok" },
      { text: "voda · kvásek · himalájská sůl · bio kmín z farmy", kind: "ok" },
      { text: "bez éček a zlepšovadel", kind: "no" },
    ],
    faqTitle: "FAQ",
    faqSubtitle: "Často kladené otázky",
    details: [
      {
        title: "Proč kvásek",
        body:
          "Kvásek dává chlebu čas. Dlouhá fermentace umožňuje částečný rozklad některých složek obilí (např. složitějších sacharidů a bílkovin), takže bývá pro trávení šetrnější než běžné pečivo z droždí.",
      },
      {
        title: "Zasycení a glykemická odezva",
        body:
          "Oproti běžnému bílému pečivu se sacharidy uvolňují pomaleji. To znamená pozvolnější glykemickou odezvu a delší pocit sytosti. V praxi to často vede k tomu, že člověk sní menší množství a nemá tak rychlý hlad.",
      },
      {
        title: "Hmotnost a sytost",
        body:
          "Z chleba samotného se nepřibírá – rozhoduje celkový příjem energie. Protože je kváskový chleba sytější, příjem energie bývá nižší a v konečném důsledku má pozitivnější vliv než běžné drožďové pečivo.",
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
          "Používáme jen základní suroviny: kvalitní mouku od českých mlýnů, námi ozkoušený poměr různých typů, vodu, kvásek, himalájskou sůl a bio kmín z farmy. Kvásek je možné od nás získat, recept je ale náš ;-) Bez éček, bez zlepšovadel, bez zbytečných přísad.",
      },
      {
        title: "Patří chleba ke každému pobytu ve studiu?",
        body: "Ano a pečeme zde také pizzu ;-)",
      },
    ],
    backToPackages: "Zpět na Studio",
    contactCta: "Kontakt",
  },
  en: {
    mill: "The Mill",
    studio: "Studio",
    equipment: "Equipment",
    accommodation: "Accommodation",
    location: "Location",
    history: "History",
    contact: "Contact",
    pause: "Pause",
    resume: "Play",
    switchToNight: "Switch to night mode",
    switchToDay: "Switch to day mode",
    selectLanguage: "Select language",
    menu: "Menu",
    close: "Close",
    label: "Bread from the mill",
    titleTop: "Bread from",
    titleAccent: "the mill",
    intro1:
      "Breakfast or brunch is part of every stay and recording session. Everything around the bread follows the same approach as the studio itself: slow, crafted, and built on good ingredients.",
    intro2:
      "It is not decoration or a side detail. It is part of a place that works differently from ordinary studios: recording, calm, nature, warmth from the oven, and things that keep their own rhythm.",
    craftTitle: "Craft sourdough bread from our oven",
    benefits: [
      "natural fermentation with a live starter",
      "easier digestion thanks to fermentation",
      "better mineral availability",
      "keeps you full longer (lower glycemic response)",
      "stays fresh longer without preservatives",
    ],
    ingredients: [
      { text: "quality flour from Czech mills", kind: "ok" },
      { text: "water · starter · Himalayan salt · organic caraway from a farm", kind: "ok" },
      { text: "no additives or improvers", kind: "no" },
    ],
    faqTitle: "FAQ",
    faqSubtitle: "Frequently asked questions",
    details: [
      {
        title: "What we bake for stays and sessions",
        body:
          "Breakfast or brunch is part of every stay and recording session. We bake our own sourdough bread for it, always fresh, in the large outdoor oven. We also bake pizza here ;-)",
      },
      {
        title: "Why sourdough",
        body:
          "Sourdough gives bread time. Long fermentation helps partially break down some grain components, making the bread gentler on the body than standard baked goods.",
      },
      {
        title: "Satiety without spikes",
        body:
          "Compared to regular bread, carbohydrates are released more slowly. That means it keeps you full for longer.",
      },
      {
        title: "Minerals your body can use",
        body:
          "Fermentation helps reduce phytic acid, which limits mineral absorption. The body can better use iron, zinc, and magnesium.",
      },
      {
        title: "Why it stays fresh longer",
        body:
          "The naturally acidic environment created by fermentation slows drying and spoilage, so the bread stays fresh without preservatives.",
      },
      {
        title: "Clean ingredients",
        body:
          "We use only basic ingredients: quality flour from Czech mills, water, starter, Himalayan salt, and organic caraway from a farm. No additives, no improvers.",
      },
    ],
    backToPackages: "Back to studio",
    contactCta: "Contact",
  },
  de: {
    mill: "Mühle",
    studio: "Studio",
    equipment: "Ausstattung",
    accommodation: "Unterkunft",
    location: "Lage",
    history: "Geschichte",
    contact: "Kontakt",
    pause: "Pause",
    resume: "Abspielen",
    switchToNight: "Zum Nachtmodus wechseln",
    switchToDay: "Zum Tagmodus wechseln",
    selectLanguage: "Sprache wählen",
    menu: "Menü",
    close: "Schließen",
    label: "Brot aus der Mühle",
    titleTop: "Brot aus",
    titleAccent: "der Mühle",
    intro1:
      "Zu jedem Aufenthalt und jeder Recording-Session gehört ein Frühstück oder Brunch. Alles rund um das Brot folgt demselben Ansatz wie das Studio selbst: langsam, handwerklich und aus guten Zutaten.",
    intro2:
      "Es ist keine Dekoration und kein Nebendetail. Es ist Teil eines Ortes, der anders funktioniert als gewöhnliche Studios: Recording, Ruhe, Natur, Wärme aus dem Ofen und Dinge, die ihren eigenen Rhythmus haben.",
    craftTitle: "Handwerkliches Sauerteigbrot aus unserem Ofen",
    benefits: [
      "natürliche Fermentation mit lebendigem Sauerteig",
      "bessere Bekömmlichkeit durch Fermentation",
      "bessere Verfügbarkeit von Mineralstoffen",
      "sättigt länger (niedrigere glykämische Reaktion)",
      "längere Frische ohne Konservierungsstoffe",
    ],
    ingredients: [
      { text: "hochwertiges Mehl aus tschechischen Mühlen", kind: "ok" },
      { text: "Wasser · Sauerteig · Himalaya-Salz · Bio-Kümmel vom Hof", kind: "ok" },
      { text: "ohne Zusatzstoffe und Backverbesserer", kind: "no" },
    ],
    faqTitle: "FAQ",
    faqSubtitle: "Häufig gestellte Fragen",
    details: [
      {
        title: "Was wir für Aufenthalte und Sessions backen",
        body:
          "Zu jedem Aufenthalt und jeder Recording-Session gehört ein Frühstück oder Brunch. Dafür backen wir unser eigenes Sauerteigbrot, immer frisch, im großen Außenofen. Hier backen wir auch Pizza ;-)",
      },
      {
        title: "Warum Sauerteig",
        body:
          "Sauerteig gibt dem Brot Zeit. Die lange Fermentation baut einige Bestandteile des Getreides teilweise ab, wodurch das Brot für den Körper bekömmlicher ist als gewöhnliches Gebäck.",
      },
      {
        title: "Sättigung ohne Schwankungen",
        body:
          "Im Vergleich zu normalem Gebäck werden die Kohlenhydrate langsamer freigesetzt. Dadurch sättigt das Brot länger.",
      },
      {
        title: "Mineralien, die der Körper nutzen kann",
        body:
          "Die Fermentation senkt den Gehalt an Phytinsäure, die die Mineralstoffaufnahme hemmt. So kann der Körper Eisen, Zink oder Magnesium besser verwerten.",
      },
      {
        title: "Warum es länger hält",
        body:
          "Das natürlich saure Milieu der Fermentation verlangsamt Austrocknung und Verderb, sodass das Brot ohne Konservierungsstoffe länger frisch bleibt.",
      },
      {
        title: "Reine Zutaten",
        body:
          "Wir verwenden nur Grundzutaten: hochwertiges Mehl aus tschechischen Mühlen, Wasser, Sauerteig, Himalaya-Salz und Bio-Kümmel vom Hof. Ohne Zusatzstoffe, ohne Verbesserer.",
      },
    ],
    backToPackages: "Zurück ins Studio",
    contactCta: "Kontakt",
  },
}

const localeNames: Record<Locale, string> = {
  cs: "Čeština",
  en: "English",
  de: "Deutsch",
}

function getLocaleHomePath(locale: Locale) {
  if (locale === "cs") return "/"
  if (locale === "en") return "/?lang=en"
  return "/?lang=de"
}

function getBreadPath(locale: Locale) {
  return locale === "cs" ? "/chleba" : `/${locale}/chleba`
}

function getHistoryPath(locale: Locale) {
  if (locale === "cs") {
    return "/historie"
  }

  if (locale === "en") {
    return "/en/history"
  }

  return "/de/geschichte"
}

function getSectionHref(locale: Locale, sectionId: string) {
  return `${getLocaleHomePath(locale)}#${sectionId}`
}

function attemptPlay(video: HTMLVideoElement | null) {
  if (!video) {
    return
  }

  video.muted = true
  video.defaultMuted = true
  video.playsInline = true
  try {
    video.volume = 0
  } catch {}
  const maybePromise = video.play()
  if (maybePromise && typeof maybePromise.catch === "function") {
    maybePromise.catch(() => {})
  }
}

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ")
}

export default function ChlebaPage({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale]
  const router = useRouter()
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const langSwitchRef = useRef<HTMLDivElement | null>(null)
  const [navScrolled, setNavScrolled] = useState(false)
  const [paused, setPaused] = useState(false)
  const [nightMode, setNightMode] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [localPlaying, setLocalPlaying] = useState(false)
  const [openDetailIndex, setOpenDetailIndex] = useState<number | null>(null)

  useEffect(() => {
    document.documentElement.lang = locale
    document.body.style.background = "#07060a"

    try {
      setNightMode(window.localStorage.getItem(MODE_STORAGE_KEY) === "night")
      window.localStorage.setItem(LANG_STORAGE_KEY, locale)
    } catch {}

    return () => {
      document.body.style.background = ""
    }
  }, [locale])

  useEffect(() => {
    try {
      window.localStorage.setItem(MODE_STORAGE_KEY, nightMode ? "night" : "day")
    } catch {}
  }, [nightMode])

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 60)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!langOpen) {
      return
    }

    const onPointerDown = (event: MouseEvent) => {
      if (langSwitchRef.current && !langSwitchRef.current.contains(event.target as Node)) {
        setLangOpen(false)
      }
    }

    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [langOpen])

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileNavOpen])

  useEffect(() => {
    const localVideo = localVideoRef.current
    if (!localVideo) {
      return
    }

    const prepareVideo = () => {
      localVideo.muted = true
      localVideo.defaultMuted = true
      localVideo.loop = true
      localVideo.playsInline = true
      localVideo.defaultPlaybackRate = 1
      localVideo.playbackRate = 1
      try {
        localVideo.volume = 0
      } catch {}
      localVideo.setAttribute("muted", "")
      localVideo.setAttribute("autoplay", "")
      localVideo.setAttribute("playsinline", "")
      localVideo.setAttribute("webkit-playsinline", "true")
      localVideo.setAttribute("x-webkit-airplay", "deny")
    }

    const markReady = () => {
      if (localVideo.readyState >= 2) {
        setVideoReady(true)
        if (!paused && localVideo.paused) {
          attemptPlay(localVideo)
        }
      }
    }

    const markPlaying = () => {
      if (localVideo.currentTime > 0.04 || !localVideo.paused) {
        setVideoReady(true)
        setLocalPlaying(true)
      }
    }

    const tryStart = (shouldReload = false) => {
      if (paused) {
        return
      }
      prepareVideo()
      if (shouldReload && localVideo.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        localVideo.load()
      }
      markReady()
      const maybePromise = localVideo.play()
      if (maybePromise && typeof maybePromise.catch === "function") {
        maybePromise.catch(() => {
          setLocalPlaying(false)
        })
      }
    }

    const onLoadedMetadata = () => markReady()
    const onLoadedData = () => markReady()
    const onCanPlay = () => markReady()
    const onCanPlayThrough = () => markReady()
    const onPlaying = () => markPlaying()
    const onPlay = () => markPlaying()
    const onTimeUpdate = () => markPlaying()
    const onPause = () => {
      if (!paused) {
        setLocalPlaying(false)
      }
    }
    const onSuspend = () => tryStart()
    const onEmptied = () => tryStart(true)
    const onWaiting = () => {
      if (!paused) {
        setLocalPlaying(false)
      }
    }

    prepareVideo()
    markReady()
    if (localVideo.networkState === HTMLMediaElement.NETWORK_EMPTY) {
      localVideo.load()
    }

    localVideo.addEventListener("loadedmetadata", onLoadedMetadata)
    localVideo.addEventListener("loadeddata", onLoadedData)
    localVideo.addEventListener("canplay", onCanPlay)
    localVideo.addEventListener("canplaythrough", onCanPlayThrough)
    localVideo.addEventListener("play", onPlay)
    localVideo.addEventListener("playing", onPlaying)
    localVideo.addEventListener("timeupdate", onTimeUpdate)
    localVideo.addEventListener("pause", onPause)
    localVideo.addEventListener("waiting", onWaiting)
    localVideo.addEventListener("suspend", onSuspend)
    localVideo.addEventListener("emptied", onEmptied)

    const retryTimers = [
      window.setTimeout(() => tryStart(), 120),
      window.setTimeout(() => tryStart(), 480),
      window.setTimeout(() => tryStart(true), 1400),
      window.setTimeout(() => tryStart(true), 2600),
    ]
    const retryInterval = window.setInterval(() => {
      if (!paused && (localVideo.paused || localVideo.readyState < 2)) {
        tryStart(true)
      }
    }, 2200)

    const resumeIfNeeded = () => {
      if (document.visibilityState === "hidden" || paused) {
        return
      }
      tryStart()
    }

    const kickstartFromInteraction = () => {
      if (paused) {
        return
      }
      tryStart()
    }

    document.addEventListener("visibilitychange", resumeIfNeeded)
    window.addEventListener("pageshow", resumeIfNeeded)
    window.addEventListener("focus", resumeIfNeeded)
    window.addEventListener("pointerdown", kickstartFromInteraction, { passive: true })
    window.addEventListener("touchstart", kickstartFromInteraction, { passive: true })
    window.addEventListener("keydown", kickstartFromInteraction)

    return () => {
      retryTimers.forEach((timerId) => window.clearTimeout(timerId))
      window.clearInterval(retryInterval)
      localVideo.removeEventListener("loadedmetadata", onLoadedMetadata)
      localVideo.removeEventListener("loadeddata", onLoadedData)
      localVideo.removeEventListener("canplay", onCanPlay)
      localVideo.removeEventListener("canplaythrough", onCanPlayThrough)
      localVideo.removeEventListener("play", onPlay)
      localVideo.removeEventListener("playing", onPlaying)
      localVideo.removeEventListener("timeupdate", onTimeUpdate)
      localVideo.removeEventListener("pause", onPause)
      localVideo.removeEventListener("waiting", onWaiting)
      localVideo.removeEventListener("suspend", onSuspend)
      localVideo.removeEventListener("emptied", onEmptied)
      document.removeEventListener("visibilitychange", resumeIfNeeded)
      window.removeEventListener("pageshow", resumeIfNeeded)
      window.removeEventListener("focus", resumeIfNeeded)
      window.removeEventListener("pointerdown", kickstartFromInteraction)
      window.removeEventListener("touchstart", kickstartFromInteraction)
      window.removeEventListener("keydown", kickstartFromInteraction)
    }
  }, [paused])

  useEffect(() => {
    const localVideo = localVideoRef.current

    if (paused) {
      localVideo?.pause()
      return
    }

    attemptPlay(localVideo)
  }, [paused])

  const navigateToLocale = (nextLocale: Locale) => {
    setLangOpen(false)
    setMobileNavOpen(false)
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, nextLocale)
    } catch {}
    router.push(getBreadPath(nextLocale))
  }

  const navItems = [
    { href: getSectionHref(locale, "place"), label: copy.mill },
    { href: getSectionHref(locale, "studio"), label: copy.studio },
    { href: getSectionHref(locale, "equipment"), label: copy.equipment },
    { href: getSectionHref(locale, "residency"), label: copy.accommodation },
    { href: getSectionHref(locale, "location"), label: copy.location },
    { href: getHistoryPath(locale), label: copy.history },
    { href: getSectionHref(locale, "contact"), label: copy.contact },
  ]

  return (
    <main
      className={cx(
        styles.breadPage,
        manrope.className,
        nightMode && styles.nightMode,
        videoReady && styles.videoReady,
        localPlaying && styles.localPlaying,
      )}
    >
      <div className={styles.bgShell} aria-hidden="true">
        <div className={styles.bgPoster} />
        <video
          ref={localVideoRef}
          className={styles.bgLocalVideo}
          src={LOCAL_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={LOCAL_VIDEO_POSTER}
          x-webkit-airplay="deny"
          disablePictureInPicture
          disableRemotePlayback
        />
        <div className={styles.bgOverlay} />
      </div>

      <nav className={cx(styles.nav, navScrolled && styles.navScrolled)}>
        <Link href={getLocaleHomePath(locale)} className={cx(styles.navLogo, cormorant.className)}>
          Mlýn <em>na Pile</em>
        </Link>

        <ul className={styles.navLinks}>
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>

        <div className={styles.navActions}>
          <button
            className={cx(styles.btnPause, paused && styles.btnPauseOn)}
            type="button"
            aria-pressed={paused}
            aria-label={paused ? copy.resume : copy.pause}
            title={paused ? copy.resume : copy.pause}
            onClick={() => setPaused((current) => !current)}
          >
            <span className={styles.pauseIcon} aria-hidden="true">
              {paused ? "▶" : "II"}
            </span>
          </button>

          <button
            className={cx(styles.btnMode, nightMode && styles.btnModeOn)}
            type="button"
            aria-pressed={nightMode}
            aria-label={nightMode ? copy.switchToDay : copy.switchToNight}
            title={nightMode ? copy.switchToDay : copy.switchToNight}
            onClick={() => setNightMode((current) => !current)}
          >
            {!nightMode ? (
              <span className={styles.modeIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4.2" />
                  <path d="M12 2.5v3" />
                  <path d="M12 18.5v3" />
                  <path d="M2.5 12h3" />
                  <path d="M18.5 12h3" />
                  <path d="M5.2 5.2l2.1 2.1" />
                  <path d="M16.7 16.7l2.1 2.1" />
                  <path d="M18.8 5.2l-2.1 2.1" />
                  <path d="M7.3 16.7l-2.1 2.1" />
                </svg>
              </span>
            ) : (
              <span className={styles.modeIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a7 7 0 1 0 9.7 9.7Z" />
                  <path fill="currentColor" d="M18.3 4.2l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" />
                </svg>
              </span>
            )}
          </button>

          <div
            ref={langSwitchRef}
            className={cx(styles.langSwitch, langOpen && styles.langSwitchOpen)}
          >
            <button
              className={styles.btnLang}
              type="button"
              aria-label={copy.selectLanguage}
              aria-haspopup="true"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((current) => !current)}
            >
              <span className={styles.langIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18" />
                  <path d="M12 3a14 14 0 0 1 0 18" />
                  <path d="M12 3a14 14 0 0 0 0 18" />
                </svg>
              </span>
              <span className={styles.langCaret} aria-hidden="true">
                ▾
              </span>
            </button>
            <div className={styles.langMenu} role="menu" aria-label={copy.selectLanguage}>
              {(["cs", "en", "de"] as const).map((itemLocale) => (
                <button
                  key={itemLocale}
                  type="button"
                  className={cx(styles.langOption, locale === itemLocale && styles.langOptionActive)}
                  role="menuitem"
                  onClick={() => navigateToLocale(itemLocale)}
                >
                  {localeNames[itemLocale]}
                </button>
              ))}
            </div>
          </div>

          <button
            className={styles.hamburger}
            type="button"
            aria-label={copy.menu}
            onClick={() => setMobileNavOpen(true)}
          >
            <span className={styles.hamburgerLabel}>{copy.menu.toUpperCase()}</span>
          </button>
        </div>
      </nav>

      <div className={cx(styles.mobileNav, mobileNavOpen && styles.mobileNavOpen)}>
        <button className={styles.closeNav} type="button" onClick={() => setMobileNavOpen(false)}>
          {copy.close}
        </button>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cormorant.className}
            onClick={() => setMobileNavOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.secLabel}>{copy.label}</span>
          <h1 className={cx(styles.heroTitle, cormorant.className)}>
            {copy.titleTop}
            <br />
            <em>{copy.titleAccent}</em>
          </h1>

          <article className={styles.storyCard}>
            <div className={styles.introCopy}>
              <p>{copy.intro1}</p>
              <p>{copy.intro2}</p>
            </div>

            <section className={styles.breadSection}>
              <h2 className={cx(styles.breadHeading, cormorant.className)}>{copy.craftTitle}</h2>
              <ul className={styles.breadList}>
                {copy.benefits.map((item) => (
                  <li key={item} className={styles.breadItem}>
                    <span className={styles.breadIcon} aria-hidden="true">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.ingredientsSection}>
              <ul className={styles.breadList}>
                {copy.ingredients.map((item) => (
                  <li
                    key={item.text}
                    className={cx(styles.breadItem, item.kind === "no" && styles.breadItemNo)}
                  >
                    <span
                      className={cx(styles.breadIcon, item.kind === "no" && styles.breadIconNo)}
                      aria-hidden="true"
                    >
                      {item.kind === "no" ? "✕" : "✓"}
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className={styles.faqBlock}>
              <div className={styles.faqHeader}>
                <span className={styles.faqSubtitle}>{copy.faqSubtitle}</span>
              </div>
              <div className={styles.faqList}>
                {copy.details.map((detail, index) => (
                  <div key={detail.title} className={styles.faqItem}>
                    <button
                      type="button"
                      className={styles.faqButton}
                      onClick={() => setOpenDetailIndex(openDetailIndex === index ? null : index)}
                    >
                      <span className={styles.faqQuestion}>{detail.title}</span>
                      <ChevronDown
                        className={cx(styles.faqChevron, openDetailIndex === index && styles.faqChevronOpen)}
                      />
                    </button>
                    {openDetailIndex === index ? (
                      <p className={styles.faqAnswer}>
                        {detail.body}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.ctaRow}>
              <a href={getSectionHref(locale, "residency")} className={styles.btnSecondary}>
                {copy.backToPackages}
              </a>
              <a href={getSectionHref(locale, "contact")} className={styles.btnPrimary}>
                {copy.contactCta}
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
