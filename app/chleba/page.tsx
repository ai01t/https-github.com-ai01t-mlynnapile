"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ChlebaPage() {
  const router = useRouter()
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1920)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isHorizontal = windowWidth >= 768
  const videoId = isHorizontal ? "NYqybmh85G4" : "ZkYxd37_Atk"
  const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&vq=highres&quality=highres&playsinline=1`

  const backgroundVideoStyle = isHorizontal
    ? {
        width: "177.77vh",
        height: "100vh",
        minWidth: "100vw",
        minHeight: "56.25vw",
        position: "absolute" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }
    : {
        width: "100vw",
        height: "177.77vw",
        minWidth: "56.25vh",
        minHeight: "100vh",
        position: "absolute" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <iframe
          title="Chleba background"
          src={videoUrl}
          className="absolute"
          style={backgroundVideoStyle}
          frameBorder="0"
          allow="autoplay; fullscreen"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="fixed top-0 left-0 right-0 z-50 p-6 bg-transparent">
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center space-x-3 md:space-x-6 text-white/90 px-3 md:px-6 py-3 rounded-lg text-[10px] md:text-xs">
              <button onClick={() => router.push("/?section=mlyn")} className="hover:text-white transition-colors">
                Mlýn
              </button>
              <button onClick={() => router.push("/?section=studio")} className="hover:text-white transition-colors">
                Studio
              </button>
              <button onClick={() => router.push("/?section=equipment")} className="hover:text-white transition-colors">
                Vybavení
              </button>
              <button onClick={() => router.push("/?section=lokalita")} className="hover:text-white transition-colors">
                Lokalita
              </button>
              <button onClick={() => router.push("/?section=about")} className="hover:text-white transition-colors">
                O nás
              </button>
              <button onClick={() => router.push("/?section=contact")} className="hover:text-white transition-colors">
                Kontakt
              </button>
            </div>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center px-6 pt-28 pb-16">
          <div className="max-w-3xl mx-auto text-center bg-black/20 backdrop-blur-sm rounded-xl px-6 py-6 md:px-8 md:py-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Chleba ze mlýna</h1>
            <p className="text-white/90 text-base md:text-lg leading-relaxed">
              Součástí každého pobytu i nahrávání je snídaně nebo brunch. Pečeme k nim vlastní kváskový chléb,
              vždy čerstvý, ve velké venkovní peci. Je to stejné místo, kde se večer může roztopit oheň na pizzu –
              klidně pět najednou. Bonus a součást místa, které funguje trochu jinak než běžná studia. ;-)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
