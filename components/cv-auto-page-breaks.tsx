"use client"

import { useEffect } from "react"

import styles from "@/app/cv/cv-page.module.css"

const A4_HEIGHT_MM = 297
const PAGE_BREAK_BUFFER_MM = 7

function mmToPx(mm: number) {
  return (mm / 25.4) * 96
}

export function CvAutoPageBreaks({ sheetId }: { sheetId: string }) {
  useEffect(() => {
    const sheet = document.getElementById(sheetId)
    if (!sheet) return
    const cvSheet = sheet

    let frame = 0
    const pageHeight = mmToPx(A4_HEIGHT_MM)
    const buffer = mmToPx(PAGE_BREAK_BUFFER_MM)

    function clearBreaks() {
      cvSheet.querySelectorAll<HTMLElement>("[data-avoid-page-break]").forEach((element) => {
        element.classList.remove(styles.autoPageBreakBefore)
        element.style.removeProperty("--cv-auto-break-offset")
      })
    }

    function applyBreaks() {
      clearBreaks()

      for (let pass = 0; pass < 3; pass += 1) {
        let changed = false
        const sheetTop = cvSheet.getBoundingClientRect().top

        cvSheet.querySelectorAll<HTMLElement>("[data-avoid-page-break]").forEach((element) => {
          const rect = element.getBoundingClientRect()
          const top = rect.top - sheetTop
          const bottom = rect.bottom - sheetTop
          const startsOnPage = Math.floor(top / pageHeight)
          const endsOnPage = Math.floor((bottom - 1) / pageHeight)

          if (startsOnPage === endsOnPage || rect.height > pageHeight - buffer * 4) return

          const nextPageTop = (startsOnPage + 1) * pageHeight
          const offset = Math.max(0, nextPageTop - top + buffer)
          element.classList.add(styles.autoPageBreakBefore)
          element.style.setProperty("--cv-auto-break-offset", `${offset}px`)
          changed = true
        })

        if (!changed) break
      }
    }

    function schedule() {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(applyBreaks)
    }

    schedule()

    const resizeObserver = new ResizeObserver(schedule)
    resizeObserver.observe(cvSheet)

    window.addEventListener("resize", schedule)

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener("resize", schedule)
      clearBreaks()
    }
  }, [sheetId])

  return null
}
