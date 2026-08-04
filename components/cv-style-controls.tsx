"use client"

import { Image, Palette, RotateCcw, Type } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import styles from "@/app/cv/cv-page.module.css"

type Control = {
  label: string
  max: number
  min: number
  step: number
  suffix: string
  variable: string
}

type StyleValue = boolean | number | string
type StyleState = Record<string, StyleValue>
type StylePatch = Record<string, StyleValue>
type DesignOption = {
  label: string
  value: string
  style: StylePatch
}

const STORAGE_KEY = "jindra-cv-style-v1"

const defaultStyle: StyleState = {
  fontFamily: "Aptos, Segoe UI, Helvetica Neue, Arial, sans-serif",
  nameSize: 37.6,
  nameWeight: 650,
  headlineSize: 15.7,
  headlineWeight: 600,
  sectionSize: 15.7,
  sectionWeight: 700,
  itemTitleSize: 16.8,
  itemTitleWeight: 650,
  gridTitleSize: 15.4,
  gridTitleWeight: 650,
  bodySize: 15,
  bodyWeight: 400,
  metaSize: 15.3,
  metaWeight: 500,
  lineWidth: 1,
  sectionGap: 17,
  projectsOffset: 0,
  pagePaddingY: 12,
  pagePaddingX: 13,
  designVariant: "classic",
  showPhoto: false,
}

const designOptions: DesignOption[] = [
  {
    label: "Executive",
    value: "executive",
    style: {
      designVariant: "executive",
      nameSize: 36,
      nameWeight: 700,
      sectionSize: 14.8,
      sectionWeight: 750,
      itemTitleSize: 16.2,
      itemTitleWeight: 700,
      bodySize: 14.6,
      metaSize: 14.7,
      lineWidth: 1,
      sectionGap: 16,
      pagePaddingY: 12,
      pagePaddingX: 13,
    },
  },
  {
    label: "Consulting",
    value: "consulting",
    style: {
      designVariant: "consulting",
      nameSize: 34,
      nameWeight: 680,
      sectionSize: 14,
      sectionWeight: 800,
      itemTitleSize: 15.8,
      itemTitleWeight: 700,
      bodySize: 14.2,
      metaSize: 14.4,
      lineWidth: 1,
      sectionGap: 14,
      pagePaddingY: 11,
      pagePaddingX: 12,
    },
  },
  {
    label: "Board",
    value: "board",
    style: {
      designVariant: "board",
      nameSize: 34.5,
      nameWeight: 720,
      sectionSize: 14.4,
      sectionWeight: 760,
      itemTitleSize: 15.9,
      itemTitleWeight: 680,
      bodySize: 14.4,
      metaSize: 14.5,
      lineWidth: 1,
      sectionGap: 15,
      pagePaddingY: 12,
      pagePaddingX: 13,
    },
  },
  {
    label: "Green",
    value: "green",
    style: {
      designVariant: "green",
      nameSize: 35.5,
      nameWeight: 720,
      sectionSize: 14.6,
      sectionWeight: 780,
      itemTitleSize: 16,
      itemTitleWeight: 690,
      bodySize: 14.4,
      metaSize: 14.5,
      lineWidth: 1.5,
      sectionGap: 15,
      pagePaddingY: 12,
      pagePaddingX: 13,
    },
  },
  {
    label: "Moderní",
    value: "modern",
    style: {
      designVariant: "modern",
      nameSize: 37.6,
      nameWeight: 650,
      sectionSize: 15.4,
      sectionWeight: 700,
      itemTitleSize: 16.4,
      itemTitleWeight: 650,
      bodySize: 14.6,
      metaSize: 14.8,
      lineWidth: 2,
      sectionGap: 16,
      pagePaddingY: 12,
      pagePaddingX: 13,
    },
  },
  {
    label: "Klasický",
    value: "classic",
    style: {
      designVariant: "classic",
      nameSize: 37.6,
      nameWeight: 650,
      sectionSize: 15.7,
      sectionWeight: 700,
      itemTitleSize: 16.8,
      itemTitleWeight: 650,
      bodySize: 15,
      metaSize: 15.3,
      lineWidth: 1,
      sectionGap: 17,
      pagePaddingY: 12,
      pagePaddingX: 13,
    },
  },
  {
    label: "ATS",
    value: "compact",
    style: {
      designVariant: "compact",
      nameSize: 33,
      nameWeight: 650,
      sectionSize: 14,
      sectionWeight: 750,
      itemTitleSize: 15.4,
      itemTitleWeight: 650,
      bodySize: 14,
      metaSize: 14.1,
      lineWidth: 1,
      sectionGap: 12,
      pagePaddingY: 10,
      pagePaddingX: 11.5,
    },
  },
]

