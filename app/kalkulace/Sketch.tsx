"use client";

// Náčrt půdorysu místnosti.
// Postup: šablona nebo kreslení od ruky → zjednodušení čáry (Ramer–Douglas–Peucker)
// → přichycení stěn do pravých úhlů → editace tažením rohů → klik na stěnu = detail.
// Souřadnice jsou přímo v centimetrech (1 jednotka SVG = 1 cm).

import { useMemo, useRef, useState } from "react";
import { Check, Eraser, Image as ImageIcon, MousePointerClick, PenLine, Shapes, X } from "lucide-react";
import { f2, n, uid } from "./core";

type Pt = { x: number; y: number };

const GRID = 5; // zaokrouhlení souřadnic (cm)
const MIN_EDGE = 30; // kratší stěny se při úklidu slijí (cm)
const ANGLE_TOL = 32; // tolerance přichycení do pravého úhlu (°)
const MAGNET = 12; // magnet na souřadnice sousedních rohů při tažení (cm)
const CANVAS = { w: 1000, h: 620 }; // kreslicí plocha (cm)

const r5 = (value: number) => Math.round(value / GRID) * GRID;
const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

// ---------- geometrie ----------

// Ramer–Douglas–Peucker: z ručně kreslené čáry nechá jen významné rohy.
function rdp(points: Pt[], eps: number): Pt[] {
  if (points.length < 3) return points;
  const a = points[0];
  const b = points[points.length - 1];
  const len = dist(a, b) || 1e-6;
  let maxD = 0;
  let idx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const d = Math.abs((b.x - a.x) * (a.y - p.y) - (a.x - p.x) * (b.y - a.y)) / len;
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }
  if (maxD <= eps) return [a, b];
  const left = rdp(points.slice(0, idx + 1), eps);
  const right = rdp(points.slice(idx), eps);
  return [...left.slice(0, -1), ...right];
}

// Každou hranu přichytí k vodorovné/svislé ose, pokud je dost blízko.
function snapRightAngles(pts: Pt[]): Pt[] {
  if (pts.length < 3) return pts;
  const out: Pt[] = [{ x: r5(pts[0].x), y: r5(pts[0].y) }];
  for (let i = 1; i < pts.length; i++) {
    const prev = out[i - 1];
    const p = pts[i];
    const dx = p.x - prev.x;
    const dy = p.y - prev.y;
    const angle = (Math.atan2(Math.abs(dy), Math.abs(dx)) * 180) / Math.PI; // 0 = vodorovně, 90 = svisle
    if (angle <= ANGLE_TOL) out.push({ x: r5(p.x), y: prev.y });
    else if (angle >= 90 - ANGLE_TOL) out.push({ x: prev.x, y: r5(p.y) });
    else out.push({ x: r5(p.x), y: r5(p.y) });
  }
  // dovření smyčky: poslední hranu (zpět k první) také srovnat
  const first = out[0];
  const last = out[out.length - 1];
  const dx = first.x - last.x;
  const dy = first.y - last.y;
  const closeAngle = (Math.atan2(Math.abs(dy), Math.abs(dx)) * 180) / Math.PI;
  if (closeAngle <= ANGLE_TOL) last.y = first.y;
  else if (closeAngle >= 90 - ANGLE_TOL) last.x = first.x;
  return out;
}

// Slije krátké hrany a odstraní body ležící v přímce.
function cleanup(pts: Pt[]): Pt[] {
  const out = pts.map((p) => ({ ...p }));
  let changed = true;
  while (changed && out.length > 3) {
    changed = false;
    for (let i = 0; i < out.length && out.length > 3; i++) {
      if (dist(out[i], out[(i + 1) % out.length]) < MIN_EDGE) {
        out.splice((i + 1) % out.length, 1);
        changed = true;
        break;
      }
    }
    for (let i = 0; i < out.length && out.length > 3; i++) {
      const p = out[(i - 1 + out.length) % out.length];
      const a = out[i];
      const b = out[(i + 1) % out.length];
      const cross = (a.x - p.x) * (b.y - a.y) - (a.y - p.y) * (b.x - a.x);
      if (Math.abs(cross) < 1) {
        out.splice(i, 1);
        changed = true;
        break;
      }
    }
  }
  return out;
}

