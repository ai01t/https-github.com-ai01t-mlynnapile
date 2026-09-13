"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  ChlebaContent,
  LOCALES,
  Locale,
  PREVIEW_EVENT,
  TEXT_FIELDS,
  defaultMedia,
  emptyContent,
  normalizeContent,
} from "@/lib/chleba-content"

// Výchozí texty ze stránky — editor je ukazuje jako placeholder, takže je
// vidět, co se zobrazí, když pole zůstane prázdné.
import { CHLEBA_DEFAULT_COPY } from "@/components/chleba-copy"

const LOCALE_LABEL: Record<Locale, string> = { cs: "Česky", en: "English", de: "Deutsch" }

const SLIDERS = [
  { id: "brightness", label: "Jas fotky", min: 20, max: 200, unit: "%", hint: "Vyšší hodnota fotku prosvětlí." },
  { id: "contrast", label: "Kontrast", min: 20, max: 200, unit: "%" },
  { id: "saturate", label: "Sytost barev", min: 0, max: 200, unit: "%" },
  { id: "shade", label: "Ztmavení přes fotku", min: 0, max: 150, unit: "%", hint: "0 % ztmavení úplně sundá." },
] as const

export default function ChlebaAdminClient({ signedInAs }: { signedInAs?: string }) {
  const [content, setContent] = useState<ChlebaContent>(emptyContent)
  const [locale, setLocale] = useState<Locale>("cs")
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "ok" | "error"; message?: string }>({
    kind: "idle",
  })
  const [loaded, setLoaded] = useState(false)
  const frameRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    fetch("/api/chleba-content", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) setContent(normalizeContent(data))
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  // Náhled překreslujeme při každé změně, ještě před uložením.
  useEffect(() => {
    const frame = frameRef.current
    if (!frame?.contentWindow) return
    frame.contentWindow.postMessage({ type: PREVIEW_EVENT, content }, window.location.origin)
  }, [content])

  const media = content.media ?? defaultMedia
  const entry = content.locales[locale] ?? {}
  const defaults = CHLEBA_DEFAULT_COPY[locale] as unknown as Record<string, string> & { paragraphs?: string[] }

  const setMedia = useCallback((patch: Partial<typeof defaultMedia>) => {
    setContent((cur) => ({ ...cur, media: { ...(cur.media ?? defaultMedia), ...patch } }))
  }, [])

  const setField = useCallback(
    (field: string, value: string) => {
      setContent((cur) => {
        const locales = { ...cur.locales }
        const next = { ...(locales[locale] ?? {}) } as Record<string, unknown>
        if (value.trim()) next[field] = value
        else delete next[field]
        if (Object.keys(next).length) locales[locale] = next
        else delete locales[locale]
        return { ...cur, locales }
      })
    },
    [locale],
  )

  const setParagraphs = useCallback(
    (value: string) => {
      const list = value.split("\n").map((line) => line.trim()).filter(Boolean)
      setContent((cur) => {
        const locales = { ...cur.locales }
        const next = { ...(locales[locale] ?? {}) }
        if (list.length) next.paragraphs = list
        else delete next.paragraphs
        if (Object.keys(next).length) locales[locale] = next
        else delete locales[locale]
        return { ...cur, locales }
      })
    },
    [locale],
  )

  const save = async () => {
    setStatus({ kind: "saving" })
    try {
      const response = await fetch("/api/chleba-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) {
        setStatus({ kind: "error", message: data?.error ?? "Uložení se nepovedlo." })
        return
      }
      setContent(normalizeContent(data))
      setStatus({ kind: "ok", message: "Uloženo. Na webu se to projeví hned." })
    } catch {
      setStatus({ kind: "error", message: "Server neodpověděl." })
    }
  }

  const resetMedia = () => setMedia({ ...defaultMedia })

  const changedCount = useMemo(
    () => LOCALES.reduce((sum, l) => sum + Object.keys(content.locales[l] ?? {}).length, 0),
    [content.locales],
  )

  return (
    <div className="wrap">
      <header className="bar">
        <div>
          <h1>Chleba — úpravy</h1>
          <p className="sub">
            {signedInAs ? `Přihlášen: ${signedInAs}` : "Lokální režim bez přihlášení"}
            {content.updatedAt ? ` · naposledy uloženo ${new Date(content.updatedAt).toLocaleString("cs-CZ")}` : ""}
          </p>
        </div>
        <div className="actions">
          <a className="ghost" href="/chleba" target="_blank" rel="noreferrer">
            Otevřít stránku
          </a>
          <button type="button" className="primary" onClick={save} disabled={status.kind === "saving"}>
            {status.kind === "saving" ? "Ukládám…" : "Uložit"}
          </button>
        </div>
      </header>

      {status.message ? (
        <p className={status.kind === "error" ? "msg err" : "msg ok"}>{status.message}</p>
      ) : null}

      <div className="cols">
        <div className="panel">
          <section className="block">
            <h2>Fotka na pozadí</h2>
            {SLIDERS.map((slider) => (
              <label key={slider.id} className="slider">
                <span className="slabel">
                  {slider.label}
                  <b>
                    {(media as unknown as Record<string, number>)[slider.id]}
                    {slider.unit}
                  </b>
                </span>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  value={(media as unknown as Record<string, number>)[slider.id]}
                  onChange={(event) => setMedia({ [slider.id]: Number(event.target.value) } as never)}
                />
                {"hint" in slider && slider.hint ? <span className="hint">{slider.hint}</span> : null}
              </label>
            ))}

            <label className="field">
              <span className="flabel">Vlastní fotka (cesta nebo URL)</span>
              <input
                type="text"
                value={media.image}
                placeholder="/images/chleba-hero.jpeg"
                onChange={(event) => setMedia({ image: event.target.value })}
              />
            </label>

            <button type="button" className="ghost small" onClick={resetMedia}>
              Vrátit výchozí vzhled
            </button>
          </section>

          <section className="block">
            <div className="langs">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  type="button"
                  className={l === locale ? "lang on" : "lang"}
                  onClick={() => setLocale(l)}
                >
                  {LOCALE_LABEL[l]}
                  {Object.keys(content.locales[l] ?? {}).length ? <i /> : null}
                </button>
              ))}
            </div>
            <p className="hint">
              Prázdné pole znamená „nech text z webu“. Šedý text v poli je současné výchozí znění.
            </p>

            {TEXT_FIELDS.map((field) => (
              <label key={field.id} className="field">
                <span className="flabel">{field.label}</span>
                {field.rows > 1 ? (
                  <textarea
                    rows={field.rows}
                    value={(entry as Record<string, string>)[field.id] ?? ""}
                    placeholder={defaults[field.id] ?? ""}
                    onChange={(event) => setField(field.id, event.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    value={(entry as Record<string, string>)[field.id] ?? ""}
                    placeholder={defaults[field.id] ?? ""}
                    onChange={(event) => setField(field.id, event.target.value)}
                  />
                )}
              </label>
            ))}

            <label className="field">
              <span className="flabel">Odstavce v levém sloupci — jeden na řádek</span>
              <textarea
                rows={6}
                value={(entry.paragraphs ?? []).join("\n")}
                placeholder={(defaults.paragraphs ?? []).join("\n")}
                onChange={(event) => setParagraphs(event.target.value)}
              />
            </label>
          </section>

          <p className="hint">
            Upraveno polí: {changedCount}. Co se nevyplní, bere se z webu — tak zůstane text v kódu
            jediným výchozím zněním.
          </p>
        </div>

        <div className="preview">
          <div className="pvhead">Živý náhled</div>
          {loaded ? (
            <iframe ref={frameRef} src="/chleba" title="Náhled stránky Chleba" />
          ) : (
            <div className="pvload">Načítám…</div>
          )}
        </div>
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100svh;
          background: #0c0b0f;
          color: #f0ebe2;
          font-family: "Manrope", system-ui, sans-serif;
          padding: 22px clamp(14px, 3vw, 32px) 60px;
        }
        .bar {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(201, 185, 154, 0.18);
          padding-bottom: 16px;
          margin-bottom: 18px;
        }
        h1 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .sub {
          margin: 4px 0 0;
          font-size: 0.72rem;
          color: rgba(240, 235, 226, 0.5);
        }
        .actions {
          display: flex;
          gap: 10px;
        }
        .primary,
        .ghost {
          appearance: none;
          border: 1px solid rgba(201, 185, 154, 0.3);
          background: transparent;
          color: inherit;
          font: inherit;
          font-size: 0.76rem;
          padding: 10px 18px;
          min-height: 40px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: background 0.2s, border-color 0.2s;
        }
        .primary {
          background: #c8a96e;
          border-color: #c8a96e;
          color: #1a1206;
          font-weight: 600;
        }
        .primary:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .ghost:hover {
          border-color: rgba(201, 185, 154, 0.6);
        }
        .small {
          font-size: 0.7rem;
          padding: 8px 14px;
          min-height: 34px;
        }
        .msg {
          margin: 0 0 16px;
          font-size: 0.76rem;
          padding: 10px 14px;
          border: 1px solid;
        }
        .ok {
          border-color: rgba(120, 180, 120, 0.4);
          color: #b6dcb6;
        }
        .err {
          border-color: rgba(200, 110, 110, 0.45);
          color: #e8b4b4;
        }
        .cols {
          display: grid;
          grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
          gap: 22px;
          align-items: start;
        }
        .panel {
          display: grid;
          gap: 22px;
          min-width: 0;
        }
        .block {
          border: 1px solid rgba(201, 185, 154, 0.16);
          padding: 18px 16px;
          display: grid;
          gap: 14px;
        }
        h2 {
          margin: 0;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(240, 235, 226, 0.55);
          font-weight: 600;
        }
        .slider {
          display: grid;
          gap: 6px;
        }
        .slabel {
          display: flex;
          justify-content: space-between;
          font-size: 0.74rem;
          color: rgba(240, 235, 226, 0.8);
        }
        .slabel b {
          color: #c8a96e;
          font-weight: 600;
        }
        input[type="range"] {
          width: 100%;
          accent-color: #c8a96e;
        }
        .hint {
          font-size: 0.68rem;
          line-height: 1.5;
          color: rgba(240, 235, 226, 0.42);
          margin: 0;
        }
        .field {
          display: grid;
          gap: 5px;
        }
        .flabel {
          font-size: 0.66rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240, 235, 226, 0.5);
        }
        input[type="text"],
        textarea {
          width: 100%;
          background: #131117;
          border: 1px solid rgba(201, 185, 154, 0.2);
          color: #f0ebe2;
          font: inherit;
          font-size: 0.8rem;
          line-height: 1.55;
          padding: 9px 11px;
          resize: vertical;
        }
        input[type="text"]::placeholder,
        textarea::placeholder {
          color: rgba(240, 235, 226, 0.3);
        }
        input[type="text"]:focus,
        textarea:focus {
          outline: none;
          border-color: rgba(201, 185, 154, 0.5);
        }
        .langs {
          display: flex;
          gap: 6px;
        }
        .lang {
          appearance: none;
          border: 1px solid rgba(201, 185, 154, 0.2);
          background: transparent;
          color: rgba(240, 235, 226, 0.6);
          font: inherit;
          font-size: 0.72rem;
          padding: 8px 13px;
          min-height: 36px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .lang.on {
          color: #c8a96e;
          border-color: rgba(200, 169, 110, 0.55);
          background: rgba(200, 169, 110, 0.08);
        }
        .lang i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #c8a96e;
        }
        .preview {
          position: sticky;
          top: 22px;
          border: 1px solid rgba(201, 185, 154, 0.16);
          background: #08070a;
          min-width: 0;
        }
        .pvhead {
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(240, 235, 226, 0.45);
          padding: 10px 14px;
          border-bottom: 1px solid rgba(201, 185, 154, 0.14);
        }
        .preview iframe {
          display: block;
          width: 100%;
          height: min(76svh, 900px);
          border: 0;
          background: #08070a;
        }
        .pvload {
          padding: 40px;
          text-align: center;
          font-size: 0.75rem;
          color: rgba(240, 235, 226, 0.4);
        }

        @media (max-width: 900px) {
          .cols {
            grid-template-columns: 1fr;
          }
          .preview {
            position: static;
          }
          .preview iframe {
            height: 60svh;
          }
        }
      `}</style>
    </div>
  )
}
