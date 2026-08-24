"use client"

import { Cormorant_Garamond, Manrope } from "next/font/google"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import styles from "@/components/booking-page.module.css"
import PageBgLayer from "@/components/page-bg-layer"
import { useLiveBgConfig } from "@/lib/use-live-bg"

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

const EMAIL = "mlynnapile@gmail.com"
// Kalendář se roluje: začíná vždy aktuálním měsícem a pokračuje 12 měsíců dopředu.
const TOTAL = 12
const CALENDAR_START = new Date()
const START_Y = CALENDAR_START.getFullYear()
const START_M = CALENDAR_START.getMonth()
const BOOKING_VIDEO_PLAYBACK_RATE = 0.42
const VIDEOS_BY_MONTH = [
  "12wlur-ij3A", // leden
  null, // únor
  null, // březen
  "8ao2RN8xswo", // duben
  "kgqpTmzPMa4", // květen
  null, // červen
  null, // červenec
  null, // srpen
  "9oQ3JNjBwbo", // září
  "Wnn7LyRPdyE", // říjen
  null, // listopad
  null, // prosinec
] as const

const GRADIENTS_BY_MONTH = [
  "linear-gradient(150deg, rgba(15,18,24,0.95) 0%, rgba(49,57,78,0.8) 42%, rgba(140,151,187,0.46) 100%)", // leden
  "linear-gradient(150deg, rgba(25,21,20,0.95) 0%, rgba(75,58,52,0.82) 42%, rgba(170,144,120,0.52) 100%)", // únor
  "linear-gradient(150deg, rgba(20,20,18,0.95) 0%, rgba(63,60,47,0.8) 42%, rgba(161,152,108,0.5) 100%)", // březen
  "linear-gradient(160deg, rgba(34,31,28,0.9) 0%, rgba(98,76,45,0.84) 34%, rgba(162,129,76,0.54) 100%)", // duben
  "linear-gradient(155deg, rgba(20,27,34,0.92) 0%, rgba(52,76,82,0.78) 40%, rgba(138,150,130,0.56) 100%)", // květen
  "linear-gradient(150deg, rgba(25,19,26,0.94) 0%, rgba(88,63,84,0.76) 42%, rgba(167,128,112,0.5) 100%)", // červen
  "linear-gradient(150deg, rgba(24,33,26,0.94) 0%, rgba(55,82,63,0.78) 40%, rgba(149,142,101,0.48) 100%)", // červenec
  "linear-gradient(155deg, rgba(23,27,38,0.94) 0%, rgba(61,75,112,0.76) 42%, rgba(168,146,115,0.52) 100%)", // srpen
  "linear-gradient(150deg, rgba(26,20,19,0.95) 0%, rgba(88,55,43,0.8) 40%, rgba(177,121,78,0.5) 100%)", // září
  "linear-gradient(145deg, rgba(22,24,28,0.94) 0%, rgba(72,72,82,0.74) 42%, rgba(172,144,102,0.52) 100%)", // říjen
  "linear-gradient(150deg, rgba(17,24,31,0.95) 0%, rgba(44,62,74,0.78) 38%, rgba(118,134,119,0.48) 100%)", // listopad
  "linear-gradient(145deg, rgba(18,16,25,0.95) 0%, rgba(50,40,72,0.78) 42%, rgba(151,125,105,0.5) 100%)", // prosinec
] as const

// klíč = "rok-měsíc" (měsíc 0 = leden), rozsahy jsou včetně krajních dnů
const BOOKED_RANGES: Record<string, Array<{ start: number; end: number }>> = {
  "2026-3": [{ start: 17, end: 20 }], // duben 2026
  "2026-6": [{ start: 3, end: 3 }], // červenec 2026
  "2026-7": [ // srpen 2026
    { start: 7, end: 8 },
    { start: 21, end: 21 },
  ],
  "2026-9": [ // říjen 2026
    { start: 2, end: 2 },
    { start: 9, end: 9 },
    { start: 16, end: 16 },
    { start: 23, end: 23 },
    { start: 30, end: 31 },
  ],
  "2026-10": [ // listopad 2026
    { start: 13, end: 13 },
    { start: 21, end: 21 },
  ],
  "2026-11": [ // prosinec 2026
    { start: 4, end: 4 },
    { start: 11, end: 11 },
  ],
}

type Locale = "cs" | "en" | "de"

type Copy = {
  brandMill: string
  brandAt: string
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
  pickTerm: string
  intro1: string
  intro2: string
  monthCounter: string
  monthLabel: string
  previous: string
  next: string
  selectionHint: string
  bookedHint: string
  modalTitle: string
  openInEmail: string
  closeDialog: string
  selectedDates: string
  nightsLabel: (nights: number) => string
  emailSubject: (arrival: string, departure: string) => string
  emailBody: (arrival: string, departure: string, nightsLabel: string) => string
  footerLine: string
  weekdays: string[]
}

type CalendarMonth = {
  index: number
  date: Date
  year: number
  month: number
  title: string
  shortTitle: string
  ghostTitle: string
  gradient: string
  youtubeId: string | null
  localVideoSrc: string | null
  localPosterSrc: string | null
  blockedRanges: Array<{ start: number; end: number }>
  weeks: Array<Array<number | null>>
}

const LOCAL_MEDIA_BY_MONTH: Partial<Record<number, { src: string; poster: string }>> = {
  5: { // červen
    src: "/videos/bg/VDj9aKHnpcw_hq.mp4",
    poster: "/videos/bg/VDj9aKHnpcw_hq.jpg",
  },
  6: { // červenec
    src: "/videos/bg/MczOR3DstPg.mp4",
    poster: "/videos/bg/MczOR3DstPg.jpg",
  },
  7: { // srpen
    src: "/videos/bg/O431B93W9UY.mp4",
    poster: "/videos/bg/O431B93W9UY.jpg",
  },
  8: { // září
    src: "/videos/bg/CJzYKr3JWC8.mp4",
    poster: "/videos/bg/CJzYKr3JWC8.jpg",
  },
  9: { // říjen
    src: "/videos/bg/DY09nnytbjc.mp4",
    poster: "/videos/bg/DY09nnytbjc.jpg",
  },
  10: { // listopad
    src: "/videos/bg/QsHqEEj4-60.mp4",
    poster: "/videos/bg/QsHqEEj4-60.jpg",
  },
  11: { // prosinec
    src: "/videos/bg/M4QkWhz7CDo.mp4",
    poster: "/videos/bg/M4QkWhz7CDo.jpg",
  },
  0: { // leden
    src: "/videos/bg/12wlur-ij3A.mp4",
    poster: "/videos/bg/12wlur-ij3A.jpg",
  },
  1: { // únor
    src: "/videos/bg/gTqXu9xU_7k.mp4",
    poster: "/videos/bg/gTqXu9xU_7k.jpg",
  },
  2: { // březen
    src: "/videos/bg/tWtT7cB1Tus.mp4",
    poster: "/videos/bg/tWtT7cB1Tus.jpg",
  },
}

