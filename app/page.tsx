"use client"

import { useEffect, useState } from "react"
import ShowsSectionComponent from "./ShowsSection"

export default function Home() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://widgetv3.bandsintown.com/main.min.js"
    script.async = true
    script.charset = "utf-8"
    document.body.appendChild(script)

    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/bandsintown")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Bandsintown data received:", data)

        setEvents(data)
      } catch (error) {
        console.error("[v0] Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const headerOpacity = Math.min(scrollY / 200, 0.7)

  const seoContent = `
ANTEATER - Female-Fronted Rock Band from Prague, Czech Republic

BAND OVERVIEW:
Anteater is an award-winning female-fronted rock, post-grunge, and alternative rock band established in 2018 in Prague, Czech Republic. 
The band is known for stunning live performances, professional studio-grade equipment, and exceptional musicianship.

MEMBERS:
- Andrea Kohoutová: Lead vocals, bass guitar, guitar (frontwoman) - Degree in Archaeology (Charles University Prague), former lead in rock opera "Kladivo na Pýchu"
- Jindřich Traxmandl: Guitar, bass, drums - Engineer, tech enthusiast, analog equipment specialist
- Jan Oršek: Drums, percussion - Professional session and live drummer

GENRE & STYLE:
Rock, Post-grunge, Alternative Rock, Stoner Rock, Modern Rock, Female-Fronted Rock, Metal-influenced

COMPARABLE ARTISTS: Guano Apes, Paramore, Jinjer, Nirvana, Guns N' Roses, Twenty One Pilots

AWARDS & ACHIEVEMENTS:
- 2019: Winner of Strahov Open Air Band Contest Prague
- 2019: Winner of 27th Múza Competition
- 2019: Finalist of Planetrox CZ/SK Worldwide Music Competition
- Finalist selected by international jury for Rock for People Festival
- 2022-2023: Successful UK Tours
- 2023: European Tour
- 2024: Released single "Fuel"
- 2025: New EP in progress

EQUIPMENT & GEAR (Professional Studio Grade):
Guitar: Fender Custom Shop 1967, Fender Custom Shop Jeff Beck, Fender Kurt Cobain Jaguar, Fender Squier Vintage Jaguar
Bass: Fender Precision Bass 1995 MIJ, Ampeg V-4B Bass Amp Head
Effects: Strymon Timeline, Digitech Whammy V, Strymon Flint V2, TC Electronic PolyTune 3, Boss ODB-3, KHDK Abyss
Cables: Mogami Platinum Pro
Wireless: Shure GLXD16+ Guitar Pedal System
Studio: Universal Audio Apollo X8P, Logic Pro X
Drums: Mapex Saturn, Zildjian K Cymbals, Remo Heads, Vic Firth 5B, Tama Iron Cobra

MUSIC & RECORDINGS:
FUEL (2024) - Music by Jindřich Traxmandl, Andrea Kohoutová, Jan Oršek. Lyrics by Andrea Kohoutová. Produced by Damián Kučera.
Video: https://www.youtube.com/watch?v=UkekVsnQuaM

I Can Save You (2024) - Produced by Thom Fröde
EP "Other Words" (2024) - Producer: Thom Fröde, Golden HIVE Studios

STREAMING PLATFORMS:
Spotify: https://open.spotify.com/artist/0ZNouScAQI1pQCLbWWJr3g
Apple Music: https://music.apple.com/us/artist/anteater/1482398618
YouTube: https://www.youtube.com/@anteatercz1659
Bandsintown: https://www.bandsintown.com/a/15580598

SOCIAL MEDIA & ONLINE PRESENCE:
Instagram: https://www.instagram.com/anteaterofficial/
Facebook: https://www.facebook.com/anteaterofficial
TikTok: https://www.tiktok.com/@anteaterband
YouTube Channel: https://www.youtube.com/@anteatercz1659

BOOKING & CONTACT:
Booking Manager: Jindřich Traxmandl
Phone: +420 724 050 093
Website: https://www.anteaterofficial.com
Email: anteaterofficial@gmail.com

LIVE PERFORMANCES:
The band has performed over 50 concerts in the past 2 years across Czech Republic, Germany, UK, and Europe.
Notable venues: Rock Café Prague, United Islands Festival, various German festivals
Professional sound engineering feedback: Consistently positive reviews from audio engineers and festival promoters
Repeat invitations to festivals indicate high audience satisfaction and professional live show quality

TOUR SCHEDULE 2025:
March 27 - Pilsen, CZ (with Imodium)
April 28 - Brno, CZ (Free Night Festival)
May 9 - Cham, Germany (FROM ZERO Festival)
May 17 - Klatovy, CZ (with Harlej, Jaksi Taksi, Snikers)

LANGUAGES: English, Czech, German, Slovak

PRODUCTION CREDITS:
Producer Damián Kučera: Top 20 in "Nail The Mix" competition (top 20 out of 500 producers worldwide)
Thom Fröde: Frontman of Imodium and Walkmanz, experienced rock producer

ENDORSEMENTS: Independent (declined major label endorsement to maintain artistic independence)

UNIQUE CHARACTERISTICS:
- Only 3-member flexible lineup (highly adaptable to venues and event requirements)
- 100% concert attendance record (never cancelled a show)
- Professional tube amplifiers and analog setup (no digital simulations)
- Highly organized and responsive team
- Multiple language capability (English, Czech, German, Slovak)
- Strong presence in both online and offline festival circuits
  `

  return (
    <div className="relative min-h-screen">
      <div className="sr-only">
        <h2>ANTEATER Band Information</h2>
        <p>{seoContent}</p>
      </div>

      <div
        className="fixed inset-0 -z-10 bg-no-repeat"
        style={{
          backgroundImage: "url('/images/anteater-promo-2025.jpg')",
          backgroundPosition: "center top",
          backgroundSize: "cover",
        }}
      />

      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-center gap-6">
          <a
            href="https://www.instagram.com/anteaterofficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-60 transition-opacity duration-300"
            style={{ opacity: 1 - headerOpacity }}
            aria-label="Instagram"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.949 0-3.205.013-3.583.072-4.948.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.073 4.948.073 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/anteaterofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-60 transition-opacity duration-300"
            style={{ opacity: 1 - headerOpacity }}
            aria-label="Facebook"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href="https://www.youtube.com/watch?v=UkekVsnQuaM&list=RDUkekVsnQuaM&start_radio=1"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-60 transition-opacity duration-300"
            style={{ opacity: 1 - headerOpacity }}
            aria-label="YouTube"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a
            href="https://open.spotify.com/artist/0ZNouScAQI1pQCLbWWJr3g"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-60 transition-opacity duration-300"
            style={{ opacity: 1 - headerOpacity }}
            aria-label="Spotify"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3 0.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </a>
          <a
            href="https://music.apple.com/us/artist/anteater/1482398618"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-60 transition-opacity duration-300"
            style={{ opacity: 1 - headerOpacity }}
            aria-label="Apple Music"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408a10.61 10.61 0 0 0-.1 1.18c0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 0 0 1.57-.1c.822-.106 1.596-.35 2.296-.81a5.046 5.046 0 0 0 1.88-2.207c.186-.42.293-.87.37-1.324.113-.666.148-1.337.161-2.01.003-.1.005-.2.005-.3l.002-12.27zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76 1.035-1.36 1.329a2.945 2.945 0 0 1-1.291.296c-1.541 0-2.79-1.25-2.79-2.79 0-1.541 1.249-2.791 2.79-2.791.35 0 .685.07 1.002.184v-5.54l-5.965 1.891v5.579c0 .42-.062.835-.252 1.22-.292.585-.762 1.026-1.36 1.318-.4.195-.823.29-1.26.29-1.541 0-2.79-1.25-2.79-2.79 0-1.541 1.249-2.791 2.79-2.791.35 0 .686.07 1.003.184v-6.16c0-.528.27-.996.719-1.184L17.032 7.38c.448-.188.963-.025 1.215.366.099.155.156.332.156.515 0 .053-.004.106-.013.158-.013.076-.013.076-.013.127z" />
            </svg>
          </a>
        </div>
      </header>

      <main className="relative pt-20 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section - ANTEATER Title */}
          <div className="text-center mb-32">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-black mb-2 px-4">ANTEATER</h1>
            <p className="text-sm text-black">Rock Band from Czech Republic</p>
          </div>

          {/* Central Timeline Container */}
          <div className="relative">
            {/* Right Branch - About */}
            <div className="mb-32 md:ml-auto md:mr-0 md:w-1/2 md:pr-12 w-full">
              <div className="relative">
                <div className="md:pl-8 pb-8">
                  <h2 className="text-4xl font-bold text-black mb-6 uppercase tracking-wide text-center md:text-left">
                    About
                  </h2>
                  <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 text-base text-black text-center md:text-left">
                    <p className="mb-3">Est. 2018, Prague</p>
                    <p className="mb-3">7 years active, extensive live experience</p>
                    <p className="mb-3">Performed in Germany and England</p>
                    <p className="mb-3">1st place at Múza 2019 and Strahov Show Band Contest 2019</p>
                    <p className="mb-3">
                      Single{" "}
                      <a
                        href="https://www.youtube.com/watch?v=UkekVsnQuaM"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold hover:opacity-60 transition no-underline"
                      >
                        "FUEL"
                      </a>{" "}
                      reached #1 on Rock Zone Radio charts (Czech Republic)
                    </p>
                    <p>UK Tours 2022-2023</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Branch - Members */}
            <div className="mb-32 md:mr-auto md:ml-0 md:w-1/2 md:pl-12 w-full">
              <div className="relative">
                <div className="md:pr-8 pb-8">
                  <h2 className="text-4xl font-bold text-black mb-6 uppercase tracking-wide text-center md:text-left">
                    Members
                  </h2>
                  <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 text-base text-black text-center md:text-left">
                    <p className="font-semibold">Andrea Kohoutová</p>
                    <p className="mb-3 text-sm">Vocal, bass</p>
                    <p className="font-semibold">Jindřich Traxmandl</p>
                    <p className="mb-3 text-sm">Guitar, backing vocal</p>
                    <p className="font-semibold">Jan Oríšek</p>
                    <p className="text-sm">Drums</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Branch - Upcoming Shows */}
            <ShowsSectionComponent events={events} loading={loading} />

            {/* Left Branch - Booking */}
            <div className="mb-32 md:mr-auto md:ml-0 md:w-1/2 md:pl-12 w-full">
              <div className="relative">
                <div className="md:pr-8 pb-8">
                  <h2 className="text-4xl font-bold text-black mb-6 uppercase tracking-wide text-center md:text-left">
                    Booking
                  </h2>
                  <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 text-base text-black text-center md:text-left">
                    <div className="mb-6">
                      <p className="font-semibold mb-2">EN, CZ</p>
                      <p className="mb-1">Jindřich Traxmandl</p>
                      <p className="mb-1">
                        <a href="tel:+420724050093" className="hover:opacity-60 transition">
                          +420 724 050 093
                        </a>
                      </p>
                      <p>
                        <a href="mailto:anteaterofficial@gmail.com" className="hover:opacity-60 transition">
                          anteaterofficial@gmail.com
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">DE</p>
                      <p className="mb-1">Mario Gerlach</p>
                      <p className="mb-1">
                        <a href="tel:+4917663867368" className="hover:opacity-60 transition">
                          +49 176 63867368
                        </a>
                      </p>
                      <p>
                        <a href="mailto:anteater.booking@gmail.com" className="hover:opacity-60 transition">
                          anteater.booking@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Branch - Press Resources */}
            <div className="mb-32 md:ml-auto md:mr-0 md:w-1/2 md:pr-12 w-full">
              <div className="relative">
                <div className="md:pl-8 pb-8">
                  <h2 className="text-4xl font-bold text-black mb-6 uppercase tracking-wide text-center md:text-left">
                    For Organizers / Press
                  </h2>
                  <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 text-base text-black text-center md:text-left">
                    <div className="mb-6">
                      <p className="font-semibold mb-3">Band Logo</p>
                      <div className="flex flex-col gap-2">
                        <a
                          href="https://drive.google.com/file/d/17Koho3E9iWZgWqnOjJOqKPhe7odQucBm/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-60 transition inline-flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                          </svg>
                          Logo Black
                        </a>
                        <a
                          href="https://drive.google.com/file/d/1xbISe-mYYKdclu5Zrv3ic4YDvTPG-QbN/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-60 transition inline-flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                          </svg>
                          Logo White
                        </a>
                      </div>
                    </div>
                    <div className="mb-6">
                      <p className="font-semibold mb-3">Presskit</p>
                      <div className="flex flex-col gap-2">
                        <a
                          href="https://drive.google.com/file/d/1t2WFEKAA3i38W1Y6OpiisS8gAMo0nGkf/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-60 transition"
                        >
                          EN Presskit
                        </a>
                        <a
                          href="https://drive.google.com/file/d/1jNZq5cPr9vHFzQnstiDz-j2i6H56n4Lw/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-60 transition"
                        >
                          DE Presskit
                        </a>
                        <a
                          href="https://drive.google.com/file/d/1CaND8lVARtp9_tVoUFmmXjczPv3aAC0q/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-60 transition"
                        >
                          CZ Presskit
                        </a>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold mb-3">Stage Plan</p>
                      <a
                        href="https://drive.google.com/file/d/13AKrl4Nn6mruu-mJULVZ0an9cUEGmrDE/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-60 transition inline-flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                        </svg>
                        Download Stage Plan
                      </a>
                    </div>
                    <div className="mt-6">
                      <p className="font-semibold mb-3">Setlist</p>
                      <a
                        href="/files/anteater-setlist.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-60 transition inline-flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                        </svg>
                        Download Setlist
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Branch - Contact */}
            <div className="md:ml-0 md:mr-auto md:w-1/2 md:pl-12 w-full">
              <div className="relative">
                <div className="md:pr-8 pb-8">
                  <h2 className="text-4xl font-bold text-black mb-6 uppercase tracking-wide text-center md:text-left">
                    Contact
                  </h2>
                  <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 text-base text-black text-center md:text-left">
                    <p className="mb-3">
                      Email:{" "}
                      <a href="mailto:anteaterofficial@gmail.com" className="hover:opacity-60 transition">
                        anteaterofficial@gmail.com
                      </a>
                    </p>
                    <p className="mb-3">Follow us on social media</p>
                    <div className="flex gap-4 justify-center md:justify-start">
                      <a
                        href="https://www.instagram.com/anteaterofficial/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold hover:opacity-60 transition"
                      >
                        Instagram
                      </a>
                      <a
                        href="https://www.facebook.com/anteatercz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold hover:opacity-60 transition"
                      >
                        Facebook
                      </a>
                      <a
                        href="https://twitter.com/anteatercz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold hover:opacity-60 transition"
                      >
                        X
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative text-center py-6 px-4">
        <p className="text-xs text-black/40">&copy; 2026 | Design & Development: Ing. Jindřich Traxmandl</p>
      </footer>
    </div>
  )
}
