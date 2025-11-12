"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
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
  Users,
  Music,
  Car,
  UtensilsCrossed,
  Languages,
  Ghost,
  FileText,
} from "lucide-react"

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
      scrollHint: "Scrollujte dolů pro nerušené prohlížení prezentací",
      threeSpaces: "Tři unikátní prostory pro vaši kreativitu",
      vintageInstruments: "Vintage Nástroje",
      vintageDesc: "60s-80s Fender, Gibson, VOX",
      accommodation: "Stylové ubytování",
      accommodationDesc: "4 pokojů, zimní zahrada 63m², finská sauna",
      locationCard: "Lokalita",
      locationDesc: "Krásná příroda - rekreační oblast, soukromí a vlastní park",
      studios: "Studia",
      studiosDesc: "Velké studio 64m²\nStudio mlýnice 25m²\nControl Room 27m²",
      modernTech: "Moderní technologie",
      modernTechDesc: "76 UAD pluginů, Universal Audio Apollo, Logic Pro X, Apple Pro Display XDR 6K",
      benefits: "Další benefity",
      benefitsDesc: "Zapůjčení elektromobilu, kol, nabíjecí stanice, bateriový backup, zabezpečené prostory",
      endMessage: "Užijte si prezentaci!",
      menuHint: "Nebo procházejte přes menu nahoře",
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
      ctaTitle: "Připraveni vytvořit něco úžasného?",
      ctaDesc: "Kontaktujte nás a domluvme si návštěvu studia",
      ctaButton: "Kontaktovat",
    },
    location: {
      title: "Lokalita",
      subtitle: "Klidné místo v srdci Evropy, blízko všeho důležitého",
      nature: "Krásná příroda - rekreační oblast, soukromí a vlastní park",
      naturePara1:
        "Pila u Trhanova je ideální lokalitou pro milovníky krásné přírody, soukromí a aktivního odpočinku. Pozemek má rozlohu přes 6500 m² a nabízí klidné prostředí s několika poseděními a dvěma potůčky, které dotvářejí harmonickou atmosféru.",
      naturePara2:
        "Z Pily se pohodlně dostanete pěšky jak do Domažlic, tak na vrchol nejvyšší hory Českého lesa, Čerchov (1042 m), která láká turisty rozhlednou a nádhernými výhledy. Okolí je bohaté na značené cyklotrasy i pěší stezky vedoucí malebnou krajinou, ideální pro vyznavače přírody a historie.",
      naturePara3:
        "Celý kraj je známý svou zelení, čerstvým vzduchem a klidem, což vytváří perfektní podmínky pro všechny hledající únik z ruchu města a zároveň kvalitní základnu pro výlety a poznávání kulturních i přírodních zajímavostí regionu.",
      quote:
        "Našli jsme za mě dokonalou lokalitu a nádherný historický objekt starého mlýna o který se chceme podělit. Chceme toto místo ještě pozvednout dál - o kreativní lidi, kteří zde budou mít otevřené dveře a kde budou vznikat skvělé věci.",
      transport: "Dopravní dostupnost",
      byCar: "Autem",
      byTrain: "Vlakem",
      byPlane: "Letecky",
      surroundings: "Okolí a zajímavá místa",
      events: "Zajímavé akce v okolí",
      domazliceTitle: "Domažlice (cca 7 km)",
      domazliceItems: [
        "Historickým centrem města",
        "Domažlická šikmá věž",
        "Domažlický pivovar",
        "Kulturní akce a koncerty v místních hudebních klubech",
        "Návštěva Muzea Chodska s etnografickou expozicí",
      ],
      horsovskytynTitle: "Horšovský Týn (cca 25 km)",
      horsovskytynItems: ["Renesanční zámek Horšovský Týn"],
      babylonTitle: "Babylon (část obce Trhanov, cca 5 km)",
      babylonItems: [
        "Přírodní koupaliště, beach volejbal",
        "Tenisové kurty, fotbalové hřiště",
        "Mnoho značených cyklotras",
      ],
      germanyTitle: "Německo (hranice cca 15 km)",
      germanyItems: ["Furth im Wald s hradem Drachenburg", "Místní trhy a kulturní akce"],
      domazliceEvents: [
        { month: "Červenec", event: "Mezinárodní jazzový festival – letní hudební festival s umělci z celého světa" },
        {
          month: "Srpen",
          event: "Chodské slavnosti a Vavřinecká pouť – tradiční folklorní slavnosti s hudbou, divadlem a gastronomií",
        },
        { month: "Červenec", event: "Hudba pod hradem – koncerty v historickém prostředí Domažlic" },
      ],
      horsovskytynEvents: [{ month: "Červenec", event: "Anenská pouť" }],
      babylonEvents: [
        { month: "Srpen", event: "Babylonské léto – série kulturních a sportovních akcí v přírodním prostředí" },
      ],
      chamTitle: "Cham (Německo, cca 40 km)",
      chamClub: "Klub L.A.Cham",
      chamDescription:
        "Skvělý klub kde se pravidelně pořádají akce i velkých amerických kapel! (Sepultura, Dog Eat Dog, Blaze Bayley, ...)",
    },
    equipment: {
      title: "Technické vybavení",
      subtitle: "Vintage duše × Moderní technologie",
      collectionNote: "Sbírka se průběžně aktualizuje i o zapůjčené věci viz.",
      collaborationLink: "sekce spolupráce",
      detailsNote:
        "Nástroje jsou profesionálně seřízeny, preferujeme klasické lampové zesilovače a myslíme na každý detail, aby se ve zvuku nic neztratilo - většina krabiček je TRUE BYPASS nebo je přes jiné řešení ošetřeno aby true bypass byla (např. G-LAB), propojení je přes kvalitní kabely Mogami Platinum a Evidence",
      vintageInstruments: "Vintage Nástroje",
      guitars: "Kytary",
      basses: "Baskytary",
      ampsAndCabs: "Zesilovače a Boxy",
      amps: "Zesilovače",
      cabs: "Boxy",
      effects: "Efekty (rozsáhlá kolekce) a další efekty",
      mics: "Mikrofony",
      drums: "Bicí",
      cables: "Kabely a Stojany",
      modernTech: "Moderní technologie",
      uaPlugins: "Universal Audio Pluginy (76)",
      workflow: "Workflow doporučení",
      infrastructure: "Ostatní technické vybavení",
      thankYouNote: "Poděkování",
      noraCollaboration: "Sbírka nástrojů je obohacena o unikátní kusy od Radka Fořta, kytaristy kapely",
    },
    contact: {
      title: "Kontakt",
      info: "Kontaktní informace",
      address: "Adresa",
      phone: "Telefon",
      availability: "Dostupnost",
      availabilityItems: [
        "10 min do centra Domažlic",
        "10 min na německé hranice",
        "Vlaková zastávka přímo na Pile",
        "1h 45min z Prague Airport",
      ],
    },
    about: {
      title: "Mlýn Šnajberk Studios",
      subtitle: "Kde se rodí inspirace v srdci Evropy",
      tagline: "Vintage duše, moderní technologie",
      history: "Historie mlýna",
      accommodation: "Stylové ubytování",
      founders: "Zakladatelé",
      foundersIntro:
        "Za Mlýnem stojí dva hudebníci, kteří spojili lásku k hudbě, přírodě v jedinečné místo pro tvorbu a odpočinek.",
      jindrichDesc:
        "Kytarista kapely Anteater, nadšenec do moderních technologií, který nedá dopustit na klasické vintage nástroje a aparáty.",
      jindrichQuote:
        "Pracujeme na tom, aby u nás muzikanti našli inspirativní prostor dokonale připravený pro tvorbu. Mlýn má svůj genius loci a duši – a stejnou energii nesou i nástroje a vintage aparáty, které jsou zde k dispozici. V harmonii s nimi zde moderní technologie nenápadně podporují pohodlí a profesionální podmínky pro zachycení každého hudebního nápadu. Naším cílem je vytvořit krásné, klidné a pohodové prostředí, kam se lidé budou rádi vracet. Dveře máme otevřené všem kreativním lidem, nejen hudebníkům. Věříme, že právě tato kombinace – prostor s duší, nástroje s příběhem a moderní technologie v pozadí – se stane motorem a synergií pro vznik úžasných věcí.",
      andreaDesc:
        "Zpěvačka a baskytaristka kapely Anteater a také archeoložka. Právě v prostředí starého mlýna se všechny tyto její vášně přirozeně propojují. Andrea spoluvytváří domáckou a inspirativní atmosféru studia. Pokud budete chtít o půlnoci uvařit kakao (a nebo nazpívat druhé hlasy), neváhejte se obrátit právě na Andreu (v případě technických problémů pak na Jindru :)) Teď ale vážně: vzájemně se doplňujeme a snažíme se mnohdy z našich různých pohledů na svět inspirovat.",
      collaboration: "Spolupráce a podpora",
      collaborationPara1:
        "Hledáme partnery, ne pouze dodavatele. Věříme v long-term relationships založené na shared passion pro music a quality.",
      collaborationPara1Strong: "Hledáme partnery, ne pouze dodavatele.",
      collaborationPara2:
        "Ve studiu se snažíme mít co nejlepší vybavení - průběžně upravujeme setup a stále hledáme to nejlepší na trhu.",
      collaborationPara2Strong: "Stavíte kytary, efektové krabičky, zesilovače?",
      collaborationPara2End: "Chcete, aby se k vašim produktům dostali zajímaví zákazníci?",
      collaborationPara3:
        "Přijeďte se za námi podívat a nezávazně si popovídat - rádi poznáváme zajímavé lidi, kteří něco tvoří. Vše si chceme nejdříve důkladně vyzkoušet.",
      collaboration3Strong: "Don't hesitate to contact us!",
      collaborationFormsTitle: "Formy spolupráce:",
      collaborationForms: [
        "Artist Residencies - long-term creative partnerships",
        "Equipment Testing - real-world evaluation s feedback",
        "Content Creation - dokumentární projekty a tutorials",
        "Educational Programs - masterclasses a workshops",
        "Brand Integration - authentic product placement",
      ],
      bonuses: "Další bonusy",
      bonusesItems: [
        "Můžete si zvednout stavidlo a pustit vodu na mlýn. 😄💧",
        "V noci je tu nebe jako v Severní Koreji – všude hvězdy. ✨🌟",
        "Pro Dana Bártu (a ostatní milovníky přírody): Jsou tu vážky, krásné a je jich hodně :-) 🦋 Létají až do zimní zahrady a jsou dost rozumné na to, aby po prohlídce zase odletěly, aniž by narážely do skla. Kromě nich tu najdete i invazivní rostliny (křídlatka a škumpa), se kterými statečně bojujeme. 🌿⚔️ Rostou tu ale také sekvoje obrovské, které – přiznáváme – nemáme srdce porazit. 🌲💚",
        "Pod okny studia jsou často Labutě s labuťátky, které se nechají krmit. 🦢",
        "U sousedky Dády si můžete projet na koních. 🐴",
        "I za bílého dne, zde můžete potkat ježky, kuny, srnky přímo na zahradě. Když utečou Dádě koně, tak si s nimi můžete dát kafe prakticky v zimní zahradě :-) 🦔Deer☕",
        "Můžete potkat i tlustou veverku, co vyvrací plaňky - zvířata se zde mají skvěle :-) Máme i volavky a u sousedů štěně a pár kamarádských koček (také od různých sousedů), žáby a krtky (naše) :-) 🐿️🐕🐈",
        "Žijeme se zvířaty v symbióze a spolupracujeme, tento rok byl vstup do studia navíc zabezpečen i sršním hnízdem hned nad vstupem, které pro příští roky už neplánujeme a nahradíme ho modernějšími technologiemi. Děkujeme. (Žádní sršni nepřišli k úhoně – nechali jsme je dožít v klidu. 🐝) ⚡",
        "Čerstvá bio zelenina, výborné hroznové víno, chmel. Celkově je tady tráva zelenější a díky krtkům je vidět krásná černozem. :-D 🥬🍇🌿",
        "Vše podtrhuje ticho a klid, přitom do Domažlic je to jak z Národní na Palmovku (8 minut). 🤫🌳",
        "V neposlední řadě, fajn sousedi ze všech stran a hospůdka Bidlo se sympatickou obsluhou a krásným výhledem na rybník a mlýn z druhé strany. Tady si můžete dát Plzeň a kdyby jste chtěli si dát víc piv a druhý den fungovat ve studiu, doporučujeme výlet do pivovaru v Domažlicích a držet se pouze Domažlické desítky, po které můžete bez problémů druhý den fungovat (Doporučeno paní sládkovou a několikrát pro vás otestováno, že je to pravda :-) 🍺🏡",
        "Ráno můžete skočit i do rybníka, ale nikdo to nedělá... ale jako můžete :-) 🏊‍♂️",
      ],
      faq: "Často kladené otázky",
      faqItems: [
        {
          q: "Straší na mlýně?",
          a: "Ne ;-)",
        },
        {
          q: "Jste plátci DPH?",
          a: "Ano, jsme plátci DPH. Všechny ceny na webu jsou uvedeny včetně DPH. Pro business klienty vystavujeme faktury s DPH, pro zahraniční klienty řešíme reverse charge podle EU regulations.",
        },
        {
          q: "Lze pronajmout celý objekt?",
          a: "Samozřejmě! Preferujeme exkluzivní rezervace pro maximální soukromí a kreativní flow. Celý komplex lze rezervovat minimálně na 3 dny. Cena zahrnuje všechny prostory, catering možnosti a 24/7 podporu.",
        },
        {
          q: "Mohu si přivést vlastní tým, nebo mohu jen dorazit sám?",
          a: "Obě možnosti jsou v pořádku! Pro sólové umělce máme připravený looper Plethora X5 s pěti loopy. S týmem: ubytování pro až 8 lidí, více pracovních prostorů.",
        },
        {
          q: "Jaké žánry u vás můžu nahrávat?",
          a: "Všechny žánry vítány! Rock/Metal - autentický lampový zvuk, Electronic - precizní digitální zpracování, Acoustic/Folk - přirozená akustika místnosti, Hip-Hop/Rap - přesný monitoring, Classical/Jazz - prostorné nahrávací plochy.",
        },
        {
          q: "Jak se k nám dostanu?",
          a: "Autem: přímý přístup, soukromé parkování, Tesla nabíjení. Vlakem: 10 min pěšky ze stanice Trhanov. Letecky: 1h 45min z letiště Praha, 2h z letiště Mnichov, pick-up služba k dispozici.",
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
      historyTimeline: [
        {
          year: "1653 - Založení",
          desc: "Založení rybníků a postavení vysoké pece a hamru Lamingena",
        },
        {
          year: "1810 - Přestavba na mlýn",
          desc: "Mlýn s pilou poháněnou vodní silou",
        },
        {
          year: "1990 - Pila",
          desc: "Vznikla k 24. listopadu 1990 jako část obce Trhanov v okrese Domažlice",
        },
        {
          year: "2024 - Nový začátek",
          desc: "Transformace na prémiové kreativní retreat studio",
        },
      ],
      accommodationRooms: "Pokoje (až 8 hostů)",
      masterSuite: "Master Suite",
      masterSuiteDesc: "Terasa s výhledem na rybník, vintage nábytek, vlastní koupelna",
      fourRooms: "4 pokoje",
      fourRoomsDesc: "Každý pokoj s unikátním charakterem, moderní komfort, inspirativní design",
      commonSpaces: "Společné prostory",
      commonSpacesItems: [
        "Jídelna pro 8 osob",
        "Plně vybavená kuchyň",
        "Malá knihovna",
        "Domácí kino",
        "Zimní zahrada 63m²",
      ],
      finnishSauna: "Finská sauna",
      finnishSaunaItems: ["Finská sauna", "Tenisové kurty, koupaliště (2,2 km)"],
      parkOutdoor: "Park & Outdoor (6527m²)",
      parkOutdoorItems: [
        "Dva živé potůčky",
        "Vzrostlé stromy",
        "Několik teras",
        "Gril a pizza pec (8 pizz)",
        "Procházkové stezky",
        "Soukromé parkování + Tesla nabíjení",
      ],
      catering: "Catering & Stravování",
      cateringItems: [
        { title: "Vlastní catering", desc: "s lokálními ingrediencemi" },
        { title: "Pizza pec", desc: "pro společné večeře (až 8 pizz)" },
        { title: "Plně vybavená kuchyň", desc: "pro vlastní vaření" },
        { title: "Rozvoz z místních restaurací", desc: "z Domažlic" },
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
      scrollHint: "Scroll down for uninterrupted viewing of presentations",
      threeSpaces: "Three unique spaces for your creativity",
      vintageInstruments: "Vintage Instruments",
      vintageDesc: "60s-80s Fender, Gibson, VOX",
      accommodation: "Stylish Accommodation",
      accommodationDesc: "4 rooms, winter garden 63m², Finnish sauna",
      locationCard: "Location",
      locationDesc: "Beautiful nature - recreational area, privacy and private park",
      studios: "Studios",
      studiosDesc: "Main studio 64m²\nMillstone studio 25m²\nControl Room 27m²",
      modernTech: "Modern Technology",
      modernTechDesc: "76 UAD plugins, Universal Audio Apollo, \nLogic Pro X, Apple Pro Display XDR 6K",
      benefits: "Additional Benefits",
      benefitsDesc: "Electric car rental, bikes, charging station, battery backup, secured premises",
      endMessage: "Enjoy the presentation!",
      menuHint: "Or browse through the menu above",
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
      ctaTitle: "Ready to create something amazing?",
      ctaDesc: "Contact us and let's arrange a studio visit",
      ctaButton: "Contact",
    },
    location: {
      title: "Location",
      subtitle: "Peaceful place in the heart of Europe, close to everything important",
      nature: "Beautiful nature - recreational area, privacy and own park",
      naturePara1:
        "Pila 100 near Trhanov is an ideal location for lovers of beautiful nature, privacy and active recreation. The property covers over 6500 m² and offers a peaceful environment with several seating areas and two streams that create a harmonious atmosphere.",
      naturePara2:
        "From Pila you can easily walk to Domažlice or to the top of the highest mountain of the Bohemian Forest, Čerchov (1042 m), which attracts tourists with its lookout tower and magnificent views. The area is rich in marked cycling routes and hiking trails through picturesque countryside, ideal for nature and history enthusiasts.",
      naturePara3:
        "The entire region is known for its greenery, fresh air and tranquility, creating perfect conditions for anyone seeking an escape from the hustle and bustle of the city while providing a quality base for trips and exploring the cultural and natural attractions of the region.",
      quote:
        "We found the perfect location and a beautiful historic old mill building that we want to share. We want to elevate this place further - with creative people who will have open doors here and where great things will be created.",
      transport: "Transport accessibility",
      byCar: "By car",
      byTrain: "By train",
      byPlane: "By plane",
      surroundings: "Surroundings and points of interest",
      events: "Interesting events nearby",
      domazliceTitle: "Domažlice (approx. 7 km)",
      domazliceItems: [
        "Historic city center",
        "Domažlice Leaning Tower",
        "Domažlice Brewery",
        "Cultural events and concerts in local music clubs",
        "Visit to the Chodsko Museum with ethnographic exhibition",
      ],
      horsovskytynTitle: "Horšovský Týn (approx. 25 km)",
      horsovskytynItems: ["Renaissance Horšovský Týn Castle"],
      babylonTitle: "Babylon (part of Trhanov, approx. 5 km)",
      babylonItems: [
        "Natural swimming pool, beach volleyball",
        "Tennis courts, football field",
        "Many marked cycling trails",
      ],
      germanyTitle: "Germany (border approx. 15 km)",
      germanyItems: ["Furth im Wald with Drachenburg Castle", "Local markets and cultural events"],
      domazliceEvents: [
        {
          month: "July",
          event: "International Jazz Festival – summer music festival with artists from around the world",
        },
        {
          month: "August",
          event:
            "Chod Festival and St. Lawrence Fair – traditional folklore festival with music, theater and gastronomy",
        },
        { month: "July", event: "Music under the Castle – concerts in the historic setting of Domažlice" },
      ],
      horsovskytynEvents: [{ month: "July", event: "St. Anne's Fair" }],
      babylonEvents: [
        { month: "August", event: "Babylon Summer – series of cultural and sports events in natural surroundings" },
      ],
      chamTitle: "Cham (Germany, approx. 40 km)",
      chamClub: "Club L.A.Cham",
      chamDescription:
        "Great club that regularly hosts events with major American bands! (Sepultura, Dog Eat Dog, Blaze Bayley, ...)",
    },
    equipment: {
      title: "Technical Equipment",
      subtitle: "Vintage soul × Modern technology",
      collectionNote: "The collection is continuously updated with borrowed items, see",
      collaborationLink: "collaboration section",
      detailsNote:
        "Instruments are professionally set up, we prefer classic tube amplifiers and think about every detail so that nothing is lost in the sound - most pedals are TRUE BYPASS or have other solutions to ensure true bypass (e.g. G-LAB), connections are made with quality Mogami Platinum and Evidence cables",
      vintageInstruments: "Vintage Instruments",
      guitars: "Guitars",
      basses: "Bass Guitars",
      ampsAndCabs: "Amplifiers and Cabinets",
      amps: "Amplifiers",
      cabs: "Cabinets",
      effects: "Effects (extensive collection) and other effects",
      mics: "Microphones",
      drums: "Drums",
      cables: "Cables and Stands",
      modernTech: "Modern Technology",
      uaPlugins: "Universal Audio Plugins (76)",
      workflow: "Workflow recommendations",
      infrastructure: "Other technical equipment",
      thankYouNote: "Acknowledgments",
      noraCollaboration:
        "The instrument collection is enriched by unique pieces from Radek Fořt, guitarist of the band",
    },
    contact: {
      title: "Contact",
      info: "Contact Information",
      address: "Address",
      phone: "Phone",
      availability: "Availability",
      availabilityItems: [
        "10 min to Domažlice center",
        "10 min to German border",
        "Train station directly in Pila",
        "1h 45min from Prague Airport",
      ],
    },
    about: {
      title: "Mlýn Šnajberk Studios",
      subtitle: "Where inspiration is born in the heart of Europe",
      tagline: "Vintage soul, modern technology",
      history: "Mill History",
      accommodation: "Stylish Accommodation",
      founders: "Founders",
      foundersIntro:
        "Behind the Mill are two musicians who combined their love for music, nature and modern technology into a unique place for creation and relaxation.",
      jindrichDesc:
        "Guitarist of the band Anteater, enthusiast of modern technologies who swears by classic vintage instruments and equipment.",
      jindrichQuote:
        "We work to ensure that musicians find an inspiring space perfectly prepared for creation. The Mill has its genius loci and soul – and the instruments and vintage equipment available here carry the same energy. In harmony with them, modern technology unobtrusively supports comfort and professional conditions for capturing every musical idea. Our goal is to create a beautiful, peaceful and comfortable environment where people will want to return. We have open doors for all creative people, not just musicians. We believe that this combination – a space with soul, instruments with history and modern technology in the background – will become the engine and synergy for creating amazing things.",
      andreaDesc:
        "Singer and bassist of the band Anteater and also an archaeologist. It is in the environment of the old mill that all these passions naturally come together. Andrea co-creates the homey and inspiring atmosphere of the studio. If you want to make cocoa at midnight (or sing backing vocals), don't hesitate to turn to Andrea (in case of technical problems, then to Jindra :)) But seriously: we complement each other and try to inspire each other from our different perspectives on the World.",
      collaboration: "Collaboration and Support",
      collaborationPara1:
        "We're looking for partners, not just suppliers. We believe in long-term relationships based on shared passion for music and quality.",
      collaborationPara1Strong: "We're looking for partners, not just suppliers.",
      collaborationPara2:
        "We strive to have the best equipment in the studio - we continuously update our setup and are always looking for the best on the market.",
      collaborationPara2Strong: "Do you build guitars, effect pedals, amplifiers?",
      collaborationPara2End: "Do you want your products to reach interesting customers?",
      collaborationPara3:
        "Come visit us and have a casual chat - we love meeting interesting people who create. We want to thoroughly test everything first.",
      collaboration3Strong: "Don't hesitate to contact us!",
      collaborationFormsTitle: "Forms of Collaboration:",
      collaborationForms: [
        "Artist Residencies - long-term creative partnerships",
        "Equipment Testing - real-world evaluation with feedback",
        "Content Creation - documentary projects and tutorials",
        "Educational Programs - masterclasses and workshops",
        "Brand Integration - authentic product placement",
      ],
      bonuses: "Other Bonuses",
      bonusesItems: [
        "You can lift the mill gate and let water flow to the mill. 😄💧",
        "At night, the sky is like in North Korea – complete darkness, stars everywhere you look. ✨🌟",
        "For nature lovers: There are dragonflies here, beautiful and numerous. 🦋 They fly into the conservatory and are smart enough to fly back out after their inspection without bumping into the glass. Besides them, you'll find invasive plants, against which we bravely fight. 🌿⚔️ But there are also giant sequoias growing here, which – we admit – we don't have the heart to cut down. 🌲💚",
        "Under the studio windows, there are often swans with cygnets that let you feed them. 🦢",
        "At neighbor Dáda's, you can go horseback riding. 🐴",
        "Even in broad daylight, you can encounter hedgehogs, martens, and deer right in the garden. When Dáda's horses escape, you can have coffee with them practically in the conservatory :-) 🦔🦌☕",
        "You might also meet a fat squirrel that digs up planks - animals have it great here :-) We also have herons and neighbors have a puppy and a few friendly cats (also from various neighbors) :-) 🐿️🐕🐈",
        "We live in symbiosis with animals and cooperate, this year the studio entrance was additionally secured by a hornet nest right above the entrance, which we don't plan for future years and will replace with more modern technologies. (No hornets were harmed – we let them live out their lives in peace. 🐝) Thank you. ⚡",
        "Fresh organic vegetables, excellent grapes, hops. Overall, the grass is greener here and thanks to moles you can see beautiful black soil. :-D 🥬🍇🌿",
        "Everything is underlined by silence and peace, yet it's as close to Domažlice as from Národní to Palmovka (8 minutes). 🤫🌳",
        "Last but not least, nice neighbors from all sides and the Bidlo pub with friendly staff and a beautiful view of the mill from the other side. Here you can have a Pilsner and if you want to have more beers and function in the studio the next day, we recommend a trip to the brewery in Domažlice and stick only to Domažlická desítka, after which you can function without problems the next day (Recommended by the brewmaster and tested several times for you that it's true :-) 🍺🏡",
        "In the morning you can also jump into the pond, but nobody does... but you can :-) 🏊‍♂️",
      ],
      faq: "Frequently Asked Questions",
      faqItems: [
        {
          q: "Is the mill haunted?",
          a: "No ;-)",
        },
        {
          q: "Are you VAT payers?",
          a: "Yes, we are VAT payers. All prices on the website include VAT. For business clients we issue invoices with VAT, for foreign clients we handle reverse charge according to EU regulations.",
        },
        {
          q: "Can I rent the entire property?",
          a: "We prefer exclusive bookings for maximum privacy and creative flow. The entire complex can be reserved for a minimum of 3 days. The price includes all spaces, catering options and 24/7 support.",
        },
        {
          q: "Can I bring my own team, or can I come alone?",
          a: "Both options are perfectly fine! For solo artists, we have a Plethora X5 looper with five loops ready. With a team: accommodation for up to 8 people, multiple workspaces.",
        },
        {
          q: "What genres can I record here?",
          a: "All genres welcome! Rock/Metal - authentic tube amp sound, Electronic - pristine digital processing, Acoustic/Folk - natural room acoustics, Hip-Hop/Rap - tight monitoring, Classical/Jazz - spacious recording areas.",
        },
        {
          q: "How do I get to you?",
          a: "By car: direct access, private parking, Tesla charging. By train: 10 min walk from Trhanov station. By plane: 1h 45min from Prague Airport, 2h from Munich Airport, pick-up service available.",
        },
        {
          q: "Do you have catering, or do I need to arrange food myself?",
          a: "Flexible dining options: In-house catering with local ingredients, pizza oven for community dinners (up to 8 pizzas), fully equipped kitchen for self-catering, local restaurant delivery from Domažlice.",
        },
        {
          q: "Do you speak English/German?",
          a: "Multilingual team: Czech - native, English - fluent (Jindřich, Andrea, tech team), German - conversational (regional advantage), translation services for contracts.",
        },
      ],
      historyTimeline: [
        {
          year: "1653 - Foundation",
          desc: "Establishment of ponds and construction of blast furnace and hammer mill by Lamingen",
        },
        {
          year: "1810 - Conversion to mill",
          desc: "Mill with sawmill powered by water",
        },
        {
          year: "1990 - Sawmill",
          desc: "Established on November 24, 1990 as part of Trhanov municipality in Domažlice district",
        },
        {
          year: "2024 - New Beginning",
          desc: "Transformation into premium creative retreat studio",
        },
      ],
      accommodationRooms: "Rooms (up to 8 guests)",
      masterSuite: "Master Suite",
      masterSuiteDesc: "Terrace overlooking the pond, vintage furniture, private bathroom",
      fourRooms: "4 rooms",
      fourRoomsDesc: "Each room with unique character, modern comfort, inspiring design",
      commonSpaces: "Common Spaces",
      commonSpacesItems: [
        "Dining room for 8 people",
        "Fully equipped kitchen",
        "Small library",
        "Home cinema",
        "Winter garden 63m²",
      ],
      finnishSauna: "Finnish Sauna",
      finnishSaunaItems: ["Finnish sauna", "Tennis courts, swimming pool (2.2 km)"],
      parkOutdoor: "Park & Outdoor (6527m²)",
      parkOutdoorItems: [
        "Two live streams",
        "Mature trees",
        "Multiple terraces",
        "BBQ & pizza oven (8 pizzas)",
        "Walking paths",
        "Private parking + Tesla charging",
      ],
      catering: "Catering & Dining",
      cateringItems: [
        { title: "In-house catering", desc: "with local ingredients" },
        { title: "Pizza oven", desc: "for community dinners (up to 8 pizzas)" },
        { title: "Fully equipped kitchen", desc: "for self-catering" },
        { title: "Local restaurant delivery", desc: "from Domažlice" },
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
      scrollHint: "Scrollen Sie nach unten für eine ungestörte Ansicht der Präsentationen",
      threeSpaces: "Drei einzigartige Räume für Ihre Kreativität",
      vintageInstruments: "Vintage-Instrumente",
      vintageDesc: "60er-80er Fender, Gibson, VOX",
      accommodation: "Stilvolle Unterkunft",
      accommodationDesc: "4 Zimmer, Wintergarten 63m², finnische Sauna",
      locationCard: "Lage",
      locationDesc: "Schöne Natur - Erholungsgebiet, Privatsphäre und eigener Park",
      studios: "Studios",
      studiosDesc: "Hauptstudio 64m²\nMühlstein-Studio 25m²\nControl Room 27m²",
      modernTech: "Moderne Technologie",
      modernTechDesc: "76 UAD-Plugins, Universal Audio Apollo, Logic Pro X, Apple Pro Display XDR 6K",
      benefits: "Weitere Vorteile",
      benefitsDesc: "Elektroauto-Verleih, Fahrräder, Ladestation, Batterie-Backup, gesicherte Räumlichkeiten",
      endMessage: "Genießen Sie die Präsentation!",
      menuHint: "Oder durchsuchen Sie das Menü oben",
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
      controlRoom: "Control Room",
      controlRoomSize: "27 m²",
      controlRoomDesc:
        "Makellose Akustik für kritisches Hören. Ausgestattet mit modernster Technologie für Mixing und Mastering auf höchstem Niveau.",
      technology: "Technologie",
      millstoneStudio: "Mühlstein-Studio",
      millstoneSize: "25 m² - Ehemaliger Mühlenraum",
      millstoneDesc:
        "Hohe Decken und einzigartige Akustik des historischen Mühlenraums. Ideal für akustische Aufnahmen und experimentelle Projekte.",
      ctaTitle: "Bereit, etwas Erstaunliches zu schaffen?",
      ctaDesc: "Kontaktieren Sie uns und vereinbaren Sie einen Studiobesuch",
      ctaButton: "Kontakt",
    },
    location: {
      title: "Standort",
      subtitle: "Ruhiger Ort im Herzen Europas, nah an allem Wichtigen",
      nature: "Schöne Natur - Erholungsgebiet, Privatsphäre und eigener Park",
      naturePara1:
        "Pila 100 bei Trhanov ist ein idealer Ort für Liebhaber schöner Natur, Privatsphäre und aktiver Erholung. Das Grundstück umfasst über 6500 m² und bietet eine ruhige Umgebung mit mehreren Sitzgelegenheiten und zwei Bächen, die eine harmonische Atmosphäre schaffen.",
      naturePara2:
        "Von Pila aus können Sie bequem zu Fuß nach Domažlice oder auf den Gipfel des höchsten Berges des Böhmerwaldes, Čerchov (1042 m), gelangen, der Touristen mit seinem Aussichtsturm und herrlichen Ausblicken anzieht. Die Gegend ist reich an markierten Radwegen und Wanderwegen durch malerische Landschaften, ideal für Natur- und Geschichtsliebhaber.",
      naturePara3:
        "Die gesamte Region ist bekannt für ihr Grün, frische Luft und Ruhe und schafft perfekte Bedingungen für alle, die eine Flucht aus der Hektik der Stadt suchen und gleichzeitig eine qualitativ hochwertige Basis für Ausflüge und die Erkundung der kulturellen und natürlichen Sehenswürdigkeiten der Region.",
      quote:
        "Wir haben den perfekten Ort und ein wunderschönes historisches altes Mühlengebäude gefunden, das wir teilen möchten. Wir wollen diesen Ort weiter aufwerten - mit kreativen Menschen, die hier offene Türen haben und wo großartige Dinge entstehen werden.",
      transport: "Verkehrsanbindung",
      byCar: "Mit dem Auto",
      byTrain: "Mit dem Zug",
      byPlane: "Mit dem Flugzeug",
      surroundings: "Umgebung und Sehenswürdigkeiten",
      events: "Interessante Veranstaltungen in der Nähe",
      domazliceTitle: "Domažlice (ca. 7 km)",
      domazliceItems: [
        "Historisches Stadtzentrum",
        "Domažlice Schiefer Turm",
        "Domažlice Brauerei",
        "Kulturelle Veranstaltungen und Konzerte in lokalen Musikclubs",
        "Besuch des Chodsko Museums mit ethnografischer Ausstellung",
      ],
      horsovskytynTitle: "Horšovský Týn (ca. 25 km)",
      horsovskytynItems: ["Renaissance-Schloss Horšovský Týn"],
      babylonTitle: "Babylon (Teil von Trhanov, ca. 5 km)",
      babylonItems: ["Naturschwimmbad, Beachvolleyball", "Tennisplätze, Fußballfeld", "Viele markierte Radwege"],
      germanyTitle: "Deutschland (Grenze ca. 15 km)",
      germanyItems: ["Furth im Wald mit Burg Drachenburg", "Lokale Märkte und kulturelle Veranstaltungen"],
      domazliceEvents: [
        {
          month: "Juli",
          event: "Internationales Jazzfestival – Sommermusikfestival mit Künstlern aus der ganzen Welt",
        },
        {
          month: "August",
          event: "Chod-Fest und Laurentiuskirmes – traditionelles Folklorefest mit Musik, Theater und Gastronomie",
        },
        { month: "Juli", event: "Musik unter der Burg – Konzerte in der historischen Kulisse von Domažlice" },
      ],
      horsovskytynEvents: [{ month: "Juli", event: "Annenkirmes" }],
      babylonEvents: [
        {
          month: "August",
          event: "Babylon Sommer – Reihe von kulturellen und sportlichen Veranstaltungen in natürlicher Umgebung",
        },
      ],
      chamTitle: "Cham (Deutschland, ca. 40 km)",
      chamClub: "Club L.A.Cham",
      chamDescription:
        "Toller Club, der regelmäßig Veranstaltungen mit großen amerikanischen Bands veranstaltet! (Sepultura, Dog Eat Dog, Blaze Bayley, ...)",
    },
    equipment: {
      title: "Technische Ausstattung",
      subtitle: "Vintage-Seele × Moderne Technologie",
      collectionNote: "Die Sammlung wird kontinuierlich mit geliehenen Gegenständen aktualisiert, siehe",
      collaborationLink: "Kooperationsbereich",
      detailsNote:
        "Instrumente sind professionell eingerichtet, wir bevorzugen klassische Röhrenverstärker und denken an jedes Detail, damit im Sound nichts verloren geht - die meisten Pedale sind TRUE BYPASS oder haben andere Lösungen, um True Bypass zu gewährleisten (z.B. G-LAB), Verbindungen werden mit hochwertigen Mogami Platinum und Evidence Kabeln hergestellt",
      vintageInstruments: "Vintage-Instrumente",
      guitars: "Gitarren",
      basses: "Bassgitarren",
      ampsAndCabs: "Verstärker und Boxen",
      amps: "Verstärker",
      cabs: "Boxen",
      effects: "Effekte (umfangreiche Sammlung) und weitere Effekte",
      mics: "Mikrofone",
      drums: "Schlagzeug",
      cables: "Kabel und Ständer",
      modernTech: "Moderne Technologie",
      uaPlugins: "Universal Audio Plugins (76)",
      workflow: "Workflow-Empfehlungen",
      infrastructure: "Weitere technische Ausstattung",
      thankYouNote: "Danksagung",
      noraCollaboration: "Die Instrumentensammlung wird durch einzigartige Stücke von Radek Fořt, Gitarrist der Band",
    },
    contact: {
      title: "Kontakt",
      info: "Kontaktinformationen",
      address: "Adresse",
      phone: "Telefon",
      availability: "Verfügbarkeit",
      availabilityItems: [
        "10 Min. zum Zentrum von Domažlice",
        "10 Min. zur deutschen Grenze",
        "Bahnhof direkt in Pila",
        "1h 45min vom Prager Flughafen",
      ],
    },
    about: {
      title: "Mlýn Šnajberk Studios",
      subtitle: "Wo Inspiration im Herzen Europas entsteht",
      tagline: "Vintage-Seele, moderne Technologie",
      history: "Geschichte der Mühle",
      accommodation: "Stilvolle Unterkunft",
      founders: "Gründer",
      foundersIntro:
        "Hinter der Mühle stehen zwei Musiker, die ihre Liebe zur Musik, Natur und modernen Technologie zu einem einzigartigen Ort für Kreation und Entspannung vereint haben.",
      jindrichDesc:
        "Gitarrist der Band Anteater, Enthusiast moderner Technologien, der auf klassische Vintage-Instrumente und -Geräte schwört.",
      jindrichQuote:
        "Wir arbeiten daran, dass Musiker bei uns einen inspirierenden Raum finden, der perfekt für die Kreation vorbereitet ist. Die Mühle hat ihren Genius Loci und ihre Seele – und die gleiche Energie tragen auch die Instrumente und Vintage-Geräte, die hier zur Verfügung stehen. In Harmonie mit ihnen unterstützt moderne Technologie unauffällig Komfort und professionelle Bedingungen für die Erfassung jeder musikalischen Idee. Unser Ziel ist es, eine schöne, ruhige und komfortable Umgebung zu schaffen, in die Menschen gerne zurückkehren werden. Wir haben offene Türen für alle kreativen Menschen, nicht nur für Musiker. Wir glauben, dass diese Kombination – ein Raum mit Seele, Instrumente mit Geschichte und moderne Technologie im Hintergrund – zum Motor und zur Synergie für die Entstehung erstaunlicher Dinge wird.",
      andreaDesc:
        "Sängerin und Bassistin der Band Anteater und auch Archäologin. Gerade in der Umgebung der alten Mühle verbinden sich all diese Leidenschaften natürlich. Andrea schafft die heimelige und inspirierende Atmosphäre des Studios. Wenn Sie um Mitternacht Kakao kochen möchten (oder Backing Vocals singen), zögern Sie nicht, sich an Andrea zu wenden (bei technischen Problemen dann an Jindra :)) Aber im Ernst: Wir ergänzen uns und versuchen oft, uns aus unseren unterschiedlichen Perspektiven auf die Welt zu inspirieren.",
      collaboration: "Zusammenarbeit und Unterstützung",
      collaborationPara1:
        "Wir suchen Partner, nicht nur Lieferanten. Wir glauben an langfristige Beziehungen, die auf gemeinsamer Leidenschaft für Musik und Qualität basieren.",
      collaborationPara1Strong: "Wir suchen Partner, nicht nur Lieferanten.",
      collaborationPara2:
        "Wir bemühen uns, die beste Ausrüstung im Studio zu haben - wir aktualisieren kontinuierlich unser Setup und suchen immer nach dem Besten auf dem Markt.",
      collaborationPara2Strong: "Bauen Sie Gitarren, Effektpedale, Verstärker?",
      collaborationPara2End: "Möchten Sie, dass Ihre Produkte interessante Kunden erreichen?",
      collaborationPara3:
        "Besuchen Sie uns und unterhalten Sie sich unverbindlich - wir lernen gerne interessante Menschen kennen, die etwas schaffen. Wir möchten zuerst alles gründlich testen.",
      collaboration3Strong: "Zögern Sie nicht, uns zu kontaktieren!",
      collaborationFormsTitle: "Formen der Zusammenarbeit:",
      collaborationForms: [
        "Artist Residencies - langfristige kreative Partnerschaften",
        "Equipment Testing - Praxistest mit Feedback",
        "Content Creation - Dokumentarprojekte und Tutorials",
        "Educational Programs - Masterclasses und Workshops",
        "Brand Integration - authentische Produktplatzierung",
      ],
      bonuses: "Weitere Boni",
      bonusesItems: [
        "Sie können das Mühlenwehr anheben und Wasser zur Mühle fließen lassen. 😄💧",
        "Nachts ist der Himmel wie in Nordkorea – völlige Dunkelheit, Sterne wohin man schaut. ✨🌟",
        "Für Naturliebhaber: Es gibt hier Libellen, schön und zahlreich. 🦋 Sie fliegen bis in den Wintergarten und sind klug genug, nach ihrer Inspektion wieder hinauszufliegen, ohne gegen das Glas zu stoßen. Neben ihnen finden Sie invasive Pflanzen, gegen die wir tapfer kämpfen. 🌿⚔️ Aber es wachsen hier auch Riesenmammutbäume, die – wir geben es zu – wir nicht übers Herz bringen zu fällen. 🌲💚",
        "Unter den Studiofenstern sind oft Schwäne mit Schwanenjungen, die sich füttern lassen. 🦢",
        "Bei der Nachbarin Dáda können Sie reiten. 🐴",
        "Auch am helllichten Tag können Sie Igel, Marder und Rehe direkt im Garten begegnen. Wenn Dádas Pferde entkommen, können Sie praktisch im Wintergarten mit ihnen Kaffee trinken :-) 🦔🦌☕",
        "Sie können auch ein dickes Eichhörnchen treffen, das Bretter ausgräbt - Tiere haben es hier großartig :-) Wir haben auch Reiher und die Nachbarn haben einen Welpen und ein paar freundliche Katzen (auch von verschiedenen Nachbarn) :-) 🐿️🐕🐈",
        "Wir leben in Symbiose mit Tieren und arbeiten zusammen, dieses Jahr wurde der Studioeingang zusätzlich durch ein Hornissennest direkt über dem Eingang gesichert, das wir für zukünftige Jahre nicht planen und durch modernere Technologien ersetzen werden. (Keine Hornissen wurden verletzt – wir ließen sie in Ruhe ihr Leben zu Ende leben. 🐝) Danke. ⚡",
        "Frisches Bio-Gemüse, ausgezeichnete Trauben, Hopfen. Insgesamt ist das Gras hier grüner und dank der Maulwürfe sieht man schöne Schwarzerde. :-D 🥬🍇🌿",
        "Alles wird durch Stille und Ruhe unterstrichen, dennoch ist es so nah an Domažlice wie von Národní nach Palmovka. 🤫🌳",
        "Nicht zuletzt nette Nachbarn von allen Seiten und die Kneipe Bidlo mit freundlichem Personal und schönem Blick auf den Teich und die Mühle von der anderen Seite. Hier können Sie ein Pilsner trinken und wenn Sie mehr Biere trinken und am nächsten Tag im Studio funktionieren möchten, empfehlen wir einen Ausflug zur Brauerei in Domažlice und halten Sie sich nur an Domažlická desítka, nach der Sie am nächsten Tag problemlos funktionieren können (Von der Braumeisterin empfohlen und mehrmals für Sie getestet, dass es wahr ist :-) 🍺🏡",
        "Morgens können Sie auch in den Teich springen, aber niemand tut es... aber Sie können :-) 🏊‍♂️",
      ],
      faq: "Häufig gestellte Fragen",
      faqItems: [
        {
          q: "Spukt es in der Mühle?",
          a: "Nein ;-)",
        },
        {
          q: "Sind Sie MwSt-pflichtig?",
          a: "Ja, wir sind MwSt-pflichtig. Alle Preise auf der Website verstehen sich inklusive MwSt. Für Geschäftskunden stellen wir Rechnungen mit MwSt aus, für ausländische Kunden regeln wir Reverse Charge gemäß EU-Vorschriften.",
        },
        {
          q: "Kann ich das gesamte Objekt mieten?",
          a: "Auf jeden Fall! Wir bevorzugen exklusive Buchungen für maximale Privatsphäre und kreativen Flow. Der gesamte Komplex kann für mindestens 3 Tage reserviert werden. Der Preis beinhaltet alle Räume, Catering-Optionen und 24/7-Support.",
        },
        {
          q: "Kann ich mein eigenes Team mitbringen oder alleine kommen?",
          a: "Beides ist in Ordnung! Für Solo-Künstler haben wir einen Plethora X5 Looper mit fünf Loops bereit. Mit Team: Unterkunft für bis zu 8 Personen, mehrere Arbeitsräume.",
        },
        {
          q: "Welche Genres kann ich hier aufnehmen?",
          a: "Alle Genres willkommen! Rock/Metal - authentischer Röhrenverstärker-Sound, Electronic - präzise digitale Verarbeitung, Acoustic/Folk - natürliche Raumakustik, Hip-Hop/Rap - präzises Monitoring, Classical/Jazz - geräumige Aufnahmebereiche.",
        },
        {
          q: "Wie komme ich zu Ihnen?",
          a: "Mit dem Auto: direkter Zugang, privater Parkplatz, Tesla-Ladestation. Mit dem Zug: 10 Min. zu Fuß vom Bahnhof Trhanov. Mit dem Flugzeug: 1h 45min vom Flughafen Prag, 2h vom Flughafen München, Abholservice verfügbar.",
        },
        {
          q: "Haben Sie Catering oder muss ich das Essen selbst organisieren?",
          a: "Flexible Verpflegungsoptionen: Hauseigenes Catering mit lokalen Zutaten, Pizzaofen für gemeinsame Abendessen (bis zu 8 Pizzen), voll ausgestattete Küche für Selbstversorgung, Lieferung von lokalen Restaurants aus Domažlice.",
        },
        {
          q: "Sprechen Sie Englisch/Deutsch?",
          a: "Mehrsprachiges Team: Tschechisch - Muttersprachler, Englisch - fließend (Jindřích, Andrea, Tech-Team), Deutsch - Konversationsniveau (regionaler Vorteil), Übersetzungsdienste für Verträge.",
        },
      ],
      historyTimeline: [
        {
          year: "1653 - Gründung",
          desc: "Anlage von Teichen und Bau eines Hochofens und Hammerwerks durch Lamingen",
        },
        {
          year: "1810 - Umbau zur Mühle",
          desc: "Mühle mit wasserbetriebener Sägemühle",
        },
        {
          year: "1990 - Sägewerk",
          desc: "Am 24. November 1990 als Teil der Gemeinde Trhanov im Bezirk Domažlice gegründet",
        },
        {
          year: "2024 - Neubeginn",
          desc: "Umwandlung in ein Premium-Kreativ-Retreat-Studio",
        },
      ],
      accommodationRooms: "Zimmer (bis zu 8 Gäste)",
      masterSuite: "Master Suite",
      masterSuiteDesc: "Terrasse mit Blick auf den Teich, Vintage-Möbel, eigenes Bad",
      fourRooms: "4 Zimmer",
      fourRoomsDesc: "Jedes Zimmer mit einzigartigem Charakter, modernem Komfort, inspirierendem Design",
      commonSpaces: "Gemeinschaftsräume",
      commonSpacesItems: [
        "Esszimmer für 8 Personen",
        "Voll ausgestattete Küche",
        "Kleine Bibliothek",
        "Heimkino",
        "Wintergarten 63m²",
      ],
      finnishSauna: "Finnische Sauna",
      finnishSaunaItems: ["Finnische Sauna", "Tennisplätze, Schwimmbad (2,2 km)"],
      parkOutdoor: "Park & Outdoor (6527m²)",
      parkOutdoorItems: [
        "Zwei lebendige Bäche",
        "Ausgewachsene Bäume",
        "Mehrere Terrassen",
        "BBQ & Pizzaofen (8 Pizzen)",
        "Spazierwege",
        "Privater Parkplatz + Tesla-Ladestation",
      ],
      catering: "Catering & Verpflegung",
      cateringItems: [
        { title: "In-house Catering", desc: "mit lokalen Zutaten" },
        { title: "Pizzaofen", desc: "für Gemeinschaftsessen (bis zu 8 Pizzen)" },
        { title: "Voll ausgestattete Küche", desc: "für Selbstversorgung" },
        { title: "Lokale Restaurant-Lieferung", desc: "aus Domažlice" },
      ],
    },
  },
}

export default function MlynNaPilePage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [currentSection, setCurrentSection] = useState("mlyn")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState<"cs" | "en" | "de">("cs")
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [currentVideoUrl, setCurrentVideoUrl] = useState(
    "https://www.youtube.com/embed/Q6fS_hCaufA?autoplay=1&mute=1&loop=1&playlist=Q6fS_hCaufA&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1",
  )
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [nextVideoUrl, setNextVideoUrl] = useState("")
  const playerRef = useRef<any>(null)

  const [mlynScrollProgress, setMlynScrollProgress] = useState(0)
  const mlynSectionRef = useRef<HTMLDivElement>(null)

  const [onasScrollProgress, setOnasScrollProgress] = useState(0)
  const onasSectionRef = useRef<HTMLDivElement>(null)

  const [scrolled, setScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false) // Added for mobile menu toggle

  const t = translations[language]

  const [showEndMessage, setShowEndMessage] = React.useState(false)

  const darkModeTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      console.log("[v0] YouTube IFrame API ready")
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Check scroll position on any scrollable element
      const mlynSection = mlynSectionRef.current
      const onasSection = onasSectionRef.current

      let isScrolled = false

      if (mlynSection && mlynSection.scrollTop > 50) {
        isScrolled = true
      }
      if (onasSection && onasSection.scrollTop > 50) {
        isScrolled = true
      }

      setScrolled(isScrolled)
    }

    const mlynSection = mlynSectionRef.current
    const onasSection = onasSectionRef.current

    if (mlynSection) {
      mlynSection.addEventListener("scroll", handleScroll)
    }
    if (onasSection) {
      onasSection.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (mlynSection) {
        mlynSection.removeEventListener("scroll", handleScroll)
      }
      if (onasSection) {
        onasSection.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

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
    if (darkModeTimerRef.current) {
      clearTimeout(darkModeTimerRef.current)
      darkModeTimerRef.current = null
    }

    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)

    let newVideoId = ""
    if (newDarkMode) {
      newVideoId = "yl1CN7_Y73s"
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
    const newUrl = `https://www.youtube.com/embed/${newVideoId}?autoplay=1&mute=1&loop=1&playlist=${newVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`
    setNextVideoUrl(newUrl)

    setTimeout(() => {
      setCurrentVideoUrl(newUrl)
      setIsTransitioning(false)
      setNextVideoUrl("")
      setIsVideoPlaying(true)
    }, 1000)
  }

  const handleSectionChange = (section: string) => {
    console.log("[v0] Changing section to:", section, "dark mode:", isDarkMode)

    if (darkModeTimerRef.current) {
      clearTimeout(darkModeTimerRef.current)
      darkModeTimerRef.current = null
    }

    setCurrentSection(section)
    setShowMobileMenu(false) // Close mobile menu on section change

    if (section === "spoluprace") {
      const element = document.getElementById("collaboration") // Changed ID to match the actual ID used later
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      return
    }
    // </CHANGE>

    // Scroll to top for all other sections
    window.scrollTo({ top: 0, behavior: "smooth" })

    let newVideoId = ""
    if (isDarkMode) {
      newVideoId = "yl1CN7_Y73s"
    } else {
      if (section === "mlyn") {
        newVideoId = "HQUoxExYlEM"
      } else if (section === "about") {
        newVideoId = "qcbDEWXmPdE"
      } else if (section === "contact") {
        newVideoId = "Js0nD8lUKH8"
      } else {
        // For uvod, home, equipment, lokalita - use default video
        newVideoId = "Q6fS_hCaufA"
      }
    }

    console.log("[v0] Switching to video:", newVideoId)

    setIsTransitioning(true)
    const newUrl = `https://www.youtube.com/embed/${newVideoId}?autoplay=1&mute=1&loop=1&playlist=${newVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`
    setNextVideoUrl(newUrl)

    setTimeout(() => {
      setCurrentVideoUrl(newUrl)
      setIsTransitioning(false)
      setNextVideoUrl("")
      setIsVideoPlaying(true)
    }, 1000)
  }

  useEffect(() => {
    // Clear any existing timer
    if (darkModeTimerRef.current) {
      clearTimeout(darkModeTimerRef.current)
      darkModeTimerRef.current = null
    }

    // Only auto-switch if currently in light mode
    if (!isDarkMode) {
      if (currentSection === "home") {
        // For photos: switch to dark mode after 10 seconds
        console.log("[v0] Starting 10s timer for photo dark mode switch")
        darkModeTimerRef.current = setTimeout(() => {
          console.log("[v0] Auto-switching to dark mode (photo)")
          setIsDarkMode(true)
          const newVideoId = "yl1CN7_Y73s"
          setIsTransitioning(true)
          const newUrl = `https://www.youtube.com/embed/${newVideoId}?autoplay=1&mute=1&loop=1&playlist=${newVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`
          setNextVideoUrl(newUrl)
          setTimeout(() => {
            setCurrentVideoUrl(newUrl)
            setIsTransitioning(false)
            setNextVideoUrl("")
            setIsVideoPlaying(true)
          }, 1000)
        }, 10000)
      } else {
        // For videos: switch to dark mode after 45 seconds (estimated video length)
        console.log("[v0] Starting 45s timer for video dark mode switch")
        darkModeTimerRef.current = setTimeout(() => {
          console.log("[v0] Auto-switching to dark mode (video)")
          setIsDarkMode(true)
          const newVideoId = "yl1CN7_Y73s"
          setIsTransitioning(true)
          const newUrl = `https://www.youtube.com/embed/${newVideoId}?autoplay=1&mute=1&loop=1&playlist=${newVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`
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

    // Cleanup timer on unmount or when dependencies change
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
        const scrollHeight = mlynSectionRef.current.scrollHeight - mlynSectionRef.current.clientHeight
        const progress = Math.min(scrollTop / scrollHeight, 1)
        setMlynScrollProgress(progress)
      }

      if (currentSection === "about" && onasSectionRef.current) {
        const scrollTop = onasSectionRef.current.scrollTop
        const scrollHeight = onasSectionRef.current.scrollHeight - onasSectionRef.current.clientHeight
        const progress = Math.min(scrollTop / scrollHeight, 1)
        setOnasScrollProgress(progress)
      }
    }

    const mlynSection = mlynSectionRef.current
    const onasSection = onasSectionRef.current

    if (mlynSection) {
      mlynSection.addEventListener("scroll", handleScroll)
    }
    if (onasSection) {
      onasSection.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (mlynSection) mlynSection.removeEventListener("scroll", handleScroll)
      if (onasSection) onasSection.removeEventListener("scroll", handleScroll)
    }
  }, [currentSection])

  React.useEffect(() => {
    const mlynSection = mlynSectionRef.current
    if (!mlynSection) return

    const handleScroll = () => {
      const scrollTop = mlynSection.scrollTop
      const scrollHeight = mlynSection.scrollHeight
      const clientHeight = mlynSection.clientHeight
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight)

      // Show message when scrolled to 90% or more
      if (scrollPercentage >= 0.9 && !showEndMessage) {
        setShowEndMessage(true)
        // Hide after 7 seconds
        setTimeout(() => {
          setShowEndMessage(false)
        }, 7000)
      }
    }

    mlynSection.addEventListener("scroll", handleScroll)
    return () => mlynSection.removeEventListener("scroll", handleScroll)
  }, [showEndMessage])

  const [showPresentationMessage, setShowPresentationMessage] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPresentationMessage(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0">
        {currentSection !== "home" && (
          <>
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cpath d='M200 100 L250 80 L300 90 L350 85 L400 95 L450 100 L500 110 L550 120 L600 130 L650 140 L700 150 L750 160 L780 180 L790 200 L785 220 L780 240 L770 260 L760 280 L750 300 L740 320 L730 340 L720 360 L710 380 L700 400 L690 420 L680 440 L670 460 L660 480 L650 500 L640 520 L630 540 L620 560 L610 580 L600 590 L580 595 L560 590 L540 585 L520 580 L500 575 L480 570 L460 565 L440 560 L420 555 L400 550 L380 545 L360 540 L340 535 L320 530 L300 525 L280 520 L260 515 L240 510 L220 505 L200 500 L180 495 L160 490 L140 485 L120 480 L100 475 L80 470 L60 465 L40 460 L20 455 L10 450 L5 440 L10 430 L15 420 L20 410 L25 400 L30 390 L35 380 L40 370 L45 360 L50 350 L55 340 L60 330 L65 320 L70 310 L75 300 L80 290 L85 280 L90 270 L95 260 L100 250 L105 240 L110 230 L115 220 L120 210 L125 200 L130 190 L135 180 L140 170 L145 160 L150 150 L155 140 L160 130 L165 120 L170 110 L175 100 Z' fill='%23ffffff' stroke='%23ffffff' strokeWidth='1'/%3E%3Ccircle cx='400' cy='300' r='3' fill='%23ff6b35'/%3E%3C/svg%3E")`,
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
            {isTransitioning && nextVideoUrl && (
              <iframe
                className="absolute pointer-events-none transition-opacity duration-1000 opacity-100"
                style={{
                  width: "177.77vh",
                  height: "100vh",
                  minWidth: "100vw",
                  minHeight: "56.25vw",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                src={nextVideoUrl}
                title="Mlýn na Pile Background Video Transition"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
            <div className="absolute inset-0 bg-black/40" />
          </>
        )}

        {currentSection === "home" && (
          <div
            className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: isDarkMode
                ? `url("/images/twilight-lake.jpeg")`
                : `url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/847BBD26-F10F-443A-8DB7-94666E95A9A5-He8aS0Zg0mCu8gKsmK5F83l98BUjw0.jpeg")`,
              zIndex: 0,
            }}
          />
        )}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 p-6 transition-all duration-300 bg-transparent">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Main menu - centered on desktop, full width on mobile */}
            <div className="flex-1 flex justify-center">
              <div className="flex flex-wrap justify-center space-x-3 md:space-x-6 text-white/90 px-3 md:px-6 py-3 rounded-lg text-sm md:text-base">
                <button onClick={() => handleSectionChange("mlyn")} className="hover:text-white transition-colors">
                  {t.nav.mlyn}
                </button>
                <button onClick={() => handleSectionChange("home")} className="hover:text-white transition-colors">
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

            <div className="hidden md:flex gap-2 justify-end">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="bg-white/5 backdrop-blur-sm border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <Globe className="h-4 w-4" />
                </Button>
                {showLanguageMenu && (
                  <div className="absolute top-full mt-1 right-0 bg-black/80 backdrop-blur-sm rounded-lg p-1 flex flex-col gap-1 min-w-[60px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLanguage("cs")
                        setShowLanguageMenu(false)
                      }}
                      className={`text-xs justify-start ${language === "cs" ? "bg-white/20 text-white" : "text-white/60"}`}
                    >
                      CZ
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLanguage("en")
                        setShowLanguageMenu(false)
                      }}
                      className={`text-xs justify-start ${language === "en" ? "bg-white/20 text-white" : "text-white/60"}`}
                    >
                      EN
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLanguage("de")
                        setShowLanguageMenu(false)
                      }}
                      className={`text-xs justify-start ${language === "de" ? "bg-white/20 text-white" : "text-white/60"}`}
                    >
                      DE
                    </Button>
                  </div>
                )}
              </div>
              {/* Updated button styling and logic - shows current mode with clear visual feedback */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className={`backdrop-blur-sm border-white/20 transition-all ${
                  isDarkMode
                    ? "bg-blue-500/30 text-white border-blue-400/50 hover:bg-blue-500/40"
                    : "bg-amber-500/30 text-white border-amber-400/50 hover:bg-amber-500/40"
                }`}
                title={
                  isDarkMode
                    ? "Noční režim zapnutý - klikněte pro denní režim"
                    : "Denní režim zapnutý - klikněte pro noční režim"
                }
              >
                {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              {/* </CHANGE> */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVideo}
                className="bg-white/5 backdrop-blur-sm border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
              >
                {isVideoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
            {/* </CHANGE> */}
          </div>
        </nav>

        <div
          className="fixed top-0 left-0 right-0 h-32 pointer-events-none z-40"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          }}
        />
        {/* </CHANGE> */}

        {/* Removed pt-32 from here and applied it to the content sections */}
        {showPresentationMessage && (
          <div className="absolute left-1/2 -translate-x-1/2 top-20 text-white/90 text-sm animate-fade-in">
            {t.mlyn.endMessage}
          </div>
        )}

        {showEndMessage && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white/90 text-lg font-light animate-in fade-in duration-500 z-50 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
            {t.mlyn.endMessage}
          </div>
        )}

        <div className="">
          {" "}
          {/* Removed pt-32 */}
          {currentSection === "mlyn" ? (
            <div
              ref={mlynSectionRef}
              className="flex-1 pt-32" // Applied pt-32 here for section content spacing
            >
              <div className="px-6 py-12">
                <div className="text-center max-w-5xl mx-auto mb-16">
                  <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 text-balance">{t.mlyn.title}</h1>
                  <p className="text-2xl md:text-3xl text-white/90 font-light mb-4">{t.mlyn.subtitle}</p>
                  <p className="text-2xl md:text-3xl text-white/90 font-light mb-4">{t.mlyn.tagline}</p>
                  <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
                    {t.mlyn.description}
                  </p>
                  <p className="text-sm text-white/50 animate-pulse">{t.mlyn.scrollHint}</p>
                </div>

                <div className="max-w-6xl mx-auto mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">{t.mlyn.threeSpaces}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card
                      className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                      onClick={() => handleSectionChange("equipment")}
                    >
                      <CardContent className="p-6 text-center">
                        <Guitar className="h-8 w-8 text-secondary mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">{t.mlyn.vintageInstruments}</h3>
                        <p className="text-white/80 text-sm">{t.mlyn.vintageDesc}</p>
                      </CardContent>
                    </Card>

                    <Card
                      className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                      onClick={() => handleSectionChange("about")}
                    >
                      <CardContent className="p-6 text-center">
                        <Home className="h-8 w-8 text-secondary mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">{t.mlyn.accommodation}</h3>
                        <p className="text-white/80 text-sm">{t.mlyn.accommodationDesc}</p>
                      </CardContent>
                    </Card>

                    <Card
                      className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                      onClick={() => handleSectionChange("lokalita")}
                    >
                      <CardContent className="p-6 text-center">
                        <MapPin className="h-8 w-8 text-secondary mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">{t.mlyn.locationCard}</h3>
                        <p className="text-white/80 text-sm">{t.mlyn.locationDesc}</p>
                      </CardContent>
                    </Card>

                    <Card
                      className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                      onClick={() => handleSectionChange("equipment")}
                    >
                      <CardContent className="p-6 text-center">
                        <Headphones className="h-8 w-8 text-secondary mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">{t.mlyn.studios}</h3>
                        <p className="text-white/80 text-sm whitespace-pre-line">{t.mlyn.studiosDesc}</p>
                      </CardContent>
                    </Card>

                    <Card
                      className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                      onClick={() => handleSectionChange("equipment")}
                    >
                      <CardContent className="p-6 text-center">
                        <Mic className="h-8 w-8 text-secondary mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">{t.mlyn.modernTech}</h3>
                        <p className="text-white/80 text-sm">{t.mlyn.modernTechDesc}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6 text-center">
                        <Calendar className="h-8 w-8 text-secondary mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">{t.mlyn.benefits}</h3>
                        <p className="text-white/80 text-sm">{t.mlyn.benefitsDesc}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="text-center py-24">
                  <p className="text-3xl md:text-5xl font-light text-white/90 mb-4">{t.mlyn.endMessage}</p>
                  <p className="text-sm text-white/50">{t.mlyn.menuHint}</p>
                </div>
              </div>

              <div className="h-screen" />
            </div>
          ) : currentSection === "home" ? (
            // Removed uvod section, only keeping home (Studio) section
            <div className="flex-1 overflow-y-auto pt-32">
              {" "}
              {/* Applied pt-32 here */}
              {/* Hero Section */}
              <div className="flex items-center justify-center px-6 py-16 text-white">
                <div className="text-center max-w-5xl">
                  <h1 className="text-5xl md:text-7xl font-bold mb-4 text-balance text-white drop-shadow-lg">
                    {t.studio.title}
                  </h1>
                  <p className="text-xl md:text-2xl font-light mb-2 text-white drop-shadow-lg">{t.studio.subtitle}</p>
                  <p className="text-base md:text-lg text-white/95 max-w-3xl mx-auto drop-shadow-lg">
                    {t.studio.description}
                  </p>
                </div>
              </div>
              {/* Hlavní Studio Section */}
              <div className="flex items-center px-6 py-12 bg-black/60 text-white">
                <div className="max-w-7xl mx-auto w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                        {t.studio.mainStudio}
                      </h2>
                      <p className="text-2xl font-light text-white/95 drop-shadow-lg">{t.studio.mainStudioSize}</p>
                      <p className="text-lg leading-relaxed text-white/90 drop-shadow-md">{t.studio.mainStudioDesc}</p>
                      <div className="space-y-2 text-sm text-white/90">
                        <h3 className="text-xl font-semibold text-white drop-shadow-lg">{t.studio.equipment}</h3>
                        <ul className="space-y-1">
                          <li>• Vintage Fender Custom Shop kytary</li>
                          <li>• Gibson Les Paul Studio (1993) (with Graph Tech Bridge Saddles)</li>
                          <li>• Gibson Explorer</li>
                          <li>• Marshall AFD 100, Mesa Boogie</li>
                          <li>• Rozsáhlá kolekce efektů</li>
                          <li>• Mapex Saturn bicí s K-Zildjian činely</li>
                        </ul>
                      </div>
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group">
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/YWnYQDGHeLw?autoplay=1&mute=1&loop=1&playlist=YWnYQDGHeLw&controls=0&showinfo=0&rel=0&modestbranding=1"
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
                        src="https://www.youtube.com/embed/gTqXu9xU_7k?autoplay=1&mute=1&loop=1&playlist=gTqXu9xU_7k&controls=0&showinfo=0&rel=0&modestbranding=1"
                        title="Control Room"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    </div>
                    <div className="space-y-4 order-1 lg:order-2">
                      <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                        {t.studio.controlRoom}
                      </h2>
                      <p className="text-2xl font-light text-white/95 drop-shadow-lg">{t.studio.controlRoomSize}</p>
                      <p className="text-lg leading-relaxed text-white/90 drop-shadow-md">{t.studio.controlRoomDesc}</p>
                      <div className="space-y-2 text-sm text-white/90">
                        <h3 className="text-xl font-semibold text-white drop-shadow-lg">{t.studio.technology}</h3>
                        <ul className="space-y-1">
                          <li>• MAC + Apple Pro Display XDR 6K monitor</li>
                          <li>• Universal Audio Apollo Interface</li>
                          <li>• 76 UAD pluginů (kompletní kolekce)</li>
                          <li>• Logic Pro X + UA LUNA</li>
                          <li>• 4K projektor pro screening</li>
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
                      <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                        {t.studio.millstoneStudio}
                      </h2>
                      <p className="text-2xl font-light text-white/95 drop-shadow-lg">{t.studio.millstoneSize}</p>
                      <p className="text-lg leading-relaxed text-white/90 drop-shadow-md">{t.studio.millstoneDesc}</p>
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group">
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/sc0bCt6G9dM?autoplay=1&mute=1&loop=1&playlist=sc0bCt6G9dM&controls=0&showinfo=0&rel=0&modestbranding=1"
                        title="Millstone Studio"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* CTA Section */}
              <div className="flex items-center justify-center px-6 py-12 bg-black/70 text-white">
                <div className="text-center max-w-3xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">{t.studio.ctaTitle}</h2>
                  <p className="text-lg mb-6 text-white/90 drop-shadow-md">{t.studio.ctaDesc}</p>
                  <Button
                    size="lg"
                    onClick={() => handleSectionChange("contact")}
                    className="px-8 py-4 text-base bg-white text-black hover:bg-gray-200"
                  >
                    {t.studio.ctaButton}
                  </Button>
                </div>
              </div>
            </div>
          ) : currentSection === "lokalita" ? (
            <div className="flex-1 px-6 py-12 overflow-y-auto pt-32">
              {" "}
              {/* Applied pt-32 here */}
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">{t.location.title}</h1>
                  <p className="text-xl md:text-2xl text-white/90 font-light">{t.location.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <MapPin className="h-8 w-8 text-secondary mx-auto mb-4" />
                      <h3 className="text-white font-semibold mb-4 text-center text-xl">{t.location.nature}</h3>
                      <div className="text-white/80 text-sm space-y-4 leading-relaxed">
                        <p>{t.location.naturePara1}</p>
                        <p>{t.location.naturePara2}</p>
                        <p>{t.location.naturePara3}</p>
                        <p className="italic border-l-2 border-secondary pl-4 mt-4">"{t.location.quote}"</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-white mb-6">{t.location.transport}</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <MapPin className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-2">{t.location.byCar}</h4>
                            <ul className="space-y-1 text-sm text-white">
                              <li>• 10 min do centra Domažlic</li>
                              <li>• 10 min na německé hranice</li>
                              <li>• Přímý přístup, private parking</li>
                              <li>• Tesla charging station</li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <MapPin className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-2">{t.location.byTrain}</h4>
                            <ul className="space-y-1 text-sm text-white">
                              <li>• Vlaková zastávka přímo na Pile</li>
                              <li>• 10 min walk z Trhanov station</li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <MapPin className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-2">{t.location.byPlane}</h4>
                            <ul className="space-y-1 text-sm text-white">
                              <li>• 1h 45min z Prague Airport</li>
                              <li>• 2h z Munich Airport</li>
                              <li>• Pick-up service available</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mb-16">
                  <h2 className="text-4xl font-bold text-white mb-8 text-center">{t.location.surroundings}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Domažlice */}
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <MapPin className="h-6 w-6 text-secondary" />
                          <h3 className="text-2xl font-bold text-white">{t.location.domazliceTitle}</h3>
                        </div>
                        <ul className="text-white/80 space-y-2 text-sm">
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
                          <MapPin className="h-6 w-6 text-secondary" />
                          <h3 className="text-2xl font-bold text-white">{t.location.horsovskytynTitle}</h3>
                        </div>
                        <ul className="text-white/80 space-y-2 text-sm">
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
                          <MapPin className="h-6 w-6 text-secondary" />
                          <h3 className="text-2xl font-bold text-white">{t.location.babylonTitle}</h3>
                        </div>
                        <ul className="text-white/80 space-y-2 text-sm">
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
                          <MapPin className="h-6 w-6 text-secondary" />
                          <h3 className="text-2xl font-bold text-white">{t.location.germanyTitle}</h3>
                        </div>
                        <ul className="text-white/80 space-y-2 text-sm">
                          {t.location.germanyItems.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mb-16">
                  <h2 className="text-4xl font-bold text-white mb-8 text-center">{t.location.events}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Domažlice Events */}
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Calendar className="h-6 w-6 text-secondary" />
                          <h3 className="text-2xl font-bold text-white">Domažlice</h3>
                        </div>
                        <ul className="text-white/80 space-y-3 text-sm">
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
                          <Calendar className="h-6 w-6 text-secondary" />
                          <h3 className="text-2xl font-bold text-white">Horšovský Týn</h3>
                        </div>
                        <ul className="text-white/80 space-y-3 text-sm">
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
                          <Calendar className="h-6 w-6 text-secondary" />
                          <h3 className="text-2xl font-bold text-white">Babylon</h3>
                        </div>
                        <ul className="text-white/80 space-y-3 text-sm">
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
                          <Calendar className="h-6 w-6 text-secondary" />
                          <h3 className="text-2xl font-bold text-white">{t.location.chamTitle}</h3>
                        </div>
                        <div className="text-white/80 space-y-3 text-sm">
                          <p>
                            <a
                              href="https://la-cham.de/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-secondary hover:text-secondary/80 underline font-semibold"
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
              {" "}
              {/* Applied pt-32 here */}
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-balance">{t.equipment.title}</h1>
                  <p className="text-xl md:text-2xl text-white/90 font-light">{t.equipment.subtitle}</p>
                  <p className="text-sm md:text-base text-white/80 mt-4 max-w-4xl mx-auto leading-relaxed">
                    {t.equipment.collectionNote}{" "}
                    <button
                      onClick={() => handleSectionChange("spoluprace")}
                      className="text-secondary hover:text-secondary/80 underline"
                    >
                      {t.equipment.collaborationLink}
                    </button>
                    .
                  </p>
                  <p className="text-sm md:text-base text-white/80 mt-2 max-w-4xl mx-auto leading-relaxed">
                    {t.equipment.detailsNote}
                  </p>
                </div>

                {/* Vintage Nástroje - FIRST */}
                <div className="mb-8">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Guitar className="h-6 w-6 text-secondary" />
                        {t.equipment.vintageInstruments}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">{t.equipment.guitars}</h4>
                          <ul className="text-white/80 text-sm space-y-1.5">
                            <li className="cursor-pointer hover:text-secondary transition-colors">
                              • Fender 1973 Telecaster Deluxe
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
                          <h4 className="text-lg font-semibold text-white mb-3">{t.equipment.basses}</h4>
                          <ul className="text-white/80 text-sm space-y-1.5">
                            <li>• Fender Precision (1993)</li>
                            <li>• Squier short scale bass</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Kytara a Basa (Zesilovače a Boxy) - SECOND */}
                <div className="mb-8">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-4">{t.equipment.ampsAndCabs}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">{t.equipment.amps}</h4>
                          <ul className="text-white/80 text-sm space-y-1.5">
                            <li>• Fender 64 Custom Deluxe Reverb</li>
                            <li>• Mesa Boogie Rect-o-verb (upravená verze od Antonín Salva)</li>
                            <li>• Mesa Boogie Dual Rectifier®Head, 3 Channels / 8 Modes, 100W</li>
                            <li>• Marshall AFD 100</li>
                            <li>• AMPEG V-4B Bass Head</li>
                            <li>• Roland JC-22 (2x)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">{t.equipment.cabs}</h4>
                          <ul className="text-white/80 text-sm space-y-1.5">
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
                      <h3 className="text-2xl font-bold text-white mb-4">{t.equipment.effects}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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

                {/* Mikrofony a Bicí */}
                <div className="mb-8">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Mic className="h-6 w-6 text-secondary" />
                            {t.equipment.mics}
                          </h3>
                          <ul className="text-white/80 text-sm space-y-1.5">
                            <li>• Sennheiser e 906</li>
                            <li>• Shure Beta 58</li>
                            <li>• Shure SM 7 B</li>
                            <li>• 2x SHURE SM57</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-4">{t.equipment.drums}</h3>
                          <ul className="text-white/80 text-sm space-y-1.5">
                            <li>• Mapex Saturn</li>
                            <li>• K-Zildjian činely</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Kabely a Stojany */}
                <div className="mb-8">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-4">{t.equipment.cables}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
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
                          <p className="text-white/90">K&M stojany</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Moderní technologie - THIRD */}
                <div className="mb-8">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-4">{t.equipment.modernTech}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Universal Audio</h4>
                          <ul className="text-white/80 text-sm space-y-1.5">
                            <li>• Universal Audio Apollo Interface</li>
                            <li>• UAD-2 Satellite (extra DSP power)</li>
                            <li>• 76 UAD pluginů (kompletní kolekce)</li>
                            <li>• Unison Technology</li>
                            <li>• Near-zero latency tracking</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">DAW & Monitoring</h4>
                          <ul className="text-white/80 text-sm space-y-1.5">
                            <li>• Logic Pro X</li>
                            <li>• UA LUNA</li>
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
                      <h3 className="text-2xl font-bold text-white mb-4">VIDEO PRODUCTION</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Hardware</h4>
                          <ul className="text-white/80 text-sm space-y-1.5">
                            <li>• Apple Pro XDR 6K monitor pro color-accurate editing</li>
                            <li>• Professional video cameras pro session dokumentaci</li>
                            <li>• DJI Gimbal stabilizátor pro smooth camera movements</li>
                            <li>• 4K projektor pro screening a presentations</li>
                            <li>• Lighting equipment pro professional video shoots</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Software</h4>
                          <ul className="text-white/80 text-sm space-y-1.5">
                            <li>• Final Cut Pro X</li>
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
                      <h3 className="text-2xl font-bold text-white mb-4">{t.equipment.uaPlugins}</h3>

                      {/* Microphone Preamps */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                          <Mic className="h-5 w-5 text-secondary" />
                          Microphone Preamps (7)
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
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
                        <h4 className="text-lg font-semibold text-white mb-2">Kompresory (24)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-white/80 text-sm mb-2">Teletronix (6)</p>
                            <div className="space-y-1 text-xs">
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
                            <p className="text-white/80 text-sm mb-2">UA 1176 (6)</p>
                            <div className="space-y-1 text-xs">
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
                            <p className="text-white/80 text-sm mb-2">Další (12)</p>
                            <div className="space-y-1 text-xs">
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
                        <h4 className="text-lg font-semibold text-white mb-2">Ekvalizéry (9)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                          {[
                            "Pultec EQP-1A Legacy",
                            "Pultec EQP-1A Passive",
                            "Pultec HLF-3C",
                            "Pultec MEQ-5",
                            "Pultec Pro Legacy",
                            "A-Designs Hammer EQ",
                            "Cambridge EQ",
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
                        <h4 className="text-lg font-semibold text-white mb-2">Virtuální Nástroje (6)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
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
                        <h4 className="text-lg font-semibold text-white mb-2">Speciální Procesory (11)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
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
                        <h4 className="text-lg font-semibold text-white mb-2">Delay a Modulace (7)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
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
                        <h4 className="text-lg font-semibold text-white mb-2">Reverby (4)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
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

                {/* Workflow Recommendations */}
                <div className="mb-8">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-4">{t.equipment.workflow}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Tracking Chain</h4>
                          <ul className="text-white/80 text-sm space-y-1">
                            <li>1. Neve 1073 / UA 610</li>
                            <li>2. LA-2A / 1176</li>
                            <li>3. Pultec EQP-1A</li>
                            <li>4. Oxide / Studer</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Mixing Chain</h4>
                          <ul className="text-white/80 text-sm space-y-1">
                            <li>1. Cambridge / Helios EQ</li>
                            <li>2. Distressor / dbx 160</li>
                            <li>3. Verve Analog</li>
                            <li>4. Lexicon 224 / Pure Plate</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Mastering Chain</h4>
                          <ul className="text-white/80 text-sm space-y-1">
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
                      <h3 className="text-2xl font-bold text-white mb-4">{t.equipment.infrastructure}</h3>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Infrastruktura</h4>
                        <ul className="text-white/80 text-sm space-y-2">
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
            <div className="flex-1 px-6 py-12 pt-32">
              {" "}
              {/* Applied pt-32 here */}
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">{t.contact.title}</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-white mb-6">{t.contact.info}</h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">Ing. Jindřich Traxmandl</h4>
                        </div>
                        <div className="flex items-start space-x-4">
                          <MapPin className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">{t.contact.address}</h4>
                            <p className="text-white/80">
                              Pila 100 - Mlýn
                              <br />
                              Trhanov 34401
                              <br />
                              Česká republika
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Phone className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white mb-1">{t.contact.phone}</h4>
                            <p className="text-white/80">+420 724 050 093</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/20">
                          <BusinessCardDownload />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-white mb-6">{t.contact.availability}</h3>
                      <div className="space-y-4">
                        <ul className="text-white/80 text-sm space-y-1">
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
            // Removed all opacity animations and min-h-screen classes for simple scrollable layout
            <div ref={onasSectionRef} className="flex-1 overflow-y-auto scroll-smooth pt-32">
              {" "}
              {/* Applied pt-32 here */}
              <div className="px-6 py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                  {/* Section 1: Hero + History */}
                  <div>
                    <div className="text-center mb-12">
                      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">{t.about.title}</h1>
                      <p className="text-xl md:text-2xl text-white/90 font-light">{t.about.subtitle}</p>
                      <p className="text-lg text-white/80 mt-4">{t.about.tagline}</p>
                    </div>

                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">{t.about.history}</h3>
                        <div className="space-y-4 text-white/80">
                          {t.about.historyTimeline.map((item, index) => (
                            <div key={index} className="border-l-2 border-secondary pl-4">
                              <p className="font-semibold text-white">{item.year}</p>
                              <p className="text-sm">{item.desc}</p>
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
                        <h3 className="text-3xl font-bold text-white mb-8 text-center">{t.about.accommodation}</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                          <div>
                            <h4 className="text-xl font-bold text-white mb-4">{t.about.accommodationRooms}</h4>
                            <div className="space-y-4">
                              <div className="bg-white/5 p-4 rounded-lg">
                                <h5 className="font-semibold text-white mb-2">{t.about.masterSuite}</h5>
                                <p className="text-white/80 text-sm">{t.about.masterSuiteDesc}</p>
                              </div>
                              <div className="bg-white/5 p-4 rounded-lg">
                                <h5 className="font-semibold text-white mb-2">{t.about.fourRooms}</h5>
                                <p className="text-white/80 text-sm">{t.about.fourRoomsDesc}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xl font-bold text-white mb-4">{t.about.commonSpaces}</h4>
                            <ul className="text-white/80 space-y-2">
                              {t.about.commonSpacesItems.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                          <div>
                            <h4 className="text-xl font-bold text-white mb-4">{t.about.finnishSauna}</h4>
                            <ul className="text-white/80 space-y-2">
                              {t.about.finnishSaunaItems.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-xl font-bold text-white mb-4">{t.about.parkOutdoor}</h4>
                            <ul className="text-white/80 space-y-2">
                              {t.about.parkOutdoorItems.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xl font-bold text-white mb-4">{t.about.catering}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {t.about.cateringItems.map((item, index) => (
                              <div key={index} className="bg-white/5 p-4 rounded-lg">
                                <p className="text-white/80 text-sm">
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
                        <h3 className="text-3xl font-bold text-white mb-8 text-center">{t.about.founders}</h3>

                        <p className="text-white/80 text-center mb-8 leading-relaxed">{t.about.foundersIntro}</p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-xl font-bold text-white mb-2">Jindřich Traxmandl</h4>
                              <div className="space-y-4 text-white/80 leading-relaxed">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: t.about.jindrichDesc.replace(
                                      /Anteater/g,
                                      '<a href="https://www.anteaterofficial.com" target="_blank" rel="noopener noreferrer" class="text-secondary hover:text-secondary/80 underline">Anteater</a>',
                                    ),
                                  }}
                                />
                                <blockquote className="border-l-2 border-secondary pl-4 italic">
                                  "{t.about.jindrichQuote}"
                                </blockquote>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-xl font-bold text-white mb-2">Andrea Kohoutová</h4>
                              <div className="space-y-4 text-white/80 leading-relaxed">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: t.about.andreaDesc.replace(
                                      /Anteater/g,
                                      '<a href="https://www.anteaterofficial.com" target="_blank" rel="noopener noreferrer" class="text-secondary hover:text-secondary/80 underline">Anteater</a>',
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
                  <div id="collaboration" className="py-24">
                    <div className="max-w-4xl mx-auto px-4">
                      <h3 className="text-2xl font-bold text-white mb-6">{t.about.collaboration}</h3>
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
                          <ul className="space-y-1 text-sm">
                            {t.about.collaborationForms.map((form, index) => (
                              <li key={index}>• {form}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/20">
                          <p className="text-sm text-white/80 leading-relaxed">
                            <strong className="text-secondary">{t.equipment.thankYouNote}:</strong>{" "}
                            {t.equipment.noraCollaboration}{" "}
                            <a
                              href="https://open.spotify.com/track/1jzCR4iPOo3bCEo67VsvaW?si=fb770e4a9679489f"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-secondary hover:text-secondary/80 underline font-semibold"
                            >
                              Nora
                            </a>
                            .
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">{t.about.bonuses}</h3>
                        <div className="space-y-3 text-white/80">
                          {t.about.bonusesItems.map((bonus, index) => (
                            <p key={index} className="leading-relaxed">
                              {bonus}
                            </p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section 5: FAQ */}
                  <div>
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">{t.about.faq}</h3>
                        <div className="space-y-3">
                          {t.about.faqItems.map((faq, index) => {
                            // Ghost (haunted), FileText (VAT/business), Home (property rental),
                            // Users (team), Music (genres), Car (transportation),
                            // UtensilsCrossed (catering), Languages (languages)
                            const icons = [Ghost, FileText, Home, Users, Music, Car, UtensilsCrossed, Languages]
                            const IconComponent = icons[index] || Ghost
                            return (
                              <div key={index} className="border-b border-white/10 pb-3">
                                <button
                                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                  className="w-full text-left flex justify-between items-start gap-2 group"
                                >
                                  <div className="flex items-start gap-3">
                                    <IconComponent className="h-5 w-5 text-white/60 flex-shrink-0 mt-0.5" />
                                    <h4 className="font-semibold text-white text-sm group-hover:text-secondary transition-colors">
                                      {faq.q}
                                    </h4>
                                  </div>
                                  <ChevronDown
                                    className={`h-4 w-4 text-white/60 flex-shrink-0 transition-transform ${openFaqIndex === index ? "rotate-180" : ""}`}
                                  />
                                </button>
                                {openFaqIndex === index && (
                                  <p className="text-sm text-white/80 mt-2 ml-8 leading-relaxed">{faq.a}</p>
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
