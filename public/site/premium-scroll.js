(() => {
const SECTION_SELECTOR = ".stack-section";
const DESKTOP_QUERY = "(min-width: 900px) and (pointer: fine)";
const LOCK_MS = 980;
const WHEEL_THRESHOLD = 16;

let sections = [];
let navLinks = [];
let dots = [];
let progress = null;
let lenis = null;
let lockedUntil = 0;
let activeIndex = 0;
let initialized = false;

const desktopQuery = window.matchMedia(DESKTOP_QUERY);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function isDesktop() {
  return desktopQuery.matches && !reduceMotion.matches;
}

function slideTop(index) {
  if (isDesktop()) return Math.round(index * window.innerHeight);
  return Math.round(sections[index]?.offsetTop || 0);
}

function currentIndex() {
  if (!sections.length) return 0;
  if (isDesktop()) return Math.max(0, Math.min(Math.round(window.scrollY / window.innerHeight), sections.length - 1));
  return sections.reduce(
    (best, section, index) => {
      const distance = Math.abs(section.offsetTop - window.scrollY);
      return distance < best.distance ? { index, distance } : best;
    },
    { index: 0, distance: Infinity },
  ).index;
}

function setActive(index) {
  activeIndex = Math.max(0, Math.min(index, sections.length - 1));
  const id = sections[activeIndex]?.id;
  navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`));
  dots.forEach((dot) => dot.classList.toggle("is-active", dot.getAttribute("data-section-dot") === id));
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  }
}

function updateHash(index) {
  const section = sections[index];
  if (!section) return;
  const url = section.id === "hero" ? `${location.pathname}${location.search}` : `#${section.id}`;
  history.replaceState(null, "", url);
}

function scrollToIndex(index, immediate = false) {
  if (!sections.length) refreshElements();
  const target = Math.max(0, Math.min(index, sections.length - 1));
  const top = slideTop(target);
  lockedUntil = Date.now() + (immediate ? 80 : LOCK_MS);
  setActive(target);
  updateHash(target);

  if (lenis && isDesktop()) {
    lenis.scrollTo(top, {
      immediate,
      duration: immediate ? 0 : 1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      lock: true,
    });
  } else {
    window.scrollTo({ top, behavior: immediate || reduceMotion.matches ? "auto" : "smooth" });
  }
}

function goToId(id, immediate = false) {
  if (!sections.length) refreshElements();
  const index = sections.findIndex((section) => section.id === id);
  if (index >= 0) scrollToIndex(index, immediate);
  document.body.classList.remove("mobile-menu-open");
  return false;
}

window.MlynGoTo = goToId;

function scrollByDirection(direction) {
  if (!isDesktop()) return false;
  if (Date.now() < lockedUntil) return true;
  const next = Math.max(0, Math.min(currentIndex() + Math.sign(direction), sections.length - 1));
  if (next === currentIndex()) return false;
  scrollToIndex(next);
  return true;
}

function canScrollInside(target, deltaY) {
  if (!(target instanceof Element)) return false;
  if (target.closest("iframe, .equipment-frame-shell")) return true;
  const panel = target.closest("[data-scrollable]");
  if (!panel) return false;
  const style = window.getComputedStyle(panel);
  const scrollable = /(auto|scroll)/.test(style.overflowY) && panel.scrollHeight > panel.clientHeight + 1;
  if (!scrollable) return false;
  const atTop = panel.scrollTop <= 1;
  const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
  return (deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom);
}

function refreshElements() {
  sections = [...document.querySelectorAll(SECTION_SELECTOR)];
  navLinks = [...document.querySelectorAll("[data-scroll-link]")];
  dots = [...document.querySelectorAll("[data-section-dot]")];
  progress = document.querySelector("[data-progress]");
}

function setupLenis() {
  if (!window.Lenis || reduceMotion.matches || lenis) return;
  lenis = new window.Lenis({
    duration: 1,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    smoothWheel: false,
    syncTouch: false,
  });
  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  lenis.on("scroll", () => {
    setActive(currentIndex());
    window.ScrollTrigger?.update();
  });
}

function setupGsapScenes() {
  if (!window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);
  window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  sections.forEach((section, index) => {
    const content = section.querySelector(".section-content, .history-caption");
    if (content) {
      window.gsap.fromTo(
        content,
        { autoAlpha: index === 0 ? 1 : 0.35, y: index === 0 ? 0 : 64 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 24%",
            scrub: 0.5,
          },
        },
      );
    }
  });
}

function setupThreeTexture() {
  const canvas = document.querySelector("[data-painted-texture]");
  if (!canvas || !window.THREE || reduceMotion.matches || canvas.dataset.threeReady === "1") return;
  canvas.dataset.threeReady = "1";

  const renderer = new window.THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new window.THREE.Scene();
  const camera = new window.THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new window.THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new window.THREE.Vector2(1, 1) },
  };
  const material = new window.THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms,
    vertexShader: "void main(){gl_Position=vec4(position,1.0);}",
    fragmentShader: `
      precision mediump float;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      float wave(vec2 p, float scale, float speed) {
        return sin((p.x + p.y) * scale + uTime * speed) * .5 + .5;
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / max(uResolution, vec2(1.0));
        vec2 pull = (uMouse - uv) * .16;
        float paint = wave(uv + pull, 9.0, .16) * wave(uv.yx - pull, 5.5, -.12);
        float cursor = smoothstep(.62, .0, length(uMouse - uv));
        vec3 deep = vec3(.025, .035, .045);
        vec3 amber = vec3(.45, .32, .16);
        vec3 color = mix(deep, amber, paint * .45 + cursor * .38);
        gl_FragColor = vec4(color, .12 + cursor * .16);
      }
    `,
  });
  scene.add(new window.THREE.Mesh(new window.THREE.PlaneGeometry(2, 2), material));

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(ratio);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener(
    "pointermove",
    (event) => {
      uniforms.uMouse.value.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    },
    { passive: true },
  );
  resize();
  function render(time) {
    uniforms.uTime.value = time * 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function bindEvents() {
  window.addEventListener(
    "wheel",
    (event) => {
      if (!isDesktop()) return;
      if (event.ctrlKey || Math.abs(event.deltaY) < WHEEL_THRESHOLD || canScrollInside(event.target, event.deltaY)) return;
      event.preventDefault();
      scrollByDirection(event.deltaY);
    },
    { passive: false },
  );

  window.addEventListener("keydown", (event) => {
    if (!isDesktop() || event.defaultPrevented) return;
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (["input", "textarea", "select"].includes(tag)) return;
    if (["ArrowDown", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      scrollByDirection(1);
    }
    if (["ArrowUp", "PageUp"].includes(event.key)) {
      event.preventDefault();
      scrollByDirection(-1);
    }
  });

  document.addEventListener(
    "click",
    (event) => {
      const link = event.target instanceof Element ? event.target.closest("[data-scroll-link]") : null;
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      const id = href.slice(1);
      if (!sections.some((section) => section.id === id)) return;
      event.preventDefault();
      goToId(id);
    },
    true,
  );

  window.addEventListener("scroll", () => setActive(currentIndex()), { passive: true });
  window.addEventListener("resize", () => {
    setActive(currentIndex());
    window.ScrollTrigger?.refresh();
  }, { passive: true });
  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "");
    if (id) goToId(id, true);
  });
}

function init() {
  refreshElements();
  if (!sections.length) return null;
  if (!initialized) {
    initialized = true;
    bindEvents();
  }
  setupLenis();
  setupGsapScenes();
  setupThreeTexture();
  const hash = location.hash.replace("#", "");
  if (hash && sections.some((section) => section.id === hash)) {
    requestAnimationFrame(() => goToId(hash, true));
  } else {
    setActive(currentIndex());
  }
  window.__mlynPremiumScrollApi = { scrollToIndex, goToId, scrollByDirection, currentIndex };
  return window.__mlynPremiumScrollApi;
}

window.MlynPremiumScroll = { setupPremiumScroll: init };

if (document.readyState !== "loading") {
  setTimeout(init, 0);
} else {
  document.addEventListener("DOMContentLoaded", init, { once: true });
}
})();
