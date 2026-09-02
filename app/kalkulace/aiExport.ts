"use client";

// Export zakázky pro AI i pro člověka.
// Vytvoří kótovaný nákres stěn (SVG – čitelný okem, text v něm je strojově čitelný)
// a strukturovaný popis v Markdownu s kompletními rozměry.

import { f2, inferOtherOpening, n, openingKind, outerOpening, revealArea, scopeText, wallArcs, wallGaps, wallStats } from "./core";

const esc = (value: any) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const kindLabel = (opening: any) => {
  const kind = openingKind(opening);
  if (kind === "door") return "Dveře";
  if (kind === "window") return "Okno";
  return inferOtherOpening(opening).label;
};

// ---------- kótovaný nákres jedné stěny ----------

const SCALE = 0.5; // 1 cm = 0,5 px
const PAD = { left: 70, right: 40, top: 64, bottom: 64 };

function wallSvg(wall: any, index: number, geometryOnly = false) {
  const width = Math.max(1, n(wall.width));
  const height = Math.max(1, n(wall.height));
  const arcs = wallArcs(wall);
  const riseMax = arcs.length ? Math.max(...arcs.map((arc: any) => arc.rise)) : 0;
  const w = width * SCALE;
  const h = height * SCALE;
  const riseH = riseMax * SCALE;
  const boxW = w + PAD.left + PAD.right;
  const boxH = h + riseH + PAD.top + PAD.bottom;
  const x0 = PAD.left;
  const y0 = PAD.top + riseH; // horní hrana stěny
  const yBottom = y0 + h;
  const parts: string[] = [];

  parts.push(`<text x="${x0}" y="24" font-size="15" font-weight="700" fill="#111">${esc(wall.name)}${wall.ceiling ? " (strop)" : ""}</text>`);
  // v režimu pro architekta se vynechá rozsah prací i „čistá“ plocha (to jsou údaje pro nacenění)
  parts.push(
    geometryOnly
      ? `<text x="${x0}" y="42" font-size="12" fill="#555">${width} × ${height} cm · plocha stěny ${f2(wallStats(wall).gross)} m²</text>`
      : `<text x="${x0}" y="42" font-size="12" fill="#555">${width} × ${height} cm · ${scopeText(wall.scope)} · čistá plocha ${f2(wallStats(wall).clean)} m²</text>`,
  );

  // stěna
  parts.push(`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#fafafa" stroke="#111" stroke-width="2"/>`);

  // klenby na horní hraně
  arcs.forEach((arc: any) => {
    const ax0 = x0 + arc.from * SCALE;
    const ax1 = x0 + arc.to * SCALE;
    const apexX = x0 + arc.x * SCALE;
    const apexY = y0 - arc.rise * SCALE;
    parts.push(
      `<path d="M ${ax0} ${y0} Q ${2 * apexX - (ax0 + ax1) / 2} ${2 * apexY - y0} ${ax1} ${y0}" fill="none" stroke="#820c0c" stroke-width="2"/>`,
    );
    parts.push(`<text x="${apexX}" y="${apexY - 6}" font-size="11" text-anchor="middle" fill="#820c0c">↑${Math.round(arc.rise)}</text>`);
  });
  wallGaps(wall)
    .filter((gap: any) => gap.width > 0)
    .forEach((gap: any) => {
      parts.push(`<line x1="${x0 + gap.from * SCALE}" y1="${y0}" x2="${x0 + gap.to * SCALE}" y2="${y0}" stroke="#0f766e" stroke-width="4"/>`);
      parts.push(
        `<text x="${x0 + ((gap.from + gap.to) / 2) * SCALE}" y="${y0 - 6}" font-size="10" text-anchor="middle" fill="#0f766e">mezera ${Math.round(gap.width)}</text>`,
      );
    });

  // otvory + kóty
  wall.openings.forEach((opening: any) => {
    const ow = Math.max(0, n(opening.width));
    const oh = Math.max(0, n(opening.height));
    const ox = Math.max(0, n(opening.x));
    const oy = Math.max(0, n(opening.y));
    const rx = x0 + ox * SCALE;
    const ry = yBottom - (oy + oh) * SCALE;
    const rw = ow * SCALE;
    const rh = oh * SCALE;
    const kind = openingKind(opening);
    const fill = kind === "door" ? "#fef3c7" : kind === "window" ? "#e0f2fe" : "#f4f4f5";
    const stroke = kind === "door" ? "#92400e" : kind === "window" ? "#0369a1" : "#525252";
    parts.push(`<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`);
    parts.push(
      `<text x="${rx + rw / 2}" y="${ry + rh / 2}" font-size="10" font-weight="700" text-anchor="middle" fill="${stroke}">${esc(kindLabel(opening))}</text>`,
    );
    parts.push(`<text x="${rx + rw / 2}" y="${ry + rh / 2 + 12}" font-size="9" text-anchor="middle" fill="${stroke}">${ow}×${oh}</text>`);
    // špaleta (ostění): čárkovaně vnější konec otvoru + popis hloubky
    const depth = Math.max(0, n(opening.reveal));
    if (depth > 0) {
      const outer = outerOpening(opening);
      const insetX = Math.max(0, ((ow - outer.width) / 2)) * SCALE;
      const onFloor = kind === "door" || oy === 0;
      const insetTop = Math.max(0, (oh - outer.height) / 2) * SCALE;
      const insetBottom = onFloor ? 0 : insetTop;
      parts.push(
        `<rect x="${rx + insetX}" y="${ry + insetTop}" width="${Math.max(1, rw - 2 * insetX)}" height="${Math.max(1, rh - insetTop - insetBottom)}" fill="none" stroke="${stroke}" stroke-width="1" stroke-dasharray="4 3"/>`,
      );
      parts.push(
        `<text x="${rx + rw / 2}" y="${ry + rh / 2 + 24}" font-size="8" text-anchor="middle" fill="${stroke}">špaleta ${depth}${opening.revealSquare === false ? ` · venku ${outer.width}×${outer.height}` : ""}</text>`,
      );
    }
    // vodorovná kóta šířky otvoru
    parts.push(`<line x1="${rx}" y1="${ry - 8}" x2="${rx + rw}" y2="${ry - 8}" stroke="${stroke}" stroke-width="0.8"/>`);
    parts.push(`<text x="${rx + rw / 2}" y="${ry - 11}" font-size="9" text-anchor="middle" fill="${stroke}">${ow}</text>`);
    // kóta odsazení zleva
    parts.push(`<line x1="${x0}" y1="${yBottom + 16}" x2="${rx}" y2="${yBottom + 16}" stroke="#777" stroke-width="0.8"/>`);
    parts.push(`<text x="${(x0 + rx) / 2}" y="${yBottom + 13}" font-size="9" text-anchor="middle" fill="#777">${ox}</text>`);
    if (oy > 0) {
      parts.push(`<line x1="${rx - 6}" y1="${yBottom}" x2="${rx - 6}" y2="${ry + rh}" stroke="#777" stroke-width="0.8"/>`);
      parts.push(`<text x="${rx - 9}" y="${yBottom - (oy * SCALE) / 2}" font-size="9" text-anchor="end" fill="#777">${oy}</text>`);
    }
  });

  // hlavní kóty stěny
  parts.push(`<line x1="${x0}" y1="${yBottom + 40}" x2="${x0 + w}" y2="${yBottom + 40}" stroke="#111" stroke-width="1"/>`);
  parts.push(`<text x="${x0 + w / 2}" y="${yBottom + 36}" font-size="12" font-weight="700" text-anchor="middle" fill="#111">${width} cm</text>`);
  parts.push(`<line x1="${x0 - 34}" y1="${y0}" x2="${x0 - 34}" y2="${yBottom}" stroke="#111" stroke-width="1"/>`);
  parts.push(
    `<text x="${x0 - 38}" y="${y0 + h / 2}" font-size="12" font-weight="700" text-anchor="middle" fill="#111" transform="rotate(-90 ${x0 - 38} ${y0 + h / 2})">${height} cm</text>`,
  );

  return { svg: parts.join("\n"), boxW, boxH };
}

