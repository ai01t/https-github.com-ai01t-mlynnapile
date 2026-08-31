/* ============================================================
   Keramika Kampanela — vykreslení webu z datového modelu
   ============================================================ */

const STORAGE_KEY = "kampanela.site.v2";

/* ---------- pomocné funkce ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const deepClone = (o) => JSON.parse(JSON.stringify(o));
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** Hluboké doplnění chybějících klíčů z výchozích dat (kvůli starším uloženým verzím). */
function mergeDefaults(target, defaults) {
  if (Array.isArray(defaults)) return Array.isArray(target) ? target : deepClone(defaults);
  if (typeof defaults !== "object" || defaults === null) return target === undefined ? defaults : target;
  const out = (typeof target === "object" && target !== null) ? target : {};
  for (const k of Object.keys(defaults)) out[k] = mergeDefaults(out[k], defaults[k]);
  return out;
}

function getPath(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[/^\d+$/.test(k) ? Number(k) : k]), obj);
}
function setPath(obj, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const parent = keys.reduce((o, k) => o[/^\d+$/.test(k) ? Number(k) : k], obj);
  parent[/^\d+$/.test(last) ? Number(last) : last] = value;
}

/* ---------- stav ---------- */
let DATA = loadData();

/**
 * Zdrojem pravdy je data.js. Kopie v prohlížeči se použije jen tehdy,
 * když web neběží přes server.py a nemá se kam ukládat.
 */
function loadData() { return deepClone(DEFAULT_DATA); }

function loadLocalIfNoServer() {
  fetch("/api/state").then((r) => {
    if (!r.ok) throw new Error("bez serveru");
    localStorage.removeItem(STORAGE_KEY);          // soubor je novější, kopii nepotřebujeme
    return r.json().then((j) => {
      if (fileStamp === null) fileStamp = j.stamp;    // razítko z uložení má přednost
    });
  }).catch(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { setSaveState("local"); return; }
      DATA = mergeDefaults(JSON.parse(raw), DEFAULT_DATA);
      setSaveState("local");
      render();
    } catch (e) { console.warn("Kopii v prohlížeči se nepodařilo načíst:", e); }
  });
}
let saveState = "saved";          // saved | saving | local | error
let onSaveState = null;           // editor si sem pověsí posluchače
let serverTimer = null;

function setSaveState(v) { saveState = v; if (onSaveState) onSaveState(v); }

function saveData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA)); }
  catch (e) { console.warn("Uložení do prohlížeče selhalo (možná moc velké fotky):", e); }
  setSaveState("saving");
  clearTimeout(serverTimer);
  serverTimer = setTimeout(saveToServer, 350);   // zapiš do data.js po chvíli klidu
}

/** Uloží okamžitě — při opuštění pole, zavření editoru nebo odchodu ze stránky. */
function flushSave() {
  clearTimeout(serverTimer);
  saveToServer();
}

/** Zapíše obsah do web/data.js přes server.py. Když server neběží, zůstane jen localStorage. */
let fileStamp = null;              // čas poslední změny data.js, který známe
let saving = false;                // právě probíhá zápis
let pending = false;               // během zápisu přišla další změna

/** Zápisy řadíme za sebe — dva najednou by si navzájem hlásily konflikt. */
function saveToServer() {
  if (saving) { pending = true; return; }
  saving = true;
  fetch("/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.assign({ __stamp: fileStamp }, DATA))
  }).then((r) => r.json().then((j) => ({ status: r.status, j })))
    .then(({ status, j }) => {
      if (status === 409) { fileStamp = j.stamp; setSaveState("conflict"); }
      else if (status !== 200) { setSaveState("error"); }
      else { fileStamp = j.stamp; setSaveState("saved"); }
    })
    .catch(() => setSaveState("local"))
    .then(() => {
      saving = false;
      if (pending) { pending = false; saveToServer(); }
    });
}

function resetData() { localStorage.removeItem(STORAGE_KEY); DATA = deepClone(DEFAULT_DATA); }


/* ---------- logo (geometrie podle původní značky, barevnost webu) ---------- */
function logoSvgFallback() {
  const l = DATA.meta.logo || {};
  const saved = l.type; l.type = "svg";
  const out = logoSvg(); l.type = saved;
  return out;
}

function logoSvg() {
  const l = DATA.meta.logo || {};
  if (!l.show) return "";
  const size = l.size || 34;
  const color = { ink: "var(--ink)", muted: "var(--muted)", brand: "var(--brand)" }[l.color] || "var(--accent)";
  const lw = l.lineWidth ?? 4.5;
  const op = l.opacity ?? 1;
  if (l.type === "image" || (l.type === "auto" && l.src)) {
    return `<span class="brand-mark" style="opacity:${op}">
      <img class="logo-img" src="${esc(l.src)}" alt="${esc(DATA.meta.brand)}"
           style="height:${size * 1.12}px" data-logo-img
           onerror="this.closest('.brand-mark').outerHTML = logoSvgFallback();"></span>`;
  }
  // Tělo: zaoblený trojúhelník se špičkou nahoře; uvnitř protínající se oblouky.
  const body = "M50 3c8 0 16 7 23 17 9 12 24 26 24 42 0 12-8 22-21 22H24C11 84 3 74 3 62 3 46 18 32 27 20 34 10 42 3 50 3Z";
  const tip  = "M31 88h38c-1 12-9 20-19 24-10-4-18-12-19-24Z";
  return `<span class="brand-mark" style="color:${color};opacity:${op}">
  <svg width="${size}" height="${size * 1.12}" viewBox="0 0 100 112" fill="none" aria-hidden="true">
    <defs><clipPath id="kmpBody"><path d="${body}"/></clipPath></defs>
    <path d="${body}" fill="currentColor"/>
    <path d="${tip}" fill="currentColor"/>
    <g clip-path="url(#kmpBody)" stroke="var(--bg)" stroke-width="${lw}" fill="none">
      <circle cx="50" cy="19" r="44"/>
      <circle cx="50" cy="63" r="44"/>
      <circle cx="28" cy="41" r="44"/>
      <circle cx="72" cy="41" r="44"/>
      <path d="M31.9 22.9 A44 44 0 0 1 68.1 22.9 A44 44 0 0 1 68.1 59.1 A44 44 0 0 1 31.9 59.1 A44 44 0 0 1 31.9 22.9 Z"
            fill="var(--bg)" stroke="var(--bg)"/>
    </g>
  </svg></span>`;
}



