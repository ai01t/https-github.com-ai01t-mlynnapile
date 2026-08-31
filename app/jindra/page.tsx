import type { Metadata } from "next"
import JindraProfileClient from "./profile-client"

export const metadata: Metadata = {
  title: "Ing. Jindřich Traxmandl",
  robots: { index: false, follow: false },
}

export default function JindraProfile() {
  return <JindraProfileClient />
}
