"use client"

import { useEffect, useRef, useState } from "react"

// Časová osa pečení z projektu BREAD.SK — vložená jako samostatná stránka
// v public/chleba-postup.html, aby fungovala i v produkci (ne z localhost).
// Vodorovná varianta je interaktivní: kliknutím na čas se otevře kruhový
// výběr a všechny ostatní kroky se přepočítají.
const TIMELINE_SRC = "/chleba-postup.html"

export default function BreadProcessTimeline() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [height, setHeight] = useState(460)

  useEffect(() => {
    // Font i barvu textu čteme z obalu na stránce (ne z body — to má vlastní
    // globální barvu), aby osa splynula s okolním textem.
    const host = wrapRef.current ? getComputedStyle(wrapRef.current) : null
    const params = new URLSearchParams({
      embed: "1",
      // vodorovná osa: kroky vedle sebe na časové přímce, interaktivní
      layout: "h",
      outline: "1",
      // "Powered by BREAD.SK" s prokliken na zdrojovou aplikaci
      brand: "1",
      theme: "dark",
    })
    if (host?.fontFamily) params.set("font", host.fontFamily)
    if (host?.color) params.set("ink", host.color)
    setSrc(`${TIMELINE_SRC}?${params.toString()}`)
  }, [])

  // Ve vodorovném režimu osa vyplní zadanou výšku a hlásí zpět tutéž
  // hodnotu, takže si ji řídíme sami podle šířky — na užším displeji
  // potřebuje víc místa, aby se popisky kroků nepřekrývaly.
  useEffect(() => {
    const fit = () => {
      const width = wrapRef.current?.clientWidth ?? window.innerWidth
      if (width < 640) return setHeight(560)
      if (width < 980) return setHeight(500)
      setHeight(460)
    }

    fit()
    window.addEventListener("resize", fit)
    return () => window.removeEventListener("resize", fit)
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
