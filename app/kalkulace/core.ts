// Sdílená logika kalkulačky: pomocné funkce, výchozí data, výpočet, úložiště, QR platba.

// Údaje podnikatele se vyplňují v administraci (/kalkulace/admin) a ukládají v prohlížeči.
// V kódu nejsou žádné osobní údaje.
export const defaultCompany = {
  subtitle: "ZEDNICKÉ PRÁCE",
  logo: "", // nahrané logo jako data-URL (obrázek)
  name: "",
  address: "",
  ico: "",
  dic: "",
  phone: "",
  email: "",
  web: "",
  register: "Fyzická osoba zapsaná v živnostenském rejstříku.",
  vatNote: "Nejsem plátce DPH.",
  account: "",
  bank: "", // název banky (nepovinné, na faktuře)
  dueDays: 14,
  validityDays: 30,
};

export const defaultWorks = [
  { id: "oklep", name: "Oklepání vypouklých / nesoudržných omítek", unit: "m²", price: 70 },
  { id: "perlinka", name: "Penetrace + armování perlinkou + štukování", unit: "m²", price: 700 },
  { id: "malba", name: "Výmalba bílou barvou", unit: "m²", price: 90 },
];

export const defaultGlobalRows = [
  { id: "rezije", name: "Režie, přesun hmot, likvidace materiálu", unit: "kpl", qty: 1, price: 5000, on: true, laborReserveBase: true },
  { id: "rezerva_voda", name: "Rezerva po vodní škodě a nepředvídané práce", unit: "kpl", qty: 1, price: 8000, on: true },
  { id: "viceprace", name: "Případné vícepráce hodinovou sazbou", unit: "hod", qty: 1, price: 450, on: false, laborReserveBase: true },
];

// Ukázková místnost 3 × 4 m, výška stropu 250 cm.
export const defaultWalls = [
  {
    id: "stena-1",
    name: "Stěna 1",
    width: 400,
    height: 250,
    scope: "damaged",
    openings: [{ id: "o-1", name: "Dveře", type: "door", width: 90, height: 200, count: 1, x: 40, y: 0 }],
    workIds: ["oklep", "perlinka", "malba"],
  },
  {
    id: "stena-2",
    name: "Stěna 2",
    width: 300,
    height: 250,
    scope: "visual",
    openings: [{ id: "o-2", name: "Okno", type: "window", width: 120, height: 120, count: 1, x: 90, y: 95 }],
    workIds: ["malba"],
  },
  { id: "stena-3", name: "Stěna 3", width: 400, height: 250, scope: "visual", openings: [], workIds: ["malba"] },
  { id: "stena-4", name: "Stěna 4", width: 300, height: 250, scope: "damaged", openings: [], workIds: ["oklep", "perlinka", "malba"] },
];

// Stěny jsou seskupené do místností (taby v horní části kalkulačky).
export const defaultRooms = [{ id: "room-1", name: "Místnost 1", walls: defaultWalls }];

export const uidRoom = () => `room-${Math.random().toString(36).slice(2, 9)}`;

// Nová prázdná místnost s jednou výchozí stěnou.
export const makeRoom = (index: number) => ({
  id: uidRoom(),
  name: `Místnost ${index}`,
  walls: [
    {
      id: `stena-${Math.random().toString(36).slice(2, 9)}`,
      name: "Stěna 1",
      width: 300,
      height: 250,
      scope: "damaged",
      openings: [],
      workIds: ["oklep", "perlinka", "malba"],
    },
  ],
});

// Zploštění místností na jeden seznam stěn pro výpočet a dokumenty.
// U více místností se název stěny doplní o místnost („Kuchyň – Stěna 1“).
export const flattenRooms = (rooms: any[]) => {
  if (!rooms?.length) return [];
  if (rooms.length === 1) return rooms[0].walls;
  return rooms.flatMap((room: any) => room.walls.map((wall: any) => ({ ...wall, name: `${room.name} – ${wall.name}` })));
};

// Zpětná kompatibilita: starší uložená data mají jen walls bez místností.
export const roomsFromData = (data: any) => {
  if (data?.rooms?.length) return data.rooms;
  if (data?.walls?.length) return [{ id: "room-1", name: "Místnost 1", walls: data.walls }];
  return JSON.parse(JSON.stringify(defaultRooms));
};

