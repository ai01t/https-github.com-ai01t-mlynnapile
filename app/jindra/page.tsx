import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Ing. Jindřich Traxmandl",
  robots: { index: false, follow: false },
}

const wrap: React.CSSProperties = {
  minHeight: "100svh",
  background: "#07060a",
  color: "#f0ebe2",
  fontFamily: "'Manrope', system-ui, sans-serif",
  display: "flex",
  justifyContent: "center",
  padding: "clamp(64px, 12vh, 160px) 24px 80px",
}
const inner: React.CSSProperties = { width: "min(680px, 100%)" }
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
  fontSize: ".62rem",
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: "#f0ebe2",
  textDecoration: "none",
  border: "1px solid rgba(201,185,154,.22)",
  padding: "10px 18px",
}
const rule: React.CSSProperties = { border: 0, borderTop: "1px solid rgba(201,185,154,.14)", margin: "48px 0 28px" }
const secLabel: React.CSSProperties = {
  fontSize: ".58rem",
  letterSpacing: ".26em",
  textTransform: "uppercase",
  color: "#8a8177",
  marginBottom: "18px",
}
const project: React.CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "inherit",
  border: "1px solid rgba(201,185,154,.16)",
  padding: "22px 24px",
  transition: "border-color .2s",
}
const projTitle: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontWeight: 400,
  fontSize: "1.5rem",
  margin: 0,
  color: "#f0ebe2",
}
const projDesc: React.CSSProperties = { marginTop: "8px", fontSize: ".85rem", lineHeight: 1.6, color: "rgba(240,235,226,.55)" }
const back: React.CSSProperties = {
  display: "inline-block",
  marginTop: "48px",
  fontSize: ".62rem",
  letterSpacing: ".2em",
  textTransform: "uppercase",
  color: "#8a8177",
  textDecoration: "none",
}

export default function JindraProfile() {
  return (
    <main style={wrap}>
      <div style={inner}>
        <p style={eyebrow}>Soukromý profil</p>
        <h1 style={name}>Ing. Jindřich Traxmandl</h1>
        <p style={role}>
          Kytarista kapely Anteater, nadšenec do moderních technologií i klasických vintage nástrojů a aparátů.
          Provozovatel Mlýna na Pile, autor webu a několika vlastních projektů.
        </p>

        <div style={socials}>
          <a style={socialLink} href="https://www.facebook.com/j.traxmandl/" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <a style={socialLink} href="https://www.instagram.com/jindra_traxmandl/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>

        <hr style={rule} />

        <p style={secLabel}>Projekty</p>
        <Link href="/jindra/bac" style={project}>
          <h2 style={projTitle}>Budget &amp; Area Configurator</h2>
          <p style={projDesc}>
            Kalkulace oprav omítek a zednických prací — plochy místností, rozpočet, materiál, nabídka a fakturace
            včetně QR platby.
          </p>
        </Link>

        <Link href="/jindra/bac/21693021" style={{ ...project, marginTop: "12px" }}>
          <h2 style={projTitle}>Fenchak — kalkulačka</h2>
          <p style={projDesc}>
            Ukázková instance konfigurátoru nabrandovaná pro Yurii Fenchak (IČO 21693021, logo, ZEDNICKÉ PRÁCE).
            Vizitka na <span style={{ color: "#b08d57" }}>/jindra/bac/21693021/vizitka</span>.
          </p>
        </Link>

        <Link href="/" style={back}>
          ← Zpět na Mlýn na Pile
        </Link>
      </div>
    </main>
  )
}
