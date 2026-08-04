"use client"

import { useEffect, useRef, useState } from "react"
import {
  BgConfig,
  PAGE_KEYS,
  PRESETS,
  Side,
  buildBlurMask,
  buildMediaFilter,
  buildOverlayGradients,
  clearBgConfig,
  defaultBgConfig,
  loadBgConfig,
  saveBgConfig,
} from "@/lib/page-bg"

const PASSWORD = "1717"
const SESSION_KEY = "mlyn.admin.ok"

/* ---------- styly ---------- */
const page: React.CSSProperties = {
  minHeight: "100svh",
  background: "#0c0b0f",
  color: "#f0ebe2",
  fontFamily: "'Manrope', system-ui, sans-serif",
  padding: "28px 22px 80px",
}
const shell: React.CSSProperties = { width: "min(1320px,100%)", margin: "0 auto" }
const h1: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: "2.1rem", margin: 0 }
const label: React.CSSProperties = {
  fontSize: ".56rem",
  letterSpacing: ".2em",
  textTransform: "uppercase",
  color: "#8a8177",
  display: "block",
  marginBottom: "6px",
}
const panel: React.CSSProperties = {
  border: "1px solid rgba(201,185,154,.14)",
  borderRadius: "10px",
  padding: "16px",
  background: "rgba(255,255,255,.02)",
}
const btn: React.CSSProperties = {
  fontSize: ".66rem",
  letterSpacing: ".13em",
  textTransform: "uppercase",
  color: "#f0ebe2",
  background: "rgba(255,255,255,.05)",
  border: "1px solid rgba(201,185,154,.24)",
  padding: "9px 15px",
  cursor: "pointer",
  borderRadius: "6px",
  fontFamily: "inherit",
}
const btnActive: React.CSSProperties = { ...btn, border: "1px solid #b08d57", color: "#b08d57" }
const btnPrimary: React.CSSProperties = { ...btn, background: "#7d1f1f", border: "1px solid #7d1f1f", fontWeight: 700 }
const input: React.CSSProperties = {
  width: "100%",
  background: "rgba(0,0,0,.35)",
  border: "1px solid rgba(201,185,154,.2)",
  borderRadius: "6px",
  color: "#f0ebe2",
  padding: "8px 10px",
  fontSize: ".84rem",
  fontFamily: "inherit",
}
const row: React.CSSProperties = { marginBottom: "12px" }
const hr: React.CSSProperties = { border: 0, borderTop: "1px solid rgba(201,185,154,.12)", margin: "14px 0" }

/* Redakční editor — typografie jako na výsledné stránce */
const EDITOR_CSS = `
.mlyn-editor{color:#f0ebe2;font-family:'Manrope',system-ui,sans-serif;font-weight:300;line-height:1.7;}
.mlyn-editor h1{font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:clamp(2rem,4vw,3.5rem);line-height:1.04;letter-spacing:-.01em;margin:0 0 14px;white-space:nowrap;}
.mlyn-editor h2{font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:clamp(1.5rem,2.6vw,2.2rem);line-height:1.1;margin:26px 0 10px;}
.mlyn-editor h3{font-size:.6rem;letter-spacing:.26em;text-transform:uppercase;color:#8a8177;font-weight:600;margin:22px 0 8px;}
.mlyn-editor p{margin:0 0 12px;color:rgba(240,235,226,.72);max-width:60ch;}
.mlyn-editor a{color:#b08d57;}
.mlyn-editor ul{margin:0 0 12px 18px;color:rgba(240,235,226,.72);}
.mlyn-editor:focus{outline:1px solid rgba(176,141,87,.5);outline-offset:6px;}
`

function Gate({ onOk }: { onOk: () => void }) {
  const [val, setVal] = useState("")
  const [err, setErr] = useState(false)
  return (
    <main style={{ ...page, display: "grid", placeItems: "center" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (val === PASSWORD) {
            try { sessionStorage.setItem(SESSION_KEY, "1") } catch {}
            onOk()
          } else setErr(true)
        }}
        style={{ ...panel, width: "min(340px,100%)", textAlign: "center" }}
      >
        <h1 style={{ ...h1, fontSize: "1.6rem", marginBottom: "16px" }}>Administrace</h1>
        <input
          style={{ ...input, textAlign: "center", letterSpacing: ".3em" }}
          type="password"
          inputMode="numeric"
          placeholder="heslo"
          value={val}
          onChange={(e) => { setVal(e.target.value); setErr(false) }}
          autoFocus
        />
        {err && <p style={{ color: "#e07a7a", fontSize: ".78rem", marginTop: "10px" }}>Nesprávné heslo.</p>}
        <button type="submit" style={{ ...btnPrimary, width: "100%", marginTop: "14px" }}>Vstoupit</button>
      </form>
    </main>
  )
}