export const defaultMaterials = [
  { id: "penetrace", name: "Penetrace hloubková", source: "plaster", unit: "l", cons: 0.15, reserve: 15, price: 120, on: true },
  { id: "perlinka", name: "Perlinka / armovací tkanina", source: "plaster", unit: "m²", cons: 1.1, reserve: 15, price: 25, on: true },
  { id: "lepidlo", name: "Lepidlo / stěrka pod perlinku", source: "plaster", unit: "kg", cons: 4, reserve: 15, price: 16, on: true },
  { id: "stuk", name: "Štuková omítka", source: "plaster", unit: "kg", cons: 2.5, reserve: 15, price: 15, on: true },
  { id: "barva", name: "Bílá interiérová barva (balení 10 l)", source: "paint", unit: "l", cons: 0.25, reserve: 15, price: 95, pack: 10, on: true },
  { id: "folie", name: "Zakrývací fólie a malířské pásky", source: "fixed", unit: "kpl", qty: 1, price: 700, on: true },
  { id: "brusivo", name: "Brusivo, pytle, spotřební materiál", source: "fixed", unit: "kpl", qty: 1, price: 800, on: true },
];

export const defaultSettings = { materialReservePercent: 15, laborReservePercent: 15, kmOneWay: 25, visits: 2, kmPrice: 18 };
export const defaultCustomer = { name: "", address: "", ico: "", phone: "", email: "" };

// Barvy stěn ve 3D náhledu – sdílené s přepínačem Interiér / Fasáda,
// aby tlačítko mělo stejnou barvu jako stěny, které zapne.
export const WALL_COLORS = {
  interior: { fill: "#e2e8f0", stroke: "#334155" },
  facade: { fill: "#fef3c7", stroke: "#92400e" },
};

export const QUOTE_STATUSES = [
  { id: "draft", label: "Koncept", className: "bg-neutral-200 text-neutral-700" },
  { id: "sent", label: "Odesláno", className: "bg-sky-100 text-sky-800" },
  { id: "accepted", label: "Přijato", className: "bg-emerald-100 text-emerald-800" },
  { id: "invoiced", label: "Fakturováno", className: "bg-violet-100 text-violet-800" },
];

export const statusInfo = (id: string) => QUOTE_STATUSES.find((s) => s.id === id) || QUOTE_STATUSES[0];

// ---------- pomocné funkce ----------

export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const n = (value: any) => {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
};
export const areaCm = (width: any, height: any, count: any = 1) => (n(width) / 100) * (n(height) / 100) * Math.max(0, n(count || 1));
export const f2 = (value: any) => n(value).toFixed(2);
export const roundMoney = (value: any) => Math.round(n(value));
export const roundUpToPack = (qty: number, pack: any) => (pack ? Math.ceil(qty / pack) * pack : qty);
export const czk = (value: any) => new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(n(value));
export const clamp = (value: any, min: number, max: number) => Math.min(Math.max(n(value), min), Math.max(min, max));
export const dateCz = (iso: any) => (iso ? new Date(iso).toLocaleDateString("cs-CZ") : "—");
// lokální datum (ne UTC), jinak večer/ráno ujíždí o den
const localIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const todayIso = () => localIso(new Date());
export const addDaysIso = (days: any) => {
  const d = new Date();
  d.setDate(d.getDate() + Math.max(0, Math.round(n(days))));
  return localIso(d);
};

export function scopeText(scope: string) {
  return scope === "damaged" ? "Poškozená" : "Navazující / pohledová";
}

// Plocha špalet otvoru (ostění + nadpraží) – obvod otvoru × hloubka špalety.
// Otvor stojící na podlaze (dveře) nemá spodní špaletu, proto se šířka počítá jednou.
export function revealArea(opening: any) {
  const depth = Math.max(0, n(opening.reveal));
  if (!depth) return 0;
  const width = Math.max(0, n(opening.width));
  const height = Math.max(0, n(opening.height));
  const onFloor = openingKind(opening) === "door" || n(opening.y) === 0;
  const perimeter = onFloor ? width + 2 * height : 2 * (width + height);
  return (perimeter / 100) * (depth / 100) * Math.max(1, n(opening.count || 1));
}