const centroid = (pts: Pt[]): Pt => ({
  x: pts.reduce((sum, p) => sum + p.x, 0) / pts.length,
  y: pts.reduce((sum, p) => sum + p.y, 0) / pts.length,
});

const bbox = (pts: Pt[]) => {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
};

// ---------- šablony ----------

const TEMPLATES: { name: string; points: Pt[] }[] = [
  { name: "Obdélník", points: [{ x: 0, y: 0 }, { x: 400, y: 0 }, { x: 400, y: 300 }, { x: 0, y: 300 }] },
  { name: "Čtverec", points: [{ x: 0, y: 0 }, { x: 350, y: 0 }, { x: 350, y: 350 }, { x: 0, y: 350 }] },
  {
    name: "Tvar L",
    points: [{ x: 0, y: 0 }, { x: 450, y: 0 }, { x: 450, y: 200 }, { x: 250, y: 200 }, { x: 250, y: 350 }, { x: 0, y: 350 }],
  },
  {
    name: "Tvar U",
    points: [
      { x: 0, y: 0 }, { x: 150, y: 0 }, { x: 150, y: 180 }, { x: 300, y: 180 },
      { x: 300, y: 0 }, { x: 450, y: 0 }, { x: 450, y: 350 }, { x: 0, y: 350 },
    ],
  },
  {
    name: "Tvar T",
    points: [
      { x: 0, y: 0 }, { x: 450, y: 0 }, { x: 450, y: 150 }, { x: 310, y: 150 },
      { x: 310, y: 350 }, { x: 140, y: 350 }, { x: 140, y: 150 }, { x: 0, y: 150 },
    ],
  },
];

const newWall = (index: number, width: number, height: number) => ({
  id: uid(),
  name: `Stěna ${index + 1}`,
  width: Math.round(width),
  height,
  scope: "damaged",
  openings: [],
  workIds: ["oklep", "perlinka", "malba"],
});

// Sladí seznam stěn s hranami půdorysu; existující stěny (otvory, práce…) zůstávají.
function syncWalls(points: Pt[], prevWalls: any[], touched: Set<number> | null, defaultHeight: number) {
  return points.map((p, i) => {
    const length = Math.round(dist(p, points[(i + 1) % points.length]));
    const existing = prevWalls[i];
    if (!existing) return newWall(i, length, defaultHeight);
    const width = touched === null || touched.has(i) ? length : existing.width;
    return { ...existing, width };
  });
}

// ---------- popisky stěn bez překryvů ----------

