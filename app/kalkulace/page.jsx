"use client";

import { useMemo, useState } from "react";
import { Eye, GripVertical, Plus, Printer, Trash2, X } from "lucide-react";

const company = {
  subtitle: "ZEDNICKÉ PRÁCE",
  name: "YURII FENCHAK",
  address: "Česká Kubice č. 6, 345 32",
  ico: "21693021",
  phone: "+420 775 237 325",
  email: "fenchak1903@gmail.com",
  web: "fenchak.cz",
};

const defaultWorks = [
  { id: "oklep", name: "Oklepání vypouklých / nesoudržných omítek", unit: "m²", price: 70 },
  { id: "perlinka", name: "Penetrace + armování perlinkou + štukování", unit: "m²", price: 700 },
  { id: "malba", name: "Výmalba bílou barvou", unit: "m²", price: 90 },
];

const defaultGlobalRows = [
  { id: "rezije", name: "Režie, přesun hmot, likvidace materiálu", unit: "kpl", qty: 1, price: 5000, on: true, laborReserveBase: true },
  { id: "rezerva_voda", name: "Rezerva po vodní škodě a nepředvídané práce", unit: "kpl", qty: 1, price: 8000, on: true },
  { id: "viceprace", name: "Případné vícepráce hodinovou sazbou", unit: "hod", qty: 1, price: 450, on: false, laborReserveBase: true },
];

const defaultWalls = [
  { id: "stena-1", name: "Stěna 1", width: 346, height: 168, scope: "damaged", openings: [], workIds: ["oklep", "perlinka", "malba"] },
  {
    id: "stena-2",
    name: "Stěna 2",
    width: 400,
    height: 394,
    scope: "visual",
    openings: [
      { id: "o-1", name: "Dveře", type: "door", width: 112, height: 205, count: 1, x: 35, y: 0 },
      { id: "o-2", name: "Okno", type: "window", width: 120, height: 145, count: 1, x: 201, y: 127 },
      { id: "o-3", name: "Jiné", type: "other", width: 32, height: 135, count: 1, x: 172, y: 131 },
      { id: "o-4", name: "Jiné", type: "other", width: 32, height: 135, count: 1, x: 319, y: 133 },
    ],
    workIds: ["malba"],
  },
  { id: "stena-3", name: "Stěna 3", width: 80, height: 200, scope: "damaged", openings: [], workIds: ["oklep", "perlinka", "malba"] },
  {
    id: "stena-4",
    name: "Stěna 4",
    width: 410,
    height: 200,
    scope: "visual",
    openings: [
      { id: "o-5", name: "Dveře", type: "door", width: 100, height: 180, count: 1, x: 35, y: 0 },
      { id: "o-6", name: "Okno", type: "window", width: 100, height: 90, count: 1, x: 210, y: 80 },
    ],
    workIds: ["oklep", "perlinka", "malba"],
  },
];

const defaultMaterials = [
  { id: "penetrace", name: "Penetrace hloubková", source: "plaster", unit: "l", cons: 0.15, reserve: 15, price: 120, on: true },
  { id: "perlinka", name: "Perlinka / armovací tkanina", source: "plaster", unit: "m²", cons: 1.1, reserve: 15, price: 25, on: true },
  { id: "lepidlo", name: "Lepidlo / stěrka pod perlinku", source: "plaster", unit: "kg", cons: 4, reserve: 15, price: 16, on: true },
  { id: "stuk", name: "Štuková omítka", source: "plaster", unit: "kg", cons: 2.5, reserve: 15, price: 15, on: true },
  { id: "barva", name: "Bílá interiérová barva (balení 10 l)", source: "paint", unit: "l", cons: 0.25, reserve: 15, price: 95, pack: 10, on: true },
  { id: "folie", name: "Zakrývací fólie a malířské pásky", source: "fixed", unit: "kpl", qty: 1, price: 700, on: true },
  { id: "brusivo", name: "Brusivo, pytle, spotřební materiál", source: "fixed", unit: "kpl", qty: 1, price: 800, on: true },
];

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const n = (value) => {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
};
const areaCm = (width, height, count = 1) => (n(width) / 100) * (n(height) / 100) * Math.max(0, n(count || 1));
const f2 = (value) => n(value).toFixed(2);
const roundMoney = (value) => Math.round(n(value));
const roundUpToPack = (qty, pack) => (pack ? Math.ceil(qty / pack) * pack : qty);
const czk = (value) => new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(n(value));
const clamp = (value, min, max) => Math.min(Math.max(n(value), min), Math.max(min, max));