/** Mezery sekce podle nastavení (prázdné = výchozí z motivu stylu). */
function spaceStyle(key, extra = "") {
  const sp = (DATA.spacing || {})[key] || {};
  const parts = [];
  if (sp.top != null) parts.push(`padding-top:${sp.top}px`);
  if (sp.bottom != null) parts.push(`padding-bottom:${sp.bottom}px`);
  if (extra) parts.push(extra);
  return parts.length ? ` style="${parts.join(";")}"` : "";
}

/* ---------- stopa kytiček za myší (jen v pruhu pod úvodem) ---------- */
let trailStop = null;                 // ukončí předchozí běh při překreslení

function initTrail() {
  if (trailStop) { trailStop(); trailStop = null; }

  const c = DATA.trail || {};
  const canvas = $("[data-trail]");
  const section = canvas && canvas.closest("section");
  if (!canvas || !section || !c.enabled) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [], lastX = null, lastY = null, raf = 0;

  function resize() {
    canvas.width = section.offsetWidth * dpr;
    canvas.height = section.offsetHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  function drawFlower(x, y, size, rotation, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = Math.max(0, opacity);
    ctx.fillStyle = c.blue;
    for (let i = 0; i < 5; i++) {
      const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * size * 0.38, Math.sin(a) * size * 0.38, size * 0.16, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = c.yellow;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function spawn(x, y, glitter) {
    return {
      x: x + (glitter ? (Math.random() - 0.5) * 20 : 0),
      y: y + (glitter ? (Math.random() - 0.5) * 20 : 0),
      glitter,
      life: glitter ? c.glitterOpacity : c.maxOpacity,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * c.rotationSpeed,
      size: glitter ? Math.random() * 2 + 1 : c.size
    };
  }

  function onMove(e) {
    const r = section.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (lastX === null) { lastX = x; lastY = y; return; }
    if (Math.hypot(x - lastX, y - lastY) > c.spawnDistance && particles.length < c.maxParticles) {
      particles.push(spawn(x, y, false));
      if (c.glitter && Math.random() > 0.5) particles.push(spawn(x, y, true));
      lastX = x; lastY = y;
    }
  }
  function onLeave() { lastX = lastY = null; }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.y -= c.driftSpeed;
      p.rotation += p.rotSpeed;
      p.life -= c.fadeSpeed;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      if (p.glitter) {
        ctx.save(); ctx.globalAlpha = p.life; ctx.fillStyle = c.yellow;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      } else {
        drawFlower(p.x, p.y, p.size, p.rotation, p.life);
      }
    }
    raf = requestAnimationFrame(frame);
  }
  frame();

  section.addEventListener("mousemove", onMove);
  section.addEventListener("mouseleave", onLeave);
  window.addEventListener("resize", resize);

  trailStop = () => {
    cancelAnimationFrame(raf);
    section.removeEventListener("mousemove", onMove);
    section.removeEventListener("mouseleave", onLeave);
    window.removeEventListener("resize", resize);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

/* ---------- kytičkový pás (vzor z ruční malby na nádobí) ---------- */

/** Jedna kytička: pět modrých okvětních teček kolem žlutého středu. */
function flowerSvg(i) {
  const m = DATA.motif;
  const petals = [0, 1, 2, 3, 4].map((k) => {
    const a = (-90 + k * 72) * Math.PI / 180;
    const x = 12 + Math.cos(a) * 6.1, y = 12 + Math.sin(a) * 6.1;
    return `<circle class="pet" style="--p:${k}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="2.55"/>`;
  }).join("");
  return `<span class="flower" style="--i:${i}">
    <svg viewBox="0 0 24 24" width="${m.size}" height="${m.size}" aria-hidden="true">
      <g fill="${esc(m.petal)}">${petals}</g>
      <circle class="mid" cx="12" cy="12" r="2.9" fill="${esc(m.center)}"/>
    </svg></span>`;
}

/** Pás kytiček mezi sekcemi — při najetí se „domalovávají“ zleva doprava. */
function motifBand(place) {
  const m = DATA.motif;
  if (!m || !m.show || !(m.places || []).includes(place)) return "";
  const flowers = Array.from({ length: m.count }, (_, i) => flowerSvg(i)).join("");
  return `<div class="motif-band reveal${m.animate ? " animated" : ""}"
    style="--gap:${m.gap}px;--speed:${m.speed}ms;opacity:${m.opacity};transform:translate(${m.offsetX || 0}px, ${m.offset || 0}px)"
    data-motif aria-hidden="true">${flowers}</div>`;
}

/* ---------- ikony sociálních sítí ---------- */
const ICONS = {
  instagram: {
    line: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/>',
    solid: '<path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm4.5 5.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8Zm0 1.9a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm5-3.2a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Z" fill="currentColor" stroke="none"/>'
  },
  facebook: {
    line: '<rect x="3" y="3" width="18" height="18" rx="4.5"/><path d="M13.7 20.5v-7h2.3l.4-2.7h-2.7V9.1c0-.8.2-1.3 1.3-1.3h1.5V5.4c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v2H8.7v2.7h2.4v7"/>',
    solid: '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" fill="currentColor" stroke="none"/>'
  },
  email: {
    line: '<rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6.5 9 6.2 9-6.2"/>',
    solid: '<path d="M2 6.4V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6.4l-9.4 6.5a1 1 0 0 1-1.2 0L2 6.4ZM21.8 4.3A2 2 0 0 0 20 4H4a2 2 0 0 0-1.8 1.1L12 11.9l9.8-6.8Z" fill="currentColor" stroke="none"/>'
  },
  phone: {
    line: '<path d="M6.2 3.5h3l1.6 4-2 1.4a12 12 0 0 0 6.3 6.3l1.4-2 4 1.6v3a1.7 1.7 0 0 1-1.9 1.7A16.5 16.5 0 0 1 4.5 5.4 1.7 1.7 0 0 1 6.2 3.5Z"/>',
    solid: '<path d="M6.2 2.5h3a1.5 1.5 0 0 1 1.4 1l1.2 3a1.5 1.5 0 0 1-.5 1.7l-1.3.9a11 11 0 0 0 5 5l.9-1.3a1.5 1.5 0 0 1 1.7-.5l3 1.2a1.5 1.5 0 0 1 1 1.4v3a2.2 2.2 0 0 1-2.4 2.2A17.5 17.5 0 0 1 4 4.9 2.2 2.2 0 0 1 6.2 2.5Z" fill="currentColor" stroke="none"/>'
  },
  whatsapp: {
    line: '<path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.3a8.5 8.5 0 1 1 15.6-4.5Z"/><path d="M9 9.2c.2 1.6 2 3.8 3.9 4.6.6.2 1.2.4 1.6 0l.6-.7"/>',
    solid: '<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.3A10 10 0 1 0 12 2Zm5.1 13.6c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .3-3.3-.7a11.6 11.6 0 0 1-4.8-4.2c-.4-.6-1-1.5-1-2.9 0-1.3.7-2 1-2.3.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 2c.1.2 0 .4 0 .5l-.4.5c-.1.2-.3.3-.1.6.4.7.9 1.4 1.5 1.9.7.6 1.3.8 1.5.9.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.5-.1l2 .9c.2.1.4.2.4.3v1.2Z" fill="currentColor" stroke="none"/>'
  },
  pinterest: {
    line: '<circle cx="12" cy="12" r="9.2"/><path d="M9.8 20.5c1-2.6 1.6-5 1.6-5m-.5-2.6c-.6-2.7.9-4.6 3-4.6 1.9 0 3.2 1.3 3.2 3.3 0 2.6-1.5 4.5-3.4 4.5-1 0-1.8-.8-1.6-1.8"/>',
    solid: '<path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.3-5.4s-.3-.6-.3-1.6c0-1.5.9-2.7 2-2.7.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.6-.3 1 .5 1.9 1.6 1.9 1.9 0 3.2-2.4 3.2-5.2 0-2.2-1.5-3.8-4.1-3.8-3 0-4.9 2.2-4.9 4.7 0 .9.3 1.5.7 2 .2.2.2.3.1.6l-.2.8c-.1.3-.3.4-.6.2-1.2-.5-1.8-1.9-1.8-3.5 0-2.6 2.2-5.7 6.6-5.7 3.5 0 5.8 2.5 5.8 5.3 0 3.6-2 6.3-5 6.3-1 0-2-.5-2.3-1.2l-.6 2.4c-.2.8-.7 1.7-1 2.3A10 10 0 1 0 12 2Z" fill="currentColor" stroke="none"/>'
  },
  tiktok: {
    line: '<path d="M14.5 3v11.2a3.4 3.4 0 1 1-2.9-3.4"/><path d="M14.5 3c.4 2.2 2 3.7 4.3 3.9"/>',
    solid: '<path d="M16.2 2h-3v13.1a2.6 2.6 0 1 1-2.2-2.6V9.4a5.7 5.7 0 1 0 5.2 5.7V8.6a6.6 6.6 0 0 0 4 1.3V6.8a3.8 3.8 0 0 1-4-3.8V2Z" fill="currentColor" stroke="none"/>'
  },
  youtube: {
    line: '<rect x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path d="m10.3 9.4 4.8 2.6-4.8 2.6V9.4Z"/>',
    solid: '<path d="M22.5 8.2a3 3 0 0 0-2.1-2.1C18.6 5.6 12 5.6 12 5.6s-6.6 0-8.4.5A3 3 0 0 0 1.5 8.2C1 10 1 12 1 12s0 2 .5 3.8a3 3 0 0 0 2.1 2.1c1.8.5 8.4.5 8.4.5s6.6 0 8.4-.5a3 3 0 0 0 2.1-2.1C23 14 23 12 23 12s0-2-.5-3.8ZM9.9 15.3V8.7l5.6 3.3-5.6 3.3Z" fill="currentColor" stroke="none"/>'
  },
  messenger: {
    line: '<path d="M12 3c-5 0-9 3.7-9 8.4 0 2.6 1.3 4.9 3.3 6.4V21l3-1.7c.9.2 1.8.4 2.7.4 5 0 9-3.7 9-8.3S17 3 12 3Z"/><path d="m7.4 14.2 2.9-3 1.9 1.9 2.7-2.9-2.8 3-2-1.9-2.7 2.9Z"/>',
    solid: '<path d="M12 2C6.3 2 2 6.2 2 11.7c0 3.1 1.4 5.8 3.7 7.6v3.2l3.4-1.9c.9.3 1.9.4 2.9.4 5.7 0 10-4.2 10-9.6S17.7 2 12 2Zm1.1 12.6-2.6-2.7-4.8 2.7 5.3-5.6 2.6 2.7 4.7-2.7-5.2 5.6Z" fill="currentColor" stroke="none"/>'
  },
  telegram: {
    line: '<path d="M21 4.5 2.8 11.4l4.9 1.6L19 6.6l-9.1 8.2.3 5 2.9-3.5 4.4 3.2L21 4.5Z"/>',
    solid: '<path d="M21.9 4.2 18.7 19c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.3-.1-.5-.6-.2L6.3 12.2 1.5 10.7c-1-.3-1-1 .2-1.5l19-7.3c.9-.3 1.6.2 1.2 2.3Z" fill="currentColor" stroke="none"/>'
  },
  maps: {
    line: '<path d="M9 3 3 5.4v15.1L9 18l6 2.6 6-2.4V3l-6 2.4L9 3Zm0 0v15m6-12.6V21"/>',
    solid: '<path d="M9 2.5 2.6 5v16.5L9 19l6 2.5 6.4-2.5V2.5L15 5 9 2.5Zm-.8 2.3 1.6.6v13.3l-1.6-.7V4.8Zm7.2.6 1.6-.6v13.2l-1.6.7V5.4Z" fill="currentColor" stroke="none"/>'
  },
  threads: {
    line: '<path d="M16.4 11.8c-.2-3-2-4.4-4.4-4.4-1.7 0-3 .7-3.7 2M12 21c-5.2 0-8.5-3.4-8.5-9S6.8 3 12 3s8.5 3.4 8.5 9-3.3 9-8.5 9Z"/><path d="M15.6 12.6c0 2.3-1.6 3.6-3.5 3.6-1.4 0-2.5-.7-2.5-1.9 0-1.4 1.4-2.1 3.3-2.1 2.6 0 4.6 1 4.6 3.3"/>',
    solid: '<path d="M12 2C6.5 2 3 5.6 3 12s3.5 10 9 10 9-3.6 9-10-3.5-10-9-10Zm4.4 13.8c-.9 1.2-2.4 1.9-4.2 1.9-2.6 0-4.4-1.5-4.4-3.6 0-2.2 2-3.5 4.9-3.5.9 0 1.7.1 2.4.3-.1-1.5-1-2.4-2.5-2.4-1.1 0-1.9.4-2.4 1.2l-1.6-1.1c.9-1.4 2.3-2.1 4.1-2.1 2.9 0 4.5 1.8 4.6 4.8 1 .8 1.5 1.9 1.5 3.2 0 .5-.1 1-.2 1.4l-2.2-.1Zm-3.6-3.4c-1.7 0-2.7.6-2.7 1.6 0 .9.8 1.5 1.9 1.5 1.6 0 2.7-1 2.8-2.7-.6-.3-1.3-.4-2-.4Z" fill="currentColor" stroke="none"/>'
  },
  shop: {
    line: '<path d="M4 8h16l-1.2 12.5H5.2L4 8Z"/><path d="M8.5 10V6.5a3.5 3.5 0 1 1 7 0V10"/>',
    solid: '<path d="M8.5 6.5V8H4l1.2 13h13.6L20 8h-4.5V6.5a3.5 3.5 0 1 0-7 0Zm1.9 0a1.6 1.6 0 1 1 3.2 0V8h-3.2V6.5Z" fill="currentColor" stroke="none"/>'
  },
  heart: {
    line: '<path d="M12 20.3S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.5 2.8c0 5.8-8.5 11.1-8.5 11.1Z"/>',
    solid: '<path d="M12 21S2.5 15.3 2.5 9A5.3 5.3 0 0 1 12 5.9 5.3 5.3 0 0 1 21.5 9c0 6.3-9.5 12-9.5 12Z" fill="currentColor" stroke="none"/>'
  },
  web: {
    line: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18-2.5-2.6-2.5-15.4 0-18Z"/>',
    solid: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 9h-3a15 15 0 0 0-1.2-5.4A8 8 0 0 1 18.9 11ZM12 4.2c.8 1.1 1.6 3.4 1.8 6.8h-3.6c.2-3.4 1-5.7 1.8-6.8ZM9.3 5.6A15 15 0 0 0 8.1 11h-3a8 8 0 0 1 4.2-5.4ZM5.1 13h3a15 15 0 0 0 1.2 5.4A8 8 0 0 1 5.1 13Zm6.9 6.8c-.8-1.1-1.6-3.4-1.8-6.8h3.6c-.2 3.4-1 5.7-1.8 6.8Zm2.7-1.4a15 15 0 0 0 1.2-5.4h3a8 8 0 0 1-4.2 5.4Z" fill="currentColor" stroke="none"/>'
  },
  location: {
    line: '<path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
    solid: '<path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2Z" fill="currentColor" stroke="none"/>'
  }
};
const ICON_TYPES = Object.keys(ICONS);

function iconSvg(type, opts) {
  const set = ICONS[type] || ICONS.web;
  const legacySolid = opts.iconStyle === "solid";
  const variant = (opts.glyph ? opts.glyph === "solid" : legacySolid) ? "solid" : "line";
  const body = set[variant] || set.line;
  const size = opts.size || 20;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="${opts.strokeWidth || 1.5}"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

function renderSocial(place) {
  const s = DATA.social;
  if (place === "header" && !s.showInHeader) return "";
  if (place === "footer" && !s.showInFooter) return "";
  if (!s.items.length) return "";
  const links = s.items.map((it, i) => {
    const icon = (s.display !== "text") ? iconSvg(it.type, s) : "";
    const label = (s.display !== "icon") ? `<span class="s-label">${esc(it.label)}</span>` : "";
    return `<a href="${esc(it.url)}" target="_blank" rel="noopener" aria-label="${esc(it.label)}"
              data-edit-social="${i}">${icon}${label}</a>`;
  }).join("");
  const shape = s.shape || (["circle", "square"].includes(s.iconStyle) ? s.iconStyle : "none");
  return `<div class="social" data-shape="${esc(shape)}" style="gap:${s.gap}px;--icon-pad:${s.shapePad ?? 9}px">${links}</div>`;
}

/* ---------- obrázky ---------- */
/** Otočení, překlopení a přiblížení fotky. */
function imgTransform(img) {
  const parts = [];
  const rot = img.rotate || 0;
  if (rot) parts.push(`rotate(${rot}deg)`);
  if (img.flip) parts.push("scaleX(-1)");
  if (img.scale && img.scale !== 1) parts.push(`scale(${img.scale})`);
  return parts.length ? `transform:${parts.join(" ")}` : "";
}

/**
 * Otočená fotka musí rám pořád vyplňovat — potřebné zvětšení závisí
 * na úhlu i na tvaru rámu, proto ho počítáme z reálných rozměrů.
 */
function fitRotated(root = document) {
  $$("img[data-rotate]", root).forEach((im) => {
    const rot = Number(im.dataset.rotate) || 0;
    const base = Number(im.dataset.scale) || 1;
    const box = im.parentElement.getBoundingClientRect();
    let cover = 1;
    if (rot && box.width && box.height) {
      const a = Math.abs(rot) * Math.PI / 180;
      const c = Math.abs(Math.cos(a)), s2 = Math.abs(Math.sin(a));
      cover = Math.max((box.width * c + box.height * s2) / box.width,
                       (box.width * s2 + box.height * c) / box.height);
    }
    const parts = [];
    if (rot) parts.push(`rotate(${rot}deg)`);
    if (im.dataset.flip === "1") parts.push("scaleX(-1)");
    const total = base * cover;
    if (total !== 1) parts.push(`scale(${total.toFixed(3)})`);
    im.style.transform = parts.join(" ");
  });
}

/** Všechny fotky jednoho místa: hlavní + další. */
function imgList(img) {
  const extra = Array.isArray(img.srcs) ? img.srcs : [];
  return [img.src, ...extra].filter(Boolean);
}

/** Která fotka se zobrazí (režim: jedna / náhodně). */
function pickSrc(img) {
  const list = imgList(img);
  if (list.length < 2) return img.src;
  if (img.pick === "random") return list[Math.floor(Math.random() * list.length)];
  return img.src;
}

function imgAttrs(img, path) {
  const filter = [
    `brightness(${img.brightness ?? 1})`,
    `contrast(${img.contrast ?? 1})`,
    `saturate(${img.saturate ?? 1})`,
    `grayscale(${img.grayscale ?? 0})`,
    (img.blur ? `blur(${img.blur}px)` : "")
  ].filter(Boolean).join(" ");
  const style = [
    `opacity:${img.opacity ?? 1}`,
    `object-fit:${img.fit || "cover"}`,
    `object-position:${img.posX ?? 50}% ${img.posY ?? 50}%`,
    `filter:${filter}`,
    imgTransform(img)
  ].filter(Boolean).join(";");
  const needsFit = img.rotate || img.flip;
  const rotAttrs = needsFit
    ? ` data-rotate="${img.rotate || 0}"${img.flip ? ' data-flip="1"' : ""} data-scale="${img.scale || 1}"`
    : "";
  return `src="${esc(img.src)}" alt="${esc(img.alt || "")}" loading="lazy" style="${style}" data-img-path="${path}"${rotAttrs}`;
}

function figure(img, path, extraStyle = "") {
  const st = [`border-radius:${img.radius ?? 2}px`, extraStyle].filter(Boolean).join(";");
  const list = imgList(img);

  if (img.pick === "switch" && list.length > 1) {
    const slides = list.map((src, i) =>
      `<img ${imgAttrs(Object.assign({}, img, { src }), path)} class="slide${i === 0 ? " is-on" : ""}">`).join("");
    const dots = list.map((_, i) =>
      `<button class="slide-dot${i === 0 ? " is-on" : ""}" data-slide-to="${i}" aria-label="Fotka ${i + 1}"></button>`).join("");
    return `<div class="figure has-slides" style="${st}" data-img-slot="${path}" data-slides>
      ${slides}
      <button class="slide-nav prev" data-slide="-1" aria-label="Předchozí fotka">‹</button>
      <button class="slide-nav next" data-slide="1" aria-label="Další fotka">›</button>
      <div class="slide-dots">${dots}</div>
    </div>`;
  }

  const shown = Object.assign({}, img, { src: pickSrc(img) });
  return `<div class="figure" style="${st}" data-img-slot="${path}"><img ${imgAttrs(shown, path)}></div>`;
}

/* ---------- text s vazbou na data ---------- */
function T(path, tag = "span", cls = "") {
  const v = getPath(DATA, path);
  return `<${tag}${cls ? ` class="${cls}"` : ""} data-bind="${path}">${esc(v)}</${tag}>`;
}

/* ---------- téma ---------- */
const MODE_KEY = "kampanela.mode";

/** Světlý / tmavý režim: volba návštěvníka > nastavení webu > systém. */
function effectiveMode() {
  const t = DATA.theme;
  const visitor = (t.allowToggle !== false) ? localStorage.getItem(MODE_KEY) : null;
  const wanted = visitor || t.mode || "light";
  if (wanted === "auto") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return wanted === "dark" ? "dark" : "light";
}

function setMode(mode) {
  if (mode === "auto") localStorage.removeItem(MODE_KEY);
  else localStorage.setItem(MODE_KEY, mode);
  render();
}

function applyTheme() {
  const t = DATA.theme, r = document.documentElement.style;
  const mode = effectiveMode();
  const pal = (t.palettes && t.palettes[mode]) || null;
  if (pal) {
    t.colorBg = pal.bg; t.colorSurface = pal.surface; t.colorInk = pal.ink;
    t.colorMuted = pal.muted; t.colorAccent = pal.accent; t.colorLine = pal.line;
  }
  r.setProperty("--bg", t.colorBg);
  r.setProperty("--surface", t.colorSurface);
  r.setProperty("--ink", t.colorInk);
  r.setProperty("--muted", t.colorMuted);
  r.setProperty("--line", t.colorLine);
  r.setProperty("--brand", t.colorBrand || "#3a82b8");
  const blue = t.blueMode && t.blueMode !== "off";
  r.setProperty("--accent", blue ? (t.colorBrand || "#3a82b8") : t.colorAccent);
  r.setProperty("--display-color", t.blueMode === "headings" ? (t.colorBrand || "#3a82b8") : t.colorInk);
  r.setProperty("--radius", t.radius + "px");
  r.setProperty("--img-radius", t.imgRadius + "px");
  r.setProperty("--maxw", t.maxWidth + "px");
  r.setProperty("--space", t.sectionSpace + "px");
  r.setProperty("--fs", t.baseSize + "px");
  r.setProperty("--scale", t.scale);
  r.setProperty("--ls-display", t.letterDisplay + "em");
  r.setProperty("--ls-nav", (t.letterNav ?? 0.14) + "em");
  r.setProperty("--font-display", `"${t.fontDisplay}", Georgia, serif`);
  r.setProperty("--font-body", `"${t.fontBody}", system-ui, sans-serif`);
  r.setProperty("--nav-size", DATA.nav.size + "px");
  r.setProperty("--secondary-text", t.secondaryText === "brand" ? (t.colorBrand || "#458AC1") : t.colorMuted);
  document.body.dataset.style = t.preset || "klasik";
  document.body.dataset.header = t.headerMode || "normal";
  document.body.classList.toggle("theme-dark", mode === "dark");
  document.body.dataset.mode = mode;
  ensureFonts([t.fontDisplay, t.fontBody]);
  document.title = `${DATA.meta.brand} — ${DATA.meta.tagline}`;
}

const FONT_CHOICES = [
  "Cormorant Garamond", "Playfair Display", "Lora", "Libre Baskerville", "EB Garamond",
  "Inter", "DM Sans", "Jost", "Work Sans", "Karla", "Manrope", "Marcellus", "Spectral"
];
function ensureFonts(list) {
  const need = list.filter(Boolean);
  const id = "gf-link";
  const fams = need.map((f) => `family=${f.replace(/ /g, "+")}:wght@300;400;500;600;700`).join("&");
  const href = `https://fonts.googleapis.com/css2?${fams}&display=swap`;
  let link = document.getElementById(id);
  if (!link) { link = document.createElement("link"); link.id = id; link.rel = "stylesheet"; document.head.appendChild(link); }
  if (link.href !== href) link.href = href;
}

/* ============================================================
   Vykreslení jednotlivých částí
   ============================================================ */

/** Tlačítko slunce/měsíc v hlavičce. */
function modeToggle() {
  if (DATA.theme.allowToggle === false) return "";
  const dark = effectiveMode() === "dark";
  const icon = dark
    ? '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M6.3 6.3 4.8 4.8M19.2 19.2l-1.5-1.5M17.7 6.3l1.5-1.5M4.8 19.2l1.5-1.5"/>'
    : '<path d="M20.5 14.4A8.6 8.6 0 0 1 9.6 3.5a8.6 8.6 0 1 0 10.9 10.9Z"/>';
  return `<button class="mode-toggle" data-mode-toggle aria-label="${dark ? "Přepnout na světlý režim" : "Přepnout na tmavý režim"}">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icon}</svg></button>`;
}

function renderHeader() {
  const n = DATA.nav;
  const links = n.items.map((it, i) =>
    `<a href="#${esc(it.target)}" data-bind="nav.items.${i}.label">${esc(it.label)}</a>`).join("");
  return `
  <header class="site-header${n.sticky ? "" : " is-static"}">
    <div class="wrap header-inner" data-align="${esc(n.align === "left" ? "left" : "center")}">
      <a class="brand" href="#uvod">
        ${logoSvg()}
        <span class="brand-text">
          ${T("meta.brand", "span", "brand-name")}
          ${T("meta.tagline", "span", "brand-sub")}
        </span>
      </a>
      <nav class="site-nav" data-style="${esc(n.style)}" id="siteNav">${links}</nav>
      <div class="header-side">${renderSocial("header")}${modeToggle()}</div>
      <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false">
        <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.4" fill="none">
          <path d="M3 7h18M3 12h18M3 17h18"/></svg>
      </button>
    </div>
  </header>`;
}

/** Pozadí úvodního bloku — fotka nebo video. */
function heroMedia(h) {
  const v = h.video || {};
  if (h.media === "video" && v.src) {
    const filter = `brightness(${v.brightness ?? 1}) saturate(${v.saturate ?? 1})${v.blur ? ` blur(${v.blur}px)` : ""}`;
    return `<div class="figure hero-video" data-video-slot>
      <video autoplay ${v.muted === false ? "" : "muted"} ${v.loop === false ? "" : "loop"} playsinline
             ${v.poster ? `poster="${esc(v.poster)}"` : ""}
             style="opacity:${v.opacity ?? 1};filter:${filter}">
        <source src="${esc(v.src)}">
      </video></div>`;
  }
  return figure(h.image, "hero.image");
}

function renderHero() {
  const h = DATA.hero;
  const copy = `
    <div class="hero-copy reveal">
      ${T("hero.eyebrow", "p", "eyebrow")}
      <h1 data-bind="hero.title">${esc(h.title)}</h1>
      ${T("hero.text", "p", "lead")}
      <div class="hero-actions">
        <a class="btn${h.layout === "overlay" ? " on-image solid" : ""}" href="#${esc(h.ctaPrimary.target)}"
           data-bind="hero.ctaPrimary.label">${esc(h.ctaPrimary.label)}</a>
        <a class="btn ghost${h.layout === "overlay" ? " on-image" : ""}" href="#${esc(h.ctaSecondary.target)}"
           data-bind="hero.ctaSecondary.label">${esc(h.ctaSecondary.label)}</a>
      </div>
    </div>`;

  if (h.layout === "overlay") {
    return `
    <section class="hero hero-overlay" id="uvod" data-align="${esc(h.align)}"
             style="min-height:${h.height}vh;--scrim:${h.overlay};color:${esc(h.textColorOnImage)}">
      ${heroMedia(h)}
      <div class="hero-scrim"></div>
      <div class="wrap">${copy}</div>
    </section>`;
  }
  return `
  <section class="hero" id="uvod" data-align="${esc(h.align)}">
    <div class="wrap hero-split">
      ${copy}
      <div class="hero-media reveal">${figure(h.image, "hero.image", `aspect-ratio:${h.image.ratio}`)}</div>
    </div>
  </section>`;
}

function renderIntro() {
  if (!DATA.intro.show) return "";
  return `
  <section class="intro tight" id="dilna"${spaceStyle("intro")}>
    <canvas class="trail-canvas" data-trail aria-hidden="true"></canvas>
    <div class="wrap intro-grid reveal">
      <div>${T("intro.eyebrow", "p", "eyebrow")}<h2 data-bind="intro.title">${esc(DATA.intro.title)}</h2></div>
      ${T("intro.text", "p", "lead")}
    </div>
  </section>`;
}

function renderCategories() {
  const c = DATA.categories;
  const cards = c.items.map((it, i) => `
    <a class="cat reveal" id="kategorie-${esc(it.id)}" href="#kategorie-${esc(it.id)}" data-caption="${esc(c.captionPos)}" data-cat-index="${i}">
      ${figure(it.image, `categories.items.${i}.image`)}
      <div class="cat-body">
        <div class="cat-head">
          <span class="cat-name" data-bind="categories.items.${i}.name">${esc(it.name)}</span>
          <span class="cat-index">${String(i + 1).padStart(2, "0")}</span>
        </div>
        <div class="cat-desc" data-bind="categories.items.${i}.desc">${esc(it.desc)}</div>
      </div>
    </a>`).join("");
  return `
  ${motifBand("kolekce")}
  <section id="kolekce"${spaceStyle("kolekce")}>
    <div class="wrap">
      <div class="section-head reveal">
        <div>${T("categories.eyebrow", "p", "eyebrow")}<h2 data-bind="categories.title">${esc(c.title)}</h2>
          ${T("categories.text", "p", "lead")}</div>
      </div>
      <div class="cat-grid" style="--cols:${c.columns};--ratio:${esc(c.ratio)}">${cards}</div>
    </div>
  </section>`;
}

function renderFeature() {
  const f = DATA.feature;
  if (!f.show || !f.items || !f.items.length) return "";
  const at = Math.min(f.active || 0, f.items.length - 1);
  const it = f.items[at];
  const base = `feature.items.${at}`;

  const tabs = f.items.length < 2 ? "" : `
    <div class="feat-tabs" role="tablist">
      ${f.items.map((x, i) => `
        <button class="feat-tab${i === at ? " is-on" : ""}" data-feat="${i}"
                role="tab" aria-selected="${i === at}">${esc(x.title)}</button>`).join("")}
    </div>`;

  const bullets = (it.bullets || []).map((b, i) =>
    `<li data-bind="${base}.bullets.${i}">${esc(b)}</li>`).join("");
  const careTopMargin = bullets ? "" : ' style="border-top:0;padding-top:8px"';
  const steps = !it.steps || !it.steps.length ? "" : `
    <div class="care"${careTopMargin}>
      <h3 class="care-title" data-bind="${base}.stepsTitle">${esc(it.stepsTitle)}</h3>
      <ol class="care-list">
        ${it.steps.map((st, i) => `<li>
            <span class="care-num">${i + 1}</span>
            <div><strong data-bind="${base}.steps.${i}.title">${esc(st.title)}</strong>
              <span data-bind="${base}.steps.${i}.text">${esc(st.text)}</span></div>
          </li>`).join("")}
      </ol>
      ${it.stepsNote ? `<p class="care-note" data-bind="${base}.stepsNote">${esc(it.stepsNote)}</p>` : ""}
    </div>`;

  return `
  <section class="tight" id="vybirame"${spaceStyle("vybirame")}>
    <div class="wrap feature-grid${f.reverse ? " reverse" : ""}">
      <div class="feature-media reveal">
        ${figure(it.image, `${base}.image`, `aspect-ratio:${it.image.ratio}`)}
      </div>
      <div class="reveal">
        ${T("feature.eyebrow", "p", "eyebrow")}
        ${tabs}
        <h2 data-bind="${base}.title">${esc(it.title)}</h2>
        <p class="lead" style="margin-top:20px" data-bind="${base}.text">${esc(it.text)}</p>
        ${bullets ? `<ul class="feature-list">${bullets}</ul>` : ""}
        ${steps}
        ${it.ctaLabel ? `<a class="link-arrow" href="#${esc(it.ctaTarget)}" data-bind="${base}.ctaLabel">${esc(it.ctaLabel)}</a>` : ""}
      </div>
    </div>
  </section>`;
}

function renderAbout() {
  const a = DATA.about;
  const stats = a.stats.map((s, i) => `
    <div class="stat">
      <div class="stat-value" data-bind="about.stats.${i}.value">${esc(s.value)}</div>
      <div class="stat-label" data-bind="about.stats.${i}.label">${esc(s.label)}</div>
    </div>`).join("");
  return `
  <section class="about" id="o-dilne"${spaceStyle("oDilne")}>
    <div class="wrap about-grid">
      <div class="reveal">
        ${T("about.eyebrow", "p", "eyebrow")}
        <h2 data-bind="about.title">${esc(a.title)}</h2>
        <p class="lead about-text" style="margin-top:22px" data-bind="about.text">${esc(a.text)}</p>
        <div class="stats">${stats}</div>
        ${!a.markets || !a.markets.length ? "" : `<div class="markets">
          <div class="markets-title" data-bind="about.marketsTitle">${esc(a.marketsTitle)}</div>
          <ul class="markets-list">${a.markets.map((m, i) =>
            `<li data-bind="about.markets.${i}">${esc(m)}</li>`).join("")}</ul>
        </div>`}
      </div>
      <div class="reveal">${figure(a.image, "about.image", `aspect-ratio:${a.image.ratio}`)}</div>
    </div>
  </section>`;
}

function renderGallery() {
  const g = DATA.gallery;
  const items = g.items.map((it, i) => `
    <figure class="gal-item reveal" data-span="${g.layout === "mosaic" ? (it.span || 1) : 1}" data-lightbox="${esc(it.image.src)}">
      ${figure(it.image, `gallery.items.${i}.image`)}
      <figcaption class="gal-cap" data-bind="gallery.items.${i}.caption">${esc(it.caption)}</figcaption>
    </figure>`).join("");
  return `
  ${motifBand("galerie")}
  <section id="galerie"${spaceStyle("galerie")}>
    <div class="wrap">
      <div class="section-head reveal">
        <div>${T("gallery.eyebrow", "p", "eyebrow")}<h2 data-bind="gallery.title">${esc(g.title)}</h2></div>
      </div>
      <div class="gal-grid" style="--cols:${g.columns};--gap:${g.gap}px">${items}</div>
    </div>
  </section>`;
}

function renderContact() {
  const c = DATA.contact;
  const rows = c.rows.map((r, i) => `
    <div class="contact-row">
      <dt data-bind="contact.rows.${i}.label">${esc(r.label)}</dt>
      <dd>${r.href ? `<a href="${esc(r.href)}" data-bind="contact.rows.${i}.value">${esc(r.value)}</a>`
                   : `<span data-bind="contact.rows.${i}.value">${esc(r.value)}</span>`}</dd>
    </div>`).join("");
  const pull = Number(c.pullUp) || 0;
  return `
  ${motifBand("kontakt")}
  <section id="kontakt"${spaceStyle("kontakt", pull ? `margin-top:-${pull}px` : "")}>
    <div class="wrap contact-grid">
      <div class="reveal">
        ${T("contact.eyebrow", "p", "eyebrow")}
        <h2 data-bind="contact.title">${esc(c.title)}</h2>
        <p class="lead" style="margin-top:20px" data-bind="contact.text">${esc(c.text)}</p>
        <div style="margin-top:32px">${renderSocial("footer")}</div>
      </div>
      <dl class="contact-rows reveal">${rows}</dl>
    </div>
  </section>`;
}

/**
 * Plynulý přechod průhlednosti fotky v patičce: nahoře nejprůhlednější,
 * dole nejsytější. „fadeMid“ posouvá těžiště přechodu.
 */
function footerFade(bg) {
  const top = 1 - (bg.transTop ?? 97) / 100;       // viditelnost nahoře
  const bottom = 1 - (bg.transBottom ?? 5) / 100;  // viditelnost dole
  const mid = (bg.fadeMid ?? 45) / 100;
  const stops = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    // těžiště přechodu posuneme podle „mid“ (0,5 = rovnoměrně)
    const shaped = Math.pow(t, Math.log(0.5) / Math.log(Math.min(0.95, Math.max(0.05, mid))));
    const eased = shaped * shaped * (3 - 2 * shaped);            // plynulé rozjetí i dojezd
    const v = top + (bottom - top) * eased;
    stops.push(`rgba(0,0,0,${v.toFixed(3)}) ${(t * 100).toFixed(0)}%`);
  }
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

/** Fotka na spodku stránky — může sahat i výš, za kontakt. */
function renderPageBg() {
  const b = DATA.footer.bg;
  if (!b || !b.show) return "";
  return `<div class="page-bg" style="--fbg:${b.height}px;--fade:${footerFade(b)}">
    ${figure(b.image, "footer.bg.image")}</div>`;
}

function renderFooter() {
  const f = DATA.footer;
  const hasBg = !!(f.bg && f.bg.show);
  return `
  <footer class="site-footer${hasBg ? " has-bg" : ""}" style="--fbg:${(f.bg && f.bg.height) || 0}px">
    <div class="wrap footer-inner">
      ${motifBand("paticka")}
      ${T("footer.note", "div", "footer-note")}
      <div class="footer-meta">
        <span data-bind="footer.copyright">${esc(f.copyright)}</span>
        <span class="footer-sep">|</span>
        <span data-bind="footer.credit">${esc(f.credit)}</span>
      </div>
    </div>
  </footer>`;
}

/* ---------- hlavní render ---------- */
function render() {
  applyTheme();
  $("#app").innerHTML =
    renderHeader() + renderHero() + renderIntro() + renderCategories() +
    renderFeature() + renderAbout() + renderGallery() + renderContact() + renderFooter() + renderPageBg();
  wireUp();
  if (window.Editor) Editor.afterRender();
}

/* ---------- chování stránky ---------- */
function wireUp() {
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.removeEventListener("scroll", window.__kScroll || (() => {}));
  window.__kScroll = onScroll;
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = $("#navToggle"), nav = $("#siteNav");
  if (toggle) toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("#siteNav a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

  fitRotated();
  initTrail();
  $$("img[data-rotate]").forEach((im) => im.addEventListener("load", () => fitRotated()));
  window.removeEventListener("resize", window.__kFit || (() => {}));
  window.__kFit = () => fitRotated();
  window.addEventListener("resize", window.__kFit);

  // přepínání položek v sekci Vybíráme
  $$("[data-feat]").forEach((b) => b.addEventListener("click", (e) => {
    e.preventDefault();
    DATA.feature.active = Number(b.dataset.feat);
    saveData();
    render();
    const box = $("#vybirame");
    if (box) box.classList.add("feat-swap");
  }));

  // přepínání fotek v místech, kde je jich víc
  $$("[data-slides]").forEach((box) => {
    const slides = $$(".slide", box), dots = $$(".slide-dot", box);
    let at = 0;
    const show = (i) => {
      at = (i + slides.length) % slides.length;
      slides.forEach((el, k) => el.classList.toggle("is-on", k === at));
      dots.forEach((el, k) => el.classList.toggle("is-on", k === at));
    };
    $$("[data-slide]", box).forEach((b) => b.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation(); show(at + Number(b.dataset.slide));
    }));
    dots.forEach((b) => b.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation(); show(Number(b.dataset.slideTo));
    }));
  });

  $$("[data-mode-toggle]").forEach((b) => b.addEventListener("click", () => {
    setMode(effectiveMode() === "dark" ? "light" : "dark");
  }));

  // aktivní položka menu podle scrollu
  const sections = $$("section[id]");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      $$("#siteNav a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  // postupné odkrývání
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((e, idx) => {
      if (!e.isIntersecting) return;
      e.target.style.transitionDelay = Math.min(idx * 70, 280) + "ms";
      e.target.classList.add("in");
      obs.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  // lightbox v galerii
  $$("[data-lightbox]").forEach((el) => el.addEventListener("click", (ev) => {
    if (document.body.classList.contains("editing")) return;
    ev.preventDefault();
    const lb = $("#lightbox");
    $("#lightboxImg").src = el.dataset.lightbox;
    lb.classList.add("open");
  }));
}

window.addEventListener("beforeunload", () => {
  // poslední změny odešleme i při zavření okna
  clearTimeout(serverTimer);
  try {
    const payload = JSON.stringify(Object.assign({ __stamp: fileStamp }, DATA));
    navigator.sendBeacon("/api/save", new Blob([payload], { type: "application/json" }));
  } catch (e) { /* nevadí */ }
});

document.addEventListener("DOMContentLoaded", () => {
  render();
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if ((DATA.theme.mode || "light") === "auto" && !localStorage.getItem(MODE_KEY)) render();
  });
  loadLocalIfNoServer();
  const lb = $("#lightbox");
  lb.addEventListener("click", () => lb.classList.remove("open"));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") lb.classList.remove("open"); });
});
