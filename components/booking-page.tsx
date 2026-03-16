"use client"

import { Cormorant_Garamond, Manrope } from "next/font/google"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "@/components/booking-page.module.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
})

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

const MODE_STORAGE_KEY = "mlyn_mode"
const LANG_STORAGE_KEY = "mlyn_lang"

type Locale = "cs" | "en" | "de"

type BookingTerm = {
  range: string
  state: string
  booked?: boolean
}

type BookingMonth = {
  month: string
  status: string
  terms: BookingTerm[]
  booked?: boolean
}

type Copy = {
  mill: string
  studio: string
  equipment: string
  accommodation: string
  location: string
  history: string
  contact: string
  booking: string
  pause: string
  resume: string
  switchToNight: string
  switchToDay: string
  selectLanguage: string
  menu: string
  close: string
  eyebrow: string
  titleTop: string
  titleAccent: string
  intro1: string
  intro2: string
  monthsLabel: string
  note: string
  emailCta: string
  backCta: string
  months: BookingMonth[]
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
    booking: "Booking",
    pause: "Pauza",
    resume: "Přehrát",
    switchToNight: "Přepnout na noční režim",
    switchToDay: "Přepnout na denní režim",
    selectLanguage: "Vybrat jazyk",
    menu: "Menu",
    close: "Zavřít",
    eyebrow: "Rezervace",
    titleTop: "Termíny od",
    titleAccent: "dubna 2026",
    intro1:
      "Na studiu stále pracujeme a ladíme poslední detaily. Ceník i plné spuštění rezervací budou brzy k dispozici, ale přehled termínů už můžeš sledovat tady.",
    intro2:
      "Pokud máš zájem o pobyt nebo nahrávání, napiš nám na mlynnapile@gmail.com. Ozveme se zpět a doladíme termín i podobu pobytu.",
    monthsLabel: "Přehled termínů",
    note: "Termíny budeme průběžně doplňovat. Obsazené bloky zůstávají označené přímo v přehledu, ostatní měsíce se budou postupně otevírat.",
    emailCta: "Napsat na mlynnapile@gmail.com",
    backCta: "Zpět na mlýn",
    months: [
      {
        month: "Duben 2026",
        status: "Částečně obsazeno",
        booked: true,
        terms: [
          { range: "17–20. 4. 2026", state: "Obsazeno", booked: true },
          { range: "Další termíny", state: "Budou zveřejněny brzy." },
        ],
      },
      { month: "Květen 2026", status: "Brzy", terms: [{ range: "Termíny", state: "Rezervace budou otevřeny brzy." }] },
      { month: "Červen 2026", status: "Brzy", terms: [{ range: "Termíny", state: "Rezervace budou otevřeny brzy." }] },
      { month: "Červenec 2026", status: "Brzy", terms: [{ range: "Termíny", state: "Rezervace budou otevřeny brzy." }] },
      { month: "Srpen 2026", status: "Brzy", terms: [{ range: "Termíny", state: "Rezervace budou otevřeny brzy." }] },
      { month: "Září 2026", status: "Brzy", terms: [{ range: "Termíny", state: "Rezervace budou otevřeny brzy." }] },
      { month: "Říjen 2026", status: "Brzy", terms: [{ range: "Termíny", state: "Rezervace budou otevřeny brzy." }] },
      { month: "Listopad 2026", status: "Brzy", terms: [{ range: "Termíny", state: "Rezervace budou otevřeny brzy." }] },
      { month: "Prosinec 2026", status: "Brzy", terms: [{ range: "Termíny", state: "Rezervace budou otevřeny brzy." }] },
    ],
  },
  en: {
    mill: "The Mill",
    studio: "Studio",
    equipment: "Equipment",
    accommodation: "Accommodation",
    location: "Location",
    history: "History",
    contact: "Contact",
    booking: "Booking",
    pause: "Pause",
    resume: "Play",
    switchToNight: "Switch to night mode",
    switchToDay: "Switch to day mode",
    selectLanguage: "Select language",
    menu: "Menu",
    close: "Close",
    eyebrow: "Booking",
    titleTop: "Dates from",
    titleAccent: "April 2026",
    intro1:
      "We are still refining the final details of the studio. Pricing and full booking launch will be available soon, but you can already follow the current date overview here.",
    intro2:
      "If you are interested in a stay or recording session, write to us at mlynnapile@gmail.com. We will get back to you and arrange the right date and format.",
    monthsLabel: "Date overview",
    note: "We will add more dates continuously. Occupied blocks stay marked directly in the overview, while other months will open gradually.",
    emailCta: "Write to mlynnapile@gmail.com",
    backCta: "Back to the mill",
    months: [
      {
        month: "April 2026",
        status: "Partly booked",
        booked: true,
        terms: [
          { range: "17–20 Apr 2026", state: "Booked", booked: true },
          { range: "Other dates", state: "Will be published soon." },
        ],
      },
      { month: "May 2026", status: "Soon", terms: [{ range: "Dates", state: "Booking will open soon." }] },
      { month: "June 2026", status: "Soon", terms: [{ range: "Dates", state: "Booking will open soon." }] },
      { month: "July 2026", status: "Soon", terms: [{ range: "Dates", state: "Booking will open soon." }] },
      { month: "August 2026", status: "Soon", terms: [{ range: "Dates", state: "Booking will open soon." }] },
      { month: "September 2026", status: "Soon", terms: [{ range: "Dates", state: "Booking will open soon." }] },
      { month: "October 2026", status: "Soon", terms: [{ range: "Dates", state: "Booking will open soon." }] },
      { month: "November 2026", status: "Soon", terms: [{ range: "Dates", state: "Booking will open soon." }] },
      { month: "December 2026", status: "Soon", terms: [{ range: "Dates", state: "Booking will open soon." }] },
    ],
  },
  de: {
    mill: "Mühle",
    studio: "Studio",
    equipment: "Ausstattung",
    accommodation: "Unterkunft",
    location: "Lage",
    history: "Geschichte",
    contact: "Kontakt",
    booking: "Booking",
    pause: "Pause",
    resume: "Abspielen",
    switchToNight: "Zum Nachtmodus wechseln",
    switchToDay: "Zum Tagmodus wechseln",
    selectLanguage: "Sprache wählen",
    menu: "Menü",
    close: "Schließen",
    eyebrow: "Booking",
    titleTop: "Termine ab",
    titleAccent: "April 2026",
    intro1:
      "Wir arbeiten noch an den letzten Details des Studios. Preise und der vollständige Start der Reservierungen folgen bald, aber die aktuelle Terminübersicht kannst du hier schon sehen.",
    intro2:
      "Wenn du Interesse an einem Aufenthalt oder einer Recording-Session hast, schreib uns an mlynnapile@gmail.com. Wir melden uns zurück und stimmen Termin und Format mit dir ab.",
    monthsLabel: "Terminübersicht",
    note: "Weitere Termine werden laufend ergänzt. Bereits belegte Blöcke bleiben direkt in der Übersicht markiert, andere Monate werden schrittweise geöffnet.",
    emailCta: "An mlynnapile@gmail.com schreiben",
    backCta: "Zurück zur Mühle",
    months: [
      {
        month: "April 2026",
        status: "Teilweise belegt",
        booked: true,
        terms: [
          { range: "17.–20. 4. 2026", state: "Belegt", booked: true },
          { range: "Weitere Termine", state: "Werden bald veröffentlicht." },
        ],
      },
      { month: "Mai 2026", status: "Bald", terms: [{ range: "Termine", state: "Die Reservierung wird bald geöffnet." }] },
      { month: "Juni 2026", status: "Bald", terms: [{ range: "Termine", state: "Die Reservierung wird bald geöffnet." }] },
      { month: "Juli 2026", status: "Bald", terms: [{ range: "Termine", state: "Die Reservierung wird bald geöffnet." }] },
      { month: "August 2026", status: "Bald", terms: [{ range: "Termine", state: "Die Reservierung wird bald geöffnet." }] },
      { month: "September 2026", status: "Bald", terms: [{ range: "Termine", state: "Die Reservierung wird bald geöffnet." }] },
      { month: "Oktober 2026", status: "Bald", terms: [{ range: "Termine", state: "Die Reservierung wird bald geöffnet." }] },
      { month: "November 2026", status: "Bald", terms: [{ range: "Termine", state: "Die Reservierung wird bald geöffnet." }] },
      { month: "Dezember 2026", status: "Bald", terms: [{ range: "Termine", state: "Die Reservierung wird bald geöffnet." }] },
    ],
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

function getBookingPath(locale: Locale) {
  if (locale === "cs") return "/booking"
  if (locale === "en") return "/en/booking"
  return "/de/buchung"
}

function getHistoryPath(locale: Locale) {
  if (locale === "cs") return "/historie"
  if (locale === "en") return "/en/history"
  return "/de/geschichte"
}

function getSectionHref(locale: Locale, sectionId: string) {
  return `${getLocaleBase(locale)}#${sectionId}`
}

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ")
}

