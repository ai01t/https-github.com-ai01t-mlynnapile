(() => {
const SUPPORTED_LANGS = ["cs", "en", "de"];

const SITE_META = {
  cs: {
    title: "Mlýn na Pile | Retreat Studio",
    description:
      "Kreativní hudební retreat studio v historickém mlýně u Domažlic. Recording, vintage nástroje, technologie a ubytování.",
  },
  en: {
    title: "Mill at Pila | Retreat Studio",
    description:
      "A creative music retreat studio in a historic mill near Domažlice. Recording, vintage instruments, technology and accommodation.",
  },
  de: {
    title: "Mlýn na Pile | Retreat Studio",
    description:
      "Ein kreatives Musik-Retreat-Studio in einer historischen Mühle bei Domažlice. Recording, Vintage-Instrumente, Technik und Unterkunft.",
  },
};

const UI = {
  nav: {
    brand: "Mlýn na Pile",
    items: [
      { id: "place", label: { cs: "Mlýn", en: "Mill", de: "Mühle" } },
      { id: "studio", label: { cs: "Studio", en: "Studio", de: "Studio" } },
      { id: "equipment", label: { cs: "Vybavení", en: "Equipment", de: "Ausstattung" } },
      { id: "residency", label: { cs: "Ubytování", en: "Stay", de: "Unterkunft" } },
      { id: "location", label: { cs: "Lokalita", en: "Location", de: "Lage" } },
      { id: "history", label: { cs: "Historie", en: "History", de: "Geschichte" } },
      { id: "contact", label: { cs: "Kontakt", en: "Contact", de: "Kontakt" } },
    ],
  },
  controls: {
    menu: { cs: "Menu", en: "Menu", de: "Menü" },
    videosPause: { cs: "Pozastavit videa", en: "Pause videos", de: "Videos pausieren" },
    videosPlay: { cs: "Pustit videa", en: "Play videos", de: "Videos abspielen" },
    day: { cs: "Denní atmosféra", en: "Day atmosphere", de: "Tagstimmung" },
    night: { cs: "Noční atmosféra", en: "Night atmosphere", de: "Nachtstimmung" },
    booking: { cs: "Booking", en: "Booking", de: "Booking" },
    close: { cs: "Zavřít", en: "Close", de: "Schließen" },
    back: { cs: "Zpět", en: "Back", de: "Zurück" },
  },
};

const SECTION_ORDER = [
  "hero",
  "place",
  "studio",
  "equipment",
  "location",
  "history",
  "residency",
  "contact",
];

const HERO = {
  badge: { cs: "Retreat Studio", en: "Retreat Studio", de: "Retreat Studio" },
  title: {
    cs: ["Mlýn", "na Pile"],
    en: ["Mill", "at Pila"],
    de: ["Mlýn", "na Pile"],
  },
  note: {
    cs: "Unikátní prostor s historií sahající do 17. století.",
    en: "A unique space with a history dating back to the 17th century.",
    de: "Ein einzigartiger Ort mit Geschichte bis ins 17. Jahrhundert.",
  },
  next: {
    cs: "Pila alias Šnajberk",
    en: "Pila alias Šnajberk",
    de: "Pila alias Šnajberk",
  },
};

const PLACE = {
  label: { cs: "Mlýn", en: "Mill", de: "Mühle" },
  title: { cs: "Pila alias Šnajberk", en: "Pila alias Šnajberk", de: "Pila alias Šnajberk" },
  number: "1653",
  intro: {
    cs: "Historický mlýn a pila u rybníka, dnes proměňované v místo pro soustředěnou hudební a kreativní práci.",
    en: "A historic mill and sawmill by the pond, now becoming a place for focused music and creative work.",
    de: "Eine historische Mühle mit Säge am Teich, heute ein Ort für konzentrierte musikalische und kreative Arbeit.",
  },
  values: [
    {
      cs: "Vintage nástroje — 60s–80s Fender, Gibson, VOX.",
      en: "Vintage instruments — 60s–80s Fender, Gibson, VOX.",
      de: "Vintage-Instrumente — 60er–80er Fender, Gibson, VOX.",
    },
    {
      cs: "Stylové ubytování — 4 pokoje, zimní zahrada 63 m², finská sauna.",
      en: "Stylish accommodation — 4 rooms, 63 m² winter garden, Finnish sauna.",
      de: "Stilvolle Unterkunft — 4 Zimmer, 63 m² Wintergarten, finnische Sauna.",
    },
    {
      cs: "Moderní technologie — Universal Audio Apollo x8p Studio+, 76 UAD pluginů, Logic Pro X, Apple Pro Display XDR 6K.",
      en: "Modern technology — Universal Audio Apollo x8p Studio+, 76 UAD plugins, Logic Pro X, Apple Pro Display XDR 6K.",
      de: "Moderne Technologie — Universal Audio Apollo x8p Studio+, 76 UAD-Plugins, Logic Pro X, Apple Pro Display XDR 6K.",
    },
    {
      cs: "Vlastní zdroj elektrické energie pro zajištění provozu studia.",
      en: "Own power source ensuring uninterrupted studio operation.",
      de: "Eigene Stromquelle für einen unterbrechungsfreien Studiobetrieb.",
    },
    {
      cs: "Zázemí, zabezpečené prostory, výborné snídaně s domácím chlebem z pece.",
      en: "Facilities, secured spaces, and excellent breakfasts with homemade oven-baked bread.",
      de: "Komfort, gesicherte Räume und ausgezeichnetes Frühstück mit hausgebackenem Ofenbrot.",
    },
  ],
  timelineLabel: { cs: "Historická osa", en: "Historical timeline", de: "Historische Zeitleiste" },
  timeline: [
    {
      year: "1653",
      cs: "Založení rybníků, vysoké pece a hamru.",
      en: "Founding of ponds, blast furnace and hammer.",
      de: "Gründung der Teiche, des Hochofens und des Hammerwerks.",
    },
    {
      year: "1810",
      cs: "Mlýn s pilou poháněnou vodní silou.",
      en: "Mill with a water-powered sawmill.",
      de: "Mühle mit wasserbetriebener Säge.",
    },
    {
      year: "1990",
      cs: "Pila vzniká jako část obce Trhanov v okrese Domažlice.",
      en: "Pila is established as part of Trhanov village in the Domažlice district.",
      de: "Pila entsteht als Teil der Gemeinde Trhanov im Bezirk Domažlice.",
    },
    {
      year: "2026",
      cs: "Transformace na hudební a kreativní retreat studio.",
      en: "Transformation into a music and creative retreat studio.",
      de: "Umwandlung in ein Musik- und Kreativ-Retreat-Studio.",
    },
  ],
};

const STUDIO = {
  label: { cs: "Studio a technologie", en: "Studio & Technology", de: "Studio & Technologie" },
  title: {
    cs: ["Tři unikátní", "prostory"],
    en: ["Three unique", "spaces"],
    de: ["Drei einzigartige", "Räume"],
  },
  intro: {
    cs: "Od hlavního studia přes mlýnici až po kontrolní místnost. Vše připravené pro tvorbu, nahrávání i soustředěnou postprodukci.",
    en: "From the main studio through the mill studio to the control room. Everything is ready for writing, recording and focused post-production.",
    de: "Vom Hauptstudio über das Mühlenstudio bis zum Regieraum. Alles ist bereit für Kreation, Recording und fokussierte Postproduktion.",
  },
  rooms: [
    {
      name: { cs: "Hlavní studio", en: "Main Studio", de: "Hauptstudio" },
      size: "64 m²",
      video: "O431B93W9UY",
      localVideo: "O431B93W9UY",
      posterType: "jpg",
      text: {
        cs: "Hlavní studio se nachází v podkrovní galerii, přímo nad mlýnicí. Přirozené světlo sem proniká střešními okny a velkým francouzským oknem s balkonem, odkud se otevírá výhled na klidný rybník.",
        en: "The main studio is located in the attic gallery, directly above the mill. Natural light enters through skylights and a large French window with a balcony overlooking the quiet pond.",
        de: "Das Hauptstudio befindet sich in der Dachgalerie direkt über der Mühle. Natürliches Licht fällt durch Dachfenster und ein großes französisches Fenster mit Balkon und Blick auf den ruhigen Teich.",
      },
    },
    {
      name: { cs: "Studio mlýnice", en: "Mill Studio", de: "Mühlenstudio" },
      size: "25 m²",
      video: "mndh51Ug7zg",
      localVideo: "mndh51Ug7zg",
      posterType: "gif",
      text: {
        cs: "Vysoké stropy a unikátní akustika historické mlýnice. Ideální pro akustické nahrávky a experimentální projekty.",
        en: "High ceilings and the unique acoustics of the historic mill. Ideal for acoustic recordings and experimental projects.",
        de: "Hohe Decken und die einzigartige Akustik der historischen Mühle. Ideal für akustische Aufnahmen und experimentelle Projekte.",
      },
    },
    {
      name: { cs: "Kontrolní místnost", en: "Control Room", de: "Regieraum" },
      size: "27 m²",
      video: "u2ylGCNnV50",
      localVideo: "PNnMOPbABZo",
      posterType: "jpg",
      text: {
        cs: "Apple Pro Display XDR 6K pro střih videa, grafiku i postprodukci. Plná Apple sestava periferií, plynule regulovatelné osvětlení, klidná atmosféra, krásný výhled a knihovna.",
        en: "Apple Pro Display XDR 6K for video editing, graphics and post-production. Full Apple peripherals, smoothly adjustable lighting, calm atmosphere, beautiful view and a library.",
        de: "Apple Pro Display XDR 6K für Videoschnitt, Grafik und Postproduktion. Vollständige Apple-Peripherie, sanft regulierbares Licht, ruhige Atmosphäre, schöner Ausblick und Bibliothek.",
      },
    },
  ],
};

const LOCATION = {
  label: { cs: "Lokalita a dostupnost", en: "Location & Accessibility", de: "Lage & Erreichbarkeit" },
  title: {
    cs: ["Klidné místo", "v srdci Evropy"],
    en: ["A quiet place", "in the heart of Europe"],
    de: ["Ein ruhiger Ort", "im Herzen Europas"],
  },
  paragraphs: [
    {
      cs: "Pila u Trhanova je ideální lokalitou pro milovníky krásné přírody, soukromí a aktivního odpočinku.",
      en: "Pila near Trhanov is an ideal location for lovers of beautiful nature, privacy and active relaxation.",
      de: "Pila bei Trhanov ist ein idealer Ort für Liebhaber schöner Natur, Privatsphäre und aktiver Erholung.",
    },
    {
      cs: "Celý kraj je známý svou zelení, čerstvým vzduchem a klidem, což vytváří perfektní podmínky pro všechny hledající únik z ruchu města.",
      en: "The whole region is known for its greenery, fresh air and calm, creating ideal conditions for those seeking an escape from city noise.",
      de: "Die gesamte Region ist für ihr Grün, frische Luft und Ruhe bekannt und bietet perfekte Bedingungen für alle, die dem Stadtlärm entfliehen möchten.",
    },
  ],
  accessLabel: { cs: "Dostupnost", en: "Access", de: "Erreichbarkeit" },
  access: [
    {
      icon: "car",
      cs: "Autem: 10 min do centra Domažlic, 10 min na německé hranice",
      en: "By car: 10 min to Domažlice center, 10 min to the German border",
      de: "Mit dem Auto: 10 Min. ins Zentrum von Domažlice, 10 Min. zur deutschen Grenze",
    },
    {
      icon: "train",
      cs: "Vlakem: zastávka přímo na Pile",
      en: "By train: station directly at Pila",
      de: "Mit dem Zug: Haltestelle direkt in Pila",
    },
    {
      icon: "plane",
      cs: "Letadlem: ~1h 45min z Prahy, ~2h 30min z Mnichova",
      en: "By plane: ~1h 45m from Prague, ~2h 30m from Munich",
      de: "Mit dem Flugzeug: ~1 Std. 45 Min. von Prag, ~2 Std. 30 Min. von München",
    },
    {
      icon: "bolt",
      cs: "Nabíjení EV v areálu + vlastní zdroj energie",
      en: "EV charging on site + own energy source",
      de: "EV-Ladung im Areal + eigene Energiequelle",
    },
  ],
};

const HISTORY = {
  label: { cs: "Historie", en: "History", de: "Geschichte" },
  title: {
    cs: ["Časová osa", "mlýna"],
    en: ["Timeline", "of the mill"],
    de: ["Zeitleiste", "der Mühle"],
  },
  caption: {
    cs: "Fullscreen panel s historickou osou.",
    en: "Fullscreen panel with the historical timeline.",
    de: "Fullscreen-Panel mit historischer Zeitleiste.",
  },
};

const RESIDENCY = {
  label: { cs: "Nahrávání + Ubytování", en: "Recording + Accommodation", de: "Recording + Unterkunft" },
  number: "6500 m²",
  title: {
    cs: ["Čtyři", "balíčky"],
    en: ["Four", "packages"],
    de: ["Vier", "Pakete"],
  },
  intro: {
    cs: 'Čtyři cesty, jak si užít nahrávání naplno: soukromý park 6 500 m² s potůčkem, snídaně/brunch v zimní zahradě z lokálních surovin a domácí chléb z pece, vlastní zdroj energie. Balíčky jsou pojmenované podle songů <a href="https://www.anteaterofficial.com" target="_blank" rel="noopener noreferrer">Anteater</a>. 🙂',
    en: 'Four ways to enjoy recording to the fullest: a private 6,500 m² park with a stream, breakfast/brunch in the winter garden from local ingredients and homemade oven-baked bread, plus an independent power source. The packages are named after songs by <a href="https://www.anteaterofficial.com" target="_blank" rel="noopener noreferrer">Anteater</a>. 🙂',
    de: 'Vier Wege, Recording voll auszukosten: privater Park mit 6.500 m² und Bach, Frühstück/Brunch im Wintergarten aus lokalen Zutaten und hausgebackenes Brot aus dem Ofen, eigene Energiequelle. Die Pakete sind nach Songs von <a href="https://www.anteaterofficial.com" target="_blank" rel="noopener noreferrer">Anteater</a> benannt. 🙂',
  },
  packages: [
    {
      id: "into",
      number: "01",
      name: "Into the Wild",
      tags: {
        cs: "#Hlavní studio #Snídaně v zimní zahradě",
        en: "#Main studio #Breakfast in winter garden",
        de: "#Hauptstudio #Frühstück im Wintergarten",
      },
      text: {
        cs: "Nejekonomičtější — stanování v parku, zapůjčení pouze studia, pro dobrodruhy a nadšence. Usínejte a probouzejte se do světa hudby s přírodou.",
        en: "The most economical — camping in the park, studio rental only, for adventurers and enthusiasts. Fall asleep and wake up to music and nature.",
        de: "Die wirtschaftlichste Variante — Camping im Park, nur Studiomiete, für Abenteurer und Enthusiasten. Einschlafen und aufwachen in Musik und Natur.",
      },
    },
    {
      id: "underwater",
      number: "02",
      name: "Underwater",
      tags: { cs: "#Hlavní studio #Sauna", en: "#Main studio #Sauna", de: "#Hauptstudio #Sauna" },
      text: {
        cs: "Nejblíže k hudbě, spaní doslova pod podlahou studia a také i pod hladinou rybníka. Skromné ale stylové a útulné přespání přímo v prostorách bývalé mlýnice.",
        en: "Closest to the music, sleeping literally beneath the studio floor and below the pond level. Modest but stylish accommodation in the former mill.",
        de: "Ganz nah an der Musik: Schlafen direkt unter dem Studioboden und unter der Teichoberfläche. Schlicht, aber stilvoll und gemütlich in der ehemaligen Mühle.",
      },
    },
    {
      id: "otherside",
      number: "03",
      name: "Otherside",
      tags: {
        cs: "#Kontrolní místnost #Staročeská světnice #Dva pokoje #TV",
        en: "#Control room #Traditional Czech room #Two rooms #TV",
        de: "#Regieraum #Traditionelle Stube #Zwei Zimmer #TV",
      },
      text: {
        cs: "Pro postprodukci 6K Apple Pro XDR včetně komplet periferií od Apple + ubytování ve staročeské světnici. Vhodné i pro nehudební kreativní aktivity.",
        en: "For post-production: 6K Apple Pro XDR with full Apple peripherals + accommodation in a traditional Czech room. Suitable for non-musical creative activities too.",
        de: "Für Postproduktion: 6K Apple Pro XDR inkl. kompletter Apple-Peripherie + Unterkunft in einer traditionellen tschechischen Stube. Auch für nicht-musikalische Kreativarbeit geeignet.",
      },
    },
    {
      id: "fuel",
      number: "04",
      name: "Fuel",
      tags: { cs: "#VIP balíček", en: "#VIP package", de: "#VIP-Paket" },
      text: {
        cs: "VIP pronájem celé nemovitosti s plným servisem, včetně zimní zahrady a zapůjčení Tesla Model X. Profi catering, roztopení velké pece, pizza i chleba z pece.",
        en: "VIP rental of the entire property with full service, including the winter garden and Tesla Model X. Professional catering, firing the large oven, pizza and bread from the stone oven.",
        de: "VIP-Miete der gesamten Anlage mit Full-Service inklusive Wintergarten und Tesla Model X. Professionelles Catering, großer Ofen, Pizza und Brot aus dem Steinofen.",
      },
    },
  ],
  notes: [
    {
      cs: "Ubytování je součástí pobytu ve studiu během kreativní práce.",
      en: "Accommodation is part of the studio stay during creative work.",
      de: "Die Unterkunft ist Teil des Studioaufenthalts während der kreativen Arbeit.",
    },
    {
      cs: "U všech balíčků je možnost parkovat v areálu mlýna pod kamerovým systémem.",
      en: "All packages include parking in the mill area under CCTV surveillance.",
      de: "Bei allen Paketen ist Parken im kameragesicherten Mühlenareal möglich.",
    },
  ],
};

const CONTACT = {
  label: { cs: "Kontakt", en: "Contact", de: "Kontakt" },
  title: { cs: "Kontakt", en: "Contact", de: "Kontakt" },
  address: {
    cs: "Ing. Jindřich Traxmandl<br>Pila 100 – Mlýn<br>Trhanov 344 01<br>Česká republika",
    en: "Ing. Jindřich Traxmandl<br>Pila 100 – Mill<br>Trhanov 344 01<br>Czech Republic",
    de: "Ing. Jindřich Traxmandl<br>Pila 100 – Mühle<br>Trhanov 344 01<br>Tschechische Republik",
  },
  email: "mlynnapile@gmail.com",
  phone: "+420 724 050 093",
  about: {
    cs: "Dveře máme otevřené všem kreativním duším. Věříme, že kombinace krásné přírody, nástrojů s příběhem a moderní technologie v pozadí, zajišťující aby se jediný nápad neztratil, vytváří tu pravou synergii pro vznik něčeho výjimečného.",
    en: "Our doors are open to all creative souls. We believe that the combination of beautiful nature, instruments with a story, and modern background technology that ensures no idea gets lost creates the true synergy for something exceptional.",
    de: "Unsere Türen stehen allen kreativen Menschen offen. Wir glauben, dass die Kombination aus schöner Natur, Instrumenten mit Geschichte und moderner Technik im Hintergrund, damit kein Einfall verloren geht, die richtige Synergie für etwas Besonderes schafft.",
  },
  founders: [
    {
      name: "Jindřich Traxmandl",
      text: {
        cs: "kytarista Anteater, technologie, vintage nástroje a aparáty.",
        en: "Anteater guitarist, technology, vintage instruments and amplifiers.",
        de: "Gitarrist von Anteater, Technologie, Vintage-Instrumente und Verstärker.",
      },
    },
    {
      name: "Andrea Kohoutová",
      text: {
        cs: "zpěvačka, baskytaristka Anteater, archeoložka, hlavní pekařka mlýna, domácí chléb.",
        en: "singer, Anteater bassist, archaeologist, head baker of the mill, homemade bread.",
        de: "Sängerin, Bassistin von Anteater, Archäologin, Hauptbäckerin der Mühle, hausgemachtes Brot.",
      },
    },
  ],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/mlynnapile" },
    { label: "YouTube", href: "https://www.youtube.com/@mlynnapile" },
    { label: "Facebook", href: "https://www.facebook.com/share/1CWTAs8zoP/" },
  ],
};

const FAQ = {
  cs: [
    { q: "Straší na mlýně?", a: "Ne ;-)" },
    {
      q: "Kolik stojí pobyt a kdy je možné rezervovat?",
      aHtml:
        'Na studiu stále pracujeme a ladíme poslední detaily. Ceník i rezervace budou brzy k dispozici. Pokud máte zájem, napište nám na <a href="mailto:mlynnapile@gmail.com">mlynnapile@gmail.com</a> – ozveme se zpět. Připravujeme <a href="/booking" target="_blank" rel="noopener noreferrer">mlynnapile.cz/booking</a>.',
    },
    { q: "Jste plátci DPH?", a: "Ano, jsme plátci DPH. Všechny ceny na webu jsou uvedeny včetně DPH." },
    { q: "Lze pronajmout celý objekt?", a: "Ano. Celý komplex lze rezervovat minimálně na 3 dny." },
    {
      q: "Smí se v mlýně kouřit?",
      a: "Nesmí. Mlýn je z velké části ze dřeva, je zde hodně protipožárních ochran, které by okamžitě spustily hlasitý poplach a vzdálené notifikace – tzn. pokud si přivezete vlastní nástroje, budou v bezpečí.",
    },
    {
      q: "Mohu si dovézt vlastní aparaturu a je objekt dostatečně zabezpečen?",
      a: "Samozřejmě můžete, aparatura se dá vyložit přímo před studiem. Objekt je zabezpečen na několika úrovních, současně je přístup přes hráz, kde projede jen jedno auto.",
    },
    { q: "Poskytujete ubytování i samostatně?", a: "Ubytování je součástí pobytu ve studiu během kreativní práce." },
    {
      q: "Jak se k nám dostanu?",
      a: "Autem: přímý přístup, soukromé parkování. Vlakem: zastávka přímo na Pile. Letecky: 1h 45min z letiště Praha, 2h 30min z Mnichova.",
    },
    { q: "Mohu přijet i sám, nebo je akce určena pouze pro kapely a týmy?", a: "Jasně - pro sólo umělce je k dispozici i looper Plethora X5 od TC Electronic. ;-)" },
    {
      q: "Máte catering, nebo si musím řešit jídlo sám?",
      aHtml:
        'Součástí pobytu je vždy snídaně nebo brunch a vždy domácí kváskový <a href="/chleba" target="_blank" rel="noopener noreferrer">chleba</a>, který pečeme ve venkovní peci. Flexibilní možnosti stravování: in-house catering, pizza pec, plně vybavená kuchyň a rozvoz z místních restaurací.',
    },
    { q: "Mluvíte anglicky/německy?", a: "Vícejazyčný tým: čeština, plynulá angličtina a konverzační němčina." },
    { q: "Mohu přijet s dětmi i se psem?", a: "Ano, všichni jsou vítáni. Pejsci jsou také vítáni, ale pozemek není komplet oplocen." },
    {
      q: "Během pobytu jsme si u vás oblíbili konkrétní kytarový rig. Je možné zapůjčení na dohrávky ve studiu, kde dokončujeme materiál k desce?",
      a: "Ano, samozřejmě. Po předchozí domluvě je možné vybraný kytarový chain zapůjčit i na následné dohrávky. Platí pro nástroje, které vlastníme; zbytek je na dohodě.",
    },
  ],
  en: [
    { q: "Is the mill haunted?", a: "No ;-)" },
    {
      q: "How much does a stay cost and when will booking open?",
      aHtml:
        'We are still refining the final details of the studio. Pricing and booking will be available soon. If you are interested, write to us at <a href="mailto:mlynnapile@gmail.com">mlynnapile@gmail.com</a> and we will get back to you. We are preparing <a href="/en/booking" target="_blank" rel="noopener noreferrer">mlynnapile.cz/booking</a>.',
    },
    { q: "Are you VAT registered?", a: "Yes, we are VAT registered. All prices on the website include VAT." },
    { q: "Can the entire property be rented?", a: "Yes. The entire complex can be booked for a minimum of 3 days." },
    { q: "Is smoking allowed in the mill?", a: "No. The mill is largely wooden and has extensive fire protection systems that immediately trigger alarms and remote notifications." },
    { q: "Can I bring my own equipment and is the property secure enough?", a: "Of course. Equipment can be unloaded directly in front of the studio. The property is secured on several levels and has a single access road over the dam." },
    { q: "Do you provide accommodation separately?", a: "Accommodation is part of the studio stay during creative work." },
    { q: "How do I get there?", a: "By car: direct access and private parking. By train: station directly at Pila. By plane: 1h 45m from Prague Airport, 2h 30m from Munich." },
    { q: "Can I come alone, or is this only for bands and teams?", a: "Sure. For solo artists we also have the TC Electronic Plethora X5 looper available. ;-)" },
    {
      q: "Do you provide catering, or do I need to arrange my own food?",
      aHtml:
        'Every stay includes breakfast or brunch and homemade sourdough <a href="/chleba" target="_blank" rel="noopener noreferrer">bread</a> baked in our outdoor oven. Flexible dining options include in-house catering, pizza oven dinners, a fully equipped kitchen and delivery from Domažlice restaurants.',
    },
    { q: "Do you speak English/German?", a: "Multilingual team: Czech native speakers, fluent English and conversational German." },
    { q: "Can I come with children and a dog?", a: "Yes, everyone is welcome. Dogs are welcome too, but note that the land is not fully fenced." },
    { q: "During our stay we loved a specific guitar rig. Can we borrow it for overdubs elsewhere?", a: "Yes. By prior arrangement, selected guitar chains can be borrowed for follow-up overdubs. Only instruments we own; the rest by agreement." },
  ],
  de: [
    { q: "Spukt es in der Mühle?", a: "Nein ;-)" },
    {
      q: "Was kostet der Aufenthalt und ab wann kann man reservieren?",
      aHtml:
        'Wir arbeiten noch an den letzten Details des Studios. Preise und Reservierungen werden bald verfügbar sein. Wenn Sie Interesse haben, schreiben Sie uns an <a href="mailto:mlynnapile@gmail.com">mlynnapile@gmail.com</a> – wir melden uns zurück. Wir bereiten <a href="/de/buchung" target="_blank" rel="noopener noreferrer">mlynnapile.cz/booking</a> vor.',
    },
    { q: "Sind Sie umsatzsteuerpflichtig?", a: "Ja, wir sind umsatzsteuerpflichtig. Alle Preise auf der Website verstehen sich inklusive MwSt." },
    { q: "Kann man das gesamte Objekt mieten?", a: "Ja. Der gesamte Komplex kann für mindestens 3 Tage gebucht werden." },
    { q: "Ist Rauchen in der Mühle erlaubt?", a: "Nein. Die Mühle besteht größtenteils aus Holz und ist mit Brandschutzsystemen ausgestattet, die sofort Alarme und Fernbenachrichtigungen auslösen würden." },
    { q: "Kann ich eigenes Equipment mitbringen und ist das Objekt ausreichend gesichert?", a: "Natürlich. Das Equipment kann direkt vor dem Studio ausgeladen werden. Das Objekt ist auf mehreren Ebenen gesichert und hat nur eine Zufahrt über den Damm." },
    { q: "Bieten Sie Unterkunft auch separat an?", a: "Die Unterkunft ist Teil des Studioaufenthalts während der kreativen Arbeit." },
    { q: "Wie komme ich zu Ihnen?", a: "Mit dem Auto: direkte Zufahrt und privater Parkplatz. Mit dem Zug: Haltestelle direkt in Pila. Mit dem Flugzeug: 1h45 von Prag, 2h30 von München." },
    { q: "Kann ich auch alleine kommen oder ist das nur für Bands und Teams?", a: "Natürlich. Für Solo-Künstler steht auch der Plethora X5 Looper von TC Electronic bereit. ;-)" },
    {
      q: "Gibt es Catering oder muss ich mich selbst um Essen kümmern?",
      aHtml:
        'Zum Aufenthalt gehört immer Frühstück oder Brunch sowie hausgebackenes Sauerteig-<a href="/chleba" target="_blank" rel="noopener noreferrer">Brot</a> aus dem Ofen. Flexible Verpflegung: Inhouse-Catering, Pizzaofen, voll ausgestattete Küche und Lieferdienste aus Domažlice.',
    },
    { q: "Sprechen Sie Englisch/Deutsch?", a: "Mehrsprachiges Team: Tschechisch, fließend Englisch und Deutsch auf Konversationsniveau." },
    { q: "Kann ich mit Kindern und Hund kommen?", a: "Ja, alle sind willkommen. Hunde sind ebenfalls willkommen, das Gelände ist jedoch nicht vollständig eingezäunt." },
    { q: "Wir mochten bei unserem Aufenthalt ein bestimmtes Gitarren-Rig. Ist Ausleihe für Overdubs möglich?", a: "Ja, nach vorheriger Absprache können ausgewählte Gitarren-Chains auch für spätere Overdubs ausgeliehen werden. Nur Instrumente in unserem Besitz, der Rest nach Vereinbarung." },
  ],
};

window.MlynContent = {
  CONTACT,
  FAQ,
  HERO,
  HISTORY,
  LOCATION,
  PLACE,
  RESIDENCY,
  SECTION_ORDER,
  SITE_META,
  STUDIO,
  SUPPORTED_LANGS,
  UI,
};
})();