// Celý nákres (všechny stěny pod sebou) jako samostatný SVG soubor.
// ---------- kótovaný půdorys místnosti ----------

// Směry pro odvozený obdélníkový obrys (stejné pořadí jako ve 3D náhledu).
const PLAN_DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

/**
 * Obrys místnosti: buď nakreslený půdorys, nebo — když chybí — stěny
 * poskládané za sebe s pravoúhlým otočením, jak to dělá i 3D náhled.
 */
function roomOutline(room: any) {
  if (room.plan?.points?.length >= 3) return room.plan.points;
  const walls = (room.walls || []).filter((w: any) => !w.ceiling);
  if (walls.length < 3) return null;
  let x = 0;
  let y = 0;
  return walls.map((wall: any, index: number) => {
    const corner = { x, y };
    const dir = PLAN_DIRS[index % 4];
    const length = Math.max(1, n(wall.width));
    x += dir[0] * length;
    y += dir[1] * length;
    return corner;
  });
}

/** Obrys půdorysu s délkami stran a popisky stěn. Bez plánu vrací null. */
function planSvg(room: any) {
  const points = roomOutline(room);
  if (!points || points.length < 3) return null;

  const xs = points.map((p: any) => n(p.x));
  const ys = points.map((p: any) => n(p.y));
  const spanX = Math.max(...xs) - Math.min(...xs);
  const spanY = Math.max(...ys) - Math.min(...ys);
  // vejde se do stejné šířky jako pohledy na stěny
  const scale = Math.min(SCALE, 420 / Math.max(1, spanX), 320 / Math.max(1, spanY));
  const w = spanX * scale;
  const h = spanY * scale;
  // špalety vystupují z obrysu ven – o jejich hloubku se musí rozestoupit i okraje
  const maxReveal = Math.max(0, ...(room.walls || []).flatMap((wall: any) => (wall.openings || []).map((o: any) => n(o.reveal))));
  const revealPad = Math.round(maxReveal * scale);
  // nahoře i po stranách je místo navíc na kóty, ať nelezou do titulku
  const TOP = PAD.top + 26 + revealPad;
  const boxW = w + PAD.left + PAD.right + 60 + revealPad * 2;
  const boxH = h + TOP + PAD.bottom + 20 + revealPad;
  const px = (v: number) => PAD.left + 30 + revealPad + (v - Math.min(...xs)) * scale;
  const py = (v: number) => TOP + (v - Math.min(...ys)) * scale;

  const parts: string[] = [];
  parts.push(`<text x="${PAD.left}" y="24" font-size="15" font-weight="700" fill="#111">Půdorys — ${esc(room.name)}</text>`);
  parts.push(
    `<text x="${PAD.left}" y="42" font-size="12" fill="#555">podlahová plocha ${f2(planArea(points))} m² · obvod ${Math.round(planPerimeter(points))} cm</text>`,
  );

  const d = points.map((p: any, i: number) => `${i ? "L" : "M"} ${px(n(p.x))} ${py(n(p.y))}`).join(" ") + " Z";
  parts.push(`<path d="${d}" fill="#f1f5f9" stroke="#111" stroke-width="2" stroke-linejoin="round"/>`);

  // těžiště obrysu – kolmice od něj míří ven z místnosti (stejně jako špalety ve 3D)
  const cx = points.reduce((sum: number, p: any) => sum + px(n(p.x)), 0) / points.length;
  const cy = points.reduce((sum: number, p: any) => sum + py(n(p.y)), 0) / points.length;

  // Otvory v obrysu: dveře a okna vyznačíme barevným úsekem přímo na stěně,
  // aby bylo z půdorysu vidět, kde jsou a jak jsou široké.
  points.forEach((p: any, i: number) => {
    const wall = room.walls?.[i];
    if (!wall?.openings?.length) return;
    const q = points[(i + 1) % points.length];
    const ax = px(n(p.x));
    const ay = py(n(p.y));
    const bx = px(n(q.x));
    const by = py(n(q.y));
    const wallLength = Math.max(1, n(wall.width));
    const ux = (bx - ax) / wallLength;
    const uy = (by - ay) / wallLength;

    wall.openings.forEach((opening: any) => {
      const kind = openingKind(opening);
      if (kind === "other") return; // rozvaděče, trámy a spol. do půdorysu nepatří
      const ow = Math.max(1, n(opening.width));
      const from = Math.max(0, Math.min(wallLength - ow, n(opening.x)));
      const sx = ax + ux * from;
      const sy = ay + uy * from;
      const ex = ax + ux * (from + ow);
      const ey = ay + uy * (from + ow);
      const color = kind === "door" ? "#b45309" : "#0284c7";

      // Náznak špalety: ostění vystupuje z obrysu ven (obrys = vnitřní líc stěny).
      // U šikmé špalety je vnější konec užší, takže vznikne lichoběžník.
      const depth = Math.max(0, n(opening.reveal));
      if (depth > 0) {
        const len = Math.max(1, Math.hypot(bx - ax, by - ay));
        let rnx = -((by - ay) / len);
        let rny = (bx - ax) / len;
        const midX = (sx + ex) / 2;
        const midY = (sy + ey) / 2;
        if ((midX - cx) * rnx + (midY - cy) * rny < 0) {
          rnx = -rnx;
          rny = -rny;
        }
        const outer = outerOpening(opening);
        const inset = Math.max(0, (ow - outer.width) / 2);
        const ox1 = ax + ux * (from + inset) + rnx * depth * scale;
        const oy1 = ay + uy * (from + inset) + rny * depth * scale;
        const ox2 = ax + ux * (from + ow - inset) + rnx * depth * scale;
        const oy2 = ay + uy * (from + ow - inset) + rny * depth * scale;
        const poly = [
          [sx, sy],
          [ex, ey],
          [ox2, oy2],
          [ox1, oy1],
        ]
          .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
          .join(" ");
        parts.push(`<polygon points="${poly}" fill="#e2e8f0" fill-opacity="0.9" stroke="${color}" stroke-width="0.8" stroke-dasharray="3 2"/>`);
        // popisek doprostřed špalety – venku by se tloukl s kótou délky stěny
        if (depth * scale >= 12) {
          parts.push(
            `<text x="${(midX + rnx * depth * scale * 0.5).toFixed(1)}" y="${(midY + rny * depth * scale * 0.5).toFixed(1)}" font-size="8" text-anchor="middle" dominant-baseline="middle" fill="#64748b">špaleta ${depth}</text>`,
          );
        }
      }

      // silná čára překryje obrys – čitelné i v malém měřítku
      parts.push(
        `<line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#ffffff" stroke-width="7" stroke-linecap="butt"/>`,
      );
      parts.push(
        `<line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="${color}" stroke-width="5" stroke-linecap="butt"><title>${esc(kindLabel(opening))} ${ow} cm</title></line>`,
      );
    });
  });

  // délka a název stěny u každé strany, vždy vně obrysu
  points.forEach((p: any, i: number) => {
    const q = points[(i + 1) % points.length];
    const ax = px(n(p.x));
    const ay = py(n(p.y));
    const bx = px(n(q.x));
    const by = py(n(q.y));
    const length = Math.round(Math.hypot(n(q.x) - n(p.x), n(q.y) - n(p.y)));
    const mx = (ax + bx) / 2;
    const my = (ay + by) / 2;
    // kolmice k hraně otočená vždy směrem od těžiště, ať popisek nepadne dovnitř
    const len = Math.max(1, Math.hypot(bx - ax, by - ay));
    let nx = -((by - ay) / len);
    let ny = (bx - ax) / len;
    if ((mx - cx) * nx + (my - cy) * ny < 0) {
      nx = -nx;
      ny = -ny;
    }
    // u stěny se špaletou musí kóta ustoupit až za ni, jinak si sednou na sebe
    const deepest = Math.max(0, ...((room.walls?.[i]?.openings || []) as any[]).map((o: any) => n(o.reveal)));
    const offset = Math.max(20, deepest * scale + 16);
    const lx = mx + nx * offset;
    const ly = my + ny * offset;
    const wallName = room.walls?.[i]?.name;
    // délka a název pod sebou v jednom bloku – dvě samostatné značky se u
    // svislých stran překrývaly
    parts.push(
      `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="12" font-weight="700" fill="#111" text-anchor="middle" dominant-baseline="middle">` +
        `<tspan x="${lx.toFixed(1)}" dy="0">${length} cm</tspan>` +
        (wallName ? `<tspan x="${lx.toFixed(1)}" dy="13" font-size="10" font-weight="400" fill="#64748b">${esc(wallName)}</tspan>` : "") +
        `</text>`,
    );
  });

  // rohy se souřadnicemi, ať jde půdorys zrekonstruovat
  points.forEach((p: any) => {
    parts.push(`<circle cx="${px(n(p.x))}" cy="${py(n(p.y))}" r="3" fill="#111"/>`);
  });

  // legenda k barvám otvorů
  const hasOpening = (test: (kind: string) => boolean) =>
    (room.walls || []).some((wall: any) => (wall.openings || []).some((o: any) => test(openingKind(o))));
  const legend: string[] = [];
  if (hasOpening((k) => k === "door")) legend.push(`<tspan fill="#b45309">━</tspan> dveře`);
  if (hasOpening((k) => k === "window")) legend.push(`<tspan fill="#0284c7">━</tspan> okna`);
  if (legend.length) {
    parts.push(
      `<text x="${PAD.left}" y="${(TOP + h + 44).toFixed(1)}" font-size="11" fill="#555">${legend.join("  ")}</text>`,
    );
  }

  return { svg: parts.join("\n"), boxW, boxH };
}