const controls: Array<{ title: string; items: Control[] }> = [
  {
    title: "Horní část",
    items: [
      { label: "Jméno - velikost", variable: "nameSize", min: 30, max: 52, step: 0.5, suffix: "px" },
      { label: "Jméno - váha", variable: "nameWeight", min: 400, max: 800, step: 25, suffix: "" },
      { label: "Headline - velikost", variable: "headlineSize", min: 12, max: 22, step: 0.2, suffix: "px" },
      { label: "Headline - váha", variable: "headlineWeight", min: 400, max: 800, step: 25, suffix: "" },
    ],
  },
  {
    title: "Nadpisy",
    items: [
      { label: "Sekční nadpisy - velikost", variable: "sectionSize", min: 12, max: 22, step: 0.2, suffix: "px" },
      { label: "Sekční nadpisy - váha", variable: "sectionWeight", min: 400, max: 800, step: 25, suffix: "" },
      { label: "Role / projekty - velikost", variable: "itemTitleSize", min: 13, max: 22, step: 0.2, suffix: "px" },
      { label: "Role / projekty - váha", variable: "itemTitleWeight", min: 400, max: 800, step: 25, suffix: "" },
      { label: "Kompetence - velikost", variable: "gridTitleSize", min: 12, max: 20, step: 0.2, suffix: "px" },
      { label: "Kompetence - váha", variable: "gridTitleWeight", min: 400, max: 800, step: 25, suffix: "" },
    ],
  },
  {
    title: "Text a stránka",
    items: [
      { label: "Běžný text - velikost", variable: "bodySize", min: 12, max: 18, step: 0.2, suffix: "px" },
      { label: "Běžný text - váha", variable: "bodyWeight", min: 350, max: 650, step: 25, suffix: "" },
      { label: "Meta text - velikost", variable: "metaSize", min: 12, max: 18, step: 0.2, suffix: "px" },
      { label: "Meta text - váha", variable: "metaWeight", min: 350, max: 700, step: 25, suffix: "" },
      { label: "Linky - síla", variable: "lineWidth", min: 0, max: 4, step: 0.5, suffix: "px" },
      { label: "Mezery mezi sekcemi", variable: "sectionGap", min: 10, max: 36, step: 1, suffix: "px" },
      { label: "Projekty - odsazení od A4 předělu", variable: "projectsOffset", min: 0, max: 35, step: 0.5, suffix: "mm" },
      { label: "A4 okraj nahoře/dole", variable: "pagePaddingY", min: 8, max: 24, step: 0.5, suffix: "mm" },
      { label: "A4 okraj vlevo/vpravo", variable: "pagePaddingX", min: 8, max: 24, step: 0.5, suffix: "mm" },
    ],
  },
]

const fontOptions = [
  { label: "Aptos / Segoe UI", value: "Aptos, Segoe UI, Helvetica Neue, Arial, sans-serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Helvetica Neue", value: "Helvetica Neue, Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, Times New Roman, serif" },
  { label: "Times New Roman", value: "Times New Roman, Times, serif" },
]

function formatValue(value: StyleValue, suffix: string) {
  if (typeof value === "string") return value
  if (typeof value === "boolean") return value ? "ano" : "ne"
  return `${Number.isInteger(value) ? value : value.toFixed(1)}${suffix}`
}

