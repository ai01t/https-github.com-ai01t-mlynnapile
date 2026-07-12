"use client";

// Administrace kalkulačky: údaje podnikatele + přednastavené ceny a sazby.
// Vše se ukládá do localStorage prohlížeče, v kódu nejsou žádné osobní údaje.

import { useEffect, useState } from "react";
import { ArrowLeft, Image as ImageIcon, Plus, RotateCcw, Save, Search, Trash2, Upload, X } from "lucide-react";
import {
  czAccountToIban,
  defaultCompany,
  defaultDesign,
  designStyle,
  fetchAres,
  n,
  readLogoFile,
  SPACING_CSS,
  storage,
  THEMES,
  uid,
} from "../core";
import { BRAND } from "../Logo";

const CORE_WORK_IDS = ["oklep", "perlinka", "malba"];

const SOURCE_LABELS = {
  plaster: "dle plochy štukování (m²)",
  paint: "dle plochy výmalby (m²)",
  fixed: "pevné množství",
};

export default function AdminPage() {
  const [company, setCompany] = useState(defaultCompany);
  const [presets, setPresets] = useState({ works: [], globalRows: [], materials: [], settings: {} });
  const [design, setDesign] = useState(defaultDesign);
  const [loaded, setLoaded] = useState(false);
  const [flash, setFlash] = useState("");
  const [aresBusy, setAresBusy] = useState(false);
  const [aresError, setAresError] = useState("");

  useEffect(() => {
    setCompany(storage.loadCompany());
    setPresets(storage.loadPresets());
    setDesign(storage.loadDesign());
    setLoaded(true);
  }, []);

  // velikost písma z nastavení vzhledu (živý náhled i v administraci)
  useEffect(() => {
    document.documentElement.style.fontSize = `${design.fontScale ?? 100}%`;
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [design.fontScale]);

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
    storage.saveDesign(design);
    showFlash("Uloženo ✓");
  };

  const factoryReset = () => {
    if (!window.confirm("Obnovit tovární nastavení? Smaže se uložený podnikatel, vzhled i všechny přednastavené ceny (nabídky a faktury zůstávají).")) return;
    storage.clearPresets();
    setCompany(storage.loadCompany());
    setPresets(storage.loadPresets());
    setDesign(storage.loadDesign());
    showFlash("Obnoveno tovární nastavení");
  };

  const uploadLogo = async (file) => {
    if (!file) return;
    try {
      const logo = await readLogoFile(file);
      setCompany((prev) => ({ ...prev, logo }));
      showFlash("Logo načteno – nezapomeň Uložit vše");
    } catch (error) {
      window.alert(error.message);
    }
  };

  const setD = (key, value) => setDesign((prev) => ({ ...prev, [key]: value }));

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
    <main data-kalk className="min-h-screen bg-[var(--bg)] p-3 text-[var(--text)]" style={designStyle(design)}>
      <style dangerouslySetInnerHTML={{ __html: SPACING_CSS }} />
      <div className="mx-auto max-w-[1100px] space-y-3">
        <header className="sticky top-0 z-40 -mx-3 -mt-3 border-b-2 border-[var(--brand)] bg-[var(--header-bg)] px-4 py-2 shadow-md backdrop-blur">
          <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-3">
            {company.logo && <img src={company.logo} alt="Logo" className="h-10 w-auto max-w-[120px] object-contain" />}
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight" style={{ color: BRAND }}>Administrace</h1>
              <div className="text-xs text-[var(--muted)]">Údaje podnikatele a přednastavené ceny{flash && <span className="ml-2 font-bold text-emerald-600">{flash}</span>}</div>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <a href="/kalkulace" className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm font-bold shadow-sm hover:bg-[var(--bg-soft)]">
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
          <h2 className="mb-3 border-l-4 border-[var(--brand)] pl-2 text-lg font-black">Podnikatel (dodavatel)</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Field label="IČO" value={company.ico} onChange={(ico) => setCompany((prev) => ({ ...prev, ico }))} placeholder="12345678" />
              </div>
              <button
                type="button"
                onClick={loadFromAres}
                disabled={aresBusy}
                className="inline-flex h-10 items-center gap-2 rounded-[var(--radius)] bg-[var(--brand)] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)] disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
                {aresBusy ? "Načítám…" : "Načíst z ARES"}
              </button>
            </div>
            <Field label="DIČ (nepovinné)" value={company.dic} onChange={(dic) => setCompany((prev) => ({ ...prev, dic }))} />
            {aresError && <div className="sm:col-span-2 rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{aresError}</div>}
            <Field label="Jméno / název firmy" value={company.name} onChange={(name) => setCompany((prev) => ({ ...prev, name }))} placeholder="vyplní se z ARES" />
            <Field label="Obor (podtitul na dokumentech)" value={company.subtitle} onChange={(subtitle) => setCompany((prev) => ({ ...prev, subtitle }))} placeholder="např. ZEDNICKÉ PRÁCE" />
            <div className="sm:col-span-2">
              <Field label="Adresa / sídlo" value={company.address} onChange={(address) => setCompany((prev) => ({ ...prev, address }))} placeholder="vyplní se z ARES" />
            </div>
            <Field label="Telefon" value={company.phone} onChange={(phone) => setCompany((prev) => ({ ...prev, phone }))} />
            <Field label="E-mail" value={company.email} onChange={(email) => setCompany((prev) => ({ ...prev, email }))} />
            <Field label="Web" value={company.web} onChange={(web) => setCompany((prev) => ({ ...prev, web }))} placeholder="např. mojefirma.cz" />
            <Field label="Zápis v rejstříku (text na dokumentech)" value={company.register} onChange={(register) => setCompany((prev) => ({ ...prev, register }))} />
            <div className="sm:col-span-2">
              <div className="mb-1 text-[11px] font-bold uppercase text-[var(--muted)]">Logo firmy (zobrazí se v záhlaví a na dokumentech)</div>
              <div className="flex flex-wrap items-center gap-3">
                {company.logo ? (
                  <>
                    <div className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-soft)] p-2">
                      <img src={company.logo} alt="Logo" className="h-14 w-auto max-w-[220px] object-contain" />
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm font-bold shadow-sm hover:bg-[var(--bg-soft)]">
                      <Upload className="h-4 w-4" />
                      Změnit
                      <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadLogo(event.target.files?.[0])} />
                    </label>
                    <button
                      type="button"
                      onClick={() => setCompany((prev) => ({ ...prev, logo: "" }))}
                      className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
                    >
                      <X className="h-4 w-4" />
                      Odebrat
                    </button>
                  </>
                ) : (
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius)] border border-dashed border-[var(--muted)] px-4 py-3 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]">
                    <ImageIcon className="h-5 w-5" />
                    Přidat logo (PNG, JPG…)
                    <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadLogo(event.target.files?.[0])} />
                  </label>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 border-l-4 border-[var(--brand)] pl-2 text-lg font-black">Vzhled aplikace</h2>
          <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-[11px] font-bold uppercase text-[var(--muted)]">Barevný motiv</div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {Object.entries(THEMES).map(([key, theme]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setD("theme", key)}
                      className={`rounded-[var(--radius)] border-2 p-2 text-left transition ${design.theme === key ? "border-[var(--brand)] shadow-md" : "border-[var(--line)] hover:border-[var(--muted)]"}`}
                      style={{ background: theme.vars["--bg"], color: theme.vars["--text"] }}
                    >
                      <div className="flex gap-1">
                        <span className="h-4 w-4 rounded-full" style={{ background: theme.vars["--brand"] }} />
                        <span className="h-4 w-4 rounded-full border" style={{ background: theme.vars["--card"], borderColor: theme.vars["--line"] }} />
                        <span className="h-4 w-4 rounded-full" style={{ background: theme.vars["--text"] }} />
                      </div>
                      <div className="mt-1.5 text-[11px] font-bold leading-tight">{theme.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Slider label="Velikost písma" value={design.fontScale} min={80} max={120} step={5} unit="%" onChange={(value) => setD("fontScale", value)} />
                <Slider label="Měřítko zobrazení (zoom)" value={design.zoom} min={75} max={125} step={5} unit="%" onChange={(value) => setD("zoom", value)} />
                <Slider label="Řádkování (mezery mezi řádky)" value={design.lineHeight} min={1.2} max={1.9} step={0.05} onChange={(value) => setD("lineHeight", value)} />
                <Slider label="Prostrkání písma" value={design.letterSpacing} min={-0.5} max={2} step={0.1} unit="px" onChange={(value) => setD("letterSpacing", value)} />
                <Slider label="Mezery mezi bloky" value={design.space} min={0.6} max={1.4} step={0.05} unit="×" onChange={(value) => setD("space", value)} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" onClick={() => setDesign(defaultDesign)}>
                  <RotateCcw className="h-4 w-4" />
                  Výchozí vzhled
                </Button>
                <span className="text-xs text-[var(--muted)]">Změny se projeví hned; trvale se uloží tlačítkem „Uložit vše".</span>
              </div>
            </div>
            <DesignPreview design={design} company={company} />
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 border-l-4 border-[var(--brand)] pl-2 text-lg font-black">Platby a lhůty</h2>
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
            <div className="sm:col-span-3">
              <Field label="Název banky (na faktuře, nepovinné)" value={company.bank} onChange={(bank) => setCompany((prev) => ({ ...prev, bank }))} placeholder="např. Česká spořitelna" />
            </div>
            <Field label="Splatnost faktur (dní)" value={company.dueDays} onChange={(dueDays) => setCompany((prev) => ({ ...prev, dueDays }))} right />
            <Field label="Platnost nabídek (dní)" value={company.validityDays} onChange={(validityDays) => setCompany((prev) => ({ ...prev, validityDays }))} right />
            <div />
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 border-l-4 border-[var(--brand)] pl-2 text-lg font-black">Ceník práce</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_80px_100px_36px] gap-2 px-1 text-[10px] font-bold uppercase text-[var(--muted)]">
              <span>Název práce</span>
              <span>MJ</span>
              <span className="text-right">Cena/MJ</span>
              <span />
            </div>
            {presets.works.map((work) => (
              <div key={work.id} className="grid grid-cols-[1fr_80px_100px_36px] gap-2">
                <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 py-2 text-sm" value={work.name} onChange={(event) => setWork(work.id, { name: event.target.value })} />
                <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 text-center" value={work.unit} onChange={(event) => setWork(work.id, { unit: event.target.value })} />
                <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 text-right" value={work.price} onChange={(event) => setWork(work.id, { price: event.target.value })} />
                {CORE_WORK_IDS.includes(work.id) ? (
                  <span className="grid place-items-center text-[9px] font-bold uppercase text-[var(--muted)]" title="Základní práce – je na ni navázán výpočet materiálu, nelze smazat">
                    fix
                  </span>
                ) : (
                  <button type="button" onClick={() => setPresets((prev) => ({ ...prev, works: prev.works.filter((item) => item.id !== work.id) }))} className="grid place-items-center rounded-[var(--radius-sm)] text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={() => setPresets((prev) => ({ ...prev, works: [...prev.works, { id: uid(), name: "Nová práce", unit: "m²", price: 0 }] }))}>
              <Plus className="h-4 w-4" />
              Přidat práci
            </Button>
            <p className="text-xs text-[var(--muted)]">Práce „štukování“ řídí výpočet materiálů dle plochy štukování a „výmalba“ dle plochy výmalby – proto je nelze smazat.</p>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 border-l-4 border-[var(--brand)] pl-2 text-lg font-black">Doplňkové náklady</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-[24px_1fr_70px_70px_90px_36px] gap-2 px-1 text-[10px] font-bold uppercase text-[var(--muted)]">
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
                <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 py-2 text-sm" value={row.name} onChange={(event) => setRow(row.id, { name: event.target.value })} />
                <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 text-center" value={row.unit} onChange={(event) => setRow(row.id, { unit: event.target.value })} />
                <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 text-right" value={row.qty} onChange={(event) => setRow(row.id, { qty: event.target.value })} />
                <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 text-right" value={row.price} onChange={(event) => setRow(row.id, { price: event.target.value })} />
                <button type="button" onClick={() => setPresets((prev) => ({ ...prev, globalRows: prev.globalRows.filter((item) => item.id !== row.id) }))} className="grid place-items-center rounded-[var(--radius-sm)] text-red-600 hover:bg-red-50">
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
          <h2 className="mb-3 border-l-4 border-[var(--brand)] pl-2 text-lg font-black">Materiály</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-[24px_1fr_170px_60px_70px_70px_80px_60px_36px] gap-2 px-1 text-[10px] font-bold uppercase text-[var(--muted)]">
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
                <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 py-2 text-sm" value={material.name} onChange={(event) => setMaterial(material.id, { name: event.target.value })} />
                <select className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 py-2 text-sm" value={material.source} onChange={(event) => setMaterial(material.id, { source: event.target.value })}>
                  {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 text-center" value={material.unit} onChange={(event) => setMaterial(material.id, { unit: event.target.value })} />
                <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 text-right" value={material.source === "fixed" ? material.qty ?? "" : material.cons ?? ""} onChange={(event) => setMaterial(material.id, material.source === "fixed" ? { qty: event.target.value } : { cons: event.target.value })} />
                <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 text-right" value={material.reserve ?? 0} onChange={(event) => setMaterial(material.id, { reserve: event.target.value })} />
                <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 text-right" value={material.price} onChange={(event) => setMaterial(material.id, { price: event.target.value })} />
                <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 text-right" placeholder="–" value={material.pack ?? ""} onChange={(event) => setMaterial(material.id, { pack: event.target.value ? n(event.target.value) : undefined })} />
                <button type="button" onClick={() => setPresets((prev) => ({ ...prev, materials: prev.materials.filter((item) => item.id !== material.id) }))} className="grid place-items-center rounded-[var(--radius-sm)] text-red-600 hover:bg-red-50">
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
          <h2 className="mb-3 border-l-4 border-[var(--brand)] pl-2 text-lg font-black">Výchozí sazby</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            <Field label="Rezerva práce %" value={presets.settings.laborReservePercent ?? ""} onChange={(value) => setSetting("laborReservePercent", value)} right />
            <Field label="Rezerva materiálu %" value={presets.settings.materialReservePercent ?? ""} onChange={(value) => setSetting("materialReservePercent", value)} right />
            <Field label="Cena za 1 km (Kč)" value={presets.settings.kmPrice ?? ""} onChange={(value) => setSetting("kmPrice", value)} right />
            <Field label="Km jedna cesta (výchozí)" value={presets.settings.kmOneWay ?? ""} onChange={(value) => setSetting("kmOneWay", value)} right />
            <Field label="Počet návštěv (výchozí)" value={presets.settings.visits ?? ""} onChange={(value) => setSetting("visits", value)} right />
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">Tyto hodnoty se předvyplní do každé nové kalkulace; v konkrétní nabídce je lze vždy upravit.</p>
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
  return <div className="min-w-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] p-4 shadow-sm">{children}</div>;
}

function Button({ children, onClick, variant = "primary" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius)] px-3 py-2 text-sm font-bold shadow-sm transition ${
        variant === "primary" ? "bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] active:scale-[.98]" : "border border-[var(--line)] bg-[var(--card)] text-[var(--text)] hover:border-[var(--muted)] hover:bg-[var(--bg-soft)]"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, value, onChange, right = false, placeholder }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-bold uppercase text-[var(--muted)]">{label}</div>
      <input
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`h-10 w-full rounded-[var(--radius-sm)] border border-[var(--line)] px-3 ${right ? "text-right" : ""}`}
      />
    </label>
  );
}

function Slider({ label, value, min, max, step, unit = "", onChange }) {
  const shown = typeof value === "number" ? Math.round(value * 100) / 100 : value;
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between text-[11px] font-bold uppercase text-[var(--muted)]">
        <span>{label}</span>
        <span className="tabular-nums text-[var(--text)]">{shown}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[var(--brand)]"
      />
    </label>
  );
}

// Živý náhled: zmenšená ukázka rozhraní vykreslená přímo z upravovaného nastavení.
function DesignPreview({ design, company }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-bold uppercase text-[var(--muted)]">Náhled</div>
      <div
        className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)]"
        style={{ ...designStyle(design), zoom: 0.85 * ((design.zoom ?? 100) / 100) }}
      >
        <div className="border-b-2 px-3 py-2" style={{ borderColor: "var(--brand)", background: "var(--header-bg)" }}>
          <div className="flex items-center gap-2">
            {company.logo && <img src={company.logo} alt="" className="h-6 w-auto object-contain" />}
            <div>
              <div className="text-sm font-black uppercase tracking-tight" style={{ color: "var(--brand)" }}>
                Kalkulačka {company.web || "nacenění"}
              </div>
              <div className="text-[10px]" style={{ color: "var(--muted)" }}>Neuložená nabídka · Koncept</div>
            </div>
            <span className="ml-auto rounded-[var(--radius-sm)] px-2 py-1 text-[10px] font-bold text-white" style={{ background: "var(--brand)" }}>
              Náhled tisku
            </span>
          </div>
        </div>
        <div className="space-y-2 p-3" style={{ background: "var(--bg)", color: "var(--text)" }}>
          <div className="rounded-[var(--radius)] border p-3 shadow-sm" style={{ background: "var(--card)", borderColor: "var(--line)" }}>
            <div className="border-l-4 pl-2 text-sm font-black" style={{ borderColor: "var(--brand)" }}>Stěna 1</div>
            <div className="mt-1 text-xs" style={{ color: "var(--text-soft)" }}>
              Ukázkový text kalkulace – takto vypadá písmo, řádkování i prostrkání v kartách aplikace.
            </div>
            <div className="mt-2 flex justify-between border-t pt-2 text-xs" style={{ borderColor: "var(--line)" }}>
              <span style={{ color: "var(--muted)" }}>Práce celkem</span>
              <b>34 773 Kč</b>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="rounded-[var(--radius)] px-3 py-1.5 text-xs font-bold text-white" style={{ background: "var(--brand)" }}>Uložit nabídku</span>
            <span className="rounded-[var(--radius)] border px-3 py-1.5 text-xs font-bold" style={{ background: "var(--card)", borderColor: "var(--line)" }}>Nová</span>
          </div>
        </div>
      </div>
    </div>
  );
}