export function buildDrawingSvg(rooms: any[], meta: any, company: any, geometryOnly = false) {
  const blocks: { svg: string; boxW: number; boxH: number; title: string }[] = [];
  rooms.forEach((room: any) => {
    // půdorys jako první — dává pohledům na stěny kontext
    const plan = planSvg(room);
    if (plan) blocks.push({ ...plan, title: `${room.name} – půdorys` });
    room.walls.forEach((wall: any, index: number) => {
      const block = wallSvg(wall, index, geometryOnly);
      blocks.push({ ...block, title: rooms.length > 1 ? `${room.name} – ${wall.name}` : wall.name });
    });
  });
  const totalW = Math.max(560, ...blocks.map((b) => b.boxW));
  const headH = 56;
  const totalH = headH + blocks.reduce((sum, b) => sum + b.boxH + 12, 0);
  let y = headH;
  const body = blocks
    .map((block) => {
      const g = `<g transform="translate(0 ${y})">${block.svg}</g>`;
      y += block.boxH + 12;
      return g;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}" font-family="system-ui, sans-serif">
<rect width="${totalW}" height="${totalH}" fill="#ffffff"/>
<text x="24" y="28" font-size="17" font-weight="800" fill="#111">${esc(meta?.name || (geometryOnly ? "Zaměření místnosti" : "Nacenění"))}</text>
<text x="24" y="46" font-size="12" fill="#555">${esc(company?.name || "")} · rozměry v cm · kóty: šířka nahoře, odsazení zleva dole, výška od podlahy vlevo</text>
${body}
</svg>`;
}

// ---------- strojově i lidsky čitelný popis ----------

// Plocha půdorysu z obrysu (Gaussova formule), v m².
const planArea = (points: any[]) =>
  Math.abs(points.reduce((sum: number, p: any, i: number) => {
    const q = points[(i + 1) % points.length];
    return sum + (n(p.x) * n(q.y) - n(q.x) * n(p.y));
  }, 0)) / 2 / 10000;

const planPerimeter = (points: any[]) =>
  points.reduce((sum: number, p: any, i: number) => {
    const q = points[(i + 1) % points.length];
    return sum + Math.hypot(n(q.x) - n(p.x), n(q.y) - n(p.y));
  }, 0);

// mode: "full" = kompletní podklad pro nacenění, "geometry" = jen zaměření a vzhled (pro architekta)
export function buildAiMarkdown({ rooms, works, settings, calc, meta, customer, mode = "full" }: any) {
  const geometryOnly = mode === "geometry";
  const lines: string[] = [];
  lines.push(`# ${geometryOnly ? "Zaměření prostoru" : "Zakázka"}: ${meta?.name || "bez názvu"}`);
  if (customer?.name && !geometryOnly) lines.push(`Zákazník: ${customer.name}`);
  lines.push("");
  lines.push("Všechny rozměry jsou v centimetrech, plochy v m². Osa X je vodorovně po stěně zleva, Y je výška od podlahy.");
  if (geometryOnly) {
    lines.push("");
    lines.push("Špaleta = hloubka ostění otvoru (odpovídá tloušťce zdi v místě otvoru). Oblouk = vzepětí nad rovným nadpražím.");
  }
  lines.push("");

  rooms.forEach((room: any) => {
    const kind = room.kind === "facade" ? "fasáda (venkovní pohled)" : "interiér";
    lines.push(`## ${room.name} — ${kind}`);
    const heights = room.walls.filter((w: any) => !w.ceiling).map((w: any) => n(w.height));
    if (heights.length) lines.push(`Světlá výška: ${Math.min(...heights)}–${Math.max(...heights)} cm`);
    if (room.plan?.points?.length) {
      lines.push(`Podlahová plocha: ${f2(planArea(room.plan.points))} m² · obvod ${Math.round(planPerimeter(room.plan.points))} cm`);
      lines.push(`Půdorys (souřadnice rohů v cm): ${room.plan.points.map((p: any) => `[${Math.round(p.x)}, ${Math.round(p.y)}]`).join(" → ")}`);
    }
    lines.push("");
    if (geometryOnly) {
      lines.push("| Stěna | Šířka | Výška | Plocha stěny | Otvory |");
      lines.push("|---|---|---|---|---|");
      room.walls.forEach((wall: any) => {
        const popis = wall.openings.length
          ? wall.openings.map((o: any) => `${kindLabel(o)} ${n(o.width)}×${n(o.height)}${n(o.reveal) > 0 ? ` (špaleta ${n(o.reveal)})` : ""}`).join(", ")
          : "—";
        lines.push(`| ${wall.name}${wall.ceiling ? " (strop)" : ""} | ${n(wall.width)} | ${n(wall.height)} | ${f2(wallStats(wall).gross)} | ${popis} |`);
      });
    } else {
      lines.push("| Stěna | Šířka | Výška | Rozsah | Hrubá | Odečty | Špalety | Čistá | Práce |");
      lines.push("|---|---|---|---|---|---|---|---|---|");
      room.walls.forEach((wall: any) => {
        const stats = wallStats(wall);
        const workNames = (wall.workIds ?? []).map((id: string) => works.find((w: any) => w.id === id)?.name ?? id).join(", ") || "—";
        lines.push(
          `| ${wall.name}${wall.ceiling ? " (strop)" : ""} | ${n(wall.width)} | ${n(wall.height)} | ${scopeText(wall.scope)} | ${f2(stats.gross)} | ${f2(stats.openings)} | ${f2(stats.reveals)} | ${f2(stats.clean)} | ${workNames} |`,
        );
      });
    }
    lines.push("");

    room.walls.forEach((wall: any) => {
      if (!wall.openings.length && !(wall.arcs ?? []).length) return;
      lines.push(`### ${wall.name} — detaily`);
      if (wall.openings.length) {
        lines.push("");
        lines.push("| Prvek | Šířka | Výška | Ks | Zleva | Od podlahy | Špaleta | Pravý úhel | Venku | Oblouk | Členění |");
        lines.push("|---|---|---|---|---|---|---|---|---|---|---|");
        wall.openings.forEach((opening: any) => {
          const outer = outerOpening(opening);
          const square = opening.revealSquare === false ? "ne" : "ano";
          const outerText = opening.revealSquare === false ? `${outer.width}×${outer.height}` : "—";
          const px = n(opening.panesX) || 1;
          const py = n(opening.panesY) || 1;
          const panesText = openingKind(opening) === "window" && (px > 1 || py > 1) ? `${px}×${py} tabulek` : "—";
          lines.push(
            `| ${kindLabel(opening)} | ${n(opening.width)} | ${n(opening.height)} | ${n(opening.count || 1)} | ${n(opening.x)} | ${n(opening.y)} | ${n(opening.reveal)} | ${square} | ${outerText} | ${n(opening.arch) || "—"} | ${panesText} |`,
          );
        });
        lines.push("");
      }
      const arcs = wallArcs(wall);
      if (arcs.length) {
        lines.push(`Klenby na horní hraně: ${arcs.map((arc: any, i: number) => `#${i + 1} střed ${Math.round(arc.x)} cm, vzepětí ${Math.round(arc.rise)} cm, rozpětí ${Math.round(arc.span)} cm`).join("; ")}`);
        const gaps = wallGaps(wall).filter((gap: any) => gap.width > 0);
        if (gaps.length) lines.push(`Mezery mezi klenbami: ${gaps.map((gap: any, i: number) => `#${i + 1} ${Math.round(gap.width)} cm`).join("; ")}`);
        lines.push("");
      }
    });

    if (room.floor?.length) {
      lines.push("Objekty na půdorysu:");
      room.floor.forEach((obj: any) => lines.push(`- ${obj.name}: ${n(obj.w)}×${n(obj.d)} cm, výška ${n(obj.h)} cm, poloha [${n(obj.x)}, ${n(obj.y)}]`));
      lines.push("");
    }
  });

  if (geometryOnly) return lines.join("\n");

  lines.push("## Ceník a sazby");
  works.forEach((work: any) => lines.push(`- ${work.name}: ${n(work.price)} Kč/${work.unit}`));
  lines.push(`- Rezerva práce ${n(settings.laborReservePercent)} %, rezerva materiálu ${n(settings.materialReservePercent)} %`);
  lines.push(`- Doprava: ${n(settings.kmOneWay)} km jedna cesta, ${n(settings.visits)}× tam a zpět, ${n(settings.kmPrice)} Kč/km`);
  lines.push("");
  if (calc) lines.push(`**Celkem bez DPH: ${Math.round(calc.subtotal)} Kč**`);
  return lines.join("\n");
}
