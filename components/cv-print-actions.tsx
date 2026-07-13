"use client"

import { Download, Eye, PenLine, Printer } from "lucide-react"
import { useEffect, useState } from "react"

import styles from "@/app/cv/cv-page.module.css"

export function CvPrintActions() {
  const [printPreview, setPrintPreview] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("cv-print-preview", printPreview)

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setPrintPreview(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.documentElement.classList.remove("cv-print-preview")
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [printPreview])

  return (
    <div className={styles.toolbarActions}>
      <button
        className={styles.actionButton}
        type="button"
        onClick={() => setPrintPreview((current) => !current)}
        aria-label={printPreview ? "Vrátit editor CV" : "Zobrazit tiskový náhled CV"}
      >
        {printPreview ? <PenLine aria-hidden="true" size={16} /> : <Eye aria-hidden="true" size={16} />}
        {printPreview ? "Zpět k úpravám" : "Náhled tisku"}
      </button>
      <button className={styles.actionButton} type="button" onClick={() => window.print()} aria-label="Vytisknout CV">
        <Printer aria-hidden="true" size={16} />
        Tisk / PDF
      </button>
      <button className={styles.actionButtonPrimary} type="button" onClick={() => window.print()} aria-label="Exportovat CV do PDF">
        <Download aria-hidden="true" size={16} />
        Export PDF
      </button>
    </div>
  )
}
