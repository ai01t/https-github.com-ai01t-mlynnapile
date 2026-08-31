"use client"

import { useEffect, useState } from "react"

import { BgConfig, PREVIEW_MESSAGE, PreviewMessage, isPreviewFrame, loadBgConfig } from "@/lib/page-bg"

/**
 * Nastavení pozadí pro stránku: normálně z uloženého nastavení, a když stránka
 * běží v náhledu administrace, přebírá živě to, co se právě nastavuje.
 */
export function useLiveBgConfig(pageId: string) {
  const [cfg, setCfg] = useState<BgConfig | null>(null)

  useEffect(() => {
    setCfg(loadBgConfig(pageId))
  }, [pageId])

  useEffect(() => {
    if (!isPreviewFrame()) return

    function onMessage(event: MessageEvent) {
      if (event.source !== window.parent) return
      const data = event.data as PreviewMessage | null
      if (data?.type !== PREVIEW_MESSAGE || data.pageId !== pageId) return
      setCfg(data.cfg)
    }

    window.addEventListener("message", onMessage)
    // ozveme se administraci, že náhled je připravený přijímat nastavení
    window.parent.postMessage({ type: PREVIEW_MESSAGE, ready: true, pageId }, window.location.origin)
    return () => window.removeEventListener("message", onMessage)
  }, [pageId])

  return cfg
}
