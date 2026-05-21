"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Download,
  Plus,
  Printer,
  Route,
  Trash2,
  X,
} from "lucide-react";

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const n = (value) => {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
};

const countValue = (value) => {
  if (value === "" || value === null || value === undefined) return 1;
  return Math.max(0, n(value));
};

const czk = (value) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(n(value));

const f2 = (value) => n(value).toFixed(2);
const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const company = {
  subtitle: "ZEDNICKÉ PRÁCE",
  name: "YURII FENCHAK",
  address: "Česká Kubice č. 6, 345 32",
  ico: "21693021",
  phone: "+420 775 237 325",
  email: "fenchak1903@gmail.com",
  web: "fenchak.cz",
};

const baseWorks = [
  { id: "oklep", name: "Oklepání vypouklých / nesoudržných omítek", unit: "m²", price: 54, scope: "wall", on: false },
  { id: "skrabani", name: "Škrábání zdiva", unit: "m²", price: 54, scope: "wall", on: false },
  { id: "perlinka", name: "Penetrace + armování perlinkou + štukování", unit: "m²", price: 585, scope: "wall", on: false },
  { id: "adhez", name: "Adhezní můstek + štukování", unit: "m²", price: 317, scope: "wall", on: false },
  { id: "malba", name: "Výmalba bílou barvou", unit: "m²", price: 75, scope: "wall", on: false },
  { id: "zacisteni", name: "Zednické začištění vybouraných částí", unit: "kpl", price: 15620, scope: "wall", on: false },
  { id: "leseni", name: "Pronájem lešení", unit: "den", price: 3500, scope: "global", on: false },
  { id: "rezije", name: "Režie, přesun hmot, likvidace materiálu", unit: "kpl", price: 5000, scope: "global", on: true },
  { id: "rezerva_voda", name: "Rezerva po vodní škodě a nepředvídané práce", unit: "kpl", price: 8000, scope: "global", on: true },
];

const baseMaterials = [
  { id: "penetrace", name: "Penetrace hloubková", source: "plaster", unit: "l", cons: 0.15, reserve: 10, price: 120, qty: 1, on: true },
  { id: "perlinka_mat", name: "Perlinka / armovací tkanina", source: "plaster", unit: "m²", cons: 1.1, reserve: 10, price: 25, qty: 1, on: true },
  { id: "lepidlo", name: "Lepidlo / stěrka pod perlinku", source: "plaster", unit: "kg", cons: 4, reserve: 10, price: 16, qty: 1, on: true },
  { id: "stuk", name: "Štuková omítka", source: "plaster", unit: "kg", cons: 2.5, reserve: 10, price: 15, qty: 1, on: true },
  { id: "barva", name: "Bílá interiérová barva", source: "paint", unit: "l", cons: 0.25, reserve: 10, price: 95, qty: 1, on: true },
  { id: "folie", name: "Zakrývací fólie a malířské pásky", source: "fixed", unit: "kpl", cons: 1, reserve: 0, price: 700, qty: 1, on: true },
  { id: "brusivo", name: "Brusivo, pytle, spotřební materiál", source: "fixed", unit: "kpl", cons: 1, reserve: 0, price: 800, qty: 1, on: true },
];

const yuriiReferenceOffer = [
  { id: "ref-priprava", name: "Připravit základnu, demontáž starých omítek a cihel, penetrování", min: 4500, max: 6000 },
  { id: "ref-marmolit", name: "Zazdít a srovnat základ, nahodit omítku, perlinka, mozaiková omítka Marmolit", min: 9500, max: 11500 },
  { id: "ref-hydro", name: "Hydroizolace, montáž sloupové hlavice", min: 6000, max: 7000 },
  { id: "ref-zed", name: "Opravit zeď, štuk a vymalovat", min: 10000, max: 12000 },
  { id: "ref-schody", name: "Pásky z dlaždic na schodech", min: 2500, max: 3000 },
  { id: "ref-doprava", name: "Doprava na stavbu včetně odvozu suti", min: 3500, max: 3500 },
];

const wallDefaults = (works) =>
  Object.fromEntries(works.filter((work) => work.scope === "wall").map((work) => [work.id, work.on]));

const pickedWallWorks = (...ids) =>
  Object.fromEntries(baseWorks.filter((work) => work.scope === "wall").map((work) => [work.id, ids.includes(work.id)]));

const globalDefaults = (works) =>
  Object.fromEntries(works.filter((work) => work.scope === "global").map((work) => [work.id, work.on]));

const qtyDefaults = (works) => Object.fromEntries(works.map((work) => [work.id, 1]));
const toM = (value, unit) => (unit === "cm" ? n(value) / 100 : n(value));
const calcLineArea = (width, height, count, unit) => toM(width, unit) * toM(height, unit) * countValue(count);

const scopeText = (scope) => {
  if (scope === "visual") return "Navazující / pohledová";
  if (scope === "preventive") return "Nutná technologicky";
  return "Poškozená";
};

function wallStats(wall, unit) {
  const gross = calcLineArea(wall.width, wall.height, 1, unit);
  const openings = wall.openings.reduce(
    (sum, opening) => sum + calcLineArea(opening.width, opening.height, opening.count, unit),
    0,
  );
  return { gross, openings, clean: Math.max(0, gross - openings), over: openings > gross };
}

function unitConvert(value, from, to) {
  if (from === to) return value;
  const numeric = n(value);
  if (!numeric) return value;
  return String(Math.round((to === "cm" ? numeric * 100 : numeric / 100) * 1000) / 1000).replace(".", ",");
}