export default function AdminClient() {
  const [ok, setOk] = useState(false)
  const [pageId, setPageId] = useState<string>(PAGE_KEYS[0].id)
  const [cfg, setCfg] = useState<BgConfig>(defaultBgConfig)
  const [flash, setFlash] = useState("")
  const [drag, setDrag] = useState<Side | null>(null)
  const [tab, setTab] = useState<"bg" | "text" | "seo">("bg")
  const previewRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try { if (sessionStorage.getItem(SESSION_KEY) === "1") setOk(true) } catch {}
  }, [])

  useEffect(() => {
    if (!ok) return
    const loaded = loadBgConfig(pageId)
    setCfg(loaded)
    if (editorRef.current) editorRef.current.innerHTML = loaded.text || ""
  }, [pageId, ok])

  const set = (patch: Partial<BgConfig>) => setCfg((c) => ({ ...c, ...patch }))
  const setEdge = (side: Side, v: number) =>
    setCfg((c) => ({ ...c, edges: { ...c.edges, [side]: Math.max(0, Math.min(100, Math.round(v))) } }))
  const setEdgeOpacity = (side: Side, v: number) =>
    setCfg((c) => ({ ...c, edgeOpacity: { ...c.edgeOpacity, [side]: Math.max(0, Math.min(100, Math.round(v))) } }))

  useEffect(() => {
    if (!drag) return
    const onMove = (e: PointerEvent) => {
      const el = previewRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      let pct = 0
      if (drag === "left") pct = ((e.clientX - r.left) / r.width) * 100
      if (drag === "right") pct = ((r.right - e.clientX) / r.width) * 100
      if (drag === "top") pct = ((e.clientY - r.top) / r.height) * 100
      if (drag === "bottom") pct = ((r.bottom - e.clientY) / r.height) * 100
      setEdge(drag, pct)
    }
    const onUp = () => setDrag(null)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [drag])

  const onImageFile = (file?: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set({ image: String(reader.result || ""), video: "" })
    reader.readAsDataURL(file)
  }

  const onSeoFile = (file?: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set({ seoText: String(reader.result || "").trim() })
    reader.readAsText(file)
  }

  const doSave = () => {
    try {
      const next = { ...cfg, text: editorRef.current?.innerHTML || cfg.text }
      saveBgConfig(pageId, next)
      setCfg(next)
      setFlash("Uloženo ✓")
      setTimeout(() => setFlash(""), 2200)
    } catch (e: any) {
      setFlash(e?.message || "Uložení selhalo")
      setTimeout(() => setFlash(""), 4000)
    }
  }

  if (!ok) return <Gate onOk={() => setOk(true)} />

  const overlay = buildOverlayGradients(cfg)
  const mask = buildBlurMask(cfg)
  const current = PAGE_KEYS.find((p) => p.id === pageId)

  const handle = (side: Side): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: "#fff",
      border: "2px solid #7d1f1f",
      cursor: side === "left" || side === "right" ? "ew-resize" : "ns-resize",
      zIndex: 5,
      touchAction: "none",
      boxShadow: "0 2px 8px rgba(0,0,0,.5)",
    }
    const pos = cfg.edges[side]
    if (side === "left") return { ...base, left: `calc(${pos}% - 9px)`, top: "calc(50% - 9px)" }
    if (side === "right") return { ...base, right: `calc(${pos}% - 9px)`, top: "calc(50% - 9px)" }
    if (side === "top") return { ...base, top: `calc(${pos}% - 9px)`, left: "calc(50% - 9px)" }
    return { ...base, bottom: `calc(${pos}% - 9px)`, left: "calc(50% - 9px)" }
  }

  const slider = (l: string, v: number, on: (n: number) => void, min = 0, max = 100, unit = "%") => (
    <div style={row}>
      <span style={label}>{l} — {v}{unit}</span>
      <input type="range" min={min} max={max} value={v} onChange={(e) => on(Number(e.target.value))} style={{ width: "100%" }} />
    </div>
  )

  const exec = (cmd: string, arg?: string) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, arg)
    set({ text: editorRef.current?.innerHTML || "" })
  }

  return (
    <main style={page}>
      <style dangerouslySetInnerHTML={{ __html: EDITOR_CSS }} />
      <div style={shell}>
        <header style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", marginBottom: "18px" }}>
          <h1 style={h1}>Administrace</h1>
          <span style={{ fontSize: ".76rem", color: "#8a8177" }}>Pozadí, text a SEO stránek</span>
          {flash && <strong style={{ color: "#7fd18c", fontSize: ".8rem" }}>{flash}</strong>}
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            <a href={current?.path || "/"} target="_blank" rel="noopener noreferrer" style={{ ...btn, textDecoration: "none" }}>Otevřít stránku</a>
            <button style={btn} onClick={() => { clearBgConfig(pageId); setCfg(defaultBgConfig); if (editorRef.current) editorRef.current.innerHTML = "" }}>Reset</button>
            <button style={btnPrimary} onClick={doSave}>Uložit</button>
          </div>
        </header>

        <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "16px" }}>
          {PAGE_KEYS.map((p) => (
            <button key={p.id} style={p.id === pageId ? btnActive : btn} onClick={() => setPageId(p.id)}>{p.label}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.65fr) minmax(300px,1fr)", gap: "18px", alignItems: "start" }}>
          {/* LEVÁ STRANA — náhled + redakční editor */}
          <div>
            <span style={label}>Náhled stránky — táhni kolečka od kraje dovnitř (kde skončí, tam gradient přechází do fotky)</span>
            <div
              ref={previewRef}
              style={{
                position: "relative",
                minHeight: "440px",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid rgba(201,185,154,.2)",
                background: "#07060a",
                userSelect: drag ? "none" : "auto",
              }}
            >
              {cfg.video ? (
                <video key={cfg.video} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: buildMediaFilter(cfg) }}>
                  <source src={cfg.video} />
                </video>
              ) : cfg.image ? (
                <div style={{ position: "absolute", inset: 0, backgroundImage: `url("${cfg.image}")`, backgroundSize: "cover", backgroundPosition: "center", filter: buildMediaFilter(cfg) }} />
              ) : null}

              {cfg.blur > 0 && mask && (
                <div style={{ position: "absolute", inset: 0, backdropFilter: `blur(${cfg.blur}px)`, WebkitBackdropFilter: `blur(${cfg.blur}px)`, WebkitMaskImage: mask, maskImage: mask }} />
              )}
              {overlay && <div style={{ position: "absolute", inset: 0, backgroundImage: overlay, pointerEvents: "none" }} />}

              {/* redakční plocha přímo v náhledu — vypadá jako výsledná stránka */}
              <div style={{ position: "relative", zIndex: 3, padding: "clamp(28px,5vw,56px)" }}>
                <div
                  ref={editorRef}
                  className="mlyn-editor"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => set({ text: (e.target as HTMLDivElement).innerHTML })}
                  style={{ minHeight: "300px", overflowX: "auto" }}
                />
              </div>

              {(["top", "right", "bottom", "left"] as Side[]).map((s) => (
                <div key={s} style={handle(s)} onPointerDown={(e) => { e.preventDefault(); setDrag(s) }} title={`${s}: ${cfg.edges[s]}%`} />
              ))}
            </div>

            {/* nástrojová lišta editoru */}
            <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ ...label, marginBottom: 0, marginRight: "4px" }}>Text</span>
              <button style={{ ...btn, padding: "6px 11px" }} onClick={() => exec("formatBlock", "h1")}>Nadpis</button>
              <button style={{ ...btn, padding: "6px 11px" }} onClick={() => exec("formatBlock", "h2")}>Podnadpis</button>
              <button style={{ ...btn, padding: "6px 11px" }} onClick={() => exec("formatBlock", "h3")}>Nadtitulek</button>
              <button style={{ ...btn, padding: "6px 11px" }} onClick={() => exec("formatBlock", "p")}>Odstavec</button>
              <button style={{ ...btn, padding: "6px 11px", fontWeight: 700 }} onClick={() => exec("bold")}>B</button>
              <button style={{ ...btn, padding: "6px 11px", fontStyle: "italic" }} onClick={() => exec("italic")}>I</button>
              <button style={{ ...btn, padding: "6px 11px" }} onClick={() => exec("insertUnorderedList")}>• seznam</button>
              <button style={{ ...btn, padding: "6px 11px" }} onClick={() => { const u = prompt("URL odkazu:"); if (u) exec("createLink", u) }}>odkaz</button>
              <button style={{ ...btn, padding: "6px 11px" }} onClick={() => exec("removeFormat")}>čistit</button>
            </div>
          </div>

          {/* PRAVÁ STRANA — ovládání */}
          <div style={panel}>
            <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
              {([["bg", "Pozadí"], ["text", "Vzhled textu"], ["seo", "SEO"]] as const).map(([id, l]) => (
                <button key={id} style={tab === id ? btnActive : btn} onClick={() => setTab(id)}>{l}</button>
              ))}
            </div>

            <div style={{ ...row, fontSize: ".82rem" }}>
              {current?.label} — <code style={{ color: "#b08d57" }}>{current?.path}</code>
            </div>

            {tab === "bg" && (
              <>
                <div style={row}>
                  <span style={label}>Fotografie na pozadí</span>
                  <input type="file" accept="image/*" onChange={(e) => onImageFile(e.target.files?.[0])} style={{ ...input, padding: "6px" }} />
                  <input style={{ ...input, marginTop: "7px" }} placeholder="…nebo cesta/URL (/images/foto.jpg)" value={cfg.image.startsWith("data:") ? "" : cfg.image} onChange={(e) => set({ image: e.target.value })} />
                </div>
                <div style={row}>
                  <span style={label}>Video na pozadí (volitelné)</span>
                  <input style={input} placeholder="/videos/bg/xxx.mp4" value={cfg.video} onChange={(e) => set({ video: e.target.value })} />
                </div>

                <hr style={hr} />

                <span style={label}>Předvolby zatmavení</span>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
                  {PRESETS.map((p) => (
                    <button key={p.id} style={{ ...btn, padding: "7px 11px" }} onClick={() => set(p.patch)}>{p.label}</button>
                  ))}
                </div>

                <div style={row}>
                  <span style={label}>Barva zatmavení</span>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input type="color" value={cfg.color} onChange={(e) => set({ color: e.target.value })} style={{ width: 44, height: 32, background: "none", border: "1px solid rgba(201,185,154,.2)", borderRadius: 6 }} />
                    <input style={input} value={cfg.color} onChange={(e) => set({ color: e.target.value })} />
                  </div>
                </div>

                {slider("Korekce celkového zatmavení", cfg.opacity, (v) => set({ opacity: v }), 0, 200)}
                {slider("Vinětace (rohy)", cfg.vignette, (v) => set({ vignette: v }))}

                <hr style={hr} />
                <span style={label}>Zatmavení po stranách — dosah / síla</span>
                {(["top", "right", "bottom", "left"] as Side[]).map((s) => (
                  <div key={s} style={{ marginBottom: "10px" }}>
                    <span style={{ ...label, marginBottom: "4px" }}>
                      {s === "top" ? "Shora" : s === "right" ? "Zprava" : s === "bottom" ? "Zdola" : "Zleva"} — dosah {cfg.edges[s]}% · síla {cfg.edgeOpacity[s]}%
                    </span>
                    <input type="range" min={0} max={100} value={cfg.edges[s]} onChange={(e) => setEdge(s, Number(e.target.value))} style={{ width: "100%" }} />
                    <input type="range" min={0} max={100} value={cfg.edgeOpacity[s]} onChange={(e) => setEdgeOpacity(s, Number(e.target.value))} style={{ width: "100%" }} />
                  </div>
                ))}

                <hr style={hr} />
                {slider("Rozostření okrajů", cfg.blur, (v) => set({ blur: v }), 0, 30, "px")}
                {slider("Černobílá", cfg.grayscale, (v) => set({ grayscale: v }))}
                {slider("Jas", cfg.brightness, (v) => set({ brightness: v }), 0, 200)}
                {slider("Kontrast", cfg.contrast, (v) => set({ contrast: v }), 0, 200)}
              </>
            )}

            {tab === "text" && (
              <>
                <p style={{ fontSize: ".8rem", color: "rgba(240,235,226,.6)", lineHeight: 1.6, marginBottom: "12px" }}>
                  Text piš přímo do náhledu vlevo — zobrazuje se v typografii výsledné stránky.
                  Nadpis se nezalamuje (např. „Ing. Jindřich Traxmandl" zůstane na jednom řádku).
                </p>
                <div style={row}>
                  <span style={label}>HTML obsahu (pro pokročilé)</span>
                  <textarea
                    style={{ ...input, minHeight: "220px", fontFamily: "ui-monospace, monospace", fontSize: ".74rem" }}
                    value={cfg.text}
                    onChange={(e) => {
                      set({ text: e.target.value })
                      if (editorRef.current) editorRef.current.innerHTML = e.target.value
                    }}
                  />
                </div>
              </>
            )}

            {tab === "seo" && (
              <>
                <div style={row}>
                  <span style={label}>AI popis pro vyhledávače — nahrát .txt</span>
                  <input type="file" accept=".txt,text/plain" onChange={(e) => onSeoFile(e.target.files?.[0])} style={{ ...input, padding: "6px" }} />
                </div>
                <div style={row}>
                  <span style={label}>Popis (meta description) — {cfg.seoText.length} znaků</span>
                  <textarea
                    style={{ ...input, minHeight: "220px", lineHeight: 1.6 }}
                    placeholder="Detailní popis stránky pro vyhledávače…"
                    value={cfg.seoText}
                    onChange={(e) => set({ seoText: e.target.value })}
                  />
                </div>
                <p style={{ fontSize: ".72rem", color: "#8a8177", lineHeight: 1.5 }}>
                  Prvních ~160 znaků se použije jako meta description stránky. Delší text slouží jako podklad
                  (např. pro pozdější generování obsahu).
                </p>
              </>
            )}

            <p style={{ fontSize: ".7rem", color: "#8a8177", lineHeight: 1.5, marginTop: "14px" }}>
              Ukládá se do tohoto prohlížeče (bez serveru). Heslo je jednoduchá zábrana, ne skutečné zabezpečení.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
