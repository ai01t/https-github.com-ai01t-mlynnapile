import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Merriweather } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  weight: ["300", "400", "700"],
})

export const metadata: Metadata = {
  title: "Mlýn na Pile - Retreat Studio",
  description:
    "Historický mlýn ze 17. století v srdci Evropy – unikátní prostředí pro exkluzivní hudební tvůrčí zážitky.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs">
      <body className={`font-sans ${dmSans.variable} ${merriweather.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
