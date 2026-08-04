import type { Metadata } from "next"
import type { ReactNode } from "react"

import { CvAutoPageBreaks } from "@/components/cv-auto-page-breaks"
import { CvPrintActions } from "@/components/cv-print-actions"
import { CvStyleControls } from "@/components/cv-style-controls"
import styles from "./cv-page.module.css"

export const metadata: Metadata = {
  title: "CV | Ing. Jindřich Traxmandl",
  description:
    "Český pracovní životopis Ing. Jindřicha Traxmandla zaměřený na SAP S/4HANA, procesní analýzu, projektovou koordinaci a enterprise IT.",
  robots: {
    index: false,
    follow: false,
  },
}

const contactItems = [
  "+420 724 050 093",
  "j.traxmandl@gmail.com",
  "linkedin.com/in/traxmandl",
]

const availabilityLine =
  "Od roku 2024 se věnuji vlastním projektům (viz níže). Jsem flexibilní, okamžitě dostupný a otevřený novým profesním příležitostem."

const profileParagraphs = [
  "SAP/IT konzultant se zkušeností z automotive, SAP transformačních projektů a výrobních prostředí ve farmaceutickém a zdravotnickém sektoru. Specializuji se na procesní analýzu, projektovou koordinaci, vyjasňování požadavků, reporting, podporu testování a komunikaci mezi businessem, IT, dodavateli a delivery týmy.",
  "Byl jsem součástí projektu ONE Log ve Škoda Auto - rozsáhlé SAP S/4HANA logistické transformace, veřejně označované jako největší systémová změna v závodě Vrchlabí za posledních 25 let. Silnou stránkou je rychlá orientace v komplexním nebo nejasném tématu, rozdělení problému na konkrétní části, identifikace rizik a závislostí, zapojení správných stakeholderů a posun témat k rozhodnutí nebo praktické realizaci.",
]

const experience = [
  {
    period: "2024 - dosud",
    title: "Vlastní projekty / digitální a podnikatelský rozvoj",
    company: "Realizace vlastního projektu a další samostatné aktivity.",
    bullets: [
      availabilityLine,
    ],
  },
  {
    period: "2018 - 2024",
    title: "SAP konzultant / SAP S/4HANA procesní konzultant",
    company: "Škoda Auto – SAP S/4HANA – Projekt ONE Log",
    bullets: [
      "Práce v rozsáhlém enterprise SAP S/4HANA transformačním prostředí se zaměřením na výrobu, logistiku, plánování a návazné PP/MM/SD/WM procesy.",
      "Mapování současných systémů, procesů, integračních návazností a datových toků; fit-gap analýza a příprava funkčních návrhů.",
      "Vedení a zastupování týmových témat směrem ke stakeholderům, projektovým partnerům a seniornímu projektovému řízení.",
      "Koordinace témat mezi businessem, klientskými stakeholdery, interními experty, IBM konzultanty, delivery týmy a dodavateli navazujících a legacy systémů.",
      "Reporting, risk/issue management, dependency tracking, identifikace otevřených bodů, závislostí, chyb, datových nesrovnalostí a opakujících se incidentů.",
      "Podpora testování, go-live a hypercare stabilizace včetně koordinace nápravných opatření a reportingu jejich stavu.",
      "Využívaný software: JIRA, LeanIX, SharePoint, Confluence/wiki, Visio, MES IMIS aj.",
    ],
  },
  {
    period: "2015 - 2018",
    title: "IT specialista / implementace interních systémů",
    company: "Agropodnik Domažlice a.s.",
    bullets: [
      "Hlavní interní IT kontaktní osoba pro externí dodavatele softwaru, hardwaru a technických řešení.",
      "Kontaktní a koordinační role vůči mateřské skupině Agrofert v oblasti SAP a navazujících podnikových systémů.",
      "Samostatné zavádění a podpora interních IT, síťových a provozních systémů napříč pobočkami: SharePoint, MPLS / síťová infrastruktura, fleet management, sledování vozidel HW/SW, systémy pro čerpací stanice a další interní aplikace.",
      "Koordinace požadavků mezi uživateli, vedením, dodavateli a mateřskou skupinou; konfigurace, testování, fyzické nasazení HW/SW na provozech, dokumentace, školení a řešení provozních IT problémů.",
    ],
  },
  {
    period: "2009 - 2013",
    title: "SAP Key User / SAP Support",
    company: "Gerresheimer Horšovský Týn - farmaceutická a zdravotnická výroba",
    bullets: [
      "Implementace SAP R/3, podpora SAP R/3 procesů v oblastech WM, MM, SD, PP a návazných výrobních, skladových a logistických procesech; práce s MES Hydra (MPL, CAQ), BPCS a Gebhardt reporting/data systémy.",
      "Role SAP key user: školení zaměstnanců, tvorba manuálů, uživatelská podpora, reporting a opravy dat.",
      "Identifikace opakovaných procesních a datových chyb, návrhy řešení a jejich prevence.",
    ],
  },
  {
    period: "2008 - 2009",
    title: "Manager zahraničního a tuzemského obchodu / IT/SW/WEB",
    company: "MENSA International s.r.o.",
    bullets: [
      "Implementace vícejazyčného webu/e-shopu, digitalizace, CMS a migrace dat. Technická podpora HW/SW.",
      "Komunikace se zákazníky, zahraničními dodavateli.",
    ],
  },
  {
    period: "2005 - 2010",
    title: "OSVČ při studiu / HW/SW a e-commerce podpora",
    company: "Samostatná vedlejší činnost",
    bullets: [
      "HW/SW konzultace, instalace, zálohování a obnova dat, servis a opravy počítačů.",
      "Online prodej / e-shop, fakturace, objednávky a zákaznická podpora.",
    ],
  },
]

