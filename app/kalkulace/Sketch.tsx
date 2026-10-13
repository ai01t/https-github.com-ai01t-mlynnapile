"use client";

// Náčrt půdorysu místnosti.
// Postup: šablona nebo kreslení od ruky → zjednodušení čáry (Ramer–Douglas–Peucker)
// → přichycení stěn do pravých úhlů → editace tažením rohů → klik na stěnu = detail.
// Souřadnice jsou přímo v centimetrech (1 jednotka SVG = 1 cm).

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Eraser, Image as ImageIcon, MousePointerClick, PenLine, Plus, Shapes, X } from "lucide-react";
import { clamp, f2, n, uid } from "./core";

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

/** Obrys ze čtyř rohů, kde každá hrana je vodorovná nebo svislá. */
const isAxisRect = (pts: Pt[]) =>
  pts.length === 4 &&
  pts.every((p, i) => {
    const q = pts[(i + 1) % 4];
    return Math.abs(p.x - q.x) < 1 || Math.abs(p.y - q.y) < 1;
  });

/**
 * Přepíše obrys podle zadaných délek stěn. Rozměr ve směru upravené hrany se
 * vezme z ní, kolmý z první hrany opačné orientace – obrys tak odpovídá číslům.
 * Levý horní roh zůstává na místě, pořadí rohů i smysl obíhání se nemění.
 */
const rectFromWalls = (pts: Pt[], wallsList: any[], editedIndex: number) => {
  if (!isAxisRect(pts)) return pts;
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const horizontal = (i: number) => {
    const a = pts[i];
    const b = pts[(i + 1) % 4];
    return Math.abs(a.y - b.y) < Math.abs(a.x - b.x);
  };
  const lenOf = (i: number) => Math.max(1, Math.round(n(wallsList[i]?.width)));
  const editedHorizontal = horizontal(editedIndex);
  const otherIndex = [0, 1, 2, 3].find((i) => horizontal(i) !== editedHorizontal);
  const along = lenOf(editedIndex);
  const across = otherIndex === undefined ? (editedHorizontal ? maxY - minY : maxX - minX) : lenOf(otherIndex);
  const width = editedHorizontal ? along : across;
  const height = editedHorizontal ? across : along;
  return pts.map((p) => ({
    x: p.x > (minX + maxX) / 2 ? minX + width : minX,
    y: p.y > (minY + maxY) / 2 ? minY + height : minY,
  }));
};

