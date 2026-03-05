"use client"
import React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BusinessCardDownload } from "@/components/business-card-download"
import { Play, Pause, Home, Guitar, Mic, Headphones, Calendar, MapPin, Phone, Moon, Sun, ChevronDown, Globe, Car, UtensilsCrossed, Languages, Ghost, FileText, Shield, Mail, HelpCircle, CigaretteOff, Hotel, Music, Camera, Medal as Pedal, Drum as Drums, Plug, EqualIcon as Equalize, Wand, Waves, Sparkles, Cable, Settings, Server, Keyboard, ChevronRight, ChevronLeft, Zap } from "lucide-react"

const sectionOrder = ["mlyn", "home", "studio", "lokalita", "equipment", "about", "contact", "spoluprace"]
const observableSections = ["mlyn", "studio", "lokalita", "equipment", "contact", "about"] as const
const VIDEO_CROSSFADE_MS = 2000
const SECTION_VIDEO_IDLE_MS = 10000

const translations = {
  cs: {
    nav: {
      mlyn: "Mlýn",
      studio: "Studio",
      equipment: "Vybavení",
      location: "Lokalita",
      about: "O nás",
      contact: "Kontakt",
    },
    mlyn: {
      title: "Mlýn na Pile",
      subtitle: "Retreat Studio",
      tagline: "Kde se rodí inspirace",
      description: "Unikátní prostor s genius loci, jehož historie sahá do 17. století.",
      vintageInstruments: "Vintage Nástroje",
      vintageDesc: "60s-80s Fender, Gibson, VOX",
      accommodation: "Stylové ubytování",
      accommodationDesc: "4 pokoje, zimní zahrada 63m², finská sauna",
      locationCard: "Lokalita",
      locationDesc: "Krásná příroda - rekreační oblast, soukromí a vlastní park",
      studios: "Studia",
      studiosDesc: "Velké studio 64m²\nStudio mlýnice 25m²\nKontrolní místnost 27m²",
      modernTech: "Moderní technologie",
      modernTechDesc: "Universal Audio Apollo x8p Studio+\n76 UAD pluginů, Logic\u00A0Pro\u00A0X\nApple Pro Display XDR 6K",
      benefits: "Další benefity",
      benefitsDesc:
        " Vlastní zdroj elektrické energie, zapůjčení elektromobilu, kol, nabíjecí stanice, zabezpečené prostory",
      endMessage: "Užijte si prezentaci!",
      darkMode: "Noční režim zapnutý - klikněte pro denní režim",
      lightMode: "Denní režim zapnutý - klikněte pro noční režim",
    },
      studio: {
      title: "Mlýn na Pile",
      subtitle: "Tři unikátní prostory pro vaši kreativitu",
      description: "Od hlavního studia přes studio mlýnice do kontrolní místnosti",
      mainStudio: "Hlavní Studio",
      mainStudioSize: "64 m²",
      mainStudioDesc:
        "Hlavní studio se nachází v podkrovní galerii, přímo nad mlýnicí, které prostoru dodávají autentickou atmosféru starého mlýna. Přirozené světlo sem proniká střešními okny a velkým francouzským oknem s balkonem, odkud se otevírá výhled na klidný rybník. Místo, kde se propojuje vůně dřeva, teplo vintage nástrojů a ticho okolní přírody — ideální prostor pro tvorbu, nahrávání i soustředěnou práci.",
      equipment: "Vybavení",
      equipmentHighlights: [
        "Fender Vintage, Custom Shop kytary",
        "Gibson Les Paul Studio, Explorer",
        "Lampové aparáty Marshall, Fender, Mesa Boogie, Ampeg",
        "Rozsáhlá kolekce boutique efektů",
        "Mapex Saturn bicí & K-Zildjian činely",
      ],
      controlRoom: "Kontrolní místnost",
      controlRoomSize: "27 m²",
      controlRoomDesc:
        "Apple, včetně periferiíí apple pro pohodlnou práci navíc 6K Apple Pro XRD vhodný i pro grafiky a střihání videí. Plynule regulovatelné osvětlení místnosti. Prostor s krásným výhledem a knihovnou.",
      technology: "Technologie",
      millstoneStudio: "Studio mlýnice",
      millstoneSize: "25 m² - Bývalá mlýnice",
      millstoneDesc:
        "Vysoké stropy a unikátní akustika historické mlýnice. Ideální pro akustické nahrávky a experimentální projekty.",
      ctaTitle: "Kontaktujte nás a domluvme si návštěvu studia",
      ctaDesc: "",
      ctaButton: "Kontaktovat",
      accommodation: {
        title: "Nahrávání + Ubytování",
        subtitle:
          "Jednotlivé balíčky jsou seřazeny od nejekonomičtějších až po VIP - pojmenovali jsme je podle našich songů :-) Zapůjčení studia je včetně hudební aparatury a nástrojů. Ke všem balíčkům je snídaně/brunch  v zimní zahradě, včetně domácího chleba z pece a neomezené konzumace kávy a nápojů :-). Free wifi a parkování v areálu, s možností nabití EV. Studia jsou energeticky soběstačná, takže vaše nahrávání není ohroženo případnými výpadky proudu. Cena za zapůjčení studia, včetně veškerého vybavení je od 29900,-/den pro kapelu včetně jejího týmu, plus podpora z naší strany - vše je koncpiováno tak aby jste sem doslova mohli přijet vlakem bez ničeho a začít tvořit a nahrávat a ničím se nezdržovat. Cena je pro variantu pro max 7 lidí. Další varianty jsou k jednání. ",
        intro: "Jdeme na to:",
        packageLabel: "Balíček",
        parking: "U všech balíčků je možnost parkovat v areálu mlýna, který je pod kamerovým systémem.",
        accommodationNote: "Ubytování je součástí pobytu ve studiu během kreativní práce.",
        packages: [
          {
            name: "Into the Wild",
            tags: "#Hlavní studio #Snídaně v zimní zahradě",
            description:
              "Nejekonomičtější - stanování v parku, zapůjčení pouze studia, pro dobrodruhy a nadšence, usínejte a probouzejte se do světa hudby s přírodou :-)",
            details:
              "Možnost přespání ve vlastním autě/karavanu/stanu. Hlavní studio má vlastní sociální zařízení včetně sprchy.",
            video: "https://youtu.be/7RVXPBnHb-c",
          },
          {
            name: "Underwater",
            tags: "#Hlavní studio #Sauna",
            description:
              "Nejblíže k hudbě, spaní doslova pod podlahou studia a také i pod hladinou rybníka :-) Skromné ale stylové a útulné přespání, jedná se o spaní přímo v prostorách bývalé mlýnice.",
            details:
              "Zde můžete usínat za zvuků protékající vody - stačí pootevřít okno :-) - součástí je i možnost využít saunu + posezení pod hrází vedle velké pece. 1x dvojlůžko, možnost dalších dvou přistýlek.",
            video: "https://youtu.be/uQiXLcspREY",
          },
          {
            name: "Otherside",
            tags: "#Kontrolní místnost #Staročeská světnice #Dva pokoje #TV",
            description:
              "Z druhé strany studia můžete využít pro postprodukci 6K Apple Pro XDR včetně komplet periferií od Apple (Magic Trackpad, Magic Mouse, Apple Magic Keyboard) pro pohodlnou práci + ubytování ve staročeské světnici.",
            details:
              "Vhodné jak pro zpracování vaší práce ve studiích, tak i pro nehudební aktivity (např. grafiky, digitální tvůrce), finální zpracování nahrávek.",
            video: "https://youtu.be/X7lvikbWnMQ",
          },
          {
            name: "Fuel",
            tags: "#VIP balíček",
            description:
              "Tato varianta se jmenuje podle našeho songu Fuel a i podle songu od Metallicy, protože tohle je fakt asi pro Metallicu, (ale nebojte napsat a určitě se domluvíme).",
            details:
              "Jedná se VIP pronájem celé nemovitosti s plným servisem, včetně zimní zahrady kde si můžete dát výbornou kávu a vejdete se sem s celým týmem nebo si zde můžete užít klid mezitím co bude zbytek teamu pracovat ve studiu. Profi catering, roztopení velké pece. Vynikající pizza i chleba - který si můžete zkusit sami upéct a to nám věřte - to je radost a zážitek, který si užijete :-). Dále zapůjčení Tesla model X v ceně, popř. včetně řidiče s možností navštívit zajímavá místa v okolí (viz. [lokalita]) :-)",
            video: "https://youtu.be/5INpfHr0lu4",
          },
        ],
        bonuses: {
          title: "Další bonusy",
          items: [
            'Součástí pobytu je snídaně/brunch a vždy čerstvý kváskový <a href="/chleba" target="_blank" rel="noopener noreferrer" class="underline text-white/90 hover:text-white">chleba</a> z pece :-)',
            "Můžete si zvednout stavidlo a pustit vodu na mlýn. 😄💧",
            
            "Pro Dana Bártu (a ostatní milovníky přírody): Jsou tu vážky, krásné a je jich hodně :-) 🦋 Létají až do zimní zahrady a jsou dost rozumné na to, aby po prohlídce zase odletěly, aniž by narážely do skla. Kromě nich tu najdete i invazivní rostliny (křídlatka a škumpa), se kterými statečně bojujeme. 🌿⚔️ Rostou tu ale také sekvoje obrovské, které – přiznáváme – nemáme srdce porazit. 🌲💚",
            "Pod okny studia jsou často Labutě s labuťátky, které se nechají krmit. 🦢",
            "U sousedky Dády si můžete projet na koních. 🐴",
            "I za bílého dne, zde můžete potkat ježky, kuny, srnky přímo na zahradě. Když utečou Dádě koně, tak si s nimi můžete dát kafe prakticky v zimní zahradě :-) 🦔🦌☕",
            "Můžete potkat i tlustou veverku, co vyvrací plaňky - zvířata se zde mají skvěle :-) Máme i volavky a u sousedů štěně a pár kamarádských koček (také od různých sousedů), žáby a krtky (naše) :-) 🐿️🐕🐈",
            "Žijeme se zvířaty v symbióze a spolupracujeme, tento rok byl vstup do studia navíc zabezpečen i sršním hnízdem hned nad vstupem, které pro příští roky už neplánujeme a nahradíme ho modernějšími technologiemi. Děkujeme. (Žádní sršni nepřišli k úhoně – nechali jsme je dožít v klidu. 🐝) ⚡",
            "Čerstvá bio zelenina, výborné hroznové víno, chmel. Celkově je tady tráva zelenější a díky krtkům je vidět krásná černozem. :-D 🥬🍇🌿",
            "Vše podtrhuje ticho a klid, přitom do Domažlic je to jak z Národní na Palmovku (8 minut). 🤫🌳",
            "V neposlední řadě, fajn sousedi ze všech stran a hospůdka Bidlo se sympatickou obsluhou a krásným výhledem na rybník a mlýn z druhé strany. Tady si můžete dát Plzeň a kdyby jste chtěli si dát víc piv a druhý den fungovat ve studiu, doporučujeme výlet do pivovaru v Domažlicích a držet se pouze Domažlické desítky, po které můžete bez problémů druhý den fungovat (Doporučeno paní sládkovou a několikrát pro vás otestováno, že je to pravda :-) 🍺🏡",
            "Ráno můžete skočit i do rybníka, ale nikdo to nedělá... ale jako můžete :-) 🏊‍♂️",
            "V noci je tu nebe plné hvězd. ✨🌟",
          ],
        },
      },
    },
    location: {
      title: "Lokalita",
      subtitle: "Klidné místo v srdci Evropy, blízko všeho důležitého",
      nature: "Krásná příroda - rekreační oblast, soukromí a vlastní park",
      naturePara1:
        "Pila u Trhanov je ideální lokalitou pro milovníky krásné přírody, soukromí a aktivního odpočinku. Pozemek má rozlohu přes 6500 m² a nabízí klidné prostředí s několika poseděními a dvěma potůčky, které dotvářejí harmonickou atmosféru.",
      naturePara2:
        "Z Pily se pohodlně dostanete pěšky jak do Domažlic, tak na vrchol nejvyšší hory Českého lesa, Čerchov (1042 m), která láká turisty rozhlednou a nádhernými výhledy. Okolí je bohaté na značené cyklotrasy i pěší stezky vedoucí malebnou krajinou, ideální pro vyznavače přírody a historie.",
      naturePara3:
        "Celý kraj je známý svou zelení, čerstvým vzduchem a klidem, což vytváří perfektní podmínky pro všechny hledající únik z ruchu města a zároveň kvalitní základnu pro výlety a poznávání kulturních i přírodních zajímavostí regionu.",
      quote:
        "Našli jsme za mě dokonalou lokalitu a nádherný historický objekt starého mlýna o který se chceme podělit. Chceme toto místo ještě pozvednout dál - o kreativní lidi, kteří zde budou mít otevřené dveře a kde budou vznikat skvělé věci.",
      transport: "Dopravní dostupnost",
      byCar: "Autem",
      byTrain: "Vlakem",
      byPlane: "Letadlem",
      availabilityItems: [
        "Autem: 10 min do centra Domažlic",
        "10 min na německé hranice",
        "Vlakem: Vlaková zastávka přímo na Pile",
        "Letadlem: 1h 45min z Prague Airport",
        "Letadlem: 2h 30min z Mnichov Airport (MUC), Německo",
        "Tesla nabíjecí stanice",
        "Nezávislost na energetické síti",
      ],
      teslaTitle: "Tesla nabíjecí stanice",
      teslaDesc: "Nabíjení Tesla přímo v areálu",
      energyTitle: "Energetická nezávislost",
      energyDesc: "Záložní zdroj pro nerušenou práci",
      events: "Tipy na výlety",
      domazliceTitle: "Domažlice (8 min)",
      domazliceItems: ["Historické náměstí", "Muzeum Chodska", "Kostel sv. Vavřince", "Kulturní akce a festivaly"],
      horsovskytynTitle: "Horšovský Týn (15 min)",
      horsovskytynItems: ["Renesanční zámek", "Prohlídky zámku", "Letní kulturní akce"],
      babylonTitle: "Babylon (10 min)",
      babylonItems: ["Aquapark Babylon", "Centrum Babylon"],
      chamTitle: "Cham, Německo (20 min)",
      chamClub: "Klub LA CHAM",
      chamDescription: "Známý hudební klub s pravidelnými koncerty",
      domazliceEvents: [
        { month: "Květen", event: "Otevřené ateliéry" },
        { month: "Červenec", event: "Chodské slavnosti" },
        { month: "Srpen", event: "Filmový festival" },
        { month: "Říjen", event: "Festival dechových hudeb" },
      ],
      horsovskytynEvents: [
        { month: "Červen", event: "Festival klasické hudby" },
        { month: "Červenec", event: "Divadelní léto" },
        { month: "Září", event: "Vinný košt" },
      ],
      babylonEvents: [{ month: "Celoročně", event: "Koncerty a zábavní akce" }],
      germanyTitle: "Německo (blízko)",
      germanyItems: ["Koupaliště v Bad Kötztingu", "Výlety do Bavorského lesa", "Nákupy v městech na hranici"],
    },
    equipment: {
      title: "Vybavení",
      subtitle: "Profesionální nástroje a technologie",
      recordingHardware: "Audio Interface",
      apolloTitle: "Universal Audio Apollo X8P Studio+ Gen 2",
      apolloSpecs: [
        "Elite-class Apollo X Gen 2 AD/DA převodníky s 24-bit / 192 kHz rozlišením",
        "Dual-Crystal Clocking pro ultra nízký jitter při všech vzorkovacích frekvencích",
        "16 x 22 Thunderbolt 3 audio interface s HEXA Core DSP procesorem",
        "8 Unison™ mikrofonních předzesilovačů, 2 Hi-Z instrumentální vstupy",
        "DB-25 vstup (line 1-8), 2 optické Toslink I/O (ADAT S/MUX nebo S/PDIF)",
        "Word clock I/O (BNC)",
        '2x 1/4" monitor výstupy, DB-25 výstup (ALT / 7.1 surround)',
        '2x 1/4" TRS sluchátkové výstupy',
        "Vylepšené D/A pro kritické monitorování a přehrávání se 130 dB dynamickým rozsahem a THD -127 dB",
        "Kalibrace hlavních monitorových a sluchátkových výstupů pomocí Apollo Monitor Correction od Sonarworks",
        "Plně vybavený monitor controller s přepínáním reproduktorů a integrovaným talkbackem",
        "Aktualizovaná UAD Console aplikace s Auto-Gain, Plug-In Scenes, subwoofer integrací s Bass Management, podporou immersive audio a dalšími funkcemi",
        "Onboard DSP podporuje přes 200 UAD plug-inů přes VST, AU a AAX 64 formáty ve všech hlavních DAW",
      ],
      collectionNote: "Sbírka je průběžně aktualizována, viz.",
      collaborationLink: "spolupráce",
      detailsNote: "Nástroje jsou pravidelně servisované a připravené k použití.",
      vintageInstruments: "Vintage Nástroje (60s-80s)",
      guitars: "Kytary",
      acousticGuitars: "Akustické kytary",
      basses: "Basa",
      ampsAndCabs: "Zesilovače a Boxy",
      amps: "Zesilovače",
      cabs: "Boxy",
      effects: "Efekty",
      mics: "Mikrofony",
      drums: "Bicí",
      drumsKit: "Bicí souprava: Mapex Saturn V MH Exotic",
      drumsKitDetails: [
        'Basový buben: 22" x 18"',
        'Tomy: 10" x 7" a 12" x 8"',
        'Floor tomy (kotle): 14" x 12" a 16" x 14"',
        "Korpusy: Kombinace javoru a ořechu (tomy 6 vrstev / 5,1 mm, basový buben 8 vrstev / 7,5 mm)",
        "Technologie: Hrany SONIClear™ pro lepší rezonanci a snadnější ladění",
        "Konfigurace: Studioease",
      ],
      drumsSnare: "Snare Drum (Rytmičák)",
      drumsSnareDetails: ["Model: Tama S.L.P. LST148 Big Black Steel", 'Rozměr: 14" x 8" (ocelový korpus)'],
      drumsCymbals: "Činely",
      drumsCymbalsDetails: [
        'Hi-hat: 14" Zildjian K Sweet Hi-Hat',
        'Crash: 18" Zildjian K Custom Hybrid Crash',
        'Ride: 20" Sabian AAX Heavy Ride',
        "China: Istanbul Mehmet (Handmade Turkey)",
        'Splash: 10" Meinl Mb8 Splash',
      ],
      drumsHardware: "Hardware a doplňky",
      drumsHardwareDetails: [
        "Sedačka: DW 9000 Series Air Lift (pneumatická stolička)",
        "Pedál: Mapex (řada Armory)",
        "Blány: Remo Powerstroke (basový buben) a Evans (snare)",
        "Stojany: Kombinace značek Mapex a Tama",
      ],
      infrastructure: "Infrastruktura",
      uaPlugins: "Universal Audio Pluginy",
      thankYouNote: "Děkujeme",
      noraCollaboration: "Děkujeme kytaristovi Radkovi Fořtovi z kapely",
      noraBand: "NORA",
      noraLink: "https://open.spotify.com/track/1jzCR4iPOo3bCEo67VsvaW?si=fb770e4a9679489f&nd=1&dlsi=1ca88705a71d401c",
      noraCollaborationEnd: "za zapůjčení nástrojů z jeho sbírky",
      cables: "Odposlechy, sluchátka, kabely a stojany",
    },
    about: {
      title: "O nás",
      subtitle: "Kde se rodí inspirace v srdci Evropy",
      tagline: "Vintage duše, moderní technologie",
      history: "Historie mlýna",
      historyTimeline: [
        { year: "1653", desc: "Založení rybníků a postavení vysoké pece a hamru" },
        { year: "1810", desc: "Mlýn s pilou poháněnou vodní silou" },
        {
          year: "1990",
          desc: "Pila vznikla k 24. listopadu 1990 jako část obce Trhanov v okrese Domažlice",
        },
        { year: "2024", desc: "Transformace na prémiové kreativní retreat studio" },
      ],
      accommodation: "Ubytování",
      accommodationRooms: "Prostory pro ubytování",
      masterSuite: "Master Suite (63 m²)",
      masterSuiteDesc: "Prostorný apartmán s výhledem na rybník, včetně zimní zahrady a vlastním sociálním zařízením.",
      fourRooms: "Další pokoje",
      fourRoomsDesc: "4 stylově zařízené pokoje s možností přistýlek a 4K TV",
      commonSpaces: "Společné prostory",
      commonSpacesItems: [
        "Prostorná zimní zahrada s posezením a krbem (63 m²)",
        "Společenská místnost s domácím kinem",
        "Venkovní terasa s výhledem na rybník",
        "Krbové posezení v zahradě",
      ],
      finnishSauna: "Finská sauna",
      finnishSaunaItems: ["Kapacita 5 osob", "Relaxační zóna s výhledem do přírody", "Možnost ochlazení v jezírku"],
      parkOutdoor: "Park a Exteriér",
      parkOutdoorItems: [
        "Rozlehlý park s možností stanování a grilování",
        "Lesopark s potokem a rybníkem",
        "Soukromé parkoviště s nabíjecí stanicí pro elektromobily",
        "Možnost zapůjčení kol",
      ],
      catering: "Catering",
      cateringItems: [
        { title: "Snídaně", desc: "Formou bufetu, s lokálními produkty." },
        {
          title: "Obědy a večeře",
          desc: "Možnost zajištění cateringu dle Vašeho přání, od jednoduchých jídel po profi katering.",
        },
        { title: "Nápoje", desc: "Široký výběr nealkoholických a alkoholických nápojů, včetně místních piv a vín." },
      ],
      founders: "Zakladatelé",
      foundersIntro:
        "Mlýn Šnajberk Studios založili Jindřich Traxmandl a Andrea Kohoutová s vizí vytvořit unikátní prostor, kde se hudba, umění a příroda prolínají v dokonalé harmonii.",
      jindrichDesc:
        "Kytarista kapely Anteater, nadšenec do moderních technologií, který nedá dopustit na klasické vintage nástroje a aparáty.",
      jindrichQuote:
        "Pracujeme na tom, aby u nás muzikanti našli inspirativní prostor dokonale připravený pro tvorbu. Mlýn má svůj genius loci a duši – a stejnou energii nesou i nástroje a vintage aparáty, které jsou zde k dispozici. V harmonii s nimi zde moderní technologie nenápadně podporují pohodlí a profesionální podmínky pro zachycení každého hudebního nápadu. Naším cílem je vytvořit krásné, klidné a pohodové prostředí, kam se lidé budou rádi vracet. Dveře máme otevřené všem kreativním lidem, nejen hudebníkům. Věříme, že právě tato kombinace – prostor s duší, nástroje s příběhem a moderní technologie v pozadí – se stane motorem a synergií pro vznik úžasných věcí.",
      andreaDesc:
        "Zpěvačka a baskytaristka kapely Anteater, také archeoložka a aktuálně hlavní pekařka na mlýně :-). Právě zde v prostředí starého mlýna se všechny tyto její vášně přirozeně propojují. Andrea spoluvytváří domáckou a inspirativní atmosféru studia. Pokud budete chtít o půlnoci uvařit kakao (a nebo nazpívat druhé hlasy), neváhejte se obrátit právě na Andreu (v případě technických problémů pak na Jindru :)) Teď ale vážně: vzájemně se doplňujeme a snažíme se mnohdy z našich různých pohledů na svět inspirovat. Andrea aktuálně peče <a href=\"/chleba\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"underline text-white/90 hover:text-white\">kváskový chleba</a> na mlýně, který je součástí každé snídaně nebo brunche.",
      collaboration: "Spolupráce a Rezervace",
      collaborationPara1Strong: "Hledáme partnery,",
      collaborationPara1:
        " kteří sdílejí naši vášeň pro hudbu a kvalitu.",
      collaborationPara2Strong: "Stavíte kytary, efektové pedály nebo zesilovače?",
      collaborationPara2:
        "Vedle věhlasných značek jako Fender, Gibson či Martin chceme dát prostor i těm, kteří vyrábějí něco skutečně výjimečného – nástrojům a vybavení, které si zaslouží pozornost. ",
      collaborationPara2End:
        " Chcete, aby se k vašim produktům dostali zajímaví zákazníci a umělci mohli u nás vaše výrobky nejen vyzkoušet, ale případně i přímo zakoupit? Přijeďte se za námi podívat a nezávazně si popovídat – rádi poznáváme zajímavé lidi, kteří něco tvoří. Vše si chceme nejdříve důkladně vyzkoušet. Máte-li zájem umístit zde své produkty nebo uspořádat výstavu, natočit zde propagační video, neváhejte nás kontaktovat.",
      collaborationFormsTitle: "Formy spolupráce:",
      collaborationForms: [
        "Integrace značky – autentické umístění produktu",
        "Tvorba obsahu – dokumentární projekty a výukové návody",
        "Umělecké rezidence – dlouhodobá kreativní partnerství",
        "Testování vybavení – ověřování v reálném provozu se zpětnou vazbou",
        "Vzdělávací programy – mistrovské kurzy a workshopy",
      ],
      faq: "Často kladené otázky",
      faqItems: [
        {
          q: "Straší na mlýně?",
          a: "Ne ;-)",
        },
        {
          q: "Jste plátci DPH?",
          a: "Ano, jsme plátci DPH. Všechny ceny na webu jsou uvedeny včetně DPH.",
        },
        {
          q: "Lze pronajmout celý objekt?",
          a: "Ano. Celý komplex lze rezervovat minimálně na 3 dny.",
        },
        {
          q: "Smí se v mlýně kouřit?",
          a: "Nesmí. Mlýn je z velké části ze dřeva, je zde hodně protipožárních ochran, které by okamžitě spustili hlasitý poplacha a vzdálené notifikace - tzn. pokud si přivezete vlastní nástroje, budou v bezpečí.",
        },
        {
          q: "Mohu si dovézt vlastní aparaturu a je objekt dostatečně zabezpečen?",
          a: "Samozřejmě můžete, aparatura se dá vyložit přímo před studiem. Objekt je zabezpečen na několika úrovních, současně je na hrázy kde projede jen jedno auto. Vykrást takový objekt s aparaturou, která by opravdu těžko veřejně prodávala úplně nedává smysl... Zlodějům bychom nedoporučovali s ohledem na výše zmíněné okolnosti, nad tím vůbec uvažovat.... ;-)",
        },
        {
          q: "Poskytujete ubytování i samostatně?",
          a: "Ubytování je součástí pobytu ve studiu během kreativní práce.",
        },
        {
          q: "Jak se k nám dostanu?",
          a: "Autem: přímý přístup, soukromé parkování. Vlakem: 10 min pěšky ze stanice Trhanov. Letecky: 1h 45min z letiště Praha, 2h z letiště Mnichov, pick-up služba k dispozici.",
        },
        {
          q: "Mohu přijet i sám, nebo je akce určena pouze pro kapely a týmy?",
          a: "Jasně - pro sólo umělce je k dispozici i looper Plethora X5 od TC Electronic. ;-)",
        },
        {
          q: "Máte catering, nebo si musím řešit jídlo sám?",
          a: "Součástí pobytu je vždy snídaně nebo brunch a vždy domácí kváskový <a href=\"/chleba\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"underline\">chleba</a>, který pečeme ve venkovní peci. Flexibilní možnosti stravování: In-house catering s lokálními ingrediencemi, pizza pec pro společné večeře (až 8 pizz), plně vybavená kuchyň pro vlastní vaření, rozvoz z místních restaurací z Domažlic.",
        },
        {
          q: "Mluvíte anglicky/německy?",
          a: "Vícejazyčný tým: Čeština - rodilí mluvčí, Angličtina - plynule (Jindřich, Andrea, tech tým), Němčina - konverzační úroveň (regionální výhoda), překladatelské služby pro smlouvy.",
        },
        {
          q: "Mohu přijet s dětmi i se psem?",
          a: "Ano, všichni jsou vítáni. Jsou zde omalovánky, knížky, hračky na zahradu i na ven. Pejsci jsou také vítáni, ale pozor - pozemek není komplet oplocen.",
        },
        {
          q: "Během pobytu jsme si u vás oblíbili konkrétní kytarový rig. Je možné zapůjčení na dohrávky ve studiu, kde dokončujeme materiál k desce?",
          a: "Ano, samozřejmě. Po předchozí domluvě je možné vybraný kytarový chain zapůjčit i na následné dohrávky. (Pozn. pouze nástroje,které vlastníme, zbytek je na dohodě.)",
        },
      ],
    },
    contact: {
      title: "Kontakt",
      availability: "Dopravní dostupnost",
      availabilityItems: [
        "Autem: 10 min do centra Domažlic",
        "10 min na německé hranice",
        "Vlakem: Vlaková zastávka přímo na Pile",
        "Letadlem: 1h 45min z Prague Airport",
        "Letadlem: 2h 30min z Mnichov Airport (MUC), Německo",
      ],
    },
  },
  en: {
    nav: {
      mlyn: "Mill",
      studio: "Studio",
      equipment: "Equipment",
      location: "Location",
      about: "About",
      contact: "Contact",
    },
    mlyn: {
      title: "Mill at Pila",
      subtitle: "Retreat Studio",
      tagline: "Where inspiration is born",
      description: "A unique space with genius loci, whose history dates back to the 17th century.",
      vintageInstruments: "Vintage Instruments",
      vintageDesc: "60s-80s Fender, Gibson, VOX",
      accommodation: "Stylish Accommodation",
      accommodationDesc: "4 rooms, winter garden 63m², Finnish sauna",
      locationCard: "Location",
      locationDesc: "Beautiful nature - recreational area, privacy and private park",
      studios: "Studios",
      studiosDesc: "Main studio 64m²\nMillstone studio 25m²\nControl Room 27m²",
      modernTech: "Modern Technology",
      modernTechDesc: "Universal Audio Apollo x8p Studio+\n76 UAD plugins, Logic\u00A0Pro\u00A0X\nApple Pro Display XDR 6K",
      benefits: "Additional Benefits",
      benefitsDesc: "Electric car rental, bikes, charging station, own power source, secured premises",
      endMessage: "Enjoy the presentation!",
      darkMode: "Dark mode enabled - click to switch to light mode",
      lightMode: "Light mode enabled - click to switch to dark mode",
    },
    studio: {
      title: "Mill at Pila",
      subtitle: "Three unique spaces for your creativity",
      description: "From main studio through Millstone studio to control room",
      mainStudio: "Main Studio",
      mainStudioSize: "64 m²",
      mainStudioDesc:
        "The main studio is located in an attic gallery with exposed original beams that give the space an authentic atmosphere of an old mill. Natural light enters through skylights and a large French window with a balcony overlooking a peaceful pond. A place where the scent of wood, warmth of vintage instruments and silence of surrounding nature merge — ideal space for creation, recording and focused work.",
      equipment: "Equipment",
      equipmentHighlights: [
        "Fender vintage and Custom Shop guitars",
        "Gibson Les Paul Studio, Explorer",
        "Tube amps: Marshall, Fender, Mesa Boogie, Ampeg",
        "Extensive collection of boutique effects",
        "Mapex Saturn drums & K-Zildjian cymbals",
      ],
      controlRoom: "Control Room",
      controlRoomSize: "27 m²",
      controlRoomDesc:
        "Apple setup including peripherals for comfortable work, plus a 6K Apple Pro XRD suitable for graphics and video editing. Smoothly adjustable room lighting. A space with a beautiful view and a library.",
      technology: "Technology",
      millstoneStudio: "Millstone Studio",
      millstoneSize: "25 m² - Former mill room",
      millstoneDesc:
        "High ceilings and unique acoustics of the historic mill room. Ideal for acoustic recordings and experimental projects.",
      ctaTitle: "Contact us and let's arrange a studio visit",
      ctaDesc: "",
      ctaButton: "Contact Us",
      accommodation: {
        title: "RECORDING + ACCOMMODATION",
        subtitle:
          "Packages are ordered from the most economical to VIP — we named them after our songs :-) Studio rental includes musical gear and instruments. All packages include breakfast/brunch in the winter garden, including homemade bread from the oven :-). Free wifi and parking on site, with EV charging available. The studios are energy self‑sufficient, so your recording is not threatened by possible power outages.",
        intro: "Let's go:",
        packageLabel: "Package",
        parking: "All packages include parking in the mill area, which is under camera surveillance.",
        accommodationNote: "Accommodation is part of the studio stay during creative work.",
        packages: [
          {
            name: "Into the Wild",
            tags: "#Main studio #Breakfast in the winter garden",
            description:
              "Most economical – camping in the park, studio rental only, for adventurers and enthusiasts, fall asleep and wake up to the world of music with nature :-)",
            details:
              "Option to sleep in your own car/caravan/tent. Main studio has its own facilities including shower.",
            video: "https://youtu.be/7RVXPBnHb-c",
          },
          {
            name: "Underwater",
            tags: "#Main studio #Sauna",
            description:
              "Closest to the music, sleeping literally under the studio floor and also below the pond surface :-) Modest but stylish and cozy stay, sleeping directly in the former mill room.",
            details:
              "Here you can fall asleep to the sound of flowing water — just crack the window :-) — includes access to sauna + seating under the dam next to the large oven. 1x double bed, possibility of two extra beds.",
            video: "https://youtu.be/uQiXLcspREY",
          },
          {
            name: "Otherside",
            tags: "#Control room #Traditional Czech room #Two rooms",
            description:
              "From the other side of the studio you can use a 6K Apple Pro XDR for post‑production, including full Apple peripherals (Magic Trackpad, Magic Mouse, Apple Magic Keyboard) for comfortable work + accommodation in a traditional Czech room.",
            details:
              "Suitable both for processing your studio work and for non‑musical activities (e.g., graphics, digital creators), final processing of recordings.",
            video: "https://youtu.be/X7lvikbWnMQ",
          },
          {
            name: "Fuel",
            tags: "#VIP package",
            description:
              "This option is named after our song Fuel and also after Metallica's song, because this is really for Metallica (but don't hesitate to write and we'll definitely work something out).",
            details:
              "This is a VIP rental of the entire property with full service, including a winter garden where you can enjoy excellent coffee and fit your whole team or enjoy peace while the rest of the team works in the studio. Professional catering, firing up the large oven. Excellent pizza and bread — which you can try baking yourself and believe us — that's a joy and an experience you'll enjoy :-). Tesla Model X rental included in the price, optionally with a driver to visit interesting places in the area (see [location]) :-)",
            video: "https://youtu.be/5INpfHr0lu4",
          },
        ],
        bonuses: {
          title: "Additional Bonuses",
          items: [
            'Breakfast/brunch is included with every stay, and there is always fresh sourdough <a href="/chleba" target="_blank" rel="noopener noreferrer" class="underline text-white/90 hover:text-white">bread</a> from the oven :-)',
            "You can raise the weir and let water flow to the mill. 😄💧",
            "At night, the sky is like North Korea – stars everywhere. ✨🌟",
            "For Dan Bárta (and other nature lovers): There are dragonflies here, beautiful and plentiful :-) 🦋 They fly into the winter garden and are sensible enough to fly back out after a look without hitting the glass. Besides them, you'll find invasive plants (knotweed and sumac) that we bravely fight. 🌿⚔️ But there are also giant sequoias growing here, which – we admit – we don't have the heart to cut down. 🌲💚",
            "Under the studio windows, there are often swans with cygnets that let you feed them. 🦢",
            "At neighbor Dáda's, you can go horse riding. 🐴",
            "Even during the day, you can encounter hedgehogs, martens, deer right in the garden. When Dáda's horses escape, you can have coffee with them practically in the winter garden :-) 🦔🦌☕",
            "You can also meet a fat squirrel that tears up fence boards — animals do great here :-) We also have herons and neighbors have a puppy and a couple of friendly cats (also from various neighbors), frogs and moles (ours) :-) 🐿️🐕🐈",
            "We live in symbiosis with animals and cooperate; this year the studio entrance was additionally secured by a hornet nest right above the entrance, which we do not plan for next years and will replace with more modern technologies. Thank you. (No hornets were harmed — we let them live out their lives in peace. 🐝) ⚡",
            "Fresh organic vegetables, excellent grapes, hops. Overall the grass is greener here and thanks to moles you can see beautiful black soil. :-D 🥬🍇🌿",
            "Everything is underscored by silence and calm, yet Domažlice is as close as Národní to Palmovka (8 minutes). 🤫🌳",
            "Last but not least, nice neighbors from all sides and the Bidlo pub with friendly service and a beautiful view of the pond and the mill from the other side. Here you can have a Pilsen and if you want to have more beers and function in the studio the next day, we recommend a trip to the brewery in Domažlice and sticking only to Domažlice 10° beer, after which you can function without problems the next day (Recommended by the brewmaster and tested for you several times that it's true :-) 🍺🏡",
            "In the morning you can jump into the pond, but nobody does... but you can :-) 🏊‍♂️",
          ],
        },
      },
    },
    location: {
      title: "Location",
      subtitle: "Peaceful place in the heart of Europe, close to everything important",
      nature: "Beautiful Nature - Recreational Area, Privacy, and Private Park",
      naturePara1:
        "Pila near Trhanov is an ideal location for lovers of beautiful nature, privacy, and active relaxation. The property covers over 6,500 m² and offers a calm environment with several seating areas and two streams that create a harmonious atmosphere.",
      naturePara2:
        "From Pila you can easily walk to Domažlice or to the summit of the highest mountain of the Czech Forest, Čerchov (1042 m), which attracts visitors with a lookout tower and beautiful views. The area is rich in marked cycling routes and hiking trails through a picturesque landscape—ideal for nature and history lovers.",
      naturePara3:
        "The whole region is known for its greenery, fresh air, and calm, creating perfect conditions for anyone seeking an escape from city bustle while still having an excellent base for trips and discovering the region’s cultural and natural highlights.",
      quote:
        "We found the perfect location for us and a beautiful historic mill that we want to share. We want to elevate this place even further—with creative people who will have open doors here and where great things will be created.",
      transport: "Transport Accessibility",
      byCar: "By Car",
      byTrain: "By Train",
      byPlane: "By Plane",
      availabilityItems: [
        "By Car: 10 min to Domažlice center",
        "10 min to German border",
        "By Train: Train stop directly in Pila",
        "By Plane: 1h 45min from Prague Airport",
        "By Plane: 2h 30min from Munich Airport (MUC), Germany",
        "Tesla charging station",
        "Independence from the energy grid",
      ],
      teslaTitle: "Tesla Charging Station",
      teslaDesc: "On-site Tesla charging",
      energyTitle: "Energy grid independence",
      energyDesc: "Backup power for uninterrupted workflow",
      events: "Trip Suggestions",
      domazliceTitle: "Domažlice (8 min)",
      domazliceItems: ["Historic square", "Chodsko Museum", "St. Lawrence Church", "Cultural events and festivals"],
      horsovskytynTitle: "Horšovský Týn (15 min)",
      horsovskytynItems: ["Renaissance castle", "Castle tours", "Summer cultural events"],
      babylonTitle: "Babylon (10 min)",
      babylonItems: ["Babylon Aquapark", "Babylon Centre"],
      chamTitle: "Cham, Germany (20 min)",
      chamClub: "LA CHAM Club",
      chamDescription: "A well-known music club with regular concerts",
      domazliceEvents: [
        { month: "May", event: "Open Studios" },
        { month: "July", event: "Chodsko Festivals" },
        { month: "August", event: "Film Festival" },
        { month: "October", event: "Brass Band Festival" },
      ],
      horsovskytynEvents: [
        { month: "June", event: "Classical Music Festival" },
        { month: "July", event: "Theater Summer" },
        { month: "September", event: "Wine Tasting" },
      ],
      babylonEvents: [{ month: "All year round", event: "Concerts and entertainment events" }],
      germanyTitle: "Germany (nearby)",
      germanyItems: ["Swimming pool in Bad Kötzting", "Trips to the Bavarian Forest", "Shopping in border towns"],
    },
    equipment: {
      title: "Equipment",
      subtitle: "Professional instruments and technology",
      recordingHardware: "Audio Interface",
      apolloTitle: "Universal Audio Apollo X8P Studio+ Gen 2",
      apolloSpecs: [
        "Elite-class Apollo X Gen 2 AD/DA converters with 24-bit / 192 kHz resolution",
        "Dual-Crystal Clocking for ultra-low jitter at all sample rates",
        "16 x 22 Thunderbolt 3 audio interface with HEXA Core DSP processor",
        "8 Unison™ mic preamps, 2 Hi-Z instrument inputs",
        "DB-25 input (line 1-8), 2 optical Toslink I/O (ADAT S/MUX or S/PDIF)",
        "Word clock I/O (BNC)",
        '2x 1/4" monitor outputs, DB-25 output (ALT / 7.1 surround)',
        '2x 1/4" headphone outputs',
        "Enhanced D/A for critical monitoring and playback with 130 dB dynamic range and THD of -127 dB",
        "Calibrate main monitor and headphone outputs with Apollo Monitor Correction powered by Sonarworks",
        "Fully-featured monitor controller with alternate speaker switching and integrated talkback",
        "Updated UAD Console app featuring Auto-Gain, Plug-In Scenes, subwoofer integration with Bass Management, immersive audio support, and more",
        "Onboard DSP supports over 200 UAD plug-ins via VST, AU, and AAX 64 formats in all major DAWs",
      ],
      collectionNote: "The collection is continuously updated, see",
      collaborationLink: "collaboration",
      detailsNote: "Instruments are regularly serviced and ready for use.",
      vintageInstruments: "Vintage Instruments (60s-80s)",
      guitars: "Guitars",
      acousticGuitars: "Acoustic Guitars",
      basses: "Bass",
      ampsAndCabs: "Amps and Cabinets",
      amps: "Amplifiers",
      cabs: "Cabinets",
      effects: "Effects",
      mics: "Microphones",
      drums: "Drums",
      drumsKit: "Drum Kit: Mapex Saturn V MH Exotic",
      drumsKitDetails: [
        'Bass drum: 22" x 18"',
        'Toms: 10" x 7" and 12" x 8"',
        'Floor toms: 14" x 12" and 16" x 14"',
        "Shells: Maple and walnut combination (toms 6 plies / 5.1 mm, bass drum 8 plies / 7.5 mm)",
        "Technology: SONIClear™ edges for better resonance and easier tuning",
        "Configuration: Studioease",
      ],
      drumsSnare: "Snare Drum",
      drumsSnareDetails: ["Model: Tama S.L.P. LST148 Big Black Steel", 'Size: 14" x 8" (steel shell)'],
      drumsCymbals: "Cymbals",
      drumsCymbalsDetails: [
        'Hi-hat: 14" Zildjian K Sweet Hi-Hat',
        'Crash: 18" Zildjian K Custom Hybrid Crash',
        'Ride: 20" Sabian AAX Heavy Ride',
        "China: Istanbul Mehmet (Handmade Turkey)",
        'Splash: 10" Meinl Mb8 Splash',
      ],
      drumsHardware: "Hardware and Accessories",
      drumsHardwareDetails: [
        "Throne: DW 9000 Series Air Lift (pneumatic throne)",
        "Pedal: Mapex (Armory series)",
        "Drumheads: Remo Powerstroke (bass drum) and Evans (snare)",
        "Stands: Combination of Mapex and Tama brands",
      ],
      infrastructure: "Infrastructure",
      uaPlugins: "Universal Audio Plugins",
      thankYouNote: "Thank you",
      noraCollaboration: "We thank guitarist Radek Fořt from the band",
      noraBand: "NORA",
      noraLink: "https://open.spotify.com/track/1jzCR4iPOo3bCEo67VsvaW?si=fb770e4a9679489f&nd=1&dlsi=1ca88705a71d401c",
      noraCollaborationEnd: "for lending instruments from his collection",
      cables: "Monitors, headphones, cables and stands",
    },
    about: {
      title: "About Us",
      subtitle: "Where inspiration is born in the heart of Europe",
      tagline: "Vintage soul, modern technology",
      history: "History of the mill",
      historyTimeline: [
        { year: "1653", desc: "Founding of ponds and construction of the blast furnace and hammer mill" },
        { year: "1810", desc: "Mill with a sawmill powered by water force" },
        {
          year: "1990",
          desc: "Pila was established on November 24, 1990, as part of the municipality of Trhanov in the Domažlice district",
        },
        { year: "2024", desc: "Transformation into a premium creative retreat studio" },
      ],
      accommodation: "Accommodation",
      accommodationRooms: "Accommodation Spaces",
      masterSuite: "Master Suite (63 m²)",
      masterSuiteDesc: "Spacious suite with a pond view, including a winter garden and private bathroom.",
      fourRooms: "Other Rooms",
      fourRoomsDesc: "4 stylishly furnished rooms with the possibility of extra beds and 4K TV",
      commonSpaces: "Common Areas",
      commonSpacesItems: [
        "Spacious winter garden with seating and fireplace (63 m²)",
        "Lounge with home cinema",
        "Outdoor terrace overlooking the pond",
        "Fireplace seating in the garden",
      ],
      finnishSauna: "Finnish Sauna",
      finnishSaunaItems: [
        "Capacity for 5 people",
        "Relaxation area with nature views",
        "Option to cool off in the pond",
      ],
      parkOutdoor: "Park and Outdoor Area",
      parkOutdoorItems: [
        "Extensive park with camping and barbecue facilities",
        "Forest park with stream and pond",
        "Private parking with an electric car charging station",
        "Bicycle rental available",
      ],
      catering: "Catering",
      cateringItems: [
        { title: "Breakfast", desc: "Buffet style, with local products." },
        {
          title: "Lunches and dinners",
          desc: "Catering can be arranged according to your wishes, from simple meals to professional catering.",
        },
        {
          title: "Beverages",
          desc: "Wide selection of non-alcoholic and alcoholic beverages, including local beers and wines.",
        },
      ],
      founders: "Founders",
      foundersIntro:
        "Mlýn Šnajberk Studios was founded by Jindřich Traxmandl and Andrea Kohoutová with the vision of creating a unique space where music, art, and nature blend in perfect harmony.",
      jindrichDesc:
        "Guitarist of the band Anteater, an enthusiast of modern technologies, who insists on classic vintage instruments and amplifiers.",
      jindrichQuote:
        "We are working to ensure that musicians find an inspiring space here, perfectly prepared for creation. The mill has its genius loci and soul – and the instruments and vintage amplifiers available here carry the same energy. In harmony with them, modern technologies subtly support comfort and professional conditions for capturing every musical idea. Our goal is to create a beautiful, peaceful, and comfortable environment that people will want to return to. Our doors are open to all creative people, not just musicians. We believe that this combination – a space with soul, instruments with a story, and modern technology in the background – will become the engine and synergy for creating amazing things.",
      andreaDesc:
        "Singer and bassist of the band Anteater, also an archaeologist and currently the head baker at the mill :-). Right here in the old mill environment, all these passions naturally connect. Andrea co-creates the homey and inspiring atmosphere of the studio. If you want to make cocoa at midnight (or sing backing vocals), don't hesitate to turn to Andrea (in case of technical problems, then to Jindřich :)) But seriously now: we complement each other and draw inspiration from our different perspectives on the world. Andrea currently bakes <a href=\"/chleba\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"underline text-white/90 hover:text-white\">sourdough bread</a> at the mill, which is part of every breakfast or brunch.",
      collaboration: "Collaboration and Reservations",
      collaborationPara1Strong: "We are looking for partners,",
      collaborationPara1:
        " who share our passion for music and quality.",
      collaborationPara2Strong: "Do you build guitars, effect pedals, or amplifiers?",
      collaborationPara2:
        "Alongside renowned brands like Fender, Gibson, and Martin, we want to give space to those who make something truly exceptional – instruments and equipment that deserve attention. ",
      collaborationPara2End:
        "Do you want interesting customers to discover your products, and artists to not only try them here but potentially purchase them as well? Come visit us and have a casual chat – we love meeting interesting people who create. We want to thoroughly test everything first. If you'd like to place your products here, host an exhibition, or shoot a promotional video, don't hesitate to contact us.",
      collaborationFormsTitle: "Forms of Collaboration:",
      collaborationForms: [
        "Brand integration – authentic product placement",
        "Content creation – documentary projects and educational guides",
        "Artistic residences – long-term creative partnerships",
        "Equipment testing – verification in real operation with feedback",
        "Educational programs – masterclasses and workshops",
      ],
      faq: "Frequently Asked Questions",
      faqItems: [
        {
          q: "Is the mill haunted?",
          a: "No ;-)",
        },
        {
          q: "Are you VAT registered?",
          a: "Yes, we are VAT registered. All prices on the website include VAT.",
        },
        {
          q: "Is it possible to rent the entire property?",
          a: "Yes. The entire complex can be booked for a minimum of 3 days.",
        },
        {
          q: "Is smoking allowed in the mill?",
          a: "No. The mill is largely made of wood and has extensive fire protection systems that would immediately trigger loud alarms and remote notifications - meaning if you bring your own instruments, they will be safe.",
        },
        {
          q: "Can I bring my own equipment and is the property sufficiently secured?",
          a: "Of course, you can. Equipment can be unloaded directly in front of the studio. The property is secured on several levels, and there is only one access road. Stealing such a property with equipment that would be difficult to sell publicly wouldn't make much sense... We would not recommend thieves to even consider it, given the above circumstances.... ;-)",
        },
        {
          q: "Do you provide accommodation separately?",
          a: "Accommodation is part of the studio stay during creative work.",
        },
        {
          q: "How do I get to you?",
          a: "By car: direct access, private parking. By train: 10 min walk from Trhanov station. By plane: 1h 45min from Prague Airport, 2h from Munich Airport, pick-up service available.",
        },
        {
          q: "Can I come alone, or is this only for bands and teams?",
          a: "Of course - for solo artists, we also have the Plethora X5 looper from TC Electronic available. ;-)",
        },
        {
          q: "Do you have catering, or do I need to arrange food myself?",
          a: "Breakfast or brunch is always included, along with homemade sourdough <a href=\"/chleba\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"underline\">bread</a> baked in our outdoor oven. Flexible dining options: In-house catering with local ingredients, pizza oven for group dinners (up to 8 pizzas), fully equipped kitchen for self-catering, delivery from local Domažlice restaurants.",
        },
        {
          q: "Do you speak English/German?",
          a: "Multilingual team: Czech - native speakers, English - fluent (Jindřich, Andrea, tech team), German - conversational level (regional advantage), translation services for contracts.",
        },
        {
          q: "Can I come with children and a dog?",
          a: "Yes, everyone is welcome. There are coloring books, books, toys for the garden and outdoors. Dogs are also welcome, but please note - the property is not fully fenced.",
        },
        {
          q: "During our stay we loved a specific guitar chain. Is it possible to borrow it for overdubs at the studio where we’re finishing the album?",
          a: "Yes, of course. With prior arrangement, a selected guitar chain can also be borrowed for subsequent overdubs. (Note: only instruments we own; the rest is by agreement.)",
        },
      ],
    },
    contact: {
      title: "Contact",
      availability: "Transport Accessibility",
      availabilityItems: [
        "By Car: 10 min to Domažlice center",
        "10 min to German border",
        "By Train: Train stop directly in Pila",
        "By Plane: 1h 45min from Prague Airport",
        "By Plane: 2h 30min from Munich Airport (MUC), Germany",
      ],
    },
  },
  de: {
    nav: {
      mlyn: "Mühle",
      studio: "Studio",
      equipment: "Ausstattung",
      location: "Lage",
      about: "Über uns",
      contact: "Kontakt",
    },
    mlyn: {
      title: "Mühle in Pila",
      subtitle: "Retreat Studio",
      tagline: "Wo Inspiration entsteht",
      description: "Ein einzigartiger Ort mit Genius Loci, dessen Geschichte bis ins 17. Jahrhundert zurückreicht.",
      vintageInstruments: "Vintage-Instrumente",
      vintageDesc: "60s-80s Fender, Gibson, VOX",
      accommodation: "Stilvolle Unterkunft",
      accommodationDesc: "4 Zimmer, Wintergarten 63m², finnische Sauna",
      locationCard: "Lage",
      locationDesc: "Schöne Natur - Erholungsgebiet, Privatsphäre und eigener Park",
      studios: "Studios",
      studiosDesc: "Hauptstudio 64m²\nMühlstein-Studio 25m²\nControl Room 27m²",
      modernTech: "Moderne Technologie",
      modernTechDesc: "Universal Audio Apollo x8p Studio+\n76 UAD-Plugins, Logic\u00A0Pro\u00A0X\nApple Pro Display XDR 6K",
      benefits: "Weitere Vorteile",
      benefitsDesc: "Elektroauto-Verleih, Fahrräder, Ladestation, eigene Stromquelle, gesicherte Räumlichkeiten",
      endMessage: "Genießen Sie die Präsentation!",
      darkMode: "Dunkelmodus aktiviert - klicken Sie, um zum hellen Modus zu wechseln",
      lightMode: "Heller Modus aktiviert - klicken Sie, um zum dunklen Modus zu wechseln",
    },
    studio: {
      title: "Mühle in Pila",
      subtitle: "Drei einzigartige Räume für Ihre Kreativität",
      description: "Vom Hauptstudio über das Mühlstein-Studio bis zum Control Room",
      mainStudio: "Hauptstudio",
      mainStudioSize: "64 m²",
      mainStudioDesc:
        "Das Hauptstudio befindet sich in einer Dachgalerie mit freiliegenden Originalbalken, die dem Raum eine authentische Atmosphäre einer alten Mühle verleihen. Natürliches Licht dringt durch Dachfenster und ein großes französisches Fenster mit Balkon ein, von dem aus man einen Blick auf einen ruhigen Teich hat. Ein Ort, an dem sich der Duft von Holz, die Wärme von Vintage-Instrumenten und die Stille der umgebenden Natur verbinden — idealer Raum für Kreation, Aufnahme und konzentrierte Arbeit.",
      equipment: "Ausstattung",
      equipmentHighlights: [
        "Fender Vintage- und Custom-Shop-Gitarren",
        "Gibson Les Paul Studio, Explorer",
        "Röhrenamps: Marshall, Fender, Mesa Boogie, Ampeg",
        "Umfangreiche Sammlung an Boutique-Effekten",
        "Mapex Saturn Drums & K-Zildjian Becken",
      ],
      controlRoom: "Kontrollraum",
      controlRoomSize: "27 m²",
      controlRoomDesc:
        "Apple‑Setup inklusive Peripherie für komfortables Arbeiten, plus 6K Apple Pro XRD geeignet für Grafik und Videoschnitt. Stufenlos regelbare Raumbeleuchtung. Ein Raum mit schönem Ausblick und Bibliothek.",
      technology: "Technologie",
      millstoneStudio: "Mühlstein-Studio",
      millstoneSize: "25 m² - Ehemaliger Mühlenraum",
      millstoneDesc:
        "Hohe Decken und einzigartige Akustik des historischen Mühlenraums. Ideal für akustische Aufnahmen und experimentelle Projekte.",
      ctaTitle: "Kontaktieren Sie uns und vereinbaren Sie einen Studiobesuch",
      ctaDesc: "",
      ctaButton: "Kontakt",
      accommodation: {
        title: "AUFNAHME + UNTERKUNFT",
        subtitle:
          "Die einzelnen Pakete sind von den wirtschaftlichsten bis zu VIP sortiert – wir haben sie nach unseren Songs benannt :-) Die Studiovermietung umfasst Musikausrüstung und Instrumente. Zu allen Paketen gehört Frühstück/Brunch im Wintergarten, einschließlich hausgemachtem Brot aus dem Ofen :-). Kostenloses WLAN und Parken vor Ort, mit EV‑Lademöglichkeit. Die Studios sind energetisch autark, sodass Ihre Aufnahme nicht durch mögliche Stromausfälle gefährdet ist.",
        intro: "Los geht's:",
        packageLabel: "Paket",
        parking: "Bei allen Paketen können Sie im Mühlenbereich parken, der videoüberwacht ist.",
        accommodationNote: "Die Unterkunft ist Teil des Studioaufenthalts während der kreativen Arbeit.",
        packages: [
          {
            name: "Into the Wild",
            tags: "#Hauptstudio #Frühstück im Wintergarten",
            description:
              "Am wirtschaftlichsten – Camping im Park, nur Studiomiete, für Abenteurer und Enthusiasten, schlafen Sie ein und wachen Sie in der Welt der Musik mit der Natur auf :-)",
            details:
              "Möglichkeit im eigenen Auto/Wohnwagen/Zelt zu schlafen. Das Hauptstudio verfügt über eigene Einrichtungen inklusive Dusche.",
            video: "https://youtu.be/7RVXPBnHb-c",
          },
          {
            name: "Underwater",
            tags: "#Hauptstudio #Sauna",
            description:
              "Am nächsten zur Musik, schlafen buchstäblich unter dem Studioboden und auch unter der Teichoberfläche :-) Bescheidene, aber stilvolle und gemütliche Unterkunft, Schlafen direkt in den Räumen der ehemaligen Mühle.",
            details:
              "Hier können Sie zu den Klängen des fließenden Wassers einschlafen – öffnen Sie einfach das Fenster :-) – beinhaltet Zugang zur Sauna + Sitzgelegenheit unter dem Damm neben dem großen Ofen. 1x Doppelbett, Möglichkeit von zwei Zustellbetten.",
            video: "https://youtu.be/uQiXLcspREY",
          },
          {
            name: "Otherside",
            tags: "#Kontrollraum #Traditionelles tschechisches Zimmer #Zwei Zimmer",
            description:
              "Von der anderen Seite des Studios aus können Sie den 6K Apple Pro XDR für die Nachbearbeitung nutzen, komplett mit Apple-Peripheriegeräten (Magic Trackpad, Magic Mouse, Apple Magic Keyboard) für komfortables Arbeiten + Unterkunft in einem traditionellen tschechischen Zimmer.",
            details:
              "Geeignet sowohl für die Verarbeitung Ihrer Studioarbeit als auch für nicht‑musikalische Aktivitäten (z.B. Grafik, digitale Kreative), finale Aufnahmeverarbeitung.",
            video: "https://youtu.be/X7lvikbWnMQ",
          },
          {
            name: "Fuel",
            tags: "#VIP-Paket",
            description:
              "Diese Variante ist nach unserem Song Fuel und auch nach dem Song von Metallica benannt, denn das ist wirklich für Metallica, (aber zögern Sie nicht zu schreiben und wir werden uns sicher einigen).",
            details:
              "Dies ist eine VIP‑Vermietung des gesamten Anwesens mit vollem Service, einschließlich eines Wintergartens, wo Sie ausgezeichneten Kaffee genießen können und Ihr ganzes Team Platz hat oder Ruhe genießen können, während der Rest des Teams im Studio arbeitet. Profi‑Catering, Anheizen des großen Ofens. Ausgezeichnete Pizza und Brot – die Sie selbst backen können, und glauben Sie uns – das ist eine Freude und ein Erlebnis, das Sie genießen werden :-). Tesla Model X Miete im Preis inbegriffen, optional mit Fahrer, um interessante Orte in der Umgebung zu besuchen (siehe [Standort]) :-)",
            video: "https://youtu.be/5INpfHr0lu4",
          },
        ],
        bonuses: {
          title: "Zusätzliche Boni",
          items: [
            'Zum Aufenthalt gehört Frühstück/Brunch und immer frisches Sauerteig-<a href="/chleba" target="_blank" rel="noopener noreferrer" class="underline text-white/90 hover:text-white">Brot</a> aus dem Ofen :-)',
            "Sie können das Wehr heben und Wasser zur Mühle lassen. 😄💧",
            "Nachts ist der Himmel wie in Nordkorea – Sterne überall. ✨🌟",
            "Für Dan Bárta (und andere Naturliebhaber): Hier gibt es Libellen, schön und viele davon :-) 🦋 Sie fliegen bis in den Wintergarten und sind klug genug, nach ihrer Inspektion wieder hinauszufliegen, ohne gegen das Glas zu stoßen. Neben ihnen finden Sie invasive Pflanzen (Knöterich und Sumach), gegen die wir tapfer kämpfen. 🌿⚔️ Aber hier wachsen auch Riesenmammutbäume, die – wir geben zu – wir nicht übers Herz bringen, sie zu fällen. 🌲💚",
            "Unter den Studiofenstern sind oft Schwäne mit Jungschwänen, die sich füttern lassen. 🦢",
            "Bei Nachbarin Dáda können Sie reiten. 🐴",
            "Selbst am helllichten Tag können Sie Igel, Marder, Rehe direkt im Garten begegnen. Wenn Dádas Pferde entkommen, können Sie praktisch im Wintergarten mit ihnen Kaffee trinken :-) 🦔🦌☕",
            "Sie können auch ein dickes Eichhörnchen treffen, das Bretter umwirft – Tiere haben es hier großartig :-) Wir haben auch Reiher und Nachbarn haben einen Welpen und ein paar freundliche Katzen (auch von verschiedenen Nachbarn), Frösche und Maulwürfe (unsere) :-) 🐿️🐕🐈",
            "Wir leben in Symbiose mit Tieren und arbeiten zusammen. Dieses Jahr wurde der Studioeingang zusätzlich durch ein Hornissennest direkt über dem Eingang gesichert, das wir für die nächsten Jahre nicht planen und durch modernere Technologien ersetzen werden. Danke. (Keine Hornissen wurden verletzt – wir ließen sie in Ruhe ihr Leben zu Ende leben. 🐝) ⚡",
            "Frisches Bio-Gemüse, ausgezeichnete Trauben, Hopfen. Insgesamt ist das Gras hier grüner und dank der Maulwürfe sieht man schönen Schwarzboden. :-D 🥬🍇🌿",
            "Alles wird von Stille und Ruhe unterstrichen, und doch ist es wie von Národní nach Palmovka nach Domažlice (8 Minuten). 🤫🌳",
            "Nicht zuletzt nette Nachbarn von allen Seiten und die Kneipe Bidlo mit freundlichem Personal und wunderschönem Blick auf den Teich und die Mühle von der anderen Seite. Hier können Sie ein Pilsner haben und wenn Sie mehr Biere haben wollten und am nächsten Tag im Studio funktionieren, empfehlen wir einen Ausflug zur Brauerei in Domažlice und halten Sie sich nur an Domažlická desítka, nach der Sie am nächsten Tag problemlos funktionieren können (Empfohlen von Frau Braumeisterin und mehrmals für Sie getestet, dass es wahr ist :-) 🍺🏡",
            "Morgens können Sie in den Teich springen, aber niemand macht das... aber Sie können :-) 🏊‍♂️",
          ],
        },
      },
    },
    location: {
      title: "Lage",
      subtitle: "Ruhiger Ort im Herzen Europas, nahe allem Wichtigen",
      nature: "Schöne Natur - Erholungsgebiet, Privatsphäre und eigener Park",
      naturePara1:
        "Pila bei Trhanov ist ein idealer Ort für Naturliebhaber, Privatsphäre und aktive Erholung. Das Grundstück erstreckt sich über 6.500 m² und bietet eine ruhige Umgebung mit mehreren Sitzbereichen und zwei Bächen, die eine harmonische Atmosphäre schaffen.",
      naturePara2:
        "Von Pila aus gelangen Sie bequem zu Fuß sowohl nach Domažlice als auch auf den Gipfel des höchsten Berges des Český les, den Čerchov (1042 m), der mit einem Aussichtsturm und herrlichen Ausblicken lockt. Die Umgebung ist reich an markierten Rad- und Wanderwegen durch eine malerische Landschaft – ideal für Natur- und Geschichtsfreunde.",
      naturePara3:
        "Die gesamte Region ist bekannt für ihr Grün, frische Luft und Ruhe, was perfekte Bedingungen für alle schafft, die dem Stadttrubel entfliehen wollen und zugleich eine hochwertige Basis für Ausflüge und das Entdecken kultureller und natürlicher Highlights der Region suchen.",
      quote:
        "Wir haben für uns den perfekten Ort und ein wunderschönes historisches Mühlenobjekt gefunden, das wir teilen möchten. Wir wollen diesen Ort noch weiter heben – durch kreative Menschen, die hier offene Türen haben und wo großartige Dinge entstehen.",
      transport: "Verkehrsanbindung",
      byCar: "Mit dem Auto",
      byTrain: "Mit dem Zug",
      byPlane: "Mit dem Flugzeug",
      availabilityItems: [
        "Mit dem Auto: 10 Min. ins Zentrum von Domažlice",
        "10 Min. zur deutschen Grenze",
        "Mit dem Zug: Bahnhof direkt in Pila",
        "Mit dem Flugzeug: 1 Std. 45 Min. vom Flughafen Prag",
        "Mit dem Flugzeug: 2 Std. 30 Min. vom Flughafen München (MUC), Deutschland",
        "Tesla-Ladestation",
        "Unabhängigkeit vom Stromnetz",
      ],
      teslaTitle: "Tesla-Ladestation",
      teslaDesc: "Tesla-Laden direkt vor Ort",
      energyTitle: "Unabhängigkeit vom Stromnetz",
      energyDesc: "Notstrom für unterbrechungsfreies Arbeiten",
      events: "Ausflugstipps",
      domazliceTitle: "Domažlice (8 Min.)",
      domazliceItems: [
        "Historischer Marktplatz",
        "Chodsko-Museum",
        "Kirche St. Laurentius",
        "Kulturelle Veranstaltungen und Festivals",
      ],
      horsovskytynTitle: "Horšovský Týn (15 Min.)",
      horsovskytynItems: ["Renaissance-Sch Schloss", "Schlossbesichtigungen", "Sommerliche Kulturveranstaltungen"],
      babylonTitle: "Babylon (10 Min.)",
      babylonItems: ["Babylon-Aquapark", "Babylon-Zentrum"],
      chamTitle: "Cham, Deutschland (20 Min.)",
      chamClub: "LA CHAM Club",
      chamDescription: "Bekannter Musikclub mit regelmäßigen Konzerten",
      domazliceEvents: [
        { month: "Mai", event: "Offene Ateliers" },
        { month: "Juli", event: "Chodsko-Festivals" },
        { month: "August", event: "Filmfestival" },
        { month: "Oktober", event: "Blasmusikfestival" },
      ],
      horsovskytynEvents: [
        { month: "Juni", event: "Klassikmusikfestival" },
        { month: "Juli", event: "Sommertheater" },
        { month: "September", event: "Weinprobe" },
      ],
      babylonEvents: [{ month: "Ganzjährig", event: "Konzerte und Unterhaltungsveranstaltungen" }],
      germanyTitle: "Deutschland (in der Nähe)",
      germanyItems: ["Freibad in Bad Kötzting", "Ausflüge in den Bayerischen Wald", "Einkaufen in Grenzstädten"],
    },
    equipment: {
      title: "Ausstattung",
      subtitle: "Professionelle Instrumente und Technologie",
      recordingHardware: "Audio Interface",
      apolloTitle: "Universal Audio Apollo X8P Studio+ Gen 2",
      apolloSpecs: [
        "Elite-Class Apollo X Gen 2 AD/DA-Wandler mit 24-Bit / 192 kHz Auflösung",
        "Dual-Crystal Clocking für ultra-niedrigen Jitter bei allen Sample-Raten",
        "16 x 22 Thunderbolt 3 Audio-Interface mit HEXA Core DSP-Prozessor",
        "8 Unison™ Mikrofonvorverstärker, 2 Hi-Z Instrumenteneingänge",
        "DB-25 Eingang (Line 1-8), 2 optische Toslink I/O (ADAT S/MUX oder S/PDIF)",
        "Word Clock I/O (BNC)",
        '2x 1/4" Monitor-Ausgänge, DB-25 Ausgang (ALT / 7.1 Surround)',
        '2x 1/4" Kopfhörerausgänge',
        "Verbesserter D/A für kritisches Monitoring und Wiedergabe mit 130 dB Dynamikbereich und THD von -127 dB",
        "Kalibrierung der Hauptmonitor- und Kopfhörerausgänge mit Apollo Monitor Correction powered by Sonarworks",
        "Vollständig ausgestatteter Monitor-Controller mit alternativer Lautsprecher-Umschaltung und integriertem Talkback",
        "Aktualisierte UAD Console-App mit Auto-Gain, Plug-In Scenes, Subwoofer-Integration mit Bass Management, Immersive-Audio-Unterstützung und mehr",
        "Onboard-DSP unterstützt über 200 UAD-Plug-ins über VST, AU und AAX 64-Formate in allen wichtigen DAWs",
      ],
      collectionNote:
        "Die Sammlung wird laufend aktualisiert, siehe",
      collaborationLink: "Zusammenarbeit",
      detailsNote: "Instrumente werden regelmäßig gewartet und sind einsatzbereit.",
      vintageInstruments: "Vintage Instrumente (60s-80s)",
      guitars: "Gitarren",
      acousticGuitars: "Akustische Gitarren",
      basses: "Bass",
      ampsAndCabs: "Verstärker und Boxen",
      amps: "Verstärker",
      cabs: "Boxen",
      effects: "Effekte",
      mics: "Mikrofone",
      drums: "Schlagzeug",
      drumsKit: "Schlagzeug-Set: Mapex Saturn V MH Exotic",
      drumsKitDetails: [
        'Bassdrum: 22" x 18"',
        'Toms: 10" x 7" und 12" x 8"',
        'Floor-Toms: 14" x 12" und 16" x 14"',
        "Kessel: Kombination aus Ahorn und Nussbaum (Toms 6 Lagen / 5,1 mm, Bassdrum 8 Lagen / 7,5 mm)",
        "Technologie: SONIClear™ Kanten für bessere Resonanz und einfacheres Stimmen",
        "Konfiguration: Studioease",
      ],
      drumsSnare: "Snare Drum",
      drumsSnareDetails: ["Modell: Tama S.L.P. LST148 Big Black Steel", 'Größe: 14" x 8" (Stahlkessel)'],
      drumsCymbals: "Becken",
      drumsCymbalsDetails: [
        'Hi-Hat: 14" Zildjian K Sweet Hi-Hat',
        'Crash: 18" Zildjian K Custom Hybrid Crash',
        'Ride: 20" Sabian AAX Heavy Ride',
        "China: Istanbul Mehmet (Handmade Turkey)",
        'Splash: 10" Meinl Mb8 Splash',
      ],
      drumsHardware: "Hardware und Zubehör",
      drumsHardwareDetails: [
        "Hocker: DW 9000 Series Air Lift (pneumatischer Hocker)",
        "Pedal: Mapex (Armory-Serie)",
        "Felle: Remo Powerstroke (Bassdrum) und Evans (Snare)",
        "Ständer: Kombination der Marken Mapex und Tama",
      ],
      infrastructure: "Infrastruktur",
      uaPlugins: "Universal Audio Plugins",
      thankYouNote: "Danke",
      noraCollaboration: "Wir danken dem Gitarristen Radek Fořt von der Band",
      noraBand: "NORA",
      noraLink: "https://open.spotify.com/track/1jzCR4iPOo3bCEo67VsvaW?si=fb770e4a9679489f&nd=1&dlsi=1ca88705a71d401c",
      noraCollaborationEnd: "für das Ausleihen von Instrumenten aus seiner Sammlung",
      cables: "Monitore, Kopfhörer, Kabel und Ständer",
    },
    about: {
      title: "Über uns",
      subtitle: "Wo Inspiration im Herzen Europas geboren wird",
      tagline: "Vintage-Seele, moderne Technologie",
      history: "Geschichte der Mühle",
      historyTimeline: [
        { year: "1653", desc: "Anlage von Teichen und Bau des Hochofens und Hammerwerks" },
        { year: "1810", desc: "Mühle mit Sägewerk, angetrieben durch Wasserkraft" },
        {
          year: "1990",
          desc: "Pila entstand am 24. November 1990 als Teil der Gemeinde Trhanov im Bezirk Domažlice",
        },
        { year: "2024", desc: "Transformation in ein Premium-Kreativ-Retreat-Studio" },
      ],
      accommodation: "Unterkunft",
      accommodationRooms: "Unterkunftsmöglichkeiten",
      masterSuite: "Master Suite (63 m²)",
      masterSuiteDesc: "Geräumige Suite mit Blick auf den Teich, inklusive Wintergarten und eigenem Bad.",
      fourRooms: "Weitere Zimmer",
      fourRoomsDesc: "4 stilvoll eingerichtete Zimmer mit Zustellbettmöglichkeit und 4K-TV",
      commonSpaces: "Gemeinschaftsräume",
      commonSpacesItems: [
        "Geräumiger Wintergarten mit Sitzgelegenheit und Kamin (63 m²)",
        "Gesellschaftsraum mit Heimkino",
        "Terrasse mit Blick auf den Teich",
        "Kamin-Sitzbereich im Garten",
      ],
      finnishSauna: "Finnische Sauna",
      finnishSaunaItems: [
        "Kapazität für 6 Personen",
        "Ruhebereich mit Blick in die Natur",
        "Möglichkeit zur Abkühlung im Teich",
      ],
      parkOutdoor: "Park und Außenbereich",
      parkOutdoorItems: [
        "Großer Park mit Camping- und Grillmöglichkeiten",
        "Waldpark mit Bach und Teich",
        "Privater Parkplatz mit Ladestation für Elektroautos",
        "Fahrradverleih verfügbar",
      ],
      catering: "Catering",
      cateringItems: [
        { title: "Frühstück", desc: "Als Buffet mit lokalen Produkten." },
        {
          title: "Mittag- und Abendessen",
          desc: "Catering nach Ihren Wünschen, von einfachen Gerichten bis hin zu professionellem Catering.",
        },
        {
          title: "Getränke",
          desc: "Große Auswahl an alkoholfreien und alkoholischen Getränken, einschließlich lokaler Biere und Weine.",
        },
      ],
      founders: "Gründer",
      foundersIntro:
        "Mlýn Šnajberk Studios wurde von Jindřich Traxmandl und Andrea Kohoutová mit der Vision gegründet, einen einzigartigen Raum zu schaffen, in dem Musik, Kunst und Natur in perfekter Harmonie verschmelzen.",
      jindrichDesc:
        "Gitarrist der Band Anteater, ein Enthusiast für moderne Technologien, der an klassischen Vintage-Instrumenten und Verstärkern festhält.",
      jindrichQuote:
        "Wir arbeiten daran, dass Musiker hier einen inspirierenden Raum finden, der perfekt für die Kreation vorbereitet ist. Die Mühle hat ihren Genius Loci und ihre Seele – und die Instrumente und Vintage-Verstärker, die hier zur Verfügung stehen, tragen die gleiche Energie. Im Einklang mit ihnen unterstützen moderne Technologien dezent Komfort und professionelle Bedingungen, um jede musikalische Idee einzufangen. Unser Ziel ist es, eine schöne, friedliche und komfortable Umgebung zu schaffen, in die die Menschen gerne zurückkehren. Unsere Türen stehen allen kreativen Menschen offen, nicht nur Musikern. Wir glauben, dass gerade diese Kombination – ein Raum mit Seele, Instrumente mit einer Geschichte und moderne Technologie im Hintergrund – der Motor und die Synergie für die Entstehung erstaunlicher Dinge wird.",
      andreaDesc:
        "Sängerin und Bassistin der Band Anteater, außerdem Archäologin und aktuell die Hauptbäckerin in der Mühle :-). Gerade hier in der Umgebung der alten Mühle verbinden sich all diese Leidenschaften auf natürliche Weise. Andrea trägt zur gemütlichen und inspirierenden Atmosphäre des Studios bei. Wenn Sie um Mitternacht Kakao machen wollen (oder zweite Stimmen singen wollen), zögern Sie nicht, sich an Andrea zu wenden (bei technischen Problemen dann an Jindřich :)). Aber jetzt im Ernst: Wir ergänzen uns gegenseitig und lassen uns oft von unseren unterschiedlichen Weltanschauungen inspirieren. Andrea backt aktuell <a href=\"/chleba\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"underline text-white/90 hover:text-white\">Sauerteigbrot</a> in der Mühle, das zu jedem Frühstück oder Brunch dazugehört.",
      collaboration: "Zusammenarbeit und Buchungen",
      collaborationPara1Strong: "Wir suchen Partner,",
      collaborationPara1:
        " die unsere Leidenschaft für Musik und Qualität teilen.",
      collaborationPara2Strong: "Bauen Sie Gitarren, Effekt‑Pedale oder Verstärker?",
      collaborationPara2:
        "Neben renommierten Marken wie Fender, Gibson oder Martin möchten wir auch denen Raum geben, die etwas wirklich Außergewöhnliches bauen – Instrumenten und Equipment, die Aufmerksamkeit verdienen. ",
      collaborationPara2End:
        "Möchten Sie, dass interessante Kunden Ihre Produkte entdecken und Künstler sie bei uns nicht nur testen, sondern ggf. auch direkt kaufen können? Besuchen Sie uns und führen Sie ein ungezwungenes Gespräch – wir treffen gerne interessante Menschen, die etwas schaffen. Wir möchten zuerst alles gründlich testen. Wenn Sie Ihre Produkte hier platzieren, eine Ausstellung veranstalten oder ein Promo‑Video drehen möchten, kontaktieren Sie uns gerne.",
      collaborationFormsTitle: "Formen der Zusammenarbeit:",
      collaborationForms: [
        "Markenintegration – authentische Produktplatzierung",
        "Content-Erstellung – Dokumentarprojekte und Lernleitfäden",
        "Künstlerresidenzen – langfristige kreative Partnerschaften",
        "Ausrüstungstests – Verifizierung im realen Betrieb mit Feedback",
        "Bildungsprogramme – Meisterkurse und Workshops",
      ],
      faq: "Häufig gestellte Fragen",
      faqItems: [
        {
          q: "Spukt es in der Mühle?",
          a: "Nein ;-)",
        },
        {
          q: "Sind Sie umsatzsteuerpflichtig?",
          a: "Ja, wir sind umsatzsteuerpflichtig. Alle Preise auf der Website verstehen sich inklusive Mehrwertsteuer.",
        },
        {
          q: "Kann das gesamte Objekt gemietet werden?",
          a: "Ja. Der gesamte Komplex kann für mindestens 3 Tage gebucht werden.",
        },
        {
          q: "Ist Rauchen in der Mühle erlaubt?",
          a: "Nein. Die Mühle besteht größtenteils aus Holz und verfügt über umfangreiche Brandschutzsysteme, die sofort laute Alarme und Fernbenachrichtigungen auslösen würden - das bedeutet, wenn Sie Ihre eigenen Instrumente mitbringen, sind sie in Sicherheit.",
        },
        {
          q: "Kann ich meine eigene Ausrüstung mitbringen und ist das Objekt ausreichend gesichert?",
          a: "Selbstverständlich können Sie das. Die Ausrüstung kann direkt vor dem Studio ausgeladen werden. Das Objekt ist auf mehreren Ebenen gesichert, und es gibt nur eine Zufahrt. Ein solches Objekt mit Ausrüstung auszurauben, die schwer öffentlich zu verkaufen wäre, ergibt keinen Sinn... Wir würden Dieben angesichts der oben genannten Umstände nicht empfehlen, darüber nachzudenken.... ;-)",
        },
        {
          q: "Bieten Sie Unterkunft auch separat an?",
          a: "Die Unterkunft ist Teil des Studioaufenthalts während der kreativen Arbeit.",
        },
        {
          q: "Wie komme ich zu Ihnen?",
          a: "Mit dem Auto: direkter Zugang, private Parkplätze. Mit dem Zug: 10 Min. zu Fuß vom Bahnhof Trhanov. Mit dem Flugzeug: 1h 45min vom Flughafen Prag, 2h vom Flughafen München, Abholservice verfügbar.",
        },
        {
          q: "Kann ich auch alleine kommen, oder ist das nur für Bands und Teams?",
          a: "Natürlich - für Solo-Künstler steht auch der Plethora X5 Looper von TC Electronic zur Verfügung. ;-)",
        },
        {
          q: "Haben Sie Catering, oder muss ich das Essen selbst organisieren?",
          a: "Frühstück oder Brunch ist immer inklusive, dazu gibt es hausgemachtes Sauerteig-<a href=\"/chleba\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"underline\">Brot</a>, das wir im Außenofen backen. Flexible Verpflegungsmöglichkeiten: Internes Catering mit lokalen Zutaten, Pizzaofen für gemeinsame Abendessen (bis zu 8 Pizzen), voll ausgestattete Küche für Selbstversorgung, Lieferung von lokalen Restaurants aus Domažlice.",
        },
        {
          q: "Sprechen Sie Englisch/Deutsch?",
          a: "Mehrsprachiges Team: Tschechisch - Muttersprachler, Englisch - fließend (Jindřich, Andrea, Tech-Team), Deutsch - Konversationsniveau (regionaler Vorteil), Übersetzungsdienste für Verträge.",
        },
        {
          q: "Kann ich mit Kindern und Hund kommen?",
          a: "Ja, alle sind willkommen. Es gibt Malbücher, Bücher, Spielzeug für den Garten und draußen. Hunde sind auch willkommen, aber bitte beachten Sie - das Grundstück ist nicht vollständig eingezäunt.",
        },
        {
          q: "Während unseres Aufenthalts haben wir einen bestimmten Gitarren‑Chain sehr gemocht. Ist eine Ausleihe für Overdubs im Studio möglich, wo wir das Album fertigstellen?",
          a: "Ja, natürlich. Nach vorheriger Absprache kann ein ausgewählter Gitarren‑Chain auch für spätere Overdubs ausgeliehen werden. (Hinweis: nur Instrumente, die wir besitzen; der Rest nach Vereinbarung.)",
        },
      ],
    },
    contact: {
      title: "Kontakt",
      availability: "Verkehrsanbindung",
      availabilityItems: [
        "Mit dem Auto: 10 Min. zum Zentrum von Domažlice",
        "10 Min. zur deutschen Grenze",
        "Mit dem Zug: Bahnhof direkt in Pila",
        "Mit dem Flugzeug: 1h 45min vom Flughafen Prag",
        "Mit dem Flugzeug: 2h 30min vom Flughafen München (MUC), Deutschland",
      ],
    },
  },
}