// Plocha parabolického oblouku (segment nad tětivou): 2/3 × rozpětí × vzepětí.
export const archArea = (span: any, rise: any) => (Math.max(0, n(span)) / 100) * (Math.max(0, n(rise)) / 100) * (2 / 3);

// Oblouky na horní hraně stěny. Každý bod tvoří jeden oblouk; hranice mezi
// sousedními oblouky leží v polovině vzdálenosti mezi body (3 body = 3 oblouky).
export function wallArcs(wall: any) {
  const points = (wall.arcs ?? [])
    .map((arc: any) => ({ x: Math.max(0, n(arc.x)), rise: Math.max(0, n(arc.rise)), id: arc.id }))
    .sort((a: any, b: any) => a.x - b.x);
  if (!points.length) return [];
  const length = Math.max(1, n(wall.width));
  return points.map((point: any, index: number) => {
    const from = index === 0 ? 0 : (points[index - 1].x + point.x) / 2;
    const to = index === points.length - 1 ? length : (point.x + points[index + 1].x) / 2;
    return { ...point, from, to, span: Math.max(0, to - from) };
  });
}

export function wallStats(wall: any) {
  // klenby na horní hraně stěny plochu zvětšují
  const arcs = wallArcs(wall).reduce((sum: number, arc: any) => sum + archArea(arc.span, arc.rise), 0);
  const gross = areaCm(wall.width, wall.height) + arcs;
  const openings = wall.openings.reduce(
    (sum: number, opening: any) =>
      // obloukové nadpraží otvor zvětšuje
      sum + areaCm(opening.width, opening.height, opening.count) + archArea(opening.width, opening.arch) * Math.max(1, n(opening.count || 1)),
    0,
  );
  // špalety se k ploše naopak přičítají – je to plocha navíc k omítnutí / vymalování
  const reveals = wall.openings.reduce((sum: number, opening: any) => sum + revealArea(opening), 0);
  return { gross, openings, reveals, arcs, clean: Math.max(0, gross - openings) + reveals };
}

export function openingKind(opening: any) {
  const name = String(opening.name || "").toLowerCase();
  if (opening.type === "door" || name.includes("dve")) return "door";
  if (opening.type === "other") return "other";
  return "window";
}

export function openingDefaults(type: string, wall: any) {
  const door = type === "door";
  const other = type === "other";
  const width = door
    ? Math.min(90, Math.max(60, n(wall.width) * 0.35))
    : other
      ? Math.min(80, Math.max(35, n(wall.width) * 0.18))
      : Math.min(100, Math.max(60, n(wall.width) * 0.25));
  const height = door
    ? Math.min(210, Math.max(180, n(wall.height) * 0.85))
    : other
      ? Math.min(80, Math.max(35, n(wall.height) * 0.18))
      : Math.min(120, Math.max(80, n(wall.height) * 0.35));
  return {
    id: uid(),
    name: door ? "Dveře" : other ? "Jiné" : "Okno",
    type,
    reveal: 0, // hloubka špalety v cm (0 = neúčtuje se)
    width: Math.round(width),
    height: Math.round(height),
    count: 1,
    x: Math.round(Math.max(0, (n(wall.width) - width) / 2)),
    y: door ? 0 : Math.round(Math.max(0, (n(wall.height) - height) / 2)),
  };
}

export function normalizeOpening(opening: any, wall: any) {
  const width = Math.max(0, n(opening.width));
  const height = Math.max(0, n(opening.height));
  return {
    ...opening,
    type: openingKind(opening),
    x: clamp(opening.x ?? 0, 0, n(wall.width) - width),
    y: clamp(opening.y ?? 0, 0, n(wall.height) - height),
  };
}