const projects = [
  {
    title: "Realizace vlastního projektu — technická infrastruktura a lokální aktivity",
    period: "2024 - dosud",
    text: "Rozvoj vlastního projektu zahrnující právní a administrativní agendu, business koncept, web/marketing, technickou infrastrukturu a komunikaci s odborníky, dodavateli, úřady a lokálními stakeholdery. Součástí bylo technicko-právní dořešení dlouhodobě problematické MVE; mnohaletý problém se podařilo uzavřít za méně než jeden rok. Aktivní zapojení do lokálních technicko-environmentálních témat vedlo k posunu, zapojení odpovědných stran a harmonogramu nápravných kroků.",
  },
  {
    title: "KeyF11.com - autorský digitální produkt",
    period: "2010 - dosud",
    text: "Vlastní koncept cloudové webové aplikace pro vizuální správu záložek, webové náhledy, osobní veřejnou adresu a přehledné panely odkazů. Projekt zahrnoval technické zadání, testování, produktovou logiku, webové technologie a spolupráci s externí vývojářskou firmou. Projekt vznikl již v roce 2010 a svým konceptem časově předcházel pozdějším trendům osobních webových rozcestníků, vizuálních pracovních ploch a link-in-bio služeb.",
  },
  {
    title: "Hudební projekt — produkce, technika a správa",
    period: "2018 - dosud",
    text: "Hudební produkce, tvorba, home recording, práce v DAW, technické zázemí, management kapely, booking včetně zahraničí, komunikace s promotéry, webová prezentace a prezentace na sociálních sítích, příprava kampaní a veřejná komunikace. V rámci projektů využívám AI a vývojové nástroje — např. Codex, Gemini, Claude a Vercel — pro vývoj, samostudium, automatizaci opakujících se kroků a zefektivnění práce.",
  },
]

const education = [
  {
    period: "2009 - 2014",
    title: "Ing. - Veřejná správa a regionální rozvoj",
    place: "Česká zemědělská univerzita v Praze, Provozně ekonomická fakulta",
    bullets: [],
  },
  {
    period: "2002 - 2007",
    title: "Předchozí studium",
    place: "Západočeská univerzita v Plzni - strojní inženýrství / ekonomika",
    bullets: [],
  },
]

const languages = "Čeština - rodný jazyk; angličtina - pracovní úroveň; němčina - základní až pracovní úroveň."

