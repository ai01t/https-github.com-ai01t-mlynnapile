"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import PageBgLayer, { RENDERED_TEXT_CSS } from "@/components/page-bg-layer"
import { useLiveBgConfig } from "@/lib/use-live-bg"

type Lang = "cs" | "en"

const T = {
  cs: {
    eyebrow: "Soukromý profil",
    bio: "Kytarista kapely Anteater, nadšenec do moderních technologií i klasických vintage nástrojů a aparátů. Provozovatel Mlýna na Pile, autor webu a několika vlastních projektů.",
    projects: "Projekty",
    bacTitle: "Budget & Area Configurator",
    bacDesc: "Kalkulace oprav omítek a zednických prací — plochy místností, rozpočet, materiál, nabídka a fakturace včetně QR platby.",
    keyfDesc: "Bookmark manager — cloudová aplikace pro ukládání a sdílení dat.",
    keyfMore:
      "Aplikaci jsem dělal v roce 2009 — předcházela Linktree (2016) a rozhraní připomíná SAP Fiori zveřejněné v roce 2013. Projekt dodnes funguje zdarma a jako funkční prototyp předcházel těmto službám o několik let :-)",
    more: "Více",
    less: "Méně",
    websites: "Weby",
    webMlyn: "Prezentace historického mlýna a retreat & recording studia",
    webAnteater: "Oficiální web alternativní rockové kapely Anteater",
    webFenchak: "Osobní / profesionální web",
    back: "← Zpět na Mlýn na Pile",
  },
  en: {
    eyebrow: "Private profile",
    bio: "Guitarist of the band Anteater, enthusiastic about modern technology as well as classic vintage instruments and amps. Operator of Mlýn na Pile, author of this website and several projects of his own.",
    projects: "Projects",
    bacTitle: "Budget & Area Configurator",
    bacDesc: "Plaster-repair and masonry cost calculator — room areas, budget, materials, quotes and invoicing incl. QR payment.",
    keyfDesc: "Bookmark manager — a cloud app for saving and sharing data.",
    keyfMore:
      "I built this app in 2009 — it predates Linktree (2016), and its interface resembles SAP Fiori, released in 2013. The project still runs free of charge to this day, and as a working prototype it preceded these services by several years :-)",
    more: "More",
    less: "Less",
    websites: "Websites",
    webMlyn: "Presentation of the historic mill restoration and the retreat & recording studio",
    webAnteater: "Official website of the alternative rock band Anteater",
    webFenchak: "Personal / professional website",
    back: "← Back to Mlýn na Pile",
  },
} as const

const wrap: React.CSSProperties = {
  minHeight: "100svh",
  background: "#07060a",
  color: "#f0ebe2",
  fontFamily: "'Manrope', system-ui, sans-serif",
  display: "flex",
  justifyContent: "center",
  padding: "clamp(64px, 12vh, 160px) 24px 80px",
}
const inner: React.CSSProperties = { width: "min(680px, 100%)", position: "relative" }
const eyebrow: React.CSSProperties = {
  fontSize: ".62rem",
  letterSpacing: ".28em",
  textTransform: "uppercase",
  color: "#8a8177",
  marginBottom: "18px",
}
const name: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontWeight: 300,
  fontSize: "clamp(2.6rem, 7vw, 4.4rem)",
  lineHeight: 1.02,
  letterSpacing: "-.01em",
  margin: 0,
}
const role: React.CSSProperties = {
  marginTop: "18px",
  fontSize: ".95rem",
  lineHeight: 1.7,
  color: "rgba(240,235,226,.62)",
  maxWidth: "48ch",
}
const socials: React.CSSProperties = { display: "flex", gap: "14px", marginTop: "28px", flexWrap: "wrap" }
const socialLink: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "42px",
  height: "42px",
  color: "#f0ebe2",
  textDecoration: "none",
  border: "1px solid rgba(201,185,154,.22)",
  borderRadius: "10px",
  background: "none",
  cursor: "pointer",
}
const rule: React.CSSProperties = { border: 0, borderTop: "1px solid rgba(201,185,154,.14)", margin: "48px 0 28px" }
const secLabel: React.CSSProperties = {
  fontSize: ".58rem",
  letterSpacing: ".26em",
  textTransform: "uppercase",
  color: "#8a8177",
  marginBottom: "18px",
}
const card: React.CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "inherit",
  padding: "16px 0",
  borderTop: "1px solid rgba(201,185,154,.1)",
}
const cardTitle: React.CSSProperties = {
  fontWeight: 500,
  fontSize: "1rem",
  margin: 0,
  color: "#f0ebe2",
  letterSpacing: ".01em",
}
const cardDesc: React.CSSProperties = { marginTop: "5px", fontSize: ".85rem", lineHeight: 1.55, color: "rgba(240,235,226,.5)" }
const moreBtn: React.CSSProperties = {
  marginTop: "10px",
  fontSize: ".72rem",
  color: "#b08d57",
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  fontFamily: "inherit",
}
const moreText: React.CSSProperties = {
  marginTop: "10px",
  fontSize: ".84rem",
  lineHeight: 1.65,
  color: "rgba(240,235,226,.6)",
  maxWidth: "56ch",
}
const webItem: React.CSSProperties = { padding: "12px 0", borderTop: "1px solid rgba(201,185,154,.1)", fontSize: ".88rem", lineHeight: 1.55 }
const webLink: React.CSSProperties = { color: "#f0ebe2", textDecoration: "none", fontWeight: 500 }
const webDesc: React.CSSProperties = { color: "rgba(240,235,226,.5)", fontSize: ".84rem" }
const back: React.CSSProperties = {
  display: "inline-block",
  marginTop: "48px",
  fontSize: ".62rem",
  letterSpacing: ".2em",
  textTransform: "uppercase",
  color: "#8a8177",
  textDecoration: "none",
}
const langBar: React.CSSProperties = { position: "absolute", top: "-40px", right: 0, display: "flex", gap: "8px" }
const langBtn = (active: boolean): React.CSSProperties => ({
  fontSize: ".6rem",
  letterSpacing: ".2em",
  textTransform: "uppercase",
  color: active ? "#b08d57" : "rgba(240,235,226,.5)",
  background: "none",
  border: active ? "1px solid rgba(176,141,87,.5)" : "1px solid rgba(201,185,154,.18)",
  padding: "6px 12px",
  cursor: "pointer",
  fontFamily: "inherit",
})