function wallLabels(points: Pt[], walls: any[]) {
  const c = centroid(points);
  const labels = points.map((p, i) => {
    const q = points[(i + 1) % points.length];
    const mid = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
    const len = dist(p, q) || 1;
    // normála směřující ven z místnosti
    let nx = -(q.y - p.y) / len;
    let ny = (q.x - p.x) / len;
    if ((mid.x + nx - c.x) * nx + (mid.y + ny - c.y) * ny < 0) {
      nx = -nx;
      ny = -ny;
    }
    const name = walls[i]?.name ?? `Stěna ${i + 1}`;
    const lenText = `${Math.round(n(walls[i]?.width ?? len))} cm`;
    const w = Math.max(name.length, lenText.length) * 8.5 + 16;
    return { mid, nx, ny, offset: 34, name, lenText, w, h: 44, edgeLen: len, x: 0, y: 0 };
  });
  const place = (label: any) => {
    label.x = label.mid.x + label.nx * label.offset;
    label.y = label.mid.y + label.ny * label.offset;
  };
  labels.forEach(place);
  // jednoduché odstrkávání: kratší stěna ustupuje dál od místnosti
  for (let iter = 0; iter < 10; iter++) {
    let moved = false;
    for (let i = 0; i < labels.length; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i];
        const b = labels[j];
        if (Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2) {
          const shorter = a.edgeLen <= b.edgeLen ? a : b;
          shorter.offset += 26;
          place(shorter);
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  return labels;
}

// ---------- komponenta ----------

export default function SketchModal({ room, works, onApply, close }: any) {
  const hasPlan = room.plan?.points?.length >= 3;
  const [mode, setMode] = useState(hasPlan ? "edit" : "start"); // start | draw | edit
  const [points, setPoints] = useState<Pt[]>(hasPlan ? room.plan.points : []);
  const [walls, setWalls] = useState<any[]>(room.walls ?? []);
  const [stroke, setStroke] = useState<Pt[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [drag, setDrag] = useState<number | null>(null);
  const [underlay, setUnderlay] = useState<string | null>(null); // importovaný nákres architekta (podklad k obkreslení)
  const [underlayOpacity, setUnderlayOpacity] = useState(45);
  const svgRef = useRef<SVGSVGElement>(null);
  const drawing = useRef(false);

  // import nákresu: obrázek se zmenší a zobrazí jako průsvitný podklad, přes který se kreslí
  const importDrawing = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Vyber prosím obrázek nákresu (PNG, JPG…).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1600;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        setUnderlay(canvas.toDataURL("image/jpeg", 0.82));
        if (mode === "start") setMode("draw");
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const defaultHeight = Math.round(n(room.walls?.[0]?.height)) || 250;

  // převod události myši na souřadnice v cm
  const toCm = (event: any): Pt => {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    return {
      x: vb.x + ((event.clientX - rect.left) / rect.width) * vb.width,
      y: vb.y + ((event.clientY - rect.top) / rect.height) * vb.height,
    };
  };

  const viewBox = useMemo(() => {
    if (mode !== "edit" || points.length < 3) return `0 0 ${CANVAS.w} ${CANVAS.h}`;
    const box = bbox(points);
    const pad = 130;
    return `${box.minX - pad} ${box.minY - pad} ${box.maxX - box.minX + pad * 2} ${box.maxY - box.minY + pad * 2}`;
  }, [mode, drag === null ? points : null]); // během tažení se výřez nemění (nechvěje se)

  const labels = useMemo(() => (points.length >= 3 ? wallLabels(points, walls) : []), [points, walls]);

  const startFromTemplate = (template: { points: Pt[] }) => {
    const pts = template.points.map((p) => ({ x: p.x + 120, y: p.y + 90 }));
    setPoints(pts);
    setWalls(syncWalls(pts, room.walls ?? [], null, defaultHeight));
    setSelected(null);
    setMode("edit");
  };

  // ----- kreslení od ruky -----

  const drawDown = (event: any) => {
    drawing.current = true;
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      // syntetické eventy pointer capture nemají – kreslení funguje i bez něj
    }
    setStroke([toCm(event)]);
  };
  const drawMove = (event: any) => {
    if (!drawing.current) return;
    const p = toCm(event);
    setStroke((prev) => (prev.length === 0 || dist(prev[prev.length - 1], p) > 6 ? [...prev, p] : prev));
  };
  const drawUp = () => {
    drawing.current = false;
    setStroke((currentStroke) => {
      if (currentStroke.length < 8) return [];
      let pts = rdp(currentStroke, 28);
      if (pts.length > 1 && dist(pts[0], pts[pts.length - 1]) < 90) pts = pts.slice(0, -1); // konec ≈ začátek
      pts = cleanup(snapRightAngles(pts));
      if (pts.length < 3) return [];
      setPoints(pts);
      setWalls(syncWalls(pts, room.walls ?? [], null, defaultHeight));
      setSelected(null);
      setMode("edit");
      return [];
    });
  };

  // ----- úprava tvaru -----

  const dragVertex = (index: number, event: any) => {
    const raw = toCm(event);
    let x = r5(raw.x);
    let y = r5(raw.y);
    points.forEach((p, i) => {
      if (i === index) return;
      if (Math.abs(p.x - x) <= MAGNET) x = p.x; // magnet drží pravé úhly
      if (Math.abs(p.y - y) <= MAGNET) y = p.y;
    });
    setPoints((prev) => prev.map((p, i) => (i === index ? { x, y } : p)));
  };

  const endDrag = (index: number) => {
    setDrag(null);
    const touched = new Set([index, (index - 1 + points.length) % points.length]);
    setWalls((prev) => syncWalls(points, prev, touched, defaultHeight));
  };

  const insertVertex = (edgeIndex: number, event: any) => {
    const p = toCm(event);
    const pts = [...points];
    pts.splice(edgeIndex + 1, 0, { x: r5(p.x), y: r5(p.y) });
    setPoints(pts);
    setWalls(syncWalls(pts, walls, null, defaultHeight));
    setSelected(null);
  };

  const removeVertex = (index: number) => {
    if (points.length <= 3) return;
    const pts = points.filter((_, i) => i !== index);
    setPoints(pts);
    setWalls(syncWalls(pts, walls, null, defaultHeight));
    setSelected(null);
  };

  const setWall = (index: number, patch: any) => setWalls((prev) => prev.map((wall, i) => (i === index ? { ...wall, ...patch } : wall)));

  const apply = () => onApply({ points }, walls.map((wall) => ({ ...wall, width: Math.max(1, Math.round(n(wall.width))), height: Math.max(1, Math.round(n(wall.height))) || defaultHeight })));

  const selectedWall = selected !== null ? walls[selected] : null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-neutral-950/60 p-4">
      <div className="mx-auto max-w-[1050px] rounded-[var(--radius)] bg-[var(--card)] p-4 text-[var(--text)] shadow-2xl">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <PenLine className="h-5 w-5" style={{ color: "var(--brand)" }} />
          <h1 className="text-lg font-black">
            Náčrt půdorysu — <span style={{ color: "var(--brand)" }}>{room.name}</span>
          </h1>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {underlay && (
              <label className="inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-2 py-1.5 text-xs font-bold text-[var(--muted)]" title="Průhlednost importovaného nákresu">
                Podklad
                <input type="range" min={10} max={90} value={underlayOpacity} onChange={(event) => setUnderlayOpacity(Number(event.target.value))} className="w-16 accent-[var(--brand)]" />
                <button type="button" onClick={() => setUnderlay(null)} title="Odebrat nákres" className="text-[var(--muted)] hover:text-red-600">✕</button>
              </label>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm font-bold hover:bg-[var(--bg-soft)]" title="Importuj nákres od architekta a obkresli ho">
              <ImageIcon className="h-4 w-4" />
              {underlay ? "Změnit nákres" : "Importovat nákres"}
              <input type="file" accept="image/*" className="hidden" onChange={(event) => importDrawing(event.target.files?.[0])} />
            </label>
            {mode === "edit" && (
              <button type="button" onClick={() => { setMode("start"); setSelected(null); }} className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm font-bold hover:bg-[var(--bg-soft)]">
                <Eraser className="h-4 w-4" />
                Znovu
              </button>
            )}
            {mode === "edit" && (
              <button type="button" onClick={apply} className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--brand)] px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-[var(--brand-dark)]">
                <Check className="h-4 w-4" />
                Použít půdorys ({points.length} stěn)
              </button>
            )}
            <button type="button" onClick={close} className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm font-bold hover:bg-[var(--bg-soft)]">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {mode === "start" && (
          <div>
            <p className="mb-3 text-sm text-[var(--muted)]">Vyber běžný tvar místnosti, nebo místnost hrubě načrtni myší — čáry se pak samy srovnají do pravých úhlů.</p>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  type="button"
                  onClick={() => startFromTemplate(template)}
                  className="group rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg-soft)] p-3 text-center transition hover:border-[var(--brand)]"
                >
                  <svg viewBox="-30 -30 510 410" className="mx-auto h-20 w-full">
                    <polygon
                      points={template.points.map((p) => `${p.x},${p.y}`).join(" ")}
                      fill="var(--bg)"
                      stroke="var(--text-soft)"
                      strokeWidth="14"
                      strokeLinejoin="round"
                      className="transition group-hover:stroke-[var(--brand)]"
                    />
                  </svg>
                  <div className="mt-1 text-sm font-bold">{template.name}</div>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setMode("draw")}
                className="group rounded-[var(--radius)] border-2 border-dashed border-[var(--muted)] p-3 text-center transition hover:border-[var(--brand)]"
              >
                <PenLine className="mx-auto h-20 w-10 text-[var(--muted)] transition group-hover:text-[var(--brand)]" />
                <div className="mt-1 text-sm font-bold">Kreslit od ruky</div>
              </button>
            </div>
          </div>
        )}

        {mode === "draw" && (
          <div>
            <p className="mb-2 text-sm text-[var(--muted)]">
              Jedním tahem myši obtáhni obrys místnosti — nemusí být přesný, rohy se srovnají samy. Jeden čtverec mřížky = 50 cm.
            </p>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
              className="w-full cursor-crosshair touch-none rounded-[var(--radius-sm)] border-2 border-[var(--line)] bg-white"
              onPointerDown={drawDown}
              onPointerMove={drawMove}
              onPointerUp={drawUp}
            >
              {underlay && <image href={underlay} x={0} y={0} width={CANVAS.w} height={CANVAS.h} preserveAspectRatio="xMidYMid meet" opacity={underlayOpacity / 100} style={{ pointerEvents: "none" }} />}
              <Grid />
              {stroke.length > 1 && (
                <polyline points={stroke.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="var(--brand)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
              )}
            </svg>
          </div>
        )}

        {mode === "edit" && (
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_250px]">
            <div>
              <svg ref={svgRef} viewBox={viewBox} className="w-full touch-none rounded-[var(--radius-sm)] border-2 border-[var(--line)] bg-white" onClick={() => setSelected(null)}>
                {underlay && <image href={underlay} x={0} y={0} width={CANVAS.w} height={CANVAS.h} preserveAspectRatio="xMidYMid meet" opacity={underlayOpacity / 100} style={{ pointerEvents: "none" }} />}
                <Grid />
                <polygon points={points.map((p) => `${p.x},${p.y}`).join(" ")} fill="var(--brand)" fillOpacity="0.06" stroke="none" />
                {/* stěny */}
                {points.map((p, i) => {
                  const q = points[(i + 1) % points.length];
                  const active = selected === i;
                  return (
                    <g key={`edge-${i}`}>
                      <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={active ? "var(--brand)" : "#334155"} strokeWidth={active ? 12 : 8} strokeLinecap="round" />
                      <line
                        x1={p.x} y1={p.y} x2={q.x} y2={q.y}
                        stroke="transparent" strokeWidth="30" strokeLinecap="round" className="cursor-pointer"
                        onClick={(event) => { event.stopPropagation(); setSelected(i); }}
                        onDoubleClick={(event) => { event.stopPropagation(); insertVertex(i, event); }}
                      >
                        <title>{walls[i]?.name} – klik: vybrat, dvojklik: přidat roh</title>
                      </line>
                    </g>
                  );
                })}
                {/* popisky stěn */}
                {labels.map((label, i) => (
                  <g key={`label-${i}`} className="cursor-pointer" onClick={(event) => { event.stopPropagation(); setSelected(i); }}>
                    <rect x={label.x - label.w / 2} y={label.y - label.h / 2} width={label.w} height={label.h} rx="8" fill="white" fillOpacity="0.92" stroke={selected === i ? "var(--brand)" : "#d4d4d8"} strokeWidth={selected === i ? 3 : 1.5} />
                    <text x={label.x} y={label.y - 4} textAnchor="middle" fontSize="17" fontWeight="800" fill={selected === i ? "var(--brand)" : "#1f2937"}>{label.name}</text>
                    <text x={label.x} y={label.y + 15} textAnchor="middle" fontSize="14" fill="#6b7280">{label.lenText}</text>
                  </g>
                ))}
                {/* rohy */}
                {points.map((p, i) => (
                  <circle
                    key={`vertex-${i}`}
                    cx={p.x} cy={p.y} r={drag === i ? 17 : 13}
                    fill={drag === i ? "var(--brand)" : "white"} stroke="var(--brand)" strokeWidth="4"
                    className="cursor-move"
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      try {
                        (event.currentTarget as any).setPointerCapture?.(event.pointerId);
                      } catch {
                        // syntetické eventy capture nepodporují
                      }
                      setDrag(i);
                    }}
                    onPointerMove={(event) => { if (drag === i) dragVertex(i, event); }}
                    onPointerUp={() => endDrag(i)}
                    onDoubleClick={(event) => { event.stopPropagation(); removeVertex(i); }}
                  >
                    <title>Táhni pro úpravu tvaru · dvojklik smaže roh</title>
                  </circle>
                ))}
              </svg>
              <p className="mt-1.5 text-[11px] leading-tight text-[var(--muted)]">
                <b>Roh</b>: táhni myší (magnet drží pravé úhly) · dvojklik roh smaže. <b>Stěna</b>: klik = vybrat, dvojklik = přidat roh. Mřížka = 50 cm.
              </p>
            </div>

            {/* panel vybrané stěny */}
            <div className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-soft)] p-3">
              {selectedWall ? (
                <div className="space-y-2">
                  <input
                    value={selectedWall.name}
                    onChange={(event) => setWall(selected, { name: event.target.value })}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-2 py-1.5 text-sm font-black"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <div className="mb-0.5 text-[10px] font-bold uppercase text-[var(--muted)]">Délka (cm)</div>
                      <input value={selectedWall.width} onChange={(event) => setWall(selected, { width: event.target.value })} className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-2 py-1.5 text-right text-sm" />
                    </label>
                    <label className="block">
                      <div className="mb-0.5 text-[10px] font-bold uppercase text-[var(--muted)]">Výška (cm)</div>
                      <input value={selectedWall.height} onChange={(event) => setWall(selected, { height: event.target.value })} className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-2 py-1.5 text-right text-sm" />
                    </label>
                  </div>
                  <label className="block">
                    <div className="mb-0.5 text-[10px] font-bold uppercase text-[var(--muted)]">Rozsah</div>
                    <select value={selectedWall.scope} onChange={(event) => setWall(selected, { scope: event.target.value })} className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-2 py-1.5 text-sm">
                      <option value="damaged">Poškozená</option>
                      <option value="visual">Navazující / pohledová</option>
                    </select>
                  </label>
                  <div>
                    <div className="mb-1 text-[10px] font-bold uppercase text-[var(--muted)]">Plánované práce</div>
                    <div className="space-y-1">
                      {works.map((work: any) => (
                        <label key={work.id} className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--card)] px-2 py-1.5 text-xs">
                          <input
                            type="checkbox"
                            checked={selectedWall.workIds.includes(work.id)}
                            onChange={(event) =>
                              setWall(selected, { workIds: event.target.checked ? [...selectedWall.workIds, work.id] : selectedWall.workIds.filter((id: string) => id !== work.id) })
                            }
                          />
                          <span className="min-w-0 flex-1 truncate">{work.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--muted)]">Plocha: <b className="text-[var(--text)]">{f2((n(selectedWall.width) * n(selectedWall.height)) / 10000)} m²</b> (bez odečtů — okna a dveře doplníš v kartě stěny)</div>
                </div>
              ) : (
                <div className="grid h-full min-h-[180px] place-items-center text-center text-sm text-[var(--muted)]">
                  <div>
                    <MousePointerClick className="mx-auto mb-2 h-6 w-6" />
                    Klikni na stěnu v náčrtu
                    <br />a doplň rozměry a práce.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// mřížka po 50 cm (1 čtverec = 50 × 50 cm)
function Grid() {
  return (
    <>
      <defs>
        <pattern id="grid50" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1" />
        </pattern>
        <pattern id="grid100" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#grid50)" />
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#d1d5db" strokeWidth="1.4" />
        </pattern>
      </defs>
      <rect x="-2000" y="-2000" width="6000" height="6000" fill="url(#grid100)" />
    </>
  );
}