const courses =
  "Microsoft Excel - pokročilé metody a funkce (Microsoft certified), Microsoft Access, SAP ABAP - Level A, Programování v Javě, Asertivita v praxi; další kurzy a samostudium v oblasti IT, SAP, webových technologií, projektové koordinace a AI nástrojů."

const enAvailabilityLine =
  "Since 2024 I have been working on independent projects (see below). I am flexible, immediately available, and open to new professional opportunities."

const enProfileParagraphs = [
  "SAP/IT consultant with experience in automotive, SAP transformation projects, and manufacturing environments in the pharmaceutical and healthcare sectors. My focus is on process analysis, project coordination, requirement clarification, reporting, testing support and communication between business, IT, suppliers and delivery teams.",
  "I was part of the ONE Log project at Škoda Auto, a large SAP S/4HANA logistics transformation publicly described as the largest system change at the Vrchlabí plant in the last 25 years. My strength is the ability to quickly understand complex or unclear topics, break problems down into concrete parts, identify risks and dependencies, involve the right stakeholders and move topics toward decision or practical implementation.",
]

const enExperience = [
  {
    period: "2024 - present",
    title: "Independent projects / digital and business development",
    company: "Self-initiated projects and independent activities.",
    bullets: [enAvailabilityLine],
  },
  {
    period: "2018 - 2024",
    title: "SAP Consultant / SAP S/4HANA Process Consultant",
    company: "Škoda Auto – SAP S/4HANA – ONE Log Project",
    bullets: [
      "Worked in a large enterprise SAP S/4HANA transformation environment focused on manufacturing, logistics, planning and related PP/MM/SD/WM processes.",
      "Mapped current systems, processes, integration dependencies and data flows; supported fit-gap analysis and preparation of functional proposals.",
      "Led and represented team topics toward stakeholders, project partners and senior project management.",
      "Coordinated topics between business, client stakeholders, internal experts, IBM consultants, delivery teams and suppliers of connected and legacy systems.",
      "Supported reporting, risk/issue management, dependency tracking and identification of open points, dependencies, errors, data inconsistencies and recurring incidents.",
      "Supported testing, go-live and hypercare stabilization, including coordination of corrective actions and status reporting.",
      "Tools used: JIRA, LeanIX, SharePoint, Confluence/wiki, Visio, MES IMIS etc.",
    ],
  },
  {
    period: "2015 - 2018",
    title: "IT Specialist / Internal Systems Implementation",
    company: "Agropodnik Domažlice a.s.",
    bullets: [
      "Main internal IT contact for external suppliers of software, hardware and technical solutions.",
      "Liaison and coordination with the Agrofert parent group in the area of SAP and related enterprise systems.",
      "Independent implementation and support of internal IT, network and operational systems across branches: SharePoint, MPLS / network infrastructure, fleet management, vehicle tracking HW/SW, fuel station systems and other internal applications.",
      "Coordinated requirements between users, company management, suppliers and the parent group; configuration, testing, physical HW/SW deployment at sites, documentation, training and operational IT troubleshooting.",
    ],
  },
  {
    period: "2009 - 2013",
    title: "SAP Key User / SAP Support",
    company: "Gerresheimer Horšovský Týn - pharma and healthcare manufacturing",
    bullets: [
      "Involved in SAP R/3 implementation and support of SAP R/3 processes in WM, MM, SD, PP and related manufacturing, warehouse and logistics processes; worked with MES Hydra (MPL, CAQ), BPCS and Gebhardt reporting/data systems.",
      "SAP key user role: employee training, creation of user manuals, user support, reporting and data corrections.",
      "Identified recurring process and data errors, proposed solutions and supported prevention measures.",
    ],
  },
  {
    period: "2008 - 2009",
    title: "Foreign and Domestic Trade Manager / IT/SW/WEB",
    company: "MENSA International s.r.o.",
    bullets: [
      "Implementation of a multilingual website/e-shop, digitalization, CMS and data migration. Technical HW/SW support.",
      "Communication with customers and international suppliers.",
    ],
  },
  {
    period: "2005 - 2010",
    title: "Self-employed during studies / HW/SW and e-commerce support",
    company: "Part-time self-employment",
    bullets: [
      "HW/SW consulting, installation, backup and data recovery, PC servicing and repairs.",
      "Online retail / e-shop operations, invoicing, orders and customer support.",
    ],
  },
]

