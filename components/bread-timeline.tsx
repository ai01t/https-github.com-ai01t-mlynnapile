"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type Locale = "cs" | "en" | "de"

// Kroky a mezery mezi nimi pocházejí z postupu na BREAD.SK; tady je držíme
// nativně, aby osa mohla vypadat jako zbytek stránky a fungovala i na mobilu.
// gapAfter = minuty do dalšího kroku.
type Step = { id: string; gapAfter: number }

const STEPS: Step[] = [
  { id: "kvas", gapAfter: 540 },
  { id: "autolyza", gapAfter: 60 },
  { id: "fermentolyza", gapAfter: 20 },
  { id: "sul", gapAfter: 40 },
  { id: "preklad1", gapAfter: 45 },
  { id: "preklad2", gapAfter: 45 },
  { id: "preklad3", gapAfter: 45 },
  { id: "preklad4", gapAfter: 270 },
  { id: "stoceni", gapAfter: 20 },
  { id: "osatka", gapAfter: 30 },
  { id: "lednice", gapAfter: 800 },
  { id: "predehrati", gapAfter: 40 },
  { id: "peceni", gapAfter: 181 },
  { id: "predani", gapAfter: 0 },
]

// Barevná škála od syrového těsta po vypečenou kůrku — osa se během
// pečení doslova zapéká.
const DOUGH = [
  "#ead9b5", "#e6d0a1", "#e2c78d", "#ddbb76", "#d7ae5f", "#d0a049", "#c79038",
  "#bc7f2b", "#ae6d21", "#9e5c1a", "#8d4c15", "#7b3e11", "#6a330e", "#552a0d",
]