type SelectionState = {
  arrivalMonthIndex: number | null
  arrivalDay: number | null
  departureMonthIndex: number | null
  departureDay: number | null
}

type MonthEvent = {
  text: string
  days?: number[]
  range?: [number, number]
}

type MonthGuide = {
  monthTitle: string
  events: MonthEvent[]
  tips: string[]
  note?: string
}

const MONTH_GUIDES_CS: Record<number, MonthGuide> = {
  0: {
    monthTitle: "Leden",
    events: [
      { text: "LA Cham, Německo (20 min) — pravidelné live koncerty každý týden, rock/metal/punk · la-cham.de" },
    ],
    tips: [
      "Bavorský les (do 30 min) — zimní turistika a běžecké trasy na německé straně hranice.",
      "Bad Kötzting (25 min, DE) — wellness a sauny.",
      "Pivovar Domažlice (8 min) — ochutnávka místního piva v centru města.",
    ],
  },
  1: {
    monthTitle: "Únor",
    events: [
      { text: "23. 2. · Pódium mladých talentů · MKS Domažlice (8 min) · přehlídka mladých hudebníků ze ZUŠ", days: [23] },
      { text: "25. 2. · Cestopisná přednáška: Norsko · MKS Domažlice · diashow, fjordy, severská příroda", days: [25] },
      { text: "LA Cham (20 min) — pravidelné live koncerty každý týden" },
    ],
    tips: [
      "Bad Kötzting (25 min, DE) — wellness a sauny.",
      "Kino Čakan Domažlice (8 min) — pravidelný program.",
      "Bavorský les — zimní výlety a běžecké stopy.",
    ],
  },
  2: {
    monthTitle: "Březen",
    events: [
      { text: "LA Cham (20 min) — pravidelné live koncerty každý týden · la-cham.de" },
    ],
    tips: [
      "Zámek Horšovský Týn (15 min) — v březnu ještě mimo sezónu, zámecký park volně přístupný.",
      "Bad Kötzting (25 min, DE) — wellness.",
      "Pivovar Domažlice (8 min) — prohlídka a degustace.",
    ],
  },
  3: {
    monthTitle: "Duben",
    events: [
      { text: "od 2. 4. · Otevření zámku Horšovský Týn (15 min) · zahájení turistické sezóny", range: [2, 30] },
      { text: "17. 4. · Pražský výběr · MKS Domažlice (8 min) · jediný koncert kapely v Plzeňském kraji v roce 2026", days: [17] },
      { text: "30. 4. · Stavění máje · náměstí Míru, Domažlice · tradiční oslava s hudbou ZUŠ", days: [30] },
      { text: "LA Cham (20 min) — pravidelné live koncerty každý týden" },
    ],
    tips: [
      "Zámek Horšovský Týn (15 min) — otevírá 2. dubna, renesanční interiéry, gotická kaple, volně přístupný zámecký park.",
      "Možnost zapůjčení kol — okolí Trhanova nabízí nádherné jarní trasy.",
      "Bavorský les (do 30 min) — první jarní túry v Nationalparku.",
    ],
  },
  4: {
    monthTitle: "Květen",
    events: [
      { text: "5. 5. · Oslavy svobody · Domažlice (8 min) · 81. výročí osvobození, konvoj historických vozidel, koncerty na náměstí", days: [5] },
      { text: "7. 5. · Neil Zaza (USA) · MKS Domažlice · kytarový virtuos, klubová scéna", days: [7] },
      { text: "LA Cham (20 min) — pravidelné live koncerty každý týden" },
    ],
    tips: [
      "Možnost zapůjčení kol — trasy podél říčky Zubřiny a do Chodského lesa.",
      "Zámek Horšovský Týn (15 min) — prohlídky v plném provozu.",
      "Koupaliště Babylon (10 min) — venkovní bazény, zahájení sezóny.",
    ],
  },
  5: {
    monthTitle: "Červen",
    events: [
      { text: "1. 6. · Město dětem · Domažlice (8 min) · rodinný festival", days: [1] },
      { text: "26. 6. · Letní koncert Rádia Blaník · náměstí Míru, Domažlice · open-air", days: [26] },
      { text: "LA Cham (20 min) — pravidelné live koncerty každý týden" },
    ],
    tips: [
      "Možnost zapůjčení kol — Chodský les, přeshraniční trasy do Bavorska.",
      "Koupaliště Babylon (10 min) — venkovní bazény.",
      "Letní kino Babylon (10 min) — promítání pod hvězdami.",
      "Bad Kötzting (25 min, DE) — koupaliště.",
    ],
  },
  6: {
    monthTitle: "Červenec",
    events: [
      { text: "od 31. 7. · Drachenstich — zahájení · Furth im Wald, DE (25 min) · nejstarší lidové divadlo v Německu, trvá do 16. 8., středověký trh, historický průvod s 1 200 účinkujícími", days: [31] },
      { text: "červenec · Divadelní léto na zámku · Horšovský Týn (15 min) · představení v zámeckém parku" },
      { text: "LA Cham (20 min) — pravidelné live koncerty, letní program Summerstage" },
    ],
    tips: [
      "Možnost zapůjčení kol — přeshraniční trasy do Německa, okolí přehrady Lučina.",
      "Koupaliště Babylon (10 min) — venkovní bazény.",
      "Letní kino Babylon — promítání pod hvězdami.",
      "Turistika Bavorský les / Nationalpark (do 30 min) — desítky tras, lanovka Großer Arber.",
    ],
  },
  7: {
    monthTitle: "Srpen",
    events: [
      { text: "do 16. 8. · Drachenstich · Furth im Wald, DE (25 min) · 12 představení, středověký trh, historický průvod", range: [1, 16] },
      { text: "14.–16. 8. · Chodské slavnosti · Domažlice (8 min) · největší folklorní festival v ČR · vstup zdarma · 600+ účinkujících", range: [14, 16] },
      { text: "LA Cham (20 min) — pravidelné live koncerty každý týden" },
    ],
    tips: [
      "Možnost zapůjčení kol — srpen je vrchol sezóny, trasy do Bavorského lesa nebo podél Zubřiny.",
      "Koupaliště Babylon (10 min) — venkovní bazény.",
      "Letní kino Babylon — promítání pod hvězdami.",
      "Zámek Horšovský Týn (15 min) — v plném provozu.",
    ],
    note: "Tip: víkend 14.–16. 8. — Chodské slavnosti i Drachenstich souběžně, za jeden výjezd obojí.",
  },
  8: {
    monthTitle: "Září",
    events: [
      { text: "LA Cham (20 min) — pravidelné live koncerty každý týden" },
    ],
    tips: [
      "Možnost zapůjčení kol — podzimní barvy v Chodském lese a Bavorském lese.",
      "Zámek Horšovský Týn (15 min) — září je ideální čas bez letních davů.",
      "Pivovar Domažlice (8 min) — ochutnávka.",
    ],
    note:
      "Poznámka: Vinobraní Domažlice a Vinný košt Horšovský Týn se tradičně konají v září — data pro 2026 zatím nepotvrzena, sledujte domazlice.eu a horsovskytyn.cz.",
  },
  9: {
    monthTitle: "Říjen",
    events: [
      { text: "LA Cham (20 min) — pravidelné live koncerty každý týden" },
    ],
    tips: [
      "Možnost zapůjčení kol — Chodský les a Bavorský les v barvách podzimu, výlety bez davů.",
      "Kino Čakan Domažlice (8 min) — podzimní program.",
      "Pivovar Domažlice (8 min) — ochutnávka.",
    ],
  },
  10: {
    monthTitle: "Listopad",
    events: [
      { text: "28. 11. · Rozsvícení vánočního stromu · náměstí Míru, Domažlice (8 min) · zahájení adventu v 16:00", days: [28] },
      { text: "LA Cham (20 min) — pravidelné live koncerty každý týden" },
    ],
    tips: [
      "Bad Kötzting (25 min, DE) — wellness a sauny.",
      "Pivovar Domažlice (8 min) — prohlídka a ochutnávka.",
      "Furth im Wald (25 min, DE) — nákupy před Vánocemi.",
    ],
  },
  11: {
    monthTitle: "Prosinec",
    events: [
      { text: "16.–23. 12. · Hudba u stromečku · Domažlice (8 min) · vánoční koncerty v rámci adventních trhů", range: [16, 23] },
      { text: "1. 1. 2027 · Novoroční ohňostroj · náměstí Míru, Domažlice" },
      { text: "LA Cham (20 min) — pravidelné live koncerty každý týden" },
    ],
    tips: [
      "Adventní trhy Domažlice (8 min) — tradiční vánoční atmosféra na náměstí Míru.",
      "Furth im Wald (25 min, DE) — vánoční nákupy přes hranici.",
      "Bavorský les — zimní túry, lyžování Großer Arber.",
      "Bad Kötzting (25 min, DE) — wellness.",
    ],
  },
}

