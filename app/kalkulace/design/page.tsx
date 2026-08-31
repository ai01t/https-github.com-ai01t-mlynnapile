"use client";

// Správcovské nastavení VÝCHOZÍHO vzhledu aplikace (motiv, barva, písmo, velikosti…).
// Uloží se do designu, který aplikace používá jako výchozí zobrazení.
// Pozn.: bez serveru se ukládá lokálně v prohlížeči (nelze centrálně rozeslat všem).

import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";
import { defaultDesign, designStyle, FONT_OPTIONS, setStorageNamespace, SPACING_CSS, storage, THEMES } from "../core";
import { BRAND } from "../Logo";

export default function DesignAdminPage() {
  setStorageNamespace("");
  const [design, setDesign] = useState(defaultDesign);
  const [loaded, setLoaded] = useState(false);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    setDesign(storage.loadDesign());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) document.documentElement.style.fontSize = `${design.fontScale ?? 100}%`;
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [design.fontScale, loaded]);

  const setD = (key, value) => setDesign((prev) => ({ ...prev, [key]: value }));

  const save = () => {
    storage.saveDesign(design);
    setFlash("Výchozí vzhled uložen ✓");
    setTimeout(() => setFlash(""), 2500);
  };

  const reset = () => {
    if (!window.confirm("Obnovit tovární výchozí vzhled?")) return;
    setDesign(defaultDesign);
  };

  const theme = THEMES[design.theme] ?? THEMES.bordo;

  if (!loaded) return null;

  return (
    <main data-kalk className="min-h-screen bg-[var(--bg)] p-3 text-[var(--text)]" style={designStyle(design)}>
      <style dangerouslySetInnerHTML={{ __html: SPACING_CSS }} />
      <div className="mx-auto max-w-[1100px] space-y-3">
        <header className="sticky top-0 z-40 -mx-3 -mt-3 border-b-2 border-[var(--brand)] bg-[var(--header-bg)] px-4 py-2 shadow-md backdrop-blur">
          <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-3">
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight" style={{ color: BRAND }}>Vzhled aplikace — správce</h1>
              <div className="text-xs text-[var(--muted)]">Výchozí zobrazení pro všechny{flash && <span className="ml-2 font-bold text-emerald-600">{flash}</span>}</div>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <a href="/kalkulace/admin" className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm font-bold shadow-sm hover:bg-[var(--bg-soft)]">
                <ArrowLeft className="h-4 w-4" />
                Zpět do administrace
              </a>
              <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm font-bold shadow-sm hover:bg-[var(--bg-soft)]">
                <RotateCcw className="h-4 w-4" />
                Tovární vzhled
              </button>
              <button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--brand)] px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-[var(--brand-dark)]">
                <Save className="h-4 w-4" />
                Uložit vzhled
              </button>
            </div>
          </div>
        </header>

        <div className="rounded-[var(--radius-sm)] border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
          ⚠ Toto nastavuje výchozí vzhled aplikace. Bez serverové části se ukládá lokálně v tomto prohlížeči (nerozešle se automaticky ostatním uživatelům).
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            <Card>
              <h2 className="mb-2 border-l-4 border-[var(--brand)] pl-2 text-base font-black">Barevný motiv</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {Object.entries(THEMES).map(([key, t]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setD("theme", key)}
                    className={`rounded-[var(--radius-sm)] border-2 p-2 text-left transition ${design.theme === key ? "border-[var(--brand)]" : "border-[var(--line)] hover:border-[var(--muted)]"}`}
                  >
                    <div className="mb-1 flex gap-1">
                      <span className="h-5 w-5 rounded-full" style={{ background: t.vars["--brand"] }} />
                      <span className="h-5 w-5 rounded-full border border-[var(--line)]" style={{ background: t.vars["--bg"] }} />
                    </div>
                    <div className="text-[11px] font-bold leading-tight">{t.name}</div>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-2 border-l-4 border-[var(--brand)] pl-2 text-base font-black">Akcentní barva a písmo</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Akcentní barva (přepíše motiv)</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={design.brand || theme.vars["--brand"]}
                      onChange={(event) => setD("brand", event.target.value)}
                      className="h-10 w-14 cursor-pointer rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)]"
                    />
                    <button type="button" onClick={() => setD("brand", "")} className="rounded-[var(--radius-sm)] border border-[var(--line)] px-2 py-1.5 text-xs font-bold text-[var(--muted)] hover:bg-[var(--bg-soft)]">
                      Dle motivu
                    </button>
                  </div>
                </div>
                <div>
                  <Label>Rodina písma</Label>
                  <select value={design.fontFamily} onChange={(event) => setD("fontFamily", event.target.value)} className="h-10 w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-2">
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="mb-2 border-l-4 border-[var(--brand)] pl-2 text-base font-black">Velikosti a detaily</h2>
              <div className="space-y-3">
                <Slider label="Velikost písma" value={design.fontScale} min={80} max={130} step={1} suffix="%" onChange={(v) => setD("fontScale", v)} />
                <Slider label="Měřítko rozhraní (zoom)" value={design.zoom} min={75} max={125} step={1} suffix="%" onChange={(v) => setD("zoom", v)} />
                <Slider label="Velikost buněk / polí" value={design.controlScale} min={85} max={125} step={1} suffix="%" onChange={(v) => setD("controlScale", v)} />
                <Slider label="Zaoblení rohů" value={design.radius} min={0} max={22} step={1} suffix="px" onChange={(v) => setD("radius", v)} />
                <Slider label="Mezery mezi bloky" value={Math.round((design.space ?? 1) * 100)} min={60} max={140} step={5} suffix="%" onChange={(v) => setD("space", v / 100)} />
                <Slider label="Řádkování" value={Math.round((design.lineHeight ?? 1.5) * 100)} min={120} max={190} step={5} suffix="%" onChange={(v) => setD("lineHeight", v / 100)} />
                <Slider label="Prostrkání písma" value={design.letterSpacing} min={-0.5} max={2} step={0.1} suffix="px" onChange={(v) => setD("letterSpacing", v)} />
              </div>
            </Card>
          </div>

          {/* živý náhled */}
          <div className="lg:sticky lg:top-16 lg:self-start">
            <Card>
              <h2 className="mb-2 border-l-4 border-[var(--brand)] pl-2 text-base font-black">Živý náhled</h2>
              <div className="space-y-2">
                <button type="button" className="w-full rounded-[var(--radius)] bg-[var(--brand)] px-3 py-2 text-sm font-bold text-white shadow-sm">Primární tlačítko</button>
                <button type="button" className="w-full rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm font-bold">Sekundární tlačítko</button>
                <input placeholder="Vstupní pole" className="h-10 w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-3 text-sm" />
                <div className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-soft)] p-3">
                  <div className="text-xs font-bold uppercase text-[var(--muted)]">Karta</div>
                  <div className="mt-1 text-sm">Ukázkový text s aktuálním písmem, řádkováním a prostrkáním.</div>
                  <div className="mt-2 text-2xl font-black" style={{ color: "var(--brand)" }}>12 340 Kč</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

function Label({ children }) {
  return <div className="mb-1 text-[11px] font-bold uppercase text-[var(--muted)]">{children}</div>;
}

function Slider({ label, value, min, max, step, suffix, onChange }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase text-[var(--muted)]">
        <span>{label}</span>
        <span className="text-[var(--text)]">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-[var(--brand)]" />
    </label>
  );
}

function Card({ children }) {
  return <div className="min-w-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] p-4 shadow-sm">{children}</div>;
}
