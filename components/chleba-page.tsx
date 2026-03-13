"use client"

import { Cormorant_Garamond, Manrope } from "next/font/google"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
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
      "Součástí každého pobytu i nahrávání je snídaně nebo brunch. Pečeme k nim vlastní kváskový chleba, vždy čerstvý, ve velké venkovní peci. Pečeme zde také pizzu ;-)",
    intro2:
      "Pečeme jak kváskový tak i klasický chleba, vždy jen z prvotřídních surovin. Vzhledem k pozitivnímu ohlasu nakonec plánujeme dodávat i mimo studio... ;)",
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
      "Breakfast or brunch is part of every stay and recording session. We bake our own sourdough bread for it, always fresh, in the large outdoor oven. It is the same place where the fire can be lit for pizza in the evening and the whole mill gains another layer of atmosphere that naturally belongs to it.",
    intro2:
      "It is not decoration or a side detail. It is part of a place that works differently from ordinary studios: recording, calm, nature, warmth from the oven, and things that keep their own rhythm.",
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
      "Zu jedem Aufenthalt und jeder Recording-Session gehört ein Frühstück oder Brunch. Dafür backen wir unser eigenes Sauerteigbrot, immer frisch, im großen Außenofen. Dort kann abends auch das Feuer für Pizza entfacht werden und die ganze Mühle bekommt noch eine weitere Atmosphäre-Ebene, die einfach zu ihr gehört.",
    intro2:
      "Es ist keine Dekoration und kein Nebendetail. Es ist Teil eines Ortes, der anders funktioniert als gewöhnliche Studios: Recording, Ruhe, Natur, Wärme aus dem Ofen und Dinge, die ihren eigenen Rhythmus haben.",
    backToPackages: "Zurück ins Studio",
    contactCta: "Kontakt",
  },
}

const localeNames: Record<Locale, string> = {
  cs: "Čeština",
  en: "English",
  de: "Deutsch",
}

function getLocaleBase(locale: Locale) {
  return locale === "cs" ? "/" : `/${locale}`
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
  return `${getLocaleBase(locale)}#${sectionId}`
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
    ]

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
        <Link href={getLocaleBase(locale)} className={cx(styles.navLogo, cormorant.className)}>
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
        <div className={styles.heroCopy}>
          <span className={styles.secLabel}>{copy.label}</span>
          <h1 className={cx(styles.heroTitle, cormorant.className)}>
            {copy.titleTop}
            <br />
            <em>{copy.titleAccent}</em>
          </h1>

          <article className={styles.textCard}>
            <p>{copy.intro1}</p>
            <p>{copy.intro2}</p>
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
