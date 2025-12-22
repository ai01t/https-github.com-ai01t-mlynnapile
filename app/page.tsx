"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BusinessCardDownload } from "@/components/business-card-download"
import {
  Play,
  Pause,
  Home,
  Guitar,
  Mic,
  Headphones,
  Calendar,
  MapPin,
  Phone,
  Moon,
  Sun,
  ChevronDown,
  Globe,
  Car,
  UtensilsCrossed,
  Languages,
  Ghost,
  FileText,
  Shield,
  Mail,
  HelpCircle,
  CigaretteOff,
  Hotel,
  Music,
  Camera,
  Medal as Pedal,
  Drum as Drums,
  Plug,
  EqualIcon as Equalize,
  Wand,
  Waves,
  Sparkles,
  Cable,
  Settings,
  Server,
  Keyboard,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"

const sectionOrder = ["mlyn", "home", "lokalita", "equipment", "about", "contact", "spoluprace"]

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
      description: "Unikátní prostor s genius loci v krásné přírodě",
      vintageInstruments: "Vintage Nástroje",
      vintageDesc: "60s-80s Fender, Gibson, VOX",
      accommodation: "Stylové ubytování",
      accommodationDesc: "4 pokojů, zimní zahrada 63m², finská sauna",
      locationCard: "Lokalita",
      locationDesc: "Krásná příroda - rekreační oblast, soukromí a vlastní park",
      studios: "Studia",
      studiosDesc: "Velké studio 64m²\nStudio mlýnice 25m²\nControl Room 27m²",
      modernTech: "Moderní technologie",
      modernTechDesc: "Universal Audio Apollo x8p Studio+\n76 UAD pluginů, Logic Pro X\nApple Pro Display XDR 6K",
      benefits: "Další benefity",
      benefitsDesc: "Zapůjčení elektromobilu, kol, nabíjecí stanice, bateriový backup, zabezpečené prostory",
      endMessage: "Užijte si prezentaci!",
      darkMode: "Noční režim zapnutý - klikněte pro denní režim",
      lightMode: "Denní režim zapnutý - klikněte pro noční režim",
    },
    studio: {
      title: "Mlýn na Pile",
      subtitle: "Tři unikátní prostory pro vaši kreativitu",
      description: "Od hlavního studia přes Millstone studio do control room",
      mainStudio: "Hlavní Studio",
      mainStudioSize: "64 m²",
      mainStudioDesc:
        "Hlavní studio se nachází v podkrovní galerii s odkrytými původními trámy, které prostoru dodávají autentickou atmosféru starého mlýna. Přirozené světlo sem proniká střešními okny a velkým francouzským oknem s balkonem, odkud se otevírá výhled na klidný rybník. Místo, kde se propojuje vůně dřeva, teplo vintage nástrojů a ticho okolní přírody — ideální prostor pro tvorbu, nahrávání i soustředěnou práci.",
      equipment: "Vybavení",
      controlRoom: "Control Room",
      controlRoomSize: "27 m²",
      controlRoomDesc:
        "Pristine acoustics pro critical listening. Vybaveno cutting-edge technologií pro mixing a mastering na nejvyšší úrovni.",
      technology: "Technologie",
      millstoneStudio: "Millstone studio",
      millstoneSize: "25 m² - Bývalá mlýnice",
      millstoneDesc:
        "Vysoké stropy a unikátní akustika historické mlýnice. Ideální pro akustické nahrávky a experimentální projekty.",
      ctaTitle: "Kontaktujte nás a domluvme si návštěvu studia",
      ctaDesc: "",
      ctaButton: "Kontaktovat",
      accommodation: {
        title: "Nahrávání + Ubytování",
        subtitle:
          "Jednotlivé balíčky jsou seřazeny od nejekonomičtějších až po VIP - pojmenovali jsme je podle našich songů :-) Zapůjčení studia je včetně hudební aparatury a nástrojů. Free wifi a parkování v areálu, s možností nabití EV.",
        intro: "Jdeme na to:",
        packageLabel: "Balíček",
        parking: "U všech balíčků je možnost parkovat v areálu mlýna, který je pod kamerovým systémem.",
        accommodationNote:
          "Ubytování není veřejně ani samostatně poskytovaná služba. Přespání je určeno výhradně klientům nahrávacího studia jako zázemí během kreativní práce.",
        packages: [
          {
            name: "Into the Wild",
            tags: "#Main studio",
            description:
              "Nejekonomičtější - stanování v parku, zapůjčení pouze studia, pro dobrodruhy a nadšence, usínejte a probouzejte se do světa hudby s přírodou :-)",
            details:
              "Možnost přespání ve vlastním autě/karavanu/stanu. Main studio má vlastní sociální zařízení včetně sprchy.",
            video: "https://youtu.be/qEc9SnmU4cM",
          },
          {
            name: "Underwater",
            tags: "#Main Studio #Sauna",
            description:
              "Nejblíže k hudbě, spaní doslova pod podlahou studia a také i pod hladinou rybníka :-) Skromné ale stylové a útulné přespání, jedná se o spaní přímo v prostorách bývalé mlýnice.",
            details:
              "Zde můžete usínat za zvuků protékající vody - stačí pootevřít okno :-) - součástí je i možnost využít saunu + posezení pod hrází vedle velké pece. 1x dvojlůžko, možnost dalších dvou přistýlek.",
            video: "https://youtu.be/gI3204B7eNk",
          },
          {
            name: "Otherside",
            tags: "#Control room #Staročeská světnice #Dva pokoje",
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
              "Jedná se VIP pronájem celé nemovitosti s plným servisem, včetně zimní zahrady kde si můžete dát výbornou kávu a vejdete se sem s celým týmem nebo si zde můžete užít klid mezitím co bude zbytek teamu pracovat ve studiu. Profi catering, roztopení velké pece. Vynikající pizza i chleba - který si můžete zkusit sami upéct a to nám věřte - to je radost a zážitek, který si užijete :-). Dále zapůjčení Tesla model X v ceně (200 km), popř. včetně řidiče s možností navštívit zajímavá místa v okolí (viz. [lokalita]) :-)",
            video: "https://youtu.be/5INpfHr0lu4",
          },
        ],
        bonuses: {
          title: "Další bonusy",
          items: [
            "Můžete si zvednout stavidlo a pustit vodu na mlýn. 😄💧",
            "V noci je tu nebe jako v Severní Koreji – všude hvězdy. ✨🌟",
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
      ],
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
      recordingHardware: "Audio Interface", // Renamed "Recording Hardware" to "Audio Interface" in Czech
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
      basses: "Basa",
      ampsAndCabs: "Zesilovače a Boxy",
      amps: "Zesilovače (Lampové / Hybridní)",
      cabs: "Boxy",
      effects: "Efekty",
      mics: "Mikrofony",
      drums: "Bicí",
      infrastructure: "Infrastruktura",
      uaPlugins: "Universal Audio Pluginy",
      workflow: "Doporučené Workflow",
      thankYouNote: "Děkujeme",
      noraCollaboration: "Za spolupráci na textu děkujeme Nore z kapely",
      cables: "Odposlechy, sluchátka, kabely a stojany",
    },
    about: {
      title: "O nás",
      subtitle: "Kde se rodí inspirace v srdci Evropy",
      tagline: "Vintage duše, moderní technologie",
      history: "Historie mlýna",
      historyTimeline: [
        { year: "1653", desc: "Založení rybníků a postavení vysoké pece a hamru Lamingena" },
        { year: "1810", desc: "Mlýn s pilou poháněnou vodní silou" },
        { year: "1990", desc: "Pila vznikla k 24. listopadu 1990 jako část obce Trhanov v okrese Domažlice" },
        // </CHANGE>
        { year: "2024", desc: "Transformace na prémiové kreativní retreat studio" },
      ],
      accommodation: "Ubytování",
      accommodationRooms: "Prostory pro ubytování",
      masterSuite: "Master Suite (63 m²)",
      masterSuiteDesc: "Prostorný apartmán s výhledem na rybník, včetně zimní zahrady a vlastním sociálním zařízením.",
      fourRooms: "Další pokoje",
      fourRoomsDesc: "4 stylově zařízené pokoje s možností přistýlek.",
      commonSpaces: "Společné prostory",
      commonSpacesItems: [
        "Prostorná zimní zahrada s posezením a krbem (63 m²)",
        "Společenská místnost s domácím kinem",
        "Venkovní terasa s výhledem na rybník",
        "Krbové posezení v zahradě",
      ],
      finnishSauna: "Finská sauna",
      finnishSaunaItems: ["Kapacita 6 osob", "Relaxační zóna s výhledem do přírody", "Možnost ochlazení v jezírku"],
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
        "Zpěvačka a baskytaristka kapely Anteater a také archeoložka. Právě v prostředí starého mlýna se všechny tyto její vášně přirozeně propojují. Andrea spoluvytváří domáckou a inspirativní atmosféru studia. Pokud budete chtít o půlnoci uvařit kakao (a nebo nazpívat druhé hlasy), neváhejte se obrátit právě na Andreu (v případě technických problémů pak na Jindru :)) Teď ale vážně: vzájemně se doplňujeme a snažíme se mnohdy z našich různých pohledů na svět inspirovat.",
      collaboration: "Spolupráce a Rezervace",
      collaborationPara1Strong: "Prostory studia",
      collaborationPara1: " jsou k dispozici pro nahrávání, workshopy, rezidenční pobyty a další umělecké projekty.",
      collaborationPara2Strong: "Individuální přístup",
      collaborationPara2:
        " a flexibilita jsou pro nás samozřejmostí. Jsme připraveni přizpůsobit se Vašim specifickým potřebám a požadavkům, abychom zajistili co nejlepší výsledek.",
      collaborationPara2End: " Neváhejte se na nás obrátit s jakýmikoliv dotazy nebo požadavky.",
      collaborationPara3Strong: "Pro komplexní balíčky",
      collaborationPara3: " zahrnující nahrávání, ubytování a catering, nás prosím kontaktujte.",
      collaborationFormsTitle: "Formy spolupráce",
      collaborationForms: [
        "Nahrávání hudby",
        "Produkce a mastering",
        "Workshopy a masterclassy",
        // "Umělecké rezidence",
        // </CHANGE>
        "Natáčení videoklipů",
        "Fotografování",
        "Pořádání menších koncertů a akcí",
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
          a: "Samozřejmě! Celý komplex lze rezervovat minimálně na 3 dny.",
        },
        {
          q: "Smí se v mlýně kouřit?",
          a: "Nesmí. Mlýn je z velké části ze dřeva.",
        },
        {
          q: "Mohu si dovézt vlastní aparaturu a je objekt dostatečně zabezpečen?",
          a: "Samozřejmě můžete, aparatura se dá vyložit přímo před studiem. Objekt je zabezpečen na několika úrovních, současně je na hrázy kde projede jen jedno auto. Vykrást takový objekt s aparaturou, která by opravdu těžko veřejně prodávala úplně nedává smysl... Zlodějům bychom nedoporučovali s ohledem na výše zmíněné okolnosti, nad tím vůbec uvažovat.... ;-)",
        },
        {
          q: "Poskytujete ubytování i samostatně?",
          a: "Ne. Ubytování není veřejně ani samostatně poskytovaná služba. Přespání je určeno výhradně klientům nahrávacího studia jako zázemí během kreativní práce.",
        },
        {
          q: "Jak se k nám dostanu?",
          a: "Autem: přímý přístup, soukromé parkování, Tesla nabíjení. Vlakem: 10 min pěšky ze stanice Trhanov. Letecky: 1h 45min z letiště Praha, 2h z letiště Mnichov, pick-up služba k dispozici.",
        },
        {
          q: "Mohu přijet i sám, nebo je akce určena pouze pro kapely a týmy?",
          a: "Jasně - pro sólový umělec je k dispozici i looper Plethora X5 od TC Electronic. ;-)",
        },
        {
          q: "Máte catering, nebo si musím řešit jídlo sám?",
          a: "Flexibilní možnosti stravování: In-house catering s lokálními ingrediencemi, pizza pec pro společné večeře (až 8 pizz), plně vybavená kuchyň pro vlastní vaření, rozvoz z místních restaurací z Domažlic.",
        },
        {
          q: "Mluvíte anglicky/německy?",
          a: "Vícejazyčný tým: Čeština - rodilí mluvčí, Angličtina - plynule (Jindřich, Andrea, tech tým), Němčina - konverzační úroveň (regionální výhoda), překladatelské služby pro smlouvy.",
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
      title: "Mlýn na Pile",
      subtitle: "Retreat Studio",
      tagline: "Where inspiration is born",
      description: "Unique space with genius loci in beautiful nature",
      vintageInstruments: "Vintage Instruments",
      vintageDesc: "60s-80s Fender, Gibson, VOX",
      accommodation: "Stylish Accommodation",
      accommodationDesc: "4 rooms, winter garden 63m², Finnish sauna",
      locationCard: "Location",
      locationDesc: "Beautiful nature - recreational area, privacy and private park",
      studios: "Studios",
      studiosDesc: "Main studio 64m²\nMillstone studio 25m²\nControl Room 27m²",
      modernTech: "Modern Technology",
      modernTechDesc: "Universal Audio Apollo x8p Studio+\n76 UAD plugins, Logic Pro X\nApple Pro Display XDR 6K",
      benefits: "Additional Benefits",
      benefitsDesc: "Electric car rental, bikes, charging station, battery backup, secured premises",
      endMessage: "Enjoy the presentation!",
      darkMode: "Dark mode enabled - click to switch to light mode",
      lightMode: "Light mode enabled - click to switch to dark mode",
    },
    studio: {
      title: "Mlýn na Pile",
      subtitle: "Three unique spaces for your creativity",
      description: "From main studio through Millstone studio to control room",
      mainStudio: "Main Studio",
      mainStudioSize: "64 m²",
      mainStudioDesc:
        "The main studio is located in an attic gallery with exposed original beams that give the space an authentic atmosphere of an old mill. Natural light enters through skylights and a large French window with a balcony overlooking a peaceful pond. A place where the scent of wood, warmth of vintage instruments and silence of surrounding nature merge — ideal space for creation, recording and focused work.",
      equipment: "Equipment",
      controlRoom: "Control Room",
      controlRoomSize: "27 m²",
      controlRoomDesc:
        "Pristine acoustics for critical listening. Equipped with cutting-edge technology for mixing and mastering at the highest level.",
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
          "Individual packages are arranged from most economical to VIP - we named them after our songs :-) Studio rental includes musical equipment and instruments. Free wifi and parking on site, with EV charging available.",
        intro: "Let's go:",
        packageLabel: "Package",
        parking: "All packages include parking in the mill area, which is under camera surveillance.",
        accommodationNote:
          "Accommodation is not a publicly or separately provided service. Overnight stays are intended exclusively for recording studio clients as a base during creative work.",
        packages: [
          {
            name: "Into the Wild",
            tags: "#Main studio",
            description:
              "Most economical - camping in the park, studio rental only, for adventurers and enthusiasts, fall asleep and wake up to the world of music with nature :-)",
            details:
              "Option to sleep in your own car/caravan/tent. Main studio has its own facilities including shower.",
            video: "https://youtu.be/qEc9SnmU4cM",
          },
          {
            name: "Underwater",
            tags: "#Main Studio #Sauna",
            description:
              "Closest to the music, sleeping literally under the studio floor and also below the pond surface :-) Modest but stylish and cozy accommodation, sleeping directly in the former mill house.",
            details:
              "Here you can fall asleep to the sounds of flowing water - just open the window :-) - includes access to sauna + seating under the dam next to the large oven. 1x double bed, possibility of two extra beds.",
            video: "https://youtu.be/gI3204B7eNk",
          },
          {
            name: "Otherside",
            tags: "#Control room #Traditional Czech room #Two rooms",
            description:
              "From the other side of the studio, you can use the 6K Apple Pro XDR for post-production, complete with Apple peripherals (Magic Trackpad, Magic Mouse, Apple Magic Keyboard) for comfortable work + accommodation in a traditional Czech room.",
            details:
              "Suitable both for processing your studio work and for non-musical activities (e.g., graphics, digital creators), final recording processing.",
            video: "https://youtu.be/X7lvikbWnMQ",
          },
          {
            name: "Fuel",
            tags: "#VIP package",
            description:
              "This option is named after our song Fuel and also after Metallica's song, because this is really for Metallica, (but don't hesitate to write and we'll definitely work something out).",
            details:
              "This is a VIP rental of the entire property with full service, including a winter garden where you can enjoy excellent coffee and fit your whole team or enjoy peace while the rest of the team works in the studio. Professional catering, firing up the large oven. Excellent pizza and bread - which you can try baking yourself and believe us - that's a joy and an experience you'll enjoy :-). Tesla Model X rental included in the price (200 km), optionally with a driver to visit interesting places in the area (see [location]) :-)",
            video: "https://youtu.be/5INpfHr0lu4",
          },
        ],
        bonuses: {
          title: "Additional Bonuses",
          items: [
            "You can raise the weir and let water flow to the mill. 😄💧",
            "At night, the sky is like North Korea – stars everywhere. ✨🌟",
            "For nature lovers and entomologists: There are dragonflies here, beautiful and plentiful :-) 🦋 They fly into the winter garden and are smart enough to fly back out after their inspection without hitting the glass. Besides them, you'll find invasive plants (Japanese knotweed and sumac) that we bravely fight. 🌿⚔️ But here grow also giant sequoias, which – we admit – we don't have the heart to cut down. 🌲💚",
            "Under the studio windows, there are often swans with cygnets that let you feed them. 🦢",
            "At neighbor Dáda's, you can go horse riding. 🐴",
            "Even during the day, you can encounter hedgehogs, martens, deer right in the garden. When Dáda's horses escape, you can have coffee with them practically in the winter garden :-) 🦔🦌☕",
            "You might meet a fat squirrel that digs up planks - animals have it great here :-) We also have herons and neighbors have a puppy and a few friendly cats (also from various neighbors), frogs and moles (ours) :-) 🐿️🐕🐈",
            "We live in symbiosis with animals and cooperate, this year the studio entrance was additionally secured by a hornet nest right above the entrance, which we don't plan for next years and will replace with more modern technologies. Thank you. (No hornets were harmed – we let them live out their lives in peace. 🐝) ⚡",
            "Fresh organic vegetables, excellent grapes, hops. Overall the grass is greener here and thanks to moles you can see beautiful black soil. :-D 🥬🍇🌿",
            "At night, the sky is like North Korea – stars everywhere. ✨🌟",
            "Last but not least, nice neighbors from all sides and Bidlo pub with friendly service and beautiful view of the mill from the other side. Here you can have a Pilsen and if you want to have more beers and function in the studio the next day, we recommend a trip to the brewery in Domažlice and stick only to Domažlice ten-degree beer, after which you can function without problems the next day (Recommended by the brewmaster and tested several times for you that it's true :-) 🍺🏡",
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
        "Pila near Trhanov is an ideal location for nature lovers, privacy, and active recreation. The property spans over 6,500 m² and offers a tranquil environment with several seating areas and two streams that create a harmonious atmosphere.",
      naturePara2:
        "From Pila, you can easily walk to Domažlice or hike to the summit of Čerchov (1,042 m), the highest mountain in the Bohemian Forest, which attracts tourists with its observation tower and stunning views. The area is rich in marked cycling routes and hiking trails through picturesque countryside, ideal for nature and history enthusiasts.",
      naturePara3:
        "The entire region is known for its greenery, fresh air, and tranquility, creating perfect conditions for those seeking an escape from city hustle while providing an excellent base for trips and exploring the region's cultural and natural attractions.",
      quote:
        "We found the perfect location and beautiful historic mill building that we want to share. We want to elevate this place further - with creative people who will have open doors here and where great things will be created.",
      transport: "Transport Accessibility",
      byCar: "By Car",
      byTrain: "By Train",
      byPlane: "By Plane",
      availabilityItems: [
        "By Car: 10 min to Domažlice center",
        "10 min to German border",
        "By Train: Train station directly at Pile",
        "By Plane: 1h 45min from Prague Airport",
        "By Plane: 2h 30min from Munich Airport (MUC), Germany",
      ],
      events: "Trip Suggestions",
      domazliceTitle: "Domažlice (8 min)",
      domazliceItems: ["Historic square", "Chodsko Museum", "Church of St. Lawrence", "Cultural events and festivals"],
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
      recordingHardware: "Audio Interface", // Renamed "Recording Hardware" to "Audio Interface" in English
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
      collectionNote: "The collection is constantly updated, but please contact Jindřich for the current list.",
      collaborationLink: "collaboration",
      detailsNote: "Everything is fully functional, regularly serviced, and ready for use.",
      vintageInstruments: "Vintage Instruments (60s-80s)",
      guitars: "Guitars",
      basses: "Bass",
      ampsAndCabs: "Amps and Cabinets",
      amps: "Amplifiers (Tube / Hybrid)",
      cabs: "Cabinets",
      effects: "Effects",
      mics: "Microphones",
      drums: "Drums",
      infrastructure: "Infrastructure",
      uaPlugins: "Universal Audio Plugins",
      workflow: "Recommended Workflow",
      thankYouNote: "Thank you",
      noraCollaboration: "For the collaboration on the text, we thank Nora from the band",
      cables: "Monitors, Headphones, Cables and Stands",
    },
    about: {
      title: "About Us",
      subtitle: "Where inspiration is born in the heart of Europe",
      tagline: "Vintage soul, modern technology",
      history: "History of the mill",
      historyTimeline: [
        { year: "1653", desc: "Founding of ponds and construction of the blast furnace and hammer mill of Lamingena" },
        { year: "1810", desc: "Mill with a sawmill powered by water force" },
        {
          year: "1990",
          desc: "The sawmill was established on November 24, 1990, as part of the village of Trhanov in the Domažlice district",
        },
        // </CHANGE>
        { year: "2024", desc: "Transformation into a premium creative retreat studio" },
      ],
      accommodation: "Accommodation",
      accommodationRooms: "Accommodation Spaces",
      masterSuite: "Master Suite (63 m²)",
      masterSuiteDesc: "Spacious suite with a pond view, including a winter garden and private bathroom.",
      fourRooms: "Other Rooms",
      fourRoomsDesc: "4 stylishly furnished rooms with the possibility of extra beds.",
      commonSpaces: "Common Areas",
      commonSpacesItems: [
        "Spacious winter garden with seating and fireplace (63 m²)",
        "Lounge with home cinema",
        "Outdoor terrace overlooking the pond",
        "Fireplace seating in the garden",
      ],
      finnishSauna: "Finnish Sauna",
      finnishSaunaItems: [
        "Capacity for 6 people",
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
          desc: "Catering can be arranged according to your wishes, from simple meals to gourmet experiences. We specialize in Italian cuisine and barbecues.",
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
        "Singer and bassist of the band Anteater, and also an archaeologist. It is precisely in the environment of the old mill that all these passions naturally connect. Andrea co-creates the homey and inspiring atmosphere of the studio. If you want to make cocoa at midnight (or sing backing vocals), don't hesitate to turn to Andrea (in case of technical problems, then to Jindřich :)). But seriously now: we complement each other and we draw inspiration from our different perspectives on the world.",
      collaboration: "Collaboration and Reservations",
      collaborationPara1Strong: "The studio spaces",
      collaborationPara1: " are available for recording, workshops, residential stays, and other artistic projects.",
      collaborationPara2Strong: "Individual approach",
      collaborationPara2:
        " and flexibility are a matter of course for us. We are ready to adapt to your specific needs and requirements to ensure the best possible outcome.",
      collaborationPara2End: " Do not hesitate to contact us with any questions or requests.",
      collaborationPara3Strong: "For comprehensive packages",
      collaborationPara3: " including recording, accommodation, and catering, please contact us.",
      collaborationFormsTitle: "Forms of Collaboration",
      collaborationForms: [
        "Music recording",
        "Production and mastering",
        "Workshops and masterclasses",
        // "Artist residencies",
        // </CHANGE>
        "Music video shooting",
        "Photography",
        "Organizing small concerts and events",
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
          a: "Of course! The entire complex can be booked for a minimum of 3 days.",
        },
        {
          q: "Is smoking allowed in the mill?",
          a: "No. The mill is largely made of wood.",
        },
        {
          q: "Can I bring my own equipment and is the property sufficiently secured?",
          a: "Of course, you can. Equipment can be unloaded directly in front of the studio. The property is secured on several levels, and there is only one access road. Stealing such a property with equipment that would be difficult to sell publicly wouldn't make much sense... We would not recommend thieves to even consider it, given the aforementioned circumstances.... ;-)",
        },
        {
          q: "Do you provide accommodation separately?",
          a: "No. Accommodation is not a publicly or separately provided service. Overnight stays are intended exclusively for recording studio clients as a base during creative work.",
        },
        {
          q: "How do I get to you?",
          a: "By car: direct access, private parking, Tesla charging. By train: 10 min walk from Trhanov station. By plane: 1h 45min from Prague Airport, 2h from Munich Airport, pick-up service available.",
        },
        {
          q: "Can I come alone, or is this only for bands and teams?",
          a: "Of course - for solo artists, we also have the Plethora X5 looper from TC Electronic available. ;-)",
        },
        {
          q: "Do you have catering, or do I need to arrange food myself?",
          a: "Flexible dining options: In-house catering with local ingredients, pizza oven for group dinners (up to 8 pizzas), fully equipped kitchen for self-catering, delivery from local Domažlice restaurants.",
        },
        {
          q: "Do you speak English/German?",
          a: "Multilingual team: Czech - native speakers, English - fluent (Jindřich, Andrea, tech team), German - conversational level (regional advantage), translation services for contracts.",
        },
      ],
    },
    contact: {
      title: "Contact",
      availability: "Transport Accessibility",
      availabilityItems: [
        "By Car: 10 min to Domažlice center",
        "10 min to German border",
        "By Train: Train station directly at Pile",
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
      title: "Mlýn Šnajberk Studios",
      subtitle: "Retreat Studio",
      tagline: "Wo Inspiration entsteht",
      description: "Einzigartiger Raum mit Genius Loci in schöner Natur",
      vintageInstruments: "Vintage-Instrumente",
      vintageDesc: "60s-80s Fender, Gibson, VOX",
      accommodation: "Stilvolle Unterkunft",
      accommodationDesc: "4 Zimmer, Wintergarten 63m², finnische Sauna",
      locationCard: "Lage",
      locationDesc: "Schöne Natur - Erholungsgebiet, Privatsphäre und eigener Park",
      studios: "Studios",
      studiosDesc: "Hauptstudio 64m²\nMühlstein-Studio 25m²\nControl Room 27m²",
      modernTech: "Moderne Technologie",
      modernTechDesc: "Universal Audio Apollo x8p Studio+\n76 UAD-Plugins, Logic Pro X\nApple Pro Display XDR 6K",
      benefits: "Weitere Vorteile",
      benefitsDesc: "Elektroauto-Verleih, Fahrräder, Ladestation, Batterie-Backup, gesicherte Räumlichkeiten",
      endMessage: "Genießen Sie die Präsentation!",
      darkMode: "Dunkelmodus aktiviert - klicken Sie, um zum hellen Modus zu wechseln",
      lightMode: "Heller Modus aktiviert - klicken Sie, um zum dunklen Modus zu wechseln",
    },
    studio: {
      title: "Mlýn Šnajberk Studios",
      subtitle: "Drei einzigartige Räume für Ihre Kreativität",
      description: "Vom Hauptstudio über das Mühlstein-Studio bis zum Control Room",
      mainStudio: "Hauptstudio",
      mainStudioSize: "64 m²",
      mainStudioDesc:
        "Das Hauptstudio befindet sich in einer Dachgalerie mit freiliegenden Originalbalken, die dem Raum eine authentische Atmosphäre einer alten Mühle verleihen. Natürliches Licht dringt durch Dachfenster und ein großes französisches Fenster mit Balkon ein, von dem aus man einen Blick auf einen ruhigen Teich hat. Ein Ort, an dem sich der Duft von Holz, die Wärme von Vintage-Instrumenten und die Stille der umgebenden Natur verbinden — idealer Raum für Kreation, Aufnahme und konzentrierte Arbeit.",
      equipment: "Ausstattung",
      controlRoom: "Kontrollraum",
      controlRoomSize: "27 m²",
      controlRoomDesc:
        "Makellose Akustik für kritisches Hören. Ausgestattet mit modernster Technologie für Mixing und Mastering auf höchstem Niveau.",
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
          "Die einzelnen Pakete sind von den wirtschaftlichsten bis zu VIP sortiert - wir haben sie nach unseren Songs benannt :-) Die Studiovermietung umfasst Musikausrüstung und Instrumente. Kostenloses WLAN und Parken vor Ort, mit EV-Lademöglichkeit.",
        intro: "Los geht's:",
        packageLabel: "Paket",
        parking: "Bei allen Paketen können Sie im Mühlenbereich parken, der videoüberwacht ist.",
        accommodationNote:
          "Die Unterkunft ist keine öffentlich oder separat angebotene Dienstleistung. Übernachtungen sind ausschließlich für Aufnahmestudio-Kunden als Basis während der kreativen Arbeit vorgesehen.",
        packages: [
          {
            name: "Into the Wild",
            tags: "#Main studio",
            description:
              "Am wirtschaftlichsten - Camping im Park, nur Studiomiete, für Abenteurer und Enthusiasten, schlafen Sie ein und wachen Sie in der Welt der Musik mit der Natur auf :-)",
            details:
              "Möglichkeit im eigenen Auto/Wohnwagen/Zelt zu schlafen. Das Hauptstudio verfügt über eigene Einrichtungen inklusive Dusche.",
            video: "https://youtu.be/qEc9SnmU4cM",
          },
          {
            name: "Underwater",
            tags: "#Main Studio #Sauna",
            description:
              "Am nächsten zur Musik, schlafen buchstäblich unter dem Studioboden und auch unter der Teichoberfläche :-) Bescheidene, aber stilvolle und gemütliche Unterkunft, Schlafen direkt in den Räumen des ehemaligen Mühlenhauses.",
            details:
              "Hier können Sie zu den Klängen des fließenden Wassers einschlafen - öffnen Sie einfach das Fenster :-) - beinhaltet Zugang zur Sauna + Sitzgelegenheit unter dem Damm neben dem großen Ofen. 1x Doppelbett, Möglichkeit von zwei Zustellbetten.",
            video: "https://youtu.be/gI3204B7eNk",
          },
          {
            name: "Otherside",
            tags: "#Kontrollraum #Traditionelles tschechisches Zimmer #Zwei Zimmer",
            description:
              "Von der anderen Seite des Studios aus können Sie den 6K Apple Pro XDR für die Nachbearbeitung nutzen, komplett mit Apple-Peripheriegeräten (Magic Trackpad, Magic Mouse, Apple Magic Keyboard) für komfortables Arbeiten + Unterkunft in einem traditionellen tschechischen Zimmer.",
            details:
              "Geeignet sowohl für die Verarbeitung Ihrer Studioarbeit als auch für nicht-musikalische Aktivitäten (z.B. Grafik, digitale Schöpfer), finale Aufnahmeverarbeitung.",
            video: "https://youtu.be/X7lvikbWnMQ",
          },
          {
            name: "Fuel",
            tags: "#VIP-Paket",
            description:
              "Diese Variante ist nach unserem Song Fuel und auch nach dem Song von Metallica benannt, denn das ist wirklich für Metallica, (aber zögern Sie nicht zu schreiben und wir werden uns sicher einigen).",
            details:
              "Dies ist eine VIP-Vermietung des gesamten Anwesens mit vollem Service, einschließlich eines Wintergartens, wo Sie ausgezeichneten Kaffee genießen können und Ihr ganzes Team Platz hat oder Ruhe genießen können, während der Rest des Teams im Studio arbeitet. Professionelles Catering, Anheizen des großen Ofens. Ausgezeichnete Pizza und Brot - die Sie selbst backen können, und glauben Sie uns - das ist eine Freude und ein Erlebnis, das Sie genießen werden :-). Tesla Model X Miete im Preis inbegriffen (200 km), optional mit Fahrer, um interessante Orte in der Umgebung zu besuchen (siehe [Standort]) :-)",
            video: "https://youtu.be/5INpfHr0lu4",
          },
        ],
        bonuses: {
          title: "Zusätzliche Boni",
          items: [
            "Sie können das Wehr heben und Wasser zur Mühle lassen. 😄💧",
            "Nachts ist der Himmel wie in Nordkorea – Sterne überall. ✨🌟",
            "Für Naturliebhaber und Entomologen: Hier gibt es Libellen, schön und viele davon :-) 🦋 Sie fliegen bis in den Wintergarten und sind klug genug, nach ihrer Inspektion wieder hinauszufliegen, ohne gegen das Glas zu stoßen. Neben ihnen finden Sie invasive Pflanzen (Knöterich und Sumach), gegen die wir tapfer kämpfen. 🌿⚔️ Aber hier wachsen auch Riesenmammutbäume, die – wir geben zu – wir nicht übers Herz bringen, sie zu fällen. 🌲💚",
            "Unter den Studiofenstern sind oft Schwäne mit Jungschwänen, die sich füttern lassen. 🦢",
            "Bei Nachbarin Dáda können Sie reiten. 🐴",
            "Selbst am helllichten Tag können Sie Igel, Marder, Rehe direkt im Garten begegnen. Wenn Dádas Pferde entkommen, können Sie praktisch im Wintergarten mit ihnen Kaffee trinken :-) 🦔🦌☕",
            "Sie könnten auch ein dickes Eichhörnchen treffen, das Bretter umwirft - Tiere haben es hier großartig :-) Wir haben auch Reiher und Nachbarn haben einen Welpen und ein paar freundliche Katzen (auch von verschiedenen Nachbarn), Frösche und Maulwürfe (unsere) :-) 🐿️🐕🐈",
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
        "Von Pila aus können Sie bequem zu Fuß nach Domažlice oder auf den Gipfel des Čerchov (1.042 m), dem höchsten Berg des Böhmerwaldes, wandern, der Touristen mit seinem Aussichtsturm und herrlichen Ausblicken anzieht. Die Umgebung ist reich an markierten Radwegen und Wanderwegen durch malerische Landschaften, ideal für Natur- und Geschichtsliebhaber.",
      naturePara3:
        "Die gesamte Region ist bekannt für ihre Grünflächen, frische Luft und Ruhe, was perfekte Bedingungen für diejenigen schafft, die dem Stadttrubel entfliehen möchten und gleichzeitig eine hervorragende Basis für Ausflüge und die Erkundung der kulturellen und natürlichen Sehenswürdigkeiten der Region bieten.",
      quote:
        "Wir haben den perfekten Ort und ein wunderschönes historisches Mühlengebäude gefunden, das wir teilen möchten. Wir möchten diesen Ort noch weiter aufwerten - mit kreativen Menschen, die hier offene Türen haben und wo großartige Dinge entstehen werden.",
      transport: "Verkehrsanbindung",
      byCar: "Mit dem Auto",
      byTrain: "Mit dem Zug",
      byPlane: "Mit dem Flugzeug",
      availabilityItems: [
        "Mit dem Auto: 10 Min. zum Zentrum von Domažlice",
        "10 Min. zur deutschen Grenze",
        "Mit dem Zug: Bahnhof direkt in Pile",
        "Mit dem Flugzeug: 1h 45min vom Flughafen Prag",
        "Mit dem Flugzeug: 2h 30min vom Flughafen München (MUC), Deutschland",
      ],
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
      recordingHardware: "Audio Interface", // Renamed "Recording Hardware" to "Audio Interface" in German
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
        "Die Sammlung wird ständig aktualisiert, aber kontaktieren Sie bitte Jindřich für die aktuelle Liste.",
      collaborationLink: "Zusammenarbeit",
      detailsNote: "Alles ist voll funktionsfähig, regelmäßig gewartet und einsatzbereit.",
      vintageInstruments: "Vintage Instrumente (60s-80s)",
      guitars: "Gitarren",
      basses: "Bass",
      ampsAndCabs: "Verstärker und Boxen",
      amps: "Verstärker (Röhren / Hybrid)",
      cabs: "Boxen",
      effects: "Effekte",
      mics: "Mikrofone",
      drums: "Schlagzeug",
      infrastructure: "Infrastruktur",
      uaPlugins: "Universal Audio Plugins",
      workflow: "Empfohlener Workflow",
      thankYouNote: "Danke",
      noraCollaboration: "Für die Zusammenarbeit am Text danken wir Nora von der Band",
      cables: "Monitore, Kopfhörer, Kabel und Ständer",
    },
    about: {
      title: "Über uns",
      subtitle: "Wo Inspiration im Herzen Europas geboren wird",
      tagline: "Vintage-Seele, moderne Technologie",
      history: "Geschichte der Mühle",
      historyTimeline: [
        { year: "1653", desc: "Anlage von Teichen und Bau des Hochofens und Hammerwerks Lamingen" },
        { year: "1810", desc: "Mühle mit Sägewerk, angetrieben durch Wasserkraft" },
        {
          year: "1990",
          desc: "Das Sägewerk wurde am 24. November 1990 als Teil der Gemeinde Trhanov im Bezirk Domažlice gegründet",
        },
        // </CHANGE>
        { year: "2024", desc: "Transformation in ein Premium-Kreativ-Retreat-Studio" },
      ],
      accommodation: "Unterkunft",
      accommodationRooms: "Unterkunftsmöglichkeiten",
      masterSuite: "Master Suite (63 m²)",
      masterSuiteDesc: "Geräumige Suite mit Blick auf den Teich, inklusive Wintergarten und eigenem Bad.",
      fourRooms: "Weitere Zimmer",
      fourRoomsDesc: "4 stilvoll eingerichtete Zimmer mit Zustellbettmöglichkeit.",
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
          desc: "Catering nach Ihren Wünschen, von einfachen Gerichten bis zu kulinarischen Erlebnissen. Wir sind spezialisiert auf italienische Küche und Grillgerichte.",
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
        "Sängerin und Bassistin der Band Anteater und auch Archäologin. Gerade in der Umgebung der alten Mühle verbinden sich all diese Leidenschaften auf natürliche Weise. Andrea trägt zur gemütlichen und inspirierenden Atmosphäre des Studios bei. Wenn Sie um Mitternacht Kakao machen wollen (oder zweite Stimmen singen wollen), zögern Sie nicht, sich an Andrea zu wenden (bei technischen Problemen dann an Jindřich :)). Aber jetzt im Ernst: Wir ergänzen uns gegenseitig und lassen uns oft von unseren unterschiedlichen Weltanschauungen inspirieren.",
      collaboration: "Zusammenarbeit und Buchungen",
      collaborationPara1Strong: "Die Studioräume",
      collaborationPara1:
        " stehen für Aufnahmen, Workshops, Künstlerresidenzen und andere künstlerische Projekte zur Verfügung.",
      collaborationPara2Strong: "Individueller Ansatz",
      collaborationPara2:
        " und Flexibilität sind für uns selbstverständlich. Wir sind bereit, uns an Ihre spezifischen Bedürfnisse und Anforderungen anzupassen, um das bestmögliche Ergebnis zu erzielen.",
      collaborationPara2End: " Zögern Sie nicht, uns bei Fragen oder Anfragen zu kontaktieren.",
      collaborationPara3Strong: "Für umfassende Pakete",
      collaborationPara3: " einschließlich Aufnahme, Unterkunft und Catering, kontaktieren Sie uns bitte.",
      collaborationFormsTitle: "Formen der Zusammenarbeit",
      collaborationForms: [
        "Musikaufnahmen",
        "Produktion und Mastering",
        "Workshops und Masterclasses",
        // "Künstlerresidenzen",
        // </CHANGE>
        "Dreh von Musikvideos",
        "Fotografie",
        "Organisation kleiner Konzerte und Veranstaltungen",
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
          a: "Selbstverständlich! Der gesamte Komplex kann für mindestens 3 Tage gebucht werden.",
        },
        {
          q: "Ist Rauchen in der Mühle erlaubt?",
          a: "Nein. Die Mühle besteht größtenteils aus Holz.",
        },
        {
          q: "Kann ich meine eigene Ausrüstung mitbringen und ist das Objekt ausreichend gesichert?",
          a: "Selbstverständlich können Sie das. Die Ausrüstung kann direkt vor dem Studio ausgeladen werden. Das Objekt ist auf mehreren Ebenen gesichert, und es gibt nur eine Zufahrt. Einen solchen Objekt mit Ausrüstung auszurauben, die schwer öffentlich zu verkaufen wäre, ergibt keinen Sinn... Wir würden Dieben angesichts der oben genannten Umstände nicht empfehlen, darüber nachzudenken.... ;-)",
        },
        {
          q: "Bieten Sie Unterkunft auch separat an?",
          a: "Nein. Die Unterkunft ist keine öffentlich oder separat angebotene Dienstleistung. Übernachtungen sind ausschließlich für Aufnahmestudio-Kunden als Basis während der kreativen Arbeit vorgesehen.",
        },
        {
          q: "Wie komme ich zu Ihnen?",
          a: "Mit dem Auto: direkter Zugang, private Parkplätze, Tesla-Ladestation. Mit dem Zug: 10 Min. zu Fuß vom Bahnhof Trhanov. Mit dem Flugzeug: 1h 45min vom Flughafen Prag, 2h 30min vom Flughafen München (MUC), Deutschland, Abholservice verfügbar.",
        },
        {
          q: "Kann ich auch alleine kommen, oder ist das nur für Bands und Teams?",
          a: "Natürlich - für Solo-Künstler steht auch der Plethora X5 Looper von TC Electronic zur Verfügung. ;-)",
        },
        {
          q: "Haben Sie Catering, oder muss ich das Essen selbst organisieren?",
          a: "Flexible Verpflegungsmöglichkeiten: Internes Catering mit lokalen Zutaten, Pizzaofen für gemeinsame Abendessen (bis zu 8 Pizzen), voll ausgestattete Küche für Selbstversorgung, Lieferung von lokalen Restaurants aus Domažlice.",
        },
        {
          q: "Sprechen Sie Englisch/Deutsch?",
          a: "Mehrsprachiges Team: Tschechisch - Muttersprachler, Englisch - fließend (Jindřich, Andrea, Tech-Team), Deutsch - Konversationsniveau (regionaler Vorteil), Übersetzungsdienste für Verträge.",
        },
      ],
    },
    contact: {
      title: "Kontakt",
      availability: "Verkehrsanbindung",
      availabilityItems: [
        "Mit dem Auto: 10 Min. zum Zentrum von Domažlice",
        "10 Min. zur deutschen Grenze",
        "Mit dem Zug: Bahnhof direkt in Pile",
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

  const [showDraftBanner, setShowDraftBanner] = useState(true)
  const [draftBannerDismissed, setDraftBannerDismissed] = useState(false)

  const [language, setLanguage] = useState<"cs" | "en" | "de">("cs")
  const [currentSection, setCurrentSection] = useState("mlyn")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showEndMessage, setShowEndMessage] = useState(false)

  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [currentVideoUrl, setCurrentVideoUrl] = useState(
    "https://www.youtube.com/embed/Q6fS_hCaufA?autoplay=1&mute=1&loop=1&playlist=Q6fS_hCaufA&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&vq=hd1080&playsinline=1",
  )
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [nextVideoUrl, setNextVideoUrl] = useState("")
  const playerRef = useRef<any>(null)

  const [mlynScrollProgress, setMlynScrollProgress] = useState(0)
  const mlynSectionRef = useRef<HTMLDivElement>(null)

  const studioSectionRef = useRef<HTMLDivElement>(null)

  const [onasScrollProgress, setOnasScrollProgress] = useState(0)
  const onasSectionRef = useRef<HTMLDivElement>(null)

  const [scrolled, setScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const [showPresentationMessage, setShowPresentationMessage] = useState(false)
  const [presentationOpacity, setPresentationOpacity] = useState(0)

  const t = translations[language as keyof typeof translations]
  const currentLang = language // Added to fix lint error

  const darkModeTimerRef = useRef<NodeJS.Timeout | null>(null)

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
    const iframe = document.getElementById("background-video") as HTMLIFrameElement
    if (iframe) {
      if (isVideoPlaying) {
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*")
      } else {
        iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', "*")
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)

    let newVideoId = ""
    if (newDarkMode) {
      newVideoId = "M4QkWhz7CDo"
    } else {
      if (currentSection === "about") {
        newVideoId = "qcbDEWXmPdE"
      } else if (currentSection === "contact") {
        newVideoId = "NZkXMLz0uKk"
      } else {
        newVideoId = "Q6fS_hCaufA"
      }
    }

    console.log("[v0] Switching to dark mode:", newDarkMode, "video:", newVideoId)

    setIsTransitioning(true)
    const newUrl = `https://www.youtube.com/embed/${newVideoId}?autoplay=1&mute=1&loop=1&playlist=${newVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&vq=hd1080&playsinline=1`
    setNextVideoUrl(newUrl)

    setTimeout(() => {
      setCurrentVideoUrl(newUrl)
      setIsTransitioning(false)
      setNextVideoUrl("")
      setIsVideoPlaying(true)
    }, 1000)
  }

  const handleSectionChange = React.useCallback(
    (section: string) => {
      console.log("[v0] Changing section to:", section, "dark mode:", isDarkMode)

      if (darkModeTimerRef.current) {
        clearTimeout(darkModeTimerRef.current)
        darkModeTimerRef.current = null
      }

      setCurrentSection(section)
      setShowMobileMenu(false)

      if (section === "spoluprace") {
        const element = document.getElementById("collaboration")
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        return
      }

      window.scrollTo({ top: 0, behavior: "smooth" })

      let newVideoId = ""
      if (isDarkMode) {
        newVideoId = "M4QkWhz7CDo"
      } else {
        if (section === "mlyn") {
          newVideoId = "HQUoxExYlEM"
        } else if (section === "about") {
          newVideoId = "qcbDEWXmPdE"
        } else if (section === "contact") {
          newVideoId = "Js0nD8lUKH8"
        } else {
          newVideoId = "Q6fS_hCaufA"
        }
      }

      console.log("[v0] Switching to video:", newVideoId)

      setIsTransitioning(true)
      const newUrl = `https://www.youtube.com/embed/${newVideoId}?autoplay=1&mute=1&loop=1&playlist=${newVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&vq=hd1080&playsinline=1`
      setNextVideoUrl(newUrl)

      setTimeout(() => {
        setCurrentVideoUrl(newUrl)
        setIsTransitioning(false)
        setNextVideoUrl("")
        setIsVideoPlaying(true)
      }, 1000)
    },
    [isDarkMode],
  )

  useEffect(() => {
    if (darkModeTimerRef.current) {
      clearTimeout(darkModeTimerRef.current)
      darkModeTimerRef.current = null
    }

    if (!isDarkMode) {
      if (currentSection === "home") {
        console.log("[v0] Starting 10s timer for photo dark mode switch")
        darkModeTimerRef.current = setTimeout(() => {
          console.log("[v0] Auto-switching to dark mode (photo)")
          setIsDarkMode(true)
          const newVideoId = "M4QkWhz7CDo"
          setIsTransitioning(true)
          const newUrl = `https://www.youtube.com/embed/${newVideoId}?autoplay=1&mute=1&loop=1&playlist=${newVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&vq=hd1080&playsinline=1`
          setNextVideoUrl(newUrl)
          setTimeout(() => {
            setCurrentVideoUrl(newUrl)
            setIsTransitioning(false)
            setNextVideoUrl("")
            setIsVideoPlaying(true)
          }, 1000)
        }, 10000)
      } else {
        console.log("[v0] Starting 45s timer for video dark mode switch")
        darkModeTimerRef.current = setTimeout(() => {
          console.log("[v0] Auto-switching to dark mode (video)")
          setIsDarkMode(true)
          const newVideoId = "M4QkWhz7CDo"
          setIsTransitioning(true)
          const newUrl = `https://www.youtube.com/embed/${newVideoId}?autoplay=1&mute=1&loop=1&playlist=${newVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&vq=hd1080&playsinline=1`
          setNextVideoUrl(newUrl)
          setTimeout(() => {
            setCurrentVideoUrl(newUrl)
            setIsTransitioning(false)
            setNextVideoUrl("")
            setIsVideoPlaying(true)
          }, 1000)
        }, 45000)
      }
    }

    return () => {
      if (darkModeTimerRef.current) {
        clearTimeout(darkModeTimerRef.current)
        darkModeTimerRef.current = null
      }
    }
  }, [currentSection, isDarkMode])

  useEffect(() => {
    const handleScroll = () => {
      if (currentSection === "mlyn" && mlynSectionRef.current) {
        const scrollTop = mlynSectionRef.current.scrollTop
        const scrollHeight = mlynSectionRef.current.scrollHeight
        const clientHeight = mlynSectionRef.current.clientHeight
      }
    }

    const currentRef = mlynSectionRef.current
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll)
      }
    }
  }, [currentSection])

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
        {currentSection === "studio" ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("/images/pila-59-7.webp")',
            }}
          />
        ) : currentSection !== "home" ? (
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
              id="background-video"
              className={`absolute pointer-events-none transition-opacity duration-1000 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
              style={{
                width: "177.77vh", // 16:9 aspect ratio: 100vh * 16/9
                height: "100vh",
                minWidth: "100vw",
                minHeight: "56.25vw", // 16:9 aspect ratio: 100vw * 9/16
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              src={currentVideoUrl}
              title="Mlýn na Pile Background Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
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

      <div className="relative z-10 min-h-screen flex flex-col">
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

              <Button
                variant="outline"
                size="icon"
                onClick={toggleVideo}
                className="bg-white/5 backdrop-blur-sm border-white/20 text-white/70 hover:bg-white/10 hover:text-white h-6 w-6"
              >
                {isVideoPlaying ? <Pause className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5" />}
              </Button>
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

              <Button
                variant="outline"
                size="icon"
                onClick={toggleVideo}
                className="bg-white/5 backdrop-blur-sm border-white/20 text-white/70 hover:bg-white/10 hover:text-white h-6 w-6"
              >
                {isVideoPlaying ? <Pause className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5" />}
              </Button>
            </div>
          </div>
        </nav>

        <div
          className="fixed top-0 left-0 right-0 h-32 pointer-events-none z-40"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          }}
        />
        {/* </CHANGE> Adding h-screen flex flex-col to enable scroll in child sections */}
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

          <div className="">
            {currentSection === "mlyn" ? (
              <div ref={mlynSectionRef} className="flex-1 min-h-screen pt-32 pb-32 overflow-y-auto">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-32">
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
            ) : currentSection === "studio" ? (
              <div ref={studioSectionRef} className="flex-1 overflow-y-auto pt-32">
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
                            <li>• Vintage Fender Custom Shop kytary</li>
                            <li>• Gibson Les Paul Studio (1993) (with Graph Tech Bridge Saddles)</li>
                            <li>• Gibson Explorer</li>
                            <li>• Marshall AFD 100, Mesa Boogie</li>
                            <li>• Rozsáhlá kolekce efektů</li>
                            <li>• Mapex Saturn bicí & K-Zildjian činely</li>
                          </ul>
                        </div>
                      </div>
                      <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group">
                        <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/YWnYQDGHeLw?autoplay=1&mute=1&loop=1&playlist=YWnYQDGHeLw&controls=0&showinfo=0&rel=0&modestbranding=1&vq=hd1080&hd=1"
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
                          src="https://www.youtube.com/embed/gTqXu9xU_7k?autoplay=1&mute=1&loop=1&playlist=gTqXu9xU_7k&controls=0&showinfo=0&rel=0&modestbranding=1&vq=hd1080&hd=1"
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
                          src="https://www.youtube.com/embed/sc0bCt6G9dM?autoplay=1&mute=1&loop=1&playlist=sc0bCt6G9dM&controls=0&showinfo=0&rel=0&modestbranding=1&vq=hd1080&hd=1"
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
                                  src={`${pkg.video.replace("youtu.be/", "www.youtube.com/embed/")}?autoplay=1&mute=1&loop=1&playlist=${pkg.video.split("/").pop()}&controls=0&showinfo=0&rel=0&modestbranding=1&vq=hd1080&hd=1`}
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
                              <p key={index} className="text-white/90 text-xs leading-relaxed">
                                {bonus}
                              </p>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
                {/* CTA Section */}
                <div className="flex items-center justify-center px-6 py-12 bg-black/70 text-white">
                  <div className="text-center max-w-3xl">
                    <h2 className="text-[10px] md:text-xs font-bold mb-4 text-white drop-shadow-lg">
                      {t.studio.ctaTitle}
                    </h2>
                    <p className="text-base mb-3 text-white/90 drop-shadow-md">{t.studio.ctaDesc}</p>
                    <Button
                      size="default"
                      onClick={() => handleSectionChange("contact")}
                      className="px-6 py-2 text-sm bg-white text-black hover:bg-gray-200"
                    >
                      {t.studio.ctaButton}
                    </Button>
                  </div>
                </div>
              </div>
            ) : currentSection === "lokalita" ? (
              <div className="flex-1 px-6 py-12 overflow-y-auto pt-32">
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
                                  <li key={i}>• {item.replace("Autem: ", "")}</li>
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
                                  <li key={i}>• {item.replace("Vlakem: ", "")}</li>
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
                                  <li key={i}>• {item.replace("Letadlem: ", "")}</li>
                                ))}
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
            ) : currentSection === "equipment" ? (
              <div className="flex-1 px-6 py-12 overflow-y-auto pt-32">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">{t.equipment.guitars}</h4>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              <li className="cursor-pointer hover:text-secondary transition-colors">
                                <a
                                  href="https://equipboard.com/items/telecaster-deluxe-73"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`hover:text-secondary transition-colors ${isDarkMode ? "text-blue-400" : "text-secondary"}`}
                                >
                                  • Fender 1973 Telecaster Deluxe
                                </a>
                              </li>
                              <li>• Fender Custom Shop - Jeff Beck (Surf Green)</li>
                              <li>• Fender Custom Shop - LTD 67 HSS Strat AB HR</li>
                              <li>• Fender Jaguar Kurt Cobain (with Graph Tech Bridge Saddles)</li>
                              <li>• Gibson Les Paul Studio (1993) (with Graph Tech Bridge Saddles)</li>
                              <li>• Gibson Explorer</li>
                              <li>• Martin Guitar D-15E (Upgrade with Martin Guitar Bridge Pin Liquid Metal DG)</li>
                              <li className="text-white/60 italic">...a další</li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">{t.equipment.basses}</h4>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              <li>• Fender Precision (1993)</li>
                              <li>• Squier short scale bass</li>
                            </ul>
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
                        <div className="grid grid-cols-1 md:grid-grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">{t.equipment.amps}</h4>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              <li>• Fender 64 Custom Deluxe Reverb</li>
                              <li>• Mesa Boogie Rect-o-verb (upravená verze od Antonín Salva)</li>
                              <li>• Mesa Boogie Dual Rectifier®Head, 3 Channels / 8 Modes, 100W</li>
                              <li>• Marshall AFD 100</li>
                              <li>• AMPEG V-4B Bass Head</li>
                              <li>• Roland JC-22</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">{t.equipment.cabs}</h4>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              <li>• Marshall 1960 BX</li>
                              <li>• Coffe custom CLASSIC 212</li>
                              <li>• Ampeg SVT-112AV Cabinet</li>
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
                              <p className="text-white/90">Dunlop Zakk Wylde Rotovibe (2x)</p>
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
                              <p className="text-white/90">Electro-Harmonix POG2 (červený, polyfonní oktáver)</p>
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

                  {/* Mikrofony a Bicí */}
                  <div className="mb-8">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                              <Mic className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                              {t.equipment.mics}
                            </h3>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              <li>• Sennheiser e 906</li>
                              <li>• Shure Beta 58</li>
                              <li>• Shure SM 7 B</li>
                              <li>• 2x SHURE SM57</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                              <Drums className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                              {t.equipment.drums}
                            </h3>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              <li>• Mapex Saturn</li>
                              <li>• K-Zildjian činely</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* VIDEO PRODUCTION */}
                  <div className="mb-8">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Camera className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          VIDEO PRODUCTION
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
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-white mb-3">Software</h4>
                            <ul className="text-white/80 text-xs space-y-1.5">
                              <li>• Final Cut Pro X</li>
                              <li>• Affinity</li>
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
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Workflow Recommendations */}
                  <div className="mb-8">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Settings className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          {t.equipment.workflow}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-base font-semibold text-white mb-2">Tracking Chain</h4>
                            <ul className="text-white/80 text-xs space-y-1">
                              <li>1. Neve 1073 / UA 610</li>
                              <li>2. LA-2A / 1176</li>
                              <li>3. Pultec EQP-1A</li>
                              <li>4. Oxide / Studer</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-white mb-2">Mixing Chain</h4>
                            <ul className="text-white/80 text-xs space-y-1">
                              <li>1. Cambridge / Helios EQ</li>
                              <li>2. Distressor / dbx 160</li>
                              <li>3. Verve Analog</li>
                              <li>4. Lexicon 224 / Pure Plate</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-white mb-2">Mastering Chain</h4>
                            <ul className="text-white/80 text-xs space-y-1">
                              <li>1. Pultec Pro Legacy</li>
                              <li>2. Precision Multi-Band</li>
                              <li>3. Precision Maximizer</li>
                              <li>4. A-Type Enhancer</li>
                            </ul>
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
                          <Server className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-secondary"}`} />
                          {t.equipment.infrastructure}
                        </h3>
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-3">Infrastruktura</h4>
                          <ul className="text-white/80 text-xs space-y-2">
                            <li>• Přepěťové ochrany</li>
                            <li>• Tesla charging station</li>
                            <li>• Off-grid capability</li>
                            <li>• Security systém</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : currentSection === "contact" ? (
              <div className="pt-32 px-6 py-12">
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
            ) : (
              <div ref={onasSectionRef} className="pt-32 px-6 py-12">
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
                                  href="https://open.spotify.com/track/1jzCR4iPOo3bCEo67VsvaW?si=fb770e4a9679489f"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`underline font-semibold ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-secondary hover:text-secondary/80"}`}
                                >
                                  Nora
                                </a>
                                .
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
            )}
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 py-4 z-50">
        <div className="flex justify-center items-center gap-8">
          <a
            href="https://www.instagram.com/mlynnapile"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-white/70 hover:text-white transition-colors ${isDarkMode ? "hover:text-blue-400" : "hover:text-secondary"}`}
            aria-label="Instagram"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s-.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  )
}