export default function BookingPage({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale]
  const router = useRouter()
  const langSwitchRef = useRef<HTMLDivElement | null>(null)
  const [navScrolled, setNavScrolled] = useState(false)
  const [paused, setPaused] = useState(false)
  const [nightMode, setNightMode] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

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
    const onScroll = () => setNavScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!langOpen) return
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

  const pauseLabel = paused ? copy.resume : copy.pause
  const modeLabel = nightMode ? copy.switchToDay : copy.switchToNight

  const switchLanguage = (nextLocale: Locale) => {
    setLangOpen(false)
    setMobileNavOpen(false)
    router.push(getBookingPath(nextLocale))
  }

  return (
    <div className={cx(styles.bookingPage, manrope.className, nightMode && styles.nightMode)}>
      <div className={styles.bgShell} aria-hidden="true">
        <div className={styles.bgPoster} />
        <div className={styles.bgOverlay} />
      </div>

      <nav className={cx(styles.nav, navScrolled && styles.navScrolled)}>
        <Link href={getLocaleBase(locale)} className={cx(styles.navLogo, cormorant.className)}>
          Mlýn <em>na Pile</em>
        </Link>

        <ul className={styles.navLinks}>
          <li><Link href={getSectionHref(locale, "hero")}>{copy.mill}</Link></li>
          <li><Link href={getSectionHref(locale, "studio")}>{copy.studio}</Link></li>
          <li><Link href={getSectionHref(locale, "equipment")}>{copy.equipment}</Link></li>
          <li><Link href={getSectionHref(locale, "residency")}>{copy.accommodation}</Link></li>
          <li><Link href={getSectionHref(locale, "location")}>{copy.location}</Link></li>
          <li><Link href={getHistoryPath(locale)}>{copy.history}</Link></li>
          <li><Link href={getSectionHref(locale, "contact")}>{copy.contact}</Link></li>
        </ul>

        <div className={styles.navActions}>
          <button
            type="button"
            className={cx(styles.btnPause, paused && styles.btnPauseOn)}
            aria-pressed={paused}
            aria-label={pauseLabel}
            title={pauseLabel}
            onClick={() => setPaused((current) => !current)}
          >
            <span className={styles.pauseIcon}>{paused ? "▶" : "II"}</span>
          </button>
          <button
            type="button"
            className={cx(styles.btnMode, nightMode && styles.btnModeOn)}
            aria-pressed={nightMode}
            aria-label={modeLabel}
            title={modeLabel}
            onClick={() => setNightMode((current) => !current)}
          >
            <span className={styles.modeIcon} aria-hidden="true">
              {nightMode ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="4.4" />
                  <path d="M12 2.8v2.3M12 18.9v2.3M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.8 12h2.3M18.9 12h2.3M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
                </svg>
              )}
            </span>
          </button>

          <div ref={langSwitchRef} className={cx(styles.langSwitch, langOpen && styles.langSwitchOpen)}>
            <button
              type="button"
              className={styles.btnLang}
              aria-expanded={langOpen}
              aria-haspopup="menu"
              aria-label={copy.selectLanguage}
              title={copy.selectLanguage}
              onClick={() => setLangOpen((current) => !current)}
            >
              <span className={styles.langIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 12h18" />
                  <path d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9Z" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </span>
              <span className={styles.langCaret} aria-hidden="true">▾</span>
            </button>
            <div className={styles.langMenu} role="menu">
              {(["cs", "en", "de"] as Locale[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={cx(styles.langOption, option === locale && styles.langOptionActive)}
                  role="menuitemradio"
                  aria-checked={option === locale}
                  onClick={() => switchLanguage(option)}
                >
                  {localeNames[option]}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className={styles.hamburger} onClick={() => setMobileNavOpen(true)}>
            <span className={styles.hamburgerLabel}>{copy.menu}</span>
          </button>
        </div>
      </nav>

      <div className={cx(styles.mobileNav, mobileNavOpen && styles.mobileNavOpen)}>
        <button type="button" className={styles.closeNav} onClick={() => setMobileNavOpen(false)}>
          {copy.close}
        </button>
        <Link href={getSectionHref(locale, "hero")} onClick={() => setMobileNavOpen(false)}>{copy.mill}</Link>
        <Link href={getSectionHref(locale, "studio")} onClick={() => setMobileNavOpen(false)}>{copy.studio}</Link>
        <Link href={getSectionHref(locale, "equipment")} onClick={() => setMobileNavOpen(false)}>{copy.equipment}</Link>
        <Link href={getSectionHref(locale, "residency")} onClick={() => setMobileNavOpen(false)}>{copy.accommodation}</Link>
        <Link href={getSectionHref(locale, "location")} onClick={() => setMobileNavOpen(false)}>{copy.location}</Link>
        <Link href={getHistoryPath(locale)} onClick={() => setMobileNavOpen(false)}>{copy.history}</Link>
        <Link href={getSectionHref(locale, "contact")} onClick={() => setMobileNavOpen(false)}>{copy.contact}</Link>
      </div>

      <main className={styles.pageShell}>
        <section className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>{copy.eyebrow}</span>
            <h1 className={cx(styles.title, cormorant.className)}>
              {copy.titleTop} <em>{copy.titleAccent}</em>
            </h1>
          </div>

          <div className={styles.leadCard}>
            <p>{copy.intro1}</p>
            <p>{copy.intro2}</p>
            <div className={styles.ctaRow}>
              <a href="mailto:mlynnapile@gmail.com" className={styles.btnPrimary}>
                {copy.emailCta}
              </a>
              <Link href={getLocaleBase(locale)} className={styles.btnSecondary}>
                {copy.backCta}
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.monthsSection}>
          <span className={styles.sectionLabel}>{copy.monthsLabel}</span>
          <div className={styles.monthsGrid}>
            {copy.months.map((month) => (
              <article key={month.month} className={styles.monthCard}>
                <div className={styles.monthHead}>
                  <h2 className={cx(styles.monthTitle, cormorant.className)}>{month.month}</h2>
                  <span className={cx(styles.status, month.booked ? styles.statusBooked : styles.statusSoon)}>
                    {month.status}
                  </span>
                </div>

                <ul className={styles.termList}>
                  {month.terms.map((term) => (
                    <li key={`${month.month}-${term.range}`} className={styles.termItem}>
                      <span className={styles.termRange}>{term.range}</span>
                      <span className={cx(styles.termState, term.booked && styles.termStateBooked)}>{term.state}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className={styles.noteCard}>
            <p>{copy.note}</p>
          </div>
        </section>
      </main>
    </div>
  )
}
