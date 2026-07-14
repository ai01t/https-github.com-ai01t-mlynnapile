(() => {
const {
  CONTACT,
  FAQ,
  HERO,
  HISTORY,
  LOCATION,
  PLACE,
  RESIDENCY,
  SECTION_ORDER,
  SITE_META,
  STUDIO,
  UI,
} = window.MlynContent;
const { EQUIPMENT_CATEGORIES, EQUIPMENT_IFRAME, EQUIPMENT_NOTES } = window.MlynEquipment;
const { BACKGROUNDS, IMAGES, PACKAGE_OVERLAYS, assetUrl, chooseBackground, mediaPaths, routeUrl } = window.MlynMedia;
const { detectLanguage, persistLanguage, setupLanguageLinks } = window.MlynLanguage;
const { setupPremiumScroll } = window.MlynPremiumScroll || {};

const app = document.getElementById("app");
const fallbackLang = app?.dataset.lang || "cs";
const depth = Number(app?.dataset.depth || 0);
const lang = detectLanguage(fallbackLang);

persistLanguage(lang);
document.documentElement.lang = lang;
document.documentElement.dataset.theme = readStorage("mlynnapile.theme", "day");
document.documentElement.dataset.motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full";

const t = (value) => {
  if (typeof value === "string") return value;
  return value?.[lang] || value?.cs || "";
};

const esc = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function readStorage(key, fallback) {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch (_) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (_) {}
}

function renderTitle(lines) {
  const parts = Array.isArray(lines?.[lang]) ? lines[lang] : lines?.cs || [];
  return `${esc(parts[0])}<br><em>${esc(parts[1])}</em>`;
}

function bgLayer(key, extra = "") {
  return `
    <div class="media-bg" data-bg-key="${key}">
      <img class="media-poster" alt="" aria-hidden="true">
      <video class="media-video" muted loop playsinline webkit-playsinline preload="metadata" aria-hidden="true">
        <source type="video/mp4">
      </video>
    </div>
    ${extra}
    <div class="section-shade" aria-hidden="true"></div>
  `;
}

function videoOverlay(id, className, data = "") {
  return `
    <div class="${className}" ${data} data-overlay-id="${id}">
      <img class="media-poster" alt="" aria-hidden="true">
      <video class="media-video" muted loop playsinline webkit-playsinline preload="metadata" aria-hidden="true">
        <source type="video/mp4">
      </video>
    </div>
  `;
}

function shell(id, index, body, options = {}) {
  const sectionClass = options.className ? ` ${options.className}` : "";
  const background = options.background === false ? "" : bgLayer(options.bgKey || id, options.extraMedia || "");
  return `
    <section id="${id}" class="stack-section${sectionClass}" style="--stack-index:${index}">
      ${background}
      ${body}
    </section>
  `;
}

function header() {
  const nav = UI.nav.items
    .map((item) => `<a href="#${item.id}" data-scroll-link onclick="return window.MlynGoTo && window.MlynGoTo('${item.id}')">${esc(t(item.label))}</a>`)
    .join("");
  const langLinks = ["cs", "en", "de"]
    .map((code) => `<a href="#" data-lang-link="${code}">${code.toUpperCase()}</a>`)
    .join("");
  return `
    <header class="site-header" data-site-header>
      <a class="brand" href="#hero" data-scroll-link onclick="return window.MlynGoTo && window.MlynGoTo('hero')" aria-label="Mlýn na Pile">${UI.nav.brand}</a>
      <nav class="desktop-nav" aria-label="Primary">${nav}</nav>
      <div class="header-actions">
        <div class="language-switcher" aria-label="Language">${langLinks}</div>
        <button class="icon-button" type="button" data-video-toggle title="${esc(t(UI.controls.videosPause))}" aria-label="${esc(t(UI.controls.videosPause))}">
          <span data-video-icon>II</span>
        </button>
        <button class="icon-button" type="button" data-theme-toggle title="${esc(t(UI.controls.night))}" aria-label="${esc(t(UI.controls.night))}">
          <span data-theme-icon>◐</span>
        </button>
        <button class="menu-button" type="button" data-menu-toggle aria-label="${esc(t(UI.controls.menu))}" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="progress-line" data-progress></div>
    </header>
    <aside class="mobile-nav" aria-label="Mobile">
      <div class="mobile-nav-inner">
        ${nav}
        <div class="language-switcher mobile-lang">${langLinks}</div>
      </div>
    </aside>
  `;
}

function renderHero(index) {
  const title = HERO.title[lang] || HERO.title.cs;
  return shell(
    "hero",
    index,
    `
      <div class="section-content hero-content">
        <p class="eyebrow">${esc(t(HERO.badge))}</p>
        <h1>${esc(title[0])}<br><em>${esc(title[1])}</em></h1>
        <p class="hero-note">${esc(t(HERO.note))}</p>
      </div>
    `,
    { bgKey: "hero", className: "hero-section" },
  );
}

function renderPlace(index) {
  const values = PLACE.values.map((value) => `<li>${esc(t(value))}</li>`).join("");
  const timeline = PLACE.timeline
    .map(
      (item) => `
        <a class="timeline-item" href="${routeUrl(`/historie?year=${item.year}#timeline`, depth)}">
          <span>${item.year}</span>
          <p>${esc(t(item))}</p>
        </a>
      `,
    )
    .join("");
  return shell(
    "place",
    index,
    `
      <div class="section-content place-layout">
        <div class="copy-column">
          <p class="eyebrow">${esc(t(PLACE.label))}</p>
          <div class="big-number">${PLACE.number}</div>
          <h2>${esc(t(PLACE.title))}</h2>
          <p class="lead">${esc(t(PLACE.intro))}</p>
          <ul class="value-list">${values}</ul>
        </div>
        <div class="timeline-panel">
          <a class="panel-label" href="${routeUrl("/historie#timeline", depth)}">${esc(t(PLACE.timelineLabel))}</a>
          ${timeline}
        </div>
      </div>
    `,
    { bgKey: "place", extraMedia: videoOverlay(BACKGROUNDS.place.overlay, "history-ghost") },
  );
}

function renderStudio(index) {
  const rooms = STUDIO.rooms
    .map((room) => {
      const poster = assetUrl(`/videos/bg/${room.localVideo}.${room.posterType || "jpg"}`, depth);
      const video = assetUrl(`/videos/bg/${room.localVideo}.mp4`, depth);
      return `
        <article class="room-card">
          <div class="room-head">
            <h3>${esc(t(room.name))}</h3>
            <span>${esc(room.size)}</span>
          </div>
          <p>${esc(t(room.text))}</p>
          <div class="room-video" aria-label="${esc(t(room.name))} video">
            <img src="${poster}" alt="" aria-hidden="true">
            <video muted loop playsinline autoplay preload="metadata" poster="${poster}">
              <source src="${video}" type="video/mp4">
            </video>
            <a href="https://www.youtube.com/watch?v=${room.video}" target="_blank" rel="noopener noreferrer" title="YouTube" aria-label="YouTube">▶</a>
          </div>
        </article>
      `;
    })
    .join("");
  return shell(
    "studio",
    index,
    `
      <div class="section-content studio-layout">
        <div class="section-heading">
          <p class="eyebrow">${esc(t(STUDIO.label))}</p>
          <h2>${renderTitle(STUDIO.title)}</h2>
          <p class="lead">${esc(t(STUDIO.intro))}</p>
        </div>
        <div class="rooms-grid">${rooms}</div>
      </div>
    `,
    { bgKey: "studio" },
  );
}

function renderEquipment(index) {
  const chips = EQUIPMENT_CATEGORIES.map((category) => `<span>${esc(t(category.label))}</span>`).join("");
  return shell(
    "equipment",
    index,
    `
      <div class="section-content equipment-layout">
        <div class="section-heading">
          <p class="eyebrow">${esc(t({ cs: "Vybavení", en: "Equipment", de: "Ausstattung" }))}</p>
          <h2>${renderTitle({ cs: ["Vybavení", "studia"], en: ["Studio", "equipment"], de: ["Studio", "Ausstattung"] })}</h2>
          <p class="lead">${esc(t(EQUIPMENT_NOTES))}</p>
          <div class="chip-cloud">${chips}</div>
        </div>
        <div class="equipment-frame-shell">
          <iframe data-equipment-frame title="Studio equipment" loading="lazy"></iframe>
        </div>
        <p class="equipment-thanks">
          ${esc(
            t({
              cs: "Děkujeme kytaristovi Radkovi Fořtovi z kapely NORA za zapůjčení nástrojů z jeho sbírky.",
              en: "We thank guitarist Radek Fort from NORA for lending instruments from his collection.",
              de: "Wir danken dem Gitarristen Radek Fořt von NORA für das Leihen von Instrumenten aus seiner Sammlung.",
            }),
          )}
          <a href="https://open.spotify.com/track/1jzCR4iPOo3bCEo67VsvaW?si=fb770e4a9679489f&nd=1&dlsi=1ca88705a71d401c" target="_blank" rel="noopener noreferrer">NORA Spotify</a>
        </p>
      </div>
    `,
    { bgKey: "equipment" },
  );
}

function renderLocation(index) {
  const paragraphs = LOCATION.paragraphs.map((paragraph) => `<p>${esc(t(paragraph))}</p>`).join("");
  const access = LOCATION.access
    .map(
      (item) => `
        <li>
          <span class="access-icon" data-icon="${item.icon}"></span>
          <p>${esc(t(item))}</p>
        </li>
      `,
    )
    .join("");
  return shell(
    "location",
    index,
    `
      <div class="section-content location-layout">
        <div>
          <div class="big-word">Pila</div>
          <p class="eyebrow">${esc(t(LOCATION.label))}</p>
          <h2>${renderTitle(LOCATION.title)}</h2>
          <div class="paragraphs">${paragraphs}</div>
        </div>
        <div class="access-panel">
          <p class="panel-label">${esc(t(LOCATION.accessLabel))}</p>
          <ul class="access-list">${access}</ul>
        </div>
      </div>
    `,
    { bgKey: "location" },
  );
}

function renderHistory(index) {
  return shell(
    "history",
    index,
    `
      <div class="history-section-frame">
        <div class="history-caption">
          <p class="eyebrow">${esc(t(HISTORY.label))}</p>
          <h2>${renderTitle(HISTORY.title)}</h2>
        </div>
        <iframe data-history-frame title="Historie Mlýna na Pile" loading="lazy"></iframe>
      </div>
    `,
    { background: false, className: "history-section" },
  );
}

function renderResidency(index) {
  const packages = RESIDENCY.packages
    .map(
      (pkg) => `
        <article class="package-card" data-package-card="${pkg.id}" tabindex="0">
          <span>${pkg.number}</span>
          <h3>${pkg.name}</h3>
          <p class="package-tags">${esc(t(pkg.tags))}</p>
          <p>${esc(t(pkg.text))}</p>
        </article>
      `,
    )
    .join("");
  const notes = RESIDENCY.notes.map((note) => `<li>${esc(t(note))}</li>`).join("");
  const overlays = Object.entries(PACKAGE_OVERLAYS)
    .map(([pkg, id]) => videoOverlay(id, "package-overlay", `data-pkg="${pkg}"`))
    .join("");
  return shell(
    "residency",
    index,
    `
      <div class="section-content residency-layout">
        <div class="section-heading residency-heading">
          <div class="big-number compact">${esc(RESIDENCY.number)}</div>
          <p class="eyebrow">${esc(t(RESIDENCY.label))}</p>
          <h2>${renderTitle(RESIDENCY.title)}</h2>
          <p class="lead">${t(RESIDENCY.intro)}</p>
          <button class="primary-action" type="button" data-booking-open>${esc(t(UI.controls.booking))}</button>
        </div>
        <div class="package-grid">${packages}</div>
        <ul class="residency-notes">${notes}</ul>
      </div>
      <div class="booking-panel" data-booking-panel aria-hidden="true">
        <div class="booking-toolbar">
          <button class="primary-action ghost" type="button" data-booking-close>${esc(t(UI.controls.back))}</button>
          <span>${esc(t(RESIDENCY.label))}</span>
        </div>
        <iframe data-booking-frame title="Booking" loading="lazy"></iframe>
      </div>
    `,
    {
      bgKey: "residency",
      className: "residency-section",
      extraMedia: `${videoOverlay(BACKGROUNDS.residency.bread, "bread-overlay")}${overlays}`,
    },
  );
}

function renderContact(index) {
  const founders = CONTACT.founders
    .map(
      (founder) => `
        <article class="founder">
          <h3>${esc(founder.name)}</h3>
          <p>${esc(t(founder.text))}</p>
        </article>
      `,
    )
    .join("");
  const socials = CONTACT.socials.map((social) => `<a href="${social.href}" target="_blank" rel="noopener noreferrer">${social.label}</a>`).join("");
  const faqs = (FAQ[lang] || FAQ.cs)
    .map(
      (item) => `
        <details>
          <summary>${esc(item.q)}</summary>
          <p>${item.aHtml || esc(item.a)}</p>
        </details>
      `,
    )
    .join("");
  return shell(
    "contact",
    index,
    `
      <div class="section-content contact-layout">
        <div class="contact-main">
          <p class="eyebrow">${esc(t(CONTACT.label))}</p>
          <h2>${esc(t(CONTACT.title))}</h2>
          <div class="contact-lines">
            <address>${t(CONTACT.address)}</address>
            <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>
            <a href="tel:+420724050093">${CONTACT.phone}</a>
          </div>
          <div class="social-row">${socials}</div>
        </div>
        <div class="about-panel" data-scrollable>
          <img src="${assetUrl(IMAGES.foundersFixed, depth)}" alt="Jindřich Traxmandl a Andrea Kohoutová" loading="lazy">
          <p class="about-text">${esc(t(CONTACT.about))}</p>
          <div class="founders">${founders}</div>
        </div>
        <div class="faq-panel" data-scrollable>
          <p class="panel-label">FAQ</p>
          ${faqs}
        </div>
      </div>
    `,
    { bgKey: "contact" },
  );
}

function footer() {
  return `<footer class="site-footer">© 2026 Mlýn na Pile</footer>`;
}

function renderApp() {
  const sections = SECTION_ORDER.map((id, index) => {
    if (id === "hero") return renderHero(index);
    if (id === "place") return renderPlace(index);
    if (id === "studio") return renderStudio(index);
    if (id === "equipment") return renderEquipment(index);
    if (id === "location") return renderLocation(index);
    if (id === "history") return renderHistory(index);
    if (id === "residency") return renderResidency(index);
    if (id === "contact") return renderContact(index);
    return "";
  }).join("");

  app.innerHTML = `
    <canvas class="painted-texture" data-painted-texture aria-hidden="true"></canvas>
    ${header()}
    <main class="stack-wrapper">${sections}</main>
    <div class="section-dots" aria-hidden="true">
      ${SECTION_ORDER.map((id) => `<button type="button" data-section-dot="${id}" tabindex="-1"></button>`).join("")}
    </div>
    ${footer()}
  `;
}

function applyMeta() {
  document.title = SITE_META[lang]?.title || SITE_META.cs.title;
  const meta = document.querySelector("meta[name='description']");
  if (meta) meta.setAttribute("content", SITE_META[lang]?.description || SITE_META.cs.description);
}

function setIframeSources() {
  const equipmentFrame = document.querySelector("[data-equipment-frame]");
  if (equipmentFrame) equipmentFrame.src = assetUrl(`${EQUIPMENT_IFRAME}?lang=${lang}`, depth);
  const historyFrame = document.querySelector("[data-history-frame]");
  if (historyFrame) historyFrame.src = routeUrl("/historie?embed=1&horizontal=1", depth);
}

function setupMedia() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function hydrateLayer(layer, id) {
    const paths = mediaPaths(id, depth);
    const fallback = layer.matches(".package-overlay,.bread-overlay,.history-ghost") ? paths.gif : paths.poster;
    const poster = layer.querySelector(".media-poster");
    const video = layer.querySelector(".media-video");
    const source = video?.querySelector("source");
    if (poster) poster.src = fallback;
    if (!video || !source) return;
    video.classList.remove("is-ready");
    if (reduced.matches) {
      source.removeAttribute("src");
      video.removeAttribute("poster");
      video.load();
      return;
    }
    video.poster = fallback;
    source.src = paths.video;
    video.load();
    video.oncanplay = () => video.classList.add("is-ready");
    video.onerror = () => video.classList.remove("is-ready");
    if (document.documentElement.dataset.videoState !== "paused") {
      video.play().catch(() => video.classList.remove("is-ready"));
    }
  }

  function sync() {
    const theme = document.documentElement.dataset.theme || "day";
    document.querySelectorAll("[data-bg-key]").forEach((layer) => {
      const id = chooseBackground(layer.getAttribute("data-bg-key"), theme);
      if (id) hydrateLayer(layer, id);
    });
    document.querySelectorAll("[data-overlay-id]").forEach((layer) => hydrateLayer(layer, layer.getAttribute("data-overlay-id")));
    syncVideoState();
  }

  window.addEventListener("resize", debounce(sync, 180), { passive: true });
  reduced.addEventListener?.("change", sync);
  window.__mlynSyncMedia = sync;
  sync();
}

function syncVideoState() {
  const paused = document.documentElement.dataset.videoState === "paused";
  document.querySelectorAll("video").forEach((video) => {
    if (paused || document.documentElement.dataset.motion === "reduced") {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  });
  const button = document.querySelector("[data-video-toggle]");
  const icon = document.querySelector("[data-video-icon]");
  if (button && icon) {
    const label = paused ? t(UI.controls.videosPlay) : t(UI.controls.videosPause);
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    icon.textContent = paused ? "▶" : "II";
  }
}

function setupControls() {
  const savedVideoState = readStorage("mlynnapile.videos", "playing");
  document.documentElement.dataset.videoState = savedVideoState;

  document.querySelector("[data-video-toggle]")?.addEventListener("click", () => {
    const next = document.documentElement.dataset.videoState === "paused" ? "playing" : "paused";
    document.documentElement.dataset.videoState = next;
    writeStorage("mlynnapile.videos", next);
    syncVideoState();
  });

  const themeButton = document.querySelector("[data-theme-toggle]");
  const themeIcon = document.querySelector("[data-theme-icon]");
  function syncThemeControl() {
    const theme = document.documentElement.dataset.theme || "day";
    const nextLabel = theme === "day" ? t(UI.controls.night) : t(UI.controls.day);
    if (themeIcon) themeIcon.textContent = theme === "day" ? "☾" : "☼";
    themeButton?.setAttribute("aria-label", nextLabel);
    themeButton?.setAttribute("title", nextLabel);
  }
  themeButton?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "day" ? "night" : "day";
    document.documentElement.dataset.theme = next;
    writeStorage("mlynnapile.theme", next);
    syncThemeControl();
    window.__mlynSyncMedia?.();
  });
  syncThemeControl();

  const menuButton = document.querySelector("[data-menu-toggle]");
  menuButton?.addEventListener("click", () => {
    const open = !document.body.classList.contains("mobile-menu-open");
    document.body.classList.toggle("mobile-menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });
}

function setupBooking() {
  const panel = document.querySelector("[data-booking-panel]");
  const frame = document.querySelector("[data-booking-frame]");
  const bookingPaths = { cs: "/booking", en: "/en/booking", de: "/de/buchung" };
  document.querySelector("[data-booking-open]")?.addEventListener("click", () => {
    if (frame && !frame.src) frame.src = routeUrl(bookingPaths[lang], depth);
    panel?.setAttribute("aria-hidden", "false");
    panel?.classList.add("is-open");
  });
  document.querySelector("[data-booking-close]")?.addEventListener("click", () => {
    panel?.setAttribute("aria-hidden", "true");
    panel?.classList.remove("is-open");
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      panel?.setAttribute("aria-hidden", "true");
      panel?.classList.remove("is-open");
      document.body.classList.remove("mobile-menu-open");
    }
  });
}

function setupPackages() {
  const section = document.getElementById("residency");
  document.querySelectorAll("[data-package-card]").forEach((card) => {
    const id = card.getAttribute("data-package-card");
    card.addEventListener("mouseenter", () => section?.setAttribute("data-active-package", id));
    card.addEventListener("focus", () => section?.setAttribute("data-active-package", id));
  });
  section?.addEventListener("mouseleave", () => section.removeAttribute("data-active-package"));
}

function normalizeLinks() {
  document.querySelectorAll("a[href^='/']").forEach((link) => {
    link.setAttribute("href", routeUrl(link.getAttribute("href"), depth));
  });
}

function debounce(fn, wait) {
  let timer = null;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}

function setFallbackNavigator() {
  window.MlynGoTo = (id) => {
    if (window.__mlynPremiumScrollApi?.goToId) return window.__mlynPremiumScrollApi.goToId(id);
    const sections = [...document.querySelectorAll(".stack-section")];
    const index = sections.findIndex((section) => section.id === id);
    if (index < 0) return false;
    const top = window.innerWidth >= 900 ? index * window.innerHeight : sections[index].offsetTop;
    window.scrollTo({ top, behavior: "smooth" });
    document.querySelectorAll("[data-scroll-link]").forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`));
    window.history.replaceState(null, "", id === "hero" ? `${window.location.pathname}${window.location.search}` : `#${id}`);
    document.body.classList.remove("mobile-menu-open");
    return false;
  };
}

function safeStart(name, fn) {
  try {
    fn();
  } catch (error) {
    window.__mlynBootErrors = window.__mlynBootErrors || [];
    window.__mlynBootErrors.push({ name, message: error?.message || String(error) });
  }
}

renderApp();
setFallbackNavigator();
safeStart("meta", applyMeta);
safeStart("links", normalizeLinks);
safeStart("language", () => setupLanguageLinks(document, lang, depth));
safeStart("iframes", setIframeSources);
safeStart("media", setupMedia);
safeStart("controls", setupControls);
safeStart("booking", setupBooking);
safeStart("packages", setupPackages);
safeStart("premium-scroll", () => setupPremiumScroll?.());
})();
