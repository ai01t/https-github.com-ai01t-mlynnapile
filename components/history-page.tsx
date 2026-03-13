"use client"

import { Cormorant_Garamond, Manrope } from "next/font/google"
import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import styles from "@/components/history-page.module.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
})

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

const HISTORY_VIDEO_SRC = "/videos/bg/M4QapdIvjkM.mp4"
const HISTORY_VIDEO_POSTER = "/videos/bg/M4QapdIvjkM.gif"
const MODE_STORAGE_KEY = "mlyn_mode"
const LANG_STORAGE_KEY = "mlyn_lang"

type Locale = "cs" | "en" | "de"

type HistoryDetail = {
  year: string
  text: string
}

type HistoryEntry = {
  year: string
  era: string
  title: string
  paragraphs: string[]
  details?: HistoryDetail[]
}

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
  titleTop: string
  titleAccent: string
  introTitle: string
  introParagraphs: string[]
  timelineTitle: string
  timelineIntro: string
  jumpToTimeline: string
  backToMill: string
  previous: string
  next: string
  entries: HistoryEntry[]
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
    titleTop: "Historie",
    titleAccent: "mlýna",
    introTitle: "Vesnice Pila – Šnajberk",
    introParagraphs: [
      "Malebná vesnice Pila, známá pod starobylým názvem Šnajberk, je součástí obce Trhanov v okrese Domažlice. Dominantou jejího středu jsou dva velké rybníky – Velký a Šnajberský.",
      "Název Šnajberk pochází z německého Schneidwerk – řezací stroj, strojní pila – a odkazuje na dřevozpracující provoz, který zde kdysi fungoval po boku mlýna.",
    ],
    timelineTitle: "Historie Mlýna na Pile",
    timelineIntro:
      "Od průmyslových počátků přes mlynářské rody až po dnešní podobu mlýna. Kliknutím na rok přepínáš jednotlivé kapitoly příběhu.",
    jumpToTimeline: "Časová osa",
    backToMill: "Zpět na Mlýn",
    previous: "Předchozí",
    next: "Další",
    entries: [
      {
        year: "1653",
        era: "17. století",
        title: "Vysoká pec, hamr a rybníky",
        paragraphs: [
          "Historie Pily začíná v polovině 17. století, kdy se země vzpamatovávala z třicetileté války. Poptávka po železe přivedla rod Lamingenů, vrchnost trhanovského panství, k založení průmyslových provozů v okolí Čerchova.",
          "Roku 1653 byly v Pile založeny rybníky a vyrostla zde vysoká pec s hamrem. Zásoby dřeva a méně kvalitní železné rudy k tomu přímo vybízely. Osada bývala označována jako Starý Hamr a je zmiňována od roku 1654; v matrikách se železná huť připomíná k roku 1681.",
        ],
      },
      {
        year: "1810",
        era: "Počátek 19. století",
        title: "Od hutě ke mlýnu",
        paragraphs: [
          "Po zrušení vysokých pecí roku 1803 na místě zvaném „V Kychtě“ zbylo množství stavebního materiálu. Po roce 1810 se místo zaniklé hutě a hamru postavil mlýn s pilou – a právě z tohoto období pochází pojmenování Schneidwerk, tedy Pila.",
          "Ke stavbě byly použity mohutné cihly z materiálu zrušených pecí – asi desetkrát větší než dnešní. Jedna se dodnes zachovala na památku u čp. 36. Stavba s úpravou terénu a vodních nádrží trvala do roku 1815. Mlýn měl jedno kolo na svrchní vodu a mlel pro Pec pod Čerchovem a Chodov.",
        ],
      },
      {
        year: "1838",
        era: "19. století",
        title: "Rod Pavlíků – první mlynáři",
        paragraphs: [
          "Prvními mlynáři na Pile byli Pavlíkové z Trhanova, příslušníci starého mlynářského rodu. Do roku 1848 podléhali robotní povinnosti – v archivu se zachovaly záznamy o tom, jak se z ní vyvazovali.",
        ],
        details: [
          {
            year: "1838",
            text: "Martin Pavlík – podlouhlá budova s jedním kolem, v areálu i budova pily.",
          },
          {
            year: "1869",
            text: "František Pavlík (*1811, Trhanov), mlynářský mistr, s manželkou a dcerou.",
          },
          {
            year: "1880",
            text: "Václav Pavlík (*1808, Šnajberk); nájemcem mlynář František Duffek.",
          },
          {
            year: "1882",
            text: "Václav Pavlík nechává na návsi mezi lípami postavit kamenný kříž, dodnes stojící.",
          },
          {
            year: "1890",
            text: "Nájemcem je Antonín Toušek (*1853, Veselí) s rodinou a pomocníky.",
          },
        ],
      },
      {
        year: "1899",
        era: "Přelom století",
        title: "Rodina Ludvíků a poslední mletí",
        paragraphs: [
          "Od roku 1899 převzal mlýn Jan Ludvík (*1864, Pec pod Čerchovem), člen cechu mlynářů ze starobylého rodu usídleného v Domažlicích. Kromě mletí se rodina věnovala i polnímu hospodářství.",
          "Mlelo se „bez chasy“ – bez najatých pomocníků. Mlýn obsluhovali mlynáři sami s rodinnými příslušníky. V záznamech z roku 1930 je uveden František Ludvík s jedním kolem na svrchní vodu na Trhanovském potoce.",
        ],
      },
      {
        year: "1938",
        era: "1938–1945",
        title: "Válečné období",
        paragraphs: [
          "Když po mnichovském diktátu v říjnu 1938 byly zabrány Sudety, trhanovské panství původně nebylo jejich součástí. Hraběnka Schönbornová, majitelka panství, se však se správcem Bohmanem rozhodla žádat v Berlíně o připojení k Říši.",
          "Již 24. listopadu 1938 se obyvatelé Trhanova, Pily i okolních obcí stali obyvateli Velkoněmecké říše. Toto bolestné období zasáhlo celý kraj.",
        ],
      },
      {
        year: "1952",
        era: "Polovina 20. století",
        title: "Konec mletí",
        paragraphs: [
          "Mlýn na Pile je definitivně odstaven. Vodní kolo se zastavilo a skončila tak éra mlynářství, která zde trvala téměř století a půl – od stavby mlýna kolem roku 1810 přes generace Pavlíků a Ludvíků.",
        ],
      },
      {
        year: "1990",
        era: "Novodobá etapa",
        title: "Pila jako součást obce Trhanov",
        paragraphs: [
          "K 24. listopadu 1990 vzniká Pila jako část obce Trhanov v okrese Domažlice. Místo tím vstupuje do nové etapy své novodobé identity a začíná se znovu jasněji zapisovat do mapy regionu.",
          "Na někdejší mlynářský a průmyslový příběh navazuje civilnější kapitola spojená s bydlením, krajinou a postupnou obnovou celého areálu.",
        ],
      },
      {
        year: "1992",
        era: "Přelom tisíciletí",
        title: "Rozsáhlá rekonstrukce",
        paragraphs: [
          "Od roku 1990 se mlýna ujali noví majitelé - manželé Svobodovi, kteří do něj vložili obrovské úsilí – poctivá rekonstrukce, příkup a rekultivace okolních pozemků, stavba zděné pece na chleba i dalšího zázemí.",
        ],
      },
      {
        year: "2026",
        era: "Současnost",
        title: "Retreat studio na mlýně",
        paragraphs: [
          "Příběh Mlýna na Pile nekončí. V roce 2026 zde vzniká studio – nový tvůrčí prostor, který dává historickým zdem nový život a smysl.",
          "Po staletích, kdy mlýn sloužil hutnictví, mlynářství a bydlení, se otevírá jeho dosud nejnovější kapitola. Síla místa a klid zdejší krajiny vytvářejí jedinečné prostředí pro tvůrčí práci.",
          "Přestože vodní kolo už dávno nemele, příběh Mlýna na Pile zůstává živý.",
        ],
      },
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
    pause: "Pause",
    resume: "Play",
    switchToNight: "Switch to night mode",
    switchToDay: "Switch to day mode",
    selectLanguage: "Select language",
    menu: "Menu",
    close: "Close",
    titleTop: "History of",
    titleAccent: "the mill",
    introTitle: "The village of Pila – Šnajberk",
    introParagraphs: [
      "The picturesque village of Pila, known by the old name Šnajberk, is part of Trhanov in the Domažlice district. Two large ponds, Velký and Šnajberský, define its centre.",
      "The name Šnajberk comes from the German word Schneidwerk, meaning a cutting machine or sawmill, and refers to the wood-processing operation that once stood here alongside the mill.",
    ],
    timelineTitle: "History of Mlýn na Pile",
    timelineIntro:
      "From industrial beginnings through the miller families to the present form of the building. Click a year to switch chapters.",
    jumpToTimeline: "Timeline",
    backToMill: "Back to the mill",
    previous: "Previous",
    next: "Next",
    entries: [
      {
        year: "1653",
        era: "17th century",
        title: "Blast furnace, hammer mill and ponds",
        paragraphs: [
          "The history of Pila begins in the mid-17th century, when the land was recovering from the Thirty Years' War. Demand for iron led the Lamingen family, the lords of the Trhanov estate, to establish industrial operations near Čerchov.",
          "In 1653 ponds were founded in Pila and a blast furnace with a hammer mill was built. Supplies of timber and lower-grade iron ore directly encouraged this. The settlement used to be called Starý Hamr and is mentioned from 1654 onward; parish records refer to the ironworks in 1681.",
        ],
      },
      {
        year: "1810",
        era: "Early 19th century",
        title: "From ironworks to mill",
        paragraphs: [
          "After the blast furnaces were closed in 1803 at the place called 'V Kychtě', a large amount of building material remained. After 1810, a mill with a saw was built on the site of the former ironworks and hammer mill, and the name Schneidwerk, later shortened to Pila, dates from this period.",
          "Massive bricks from the dismantled furnaces were used in the construction, roughly ten times larger than today's standard. One survives as a reminder near house no. 36. The building works, including terrain and water system adjustments, continued until 1815. The mill had one overshot wheel and ground grain for Pec pod Čerchovem and Chodov.",
        ],
      },
      {
        year: "1838",
        era: "19th century",
        title: "The Pavlíks – the first millers",
        paragraphs: [
          "The first millers in Pila were the Pavlík family from Trhanov, members of an old milling lineage. Until 1848 they were subject to labour obligations, and archival records show how they gradually bought themselves out of them.",
        ],
        details: [
          {
            year: "1838",
            text: "Martin Pavlík – an elongated building with a single wheel, with a sawmill building in the complex.",
          },
          {
            year: "1869",
            text: "František Pavlík (*1811, Trhanov), master miller, living there with his wife and daughter.",
          },
          {
            year: "1880",
            text: "Václav Pavlík (*1808, Šnajberk); the tenant miller was František Duffek.",
          },
          {
            year: "1882",
            text: "Václav Pavlík had a stone cross erected on the village green between the lime trees; it still stands there today.",
          },
          {
            year: "1890",
            text: "The tenant was Antonín Toušek (*1853, Veselí) with his family and assistants.",
          },
        ],
      },
      {
        year: "1899",
        era: "Turn of the century",
        title: "The Ludvíks and the final years of milling",
        paragraphs: [
          "From 1899 the mill was taken over by Jan Ludvík (*1864, Pec pod Čerchovem), a member of the millers' guild from an old family settled in Domažlice. Besides milling, the family also worked the surrounding fields.",
          "Grinding was done 'without hired hands' – without outside workers. The mill was operated by the millers themselves together with family members. Records from 1930 mention František Ludvík and one overshot water wheel on the Trhanov stream.",
        ],
      },
      {
        year: "1938",
        era: "1938–1945",
        title: "The wartime period",
        paragraphs: [
          "After the Munich Agreement in October 1938, the Trhanov estate was not originally part of the annexed Sudetenland. However, Countess Schönbornová, owner of the estate, together with the administrator Bohman, decided to petition in Berlin for annexation to the Reich.",
          "As early as 24 November 1938, the inhabitants of Trhanov, Pila and the neighbouring villages became citizens of the Greater German Reich. This period brought major changes to the life of the village and the mill.",
        ],
      },
      {
        year: "1952",
        era: "Mid-20th century",
        title: "End of milling",
        paragraphs: [
          "Mlýn na Pile was definitively shut down. The water wheel stopped, and with it ended the milling era that had lasted here for nearly a century and a half, from the construction of the mill around 1810 through the generations of the Pavlík and Ludvík families.",
        ],
      },
      {
        year: "1990",
        era: "Modern era",
        title: "Pila as part of Trhanov",
        paragraphs: [
          "On 24 November 1990, Pila was established as part of the municipality of Trhanov in the Domažlice district. The place thus entered a new phase of its modern identity and became more clearly anchored within the region again.",
          "The former milling and industrial story was followed by a quieter chapter connected with living, landscape and the gradual renewal of the whole site.",
        ],
      },
      {
        year: "1992",
        era: "Present day",
        title: "The mill today",
        paragraphs: [
          "After its working life ended, the mill went through gradual adaptations for residential use. In 1992 it was thoroughly renovated and has stood in its present form ever since.",
          "Although the water wheel no longer turns the millstones, the story of Mlýn na Pile remains alive as a reminder of centuries when the force of water powered life across the whole Chodsko region.",
        ],
      },
      {
        year: "2026",
        era: "Present day",
        title: "A retreat studio at the mill",
        paragraphs: [
          "In 2026, Mlýn na Pile is being fully developed as a retreat studio that connects recording, accommodation and focused creative work within the setting of the historic mill.",
          "The site continues its long story through a new layer: where industry and milling once defined the place, it now offers time, calm, technology and support for music, film and other creative work.",
        ],
      },
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
    pause: "Pause",
    resume: "Abspielen",
    switchToNight: "Zum Nachtmodus wechseln",
    switchToDay: "Zum Tagmodus wechseln",
    selectLanguage: "Sprache wählen",
    menu: "Menü",
    close: "Schließen",
    titleTop: "Geschichte",
    titleAccent: "der Mühle",
    introTitle: "Das Dorf Pila – Šnajberk",
    introParagraphs: [
      "Das malerische Dorf Pila, unter dem alten Namen Šnajberk bekannt, ist Teil der Gemeinde Trhanov im Bezirk Domažlice. Das Zentrum prägen zwei große Teiche: der Velký rybník und der Šnajberský rybník.",
      "Der Name Šnajberk stammt vom deutschen Wort Schneidwerk und verweist auf den holzverarbeitenden Betrieb, der hier einst neben der Mühle existierte.",
    ],
    timelineTitle: "Geschichte der Mühle na Pile",
    timelineIntro:
      "Von den industriellen Anfängen über die Müllerfamilien bis zur heutigen Gestalt des Gebäudes. Ein Klick auf das Jahr öffnet die jeweilige Kapitelansicht.",
    jumpToTimeline: "Zeitleiste",
    backToMill: "Zurück zur Mühle",
    previous: "Zurück",
    next: "Weiter",
    entries: [
      {
        year: "1653",
        era: "17. Jahrhundert",
        title: "Hochofen, Hammerwerk und Teiche",
        paragraphs: [
          "Die Geschichte von Pila beginnt in der Mitte des 17. Jahrhunderts, als sich das Land vom Dreißigjährigen Krieg erholte. Die Nachfrage nach Eisen veranlasste die Familie Lamingen, die Herrschaft des Trhanover Gutes, Industrieanlagen in der Umgebung des Čerchov zu gründen.",
          "Im Jahr 1653 wurden in Pila Teiche angelegt und ein Hochofen mit Hammerwerk errichtet. Die Vorräte an Holz und minderwertigem Eisenerz boten sich dafür direkt an. Die Siedlung wurde einst Starý Hamr genannt und ist seit 1654 belegt; in den Matriken wird die Eisenhütte im Jahr 1681 erwähnt.",
        ],
      },
      {
        year: "1810",
        era: "Anfang des 19. Jahrhunderts",
        title: "Von der Hütte zur Mühle",
        paragraphs: [
          "Nach der Stilllegung der Hochöfen im Jahr 1803 an dem Ort „V Kychtě“ blieb viel Baumaterial zurück. Nach 1810 wurde anstelle der aufgegebenen Hütte und des Hammerwerks eine Mühle mit Säge errichtet – und gerade aus dieser Zeit stammt die Bezeichnung Schneidwerk, also Pila.",
          "Für den Bau wurden mächtige Ziegel aus dem Material der stillgelegten Öfen verwendet, etwa zehnmal größer als heutige. Einer hat sich bis heute als Erinnerung bei Hausnr. 36 erhalten. Der Bau mit Gelände- und Wasseranlagenanpassungen dauerte bis 1815. Die Mühle hatte ein oberschlächtiges Wasserrad und mahlte für Pec pod Čerchovem und Chodov.",
        ],
      },
      {
        year: "1838",
        era: "19. Jahrhundert",
        title: "Die Familie Pavlík – die ersten Müller",
        paragraphs: [
          "Die ersten Müller in Pila waren die Pavlíks aus Trhanov, Angehörige eines alten Müllergeschlechts. Bis 1848 unterlagen sie Frondiensten; im Archiv blieben Aufzeichnungen darüber erhalten, wie sie sich davon freikauften.",
        ],
        details: [
          {
            year: "1838",
            text: "Martin Pavlík – langgestrecktes Gebäude mit einem Wasserrad, dazu ein Sägewerksgebäude im Areal.",
          },
          {
            year: "1869",
            text: "František Pavlík (*1811, Trhanov), Müllermeister, mit Ehefrau und Tochter.",
          },
          {
            year: "1880",
            text: "Václav Pavlík (*1808, Šnajberk); Pächter war der Müller František Duffek.",
          },
          {
            year: "1882",
            text: "Václav Pavlík ließ auf dem Dorfplatz zwischen den Linden ein steinernes Kreuz errichten, das bis heute dort steht.",
          },
          {
            year: "1890",
            text: "Pächter war Antonín Toušek (*1853, Veselí) mit Familie und Gehilfen.",
          },
        ],
      },
      {
        year: "1899",
        era: "Jahrhundertwende",
        title: "Die Familie Ludvík und das letzte Mahlen",
        paragraphs: [
          "Ab 1899 übernahm Jan Ludvík (*1864, Pec pod Čerchovem) die Mühle, Mitglied der Müllerzunft aus einem alten, in Domažlice ansässigen Geschlecht. Neben dem Mahlen betrieb die Familie auch Landwirtschaft.",
          "Gemahlen wurde „ohne Gesinde“, also ohne angestellte Hilfskräfte. Die Mühle bedienten die Müller selbst mit ihren Familienangehörigen. In Aufzeichnungen von 1930 wird František Ludvík mit einem oberschlächtigen Wasserrad am Trhanover Bach erwähnt.",
        ],
      },
      {
        year: "1938",
        era: "1938–1945",
        title: "Die Kriegsjahre",
        paragraphs: [
          "Nach dem Münchner Diktat im Oktober 1938 gehörte das Trhanover Gut zunächst nicht zu den annektierten Sudetengebieten. Die Gräfin Schönbornová, Eigentümerin des Gutes, beschloss jedoch zusammen mit dem Verwalter Bohman, in Berlin um den Anschluss an das Reich zu bitten.",
          "Bereits am 24. November 1938 wurden die Bewohner von Trhanov, Pila und den umliegenden Dörfern zu Einwohnern des Großdeutschen Reiches. Diese Zeit brachte tiefgreifende Veränderungen für das Leben im Dorf und in der Mühle.",
        ],
      },
      {
        year: "1952",
        era: "Mitte des 20. Jahrhunderts",
        title: "Ende des Mahlens",
        paragraphs: [
          "Die Mühle na Pile wurde endgültig stillgelegt. Das Wasserrad kam zum Stillstand, und damit endete eine Müllertradition, die hier fast eineinhalb Jahrhunderte lang bestanden hatte – vom Bau der Mühle um 1810 bis zu den Generationen der Familien Pavlík und Ludvík.",
        ],
      },
      {
        year: "1990",
        era: "Neuere Zeit",
        title: "Pila als Teil der Gemeinde Trhanov",
        paragraphs: [
          "Zum 24. November 1990 entsteht Pila als Teil der Gemeinde Trhanov im Bezirk Domažlice. Damit beginnt eine neue Etappe der neueren Identität des Ortes, der wieder deutlicher auf der Landkarte der Region erscheint.",
          "An die frühere Müller- und Industriegeschichte schließt eine ruhigere Phase an, die mit Wohnen, Landschaft und der schrittweisen Erneuerung des gesamten Areals verbunden ist.",
        ],
      },
      {
        year: "1992",
        era: "Gegenwart",
        title: "Die Mühle heute",
        paragraphs: [
          "Nach dem Ende ihres Betriebs wurde die Mühle schrittweise zu Wohnzwecken umgebaut. Im Jahr 1992 wurde sie gründlich renoviert und steht seitdem in ihrer heutigen Gestalt.",
          "Auch wenn das Wasserrad längst nicht mehr mahlt, lebt die Geschichte von Mlýn na Pile weiter – als Erinnerung an Jahrhunderte, in denen die Kraft des Wassers das Leben im ganzen Chodsko antrieb.",
        ],
      },
      {
        year: "2026",
        era: "Gegenwart",
        title: "Retreat-Studio in der Mühle",
        paragraphs: [
          "Im Jahr 2026 entwickelt sich Mlýn na Pile vollständig zu einem Retreat-Studio, das Recording, Aufenthalt und konzentrierte kreative Arbeit im Umfeld der historischen Mühle verbindet.",
          "Der Ort schreibt damit seine lange Geschichte in einer neuen Form weiter: Wo früher Industrie und Mahlen das Leben bestimmten, bietet er heute Zeit, Ruhe, Technologie und Raum für Musik, Film und andere kreative Arbeit.",
        ],
      },
    ],
  },
}