export default function JindraProfileClient() {
  const [lang, setLang] = useState<Lang>("cs")
  const [keyfOpen, setKeyfOpen] = useState(false)
  const liveBg = useLiveBgConfig("jindra")
  const hasBg = Boolean(liveBg?.image || liveBg?.video)
  const t = T[lang]

  return (
    <main style={{ ...wrap, background: hasBg ? "transparent" : wrap.background }}>
      <style dangerouslySetInnerHTML={{ __html: RENDERED_TEXT_CSS }} />
      <PageBgLayer pageId="jindra" />
      <div style={{ ...inner, zIndex: 1 }}>
        <div style={langBar}>
          <button type="button" style={langBtn(lang === "cs")} onClick={() => setLang("cs")}>
            CZ
          </button>
          <button type="button" style={langBtn(lang === "en")} onClick={() => setLang("en")}>
            EN
          </button>
        </div>

        <p style={eyebrow}>{t.eyebrow}</p>
        <h1 className="mlyn-title">Ing. Jindřich Traxmandl</h1>
        <p style={role}>{t.bio}</p>

        <div style={socials}>
          <a style={socialLink} href="https://www.facebook.com/j.traxmandl/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.19 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.75 8.44-4.92 8.44-9.94z" />
            </svg>
          </a>
          <a style={socialLink} href="https://www.instagram.com/jindra_traxmandl/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>

        <hr style={rule} />

        <p style={secLabel}>{t.projects}</p>

        <Link href="/jindra/bac" style={card}>
          <h2 style={cardTitle}>{t.bacTitle}</h2>
          <p style={cardDesc}>{t.bacDesc}</p>
        </Link>

        <div style={{ ...card, marginTop: "12px" }}>
          <h2 style={cardTitle}>
            <a href="https://keyf11.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
              keyF11.com
            </a>
          </h2>
          <p style={cardDesc}>{t.keyfDesc}</p>
          <button type="button" style={moreBtn} onClick={() => setKeyfOpen((v) => !v)}>
            {keyfOpen ? t.less : t.more}
          </button>
          {keyfOpen && <p style={moreText}>{t.keyfMore}</p>}
        </div>

        <hr style={rule} />

        <p style={secLabel}>{t.websites}</p>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          <li style={webItem}>
            <a style={webLink} href="https://www.mlynnapile.cz" target="_blank" rel="noopener noreferrer">
              mlynnapile.cz
            </a>{" "}
            <span style={webDesc}>— {t.webMlyn}</span>
          </li>
          <li style={webItem}>
            <a style={webLink} href="https://www.anteaterofficial.com" target="_blank" rel="noopener noreferrer">
              anteaterofficial.com
            </a>{" "}
            <span style={webDesc}>— {t.webAnteater}</span>
          </li>
          <li style={webItem}>
            <a style={webLink} href="https://fenchak.cz" target="_blank" rel="noopener noreferrer">
              fenchak.cz
            </a>{" "}
            <span style={webDesc}>— {t.webFenchak}</span>
          </li>
        </ul>

        <Link href="/" style={back}>
          {t.back}
        </Link>
      </div>
    </main>
  )
}
