"use client"

import { cormorant, manrope } from "@/lib/fonts"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import styles from "@/components/booking-page.module.css"
import PageBgLayer from "@/components/page-bg-layer"
import { useLiveBgConfig } from "@/lib/use-live-bg"

const MODE_STORAGE_KEY = "mlyn_mode"
const LANG_STORAGE_KEY = "mlyn_lang"

const EMAIL = "mlynnapile@gmail.com"
// Kalendář se roluje: začíná vždy aktuálním měsícem a pokračuje 12 měsíců dopředu.
const TOTAL = 12
const CALENDAR_START = new Date()
const START_Y = CALENDAR_START.getFullYear()
const START_M = CALENDAR_START.getMonth()
const BOOKING_VIDEO_PLAYBACK_RATE = 0.42
// Denní záběry natočené v daném měsíci (název videa na YouTube = měsíc).
// Hrají v denním režimu; v nočním mají přednost lokální noční klipy.
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
  "NJgVqF3R8J0", // listopad
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
    { start: 16, end: 17 },
    { start: 23, end: 24 },
    { start: 30, end: 31 },
  ],
  "2026-10": [ // listopad 2026
    { start: 1, end: 1 },
    { start: 13, end: 14 },
    { start: 21, end: 22 },
  ],
  "2026-11": [ // prosinec 2026
    { start: 4, end: 5 },
    { start: 11, end: 12 },
    { start: 19, end: 19 },
    { start: 21, end: 28 },
  ],
  "2027-1": [ // únor 2027
    { start: 12, end: 13 },
  ],
}

// Hlavní studio: den s přespáním (studio, přespání pod studiem, plná penze),
// ceny včetně DPH. Základ platí pro 1–2 osoby, každá další osoba se připlácí.
const STUDIO_DAY_PRICE = 9000
const STUDIO_DAY_INCLUDED_PERSONS = 2
const STUDIO_EXTRA_PERSON_PRICE = 3500
const STUDIO_MAX_PERSONS = 5
// Studio po hodinách bez přespání — na dotáčky a zkoušky, nejvýš pro 2 lidi.
const STUDIO_HOURLY_PRICE = 800
const STUDIO_HOURLY_MIN_HOURS = 3
const STUDIO_HOURLY_MAX_HOURS = 12
const STUDIO_HOURLY_MAX_PERSONS = 2

// Ceny pro cizojazyčné verze: angličtina v USD, němčina v EUR — přepočet kurzem
// ČNB ze 14. 10. 2026 (1 EUR = 24,355 Kč, 1 USD = 21,754 Kč), zaokrouhleno.
// Účtuje se v Kč; ceny v cizí měně jsou orientační.
const STUDIO_PRICES: Record<Locale, { currency: string; day: number; extra: number; hourly: number }> = {
  cs: { currency: "CZK", day: STUDIO_DAY_PRICE, extra: STUDIO_EXTRA_PERSON_PRICE, hourly: STUDIO_HOURLY_PRICE },
  en: { currency: "USD", day: 415, extra: 160, hourly: 37 },
  de: { currency: "EUR", day: 370, extra: 145, hourly: 33 },
}

type Locale = "cs" | "en" | "de"
type StudioRoom = "main" | "control"

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
  legendFree: string
  legendBooked: string
  rooms: Record<StudioRoom, string>
  roomMainWithMill: string
  studioInterest: (room: string) => string
  studioPriceNote: string
  billedInCzk: string
  studioExtraNote: (price: string) => string
  checkInOut: string
  copyText: string
  copied: string
  orWriteTo: string
  modeStay: string
  modeHourly: string
  hourlyPriceNote: string
  hoursLabel: string
  hoursShort: (hours: number) => string
  dateLabel: string
  hourlyInterest: (room: string) => string
  upsellTitle: string
  upsellText: (price: string) => string
  upsellCta: string
  personsLabel: string
  estimateLabel: string
  daysLabel: (days: number) => string
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
  nightClip: boolean
  blockedRanges: Array<{ start: number; end: number }>
  weeks: Array<Array<number | null>>
}