export default function SketchModal({ room, works, siblings = [], onApply, close }: any) {
  const hasPlan = room.plan?.points?.length >= 3;
  const [mode, setMode] = useState(hasPlan ? "edit" : "start"); // start | draw | edit
  const [mainPoints, setMainPoints] = useState<Pt[]>(hasPlan ? room.plan.points : []);
  const [mainWalls, setMainWalls] = useState<any[]>(room.walls ?? []);
  // Místnosti dokreslené vedle té hlavní – po použití z nich vzniknou nové místnosti.
  // sousedé z téhož náčrtu se načtou zpátky, ať na sebe obrysy dál navazují
  const [extras, setExtras] = useState<{ id?: string; name: string; points: Pt[]; walls: any[] }[]>(
    siblings.map((item: any) => ({ id: item.id, name: item.name, points: item.plan.points, walls: item.walls })),
  );
  // null = upravuje se hlavní místnost, číslo = pořadí v extras
  const [activeExtra, setActiveExtra] = useState<number | null>(null);

  const points = activeExtra === null ? mainPoints : extras[activeExtra]?.points ?? [];
  const walls = activeExtra === null ? mainWalls : extras[activeExtra]?.walls ?? [];
  const resolve = <T,>(updater: T | ((prev: T) => T), prev: T): T => (typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater);
  const setPoints = (updater: Pt[] | ((prev: Pt[]) => Pt[])) => {
    if (activeExtra === null) return setMainPoints((prev) => resolve(updater, prev));
    setExtras((prev) => prev.map((item, i) => (i === activeExtra ? { ...item, points: resolve(updater, item.points) } : item)));
  };
  const setWalls = (updater: any[] | ((prev: any[]) => any[])) => {
    if (activeExtra === null) return setMainWalls((prev) => resolve(updater, prev));
    setExtras((prev) => prev.map((item, i) => (i === activeExtra ? { ...item, walls: resolve(updater, item.walls) } : item)));
  };
  const [stroke, setStroke] = useState<Pt[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [drag, setDrag] = useState<number | null>(null);
  // Většina pokojů má protilehlé strany stejné, tak ji nabídneme – ale až po
  // odpočtu, ať se dá zadat i místnost, která pravidelná není.
  const [mirror, setMirror] = useState<{ target: number; value: number; left: number } | null>(null);
  const cancelMirror = () => setMirror(null);

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
    const all = [points, mainPoints, ...extras.map((item) => item.points)].filter((pts) => pts.length >= 3).flat();
    if (mode !== "edit" || all.length < 3) return `0 0 ${CANVAS.w} ${CANVAS.h}`;
    const box = bbox(all);
    const pad = 130;
    return `${box.minX - pad} ${box.minY - pad} ${box.maxX - box.minX + pad * 2} ${box.maxY - box.minY + pad * 2}`;
  }, [mode, drag === null ? points : null, mainPoints, extras]); // během tažení se výřez nemění (nechvěje se)

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
    // přichycení k rohům sousedních místností – obrysy pak na sebe navazují
    otherPlans.forEach((plan) => {
      plan.points.forEach((p) => {
        if (Math.abs(p.x - x) <= MAGNET) x = p.x;
        if (Math.abs(p.y - y) <= MAGNET) y = p.y;
      });
    });
    // délky obou dotčených stěn se přepisují rovnou při tažení, ne až po puštění
    const next = points.map((p, i) => (i === index ? { x, y } : p));
    const touched = new Set([index, (index - 1 + next.length) % next.length]);
    setPoints(next);
    setWalls((prev) => syncWalls(next, prev, touched, defaultHeight));
    // tažením si délku určuje uživatel sám – nabídnuté dorovnání protějšku padá
    if (mirror) cancelMirror();
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

  // Protilehlá stěna: u čtyřstěnné místnosti leží o dvě pozice dál.
  const oppositeIndex = (index: number) => (walls.length === 4 ? (index + 2) % 4 : -1);

  const changeWallWidth = (index: number, value: string) => {
    setWall(index, { width: value });
    const target = oppositeIndex(index);
    const length = Math.round(n(value));
    if (target < 0 || !length) {
      cancelMirror();
      return;
    }
    if (Math.round(n(walls[target]?.width)) === length) {
      // obě strany už sedí – obrys může rovnou odpovídat číslům
      cancelMirror();
      setPoints((prev) => rectFromWalls(prev, walls.map((wall, i) => (i === index ? { ...wall, width: value } : wall)), index));
      return;
    }
    setMirror({ target, value: length, left: 3 });
  };

  useEffect(() => {
    if (!mirror) return;
    const timer = setTimeout(() => {
      if (mirror.left > 1) {
        setMirror({ ...mirror, left: mirror.left - 1 });
        return;
      }
      const next = walls.map((wall, i) => (i === mirror.target ? { ...wall, width: mirror.value } : wall));
      setWalls(next);
      setPoints((prev) => rectFromWalls(prev, next, mirror.target));
      setMirror(null);
    }, 1000);
    return () => clearTimeout(timer);
  }, [mirror, walls]);

  // Obrysy ostatních místností – kreslí se jako podklad a rohy k nim přichytávají.
  const otherPlans = [
    ...(activeExtra === null ? [] : [{ label: room.name, points: mainPoints, index: null as number | null }]),
    ...extras.map((item, i) => ({ label: item.name, points: item.points, index: i })).filter((item) => item.index !== activeExtra),
  ].filter((item) => item.points.length >= 3);

  /** Nová místnost navazující zprava na právě upravovaný obrys. */
  const addRoom = () => {
    const base = points.length >= 3 ? bbox(points) : { minX: 120, minY: 90, maxX: 520, maxY: 390 };
    const width = 400;
    const height = Math.max(200, base.maxY - base.minY);
    const corner = { x: base.maxX, y: base.minY };
    const pts = [
      { x: corner.x, y: corner.y },
      { x: corner.x + width, y: corner.y },
      { x: corner.x + width, y: corner.y + height },
      { x: corner.x, y: corner.y + height },
    ];
    // jen popisek v náčrtu – skutečné jméno přidělí kalkulačka podle počtu místností
    const name = extras.length ? `Nová místnost ${extras.length + 1}` : "Nová místnost";
    setExtras((prev) => [...prev, { name, points: pts, walls: syncWalls(pts, [], null, defaultHeight) }]);
    setActiveExtra(extras.length);
    setSelected(null);
    cancelMirror();
  };

  /**
   * Stěny sdílené se sousední místností. Nestačí shodné rohy – sousední pokoj
   * bývá jinak dlouhý, takže hledáme stěny na téže přímce s dostatečným
   * překryvem. Vrací i úsek překryvu, aby dveře padly do společné části.
   */
  const DOOR_W = 90;
  const sharedWalls = new Map<number, { plan: number | null; wall: number; from: number; to: number }>();
  points.forEach((p, i) => {
    const q = points[(i + 1) % points.length];
    const len = dist(p, q);
    if (len < DOOR_W) return;
    const ux = (q.x - p.x) / len;
    const uy = (q.y - p.y) / len;
    otherPlans.forEach((other) => {
      other.points.forEach((op, j) => {
        const oq = other.points[(j + 1) % other.points.length];
        // obě koncové body cizí stěny musí ležet na přímce té naší
        const offset = (pt: Pt) => Math.abs((pt.x - p.x) * uy - (pt.y - p.y) * ux);
        if (offset(op) > 3 || offset(oq) > 3) return;
        const along = (pt: Pt) => (pt.x - p.x) * ux + (pt.y - p.y) * uy;
        const from = Math.max(0, Math.min(along(op), along(oq)));
        const to = Math.min(len, Math.max(along(op), along(oq)));
        if (to - from < DOOR_W) return; // na dveře by to nestačilo
        sharedWalls.set(i, { plan: other.index, wall: j, from, to });
      });
    });
  });

  /** Přidá průchozí dveře na sdílenou stěnu – do obou místností naráz. */
  const addDoorway = (edgeIndex: number, at: Pt) => {
    const link = sharedWalls.get(edgeIndex);
    if (!link) return;
    const a = points[edgeIndex];
    const b = points[(edgeIndex + 1) % points.length];
    const len = Math.max(1, dist(a, b));
    const ux = (b.x - a.x) / len;
    const uy = (b.y - a.y) / len;
    // průmět puštění na stěnu, oříznutý do společného úseku
    const hit = (at.x - a.x) * ux + (at.y - a.y) * uy;
    const from = Math.round(clamp(hit - DOOR_W / 2, link.from, link.to - DOOR_W));
    const door = { name: "Dveře", type: "door", width: DOOR_W, height: 200, count: 1, y: 0, reveal: 0 };
    setWalls((prev) => prev.map((wall, i) => (i === edgeIndex ? { ...wall, openings: [...(wall.openings ?? []), { ...door, id: uid(), x: from }] } : wall)));

    // na druhé straně se tytéž světové body promítnou na sousední stěnu
    const other = otherPlans.find((item) => item.index === link.plan);
    if (!other) return;
    const op = other.points[link.wall];
    const oq = other.points[(link.wall + 1) % other.points.length];
    const olen = Math.max(1, dist(op, oq));
    const oux = (oq.x - op.x) / olen;
    const ouy = (oq.y - op.y) / olen;
    const world = { x: a.x + ux * from, y: a.y + uy * from };
    const worldEnd = { x: a.x + ux * (from + DOOR_W), y: a.y + uy * (from + DOOR_W) };
    const t1 = (world.x - op.x) * oux + (world.y - op.y) * ouy;
    const t2 = (worldEnd.x - op.x) * oux + (worldEnd.y - op.y) * ouy;
    const otherFrom = Math.round(clamp(Math.min(t1, t2), 0, Math.max(0, olen - DOOR_W)));
    const addTo = (list: any[]) =>
      list.map((wall, i) => (i === link.wall ? { ...wall, openings: [...(wall.openings ?? []), { ...door, id: uid(), x: otherFrom }] } : wall));
    if (link.plan === null) setMainWalls(addTo);
    else setExtras((prev) => prev.map((item, i) => (i === link.plan ? { ...item, walls: addTo(item.walls) } : item)));
  };

  const normalizeWalls = (list: any[]) =>
    list.map((wall) => ({ ...wall, width: Math.max(1, Math.round(n(wall.width))), height: Math.max(1, Math.round(n(wall.height))) || defaultHeight }));

  const apply = () =>
    onApply(
      { points: mainPoints },
      normalizeWalls(mainWalls),
      extras.filter((item) => item.points.length >= 3).map((item) => ({ id: item.id, name: item.name, plan: { points: item.points }, walls: normalizeWalls(item.walls) })),
    );

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
            {mode === "edit" && sharedWalls.size > 0 && (
              <div
                draggable
                onDragStart={(event) => event.dataTransfer.setData("text/plain", "doorway")}
                title="Přetáhni na zeleně čárkovanou stěnu – dveře se přidají do obou místností naráz"
                className="inline-flex cursor-grab items-center gap-2 rounded-[var(--radius)] border border-dashed border-emerald-600 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 active:cursor-grabbing"
              >
                <span className="text-base leading-none">🚪</span>
                Dveře mezi místnosti
              </div>
            )}
            {mode === "edit" && (
              <button
                type="button"
                onClick={addRoom}
                title="Dokreslí sousední místnost navazující zprava – rohy se k sobě přichytávají"
                className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm font-bold hover:bg-[var(--bg-soft)]"
              >
                <Plus className="h-4 w-4" />
                Přikreslit místnost
              </button>
            )}
            {mode === "edit" && (
              <button type="button" onClick={apply} className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--brand)] px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-[var(--brand-dark)]">
                <Check className="h-4 w-4" />
                Použít půdorys{extras.length ? ` (${extras.length + 1} místnosti)` : ` (${points.length} stěn)`}
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
                {/* ostatní místnosti jako podklad – klikem se přepne úprava na ně */}
                {otherPlans.map((plan) => {
                  const c = centroid(plan.points);
                  return (
                    <g key={`plan-${plan.index ?? "main"}`} className="cursor-pointer" onClick={(event) => { event.stopPropagation(); setActiveExtra(plan.index); setSelected(null); cancelMirror(); }}>
                      <polygon points={plan.points.map((p) => `${p.x},${p.y}`).join(" ")} fill="#94a3b8" fillOpacity="0.1" stroke="#94a3b8" strokeWidth="5" strokeLinejoin="round" />
                      <text x={c.x} y={c.y} textAnchor="middle" fontSize="18" fontWeight="700" fill="#94a3b8">{plan.label}</text>
                    </g>
                  );
                })}
                <polygon points={points.map((p) => `${p.x},${p.y}`).join(" ")} fill="var(--brand)" fillOpacity="0.06" stroke="none" />
                {/* stěny */}
                {points.map((p, i) => {
                  const q = points[(i + 1) % points.length];
                  const active = selected === i;
                  return (
                    <g key={`edge-${i}`}>
                      <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={active ? "var(--brand)" : "#334155"} strokeWidth={active ? 12 : 8} strokeLinecap="round" />
                      {/* sdílená stěna se sousední místností – sem jdou průchozí dveře */}
                      {sharedWalls.has(i) && (
                        <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#0f766e" strokeWidth="4" strokeDasharray="14 8" pointerEvents="none" />
                      )}
                      <line
                        x1={p.x} y1={p.y} x2={q.x} y2={q.y}
                        stroke="transparent" strokeWidth="30" strokeLinecap="round" className="cursor-pointer"
                        onClick={(event) => { event.stopPropagation(); setSelected(i); }}
                        onDoubleClick={(event) => { event.stopPropagation(); insertVertex(i, event); }}
                        onDragOver={(event) => { if (sharedWalls.has(i)) event.preventDefault(); }}
                        onDrop={(event) => {
                          if (!sharedWalls.has(i)) return;
                          event.preventDefault();
                          addDoorway(i, toCm(event));
                        }}
                      >
                        <title>{sharedWalls.has(i) ? `${walls[i]?.name} – sdílená se sousední místností, sem lze pustit dveře` : `${walls[i]?.name} – klik: vybrat, dvojklik: přidat roh`}</title>
                      </line>
                    </g>
                  );
                })}
                {/* popisky stěn – klik je rozepíše na políčka, dá se přepsat rovnou tady */}
                {labels.map((label, i) => {
                  const editing = selected === i;
                  const boxW = editing ? Math.max(176, label.w) : label.w;
                  const boxH = editing ? 56 : label.h;
                  return (
                    <g
                      key={`label-${i}`}
                      className={editing ? "" : "cursor-pointer"}
                      onClick={(event) => {
                        event.stopPropagation();
                        // sáhnutí na protilehlou stěnu znamená „délku si zadám sám" – odpočet se zruší
                        if (mirror?.target === i) cancelMirror();
                        setSelected(i);
                      }}
                    >
                      <rect x={label.x - boxW / 2} y={label.y - boxH / 2} width={boxW} height={boxH} rx="8" fill="white" fillOpacity={editing ? 1 : 0.92} stroke={editing ? "var(--brand)" : "#d4d4d8"} strokeWidth={editing ? 3 : 1.5} />
                      {editing ? (
                        <foreignObject x={label.x - boxW / 2} y={label.y - boxH / 2} width={boxW} height={boxH}>
                          <div className="flex h-full flex-col justify-center gap-1 px-2" style={{ fontSize: 14 }}>
                            <input
                              value={walls[i]?.name ?? ""}
                              onChange={(event) => setWall(i, { name: event.target.value })}
                              onClick={(event) => event.stopPropagation()}
                              title="Název stěny"
                              style={{ width: "100%", border: "none", outline: "none", background: "transparent", textAlign: "center", fontWeight: 800, fontSize: 16, color: "var(--brand)" }}
                            />
                            <div className="flex items-center justify-center gap-1" style={{ color: "#6b7280" }}>
                              <input
                                value={walls[i]?.width ?? ""}
                                onChange={(event) => changeWallWidth(i, event.target.value)}
                                onClick={(event) => event.stopPropagation()}
                                onFocus={() => { if (mirror?.target === i) cancelMirror(); }}
                                title="Délka stěny v cm"
                                style={{ width: 54, border: "1px solid #d4d4d8", borderRadius: 4, outline: "none", background: "white", textAlign: "right", fontSize: 13, padding: "1px 4px" }}
                              />
                              cm
                            </div>
                          </div>
                        </foreignObject>
                      ) : (
                        <>
                          <text x={label.x} y={label.y - 4} textAnchor="middle" fontSize="17" fontWeight="800" fill="#1f2937">{label.name}</text>
                          <text x={label.x} y={label.y + 15} textAnchor="middle" fontSize="14" fill={mirror?.target === i ? "var(--brand)" : "#6b7280"}>
                            {mirror?.target === i ? `→ ${mirror.value} cm za ${mirror.left}` : label.lenText}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
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
                      <input
                        value={selectedWall.width}
                        onChange={(event) => changeWallWidth(selected as number, event.target.value)}
                        onFocus={() => { if (mirror?.target === selected) cancelMirror(); }}
                        className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-2 py-1.5 text-right text-sm"
                      />
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