export function CvStyleControls({ sheetId }: { sheetId: string }) {
  const [hydrated, setHydrated] = useState(false)
  const [styleState, setStyleState] = useState<StyleState>(defaultStyle)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      setHydrated(true)
      return
    }

    try {
      const parsed = JSON.parse(saved) as StyleState
      setStyleState({ ...defaultStyle, ...parsed })
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    const sheet = document.getElementById(sheetId)
    if (!sheet) return

    sheet.style.setProperty("--cv-font-family", String(styleState.fontFamily))
    sheet.style.setProperty("--cv-name-size", `${styleState.nameSize}px`)
    sheet.style.setProperty("--cv-name-weight", String(styleState.nameWeight))
    sheet.style.setProperty("--cv-headline-size", `${styleState.headlineSize}px`)
    sheet.style.setProperty("--cv-headline-weight", String(styleState.headlineWeight))
    sheet.style.setProperty("--cv-section-title-size", `${styleState.sectionSize}px`)
    sheet.style.setProperty("--cv-section-title-weight", String(styleState.sectionWeight))
    sheet.style.setProperty("--cv-item-title-size", `${styleState.itemTitleSize}px`)
    sheet.style.setProperty("--cv-item-title-weight", String(styleState.itemTitleWeight))
    sheet.style.setProperty("--cv-grid-title-size", `${styleState.gridTitleSize}px`)
    sheet.style.setProperty("--cv-grid-title-weight", String(styleState.gridTitleWeight))
    sheet.style.setProperty("--cv-body-size", `${styleState.bodySize}px`)
    sheet.style.setProperty("--cv-body-weight", String(styleState.bodyWeight))
    sheet.style.setProperty("--cv-meta-size", `${styleState.metaSize}px`)
    sheet.style.setProperty("--cv-meta-weight", String(styleState.metaWeight))
    sheet.style.setProperty("--cv-line-width", `${styleState.lineWidth}px`)
    sheet.style.setProperty("--cv-section-gap", `${styleState.sectionGap}px`)
    sheet.style.setProperty("--cv-projects-offset", `${styleState.projectsOffset}mm`)
    sheet.style.setProperty("--cv-page-padding-y", `${styleState.pagePaddingY}mm`)
    sheet.style.setProperty("--cv-page-padding-x", `${styleState.pagePaddingX}mm`)
    sheet.dataset.cvDesign = String(styleState.designVariant)
    sheet.dataset.cvPhoto = styleState.showPhoto ? "on" : "off"
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(styleState))
  }, [hydrated, sheetId, styleState])

  const allControls = useMemo(() => controls.flatMap((group) => group.items), [])

  function updateValue(variable: string, value: StyleValue) {
    setStyleState((current) => ({ ...current, [variable]: value }))
  }

  function applyDesign(style: StylePatch) {
    setStyleState((current) => ({ ...current, ...style }))
  }

  function reset() {
    setStyleState(defaultStyle)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  function restoreOriginalDesign() {
    setStyleState((current) => ({
      ...current,
      designVariant: "classic",
      showPhoto: false,
    }))
  }

  return (
    <aside className={styles.stylePanel} aria-label="Úprava vzhledu CV">
      <div className={styles.stylePanelHeader}>
        <div>
          <p>Editor vzhledu</p>
          <h2>A4 + typografie</h2>
        </div>
        <button type="button" onClick={reset} aria-label="Vrátit výchozí styl">
          <RotateCcw aria-hidden="true" size={15} />
        </button>
      </div>

      <label className={styles.fontSelect}>
        <span>
          <Type aria-hidden="true" size={14} />
          Font dokumentu
        </span>
        <select value={String(styleState.fontFamily)} onChange={(event) => updateValue("fontFamily", event.target.value)}>
          {fontOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <section className={styles.designPicker} aria-label="Varianty designu CV">
        <h3>
          <Palette aria-hidden="true" size={14} />
          Design
        </h3>
        <div className={styles.designButtonRow}>
          {designOptions.map((option) => (
            <button
              className={styleState.designVariant === option.value ? styles.designButtonActive : styles.designButton}
              key={option.value}
              type="button"
              onClick={() => applyDesign(option.style)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <button
          className={styleState.showPhoto ? styles.photoToggleActive : styles.photoToggle}
          type="button"
          onClick={() => updateValue("showPhoto", !styleState.showPhoto)}
        >
          <Image aria-hidden="true" size={14} />
          {styleState.showPhoto ? "Foto zapnuto" : "Foto vypnuto"}
        </button>
        <button className={styles.restoreDesignButton} type="button" onClick={restoreOriginalDesign}>
          Původní design
        </button>
      </section>

      {controls.map((group) => (
        <section className={styles.controlGroup} key={group.title}>
          <h3>{group.title}</h3>
          {group.items.map((control) => (
            <label className={styles.sliderControl} key={control.variable}>
              <span>
                <b>{control.label}</b>
                <em>{formatValue(styleState[control.variable], control.suffix)}</em>
              </span>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={Number(styleState[control.variable])}
                onChange={(event) => updateValue(control.variable, Number(event.target.value))}
                onInput={(event) => updateValue(control.variable, Number(event.currentTarget.value))}
              />
              <input
                aria-label={`${control.label} přesná hodnota`}
                type="number"
                min={control.min}
                max={control.max}
                step={control.step}
                value={Number(styleState[control.variable])}
                onChange={(event) => updateValue(control.variable, Number(event.target.value))}
              />
            </label>
          ))}
        </section>
      ))}

      <p className={styles.styleHint}>
        Nastavení se ukládá jen v tomto prohlížeči. Pro PDF použij export až po doladění vzhledu.
      </p>

      <span className={styles.visuallyHidden}>{allControls.length} nastavitelných parametrů vzhledu CV.</span>
    </aside>
  )
}