export function inferOtherOpening(opening: any) {
  const text = String(opening.name || "").toLowerCase();
  if (text.includes("pojist") || text.includes("elektro") || text.includes("rozvad")) {
    return { label: "Pojistky", mark: "⚡", className: "border-violet-700 bg-violet-100 text-violet-950" };
  }
  if (text.includes("trám") || text.includes("tram") || text.includes("nosník") || text.includes("nosnik")) {
    return { label: "Trám", mark: "▰", className: "border-yellow-800 bg-yellow-100 text-yellow-950" };
  }
  if (text.includes("schod")) {
    const down = text.includes("dol") || text.includes("níž") || text.includes("niz") || text.includes("↓");
    return { label: down ? "Schody ↓" : "Schody ↑", mark: down ? "⬇" : "⬆", className: "border-orange-700 bg-orange-100 text-orange-950" };
  }
  if (text.includes("sokl") || text.includes("parapet")) {
    return { label: "Parapet", mark: "▟", className: "border-stone-700 bg-stone-200 text-stone-950" };
  }
  if (text.includes("komín") || text.includes("komin")) {
    return { label: "Komín", mark: "▮", className: "border-red-800 bg-red-100 text-red-950" };
  }
  if (text.includes("kamna") || text.includes("krb") || text.includes("kotel")) {
    return { label: "Kamna", mark: "♨", className: "border-amber-800 bg-amber-200 text-amber-950" };
  }
  if (text.includes("topen") || text.includes("radiát") || text.includes("radiat")) {
    return { label: "Topení", mark: "≋", className: "border-rose-700 bg-rose-100 text-rose-950" };
  }
  if (text.includes("trub") || text.includes("potrub") || text.includes("odpad") || text.includes("voda")) {
    return { label: "Potrubí", mark: "○", className: "border-emerald-700 bg-emerald-100 text-emerald-950" };
  }
  if (text.includes("nika") || text.includes("výklen") || text.includes("vyklen")) {
    return { label: "Nika", mark: "▣", className: "border-indigo-700 bg-indigo-100 text-indigo-950" };
  }
  return { label: opening.name && opening.name !== "Jiné" ? opening.name : "Jiné", mark: "•", className: "border-neutral-700 bg-neutral-100 text-neutral-950" };
}

// ---------- výpočet ----------

export function buildCalculation({ walls, works, globalRows, materials, settings }: any) {
  const wallRows = walls.flatMap((wall: any) => {
    const stats = wallStats(wall);
    return wall.workIds
      .map((workId: string) => works.find((item: any) => item.id === workId))
      .filter(Boolean)
      .map((work: any) => ({
        id: `${wall.id}-${work.id}`,
        name: `${wall.name}: ${work.name}`,
        unit: work.unit,
        qty: stats.clean,
        price: work.price,
        total: stats.clean * n(work.price),
        laborReserveBase: true,
      }));
  });

  const laborRows = globalRows.filter((row: any) => row.on).map((row: any) => ({ ...row, total: n(row.qty) * n(row.price) }));
  const workRows = [...wallRows, ...laborRows];
  const plasterArea = walls.filter((wall: any) => wall.workIds.includes("perlinka")).reduce((sum: number, wall: any) => sum + wallStats(wall).clean, 0);
  const paintArea = walls.filter((wall: any) => wall.workIds.includes("malba")).reduce((sum: number, wall: any) => sum + wallStats(wall).clean, 0);

  const materialRows = materials
    .filter((material: any) => material.on)
    .map((material: any) => {
      const baseQty =
        material.source === "plaster" ? plasterArea * n(material.cons) : material.source === "paint" ? paintArea * n(material.cons) : n(material.qty);
      const qty = roundUpToPack(baseQty * (1 + n(material.reserve) / 100), material.pack);
      return { id: `mat-${material.id}`, name: `Materiál: ${material.name}`, unit: material.unit, qty, price: n(material.price), total: qty * n(material.price) };
    });

  const materialBaseTotal = materialRows.reduce((sum: number, row: any) => sum + row.total, 0);
  const materialReserve = (materialBaseTotal * n(settings.materialReservePercent)) / 100;
  const laborReserveBase = workRows.filter((row: any) => row.laborReserveBase).reduce((sum: number, row: any) => sum + row.total, 0);
  const laborReserve = (laborReserveBase * n(settings.laborReservePercent)) / 100;
  const transportKm = n(settings.kmOneWay) * 2 * Math.max(1, n(settings.visits));
  const transportTotal = transportKm * n(settings.kmPrice);
  const rawSubtotal = workRows.reduce((sum: number, row: any) => sum + row.total, 0) + laborReserve + materialBaseTotal + materialReserve + transportTotal;
  const subtotal = roundMoney(rawSubtotal);
  const printedRowsTotal =
    workRows.reduce((sum: number, row: any) => sum + roundMoney(row.total), 0) +
    roundMoney(laborReserve) +
    materialRows.reduce((sum: number, row: any) => sum + roundMoney(row.total), 0) +
    roundMoney(materialReserve) +
    roundMoney(transportTotal);

  return {
    wallRows: walls.map((wall: any) => ({ ...wall, stats: wallStats(wall) })),
    workRows,
    materialRows,
    materialBaseTotal,
    materialReserve,
    laborReserve,
    transportKm,
    transportTotal,
    subtotal,
    rounding: subtotal - printedRowsTotal,
  };
}

