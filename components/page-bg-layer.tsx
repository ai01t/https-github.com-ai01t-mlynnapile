"use client"

import { useEffect, useState } from "react"
import {
  BgConfig,
  buildBlurMask,
  buildMediaFilter,
  buildOverlayGradients,
  loadBgConfig,
} from "@/lib/page-bg"

/** Typografie textu z redakčního editoru — shodná s náhledem v /admin. */
export const RENDERED_TEXT_CSS = `
.mlyn-content{color:#f0ebe2;font-family:'Manrope',system-ui,sans-serif;font-weight:300;line-height:1.7;}
.mlyn-content h1{font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:clamp(2.2rem,5vw,4rem);line-height:1.04;letter-spacing:-.01em;margin:0 0 16px;white-space:nowrap;}
.mlyn-content h2{font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:clamp(1.6rem,3vw,2.4rem);line-height:1.1;margin:28px 0 10px;}
.mlyn-content h3{font-size:.6rem;letter-spacing:.26em;text-transform:uppercase;color:#8a8177;font-weight:600;margin:24px 0 8px;}
.mlyn-content p{margin:0 0 12px;color:rgba(240,235,226,.72);max-width:62ch;}
.mlyn-content a{color:#b08d57;}
.mlyn-content ul{margin:0 0 12px 18px;color:rgba(240,235,226,.72);}
@media(max-width:640px){.mlyn-content h1{white-space:normal;}}

/* Nadpis stránky: nezalamuje se; zalomí se teprve, když by se nevešel na displej. */
.mlyn-title{
  font-family:'Cormorant Garamond',Georgia,serif;
  font-weight:300;
  font-size:clamp(1.6rem,5.4vw,3.4rem);
  line-height:1.04;
  letter-spacing:-.01em;
  margin:0;
  white-space:nowrap;
  max-width:100%;
}
@media(max-width:420px){.mlyn-title{white-space:normal;font-size:clamp(1.8rem,9vw,2.4rem);}}
`

/** Nastaví meta description z AI popisu uloženého v /admin. */
export function useAdminSeo(pageId: string) {
  useEffect(() => {
    const cfg = loadBgConfig(pageId)
    const text = (cfg.seoText || "").trim()
    if (!text) return
    const desc = text.length > 300 ? `${text.slice(0, 297)}…` : text
    let tag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if (!tag) {
      tag = document.createElement("meta")
      tag.name = "description"
      document.head.appendChild(tag)
    }
    const previous = tag.content
    tag.content = desc
    return () => {
      if (tag) tag.content = previous
    }
  }, [pageId])
}

/**
 * Volitelná vrstva pozadí řízená z /admin.
 * Když v adminu není nastavená žádná fotka/video, nevykreslí pozadí
 * (stránka zůstane přesně taková, jaká byla). Sedí fixně za obsahem.
 */
export default function PageBgLayer({ pageId }: { pageId: string }) {
  const [cfg, setCfg] = useState<BgConfig | null>(null)
  useAdminSeo(pageId)

  useEffect(() => {
    const loaded = loadBgConfig(pageId)
    setCfg(loaded.image || loaded.video ? loaded : null)
  }, [pageId])

  if (!cfg) return null

  const overlay = buildOverlayGradients(cfg)
  const mask = buildBlurMask(cfg)

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "#07060a" }}>
      {cfg.video ? (
        <video
          key={cfg.video}
          autoPlay
          muted
          loop
          playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: buildMediaFilter(cfg) }}
        >
          <source src={cfg.video} />
        </video>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("${cfg.image}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: buildMediaFilter(cfg),
          }}
        />
      )}
      {cfg.blur > 0 && mask && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: `blur(${cfg.blur}px)`,
            WebkitBackdropFilter: `blur(${cfg.blur}px)`,
            WebkitMaskImage: mask,
            maskImage: mask,
          }}
        />
      )}
      {overlay && <div style={{ position: "absolute", inset: 0, backgroundImage: overlay }} />}
    </div>
  )
}
