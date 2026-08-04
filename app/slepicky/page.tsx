import type { Metadata } from "next"
import PageCanvas from "@/components/page-canvas"

export const metadata: Metadata = {
  title: "Slepičky | Mlýn na Pile",
  description: "Slepičky na Mlýně na Pile.",
}

export default function SlepickyPage() {
  return (
    <PageCanvas pageId="slepicky">
      <div style={{ maxWidth: "min(760px,100%)", margin: "0 auto", padding: "clamp(56px,12vh,140px) 24px 80px", color: "#f0ebe2", fontFamily: "'Manrope', system-ui, sans-serif" }}>
        <p style={{ fontSize: ".62rem", letterSpacing: ".28em", textTransform: "uppercase", color: "#8a8177", marginBottom: "16px" }}>
          Mlýn na Pile
        </p>
        <h1 className="mlyn-title">Slepičky</h1>
        <p style={{ marginTop: "20px", color: "rgba(240,235,226,.6)", lineHeight: 1.7, maxWidth: "52ch" }}>
          Obsah této stránky (pozadí, fotku i text) nastavíš v administraci.
        </p>
        <a href="/" style={{ display: "inline-block", marginTop: "40px", fontSize: ".62rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#8a8177", textDecoration: "none" }}>
          ← Zpět na Mlýn na Pile
        </a>
      </div>
    </PageCanvas>
  )
}
