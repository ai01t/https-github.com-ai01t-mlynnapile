"use client"

import { useEffect, useRef, useState } from "react"

// Časová osa pečení z projektu BREAD.SK — vložená jako samostatná stránka
// v public/chleba-postup.html, aby fungovala i v produkci (ne z localhost).
// Osa je interaktivní: kliknutím na čas se otevře výběr a ostatní kroky
// se dopočítají. O svou výšku si sama řekne přes postMessage.
const TIMELINE_SRC = "/chleba-postup.html"

// Zlatá ze sekce /chleba, aby akcenty osy seděly s okolním textem.
const PAGE_GOLD = "#c29b61"

export default function BreadProcessTimeline() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [height, setHeight] = useState(460)

  useEffect(() => {
    // Písmo i barvu textu čteme z obalu na stránce (ne z body — to má vlastní
    // globální barvu), aby osa splynula s okolním textem.
    const host = wrapRef.current ? getComputedStyle(wrapRef.current) : null
    const params = new URLSearchParams({
      embed: "1",
      layout: "auto",
      // vyprávěcí podoba osy — drží se textu stránky líp než technická mřížka
      style: "story",
      // obloha jen v náznaku; souhvězdí a planety by osu přebily
      sky: "hint",
      brand: "1",
      logo: "1",
      gold: PAGE_GOLD,
    })
    if (host?.fontFamily) params.set("font", host.fontFamily)
    if (host?.color) params.set("ink", host.color)
    setSrc(`${TIMELINE_SRC}?${params.toString()}`)
  }, [])

  // Rámeček nemá posuvníky — o potřebnou výšku si osa řekne sama.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== frameRef.current?.contentWindow) return
      const next = Number((event.data as { breadskHeight?: number } | null)?.breadskHeight)
      if (Number.isFinite(next) && next > 0) setHeight(Math.min(2400, Math.ceil(next)))
    }

    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return (
    <div ref={wrapRef}>
      {src ? (
        <iframe
          ref={frameRef}
          src={src}
          title="Jak pečeme chleba — BREAD.SK"
          loading="lazy"
          scrolling="no"
          style={{ width: "100%", height, border: 0, background: "transparent", display: "block" }}
        />
      ) : null}
    </div>
  )
}
