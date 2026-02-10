import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Poppins } from "next/font/google"

// Initialize fonts
const _poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ANTEATER - Female-Fronted Rock Band | Prague | Alternative Rock",
  description:
    "Anteater - Award-winning female-fronted rock/post-grunge band from Prague (est. 2018). Winners of Strahov Open Air 2019 & 27th Múza. Spotify & Apple Music available.",
  keywords: [
    "rock band Prague",
    "female-fronted rock",
    "post-grunge band",
    "alternative rock",
    "Anteater band",
    "Czech rock",
    "Andrea Kohoutová",
    "rock concerts",
    "Strahov Open Air",
    "Múza 2019",
    "female rock singers",
    "grunge rock",
    "metal rock",
    "Guano Apes",
    "Paramore",
    "Jinjer",
    "rock band booking",
  ],
  generator: "v0.app",

  openGraph: {
    type: "website",
    title: "ANTEATER - Female-Fronted Rock Band from Prague",
    description: "Award-winning rock band with stunning live performances. Available on Spotify, Apple Music, YouTube.",
    url: "https://www.anteaterofficial.com",
    siteName: "ANTEATER Official",
    images: [
      {
        url: "/images/anteater-promo-2025.jpg",
        width: 1200,
        height: 630,
        alt: "ANTEATER Band - Prague Rock Band",
      },
    ],
    locale: "en_US",
    alternateLocale: ["cs_CZ", "de_DE"],
  },

  twitter: {
    card: "summary_large_image",
    title: "ANTEATER - Award-Winning Rock Band",
    description: "Female-fronted rock band. Winners of Strahov Open Air 2019.",
    images: ["/images/anteater-promo-2025.jpg"],
    creator: "@anteatercz1659",
  },

  alternates: {
    languages: {
      "en-US": "/en",
      "cs-CZ": "/cs",
      "de-DE": "/de",
    },
    canonical: "https://www.anteaterofficial.com",
  },

  authors: [
    {
      name: "Anteater",
      url: "https://www.anteaterofficial.com",
    },
  ],

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },

  verification: {
    google: "anteater-google-verification",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicGroup",
        "@id": "https://www.anteaterofficial.com/#musicgroup",
        name: "Anteater",
        url: "https://www.anteaterofficial.com",
        description:
          "Female-fronted rock/post-grunge band from Prague. Winners of Strahov Open Air Band Contest 2019 and 27th Múza 2019.",
        image: "/images/anteater-promo-2025.jpg",
        sameAs: [
          "https://www.spotify.com/artist/0ZNouScAQI1pQCLbWWJr3g",
          "https://music.apple.com/us/artist/anteater/1482398618",
          "https://www.youtube.com/channel/anteatercz1659",
          "https://www.instagram.com/anteaterofficial/",
          "https://www.facebook.com/anteaterofficial",
          "https://www.bandsintown.com/a/15580598",
        ],
        member: [
          {
            "@type": "Person",
            name: "Andrea Kohoutová",
            description: "Vocals, Bass Guitar, Guitar",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://www.anteaterofficial.com",
            },
          },
          {
            "@type": "Person",
            name: "Jindřich Traxmandl",
            description: "Guitar, Bass, Drums",
          },
          {
            "@type": "Person",
            name: "Jan Oršek",
            description: "Drums, Percussion",
          },
        ],
        foundingDate: "2018",
        foundingLocation: {
          "@type": "Place",
          name: "Prague",
          address: {
            "@type": "PostalAddress",
            addressCountry: "CZ",
          },
        },
        genre: ["Rock", "Post-grunge", "Alternative Rock", "Stoner", "Metal"],
        award: [
          {
            "@type": "Award",
            name: "Strahov Open Air Band Contest Winner",
            awardDate: "2019",
          },
          {
            "@type": "Award",
            name: "27th Múza Winner",
            awardDate: "2019",
          },
          {
            "@type": "Award",
            name: "Planetrox CZ/SK Finalist",
            awardDate: "2019",
          },
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Booking",
          name: "Jindřich Traxmandl",
          telephone: "+420-724-050-093",
          url: "https://www.anteaterofficial.com",
        },
      },
      {
        "@type": "MusicRecording",
        name: "Fuel",
        byArtist: {
          "@type": "MusicGroup",
          name: "Anteater",
        },
        url: "https://www.youtube.com/watch?v=UkekVsnQuaM",
        datePublished: "2024",
        producer: [
          { "@type": "Person", name: "Damián Kučera" },
          { "@type": "Person", name: "Jindřich Traxmandl" },
          { "@type": "Person", name: "Andrea Kohoutová" },
          { "@type": "Person", name: "Jan Oršek" },
        ],
      },
      {
        "@type": "MusicAlbum",
        name: "Other Words",
        byArtist: {
          "@type": "MusicGroup",
          name: "Anteater",
        },
        url: "https://open.spotify.com/album/3ostNQqH1tMCeShj622dMg",
        producer: { "@type": "Person", name: "Thom Fröde" },
        datePublished: "2024",
      },
      {
        "@type": "Event",
        name: "Anteater Concert Tour 2025",
        description: "Rock band live performances across Czech Republic, Germany, and Europe",
        performer: {
          "@type": "MusicGroup",
          name: "Anteater",
        },
        eventStatus: "EventScheduled",
        url: "https://www.bandsintown.com/a/15580598",
      },
    ],
  }

  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {/* Preconnect to CDNs for performance */}
        <link rel="preconnect" href="https://widgetv3.bandsintown.com" />
        <link rel="preconnect" href="https://open.spotify.com" />
        <link rel="preconnect" href="https://music.apple.com" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
