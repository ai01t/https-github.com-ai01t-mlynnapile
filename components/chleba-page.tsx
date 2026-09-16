"use client"

import { useEffect, useState } from "react"
import { Cormorant_Garamond, Manrope } from "next/font/google"
import Link from "next/link"
import BreadTimeline from "@/components/bread-timeline"
import styles from "@/components/chleba-page.module.css"
import { CHLEBA_DEFAULT_COPY as copy } from "@/components/chleba-copy"
import { buildMediaFilter, buildOverlayGradients } from "@/lib/page-bg"
import { useLiveBgConfig } from "@/lib/use-live-bg"
import {
  ChlebaContent,
  PREVIEW_EVENT,
  defaultMedia,
  emptyContent,
  mediaFilter,
  normalizeContent,
} from "@/lib/chleba-content"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
})

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

type Locale = "cs" | "en" | "de"

export default function ChlebaPage({ locale }: { locale: Locale }) {
  const live = useLiveBgConfig("chleba")
  const bg = live && (live.image || live.video) ? live : null

  // Úpravy z /chleba/admin. Načítají se po vykreslení, aby stránka zůstala
  // staticky servírovaná a rychlá; bez uloženého obsahu se nic nemění.
  const [content, setContent] = useState<ChlebaContent>(emptyContent)

  useEffect(() => {
    let alive = true
    fetch("/api/chleba-content", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (alive && data) setContent(normalizeContent(data))
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  // Živý náhled v administraci: editor posílá rozpracovaný obsah rámečku.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== window.parent) return
      const data = event.data as { type?: string; content?: unknown } | null
      if (data?.type !== PREVIEW_EVENT) return
      setContent(normalizeContent(data.content))
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  const overrides = content.locales[locale] ?? {}
  const t = { ...copy[locale], ...overrides }
  const media = content.media ?? defaultMedia
  const photoFilter = mediaFilter(media)
  const shadeStyle = { ["--shade-k" as string]: (media.shade ?? 100) / 100 }

  const overlay = bg ? buildOverlayGradients(bg) : ""

  return (
    <main className={`${styles.page} ${manrope.className}`}>
      {bg?.video ? (
        <video
          className={styles.backgroundImage}
          autoPlay
          muted
          loop
          playsInline
          style={{ filter: buildMediaFilter(bg) }}
        >
          <source src={bg.video} />
        </video>
      ) : (
        <img
          className={styles.backgroundImage}
          src={bg?.image || media.image || "/images/chleba-hero.jpeg"}
          alt=""
          aria-hidden="true"
          style={bg ? { filter: buildMediaFilter(bg) } : photoFilter ? { filter: photoFilter } : undefined}
        />
      )}
      <div
        className={styles.shade}
        style={overlay ? { background: "none", backgroundImage: overlay, ...shadeStyle } : shadeStyle}
      />

      <header className={styles.header}>
        <Link href={t.homePath} className={`${styles.brand} ${cormorant.className}`} aria-label="Mlýn na Pile">
          Mlýn <span>na Pile</span>
        </Link>
        <nav className={styles.nav} aria-label="Chleba">
          <Link href={t.homePath}>{t.back}</Link>
          <Link href={t.contactPath}>{t.contact}</Link>
        </nav>
      </header>

      <section className={styles.content}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h1 className={cormorant.className}>
          {t.titleTop}
          <em>{t.titleAccent}</em>
        </h1>
        <p className={styles.lead}>{t.lead}</p>

        {t.paragraphs.length || t.purityTitle || t.purityText ? (
          <section className={styles.storyGrid} aria-label={t.title}>
            {t.paragraphs.length ? (
              <div className={styles.textPanel}>
                {t.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            {t.purityTitle || t.purityText ? (
              <aside className={styles.purityNote}>
                {t.purityTitle ? <p className={styles.noteKicker}>{t.purityTitle}</p> : null}
                {t.purityText ? <p>{t.purityText}</p> : null}
              </aside>
            ) : null}
          </section>
        ) : null}

        <section className={styles.infoGrid} aria-label={t.craftTitle}>
          <article className={styles.infoCard}>
            <p className={styles.cardEyebrow}>{t.craftTitle}</p>
            <h2 className={cormorant.className}>{t.benefitsTitle}</h2>
            <p className={styles.infoText}>{t.benefitsText}</p>
          </article>

          {t.ingredientsTitle || t.ingredientsText ? (
            <article className={styles.infoCard}>
              <p className={styles.cardEyebrow}>{t.ingredientsTitle}</p>
              <h2 className={cormorant.className}>{t.ingredientsTitle}</h2>
              <p className={styles.infoText}>{t.ingredientsText}</p>
            </article>
          ) : null}
        </section>

        <section className={styles.processBlock} aria-label={t.processTitle}>
          {t.processEyebrow ? <p className={styles.cardEyebrow}>{t.processEyebrow}</p> : null}
          <h2 className={cormorant.className}>{t.processTitle}</h2>
          {t.processLead ? <p className={styles.processLead}>{t.processLead}</p> : null}
          <div className={styles.processFrame}>
            <BreadTimeline locale={locale} />
          </div>
        </section>

        <section className={styles.detailsBlock} aria-label={t.detailsTitle}>
          {t.detailsTitle ? <h2 className={cormorant.className}>{t.detailsTitle}</h2> : null}
          <div className={styles.detailsList}>
            {t.details.map((detail) => (
              <details className={styles.detailItem} key={detail.title}>
                <summary>
                  <h3>{detail.title}</h3>
                  <span className={styles.detailMark} aria-hidden="true" />
                </summary>
                <div className={styles.detailBody}>
                  {detail.body.split("\n\n").map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}

                  {detail.sub ? (
                    <details className={styles.detailSub}>
                      <summary>
                        <span>{detail.sub.title}</span>
                        <span className={styles.detailMark} aria-hidden="true" />
                      </summary>
                      <ul>
                        {detail.sub.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                      {detail.sub.closing ? <p>{detail.sub.closing}</p> : null}
                    </details>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