// Zploštění kalkulace do řádků faktury (stejné pořadí jako tiskový rozpočet).
export function buildInvoiceItems(calc: any, settings: any) {
  const items: any[] = [];
  calc.workRows.forEach((row: any) => items.push({ name: row.name, unit: row.unit, qty: n(row.qty), price: n(row.price), total: n(row.total) }));
  items.push({ name: `Rezerva na práci a časovou náročnost ${f2(settings.laborReservePercent)}%`, unit: "kpl", qty: 1, price: calc.laborReserve, total: calc.laborReserve });
  calc.materialRows.forEach((row: any) => items.push({ name: row.name, unit: row.unit, qty: n(row.qty), price: n(row.price), total: n(row.total) }));
  items.push({ name: `Cenová rezerva na materiál ${f2(settings.materialReservePercent)}%`, unit: "kpl", qty: 1, price: calc.materialReserve, total: calc.materialReserve });
  items.push({ name: `Doprava - ${settings.visits}× tam a zpět`, unit: "km", qty: calc.transportKm, price: n(settings.kmPrice), total: calc.transportTotal });
  if (calc.rounding !== 0) items.push({ name: "Zaokrouhlení na celé Kč", unit: "kpl", qty: 1, price: calc.rounding, total: calc.rounding });
  return items;
}

// ---------- úložiště (localStorage) ----------

const KEYS = {
  autosave: "kalk.autosave",
  quotes: "kalk.quotes",
  invoices: "kalk.invoices",
  companySettings: "kalk.company",
  presets: "kalk.presets",
  invoiceSeq: "kalk.invoiceSeq",
  quoteSeq: "kalk.quoteSeq",
  design: "kalk.design",
  trash: "kalk.trash",
  visits: "kalk.visits",
  history: "kalk.history",
};

// Heslo k soukromému přehledu využití (jen tento prohlížeč).
export const HISTORY_PIN = "1717";

// Koš na smazané místnosti; položky starší než 7 dní se při načtení automaticky mažou.
export const TRASH_TTL_DAYS = 7;

// Jmenný prostor úložiště — oddělené instance kalkulačky (např. /jindra/bac/{ico} má vlastní data).
let storageNs = "";
export function setStorageNamespace(ns?: string | null) {
  storageNs = ns ? `${String(ns)}:` : "";
}

// ---------- vzhled aplikace ----------

