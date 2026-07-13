"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Copy,
  Download,
  Eye,
  FilePlus2,
  FileText,
  FolderOpen,
  GripVertical,
  Plus,
  Printer,
  Save,
  Search,
  Settings,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  addDaysIso,
  areaCm,
  buildCalculation,
  buildInvoiceItems,
  buildSpayd,
  clamp,
  czAccountToIban,
  czk,
  dateCz,
  defaultCompany,
  defaultCustomer,
  defaultGlobalRows,
  defaultMaterials,
  defaultSettings,
  defaultWalls,
  defaultWorks,
  f2,
  fetchAres,
  inferOtherOpening,
  n,
  normalizeOpening,
  openingDefaults,
  openingKind,
  QUOTE_STATUSES,
  scopeText,
  statusInfo,
  storage,
  todayIso,
  uid,
  wallStats,
} from "./core";
import Room3D from "./Room3D";
import { BRAND, Logo, LogoMark } from "./Logo";

const emptyMeta = { id: null, name: "", validUntil: "", status: "draft" };

export default function KalkulacePage() {
  const [walls, setWalls] = useState(defaultWalls);
  const [works, setWorks] = useState(defaultWorks);
  const [globalRows, setGlobalRows] = useState(defaultGlobalRows);
  const [materials, setMaterials] = useState(defaultMaterials);
  const [settings, setSettings] = useState(defaultSettings);
  const [customer, setCustomer] = useState(defaultCustomer);
  const [meta, setMeta] = useState(emptyMeta);
  const [company, setCompany] = useState(defaultCompany);
  const [quotes, setQuotes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [savedFlash, setSavedFlash] = useState("");
  const [aresBusy, setAresBusy] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [quotesOpen, setQuotesOpen] = useState(false);
  const [invoicesOpen, setInvoicesOpen] = useState(false);
  const [invoiceView, setInvoiceView] = useState(null);
  const [show3D, setShow3D] = useState(false);
  const [draggedWallId, setDraggedWallId] = useState(null);

  const calc = useMemo(() => buildCalculation({ walls, works, globalRows, materials, settings }), [walls, works, globalRows, materials, settings]);

  // načtení uložených dat po startu (localStorage není při SSR)
  useEffect(() => {
    const presets = storage.loadPresets();
    const saved = storage.loadAutosave();
    if (saved) {
      setWalls(saved.walls ?? defaultWalls);
      setWorks(saved.works ?? presets.works);
      setGlobalRows(saved.globalRows ?? presets.globalRows);
      setMaterials(saved.materials ?? presets.materials);
      setSettings(saved.settings ?? presets.settings);
      setCustomer(saved.customer ?? defaultCustomer);
      setMeta(saved.meta ?? emptyMeta);
    } else {
      setWorks(presets.works);
      setGlobalRows(presets.globalRows);
      setMaterials(presets.materials);
      setSettings(presets.settings);
    }
    setQuotes(storage.loadQuotes());
    setInvoices(storage.loadInvoices());
    setCompany(storage.loadCompany());
    setLoaded(true);
  }, []);

  // auto-ukládání rozpracované kalkulace
  useEffect(() => {
    if (!loaded) return;
    storage.saveAutosave({ walls, works, globalRows, materials, settings, customer, meta });
  }, [loaded, walls, works, globalRows, materials, settings, customer, meta]);

  const persistQuotes = (next) => {
    setQuotes(next);
    storage.saveQuotes(next);
  };
  const persistInvoices = (next) => {
    setInvoices(next);
    storage.saveInvoices(next);
  };

  const flash = (text) => {
    setSavedFlash(text);
    setTimeout(() => setSavedFlash(""), 2500);
  };

  // ---------- nabídky ----------

  const saveQuote = (asNew = false) => {
    const id = !asNew && meta.id ? meta.id : uid();
    const existing = quotes.find((quote) => quote.id === id);
    const name =
      (asNew ? `${meta.name || customer.name || "Nabídka"} (kopie)` : meta.name?.trim()) ||
      customer.name?.trim() ||
      `Nabídka ${dateCz(todayIso())}`;
    const validUntil = meta.validUntil || addDaysIso(company.validityDays);
    const quote = {
      id,
      name,
      customer,
      status: existing?.status ?? meta.status ?? "draft",
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      validUntil,
      total: calc.subtotal,
      data: { walls, works, globalRows, materials, settings },
    };
    persistQuotes(existing ? quotes.map((item) => (item.id === id ? quote : item)) : [quote, ...quotes]);
    setMeta({ id, name, validUntil, status: quote.status });
    flash(existing ? "Nabídka přepsána ✓" : "Nabídka uložena ✓");
  };

  const loadQuote = (quote) => {
    setWalls(quote.data.walls);
    setWorks(quote.data.works);
    setGlobalRows(quote.data.globalRows);
    setMaterials(quote.data.materials);
    setSettings(quote.data.settings);
    setCustomer(quote.customer ?? defaultCustomer);
    setMeta({ id: quote.id, name: quote.name, validUntil: quote.validUntil ?? "", status: quote.status ?? "draft" });
    setQuotesOpen(false);
    flash(`Načteno: ${quote.name}`);
  };

  const duplicateQuote = (quote) => {
    const copy = {
      ...quote,
      id: uid(),
      name: `${quote.name} (kopie)`,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    persistQuotes([copy, ...quotes]);
  };

  const deleteQuote = (quote) => {
    if (!window.confirm(`Smazat nabídku „${quote.name}“?`)) return;
    persistQuotes(quotes.filter((item) => item.id !== quote.id));
    if (meta.id === quote.id) setMeta((prev) => ({ ...prev, id: null }));
  };

  const setQuoteStatus = (quote, status) => {
    persistQuotes(quotes.map((item) => (item.id === quote.id ? { ...item, status } : item)));
    if (meta.id === quote.id) setMeta((prev) => ({ ...prev, status }));
  };

  const newQuote = () => {
    if (!window.confirm("Začít novou prázdnou nabídku? Rozpracované hodnoty se přepíší (uložené nabídky zůstávají).")) return;
    const presets = storage.loadPresets();
    setWalls(defaultWalls);
    setWorks(presets.works);
    setGlobalRows(presets.globalRows);
    setMaterials(presets.materials);
    setSettings(presets.settings);
    setCustomer(defaultCustomer);
    setMeta(emptyMeta);
  };

  const customerFromAres = async () => {
    setAresBusy(true);
    try {
      const data = await fetchAres(customer.ico);
      setCustomer((prev) => ({ ...prev, name: data.name, address: data.address, ico: data.ico }));
      flash("Odběratel načten z ARES ✓");
    } catch (error) {
      window.alert(error.message);
    } finally {
      setAresBusy(false);
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), quotes, invoices }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kalkulace-zaloha-${todayIso()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const incomingQuotes = Array.isArray(parsed.quotes) ? parsed.quotes : [];
        const incomingInvoices = Array.isArray(parsed.invoices) ? parsed.invoices : [];
        const mergedQuotes = [...incomingQuotes.filter((quote) => !quotes.some((item) => item.id === quote.id)), ...quotes];
        const mergedInvoices = [...incomingInvoices.filter((invoice) => !invoices.some((item) => item.id === invoice.id)), ...invoices];
        persistQuotes(mergedQuotes);
        persistInvoices(mergedInvoices);
        flash(`Import: +${mergedQuotes.length - quotes.length} nabídek, +${mergedInvoices.length - invoices.length} faktur`);
      } catch {
        window.alert("Soubor se nepodařilo načíst – není to platná záloha JSON.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  // ---------- faktury ----------

  const createInvoiceFromQuote = (quote) => {
    const quoteCalc = buildCalculation(quote.data);
    const invoice = {
      id: uid(),
      number: storage.nextInvoiceNumber(),
      quoteId: quote.id,
      quoteName: quote.name,
      customer: quote.customer ?? defaultCustomer,
      items: buildInvoiceItems(quoteCalc, quote.data.settings),
      total: quoteCalc.subtotal,
      issueDate: todayIso(),
      supplyDate: todayIso(),
      dueDate: addDaysIso(company.dueDays),
      supplier: company,
      paid: false,
      createdAt: new Date().toISOString(),
    };
    persistInvoices([invoice, ...invoices]);
    setQuoteStatus(quote, "invoiced");
    setQuotesOpen(false);
    setInvoicesOpen(false);
    setInvoiceView(invoice);
  };

  const toggleInvoicePaid = (invoice) => {
    const next = invoices.map((item) => (item.id === invoice.id ? { ...item, paid: !item.paid } : item));
    persistInvoices(next);
    if (invoiceView?.id === invoice.id) setInvoiceView(next.find((item) => item.id === invoice.id));
  };

  const deleteInvoice = (invoice) => {
    if (!window.confirm(`Smazat fakturu č. ${invoice.number}?`)) return;
    persistInvoices(invoices.filter((item) => item.id !== invoice.id));
  };

  // ---------- stěny ----------

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
      { id: uid(), name: `Stěna ${prev.length + 1}`, width: 300, height: 250, scope: "damaged", openings: [], workIds: ["oklep", "perlinka", "malba"] },
    ]);

  const currentStatus = statusInfo(meta.status);

  return (
    <main className="min-h-screen bg-neutral-100 p-3 text-neutral-900">
      {/* při tisku se zobrazí jen obsah označený data-print-root */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          [data-print-root], [data-print-root] * { visibility: visible; }
          [data-print-root] { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
      <div className="mx-auto max-w-[1600px] space-y-3">
        <header className="sticky top-0 z-40 -mx-3 -mt-3 border-b-2 border-[#820c0c] bg-white/95 px-4 py-2 shadow-md backdrop-blur print:hidden">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex min-w-0 items-center gap-3">
              <LogoMark className="h-10 w-10 shrink-0 text-neutral-900" />
              <div className="min-w-0">
                <h1 className="truncate text-lg font-black uppercase leading-tight tracking-tight" style={{ color: BRAND }}>
                  Kalkulačka {company.web ? <span className="text-neutral-900">{company.web}</span> : <span className="text-neutral-900">nacenění</span>}
                </h1>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="truncate">{meta.name || "Neuložená nabídka"}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${currentStatus.className}`}>{currentStatus.label}</span>
                  {savedFlash && <span className="font-bold text-emerald-600">{savedFlash}</span>}
                </div>
              </div>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <div className="rounded-lg border border-[#820c0c]/15 bg-[#820c0c]/5 px-3 py-1.5 text-right">
                <div className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Celkem bez DPH</div>
                <div className="text-xl font-black leading-tight" style={{ color: BRAND }}>{czk(calc.subtotal)}</div>
              </div>
              <Button variant="outline" onClick={() => setQuotesOpen(true)}>
                <FolderOpen className="h-4 w-4" />
                Nabídky ({quotes.length})
              </Button>
              <Button variant="outline" onClick={() => setInvoicesOpen(true)}>
                <FileText className="h-4 w-4" />
                Faktury ({invoices.length})
              </Button>
              <a
                href="/kalkulace/admin"
                title="Administrace – údaje podnikatele a ceníky"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-bold text-neutral-900 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50"
              >
                <Settings className="h-4 w-4" />
                Admin
              </a>
              <Button variant="outline" onClick={() => saveQuote(false)}>
                <Save className="h-4 w-4" />
                Uložit
              </Button>
              <Button onClick={() => setPreviewOpen(true)}>
                <Eye className="h-4 w-4" />
                Náhled tisku
              </Button>
            </div>
          </div>
        </header>

        <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)]">
          <section className="min-w-0 space-y-3">
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="border-l-4 border-[#820c0c] pl-2 text-lg font-black">3D náhled místnosti</h2>
                  <p className="text-xs text-neutral-500">Orientační prostorové zobrazení stěn v pořadí, v jakém jdou za sebou.</p>
                </div>
                <Button variant="outline" onClick={() => setShow3D((prev) => !prev)}>
                  <Box className="h-4 w-4" />
                  {show3D ? "Skrýt" : "Zobrazit"}
                </Button>
              </div>
              {show3D && (
                <div className="mt-3">
                  <Room3D walls={walls.map((wall) => ({ ...wall, openings: wall.openings.map((opening) => normalizeOpening(opening, wall)) }))} />
                </div>
              )}
            </Card>

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
                    <WallGraphic wall={displayWall} onMoveOpening={(openingId, patch) => updateOpening(wall.id, openingId, patch)} />
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
              <h2 className="mb-3 border-l-4 border-[#820c0c] pl-2 text-lg font-black">Nabídka a zákazník</h2>
              <div className="space-y-2">
                <Field label="Název nabídky" value={meta.name} onChange={(value) => setMeta((prev) => ({ ...prev, name: value }))} placeholder="např. Novák – koupelna" />
                <Field label="Zákazník" value={customer.name} onChange={(value) => setCustomer((prev) => ({ ...prev, name: value }))} placeholder="Jméno a příjmení / firma" />
                <Field label="Adresa" value={customer.address} onChange={(value) => setCustomer((prev) => ({ ...prev, address: value }))} placeholder="Ulice, město" />
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-end gap-1.5">
                    <div className="min-w-0 flex-1">
                      <Field label="IČO (u firem)" value={customer.ico ?? ""} onChange={(value) => setCustomer((prev) => ({ ...prev, ico: value }))} placeholder="nepovinné" />
                    </div>
                    <button
                      type="button"
                      onClick={customerFromAres}
                      disabled={aresBusy}
                      title="Načíst jméno a adresu z ARES podle IČO"
                      className="inline-flex h-10 shrink-0 items-center gap-1 rounded-lg bg-[#820c0c] px-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#6b0a0a] disabled:opacity-50"
                    >
                      <Search className="h-3.5 w-3.5" />
                      {aresBusy ? "…" : "ARES"}
                    </button>
                  </div>
                  <Field label="Telefon" value={customer.phone} onChange={(value) => setCustomer((prev) => ({ ...prev, phone: value }))} />
                </div>
                <Field label="E-mail" value={customer.email} onChange={(value) => setCustomer((prev) => ({ ...prev, email: value }))} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block">
                    <Label>Platnost do</Label>
                    <input
                      type="date"
                      value={meta.validUntil}
                      onChange={(event) => setMeta((prev) => ({ ...prev, validUntil: event.target.value }))}
                      className="h-10 w-full rounded-md border border-neutral-300 px-3"
                    />
                  </label>
                  <label className="block">
                    <Label>Stav</Label>
                    <select
                      className="h-10 w-full rounded-md border border-neutral-300 px-2"
                      value={meta.status}
                      onChange={(event) => {
                        const status = event.target.value;
                        setMeta((prev) => ({ ...prev, status }));
                        if (meta.id) persistQuotes(quotes.map((item) => (item.id === meta.id ? { ...item, status } : item)));
                      }}
                    >
                      {QUOTE_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button onClick={() => saveQuote(false)}>
                    <Save className="h-4 w-4" />
                    {meta.id ? "Uložit změny" : "Uložit nabídku"}
                  </Button>
                  {meta.id && (
                    <Button variant="outline" onClick={() => saveQuote(true)}>
                      <Copy className="h-4 w-4" />
                      Jako novou
                    </Button>
                  )}
                  <Button variant="outline" onClick={newQuote}>
                    <FilePlus2 className="h-4 w-4" />
                    Nová
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="mb-3 border-l-4 border-[#820c0c] pl-2 text-lg font-black">Nastavení a sazby</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Rezerva práce %" value={settings.laborReservePercent} onChange={(value) => setSettings((prev) => ({ ...prev, laborReservePercent: value }))} right />
                <Field label="Rezerva materiálu %" value={settings.materialReservePercent} onChange={(value) => setSettings((prev) => ({ ...prev, materialReservePercent: value }))} right />
                <Field label="Km jedna cesta" value={settings.kmOneWay} onChange={(value) => setSettings((prev) => ({ ...prev, kmOneWay: value }))} right />
                <Field label="Počet návštěv" value={settings.visits} onChange={(value) => setSettings((prev) => ({ ...prev, visits: value }))} right />
                <Field label="Cena za km" value={settings.kmPrice} onChange={(value) => setSettings((prev) => ({ ...prev, kmPrice: value }))} right />
              </div>
            </Card>

            <Card>
              <h2 className="mb-2 border-l-4 border-[#820c0c] pl-2 text-lg font-black">Ceník práce</h2>
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
              <h2 className="mb-2 border-l-4 border-[#820c0c] pl-2 text-lg font-black">Doplňkové náklady</h2>
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
              <h2 className="mb-2 border-l-4 border-[#820c0c] pl-2 text-lg font-black">Součet</h2>
              <SummaryRow label="Rezerva práce" value={calc.laborReserve} />
              <SummaryRow label="Materiál mezisoučet" value={calc.materialBaseTotal} />
              <SummaryRow label="Materiálová rezerva" value={calc.materialReserve} />
              <SummaryRow label={`Doprava (${f2(calc.transportKm)} km)`} value={calc.transportTotal} />
              <div className="mt-3 rounded-lg bg-[#820c0c] p-3 text-right text-white shadow-md">
                <div className="text-xs uppercase tracking-wide opacity-80">Celkem bez DPH</div>
                <div className="text-3xl font-black">{czk(calc.subtotal)}</div>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {previewOpen && <PreviewModal calc={calc} settings={settings} customer={customer} meta={meta} company={company} close={() => setPreviewOpen(false)} />}
      {quotesOpen && (
        <QuotesModal
          quotes={quotes}
          currentId={meta.id}
          onLoad={loadQuote}
          onDuplicate={duplicateQuote}
          onDelete={deleteQuote}
          onStatus={setQuoteStatus}
          onInvoice={createInvoiceFromQuote}
          onExport={exportData}
          onImport={importData}
          close={() => setQuotesOpen(false)}
        />
      )}
      {invoicesOpen && (
        <InvoicesModal invoices={invoices} onView={(invoice) => setInvoiceView(invoice)} onPaid={toggleInvoicePaid} onDelete={deleteInvoice} close={() => setInvoicesOpen(false)} />
      )}
      {invoiceView && <InvoiceModal invoice={invoiceView} company={company} close={() => setInvoiceView(null)} />}
    </main>
  );
}

function Card({ children, className = "", ...props }) {
  return (
    <div className={`min-w-0 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition ${className}`} {...props}>
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

function Button({ children, onClick, variant = "primary", title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold shadow-sm transition ${
        variant === "primary"
          ? "bg-[#820c0c] text-white hover:bg-[#6b0a0a] active:scale-[.98]"
          : variant === "danger"
            ? "border border-red-200 bg-white text-red-700 hover:bg-red-50"
            : "border border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50"
      }`}
    >
      {children}
    </button>
  );
}

function Label({ children }) {
  return <div className="mb-1 text-[11px] font-bold uppercase text-neutral-500">{children}</div>;
}

function Field({ label, value, onChange, right = false, placeholder }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`h-10 w-full rounded-md border border-neutral-300 px-3 ${right ? "text-right" : ""}`}
      />
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

function Modal({ children, close, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-neutral-950/60 p-4 print:static print:bg-white print:p-0">
      <div className={`mx-auto mb-3 flex ${wide ? "max-w-[1100px]" : "max-w-[980px]"} justify-end gap-2 print:hidden`}>{close}</div>
      <div className={`mx-auto ${wide ? "max-w-[1100px]" : "max-w-[980px]"} bg-white p-6 shadow-2xl print:max-w-none print:p-0 print:shadow-none`}>{children}</div>
    </div>
  );
}

// ---------- seznam nabídek ----------

function QuotesModal({ quotes, currentId, onLoad, onDuplicate, onDelete, onStatus, onInvoice, onExport, onImport, close }) {
  return (
    <Modal
      wide
      close={
        <>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4" />
            Export zálohy
          </Button>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-bold text-neutral-900 hover:bg-neutral-50">
            <Upload className="h-4 w-4" />
            Import
            <input type="file" accept="application/json" className="hidden" onChange={onImport} />
          </label>
          <Button variant="outline" onClick={close}>
            <X className="h-4 w-4" />
          </Button>
        </>
      }
    >
      <h1 className="mb-4 border-l-4 border-[#820c0c] pl-2 text-xl font-black">Uložené nabídky</h1>
      {quotes.length === 0 && <div className="rounded-md border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">Zatím žádné uložené nabídky. Vyplň zákazníka a klikni na „Uložit nabídku“.</div>}
      <div className="space-y-2">
        {quotes.map((quote) => {
          const status = statusInfo(quote.status);
          return (
            <div key={quote.id} className={`flex flex-wrap items-center gap-3 rounded-md border p-3 ${quote.id === currentId ? "border-blue-300 bg-blue-50/50" : "border-neutral-200"}`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-bold">{quote.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${status.className}`}>{status.label}</span>
                  {quote.id === currentId && <span className="text-[10px] font-bold text-blue-600">OTEVŘENO</span>}
                </div>
                <div className="text-xs text-neutral-500">
                  {quote.customer?.name || "Bez zákazníka"} · upraveno {dateCz(quote.updatedAt)} · platnost do {dateCz(quote.validUntil)}
                </div>
              </div>
              <div className="text-right font-black">{czk(quote.total)}</div>
              <select className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm" value={quote.status} onChange={(event) => onStatus(quote, event.target.value)}>
                {QUOTE_STATUSES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-1.5">
                <Button variant="outline" onClick={() => onLoad(quote)}>
                  <FolderOpen className="h-4 w-4" />
                  Načíst
                </Button>
                <Button variant="outline" onClick={() => onDuplicate(quote)} title="Duplikovat">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => onInvoice(quote)}>
                  <FileText className="h-4 w-4" />
                  Faktura
                </Button>
                <Button variant="danger" onClick={() => onDelete(quote)} title="Smazat">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

// ---------- seznam faktur ----------

function InvoicesModal({ invoices, onView, onPaid, onDelete, close }) {
  const overdue = (invoice) => !invoice.paid && invoice.dueDate < todayIso();
  return (
    <Modal
      wide
      close={
        <Button variant="outline" onClick={close}>
          <X className="h-4 w-4" />
        </Button>
      }
    >
      <h1 className="mb-4 border-l-4 border-[#820c0c] pl-2 text-xl font-black">Faktury</h1>
      {invoices.length === 0 && <div className="rounded-md border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">Zatím žádné faktury. Vytvoříš je z uložené nabídky tlačítkem „Faktura“.</div>}
      <div className="space-y-2">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="flex flex-wrap items-center gap-3 rounded-md border border-neutral-200 p-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-black">č. {invoice.number}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${invoice.paid ? "bg-emerald-100 text-emerald-800" : overdue(invoice) ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>
                  {invoice.paid ? "Zaplaceno" : overdue(invoice) ? "Po splatnosti" : "Čeká na platbu"}
                </span>
              </div>
              <div className="text-xs text-neutral-500">
                {invoice.customer?.name || "Bez zákazníka"} · {invoice.quoteName} · vystaveno {dateCz(invoice.issueDate)} · splatnost {dateCz(invoice.dueDate)}
              </div>
            </div>
            <div className="text-right font-black">{czk(invoice.total)}</div>
            <div className="flex gap-1.5">
              <Button variant="outline" onClick={() => onPaid(invoice)}>
                {invoice.paid ? "Zrušit úhradu" : "Zaplaceno"}
              </Button>
              <Button variant="outline" onClick={() => onView(invoice)}>
                <Eye className="h-4 w-4" />
                Zobrazit
              </Button>
              <Button variant="danger" onClick={() => onDelete(invoice)} title="Smazat">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ---------- faktura – tisková podoba ----------

function InvoiceModal({ invoice, company, close }) {
  // faktura nese snapshot dodavatele z doby vystavení; starší faktury spadnou na aktuální nastavení
  const supplier = { ...company, ...(invoice.supplier ?? {}) };
  const spayd = buildSpayd({
    account: supplier.account,
    amount: invoice.total,
    vs: invoice.number,
    message: `FAKTURA ${invoice.number}`,
    dueDate: invoice.dueDate,
  });
  return (
    <Modal
      close={
        <>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Tisk
          </Button>
          <Button variant="outline" onClick={close}>
            <X className="h-4 w-4" />
          </Button>
        </>
      }
    >
      <div data-print-root>
        <header className="flex items-start justify-between gap-4 border-b-4 pb-4" style={{ borderColor: BRAND }}>
          <Logo name={supplier.name} subtitle={supplier.subtitle} markClass="h-14 w-14" titleClass="text-2xl" />
          <div className="text-right">
            <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: BRAND }}>Faktura</h1>
            <div className="text-lg font-black">č. {invoice.number}</div>
            <div className="mt-1 text-xs text-neutral-500">Variabilní symbol: {invoice.number}</div>
          </div>
        </header>

        <div className="mt-5 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-neutral-200 p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: BRAND }}>Dodavatel</div>
            <div className="mt-1 font-black">{supplier.name || "— vyplň v administraci"}</div>
            <div className="text-sm leading-6 text-neutral-700">
              <div>{supplier.address}</div>
              <div>IČO: {supplier.ico || "—"}</div>
              {supplier.dic && <div>DIČ: {supplier.dic}</div>}
              <div>{supplier.phone}</div>
              <div>{supplier.email}</div>
            </div>
            <div className="mt-2 text-[11px] leading-4 text-neutral-500">
              {supplier.register}
              <br />
              <b className="text-neutral-700">{supplier.vatNote}</b>
            </div>
          </div>
          <div className="rounded-lg border border-neutral-200 p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: BRAND }}>Odběratel</div>
            <div className="mt-1 font-black">{invoice.customer?.name || "—"}</div>
            <div className="text-sm leading-6 text-neutral-700">
              <div>{invoice.customer?.address}</div>
              {invoice.customer?.ico && <div>IČO: {invoice.customer.ico}</div>}
              <div>{invoice.customer?.phone}</div>
              <div>{invoice.customer?.email}</div>
            </div>
          </div>
          <div className="rounded-lg bg-neutral-50 p-3 text-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: BRAND }}>Data a úhrada</div>
            <dl className="mt-1 space-y-1 leading-6 text-neutral-700">
              <div className="flex justify-between gap-2"><dt>Datum vystavení:</dt><dd className="font-bold">{dateCz(invoice.issueDate)}</dd></div>
              <div className="flex justify-between gap-2"><dt>Datum uskut. plnění:</dt><dd className="font-bold">{dateCz(invoice.supplyDate ?? invoice.issueDate)}</dd></div>
              <div className="flex justify-between gap-2"><dt>Datum splatnosti:</dt><dd className="font-bold">{dateCz(invoice.dueDate)}</dd></div>
              <div className="flex justify-between gap-2"><dt>Forma úhrady:</dt><dd className="font-bold">převodem</dd></div>
            </dl>
          </div>
        </div>

        <section className="mt-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-neutral-600">Fakturujeme Vám ({invoice.quoteName})</h2>
          <table className="w-full border-collapse text-xs">
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
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <Td>{item.name}</Td>
                  <Td center>{item.unit}</Td>
                  <Td right>{f2(item.qty)}</Td>
                  <Td right>{czk(item.price)}</Td>
                  <Td right strong>{czk(item.total)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-6 flex flex-wrap items-start justify-between gap-6">
          <div className="text-sm leading-7 text-neutral-700">
            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: BRAND }}>Platební údaje</div>
            <div>Číslo účtu: <b>{supplier.account || "— (vyplň v administraci)"}</b></div>
            {supplier.account && czAccountToIban(supplier.account) && <div>IBAN: <b>{czAccountToIban(supplier.account)}</b></div>}
            <div>Variabilní symbol: <b>{invoice.number}</b></div>
          </div>
          <div className="flex items-start gap-6">
            {spayd ? (
              <div className="text-center">
                <QRCodeSVG value={spayd} size={132} marginSize={2} />
                <div className="mt-1 text-[10px] font-bold uppercase text-neutral-500">QR platba</div>
              </div>
            ) : (
              <div className="max-w-[200px] rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 print:hidden">
                QR platba se zobrazí po vyplnění čísla účtu v administraci (tlačítko Admin v horní liště).
              </div>
            )}
            <div className="rounded-lg p-4 text-right text-white shadow-md" style={{ backgroundColor: BRAND }}>
              <div className="text-xs uppercase tracking-wide opacity-80">Celkem k úhradě</div>
              <div className="text-3xl font-black">{czk(invoice.total)}</div>
              <div className="mt-1 text-[10px] opacity-80">Neplátce DPH – cena je konečná</div>
            </div>
          </div>
        </section>

        <section className="mt-10 flex items-end justify-between gap-6">
          <div className="text-xs text-neutral-500">
            Vystavil: <b className="text-neutral-800">{supplier.name}</b>
            <br />
            {supplier.phone} · {supplier.email}
          </div>
          <div className="w-56 border-t border-neutral-400 pt-1 text-center text-[11px] text-neutral-500">Razítko a podpis</div>
        </section>

        <footer className="mt-6 border-t-2 pt-2 text-center text-[10px] text-neutral-500" style={{ borderColor: BRAND }}>
          {[supplier.name, supplier.ico && `IČO ${supplier.ico}`, supplier.address, supplier.phone, supplier.email, supplier.web].filter(Boolean).join(" · ")} — {supplier.register} {supplier.vatNote}
        </footer>
      </div>
    </Modal>
  );
}

// ---------- nabídka – tisková podoba ----------

function PreviewModal({ calc, settings, customer, meta, company, close }) {
  return (
    <Modal
      close={
        <>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Tisk
          </Button>
          <Button variant="outline" onClick={close}>
            <X className="h-4 w-4" />
          </Button>
        </>
      }
    >
      <div data-print-root>
        <Preview calc={calc} settings={settings} customer={customer} meta={meta} company={company} />
      </div>
    </Modal>
  );
}

function Preview({ calc, settings, customer, meta, company }) {
  return (
    <div>
      <header className="flex items-start justify-between gap-4 border-b-4 pb-4" style={{ borderColor: BRAND }}>
        <div>
          <Logo name={company.name} subtitle={company.subtitle} markClass="h-14 w-14" titleClass="text-2xl" />
          <div className="mt-3 text-sm leading-6 text-neutral-700">
            <div>{company.address}</div>
            <div>IČO: {company.ico || "—"}</div>
            <div>{[company.phone, company.email].filter(Boolean).join(" · ")}</div>
            <div className="font-semibold">{company.web}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-black uppercase tracking-tight" style={{ color: BRAND }}>Cenová nabídka</div>
          <div className="text-xs font-semibold uppercase text-neutral-500">Kalkulace oprav omítek</div>
          {meta?.name && <div className="mt-1 font-bold">{meta.name}</div>}
          <div className="mt-1 text-sm text-neutral-600">Datum: {new Date().toLocaleDateString("cs-CZ")}</div>
          {meta?.validUntil && <div className="text-sm text-neutral-600">Platnost nabídky do: <b>{dateCz(meta.validUntil)}</b></div>}
          <div className="mt-3 text-3xl font-black" style={{ color: BRAND }}>{czk(calc.subtotal)}</div>
          <div className="text-xs text-neutral-500">Cena bez DPH – neplátce</div>
        </div>
      </header>

      {customer?.name && (
        <section className="mt-4 rounded-lg bg-neutral-50 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: BRAND }}>Zákazník</div>
          <div className="text-sm leading-6 text-neutral-700">
            <b>{customer.name}</b>
            {customer.address ? ` · ${customer.address}` : ""}
            {customer.ico ? ` · IČO: ${customer.ico}` : ""}
            {customer.phone ? ` · ${customer.phone}` : ""}
            {customer.email ? ` · ${customer.email}` : ""}
          </div>
        </section>
      )}

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

      <footer className="mt-6 border-t-2 pt-2 text-center text-[10px] text-neutral-500" style={{ borderColor: BRAND }}>
        {[company.name, company.ico && `IČO ${company.ico}`, company.address, company.phone, company.email, company.web].filter(Boolean).join(" · ")} — {company.register} {company.vatNote}
      </footer>
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
  return <th className={`border border-neutral-300 bg-[#f5ecec] p-2 text-left text-neutral-800 ${right ? "text-right" : ""}`}>{children}</th>;
}

function Td({ children, right = false, center = false, strong = false }) {
  return <td className={`border border-neutral-300 p-2 ${right ? "text-right" : ""} ${center ? "text-center" : ""} ${strong ? "font-bold" : ""}`}>{children}</td>;
}
