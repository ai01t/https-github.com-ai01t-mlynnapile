"use client"

import { useEffect, useRef, useState } from "react"

// Časová osa pečení z projektu BREAD.SK — vložená jako samostatná stránka
// v public/chleba-postup.html, aby fungovala i v produkci (ne z localhost).
// Osa si sama hlásí svou výšku přes postMessage, takže v rámečku nikdy
// nevznikne posuvník.
const TIMELINE_SRC = "/chleba-postup.html"

export default function BreadProcessTimeline() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [height, setHeight] = useState(720)

  useEffect(() => {
    // Font i barvu textu čteme z obalu na stránce (ne z body — to má vlastní
    // globální barvu), aby osa splynula s okolním textem.
    const host = wrapRef.current ? getComputedStyle(wrapRef.current) : null
    const params = new URLSearchParams({
      embed: "1",
      // svislý seznam: na rozdíl od vodorovné osy ukazuje i názvy jednotlivých
      // úkonů, ne jen časy — a sám si hlásí výšku, takže nikde nechybí obsah
      layout: "v",
      outline: "1",
      brand: "0",
      theme: "dark",
    })
    if (host?.fontFamily) params.set("font", host.fontFamily)
    if (host?.color) params.set("ink", host.color)
    setSrc(`${TIMELINE_SRC}?${params.toString()}`)
  }, [])

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
          title="Jak pečeme chleba"
          scrolling="no"
          style={{ width: "100%", height, border: 0, background: "transparent", display: "block" }}
        />
      ) : null}
    </div>
  )
}