export default function Page() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1920)

  const [showDraftBanner, setShowDraftBanner] = useState(true)
  const [draftBannerDismissed, setDraftBannerDismissed] = useState(false)

  const [language, setLanguage] = useState<"cs" | "en" | "de">("cs")
  const [currentSection, setCurrentSection] = useState("mlyn")
  const activeSectionRef = useRef("mlyn")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showEndMessage, setShowEndMessage] = useState(false)

  const [videoEnded, setVideoEnded] = React.useState(false)

  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [isOverlayPreview, setIsOverlayPreview] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [currentVideoUrl, setCurrentVideoUrl] = useState(
    "https://www.youtube.com/embed/VDj9aKHnpcw?autoplay=1&mute=1&loop=1&playlist=VDj9aKHnpcw&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&vq=highres&quality=highres&playsinline=1&enablejsapi=1",
  )
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [nextVideoUrl, setNextVideoUrl] = useState("")
  const [isNextVideoReady, setIsNextVideoReady] = useState(false)
  const videoCrossfadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const videoCrossfadeRafRef = useRef<number | null>(null)
  const sectionVideoIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentBackgroundVideoRef = useRef<HTMLIFrameElement>(null)
  const nextBackgroundVideoRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<any>(null)

  const [mlynScrollProgress, setMlynScrollProgress] = useState(0)
  const mlynSectionRef = useRef<HTMLDivElement>(null)

  const studioSectionRef = useRef<HTMLDivElement>(null)
  const lokalitaSectionRef = useRef<HTMLDivElement>(null)
  const equipmentSectionRef = useRef<HTMLDivElement>(null)
  const contactSectionRef = useRef<HTMLDivElement>(null)
  const contentScrollRef = useRef<HTMLDivElement>(null)

  const [onasScrollProgress, setOnasScrollProgress] = useState(0)
  const onasSectionRef = useRef<HTMLDivElement>(null)

  const [scrolled, setScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const [showPresentationMessage, setShowPresentationMessage] = useState(false)
  const [presentationOpacity, setPresentationOpacity] = useState(0)
  const [showFooterNote, setShowFooterNote] = useState(true)

  const t = translations[language as keyof typeof translations]
  const currentLang = language // Added to fix lint error
  const isHorizontal = windowWidth >= 768
  const equipmentTooltips: Record<
    "cs" | "en" | "de",
    Record<
      string,
      {
        tech: string
        usedBy?: string
        previewUrl?: string
        previewLink?: string
        note?: string
        source: string
      }
    >
  > = {
    cs: {
      "Fender Telecaster Deluxe (1973)": {
        tech: "Spec: jasanové tělo, javorový krk, původní snímače i povrch; přepražcováno, vyměněné potenciometry a ladicí mechaniky (původní přiloženy).",
        note: "Zakoupeno od Tomáše Varteckého, použito na albech Anny K, představeno v Kytarová zbrojnice #26.",
        usedBy:
          "Kurt Cobain (Nirvana), John Mayer (Dead & Company), Billie Joe Armstrong (Green Day), Thom Yorke (Radiohead), Stevie Ray Vaughan (The Vaughan Brothers), The Edge (U2), Jonny Buckland (Coldplay), Frank Iero (My Chemical Romance), Graham Coxon (Blur), Chris Martin (Coldplay), Lee Ranaldo (Sonic Youth), Mike Einziger (Incubus).",
        source: "Zdroj: equipboard.com",
      },
      "Fender Custom Shop - Jeff Beck (Surf Green)": {
        tech: "Spec (Jeff Beck Signature Stratocaster, Custom Shop): olšové tělo, javorový krk s rosewood hmatníkem, 25.5\" menzura, 22 medium jumbo pražců, 3× Hot Noiseless single‑coil, 2‑point tremolo, LSR roller nut.",
        usedBy:
          "Steve Vai (Whitesnake), David Davidson (Revocation), Jan Borysewicz (Lady Pank), Edelmiro Molinari (Almendra).",
        source: "Zdroj: fender.com, equipboard.com",
      },
      "Fender Custom Shop - LTD 67 HSS Strat AB HR": {
        tech: "Spec: HSS Stratocaster (Custom Shop 1967 styl). Tuto kytaru jsme využili pro náš song Fuel. Song jsme nahráli u Damiána Kučery v roce 2024. Kytara má krásný plný a silný zvuk.",
        previewUrl: "https://i.ytimg.com/vi/UkekVsnQuaM/hqdefault.jpg",
        previewLink: "https://www.youtube.com/watch?v=UkekVsnQuaM&list=RDUkekVsnQuaM&start_radio=1",
        source: "Zdroj: interní poznámka studia",
      },
      "Fender Duo-Sonic (1964-65)": {
        tech: "Spec: short‑scale 24\", dvě single‑coil snímače, studentský model.",
        source: "Zdroj: equipboard.com",
      },
      "Fender Mustang (1967)": {
        tech: "Spec: short‑scale 24\", dva single‑coil snímače, dynamické vibrato.",
        usedBy: "Kurt Cobain (Nirvana), Matthew Healy (The 1975), beabadoobee (solo).",
        source: "Zdroj: equipboard.com",
      },
      "Fender Mustang (1966)": {
        tech: "Spec: short‑scale 24\", dva single‑coil snímače, dynamické vibrato.",
        usedBy: "Kurt Cobain (Nirvana), Matthew Healy (The 1975), beabadoobee (solo).",
        source: "Zdroj: equipboard.com",
      },
      "Maybach Teleman": {
        tech: "Spec (Teleman T61): solid‑body T‑style, bolt‑on javorový krk, rosewood hmatník, 21 pražců, 25.5\" menzura, 2× Van Zandt single‑coil, 3‑way přepínač, nitrocellulózový aged finiš.",
        source: "Zdroj: stageguitarservice.com, musicstore.com",
      },
      "Martin Guitar D-15E (Upgrade with Martin Guitar Bridge Pin Liquid Metal DG)": {
        tech: "Spec (D‑15M série): all‑solid mahagon, dreadnought (D‑14 fret), saténový finiš, 25.4\" menzura.",
        usedBy:
          "Chris Martin (Coldplay), Brendon Urie (Panic! at the Disco), Andrew Davie (Bear’s Den).",
        source: "Zdroj: martinguitar.com, equipboard.com",
      },
      "Fender FA-125 Nat": {
        tech: "Spec: dreadnought, all‑laminate konstrukce; laminovaný smrk top + laminovaný basswood zadní deska a luby; nato krk; walnut hmatník; 25.3\" menzura.",
        source: "Zdroj: fender.com, equipboard.com",
      },
      "Marshall 1960 BX": {
        tech: "Spec: 4×12\" kytarový kabinet, vintage‑voiced repros.",
        usedBy:
          "Angus Young (AC/DC), Dave Murray (Iron Maiden), Malcolm Young (AC/DC), Euronymous (Mayhem), Brad Whitford (Aerosmith), Susan Tedeschi (Tedeschi Trucks Band), Scott Gorham (Thin Lizzy), Joel O'Keeffe (Airbourne), Chris Cheney (The Living End), Sergio Vallín (Maná).",
        source: "Zdroj: equipboard.com",
      },
      "Ampeg SVT-112AV Cabinet": {
        tech: "Spec: 1×12\" bass kabinet, 300W/8Ω, kompresní driver s 3‑polohovým atenuátorem.",
        source: "Zdroj: ampeg.com, equipboard.com",
      },
      "Shure SM 7 B": {
        tech: "Spec: dynamický broadcast/vocal mikrofon s vysokým SPL a nízkým šumem.",
        usedBy: "Michael Jackson (solo) – vokály na Thriller (SM7).",
        source: "Zdroj: wikipedia.org",
      },
      "Shure Beta 58": {
        tech: "Spec: dynamický vokální mikrofon, superkardioida.",
        usedBy: "John Mayer (Dead & Company), James Hetfield (Metallica), Paul McCartney (The Beatles).",
        source: "Zdroj: equipboard.com",
      },
      "SHURE SM57": {
        tech: "Spec: dynamický nástrojový/vokální mikrofon, kardioida.",
        usedBy: "Dave Grohl (Queens of the Stone Age), Slash (Guns N' Roses), Alex Turner (Arctic Monkeys).",
        source: "Zdroj: equipboard.com",
      },
      "Sennheiser e 906": {
        tech: "Spec: dynamický mikrofon se superkardioidou, 3‑polohový filtr.",
        usedBy: "Alex Turner (Arctic Monkeys), Dan Auerbach (The Black Keys), Frank Iero (My Chemical Romance).",
        source: "Zdroj: equipboard.com",
      },
      "AKG D5": {
        tech: "Spec: dynamický vokální mikrofon, superkardioida, vysoký max. SPL.",
        source: "Zdroj: equipboard.com",
      },
      "Fender Jaguar Kurt Cobain (with Graph Tech Bridge Saddles)": {
        tech: "Spec: DiMarzio DP103 PAF + DP100 Super Distortion, Jaguar dual‑circuit, 3‑polohový přepínač.",
        usedBy:
          "Kurt Cobain (Nirvana), Frank Iero (My Chemical Romance), Rivers Cuomo (Weezer), Gerard Way (My Chemical Romance), Sergio Pizzorno (Kasabian), Ryan Jarman (The Cribs), Dan Campbell (The Wonder Years), Sade Sanchez (L.A. Witch), Jesse Welles (solo), Nomakills official (solo), Leisha Hailey (The Murmurs), Camila Grey (Mellowdrone).",
        source: "Zdroj: fender.com",
      },
      "Gibson Les Paul Studio (1993) (with Graph Tech Bridge Saddles)": {
        tech: "Spec: mahagonové tělo s javorovým topem, set‑neck, humbuckery.",
        usedBy: "Noel Gallagher (Oasis), Jerry Cantrell (Alice in Chains).",
        source: "Zdroj: gibson.com, equipboard.com",
      },
      "Gibson Les Paul Traditional (2009)": {
        tech: "Spec: mahagonové tělo s javorovým topem, 24.75\" menzura, set‑neck.",
        source: "Zdroj: equipboard.com",
      },
      "Gibson Explorer": {
        tech: "Spec: mahagonové tělo, 24.75\" menzura, 22 pražců, snímače 490R/498T.",
        usedBy: "Tom Morello (Rage Against the Machine), Trent Reznor (Nine Inch Nails).",
        source: "Zdroj: gibson.com, equipboard.com",
      },
      "Gibson THE SG (1979)": {
        tech: "Spec: mahagonové tělo, 24.75\" menzura, 2 humbuckery.",
        usedBy: "MJ Lenderman (Wednesday), Evan Patterson (Young Widows), Matt Smith (Senses Fail).",
        source: "Zdroj: equipboard.com",
      },
      "Gibson Sonex (1981)": {
        tech: "Spec: Resonwood tělo, javorový krk, 24.75\" menzura, humbuckery.",
        usedBy: "Joan Jett (Mark Knopfler’s Guitar Heroes), Ferdinando Marchisio (Forgotten Tomb).",
        source: "Zdroj: equipboard.com",
      },
      "Gibson Firebird Studio Special (2004)": {
        tech: "Spec: mahagonové tělo, set‑neck, mini‑humbuckery.",
        source: "Zdroj: equipboard.com",
      },
      "Gibson Firebird Studio (2006)": {
        tech: "Spec: mahagonové tělo, set‑neck, mini‑humbuckery.",
        source: "Zdroj: equipboard.com",
      },
      "Fender Precision (1993)": {
        tech: "Spec: split‑coil Precision snímač, 34\" menzura.",
        usedBy: "John Frusciante (Red Hot Chili Peppers), Dave Grohl (Foo Fighters).",
        source: "Zdroj: fender.com, equipboard.com",
      },
      "Fender 64 Custom Deluxe Reverb": {
        tech: "Spec: 20W lampové kombo, 1×12\" reproduktor, reverb + tremolo.",
        source: "Zdroj: fender.com",
      },
      "Marshall AFD 100": {
        tech: "Spec: Slash signature head – navržený pro „Appetite for Destruction“ tón.",
        usedBy: "Slash (Guns N' Roses).",
        source: "Zdroj: equipboard.com",
      },
      "Mesa Boogie Dual Rectifier® Head, 3 Channels / 8 Modes, 100W": {
        tech: "Spec: 3 kanály / 8 módů, 50/100W (Multi‑Watt).",
        usedBy: "Wes Borland (Limp Bizkit).",
        source: "Zdroj: chicagomusicexchange.com, equipboard.com",
      },
      "Mesa Boogie Rect-o-verb (upravená verze od Antonín Salva)": {
        tech: "Spec: 50W, 2 kanály / 5 módů, 2×6L6, 5×12AX7, pružinový reverb, FX loop.",
        usedBy:
          "Mod: Antonín Salva (Salvation Audio, KHDK). Spolupráce: Warhead Amps s Rita Haney, Grady Champion, David Karon; projekty i pro The Smashing Pumpkins, Scott Ian, The Misfits.",
        source: "Zdroj: mesaboogie.com, warheadamps.com",
      },
      "Tone King Imperial": {
        tech: "Spec: lampové kombo se dvěma kanály a vestavěným attenuatorem.",
        source: "Zdroj: toneking.com",
      },
      "Roland JC-22": {
        tech: "Spec: 30W stereo kombo, 2×6.5\" repro, chorus/vibrato.",
        source: "Zdroj: roland.com",
      },
      "Ampeg Reverbrocket R212": {
        tech: "Spec: 2×12\" lampové kombo, 100W.",
        source: "Zdroj: equipboard.com",
      },
      "Ampeg GVT5": {
        tech: "Spec: 5W lampové kombo, 1×10\" reproduktor.",
        source: "Zdroj: ampeg.com",
      },
      "AMPEG V-4B Bass Head": {
        tech: "Spec: 100W all‑tube basový head.",
        source: "Zdroj: chicagomusicexchange.com",
      },
    },
    en: {
      "Fender Telecaster Deluxe (1973)": {
        tech: "Spec: ash body, maple neck, original pickups and finish; refretted, replaced pots and tuners (original parts included).",
        note: "Purchased from Tomáš Vartecký, used on Anna K albums, featured in Kytarová zbrojnice #26.",
        usedBy:
          "Kurt Cobain (Nirvana), John Mayer (Dead & Company), Billie Joe Armstrong (Green Day), Thom Yorke (Radiohead), Stevie Ray Vaughan (The Vaughan Brothers), The Edge (U2), Jonny Buckland (Coldplay), Frank Iero (My Chemical Romance), Graham Coxon (Blur), Chris Martin (Coldplay), Lee Ranaldo (Sonic Youth), Mike Einziger (Incubus).",
        source: "Source: equipboard.com",
      },
      "Fender Custom Shop - Jeff Beck (Surf Green)": {
        tech: "Spec (Jeff Beck Signature Stratocaster, Custom Shop): alder body, maple neck with rosewood fingerboard, 25.5\" scale, 22 medium‑jumbo frets, 3× Hot Noiseless single‑coil, 2‑point tremolo, LSR roller nut.",
        usedBy:
          "Steve Vai (Whitesnake), David Davidson (Revocation), Jan Borysewicz (Lady Pank), Edelmiro Molinari (Almendra).",
        source: "Source: fender.com, equipboard.com",
      },
      "Fender Custom Shop - LTD 67 HSS Strat AB HR": {
        tech: "Spec: HSS Stratocaster (Custom Shop 1967 style). We used this guitar on our song Fuel, recorded with Damián Kučera in 2024. Full and powerful tone.",
        previewUrl: "https://i.ytimg.com/vi/UkekVsnQuaM/hqdefault.jpg",
        previewLink: "https://www.youtube.com/watch?v=UkekVsnQuaM&list=RDUkekVsnQuaM&start_radio=1",
        source: "Source: studio note",
      },
      "Fender Duo-Sonic (1964-65)": {
        tech: "Spec: 24\" short‑scale, two single‑coil pickups, student model.",
        source: "Source: equipboard.com",
      },
      "Fender Mustang (1967)": {
        tech: "Spec: 24\" short‑scale, two single‑coil pickups, dynamic vibrato.",
        usedBy: "Kurt Cobain (Nirvana), Matthew Healy (The 1975), beabadoobee (solo).",
        source: "Source: equipboard.com",
      },
      "Fender Mustang (1966)": {
        tech: "Spec: 24\" short‑scale, two single‑coil pickups, dynamic vibrato.",
        usedBy: "Kurt Cobain (Nirvana), Matthew Healy (The 1975), beabadoobee (solo).",
        source: "Source: equipboard.com",
      },
      "Maybach Teleman": {
        tech: "Spec (Teleman T61): solid‑body T‑style, bolt‑on maple neck, rosewood fingerboard, 21 frets, 25.5\" scale, 2× Van Zandt single‑coil, 3‑way switch, nitrocellulose aged finish.",
        source: "Source: stageguitarservice.com, musicstore.com",
      },
      "Martin Guitar D-15E (Upgrade with Martin Guitar Bridge Pin Liquid Metal DG)": {
        tech: "Spec (D‑15M series): all‑solid mahogany, dreadnought (D‑14 fret), satin finish, 25.4\" scale.",
        usedBy:
          "Chris Martin (Coldplay), Brendon Urie (Panic! at the Disco), Andrew Davie (Bear’s Den).",
        source: "Source: martinguitar.com, equipboard.com",
      },
      "Fender FA-125 Nat": {
        tech: "Spec: dreadnought, all‑laminate construction; laminated spruce top with laminated basswood back/sides; nato neck; walnut fingerboard; 25.3\" scale.",
        source: "Source: fender.com, equipboard.com",
      },
      "Marshall 1960 BX": {
        tech: "Spec: 4×12\" guitar cabinet, vintage‑voiced speakers.",
        usedBy:
          "Angus Young (AC/DC), Dave Murray (Iron Maiden), Malcolm Young (AC/DC), Euronymous (Mayhem), Brad Whitford (Aerosmith), Susan Tedeschi (Tedeschi Trucks Band), Scott Gorham (Thin Lizzy), Joel O'Keeffe (Airbourne), Chris Cheney (The Living End), Sergio Vallín (Maná).",
        source: "Source: equipboard.com",
      },
      "Ampeg SVT-112AV Cabinet": {
        tech: "Spec: 1×12\" bass cabinet, 300W/8Ω, compression driver with 3‑position attenuator.",
        source: "Source: ampeg.com, equipboard.com",
      },
      "Shure SM 7 B": {
        tech: "Spec: dynamic broadcast/vocal microphone with high SPL handling.",
        usedBy: "Michael Jackson (solo) – vocals on Thriller (SM7).",
        source: "Source: wikipedia.org",
      },
      "Shure Beta 58": {
        tech: "Spec: dynamic vocal microphone, supercardioid.",
        usedBy: "John Mayer (Dead & Company), James Hetfield (Metallica), Paul McCartney (The Beatles).",
        source: "Source: equipboard.com",
      },
      "SHURE SM57": {
        tech: "Spec: dynamic instrument/vocal microphone, cardioid.",
        usedBy: "Dave Grohl (Queens of the Stone Age), Slash (Guns N' Roses), Alex Turner (Arctic Monkeys).",
        source: "Source: equipboard.com",
      },
      "Sennheiser e 906": {
        tech: "Spec: dynamic mic with supercardioid pattern, 3‑position presence filter.",
        usedBy: "Alex Turner (Arctic Monkeys), Dan Auerbach (The Black Keys), Frank Iero (My Chemical Romance).",
        source: "Source: equipboard.com",
      },
      "AKG D5": {
        tech: "Spec: dynamic vocal mic, supercardioid, high max SPL.",
        source: "Source: equipboard.com",
      },
      "Fender Jaguar Kurt Cobain (with Graph Tech Bridge Saddles)": {
        tech: "Spec: DiMarzio DP103 PAF + DP100 Super Distortion, Jaguar dual‑circuit, 3‑way toggle.",
        usedBy:
          "Kurt Cobain (Nirvana), Frank Iero (My Chemical Romance), Rivers Cuomo (Weezer), Gerard Way (My Chemical Romance), Sergio Pizzorno (Kasabian), Ryan Jarman (The Cribs), Dan Campbell (The Wonder Years), Sade Sanchez (L.A. Witch), Jesse Welles (solo), Nomakills official (solo), Leisha Hailey (The Murmurs), Camila Grey (Mellowdrone).",
        source: "Source: fender.com",
      },
      "Gibson Les Paul Studio (1993) (with Graph Tech Bridge Saddles)": {
        tech: "Spec: mahogany body with maple cap, set neck, humbuckers.",
        usedBy: "Noel Gallagher (Oasis), Jerry Cantrell (Alice in Chains).",
        source: "Source: gibson.com, equipboard.com",
      },
      "Gibson Les Paul Traditional (2009)": {
        tech: "Spec: mahogany body with maple cap, 24.75\" scale, set neck.",
        source: "Source: equipboard.com",
      },
      "Gibson Explorer": {
        tech: "Spec: mahogany body, 24.75\" scale, 22 frets, 490R/498T pickups.",
        usedBy: "Tom Morello (Rage Against the Machine), Trent Reznor (Nine Inch Nails).",
        source: "Source: gibson.com, equipboard.com",
      },
      "Gibson THE SG (1979)": {
        tech: "Spec: mahogany body, 24.75\" scale, 2 humbuckers.",
        usedBy: "MJ Lenderman (Wednesday), Evan Patterson (Young Widows), Matt Smith (Senses Fail).",
        source: "Source: equipboard.com",
      },
      "Gibson Sonex (1981)": {
        tech: "Spec: Resonwood body, maple neck, 24.75\" scale, humbuckers.",
        usedBy: "Joan Jett (Mark Knopfler’s Guitar Heroes), Ferdinando Marchisio (Forgotten Tomb).",
        source: "Source: equipboard.com",
      },
      "Gibson Firebird Studio Special (2004)": {
        tech: "Spec: mahogany body, set neck, mini‑humbuckers.",
        source: "Source: equipboard.com",
      },
      "Gibson Firebird Studio (2006)": {
        tech: "Spec: mahogany body, set neck, mini‑humbuckers.",
        source: "Source: equipboard.com",
      },
      "Fender Precision (1993)": {
        tech: "Spec: split‑coil Precision pickup, 34\" scale.",
        usedBy: "John Frusciante (Red Hot Chili Peppers), Dave Grohl (Foo Fighters).",
        source: "Source: fender.com, equipboard.com",
      },
      "Fender 64 Custom Deluxe Reverb": {
        tech: "Spec: 20W tube combo, 1×12\" speaker, reverb + tremolo.",
        source: "Source: fender.com",
      },
      "Marshall AFD 100": {
        tech: "Spec: Slash signature head designed for “Appetite for Destruction” tone.",
        usedBy: "Slash (Guns N' Roses).",
        source: "Source: equipboard.com",
      },
      "Mesa Boogie Dual Rectifier® Head, 3 Channels / 8 Modes, 100W": {
        tech: "Spec: 3 channels / 8 modes, 50/100W (Multi‑Watt).",
        usedBy: "Wes Borland (Limp Bizkit).",
        source: "Source: chicagomusicexchange.com, equipboard.com",
      },
      "Mesa Boogie Rect-o-verb (upravená verze od Antonín Salva)": {
        tech: "Spec: 50W, 2 channels / 5 modes, 2×6L6, 5×12AX7, spring reverb, FX loop.",
        usedBy:
          "Mod: Antonín Salva (Salvation Audio, KHDK). Collaborations: Warhead Amps with Rita Haney, Grady Champion, David Karon; projects incl. The Smashing Pumpkins, Scott Ian, The Misfits.",
        source: "Source: mesaboogie.com, warheadamps.com",
      },
      "Tone King Imperial": {
        tech: "Spec: tube combo with two channels and built‑in attenuator.",
        source: "Source: toneking.com",
      },
      "Roland JC-22": {
        tech: "Spec: 30W stereo combo, 2×6.5\" speakers, chorus/vibrato.",
        source: "Source: roland.com",
      },
      "Ampeg Reverbrocket R212": {
        tech: "Spec: 2×12\" tube combo, 100W.",
        source: "Source: equipboard.com",
      },
      "Ampeg GVT5": {
        tech: "Spec: 5W tube combo, 1×10\" speaker.",
        source: "Source: ampeg.com",
      },
      "AMPEG V-4B Bass Head": {
        tech: "Spec: 100W all‑tube bass head.",
        source: "Source: chicagomusicexchange.com",
      },
    },
    de: {
      "Fender Telecaster Deluxe (1973)": {
        tech: "Spec: Esche‑Korpus, Ahornhals, originale Pickups und Lackierung; neu bundiert, Potis und Mechaniken ersetzt (Originalteile dabei).",
        note: "Gekauft von Tomáš Vartecký, auf Alben von Anna K genutzt, vorgestellt in Kytarová zbrojnice #26.",
        usedBy:
          "Kurt Cobain (Nirvana), John Mayer (Dead & Company), Billie Joe Armstrong (Green Day), Thom Yorke (Radiohead), Stevie Ray Vaughan (The Vaughan Brothers), The Edge (U2), Jonny Buckland (Coldplay), Frank Iero (My Chemical Romance), Graham Coxon (Blur), Chris Martin (Coldplay), Lee Ranaldo (Sonic Youth), Mike Einziger (Incubus).",
        source: "Quelle: equipboard.com",
      },
      "Fender Custom Shop - Jeff Beck (Surf Green)": {
        tech: "Spec (Jeff Beck Signature Stratocaster, Custom Shop): Erle‑Korpus, Ahornhals mit Palisander‑Griffbrett, 25,5\" Mensur, 22 Medium‑Jumbo‑Bünde, 3× Hot‑Noiseless‑Single‑Coils, 2‑Point Tremolo, LSR Roller Nut.",
        usedBy:
          "Steve Vai (Whitesnake), David Davidson (Revocation), Jan Borysewicz (Lady Pank), Edelmiro Molinari (Almendra).",
        source: "Quelle: fender.com, equipboard.com",
      },
      "Fender Custom Shop - LTD 67 HSS Strat AB HR": {
        tech: "Spec: HSS Stratocaster (Custom Shop 1967 Stil). Diese Gitarre haben wir für unseren Song Fuel genutzt, aufgenommen mit Damián Kučera im Jahr 2024. Voller, kräftiger Klang.",
        previewUrl: "https://i.ytimg.com/vi/UkekVsnQuaM/hqdefault.jpg",
        previewLink: "https://www.youtube.com/watch?v=UkekVsnQuaM&list=RDUkekVsnQuaM&start_radio=1",
        source: "Quelle: Studio‑Notiz",
      },
      "Fender Duo-Sonic (1964-65)": {
        tech: "Spec: 24\" Short‑Scale, zwei Single‑Coils, Studentenmodell.",
        source: "Quelle: equipboard.com",
      },
      "Fender Mustang (1967)": {
        tech: "Spec: 24\" Short‑Scale, zwei Single‑Coils, dynamisches Vibrato.",
        usedBy: "Kurt Cobain (Nirvana), Matthew Healy (The 1975), beabadoobee (solo).",
        source: "Quelle: equipboard.com",
      },
      "Fender Mustang (1966)": {
        tech: "Spec: 24\" Short‑Scale, zwei Single‑Coils, dynamisches Vibrato.",
        usedBy: "Kurt Cobain (Nirvana), Matthew Healy (The 1975), beabadoobee (solo).",
        source: "Quelle: equipboard.com",
      },
      "Maybach Teleman": {
        tech: "Spec (Teleman T61): Solid‑Body T‑Style, bolt‑on Ahornhals, Palisander‑Griffbrett, 21 Bünde, 25,5\" Mensur, 2× Van Zandt Single‑Coils, 3‑Way‑Switch, Nitro‑Aged‑Finish.",
        source: "Quelle: stageguitarservice.com, musicstore.com",
      },
      "Martin Guitar D-15E (Upgrade with Martin Guitar Bridge Pin Liquid Metal DG)": {
        tech: "Spec (D‑15M‑Serie): durchgehend Mahagoni, Dreadnought (D‑14‑Fret), Satin‑Finish, 25,4\" Mensur.",
        usedBy:
          "Chris Martin (Coldplay), Brendon Urie (Panic! at the Disco), Andrew Davie (Bear’s Den).",
        source: "Quelle: martinguitar.com, equipboard.com",
      },
      "Fender FA-125 Nat": {
        tech: "Spec: Dreadnought, All‑Laminate‑Konstruktion; laminiertes Fichten‑Top mit laminiertem Basswood Boden/Zargen; Nato‑Hals; Walnut‑Griffbrett; 25,3\" Mensur.",
        source: "Quelle: fender.com, equipboard.com",
      },
      "Marshall 1960 BX": {
        tech: "Spec: 4×12\" Gitarren‑Cabinet, vintage‑voiced Speaker.",
        usedBy:
          "Angus Young (AC/DC), Dave Murray (Iron Maiden), Malcolm Young (AC/DC), Euronymous (Mayhem), Brad Whitford (Aerosmith), Susan Tedeschi (Tedeschi Trucks Band), Scott Gorham (Thin Lizzy), Joel O'Keeffe (Airbourne), Chris Cheney (The Living End), Sergio Vallín (Maná).",
        source: "Quelle: equipboard.com",
      },
      "Ampeg SVT-112AV Cabinet": {
        tech: "Spec: 1×12\" Bass‑Cabinet, 300W/8Ω, Kompressionstreiber mit 3‑Stufen‑Attenuator.",
        source: "Quelle: ampeg.com, equipboard.com",
      },
      "Shure SM 7 B": {
        tech: "Spec: dynamisches Broadcast/Vocal‑Mikrofon mit hohem max. SPL.",
        usedBy: "Michael Jackson (solo) – Vocals auf Thriller (SM7).",
        source: "Quelle: wikipedia.org",
      },
      "Shure Beta 58": {
        tech: "Spec: dynamisches Vocal‑Mikrofon, Superniere.",
        usedBy: "John Mayer (Dead & Company), James Hetfield (Metallica), Paul McCartney (The Beatles).",
        source: "Quelle: equipboard.com",
      },
      "SHURE SM57": {
        tech: "Spec: dynamisches Instrument/Vocal‑Mikrofon, Niere.",
        usedBy: "Dave Grohl (Queens of the Stone Age), Slash (Guns N' Roses), Alex Turner (Arctic Monkeys).",
        source: "Quelle: equipboard.com",
      },
      "Sennheiser e 906": {
        tech: "Spec: dynamisches Mikrofon, Superniere, 3‑Stufen‑Filter.",
        usedBy: "Alex Turner (Arctic Monkeys), Dan Auerbach (The Black Keys), Frank Iero (My Chemical Romance).",
        source: "Quelle: equipboard.com",
      },
      "AKG D5": {
        tech: "Spec: dynamisches Vocal‑Mikrofon, Superniere, hoher max. SPL.",
        source: "Quelle: equipboard.com",
      },
      "Fender Jaguar Kurt Cobain (with Graph Tech Bridge Saddles)": {
        tech: "Spec: DiMarzio DP103 PAF + DP100 Super Distortion, Jaguar Dual‑Circuit, 3‑Way‑Schalter.",
        usedBy:
          "Kurt Cobain (Nirvana), Frank Iero (My Chemical Romance), Rivers Cuomo (Weezer), Gerard Way (My Chemical Romance), Sergio Pizzorno (Kasabian), Ryan Jarman (The Cribs), Dan Campbell (The Wonder Years), Sade Sanchez (L.A. Witch), Jesse Welles (solo), Nomakills official (solo), Leisha Hailey (The Murmurs), Camila Grey (Mellowdrone).",
        source: "Quelle: fender.com",
      },
      "Gibson Les Paul Studio (1993) (with Graph Tech Bridge Saddles)": {
        tech: "Spec: Mahagoni‑Korpus mit Ahorndecke, Set‑Neck, Humbucker.",
        usedBy: "Noel Gallagher (Oasis), Jerry Cantrell (Alice in Chains).",
        source: "Quelle: gibson.com, equipboard.com",
      },
      "Gibson Les Paul Traditional (2009)": {
        tech: "Spec: Mahagoni‑Korpus mit Ahorndecke, 24,75\" Mensur, Set‑Neck.",
        source: "Quelle: equipboard.com",
      },
      "Gibson Explorer": {
        tech: "Spec: Mahagoni‑Korpus, 24,75\" Mensur, 22 Bünde, 490R/498T Pickups.",
        usedBy: "Tom Morello (Rage Against the Machine), Trent Reznor (Nine Inch Nails).",
        source: "Quelle: gibson.com, equipboard.com",
      },
      "Gibson THE SG (1979)": {
        tech: "Spec: Mahagoni‑Korpus, 24,75\" Mensur, 2 Humbucker.",
        usedBy: "MJ Lenderman (Wednesday), Evan Patterson (Young Widows), Matt Smith (Senses Fail).",
        source: "Quelle: equipboard.com",
      },
      "Gibson Sonex (1981)": {
        tech: "Spec: Resonwood‑Korpus, Ahornhals, 24,75\" Mensur, Humbucker.",
        usedBy: "Joan Jett (Mark Knopfler’s Guitar Heroes), Ferdinando Marchisio (Forgotten Tomb).",
        source: "Quelle: equipboard.com",
      },
      "Gibson Firebird Studio Special (2004)": {
        tech: "Spec: Mahagoni‑Korpus, Set‑Neck, Mini‑Humbucker.",
        source: "Quelle: equipboard.com",
      },
      "Gibson Firebird Studio (2006)": {
        tech: "Spec: Mahagoni‑Korpus, Set‑Neck, Mini‑Humbucker.",
        source: "Quelle: equipboard.com",
      },
      "Fender Precision (1993)": {
        tech: "Spec: Precision Split‑Coil‑Pickup, 34\" Mensur.",
        usedBy: "John Frusciante (Red Hot Chili Peppers), Dave Grohl (Foo Fighters).",
        source: "Quelle: fender.com, equipboard.com",
      },
      "Fender 64 Custom Deluxe Reverb": {
        tech: "Spec: 20W Röhren‑Combo, 1×12\" Speaker, Reverb + Tremolo.",
        source: "Quelle: fender.com",
      },
      "Marshall AFD 100": {
        tech: "Spec: Slash Signature Head für den „Appetite for Destruction“-Sound.",
        usedBy: "Slash (Guns N' Roses).",
        source: "Quelle: equipboard.com",
      },
      "Mesa Boogie Dual Rectifier® Head, 3 Channels / 8 Modes, 100W": {
        tech: "Spec: 3 Kanäle / 8 Modi, 50/100W (Multi‑Watt).",
        usedBy: "Wes Borland (Limp Bizkit).",
        source: "Quelle: chicagomusicexchange.com, equipboard.com",
      },
      "Mesa Boogie Rect-o-verb (upravená verze od Antonín Salva)": {
        tech: "Spec: 50W, 2 Kanäle / 5 Modi, 2×6L6, 5×12AX7, Federhall, FX‑Loop.",
        usedBy:
          "Mod: Antonín Salva (Salvation Audio, KHDK). Kooperation: Warhead Amps mit Rita Haney, Grady Champion, David Karon; Projekte u. a. The Smashing Pumpkins, Scott Ian, The Misfits.",
        source: "Quelle: mesaboogie.com, warheadamps.com",
      },
      "Tone King Imperial": {
        tech: "Spec: Röhren‑Combo mit zwei Kanälen und eingebautem Attenuator.",
        source: "Quelle: toneking.com",
      },
      "Roland JC-22": {
        tech: "Spec: 30W Stereo‑Combo, 2×6.5\" Speaker, Chorus/Vibrato.",
        source: "Quelle: roland.com",
      },
      "Ampeg Reverbrocket R212": {
        tech: "Spec: 2×12\" Röhren‑Combo, 100W.",
        source: "Quelle: equipboard.com",
      },
      "Ampeg GVT5": {
        tech: "Spec: 5W Röhren‑Combo, 1×10\" Speaker.",
        source: "Quelle: ampeg.com",
      },
      "AMPEG V-4B Bass Head": {
        tech: "Spec: 100W All‑Tube Bass‑Head.",
        source: "Quelle: chicagomusicexchange.com",
      },
    },
  }
  const getEquipmentTooltip = (label: string) => equipmentTooltips[currentLang]?.[label]
  const usedByLabel =
    currentLang === "cs"
      ? "Tento model používali:"
      : currentLang === "de"
        ? "Dieses Modell nutzten:"
        : "This model was used by:"
  const TooltipItem = ({ label }: { label: string }) => {
    const tooltip = getEquipmentTooltip(label)
    return (
      <span className="relative group cursor-help">
        • {label}
        {tooltip ? (
          <span className="absolute left-0 top-5 z-20 w-72 max-w-[80vw] rounded-md bg-black/90 text-white text-[10px] leading-relaxed px-3 py-2 opacity-0 translate-y-1 transition-all duration-200 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0">
            <span className="block text-white/95">{tooltip.tech}</span>
            {tooltip.usedBy ? (
              <>
                <span className="block mt-2 text-white/80">{usedByLabel}</span>
                <span className="block mt-0.5 text-white/90">{tooltip.usedBy}</span>
              </>
            ) : null}
            {tooltip.previewUrl ? (
              <a
                href={tooltip.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2"
              >
                <img src={tooltip.previewUrl} alt="" className="w-full h-auto rounded border border-white/10" />
              </a>
            ) : null}
            {tooltip.note ? (
              <span className="block mt-2 text-white/90">{tooltip.note}</span>
            ) : null}
            <span className="block mt-2 text-white/50 text-[9px]">{tooltip.source}</span>
          </span>
        ) : null}
      </span>
    )
  }
  const buildVideoUrl = (videoId: string) =>
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&vq=highres&quality=highres&playsinline=1&enablejsapi=1`

  const getBackgroundVideoId = (section: string, darkMode: boolean, horizontal: boolean) => {
    const normalizedSection = section === "spoluprace" ? "about" : section

    if (darkMode) {
      if (normalizedSection === "mlyn") return horizontal ? "a-bBDcZvg5U" : "HQUoxExYlEM"
      if (normalizedSection === "studio") return horizontal ? "b4tTKrUevzM" : "PNnMOPbABZo"
      if (normalizedSection === "contact") return horizontal ? "CJzYKr3JWC8" : "DY09nnytbjc"
      if (normalizedSection === "lokalita") return horizontal ? "CJzYKr3JWC8" : "DY09nnytbjc"
      if (normalizedSection === "equipment") return horizontal ? "a-bBDcZvg5U" : "DY09nnytbjc"
      if (normalizedSection === "about") return horizontal ? "a-bBDcZvg5U" : "M4QkWhz7CDo"
      return "M4QkWhz7CDo"
    }

    if (normalizedSection === "mlyn") return horizontal ? "VDj9aKHnpcw" : "HQUoxExYlEM"
    if (normalizedSection === "studio") return horizontal ? "MczOR3DstPg" : "PNnMOPbABZo"
    if (normalizedSection === "about") return horizontal ? "M4QapdIvjkM" : "qcbDEWXmPdE"
    if (normalizedSection === "contact") return horizontal ? "IJMzgLBpymc" : "Js0nD8lUKH8"
    if (normalizedSection === "lokalita") return horizontal ? "tWtT7cB1Tus" : "yYFR6g6jlaA"
    if (normalizedSection === "equipment") return horizontal ? "VDj9aKHnpcw" : "yYFR6g6jlaA"
    return horizontal ? "VDj9aKHnpcw" : "HQUoxExYlEM"
  }

  const clearVideoCrossfade = useCallback(() => {
    if (videoCrossfadeTimeoutRef.current) {
      clearTimeout(videoCrossfadeTimeoutRef.current)
      videoCrossfadeTimeoutRef.current = null
    }
    if (videoCrossfadeRafRef.current !== null) {
      window.cancelAnimationFrame(videoCrossfadeRafRef.current)
      videoCrossfadeRafRef.current = null
    }
  }, [])

  const clearSectionVideoIdle = useCallback(() => {
    if (sectionVideoIdleRef.current) {
      clearTimeout(sectionVideoIdleRef.current)
      sectionVideoIdleRef.current = null
    }
  }, [])

  const startVideoCrossfade = useCallback(
    (targetUrl: string) => {
      if (!targetUrl) {
        return
      }
      if (targetUrl === currentVideoUrl && !nextVideoUrl) {
        return
      }
      if (targetUrl === nextVideoUrl) {
        return
      }

      clearVideoCrossfade()
      setIsNextVideoReady(false)
      setNextVideoUrl(targetUrl)
      setIsTransitioning(false)
    },
    [clearVideoCrossfade, currentVideoUrl, nextVideoUrl],
  )

  const handleNextBackgroundVideoLoad = useCallback(() => {
    const iframe = nextBackgroundVideoRef.current
    if (!iframe) {
      return
    }

    // Ask YouTube player to start buffering/playing the next stream in background.
    iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', "*")
  }, [])

  const backgroundVideoStyle = isHorizontal
    ? {
        width: "177.77vh", // 16:9
        height: "100vh",
        minWidth: "100vw",
        minHeight: "56.25vw",
        position: "absolute" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }
    : {
        width: "100vw",
        height: "177.77vw", // 9:16
        minWidth: "56.25vh",
        minHeight: "100vh",
        position: "absolute" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }

  const getSectionElement = useCallback((section: string): HTMLDivElement | null => {
    const normalizedSection = section === "location" ? "lokalita" : section === "home" ? "mlyn" : section

    if (normalizedSection === "mlyn") return mlynSectionRef.current
    if (normalizedSection === "studio") return studioSectionRef.current
    if (normalizedSection === "equipment") return equipmentSectionRef.current
    if (normalizedSection === "lokalita") return lokalitaSectionRef.current
    if (normalizedSection === "about") return onasSectionRef.current
    if (normalizedSection === "contact") return contactSectionRef.current

    return null
  }, [])

  const scrollToContentElement = useCallback((target: Element | null, behavior: ScrollBehavior = "smooth") => {
    if (!target) return

    const rootElement = contentScrollRef.current
    if (!rootElement) {
      target.scrollIntoView({ behavior, block: "start" })
      return
    }

    const rootRect = rootElement.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const top = targetRect.top - rootRect.top + rootElement.scrollTop

    rootElement.scrollTo({ top: Math.max(0, top), behavior })
  }, [])

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowFooterNote(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const sectionParam = searchParams.get("section")
    if (!sectionParam) return

    const normalizedSection =
      sectionParam === "location" ? "lokalita" : sectionParam === "home" ? "mlyn" : sectionParam
    if (!sectionOrder.includes(normalizedSection)) return

    setCurrentSection(normalizedSection)
    activeSectionRef.current = normalizedSection

    requestAnimationFrame(() => {
      if (normalizedSection === "spoluprace") {
        const element = document.getElementById("collaboration")
        scrollToContentElement(element, "auto")
        return
      }

      const targetElement = getSectionElement(normalizedSection)
      scrollToContentElement(targetElement, "auto")
    })
  }, [getSectionElement, scrollToContentElement, searchParams])

  useEffect(() => {
    activeSectionRef.current = currentSection
  }, [currentSection])

  // Sync language with URL changes
  useEffect(() => {
    const lang = searchParams.get("lang")
    let detectedLang: "cs" | "en" | "de" = "cs"
    if (lang === "en") detectedLang = "en"
    else if (lang === "de") detectedLang = "de"

    if (detectedLang !== language) {
      setLanguage(detectedLang)
    }
  }, [searchParams])

  useEffect(() => {
    if (showDraftBanner) {
      const timer = setTimeout(() => {
        setShowDraftBanner(false)
        setDraftBannerDismissed(true)
      }, 8000) // Hide after 8 seconds
      return () => clearTimeout(timer)
    }
  }, [showDraftBanner])

  // The API was not being used since videos are loaded via iframe src directly

  // Scroll detection didn't work because content fits on screen without scrolling

  const toggleVideo = () => {
    const shouldPause = isVideoPlaying
    const command = shouldPause ? "pauseVideo" : "playVideo"
    const iframes = document.querySelectorAll<HTMLIFrameElement>('iframe[data-bg-video="true"]')

    iframes.forEach((iframe) => {
      iframe.contentWindow?.postMessage(`{"event":"command","func":"${command}","args":""}`, "*")
    })

    setIsVideoPlaying(!shouldPause)
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    const newVideoId = getBackgroundVideoId(currentSection, newDarkMode, isHorizontal)

    console.log(
      "[v0] Switching to dark mode:",
      newDarkMode,
      "video:",
      newVideoId,
      "Section:",
      currentSection,
      "Horizontal:",
      isHorizontal,
    )

    const newUrl = buildVideoUrl(newVideoId)
    startVideoCrossfade(newUrl)
  }

  const handleSectionChange = (section: string) => {
    const normalizedSection = section === "location" ? "lokalita" : section === "home" ? "mlyn" : section

    console.log("[v0] Switching to section:", normalizedSection)

    const currentParams = new URLSearchParams(window.location.search)
    currentParams.set("section", normalizedSection)

    const newUrl = `${window.location.pathname}?${currentParams.toString()}`
    window.history.replaceState({}, "", newUrl)

    setCurrentSection(normalizedSection)
    activeSectionRef.current = normalizedSection
    setShowMobileMenu(false)
    setShowLanguageMenu(false)

    if (normalizedSection === "spoluprace") {
      const element = document.getElementById("collaboration")
      scrollToContentElement(element, "smooth")
      return
    }

    const sectionElement = getSectionElement(normalizedSection)
    scrollToContentElement(sectionElement, "smooth")

    console.log("[v0] Section changed; background video switch waits for idle timer.")
  }

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return

      try {
        const rawData = typeof event.data === "string" ? JSON.parse(event.data) : event.data
        const data = rawData as { event?: string; info?: number }
        const currentBackgroundWindow = currentBackgroundVideoRef.current?.contentWindow
        const nextBackgroundWindow = nextBackgroundVideoRef.current?.contentWindow
        const isCurrentBackgroundVideo = Boolean(currentBackgroundWindow && event.source === currentBackgroundWindow)
        const isNextBackgroundVideo = Boolean(nextBackgroundWindow && event.source === nextBackgroundWindow)

        if (isNextBackgroundVideo) {
          // Run crossfade only when next video is actually playing (buffered enough).
          if (data.event === "onStateChange" && Number(data.info) === 1) {
            setIsNextVideoReady(true)
          }
          return
        }

        if (!isCurrentBackgroundVideo) {
          return
        }

        // YouTube Player API sends events like {"event":"onStateChange","info":0}
        // 0 = ended, 1 = playing, 2 = paused
        if (data.event === "onStateChange" && data.info === 0) {
          console.log("[v0] Video ended, moving to next section")
          setVideoEnded(true)

          // Auto-advance to next section
          const sections = ["mlyn", "about", "lokalita", "equipment", "contact"]
          const currentIndex = sections.indexOf(currentSection)
          if (currentIndex < sections.length - 1) {
            const nextSection = sections[currentIndex + 1]
            console.log("[v0] Auto-advancing to section:", nextSection)
            handleSectionChange(nextSection)
            setVideoEnded(false) // Reset for the next video
          } else {
            console.log("[v0] Video ended, but it was the last section.")
            setVideoEnded(false) // Reset for the next video
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [currentSection]) // Removed handleSectionChange from dependencies

  const switchVideoToActiveSection = useCallback(() => {
    const activeSection = activeSectionRef.current === "home" ? "mlyn" : activeSectionRef.current
    const newVideoId = getBackgroundVideoId(activeSection, isDarkMode, isHorizontal)
    const newUrl = buildVideoUrl(newVideoId)

    if (newUrl === currentVideoUrl || newUrl === nextVideoUrl) {
      return
    }

    startVideoCrossfade(newUrl)
  }, [currentVideoUrl, isDarkMode, isHorizontal, nextVideoUrl, startVideoCrossfade])

  useEffect(() => {
    const rootElement = contentScrollRef.current
    if (!rootElement) {
      return
    }

    const armIdleTimer = () => {
      clearSectionVideoIdle()
      sectionVideoIdleRef.current = setTimeout(() => {
        sectionVideoIdleRef.current = null
        switchVideoToActiveSection()
      }, SECTION_VIDEO_IDLE_MS)
    }

    armIdleTimer()

    const handleScroll = () => {
      armIdleTimer()
    }

    rootElement.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      rootElement.removeEventListener("scroll", handleScroll)
      clearSectionVideoIdle()
    }
  }, [clearSectionVideoIdle, switchVideoToActiveSection])

  useEffect(() => {
    if (!nextVideoUrl || !isNextVideoReady) {
      return
    }

    if (videoCrossfadeTimeoutRef.current) {
      clearTimeout(videoCrossfadeTimeoutRef.current)
      videoCrossfadeTimeoutRef.current = null
    }
    if (videoCrossfadeRafRef.current !== null) {
      window.cancelAnimationFrame(videoCrossfadeRafRef.current)
      videoCrossfadeRafRef.current = null
    }

    videoCrossfadeRafRef.current = window.requestAnimationFrame(() => {
      setIsTransitioning(true)
    })

    const targetUrl = nextVideoUrl
    videoCrossfadeTimeoutRef.current = setTimeout(() => {
      setCurrentVideoUrl(targetUrl)
      setNextVideoUrl("")
      setIsNextVideoReady(false)
      setIsTransitioning(false)
      setIsVideoPlaying(true)
    }, VIDEO_CROSSFADE_MS)
  }, [isNextVideoReady, nextVideoUrl])

  useEffect(() => {
    return () => {
      clearVideoCrossfade()
      clearSectionVideoIdle()
    }
  }, [clearSectionVideoIdle, clearVideoCrossfade])

  useEffect(() => {
    const rootElement = contentScrollRef.current
    if (!rootElement) return

    const sectionElements = observableSections
      .map((section) => ({
        section,
        element: getSectionElement(section),
      }))
      .filter((entry): entry is { section: (typeof observableSections)[number]; element: HTMLDivElement } =>
        Boolean(entry.element),
      )

    if (!sectionElements.length) return

    const visibilityMap: Partial<Record<(typeof observableSections)[number], number>> = {}
    sectionElements.forEach(({ section }) => {
      visibilityMap[section] = section === "mlyn" ? 1 : 0
    })

    const updateActiveSection = () => {
      const currentObservedSection = observableSections.includes(activeSectionRef.current as (typeof observableSections)[number])
        ? (activeSectionRef.current as (typeof observableSections)[number])
        : "mlyn"

      const bestVisibleSection = sectionElements.reduce(
        (best, current) => {
          const currentRatio = visibilityMap[current.section] ?? 0
          if (currentRatio > best.ratio) {
            return { section: current.section, ratio: currentRatio }
          }
          return best
        },
        { section: currentObservedSection, ratio: 0 },
      )

      if (bestVisibleSection.ratio < 0.01) {
        return
      }

      if (bestVisibleSection.section !== activeSectionRef.current) {
        activeSectionRef.current = bestVisibleSection.section
        setCurrentSection(bestVisibleSection.section)

        const params = new URLSearchParams(window.location.search)
        params.set("section", bestVisibleSection.section)
        window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute("data-section-id") as (typeof observableSections)[number] | null
          if (!sectionId) return
          visibilityMap[sectionId] = entry.isIntersecting ? entry.intersectionRatio : 0
        })
        updateActiveSection()
      },
      {
        root: rootElement,
        threshold: [0, 0.05, 0.1, 0.15, 0.2],
      },
    )

    sectionElements.forEach(({ element }) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [getSectionElement])

  const toggleLanguage = () => {
    setShowLanguageMenu(!showLanguageMenu)
  }

  useEffect(() => {
    const langFromPath = searchParams.get("lang")
    let detectedLang: "cs" | "en" | "de" = "cs"
    if (langFromPath === "en") detectedLang = "en"
    else if (langFromPath === "de") detectedLang = "de"
    setLanguage(detectedLang)
  }, [searchParams])

  return (
    <div className="min-h-screen relative">
      {showDraftBanner && (
        <div className="fixed top-16 left-0 z-40 animate-in slide-in-from-left duration-700">
          <div className="bg-black/20 backdrop-blur-md px-4 py-2 shadow-sm border-r border-white/10">
            <div className="max-w-md flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs text-white/90 font-normal">
                  {language === "cs" ? "Draft verze" : language === "en" ? "Draft Version" : "Entwurfsversion"}
                </p>
                <p className="text-[10px] text-white/70 mt-0.5 leading-relaxed">
                  {language === "cs"
                    ? "Web slouží k navazování spoluprací a získání zpětné vazby před oficiálním spuštěním; obsah webu i studia je průběžně aktualizován."
                    : language === "en"
                      ? "This website serves for establishing collaborations and gathering feedback before official launch; content is continuously updated."
                      : "Diese Website dient der Zusammenarbeit und dem Feedback vor dem offiziellen Start; Inhalte werden kontinuierlich aktualisiert."}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDraftBanner(false)
                  setDraftBannerDismissed(true)
                }}
                className="text-white/60 hover:text-white/90 transition-colors mt-0.5"
                aria-label="Close banner"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {draftBannerDismissed && !showDraftBanner && (
        <button
          onClick={() => setShowDraftBanner(true)}
          className="fixed top-20 left-0 z-40 bg-black/20 backdrop-blur-md hover:bg-black/30 text-white/60 hover:text-white/90 p-2 rounded-r-lg shadow-sm border-r border-t border-b border-white/10 transition-all duration-300"
          aria-label="Show draft info"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      

      <div className="fixed inset-0 z-0">
        {currentSection !== "home" ? (
          <>
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <iframe
              ref={currentBackgroundVideoRef}
              data-bg-video="true"
              className="absolute pointer-events-none opacity-100"
              style={backgroundVideoStyle}
              src={currentVideoUrl}
              title="Mlýn na Pile Background Video - current"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            {nextVideoUrl ? (
              <iframe
                ref={nextBackgroundVideoRef}
                data-bg-video="true"
                id="background-video"
                className={`absolute pointer-events-none transition-opacity duration-[2000ms] ${isTransitioning ? "opacity-100" : "opacity-0"}`}
                style={backgroundVideoStyle}
                src={nextVideoUrl}
                onLoad={handleNextBackgroundVideoLoad}
                title="Mlýn na Pile Background Video - next"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : null}
            <div className="absolute inset-0 bg-black/35 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/40 to-transparent pointer-events-none" />
            <div
              className={`absolute inset-0 bg-black/70 transition-opacity duration-500 pointer-events-none ${
                isOverlayPreview || !isVideoPlaying ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : null}

        {currentSection === "home" && (
          <div
            className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: isDarkMode
                ? `url("/images/twilight-lake.jpeg")`
                : `url("/images/847bbd26-f10f-443a-8db7-94666e95a9a5.jpeg")`,
              zIndex: 0,
            }}
          />
        )}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col pb-24">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 p-6 transition-all duration-300 bg-transparent">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-3 relative">
            {/* Main menu - centered */}
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center space-x-3 md:space-x-6 text-white/90 px-3 md:px-6 py-3 rounded-lg text-[10px] md:text-xs">
                <button onClick={() => handleSectionChange("mlyn")} className="hover:text-white transition-colors">
                  {t.nav.mlyn}
                </button>
                <button onClick={() => handleSectionChange("studio")} className="hover:text-white transition-colors">
                  {t.nav.studio}
                </button>
                <button onClick={() => handleSectionChange("equipment")} className="hover:text-white transition-colors">
                  {t.nav.equipment}
                </button>
                <button onClick={() => handleSectionChange("lokalita")} className="hover:text-white transition-colors">
                  {t.nav.location}
                </button>
                <button onClick={() => handleSectionChange("about")} className="hover:text-white transition-colors">
                  {t.nav.about}
                </button>
                <button onClick={() => handleSectionChange("contact")} className="hover:text-white transition-colors">
                  {t.nav.contact}
                </button>
              </div>
            </div>

            <div className="flex md:hidden gap-2 justify-center md:absolute md:right-0">
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleLanguage}
                  className="bg-white/5 backdrop-blur-sm border-white/20 text-white/70 hover:bg-white/10 hover:text-white h-6 w-6"
                >
                  <Globe className="h-2.5 w-2.5" />
                </Button>
                {showLanguageMenu && (
                  <div className="absolute top-full mt-1 right-0 bg-black/80 backdrop-blur-sm rounded-lg p-1 flex flex-col gap-1 min-w-[60px] z-50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLanguage("cs")
                        router.push("/?lang=cs")
                        setShowLanguageMenu(false)
                      }}
                      className={`${language === "cs" ? "bg-white/20" : ""} text-white/90 hover:bg-white/10`}
                    >
                      CS
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLanguage("en")
                        router.push("/?lang=en")
                        setShowLanguageMenu(false)
                      }}
                      className={`${language === "en" ? "bg-white/20" : ""} text-white/90 hover:bg-white/10`}
                    >
                      EN
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLanguage("de")
                        router.push("/?lang=de")
                        setShowLanguageMenu(false)
                      }}
                      className={`${language === "de" ? "bg-white/20" : ""} text-white/90 hover:bg-white/10`}
                    >
                      DE
                    </Button>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleDarkMode}
                className={`bg-white/5 backdrop-blur-sm border-white/20 text-white/70 hover:bg-white/10 hover:text-white h-6 w-6 ${
                  isDarkMode ? "bg-blue-500/30 text-white" : "bg-amber-500/30 text-white"
                }`}
                title={isDarkMode ? t.mlyn.darkMode : t.mlyn.lightMode}
              >
                {isDarkMode ? <Moon className="h-2.5 w-2.5" /> : <Sun className="h-2.5 w-2.5" />}
              </Button>

              {currentSection !== "home" && currentSection !== "studio" ? (
                <div className="relative group">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleVideo}
                    onMouseEnter={() => setIsOverlayPreview(true)}
                    onMouseLeave={() => setIsOverlayPreview(false)}
                    onFocus={() => setIsOverlayPreview(true)}
                    onBlur={() => setIsOverlayPreview(false)}
                    className={`pulse-soft bg-white/5 backdrop-blur-sm border-white/20 text-white/70 hover:bg-white/10 hover:text-white h-6 w-6 transition-all ${
                      isOverlayPreview
                        ? isDarkMode
                          ? "bg-blue-500/30 text-white"
                          : "bg-amber-500/30 text-white"
                        : ""
                    }`}
                    title="Ztmavnout pozadí pro čtení"
                    aria-label={isVideoPlaying ? "Pozastavit video pozadí" : "Spustit video pozadí"}
                  >
                    {isVideoPlaying ? <Pause className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5" />}
                  </Button>
                  <span className="absolute -bottom-7 right-0 whitespace-nowrap rounded-md bg-black/80 text-white text-[10px] px-2 py-1 opacity-0 translate-y-1 transition-all duration-200 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
                    Ztmavnout pozadí pro čtení
                  </span>
                </div>
              ) : null}
            </div>

            <div className="hidden md:flex gap-2 md:absolute md:right-0">
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleLanguage}
                  className="bg-white/5 backdrop-blur-sm border-white/20 text-white/70 hover:bg-white/10 hover:text-white h-6 w-6"
                >
                  <Globe className="h-2.5 w-2.5" />
                </Button>
                {showLanguageMenu && (
                  <div className="absolute top-full mt-1 right-0 bg-black/80 backdrop-blur-sm rounded-lg p-1 flex flex-col gap-1 min-w-[60px] z-50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLanguage("cs")
                        router.push("/?lang=cs")
                        setShowLanguageMenu(false)
                      }}
                      className={`${language === "cs" ? "bg-white/20" : ""} text-white/90 hover:bg-white/10`}
                    >
                      CS
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLanguage("en")
                        router.push("/?lang=en")
                        setShowLanguageMenu(false)
                      }}
                      className={`${language === "en" ? "bg-white/20" : ""} text-white/90 hover:bg-white/10`}
                    >
                      EN
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLanguage("de")
                        router.push("/?lang=de")
                        setShowLanguageMenu(false)
                      }}
                      className={`${language === "de" ? "bg-white/20" : ""} text-white/90 hover:bg-white/10`}
                    >
                      DE
                    </Button>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleDarkMode}
                className={`bg-white/5 backdrop-blur-sm border-white/20 text-white/70 hover:bg-white/10 hover:text-white h-6 w-6 ${
                  isDarkMode ? "bg-blue-500/30 text-white" : "bg-amber-500/30 text-white"
                }`}
                title={isDarkMode ? t.mlyn.darkMode : t.mlyn.lightMode}
              >
                {isDarkMode ? <Moon className="h-2.5 w-2.5" /> : <Sun className="h-2.5 w-2.5" />}
              </Button>

              {currentSection !== "home" && currentSection !== "studio" ? (
                <div className="relative group">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleVideo}
                    onMouseEnter={() => setIsOverlayPreview(true)}
                    onMouseLeave={() => setIsOverlayPreview(false)}
                    onFocus={() => setIsOverlayPreview(true)}
                    onBlur={() => setIsOverlayPreview(false)}
                    className={`pulse-soft bg-white/5 backdrop-blur-sm border-white/20 text-white/70 hover:bg-white/10 hover:text-white h-6 w-6 transition-all ${
                      isOverlayPreview
                        ? isDarkMode
                          ? "bg-blue-500/30 text-white"
                          : "bg-amber-500/30 text-white"
                        : ""
                    }`}
                    title="Ztmavnout pozadí pro čtení"
                    aria-label={isVideoPlaying ? "Pozastavit video pozadí" : "Spustit video pozadí"}
                  >
                    {isVideoPlaying ? <Pause className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5" />}
                  </Button>
                  <span className="absolute -bottom-7 right-0 whitespace-nowrap rounded-md bg-black/80 text-white text-[10px] px-2 py-1 opacity-0 translate-y-1 transition-all duration-200 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
                    Ztmavnout pozadí pro čtení
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </nav>

        <div
          className="fixed top-0 left-0 right-0 h-32 pointer-events-none z-40"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          }}
        />
        <div className="h-screen flex flex-col">
          {showPresentationMessage && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-16 text-white text-xl font-light z-50 transition-opacity duration-1000"
              style={{ opacity: presentationOpacity }}
            >
              {t.mlyn.endMessage}
            </div>
          )}

          {showEndMessage && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white/90 text-base font-light animate-in fade-in duration-500 z-50 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              {t.mlyn.endMessage}
            </div>
          )}

          <div ref={contentScrollRef} className="flex-1 overflow-y-auto scroll-smooth snap-y snap-proximity">
            <>
              <div
                id="mlyn"
                data-section-id="mlyn"
                ref={mlynSectionRef}
                className="snap-start min-h-screen pt-32 pb-32"
              >
                <div className="px-6 py-12">
                  <div className="text-center max-w-5xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">{t.mlyn.title}</h1>
                    <p className="text-lg md:text-2xl text-white/90 font-light mb-8">{t.mlyn.subtitle}</p>
                    <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
                      {t.mlyn.description}
                    </p>
                  </div>

                  {/* Benefits Cards Grid */}
                  <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-32">
                      <Card
                        className="bg-white/5 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
                        onClick={() => handleSectionChange("equipment")}
                      >
                        <CardContent className="p-4 text-center">
                          <Music
                            className={`h-8 w-8 mx-auto mb-4 ${isDarkMode ? "text-blue-400" : "text-secondary"}`}
                          />
                          <h3 className="text-white font-semibold mb-2">{t.mlyn.vintageInstruments}</h3>
                          <p className="text-white/80 text-xs">{t.mlyn.vintageDesc}</p>
                        </CardContent>
                      </Card>

                      <Card
                        className="bg-white/5 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
                        onClick={() => {
                          handleSectionChange("studio")
                          // Scroll to accommodation packages after section change
                          setTimeout(() => {
                            const accommodationSection = document.querySelector(
                              '[data-section="accommodation-packages"]',
                            )
                            if (accommodationSection) {
                              accommodationSection.scrollIntoView({ behavior: "smooth", block: "start" })
                            }
                          }, 100)
                        }}
                      >
                        <CardContent className="p-4 text-center">
                          <Home className={`h-8 w-8 mx-auto mb-4 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          <h3 className="text-white font-semibold mb-2">{t.mlyn.accommodation}</h3>
                          <p className="text-white/80 text-xs">{t.mlyn.accommodationDesc}</p>
                        </CardContent>
                      </Card>

                      <Card
                        className="bg-white/5 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
                        onClick={() => handleSectionChange("lokalita")}
                      >
                        <CardContent className="p-4 text-center">
                          <MapPin
                            className={`h-8 w-8 mx-auto mb-4 ${isDarkMode ? "text-blue-400" : "text-secondary"}`}
                          />
                          <h3 className="text-white font-semibold mb-2">{t.mlyn.locationCard}</h3>
                          <p className="text-white/80 text-xs">{t.mlyn.locationDesc}</p>
                        </CardContent>
                      </Card>

                      <Card
                        className="bg-white/5 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
                        onClick={() => handleSectionChange("studio")}
                      >
                        <CardContent className="p-4 text-center">
                          <Headphones
                            className={`h-8 w-8 mx-auto mb-4 ${isDarkMode ? "text-blue-400" : "text-secondary"}`}
                          />
                          <h3 className="text-white font-semibold mb-2">{t.mlyn.studios}</h3>
                          <p className="text-white/80 text-xs whitespace-pre-line">{t.mlyn.studiosDesc}</p>
                        </CardContent>
                      </Card>

                      <Card
                        className="bg-white/5 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
                        onClick={() => handleSectionChange("equipment")}
                      >
                        <CardContent className="p-4 text-center">
                          <Mic className={`h-8 w-8 mx-auto mb-4 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          <h3 className="text-white font-semibold mb-2">{t.mlyn.modernTech}</h3>
                          <p className="text-white/80 text-xs">{t.mlyn.modernTechDesc}</p>
                        </CardContent>
                      </Card>

                      <Card
                        className="bg-white/5 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
                        onClick={() => {
                          handleSectionChange("studio")
                          // Scroll to accommodation packages after section change
                          setTimeout(() => {
                            const accommodationSection = document.querySelector(
                              '[data-section="accommodation-packages"]',
                            )
                            if (accommodationSection) {
                              accommodationSection.scrollIntoView({ behavior: "smooth", block: "start" })
                            }
                          }, 300)
                        }}
                      >
                        <CardContent className="p-4 text-center">
                          <Calendar
                            className={`h-8 w-8 mx-auto mb-4 ${isDarkMode ? "text-blue-400" : "text-secondary"}`}
                          />
                          <h3 className="text-white font-semibold mb-2">{t.mlyn.benefits}</h3>
                          <p className="text-white/80 text-xs">{t.mlyn.benefitsDesc}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="studio"
                data-section-id="studio"
                ref={studioSectionRef}
                className="snap-start min-h-screen pt-32 pb-32"
              >
                {/* Hero Section */}
                <div className="flex items-center justify-center px-6 py-16 text-white">
                  <div className="text-center max-w-5xl">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-balance text-white drop-shadow-lg">
                      {t.studio.title}
                    </h1>
                    <p className="text-lg md:text-xl font-light mb-2 text-white drop-shadow-lg">{t.studio.subtitle}</p>
                    <p className="text-sm md:text-base text-white/95 max-w-3xl mx-auto drop-shadow-lg">
                      {t.studio.description}
                    </p>
                  </div>
                </div>
                {/* Hlavní Studio Section */}
                <div className="flex items-center px-6 py-12 bg-black/60 text-white">
                  <div className="max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                          {t.studio.mainStudio}
                        </h2>
                        <p className="text-xl font-light text-white/95 drop-shadow-lg">{t.studio.mainStudioSize}</p>
                        <p className="text-base leading-relaxed text-white/90 drop-shadow-md">
                          {t.studio.mainStudioDesc}
                        </p>
                        <div className="space-y-2 text-xs text-white/90">
                          <h3 className="text-lg font-semibold text-white drop-shadow-lg">{t.studio.equipment}</h3>
                          <ul className="space-y-1">
                            {t.studio.equipmentHighlights.map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group">
                        <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/O431B93W9UY?autoplay=1&mute=1&loop=1&playlist=O431B93W9UY&controls=0&showinfo=0&rel=0&modestbranding=1&vq=highres&quality=highres&playsinline=1&enablejsapi=1"
                          title="Hlavní Studio"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Control Room Section */}
                <div className="flex items-center px-6 py-12 bg-white/10 backdrop-blur-sm text-white">
                  <div className="max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group order-2 lg:order-1">
                        <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/u2ylGCNnV50?autoplay=1&mute=1&loop=1&playlist=u2ylGCNnV50&controls=0&showinfo=0&rel=0&modestbranding=1&vq=highres&quality=highres&playsinline=1&enablejsapi=1"
                          title="Control Room"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      </div>
                      <div className="space-y-4 order-1 lg:order-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                          {t.studio.controlRoom}
                        </h2>
                        <p className="text-xl font-light text-white/95 drop-shadow-lg">{t.studio.controlRoomSize}</p>
                        <p className="text-base leading-relaxed text-white/90 drop-shadow-md">
                          {t.studio.controlRoomDesc}
                        </p>
                        <div className="space-y-2 text-xs text-white/90">
                          <h3 className="text-lg font-semibold text-white drop-shadow-lg">{t.studio.technology}</h3>
                          <ul className="space-y-1">
                            <li>• Universal Audio Apollo x8p Gen2 Studio+</li>
                            <li>• MAC + Apple Pro Display XDR 6K monitor</li>
                            <li>• 76 UAD plug-ins</li>
                            <li>• Logic Pro X + UA LUNA</li>
                            <li>• Projektor pro screening</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Druhé Studio Section */}
                <div className="flex items-center px-6 py-12 bg-black/60 text-white">
                  <div className="max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                          {t.studio.millstoneStudio}
                        </h2>
                        <p className="text-xl font-light text-white/95 drop-shadow-lg">{t.studio.millstoneSize}</p>
                        <p className="text-base leading-relaxed text-white/90 drop-shadow-md">
                          {t.studio.millstoneDesc}
                        </p>
                      </div>
                      <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group">
                        <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/mndh51Ug7zg?autoplay=1&mute=1&loop=1&playlist=mndh51Ug7zg&controls=0&showinfo=0&rel=0&modestbranding=1&vq=highres&quality=highres&playsinline=1&enablejsapi=1"
                          title="Millstone Studio"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Accommodation Packages Section */}
                <div
                  className="px-6 py-16 bg-white/5 backdrop-blur-sm text-white"
                  data-section="accommodation-packages"
                >
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 drop-shadow-lg">
                        {t.studio.accommodation.title}
                      </h2>
                      <p className="text-base md:text-lg text-white/90 max-w-4xl mx-auto mb-4 drop-shadow-md">
                        {t.studio.accommodation.subtitle}
                      </p>
                      <p className="text-lg font-semibold text-white/95 drop-shadow-md">
                        {t.studio.accommodation.intro}
                      </p>
                    </div>

                    <div className="space-y-8">
                      {t.studio.accommodation.packages.map((pkg, index) => (
                        <div key={index} className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                              <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                                {index + 1}. {t.studio.accommodation.packageLabel} "{pkg.name}"
                              </h3>
                              <p className="text-xs text-white/90 font-mono">{pkg.tags}</p>
                              <p className="text-xs text-white/80 leading-relaxed mt-4">
                                {pkg.description.split(/(\[lokalita\]|Fuel)/).map((part, i) => {
                                  if (part === "[lokalita]") {
                                    return (
                                      <span
                                        key={i}
                                        onClick={() => handleSectionChange("location")}
                                        className={`cursor-pointer underline ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-secondary hover:text-secondary/80"}`}
                                      >
                                        lokalita
                                      </span>
                                    )
                                  } else if (part === "Fuel") {
                                    return (
                                      <a
                                        key={i}
                                        href="https://www.youtube.com/watch?v=UkekVsnQuaM&list=RDUkekVsnQuaM&start_radio=1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`underline ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-secondary hover:text-secondary/80"}`}
                                      >
                                        {part}
                                      </a>
                                    )
                                  }
                                  return part
                                })}
                              </p>

                              <p className="text-sm leading-relaxed text-white/80">
                                {pkg.details.includes("[lokalita]") ||
                                pkg.details.includes("[location]") ||
                                pkg.details.includes("[Standort]") ? (
                                  <>
                                    {pkg.details.split(/\[(lokalita|location|Standort)\]/)[0]}
                                    <button
                                      onClick={() => handleSectionChange("lokalita")}
                                      className="text-secondary hover:text-secondary/80 underline cursor-pointer"
                                    >
                                      {currentLang === "cs"
                                        ? "lokalita"
                                        : currentLang === "en"
                                          ? "location"
                                          : "Standort"}
                                    </button>
                                    {pkg.details.split(/\[(lokalita|location|Standort)\]/)[2]}
                                  </>
                                ) : (
                                  pkg.details
                                )}
                              </p>
                            </div>
                            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                              {pkg.video ? (
                                <iframe
                                  className="w-full h-full"
                                  src={`${pkg.video.replace("youtu.be/", "www.youtube.com/embed/")}?autoplay=1&mute=1&loop=1&playlist=${pkg.video.split("/").pop()}&controls=0&showinfo=0&rel=0&modestbranding=1&vq=highres&quality=highres&playsinline=1&enablejsapi=1`}
                                  title={pkg.name}
                                  allow="autoplay; encrypted-media"
                                  allowFullScreen
                                />
                              ) : (
                                <div className="w-full h-full bg-black/60 flex items-center justify-center">
                                  <p className="text-white/60 text-base">Video bude doplněno</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-12 text-center">
                      <p className="text-base text-white/80 flex items-center justify-center gap-2">
                        <Car className="h-5 w-5" />
                        {t.studio.accommodation.parking}
                      </p>
                      <p className="text-xs md:text-sm text-white/80 leading-relaxed mt-3">
                        {t.studio.accommodation.accommodationNote}
                      </p>
                    </div>

                    {/* Bonuses Section */}
                    <div className="mt-16">
                      <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 text-center">
                        {t.studio.accommodation.bonuses.title}
                      </h2>
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-8">
                          <div className="space-y-3">
                            {t.studio.accommodation.bonuses.items.map((bonus, index) => (
                              <p
                                key={index}
                                className="text-white/90 text-xs leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: bonus }}
                              />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
                {/* CTA Section */}
                <div className="flex items-center justify-center px-6 py-16 bg-black/70 text-white">
                  <div className="text-center max-w-3xl bg-black/50 backdrop-blur-sm rounded-xl px-6 py-6">
                    <button
                      onClick={() => handleSectionChange("contact")}
                      className={`text-[10px] md:text-xs font-bold text-white drop-shadow-lg underline-offset-4 hover:underline ${
                        isDarkMode ? "hover:text-blue-300" : "hover:text-secondary"
                      }`}
                      aria-label={t.studio.ctaButton}
                    >
                      {t.studio.ctaTitle}
                    </button>
                    {t.studio.ctaDesc ? (
                      <p className="text-base mt-3 text-white/90 drop-shadow-md">{t.studio.ctaDesc}</p>
                    ) : null}
                  </div>
                </div>
              </div>
              <div
                id="lokalita"
                data-section-id="lokalita"
                ref={lokalitaSectionRef}
                className="snap-start min-h-screen px-6 py-12 pt-32 pb-32"
              >
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 text-balance">{t.location.title}</h1>
                    <p className="text-lg md:text-xl text-white/90 font-light">{t.location.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <h3 className="text-white font-semibold mb-4 text-center text-lg">{t.location.nature}</h3>
                        <div className="text-white/80 text-xs space-y-4 leading-relaxed">
                          <p>{t.location.naturePara1}</p>
                          <p>{t.location.naturePara2}</p>
                          <p>{t.location.naturePara3}</p>
                          <p
                            className={`italic pl-4 mt-4 border-l-2 ${isDarkMode ? "border-blue-400" : "border-secondary"}`}
                          >
                            "{t.location.quote}"
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-white mb-6">{t.location.transport}</h3>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-4">
                            <MapPin
                              className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"} mt-1 flex-shrink-0`}
                            />
                            <div>
                              <h4 className="font-semibold text-white mb-2">{t.location.byCar}</h4>
                              <ul className="space-y-1 text-xs text-white">
                                {t.location.availabilityItems.slice(0, 2).map((item, i) => (
                                  <li key={i}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="flex items-start space-x-4">
                            <MapPin
                              className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"} mt-1 flex-shrink-0`}
                            />
                            <div>
                              <h4 className="font-semibold text-white mb-2">{t.location.byTrain}</h4>
                              <ul className="space-y-1 text-xs text-white">
                                {t.location.availabilityItems.slice(2, 3).map((item, i) => (
                                  <li key={i}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="flex items-start space-x-4">
                            <MapPin
                              className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"} mt-1 flex-shrink-0`}
                            />
                            <div>
                              <h4 className="font-semibold text-white mb-2">{t.location.byPlane}</h4>
                              <ul className="space-y-1 text-xs text-white">
                                {t.location.availabilityItems.slice(3, 6).map((item, i) => (
                                  <li key={i}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          {/* Added Tesla and Off-grid to DE and EN versions */}
                          <div className="flex items-start space-x-4">
                            <Car
                              className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"} mt-1 flex-shrink-0`}
                            />
                            <div>
                              <h4 className="font-semibold text-white mb-2">{t.location.teslaTitle}</h4>
                              <ul className="space-y-1 text-xs text-white">
                                <li>• {t.location.teslaDesc}</li>
                              </ul>
                            </div>
                          </div>
                          <div className="flex items-start space-x-4">
                            <Zap
                              className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"} mt-1 flex-shrink-0`}
                            />
                            <div>
                              <h4 className="font-semibold text-white mb-2">{t.location.energyTitle}</h4>
                              <ul className="space-y-1 text-xs text-white">
                                <li>• {t.location.energyDesc}</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.location.events}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      {/* Domažlice */}
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <MapPin
                              className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"} mt-1 flex-shrink-0`}
                            />
                            <h3 className="text-xl font-bold text-white">{t.location.domazliceTitle}</h3>
                          </div>
                          <ul className="text-white/80 space-y-2 text-xs">
                            {t.location.domazliceItems.map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Horšovský Týn */}
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <MapPin
                              className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"} mt-1 flex-shrink-0`}
                            />
                            <h3 className="text-xl font-bold text-white">{t.location.horsovskytynTitle}</h3>
                          </div>
                          <ul className="text-white/80 space-y-2 text-xs">
                            {t.location.horsovskytynItems.map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Babylon */}
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <MapPin
                              className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"} mt-1 flex-shrink-0`}
                            />
                            <h3 className="text-xl font-bold text-white">{t.location.babylonTitle}</h3>
                          </div>
                          <ul className="text-white/80 space-y-2 text-xs">
                            {t.location.babylonItems.map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Německo */}
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <MapPin
                              className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"} mt-1 flex-shrink-0`}
                            />
                            <h3 className="text-xl font-bold text-white">{t.location.germanyTitle}</h3>
                          </div>
                          <ul className="text-white/80 space-y-2 text-xs">
                            {t.location.germanyItems.map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.location.events}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Domažlice Events */}
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <Calendar
                              className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"} mt-1 flex-shrink-0`}
                            />
                            <h3 className="text-xl font-bold text-white">Domažlice</h3>
                          </div>
                          <ul className="text-white/80 space-y-3 text-xs">
                            {t.location.domazliceEvents.map((item, i) => (
                              <li key={i}>
                                <strong className="text-white">{item.month}:</strong> {item.event}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Horšovský Týn Events */}
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <Calendar
                              className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"} mt-1 flex-shrink-0`}
                            />
                            <h3 className="text-xl font-bold text-white">Horšovský Týn</h3>
                          </div>
                          <ul className="text-white/80 space-y-3 text-xs">
                            {t.location.horsovskytynEvents.map((item, i) => (
                              <li key={i}>
                                <strong className="text-white">{item.month}:</strong> {item.event}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Babylon Events */}
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <Calendar
                              className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"} mt-1 flex-shrink-0`}
                            />
                            <h3 className="text-xl font-bold text-white">Babylon</h3>
                          </div>
                          <ul className="text-white/80 space-y-3 text-xs">
                            {t.location.babylonEvents.map((item, i) => (
                              <li key={i}>
                                <strong className="text-white">{item.month}:</strong> {item.event}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <Calendar
                              className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"} mt-1 flex-shrink-0`}
                            />
                            <h3 className="text-xl font-bold text-white">{t.location.chamTitle}</h3>
                          </div>
                          <div className="text-white/80 space-y-3 text-xs">
                            <p>
                              <a
                                href="https://la-cham.de/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary hover:text-secondary/80 underline"
                              >
                                {t.location.chamClub}
                              </a>
                            </p>
                            <p>{t.location.chamDescription}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="equipment"
                data-section-id="equipment"
                ref={equipmentSectionRef}
                className="snap-start min-h-screen px-6 py-12 pt-32 pb-32"
              >
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 text-balance">{t.equipment.title}</h1>
                    <p className="text-lg md:text-xl text-white/90 font-light">{t.equipment.subtitle}</p>
                    <p className="text-xs md:text-sm text-white/80 mt-4 max-w-4xl mx-auto leading-relaxed">
                      {t.equipment.collectionNote}{" "}
                      <button
                        onClick={() => {
                          handleSectionChange("about")
                          setTimeout(() => {
                            const element = document.querySelector('[data-section="collaboration"]')
                            if (element) {
                              element.scrollIntoView({ behavior: "smooth", block: "start" })
                            }
                          }, 100)
                        }}
                        className={`underline ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-secondary hover:text-secondary/80"}`}
                      >
                        {t.equipment.collaborationLink}
                      </button>
                    </p>
                    <p className="text-xs md:text-sm text-white/80 mt-2 max-w-4xl mx-auto leading-relaxed">
                      {t.equipment.detailsNote}
                    </p>
                  </div>

                  {/* Vintage Nástroje - NOW FIRST */}
                  <div className="mb-8">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Guitar className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          {t.equipment.vintageInstruments}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">{t.equipment.guitars}</h4>
                            <div className="space-y-4">
                              <div>
                                <p className="text-white font-medium text-sm mb-1">Fender:</p>
                                <ul className="text-white/80 text-xs space-y-1.5">
                                  <li className="cursor-pointer hover:text-secondary transition-colors">
                                    <TooltipItem label="Fender Telecaster Deluxe (1973)" />
                                  </li>
                                  <li>
                                    <TooltipItem label="Fender Custom Shop - Jeff Beck (Surf Green)" />
                                  </li>
                                  <li>
                                    <TooltipItem label="Fender Custom Shop - LTD 67 HSS Strat AB HR" />
                                  </li>
                                  <li>
                                    <TooltipItem label="Fender Jaguar Kurt Cobain (with Graph Tech Bridge Saddles)" />
                                  </li>
                                  <li>
                                    <TooltipItem label="Fender Duo-Sonic (1964-65)" />
                                  </li>
                                  <li>
                                    <TooltipItem label="Fender Mustang (1967)" />
                                  </li>
                                  <li>
                                    <TooltipItem label="Fender Mustang (1966)" />
                                  </li>
                                </ul>
                              </div>
                              <div>
                                <p className="text-white font-medium text-sm mb-1">Gibson:</p>
                                <ul className="text-white/80 text-xs space-y-1.5">
                                  <li>
                                    <TooltipItem label="Gibson THE SG (1979)" />
                                  </li>
                                  <li>
                                    <TooltipItem label="Gibson Sonex (1981)" />
                                  </li>
                                  <li>
                                    <TooltipItem label="Gibson Firebird Studio Special (2004)" />
                                  </li>
                                  <li>
                                    <TooltipItem label="Gibson Firebird Studio (2006)" />
                                  </li>
                                  <li>
                                    <TooltipItem label="Gibson Les Paul Traditional (2009)" />
                                  </li>
                                  <li>
                                    <TooltipItem label="Gibson Les Paul Studio (1993) (with Graph Tech Bridge Saddles)" />
                                  </li>
                                  <li>
                                    <TooltipItem label="Gibson Explorer" />
                                  </li>
                                </ul>
                              </div>
                              <div>
                                <p className="text-white font-medium text-sm mb-1">Ostatní elektrické:</p>
                                <ul className="text-white/80 text-xs space-y-1.5">
                                  <li>• Harmony H14 (1984)</li>
                                  <li>
                                    <TooltipItem label="Maybach Teleman" />
                                  </li>
                                  <li>• Wandre Cobra (1964)</li>
                                  <li>• Washburn WJ7S</li>
                                  <li>• Harley Benton Thinline</li>
                                  <li>• Samick Warlock (1994)</li>
                                  <li>• Stratocaster Alto</li>
                                  <li>• Telecaster Country</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="text-base font-semibold text-white mb-3">{t.equipment.acousticGuitars}</h4>
                              <ul className="text-white/80 text-xs space-y-1.5">
                                <li>
                                  <TooltipItem label="Martin Guitar D-15E (Upgrade with Martin Guitar Bridge Pin Liquid Metal DG)" />
                                </li>
                                <li>
                                  <TooltipItem label="Fender FA-125 Nat" />
                                </li>
                                <li>• K Yairi 180</li>
                                <li>• Cremona</li>
                              </ul>
                            </div>

                            <div>
                              <h4 className="text-base font-semibold text-white mb-3">{t.equipment.basses}</h4>
                              <ul className="text-white/80 text-xs space-y-1.5">
                                <li>
                                  <TooltipItem label="Fender Precision (1993)" />
                                </li>
                                <li>• Squier short scale bass</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Kytara a Basa (Zesilovače a Boxy) - THIRD */}
                  <div className="mb-8">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Guitar className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          {t.equipment.ampsAndCabs}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">{t.equipment.amps}</h4>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              <li>
                                <TooltipItem label="Fender 64 Custom Deluxe Reverb" />
                              </li>
                              <li>
                                <TooltipItem label="Marshall AFD 100" />
                              </li>
                              <li>
                                <TooltipItem label="Mesa Boogie Rect-o-verb (upravená verze od Antonín Salva)" />
                              </li>
                              <li>
                                <TooltipItem label="Mesa Boogie Dual Rectifier® Head, 3 Channels / 8 Modes, 100W" />
                              </li>
                              <li>
                                <TooltipItem label="Tone King Imperial" />
                              </li>
                              <li>
                                <TooltipItem label="Roland JC-22" />
                              </li>
                              <li>
                                <TooltipItem label="Ampeg Reverbrocket R212" />
                              </li>
                              <li>
                                <TooltipItem label="Ampeg GVT5" />
                              </li>
                              <li>
                                <TooltipItem label="AMPEG V-4B Bass Head" />
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">{t.equipment.cabs}</h4>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              <li>
                                <TooltipItem label="Marshall 1960 BX" />
                              </li>
                              <li>• Coffe custom CLASSIC 212</li>
                              <li>
                                <TooltipItem label="Ampeg SVT-112AV Cabinet" />
                              </li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Efekty - Extensive Collection */}
                  <div className="mb-8">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Pedal className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          {t.equipment.effects}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px]">
                          <div className="space-y-1.5">
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">Dunlop DCR 2SR Rack Crybaby</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">Dunlop Dimebag Cry Baby Wah</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">Dunlop Zakk Wylde Rotovibe</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">G-LAB TBWP True Bypass Wah Pad (2x)</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">D&M Drive</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">Dunlop MXR MICRO AMP</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">Antonín Salva - Tone Wheel</p>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">KHDK Abyss</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">Digitech Whammy IV (červený, pitch shifter/harmonizer)</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">Gamechanger Audio Light Pedal</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">Gamechanger Audio Third Man Records PLASMA COIL</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">Strymon Timeline</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">TC Electronic PolyTune</p>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">Electro-Harmonix POG2 (polyfonní oktáver)</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">Strymon Zuma (3x)</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">Strymon Flint V2</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">Boss ODB-3</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">TC Electronic Plethora X5 (Looper/Effect)</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/90">EBow Plus</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <p className="text-white/60 italic">...a další</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Bicí - Drums Section */}
                  <div className="mb-8">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Drums className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          {t.equipment.drums}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">{t.equipment.drumsKit}</h4>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              {t.equipment.drumsKitDetails.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">{t.equipment.drumsSnare}</h4>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              {t.equipment.drumsSnareDetails.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">{t.equipment.drumsCymbals}</h4>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              {t.equipment.drumsCymbalsDetails.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">{t.equipment.drumsHardware}</h4>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              {t.equipment.drumsHardwareDetails.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Mikrofony - FOURTH */}
                  <div className="mb-8">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Mic className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          {t.equipment.mics}
                        </h3>
                        <ul className="text-white/80 text-xs space-y-1.5">
                          <li>
                            <TooltipItem label="Shure SM 7 B" />
                          </li>
                          <li>
                            <TooltipItem label="Shure Beta 58" />
                          </li>
                          <li>
                            <TooltipItem label="SHURE SM57" />
                          </li>
                          <li>
                            <TooltipItem label="Sennheiser e 906" />
                          </li>
                          <li>
                            <TooltipItem label="AKG D5" />
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Audio Interface - Recording Hardware */}
                  <div className="mb-8">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Music className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          {t.equipment.recordingHardware}
                        </h3>
                        <div>
                          <h4 className="text-base font-semibold text-white mb-3">{t.equipment.apolloTitle}</h4>
                          <ul className="text-white/80 text-xs space-y-1.5">
                            {t.equipment.apolloSpecs.map((spec, index) => (
                              <li key={index}>• {spec}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AUDIO/VIDEO PRODUCTION */}
                  <div className="mb-8">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Camera className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          AUDIO/VIDEO PRODUCTION
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">Hardware</h4>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              <li>• Apple Pro XDR 6K monitor pro color-accurate editing</li>
                              <li>• Professional video cameras pro session dokumentaci</li>
                              <li>• DJI Gimbal stabilizátor pro smooth camera movements</li>
                              <li>• Projektor pro screening a presentations</li>
                              <li>• Lighting equipment pro professional video shoots</li>
                              <li>• Reflektory Varytec LED Studio 150 2900K</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">Software</h4>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              <li>• Logic Pro X</li>
                              <li>• Final Cut Pro X</li>
                              <li>• Affinity</li>
                              <li>• Pixelmator Pro</li>
                              <li>• Motion</li>
                              <li>• Compressor</li>
                              <li>• MainStage</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Universal Audio Pluginy - LAST */}
                  <div className="mb-8">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Plug className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          {t.equipment.uaPlugins}
                        </h3>

                        {/* Microphone Preamps */}
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                            <Mic className={`h-5 w-5 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                            Microphone Preamps (7)
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                            {[
                              "Neve 1073 Collection",
                              "Precision Channel Strip",
                              "UA 610-A Preamp & EQ",
                              "UA 610-B Preamp & EQ",
                              "V76 Preamplifier",
                              "Avalon VT-737sp",
                              "Manley Reference",
                            ].map((item, i) => (
                              <div key={i} className="bg-white/5 p-2 rounded">
                                <p className="text-white/90">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Compressors */}
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                            <Shield className={`h-5 w-5 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                            Kompresory (24)
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-white/80 text-xs mb-2">Teletronix (6)</p>
                              <div className="space-y-1 text-[10px]">
                                {[
                                  "LA-2 Classic",
                                  "LA-2A Gray",
                                  "LA-2A Silver",
                                  "LA-2A Legacy",
                                  "LA-2A Tube",
                                  "LA-3A",
                                ].map((item, i) => (
                                  <div key={i} className="bg-white/5 p-1.5 rounded">
                                    <p className="text-white/90">{item}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-white/80 text-xs mb-2">UA 1176 (6)</p>
                              <div className="space-y-1 text-[10px]">
                                {[
                                  "1176 Rev A",
                                  "1176AE",
                                  "1176LN Rev E",
                                  "1176LN Legacy",
                                  "1176SE Legacy",
                                  "1176 FET",
                                ].map((item, i) => (
                                  <div key={i} className="bg-white/5 p-1.5 rounded">
                                    <p className="text-white/90">{item}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-white/80 text-xs mb-2">Další (12)</p>
                              <div className="space-y-1 text-[10px]">
                                {[
                                  "dbx 160",
                                  "Distressor",
                                  "UA 175B",
                                  "UA 176",
                                  "Fairchild 660",
                                  "Fairchild 670 Legacy",
                                  "Fairchild 670",
                                  "Precision Limiter",
                                  "Precision Multi-Band",
                                  "Precision Maximizer",
                                ].map((item, i) => (
                                  <div key={i} className="bg-white/5 p-1.5 rounded">
                                    <p className="text-white/90">{item}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Equalizers */}
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                            <Equalize className={`h-5 w-5 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                            Ekvalizéry (9)
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[10px]">
                            {[
                              "Pultec EQP-1A Legacy",
                              "Pultec EQP-1A Passive",
                              "Pultec HLF-3C",
                              "Pultec MEQ-5",
                              "Pultec Pro Legacy",
                              "A-Designs Hammer EQ",
                              "Helios Type 69",
                              "Neve 1073 EQ",
                            ].map((item, i) => (
                              <div key={i} className="bg-white/5 p-2 rounded">
                                <p className="text-white/90">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Virtual Instruments */}
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                            <Keyboard className={`h-5 w-5 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                            Virtuální Nástroje (6)
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[10px]">
                            {[
                              "Electra 88 Keyboard",
                              "Moog Minimoog",
                              "Opal Morphing Synth",
                              "PolyMAX Synth",
                              "Ravel Grand Piano",
                              "Waterfall B3 Organ",
                            ].map((item, i) => (
                              <div key={i} className="bg-white/5 p-2 rounded">
                                <p className="text-white/90">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Special Processors */}
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                            <Wand className={`h-5 w-5 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                            Speciální Procesory (11)
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                            {[
                              "Oxide Tape",
                              "Studer A800",
                              "Verve Analog",
                              "Auto-Tune Access",
                              "Auto-Tune Advanced",
                              "Auto-Tune X",
                              "A-Type Enhancer",
                              "Precision Enhancer",
                              "Sound City Studios",
                              "Century Tube",
                              "CS-1 Channel Strip",
                            ].map((item, i) => (
                              <div key={i} className="bg-white/5 p-2 rounded">
                                <p className="text-white/90">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delay & Modulation */}
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                            <Waves className={`h-5 w-5 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                            Delay a Modulace (7)
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                            {[
                              "Cooper Time Cube",
                              "EP-34 Tape Echo",
                              "Galaxy Tape Echo",
                              "Precision Delay Mod",
                              "Brigade Chorus",
                              "Precision Delay Mod L",
                              "Studio D Chorus",
                            ].map((item, i) => (
                              <div key={i} className="bg-white/5 p-2 rounded">
                                <p className="text-white/90">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Reverbs */}
                        <div>
                          <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                            <Sparkles className={`h-5 w-5 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                            Reverby (4)
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                            {["Lexicon 224", "Precision Reflection", "Pure Plate Reverb", "RealVerb Pro"].map(
                              (item, i) => (
                                <div key={i} className="bg-white/5 p-2 rounded">
                                  <p className="text-white/90">{item}</p>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Kabely, sluchátka a stojany */}
                  <div className="mb-8">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Cable className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          {t.equipment.cables}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div className="bg-white/5 p-3 rounded">
                            <p className="text-white/90">Mackie Thump15A (1300W) x2</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded">
                            <p className="text-white/90">Cromo 10+ (400W) 1x</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded">
                            <p className="text-white/90">Mogami Platinum</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded">
                            <p className="text-white/90">Evidence Cables</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded">
                            <p className="text-white/90">Lava Cable Tephra</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded">
                            <p className="text-white/90">Monster Studio Pro 2000</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded">
                            <p className="text-white/90">K&M stojany</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded">
                            <p className="text-white/90">Beyerdynamic DT-770 Pro 250 Ohm</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded">
                            <p className="text-white/90">KRK KNS-8402</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded">
                            <p className="text-white/90">Bezdrátové systémy Shure GLXD16+</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded">
                            <p className="text-white/90">Dunlop Joe Perry Boneyard Slide - Medium Long</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Ostatní technické vybavení */}
                  <div className="mb-8">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Zap className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          {t.equipment.infrastructure}
                        </h3>
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-3">Infrastruktura</h4>
                          <ul className="text-white/80 text-xs space-y-2">
                            <li>• Nezávislost na energetické síti</li>
                            <li>• Přepěťové ochrany</li>
                            <li>• Tesla nabíjecí stanice</li>
                            <li>• Security systém</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              <div
                id="contact"
                data-section-id="contact"
                ref={contactSectionRef}
                className="snap-start min-h-screen pt-32 px-6 py-12 pb-32"
              >
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 text-balance">{t.contact.title}</h1>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <Card className="bg-white/3 backdrop-blur-sm border-white/20">
                      <CardContent className="p-5">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-2">
                            <MapPin
                              className={`h-3.5 w-3.5 ${isDarkMode ? "text-blue-400" : "text-white/40"} mt-0.5 flex-shrink-0`}
                            />
                            <div>
                              <p className="text-white font-medium text-sm">Ing. Jindřich Traxmandl</p>
                              <p className="text-white/70 text-xs mt-1">
                                Pila 100 - Mlýn
                                <br />
                                Trhanov 34401
                                <br />
                                Česká republika
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Phone
                              className={`h-3.5 w-3.5 ${isDarkMode ? "text-blue-400" : "text-white/40"} flex-shrink-0`}
                            />
                            <p className="text-white/70 text-xs">+420 724 050 093</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Mail
                                className={`h-3.5 w-3.5 ${isDarkMode ? "text-blue-400" : "text-white/40"} flex-shrink-0`}
                              />
                              <a
                                href="mailto:mlynnapile@gmail.com"
                                className={`text-white/70 text-xs hover:text-white transition-colors ${isDarkMode ? "hover:text-blue-300" : "hover:text-white"}`}
                              >
                                mlynnapile@gmail.com
                              </a>
                            </div>
                            <BusinessCardDownload />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/3 backdrop-blur-sm border-white/20">
                      <CardContent className="p-5">
                        <h3 className="text-lg font-bold text-white mb-4">{t.contact.availability}</h3>
                        <div className="space-y-3">
                          <ul className="text-white/80 text-xs space-y-1">
                            {t.contact.availabilityItems.map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              <div
                id="about"
                data-section-id="about"
                ref={onasSectionRef}
                className="snap-start min-h-screen pt-32 px-6 py-12 pb-32"
              >
                <div className="space-y-8">
                  {/* Section 1: Hero + History */}
                  <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                      <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 text-balance">{t.about.title}</h1>
                      <p className="text-lg md:text-xl text-white/90 font-light">{t.about.subtitle}</p>
                      <p className="text-base text-white/80 mt-4">{t.about.tagline}</p>
                    </div>

                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-white mb-8 text-center">{t.about.history}</h3>
                        <div className="space-y-4 text-white/80">
                          {t.about.historyTimeline.map((item, index) => (
                            <div
                              key={index}
                              className={`border-l-2 pl-4 ${isDarkMode ? "border-blue-400" : "border-secondary"}`}
                            >
                              <p className="font-semibold text-white">{item.year}</p>
                              <p className="text-xs">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section 2: Ubytování */}
                  <div className="max-w-6xl mx-auto">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-white mb-8 text-center">{t.about.accommodation}</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                          <div>
                            <h4 className="text-base font-bold text-white mb-4">{t.about.accommodationRooms}</h4>
                            <div className="space-y-4">
                              <div className="bg-white/5 p-4 rounded-lg">
                                <h5 className="font-semibold text-white mb-2">{t.about.masterSuite}</h5>
                                <p className="text-white/80 text-xs">{t.about.masterSuiteDesc}</p>
                              </div>
                              <div className="bg-white/5 p-4 rounded-lg">
                                <h5 className="font-semibold text-white mb-2">{t.about.fourRooms}</h5>
                                <p className="text-white/80 text-xs">{t.about.fourRoomsDesc}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-base font-bold text-white mb-4">{t.about.commonSpaces}</h4>
                            <ul className="text-white/80 space-y-2">
                              {t.about.commonSpacesItems.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                          <div>
                            <h4 className="text-base font-bold text-white mb-4">{t.about.finnishSauna}</h4>
                            <ul className="text-white/80 space-y-2">
                              {t.about.finnishSaunaItems.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-base font-bold text-white mb-4">{t.about.parkOutdoor}</h4>
                            <ul className="text-white/80 space-y-2">
                              {t.about.parkOutdoorItems.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-white mb-4">{t.about.catering}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {t.about.cateringItems.map((item, index) => (
                              <div key={index} className="bg-white/5 p-4 rounded-lg">
                                <p className="text-white/80 text-xs">
                                  <strong className="text-white">{item.title}</strong> {item.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section 3: Founders */}
                  <div className="max-w-6xl mx-auto">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-white mb-8 text-center">{t.about.founders}</h3>

                        <p className="text-base text-white/80 text-center mb-8 leading-relaxed">
                          {t.about.foundersIntro}
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-bold text-white mb-2">Jindřich Traxmandl</h4>
                              <div className="space-y-4 text-white/80 leading-relaxed">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: t.about.jindrichDesc.replace(
                                      /Anteater/g,
                                      `<a href="https://www.anteaterofficial.com" target="_blank" rel="noopener noreferrer" class="underline ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-secondary hover:text-secondary/80"}">Anteater</a>`,
                                    ),
                                  }}
                                />
                                <blockquote
                                  className={`border-l-2 pl-4 italic ${isDarkMode ? "border-blue-400" : "border-secondary"}`}
                                >
                                  "{t.about.jindrichQuote}"
                                </blockquote>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-base font-bold text-white mb-2">Andrea Kohoutová</h4>
                              <div className="space-y-4 text-white/80 leading-relaxed">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: t.about.andreaDesc.replace(
                                      /Anteater/g,
                                      `<a href="https://www.anteaterofficial.com" target="_blank" rel="noopener noreferrer" class="underline ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-secondary hover:text-secondary/80"}">Anteater</a>`,
                                    ),
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <img
                              src="/images/design-mode/DAFF6861-2B75-4DD9-9DB2-3F045A522E16_1_105_c.jpeg"
                              alt="Jindřích a Andrea - zakladatelé Mlýn Šnajberk Studios"
                              className="w-full max-w-md rounded-lg shadow-2xl grayscale"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section 4: Collaboration */}
                  <div id="collaboration" data-section="collaboration" className="py-24">
                    <div className="max-w-6xl mx-auto">
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-8">
                          <h3 className="text-xl font-bold text-white mb-6">{t.about.collaboration}</h3>
                          <div className="space-y-4 text-white/80">
                            <p className="leading-relaxed">
                              <strong className="text-white">{t.about.collaborationPara1Strong}</strong>{" "}
                              {t.about.collaborationPara1.replace(t.about.collaborationPara1Strong + " ", "")}
                            </p>

                            <p className="leading-relaxed">
                              {t.about.collaborationPara2}
                              <strong className="text-white"> {t.about.collaborationPara2Strong}</strong>{" "}
                              {t.about.collaborationPara2End}
                            </p>
                            <p className="leading-relaxed">
                              <strong className="text-white">{t.about.collaborationPara3Strong}</strong>{" "}
                              {t.about.collaborationPara3}
                            </p>
                            <div className="mt-6">
                              <h4 className="font-semibold text-white mb-2">{t.about.collaborationFormsTitle}</h4>
                              <ul className="space-y-1 text-xs">
                                {t.about.collaborationForms.map((form, index) => (
                                  <li key={index}>• {form}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/20">
                              <p className="text-xs text-white/80 leading-relaxed">
                                <strong className={isDarkMode ? "text-blue-400" : "text-secondary"}>
                                  {t.equipment.thankYouNote}:
                                </strong>{" "}
                                {t.equipment.noraCollaboration}{" "}
                                <a
                                  href={t.equipment.noraLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 underline transition-colors"
                                >
                                  {t.equipment.noraBand}
                                </a>{" "}
                                {t.equipment.noraCollaborationEnd}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Section 5: FAQ */}
                  <div className="max-w-6xl mx-auto">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-white mb-6">{t.about.faq}</h3>
                        <div className="space-y-3">
                          {t.about.faqItems.map((faq, index) => {
                            let Icon = HelpCircle
                            if (faq.q.includes("Straší") || faq.q.includes("haunted") || faq.q.includes("Spukt")) {
                              Icon = Ghost
                            } else if (
                              faq.q.includes("DPH") ||
                              faq.q.includes("VAT") ||
                              faq.q.includes("umsatzsteuer")
                            ) {
                              Icon = FileText
                            } else if (
                              faq.q.includes("pronajmout") ||
                              faq.q.includes("rent") ||
                              faq.q.includes("gemietet")
                            ) {
                              Icon = Home
                            } else if (
                              faq.q.includes("kouřit") ||
                              faq.q.includes("smoking") ||
                              faq.q.includes("Rauchen")
                            ) {
                              Icon = CigaretteOff
                            } else if (
                              faq.q.includes("aparaturu") ||
                              faq.q.includes("equipment") ||
                              faq.q.includes("Ausrüstung")
                            ) {
                              Icon = Shield
                            } else if (
                              faq.q.includes("ubytování") ||
                              faq.q.includes("accommodation") ||
                              faq.q.includes("Unterkunft")
                            ) {
                              Icon = Hotel
                            } else if (
                              faq.q.includes("dostanu") ||
                              faq.q.includes("get to") ||
                              faq.q.includes("komme ich")
                            ) {
                              Icon = MapPin
                            } else if (
                              faq.q.includes("catering") ||
                              faq.q.includes("jídlo") ||
                              faq.q.includes("Essen")
                            ) {
                              Icon = UtensilsCrossed
                            } else if (
                              faq.q.includes("anglicky") ||
                              faq.q.includes("English") ||
                              faq.q.includes("Englisch")
                            ) {
                              Icon = Languages
                            }

                            return (
                              <div key={index} className="border-b border-white/10 pb-3">
                                <button
                                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                  className="w-full text-left flex justify-between items-start gap-2 group"
                                >
                                  <div className="flex items-start gap-3">
                                    <Icon
                                      className={`h-5 w-5 ${isDarkMode ? "text-blue-400" : "text-white/60"} flex-shrink-0 mt-0.5`}
                                    />
                                    <h4
                                      className={`font-semibold text-white text-xs transition-colors ${isDarkMode ? "group-hover:text-blue-400" : "group-hover:text-secondary"}`}
                                    >
                                      {faq.q}
                                    </h4>
                                  </div>
                                  <ChevronDown
                                    className={`h-4 w-4 text-white/60 flex-shrink-0 transition-transform ${openFaqIndex === index ? "rotate-180" : ""}`}
                                  />
                                </button>
                                {openFaqIndex === index && (
                                  <p
                                    className="text-xs text-white/80 mt-2 ml-8 leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                      __html: faq.a.replace(
                                        /Plethora X5/g,
                                        `<a href="https://www.tcelectronic.com/product.html?modelCode=0709-AIK" target="_blank" rel="noopener noreferrer" class="underline ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-secondary hover:text-secondary/80"}">Plethora X5</a>`,
                                      ),
                                    }}
                                  />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 h-28 pointer-events-none z-40 transition-opacity duration-300 ${
          currentSection === "home" || currentSection === "mlyn" || currentSection === "contact"
            ? "opacity-0"
            : "opacity-100"
        }`}
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 50%, transparent 100%)",
        }}
      />

      <footer className="fixed bottom-0 left-0 right-0 py-4 z-50">
        <div className="flex flex-col items-center gap-2">
          <div className="flex justify-center items-center gap-8">
          <a
            href="https://www.instagram.com/mlynnapile"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-white/70 hover:text-white transition-colors ${isDarkMode ? "hover:text-blue-400" : "hover:text-secondary"}`}
            aria-label="Instagram"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s-.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/share/1CWTAs8zoP/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-white/70 hover:text-white transition-colors ${isDarkMode ? "hover:text-blue-400" : "hover:text-secondary"}`}
            aria-label="Facebook"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href="https://www.youtube.com/@mlynnapile"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-white/70 hover:text-white transition-colors ${isDarkMode ? "hover:text-blue-400" : "hover:text-secondary"}`}
            aria-label="YouTube"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          </div>
          <div
            className={`text-[10px] text-white/50 transition-opacity duration-700 ${
              currentSection === "contact" || showFooterNote ? "opacity-100" : "opacity-0"
            }`}
          >
            © 2026 | Design & Development: Ing. Jindřich Traxmandl
          </div>
        </div>
      </footer>
    </div>
  )
}
