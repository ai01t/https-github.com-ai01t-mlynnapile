"use client";

// Orientační 3D (izometrický) náhled místnosti.
// Stěny se skládají v pořadí za sebou, po každé stěně se otočí o 90° doprava.
// Pro obdélníkovou místnost (4 stěny, protilehlé stejně dlouhé) vznikne uzavřený prostor.

import { n, openingKind, wallStats, f2 } from "./core";

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

// izometrická projekce: půdorys (x, y) + výška z → obrazovka
const iso = (x: number, y: number, z: number) => ({ sx: (x - y) * 0.866, sy: (x + y) * 0.5 - z });

const pointsAttr = (points: { sx: number; sy: number }[]) => points.map((p) => `${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(" ");

export default function Room3D({ walls }: any) {
  // rozmístění stěn do půdorysu
  let cursor = [0, 0];
  const segments = walls.map((wall: any, index: number) => {
    const dir = DIRS[index % 4];
    const length = Math.max(1, n(wall.width));
    const start = [...cursor];
    const end = [cursor[0] + dir[0] * length, cursor[1] + dir[1] * length];
    cursor = end;
    return { wall, dir, length, start, end, height: Math.max(1, n(wall.height)) };
  });

  if (segments.length === 0) {
    return <div className="rounded-md border border-dashed border-neutral-300 bg-white p-4 text-sm text-neutral-500">Přidej alespoň jednu stěnu.</div>;
  }

  // všechny promítnuté body kvůli výřezu
  const allPoints: { sx: number; sy: number }[] = [];
  segments.forEach((seg: any) => {
    [0, seg.height].forEach((z) => {
      allPoints.push(iso(seg.start[0], seg.start[1], z));
      allPoints.push(iso(seg.end[0], seg.end[1], z));
    });
  });
  const minX = Math.min(...allPoints.map((p) => p.sx));
  const maxX = Math.max(...allPoints.map((p) => p.sx));
  const minY = Math.min(...allPoints.map((p) => p.sy));
  const maxY = Math.max(...allPoints.map((p) => p.sy));
  const pad = Math.max(30, (maxX - minX) * 0.06);
  const viewBox = `${(minX - pad).toFixed(0)} ${(minY - pad).toFixed(0)} ${(maxX - minX + pad * 2).toFixed(0)} ${(maxY - minY + pad * 2).toFixed(0)}`;

  // podlaha: obrys půdorysu
  const floorPoints = [...segments.map((seg: any) => iso(seg.start[0], seg.start[1], 0)), iso(cursor[0], cursor[1], 0)];

  // malíř: vzdálenější stěny (menší x+y středu) kreslíme dřív
  const ordered = [...segments].sort((a: any, b: any) => {
    const midA = (a.start[0] + a.end[0]) / 2 + (a.start[1] + a.end[1]) / 2;
    const midB = (b.start[0] + b.end[0]) / 2 + (b.start[1] + b.end[1]) / 2;
    return midA - midB;
  });

  return (
    <div>
      <svg viewBox={viewBox} className="mx-auto h-auto max-h-[440px] w-full" role="img" aria-label="3D náhled místnosti">
        <polygon points={pointsAttr(floorPoints)} fill="#f5f5f4" stroke="#a8a29e" strokeWidth="1.5" strokeDasharray="5 4" />
        {ordered.map((seg: any) => {
          const { wall, start, dir, height } = seg;
          const at = (t: number, z: number) => iso(start[0] + dir[0] * t, start[1] + dir[1] * t, z);
          const corners = [at(0, 0), at(seg.length, 0), at(seg.length, height), at(0, height)];
          const top = at(seg.length / 2, height);
          return (
            <g key={wall.id}>
              <polygon points={pointsAttr(corners)} fill="#e2e8f0" fillOpacity="0.72" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
              {wall.openings.map((opening: any) => {
                const kind = openingKind(opening);
                const ow = Math.max(0, n(opening.width));
                const oh = Math.max(0, n(opening.height));
                const ox = Math.min(Math.max(0, n(opening.x)), Math.max(0, seg.length - ow));
                const oy = Math.min(Math.max(0, n(opening.y)), Math.max(0, height - oh));
                const quad = [at(ox, oy), at(ox + ow, oy), at(ox + ow, oy + oh), at(ox, oy + oh)];
                const fill = kind === "door" ? "#fbbf24" : kind === "other" ? "#d4d4d4" : "#7dd3fc";
                const stroke = kind === "door" ? "#92400e" : kind === "other" ? "#525252" : "#0369a1";
                return <polygon key={opening.id} points={pointsAttr(quad)} fill={fill} fillOpacity="0.9" stroke={stroke} strokeWidth="1.5" />;
              })}
              <text x={top.sx} y={top.sy - 8} textAnchor="middle" fontSize="13" fontWeight="800" fill="#334155">
                {wall.name}
              </text>
              <text x={top.sx} y={top.sy + 6} textAnchor="middle" fontSize="10" fill="#64748b">
                {n(wall.width)} × {n(wall.height)} cm · {f2(wallStats(wall).clean)} m²
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 border border-sky-700 bg-sky-300" /> Okno</span>
        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 border border-amber-800 bg-amber-400" /> Dveře</span>
        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 border border-neutral-600 bg-neutral-300" /> Jiné</span>
        <span className="ml-auto">Orientační náhled – stěny jdou po sobě doprava (1. dopředu, 2. doprava, …)</span>
      </div>
    </div>
  );
}