const enProjects = [
  {
    title: "Independent project delivery — technical infrastructure and local activities",
    period: "2024 - present",
    text: "Development of an independent project involving legal and administrative agenda, business concept, web/marketing, technical infrastructure and communication with experts, suppliers, authorities and local stakeholders. The work included technical and legal resolution of a long-term issue related to a small hydropower plant; a multi-year issue was closed in less than one year. Active involvement in local technical-environmental topics led to tangible progress, engagement of responsible parties and a schedule of corrective steps.",
  },
  {
    title: "KeyF11.com – original digital product / own web application concept",
    period: "2010 - present",
    text: "Self-initiated concept of a cloud web application for visual bookmark management, website previews, a personal public address and organized link panels. I created the product concept, product logic, technical specification and testing approach, and coordinated cooperation with an external development company. Created as early as 2010, the concept preceded later trends in personal web link hubs, visual workspaces and link-in-bio services.",
  },
  {
    title: "Music project — production, technical background and management",
    period: "2018 - present",
    text: "Music production, songwriting, home recording, DAW work, technical background, band organization, booking including international shows, communication with promoters, web and social media presentation, campaign preparation and public communication. Across projects, I use AI and development tools in practice — e.g. Codex, Gemini, Claude and Vercel — for development, self-study, automation of recurring steps and overall work efficiency.",
  },
]

const enEducation = [
  {
    period: "2009 - 2014",
    title: "Ing. - Public Administration and Regional Development",
    place: "Czech University of Life Sciences Prague, Faculty of Economics and Management",
    bullets: [],
  },
  {
    period: "2002 - 2007",
    title: "Previous studies",
    place: "University of West Bohemia in Pilsen - Mechanical Engineering / Economics",
    bullets: [],
  },
]

const enLanguages = "Czech - native; English - working proficiency; German - basic to working proficiency."

const enCourses =
  "Microsoft Excel - advanced methods and functions (Microsoft certified), Microsoft Access, SAP ABAP - Level A, Programming in Java, Assertiveness in practice; additional courses and self-study in IT, SAP, web technologies, project coordination and AI tools."

