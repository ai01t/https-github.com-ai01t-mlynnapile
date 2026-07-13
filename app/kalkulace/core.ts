// Sdílená logika kalkulačky: pomocné funkce, výchozí data, výpočet, úložiště, QR platba.

// Údaje podnikatele se vyplňují v administraci (/kalkulace/admin) a ukládají v prohlížeči.
// V kódu nejsou žádné osobní údaje.
export const defaultCompany = {
  subtitle: "ZEDNICKÉ PRÁCE",
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

export function wallStats(wall: any) {
  const gross = areaCm(wall.width, wall.height);
  const openings = wall.openings.reduce((sum: number, opening: any) => sum + areaCm(opening.width, opening.height, opening.count), 0);
  return { gross, openings, clean: Math.max(0, gross - openings) };
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
  if (text.includes("schod") || text.includes("sokl") || text.includes("parapet")) {
    return { label: "Schod", mark: "▟", className: "border-stone-700 bg-stone-200 text-stone-950" };
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
};

const read = (key: string, fallback: any) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: any) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
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
  clearPresets: () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(KEYS.presets);
    window.localStorage.removeItem(KEYS.companySettings);
  },
  nextInvoiceNumber: () => {
    const year = new Date().getFullYear();
    const seq = read(KEYS.invoiceSeq, { year, seq: 0 });
    const next = seq.year === year ? seq.seq + 1 : 1;
    write(KEYS.invoiceSeq, { year, seq: next });
    return `${year}${String(next).padStart(3, "0")}`;
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
