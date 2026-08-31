"use client"

import { useState } from "react"
import Link from "next/link"
import PageBgLayer, { RENDERED_TEXT_CSS } from "@/components/page-bg-layer"

type Lang = "cs" | "en"

const T = {
  cs: {
    eyebrow: "Soukromý profil",
    aiNote:
      "Na mlýně je hodně práce, proto jsme prozatím zvolili text, který zpracovala AI a byl pouze fakticky ověřen :-)",
    short: [
      "Zpěvačka, baskytaristka a autorka textů kapely Anteater. Narodila se 12. 9. 1991 v Klatovech a vystudovala magisterský program Archeologie na Západočeské univerzitě v Plzni.",
      "Hudbě se věnuje od dětství. V letech 2017–2022 ztvárnila hlavní roli v klatovské rockové opeře Kladivo na pýchu, projektu hudebníka Miloše Bešty; předtím založila kapelu Zoey (2015–2017), kde zpívala a hrála na kytaru.",
      "Aktuálně se podílí na projektu Mlýn na Pile, kde peče kváskový chléb z kvalitních surovin. Místo nenabízí všechna lákadla velkoměsta — nedáte si tu matcha latte ani trendy topinku z Vinohrad — ale najdete tu stoprocentně domácí vajíčka, poctivý kváskový chléb a nekonečné možnosti vycházek do okolní přírody.",
    ],
    more: "Více",
    less: "Méně",
    detailTitle: "Hlas, který hledá vlastní cestu mezi rockem, historií a řemeslem",
    sections: [
      {
        h: "Hudba",
        p: [
          "Jako zpěvačka a baskytaristka stojí za českou alternativně rockovou kapelou Anteater, která vznikla v roce 2018. Kapela se pohybuje na pomezí grunge, alternativního rocku a energického moderního rocku a za dobu svého působení odehrála řadu koncertů doma i v zahraničí.",
          "Je známá výrazným hlasem, energickým pódiovým projevem a osobním přístupem ke skladbám — v recenzích koncertů bývá zmiňována jako „zpívající basačka“, která do vystoupení vkládá výraznou energii.",
          "Hudebně ji formovaly kapely jako Nirvana, Guano Apes, Dead Sara, Linkin Park nebo The Subways — tedy interpreti, u kterých se potkává syrovost, emoce a silná ženská energie.",
        ],
      },
      {
        h: "Historie a archeologie",
        p: [
          "Část své profesní cesty spojila s historií a péčí o kulturní dědictví. Působila ve Vlastivědném muzeu Dr. Hostaše v Klatovech jako dokumentátorka archiváře a kroniky města Klatov a věnovala se také popularizaci historie prostřednictvím přednášek pro veřejnost.",
          "Práce s archivem, kronikami a historickými materiály jí dala cit pro příběhy, které často zůstávají ukryté v pozadí. Možná právě díky tomu dnes dokáže vidět hodnotu i v obyčejných věcech — ve starém mlýně, v tradičním řemesle nebo v předmětech, které by jiní považovali za nepotřebné.",
        ],
      },
      {
        h: "Mlýn na Pile",
        p: [
          "Se svým partnerem buduje projekt Mlýn na Pile — místo v bývalém mlýně, které má spojovat kreativní pobyty, hudební tvorbu, nahrávání, odpočinek a návrat k tradičním řemeslům.",
          "Starý mlýn v sobě nese příběhy lidí, kteří tam pracovali před desítkami a stovkami let. Nemá z něj ale být muzeum pod sklem — má znovu žít. Aby se v něm hrála hudba, pekl chleba, potkávali lidé a vznikaly nové vzpomínky.",
        ],
      },
      {
        h: "Kváskový chléb a řemeslo",
        p: [
          "Jedním z jejích nových směrů je pekařské řemeslo. Kváskový chléb pro ni není jen potravina, ale proces, který vyžaduje čas, trpělivost a respekt k přírodě. V době, kdy je možné koupit téměř všechno okamžitě, ji přitahují věci, které se nedají uspěchat.",
          "Fascinuje ji návrat k poctivé výrobě, lokálním surovinám a věcem, které mají vlastní příběh. V budoucnu by ráda rozvíjela vlastní malou pekárenskou tvorbu a nabídla lidem nejen jídlo, ale i zážitek spojený s místem, kde vzniká.",
        ],
      },
      {
        h: "Příroda a zvířata",
        p: [
          "Je velkou milovnicí zvířat a přírody. Se svým psem Sárou a nově i hejnem slepic vytváří doma prostředí, kde se snaží respektovat přirozené potřeby zvířat a hledá cestu, jak žít ohleduplněji a vědoměji.",
          "Slepice si pořídila ne jako „produkční zvířata“, ale jako tvory s vlastní povahou — zajímá ji jejich chování, potřeby a to, jak jim vytvořit dobrý život. Ve volném čase se věnuje běhu, cyklistice, kreslení a tvorbě obsahu pro sociální sítě domovské kapely Anteater.",
        ],
      },
      {
        h: "Mozaika",
        p: [
          "Umí stát před publikem s hlasem, který zaplní klub, ale zároveň dokáže strávit dlouhé minuty pozorováním slepic na dvoře. Má za sebou akademické prostředí a práci s historickými dokumenty, stejně tak ji ale naplňuje práce rukama. Hraje tvrdou rockovou hudbu a přitom sní o peci, chlebu a klidném místě u lesa.",
          "Její cesta není typickou kariérní přímkou — spíš připomíná skládání mozaiky. Historie, rocková hudba, pečení, příroda a starý mlýn jsou na první pohled rozdílné světy, ale spojuje je stejná myšlenka: tvořit věci, které mají duši, autenticitu a přesah.",
        ],
      },
    ],
    closing:
      "Rocková zpěvačka s duší archivářky, pekařka ve vznikání a člověk, který se snaží vracet život věcem, místům i vztahům, které by jinak mohly zaniknout.",
    back: "← Zpět na Mlýn na Pile",
  },
  en: {
    eyebrow: "Private profile",
    aiNote:
      "There is a lot of work at the mill, so for now we went with a text written by AI — only the facts were verified :-)",
    short: [
      "Singer, bass player and lyricist of the band Anteater. Born 12 September 1991 in Klatovy, she holds a master's degree in Archaeology from the University of West Bohemia in Pilsen.",
      "Music has been part of her life since childhood. From 2017 to 2022 she played the lead role in the Klatovy rock opera Kladivo na pýchu, a project by musician Miloš Bešta; before that she founded the band Zoey (2015–2017), where she sang and played guitar.",
      "Today she is part of the Mlýn na Pile project, where she bakes sourdough bread from quality ingredients. The place doesn't offer big-city temptations — no matcha latte, no trendy toast — but you will find genuinely home-grown eggs, honest sourdough bread and endless walks into the surrounding countryside.",
    ],
    more: "More",
    less: "Less",
    detailTitle: "A voice finding its own path between rock, history and craft",
    sections: [
      {
        h: "Music",
        p: [
          "As singer and bass player she fronts the Czech alternative rock band Anteater, formed in 2018. The band moves between grunge, alternative rock and energetic modern rock, and has played numerous shows at home and abroad.",
          "She is known for a distinctive voice, energetic stage presence and a personal approach to songwriting — concert reviews often mention her as the “singing bass player” who brings striking energy to every show.",
          "Her musical influences include Nirvana, Guano Apes, Dead Sara, Linkin Park and The Subways — artists where rawness, emotion and strong female energy meet.",
        ],
      },
      {
        h: "History and archaeology",
        p: [
          "Part of her professional path has been connected with history and the care of cultural heritage. She worked at the Dr. Hostaš Museum in Klatovy documenting the town's archive and chronicle, and gave public lectures popularising history.",
          "Working with archives, chronicles and historical material gave her a feel for stories that usually stay hidden in the background. Perhaps that is why she can see value in ordinary things — an old mill, a traditional craft, or objects others would discard.",
        ],
      },
      {
        h: "Mlýn na Pile",
        p: [
          "Together with her partner she is building Mlýn na Pile — a place in a former mill that brings together creative stays, music, recording, rest and a return to traditional crafts.",
          "The old mill carries the stories of people who worked there decades and centuries ago. It is not meant to become a museum behind glass — it is meant to live again: music played, bread baked, people meeting and new memories made.",
        ],
      },
      {
        h: "Sourdough bread and craft",
        p: [
          "Baking is one of her newer directions. Sourdough bread isn't just food to her, but a process that demands time, patience and respect for nature. In a time when almost anything can be bought instantly, she is drawn to things that cannot be rushed.",
          "She is fascinated by honest production, local ingredients and things with a story of their own. In the future she would like to develop her own small bakery work and offer people not only food, but an experience tied to the place where it is made.",
        ],
      },
      {
        h: "Nature and animals",
        p: [
          "She is a great lover of animals and nature. With her dog Sára and, more recently, a flock of hens, she is building a home that respects the natural needs of animals and looks for a more considerate, more conscious way of living.",
          "She got the hens not as “production animals” but as creatures with their own character — she is interested in their behaviour, their needs, and how to give them a good life. In her free time she runs, cycles, draws and creates content for the social media of her band Anteater.",
        ],
      },
      {
        h: "A mosaic",
        p: [
          "She can stand in front of an audience with a voice that fills a club, and equally spend long minutes watching the hens in the yard. She has an academic background and experience with historical documents, yet working with her hands fulfils her just as much. She plays hard rock music while dreaming of an oven, bread and a quiet place by the forest.",
          "Her path is not a typical straight career line — it is more like assembling a mosaic. History, rock music, baking, nature and an old mill look like different worlds, but the same idea connects them: to create things that have a soul, authenticity and meaning beyond themselves.",
        ],
      },
    ],
    closing:
      "A rock singer with the soul of an archivist, a baker in the making, and someone who tries to give life back to things, places and relationships that might otherwise disappear.",
    back: "← Back to Mlýn na Pile",
  },
} as const

