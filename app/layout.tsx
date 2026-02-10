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
  title: "Mlýn na Pile - Retreat Studio | Recording Studio & Accommodation Czech Republic",
  description:
    "Historický mlýn ze 17. století v srdci Evropy – unikátní prostředí pro exkluzivní hudební tvůrčí zážitky. Professional recording studio with vintage instruments, accommodation, and stunning nature near Domažlice.",
  keywords: [
    "recording studio",
    "nahrávací studio",
    "Domažlice",
    "Czech Republic",
    "vintage instruments",
    "studio accommodation",
    "music production",
    "retreat studio",
    "Universal Audio",
    "vintage gear",
    "Fender",
    "Gibson",
    "VOX",
    "historic mill",
    "kreativní prostor",
  ],
  authors: [{ name: "Jindřich Traxmandl & Andrea Kohoutová" }],
  creator: "Mlýn na Pile",
  publisher: "Mlýn na Pile",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    alternateLocale: ["en_US", "de_DE"],
    url: "https://mlynnapile.cz",
    siteName: "Mlýn na Pile - Retreat Studio",
    title: "Mlýn na Pile - Retreat Studio | Professional Recording Studio",
    description:
      "Historic 17th century mill transformed into a unique recording studio. Vintage instruments, professional equipment, and stylish accommodation in beautiful Czech countryside.",
    images: [
      {
        url: "/images/aerial-view.jpeg",
        width: 1200,
        height: 630,
        alt: "Mlýn na Pile - Aerial view of historic mill studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mlýn na Pile - Retreat Studio | Professional Recording Studio",
    description: "Historic 17th century mill recording studio with vintage gear, accommodation, and stunning nature.",
    images: ["/images/aerial-view.jpeg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://mlynnapile.cz",
    languages: {
      cs: "https://mlynnapile.cz",
      en: "https://mlynnapile.cz/en",
      de: "https://mlynnapile.cz/de",
    },
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicVenue",
              "@id": "https://mlynnapile.cz",
              name: "Mlýn na Pile - Retreat Studio",
              alternateName: "Mlýn na Pile Recording Studio",
              description:
                "Professional recording studio in historic 17th century mill with vintage instruments, accommodation, and beautiful Czech countryside location.",
              url: "https://mlynnapile.cz",
              telephone: "+420775050059",
              email: "mlynnapile@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Trhanov - Pile",
                addressLocality: "Domažlice",
                postalCode: "34401",
                addressCountry: "CZ",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "49.4394",
                longitude: "12.9742",
              },
              image: [
                "https://mlynnapile.cz/images/aerial-view.jpeg",
                "https://mlynnapile.cz/images/twilight-lake.jpeg",
              ],
              priceRange: "€€€",
              amenityFeature: [
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Recording Studio",
                  value: true,
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Accommodation",
                  value: true,
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Vintage Instruments",
                  value: true,
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Free WiFi",
                  value: true,
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Parking",
                  value: true,
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "EV Charging",
                  value: true,
                },
              ],
              hasMap: "https://maps.app.goo.gl/uXBpBkPwM15MJQQU7",
              sameAs: [
                "https://www.instagram.com/mlynnapile",
                "https://www.facebook.com/share/1CWTAs8zoP",
                "https://www.youtube.com/@mlynnapile",
              ],
            }),
          }}
        />
      </head>
      <body className={`font-sans ${dmSans.variable} ${merriweather.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