const COPY: Record<Locale, {
  startLabel: string
  totalLabel: string
  hint: string
  prev: string
  next: string
  day: (n: number) => string
  duration: (m: number) => string
  names: Record<string, string>
  story: Record<string, string>
}> = {
  cs: {
    startLabel: "Začínáme v",
    totalLabel: "Celkem",
    hint: "Klepněte na zastávku nebo posuňte osu",
    prev: "Předchozí krok",
    next: "Další krok",
    day: (n) => `${n}. den`,
    duration: (m) =>
      m >= 60
        ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}`
        : `${m} min`,
    names: {
      kvas: "Příprava kvasu",
      autolyza: "Autolýza",
      fermentolyza: "Fermentolýza",
      sul: "Sůl a kmín",
      preklad1: "První překlad",
      preklad2: "Druhý překlad",
      preklad3: "Třetí překlad",
      preklad4: "Čtvrtý překlad",
      stoceni: "Stočení do ošatky",
      osatka: "Kynutí v ošatce",
      lednice: "Do lednice",
      predehrati: "Předehřátí trouby",
      peceni: "Pečení",
      predani: "Předání",
    },
    story: {
      kvas: "Kvásek se rozkrmí moukou a vodou a nechá se rozjet. Pár minut práce — a pak devět hodin, kdy pracuje sám.",
      autolyza: "Mouka se smíchá jen s vodou a odpočívá. Lepek se propojí bez hnětení a těsto se samo připraví na kvásek.",
      fermentolyza: "Do odpočaté mouky přijde kvásek. Odsud začíná těsto opravdu žít.",
      sul: "Sůl a kmín se vmíchají až teď — dřív by kvásku brzdily rozjezd.",
      preklad1: "Těsto se místo hnětení jemně přeloží. Nabere sílu, ale neztratí vzduch, který v něm mezitím vznikl.",
      preklad2: "Druhý překlad, zhruba po tři čtvrtě hodině. Těsto je pokaždé pružnější než předtím.",
      preklad3: "Třetí překlad. Mezi nimi se nedělá nic — jen se čeká, až kvásek odvede svoje.",
      preklad4: "Poslední překlad. Těsto už drží tvar a je cítit, že je hotové.",
      stoceni: "Bochník se stočí do napětí a uloží do ošatky. Tady se rozhoduje, jestli bude držet tvar.",
      osatka: "Krátké kynutí v ošatce, než přijde chlad.",
      lednice: "Čtrnáct hodin v lednici. Chlad kvašení zpomalí a chuť se za tu dobu prohloubí — tohle se uspěchat nedá.",
      predehrati: "Trouba se rozpaluje naprázdno, bochník zatím čeká v chladu. Do rozpálené pece jde rovnou ze studena.",
      peceni: "Pečení pod poklicí a pak dopečení dokřupava. Kůrka vznikne až v posledních minutách.",
      predani: "Chleba musí vychladnout, jinak se uvnitř mázne. Teprve dvě hodiny po pečení je opravdu hotový.",
    },
  },
  en: {
    startLabel: "Starting at",
    totalLabel: "In total",
    hint: "Tap a stop or drag the timeline",
    prev: "Previous step",
    next: "Next step",
    day: (n) => `Day ${n}`,
    duration: (m) =>
      m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`,
    names: {
      kvas: "Feeding the starter",
      autolyza: "Autolyse",
      fermentolyza: "Fermentolyse",
      sul: "Salt and caraway",
      preklad1: "First fold",
      preklad2: "Second fold",
      preklad3: "Third fold",
      preklad4: "Fourth fold",
      stoceni: "Shaping into the banneton",
      osatka: "Proofing in the banneton",
      lednice: "Into the fridge",
      predehrati: "Preheating the oven",
      peceni: "Baking",
      predani: "Handover",
    },
    story: {
      kvas: "The starter is fed flour and water and left to wake up. A few minutes of work — then nine hours while it works alone.",
      autolyza: "Flour is mixed with water only, and rests. The gluten links up without kneading and the dough prepares itself for the starter.",
      fermentolyza: "The starter goes into the rested flour. From here the dough really comes alive.",
      sul: "Salt and caraway go in only now — any earlier and they would slow the starter down.",
      preklad1: "Instead of kneading, the dough is gently folded. It gains strength without losing the air built up inside.",
      preklad2: "The second fold, about forty-five minutes later. The dough is springier every time.",
      preklad3: "The third fold. In between nothing happens — you simply wait for the starter to do its work.",
      preklad4: "The last fold. The dough holds its shape now and you can feel it is ready.",
      stoceni: "The loaf is shaped under tension and placed in the banneton. This is where it is decided whether it will hold.",
      osatka: "A short proof in the banneton before the cold comes.",
      lednice: "Fourteen hours in the fridge. Cold slows fermentation and the flavour deepens — this cannot be rushed.",
      predehrati: "The oven heats up empty while the loaf waits in the cold. It goes into the hot oven straight from the fridge.",
      peceni: "Baked under a lid, then finished uncovered until crisp. The crust only forms in the final minutes.",
      predani: "Bread has to cool down, otherwise it turns gummy inside. Only two hours after baking is it truly done.",
    },
  },
  de: {
    startLabel: "Beginn um",
    totalLabel: "Insgesamt",
    hint: "Auf eine Station tippen oder die Achse ziehen",
    prev: "Vorheriger Schritt",
    next: "Nächster Schritt",
    day: (n) => `Tag ${n}`,
    duration: (m) =>
      m >= 60 ? `${Math.floor(m / 60)} Std.${m % 60 ? ` ${m % 60} Min.` : ""}` : `${m} Min.`,
    names: {
      kvas: "Sauerteig auffrischen",
      autolyza: "Autolyse",
      fermentolyza: "Fermentolyse",
      sul: "Salz und Kümmel",
      preklad1: "Erstes Falten",
      preklad2: "Zweites Falten",
      preklad3: "Drittes Falten",
      preklad4: "Viertes Falten",
      stoceni: "Formen im Gärkorb",
      osatka: "Gare im Gärkorb",
      lednice: "In den Kühlschrank",
      predehrati: "Ofen vorheizen",
      peceni: "Backen",
      predani: "Übergabe",
    },
    story: {
      kvas: "Der Sauerteig wird mit Mehl und Wasser aufgefrischt. Ein paar Minuten Arbeit — und dann neun Stunden, in denen er allein arbeitet.",
      autolyza: "Mehl wird nur mit Wasser vermischt und ruht. Der Kleber verbindet sich ohne Kneten, der Teig bereitet sich selbst vor.",
      fermentolyza: "In das geruhte Mehl kommt der Sauerteig. Ab hier lebt der Teig wirklich.",
      sul: "Salz und Kümmel kommen erst jetzt dazu — früher würden sie den Sauerteig ausbremsen.",
      preklad1: "Statt zu kneten wird der Teig sanft gefaltet. Er gewinnt an Kraft, ohne die Luft zu verlieren.",
      preklad2: "Das zweite Falten, nach etwa einer Dreiviertelstunde. Der Teig ist jedes Mal elastischer.",
      preklad3: "Das dritte Falten. Dazwischen passiert nichts — man wartet, bis der Sauerteig seine Arbeit tut.",
      preklad4: "Das letzte Falten. Der Teig hält jetzt seine Form, man spürt, dass er fertig ist.",
      stoceni: "Der Laib wird unter Spannung geformt und in den Gärkorb gelegt. Hier entscheidet sich, ob er die Form hält.",
      osatka: "Eine kurze Gare im Gärkorb, bevor die Kälte kommt.",
      lednice: "Vierzehn Stunden im Kühlschrank. Kälte bremst die Gärung, der Geschmack wird tiefer — das lässt sich nicht beschleunigen.",
      predehrati: "Der Ofen heizt leer auf, der Laib wartet in der Kälte. Er kommt direkt aus dem Kühlschrank in den heißen Ofen.",
      peceni: "Backen unter dem Deckel, dann offen knusprig fertig backen. Die Kruste entsteht erst in den letzten Minuten.",
      predani: "Brot muss auskühlen, sonst wird es innen klitschig. Erst zwei Stunden nach dem Backen ist es wirklich fertig.",
    },
  },
}