const wrap: React.CSSProperties = {
  minHeight: "100svh",
  color: "#f0ebe2",
  fontFamily: "'Manrope', system-ui, sans-serif",
  display: "flex",
  justifyContent: "center",
  padding: "clamp(64px, 12vh, 160px) 24px 80px",
  // jemný halo pod textem — čitelnost i nad světlejšími místy fotky
  textShadow: "0 1px 3px rgba(7,6,10,.6), 0 0 20px rgba(7,6,10,.5)",
}
const inner: React.CSSProperties = { width: "min(680px, 100%)", position: "relative", zIndex: 1 }
const eyebrow: React.CSSProperties = {
  fontSize: ".62rem",
  letterSpacing: ".28em",
  textTransform: "uppercase",
  color: "#8a8177",
  marginBottom: "18px",
}
const aiNote: React.CSSProperties = {
  marginTop: "20px",
  fontSize: ".8rem",
  lineHeight: 1.6,
  color: "rgba(240,235,226,.5)",
  fontStyle: "italic",
  borderLeft: "2px solid rgba(176,141,87,.4)",
  paddingLeft: "12px",
  maxWidth: "52ch",
}
const para: React.CSSProperties = {
  marginTop: "16px",
  fontSize: ".95rem",
  lineHeight: 1.7,
  color: "rgba(240,235,226,.66)",
  maxWidth: "56ch",
}
const socials: React.CSSProperties = { display: "flex", gap: "12px", marginTop: "30px", flexWrap: "wrap" }
const socialLink: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "42px",
  height: "42px",
  color: "#f0ebe2",
  textDecoration: "none",
  border: "1px solid rgba(201,185,154,.22)",
  borderRadius: "10px",
}
const moreBtn: React.CSSProperties = {
  display: "inline-block",
  marginTop: "26px",
  fontSize: ".64rem",
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: "#e2c48d",
  background: "rgba(7,6,10,.55)",
  border: "1px solid rgba(226,196,141,.45)",
  borderRadius: "6px",
  padding: "9px 18px",
  cursor: "pointer",
  fontFamily: "inherit",
}
const rule: React.CSSProperties = { border: 0, borderTop: "1px solid rgba(201,185,154,.14)", margin: "34px 0 22px" }
const detailTitle: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontWeight: 300,
  fontSize: "clamp(1.4rem,3vw,1.9rem)",
  lineHeight: 1.2,
  margin: "0 0 4px",
  maxWidth: "34ch",
}
const secHead: React.CSSProperties = {
  fontSize: ".58rem",
  letterSpacing: ".26em",
  textTransform: "uppercase",
  color: "#8a8177",
  margin: "26px 0 2px",
}
const closing: React.CSSProperties = {
  marginTop: "28px",
  paddingTop: "18px",
  borderTop: "1px solid rgba(201,185,154,.12)",
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: "1.15rem",
  lineHeight: 1.5,
  color: "rgba(240,235,226,.78)",
  fontStyle: "italic",
  maxWidth: "50ch",
}
const back: React.CSSProperties = {
  display: "block",
  width: "fit-content",
  marginTop: "46px",
  fontSize: ".62rem",
  letterSpacing: ".2em",
  textTransform: "uppercase",
  color: "#8a8177",
  textDecoration: "none",
}
const langBar: React.CSSProperties = { position: "absolute", top: "-40px", right: 0, display: "flex", gap: "8px" }
const langBtn = (active: boolean): React.CSSProperties => ({
  fontSize: ".6rem",
  letterSpacing: ".2em",
  textTransform: "uppercase",
  color: active ? "#b08d57" : "rgba(240,235,226,.5)",
  background: "none",
  border: active ? "1px solid rgba(176,141,87,.5)" : "1px solid rgba(201,185,154,.18)",
  padding: "6px 12px",
  cursor: "pointer",
  fontFamily: "inherit",
})