const copyByLocale: Record<Locale, Copy> = {
  cs: {
    brandMill: "Mlýn",
    brandAt: "na Pile",
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
    eyebrow: "Retreat Studio",
    pickTerm: "Vyberte termín",
    intro1:
      "Na studiu stále pracujeme a ladíme poslední detaily. Ceník i plné spuštění rezervací budou brzy k dispozici.",
    intro2: "",
    monthCounter: "Měsíc",
    monthLabel: "Měsíc",
    previous: "Předchozí měsíc",
    next: "Další měsíc",
    selectionHint: "Vyber příjezd a odjezd přímo v kalendáři přední karty.",
    bookedHint: "Šedě označené dny jsou již obsazené.",
    modalTitle: "Vybraný termín",
    openInEmail: "Otevřít v e-mailu",
    closeDialog: "Zavřít dialog",
    selectedDates: "Termín",
    nightsLabel: (nights) => `${nights} ${nights === 1 ? "noc" : nights > 1 && nights < 5 ? "noci" : "nocí"}`,
    emailSubject: (arrival, departure) => `Poptávka pobytu – ${arrival} – ${departure}`,
    emailBody: (arrival, departure, nightsLabel) =>
      [
        "Dobrý den,",
        "",
        "mám zájem o pobyt v Retreat Studiu – Mlýn na Pile.",
        "",
        `Termín: ${arrival} – ${departure} (${nightsLabel})`,
        "",
        "Prosím o informace k dostupnosti a podmínkám.",
        "",
        "Děkuji a těším se na odpověď.",
        "S pozdravem,",
        "[Vaše jméno]",
      ].join("\n"),
    footerLine: "Retreat Studio · Mlýn na Pile · Pila, Trhanov · mlynnapile@gmail.com",
    weekdays: ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"],
  },
  en: {
    brandMill: "Mill",
    brandAt: "at Pila",
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
    eyebrow: "Retreat Studio",
    pickTerm: "Choose your dates",
    intro1:
      "We are still refining the final details of the studio. Pricing and the full booking launch will be available soon.",
    intro2: "",
    monthCounter: "Month",
    monthLabel: "Month",
    previous: "Previous month",
    next: "Next month",
    selectionHint: "Choose arrival and departure directly in the calendar of the front card.",
    bookedHint: "Days marked in grey are already booked.",
    modalTitle: "Selected stay",
    openInEmail: "Open in email",
    closeDialog: "Close dialog",
    selectedDates: "Dates",
    nightsLabel: (nights) => `${nights} ${nights === 1 ? "night" : "nights"}`,
    emailSubject: (arrival, departure) => `Stay enquiry – ${arrival} – ${departure}`,
    emailBody: (arrival, departure, nightsLabel) =>
      [
        "Hello,",
        "",
        "I am interested in a stay at Retreat Studio – Mill at Pila.",
        "",
        `Dates: ${arrival} – ${departure} (${nightsLabel})`,
        "",
        "Please send me information about availability and conditions.",
        "",
        "Thank you and I look forward to your reply.",
        "Best regards,",
        "[Your name]",
      ].join("\n"),
    footerLine: "Retreat Studio · Mill at Pila · Pila, Trhanov · mlynnapile@gmail.com",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  de: {
    brandMill: "Mühle",
    brandAt: "in Pila",
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
    eyebrow: "Retreat Studio",
    pickTerm: "Zeitraum wählen",
    intro1:
      "Am Studio arbeiten wir noch und stimmen die letzten Details ab. Preise und der vollständige Start der Buchung folgen bald.",
    intro2: "",
    monthCounter: "Monat",
    monthLabel: "Monat",
    previous: "Vorheriger Monat",
    next: "Nächster Monat",
    selectionHint: "Wähle An- und Abreise direkt im Kalender der vorderen Karte.",
    bookedHint: "Grau markierte Tage sind bereits belegt.",
    modalTitle: "Gewählter Aufenthalt",
    openInEmail: "Im E-Mail-Programm öffnen",
    closeDialog: "Dialog schließen",
    selectedDates: "Zeitraum",
    nightsLabel: (nights) => `${nights} ${nights === 1 ? "Nacht" : "Nächte"}`,
    emailSubject: (arrival, departure) => `Aufenthaltsanfrage – ${arrival} – ${departure}`,
    emailBody: (arrival, departure, nightsLabel) =>
      [
        "Guten Tag,",
        "",
        "ich interessiere mich für einen Aufenthalt im Retreat Studio – Mühle in Pila.",
        "",
        `Zeitraum: ${arrival} – ${departure} (${nightsLabel})`,
        "",
        "Bitte senden Sie mir Informationen zur Verfügbarkeit und zu den Bedingungen.",
        "",
        "Vielen Dank, ich freue mich auf Ihre Antwort.",
        "Mit freundlichen Grüßen",
        "[Ihr Name]",
      ].join("\n"),
    footerLine: "Retreat Studio · Mühle in Pila · Pila, Trhanov · mlynnapile@gmail.com",
    weekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  },
}

const localeNames: Record<Locale, string> = {
  cs: "Čeština",
  en: "English",
  de: "Deutsch",
}

function getLocaleTag(locale: Locale) {
  if (locale === "cs") return "cs-CZ"
  if (locale === "en") return "en-US"
  return "de-DE"
}

function getLocaleHomePath(locale: Locale) {
  if (locale === "cs") return "/"
  if (locale === "en") return "/?lang=en"
  return "/?lang=de"
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
  return `${getLocaleHomePath(locale)}#${sectionId}`
}

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ")
}