const START_CHOICES = [17, 19, 21, 23]

export default function BreadTimeline({ locale = "cs" as Locale }: { locale?: Locale }) {
  const t = COPY[locale] ?? COPY.cs
  const [startHour, setStartHour] = useState(23)
  const [active, setActive] = useState(0)
  const railRef = useRef<HTMLDivElement | null>(null)

  // Absolutní minuty od začátku pro každou zastávku.
  const offsets = useMemo(() => {
    const out: number[] = []
    let acc = 0
    STEPS.forEach((s, i) => {
      out.push(acc)
      acc += STEPS[i].gapAfter
    })
    return out
  }, [])

  const total = offsets[offsets.length - 1]

  const clock = (minutesFromStart: number) => {
    const abs = startHour * 60 + minutesFromStart
    const day = Math.floor(abs / 1440) + 1
    const h = Math.floor((abs % 1440) / 60)
    const m = abs % 60
    return { day, label: `${h}:${String(m).padStart(2, "0")}` }
  }

  // Aktivní zastávka musí zůstat v záběru i na úzké obrazovce.
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const dot = rail.querySelector<HTMLElement>(`[data-stop="${active}"]`)
    if (!dot) return
    const target = dot.offsetLeft + dot.offsetWidth / 2 - rail.clientWidth / 2
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth)
    const left = Math.max(0, Math.min(target, max))
    if (Math.abs(rail.scrollLeft - left) < 2) return
    rail.scrollTo({ left, behavior: "smooth" })
  }, [active])

  const step = STEPS[active]
  const at = clock(offsets[active])
  // Čára i body sedí na stejné mřížce: zastávka i má střed v ((i+0.5)/n).
  const half = 50 / STEPS.length
  const progress = (active / STEPS.length) * 100

  return (
    <div className="bt">
      <div className="bt-top">
        <div className="bt-start">
          <span className="bt-start-label">{t.startLabel}</span>
          {START_CHOICES.map((h) => (
            <button
              key={h}
              type="button"
              className={h === startHour ? "bt-hour on" : "bt-hour"}
              aria-pressed={h === startHour}
              onClick={() => setStartHour(h)}
            >
              {h}:00
            </button>
          ))}
        </div>
        <span className="bt-total">
          {t.totalLabel} {t.duration(total)}
        </span>
      </div>

      <div className="bt-railwrap">
      <div className="bt-rail" ref={railRef}>
        <div className="bt-stops">
          <div className="bt-line" style={{ left: `${half}%`, right: `${half}%` }} />
          <div
            className="bt-line bt-line-done"
            style={{ left: `${half}%`, width: `${progress}%` }}
          />
          {STEPS.map((s, i) => {
            const c = clock(offsets[i])
            const done = i <= active
            return (
              <button
                key={s.id}
                type="button"
                data-stop={i}
                className={i === active ? "bt-stop on" : done ? "bt-stop done" : "bt-stop"}
                aria-pressed={i === active}
                aria-label={`${c.label} — ${t.names[s.id]}`}
                onClick={() => setActive(i)}
              >
                <span className="bt-time">{c.label}</span>
                <span
                  className="bt-dot"
                  style={{ ["--tone" as string]: DOUGH[Math.min(i, DOUGH.length - 1)] }}
                />
                <span className="bt-name">{t.names[s.id]}</span>
              </button>
            )
          })}
        </div>
      </div>
      </div>

      <div className="bt-card" aria-live="polite">
        <p className="bt-meta">
          <span>{t.day(at.day)}</span>
          <span className="bt-meta-dot">·</span>
          <span>{at.label}</span>
          {step.gapAfter ? (
            <>
              <span className="bt-meta-dot">·</span>
              <span className="bt-gap">{t.duration(step.gapAfter)}</span>
            </>
          ) : null}
        </p>
        <h3 className="bt-name-big">{t.names[step.id]}</h3>
        <p className="bt-story">{t.story[step.id]}</p>

        <div className="bt-nav">
          <button
            type="button"
            className="bt-arrow"
            aria-label={t.prev}
            disabled={active === 0}
            onClick={() => setActive((i) => Math.max(0, i - 1))}
          >
            ‹
          </button>
          <span className="bt-count">
            {active + 1} / {STEPS.length}
          </span>
          <button
            type="button"
            className="bt-arrow"
            aria-label={t.next}
            disabled={active === STEPS.length - 1}
            onClick={() => setActive((i) => Math.min(STEPS.length - 1, i + 1))}
          >
            ›
          </button>
        </div>
      </div>

      <p className="bt-foot">
        <span className="bt-hint">{t.hint}</span>
        <a href="https://bread.sk" target="_blank" rel="noopener noreferrer">
          Powered by BREAD.SK
        </a>
      </p>

      <style jsx>{`
        .bt {
          --gold: #c29b61;
          --cream: #fff9ee;
          --pale: #c9b99a;
          --hair: rgba(238, 224, 196, 0.16);
          position: relative;
          isolation: isolate;
          color: #f3eee4;
        }

        /* Osa leží nad fotkou bochníku — bez ztmavení by se text ztrácel. */
        .bt::before {
          content: "";
          position: absolute;
          inset: -22px clamp(-24px, -3vw, -10px);
          z-index: -1;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(8, 7, 6, 0.62) 0%,
            rgba(8, 7, 6, 0.86) 38%,
            rgba(8, 7, 6, 0.9) 100%
          );
        }

        .bt-top {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 10px 18px;
          margin-bottom: 22px;
          /* rámeček sekce vybledá na okrajích — text musí zůstat uvnitř */
          padding-right: clamp(18px, 4vw, 56px);
        }
        .bt-total {
          white-space: nowrap;
        }
        .bt-start {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
        }
        .bt-start-label,
        .bt-total {
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(238, 224, 196, 0.5);
        }
        .bt-hour {
          appearance: none;
          border: 1px solid var(--hair);
          background: transparent;
          color: rgba(243, 238, 228, 0.72);
          font: inherit;
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          padding: 7px 11px;
          min-height: 34px;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .bt-hour:hover {
          color: var(--cream);
          border-color: rgba(238, 224, 196, 0.32);
        }
        .bt-hour.on {
          color: #1a1206;
          background: var(--gold);
          border-color: var(--gold);
        }

        /* Osa: vodorovný pás, na mobilu se posouvá spolu s aktivní zastávkou. */
        .bt-rail {
          position: relative;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          padding: 4px 0 2px;
        }
        /* Okraje se ztrácejí, aby bylo poznat, že osa pokračuje. Řešíme to
           překryvy, ne maskou — maska nad posouvaným obsahem se na některých
           prohlížečích nepřekresluje. */
        .bt-railwrap {
          position: relative;
        }
        .bt-railwrap::before,
        .bt-railwrap::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 28px;
          pointer-events: none;
          z-index: 2;
        }
        .bt-railwrap::before {
          left: 0;
          background: linear-gradient(90deg, rgba(8, 7, 6, 0.92), rgba(8, 7, 6, 0));
        }
        .bt-railwrap::after {
          right: 0;
          background: linear-gradient(270deg, rgba(8, 7, 6, 0.92), rgba(8, 7, 6, 0));
        }
        .bt-rail::-webkit-scrollbar {
          display: none;
        }
        .bt-line {
          position: absolute;
          top: 34px;
          height: 1px;
          background: var(--hair);
        }
        .bt-line-done {
          right: auto;
          background: linear-gradient(90deg, ${DOUGH[0]}, ${DOUGH[DOUGH.length - 1]});
          opacity: 0.9;
          transition: width 0.45s cubic-bezier(0.22, 0.86, 0.24, 1);
        }
        .bt-stops {
          position: relative;
          display: flex;
          gap: 0;
          /* stopa musí být tak široká jako zastávky, jinak by čára i procenta
             počítaly s viditelnou částí místo s celou osou */
          min-width: max-content;
        }
        .bt-stop {
          appearance: none;
          border: 0;
          background: none;
          cursor: pointer;
          flex: 1 0 92px;
          display: grid;
          justify-items: center;
          gap: 8px;
          padding: 0 4px 6px;
          font: inherit;
          color: inherit;
        }
        .bt-time {
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          color: rgba(238, 224, 196, 0.45);
          transition: color 0.2s;
          height: 22px;
          display: flex;
          align-items: center;
        }
        .bt-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: rgba(238, 224, 196, 0.22);
          box-shadow: 0 0 0 4px rgba(8, 7, 6, 0.9);
          transition: transform 0.25s, background 0.25s;
        }
        .bt-stop.done .bt-dot {
          background: var(--tone);
        }
        .bt-stop.on .bt-dot {
          background: var(--tone);
          transform: scale(1.7);
        }
        .bt-name {
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(238, 224, 196, 0.32);
          text-align: center;
          line-height: 1.35;
          max-width: 92px;
          transition: color 0.2s;
        }
        .bt-stop:hover .bt-time,
        .bt-stop.on .bt-time {
          color: var(--gold);
        }
        .bt-stop:hover .bt-name,
        .bt-stop.on .bt-name {
          color: rgba(238, 224, 196, 0.78);
        }

        .bt-card {
          margin-top: 26px;
          padding-right: clamp(18px, 4vw, 56px);
          border-top: 1px solid var(--hair);
          padding-top: 22px;
          display: grid;
          gap: 10px;
          max-width: 680px;
        }
        .bt-meta {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(238, 224, 196, 0.5);
          margin: 0;
        }
        .bt-meta-dot {
          opacity: 0.4;
        }
        .bt-gap {
          color: var(--gold);
        }
        .bt-name-big {
          margin: 0;
          font-family: var(--font-cormorant, "Cormorant Garamond", serif);
          font-weight: 300;
          font-size: clamp(1.6rem, 4.6vw, 2.3rem);
          line-height: 1.1;
          color: var(--cream);
        }
        .bt-story {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.8;
          color: rgba(243, 238, 228, 0.62);
        }

        .bt-nav {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 6px;
        }
        .bt-arrow {
          appearance: none;
          width: 42px;
          height: 42px;
          border: 1px solid var(--hair);
          border-radius: 50%;
          background: transparent;
          color: rgba(243, 238, 228, 0.8);
          font-size: 1.25rem;
          line-height: 1;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s, opacity 0.2s;
        }
        .bt-arrow:hover:not(:disabled) {
          color: var(--gold);
          border-color: rgba(194, 155, 97, 0.5);
        }
        .bt-arrow:disabled {
          opacity: 0.28;
          cursor: default;
        }
        .bt-count {
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          color: rgba(238, 224, 196, 0.42);
        }

        .bt-foot {
          padding-right: clamp(18px, 4vw, 56px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 22px 0 0;
          font-size: 0.56rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .bt-hint {
          color: rgba(238, 224, 196, 0.3);
        }
        .bt-foot a {
          color: rgba(238, 224, 196, 0.42);
          text-decoration: none;
          border-bottom: 1px solid rgba(238, 224, 196, 0.16);
          transition: color 0.2s;
        }
        .bt-foot a:hover {
          color: var(--gold);
        }

        @media (max-width: 720px) {
          .bt-start {
            width: 100%;
            gap: 6px;
          }
          .bt-start-label {
            flex-basis: 100%;
            margin-bottom: 2px;
          }
          .bt-hour {
            flex: 1 1 0;
            padding: 7px 4px;
            text-align: center;
          }
          .bt-stop {
            flex: 0 0 84px;
          }
          .bt-story {
            font-size: 0.8rem;
            line-height: 1.68;
          }
          .bt-hint {
            display: none;
          }
          .bt-foot {
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  )
}
