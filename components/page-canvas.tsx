"use client"

import { useEffect, useState } from "react"
import {
  BgConfig,
  buildBlurMask,
  buildMediaFilter,
  buildOverlayGradients,
  defaultBgConfig,
} from "@/lib/page-bg"
import { useLiveBgConfig } from "@/lib/use-live-bg"
import { RENDERED_TEXT_CSS, useAdminSeo } from "@/components/page-bg-layer"

/**
 * Vykreslí pozadí (foto/video + zatmavení + rozostření) a volitelný text
 * podle nastavení uloženého v /admin pro danou stránku.
 */
export default function PageCanvas({
  pageId,
  children,
  minHeight = "100svh",
}: {
  pageId: string
  children?: React.ReactNode
  minHeight?: string
}) {
  const [cfg, setCfg] = useState<BgConfig>(defaultBgConfig)
  const [ready, setReady] = useState(false)
  useAdminSeo(pageId)

  const live = useLiveBgConfig(pageId)
  useEffect(() => {
    if (!live) return
    setCfg(live)
    setReady(true)
  }, [live])

  const overlay = buildOverlayGradients(cfg)
  const mask = buildBlurMask(cfg)

  return (
    <div style={{ position: "relative", minHeight, background: "#07060a", overflow: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: RENDERED_TEXT_CSS }} />
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
      ) : cfg.image ? (
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
      ) : null}

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

      {overlay && <div style={{ position: "absolute", inset: 0, backgroundImage: overlay, pointerEvents: "none" }} />}

      <div style={{ position: "relative", zIndex: 2 }}>
        {ready && cfg.text && (
          <div
            className="mlyn-content"
            style={{ maxWidth: "min(860px,100%)", margin: "0 auto", padding: "clamp(56px,10vh,120px) 24px 32px" }}
            dangerouslySetInnerHTML={{ __html: cfg.text }}
          />
        )}
        {children}
      </div>
    </div>
  )
}