// Pět barevných motivů. Všechny hodnoty jdou do CSS proměnných,
// komponenty používají var(--brand), var(--card) atd.
export const THEMES: Record<string, any> = {
  bordo: {
    name: "Bordó klasik",
    dark: false,
    vars: {
      "--brand": "#820c0c", "--brand-dark": "#6b0a0a",
      "--bg": "#f5f5f4", "--bg-soft": "#fafaf9", "--card": "#ffffff", "--header-bg": "rgba(255,255,255,.94)",
      "--text": "#171717", "--text-soft": "#404040", "--muted": "#737373", "--line": "#e4e4e7",
      "--radius": "10px", "--radius-sm": "8px",
    },
  },
  indigo: {
    name: "Moderní indigo",
    dark: false,
    vars: {
      "--brand": "#4338ca", "--brand-dark": "#3730a3",
      "--bg": "#eef1f7", "--bg-soft": "#f6f8fc", "--card": "#ffffff", "--header-bg": "rgba(255,255,255,.94)",
      "--text": "#0f172a", "--text-soft": "#334155", "--muted": "#64748b", "--line": "#dbe1ea",
      "--radius": "16px", "--radius-sm": "12px",
    },
  },
  mono: {
    name: "Minimal mono",
    dark: false,
    vars: {
      "--brand": "#111111", "--brand-dark": "#000000",
      "--bg": "#ffffff", "--bg-soft": "#f5f5f5", "--card": "#ffffff", "--header-bg": "rgba(255,255,255,.94)",
      "--text": "#111111", "--text-soft": "#3f3f3f", "--muted": "#8a8a8a", "--line": "#d9d9d9",
      "--radius": "4px", "--radius-sm": "3px",
    },
  },
  dark: {
    name: "Tmavý režim",
    dark: true,
    vars: {
      "--brand": "#e11d48", "--brand-dark": "#be123c",
      "--bg": "#0f1115", "--bg-soft": "#1a1d23", "--card": "#16191f", "--header-bg": "rgba(22,25,31,.94)",
      "--text": "#f4f4f5", "--text-soft": "#d4d4d8", "--muted": "#8b8f98", "--line": "#2a2e37",
      "--radius": "12px", "--radius-sm": "9px",
    },
  },
  smaragd: {
    name: "Smaragd",
    dark: false,
    vars: {
      "--brand": "#047857", "--brand-dark": "#065f46",
      "--bg": "#f3f6f2", "--bg-soft": "#f9fbf8", "--card": "#ffffff", "--header-bg": "rgba(255,255,255,.94)",
      "--text": "#14201b", "--text-soft": "#38463f", "--muted": "#6b7a72", "--line": "#dde5df",
      "--radius": "12px", "--radius-sm": "9px",
    },
  },
};

// Nabídka písem – jen systémově dostupné rodiny (bez externího načítání).
export const FONT_OPTIONS = [
  { id: "system", label: "Systémové", stack: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  { id: "grotesk", label: "Moderní grotesk", stack: '"Segoe UI", "Helvetica Neue", Arial, system-ui, sans-serif' },
  { id: "serif", label: "Serif (Georgia)", stack: 'Georgia, "Times New Roman", serif' },
  { id: "rounded", label: "Zaoblené", stack: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif' },
  { id: "mono", label: "Mono", stack: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace' },
];

export const defaultDesign = {
  theme: "bordo",
  brand: "", // nepovinný override akcentní barvy (jinak dle motivu)
  fontFamily: "system", // rodina písma (viz FONT_OPTIONS)
  fontScale: 100, // % velikost písma (přes root font-size)
  lineHeight: 1.5, // řádkování
  letterSpacing: 0, // prostrkání v px
  space: 1, // násobek mezer mezi bloky
  zoom: 100, // % měřítko celého rozhraní
  radius: 10, // px zaoblení rohů (tlačítka, buňky)
  controlScale: 100, // % velikost buněk / vstupních polí
};

// Styl (CSS proměnné + typografie) pro kořenový prvek aplikace.
export function designStyle(design: any) {
  const theme = THEMES[design.theme] ?? THEMES.bordo;
  const font = FONT_OPTIONS.find((f) => f.id === design.fontFamily)?.stack ?? FONT_OPTIONS[0].stack;
  const brand = design.brand ? { "--brand": design.brand, "--brand-dark": design.brand } : {};
  const radius = design.radius ? { "--radius": `${design.radius}px`, "--radius-sm": `${Math.round(design.radius * 0.75)}px` } : {};
  return {
    ...theme.vars,
    ...brand,
    ...radius,
    "--space": design.space,
    "--control": (design.controlScale ?? 100) / 100,
    fontFamily: font,
    lineHeight: design.lineHeight,
    letterSpacing: `${design.letterSpacing}px`,
    zoom: (design.zoom ?? 100) / 100,
    colorScheme: theme.dark ? ("dark" as const) : ("light" as const),
  } as any;
}

// Dokumenty (nabídka, faktura) jsou vždy „papírově" světlé kvůli tisku;
// akcentní barva motivu zůstává.
export const DOC_STYLE = {
  "--bg": "#f5f5f4", "--bg-soft": "#fafaf9", "--card": "#ffffff",
  "--text": "#171717", "--text-soft": "#404040", "--muted": "#737373", "--line": "#e4e4e7",
  "--space": 1,
  background: "#ffffff", color: "#171717",
  colorScheme: "light" as const,
  lineHeight: 1.5, letterSpacing: "0px",
} as any;

// Mezery mezi bloky se škálují proměnnou --space (posuvník ve Vzhledu).
export const SPACING_CSS = `
  [data-kalk] .p-4 { padding: calc(1rem * var(--space, 1)); }
  [data-kalk] .p-3 { padding: calc(.75rem * var(--space, 1)); }
  [data-kalk] .gap-3 { gap: calc(.75rem * var(--space, 1)); }
  [data-kalk] .gap-2 { gap: calc(.5rem * var(--space, 1)); }
  [data-kalk] .space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: calc(.75rem * var(--space, 1)); }
  [data-kalk] .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: calc(.5rem * var(--space, 1)); }
  [data-kalk] .mb-3 { margin-bottom: calc(.75rem * var(--space, 1)); }
  [data-kalk] .mt-4 { margin-top: calc(1rem * var(--space, 1)); }
  [data-kalk] .h-10 { height: calc(2.5rem * var(--control, 1)); }
  [data-kalk] .h-9 { height: calc(2.25rem * var(--control, 1)); }
`;

// Načte obrázek loga, zmenší na max. 512 px a vrátí data-URL (PNG).
export function readLogoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("Vyber prosím obrázek (PNG, JPG, SVG…)."));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Soubor se nepodařilo přečíst."));
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const img = new Image();
      img.onerror = () => reject(new Error("Obrázek se nepodařilo načíst."));
      img.onload = () => {
        const max = 512;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        if (scale === 1 && dataUrl.length < 300_000) return resolve(dataUrl);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

const read = (key: string, fallback: any) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(storageNs + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: any) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageNs + key, JSON.stringify(value));
  } catch {
    // plné úložiště – ignorujeme, uživatel má export
  }
};

