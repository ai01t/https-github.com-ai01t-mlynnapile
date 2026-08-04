import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bread calculator | Mlýn na Pile",
  robots: { index: false, follow: false },
}

// Kalkulačka chleba — statická aplikace z public/chleba-kalkulace.html.
export default function BreadCalculatorPage() {
  return (
    <main style={{ minHeight: "100svh", background: "#07060a" }}>
      <iframe
        src="/chleba-kalkulace.html"
        title="Bread calculator"
        style={{ display: "block", width: "100%", height: "100svh", border: 0 }}
      />
    </main>
  )
}