function buildMonthTitle(locale: Locale, date: Date, format: "long" | "short") {
  const localeTag = getLocaleTag(locale)
  const monthFormatter = new Intl.DateTimeFormat(localeTag, {
    month: format,
  })
  const yearFormatter = new Intl.DateTimeFormat(localeTag, {
    year: "numeric",
  })
  const month = monthFormatter.format(date)
  const normalizedMonth = month.slice(0, 1).toLocaleUpperCase(localeTag) + month.slice(1)
  const year = yearFormatter.format(date)
  return `${normalizedMonth} ${year}`
}

function buildGhostTitle(locale: Locale, date: Date) {
  const localeTag = getLocaleTag(locale)
  const monthFormatter = new Intl.DateTimeFormat(localeTag, {
    month: "long",
  })
  const month = monthFormatter.format(date)
  return month.slice(0, 1).toLocaleUpperCase(localeTag) + month.slice(1)
}

function buildCardLabel(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = String(date.getFullYear())
  return `${month}/${year}`
}

function buildCalendarWeeks(year: number, month: number) {
  const first = new Date(year, month, 1)
  const firstDayOffset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<number | null> = []

  for (let index = 0; index < 42; index += 1) {
    const day = index - firstDayOffset + 1
    cells.push(day >= 1 && day <= daysInMonth ? day : null)
  }

  const weeks: Array<Array<number | null>> = []
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }
  while (weeks.length > 0 && weeks[weeks.length - 1]?.every((cell) => cell === null)) {
    weeks.pop()
  }
  return weeks
}

function buildMonths(locale: Locale): CalendarMonth[] {
  return Array.from({ length: TOTAL }, (_, offset) => {
    const date = new Date(START_Y, START_M + offset, 1)
    const year = date.getFullYear()
    const month = date.getMonth()

    return {
      index: offset,
      date,
      year,
      month,
      title: buildMonthTitle(locale, date, "long"),
      shortTitle: buildCardLabel(date),
      ghostTitle: buildGhostTitle(locale, date),
      gradient: GRADIENTS_BY_MONTH[month],
      youtubeId: VIDEOS_BY_MONTH[month] ?? null,
      localVideoSrc: LOCAL_MEDIA_BY_MONTH[month]?.src ?? null,
      localPosterSrc: LOCAL_MEDIA_BY_MONTH[month]?.poster ?? null,
      blockedRanges: BOOKED_RANGES[`${year}-${month}`] ?? [],
      weeks: buildCalendarWeeks(year, month),
    }
  })
}

// Karty jsou kotvené na svislý střed stage (.cardFrame top:50%); závěrečné
// translateY(-50%) běží až po scale, takže se na střed zarovná i zmenšená karta.
function getCardTransform(offset: number) {
  if (offset === 0) return "translate3d(0, 0, 0) scale(1) translateY(-50%)"
  if (offset === 1) return "translate3d(208px, 10px, 0) scale(0.86) translateY(-50%)"
  if (offset === 2) return "translate3d(348px, 22px, 0) scale(0.72) translateY(-50%)"
  return "translate3d(456px, 34px, 0) scale(0.6) translateY(-50%)"
}

function getCardOpacity(offset: number) {
  if (offset === 0) return 1
  if (offset === 1) return 0.98
  if (offset === 2) return 0.96
  return 0.94
}

function buildYoutubeUrl(videoId: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    loop: "1",
    playlist: videoId,
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    disablekb: "1",
    enablejsapi: "1",
    fs: "0",
    playsinline: "1",
    vq: "hd1080",
  })

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

function setYoutubeIframePlaybackRate(frame: HTMLIFrameElement | null, playbackRate: number) {
  const target = frame?.contentWindow
  if (!target) return

  const postCommand = (func: string, args: unknown[] = []) => {
    target.postMessage(JSON.stringify({ event: "command", func, args }), "https://www.youtube.com")
  }

  postCommand("setPlaybackRate", [playbackRate])
  postCommand("playVideo")

  window.setTimeout(() => postCommand("setPlaybackRate", [playbackRate]), 450)
  window.setTimeout(() => postCommand("setPlaybackRate", [playbackRate]), 1200)
}