export const storage = {
  loadAutosave: () => read(KEYS.autosave, null),
  saveAutosave: (state: any) => write(KEYS.autosave, state),
  loadQuotes: (): any[] => read(KEYS.quotes, []),
  saveQuotes: (quotes: any[]) => write(KEYS.quotes, quotes),
  loadInvoices: (): any[] => read(KEYS.invoices, []),
  saveInvoices: (invoices: any[]) => write(KEYS.invoices, invoices),
  loadCompany: () => ({ ...defaultCompany, ...read(KEYS.companySettings, {}) }),
  saveCompany: (company: any) => write(KEYS.companySettings, company),
  loadPresets: () => {
    const saved = read(KEYS.presets, {});
    return {
      works: saved.works ?? defaultWorks,
      globalRows: saved.globalRows ?? defaultGlobalRows,
      materials: saved.materials ?? defaultMaterials,
      settings: { ...defaultSettings, ...(saved.settings ?? {}) },
    };
  },
  savePresets: (presets: any) => write(KEYS.presets, presets),
  loadDesign: () => ({ ...defaultDesign, ...read(KEYS.design, {}) }),
  saveDesign: (design: any) => write(KEYS.design, design),
  loadTrash: (): any[] => {
    const cutoff = Date.now() - TRASH_TTL_DAYS * 24 * 60 * 60 * 1000;
    const kept = (read(KEYS.trash, []) as any[]).filter((item: any) => new Date(item.deletedAt).getTime() > cutoff);
    write(KEYS.trash, kept);
    return kept;
  },
  saveTrash: (trash: any[]) => write(KEYS.trash, trash),
  // počítadlo návštěv a soukromá historie využití (jen tento prohlížeč, bez serveru)
  bumpVisits: (): number => {
    const next = read(KEYS.visits, 0) + 1;
    write(KEYS.visits, next);
    return next;
  },
  loadVisits: (): number => read(KEYS.visits, 0),
  loadHistory: (): any[] => read(KEYS.history, []),
  pushHistory: (entry: any) => {
    if (typeof window === "undefined") return;
    const next = [{ ...entry, t: new Date().toISOString() }, ...(read(KEYS.history, []) as any[])].slice(0, 800);
    write(KEYS.history, next);
  },
  clearHistory: () => write(KEYS.history, []),
  clearPresets: () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(storageNs + KEYS.presets);
    window.localStorage.removeItem(storageNs + KEYS.companySettings);
    window.localStorage.removeItem(storageNs + KEYS.design);
  },
  nextInvoiceNumber: () => {
    const year = new Date().getFullYear();
    const seq = read(KEYS.invoiceSeq, { year, seq: 0 });
    const next = seq.year === year ? seq.seq + 1 : 1;
    write(KEYS.invoiceSeq, { year, seq: next });
    return `${year}${String(next).padStart(3, "0")}`;
  },
  // číslo nabídky se přidělí při prvním uložení (N + rok + pořadí)
  nextQuoteNumber: () => {
    const year = new Date().getFullYear();
    const seq = read(KEYS.quoteSeq, { year, seq: 0 });
    const next = seq.year === year ? seq.seq + 1 : 1;
    write(KEYS.quoteSeq, { year, seq: next });
    return `N${year}${String(next).padStart(5, "0")}`;
  },
  // náhled dalšího čísla bez posunu řady (pro automatický název rozpracované nabídky)
  peekQuoteNumber: () => {
    if (typeof window === "undefined") return "";
    const year = new Date().getFullYear();
    const seq = read(KEYS.quoteSeq, { year, seq: 0 });
    const next = seq.year === year ? seq.seq + 1 : 1;
    return `N${year}${String(next).padStart(5, "0")}`;
  },
};

