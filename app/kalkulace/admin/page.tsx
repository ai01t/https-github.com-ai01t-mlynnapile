"use client";

// Administrace kalkulačky: údaje podnikatele + přednastavené ceny a sazby.
// Vše se ukládá do localStorage prohlížeče, v kódu nejsou žádné osobní údaje.

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, RotateCcw, Save, Search, Trash2 } from "lucide-react";
import {
  czAccountToIban,
  defaultCompany,
  fetchAres,
  n,
  storage,
  uid,
} from "../core";
import { BRAND, LogoMark } from "../Logo";

const CORE_WORK_IDS = ["oklep", "perlinka", "malba"];

const SOURCE_LABELS = {
  plaster: "dle plochy štukování (m²)",
  paint: "dle plochy výmalby (m²)",
  fixed: "pevné množství",
};

export default function AdminPage() {
  const [company, setCompany] = useState(defaultCompany);
  const [presets, setPresets] = useState({ works: [], globalRows: [], materials: [], settings: {} });
  const [loaded, setLoaded] = useState(false);
  const [flash, setFlash] = useState("");
  const [aresBusy, setAresBusy] = useState(false);
  const [aresError, setAresError] = useState("");

  useEffect(() => {
    setCompany(storage.loadCompany());
    setPresets(storage.loadPresets());
    setLoaded(true);
  }, []);

  const showFlash = (text) => {
    setFlash(text);
    setTimeout(() => setFlash(""), 2500);
  };

  const saveAll = () => {
    storage.saveCompany({
      ...company,
      dueDays: Math.max(0, Math.round(n(company.dueDays))) || 14,
      validityDays: Math.max(1, Math.round(n(company.validityDays))) || 30,
    });
    storage.savePresets(presets);
    showFlash("Uloženo ✓");
  };

  const factoryReset = () => {
    if (!window.confirm("Obnovit tovární nastavení? Smaže se uložený podnikatel i všechny přednastavené ceny (nabídky a faktury zůstávají).")) return;
    storage.clearPresets();
    setCompany(storage.loadCompany());
    setPresets(storage.loadPresets());
    showFlash("Obnoveno tovární nastavení");
  };

  const loadFromAres = async () => {
    setAresError("");
    setAresBusy(true);
    try {
      const data = await fetchAres(company.ico);
      setCompany((prev) => ({ ...prev, name: data.name, address: data.address, ico: data.ico, dic: data.dic || prev.dic }));
      showFlash("Načteno z ARES ✓");
    } catch (error) {
      setAresError(error.message);
    } finally {
      setAresBusy(false);
    }
  };

  const setWork = (id, patch) => setPresets((prev) => ({ ...prev, works: prev.works.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  const setRow = (id, patch) => setPresets((prev) => ({ ...prev, globalRows: prev.globalRows.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  const setMaterial = (id, patch) => setPresets((prev) => ({ ...prev, materials: prev.materials.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  const setSetting = (key, value) => setPresets((prev) => ({ ...prev, settings: { ...prev.settings, [key]: value } }));

  const iban = czAccountToIban(company.account);

  if (!loaded) return null;

  return (
    <main className="min-h-screen bg-neutral-100 p-3 text-neutral-900">
      <div className="mx-auto max-w-[1100px] space-y-3">
        <header className="sticky top-0 z-40 -mx-3 -mt-3 border-b-2 border-[#820c0c] bg-white/95 px-4 py-2 shadow-md backdrop-blur">
          <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-3">
            <LogoMark className="h-10 w-10 text-neutral-900" />
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight" style={{ color: BRAND }}>Administrace</h1>
              <div className="text-xs text-neutral-500">Údaje podnikatele a přednastavené ceny{flash && <span className="ml-2 font-bold text-emerald-600">{flash}</span>}</div>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <a href="/kalkulace" className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-bold shadow-sm hover:bg-neutral-50">
                <ArrowLeft className="h-4 w-4" />
                Zpět na kalkulačku
              </a>
              <Button variant="outline" onClick={factoryReset}>
                <RotateCcw className="h-4 w-4" />
                Tovární nastavení
              </Button>
              <Button onClick={saveAll}>
                <Save className="h-4 w-4" />
                Uložit vše
              </Button>
            </div>
          </div>
        </header>

        <Card>
          <h2 className="mb-3 border-l-4 border-[#820c0c] pl-2 text-lg font-black">Podnikatel (dodavatel)</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Field label="IČO" value={company.ico} onChange={(ico) => setCompany((prev) => ({ ...prev, ico }))} placeholder="12345678" />
              </div>
              <button
                type="button"
                onClick={loadFromAres}
                disabled={aresBusy}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#820c0c] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6b0a0a] disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
                {aresBusy ? "Načítám…" : "Načíst z ARES"}
              </button>
            </div>
            <Field label="DIČ (nepovinné)" value={company.dic} onChange={(dic) => setCompany((prev) => ({ ...prev, dic }))} />
            {aresError && <div className="sm:col-span-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{aresError}</div>}
            <Field label="Jméno / název firmy" value={company.name} onChange={(name) => setCompany((prev) => ({ ...prev, name }))} placeholder="vyplní se z ARES" />
            <Field label="Obor (podtitul na dokumentech)" value={company.subtitle} onChange={(subtitle) => setCompany((prev) => ({ ...prev, subtitle }))} placeholder="např. ZEDNICKÉ PRÁCE" />
            <div className="sm:col-span-2">
              <Field label="Adresa / sídlo" value={company.address} onChange={(address) => setCompany((prev) => ({ ...prev, address }))} placeholder="vyplní se z ARES" />
            </div>
            <Field label="Telefon" value={company.phone} onChange={(phone) => setCompany((prev) => ({ ...prev, phone }))} />
            <Field label="E-mail" value={company.email} onChange={(email) => setCompany((prev) => ({ ...prev, email }))} />
            <Field label="Web" value={company.web} onChange={(web) => setCompany((prev) => ({ ...prev, web }))} placeholder="např. mojefirma.cz" />
            <Field label="Zápis v rejstříku (text na dokumentech)" value={company.register} onChange={(register) => setCompany((prev) => ({ ...prev, register }))} />
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 border-l-4 border-[#820c0c] pl-2 text-lg font-black">Platby a lhůty</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <Field label="Číslo účtu (pro faktury a QR platbu)" value={company.account} onChange={(account) => setCompany((prev) => ({ ...prev, account }))} placeholder="např. 123456789/0800" />
              {company.account &&
                (iban ? (
                  <div className="mt-1 text-xs font-semibold text-emerald-700">IBAN: {iban} ✓</div>
                ) : (
                  <div className="mt-1 text-xs font-semibold text-red-600">Formát nerozpoznán – zadej ve tvaru číslo/kód banky.</div>
                ))}
            </div>
            <Field label="Splatnost faktur (dní)" value={company.dueDays} onChange={(dueDays) => setCompany((prev) => ({ ...prev, dueDays }))} right />
            <Field label="Platnost nabídek (dní)" value={company.validityDays} onChange={(validityDays) => setCompany((prev) => ({ ...prev, validityDays }))} right />
            <div />
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 border-l-4 border-[#820c0c] pl-2 text-lg font-black">Ceník práce</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_80px_100px_36px] gap-2 px-1 text-[10px] font-bold uppercase text-neutral-400">
              <span>Název práce</span>
              <span>MJ</span>
              <span className="text-right">Cena/MJ</span>
              <span />
            </div>
            {presets.works.map((work) => (
              <div key={work.id} className="grid grid-cols-[1fr_80px_100px_36px] gap-2">
                <input className="rounded-md border border-neutral-300 px-2 py-2 text-sm" value={work.name} onChange={(event) => setWork(work.id, { name: event.target.value })} />
                <input className="rounded-md border border-neutral-300 px-2 text-center" value={work.unit} onChange={(event) => setWork(work.id, { unit: event.target.value })} />
                <input className="rounded-md border border-neutral-300 px-2 text-right" value={work.price} onChange={(event) => setWork(work.id, { price: event.target.value })} />
                {CORE_WORK_IDS.includes(work.id) ? (
                  <span className="grid place-items-center text-[9px] font-bold uppercase text-neutral-300" title="Základní práce – je na ni navázán výpočet materiálu, nelze smazat">
                    fix
                  </span>
                ) : (
                  <button type="button" onClick={() => setPresets((prev) => ({ ...prev, works: prev.works.filter((item) => item.id !== work.id) }))} className="grid place-items-center rounded-md text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={() => setPresets((prev) => ({ ...prev, works: [...prev.works, { id: uid(), name: "Nová práce", unit: "m²", price: 0 }] }))}>
              <Plus className="h-4 w-4" />
              Přidat práci
            </Button>
            <p className="text-xs text-neutral-500">Práce „štukování“ řídí výpočet materiálů dle plochy štukování a „výmalba“ dle plochy výmalby – proto je nelze smazat.</p>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 border-l-4 border-[#820c0c] pl-2 text-lg font-black">Doplňkové náklady</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-[24px_1fr_70px_70px_90px_36px] gap-2 px-1 text-[10px] font-bold uppercase text-neutral-400">
              <span title="Ve výchozím stavu zapnuto">✓</span>
              <span>Název</span>
              <span>MJ</span>
              <span className="text-right">Množ.</span>
              <span className="text-right">Cena/MJ</span>
              <span />
            </div>
            {presets.globalRows.map((row) => (
              <div key={row.id} className="grid grid-cols-[24px_1fr_70px_70px_90px_36px] items-center gap-2">
                <input type="checkbox" checked={row.on} onChange={(event) => setRow(row.id, { on: event.target.checked })} />
                <input className="rounded-md border border-neutral-300 px-2 py-2 text-sm" value={row.name} onChange={(event) => setRow(row.id, { name: event.target.value })} />
                <input className="rounded-md border border-neutral-300 px-2 text-center" value={row.unit} onChange={(event) => setRow(row.id, { unit: event.target.value })} />
                <input className="rounded-md border border-neutral-300 px-2 text-right" value={row.qty} onChange={(event) => setRow(row.id, { qty: event.target.value })} />
                <input className="rounded-md border border-neutral-300 px-2 text-right" value={row.price} onChange={(event) => setRow(row.id, { price: event.target.value })} />
                <button type="button" onClick={() => setPresets((prev) => ({ ...prev, globalRows: prev.globalRows.filter((item) => item.id !== row.id) }))} className="grid place-items-center rounded-md text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" onClick={() => setPresets((prev) => ({ ...prev, globalRows: [...prev.globalRows, { id: uid(), name: "Nový náklad", unit: "kpl", qty: 1, price: 0, on: true }] }))}>
              <Plus className="h-4 w-4" />
              Přidat náklad
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 border-l-4 border-[#820c0c] pl-2 text-lg font-black">Materiály</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-[24px_1fr_170px_60px_70px_70px_80px_60px_36px] gap-2 px-1 text-[10px] font-bold uppercase text-neutral-400">
              <span>✓</span>
              <span>Název</span>
              <span>Výpočet množství</span>
              <span>MJ</span>
              <span className="text-right" title="Spotřeba na m² (u pevného množství počet)">Spotř.</span>
              <span className="text-right" title="Rezerva v %">Rez. %</span>
              <span className="text-right">Cena/MJ</span>
              <span className="text-right" title="Zaokrouhlit nahoru na násobek balení">Balení</span>
              <span />
            </div>
            {presets.materials.map((material) => (
              <div key={material.id} className="grid grid-cols-[24px_1fr_170px_60px_70px_70px_80px_60px_36px] items-center gap-2">
                <input type="checkbox" checked={material.on} onChange={(event) => setMaterial(material.id, { on: event.target.checked })} />
                <input className="rounded-md border border-neutral-300 px-2 py-2 text-sm" value={material.name} onChange={(event) => setMaterial(material.id, { name: event.target.value })} />
                <select className="rounded-md border border-neutral-300 px-2 py-2 text-sm" value={material.source} onChange={(event) => setMaterial(material.id, { source: event.target.value })}>
                  {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <input className="rounded-md border border-neutral-300 px-2 text-center" value={material.unit} onChange={(event) => setMaterial(material.id, { unit: event.target.value })} />
                <input className="rounded-md border border-neutral-300 px-2 text-right" value={material.source === "fixed" ? material.qty ?? "" : material.cons ?? ""} onChange={(event) => setMaterial(material.id, material.source === "fixed" ? { qty: event.target.value } : { cons: event.target.value })} />
                <input className="rounded-md border border-neutral-300 px-2 text-right" value={material.reserve ?? 0} onChange={(event) => setMaterial(material.id, { reserve: event.target.value })} />
                <input className="rounded-md border border-neutral-300 px-2 text-right" value={material.price} onChange={(event) => setMaterial(material.id, { price: event.target.value })} />
                <input className="rounded-md border border-neutral-300 px-2 text-right" placeholder="–" value={material.pack ?? ""} onChange={(event) => setMaterial(material.id, { pack: event.target.value ? n(event.target.value) : undefined })} />
                <button type="button" onClick={() => setPresets((prev) => ({ ...prev, materials: prev.materials.filter((item) => item.id !== material.id) }))} className="grid place-items-center rounded-md text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" onClick={() => setPresets((prev) => ({ ...prev, materials: [...prev.materials, { id: uid(), name: "Nový materiál", source: "plaster", unit: "kg", cons: 1, reserve: 15, price: 0, on: true }] }))}>
              <Plus className="h-4 w-4" />
              Přidat materiál
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 border-l-4 border-[#820c0c] pl-2 text-lg font-black">Výchozí sazby</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            <Field label="Rezerva práce %" value={presets.settings.laborReservePercent ?? ""} onChange={(value) => setSetting("laborReservePercent", value)} right />
            <Field label="Rezerva materiálu %" value={presets.settings.materialReservePercent ?? ""} onChange={(value) => setSetting("materialReservePercent", value)} right />
            <Field label="Cena za 1 km (Kč)" value={presets.settings.kmPrice ?? ""} onChange={(value) => setSetting("kmPrice", value)} right />
            <Field label="Km jedna cesta (výchozí)" value={presets.settings.kmOneWay ?? ""} onChange={(value) => setSetting("kmOneWay", value)} right />
            <Field label="Počet návštěv (výchozí)" value={presets.settings.visits ?? ""} onChange={(value) => setSetting("visits", value)} right />
          </div>
          <p className="mt-2 text-xs text-neutral-500">Tyto hodnoty se předvyplní do každé nové kalkulace; v konkrétní nabídce je lze vždy upravit.</p>
        </Card>

        <div className="flex justify-end gap-2 pb-6">
          <Button variant="outline" onClick={factoryReset}>
            <RotateCcw className="h-4 w-4" />
            Tovární nastavení
          </Button>
          <Button onClick={saveAll}>
            <Save className="h-4 w-4" />
            Uložit vše
          </Button>
        </div>
      </div>
    </main>
  );
}

function Card({ children }) {
  return <div className="min-w-0 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">{children}</div>;
}

function Button({ children, onClick, variant = "primary" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold shadow-sm transition ${
        variant === "primary" ? "bg-[#820c0c] text-white hover:bg-[#6b0a0a] active:scale-[.98]" : "border border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, value, onChange, right = false, placeholder }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-bold uppercase text-neutral-500">{label}</div>
      <input
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`h-10 w-full rounded-md border border-neutral-300 px-3 ${right ? "text-right" : ""}`}
      />
    </label>
  );
}