function renderGuideText(text: string) {
  if (!text.includes("LA Cham")) return text

  const [before, ...rest] = text.split("LA Cham")
  const after = rest.join("LA Cham")

  return (
    <>
      {before}
      <a
        href="https://la-cham.de/shows/"
        target="_blank"
        rel="noreferrer"
        className={styles.monthGuideLink}
      >
        LA Cham
      </a>
      {after}
    </>
  )
}

function splitEventLead(text: string) {
  const separatorIndex = text.indexOf("·")
  if (separatorIndex === -1) {
    return { lead: "", rest: text.trim() }
  }

  return {
    lead: text.slice(0, separatorIndex).trim(),
    rest: text.slice(separatorIndex).trim(),
  }
}

function getBrand(locale: Locale, copy: Copy) {
  if (locale === "en") {
    return (
      <>
        {copy.brandMill} <em>{copy.brandAt}</em>
      </>
    )
  }

  if (locale === "de") {
    return (
      <>
        {copy.brandMill} <em>{copy.brandAt}</em>
      </>
    )
  }

  return (
    <>
      {copy.brandMill} <em>{copy.brandAt}</em>
    </>
  )
}

function formatDateForMail(locale: Locale, date: Date) {
  return new Intl.DateTimeFormat(getLocaleTag(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

function getDateAtMonthDay(months: CalendarMonth[], monthIndex: number, day: number) {
  return new Date(months[monthIndex].year, months[monthIndex].month, day)
}

// Dnešek od půlnoci — v prvním (aktuálním) měsíci se už proběhlé dny nedají vybrat.
function getTodayStart() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

function getNightsCount(arrival: Date, departure: Date) {
  return Math.max(1, Math.round((departure.getTime() - arrival.getTime()) / 86400000))
}

function isBlockedDay(month: CalendarMonth, day: number) {
  return month.blockedRanges.some((range) => day >= range.start && day <= range.end)
}

function rangeOverlapsBlocked(month: CalendarMonth, arrivalDay: number, departureDay: number) {
  return month.blockedRanges.some((range) => !(departureDay < range.start || arrivalDay > range.end))
}

function rangeOverlapsAnyBlocked(months: CalendarMonth[], arrival: Date, departure: Date) {
  return months.some((month, monthIndex) =>
    month.blockedRanges.some((range) => {
      const blockedStart = getDateAtMonthDay(months, monthIndex, range.start)
      const blockedEnd = getDateAtMonthDay(months, monthIndex, range.end)
      return !(departure < blockedStart || arrival > blockedEnd)
    }),
  )
}

function eventMatchesSelection(
  months: CalendarMonth[],
  event: MonthEvent,
  selection: SelectionState,
  currentIndex: number,
) {
  if (selection.arrivalMonthIndex === null || selection.arrivalDay === null) {
    return false
  }

  const selectionStart = getDateAtMonthDay(months, selection.arrivalMonthIndex, selection.arrivalDay)
  const selectionEnd =
    selection.departureMonthIndex !== null && selection.departureDay !== null
      ? getDateAtMonthDay(months, selection.departureMonthIndex, selection.departureDay)
      : selectionStart

  if (
    event.days?.some((day) => {
      const eventDate = getDateAtMonthDay(months, currentIndex, day)
      return eventDate >= selectionStart && eventDate <= selectionEnd
    })
  ) {
    return true
  }

  if (event.range) {
    const [start, end] = event.range
    const eventStart = getDateAtMonthDay(months, currentIndex, start)
    const eventEnd = getDateAtMonthDay(months, currentIndex, end)
    return !(selectionEnd < eventStart || selectionStart > eventEnd)
  }

  return false
}

function SeamlessLoopVideo({
  src,
  poster,
  className,
  playbackRate = 1,
}: {
  src: string
  poster?: string | null
  className: string
  playbackRate?: number
}) {
  const videoRefs = [useRef<HTMLVideoElement | null>(null), useRef<HTMLVideoElement | null>(null)]
  const [activeLayer, setActiveLayer] = useState(0)
  const [incomingLayer, setIncomingLayer] = useState<number | null>(null)
  const transitionRef = useRef(false)
  const timeoutRef = useRef<number | null>(null)
  const FADE_MS = 520

  const ensurePlayback = (layer: number) => {
    const target = videoRefs[layer].current
    if (!target) return
    target.playbackRate = playbackRate
    target.play().catch(() => {})
  }

  useEffect(() => {
    transitionRef.current = false
    setActiveLayer(0)
    setIncomingLayer(null)

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const first = videoRefs[0].current
    const second = videoRefs[1].current

    if (first) {
      first.currentTime = 0
      first.playbackRate = playbackRate
      ensurePlayback(0)
    }

    if (second) {
      second.pause()
      second.currentTime = 0
      second.playbackRate = playbackRate
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [src, playbackRate])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        ensurePlayback(activeLayer)
      }
    }

    const handleFocus = () => ensurePlayback(activeLayer)
    const handlePageShow = () => ensurePlayback(activeLayer)

    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("pageshow", handlePageShow)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("pageshow", handlePageShow)
    }
  }, [activeLayer])

  const queueCrossfade = (currentLayer: number) => {
    if (transitionRef.current) return

    const nextLayer = currentLayer === 0 ? 1 : 0
    const current = videoRefs[currentLayer].current
    const next = videoRefs[nextLayer].current

    if (!current || !next) return

    transitionRef.current = true
    next.currentTime = 0
    next.playbackRate = playbackRate
    ensurePlayback(nextLayer)
    setIncomingLayer(nextLayer)

    timeoutRef.current = window.setTimeout(() => {
      current.pause()
      current.currentTime = 0
      setActiveLayer(nextLayer)
      setIncomingLayer(null)
      transitionRef.current = false
    }, FADE_MS)
  }

  const handleTimeUpdate = (layer: number) => {
    if (layer !== activeLayer || transitionRef.current) return

    const current = videoRefs[layer].current
    if (!current || !Number.isFinite(current.duration) || current.duration <= 0) return

    const remaining = current.duration - current.currentTime
    if (remaining <= 0.6) {
      queueCrossfade(layer)
    }
  }

  return (
    <>
      {[0, 1].map((layer) => {
        const isVisible = layer === activeLayer || layer === incomingLayer
        return (
          <video
            key={`${src}-${layer}`}
            ref={videoRefs[layer]}
            className={cx(className, styles.seamlessVideo, isVisible && styles.seamlessVideoVisible)}
            src={src}
            poster={poster ?? undefined}
            autoPlay={layer === 0}
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            onLoadedMetadata={() => {
              const target = videoRefs[layer].current
              if (target) target.playbackRate = playbackRate
            }}
            onLoadedData={() => {
              if (layer === activeLayer || layer === incomingLayer) {
                ensurePlayback(layer)
              }
            }}
            onTimeUpdate={() => handleTimeUpdate(layer)}
          />
        )
      })}
    </>
  )
}

