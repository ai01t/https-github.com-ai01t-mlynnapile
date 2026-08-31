import type { Metadata } from "next"
import AndreaClient from "./andrea-client"

export const metadata: Metadata = {
  title: "Mgr. Andrea Kohoutová | Mlýn na Pile",
  description:
    "Zpěvačka, baskytaristka a autorka textů kapely Anteater, archeoložka a pekařka kváskového chleba na Mlýně na Pile.",
  robots: { index: false, follow: false },
}

export default function AndreaPage() {
  return <AndreaClient />
}