// ---------- ARES ----------

// Načtení fakturačních údajů z ARES podle IČO (veřejné REST API s podporou CORS).
export async function fetchAres(ico: any) {
  const clean = String(ico ?? "").replace(/\s+/g, "");
  if (!/^\d{8}$/.test(clean)) throw new Error("IČO musí mít přesně 8 číslic.");
  let response: Response;
  try {
    response = await fetch(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${clean}`);
  } catch {
    throw new Error("ARES se nepodařilo kontaktovat – zkontroluj připojení.");
  }
  if (response.status === 404) throw new Error(`Subjekt s IČO ${clean} nebyl v ARES nalezen.`);
  if (!response.ok) throw new Error("ARES momentálně neodpovídá, zkus to za chvíli.");
  const data = await response.json();
  return {
    ico: clean,
    name: data.obchodniJmeno || "",
    address: data.sidlo?.textovaAdresa || "",
    dic: data.dic || "",
  };
}

// ---------- QR platba (SPAYD) ----------

// Převod českého čísla účtu (předčíslí-číslo/kód banky) na IBAN.
export function czAccountToIban(account: string): string | null {
  const match = String(account || "")
    .replace(/\s+/g, "")
    .match(/^(?:(\d{0,6})-)?(\d{2,10})\/(\d{4})$/);
  if (!match) return null;
  const [, prefix = "", number, bank] = match;
  const bban = bank + prefix.padStart(6, "0") + number.padStart(10, "0");
  // kontrolní číslice: mod 97 na (bban + "CZ00" převedeno na čísla), C=12, Z=35
  const digits = bban + "123500";
  const mod = Number(BigInt(digits) % 97n);
  const check = String(98 - mod).padStart(2, "0");
  return `CZ${check}${bban}`;
}

const stripDiacritics = (text: string) =>
  String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 .,-]/g, "")
    .toUpperCase();

export function buildSpayd({ account, amount, vs, message, dueDate }: any): string | null {
  const iban = czAccountToIban(account);
  if (!iban) return null;
  const parts = [`SPD*1.0`, `ACC:${iban}`, `AM:${n(amount).toFixed(2)}`, `CC:CZK`];
  if (vs) parts.push(`X-VS:${String(vs).replace(/\D/g, "").slice(0, 10)}`);
  if (message) parts.push(`MSG:${stripDiacritics(message).slice(0, 60)}`);
  if (dueDate) parts.push(`DT:${String(dueDate).replace(/-/g, "").slice(0, 8)}`);
  return parts.join("*");
}