export default function BookingPage({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale]
  const router = useRouter()
  const searchParams = useSearchParams()
  const liveBg = useLiveBgConfig("booking")
  const adminBg = Boolean(liveBg?.image || liveBg?.video)
  const langSwitchRef = useRef<HTMLDivElement | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)
  const mainRef = useRef<HTMLElement | null>(null)
  const lastPostedHeightRef = useRef(0)
  const [navScrolled, setNavScrolled] = useState(false)
  const [paused, setPaused] = useState(false)
  const [nightMode] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [bookingNoticeOpen, setBookingNoticeOpen] = useState(false)
  const [selection, setSelection] = useState<SelectionState>({
    arrivalMonthIndex: null,
    arrivalDay: null,
    departureMonthIndex: null,
    departureDay: null,
  })
  const [modalOpen, setModalOpen] = useState(false)
  const embedded = searchParams.get("embed") === "1"

  const months = useMemo(() => buildMonths(locale), [locale])
  const todayStart = useMemo(() => getTodayStart(), [])
  const activeMonth = months[currentIndex]
  const activeMonthGuide = MONTH_GUIDES_CS[activeMonth.month]
  const visibleMonths = months.slice(currentIndex, Math.min(currentIndex + 4, months.length))

  useEffect(() => {
    document.documentElement.lang = locale
    document.body.style.background = "#000"

    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, locale)
    } catch {}

    return () => {
      document.body.style.background = ""
    }
  }, [locale, embedded])

  useEffect(() => {
    if (embedded) {
      setNavScrolled(false)
      return
    }
    const onScroll = () => setNavScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [embedded])

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
    document.body.style.overflow = !embedded && (mobileNavOpen || modalOpen) ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [embedded, mobileNavOpen, modalOpen])

  useEffect(() => {
    const showTimer = window.setTimeout(() => setBookingNoticeOpen(true), 260)
    const hideTimer = window.setTimeout(() => setBookingNoticeOpen(false), 6200)

    return () => {
      window.clearTimeout(showTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  useEffect(() => {
    if (!embedded) return

    const postHeight = () => {
      const main = mainRef.current
      if (!main || window.parent === window) return
      const nextHeight = Math.max(400, Math.min(6000, Math.round(main.getBoundingClientRect().height)))
      if (Math.abs(nextHeight - lastPostedHeightRef.current) <= 4) return
      lastPostedHeightRef.current = nextHeight
      window.parent.postMessage({ type: "booking-embed-height", h: nextHeight }, window.location.origin)
    }

    postHeight()

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(postHeight)
    })

    if (mainRef.current) {
      resizeObserver.observe(mainRef.current)
    }

    window.addEventListener("resize", postHeight, { passive: true })
    window.addEventListener("load", postHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", postHeight)
      window.removeEventListener("load", postHeight)
    }
  }, [embedded, locale, currentIndex, bookingNoticeOpen, modalOpen, selection])

  useEffect(() => {
    if (!embedded) return

    const parentSnapEnabled = () => {
      try {
        return window.parent.innerWidth >= 768
      } catch {
        return window.innerWidth >= 768
      }
    }

    const onWheel = (event: WheelEvent) => {
      if (modalOpen) return
      if (!parentSnapEnabled()) return
      event.preventDefault()
      window.parent.postMessage({ type: "booking-embed-wheel", deltaY: event.deltaY }, window.location.origin)
    }

    const onTouchStart = (event: TouchEvent) => {
      if (!parentSnapEnabled()) return
      const touch = event.touches[0]
      if (!touch) return
      touchStartXRef.current = touch.clientX
      touchStartYRef.current = touch.clientY
    }

    const onTouchEnd = (event: TouchEvent) => {
      if (modalOpen) return
      if (!parentSnapEnabled()) return
      if (touchStartYRef.current === null || touchStartXRef.current === null) return

      const touch = event.changedTouches[0]
      if (!touch) return

      const deltaX = touch.clientX - touchStartXRef.current
      const deltaY = touch.clientY - touchStartYRef.current

      touchStartXRef.current = null
      touchStartYRef.current = null

      if (Math.abs(deltaY) < 48 || Math.abs(deltaY) < Math.abs(deltaX)) return
      window.parent.postMessage({ type: "booking-embed-swipe", deltaY }, window.location.origin)
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchend", onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchend", onTouchEnd)
    }
  }, [embedded, modalOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalOpen(false)
        return
      }

      if (modalOpen) {
        return
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault()
        setCurrentIndex((current) => Math.max(0, current - 1))
      }

      if (event.key === "ArrowRight") {
        event.preventDefault()
        setCurrentIndex((current) => Math.min(months.length - 1, current + 1))
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [modalOpen, months.length])

  const pauseLabel = paused ? copy.resume : copy.pause

  const arrivalDate =
    selection.arrivalMonthIndex !== null && selection.arrivalDay !== null
      ? getDateAtMonthDay(months, selection.arrivalMonthIndex, selection.arrivalDay)
      : null
  const departureDate =
    selection.departureMonthIndex !== null && selection.departureDay !== null
      ? getDateAtMonthDay(months, selection.departureMonthIndex, selection.departureDay)
      : null

  const nights =
    arrivalDate && departureDate
      ? getNightsCount(arrivalDate, departureDate)
      : null

  const formattedArrival = arrivalDate ? formatDateForMail(locale, arrivalDate) : ""
  const formattedDeparture = departureDate ? formatDateForMail(locale, departureDate) : ""
  const formattedNights = nights ? copy.nightsLabel(nights) : ""
  const emailSubject = arrivalDate && departureDate ? copy.emailSubject(formattedArrival, formattedDeparture) : ""
  const emailBody =
    arrivalDate && departureDate && nights
      ? copy.emailBody(formattedArrival, formattedDeparture, copy.nightsLabel(nights))
      : ""
  const mailtoHref =
    arrivalDate && departureDate
      ? `mailto:${EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      : `mailto:${EMAIL}`

  const switchLanguage = (nextLocale: Locale) => {
    setLangOpen(false)
    setMobileNavOpen(false)
    router.push(getBookingPath(nextLocale))
  }

  const goToIndex = (nextIndex: number) => {
    setCurrentIndex(Math.max(0, Math.min(months.length - 1, nextIndex)))
  }

  const handleDayClick = (day: number) => {
    if (isBlockedDay(activeMonth, day)) return
    if (getDateAtMonthDay(months, currentIndex, day) < todayStart) return

    const clickedDate = getDateAtMonthDay(months, currentIndex, day)

    setSelection((current) => {
      if (
        current.arrivalMonthIndex === null ||
        current.arrivalDay === null ||
        (current.departureMonthIndex !== null && current.departureDay !== null)
      ) {
        return {
          arrivalMonthIndex: currentIndex,
          arrivalDay: day,
          departureMonthIndex: null,
          departureDay: null,
        }
      }

      const currentArrivalDate = getDateAtMonthDay(months, current.arrivalMonthIndex, current.arrivalDay)

      if (clickedDate <= currentArrivalDate) {
        return {
          arrivalMonthIndex: currentIndex,
          arrivalDay: day,
          departureMonthIndex: null,
          departureDay: null,
        }
      }

      if (rangeOverlapsAnyBlocked(months, currentArrivalDate, clickedDate)) {
        return {
          arrivalMonthIndex: currentIndex,
          arrivalDay: day,
          departureMonthIndex: null,
          departureDay: null,
        }
      }

      setModalOpen(true)
      return {
        arrivalMonthIndex: current.arrivalMonthIndex,
        arrivalDay: current.arrivalDay,
        departureMonthIndex: currentIndex,
        departureDay: day,
      }
    })
  }

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return
    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartXRef.current
    touchStartXRef.current = null

    if (Math.abs(delta) < 48) return
    if (delta < 0) {
      goToIndex(currentIndex + 1)
    } else {
      goToIndex(currentIndex - 1)
    }
  }

  return (
    <div className={cx(styles.bookingPage, embedded && styles.embedded, manrope.className, nightMode && styles.nightMode)}>
      {!embedded && !adminBg ? (
        <div className={styles.bgShell} aria-hidden="true">
          <div className={styles.bgOverlay} />
        </div>
      ) : null}
      {!embedded && adminBg ? <PageBgLayer pageId="booking" /> : null}

      {!embedded && (
        <>
          <nav className={cx(styles.nav, navScrolled && styles.navScrolled)}>
            <Link href={getLocaleHomePath(locale)} className={cx(styles.navLogo, cormorant.className)}>
              {getBrand(locale, copy)}
            </Link>

            <ul className={styles.navLinks}>
              <li><Link href={getSectionHref(locale, "place")}>{copy.mill}</Link></li>
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
            <Link href={getSectionHref(locale, "place")} onClick={() => setMobileNavOpen(false)}>{copy.mill}</Link>
            <Link href={getSectionHref(locale, "studio")} onClick={() => setMobileNavOpen(false)}>{copy.studio}</Link>
            <Link href={getSectionHref(locale, "equipment")} onClick={() => setMobileNavOpen(false)}>{copy.equipment}</Link>
            <Link href={getSectionHref(locale, "residency")} onClick={() => setMobileNavOpen(false)}>{copy.accommodation}</Link>
            <Link href={getSectionHref(locale, "location")} onClick={() => setMobileNavOpen(false)}>{copy.location}</Link>
            <Link href={getHistoryPath(locale)} onClick={() => setMobileNavOpen(false)}>{copy.history}</Link>
            <Link href={getSectionHref(locale, "contact")} onClick={() => setMobileNavOpen(false)}>{copy.contact}</Link>
          </div>
        </>
      )}

      <main ref={mainRef} className={styles.pageShell}>
        <section className={styles.experience}>
          <div className={styles.infoColumn}>
            <div className={styles.noticeDock} aria-live="polite">
              <div className={cx(styles.bookingNotice, bookingNoticeOpen && styles.bookingNoticeOpen)}>
                <p>{copy.intro1}</p>
                <button
                  type="button"
                  className={styles.bookingNoticeClose}
                  aria-label={copy.closeDialog}
                  onClick={() => setBookingNoticeOpen(false)}
                >
                  ×
                </button>
              </div>
            </div>

            <span className={styles.eyebrow}>2026</span>
            <h1 className={cx(styles.title, cormorant.className)}>
              <span>Termíny</span>
              <em>{activeMonth.ghostTitle}</em>
            </h1>

            <div className={styles.monthGuideNav}>
              <div className={styles.arrowGroup}>
                <button
                  type="button"
                  className={styles.arrowButton}
                  aria-label={copy.previous}
                  onClick={() => goToIndex(currentIndex - 1)}
                  disabled={currentIndex === 0}
                >
                  ←
                </button>
                <button
                  type="button"
                  className={styles.arrowButton}
                  aria-label={copy.next}
                  onClick={() => goToIndex(currentIndex + 1)}
                  disabled={currentIndex === months.length - 1}
                >
                  →
                </button>
              </div>
            </div>

          <div className={styles.stackColumn}>
            <div className={styles.stackStage} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              {visibleMonths.map((month, visibleIndex) => {
                const offset = month.index - currentIndex
                const isFront = offset === 0
                const arrivalDateForSelection =
                  selection.arrivalMonthIndex !== null && selection.arrivalDay !== null
                    ? getDateAtMonthDay(months, selection.arrivalMonthIndex, selection.arrivalDay)
                    : null
                const departureDateForSelection =
                  selection.departureMonthIndex !== null && selection.departureDay !== null
                    ? getDateAtMonthDay(months, selection.departureMonthIndex, selection.departureDay)
                    : null

                return (
                  <div
                    key={month.title}
                    className={cx(styles.cardFrame, isFront && styles.cardFrameFront)}
                    style={{
                      transform: getCardTransform(offset),
                      opacity: getCardOpacity(offset),
                      zIndex: 40 - offset,
                    }}
                    onClick={() => {
                      if (!isFront) {
                        goToIndex(month.index)
                      }
                    }}
                    role={isFront ? undefined : "button"}
                    tabIndex={isFront ? -1 : 0}
                    onKeyDown={(event) => {
                      if (isFront) return
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        goToIndex(month.index)
                      }
                    }}
                  >
                    <article className={cx(styles.card, !isFront && styles.cardInactive)}>
                      <div className={cx(styles.cardClip, isFront && styles.cardClipFront)}>
                        <div className={styles.cardMedia} aria-hidden="true">
                          {!paused && month.localVideoSrc ? (
                            <SeamlessLoopVideo
                              key={`${month.localVideoSrc}-${paused ? "paused" : "playing"}`}
                              className={styles.cardLocalVideo}
                              src={month.localVideoSrc}
                              poster={month.localPosterSrc ?? undefined}
                              playbackRate={BOOKING_VIDEO_PLAYBACK_RATE}
                            />
                          ) : null}
                          {!paused && !month.localVideoSrc && month.youtubeId ? (
                            <iframe
                              key={`${month.youtubeId}-${paused ? "paused" : "playing"}`}
                              className={styles.cardVideo}
                              src={buildYoutubeUrl(month.youtubeId)}
                              title=""
                              allow="autoplay; encrypted-media; picture-in-picture"
                              loading={visibleIndex <= 2 ? "eager" : "lazy"}
                              referrerPolicy="strict-origin-when-cross-origin"
                              tabIndex={-1}
                              onLoad={(event) => {
                                setYoutubeIframePlaybackRate(event.currentTarget, BOOKING_VIDEO_PLAYBACK_RATE)
                              }}
                            />
                          ) : null}
                          <div
                            className={cx(
                              styles.cardGradient,
                              (month.youtubeId || month.localVideoSrc) && styles.cardGradientVideo,
                              isFront && (month.youtubeId || month.localVideoSrc) && styles.cardGradientFrontVideo,
                            )}
                            style={{ background: month.gradient }}
                          />
                          <div className={styles.cardShade} />
                        </div>

                        <div className={cx(styles.cardContent, isFront ? styles.cardContentFront : styles.cardContentPreview)}>
                          <div className={cx(styles.calendarPanel, isFront ? styles.calendarPanelFront : styles.calendarPanelPreview)}>
                            <div className={styles.calendarHead}>
                              <span className={styles.calendarYear}>{month.shortTitle}</span>
                            </div>

                            <div className={cx(styles.weekdays, !isFront && styles.weekdaysHidden)}>
                              {copy.weekdays.map((weekday) => (
                                <span key={`${month.title}-${weekday}`} className={styles.weekday}>
                                  {weekday}
                                </span>
                              ))}
                            </div>

                            <div className={cx(styles.calendarGrid, !isFront && styles.calendarGridHidden)}>
                              {month.weeks.flat().map((day, cellIndex) => {
                                if (day === null) {
                                  return <span key={`${month.title}-empty-${cellIndex}`} className={styles.dayEmpty} />
                                }

                                const isBlocked = isBlockedDay(month, day)
                                const currentDayDate = getDateAtMonthDay(months, month.index, day)
                                const isPast = currentDayDate < todayStart
                                const isArrival =
                                  selection.arrivalMonthIndex === month.index && selection.arrivalDay === day
                                const isDeparture =
                                  selection.departureMonthIndex === month.index && selection.departureDay === day
                                const isBetween =
                                  arrivalDateForSelection !== null &&
                                  departureDateForSelection !== null &&
                                  currentDayDate > arrivalDateForSelection &&
                                  currentDayDate < departureDateForSelection

                                return (
                                  <button
                                    key={`${month.title}-${day}`}
                                    type="button"
                                    className={cx(
                                      styles.dayButton,
                                      isPast && styles.dayPast,
                                      isBlocked && styles.dayBlocked,
                                      isArrival && styles.dayArrival,
                                      isDeparture && styles.dayDeparture,
                                      isBetween && styles.dayBetween,
                                      !isFront && styles.dayDisabled,
                                    )}
                                    disabled={!isFront || isBlocked || isPast}
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      if (!isFront) return
                                      handleDayClick(day)
                                    }}
                                  >
                                    <span>{day}</span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                )
              })}
            </div>

          </div>

            {activeMonthGuide ? (
              <section className={styles.monthGuide}>
                <div className={styles.monthGuideBlock}>
                  <h3>V tomto měsíci se konají:</h3>
                  <ul className={styles.monthGuideList}>
                    {activeMonthGuide.events.map((item) => {
                      const isActive = eventMatchesSelection(months, item, selection, currentIndex)
                      const { lead, rest } = splitEventLead(item.text)

                      return (
                        <li key={`${activeMonthGuide.monthTitle}-event-${item.text}`}>
                          {lead ? (
                            <span className={cx(isActive && styles.monthGuideEventLeadActive)}>
                              {lead}
                            </span>
                          ) : null}
                          {lead ? " · " : ""}
                          {renderGuideText(rest)}
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {activeMonthGuide.note ? <p className={styles.monthGuideNote}>{activeMonthGuide.note}</p> : null}

                <div className={styles.monthGuideBlock}>
                  <h3>Tipy do okolí:</h3>
                  <ul className={styles.monthGuideList}>
                    {activeMonthGuide.tips.map((item) => (
                      <li key={`${activeMonthGuide.monthTitle}-tip-${item}`}>{renderGuideText(item)}</li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}
          </div>
        </section>

      </main>

      {!embedded && (
        <footer className={styles.footer}>
          <span className={styles.ftCopy}>© 2026 | Design &amp; Development: Ing. Jindřich Traxmandl</span>
        </footer>
      )}

      {modalOpen && arrivalDate && departureDate && nights ? (
        <div className={styles.modalBackdrop} onClick={() => setModalOpen(false)}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label={copy.modalTitle}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalClose}
              aria-label={copy.closeDialog}
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>

            <span className={styles.modalEyebrow}>{copy.modalTitle}</span>
            <h2 className={cx(styles.modalTitle, cormorant.className)}>
              {formattedArrival} <em>→ {formattedDeparture}</em>
            </h2>
            <p className={styles.modalMeta}>
              {copy.selectedDates}: {formattedArrival} – {formattedDeparture} · {formattedNights}
            </p>

            <pre className={styles.emailDraft}>{emailBody}</pre>

            <a href={mailtoHref} className={styles.modalCta}>
              {copy.openInEmail}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  )
}