export default function AndreaClient() {
  const [lang, setLang] = useState<Lang>("cs")
  const [open, setOpen] = useState(false)
  const t = T[lang]

  return (
    <main style={wrap}>
      <style dangerouslySetInnerHTML={{ __html: RENDERED_TEXT_CSS }} />
      <PageBgLayer pageId="andrea" />
      <div style={inner}>
        <div style={langBar}>
          <button type="button" style={langBtn(lang === "cs")} onClick={() => setLang("cs")}>CZ</button>
          <button type="button" style={langBtn(lang === "en")} onClick={() => setLang("en")}>EN</button>
        </div>

        <p style={eyebrow}>{t.eyebrow}</p>
        <h1 className="mlyn-title">Mgr. Andrea Kohoutová</h1>

        <p style={aiNote}>{t.aiNote}</p>

        {t.short.map((p) => (
          <p key={p} style={para}>{p}</p>
        ))}

        <div style={socials}>
          <a style={socialLink} href="https://www.facebook.com/andrea.kohoutova.1" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.19 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.75 8.44-4.92 8.44-9.94z" />
            </svg>
          </a>
          <a style={socialLink} href="https://www.instagram.com/andy.corey/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
              <circle cx="12" cy="12" r="4.1" />
              <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a style={socialLink} href="https://www.anteaterofficial.com" target="_blank" rel="noopener noreferrer" aria-label="Anteater" title="Anteater">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <path d="M9 18V6l10-2v12" />
              <circle cx="6.5" cy="18" r="2.5" />
              <circle cx="16.5" cy="16" r="2.5" />
            </svg>
          </a>
        </div>

        <div>
          <button type="button" style={moreBtn} onClick={() => setOpen((v) => !v)}>
            {open ? t.less : t.more}
          </button>
        </div>

        {open && (
          <div>
            <hr style={rule} />
            <h2 style={detailTitle}>{t.detailTitle}</h2>
            {t.sections.map((s) => (
              <section key={s.h}>
                <p style={secHead}>{s.h}</p>
                {s.p.map((p) => (
                  <p key={p} style={para}>{p}</p>
                ))}
              </section>
            ))}
            <p style={closing}>{t.closing}</p>
          </div>
        )}

        <Link href="/" style={back}>{t.back}</Link>
      </div>
    </main>
  )
}
