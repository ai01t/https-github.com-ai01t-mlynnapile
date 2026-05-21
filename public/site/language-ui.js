(() => {
const LANG_STORAGE_KEY = "mlynnapile.lang";
const { SUPPORTED_LANGS } = window.MlynContent;

function detectLanguage(fallback = "cs") {
  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get("lang");
  if (SUPPORTED_LANGS.includes(queryLang)) return queryLang;

  const path = window.location.pathname.toLowerCase();
  if (/\/en(\/|$)/.test(path)) return "en";
  if (/\/de(\/|$)/.test(path)) return "de";

  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (SUPPORTED_LANGS.includes(stored)) return stored;
  } catch (_) {}

  return SUPPORTED_LANGS.includes(fallback) ? fallback : "cs";
}

function persistLanguage(lang) {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (_) {}
}

function langHref(nextLang, depth = 0) {
  const hash = window.location.hash || "";
  if (window.location.protocol !== "file:") {
    if (nextLang === "cs") return `/${hash}`;
    return `/${nextLang}${hash}`;
  }

  if (depth > 0) {
    if (nextLang === "cs") return `../index.html${hash}`;
    return `../${nextLang}/index.html${hash}`;
  }

  if (nextLang === "cs") return `./index.html${hash}`;
  return `./${nextLang}/index.html${hash}`;
}

function setupLanguageLinks(root, lang, depth = 0) {
  root.querySelectorAll("[data-lang-link]").forEach((link) => {
    const nextLang = link.getAttribute("data-lang-link");
    link.classList.toggle("is-active", nextLang === lang);
    link.setAttribute("aria-current", nextLang === lang ? "true" : "false");
    link.setAttribute("href", langHref(nextLang, depth));
    link.addEventListener("click", () => persistLanguage(nextLang));
  });
}

window.MlynLanguage = {
  detectLanguage,
  langHref,
  persistLanguage,
  setupLanguageLinks,
};
})();
