"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  ChevronDown,
  Copy,
  Download,
  Eye,
  FilePlus2,
  FileText,
  FolderOpen,
  GripVertical,
  PenLine,
  Plus,
  Printer,
  RotateCcw,
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
  WALL_COLORS,
  uid,
  wallStats,
} from "./core";
import Room3D from "./Room3D";
import SketchModal from "./Sketch";
import { BRAND, Logo } from "./Logo";
import { defaultDesign, designStyle, DOC_STYLE, readLogoFile, SPACING_CSS, defaultRooms, flattenRooms, makeRoom, roomsFromData, TRASH_TTL_DAYS, setStorageNamespace } from "./core";

const emptyMeta = { id: null, number: null, name: "", validUntil: "", status: "draft" };

export default function KalkulacePage({ presetCompany, storageNamespace }: { presetCompany?: Record<string, any>; storageNamespace?: string } = {}) {
  // Oddělené úložiště pro brandované instance (/jindra/bac/{ico}); výchozí instance má prostor prázdný.
  setStorageNamespace(storageNamespace);
  const [rooms, setRooms] = useState(defaultRooms);
  const [activeRoomId, setActiveRoomId] = useState(defaultRooms[0].id);
  const [trash, setTrash] = useState([]);
  const [trashOpen, setTrashOpen] = useState(false);
  const [sketchOpen, setSketchOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [selectedWallId, setSelectedWallId] = useState(null);
  const selectWallTimer = useRef(null);
  // ruční dokument: { kind: "quote" | "invoice", initial?: uložená ruční nabídka }
  const [manualDoc, setManualDoc] = useState(null);
  const [works, setWorks] = useState(defaultWorks);
  const [globalRows, setGlobalRows] = useState(defaultGlobalRows);
  const [materials, setMaterials] = useState(defaultMaterials);
  const [settings, setSettings] = useState(defaultSettings);
  const [customer, setCustomer] = useState(defaultCustomer);
  const [meta, setMeta] = useState(emptyMeta);
  const [company, setCompany] = useState(presetCompany ? { ...defaultCompany, ...presetCompany } : defaultCompany);
  const [quotes, setQuotes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [savedFlash, setSavedFlash] = useState("");
  const [aresBusy, setAresBusy] = useState(false);
  const [design, setDesign] = useState(defaultDesign);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [quotesOpen, setQuotesOpen] = useState(false);
  const [invoicesOpen, setInvoicesOpen] = useState(false);
  const [invoiceView, setInvoiceView] = useState(null);
  const [show3D, setShow3D] = useState(false);
  const [draggedWallId, setDraggedWallId] = useState(null);

  // aktivní místnost (tab) – stěny na obrazovce patří jí, výpočet jde přes všechny místnosti
  const activeRoom = rooms.find((room) => room.id === activeRoomId) ?? rooms[0];
  const walls = activeRoom?.walls ?? [];
  const setWalls = (updater) =>
    setRooms((prev) =>
      prev.map((room) => (room.id === (prev.some((r) => r.id === activeRoomId) ? activeRoomId : prev[0]?.id) ? { ...room, walls: typeof updater === "function" ? updater(room.walls) : updater } : room)),
    );

  const allWalls = useMemo(() => flattenRooms(rooms), [rooms]);
  const calc = useMemo(() => buildCalculation({ walls: allWalls, works, globalRows, materials, settings }), [allWalls, works, globalRows, materials, settings]);

  // načtení uložených dat po startu (localStorage není při SSR)
  useEffect(() => {
    const presets = storage.loadPresets();
    const saved = storage.loadAutosave();
    if (saved) {
      const loadedRooms = roomsFromData(saved);
      setRooms(loadedRooms);
      setActiveRoomId(loadedRooms.some((room) => room.id === saved.activeRoomId) ? saved.activeRoomId : loadedRooms[0].id);
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
    let savedCompany = storage.loadCompany();
    // úklid dřívějšího demo-poluce: výchozí instance (bez presetu) nesmí ukazovat Fenchak
    if (!presetCompany && savedCompany.ico === "21693021") {
      savedCompany = { ...defaultCompany };
      storage.saveCompany(savedCompany);
    }
    // preset doplní údaje podnikatele; rastrové logo nahrané v adminu (PNG/JPG) zachováme,
    // ale prázdné nebo naše generované SVG logo necháme presetem aktualizovat
    const savedIsRealUpload = /^data:image\/(png|jpe?g|webp|gif)/i.test(savedCompany.logo || "");
    const nextCompany = presetCompany
      ? { ...savedCompany, ...presetCompany, logo: savedIsRealUpload ? savedCompany.logo : presetCompany.logo || savedCompany.logo }
      : savedCompany;
    setCompany(nextCompany);
    if (presetCompany) storage.saveCompany(nextCompany);
    setDesign(storage.loadDesign());
    setTrash(storage.loadTrash());
    setLoaded(true);
  }, []);

  // velikost písma z nastavení vzhledu (rem škáluje celé rozhraní)
  useEffect(() => {
    document.documentElement.style.fontSize = `${design.fontScale ?? 100}%`;
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [design.fontScale]);

  // auto-ukládání rozpracované kalkulace
  useEffect(() => {
    if (!loaded) return;
    storage.saveAutosave({ rooms, activeRoomId, works, globalRows, materials, settings, customer, meta });
  }, [loaded, rooms, activeRoomId, works, globalRows, materials, settings, customer, meta]);

  // ---------- místnosti (taby) ----------

  const persistTrash = (next) => {
    setTrash(next);
    storage.saveTrash(next);
  };

  const addRoom = () => {
    const room = makeRoom(rooms.length + 1);
    setRooms((prev) => [...prev, room]);
    setActiveRoomId(room.id);
  };

  const renameRoom = (roomId, name) => setRooms((prev) => prev.map((room) => (room.id === roomId ? { ...room, name } : room)));
  const setRoomKind = (roomId, kind) => setRooms((prev) => prev.map((room) => (room.id === roomId ? { ...room, kind } : room)));

  // klik na stěnu ve 3D: sjede na kartu stěny a na chvíli ji zvýrazní
  const selectWall = (wallId) => {
    setSelectedWallId(wallId);
    requestAnimationFrame(() => document.getElementById(`wall-${wallId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
    if (selectWallTimer.current) window.clearTimeout(selectWallTimer.current);
    selectWallTimer.current = window.setTimeout(() => setSelectedWallId(null), 3500);
  };

  // strop dává smysl u interiéru, jakmile jsou aspoň 3 stěny a ještě žádný není (u fasády strop nemá smysl)
  const canAddCeiling = walls.length >= 3 && !walls.some((wall) => wall.ceiling) && activeRoom?.kind !== "facade";
  const addCeiling = () => {
    let width = 400;
    let depth = 300;
    const points = activeRoom?.plan?.points;
    if (points?.length >= 3) {
      const xs = points.map((p) => p.x);
      const ys = points.map((p) => p.y);
      width = Math.round(Math.max(...xs) - Math.min(...xs));
      depth = Math.round(Math.max(...ys) - Math.min(...ys));
    } else if (walls.length >= 2) {
      width = Math.max(1, Math.round(n(walls[0].width))) || 400;
      depth = Math.max(1, Math.round(n(walls[1].width))) || 300;
    }
    const ceiling = { id: uid(), name: "Strop", ceiling: true, width, height: depth, scope: "visual", openings: [], workIds: ["malba"] };
    setWalls((prev) => [...prev, ceiling]);
    selectWall(ceiling.id);
  };

  const deleteRoom = (room) => {
    if (!window.confirm(`Smazat místnost „${room.name}“ (${room.walls.length} stěn)?\n\nPřesune se do koše – odtud ji lze do týdne obnovit.`)) return;
    persistTrash([{ room, deletedAt: new Date().toISOString() }, ...trash]);
    setRooms((prev) => {
      const rest = prev.filter((item) => item.id !== room.id);
      const next = rest.length ? rest : [makeRoom(1)];
      if (room.id === activeRoomId) setActiveRoomId(next[0].id);
      return next;
    });
  };

  const restoreRoom = (entry) => {
    const exists = rooms.some((room) => room.id === entry.room.id);
    const restored = exists ? { ...entry.room, id: uid() } : entry.room;
    setRooms((prev) => [...prev, restored]);
    setActiveRoomId(restored.id);
    persistTrash(trash.filter((item) => item !== entry));
    setTrashOpen(false);
    flash(`Místnost „${entry.room.name}“ obnovena ✓`);
  };

  const uploadLogo = async (file) => {
    if (!file) return;
    try {
      const logo = await readLogoFile(file);
      const next = { ...company, logo };
      setCompany(next);
      storage.saveCompany(next);
      flash("Logo uloženo ✓");
    } catch (error) {
      window.alert(error.message);
    }
  };

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
    const number = existing?.number ?? ((!asNew && meta.number) || storage.nextQuoteNumber());
    const name =
      (asNew ? `${meta.name || customer.name || "Nabídka"} (kopie)` : meta.name?.trim()) ||
      (customer.name?.trim() ? `${number}_${customer.name.trim()}` : "") ||
      `${number}_${dateCz(todayIso())}`;
    const validUntil = meta.validUntil || addDaysIso(company.validityDays);
    const quote = {
      id,
      number,
      name,
      customer,
      status: existing?.status ?? meta.status ?? "draft",
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      validUntil,
      total: calc.subtotal,
      // walls (zploštěné) zůstávají kvůli výpočtu faktur a starším verzím dat
      data: { rooms, walls: allWalls, works, globalRows, materials, settings },
    };
    persistQuotes(existing ? quotes.map((item) => (item.id === id ? quote : item)) : [quote, ...quotes]);
    setMeta({ id, number, name, validUntil, status: quote.status });
    flash(existing ? "Nabídka přepsána ✓" : "Nabídka uložena ✓");
  };

  const loadQuote = (quote) => {
    // ručně psaná nabídka nemá stěny – otevře se v řádkovém editoru
    if (quote.manual) {
      setManualDoc({ kind: "quote", initial: quote });
      setQuotesOpen(false);
      return;
    }
    const loadedRooms = roomsFromData(quote.data);
    setRooms(loadedRooms);
    setActiveRoomId(loadedRooms[0].id);
    setWorks(quote.data.works);
    setGlobalRows(quote.data.globalRows);
    setMaterials(quote.data.materials);
    setSettings(quote.data.settings);
    setCustomer(quote.customer ?? defaultCustomer);
    setMeta({ id: quote.id, number: quote.number ?? null, name: quote.name, validUntil: quote.validUntil ?? "", status: quote.status ?? "draft" });
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
    const freshRooms = JSON.parse(JSON.stringify(defaultRooms));
    setRooms(freshRooms);
    setActiveRoomId(freshRooms[0].id);
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
    // ruční nabídka přenese své řádky 1:1, kalkulovaná projde výpočtem
    const quoteCalc = quote.manual ? null : buildCalculation(quote.data);
    const invoice = {
      id: uid(),
      number: storage.nextInvoiceNumber(),
      quoteId: quote.id,
      quoteName: quote.name,
      customer: quote.customer ?? defaultCustomer,
      items: quote.manual
        ? quote.items.map((row) => ({ name: row.name, unit: row.unit || "kpl", qty: n(row.qty), price: n(row.price), total: n(row.qty) * n(row.price) }))
        : buildInvoiceItems(quoteCalc, quote.data.settings),
      total: quote.manual ? quote.total : quoteCalc.subtotal,
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

  // „Vyhotovit fakturu“ z lišty dokumentu: uloží aktuální stav nabídky a rovnou z ní vystaví fakturu
  const invoiceFromCurrent = () => {
    const existing = meta.id ? quotes.find((quote) => quote.id === meta.id) : null;
    const confirmName = meta.name?.trim() || customer.name?.trim() || "aktuální nabídka";
    if (!window.confirm(`Vyhotovit fakturu z nabídky „${confirmName}“?\n\nNabídka se uloží a označí jako fakturovaná.`)) return;
    const id = meta.id ?? uid();
    const number = existing?.number ?? meta.number ?? storage.nextQuoteNumber();
    const name = meta.name?.trim() || (customer.name?.trim() ? `${number}_${customer.name.trim()}` : `${number}_${dateCz(todayIso())}`);
    const validUntil = meta.validUntil || addDaysIso(company.validityDays);
    const quote = {
      id,
      number,
      name,
      customer,
      status: "invoiced",
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      validUntil,
      total: calc.subtotal,
      data: { rooms, walls: allWalls, works, globalRows, materials, settings },
    };
    persistQuotes(existing ? quotes.map((item) => (item.id === id ? quote : item)) : [quote, ...quotes]);
    setMeta({ id, number, name, validUntil, status: "invoiced" });
    const invoice = {
      id: uid(),
      number: storage.nextInvoiceNumber(),
      quoteId: id,
      quoteName: name,
      customer,
      items: buildInvoiceItems(calc, settings),
      total: calc.subtotal,
      issueDate: todayIso(),
      supplyDate: todayIso(),
      dueDate: addDaysIso(company.dueDays),
      supplier: company,
      paid: false,
      createdAt: new Date().toISOString(),
    };
    persistInvoices([invoice, ...invoices]);
    setInvoiceView(invoice);
    flash("Faktura vyhotovena ✓");
  };

  // uložení ručně psané nabídky (řádkový editor)
  const saveManualQuote = ({ customer: docCustomer, items, validUntil }) => {
    const existing = manualDoc?.initial?.id ? quotes.find((quote) => quote.id === manualDoc.initial.id) : null;
    const id = existing?.id ?? uid();
    const number = existing?.number ?? storage.nextQuoteNumber();
    const total = items.reduce((sum, row) => sum + n(row.qty) * n(row.price), 0);
    const quote = {
      id,
      number,
      name: existing?.name ?? `${number}_${docCustomer.name?.trim() || "ruční nabídka"}`,
      customer: docCustomer,
      status: existing?.status ?? "draft",
      manual: true,
      items,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      validUntil: validUntil || addDaysIso(company.validityDays),
      total,
    };
    persistQuotes(existing ? quotes.map((item) => (item.id === id ? quote : item)) : [quote, ...quotes]);
    setManualDoc(null);
    flash(existing ? "Nabídka přepsána ✓" : "Nabídka uložena ✓");
  };

  // vystavení ručně psané faktury (bez vazby na nabídku)
  const createManualInvoice = ({ customer: docCustomer, items, issueDate, supplyDate, dueDate }) => {
    const invoice = {
      id: uid(),
      number: storage.nextInvoiceNumber(),
      quoteId: null,
      quoteName: "",
      customer: docCustomer,
      items: items.map((row) => ({ name: row.name, unit: row.unit || "kpl", qty: n(row.qty), price: n(row.price), total: n(row.qty) * n(row.price) })),
      total: items.reduce((sum, row) => sum + n(row.qty) * n(row.price), 0),
      issueDate,
      supplyDate,
      dueDate,
      supplier: company,
      paid: false,
      createdAt: new Date().toISOString(),
    };
    persistInvoices([invoice, ...invoices]);
    setManualDoc(null);
    setInvoiceView(invoice);
    flash("Faktura vyhotovena ✓");
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
  const addOpening = (wallId, opening) => setWalls((prev) => prev.map((wall) => (wall.id === wallId ? { ...wall, openings: [...wall.openings, opening] } : wall)));
  const removeOpening = (wallId, openingId) =>
    setWalls((prev) => prev.map((wall) => (wall.id === wallId ? { ...wall, openings: wall.openings.filter((opening) => opening.id !== openingId) } : wall)));

  // podlahové objekty (schodiště, kamna, komín) – patří místnosti, ne stěně
  const updateActiveRoom = (patch) => setRooms((prev) => prev.map((room) => (room.id === activeRoomId ? { ...room, ...(typeof patch === "function" ? patch(room) : patch) } : room)));
  const addFloorObject = (obj) => updateActiveRoom((room) => ({ floor: [...(room.floor ?? []), obj] }));
  const updateFloorObject = (objId, patch) => updateActiveRoom((room) => ({ floor: (room.floor ?? []).map((obj) => (obj.id === objId ? { ...obj, ...patch } : obj)) }));
  const removeFloorObject = (objId) => updateActiveRoom((room) => ({ floor: (room.floor ?? []).filter((obj) => obj.id !== objId) }));
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

  // automatický název nabídky: číslo_zákazník (dokud ho uživatel ručně nepřepíše)
  const autoName = loaded && customer.name?.trim() ? `${meta.number ?? storage.peekQuoteNumber()}_${customer.name.trim()}` : "";
  const quoteInvoice = meta.id ? invoices.find((invoice) => invoice.quoteId === meta.id) : null;

  return (
    <main data-kalk className="min-h-screen bg-[var(--bg)] p-3 text-[var(--text)]" style={designStyle(design)}>
      {/* při tisku se zobrazí jen obsah označený data-print-root */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body * { visibility: hidden; }
          [data-print-root], [data-print-root] * { visibility: visible; }
          [data-print-root] { position: absolute; left: 0; top: 0; width: 100%; }
        }
        ${SPACING_CSS}
      `,
        }}
      />
      <div className="mx-auto max-w-[1600px] space-y-3">
        <header className="sticky top-0 z-40 -mx-3 -mt-3 border-b-2 border-[var(--brand)] bg-[var(--header-bg)] px-4 py-2 shadow-md backdrop-blur print:hidden">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex min-w-0 items-center gap-3">
              {company.logo ? (
                <label className="group relative shrink-0 cursor-pointer" title="Kliknutím změníš logo">
                  <img src={company.logo} alt="Logo" className="h-10 w-auto max-w-[120px] object-contain" />
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadLogo(event.target.files?.[0])} />
                </label>
              ) : (
                <label
                  className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-[var(--radius-sm)] border border-dashed border-[var(--muted)] px-2.5 text-[11px] font-bold uppercase text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                  title="Nahraj logo firmy (PNG, JPG…)"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Přidat logo
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadLogo(event.target.files?.[0])} />
                </label>
              )}
              <div className="min-w-0">
                <h1 className="truncate text-lg font-black uppercase leading-tight tracking-tight" style={{ color: BRAND }}>
                  Kalkulačka {company.web ? <span className="text-[var(--text)]">{company.web}</span> : <span className="text-[var(--text)]">nacenění</span>}
                </h1>
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span className="truncate">{company.subtitle || "Kalkulace a fakturace"}</span>
                  {savedFlash && <span className="font-bold text-emerald-600">{savedFlash}</span>}
                </div>
              </div>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <div
                className="rounded-[var(--radius)] border px-3 py-1.5 text-right"
                style={{ borderColor: "color-mix(in srgb, var(--brand) 18%, transparent)", background: "color-mix(in srgb, var(--brand) 6%, transparent)" }}
              >
                <div className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">Celkem bez DPH</div>
                <div className="text-xl font-black leading-tight" style={{ color: BRAND }}>{czk(calc.subtotal)}</div>
              </div>
              <div className="relative">
                <Button variant="outline" onClick={() => setDocsOpen((prev) => !prev)}>
                  <FolderOpen className="h-4 w-4" />
                  Dokumenty
                  <ChevronDown className={`h-3.5 w-3.5 transition ${docsOpen ? "rotate-180" : ""}`} />
                </Button>
                {docsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDocsOpen(false)} />
                    <div className="absolute right-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] shadow-xl">
                      <button
                        type="button"
                        onClick={() => { setQuotesOpen(true); setDocsOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-bold transition hover:bg-[var(--bg-soft)]"
                      >
                        <FolderOpen className="h-4 w-4 text-[var(--muted)]" />
                        Nabídky
                        <span className="ml-auto rounded-full bg-[var(--bg)] px-2 text-xs font-black text-[var(--muted)]">{quotes.length}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setInvoicesOpen(true); setDocsOpen(false); }}
                        className="flex w-full items-center gap-2 border-t border-[var(--line)] px-3 py-2.5 text-sm font-bold transition hover:bg-[var(--bg-soft)]"
                      >
                        <FileText className="h-4 w-4 text-[var(--muted)]" />
                        Faktury
                        <span className="ml-auto rounded-full bg-[var(--bg)] px-2 text-xs font-black text-[var(--muted)]">{invoices.length}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
              <a
                href="/kalkulace/admin"
                title="Administrace – údaje podnikatele a ceníky"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm font-bold text-[var(--text)] shadow-sm transition hover:border-[var(--muted)] hover:bg-[var(--bg-soft)]"
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

        {/* lišta dokumentu: typ + přepisovatelný název + stav + faktura */}
        <div className="flex flex-wrap items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-3 py-2 shadow-sm print:hidden">
          <span
            className="rounded-[var(--radius-sm)] px-2 py-1 text-[11px] font-black uppercase tracking-wider text-white"
            style={{ backgroundColor: "var(--brand)" }}
          >
            Nabídka
          </span>
          <input
            value={meta.name || autoName}
            onFocus={() => {
              if (!meta.name && autoName) setMeta((prev) => ({ ...prev, name: autoName }));
            }}
            onChange={(event) => setMeta((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Název se doplní podle zákazníka…"
            title="Název nabídky – klikni a přepiš"
            className="min-w-0 flex-1 bg-transparent text-base font-black outline-none placeholder:font-normal placeholder:text-[var(--muted)]"
          />
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${currentStatus.className}`}>{currentStatus.label}</span>
          {quoteInvoice ? (
            <button
              type="button"
              onClick={() => setInvoiceView(quoteInvoice)}
              title={`Otevřít fakturu č. ${quoteInvoice.number}`}
              className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
            >
              <FileText className="h-4 w-4" />
              Faktura {quoteInvoice.number}
              {quoteInvoice.paid && <span>✓ zaplaceno</span>}
            </button>
          ) : (
            <button
              type="button"
              onClick={invoiceFromCurrent}
              title="Uloží nabídku a vystaví z ní fakturu (s potvrzením)"
              className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-soft)] px-2 py-1 text-xs font-bold text-[var(--text-soft)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              <FilePlus2 className="h-4 w-4" />
              Vyhotovit fakturu
            </button>
          )}
        </div>

        <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)]">
          <section className="min-w-0 space-y-3">
            {/* taby místností */}
            <div className="flex flex-wrap items-end gap-1.5">
              {rooms.map((room) =>
                room.id === activeRoom?.id ? (
                  <div
                    key={room.id}
                    className="flex items-center gap-1 rounded-[var(--radius)] border-2 border-[var(--brand)] bg-[var(--card)] py-1.5 pl-3 pr-1.5 shadow-sm"
                  >
                    <input
                      value={room.name}
                      onChange={(event) => renameRoom(room.id, event.target.value)}
                      title="Název místnosti – klikni a přepiš"
                      className="bg-transparent text-sm font-black outline-none"
                      style={{ width: `${Math.max(7, String(room.name).length + 1)}ch` }}
                    />
                    <span className="rounded-full bg-[var(--bg)] px-1.5 text-[10px] font-bold text-[var(--muted)]">{room.walls.length}</span>
                    <button
                      type="button"
                      onClick={() => deleteRoom(room)}
                      title="Smazat místnost (přesune se do koše)"
                      className="grid h-6 w-6 place-items-center rounded-full text-[var(--muted)] transition hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setActiveRoomId(room.id)}
                    className="flex items-center gap-1.5 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2 text-sm font-bold text-[var(--text-soft)] transition hover:border-[var(--muted)] hover:bg-[var(--card)]"
                  >
                    {room.name}
                    <span className="rounded-full bg-[var(--bg)] px-1.5 text-[10px] font-bold text-[var(--muted)]">{room.walls.length}</span>
                  </button>
                ),
              )}
              <button
                type="button"
                onClick={addRoom}
                className="flex items-center gap-1 rounded-[var(--radius)] border border-dashed border-[var(--muted)] px-3 py-2 text-sm font-bold text-[var(--muted)] opacity-70 transition hover:border-[var(--brand)] hover:text-[var(--brand)] hover:opacity-100"
              >
                <Plus className="h-4 w-4" />
                Přidat místnost
              </button>
              <button
                type="button"
                onClick={() => setTrashOpen(true)}
                title="Koš smazaných místností"
                className="ml-auto flex items-center gap-1.5 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-2.5 py-2 text-xs font-bold text-[var(--muted)] transition hover:border-[var(--muted)] hover:text-[var(--text)]"
              >
                <Trash2 className="h-4 w-4" />
                Koš{trash.length > 0 && ` (${trash.length})`}
              </button>
            </div>

            {/* nástroje aktivní místnosti: náčrt + 3D náhled */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSketchOpen(true)}
                title="Načrtni půdorys místnosti myší – stěny se vytvoří samy"
                className="flex items-center gap-1.5 rounded-[var(--radius)] bg-[var(--brand)] px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)]"
              >
                <PenLine className="h-4 w-4" />
                {activeRoom?.plan ? "Upravit náčrt" : "Načrtnout půdorys"}
              </button>
              <Button variant="outline" onClick={() => setShow3D((prev) => !prev)}>
                <Box className="h-4 w-4" />
                {show3D ? "Skrýt 3D náhled" : "3D náhled"}
              </Button>
              <div className="inline-flex overflow-hidden rounded-[var(--radius)] border border-[var(--line)]" title="Typ plochy: interiér místnosti, nebo venkovní fasáda">
                {[
                  ["interior", "Interiér"],
                  ["facade", "Fasáda"],
                ].map(([kind, label]) => {
                  const current = (activeRoom?.kind ?? "interior") === kind;
                  // aktivní tlačítko má stejnou barvu jako stěny, které zapne (interiér i fasáda);
                  // neaktivní stav se zapisuje explicitně, aby se inline styl spolehlivě přebil
                  const colors = WALL_COLORS[kind];
                  return (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => setRoomKind(activeRoom.id, kind)}
                      className="px-3 py-2 text-sm font-bold transition"
                      style={
                        current
                          ? { backgroundColor: colors.fill, color: colors.stroke, boxShadow: `inset 0 0 0 2px ${colors.stroke}` }
                          : { backgroundColor: "var(--card)", color: "var(--text-soft)", boxShadow: "none" }
                      }
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="ml-auto text-right text-xs text-[var(--muted)]">
                {walls.length} stěn · <b className="text-[var(--text)]">{f2(walls.reduce((sum, wall) => sum + wallStats(wall).clean, 0))} m²</b> {activeRoom?.kind === "facade" ? "plochy fasády" : "čisté plochy"}
              </div>
            </div>

            {show3D && (
              <Card>
                <Room3D
                  walls={walls.filter((wall) => !wall.ceiling).map((wall) => ({ ...wall, openings: wall.openings.map((opening) => normalizeOpening(opening, wall)) }))}
                  works={works}
                  plan={activeRoom?.plan}
                  facade={activeRoom?.kind === "facade"}
                  floorObjects={activeRoom?.floor ?? []}
                  onSelectWall={selectWall}
                  onAddOpening={addOpening}
                  onUpdateOpening={updateOpening}
                  onRemoveOpening={removeOpening}
                  onAddFloorObject={addFloorObject}
                  onUpdateFloorObject={updateFloorObject}
                  onRemoveFloorObject={removeFloorObject}
                />
              </Card>
            )}

            {walls.map((wall) => {
              const stats = wallStats(wall);
              const displayWall = { ...wall, openings: wall.openings.map((opening) => normalizeOpening(opening, wall)) };
              return (
                <Card
                  key={wall.id}
                  id={`wall-${wall.id}`}
                  className={`${draggedWallId === wall.id ? "opacity-60 ring-2 ring-blue-300" : ""} ${selectedWallId === wall.id ? "ring-2 ring-[var(--brand)] shadow-lg" : ""}`}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    moveWall(draggedWallId, wall.id);
                    setDraggedWallId(null);
                  }}
                >
                  <div className="grid min-w-0 gap-3 2xl:grid-cols-[minmax(0,1fr)_300px]">
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
                            className="grid h-10 w-10 cursor-grab place-items-center rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] text-[var(--muted)] active:cursor-grabbing"
                          >
                            <GripVertical className="h-5 w-5" />
                          </button>
                        </div>
                        <Field label="Stěna" value={wall.name} onChange={(value) => updateWall(wall.id, { name: value })} />
                        <Field label="Šířka (cm)" value={wall.width} onChange={(value) => updateWall(wall.id, { width: value })} right />
                        <Field label={wall.ceiling ? "Hloubka (cm)" : "Výška (cm)"} value={wall.height} onChange={(value) => updateWall(wall.id, { height: value })} right />
                        <div>
                          <Label>Rozsah</Label>
                          <select className="h-10 w-full rounded-[var(--radius-sm)] border border-[var(--line)] px-2" value={wall.scope} onChange={(event) => updateWall(wall.id, { scope: event.target.value })}>
                            <option value="damaged">Poškozená</option>
                            <option value="visual">Navazující / pohledová</option>
                          </select>
                        </div>
                        <div className="rounded-[var(--radius-sm)] bg-[var(--bg)] px-3 py-2 text-right">
                          <div className="text-xs text-[var(--muted)]">Čistá plocha</div>
                          <div className="font-black">{f2(stats.clean)} m²</div>
                        </div>
                      </div>

                      <div className="mt-2 rounded-[var(--radius-sm)] bg-[var(--bg-soft)] p-2">
                        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                          <h2 className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">Odečty otvorů</h2>
                          <div className="flex gap-1">
                            {[
                              ["window", "Okno"],
                              ["door", "Dveře"],
                              ["other", "Jiné"],
                            ].map(([type, label]) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => updateWall(wall.id, { openings: [...wall.openings, openingDefaults(type, wall)] })}
                                className="inline-flex items-center gap-0.5 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--muted)] transition hover:border-[var(--muted)] hover:text-[var(--text)]"
                              >
                                <Plus className="h-3 w-3" />
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {wall.openings.length === 0 && <div className="px-1 text-[11px] text-[var(--muted)]">Bez odečtů.</div>}
                          {wall.openings.length > 0 && (
                            <div className="grid gap-1.5 px-2 text-[9px] font-bold uppercase text-[var(--muted)] xl:grid-cols-[72px_minmax(110px,440px)_52px_52px_40px_52px_88px_minmax(74px,1fr)_28px]">
                              <span>Typ</span>
                              <span>Název</span>
                              <span className="text-right">Šířka</span>
                              <span className="text-right">Výška</span>
                              <span className="text-right">Ks</span>
                              <span className="text-right">Zleva</span>
                              <span className="text-right">Od podlahy</span>
                              <span className="text-right">Odečet</span>
                              <span />
                            </div>
                          )}
                          {wall.openings.map((opening) => {
                            const normalized = normalizeOpening(opening, wall);
                            return (
                              <div key={opening.id} className="grid items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--card)] p-1.5 shadow-sm xl:grid-cols-[72px_minmax(110px,440px)_52px_52px_40px_52px_88px_minmax(74px,1fr)_28px]">
                                <select
                                  className="h-8 rounded-[var(--radius-sm)] border border-[var(--line)] px-1.5 text-xs"
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
                                  className="h-8 rounded-[var(--radius-sm)] border border-[var(--line)] px-1.5 text-xs"
                                  title="Popis pro chytré vykreslení"
                                  placeholder="např. pojistky, trám, schod"
                                  value={opening.name}
                                  onChange={(event) => updateOpening(wall.id, opening.id, { name: event.target.value, type: openingKind(opening) === "other" ? "other" : opening.type })}
                                />
                                <input className="h-8 rounded-[var(--radius-sm)] border border-[var(--line)] px-1.5 text-right text-xs" title="Šířka v cm" value={opening.width} onChange={(event) => updateOpening(wall.id, opening.id, { width: event.target.value })} />
                                <input className="h-8 rounded-[var(--radius-sm)] border border-[var(--line)] px-1.5 text-right text-xs" title="Výška v cm" value={opening.height} onChange={(event) => updateOpening(wall.id, opening.id, { height: event.target.value })} />
                                <input className="h-8 rounded-[var(--radius-sm)] border border-[var(--line)] px-1.5 text-right text-xs" title="Počet" value={opening.count} onChange={(event) => updateOpening(wall.id, opening.id, { count: event.target.value })} />
                                <input className="h-8 rounded-[var(--radius-sm)] border border-[var(--line)] px-1.5 text-right text-xs" title="Posun zleva v cm" value={normalized.x} onChange={(event) => updateOpening(wall.id, opening.id, { x: event.target.value })} />
                                <input className="h-8 rounded-[var(--radius-sm)] border border-[var(--line)] px-1.5 text-right text-xs" title="Výška od podlahy v cm" value={normalized.y} onChange={(event) => updateOpening(wall.id, opening.id, { y: event.target.value })} />
                                <div className="rounded-[var(--radius-sm)] bg-[var(--bg)] px-1.5 py-1 text-right text-xs font-bold">-{f2(areaCm(opening.width, opening.height, opening.count))} m²</div>
                                <button type="button" onClick={() => updateWall(wall.id, { openings: wall.openings.filter((item) => item.id !== opening.id) })} className="grid h-8 place-items-center rounded-[var(--radius-sm)] hover:bg-[var(--bg)]">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2 md:grid-cols-3">
                        {works.map((work) => (
                          <label key={work.id} className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-soft)] p-2 text-sm">
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
            <div className="flex gap-3">
              <button
                type="button"
                onClick={addWall}
                className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-dashed border-[var(--line)] bg-[var(--card)] px-4 py-5 text-base font-black text-[var(--text-soft)] shadow-sm transition hover:border-[var(--muted)] hover:bg-[var(--bg-soft)]"
              >
                <Plus className="h-5 w-5" />
                Přidat stěnu
              </button>
              {canAddCeiling && (
                <button
                  type="button"
                  onClick={addCeiling}
                  title="Přidá strop s rozměrem odvozeným z půdorysu místnosti"
                  className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-dashed px-4 py-5 text-base font-black shadow-sm transition hover:bg-[var(--bg-soft)]"
                  style={{ borderColor: "color-mix(in srgb, var(--brand) 45%, transparent)", color: "var(--brand)" }}
                >
                  <Plus className="h-5 w-5" />
                  Přidat strop
                </button>
              )}
            </div>
          </section>

          <aside className="min-w-0 space-y-3">
            <Card>
              <h2 className="mb-3 border-l-4 border-[var(--brand)] pl-2 text-lg font-black">Nabídka a zákazník</h2>
              <div className="space-y-2">
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
                      className="inline-flex h-10 shrink-0 items-center gap-1 rounded-[var(--radius)] bg-[var(--brand)] px-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)] disabled:opacity-50"
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
                      className="h-10 w-full rounded-[var(--radius-sm)] border border-[var(--line)] px-3"
                    />
                  </label>
                  <label className="block">
                    <Label>Stav</Label>
                    <select
                      className="h-10 w-full rounded-[var(--radius-sm)] border border-[var(--line)] px-2"
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
              <h2 className="mb-3 border-l-4 border-[var(--brand)] pl-2 text-lg font-black">Nastavení a sazby</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Rezerva práce %" value={settings.laborReservePercent} onChange={(value) => setSettings((prev) => ({ ...prev, laborReservePercent: value }))} right />
                <Field label="Rezerva materiálu %" value={settings.materialReservePercent} onChange={(value) => setSettings((prev) => ({ ...prev, materialReservePercent: value }))} right />
                <Field label="Km jedna cesta" value={settings.kmOneWay} onChange={(value) => setSettings((prev) => ({ ...prev, kmOneWay: value }))} right />
                <Field label="Počet návštěv" value={settings.visits} onChange={(value) => setSettings((prev) => ({ ...prev, visits: value }))} right />
                <Field label="Cena za km" value={settings.kmPrice} onChange={(value) => setSettings((prev) => ({ ...prev, kmPrice: value }))} right />
              </div>
            </Card>

            <Card>
              <h2 className="mb-2 border-l-4 border-[var(--brand)] pl-2 text-lg font-black">Ceník práce</h2>
              <div className="space-y-2">
                {works.map((work) => (
                  <div key={work.id} className="grid grid-cols-[1fr_90px] gap-2">
                    <div className="truncate rounded-[var(--radius-sm)] bg-[var(--bg-soft)] px-2 py-2 text-sm">{work.name}</div>
                    <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 text-right" value={work.price} onChange={(event) => setWorks((prev) => prev.map((item) => (item.id === work.id ? { ...item, price: event.target.value } : item)))} />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-2 border-l-4 border-[var(--brand)] pl-2 text-lg font-black">Doplňkové náklady</h2>
              <div className="space-y-2">
                {globalRows.map((row) => (
                  <div key={row.id} className="grid grid-cols-[24px_1fr_70px_80px] gap-2">
                    <input type="checkbox" checked={row.on} onChange={(event) => setGlobalRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, on: event.target.checked } : item)))} />
                    <div className="truncate rounded-[var(--radius-sm)] bg-[var(--bg-soft)] px-2 py-2 text-sm">{row.name}</div>
                    <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 text-right" value={row.qty} onChange={(event) => setGlobalRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, qty: event.target.value } : item)))} />
                    <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 text-right" value={row.price} onChange={(event) => setGlobalRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, price: event.target.value } : item)))} />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-2 border-l-4 border-[var(--brand)] pl-2 text-lg font-black">Součet</h2>
              <SummaryRow label="Rezerva práce" value={calc.laborReserve} />
              <SummaryRow label="Materiál mezisoučet" value={calc.materialBaseTotal} />
              <SummaryRow label="Materiálová rezerva" value={calc.materialReserve} />
              <SummaryRow label={`Doprava (${f2(calc.transportKm)} km)`} value={calc.transportTotal} />
              <div className="mt-3 rounded-[var(--radius)] bg-[var(--brand)] p-3 text-right text-white shadow-md">
                <div className="text-xs uppercase tracking-wide opacity-80">Celkem bez DPH</div>
                <div className="text-3xl font-black">{czk(calc.subtotal)}</div>
              </div>
            </Card>
          </aside>
        </div>

        <footer className="mt-4 border-t border-[var(--line)] pt-3 text-center text-xs text-[var(--muted)] print:hidden">
          © 2026{" "}
          <a href="https://mlynnapile.cz/jindra" target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--text-soft)] transition hover:text-[var(--brand)]">
            Design &amp; Development — Ing. Jindřich Traxmandl
          </a>
        </footer>
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
          onNew={() => {
            setQuotesOpen(false);
            setManualDoc({ kind: "quote", initial: null });
          }}
          close={() => setQuotesOpen(false)}
        />
      )}
      {invoicesOpen && (
        <InvoicesModal
          invoices={invoices}
          onView={(invoice) => setInvoiceView(invoice)}
          onPaid={toggleInvoicePaid}
          onDelete={deleteInvoice}
          onNew={() => {
            setInvoicesOpen(false);
            setManualDoc({ kind: "invoice", initial: null });
          }}
          close={() => setInvoicesOpen(false)}
        />
      )}
      {manualDoc && (
        <ManualDocModal
          kind={manualDoc.kind}
          initial={manualDoc.initial}
          company={company}
          onSubmit={(payload) => (manualDoc.kind === "quote" ? saveManualQuote(payload) : createManualInvoice(payload))}
          onSwitchToCalculator={() => {
            setManualDoc(null);
            newQuote();
          }}
          close={() => setManualDoc(null)}
        />
      )}
      {invoiceView && <InvoiceModal invoice={invoiceView} company={company} close={() => setInvoiceView(null)} />}
      {sketchOpen && activeRoom && (
        <SketchModal
          room={{ ...activeRoom, walls: activeRoom.walls.filter((wall) => !wall.ceiling) }}
          works={works}
          onApply={(plan, sketchWalls) => {
            // strop se náčrtem nemění – zůstává na konci seznamu
            setRooms((prev) => prev.map((room) => (room.id === activeRoom.id ? { ...room, plan, walls: [...sketchWalls, ...room.walls.filter((wall) => wall.ceiling)] } : room)));
            setSketchOpen(false);
            flash("Půdorys použit ✓");
          }}
          close={() => setSketchOpen(false)}
        />
      )}
      {trashOpen && (
        <TrashModal
          trash={trash}
          onRestore={restoreRoom}
          onPurge={(entry) => {
            if (!window.confirm(`Trvale smazat místnost „${entry.room.name}“? Tohle už nejde vrátit.`)) return;
            persistTrash(trash.filter((item) => item !== entry));
          }}
          close={() => setTrashOpen(false)}
        />
      )}
    </main>
  );
}

function Card({ children, className = "", ...props }) {
  return (
    <div className={`min-w-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] p-4 shadow-sm transition ${className}`} {...props}>
      {children}
    </div>
  );
}

function WallGraphic({ wall, onMoveOpening }) {
  const width = Math.max(1, n(wall.width));
  const height = Math.max(1, n(wall.height));
  const ratio = width / height;
  // náhled se přizpůsobí poměru stěny a nezabírá zbytečné hluché místo
  const MAX_W = 268;
  const MAX_H = 190;
  const previewWidth = Math.round(ratio >= MAX_W / MAX_H ? MAX_W : MAX_H * ratio);
  const previewHeight = Math.round(ratio >= MAX_W / MAX_H ? MAX_W / ratio : MAX_H);
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
    <div className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-soft)] p-2.5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-xs font-black uppercase tracking-wide text-[var(--text-soft)]">Grafický náhled</h2>
        <div className="text-right text-[11px] text-[var(--muted)]">
          <b className="text-[var(--text)]">{f2(stats.clean)} m²</b> · {width} × {height} cm
        </div>
      </div>
      <div className="flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--card)] p-2.5">
        <div
          className="relative border-2 border-neutral-800 bg-[linear-gradient(135deg,#fafafa_0%,#fafafa_49%,#f1f5f9_50%,#fafafa_51%,#fafafa_100%)] shadow-inner"
          style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
        >
          <div className="absolute left-0 right-0 bottom-0 border-t border-dashed border-[var(--line)]" />
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
      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-[var(--muted)]">
        <span>Hrubá: <b className="text-[var(--text)]">{f2(stats.gross)} m²</b></span>
        <span>Odečty: <b className="text-[var(--text)]">-{f2(stats.openings)} m²</b></span>
      </div>
      <p className="mt-1 text-[10px] leading-tight text-[var(--muted)]">Otvor přetáhni myší, nebo uprav hodnoty „zleva" a „od podlahy".</p>
    </div>
  );
}

function Button({ children, onClick, variant = "primary", title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius)] px-3 py-2 text-sm font-bold shadow-sm transition ${
        variant === "primary"
          ? "bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] active:scale-[.98]"
          : variant === "danger"
            ? "border border-red-200 bg-[var(--card)] text-red-700 hover:bg-red-50"
            : "border border-[var(--line)] bg-[var(--card)] text-[var(--text)] hover:border-[var(--muted)] hover:bg-[var(--bg-soft)]"
      }`}
    >
      {children}
    </button>
  );
}

function Label({ children }) {
  return <div className="mb-1 text-[11px] font-bold uppercase text-[var(--muted)]">{children}</div>;
}

function Field({ label, value, onChange, right = false, placeholder }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`h-10 w-full rounded-[var(--radius-sm)] border border-[var(--line)] px-3 ${right ? "text-right" : ""}`}
      />
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-[var(--line)] py-2 text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      <b>{czk(value)}</b>
    </div>
  );
}

function Modal({ children, close, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-neutral-950/60 p-4 print:static print:bg-[var(--card)] print:p-0">
      <div className={`mx-auto mb-3 flex ${wide ? "max-w-[1100px]" : "max-w-[980px]"} justify-end gap-2 print:hidden`}>{close}</div>
      <div className={`mx-auto ${wide ? "max-w-[1100px]" : "max-w-[980px]"} bg-[var(--card)] p-6 shadow-2xl print:max-w-none print:p-0 print:shadow-none`}>{children}</div>
    </div>
  );
}

// ---------- seznam nabídek ----------

function QuotesModal({ quotes, currentId, onLoad, onDuplicate, onDelete, onStatus, onInvoice, onExport, onImport, onNew, close }) {
  return (
    <Modal
      wide
      close={
        <>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4" />
            Export zálohy
          </Button>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm font-bold text-[var(--text)] hover:bg-[var(--bg-soft)]">
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="border-l-4 border-[var(--brand)] pl-2 text-xl font-black">Uložené nabídky</h1>
        <Button onClick={onNew}>
          <FilePlus2 className="h-4 w-4" />
          Nová nabídka
        </Button>
      </div>
      {quotes.length === 0 && (
        <div className="rounded-[var(--radius-sm)] border border-dashed border-[var(--line)] p-6 text-center text-sm text-[var(--muted)]">
          Zatím žádné uložené nabídky. Sestav ji v kalkulačce a klikni na „Uložit nabídku“, nebo ji napiš ručně přes „Nová nabídka“.
        </div>
      )}
      <div className="space-y-2">
        {quotes.map((quote) => {
          const status = statusInfo(quote.status);
          return (
            <div key={quote.id} className={`flex flex-wrap items-center gap-3 rounded-[var(--radius-sm)] border p-3 ${quote.id === currentId ? "border-blue-300 bg-blue-50/50" : "border-[var(--line)]"}`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-bold">{quote.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${status.className}`}>{status.label}</span>
                  {quote.manual && <span className="rounded-full border border-[var(--line)] px-2 py-0.5 text-[10px] font-bold text-[var(--muted)]">ručně</span>}
                  {quote.id === currentId && <span className="text-[10px] font-bold text-blue-600">OTEVŘENO</span>}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {quote.customer?.name || "Bez zákazníka"} · upraveno {dateCz(quote.updatedAt)} · platnost do {dateCz(quote.validUntil)}
                </div>
              </div>
              <div className="text-right font-black">{czk(quote.total)}</div>
              <select className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 py-1.5 text-sm" value={quote.status} onChange={(event) => onStatus(quote, event.target.value)}>
                {QUOTE_STATUSES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-1.5">
                <Button variant="outline" onClick={() => onLoad(quote)}>
                  <FolderOpen className="h-4 w-4" />
                  {quote.manual ? "Upravit" : "Načíst"}
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

function InvoicesModal({ invoices, onView, onPaid, onDelete, onNew, close }) {
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="border-l-4 border-[var(--brand)] pl-2 text-xl font-black">Faktury</h1>
        <Button onClick={onNew}>
          <FilePlus2 className="h-4 w-4" />
          Nová faktura
        </Button>
      </div>
      {invoices.length === 0 && (
        <div className="rounded-[var(--radius-sm)] border border-dashed border-[var(--line)] p-6 text-center text-sm text-[var(--muted)]">
          Zatím žádné faktury. Vystavíš je z uložené nabídky tlačítkem „Faktura“, nebo napíšeš ručně přes „Nová faktura“.
        </div>
      )}
      <div className="space-y-2">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="flex flex-wrap items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--line)] p-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-black">č. {invoice.number}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${invoice.paid ? "bg-emerald-100 text-emerald-800" : overdue(invoice) ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>
                  {invoice.paid ? "Zaplaceno" : overdue(invoice) ? "Po splatnosti" : "Čeká na platbu"}
                </span>
              </div>
              <div className="text-xs text-[var(--muted)]">
                {invoice.customer?.name || "Bez zákazníka"} · {invoice.quoteName || "ruční faktura"} · vystaveno {dateCz(invoice.issueDate)} · splatnost {dateCz(invoice.dueDate)}
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

// ---------- ruční dokument (nabídka / faktura psaná po řádcích) ----------

const emptyRow = () => ({ id: uid(), name: "", unit: "kpl", qty: 1, price: "" });

function ManualDocModal({ kind, initial, company, onSubmit, onSwitchToCalculator, close }) {
  const isQuote = kind === "quote";
  const [customer, setCustomer] = useState(initial?.customer ?? defaultCustomer);
  const [items, setItems] = useState(initial?.items?.length ? initial.items : [emptyRow(), emptyRow(), emptyRow()]);
  const [validUntil, setValidUntil] = useState(initial?.validUntil ?? addDaysIso(company.validityDays));
  const [issueDate, setIssueDate] = useState(todayIso());
  const [supplyDate, setSupplyDate] = useState(todayIso());
  const [dueDate, setDueDate] = useState(addDaysIso(company.dueDays));
  const [aresBusy, setAresBusy] = useState(false);
  const [printView, setPrintView] = useState(false);

  const filled = items.filter((row) => String(row.name).trim() || n(row.price) > 0);
  const total = filled.reduce((sum, row) => sum + n(row.qty) * n(row.price), 0);
  const setItem = (id, patch) => setItems((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const loadAres = async () => {
    setAresBusy(true);
    try {
      const data = await fetchAres(customer.ico);
      setCustomer((prev) => ({ ...prev, name: data.name, address: data.address, ico: data.ico }));
    } catch (error) {
      window.alert(error.message);
    } finally {
      setAresBusy(false);
    }
  };

  const submit = () => {
    if (filled.length === 0) {
      window.alert("Vyplň alespoň jeden řádek (název nebo cenu).");
      return;
    }
    onSubmit({ customer, items: filled, validUntil, issueDate, supplyDate, dueDate });
  };

  return (
    <Modal
      wide
      close={
        <>
          {isQuote && (
            <Button variant="outline" onClick={() => setPrintView(true)}>
              <Printer className="h-4 w-4" />
              Náhled tisku
            </Button>
          )}
          <Button variant="outline" onClick={close}>
            <X className="h-4 w-4" />
          </Button>
        </>
      }
    >
      <h1 className="mb-1 border-l-4 border-[var(--brand)] pl-2 text-xl font-black">
        {initial ? "Úprava" : "Nová"} {isQuote ? "nabídka" : "faktura"} — ruční zadání
      </h1>
      <p className="mb-4 text-sm text-[var(--muted)]">Řádky vyplníš sám — hodí se pro práce mimo kalkulačku (hodinovka, materiál, doprava…).</p>

      {isQuote && !initial && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-soft)] p-3">
          <div className="text-sm text-[var(--text-soft)]">
            <b>Tip:</b> nacenění podle rozměrů místnosti spočítá kalkulačka za tebe — včetně materiálu a dopravy.
          </div>
          <Button variant="outline" onClick={onSwitchToCalculator}>
            <Box className="h-4 w-4" />
            Sestavit přes stěny a úkony
          </Button>
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Zákazník" value={customer.name} onChange={(name) => setCustomer((prev) => ({ ...prev, name }))} placeholder="Jméno / firma" />
        <Field label="Adresa" value={customer.address} onChange={(address) => setCustomer((prev) => ({ ...prev, address }))} placeholder="Ulice, město" />
        <div className="flex items-end gap-1.5">
          <div className="min-w-0 flex-1">
            <Field label="IČO (u firem)" value={customer.ico ?? ""} onChange={(ico) => setCustomer((prev) => ({ ...prev, ico }))} placeholder="nepovinné" />
          </div>
          <button
            type="button"
            onClick={loadAres}
            disabled={aresBusy}
            title="Načíst jméno a adresu z ARES podle IČO"
            className="inline-flex h-10 shrink-0 items-center gap-1 rounded-[var(--radius)] bg-[var(--brand)] px-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)] disabled:opacity-50"
          >
            <Search className="h-3.5 w-3.5" />
            {aresBusy ? "…" : "ARES"}
          </button>
        </div>
        {isQuote ? (
          <label className="block">
            <Label>Platnost do</Label>
            <input type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} className="h-10 w-full rounded-[var(--radius-sm)] border border-[var(--line)] px-3" />
          </label>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Vystavení", issueDate, setIssueDate],
              ["DUZP", supplyDate, setSupplyDate],
              ["Splatnost", dueDate, setDueDate],
            ].map(([label, value, setter]) => (
              <label key={label} className="block">
                <Label>{label}</Label>
                <input type="date" value={value} onChange={(event) => setter(event.target.value)} className="h-10 w-full rounded-[var(--radius-sm)] border border-[var(--line)] px-2 text-sm" />
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-[minmax(0,1fr)_64px_72px_100px_110px_36px] gap-2 px-1 text-[10px] font-bold uppercase text-[var(--muted)]">
          <span>Položka</span>
          <span>MJ</span>
          <span className="text-right">Množství</span>
          <span className="text-right">Cena/MJ</span>
          <span className="text-right">Celkem</span>
          <span />
        </div>
        <div className="mt-1 space-y-1.5">
          {items.map((row) => (
            <div key={row.id} className="grid grid-cols-[minmax(0,1fr)_64px_72px_100px_110px_36px] items-center gap-2">
              <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 py-2 text-sm" placeholder="např. Oprava omítky v koupelně" value={row.name} onChange={(event) => setItem(row.id, { name: event.target.value })} />
              <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 py-2 text-center text-sm" value={row.unit} onChange={(event) => setItem(row.id, { unit: event.target.value })} />
              <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 py-2 text-right text-sm" value={row.qty} onChange={(event) => setItem(row.id, { qty: event.target.value })} />
              <input className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 py-2 text-right text-sm" placeholder="0" value={row.price} onChange={(event) => setItem(row.id, { price: event.target.value })} />
              <div className="rounded-[var(--radius-sm)] bg-[var(--bg-soft)] px-2 py-2 text-right text-sm font-bold">{czk(n(row.qty) * n(row.price))}</div>
              <button type="button" onClick={() => setItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== row.id) : prev))} className="grid h-9 place-items-center rounded-[var(--radius-sm)] text-[var(--muted)] hover:bg-[var(--bg)]">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, emptyRow()])}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-dashed border-[var(--line)] py-2 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--muted)] hover:text-[var(--text)]"
        >
          <Plus className="h-4 w-4" />
          Přidat řádek
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
        <div className="rounded-[var(--radius)] border px-4 py-2 text-right" style={{ borderColor: "color-mix(in srgb, var(--brand) 18%, transparent)" }}>
          <div className="text-[10px] font-bold uppercase text-[var(--muted)]">Celkem</div>
          <div className="text-2xl font-black" style={{ color: BRAND }}>{czk(total)}</div>
        </div>
        <Button onClick={submit}>
          {isQuote ? <Save className="h-4 w-4" /> : <FilePlus2 className="h-4 w-4" />}
          {isQuote ? (initial ? "Uložit změny" : "Uložit nabídku") : "Vystavit fakturu"}
        </Button>
      </div>

      {printView && (
        <Modal
          close={
            <>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Tisk
              </Button>
              <Button variant="outline" onClick={() => setPrintView(false)}>
                <X className="h-4 w-4" />
              </Button>
            </>
          }
        >
          <div data-print-root style={DOC_STYLE}>
            <ManualQuoteDoc number={initial?.number} customer={customer} items={filled} total={total} validUntil={validUntil} company={company} />
          </div>
        </Modal>
      )}
    </Modal>
  );
}

// tisková podoba ručně psané nabídky
function ManualQuoteDoc({ number, customer, items, total, validUntil, company }) {
  return (
    <div>
      <header className="flex items-start justify-between gap-4">
        <Logo logo={company.logo} name={company.name} subtitle={company.subtitle} markClass="h-16" titleClass="text-2xl" />
        <div className="text-right">
          <h1 className="text-3xl font-black uppercase leading-none tracking-tight" style={{ color: BRAND }}>Cenová nabídka</h1>
          {number && <div className="mt-1 text-xl font-black tabular-nums">{number}</div>}
        </div>
      </header>
      <div className="mt-3 h-1 rounded-full" style={{ backgroundColor: BRAND }} />

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <PartyBlock
          label="Dodavatel"
          name={company.name || "— vyplň v administraci"}
          rows={[
            [company.address, false],
            [company.ico && ["IČO", company.ico], false],
            [company.dic && ["DIČ", company.dic], false],
            [company.phone && ["Tel.", company.phone], false],
            [company.email && ["E-mail", company.email], false],
          ]}
          note={
            <>
              {company.register}
              <br />
              <b className="text-[var(--text-soft)]">{company.vatNote}</b>
            </>
          }
        />
        <PartyBlock
          label="Odběratel"
          name={customer.name || "—"}
          rows={[
            [customer.address, false],
            [customer.ico && ["IČO", customer.ico], false],
            [customer.phone && ["Tel.", customer.phone], false],
            [customer.email && ["E-mail", customer.email], false],
          ]}
        />
      </div>

      <div className="mt-4 grid gap-px overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--line)] text-sm sm:grid-cols-2">
        <DataCell label="Datum vystavení" value={dateCz(todayIso())} />
        <DataCell label="Platnost nabídky do" value={dateCz(validUntil)} strong />
      </div>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--text-soft)]">Nabízíme Vám</h2>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[var(--bg)]">
              <Th>Položka</Th>
              <Th>MJ</Th>
              <Th right>Množství</Th>
              <Th right>Cena/MJ</Th>
              <Th right>Celkem</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <Td>{row.name}</Td>
                <Td center>{row.unit}</Td>
                <Td right>{f2(row.qty)}</Td>
                <Td right>{czk(row.price)}</Td>
                <Td right strong>{czk(n(row.qty) * n(row.price))}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-5 flex items-end justify-between gap-6">
        <div className="text-xs leading-5 text-[var(--muted)]">
          Nabídka platí do <b className="text-[var(--text)]">{dateCz(validUntil)}</b>.
          <br />
          {[company.phone, company.email].filter(Boolean).join(" · ")}
        </div>
        <div className="rounded-[var(--radius)] p-4 text-right text-white shadow-md" style={{ backgroundColor: BRAND }}>
          <div className="text-xs uppercase tracking-wide opacity-80">Celkem</div>
          <div className="text-3xl font-black">{czk(total)}</div>
          <div className="mt-1 text-[10px] opacity-80">Neplátce DPH – cena je konečná</div>
        </div>
      </section>
    </div>
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
      <div data-print-root style={DOC_STYLE}>
        <header className="flex items-start justify-between gap-4">
          <Logo logo={supplier.logo} name={supplier.name} subtitle={supplier.subtitle} markClass="h-16" titleClass="text-2xl" />
          <div className="text-right">
            <h1 className="text-3xl font-black uppercase leading-none tracking-tight" style={{ color: BRAND }}>Faktura</h1>
            <div className="mt-1 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Daňový doklad č.</div>
            <div className="text-2xl font-black tabular-nums">{invoice.number}</div>
          </div>
        </header>
        <div className="mt-3 h-1 rounded-full" style={{ backgroundColor: BRAND }} />

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <PartyBlock
            label="Dodavatel"
            name={supplier.name || "— vyplň v administraci"}
            rows={[
              [supplier.address, false],
              [supplier.ico && ["IČO", supplier.ico], false],
              [supplier.dic && ["DIČ", supplier.dic], false],
              [supplier.phone && ["Tel.", supplier.phone], false],
              [supplier.email && ["E-mail", supplier.email], false],
              [supplier.web && ["Web", supplier.web], false],
            ]}
            note={
              <>
                {supplier.register}
                <br />
                <b className="text-[var(--text-soft)]">{supplier.vatNote}</b>
              </>
            }
          />
          <PartyBlock
            label="Odběratel"
            name={invoice.customer?.name || "—"}
            rows={[
              [invoice.customer?.address, false],
              [invoice.customer?.ico && ["IČO", invoice.customer.ico], false],
              [invoice.customer?.dic && ["DIČ", invoice.customer.dic], false],
              [invoice.customer?.phone && ["Tel.", invoice.customer.phone], false],
              [invoice.customer?.email && ["E-mail", invoice.customer.email], false],
            ]}
          />
        </div>

        {/* pruh s daty a platebními údaji – povinné náležitosti */}
        <div className="mt-4 grid gap-px overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--line)] text-sm sm:grid-cols-4">
          <DataCell label="Datum vystavení" value={dateCz(invoice.issueDate)} />
          <DataCell label="Datum usk. plnění (DUZP)" value={dateCz(invoice.supplyDate ?? invoice.issueDate)} />
          <DataCell label="Datum splatnosti" value={dateCz(invoice.dueDate)} strong />
          <DataCell label="Forma úhrady" value="Převodem" />
          <DataCell label="Číslo účtu" value={supplier.account || "—"} />
          <DataCell label="IBAN" value={(supplier.account && czAccountToIban(supplier.account)) || "—"} />
          <DataCell label="Banka" value={supplier.bank || "—"} />
          <DataCell label="Variabilní symbol" value={invoice.number} strong />
        </div>

        <section className="mt-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--text-soft)]">Fakturujeme Vám{invoice.quoteName ? ` — ${invoice.quoteName}` : ""}</h2>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--bg)]">
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

        <section className="mt-5 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {spayd ? (
              <div className="text-center">
                <QRCodeSVG value={spayd} size={120} marginSize={2} />
                <div className="mt-1 text-[10px] font-bold uppercase text-[var(--muted)]">QR platba</div>
              </div>
            ) : (
              <div className="max-w-[220px] rounded-[var(--radius-sm)] border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 print:hidden">
                QR platba se zobrazí po vyplnění čísla účtu v administraci (tlačítko Admin v horní liště).
              </div>
            )}
            <div className="text-xs leading-6 text-[var(--muted)]">
              Zaplaťte prosím do <b className="text-[var(--text)]">{dateCz(invoice.dueDate)}</b>
              <br />
              pod variabilním symbolem <b className="text-[var(--text)]">{invoice.number}</b>.
            </div>
          </div>
          <div className="rounded-[var(--radius)] p-4 text-right text-white shadow-md" style={{ backgroundColor: BRAND }}>
            <div className="text-xs uppercase tracking-wide opacity-80">Celkem k úhradě</div>
            <div className="text-3xl font-black">{czk(invoice.total)}</div>
            <div className="mt-1 text-[10px] opacity-80">Neplátce DPH – cena je konečná</div>
          </div>
        </section>

        <section className="mt-8 flex items-end justify-between gap-6">
          <div className="text-xs text-[var(--muted)]">
            Vystavil: <b className="text-[var(--text)]">{supplier.name}</b>
            <br />
            {[supplier.phone, supplier.email].filter(Boolean).join(" · ")}
          </div>
          <div className="w-56 border-t border-[var(--muted)] pt-1 text-center text-[11px] text-[var(--muted)]">Razítko a podpis</div>
        </section>

        <footer className="mt-6 border-t-2 pt-2 text-center text-[10px] text-[var(--muted)]" style={{ borderColor: BRAND }}>
          {[supplier.name, supplier.ico && `IČO ${supplier.ico}`, supplier.address, supplier.phone, supplier.email, supplier.web].filter(Boolean).join(" · ")} — {supplier.register} {supplier.vatNote}
        </footer>
      </div>
    </Modal>
  );
}

// Koš smazaných místností – položky se po týdnu automaticky čistí (storage.loadTrash).
function TrashModal({ trash, onRestore, onPurge, close }) {
  const daysLeft = (entry) => Math.max(0, TRASH_TTL_DAYS - Math.floor((Date.now() - new Date(entry.deletedAt).getTime()) / 86400000));
  return (
    <Modal
      close={
        <Button variant="outline" onClick={close}>
          <X className="h-4 w-4" />
        </Button>
      }
    >
      <h1 className="mb-1 border-l-4 border-[var(--brand)] pl-2 text-xl font-black">Koš</h1>
      <div className="mb-4 rounded-[var(--radius-sm)] border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
        ⚠ Koš se maže automaticky – každá položka zmizí týden po smazání.
      </div>
      {trash.length === 0 ? (
        <div className="rounded-[var(--radius-sm)] border border-dashed border-[var(--line)] p-6 text-center text-sm text-[var(--muted)]">Koš je prázdný.</div>
      ) : (
        <div className="space-y-2">
          {trash.map((entry, index) => (
            <div key={index} className="flex flex-wrap items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-soft)] p-3">
              <div className="min-w-0 flex-1">
                <div className="truncate font-black">{entry.room.name}</div>
                <div className="text-xs text-[var(--muted)]">
                  {entry.room.walls.length} stěn · smazáno {dateCz(entry.deletedAt.slice(0, 10))} · automaticky zmizí za {daysLeft(entry)} {daysLeft(entry) === 1 ? "den" : daysLeft(entry) < 5 ? "dny" : "dní"}
                </div>
              </div>
              <Button variant="outline" onClick={() => onRestore(entry)}>
                <RotateCcw className="h-4 w-4" />
                Obnovit
              </Button>
              <button
                type="button"
                onClick={() => onPurge(entry)}
                className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                Smazat trvale
              </button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

// Blok smluvní strany na faktuře – jméno velké, pod ním jednotlivé údaje na řádcích.
function PartyBlock({ label, name, rows, note }) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--line)] p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: BRAND }}>{label}</div>
      <div className="mt-1.5 text-lg font-black leading-tight">{name}</div>
      <div className="mt-2 space-y-0.5 text-sm text-[var(--text-soft)]">
        {rows
          .map(([row]) => row)
          .filter(Boolean)
          .map((row, index) =>
            Array.isArray(row) ? (
              <div key={index} className="flex gap-1.5">
                <span className="w-14 shrink-0 text-[var(--muted)]">{row[0]}</span>
                <span className="font-semibold">{row[1]}</span>
              </div>
            ) : (
              <div key={index}>{row}</div>
            ),
          )}
      </div>
      {note && <div className="mt-2.5 border-t border-[var(--line)] pt-2 text-[11px] leading-4 text-[var(--muted)]">{note}</div>}
    </div>
  );
}

function DataCell({ label, value, strong = false }) {
  return (
    <div className="bg-[var(--card)] px-3 py-2">
      <div className="text-[9px] font-bold uppercase tracking-wide text-[var(--muted)]">{label}</div>
      <div className={`truncate ${strong ? "font-black" : "font-semibold"}`} style={strong ? { color: BRAND } : undefined}>{value}</div>
    </div>
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
      <div data-print-root style={DOC_STYLE}>
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
          <Logo logo={company.logo} name={company.name} subtitle={company.subtitle} markClass="h-14" titleClass="text-2xl" />
          <div className="mt-3 text-sm leading-6 text-[var(--text-soft)]">
            <div>{company.address}</div>
            <div>IČO: {company.ico || "—"}</div>
            <div>{[company.phone, company.email].filter(Boolean).join(" · ")}</div>
            <div className="font-semibold">{company.web}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-black uppercase tracking-tight" style={{ color: BRAND }}>Cenová nabídka</div>
          <div className="text-xs font-semibold uppercase text-[var(--muted)]">Kalkulace oprav omítek</div>
          {meta?.name && <div className="mt-1 font-bold">{meta.name}</div>}
          <div className="mt-1 text-sm text-[var(--text-soft)]">Datum: {new Date().toLocaleDateString("cs-CZ")}</div>
          {meta?.validUntil && <div className="text-sm text-[var(--text-soft)]">Platnost nabídky do: <b>{dateCz(meta.validUntil)}</b></div>}
          <div className="mt-3 text-3xl font-black" style={{ color: BRAND }}>{czk(calc.subtotal)}</div>
          <div className="text-xs text-[var(--muted)]">Cena bez DPH – neplátce</div>
        </div>
      </header>

      {customer?.name && (
        <section className="mt-4 rounded-[var(--radius)] bg-[var(--bg-soft)] p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: BRAND }}>Zákazník</div>
          <div className="text-sm leading-6 text-[var(--text-soft)]">
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
            <tr className="bg-[var(--bg)]">
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
            <tr className="bg-[var(--bg)]">
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
            <BudgetRow row={{ name: `Doprava - ${settings.visits}× tam a zpět`, unit: "km", qty: calc.transportKm, price: settings.kmPrice, total: calc.transportTotal }} className="bg-[var(--bg)]" />
            {calc.rounding !== 0 && <BudgetRow row={{ name: "Zaokrouhlení na celé Kč", unit: "kpl", qty: 1, price: calc.rounding, total: calc.rounding }} className="bg-[var(--bg-soft)]" />}
          </tbody>
        </Table>
      </Section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-bold uppercase text-[var(--text-soft)]">Doprava</h2>
          <SimpleTable rows={[["Km jedna cesta", `${f2(settings.kmOneWay)} km`], ["Počet návštěv", settings.visits], ["Celkem km", `${f2(calc.transportKm)} km`], ["Cena za km", czk(settings.kmPrice)]]} />
        </div>
        <div>
          <h2 className="mb-2 text-sm font-bold uppercase text-[var(--text-soft)]">Rekapitulace</h2>
          <SimpleTable rows={[["Rezerva práce", czk(calc.laborReserve)], ["Materiál mezisoučet", czk(calc.materialBaseTotal)], ["Materiál celkem", czk(calc.materialBaseTotal + calc.materialReserve)], ...(calc.rounding !== 0 ? [["Zaokrouhlení", czk(calc.rounding)]] : []), ["DPH", "Neplátce DPH"], ["Celkem", czk(calc.subtotal)]]} />
        </div>
      </section>

      <footer className="mt-6 border-t-2 pt-2 text-center text-[10px] text-[var(--muted)]" style={{ borderColor: BRAND }}>
        {[company.name, company.ico && `IČO ${company.ico}`, company.address, company.phone, company.email, company.web].filter(Boolean).join(" · ")} — {company.register} {company.vatNote}
      </footer>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-sm font-bold uppercase text-[var(--text-soft)]">{title}</h2>
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
  return <th className={`border border-[var(--line)] bg-[#f5ecec] p-2 text-left text-[var(--text)] ${right ? "text-right" : ""}`}>{children}</th>;
}

function Td({ children, right = false, center = false, strong = false }) {
  return <td className={`border border-[var(--line)] p-2 ${right ? "text-right" : ""} ${center ? "text-center" : ""} ${strong ? "font-bold" : ""}`}>{children}</td>;
}