function scopeText(scope) {
  return scope === "damaged" ? "Poškozená" : "Navazující / pohledová";
}

function wallStats(wall) {
  const gross = areaCm(wall.width, wall.height);
  const openings = wall.openings.reduce((sum, opening) => sum + areaCm(opening.width, opening.height, opening.count), 0);
  return { gross, openings, clean: Math.max(0, gross - openings) };
}

function openingKind(opening) {
  const name = String(opening.name || "").toLowerCase();
  if (opening.type === "door" || name.includes("dve")) return "door";
  if (opening.type === "other") return "other";
  return "window";
}

function openingDefaults(type, wall) {
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

function normalizeOpening(opening, wall) {
  const width = Math.max(0, n(opening.width));
  const height = Math.max(0, n(opening.height));
  return {
    ...opening,
    type: openingKind(opening),
    x: clamp(opening.x ?? 0, 0, n(wall.width) - width),
    y: clamp(opening.y ?? 0, 0, n(wall.height) - height),
  };
}

function inferOtherOpening(opening) {
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

function buildCalculation({ walls, works, globalRows, materials, settings }) {
  const wallRows = walls.flatMap((wall) => {
    const stats = wallStats(wall);
    return wall.workIds.map((workId) => {
      const work = works.find((item) => item.id === workId);
      return {
        id: `${wall.id}-${work.id}`,
        name: `${wall.name}: ${work.name}`,
        unit: work.unit,
        qty: stats.clean,
        price: work.price,
        total: stats.clean * work.price,
        laborReserveBase: true,
      };
    });
  });

  const laborRows = globalRows.filter((row) => row.on).map((row) => ({ ...row, total: n(row.qty) * n(row.price) }));
  const workRows = [...wallRows, ...laborRows];
  const plasterArea = walls.filter((wall) => wall.workIds.includes("perlinka")).reduce((sum, wall) => sum + wallStats(wall).clean, 0);
  const paintArea = walls.filter((wall) => wall.workIds.includes("malba")).reduce((sum, wall) => sum + wallStats(wall).clean, 0);

  const materialRows = materials
    .filter((material) => material.on)
    .map((material) => {
      const baseQty =
        material.source === "plaster" ? plasterArea * n(material.cons) : material.source === "paint" ? paintArea * n(material.cons) : n(material.qty);
      const qty = roundUpToPack(baseQty * (1 + n(material.reserve) / 100), material.pack);
      return { id: `mat-${material.id}`, name: `Materiál: ${material.name}`, unit: material.unit, qty, price: n(material.price), total: qty * n(material.price) };
    });

  const materialBaseTotal = materialRows.reduce((sum, row) => sum + row.total, 0);
  const materialReserve = (materialBaseTotal * n(settings.materialReservePercent)) / 100;
  const laborReserveBase = workRows.filter((row) => row.laborReserveBase).reduce((sum, row) => sum + row.total, 0);
  const laborReserve = (laborReserveBase * n(settings.laborReservePercent)) / 100;
  const transportKm = n(settings.kmOneWay) * 2 * Math.max(1, n(settings.visits));
  const transportTotal = transportKm * n(settings.kmPrice);
  const rawSubtotal = workRows.reduce((sum, row) => sum + row.total, 0) + laborReserve + materialBaseTotal + materialReserve + transportTotal;
  const subtotal = roundMoney(rawSubtotal);
  const printedRowsTotal =
    workRows.reduce((sum, row) => sum + roundMoney(row.total), 0) +
    roundMoney(laborReserve) +
    materialRows.reduce((sum, row) => sum + roundMoney(row.total), 0) +
    roundMoney(materialReserve) +
    roundMoney(transportTotal);

  return {
    wallRows: walls.map((wall) => ({ ...wall, stats: wallStats(wall) })),
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

export default function KalkulacePage() {
  const [walls, setWalls] = useState(defaultWalls);
  const [works, setWorks] = useState(defaultWorks);
  const [globalRows, setGlobalRows] = useState(defaultGlobalRows);
  const [materials, setMaterials] = useState(defaultMaterials);
  const [settings, setSettings] = useState({ materialReservePercent: 15, laborReservePercent: 15, kmOneWay: 25, visits: 2, kmPrice: 18 });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [draggedWallId, setDraggedWallId] = useState(null);

  const calc = useMemo(() => buildCalculation({ walls, works, globalRows, materials, settings }), [walls, works, globalRows, materials, settings]);

  const updateWall = (wallId, patch) => setWalls((prev) => prev.map((wall) => (wall.id === wallId ? { ...wall, ...patch } : wall)));
  const updateOpening = (wallId, openingId, patch) =>
    setWalls((prev) =>
      prev.map((wall) =>
        wall.id === wallId
          ? { ...wall, openings: wall.openings.map((opening) => (opening.id === openingId ? { ...opening, ...patch } : opening)) }
          : wall,
      ),
    );
  const toggleWork = (wallId, workId, checked) =>
    setWalls((prev) =>
      prev.map((wall) =>
        wall.id === wallId ? { ...wall, workIds: checked ? [...wall.workIds, workId] : wall.workIds.filter((id) => id !== workId) } : wall,
      ),
    );
  const moveWall = (fromWallId, toWallId) => {
    if (!fromWallId || fromWallId === toWallId) return;
    setWalls((prev) => {
      const fromIndex = prev.findIndex((wall) => wall.id === fromWallId);
      const toIndex = prev.findIndex((wall) => wall.id === toWallId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };
  const addWall = () =>
    setWalls((prev) => [
      ...prev,
      {
        id: uid(),
        name: `Stěna ${prev.length + 1}`,
        width: 300,
        height: 250,
        scope: "damaged",
        openings: [],
        workIds: ["oklep", "perlinka", "malba"],
      },
    ]);

  return (
    <main className="min-h-screen bg-neutral-100 p-3 text-neutral-900">
      <div className="mx-auto max-w-[1600px] space-y-3">
        <header className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-xl font-black">Firemní kalkulačka nacenění</h1>
              <p className="text-sm text-neutral-500">Rozhraní pro zadávání hodnot. Náhled tisku je až po tlačítku.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-md bg-neutral-100 px-4 py-2 text-right">
                <div className="text-xs text-neutral-500">Celkem bez DPH</div>
                <div className="text-2xl font-black">{czk(calc.subtotal)}</div>
              </div>
              <Button onClick={() => setPreviewOpen(true)}>
                <Eye className="h-4 w-4" />
                Náhled tisku
              </Button>
            </div>
          </div>
        </header>

        <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)]">
          <section className="min-w-0 space-y-3">
            {walls.map((wall) => {
              const stats = wallStats(wall);
              const displayWall = { ...wall, openings: wall.openings.map((opening) => normalizeOpening(opening, wall)) };
              return (
                <Card
                  key={wall.id}
                  className={draggedWallId === wall.id ? "opacity-60 ring-2 ring-blue-300" : ""}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    moveWall(draggedWallId, wall.id);
                    setDraggedWallId(null);
                  }}
                >
                  <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="min-w-0">
                      <div className="grid gap-2 lg:grid-cols-[44px_1fr_110px_110px_180px_120px]">
                        <div>
                          <Label>Přesun</Label>
                          <button
                            type="button"
                            draggable
                            title="Přetáhnout stěnu"
                            onDragStart={(event) => {
                              setDraggedWallId(wall.id);
                              event.dataTransfer.effectAllowed = "move";
                              event.dataTransfer.setData("text/plain", wall.id);
                            }}
                            onDragEnd={() => setDraggedWallId(null)}
                            className="grid h-10 w-10 cursor-grab place-items-center rounded-md border border-neutral-300 bg-white text-neutral-500 active:cursor-grabbing"
                          >
                            <GripVertical className="h-5 w-5" />
                          </button>
                        </div>
                        <Field label="Stěna" value={wall.name} onChange={(value) => updateWall(wall.id, { name: value })} />
                        <Field label="Šířka (cm)" value={wall.width} onChange={(value) => updateWall(wall.id, { width: value })} right />
                        <Field label="Výška (cm)" value={wall.height} onChange={(value) => updateWall(wall.id, { height: value })} right />
                        <div>
                          <Label>Rozsah</Label>
                          <select className="h-10 w-full rounded-md border border-neutral-300 px-2" value={wall.scope} onChange={(event) => updateWall(wall.id, { scope: event.target.value })}>
                            <option value="damaged">Poškozená</option>
                            <option value="visual">Navazující / pohledová</option>
                          </select>
                        </div>
                        <div className="rounded-md bg-neutral-100 px-3 py-2 text-right">
                          <div className="text-xs text-neutral-500">Čistá plocha</div>
                          <div className="font-black">{f2(stats.clean)} m²</div>
                        </div>
                      </div>

                      <div className="mt-3 rounded-md border border-neutral-200 bg-neutral-50 p-3">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                          <h2 className="text-sm font-bold">Odečty otvorů</h2>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => updateWall(wall.id, { openings: [...wall.openings, openingDefaults("window", wall)] })}>
                              <Plus className="h-4 w-4" />
                              Okno
                            </Button>
                            <Button variant="outline" onClick={() => updateWall(wall.id, { openings: [...wall.openings, openingDefaults("door", wall)] })}>
                              <Plus className="h-4 w-4" />
                              Dveře
                            </Button>
                            <Button variant="outline" onClick={() => updateWall(wall.id, { openings: [...wall.openings, openingDefaults("other", wall)] })}>
                              <Plus className="h-4 w-4" />
                              Jiné
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {wall.openings.length === 0 && <div className="rounded-md border border-dashed border-neutral-300 bg-white p-2 text-sm text-neutral-500">Bez odečtů.</div>}
                          {wall.openings.map((opening) => {
                            const normalized = normalizeOpening(opening, wall);
                            return (
                              <div key={opening.id} className="grid gap-2 rounded-md bg-white p-2 shadow-sm xl:grid-cols-[92px_minmax(100px,1fr)_64px_64px_52px_64px_76px_92px_36px]">
                                <select
                                  className="rounded-md border border-neutral-300 px-2"
                                  value={openingKind(opening)}
                                  onChange={(event) =>
                                    updateOpening(wall.id, opening.id, {
                                      type: event.target.value,
                                      name: event.target.value === "door" ? "Dveře" : event.target.value === "window" ? "Okno" : opening.name === "Okno" || opening.name === "Dveře" ? "Jiné" : opening.name,
                                      y: event.target.value === "door" ? 0 : normalized.y,
                                    })
                                  }
                                >
                                  <option value="window">Okno</option>
                                  <option value="door">Dveře</option>
                                  <option value="other">Jiné</option>
                                </select>
                                <input
                                  className="rounded-md border border-neutral-300 px-2"
                                  title="Popis pro chytré vykreslení"
                                  placeholder="např. pojistky, trám, schod"
                                  value={opening.name}
                                  onChange={(event) => updateOpening(wall.id, opening.id, { name: event.target.value, type: openingKind(opening) === "other" ? "other" : opening.type })}
                                />
                                <input className="rounded-md border border-neutral-300 px-2 text-right" title="Šířka v cm" value={opening.width} onChange={(event) => updateOpening(wall.id, opening.id, { width: event.target.value })} />
                                <input className="rounded-md border border-neutral-300 px-2 text-right" title="Výška v cm" value={opening.height} onChange={(event) => updateOpening(wall.id, opening.id, { height: event.target.value })} />
                                <input className="rounded-md border border-neutral-300 px-2 text-right" title="Počet" value={opening.count} onChange={(event) => updateOpening(wall.id, opening.id, { count: event.target.value })} />
                                <input className="rounded-md border border-neutral-300 px-2 text-right" title="Posun zleva v cm" value={normalized.x} onChange={(event) => updateOpening(wall.id, opening.id, { x: event.target.value })} />
                                <input className="rounded-md border border-neutral-300 px-2 text-right" title="Výška od podlahy v cm" value={normalized.y} onChange={(event) => updateOpening(wall.id, opening.id, { y: event.target.value })} />
                                <div className="rounded-md bg-neutral-100 px-2 py-1 text-right text-sm font-bold">-{f2(areaCm(opening.width, opening.height, opening.count))} m²</div>
                                <button type="button" onClick={() => updateWall(wall.id, { openings: wall.openings.filter((item) => item.id !== opening.id) })} className="grid h-9 place-items-center rounded-md hover:bg-neutral-100">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            );
                          })}
                          {wall.openings.length > 0 && (
                            <div className="grid px-2 text-[10px] font-bold uppercase text-neutral-400 xl:grid-cols-[92px_minmax(100px,1fr)_64px_64px_52px_64px_76px_92px_36px]">
                              <span>Typ</span>
                              <span>Název</span>
                              <span className="text-right">Šířka</span>
                              <span className="text-right">Výška</span>
                              <span className="text-right">Ks</span>
                              <span className="text-right">Zleva</span>
                              <span className="text-right">Od podlahy</span>
                              <span className="text-right">Odečet</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2 md:grid-cols-3">
                        {works.map((work) => (
                          <label key={work.id} className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 p-2 text-sm">
                            <input type="checkbox" checked={wall.workIds.includes(work.id)} onChange={(event) => toggleWork(wall.id, work.id, event.target.checked)} />
                            <span className="min-w-0 flex-1 truncate">{work.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <WallGraphic
                      wall={displayWall}
                      onMoveOpening={(openingId, patch) => updateOpening(wall.id, openingId, patch)}
                    />
                  </div>
                </Card>
              );
            })}
            <button
              type="button"
              onClick={addWall}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-neutral-300 bg-white px-4 py-5 text-base font-black text-neutral-700 shadow-sm transition hover:border-neutral-500 hover:bg-neutral-50"
            >
              <Plus className="h-5 w-5" />
              Přidat stěnu
            </button>
          </section>

          <aside className="min-w-0 space-y-3">
            <Card>
              <h2 className="mb-3 text-lg font-black">Nastavení a sazby</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Rezerva práce %" value={settings.laborReservePercent} onChange={(value) => setSettings((prev) => ({ ...prev, laborReservePercent: value }))} right />
                <Field label="Rezerva materiálu %" value={settings.materialReservePercent} onChange={(value) => setSettings((prev) => ({ ...prev, materialReservePercent: value }))} right />
                <Field label="Km jedna cesta" value={settings.kmOneWay} onChange={(value) => setSettings((prev) => ({ ...prev, kmOneWay: value }))} right />
                <Field label="Počet návštěv" value={settings.visits} onChange={(value) => setSettings((prev) => ({ ...prev, visits: value }))} right />
                <Field label="Cena za km" value={settings.kmPrice} onChange={(value) => setSettings((prev) => ({ ...prev, kmPrice: value }))} right />
              </div>
            </Card>

            <Card>
              <h2 className="mb-2 text-lg font-black">Ceník práce</h2>
              <div className="space-y-2">
                {works.map((work) => (
                  <div key={work.id} className="grid grid-cols-[1fr_90px] gap-2">
                    <div className="truncate rounded-md bg-neutral-50 px-2 py-2 text-sm">{work.name}</div>
                    <input className="rounded-md border border-neutral-300 px-2 text-right" value={work.price} onChange={(event) => setWorks((prev) => prev.map((item) => (item.id === work.id ? { ...item, price: event.target.value } : item)))} />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-2 text-lg font-black">Doplňkové náklady</h2>
              <div className="space-y-2">
                {globalRows.map((row) => (
                  <div key={row.id} className="grid grid-cols-[24px_1fr_70px_80px] gap-2">
                    <input type="checkbox" checked={row.on} onChange={(event) => setGlobalRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, on: event.target.checked } : item)))} />
                    <div className="truncate rounded-md bg-neutral-50 px-2 py-2 text-sm">{row.name}</div>
                    <input className="rounded-md border border-neutral-300 px-2 text-right" value={row.qty} onChange={(event) => setGlobalRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, qty: event.target.value } : item)))} />
                    <input className="rounded-md border border-neutral-300 px-2 text-right" value={row.price} onChange={(event) => setGlobalRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, price: event.target.value } : item)))} />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-2 text-lg font-black">Součet</h2>
              <SummaryRow label="Rezerva práce" value={calc.laborReserve} />
              <SummaryRow label="Materiál mezisoučet" value={calc.materialBaseTotal} />
              <SummaryRow label="Materiálová rezerva" value={calc.materialReserve} />
              <SummaryRow label={`Doprava (${f2(calc.transportKm)} km)`} value={calc.transportTotal} />
              <div className="mt-3 rounded-md bg-slate-950 p-3 text-right text-white">
                <div className="text-xs opacity-70">Celkem bez DPH</div>
                <div className="text-3xl font-black">{czk(calc.subtotal)}</div>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {previewOpen && <PreviewModal calc={calc} settings={settings} close={() => setPreviewOpen(false)} />}
    </main>
  );
}

function Card({ children, className = "", ...props }) {
  return (
    <div className={`min-w-0 rounded-md border border-neutral-200 bg-white p-4 shadow-sm transition ${className}`} {...props}>
      {children}
    </div>
  );
}

function WallGraphic({ wall, onMoveOpening }) {
  const width = Math.max(1, n(wall.width));
  const height = Math.max(1, n(wall.height));
  const ratio = width / height;
  const previewWidth = ratio >= 1 ? 280 : Math.max(170, 280 * ratio);
  const previewHeight = ratio >= 1 ? Math.max(150, 280 / ratio) : 280;
  const scaleX = previewWidth / width;
  const scaleY = previewHeight / height;
  const stats = wallStats(wall);
  const moveOpening = (event, opening) => {
    if (!onMoveOpening) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = clamp(opening.x, 0, width - n(opening.width));
    const startBottom = clamp(opening.y, 0, height - n(opening.height));

    const onMove = (moveEvent) => {
      const deltaX = (moveEvent.clientX - startX) / scaleX;
      const deltaY = (startY - moveEvent.clientY) / scaleY;
      onMoveOpening(opening.id, {
        x: Math.round(clamp(startLeft + deltaX, 0, width - n(opening.width))),
        y: Math.round(clamp(startBottom + deltaY, 0, height - n(opening.height))),
      });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-black">Grafický náhled</h2>
          <p className="text-[11px] text-neutral-500">Otvor přetáhni myší, nebo uprav hodnoty zleva a od podlahy.</p>
        </div>
        <div className="text-right text-[11px] text-neutral-500">
          {f2(stats.clean)} m²
          <br />
          {width} × {height} cm
        </div>
      </div>
      <div className="flex min-h-[310px] items-center justify-center rounded-md bg-white p-3">
        <div
          className="relative border-2 border-neutral-800 bg-[linear-gradient(135deg,#fafafa_0%,#fafafa_49%,#f1f5f9_50%,#fafafa_51%,#fafafa_100%)] shadow-inner"
          style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
        >
          <div className="absolute left-0 right-0 bottom-0 border-t border-dashed border-neutral-300" />
          {wall.openings.map((opening) => {
            const kind = openingKind(opening);
            const inferred = kind === "other" ? inferOtherOpening(opening) : null;
            const left = clamp(opening.x, 0, width - n(opening.width)) * scaleX;
            const bottom = clamp(opening.y, 0, height - n(opening.height)) * scaleY;
            const openingWidth = Math.max(8, n(opening.width) * scaleX);
            const openingHeight = Math.max(8, n(opening.height) * scaleY);
            return (
              <div
                key={opening.id}
                onPointerDown={(event) => moveOpening(event, opening)}
                className={`absolute grid cursor-move touch-none select-none place-items-center border-2 text-[10px] font-black ${
                  kind === "door" ? "border-amber-700 bg-amber-100 text-amber-950" : kind === "other" ? inferred.className : "border-sky-700 bg-sky-100 text-sky-950"
                }`}
                style={{
                  left: `${left}px`,
                  bottom: `${bottom}px`,
                  width: `${openingWidth}px`,
                  height: `${openingHeight}px`,
                }}
                title={`${kind === "other" ? inferred.label : opening.name}: ${opening.width} × ${opening.height} cm, zleva ${opening.x} cm, od podlahy ${opening.y} cm`}
              >
                {kind === "other" ? (
                  <span className="flex flex-col items-center leading-none">
                    <span className="text-sm">{inferred.mark}</span>
                    <span className="max-w-full truncate px-1">{inferred.label}</span>
                  </span>
                ) : (
                  <span className="-rotate-45 whitespace-nowrap opacity-80">{kind === "door" ? "Dveře" : "Okno"}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-neutral-500">
        <div>
          Hrubá: <b className="text-neutral-800">{f2(stats.gross)} m²</b>
        </div>
        <div className="text-right">
          Odečty: <b className="text-neutral-800">-{f2(stats.openings)} m²</b>
        </div>
      </div>
    </div>
  );
}

function Button({ children, onClick, variant = "primary" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold ${variant === "primary" ? "bg-slate-950 text-white" : "border border-neutral-300 bg-white text-neutral-900"}`}
    >
      {children}
    </button>
  );
}

function Label({ children }) {
  return <div className="mb-1 text-[11px] font-bold uppercase text-neutral-500">{children}</div>;
}

function Field({ label, value, onChange, right = false }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input value={value} onChange={(event) => onChange(event.target.value)} className={`h-10 w-full rounded-md border border-neutral-300 px-3 ${right ? "text-right" : ""}`} />
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-neutral-100 py-2 text-sm">
      <span className="text-neutral-500">{label}</span>
      <b>{czk(value)}</b>
    </div>
  );
}

function PreviewModal({ calc, settings, close }) {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-neutral-950/60 p-4">
      <div className="mx-auto mb-3 flex max-w-[980px] justify-end gap-2 print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Tisk
        </Button>
        <Button variant="outline" onClick={close}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="mx-auto max-w-[980px] bg-white p-6 shadow-2xl print:max-w-none print:p-0 print:shadow-none">
        <Preview calc={calc} settings={settings} />
      </div>
    </div>
  );
}

function Preview({ calc, settings }) {
  return (
    <div>
      <header className="flex items-start justify-between border-b border-neutral-300 pb-4">
        <div>
          <div className="text-xs font-semibold uppercase text-neutral-500">{company.subtitle}</div>
          <h1 className="mt-1 text-2xl font-black">{company.name}</h1>
          <div className="mt-3 text-sm leading-6 text-neutral-700">
            <div>{company.address}</div>
            <div>IČO: {company.ico}</div>
            <div>{company.phone} · {company.email}</div>
            <div>{company.web}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase text-neutral-500">Kalkulace oprav omítek</div>
          <div className="mt-1 text-sm text-neutral-600">Datum: {new Date().toLocaleDateString("cs-CZ")}</div>
          <div className="mt-3 text-3xl font-black">{czk(calc.subtotal)}</div>
          <div className="text-xs text-neutral-500">Cena bez DPH - neplátce</div>
        </div>
      </header>

      <Section title="Souhrn ploch">
        <Table>
          <thead>
            <tr className="bg-neutral-100">
              <Th>Stěna</Th>
              <Th>Rozsah</Th>
              <Th right>Hrubá plocha</Th>
              <Th right>Odečty</Th>
              <Th right>Čistá plocha</Th>
            </tr>
          </thead>
          <tbody>
            {calc.wallRows.map((wall) => (
              <tr key={wall.id}>
                <Td strong>{wall.name}</Td>
                <Td>{scopeText(wall.scope)}</Td>
                <Td right>{f2(wall.stats.gross)} m²</Td>
                <Td right>-{f2(wall.stats.openings)} m²</Td>
                <Td right strong>{f2(wall.stats.clean)} m²</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section title="Položkový rozpočet">
        <Table>
          <thead>
            <tr className="bg-neutral-100">
              <Th>Položka</Th>
              <Th>MJ</Th>
              <Th right>Množství</Th>
              <Th right>Cena/MJ</Th>
              <Th right>Celkem</Th>
            </tr>
          </thead>
          <tbody>
            {calc.workRows.map((row) => <BudgetRow key={row.id} row={row} />)}
            <BudgetRow row={{ name: `Rezerva na práci a časovou náročnost ${f2(settings.laborReservePercent)}%`, unit: "kpl", qty: 1, price: calc.laborReserve, total: calc.laborReserve }} className="bg-blue-50" />
            {calc.materialRows.map((row) => <BudgetRow key={row.id} row={row} className="bg-amber-50/50" />)}
            <BudgetRow row={{ name: `Cenová rezerva na materiál ${f2(settings.materialReservePercent)}%`, unit: "kpl", qty: 1, price: calc.materialReserve, total: calc.materialReserve }} className="bg-amber-50" />
            <BudgetRow row={{ name: `Doprava - ${settings.visits}× tam a zpět`, unit: "km", qty: calc.transportKm, price: settings.kmPrice, total: calc.transportTotal }} className="bg-neutral-100" />
            {calc.rounding !== 0 && <BudgetRow row={{ name: "Zaokrouhlení na celé Kč", unit: "kpl", qty: 1, price: calc.rounding, total: calc.rounding }} className="bg-neutral-50" />}
          </tbody>
        </Table>
      </Section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-bold uppercase text-neutral-600">Doprava</h2>
          <SimpleTable rows={[["Km jedna cesta", `${f2(settings.kmOneWay)} km`], ["Počet návštěv", settings.visits], ["Celkem km", `${f2(calc.transportKm)} km`], ["Cena za km", czk(settings.kmPrice)]]} />
        </div>
        <div>
          <h2 className="mb-2 text-sm font-bold uppercase text-neutral-600">Rekapitulace</h2>
          <SimpleTable rows={[["Rezerva práce", czk(calc.laborReserve)], ["Materiál mezisoučet", czk(calc.materialBaseTotal)], ["Materiál celkem", czk(calc.materialBaseTotal + calc.materialReserve)], ...(calc.rounding !== 0 ? [["Zaokrouhlení", czk(calc.rounding)]] : []), ["DPH", "Neplátce DPH"], ["Celkem", czk(calc.subtotal)]]} />
        </div>
      </section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-sm font-bold uppercase text-neutral-600">{title}</h2>
      {children}
    </section>
  );
}

function Table({ children }) {
  return <table className="w-full border-collapse text-xs">{children}</table>;
}

function BudgetRow({ row, className = "" }) {
  return (
    <tr className={className}>
      <Td strong={className !== ""}>{row.name}</Td>
      <Td center>{row.unit}</Td>
      <Td right>{f2(row.qty)}</Td>
      <Td right>{czk(row.price)}</Td>
      <Td right strong>{czk(row.total)}</Td>
    </tr>
  );
}

function SimpleTable({ rows }) {
  return (
    <Table>
      <tbody>
        {rows.map((row) => (
          <tr key={row[0]}>
            <Th>{row[0]}</Th>
            <Td>{row[1]}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function Th({ children, right = false }) {
  return <th className={`border border-neutral-300 bg-neutral-100 p-2 text-left ${right ? "text-right" : ""}`}>{children}</th>;
}

function Td({ children, right = false, center = false, strong = false }) {
  return <td className={`border border-neutral-300 p-2 ${right ? "text-right" : ""} ${center ? "text-center" : ""} ${strong ? "font-bold" : ""}`}>{children}</td>;
}
