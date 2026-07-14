import type { Metadata } from "next"
import Link from "next/link"

// Veřejná vizitka podnikatele (varianta 3 — sdílený profil bez přihlášení).
// Přímý přístup např. /jindra/bac/21693021

type Profile = {
  ico: string
  name: string
  trade?: string
  address?: string
  web?: string
  phone?: string
  email?: string
  dic?: string
  vat?: boolean
  logo?: "fenchak" | null
  note?: string
}

// Předvyplněné demo profily (bez backendu). Klíč = IČO.
const PROFILES: Record<string, Profile> = {
  "21693021": {
    ico: "21693021",
    name: "Yurii Fenchak",
    trade: "Zednické a stavební práce",
    address: "č.p. 6, 345 32 Česká Kubice",
    web: "fenchak.cz",
    vat: false,
    logo: "fenchak",
  },
}

// Nejlepší snaha dotáhnout aspoň jméno/adresu z ARES pro neznámé IČO.
async function aresLookup(ico: string): Promise<Profile | null> {
  const clean = ico.replace(/\s+/g, "")
  if (!/^\d{8}$/.test(clean)) return null
  try {
    const res = await fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${clean}`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return null
    const d: any = await res.json()
    const s = d.sidlo || {}
    return {
      ico: clean,
      name: d.obchodniJmeno || `Subjekt ${clean}`,
      address: s.textovaAdresa || [s.nazevObce, s.psc].filter(Boolean).join(", "),
      note: "Profil zatím není vyplněný — údaje jsou z veřejného rejstříku ARES.",
      logo: null,
    }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { ico: string } }): Promise<Metadata> {
  const p = PROFILES[params.ico]
  return {
    title: p ? `${p.name} — vizitka` : `Profil ${params.ico}`,
    robots: { index: false, follow: false },
  }
}

function FenchakLogo() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/fenchak-logo.png" alt="fenchak.cz" width={132} height={124} style={{ display: "block", width: 132, height: "auto" }} />
}

const page: React.CSSProperties = {
  minHeight: "100svh",
  background: "linear-gradient(180deg,#eceae6 0%,#e2ded7 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
  fontFamily: "'Manrope', system-ui, sans-serif",
  color: "#1a1712",
}
const card: React.CSSProperties = {
  width: "min(560px, 100%)",
  background: "#fff",
  borderRadius: "18px",
  boxShadow: "0 30px 80px rgba(0,0,0,.18)",
  overflow: "hidden",
  border: "1px solid rgba(0,0,0,.06)",
}
const head: React.CSSProperties = {
  display: "flex",
  gap: "22px",
  alignItems: "center",
  padding: "34px 34px 24px",
  borderBottom: "1px solid rgba(0,0,0,.08)",
}
const nameStyle: React.CSSProperties = { fontSize: "1.7rem", fontWeight: 800, lineHeight: 1.1, margin: 0 }
const tradeStyle: React.CSSProperties = {
  marginTop: "6px",
  fontSize: ".72rem",
  letterSpacing: ".22em",
  textTransform: "uppercase",
  color: "#7d1f1f",
  fontWeight: 700,
}
const body: React.CSSProperties = { padding: "24px 34px 30px", display: "grid", gap: "14px" }
const rowLabel: React.CSSProperties = {
  fontSize: ".58rem",
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: "#8a837a",
  marginBottom: "2px",
}
const rowValue: React.CSSProperties = { fontSize: "1rem", fontWeight: 600 }
const foot: React.CSSProperties = {
  padding: "16px 34px 24px",
  borderTop: "1px solid rgba(0,0,0,.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
}
const backLink: React.CSSProperties = { fontSize: ".72rem", color: "#8a837a", textDecoration: "none" }
const webBtn: React.CSSProperties = {
  fontSize: ".72rem",
  fontWeight: 700,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: "#fff",
  background: "#7d1f1f",
  padding: "10px 18px",
  borderRadius: "8px",
  textDecoration: "none",
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={rowLabel}>{label}</div>
      <div style={rowValue}>{children}</div>
    </div>
  )
}

export default async function BusinessCard({ params }: { params: { ico: string } }) {
  const profile = PROFILES[params.ico] ?? (await aresLookup(params.ico))

  if (!profile) {
    return (
      <main style={page}>
        <div style={{ ...card, padding: "48px 34px", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Profil nenalezen</h1>
          <p style={{ marginTop: "10px", color: "#8a837a", fontSize: ".9rem" }}>
            Pro IČO <b>{params.ico}</b> zatím není vytvořená vizitka.
          </p>
          <Link href="/jindra/bac" style={{ ...backLink, display: "inline-block", marginTop: "20px" }}>
            ← Zpět do konfigurátoru
          </Link>
        </div>
      </main>
    )
  }

  const webHref = profile.web ? (profile.web.startsWith("http") ? profile.web : `https://${profile.web}`) : null

  return (
    <main style={page}>
      <div style={card}>
        <div style={head}>
          {profile.logo === "fenchak" ? (
            <FenchakLogo />
          ) : (
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 14,
                background: "#f2efe9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "#7d1f1f",
                flexShrink: 0,
              }}
            >
              {profile.name.slice(0, 1)}
            </div>
          )}
          <div>
            <h1 style={nameStyle}>{profile.name}</h1>
            {profile.trade && <div style={tradeStyle}>{profile.trade}</div>}
          </div>
        </div>

        <div style={body}>
          {profile.note && (
            <div
              style={{
                fontSize: ".82rem",
                color: "#8a5a12",
                background: "#fbf3e2",
                border: "1px solid #f0e0bd",
                borderRadius: "8px",
                padding: "10px 12px",
              }}
            >
              {profile.note}
            </div>
          )}
          <Row label="IČO">{profile.ico}</Row>
          {profile.dic && <Row label="DIČ">{profile.dic}</Row>}
          {!profile.vat && !profile.dic && <Row label="DPH">Neplátce DPH</Row>}
          {profile.address && <Row label="Sídlo">{profile.address}</Row>}
          {profile.phone && (
            <Row label="Telefon">
              <a href={`tel:${profile.phone.replace(/\s+/g, "")}`} style={{ color: "inherit" }}>
                {profile.phone}
              </a>
            </Row>
          )}
          {profile.email && (
            <Row label="E-mail">
              <a href={`mailto:${profile.email}`} style={{ color: "inherit" }}>
                {profile.email}
              </a>
            </Row>
          )}
          {profile.web && (
            <Row label="Web">
              <a href={webHref!} target="_blank" rel="noopener noreferrer" style={{ color: "#7d1f1f" }}>
                {profile.web}
              </a>
            </Row>
          )}
        </div>

        <div style={foot}>
          <Link href="/jindra/bac" style={backLink}>
            ← Budget &amp; Area Configurator
          </Link>
          {webHref && (
            <a href={webHref} target="_blank" rel="noopener noreferrer" style={webBtn}>
              Navštívit web
            </a>
          )}
        </div>
      </div>
    </main>
  )
}