function Section({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`${styles.section}${className ? ` ${className}` : ""}`}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function czText(text: string) {
  return text.replace(/(^|\s)([AaIiKkOoSsUuVvZz])\s+/g, "$1$2\u00a0")
}

function formatText(text: string, language: "cs" | "en") {
  return language === "cs" ? czText(text) : text
}

function BulletList({ items, language }: { items: string[]; language: "cs" | "en" }) {
  return (
    <ul className={styles.bulletList}>
      {items.map((item) => (
        <li key={item}>{formatText(item, language)}</li>
      ))}
    </ul>
  )
}

export default function CvPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const language = searchParams?.lang === "en" ? "en" : "cs"
  const isEnglish = language === "en"
  const content = {
    profileParagraphs: isEnglish ? enProfileParagraphs : profileParagraphs,
    experience: isEnglish ? enExperience : experience,
    projects: isEnglish ? enProjects : projects,
    education: isEnglish ? enEducation : education,
    languages: isEnglish ? enLanguages : languages,
    courses: isEnglish ? enCourses : courses,
    labels: {
      toolbarKicker: isEnglish ? "CV preview" : "Náhled CV",
      languageSwitch: isEnglish ? "Česky" : "English",
      languageHref: isEnglish ? "/cv" : "/cv?lang=en",
      profile: isEnglish ? "Professional profile" : "Profesní profil",
      experience: isEnglish ? "Professional experience" : "Pracovní zkušenosti",
      projects: isEnglish ? "Projects" : "Projekty",
      education: isEnglish ? "Education" : "Vzdělání",
      languages: isEnglish ? "Languages" : "Jazyky",
      courses: isEnglish ? "Courses" : "Kurzy",
      footer: isEnglish
        ? "Jindřich Traxmandl - CV - Project Coordination and SAP Transformation"
        : "Jindřich Traxmandl - CV - Projektová koordinace a SAP transformace",
      photoAlt: isEnglish ? "Jindřich Traxmandl at a work desk" : "Jindřich Traxmandl u pracovního stolu",
      articleLabel: isEnglish ? "CV of Ing. Jindřich Traxmandl" : "Životopis Ing. Jindřicha Traxmandla",
    },
  }

  return (
    <main className={styles.screenShell}>
      <div className={styles.toolbar}>
        <div>
          <p className={styles.toolbarKicker}>{content.labels.toolbarKicker}</p>
          <h1>Ing. Jindřich Traxmandl</h1>
        </div>
        <div className={styles.toolbarActions}>
          <a className={styles.languageSwitch} href={content.labels.languageHref}>
            {content.labels.languageSwitch}
          </a>
          <CvPrintActions />
        </div>
      </div>

      <div className={styles.editorLayout}>
        <CvStyleControls sheetId="cv-sheet" />

        <div className={styles.pageViewport} aria-label="A4 náhled CV">
          <CvAutoPageBreaks sheetId="cv-sheet" />
          <article id="cv-sheet" className={styles.cvSheet} aria-label={content.labels.articleLabel}>
            <header className={styles.header}>
              <div className={styles.headerText}>
                <h1>Ing. Jindřich Traxmandl</h1>
                <p className={styles.contactLine}>
                  {contactItems.map((item, index) => (
                    <span key={item}>
                      {index > 0 ? <b>|</b> : null}
                      {item === "linkedin.com/in/traxmandl" ? (
                        <a href="https://www.linkedin.com/in/traxmandl/" target="_blank" rel="noreferrer">
                          {item}
                        </a>
                      ) : (
                        item
                      )}
                    </span>
                  ))}
                </p>
              </div>
              <figure className={styles.cvPhoto} aria-label="Profilová fotografie">
                <img src="/cv/profile.jpg" alt={content.labels.photoAlt} />
              </figure>
            </header>

            <Section title={content.labels.profile}>
              {content.profileParagraphs.map((paragraph) => (
                <p className={styles.paragraph} key={paragraph}>
                  {formatText(paragraph, language)}
                </p>
              ))}
            </Section>

            <Section title={content.labels.experience}>
              <div className={styles.experienceList}>
                {content.experience.map((job) => (
                  <section className={styles.job} data-avoid-page-break key={`${job.period}-${job.title}`}>
                    <h3>
                      {formatText(job.title, language)} <span>| {job.period}</span>
                    </h3>
                    <p className={styles.company}>{formatText(job.company, language)}</p>
                    <BulletList items={job.bullets} language={language} />
                  </section>
                ))}
              </div>
            </Section>

            <Section title={content.labels.projects} className={styles.projectsSection}>
              <div className={styles.projectList}>
                {content.projects.map((project) => (
                  <section data-avoid-page-break key={project.title}>
                    <h3>
                      {formatText(project.title, language)} <span>| {project.period}</span>
                    </h3>
                    <p>{formatText(project.text, language)}</p>
                  </section>
                ))}
              </div>
            </Section>

            <Section title={content.labels.education}>
              <div className={styles.educationList}>
                {content.education.map((item) => (
                  <section data-avoid-page-break key={`${item.period}-${item.title}`}>
                    <h3>
                      {formatText(item.title, language)} <span>| {item.period}</span>
                    </h3>
                    <p className={styles.company}>{formatText(item.place, language)}</p>
                    {item.bullets.length ? <BulletList items={item.bullets} language={language} /> : null}
                  </section>
                ))}
                <section data-avoid-page-break>
                  <h3>{content.labels.languages}</h3>
                  <p className={styles.compactText}>{formatText(content.languages, language)}</p>
                </section>
                <section data-avoid-page-break>
                  <h3>{content.labels.courses}</h3>
                  <p className={styles.compactText}>{formatText(content.courses, language)}</p>
                </section>
              </div>
            </Section>

            <footer className={styles.cvFooter}>
              <span>{content.labels.footer}</span>
            </footer>
          </article>
        </div>
      </div>
    </main>
  )
}