const localeNames: Record<Locale, string> = {
  cs: "Čeština",
  en: "English",
  de: "Deutsch",
}

function getLocaleHomePath(locale: Locale) {
  return locale === "cs" ? "/" : `/?lang=${locale}`
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
  video.defaultPlaybackRate = 1
  video.playbackRate = 1

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

const TIMELINE_INSET_PX = 24
const MIN_TIMELINE_GAP_RATIO = 0.045
const TIMELINE_POSITION_BLEND = 0.62

function getTimelinePositions(entries: HistoryEntry[]) {
  if (entries.length <= 1) {
    return [0]
  }

  const years = entries.map((entry) => Number.parseInt(entry.year, 10))
  if (years.some((year) => Number.isNaN(year))) {
    return entries.map((_, index) => index / (entries.length - 1))
  }

  const minYear = years[0]
  const maxYear = years[years.length - 1]
  const totalSpan = maxYear - minYear

  if (totalSpan <= 0) {
    return entries.map((_, index) => index / (entries.length - 1))
  }

  const positions = years.map((year, index) => {
    const rawPosition = (year - minYear) / totalSpan
    const evenPosition = index / (entries.length - 1)
    return rawPosition * TIMELINE_POSITION_BLEND + evenPosition * (1 - TIMELINE_POSITION_BLEND)
  })
  for (let index = 1; index < positions.length; index += 1) {
    positions[index] = Math.max(positions[index], positions[index - 1] + MIN_TIMELINE_GAP_RATIO)
  }

  const lastPosition = positions[positions.length - 1]
  if (lastPosition > 1) {
    return positions.map((position) => position / lastPosition)
  }

  return positions
}

export default function HistoryPage({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale]
  const router = useRouter()
  const searchParams = useSearchParams()
  const embedded = searchParams.get("embed") === "1"
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const langSwitchRef = useRef<HTMLDivElement | null>(null)
  const timelineSectionRef = useRef<HTMLElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [navScrolled, setNavScrolled] = useState(false)
  const [paused, setPaused] = useState(false)
  const [nightMode, setNightMode] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [localPlaying, setLocalPlaying] = useState(false)

  const activeItem = copy.entries[activeIndex]
  const timelinePositions = getTimelinePositions(copy.entries)
  const isLastTimelineStep = activeIndex === copy.entries.length - 1

  const scrollToTimeline = (behavior: ScrollBehavior = "smooth") => {
    const timelineSection = timelineSectionRef.current
    if (!timelineSection) {
      return
    }

    const nav = embedded ? null : (document.querySelector(`.${styles.nav}`) as HTMLElement | null)
    const navOffset = nav ? nav.getBoundingClientRect().height + 12 : embedded ? 24 : 84
    const targetTop = timelineSection.getBoundingClientRect().top + window.scrollY - navOffset

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior,
    })
  }

  useEffect(() => {
    document.documentElement.lang = locale
    document.body.style.background = "#07060a"
    const previousHtmlSnapType = document.documentElement.style.scrollSnapType
    const previousBodySnapType = document.body.style.scrollSnapType

    document.documentElement.style.scrollSnapType = "y proximity"
    document.body.style.scrollSnapType = "y proximity"

    try {
      setNightMode(window.localStorage.getItem(MODE_STORAGE_KEY) === "night")
      window.localStorage.setItem(LANG_STORAGE_KEY, locale)
    } catch {}

    return () => {
      document.body.style.background = ""
      document.documentElement.style.scrollSnapType = previousHtmlSnapType
      document.body.style.scrollSnapType = previousBodySnapType
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => Math.min(current + 1, copy.entries.length - 1))
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => Math.max(current - 1, 0))
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [copy.entries.length])

  useEffect(() => {
    const requestedYear = searchParams.get("year")
    if (!requestedYear) {
      return
    }

    const matchIndex = copy.entries.findIndex((entry) => entry.year === requestedYear)
    if (matchIndex >= 0) {
      setActiveIndex(matchIndex)
    }
  }, [copy.entries, searchParams])

  useLayoutEffect(() => {
    const shouldJumpToTimeline = window.location.hash === "#timeline" || Boolean(searchParams.get("year"))

    if (!shouldJumpToTimeline) {
      return
    }

    scrollToTimeline("auto")
  }, [searchParams])

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === "#timeline") {
        scrollToTimeline("smooth")
      }
    }

    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

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
    const onWaiting = () => {
      if (!paused) {
        setLocalPlaying(false)
      }
    }
    const onSuspend = () => tryStart()
    const onEmptied = () => tryStart(true)

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
    router.push(getHistoryPath(nextLocale))
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

  const activeProgress = timelinePositions[activeIndex] ?? 0
  const progressWidth = `calc((100% - ${TIMELINE_INSET_PX * 2}px) * ${activeProgress})`

  const handleTimelineJump = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}#timeline`)
    scrollToTimeline("smooth")
  }

  return (
    <main
      className={cx(
        styles.historyPage,
        embedded && styles.embedded,
        manrope.className,
        nightMode && styles.nightMode,
        videoReady && styles.videoReady,
        localPlaying && styles.localPlaying,
      )}
    >
      <div className={styles.bgShell} aria-hidden="true">
        <div className={styles.bgPoster} style={{ backgroundImage: `url("${HISTORY_VIDEO_POSTER}")` }} />
        <video
          ref={localVideoRef}
          className={styles.bgLocalVideo}
          src={HISTORY_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HISTORY_VIDEO_POSTER}
          x-webkit-airplay="deny"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
          tabIndex={-1}
          aria-hidden="true"
        />
        <div className={styles.bgOverlay} />
      </div>

      {!embedded ? (
        <>
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

              <div ref={langSwitchRef} className={cx(styles.langSwitch, langOpen && styles.langSwitchOpen)}>
                <button
                  className={styles.btnLang}
                  type="button"
                  aria-label={copy.selectLanguage}
                  aria-haspopup="true"
                  aria-expanded={langOpen}
                  onClick={() => setLangOpen((current) => !current)}
                >
                  <span className={styles.langIcon} aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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

              <button className={styles.hamburger} type="button" aria-label={copy.menu} onClick={() => setMobileNavOpen(true)}>
                <span className={styles.hamburgerLabel}>{copy.menu.toUpperCase()}</span>
              </button>
            </div>
          </nav>

          <div className={cx(styles.mobileNav, mobileNavOpen && styles.mobileNavOpen)}>
            <button className={styles.closeNav} type="button" onClick={() => setMobileNavOpen(false)}>
              {copy.close}
            </button>
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className={cormorant.className} onClick={() => setMobileNavOpen(false)}>
                {item.label}
              </a>
            ))}
          </div>
        </>
      ) : null}

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={cx(styles.heroTitle, cormorant.className)}>
            {copy.titleTop}
            <br />
            <em>{copy.titleAccent}</em>
          </h1>

          <article className={styles.storyCard}>
            <h2 className={cx(styles.storyTitle, cormorant.className)}>{copy.introTitle}</h2>
            {copy.introParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <a href="#timeline" className={styles.scrollCue} onClick={handleTimelineJump}>
              <span>{copy.jumpToTimeline}</span>
              <span className={styles.scrollCueArrow} aria-hidden="true">
                ↓
              </span>
            </a>
          </article>
        </div>
      </section>

      <section id="timeline" ref={timelineSectionRef} className={styles.timelineSection}>
        <div className={styles.timelineInner}>
          <div className={styles.timelineHeader}>
            <h2 className={cx(styles.timelineHeading, cormorant.className)}>{copy.timelineTitle}</h2>
          </div>

          <div className={styles.timelineRailWrap}>
            <div className={styles.timelineRail}>
              <div className={styles.timelineProgress} style={{ width: progressWidth }} />
              {copy.entries.map((entry, index) => (
                <button
                  key={entry.year}
                  type="button"
                  className={cx(
                    styles.timelinePoint,
                    index === activeIndex && styles.timelinePointActive,
                    index < activeIndex && styles.timelinePointPassed,
                  )}
                  aria-pressed={index === activeIndex}
                  aria-label={`${entry.year} ${entry.title}`}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    left: `calc(${TIMELINE_INSET_PX}px + (100% - ${TIMELINE_INSET_PX * 2}px) * ${timelinePositions[index] ?? 0})`,
                  }}
                >
                  <span className={styles.pointYear}>{entry.year}</span>
                  <span className={styles.pointDot} />
                </button>
              ))}
            </div>
          </div>

          <article className={styles.timelineCard} aria-live="polite">
            <p className={styles.timelineEra}>{activeItem.era}</p>
            <h3 className={cx(styles.timelineCardTitle, cormorant.className)}>{activeItem.title}</h3>

            <div className={styles.timelineBody}>
              {activeItem.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {activeItem.details?.length ? (
              <div className={styles.detailGrid}>
                {activeItem.details.map((detail) => (
                  <div key={`${detail.year}-${detail.text}`} className={styles.detailItem}>
                    <span className={cx(styles.detailYear, cormorant.className)}>{detail.year}</span>
                    <span className={styles.detailText}>{detail.text}</span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className={styles.timelineActions}>
              <button
                type="button"
                className={styles.timelineArrow}
                aria-label={copy.previous}
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex((current) => Math.max(current - 1, 0))}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.timelineArrow}
                aria-label={copy.next}
                disabled={activeIndex === copy.entries.length - 1}
                onClick={() => setActiveIndex((current) => Math.min(current + 1, copy.entries.length - 1))}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {!embedded ? (
              <div className={cx(styles.timelineFooter, isLastTimelineStep && styles.timelineFooterVisible)}>
                <Link href={getLocaleHomePath(locale)} className={styles.footerLink}>
                  {copy.backToMill}
                </Link>
              </div>
            ) : null}
          </article>
        </div>
      </section>
    </main>
  )
}