// Lokální klipy: v nočním režimu a u měsíců bez denního videa. Noční
// z nich se v denním režimu prosvětlují (.cardMediaNight).
const LOCAL_MEDIA_BY_MONTH: Partial<Record<number, { src: string; poster: string; night?: boolean }>> = {
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
    night: true,
  },
  9: { // říjen
    src: "/videos/bg/DY09nnytbjc.mp4",
    poster: "/videos/bg/DY09nnytbjc.jpg",
    night: true,
  },
  10: { // listopad
    src: "/videos/bg/QsHqEEj4-60.mp4",
    poster: "/videos/bg/QsHqEEj4-60.jpg",
    night: true,
  },
  11: { // prosinec
    src: "/videos/bg/M4QkWhz7CDo.mp4",
    poster: "/videos/bg/M4QkWhz7CDo.jpg",
    night: true,
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
    legendFree: "Volno",
    legendBooked: "Obsazeno",
    rooms: { main: "Hlavní studio", control: "Kontrolní místnost" },
    roomMainWithMill: "Hlavní studio + mlýnice",
    studioInterest: (room) => `mám zájem o pronájem prostoru ${room} – Mlýn na Pile.`,
    studioPriceNote: "den s přespáním · 1–2 osoby · plná penze · vč. DPH",
    billedInCzk: "",
    studioExtraNote: (price) => `další osoba +${price} / den (max. 5 osob)`,
    checkInOut: "Příjezd 14:00 · odjezd 11:00",
    copyText: "Zkopírovat text",
    copied: "Zkopírováno ✓",
    orWriteTo: "nebo napište na",
    modeStay: "Den s přespáním",
    modeHourly: "Po hodinách",
    hourlyPriceNote: "hod · bez přespání · max. 2 osoby · min. 3 hod · vč. DPH",
    hoursLabel: "Počet hodin",
    hoursShort: (hours) => `${hours} hod`,
    dateLabel: "Datum",
    hourlyInterest: (room) => `mám zájem o pronájem prostoru ${room} po hodinách (bez přespání) – Mlýn na Pile.`,
    upsellTitle: "Zůstat přes noc?",
    upsellText: (price) => `Den s přespáním, snídaní s kváskovým chlebem, plnou penzí a saunou · ${price} pro 1–2 osoby`,
    upsellCta: "Přepnout na pobyt",
    personsLabel: "Počet osob",
    estimateLabel: "Orientační cena",
    daysLabel: (days) => `${days} ${days === 1 ? "den" : days > 1 && days < 5 ? "dny" : "dní"}`,
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
    legendFree: "Available",
    legendBooked: "Booked",
    rooms: { main: "Main Studio", control: "Control Room" },
    roomMainWithMill: "Main Studio + Mill Room",
    studioInterest: (room) => `I am interested in booking the ${room} – Mill at Pila.`,
    studioPriceNote: "day with overnight stay · 1–2 people · full board · VAT incl.",
    billedInCzk: "approx., invoiced in CZK",
    studioExtraNote: (price) => `each extra person +${price} / day (max. 5 people)`,
    checkInOut: "Check-in 14:00 · check-out 11:00",
    copyText: "Copy text",
    copied: "Copied ✓",
    orWriteTo: "or write to",
    modeStay: "Day with overnight stay",
    modeHourly: "By the hour",
    hourlyPriceNote: "hour · no overnight stay · max. 2 people · min. 3 hours · VAT incl.",
    hoursLabel: "Hours",
    hoursShort: (hours) => `${hours} h`,
    dateLabel: "Date",
    hourlyInterest: (room) => `I am interested in booking the ${room} by the hour (no overnight stay) – Mill at Pila.`,
    upsellTitle: "Stay overnight?",
    upsellText: (price) => `Day with overnight stay, sourdough breakfast, full board and sauna · ${price} for 1–2 people`,
    upsellCta: "Switch to stay",
    personsLabel: "Guests",
    estimateLabel: "Estimated price",
    daysLabel: (days) => `${days} ${days === 1 ? "day" : "days"}`,
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
    legendFree: "Frei",
    legendBooked: "Belegt",
    rooms: { main: "Hauptstudio", control: "Regieraum" },
    roomMainWithMill: "Hauptstudio + Mühlenraum",
    studioInterest: (room) => `ich interessiere mich für die Buchung: ${room} – Mühle in Pila.`,
    studioPriceNote: "Tag mit Übernachtung · 1–2 Personen · Vollpension · inkl. MwSt.",
    billedInCzk: "ca., Abrechnung in CZK",
    studioExtraNote: (price) => `jede weitere Person +${price} / Tag (max. 5 Personen)`,
    checkInOut: "Anreise 14:00 · Abreise 11:00",
    copyText: "Text kopieren",
    copied: "Kopiert ✓",
    orWriteTo: "oder schreiben Sie an",
    modeStay: "Tag mit Übernachtung",
    modeHourly: "Stundenweise",
    hourlyPriceNote: "Std. · ohne Übernachtung · max. 2 Personen · mind. 3 Std. · inkl. MwSt.",
    hoursLabel: "Stunden",
    hoursShort: (hours) => `${hours} Std.`,
    dateLabel: "Datum",
    hourlyInterest: (room) => `ich interessiere mich für die stundenweise Buchung: ${room} (ohne Übernachtung) – Mühle in Pila.`,
    upsellTitle: "Über Nacht bleiben?",
    upsellText: (price) => `Tag mit Übernachtung, Sauerteig-Frühstück, Vollpension und Sauna · ${price} für 1–2 Personen`,
    upsellCta: "Zum Aufenthalt wechseln",
    personsLabel: "Personen",
    estimateLabel: "Richtpreis",
    daysLabel: (days) => `${days} ${days === 1 ? "Tag" : "Tage"}`,
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

function buildMonths(locale: Locale, nightMode: boolean): CalendarMonth[] {
  return Array.from({ length: TOTAL }, (_, offset) => {
    const date = new Date(START_Y, START_M + offset, 1)
    const year = date.getFullYear()
    const month = date.getMonth()
    const dayVideo = VIDEOS_BY_MONTH[month] ?? null
    const local = LOCAL_MEDIA_BY_MONTH[month]
    // Ve dne hraje měsíční denní video (lokální kopie, pokud je), v noci lokální klip.
    const media = !nightMode && dayVideo && !local?.src.includes(dayVideo) ? null : local

    return {
      index: offset,
      date,
      year,
      month,
      title: buildMonthTitle(locale, date, "long"),
      shortTitle: buildCardLabel(date),
      ghostTitle: buildGhostTitle(locale, date),
      gradient: GRADIENTS_BY_MONTH[month],
      youtubeId: dayVideo,
      localVideoSrc: media?.src ?? null,
      // Svislá videa mají na YouTube náhled v původním poměru (oar2).
      localPosterSrc: media?.poster ?? (dayVideo ? `https://i.ytimg.com/vi/${dayVideo}/oar2.jpg` : null),
      nightClip: media?.night ?? false,
      blockedRanges: BOOKED_RANGES[`${year}-${month}`] ?? [],
      weeks: buildCalendarWeeks(year, month),
    }
  })
}

// Karty stojí vedle sebe zleva doprava, ne v překrývajícím se vějíři.
// Kotví se na svislý střed stage (.cardFrame top:50%); závěrečné
// translateY(-50%) běží až po scale, takže se na střed zarovná i zmenšená karta.
function getCardTransform(offset: number) {
  if (offset === 0) return "translate3d(0, 0, 0) scale(1) translateY(-50%)"
  if (offset === 1) return "translate3d(404px, 0, 0) scale(0.88) translateY(-50%)"
  if (offset === 2) return "translate3d(760px, 0, 0) scale(0.78) translateY(-50%)"
  return "translate3d(1078px, 0, 0) scale(0.68) translateY(-50%)"
}

// Náhledy už neprůhledníme — na světlé stránce pak působily mléčně;
// ustupují ztmavením (.cardInactive .cardClip).
function getCardOpacity(_offset: number) {
  return 1
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
  })

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
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

