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

function wallSvg(wall: any, index: number) {
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
  parts.push(
    `<text x="${x0}" y="42" font-size="12" fill="#555">${width} × ${height} cm · ${scopeText(wall.scope)} · čistá plocha ${f2(wallStats(wall).clean)} m²</text>`,
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
export function buildDrawingSvg(rooms: any[], meta: any, company: any) {
  const blocks: { svg: string; boxW: number; boxH: number; title: string }[] = [];
  rooms.forEach((room: any) => {
    room.walls.forEach((wall: any, index: number) => {
      const block = wallSvg(wall, index);
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
<text x="24" y="28" font-size="17" font-weight="800" fill="#111">${esc(meta?.name || "Nacenění")}</text>
<text x="24" y="46" font-size="12" fill="#555">${esc(company?.name || "")} · rozměry v cm · kóty: šířka nahoře, odsazení zleva dole, výška od podlahy vlevo</text>
${body}
</svg>`;
}

// ---------- strojově i lidsky čitelný popis ----------

export function buildAiMarkdown({ rooms, works, settings, calc, meta, customer }: any) {
  const lines: string[] = [];
  lines.push(`# Zakázka: ${meta?.name || "bez názvu"}`);
  if (customer?.name) lines.push(`Zákazník: ${customer.name}`);
  lines.push("");
  lines.push("Všechny rozměry jsou v centimetrech, plochy v m². Osa X je vodorovně po stěně zleva, Y je výška od podlahy.");
  lines.push("");

  rooms.forEach((room: any) => {
    const kind = room.kind === "facade" ? "fasáda (venkovní pohled)" : "interiér";
    lines.push(`## ${room.name} — ${kind}`);
    if (room.plan?.points?.length) {
      lines.push(`Půdorys (souřadnice rohů v cm): ${room.plan.points.map((p: any) => `[${Math.round(p.x)}, ${Math.round(p.y)}]`).join(" → ")}`);
    }
    lines.push("");
    lines.push("| Stěna | Šířka | Výška | Rozsah | Hrubá | Odečty | Špalety | Čistá | Práce |");
    lines.push("|---|---|---|---|---|---|---|---|---|");
    room.walls.forEach((wall: any) => {
      const stats = wallStats(wall);
      const workNames = (wall.workIds ?? []).map((id: string) => works.find((w: any) => w.id === id)?.name ?? id).join(", ") || "—";
      lines.push(
        `| ${wall.name}${wall.ceiling ? " (strop)" : ""} | ${n(wall.width)} | ${n(wall.height)} | ${scopeText(wall.scope)} | ${f2(stats.gross)} | ${f2(stats.openings)} | ${f2(stats.reveals)} | ${f2(stats.clean)} | ${workNames} |`,
      );
    });
    lines.push("");

    room.walls.forEach((wall: any) => {
      if (!wall.openings.length && !(wall.arcs ?? []).length) return;
      lines.push(`### ${wall.name} — detaily`);
      if (wall.openings.length) {
        lines.push("");
        lines.push("| Prvek | Šířka | Výška | Ks | Zleva | Od podlahy | Špaleta | Pravý úhel | Venku | Oblouk |");
        lines.push("|---|---|---|---|---|---|---|---|---|---|");
        wall.openings.forEach((opening: any) => {
          const outer = outerOpening(opening);
          const square = opening.revealSquare === false ? "ne" : "ano";
          const outerText = opening.revealSquare === false ? `${outer.width}×${outer.height}` : "—";
          lines.push(
            `| ${kindLabel(opening)} | ${n(opening.width)} | ${n(opening.height)} | ${n(opening.count || 1)} | ${n(opening.x)} | ${n(opening.y)} | ${n(opening.reveal)} | ${square} | ${outerText} | ${n(opening.arch) || "—"} |`,
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

  lines.push("## Ceník a sazby");
  works.forEach((work: any) => lines.push(`- ${work.name}: ${n(work.price)} Kč/${work.unit}`));
  lines.push(`- Rezerva práce ${n(settings.laborReservePercent)} %, rezerva materiálu ${n(settings.materialReservePercent)} %`);
  lines.push(`- Doprava: ${n(settings.kmOneWay)} km jedna cesta, ${n(settings.visits)}× tam a zpět, ${n(settings.kmPrice)} Kč/km`);
  lines.push("");
  if (calc) lines.push(`**Celkem bez DPH: ${Math.round(calc.subtotal)} Kč**`);
  return lines.join("\n");
}