function Button({ children, onClick, variant = "primary", className = "", disabled = false, type = "button" }) {
  const base = "inline-flex items-center justify-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition disabled:opacity-40";
  const style =
    variant === "primary"
      ? "bg-slate-950 text-white hover:bg-slate-800"
      : variant === "ghost"
        ? "bg-transparent hover:bg-neutral-100"
        : "border border-neutral-300 bg-white hover:bg-neutral-50";

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${style} ${className}`}>
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={`min-w-0 rounded-md border border-neutral-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function Label({ children }) {
  return <div className="mb-1 text-[11px] font-medium uppercase text-neutral-500">{children}</div>;
}

function Field({ label, value, onChange, bold = false, right = false }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-md border border-neutral-300 px-3 py-2 ${bold ? "font-bold" : ""} ${right ? "text-right" : ""}`}
      />
    </div>
  );
}

export default function KalkulacePage() {
  const [unit, setUnit] = useState("cm");
  const [vatPayer, setVatPayer] = useState(false);
  const [vat, setVat] = useState(0);
  const [works, setWorks] = useState(baseWorks);
  const [materials, setMaterials] = useState(baseMaterials);
  const [walls, setWalls] = useState([
    { id: uid(), name: "Stěna 1", width: 230.4, height: 270, scope: "damaged", note: "", openings: [], workOn: pickedWallWorks("oklep", "perlinka", "malba"), workQty: qtyDefaults(baseWorks), openWorks: false },
    {
      id: uid(),
      name: "Stěna 2",
      width: 400,
      height: 380,
      scope: "visual",
      note: "",
      openings: [
        { id: uid(), name: "Okno", width: 84, height: 160, count: 1 },
        { id: uid(), name: "Dveře", width: 200, height: 114, count: 1 },
      ],
      workOn: pickedWallWorks("malba"),
      workQty: qtyDefaults(baseWorks),
      openWorks: false,
    },
    { id: uid(), name: "Stěna 3", width: 80, height: 200, scope: "visual", note: "", openings: [], workOn: pickedWallWorks("oklep", "perlinka", "malba"), workQty: qtyDefaults(baseWorks), openWorks: false },
    {
      id: uid(),
      name: "Stěna 4",
      width: 410,
      height: 200,
      scope: "visual",
      note: "",
      openings: [
        { id: uid(), name: "Dveře", width: 100, height: 180, count: 1 },
        { id: uid(), name: "Okno", width: 100, height: 90, count: 1 },
      ],
      workOn: pickedWallWorks("oklep", "perlinka", "malba"),
      workQty: qtyDefaults(baseWorks),
      openWorks: false,
    },
  ]);
  const [globalOn, setGlobalOn] = useState(globalDefaults(baseWorks));
  const [globalQty, setGlobalQty] = useState(qtyDefaults(baseWorks));
  const [manual, setManual] = useState([]);
  const [showYuriiReference, setShowYuriiReference] = useState(true);
  const [materialReserveExtra, setMaterialReserveExtra] = useState(15);
  const [kmOneWay, setKmOneWay] = useState(25);
  const [kmPrice, setKmPrice] = useState(18);
  const [visits, setVisits] = useState(1);
  const [printOpen, setPrintOpen] = useState(false);

  const grid = { gridTemplateColumns: "minmax(220px,1fr) 112px 112px 72px 150px minmax(160px,1fr) 46px" };
  const panel = "rounded-md border border-neutral-200 bg-neutral-50 p-4";
  const wallWorks = works.filter((work) => work.scope === "wall");
  const globalWorks = works.filter((work) => work.scope === "global");

  const matArea = (material) => {
    if (material.source === "fixed") return 0;
    return walls.reduce((sum, wall) => {
      const selectedNames = wallWorks.filter((work) => wall.workOn?.[work.id]).map((work) => work.name.toLowerCase());
      const area = wallStats(wall, unit).clean;

      if (material.source === "paint") {
        return selectedNames.some((name) => name.includes("malba") || name.includes("výmalba")) ? sum + area : sum;
      }

      if (material.source === "plaster") {
        return selectedNames.some(
          (name) => name.includes("penetrace") || name.includes("perlink") || name.includes("štuk") || name.includes("adhez"),
        )
          ? sum + area
          : sum;
      }

      return sum + area;
    }, 0);
  };

  const materialRows = useMemo(
    () =>
      materials
        .filter((material) => material.on)
        .map((material) => {
          const baseQty = material.source === "fixed" ? n(material.qty) : matArea(material) * n(material.cons);
          const qty = baseQty * (1 + n(material.reserve) / 100);
          const price = n(material.price);
          return { id: `mat-${material.id}`, name: `Materiál: ${material.name}`, unit: material.unit, qty, price, total: qty * price };
        }),
    [materials, walls, works, unit],
  );

  const rows = useMemo(() => {
    const wallRows = walls.flatMap((wall) => {
      const stats = wallStats(wall, unit);
      return wallWorks.filter((work) => wall.workOn?.[work.id]).map((work) => {
        const qty = work.unit === "m²" ? stats.clean : Math.max(0, n(wall.workQty?.[work.id] ?? 1));
        const price = n(work.price);
        return { id: `w-${wall.id}-${work.id}`, name: `${wall.name}: ${work.name}`, unit: work.unit, qty, price, total: qty * price };
      });
    });

    const globalRows = globalWorks.filter((work) => globalOn?.[work.id]).map((work) => {
      const qty = Math.max(0, n(globalQty?.[work.id] ?? 1));
      const price = n(work.price);
      return { id: `g-${work.id}`, name: work.name, unit: work.unit, qty, price, total: qty * price };
    });

    const manualRows = manual.map((item) => ({
      id: item.id,
      name: item.name,
      unit: item.unit,
      qty: n(item.qty),
      price: n(item.price),
      total: n(item.qty) * n(item.price),
    }));

    return [...wallRows, ...globalRows, ...manualRows];
  }, [walls, works, globalOn, globalQty, manual, unit]);

  const materialBaseTotal = materialRows.reduce((sum, row) => sum + row.total, 0);
  const materialExtraReserveAmount = (materialBaseTotal * n(materialReserveExtra)) / 100;
  const materialTotal = materialBaseTotal + materialExtraReserveAmount;
  const visitsSafe = Math.max(1, n(visits));
  const transportKm = n(kmOneWay) * 2 * visitsSafe;
  const transportTotal = transportKm * n(kmPrice);
  const subtotal = rows.reduce((sum, row) => sum + row.total, 0) + materialTotal + transportTotal;
  const vatRate = vatPayer ? n(vat) : 0;
  const vatAmount = (subtotal * vatRate) / 100;
  const grandTotal = subtotal + vatAmount;
  const totalArea = walls.reduce((sum, wall) => sum + wallStats(wall, unit).clean, 0);
  const damagedArea = walls.filter((wall) => wall.scope === "damaged").reduce((sum, wall) => sum + wallStats(wall, unit).clean, 0);
  const relatedArea = totalArea - damagedArea;

  const updateWall = (wallId, patch) => setWalls((previous) => previous.map((wall) => (wall.id === wallId ? { ...wall, ...patch } : wall)));
  const updateOpening = (wallId, openingId, patch) =>
    setWalls((previous) =>
      previous.map((wall) =>
        wall.id !== wallId
          ? wall
          : { ...wall, openings: wall.openings.map((opening) => (opening.id === openingId ? { ...opening, ...patch } : opening)) },
      ),
    );
  const updateWork = (workId, patch) => setWorks((previous) => previous.map((work) => (work.id === workId ? { ...work, ...patch } : work)));
  const updateMaterial = (materialId, patch) =>
    setMaterials((previous) => previous.map((material) => (material.id === materialId ? { ...material, ...patch } : material)));
  const setWallWork = (wallId, workId, checked) =>
    setWalls((previous) => previous.map((wall) => (wall.id === wallId ? { ...wall, workOn: { ...wall.workOn, [workId]: checked } } : wall)));
  const setWallQty = (wallId, workId, value) =>
    setWalls((previous) => previous.map((wall) => (wall.id === wallId ? { ...wall, workQty: { ...wall.workQty, [workId]: value } } : wall)));

  const changeUnit = (next) => {
    setWalls((previous) =>
      previous.map((wall) => ({
        ...wall,
        width: unitConvert(wall.width, unit, next),
        height: unitConvert(wall.height, unit, next),
        openings: wall.openings.map((opening) => ({
          ...opening,
          width: unitConvert(opening.width, unit, next),
          height: unitConvert(opening.height, unit, next),
        })),
      })),
    );
    setUnit(next);
  };

  const addWall = () =>
    setWalls((previous) => [
      ...previous,
      {
        id: uid(),
        name: `Stěna ${previous.length + 1}`,
        width: 0,
        height: 0,
        scope: "visual",
        note: "",
        openings: [],
        workOn: wallDefaults(works),
        workQty: qtyDefaults(works),
        openWorks: false,
      },
    ]);

  const addWork = () => {
    const work = { id: uid(), name: "Nový úkon", unit: "m²", price: 0, scope: "wall", on: false };
    setWorks((previous) => [...previous, work]);
    setWalls((previous) =>
      previous.map((wall) => ({
        ...wall,
        workOn: { ...wall.workOn, [work.id]: false },
        workQty: { ...wall.workQty, [work.id]: 1 },
      })),
    );
  };

  const exportCsv = () => {
    const lines = [
      ["Položka", "MJ", "Množství", "Cena/MJ", "Celkem"],
      ...rows.map((row) => [row.name, row.unit, row.qty.toFixed(2), row.price, row.total.toFixed(2)]),
      ...materialRows.map((row) => [row.name, row.unit, row.qty.toFixed(2), row.price, row.total.toFixed(2)]),
      ["Rezerva materiálu", "%", f2(materialReserveExtra), "", materialExtraReserveAmount.toFixed(2)],
      ["Doprava", "km", transportKm.toFixed(2), kmPrice, transportTotal.toFixed(2)],
      ["", "", "", "Celkem", grandTotal.toFixed(2)],
    ];
    const csv = lines.map((line) => line.map(csvCell).join(";")).join(String.fromCharCode(10));
    const blob = new Blob([String.fromCharCode(0xfeff), csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "kalkulace.csv";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-2 text-neutral-900 print:bg-white print:p-0">
      <div className="mx-auto max-w-[1800px] space-y-2 print:max-w-none">
        <Header
          unit={unit}
          changeUnit={changeUnit}
          vatPayer={vatPayer}
          setVatPayer={setVatPayer}
          setVat={setVat}
          addWall={addWall}
          exportCsv={exportCsv}
          openPrint={() => setPrintOpen(true)}
          damagedArea={damagedArea}
          relatedArea={relatedArea}
          totalArea={totalArea}
        />
        <div className="grid min-w-0 gap-2 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)]">
          <div className="min-w-0 space-y-2">
            {walls.map((wall) => (
              <WallCard
                key={wall.id}
                wall={wall}
                walls={walls}
                unit={unit}
                grid={grid}
                panel={panel}
                wallWorks={wallWorks}
                updateWall={updateWall}
                updateOpening={updateOpening}
                setWalls={setWalls}
                setWallWork={setWallWork}
                setWallQty={setWallQty}
              />
            ))}
          </div>
          <div className="min-w-0 space-y-2">
            <WorkPanel works={works} addWork={addWork} updateWork={updateWork} removeWork={(workId) => setWorks((previous) => previous.filter((work) => work.id !== workId))} />
            <MaterialPanel
              materials={materials}
              updateMaterial={updateMaterial}
              addMaterial={() => setMaterials((previous) => [...previous, { id: uid(), name: "Nový materiál", source: "fixed", unit: "kpl", cons: 1, reserve: 0, price: 0, qty: 1, on: true }])}
              removeMaterial={(materialId) => setMaterials((previous) => previous.filter((material) => material.id !== materialId))}
              materialTotal={materialTotal}
              materialBaseTotal={materialBaseTotal}
              materialReserveExtra={materialReserveExtra}
              setMaterialReserveExtra={setMaterialReserveExtra}
              matArea={matArea}
            />
            <YuriiReferencePanel
              show={showYuriiReference}
              setShow={setShowYuriiReference}
            />
            <GlobalPanel globalWorks={globalWorks} globalOn={globalOn} setGlobalOn={setGlobalOn} globalQty={globalQty} setGlobalQty={setGlobalQty} />
            <TransportPanel
              kmOneWay={kmOneWay}
              setKmOneWay={setKmOneWay}
              visits={visits}
              setVisits={setVisits}
              kmPrice={kmPrice}
              setKmPrice={setKmPrice}
              transportKm={transportKm}
              visitsSafe={visitsSafe}
              transportTotal={transportTotal}
            />
            <ManualPanel manual={manual} setManual={setManual} />
          </div>
        </div>
        <TotalPanel
          rows={rows}
          transportKm={transportKm}
          visitsSafe={visitsSafe}
          kmPrice={kmPrice}
          transportTotal={transportTotal}
          materialTotal={materialTotal}
          subtotal={subtotal}
          vatPayer={vatPayer}
          vat={vat}
          setVat={setVat}
          vatRate={vatRate}
          vatAmount={vatAmount}
          grandTotal={grandTotal}
        />
        {printOpen && (
          <PrintPreview
            close={() => setPrintOpen(false)}
            rows={rows}
            materialRows={materialRows}
            walls={walls}
            unit={unit}
            kmOneWay={kmOneWay}
            visitsSafe={visitsSafe}
            transportKm={transportKm}
            kmPrice={kmPrice}
            transportTotal={transportTotal}
            materialBaseTotal={materialBaseTotal}
            materialReserveExtra={materialReserveExtra}
            materialExtraReserveAmount={materialExtraReserveAmount}
            materialTotal={materialTotal}
            subtotal={subtotal}
            vatPayer={vatPayer}
            vatRate={vatRate}
            vatAmount={vatAmount}
            grandTotal={grandTotal}
          />
        )}
      </div>
    </div>
  );
}

function Header({ unit, changeUnit, vatPayer, setVatPayer, setVat, addWall, exportCsv, openPrint, damagedArea, relatedArea, totalArea }) {
  return (
    <Card className="p-3 print:hidden">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-bold">Firemní kalkulačka nacenění</h1>
            <label className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs">
              Rozměry:
              <select className="rounded-md border border-neutral-300 p-1" value={unit} onChange={(event) => changeUnit(event.target.value)}>
                <option value="cm">cm</option>
                <option value="m">m</option>
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs">
              <input
                type="checkbox"
                checked={vatPayer}
                onChange={(event) => {
                  setVatPayer(event.target.checked);
                  setVat(event.target.checked ? 12 : 0);
                }}
              />
              Plátce DPH
            </label>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Poškozená plocha: {f2(damagedArea)} m² · Navazující: {f2(relatedArea)} m² · Celkem: {f2(totalArea)} m²
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={addWall}>
            <Plus className="h-4 w-4" />
            Přidat stěnu
          </Button>
          <Button variant="outline" onClick={exportCsv}>
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" onClick={openPrint}>
            <Printer className="h-4 w-4" />
            Náhled tisku
          </Button>
        </div>
      </div>
    </Card>
  );
}

function WallCard({ wall, walls, unit, grid, panel, wallWorks, updateWall, updateOpening, setWalls, setWallWork, setWallQty }) {
  const stats = wallStats(wall, unit);
  const selected = wallWorks.filter((work) => wall.workOn?.[work.id]);
  const workSum = selected.reduce(
    (sum, work) => sum + (work.unit === "m²" ? stats.clean : Math.max(0, n(wall.workQty?.[work.id] ?? 1))) * n(work.price),
    0,
  );

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="overflow-x-auto px-1">
          <div className="grid min-w-[1020px] items-end gap-2" style={grid}>
            <Field label="Položka" value={wall.name} onChange={(value) => updateWall(wall.id, { name: value })} bold />
            <Field label={`Šířka (${unit})`} value={wall.width} onChange={(value) => updateWall(wall.id, { width: value })} />
            <Field label={`Výška (${unit})`} value={wall.height} onChange={(value) => updateWall(wall.id, { height: value })} />
            <div>
              <Label>Počet</Label>
              <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-right text-neutral-500">1</div>
            </div>
            <div>
              <Label>Celkem stěna</Label>
              <div className="rounded-md bg-neutral-200/80 px-3 py-2 text-right font-bold">{f2(stats.gross)} m²</div>
            </div>
            <div>
              <Label>Rozsah</Label>
              <select className="w-full rounded-md border border-neutral-300 px-3 py-2" value={wall.scope} onChange={(event) => updateWall(wall.id, { scope: event.target.value })}>
                <option value="damaged">Poškozená</option>
                <option value="visual">Navazující / pohledová</option>
                <option value="preventive">Nutná technologicky</option>
              </select>
            </div>
            <div className="flex h-full items-end justify-end">
              <Button variant="ghost" disabled={walls.length === 1} onClick={() => setWalls((previous) => previous.filter((item) => item.id !== wall.id))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <Openings wall={wall} unit={unit} grid={grid} panel={panel} updateWall={updateWall} updateOpening={updateOpening} />
        <WallWorks
          wall={wall}
          stats={stats}
          panel={panel}
          wallWorks={wallWorks}
          selectedCount={selected.length}
          workSum={workSum}
          updateWall={updateWall}
          setWallWork={setWallWork}
          setWallQty={setWallQty}
        />
        <label className="block text-sm font-medium">
          Poznámka k důvodu zahrnutí stěny
          <textarea
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
            rows={2}
            value={wall.note}
            placeholder="Např. lokální oprava by byla viditelná, proto je nutné opravit plochu do rohů / navazující stěnu."
            onChange={(event) => updateWall(wall.id, { note: event.target.value })}
          />
        </label>
        <AreaBox stats={stats} scope={wall.scope} />
      </div>
    </Card>
  );
}

function Openings({ wall, unit, grid, panel, updateWall, updateOpening }) {
  return (
    <div className={panel}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Odečty otvorů</h3>
          <p className="text-[11px] text-neutral-500">Okna, dveře a niky.</p>
        </div>
        <Button variant="outline" onClick={() => updateWall(wall.id, { openings: [...wall.openings, { id: uid(), name: "Otvor", width: 0, height: 0, count: 1 }] })}>
          <Plus className="h-4 w-4" />
          Otvor
        </Button>
      </div>
      <div className="overflow-x-auto">
        <div className="grid min-w-[1020px] gap-2 px-3 text-[11px] font-medium uppercase text-neutral-500" style={grid}>
          <div>Otvor</div>
          <div>Šířka ({unit})</div>
          <div>Výška ({unit})</div>
          <div>Počet</div>
          <div className="text-right">Celkem odečet</div>
          <div />
          <div />
        </div>
        <div className="mt-2 space-y-2">
          {wall.openings.length === 0 && <div className="rounded-md border border-dashed bg-white px-3 py-3 text-sm text-neutral-500">Žádné odečty.</div>}
          {wall.openings.map((opening) => (
            <div key={opening.id} className="grid min-w-[1020px] items-center gap-2 rounded-md border border-neutral-100 bg-white px-3 py-3 shadow-sm" style={grid}>
              <input className="w-full rounded-md border border-neutral-300 px-3 py-2" value={opening.name} onChange={(event) => updateOpening(wall.id, opening.id, { name: event.target.value })} />
              <input className="w-full rounded-md border border-neutral-300 px-3 py-2" value={opening.width} onChange={(event) => updateOpening(wall.id, opening.id, { width: event.target.value })} />
              <input className="w-full rounded-md border border-neutral-300 px-3 py-2" value={opening.height} onChange={(event) => updateOpening(wall.id, opening.id, { height: event.target.value })} />
              <input className="w-full rounded-md border border-neutral-300 px-3 py-2 text-right" value={opening.count} onChange={(event) => updateOpening(wall.id, opening.id, { count: event.target.value })} />
              <div className="rounded-md bg-neutral-200/70 px-3 py-2 text-right font-bold">-{f2(calcLineArea(opening.width, opening.height, opening.count, unit))} m²</div>
              <div />
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => updateWall(wall.id, { openings: wall.openings.filter((item) => item.id !== opening.id) })}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WallWorks({ wall, stats, panel, wallWorks, selectedCount, workSum, updateWall, setWallWork, setWallQty }) {
  return (
    <div className={panel}>
      <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => updateWall(wall.id, { openWorks: !wall.openWorks })}>
        <div className="flex items-center gap-2">
          {wall.openWorks ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <div>
            <div className="text-sm font-semibold">Úkony pro tuto stěnu</div>
            <div className="text-[11px] text-neutral-500">Vybrané práce a ceny.</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold">{czk(workSum)}</div>
          <div className="text-[11px] text-neutral-500">{selectedCount} vybráno</div>
        </div>
      </button>
      {wall.openWorks && (
        <div className="mt-3 space-y-1 border-t border-neutral-200 pt-3">
          {wallWorks.map((work) => {
            const checked = Boolean(wall.workOn?.[work.id]);
            const qty = work.unit === "m²" ? stats.clean : Math.max(0, n(wall.workQty?.[work.id] ?? 1));
            const total = checked ? qty * n(work.price) : 0;
            return (
              <div key={work.id} className={`grid grid-cols-[28px_minmax(180px,1fr)_60px_74px_84px_96px] items-center gap-2 rounded-md px-2 py-2 ${checked ? "bg-white shadow-sm" : "opacity-60"}`}>
                <input type="checkbox" checked={checked} onChange={(event) => setWallWork(wall.id, work.id, event.target.checked)} className="h-5 w-5 accent-blue-600" />
                <div className="truncate text-sm font-medium">{work.name}</div>
                <div className="rounded-md bg-neutral-100 px-2 py-1.5 text-center text-sm">{work.unit}</div>
                {work.unit === "m²" ? (
                  <div className="rounded-md bg-neutral-100 px-2 py-1.5 text-right text-sm">{f2(qty)}</div>
                ) : (
                  <input className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-right text-sm" value={wall.workQty?.[work.id] ?? 1} onChange={(event) => setWallQty(wall.id, work.id, event.target.value)} />
                )}
                <div className="rounded-md bg-neutral-100 px-2 py-1.5 text-right text-sm">{czk(work.price)}</div>
                <div className="rounded-md bg-neutral-100 px-2 py-1.5 text-right text-sm font-bold">{czk(total)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AreaBox({ stats, scope }) {
  return (
    <div className="flex justify-end">
      <div className="w-full max-w-[260px] rounded-md bg-neutral-100 px-4 py-3">
        <div className="text-xs font-medium text-neutral-500">Přehled plochy</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <div className="text-[11px] text-neutral-500">Hrubá</div>
            <div className="text-[15px] font-bold">{f2(stats.gross)} m²</div>
          </div>
          <div>
            <div className="text-[11px] text-neutral-500">Odečty</div>
            <div className="text-[15px] font-bold">-{f2(stats.openings)} m²</div>
          </div>
        </div>
        <div className="mt-2 border-t border-neutral-200 pt-2">
          <div className="text-[11px] text-neutral-500">Čistá plocha</div>
          <div className="text-[22px] font-black leading-none">{f2(stats.clean)} m²</div>
          <div className="mt-1 text-[10px] text-neutral-500">{scopeText(scope)}</div>
        </div>
        {stats.over && <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-[11px] text-amber-800">Odečty jsou větší než plocha stěny.</div>}
      </div>
    </div>
  );
}

function WorkPanel({ works, addWork, updateWork, removeWork }) {
  return (
    <Card className="p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Ceník úkonů</h2>
        <Button variant="outline" onClick={addWork}>
          <Plus className="h-4 w-4" />
          Přidat
        </Button>
      </div>
      <div className="space-y-1 rounded-md border border-neutral-200 bg-neutral-50 p-3">
        {works.map((work) => (
          <div key={work.id} className="grid grid-cols-[1fr_70px_90px_36px] items-center gap-2 rounded-md bg-white p-2 shadow-sm">
            <input className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm" value={work.name} onChange={(event) => updateWork(work.id, { name: event.target.value })} />
            <select className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm" value={work.unit} onChange={(event) => updateWork(work.id, { unit: event.target.value })}>
              <option>m²</option>
              <option>kpl</option>
              <option>bm</option>
              <option>hod</option>
              <option>den</option>
            </select>
            <input className="rounded-md border border-neutral-300 px-2 py-1.5 text-right text-sm" value={work.price} onChange={(event) => updateWork(work.id, { price: event.target.value })} />
            <Button variant="ghost" onClick={() => removeWork(work.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MaterialPanel({ materials, updateMaterial, addMaterial, removeMaterial, materialTotal, materialBaseTotal, materialReserveExtra, setMaterialReserveExtra, matArea }) {
  return (
    <Card className="p-3">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Materiál - odhad</h2>
          <p className="text-[11px] text-neutral-500">Předvyplněný odhad podle úkonů.</p>
        </div>
        <Button variant="outline" onClick={addMaterial}>
          <Plus className="h-4 w-4" />
          Přidat
        </Button>
      </div>
      <div className="overflow-x-auto rounded-md border border-neutral-200 bg-neutral-50 p-3">
        <div className="min-w-[760px] space-y-1">
          {materials.map((material) => {
            const base = material.source === "fixed" ? n(material.qty) : matArea(material) * n(material.cons);
            const qty = base * (1 + n(material.reserve) / 100);
            const total = material.on ? qty * n(material.price) : 0;
            return (
              <div key={material.id} className={`grid grid-cols-[28px_1fr_78px_56px_80px_56px_80px_90px_36px] items-center gap-2 rounded-md p-2 ${material.on ? "bg-white shadow-sm" : "opacity-60"}`}>
                <input type="checkbox" checked={material.on} onChange={(event) => updateMaterial(material.id, { on: event.target.checked })} className="h-5 w-5 accent-blue-600" />
                <input className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm" value={material.name} onChange={(event) => updateMaterial(material.id, { name: event.target.value })} />
                <select className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm" value={material.source} onChange={(event) => updateMaterial(material.id, { source: event.target.value })}>
                  <option value="plaster">omítky</option>
                  <option value="paint">malba</option>
                  <option value="all">vše</option>
                  <option value="fixed">fix</option>
                </select>
                <input className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm" value={material.unit} onChange={(event) => updateMaterial(material.id, { unit: event.target.value })} />
                <input
                  className="rounded-md border border-neutral-300 px-2 py-1.5 text-right text-sm"
                  value={material.source === "fixed" ? material.qty : material.cons}
                  onChange={(event) => updateMaterial(material.id, material.source === "fixed" ? { qty: event.target.value } : { cons: event.target.value })}
                />
                <input className="rounded-md border border-neutral-300 px-2 py-1.5 text-right text-sm" value={material.reserve} onChange={(event) => updateMaterial(material.id, { reserve: event.target.value })} />
                <input className="rounded-md border border-neutral-300 px-2 py-1.5 text-right text-sm" value={material.price} onChange={(event) => updateMaterial(material.id, { price: event.target.value })} />
                <div className="rounded-md bg-neutral-100 px-2 py-1.5 text-right text-sm font-bold">{czk(total)}</div>
                <Button variant="ghost" onClick={() => removeMaterial(material.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
        <div className="mt-2 grid gap-2 border-t border-neutral-200 pt-2 text-sm md:grid-cols-[1fr_120px]">
          <div className="text-neutral-500">Bezpečnostní rezerva na materiál / drobný rozdíl v nákupu</div>
          <input className="rounded-md border border-neutral-300 px-2 py-1.5 text-right" value={materialReserveExtra} onChange={(event) => setMaterialReserveExtra(event.target.value)} />
        </div>
        <div className="mt-1 text-right text-xs text-neutral-500">
          Mezisoučet materiálu: {czk(materialBaseTotal)} · rezerva {materialReserveExtra}%
        </div>
        <div className="mt-1 text-right text-sm">
          Materiál celkem: <b>{czk(materialTotal)}</b>
        </div>
      </div>
    </Card>
  );
}

function YuriiReferencePanel({ show, setShow }) {
  const min = yuriiReferenceOffer.reduce((sum, row) => sum + row.min, 0);
  const max = yuriiReferenceOffer.reduce((sum, row) => sum + row.max, 0);

  return (
    <Card className="p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Reálné ceny Yurii - srovnání</h2>
          <p className="text-[11px] text-neutral-500">
            Ukázka skutečné cenové hladiny podle dodané nabídky. Není započítaná do celkové kalkulace.
            Rozsah: min {czk(min)}, max {czk(max)}.
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={show} onChange={(event) => setShow(event.target.checked)} />
          zobrazit
        </label>
      </div>
      {show && (
        <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-100">
                <th className="border border-neutral-300 p-2 text-left">Položka</th>
                <th className="border border-neutral-300 p-2 text-right">Min</th>
                <th className="border border-neutral-300 p-2 text-right">Max</th>
              </tr>
            </thead>
            <tbody>
              {yuriiReferenceOffer.map((row) => (
                <tr key={row.id}>
                  <td className="border border-neutral-300 p-2">{row.name}</td>
                  <td className="border border-neutral-300 p-2 text-right">{czk(row.min)}</td>
                  <td className="border border-neutral-300 p-2 text-right">{czk(row.max)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="border border-neutral-300 p-2">Celkem</td>
                <td className="border border-neutral-300 p-2 text-right">{czk(min)}</td>
                <td className="border border-neutral-300 p-2 text-right">{czk(max)}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2 rounded-md bg-white px-3 py-2 text-xs text-neutral-600">
            Slouží jen jako kontrola, jestli automatická kalkulace neujíždí mimo reálné Yuriiho ceny.
          </div>
        </div>
      )}
    </Card>
  );
}

function GlobalPanel({ globalWorks, globalOn, setGlobalOn, globalQty, setGlobalQty }) {
  return (
    <Card className="p-3">
      <h2 className="mb-3 text-lg font-bold">Doplňkové náklady</h2>
      <div className="space-y-1 rounded-md border border-neutral-200 bg-neutral-50 p-3">
        {globalWorks.map((work) => {
          const checked = Boolean(globalOn?.[work.id]);
          const qty = Math.max(0, n(globalQty?.[work.id] ?? 1));
          const total = checked ? qty * n(work.price) : 0;
          return (
            <div key={work.id} className={`grid grid-cols-[28px_1fr_58px_68px_82px_94px] items-center gap-2 rounded-md p-2 ${checked ? "bg-white shadow-sm" : "opacity-60"}`}>
              <input type="checkbox" checked={checked} onChange={(event) => setGlobalOn((previous) => ({ ...previous, [work.id]: event.target.checked }))} className="h-5 w-5 accent-blue-600" />
              <div className="truncate text-sm font-medium">{work.name}</div>
              <div className="rounded-md bg-neutral-100 px-2 py-1.5 text-center text-sm">{work.unit}</div>
              <input className="rounded-md border border-neutral-300 px-2 py-1.5 text-right text-sm" value={globalQty?.[work.id] ?? 1} onChange={(event) => setGlobalQty((previous) => ({ ...previous, [work.id]: event.target.value }))} />
              <div className="rounded-md bg-neutral-100 px-2 py-1.5 text-right text-sm">{czk(work.price)}</div>
              <div className="rounded-md bg-neutral-100 px-2 py-1.5 text-right text-sm font-bold">{czk(total)}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function TransportPanel({ kmOneWay, setKmOneWay, visits, setVisits, kmPrice, setKmPrice, transportKm, visitsSafe, transportTotal }) {
  return (
    <Card className="p-3">
      <h2 className="mb-2 flex items-center gap-2 text-lg font-bold">
        <Route className="h-5 w-5" />
        Doprava
      </h2>
      <div className="grid gap-2 md:grid-cols-3">
        <Field label="Km jedna cesta" value={kmOneWay} onChange={setKmOneWay} />
        <Field label="Počet dní / návštěv" value={visits} onChange={setVisits} />
        <Field label="Cena za km" value={kmPrice} onChange={setKmPrice} />
      </div>
      <div className="mt-2 rounded-md bg-neutral-100 p-3 text-right">
        <div className="text-xs text-neutral-500">
          Celkem km: {f2(transportKm)} km · {visitsSafe}× tam a zpět
        </div>
        <div className="text-lg font-bold">{czk(transportTotal)}</div>
      </div>
    </Card>
  );
}

function ManualPanel({ manual, setManual }) {
  return (
    <Card className="p-3">
      <h2 className="mb-2 text-lg font-bold">Ruční položky</h2>
      <div className="space-y-2">
        {manual.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr_55px_70px_80px_40px] gap-2 rounded-md border border-neutral-200 p-2">
            <input className="rounded-md border border-neutral-300 px-2 py-1" value={item.name} onChange={(event) => setManual((previous) => previous.map((current) => (current.id === item.id ? { ...current, name: event.target.value } : current)))} />
            <input className="rounded-md border border-neutral-300 px-2 py-1" value={item.unit} onChange={(event) => setManual((previous) => previous.map((current) => (current.id === item.id ? { ...current, unit: event.target.value } : current)))} />
            <input className="rounded-md border border-neutral-300 px-2 py-1" value={item.qty} onChange={(event) => setManual((previous) => previous.map((current) => (current.id === item.id ? { ...current, qty: event.target.value } : current)))} />
            <input className="rounded-md border border-neutral-300 px-2 py-1" value={item.price} onChange={(event) => setManual((previous) => previous.map((current) => (current.id === item.id ? { ...current, price: event.target.value } : current)))} />
            <Button variant="ghost" onClick={() => setManual((previous) => previous.filter((current) => current.id !== item.id))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" className="mt-2 w-full" onClick={() => setManual((previous) => [...previous, { id: uid(), name: "Ruční položka", unit: "kpl", qty: 1, price: 0 }])}>
        <Plus className="h-4 w-4" />
        Přidat ruční položku
      </Button>
    </Card>
  );
}

function TotalPanel({ rows, transportKm, visitsSafe, kmPrice, transportTotal, materialTotal, subtotal, vatPayer, vat, setVat, vatRate, vatAmount, grandTotal }) {
  return (
    <Card className="p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-bold">Celková kalkulace</h2>
        {vatPayer && (
          <label className="text-sm font-medium">
            DPH %{" "}
            <input className="ml-2 w-16 rounded-md border border-neutral-300 px-2 py-1 text-right" value={vat} onChange={(event) => setVat(event.target.value)} />
          </label>
        )}
      </div>
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-neutral-200">
              <th className="border border-neutral-300 p-2 text-left">Položka</th>
              <th className="border border-neutral-300 p-2">MJ</th>
              <th className="border border-neutral-300 p-2 text-right">Množství</th>
              <th className="border border-neutral-300 p-2 text-right">Cena/MJ</th>
              <th className="border border-neutral-300 p-2 text-right">Celkem</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="border border-neutral-300 p-2">{row.name}</td>
                <td className="border border-neutral-300 p-2 text-center">{row.unit}</td>
                <td className="border border-neutral-300 p-2 text-right">{f2(row.qty)}</td>
                <td className="border border-neutral-300 p-2 text-right">{czk(row.price)}</td>
                <td className="border border-neutral-300 p-2 text-right font-medium">{czk(row.total)}</td>
              </tr>
            ))}
            <tr className="bg-amber-50">
              <td className="border border-neutral-300 p-2 font-medium">Materiál - odhad</td>
              <td className="border border-neutral-300 p-2 text-center">kpl</td>
              <td className="border border-neutral-300 p-2 text-right">1.00</td>
              <td className="border border-neutral-300 p-2 text-right">{czk(materialTotal)}</td>
              <td className="border border-neutral-300 p-2 text-right font-bold">{czk(materialTotal)}</td>
            </tr>
            <tr className="bg-neutral-100">
              <td className="border border-neutral-300 p-2 font-medium">Doprava - {visitsSafe}× tam a zpět</td>
              <td className="border border-neutral-300 p-2 text-center">km</td>
              <td className="border border-neutral-300 p-2 text-right">{f2(transportKm)}</td>
              <td className="border border-neutral-300 p-2 text-right">{czk(kmPrice)}</td>
              <td className="border border-neutral-300 p-2 text-right font-bold">{czk(transportTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="ml-auto mt-2 max-w-sm space-y-1 text-right">
        <div>
          Materiál odhad: <b>{czk(materialTotal)}</b>
        </div>
        <div>
          Celkem: <b>{czk(subtotal)}</b>
        </div>
        {vatPayer ? (
          <>
            <div>
              DPH {vatRate}%: <b>{czk(vatAmount)}</b>
            </div>
            <div className="text-lg font-bold">Celkem s DPH: {czk(grandTotal)}</div>
          </>
        ) : (
          <div className="text-xs text-neutral-500">Neplátce DPH</div>
        )}
      </div>
    </Card>
  );
}

function SimpleTable({ rows }) {
  return (
    <table className="mt-1 w-full border-collapse text-xs">
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row[0]}-${index}`}>
            <th className="border border-neutral-300 bg-neutral-100 p-2 text-left">{row[0]}</th>
            <td className="border border-neutral-300 p-2">{row[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PrintPreview({
  close,
  rows,
  materialRows,
  walls,
  unit,
  kmOneWay,
  visitsSafe,
  transportKm,
  kmPrice,
  transportTotal,
  materialBaseTotal,
  materialReserveExtra,
  materialExtraReserveAmount,
  materialTotal,
  subtotal,
  vatPayer,
  vatRate,
  vatAmount,
  grandTotal,
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-neutral-950/55 p-3 print:static print:overflow-visible print:bg-white print:p-0">
      <div className="mx-auto max-w-[980px] bg-white p-6 shadow-2xl print:max-w-none print:shadow-none">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <h2 className="text-lg font-bold">Náhled tisku</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Tisk
            </Button>
            <Button variant="ghost" onClick={close}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-5 text-neutral-900">
          <header className="flex flex-col gap-4 border-b border-neutral-300 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase text-neutral-500">{company.subtitle}</div>
              <h1 className="mt-1 text-2xl font-black">{company.name}</h1>
              <div className="mt-2 text-sm leading-6 text-neutral-700">
                <div>{company.address}</div>
                <div>IČO: {company.ico}</div>
                <div>{company.phone} · {company.email}</div>
                <div>{company.web}</div>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs font-semibold uppercase text-neutral-500">Kalkulace oprav omítek</div>
              <div className="mt-1 text-sm text-neutral-600">Datum: {new Date().toLocaleDateString("cs-CZ")}</div>
              <div className="mt-3 text-2xl font-black">{czk(grandTotal)}</div>
              <div className="text-xs text-neutral-500">{vatPayer ? "Celkem včetně DPH" : "Cena bez DPH - neplátce"}</div>
            </div>
          </header>

          <section>
            <h3 className="mb-2 text-sm font-bold uppercase text-neutral-600">Souhrn ploch</h3>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-100">
                  <th className="border border-neutral-300 p-2 text-left">Stěna</th>
                  <th className="border border-neutral-300 p-2 text-left">Rozsah</th>
                  <th className="border border-neutral-300 p-2 text-right">Hrubá plocha</th>
                  <th className="border border-neutral-300 p-2 text-right">Odečty</th>
                  <th className="border border-neutral-300 p-2 text-right">Čistá plocha</th>
                </tr>
              </thead>
              <tbody>
                {walls.map((wall) => {
                  const stats = wallStats(wall, unit);
                  return (
                    <tr key={wall.id}>
                      <td className="border border-neutral-300 p-2 font-medium">{wall.name}</td>
                      <td className="border border-neutral-300 p-2">{scopeText(wall.scope)}</td>
                      <td className="border border-neutral-300 p-2 text-right">{f2(stats.gross)} m²</td>
                      <td className="border border-neutral-300 p-2 text-right">-{f2(stats.openings)} m²</td>
                      <td className="border border-neutral-300 p-2 text-right font-bold">{f2(stats.clean)} m²</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-bold uppercase text-neutral-600">Položkový rozpočet</h3>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-100">
                  <th className="border border-neutral-300 p-2 text-left">Položka</th>
                  <th className="border border-neutral-300 p-2">MJ</th>
                  <th className="border border-neutral-300 p-2 text-right">Množství</th>
                  <th className="border border-neutral-300 p-2 text-right">Cena/MJ</th>
                  <th className="border border-neutral-300 p-2 text-right">Celkem</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="border border-neutral-300 p-2">{row.name}</td>
                    <td className="border border-neutral-300 p-2 text-center">{row.unit}</td>
                    <td className="border border-neutral-300 p-2 text-right">{f2(row.qty)}</td>
                    <td className="border border-neutral-300 p-2 text-right">{czk(row.price)}</td>
                    <td className="border border-neutral-300 p-2 text-right font-medium">{czk(row.total)}</td>
                  </tr>
                ))}
                {materialRows.map((row) => (
                  <tr key={row.id} className="bg-amber-50/50">
                    <td className="border border-neutral-300 p-2">{row.name}</td>
                    <td className="border border-neutral-300 p-2 text-center">{row.unit}</td>
                    <td className="border border-neutral-300 p-2 text-right">{f2(row.qty)}</td>
                    <td className="border border-neutral-300 p-2 text-right">{czk(row.price)}</td>
                    <td className="border border-neutral-300 p-2 text-right font-medium">{czk(row.total)}</td>
                  </tr>
                ))}
                <tr className="bg-amber-50">
                  <td className="border border-neutral-300 p-2 font-medium">Rezerva materiálu {f2(materialReserveExtra)}%</td>
                  <td className="border border-neutral-300 p-2 text-center">kpl</td>
                  <td className="border border-neutral-300 p-2 text-right">1.00</td>
                  <td className="border border-neutral-300 p-2 text-right">{czk(materialExtraReserveAmount)}</td>
                  <td className="border border-neutral-300 p-2 text-right font-bold">{czk(materialExtraReserveAmount)}</td>
                </tr>
                <tr className="bg-neutral-100">
                  <td className="border border-neutral-300 p-2 font-medium">Doprava - {visitsSafe}× tam a zpět</td>
                  <td className="border border-neutral-300 p-2 text-center">km</td>
                  <td className="border border-neutral-300 p-2 text-right">{f2(transportKm)}</td>
                  <td className="border border-neutral-300 p-2 text-right">{czk(kmPrice)}</td>
                  <td className="border border-neutral-300 p-2 text-right font-bold">{czk(transportTotal)}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase text-neutral-600">Doprava</h3>
              <SimpleTable
                rows={[
                  ["Km jedna cesta", `${f2(kmOneWay)} km`],
                  ["Počet návštěv", visitsSafe],
                  ["Celkem km", `${f2(transportKm)} km`],
                  ["Cena za km", czk(kmPrice)],
                ]}
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase text-neutral-600">Rekapitulace</h3>
              <SimpleTable
                rows={[
                  ["Materiál mezisoučet", czk(materialBaseTotal)],
                  ["Materiál celkem", czk(materialTotal)],
                  ["Mezisoučet", czk(subtotal)],
                  ...(vatPayer ? [[`DPH ${vatRate}%`, czk(vatAmount)]] : [["DPH", "Neplátce DPH"]]),
                  ["Celkem", czk(grandTotal)],
                ]}
              />
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-bold uppercase text-neutral-600">Poznámky ke stěnám</h3>
            <div className="space-y-2 text-xs">
              {walls.map((wall) => (
                <div key={`note-${wall.id}`} className="border-b border-neutral-200 pb-2">
                  <b>{wall.name}:</b> {wall.note || "Bez poznámky."}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