// YouTube přehrávač, který je vidět, jen když opravdu hraje. Při startu, pauze
// a před koncem smyčky se schová pod náhled — nikdy tak neukáže název videa,
// ovládání ani černé probliknutí při opakování.
function FadingYoutube({ videoId, className }: { videoId: string; className?: string }) {
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    let duration = 0
    let state = -1

    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.contentWindow || typeof event.data !== "string") return
      let data: { event?: string; info?: { playerState?: number; currentTime?: number; duration?: number } | number }
      try {
        data = JSON.parse(event.data)
      } catch {
        return
      }
      if (data.event === "onStateChange" && typeof data.info === "number") state = data.info
      if (data.event === "infoDelivery" && data.info && typeof data.info === "object") {
        if (typeof data.info.playerState === "number") state = data.info.playerState
        if (typeof data.info.duration === "number" && data.info.duration > 0) duration = data.info.duration
        const time = data.info.currentTime
        if (typeof time === "number") {
          const nearEnd = duration > 0 && time > duration - 0.9
          // YouTube po (re)startu na ~2–3 s ukáže ikonu pauzy; do té doby zůstává náhled.
          setVisible(state === 1 && time > 3 && !nearEnd)
          return
        }
      }
      if (state !== 1) setVisible(false)
    }

    const listen = () => {
      try {
        frame.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: videoId, channel: "widget" }), "*")
      } catch {}
    }

    window.addEventListener("message", onMessage)
    frame.addEventListener("load", listen)
    const retry = window.setInterval(listen, 1500)
    return () => {
      window.removeEventListener("message", onMessage)
      frame.removeEventListener("load", listen)
      window.clearInterval(retry)
    }
  }, [videoId])

  return (
    <iframe
      ref={frameRef}
      className={cx(className, styles.fadingYoutube, visible && styles.fadingYoutubeOn)}
      src={buildYoutubeUrl(videoId)}
      title=""
      allow="autoplay; encrypted-media; picture-in-picture"
      referrerPolicy="strict-origin-when-cross-origin"
      tabIndex={-1}
    />
  )
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
  const [nightMode, setNightMode] = useState(true)
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
  const [persons, setPersons] = useState(2)
  const [copied, setCopied] = useState(false)
  const [studioMode, setStudioMode] = useState<"stay" | "hourly">("stay")
  const [hourlyDay, setHourlyDay] = useState<{ monthIndex: number; day: number } | null>(null)
  const [hours, setHours] = useState(STUDIO_HOURLY_MIN_HOURS)
  const embedded = searchParams.get("embed") === "1"
  // Kompaktní kalendář pro konkrétní místnost (panel v sekci Studio na hlavní stránce).
  const roomParam = searchParams.get("room")
  const studioRoom: StudioRoom | null = embedded && (roomParam === "main" || roomParam === "control") ? roomParam : null
  // Karta Hlavní studio na hlavní stránce přizpůsobí obsah zvolenému režimu.
  useEffect(() => {
    if (studioRoom !== "main" || window.parent === window) return
    window.parent.postMessage({ type: "studio-booking-mode", mode: studioMode }, window.location.origin)
  }, [studioRoom, studioMode])

  // Vložená verze otevřená samostatně (např. z Googlu) → příslušná sekce webu.
  useEffect(() => {
    if (!embedded || window.top !== window.self) return
    window.location.replace(`${locale === "cs" ? "/" : `/${locale}`}#${studioRoom ? "studio" : "residency"}`)
  }, [embedded, locale, studioRoom])

  // Režim sdílíme s hlavní stránkou přes stejný klíč v localStorage,
  // aby booking (i vložený v sekci Ubytování) vypadal stejně jako web.
  useEffect(() => {
    // Hlavní stránka bez uloženého režimu začíná ve dne, samostatný booking v noci.
    const read = () => {
      try {
        const stored = window.localStorage.getItem(MODE_STORAGE_KEY)
        return embedded ? stored === "night" : stored !== "day"
      } catch {
        return !embedded
      }
    }
    setNightMode(read())

    const onStorage = (event: StorageEvent) => {
      if (event.key === MODE_STORAGE_KEY) setNightMode(read())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [embedded])

  const toggleMode = () => {
    setNightMode((current) => {
      const next = !current
      try {
        window.localStorage.setItem(MODE_STORAGE_KEY, next ? "night" : "day")
      } catch {}
      return next
    })
  }

  const months = useMemo(() => buildMonths(locale, nightMode), [locale, nightMode])
  const todayStart = useMemo(() => getTodayStart(), [])
  const activeMonth = months[currentIndex]
  const activeMonthGuide = MONTH_GUIDES_CS[activeMonth.month]
  const visibleMonths = months.slice(currentIndex, Math.min(currentIndex + 4, months.length))

  useEffect(() => {
    document.documentElement.lang = locale

    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, locale)
    } catch {}
  }, [locale, embedded])

  // Tělo stránky drží barvu podle režimu, jinak by kolem obsahu zůstal
  // černý pruh i v denním režimu.
  useEffect(() => {
    document.body.style.background = nightMode ? "#000" : "#e2e0dc"
    return () => {
      document.body.style.background = ""
    }
  }, [nightMode])

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
  const roomLabel = studioRoom ? copy.rooms[studioRoom] : ""
  const prices = STUDIO_PRICES[locale]
  const formatCzk = (value: number) =>
    new Intl.NumberFormat(getLocaleTag(locale), {
      style: "currency",
      currency: prices.currency,
      maximumFractionDigits: 0,
    }).format(value)

  // Hlavní studio — den s přespáním: základ pro 1–2 osoby + příplatek za další, dny = noci.
  const studioPriceLabel = `${formatCzk(prices.day)} / ${copy.studioPriceNote}`
  const extraPersons = Math.max(0, persons - STUDIO_DAY_INCLUDED_PERSONS)
  const studioDayTotal = prices.day + extraPersons * prices.extra
  const studioEstimate = studioRoom === "main" && nights ? nights * studioDayTotal : null
  const studioEstimateText = studioEstimate
    ? extraPersons
      ? `${copy.daysLabel(nights ?? 0)} × (${formatCzk(prices.day)} + ${extraPersons} × ${formatCzk(prices.extra)}) = ${formatCzk(studioEstimate)}`
      : `${copy.daysLabel(nights ?? 0)} × ${formatCzk(prices.day)} = ${formatCzk(studioEstimate)}`
    : ""

  // Hlavní studio — po hodinách: jeden den, počet hodin, max. 2 osoby.
  const hourlyMode = studioRoom === "main" && studioMode === "hourly"
  const hourlyPriceLabel = `${formatCzk(prices.hourly)} / ${copy.hourlyPriceNote}`
  const hourlyDate = hourlyMode && hourlyDay ? getDateAtMonthDay(months, hourlyDay.monthIndex, hourlyDay.day) : null
  const formattedHourlyDate = hourlyDate ? formatDateForMail(locale, hourlyDate) : ""
  const hourlyPersons = Math.min(persons, STUDIO_HOURLY_MAX_PERSONS)
  const hourlyEstimate = hourlyDate ? hours * prices.hourly : null
  const hourlyEstimateText = hourlyEstimate
    ? `${copy.hoursShort(hours)} × ${formatCzk(prices.hourly)} = ${formatCzk(hourlyEstimate)}`
    : ""

  let emailSubject = ""
  let emailBodyLines: string[] = []
  if (hourlyDate) {
    emailSubject = `${roomLabel} – ${copy.modeHourly} – ${formattedHourlyDate}`
    emailBodyLines = copy.emailBody(formattedHourlyDate, formattedHourlyDate, "").split("\n")
    if (emailBodyLines.length > 4) {
      emailBodyLines[2] = copy.hourlyInterest(roomLabel)
      emailBodyLines.splice(
        4,
        1,
        `${copy.dateLabel}: ${formattedHourlyDate}`,
        `${copy.hoursLabel}: ${hours}`,
        `${copy.personsLabel}: ${hourlyPersons}`,
        `${copy.estimateLabel}: ${hourlyEstimateText}${copy.billedInCzk ? ` (${copy.billedInCzk})` : ""}`,
      )
    }
  } else if (arrivalDate && departureDate && nights) {
    emailSubject = studioRoom
      ? `${roomLabel} – ${formattedArrival} – ${formattedDeparture}`
      : copy.emailSubject(formattedArrival, formattedDeparture)
    emailBodyLines = copy.emailBody(formattedArrival, formattedDeparture, copy.nightsLabel(nights)).split("\n")
    // Ve studiu místo věty o pobytu řádek s konkrétní místností.
    if (studioRoom && emailBodyLines.length > 2) emailBodyLines[2] = copy.studioInterest(roomLabel)
    if (emailBodyLines.length > 5) emailBodyLines.splice(5, 0, copy.checkInOut)
    if (studioEstimate && emailBodyLines.length > 5) {
      emailBodyLines.splice(6, 0, `${copy.personsLabel}: ${persons}`, `${copy.estimateLabel}: ${studioEstimateText}${copy.billedInCzk ? ` (${copy.billedInCzk})` : ""}`)
    }
  }
  const emailBody = emailBodyLines.join("\n")
  const mailtoHref = emailSubject
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

  const switchHourlyToStay = () => {
    if (!hourlyDay) return
    const { monthIndex, day } = hourlyDay
    const month = months[monthIndex]
    const daysInMonth = new Date(month.year, month.month + 1, 0).getDate()
    const nextMonthIndex = day < daysInMonth ? monthIndex : monthIndex + 1
    const nextDay = day < daysInMonth ? day + 1 : 1
    const arrival = getDateAtMonthDay(months, monthIndex, day)
    const canDepart =
      nextMonthIndex < months.length &&
      !rangeOverlapsAnyBlocked(months, arrival, getDateAtMonthDay(months, nextMonthIndex, nextDay))
    setStudioMode("stay")
    setHourlyDay(null)
    setSelection({
      arrivalMonthIndex: monthIndex,
      arrivalDay: day,
      departureMonthIndex: canDepart ? nextMonthIndex : null,
      departureDay: canDepart ? nextDay : null,
    })
    // s odjezdem rovnou okno pobytu, jinak zpět do kalendáře vybrat odjezd
    if (!canDepart) setModalOpen(false)
  }

  const handleDayClick = (day: number) => {
    if (isBlockedDay(activeMonth, day)) return
    if (getDateAtMonthDay(months, currentIndex, day) < todayStart) return

    if (hourlyMode) {
      setHourlyDay({ monthIndex: currentIndex, day })
      setPersons((p) => Math.min(p, STUDIO_HOURLY_MAX_PERSONS))
      setModalOpen(true)
      return
    }

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

  const renderDayCell = (month: CalendarMonth, day: number | null, cellIndex: number, interactive: boolean) => {
    if (day === null) {
      return <span key={`${month.title}-empty-${cellIndex}`} className={styles.dayEmpty} />
    }

    const isBlocked = isBlockedDay(month, day)
    const currentDayDate = getDateAtMonthDay(months, month.index, day)
    const isPast = currentDayDate < todayStart
    const isHourlyPick = hourlyMode && hourlyDay?.monthIndex === month.index && hourlyDay?.day === day
    const isArrival =
      isHourlyPick || (!hourlyMode && selection.arrivalMonthIndex === month.index && selection.arrivalDay === day)
    const isDeparture =
      !hourlyMode && selection.departureMonthIndex === month.index && selection.departureDay === day
    const isBetween =
      !hourlyMode &&
      arrivalDate !== null &&
      departureDate !== null &&
      currentDayDate > arrivalDate &&
      currentDayDate < departureDate

    return (
      <button
        key={`${month.title}-${day}`}
        type="button"
        className={cx(
          styles.dayButton,
          isPast && styles.dayPast,
          isBlocked && styles.dayBlocked,
          !isBlocked && !isPast && styles.dayFree,
          isArrival && styles.dayArrival,
          isDeparture && styles.dayDeparture,
          isBetween && styles.dayBetween,
          !interactive && styles.dayDisabled,
        )}
        disabled={!interactive || isBlocked || isPast}
        onClick={(event) => {
          event.stopPropagation()
          if (!interactive) return
          handleDayClick(day)
        }}
      >
        <span>{day}</span>
      </button>
    )
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

  const modalNode =
    modalOpen && (hourlyDate || (!hourlyMode && arrivalDate && departureDate && nights)) ? (
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

            <div className={styles.modalHead}>
              <span className={styles.modalEyebrow}>{copy.modalTitle}</span>
              <span className={styles.modalDates}>
                {hourlyDate
                  ? `${formattedHourlyDate} · ${copy.modeHourly}`
                  : `${formattedArrival} – ${formattedDeparture} · ${formattedNights}`}
              </span>
            </div>

            {hourlyEstimate ? (
              <div className={styles.modalEstimate}>
                <div className={styles.modalSteppers}>
                  <div className={styles.personsStepper} role="group" aria-label={copy.hoursLabel}>
                    <span>{copy.hoursLabel}</span>
                    <button type="button" aria-label="−" disabled={hours <= STUDIO_HOURLY_MIN_HOURS} onClick={() => setHours((h) => Math.max(STUDIO_HOURLY_MIN_HOURS, h - 1))}>
                      −
                    </button>
                    <strong>{hours}</strong>
                    <button type="button" aria-label="+" disabled={hours >= STUDIO_HOURLY_MAX_HOURS} onClick={() => setHours((h) => Math.min(STUDIO_HOURLY_MAX_HOURS, h + 1))}>
                      +
                    </button>
                  </div>
                  <div className={styles.personsStepper} role="group" aria-label={copy.personsLabel}>
                    <span>{copy.personsLabel}</span>
                    <button type="button" aria-label="−" disabled={hourlyPersons <= 1} onClick={() => setPersons((p) => Math.max(1, Math.min(p, STUDIO_HOURLY_MAX_PERSONS) - 1))}>
                      −
                    </button>
                    <strong>{hourlyPersons}</strong>
                    <button type="button" aria-label="+" disabled={hourlyPersons >= STUDIO_HOURLY_MAX_PERSONS} onClick={() => setPersons((p) => Math.min(STUDIO_HOURLY_MAX_PERSONS, p + 1))}>
                      +
                    </button>
                  </div>
                </div>
                <span className={styles.estimateValue}>
                  {copy.estimateLabel}: <strong>{formatCzk(hourlyEstimate)}</strong>
                  <small>
                    {hourlyEstimateText}
                    {copy.billedInCzk ? ` · ${copy.billedInCzk}` : ""}
                  </small>
                </span>
              </div>
            ) : null}

            {hourlyEstimate ? (
              <div className={styles.modalUpsell}>
                <span>
                  <strong>{copy.upsellTitle}</strong>
                  {copy.upsellText(formatCzk(prices.day))}
                </span>
                <button type="button" onClick={switchHourlyToStay}>
                  {copy.upsellCta} <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : null}

            {!hourlyDate && studioEstimate ? (
              <div className={styles.modalEstimate}>
                <div className={styles.personsStepper} role="group" aria-label={copy.personsLabel}>
                  <span>{copy.personsLabel}</span>
                  <button type="button" aria-label="−" disabled={persons <= 1} onClick={() => setPersons((p) => Math.max(1, p - 1))}>
                    −
                  </button>
                  <strong>{persons}</strong>
                  <button type="button" aria-label="+" disabled={persons >= STUDIO_MAX_PERSONS} onClick={() => setPersons((p) => Math.min(STUDIO_MAX_PERSONS, p + 1))}>
                    +
                  </button>
                </div>
                <span className={styles.estimateValue}>
                  {copy.estimateLabel}: <strong>{formatCzk(studioEstimate)}</strong>
                  <small>
                    {studioEstimateText}
                    {copy.billedInCzk ? ` · ${copy.billedInCzk}` : ""}
                  </small>
                </span>
              </div>
            ) : null}

            <pre className={styles.emailDraft}>{emailBody}</pre>

            <div className={styles.modalActions}>
              <a href={mailtoHref} className={styles.modalCta}>
                {copy.openInEmail}
              </a>
              <button
                type="button"
                className={cx(styles.modalCta, styles.modalCtaSecondary)}
                onClick={() => {
                  const text = `${emailSubject}\n\n${emailBody}`
                  const done = () => {
                    setCopied(true)
                    window.setTimeout(() => setCopied(false), 2200)
                  }
                  navigator.clipboard?.writeText(text).then(done, () => {
                    // starší prohlížeče: výběr textu a execCommand
                    const area = document.createElement("textarea")
                    area.value = text
                    document.body.appendChild(area)
                    area.select()
                    try {
                      document.execCommand("copy")
                      done()
                    } catch {}
                    area.remove()
                  })
                }}
              >
                {copied ? copy.copied : copy.copyText}
              </button>
            </div>
            <p className={styles.modalMail}>
              {copy.orWriteTo} <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
          </div>
        </div>
      ) : null

  if (studioRoom) {
    return (
      <div
        className={cx(
          styles.studioBooking,
          studioRoom === "main" && styles.studioBookingMain,
          manrope.className,
          nightMode ? styles.nightMode : styles.dayMode,
        )}
      >
        <div className={cx(styles.studioMedia, activeMonth.nightClip && styles.cardMediaNight)} aria-hidden="true">
          {!paused && activeMonth.localVideoSrc ? (
            <SeamlessLoopVideo
              key={activeMonth.localVideoSrc}
              className={styles.cardLocalVideo}
              src={activeMonth.localVideoSrc}
              poster={activeMonth.localPosterSrc ?? undefined}
              playbackRate={BOOKING_VIDEO_PLAYBACK_RATE}
            />
          ) : null}
          {(paused || !activeMonth.localVideoSrc) && activeMonth.localPosterSrc ? (
            <div className={styles.cardLocalPoster} style={{ backgroundImage: `url("${activeMonth.localPosterSrc}")` }} />
          ) : null}
          {!paused && !activeMonth.localVideoSrc && activeMonth.youtubeId ? (
            <FadingYoutube key={activeMonth.youtubeId} videoId={activeMonth.youtubeId} className={styles.cardVideo} />
          ) : null}
        </div>

        <div className={styles.studioCal}>
          <div className={styles.studioHead}>
            <div>
              <h2 className={cx(styles.studioMonth, cormorant.className)}>
                {activeMonth.ghostTitle} <em>{activeMonth.year}</em>
              </h2>
              <span className={styles.studioRoom}>
                {studioRoom === "main" && !hourlyMode ? copy.roomMainWithMill : roomLabel}
              </span>
              {studioRoom === "main" ? (
                <span className={styles.studioPrice}>
                  {hourlyMode ? (
                    hourlyPriceLabel
                  ) : (
                    <>
                      {studioPriceLabel}
                      <br />
                      {copy.studioExtraNote(formatCzk(prices.extra))}
                    </>
                  )}
                </span>
              ) : null}
            </div>
            <div className={styles.arrowGroup}>
              <button
                type="button"
                className={styles.arrowButton}
                aria-label={copy.previous}
                disabled={currentIndex === 0}
                onClick={() => goToIndex(currentIndex - 1)}
              >
                ←
              </button>
              <button
                type="button"
                className={styles.arrowButton}
                aria-label={copy.next}
                disabled={currentIndex === months.length - 1}
                onClick={() => goToIndex(currentIndex + 1)}
              >
                →
              </button>
            </div>
          </div>

          {studioRoom === "main" ? (
            <div className={styles.studioModes} role="tablist">
              {(["stay", "hourly"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={studioMode === mode}
                  className={cx(styles.studioMode, studioMode === mode && styles.studioModeOn)}
                  onClick={() => {
                    setStudioMode(mode)
                    setHourlyDay(null)
                    setSelection({ arrivalMonthIndex: null, arrivalDay: null, departureMonthIndex: null, departureDay: null })
                  }}
                >
                  {mode === "stay" ? copy.modeStay : copy.modeHourly}
                </button>
              ))}
            </div>
          ) : null}

          <div className={styles.weekdays}>
            {copy.weekdays.map((weekday) => (
              <span key={`studio-${weekday}`} className={styles.weekday}>
                {weekday}
              </span>
            ))}
          </div>

          <div
            className={cx(styles.calendarGrid, styles.studioGrid)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {activeMonth.weeks.flat().map((day, cellIndex) => renderDayCell(activeMonth, day, cellIndex, true))}
          </div>

          <div className={styles.calendarLegend} aria-hidden="true">
            {hourlyMode ? null : <span className={styles.legendCheck}>{copy.checkInOut}</span>}
            <span><i className={styles.legendFree} />{copy.legendFree}</span>
            <span><i className={styles.legendBooked} />{copy.legendBooked}</span>
          </div>
        </div>

        {modalNode}
      </div>
    )
  }

  return (
    <div className={cx(styles.bookingPage, embedded && styles.embedded, manrope.className, nightMode ? styles.nightMode : styles.dayMode)}>
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
              <button
                type="button"
                className={cx(styles.btnMode, !nightMode && styles.btnModeOn)}
                aria-pressed={!nightMode}
                aria-label={nightMode ? copy.switchToDay : copy.switchToNight}
                title={nightMode ? copy.switchToDay : copy.switchToNight}
                onClick={toggleMode}
              >
                <span className={styles.modeIcon} aria-hidden="true">
                  {nightMode ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <circle cx="12" cy="12" r="4.2" />
                      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2z" strokeLinejoin="round" />
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
            <div
              className={cx(styles.noticeDock, !bookingNoticeOpen && styles.noticeDockClosed)}
              aria-live="polite"
            >
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
                        <div className={cx(styles.cardMedia, month.nightClip && styles.cardMediaNight)} aria-hidden="true">
                          {!paused && isFront && month.localVideoSrc ? (
                            <SeamlessLoopVideo
                              key={`${month.localVideoSrc}-${paused ? "paused" : "playing"}`}
                              className={styles.cardLocalVideo}
                              src={month.localVideoSrc}
                              poster={month.localPosterSrc ?? undefined}
                              playbackRate={BOOKING_VIDEO_PLAYBACK_RATE}
                            />
                          ) : null}
                          {(paused || !isFront || !month.localVideoSrc) && month.localPosterSrc ? (
                            <div
                              className={styles.cardLocalPoster}
                              style={{ backgroundImage: `url("${month.localPosterSrc}")` }}
                            />
                          ) : null}
                          {!paused && isFront && !month.localVideoSrc && month.youtubeId ? (
                            <FadingYoutube
                              key={`${month.youtubeId}-${paused ? "paused" : "playing"}`}
                              videoId={month.youtubeId}
                              className={styles.cardVideo}
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

                            <div className={styles.weekdays}>
                              {copy.weekdays.map((weekday) => (
                                <span key={`${month.title}-${weekday}`} className={styles.weekday}>
                                  {weekday}
                                </span>
                              ))}
                            </div>

                            <div className={styles.calendarGrid}>
                              {month.weeks.flat().map((day, cellIndex) => renderDayCell(month, day, cellIndex, isFront))}
                            </div>

                            <div className={styles.calendarLegend} aria-hidden="true">
                              {isFront ? <span className={styles.legendCheck}>{copy.checkInOut}</span> : null}
                              <span><i className={styles.legendFree} />{copy.legendFree}</span>
                              <span><i className={styles.legendBooked} />{copy.legendBooked}</span>
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

      {modalNode}
    </div>
  )
}
