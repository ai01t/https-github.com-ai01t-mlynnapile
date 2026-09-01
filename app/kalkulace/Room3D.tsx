"use client";

// Orientační 3D (izometrický) náhled místnosti.
// Stěny se skládají v pořadí za sebou, po každé stěně se otočí o 90° doprava.
// Pro obdélníkovou místnost (4 stěny, protilehlé stejně dlouhé) vznikne uzavřený prostor.
// Objekty (dveře, okna…) se přetahují z palety přímo na stěnu; kliknutím se upraví rozměr.

import { useRef, useState } from "react";
import { clamp, f2, inferOtherOpening, n, openingKind, outerOpening, uid, WALL_COLORS, wallArcs, wallStats, windowPanes, WINDOW_PANE_PRESETS } from "./core";

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

const SCOPE_LABEL: Record<string, string> = {
  damaged: "Poškozená",
  visual: "Navazující / pohledová",
};

// objekty na STĚNU (odečty plochy) – názvy ladí s chytrým rozpoznáním v inferOtherOpening
const WALL_ITEMS = [
  { key: "door", type: "door", name: "Dveře", w: 90, h: 200, icon: "🚪", atFloor: true },
  { key: "window", type: "window", name: "Okno", w: 100, h: 120, icon: "🪟" },
  { key: "heating", type: "other", name: "Topení", w: 90, h: 60, icon: "♨", atFloor: true },
  { key: "nika", type: "other", name: "Nika", w: 60, h: 60, icon: "▣" },
  { key: "elektro", type: "other", name: "Rozvaděč", w: 30, h: 40, icon: "⚡" },
  { key: "tram", type: "other", name: "Trám", w: 250, h: 25, icon: "▰" },
  { key: "potrubi", type: "other", name: "Potrubí", w: 15, h: 220, icon: "○" },
];

// objekty na PŮDORYS (stojí na podlaze, do plochy stěn se nepočítají)
// stairs = schodiště (nahoru stoupá do výšky stěny, dolů jen naznačeno), full = vysoké až ke stropu
const FLOOR_ITEMS = [
  { key: "stairs", name: "Schodiště", w: 110, d: 250, h: 0, icon: "🪜", stairs: true },
  { key: "stove", name: "Kamna", w: 70, d: 60, h: 110, icon: "🔥" },
  { key: "chimney", name: "Komín", w: 45, d: 45, h: 0, icon: "🧱", full: true },
];

const FLOOR_STYLE: Record<string, { fill: string; stroke: string }> = {
  stairs: { fill: "#c7d2fe", stroke: "#4338ca" },
  stove: { fill: "#fecaca", stroke: "#b91c1c" },
  chimney: { fill: "#e7e5e4", stroke: "#57534e" },
};

const WALL_MIME = "application/x-kalk-wall";
const FLOOR_MIME = "application/x-kalk-floor";
const POINT_MIME = "application/x-kalk-point";

const ARCH_DEFAULT = 30; // výchozí vzepětí oblouku (cm)

// izometrická projekce: půdorys (x, y) + výška z → obrazovka
const iso = (x: number, y: number, z: number) => ({ sx: (x - y) * 0.866, sy: (x + y) * 0.5 - z });

const pointsAttr = (points: { sx: number; sy: number }[]) => points.map((p) => `${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(" ");

// nový objekt na stěně z položky palety, umístěný středem na (t, z) v rovině stěny
function makeObject(item: any, wall: any, t: number, z: number) {
  const w = Math.min(item.w, Math.max(10, n(wall.width)));
  const h = Math.min(item.h, Math.max(10, n(wall.height)));
  return {
    id: uid(),
    name: item.name,
    type: item.type,
    width: Math.round(w),
    height: Math.round(h),
    count: 1,
    x: Math.round(clamp(t - w / 2, 0, Math.max(0, n(wall.width) - w))),
    y: item.atFloor ? 0 : Math.round(clamp(z - h / 2, 0, Math.max(0, n(wall.height) - h))),
  };
}

// nový podlahový objekt (schodiště / kamna / komín), umístěný středem na (x, y) v půdorysu
// schody nahoru mají výšku stěny, dolů h=0 (jen na podlaze); komín jde až ke stropu
function makeFloorObject(item: any, x: number, y: number, stairsUp: boolean, roomHeight: number) {
  const h = item.stairs ? (stairsUp ? roomHeight : 0) : item.full ? roomHeight : item.h;
  return {
    id: uid(),
    kind: item.key,
    name: item.stairs ? `Schodiště ${stairsUp ? "nahoru" : "dolů"}` : item.name,
    x: Math.round(x - item.w / 2),
    y: Math.round(y - item.d / 2),
    w: item.w,
    d: item.d,
    h,
    up: item.stairs ? stairsUp : undefined,
  };
}

export default function Room3D({
  walls,
  works = [],
  plan,
  facade = false,
  floorObjects = [],
  onSelectWall,
  onAddOpening,
  onUpdateOpening,
  onRemoveOpening,
  onAddFloorObject,
  onUpdateFloorObject,
  onRemoveFloorObject,
  onUpdateWall,
}: any) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [dragWallId, setDragWallId] = useState<string | null>(null);
  const [dragFloor, setDragFloor] = useState(false);
  const [sel, setSel] = useState<{ wallId: string; openingId: string } | null>(null);
  const [selFloor, setSelFloor] = useState<string | null>(null);
  const [stairsUp, setStairsUp] = useState(true); // směr schodiště: nahoru / dolů
  const [trashHot, setTrashHot] = useState(false); // úchyt je nad košem – zvýrazní se červeně
  // Popisky stěn: "full" = název + rozměry + plocha, "dims" = jen kóty, "off" = nic
  const [labelMode, setLabelMode] = useState<"full" | "dims" | "off">("full");
  const svgRef = useRef<SVGSVGElement>(null);

  // Pokud existuje náčrt půdorysu, použijeme jeho skutečnou geometrii (přesné rohy a směry),
  // jinak stěny poskládáme naslepo za sebe s pravoúhlým otočením (funguje pro obdélník).
  const planPoints = plan?.points?.length === walls.length && walls.length >= 3 ? plan.points : null;
  let segments: any[];
  if (planPoints) {
    segments = walls.map((wall: any, index: number) => {
      const a = planPoints[index];
      const b = planPoints[(index + 1) % walls.length];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const length = Math.max(1, Math.hypot(dx, dy));
      const dir = [dx / length, dy / length];
      return { wall, dir, length, start: [a.x, a.y], end: [b.x, b.y], height: Math.max(1, n(wall.height)) };
    });
  } else {
    let cursor = [0, 0];
    segments = walls.map((wall: any, index: number) => {
      const dir = DIRS[index % 4];
      const length = Math.max(1, n(wall.width));
      const start = [...cursor];
      const end = [cursor[0] + dir[0] * length, cursor[1] + dir[1] * length];
      cursor = end;
      return { wall, dir, length, start, end, height: Math.max(1, n(wall.height)) };
    });
  }

  if (segments.length === 0) {
    return <div className="rounded-[var(--radius-sm)] border border-dashed border-[var(--line)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">Přidej alespoň jednu stěnu.</div>;
  }

  const roomHeight = Math.round(Math.max(1, ...segments.map((s: any) => s.height)));

  // fasáda: obdélník terénu (trávník) kolem půdorysu
  const fxs = segments.flatMap((s: any) => [s.start[0], s.end[0]]);
  const fys = segments.flatMap((s: any) => [s.start[1], s.end[1]]);
  const gMargin = Math.max(220, (Math.max(...fxs) - Math.min(...fxs)) * 0.45);
  const groundFloor = [
    [Math.min(...fxs) - gMargin, Math.min(...fys) - gMargin],
    [Math.max(...fxs) + gMargin, Math.min(...fys) - gMargin],
    [Math.max(...fxs) + gMargin, Math.max(...fys) + gMargin],
    [Math.min(...fxs) - gMargin, Math.max(...fys) + gMargin],
  ].map(([x, y]) => iso(x, y, 0));

  // všechny promítnuté body kvůli výřezu (u fasády i terén)
  const allPoints: { sx: number; sy: number }[] = [];
  segments.forEach((seg: any) => {
    [0, seg.height].forEach((z) => {
      allPoints.push(iso(seg.start[0], seg.start[1], z));
      allPoints.push(iso(seg.end[0], seg.end[1], z));
    });
  });
  if (facade) allPoints.push(...groundFloor);
  const minX = Math.min(...allPoints.map((p) => p.sx));
  const maxX = Math.max(...allPoints.map((p) => p.sx));
  const minY = Math.min(...allPoints.map((p) => p.sy));
  const maxY = Math.max(...allPoints.map((p) => p.sy));
  const pad = Math.max(30, (maxX - minX) * 0.06);
  const viewBox = `${(minX - pad).toFixed(0)} ${(minY - pad).toFixed(0)} ${(maxX - minX + pad * 2).toFixed(0)} ${(maxY - minY + pad * 2).toFixed(0)}`;

  // podlaha: obrys půdorysu (uzavřený polygon rohů – SVG polygon se sám dovře)
  const floorPoints = segments.map((seg: any) => iso(seg.start[0], seg.start[1], 0));

  // malíř: vzdálenější stěny (menší x+y středu) kreslíme dřív
  const ordered = [...segments].sort((a: any, b: any) => {
    const midA = (a.start[0] + a.end[0]) / 2 + (a.start[1] + a.end[1]) / 2;
    const midB = (b.start[0] + b.end[0]) / 2 + (b.start[1] + b.end[1]) / 2;
    return midA - midB;
  });

  const hovered = segments.find((seg: any) => seg.wall.id === hoverId);
  const workName = (id: string) => works.find((w: any) => w.id === id)?.name ?? id;

  // obrazovkové (client) souřadnice → uživatelské souřadnice SVG
  const toUser = (clientX: number, clientY: number) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  };

  // inverzní izometrie: bod v rovině stěny → (t podél stěny, z výška)
  const invert = (seg: any, sx: number, sy: number) => {
    const [s0, s1] = seg.start;
    const [d0, d1] = seg.dir;
    const A = s0 - s1;
    const B = d0 - d1; // pro osově orientované stěny vždy ±1
    const C = s0 + s1;
    const D = d0 + d1;
    const t = (sx / 0.866 - A) / B;
    const z = (C + D * t) * 0.5 - sy;
    return { t, z };
  };

  // inverzní izometrie pro podlahu (z = 0): bod na obrazovce → půdorysné (x, y)
  const invertFloor = (sx: number, sy: number) => {
    const u = sx / 0.866; // = x - y
    const v = 2 * sy; // = x + y
    return { x: (u + v) / 2, y: (v - u) / 2 };
  };

  const dropOnWall = (event: any, seg: any) => {
    event.preventDefault();
    setDragWallId(null);
    const loc = toUser(event.clientX, event.clientY);
    const { t, z } = invert(seg, loc.x, loc.y);

    // geometrický bod: přichytí se na otvor pod kurzorem (obloukové nadpraží),
    // jinak přidá bod na horní hranu stěny (klenba)
    if (event.dataTransfer.getData(POINT_MIME)) {
      const hit = seg.wall.openings.find((opening: any) => {
        const ow = Math.max(0, n(opening.width));
        const oh = Math.max(0, n(opening.height));
        const ox = clamp(opening.x, 0, Math.max(0, seg.length - ow));
        const oy = clamp(opening.y, 0, Math.max(0, seg.height - oh));
        return t >= ox && t <= ox + ow && z >= oy && z <= oy + oh;
      });
      if (hit) onUpdateOpening?.(seg.wall.id, hit.id, { arch: ARCH_DEFAULT });
      else onUpdateWall?.(seg.wall.id, { arcs: [...(seg.wall.arcs ?? []), { id: uid(), x: Math.round(clamp(t, 0, seg.length)), rise: ARCH_DEFAULT }] });
      return;
    }

    const key = event.dataTransfer.getData(WALL_MIME);
    const item = WALL_ITEMS.find((p) => p.key === key);
    if (!item || !onAddOpening) return;
    onAddOpening(seg.wall.id, makeObject(item, seg.wall, t, z));
  };

  // Tažení úchytu oblouku: svislý pohyb myši mění vzepětí (z = konst − sy).
  // Puštění nad tlačítkem Koš bod odstraní.
  const overTrash = (event: any) => {
    const trash = document.getElementById("kalk-trash");
    if (!trash) return false;
    const r = trash.getBoundingClientRect();
    return event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
  };

  // Uchopení libovolného objektu: krátké kliknutí = výběr, tažení nad Koš = smazání.
  // Jakmile se něco uchopí, koš se zvýrazní, aby bylo vidět, kam se dá pustit.
  const paintTrash = (mode: "off" | "armed" | "hot") => {
    const trash = document.getElementById("kalk-trash");
    if (!trash) return;
    trash.style.outline = mode === "hot" ? "2px solid #dc2626" : mode === "armed" ? "2px dashed #dc2626" : "";
    trash.style.background = mode === "hot" ? "#fee2e2" : mode === "armed" ? "#fef2f2" : "";
    trash.style.color = mode === "off" ? "" : "#b91c1c";
  };

  const grabToTrash = (event: any, remove?: () => void, onClickInstead?: () => void) => {
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;
    let moved = false;
    paintTrash("armed");
    setTrashHot(false);
    const move = (moveEvent: any) => {
      if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) > 6) moved = true;
      const hot = overTrash(moveEvent);
      setTrashHot(hot);
      paintTrash(hot ? "hot" : "armed");
    };
    const up = (upEvent: any) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      paintTrash("off");
      setTrashHot(false);
      if (overTrash(upEvent)) remove?.();
      else if (!moved) onClickInstead?.();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const dragArch = (event: any, startRise: number, apply: (rise: number) => void, remove?: () => void) => {
    event.stopPropagation();
    event.preventDefault();
    const startY = toUser(event.clientX, event.clientY).y;
    paintTrash("armed");
    const move = (moveEvent: any) => {
      const onTrash = overTrash(moveEvent);
      setTrashHot(onTrash);
      paintTrash(onTrash ? "hot" : "armed");
      if (onTrash) return; // nad košem se vzepětí nemění
      const y = toUser(moveEvent.clientX, moveEvent.clientY).y;
      apply(Math.max(0, Math.round(startRise + (startY - y))));
    };
    const up = (upEvent: any) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      paintTrash("off");
      setTrashHot(false);
      if (overTrash(upEvent)) remove?.();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const dropOnFloor = (event: any) => {
    event.preventDefault();
    setDragFloor(false);
    const key = event.dataTransfer.getData(FLOOR_MIME);
    const item = FLOOR_ITEMS.find((p) => p.key === key);
    if (!item || !onAddFloorObject) return;
    const loc = toUser(event.clientX, event.clientY);
    const { x, y } = invertFloor(loc.x, loc.y);
    onAddFloorObject(makeFloorObject(item, x, y, stairsUp, roomHeight));
  };

  // klik na položku palety = přidat na naposledy najetou stěnu (nebo první), vystředěně
  const addToActiveWall = (item: any) => {
    const seg = segments.find((s: any) => s.wall.id === hoverId) ?? segments[0];
    onAddOpening?.(seg.wall.id, makeObject(item, seg.wall, seg.length / 2, seg.height / 2));
  };

  // klik na podlahovou položku = přidat doprostřed půdorysu
  const floorCenter = { x: segments.reduce((s: number, seg: any) => s + seg.start[0], 0) / segments.length, y: segments.reduce((s: number, seg: any) => s + seg.start[1], 0) / segments.length };
  const addToFloorCenter = (item: any) => onAddFloorObject?.(makeFloorObject(item, floorCenter.x, floorCenter.y, stairsUp, roomHeight));

  const selWall = sel ? walls.find((w: any) => w.id === sel.wallId) : null;
  const selOpening = selWall ? selWall.openings.find((o: any) => o.id === sel.openingId) : null;
  const selFloorObj = selFloor ? floorObjects.find((o: any) => o.id === selFloor) : null;

  return (
    <div className="relative">
      {/* paleta objektů */}
      <div className="mb-2 space-y-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="w-24 shrink-0 text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">Detail:</span>
          {([
            ["full", "Vše", "Název stěny, rozměry i plocha"],
            ["dims", "Jen kóty", "Pouze rozměry stěn"],
            ["off", "Bez popisků", "Čistý model bez textu"],
          ] as const).map(([mode, label, hint]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setLabelMode(mode)}
              title={hint}
              className={`rounded-[var(--radius-sm)] border px-2 py-1 text-[11px] font-bold transition ${
                labelMode === mode
                  ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                  : "border-[var(--line)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="w-24 shrink-0 text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">Na stěnu:</span>
          {WALL_ITEMS.map((item) => (
            <div
              key={item.key}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData(WALL_MIME, item.key);
                event.dataTransfer.effectAllowed = "copy";
              }}
              onClick={() => addToActiveWall(item)}
              title={`${item.name} (${item.w}×${item.h} cm) – přetáhni na stěnu, nebo klikni pro přidání na aktivní stěnu`}
              className="inline-flex cursor-grab items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-2 py-1 text-xs font-bold text-[var(--text-soft)] shadow-sm transition hover:border-[var(--brand)] hover:text-[var(--brand)] active:cursor-grabbing"
            >
              <span className="text-sm leading-none">{item.icon}</span>
              {item.name}
            </div>
          ))}
          <div
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData(POINT_MIME, "1");
              event.dataTransfer.effectAllowed = "copy";
            }}
            title="Geometrický bod – přetáhni na okno/dveře (obloukové nadpraží) nebo na stěnu (klenba). Pak úchyt vytáhni myší nahoru."
            className="inline-flex cursor-grab items-center gap-1 rounded-[var(--radius-sm)] border border-dashed border-[var(--muted)] bg-[var(--card)] px-2 py-1 text-xs font-bold text-[var(--text-soft)] shadow-sm transition hover:border-[var(--brand)] hover:text-[var(--brand)] active:cursor-grabbing"
          >
            <span className="text-sm leading-none">⌒</span>
            Geom. bod
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="w-24 shrink-0 text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">Na půdorys:</span>
          {FLOOR_ITEMS.map((item) => (
            <div
              key={item.key}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData(FLOOR_MIME, item.key);
                event.dataTransfer.effectAllowed = "copy";
              }}
              onClick={() => addToFloorCenter(item)}
              title={`${item.name} – přetáhni na podlahu půdorysu, nebo klikni pro přidání doprostřed`}
              className="inline-flex cursor-grab items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-2 py-1 text-xs font-bold text-[var(--text-soft)] shadow-sm transition hover:border-[var(--brand)] hover:text-[var(--brand)] active:cursor-grabbing"
            >
              <span className="text-sm leading-none">{item.icon}</span>
              {item.name}
              {item.stairs && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setStairsUp((v) => !v);
                  }}
                  title={stairsUp ? "Směřuje nahoru (klikni pro dolů)" : "Směřuje dolů (klikni pro nahoru)"}
                  className="ml-0.5 grid h-5 w-5 place-items-center rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-soft)] text-[13px] font-black leading-none hover:border-[var(--brand)]"
                  style={{ color: "var(--brand)" }}
                >
                  {stairsUp ? "↑" : "↓"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={viewBox}
        className={`mx-auto h-auto max-h-[440px] w-full touch-none ${facade ? "rounded-[var(--radius-sm)]" : ""}`}
        role="img"
        aria-label="3D náhled místnosti"
        onDragLeave={() => {
          setDragWallId(null);
          setDragFloor(false);
        }}
      >
        {/* fasáda: trávník (plocha zvenku) kolem půdorysu – zdůrazní pohled zvenku */}
        {facade && (
          <>
            <polygon points={pointsAttr(groundFloor)} fill="#bbf7d0" stroke="#4d7c0f" strokeWidth="1.5" />
            {/* jemné čárky trávníku */}
            {Array.from({ length: 26 }, (_, i) => {
              const t = i / 25;
              const a = iso(Math.min(...fxs) - gMargin + (Math.max(...fxs) - Math.min(...fxs) + gMargin * 2) * t, Math.min(...fys) - gMargin, 0);
              const b = iso(Math.min(...fxs) - gMargin + (Math.max(...fxs) - Math.min(...fxs) + gMargin * 2) * t, Math.max(...fys) + gMargin, 0);
              return <line key={i} x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke="#86efac" strokeWidth="0.8" />;
            })}
          </>
        )}
        {/* podlaha / základna – zároveň plocha pro puštění podlahových objektů */}
        <polygon
          points={pointsAttr(floorPoints)}
          fill={dragFloor ? "color-mix(in srgb, var(--brand) 22%, #f5f5f4)" : facade ? "#e7e5e4" : "#f5f5f4"}
          stroke={dragFloor ? "var(--brand)" : facade ? "#78716c" : "#a8a29e"}
          strokeWidth={dragFloor ? 3 : 1.5}
          strokeDasharray={facade ? "0" : "5 4"}
          onClick={() => {
            setSel(null);
            setSelFloor(null);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
            if (!dragFloor) setDragFloor(true);
          }}
          onDrop={dropOnFloor}
        />
        {/* podlahové objekty (schodiště, kamna, komín) – kvádr s výškou, schody nahoru stoupají */}
        {floorObjects.map((obj: any) => {
          const w = Math.max(1, n(obj.w));
          const d = Math.max(1, n(obj.d));
          const h = Math.max(0, n(obj.h));
          const x0 = obj.x;
          const y0 = obj.y;
          const P = (dx: number, dy: number, z: number) => iso(x0 + dx, y0 + dy, z);
          const style = FLOOR_STYLE[obj.kind] ?? FLOOR_STYLE.stove;
          const selected = selFloor === obj.id;
          const sw = selected ? 3.5 : 1.6;
          const outline = selected ? "var(--brand)" : style.stroke;
          const isStairs = obj.kind === "stairs";
          const base = [P(0, 0, 0), P(w, 0, 0), P(w, d, 0), P(0, d, 0)];

          return (
            <g
              key={obj.id}
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={(event) =>
                grabToTrash(
                  event,
                  () => {
                    onRemoveFloorObject?.(obj.id);
                    setSelFloor(null);
                  },
                  () => {
                    setSel(null);
                    setSelFloor(obj.id);
                  },
                )
              }
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <title>Kliknutím upravíš rozměr objektu</title>
              {isStairs && obj.up && h > 0 ? (
                // schody nahoru: stoupající rampa od podlahy do výšky stěny
                <>
                  <polygon points={pointsAttr([P(w, 0, 0), P(w, d, h), P(w, d, 0)])} fill={style.stroke} fillOpacity="0.35" stroke={outline} strokeWidth={sw} strokeLinejoin="round" />
                  <polygon points={pointsAttr([P(0, 0, 0), P(w, 0, 0), P(w, d, h), P(0, d, h)])} fill={style.fill} fillOpacity="0.95" stroke={outline} strokeWidth={sw} strokeLinejoin="round" />
                  {Array.from({ length: 7 }, (_, i) => (i + 1) / 8).map((f, i) => {
                    const a = P(0, d * f, h * f);
                    const b = P(w, d * f, h * f);
                    return <line key={i} x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke={style.stroke} strokeWidth="1.2" opacity="0.75" />;
                  })}
                  <text x={P(w / 2, d / 2, h / 2).sx} y={P(w / 2, d / 2, h / 2).sy} textAnchor="middle" fontSize="11" fontWeight="800" fill={style.stroke} pointerEvents="none">↑ nahoru</text>
                </>
              ) : h > 0 ? (
                // kvádr (kamna, komín, …): dvě přední stěny + horní deska
                <>
                  <polygon points={pointsAttr([P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)])} fill={style.fill} fillOpacity="0.75" stroke={outline} strokeWidth={sw} strokeLinejoin="round" />
                  <polygon points={pointsAttr([P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)])} fill={style.fill} fillOpacity="0.6" stroke={outline} strokeWidth={sw} strokeLinejoin="round" />
                  <polygon points={pointsAttr([P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)])} fill={style.fill} fillOpacity="0.98" stroke={outline} strokeWidth={sw} strokeLinejoin="round" />
                  <text x={P(w / 2, d / 2, h).sx} y={P(w / 2, d / 2, h).sy + 3} textAnchor="middle" fontSize="11" fontWeight="800" fill={style.stroke} pointerEvents="none">{obj.name}</text>
                </>
              ) : (
                // ploché (schody dolů): jen naznačení na podlaze
                <>
                  <polygon points={pointsAttr(base)} fill={style.fill} fillOpacity="0.9" stroke={outline} strokeWidth={sw} strokeLinejoin="round" />
                  {Array.from({ length: 6 }, (_, i) => (i + 1) / 7).map((f, i) => {
                    const a = P(0, d * f, 0);
                    const b = P(w, d * f, 0);
                    return <line key={i} x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke={style.stroke} strokeWidth="1" opacity="0.7" />;
                  })}
                  <text x={P(w / 2, d / 2, 0).sx} y={P(w / 2, d / 2, 0).sy + 3} textAnchor="middle" fontSize="11" fontWeight="800" fill={style.stroke} pointerEvents="none">{isStairs ? "Schody ↓" : obj.name}</text>
                </>
              )}
            </g>
          );
        })}
        {ordered.map((seg: any) => {
          const { wall, start, dir, height } = seg;
          const active = wall.id === hoverId;
          const dropTarget = wall.id === dragWallId;
          const at = (t: number, z: number) => iso(start[0] + dir[0] * t, start[1] + dir[1] * t, z);
          const corners = [at(0, 0), at(seg.length, 0), at(seg.length, height), at(0, height)];
          const top = at(seg.length / 2, height);
          return (
            <g
              key={wall.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoverId(wall.id)}
              onMouseLeave={() => setHoverId((prev) => (prev === wall.id ? null : prev))}
              onClick={() => onSelectWall?.(wall.id)}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
                if (dragWallId !== wall.id) setDragWallId(wall.id);
              }}
              onDrop={(event) => dropOnWall(event, seg)}
            >
              <title>Přetáhni sem objekt z palety · kliknutím přejdeš na zadání rozměrů stěny</title>
              {(() => {
                // horní hrana: rovná, nebo klenutá podle geometrických bodů
                const arcs = wallArcs(wall);
                const p0 = at(0, 0);
                const p1 = at(seg.length, 0);
                let d = `M ${p0.sx} ${p0.sy} L ${p1.sx} ${p1.sy}`;
                if (!arcs.length) {
                  const t1 = at(seg.length, height);
                  const t0 = at(0, height);
                  d += ` L ${t1.sx} ${t1.sy} L ${t0.sx} ${t0.sy} Z`;
                } else {
                  const end = at(seg.length, height);
                  d += ` L ${end.sx} ${end.sy}`;
                  // zprava doleva přes jednotlivé oblouky
                  [...arcs].reverse().forEach((arc: any) => {
                    const from = at(arc.to, height);
                    const to = at(arc.from, height);
                    const apex = at(arc.x, height + arc.rise);
                    const cx = 2 * apex.sx - (from.sx + to.sx) / 2;
                    const cy = 2 * apex.sy - (from.sy + to.sy) / 2;
                    d += ` L ${from.sx} ${from.sy}`; // plochý úsek mezery (traverza) před obloukem
                    d += ` Q ${cx} ${cy} ${to.sx} ${to.sy}`;
                  });
                  d += " Z";
                }
                return (
                  <path
                    d={d}
                    fill={dropTarget || active ? "var(--brand)" : facade ? WALL_COLORS.facade.fill : WALL_COLORS.interior.fill}
                    fillOpacity={dropTarget ? 0.42 : active ? 0.28 : facade ? 0.92 : 0.72}
                    stroke={dropTarget || active ? "var(--brand)" : facade ? WALL_COLORS.facade.stroke : WALL_COLORS.interior.stroke}
                    strokeWidth={dropTarget ? 4 : active ? 3 : 2}
                    strokeLinejoin="round"
                  />
                );
              })()}
              {wall.openings.map((opening: any) => {
                const kind = openingKind(opening);
                const ow = Math.max(0, n(opening.width));
                const oh = Math.max(0, n(opening.height));
                const ox = Math.min(Math.max(0, n(opening.x)), Math.max(0, seg.length - ow));
                const oy = Math.min(Math.max(0, n(opening.y)), Math.max(0, height - oh));
                const selected = sel?.wallId === wall.id && sel?.openingId === opening.id;
                const fill = kind === "door" ? "#fbbf24" : kind === "other" ? "#d4d4d4" : "#7dd3fc";
                const stroke = kind === "door" ? "#92400e" : kind === "other" ? "#525252" : "#0369a1";
                const select = (event: any) => {
                  event.stopPropagation();
                  setSel({ wallId: wall.id, openingId: opening.id });
                };
                // uchopení otvoru: klik vybere, tažení do Koše smaže
                const grab = (event: any) =>
                  grabToTrash(
                    event,
                    () => {
                      onRemoveOpening?.(wall.id, opening.id);
                      setSel(null);
                    },
                    () => setSel({ wallId: wall.id, openingId: opening.id }),
                  );

                // hloubka špalety – okno/dveře se zapustí od líce stěny ven (do exteriéru)
                const depth = Math.max(0, n(opening.reveal));
                const arch = Math.max(0, n(opening.arch));

                // vnější normála stěny (směr od středu místnosti ven)
                let nx = -dir[1];
                let ny = dir[0];
                const mx = start[0] + dir[0] * (seg.length / 2);
                const my = start[1] + dir[1] * (seg.length / 2);
                if ((mx - floorCenter.x) * nx + (my - floorCenter.y) * ny < 0) {
                  nx = -nx;
                  ny = -ny;
                }
                const atO = (t: number, z: number, off: number) => iso(start[0] + dir[0] * t + nx * off, start[1] + dir[1] * t + ny * off, z);

                // Vnější konec špalety: při pravém úhlu stejný otvor, jinak menší
                // (špaleta se pak do místnosti šikmo rozevírá).
                const outer = outerOpening(opening);
                const insetX = Math.max(0, (ow - outer.width) / 2);
                const insetY = Math.max(0, (oh - outer.height) / 2);
                const onFloorOpening = kind === "door" || n(opening.y) === 0;

                // obrys otvoru v rovině stěny; při oblouku je nadpraží zaoblené
                const shape = (off: number) => {
                  const p = (t: number, z: number) => (off ? atO(t, z, off) : at(t, z));
                  // na vnějším konci se otvor zúží dovnitř (parapet u dveří zůstává na podlaze)
                  const ix = off ? insetX : 0;
                  const iyTop = off ? insetY : 0;
                  const iyBottom = off && !onFloorOpening ? insetY : 0;
                  const bl = p(ox + ix, oy + iyBottom);
                  const br = p(ox + ow - ix, oy + iyBottom);
                  const tr = p(ox + ow - ix, oy + oh - iyTop);
                  const tl = p(ox + ix, oy + oh - iyTop);
                  let d = `M ${bl.sx} ${bl.sy} L ${br.sx} ${br.sy} L ${tr.sx} ${tr.sy}`;
                  if (arch > 0) {
                    const apex = p(ox + ow / 2, oy + oh + arch);
                    d += ` Q ${2 * apex.sx - (tr.sx + tl.sx) / 2} ${2 * apex.sy - (tr.sy + tl.sy) / 2} ${tl.sx} ${tl.sy}`;
                  } else {
                    d += ` L ${tl.sx} ${tl.sy}`;
                  }
                  return d + " Z";
                };

                // Příčle členěného okna — dělicí čáry v rovině otvoru.
                // Kreslí se stejnou projekcí jako obrys, takže ve 3D leží na stěně.
                const panes = kind === "window" ? windowPanes(opening) : { x: 1, y: 1 };
                const paneLines = () => {
                  if (panes.x < 2 && panes.y < 2) return "";
                  let d = "";
                  for (let i = 1; i < panes.x; i++) {
                    const t = ox + (ow * i) / panes.x;
                    const a = at(t, oy);
                    const b = at(t, oy + oh);
                    d += ` M ${a.sx} ${a.sy} L ${b.sx} ${b.sy}`;
                  }
                  for (let j = 1; j < panes.y; j++) {
                    const z = oy + (oh * j) / panes.y;
                    const a = at(ox, z);
                    const b = at(ox + ow, z);
                    d += ` M ${a.sx} ${a.sy} L ${b.sx} ${b.sy}`;
                  }
                  return d.trim();
                };

                if (!depth) {
                  return (
                    <g key={opening.id}>
                      <path d={shape(0)} fill={fill} fillOpacity="0.9" stroke={selected ? "var(--brand)" : stroke} strokeWidth={selected ? 4 : 1.5} strokeLinejoin="round" className="cursor-grab active:cursor-grabbing" onPointerDown={grab}>
                        <title>{arch > 0 ? `Oblouk ${arch} cm · ` : ""}Kliknutím upravíš rozměr objektu</title>
                      </path>
                      {paneLines() && <path d={paneLines()} fill="none" stroke={stroke} strokeWidth="1" strokeOpacity="0.65" pointerEvents="none" />}
                      {arch > 0 && (
                        <circle
                          cx={at(ox + ow / 2, oy + oh + arch).sx}
                          cy={at(ox + ow / 2, oy + oh + arch).sy}
                          r="9"
                          fill="white"
                          stroke="var(--brand)"
                          strokeWidth="3"
                          className="cursor-ns-resize"
                          onClick={(event) => event.stopPropagation()}
                          onPointerDown={(event) =>
                            dragArch(
                              event,
                              arch,
                              (rise) => onUpdateOpening?.(wall.id, opening.id, { arch: rise }),
                              () => onUpdateOpening?.(wall.id, opening.id, { arch: 0 }),
                            )
                          }
                          onDoubleClick={(event) => {
                            event.stopPropagation();
                            onUpdateOpening?.(wall.id, opening.id, { arch: 0 });
                          }}
                        >
                          <title>Táhni nahoru/dolů – vzepětí oblouku ({arch} cm). Dvojklik oblouk zruší.</title>
                        </circle>
                      )}
                    </g>
                  );
                }

                const corners2d = [
                  [ox, oy],
                  [ox + ow, oy],
                  [ox + ow, oy + oh],
                  [ox, oy + oh],
                ];
                const frontPts = corners2d.map(([t, z]) => atO(t, z, 0));
                // vnější konec je u šikmé špalety zúžený → boční plochy jsou lichoběžníky
                const backCorners = [
                  [ox + insetX, oy + (onFloorOpening ? 0 : insetY)],
                  [ox + ow - insetX, oy + (onFloorOpening ? 0 : insetY)],
                  [ox + ow - insetX, oy + oh - insetY],
                  [ox + insetX, oy + oh - insetY],
                ];
                const backPts = backCorners.map(([t, z]) => atO(t, z, depth));
                const onFloor = kind === "door" || n(opening.y) === 0;

                // boční plochy špalety (0 = parapet/práh, 1 = pravé ostění, 2 = nadpraží, 3 = levé ostění)
                const faces = [];
                for (let i = 0; i < 4; i++) {
                  if (onFloor && i === 0) continue; // otvor stojící na podlaze nemá spodní špaletu
                  const j = (i + 1) % 4;
                  const midT = (corners2d[i][0] + corners2d[j][0]) / 2;
                  const px = start[0] + dir[0] * midT + nx * (depth / 2);
                  const py = start[1] + dir[1] * midT + ny * (depth / 2);
                  faces.push({ pts: [frontPts[i], frontPts[j], backPts[j], backPts[i]], d: px + py, top: i === 2 });
                }
                faces.sort((a, b) => a.d - b.d); // vzdálenější špaleta se kreslí dřív

                return (
                  <g key={opening.id}>
                    <title>
                      Špaleta {depth} cm{arch > 0 ? ` · oblouk ${arch} cm` : ""} · kliknutím upravíš rozměr objektu
                    </title>
                    {/* zapuštěná výplň (okno / dveře) */}
                    <path d={shape(depth)} fill={fill} fillOpacity="0.9" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round" className="cursor-grab active:cursor-grabbing" onPointerDown={grab} />
                    {/* plochy špalety – nadpraží ve stínu, ostění světlejší */}
                    {faces.map((face, index) => (
                      <polygon key={index} points={pointsAttr(face.pts)} fill={facade ? WALL_COLORS.facade.fill : "#cbd5e1"} fillOpacity={face.top ? 0.75 : 0.95} stroke={stroke} strokeWidth="1" strokeLinejoin="round" className="cursor-grab active:cursor-grabbing" onPointerDown={grab} />
                    ))}
                    {/* obrys otvoru v líci stěny */}
                    <path d={shape(0)} fill="none" stroke={selected ? "var(--brand)" : stroke} strokeWidth={selected ? 4 : 1.5} strokeLinejoin="round" className="cursor-grab active:cursor-grabbing" onPointerDown={grab} />
                    {arch > 0 && (
                      <circle
                        cx={at(ox + ow / 2, oy + oh + arch).sx}
                        cy={at(ox + ow / 2, oy + oh + arch).sy}
                        r="9"
                        fill="white"
                        stroke={trashHot ? "#dc2626" : "var(--brand)"}
                        strokeWidth="3"
                        className="cursor-ns-resize"
                        onClick={(event) => event.stopPropagation()}
                        onPointerDown={(event) =>
                          dragArch(
                            event,
                            arch,
                            (rise) => onUpdateOpening?.(wall.id, opening.id, { arch: rise }),
                            () => onUpdateOpening?.(wall.id, opening.id, { arch: 0 }),
                          )
                        }
                        onDoubleClick={(event) => {
                          event.stopPropagation();
                          onUpdateOpening?.(wall.id, opening.id, { arch: 0 });
                        }}
                      >
                        <title>Táhni nahoru/dolů – vzepětí oblouku ({arch} cm) · přetažením do Koše zrušíš</title>
                      </circle>
                    )}
                  </g>
                );
              })}
              {/* úchyty kleneb na horní hraně stěny */}
              {wallArcs(wall).map((arc: any) => {
                const apex = at(arc.x, height + arc.rise);
                return (
                  <circle
                    key={arc.id}
                    cx={apex.sx}
                    cy={apex.sy}
                    r="9"
                    fill="white"
                    stroke={trashHot ? "#dc2626" : "var(--brand)"}
                    strokeWidth="3"
                    className="cursor-ns-resize"
                    onClick={(event) => event.stopPropagation()}
                    onPointerDown={(event) =>
                      dragArch(
                        event,
                        arc.rise,
                        (rise) => onUpdateWall?.(wall.id, { arcs: (wall.arcs ?? []).map((item: any) => (item.id === arc.id ? { ...item, rise } : item)) }),
                        () => onUpdateWall?.(wall.id, { arcs: (wall.arcs ?? []).filter((item: any) => item.id !== arc.id) }),
                      )
                    }
                    onDoubleClick={(event) => {
                      event.stopPropagation();
                      onUpdateWall?.(wall.id, { arcs: (wall.arcs ?? []).filter((item: any) => item.id !== arc.id) });
                    }}
                  >
                    <title>Klenba {arc.rise} cm · táhni nahoru/dolů · přetažením do Koše odstraníš</title>
                  </circle>
                );
              })}
              {labelMode === "full" && (
                <text x={top.sx} y={top.sy - 8} textAnchor="middle" fontSize="13" fontWeight="800" fill={active ? "var(--brand)" : "#334155"} pointerEvents="none">
                  {wall.name}
                </text>
              )}
              {labelMode !== "off" && (
                <text
                  x={top.sx}
                  y={labelMode === "full" ? top.sy + 6 : top.sy}
                  textAnchor="middle"
                  fontSize={labelMode === "dims" ? 12 : 10}
                  fontWeight={labelMode === "dims" ? 700 : 400}
                  fill={labelMode === "dims" ? "#334155" : "#64748b"}
                  pointerEvents="none"
                >
                  {labelMode === "dims"
                    ? `${n(wall.width)} × ${n(wall.height)} cm`
                    : `${n(wall.width)} × ${n(wall.height)} cm · ${f2(wallStats(wall).clean)} m²`}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* editor vybraného objektu */}
      {selOpening && (
        <div className="absolute right-3 top-11 z-10 w-52 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] p-3 text-xs shadow-xl">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="font-black" style={{ color: "var(--brand)" }}>
              {openingKind(selOpening) === "other" ? inferOtherOpening(selOpening).label : selOpening.name}
            </span>
            <button type="button" onClick={() => setSel(null)} className="text-[var(--muted)] hover:text-[var(--text)]" title="Zavřít">
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Šířka", "width"],
              ["Výška", "height"],
              ["Zleva", "x"],
              ["Od podlahy", "y"],
              ["Špaleta", "reveal"],
              ["Oblouk", "arch"],
            ].map(([label, field]) => (
              <label key={field} className="block">
                <div className="mb-0.5 text-[10px] font-bold uppercase text-[var(--muted)]">{label}</div>
                <input
                  value={selOpening[field] ?? 0}
                  onChange={(event) => onUpdateOpening?.(sel!.wallId, sel!.openingId, { [field]: event.target.value })}
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-2 py-1 text-right"
                />
              </label>
            ))}
          </div>
          {openingKind(selOpening) === "window" && (
            <label className="mt-2 block">
              <div className="mb-0.5 text-[10px] font-bold uppercase text-[var(--muted)]">Členění okna</div>
              <select
                value={`${windowPanes(selOpening).x}x${windowPanes(selOpening).y}`}
                onChange={(event) => {
                  const [px, py] = event.target.value.split("x").map(Number);
                  onUpdateOpening?.(sel!.wallId, sel!.openingId, { panesX: px, panesY: py });
                }}
                className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-2 py-1"
              >
                {WINDOW_PANE_PRESETS.map((preset) => (
                  <option key={preset.id} value={`${preset.x}x${preset.y}`}>
                    {preset.label} ({preset.x} × {preset.y})
                  </option>
                ))}
              </select>
            </label>
          )}
          {n(selOpening.reveal) > 0 && (
            <div className="mt-2 border-t border-[var(--line)] pt-1.5">
              <label className="flex items-center gap-1.5 font-bold" title="Špaleta kolmo ke stěně. Odškrtnutím se otvor na vnější straně zmenší a špaleta se do místnosti šikmo rozevře.">
                <input
                  type="checkbox"
                  checked={selOpening.revealSquare !== false}
                  onChange={(event) =>
                    onUpdateOpening?.(sel!.wallId, sel!.openingId, {
                      revealSquare: event.target.checked,
                      ...(event.target.checked
                        ? {}
                        : { outerWidth: Math.round(n(selOpening.width) * 0.8), outerHeight: Math.round(n(selOpening.height) * 0.9) }),
                    })
                  }
                />
                ⊾ Pravý úhel
              </label>
              {selOpening.revealSquare === false && (
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <label className="block">
                    <div className="mb-0.5 text-[10px] font-bold uppercase text-[var(--muted)]">Venku šířka</div>
                    <input
                      value={selOpening.outerWidth ?? ""}
                      onChange={(event) => onUpdateOpening?.(sel!.wallId, sel!.openingId, { outerWidth: event.target.value })}
                      className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-2 py-1 text-right"
                    />
                  </label>
                  <label className="block">
                    <div className="mb-0.5 text-[10px] font-bold uppercase text-[var(--muted)]">Venku výška</div>
                    <input
                      value={selOpening.outerHeight ?? ""}
                      onChange={(event) => onUpdateOpening?.(sel!.wallId, sel!.openingId, { outerHeight: event.target.value })}
                      className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-2 py-1 text-right"
                    />
                  </label>
                </div>
              )}
            </div>
          )}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[var(--muted)]">-{f2((n(selOpening.width) * n(selOpening.height)) / 10000)} m²</span>
            <button
              type="button"
              onClick={() => {
                onRemoveOpening?.(sel!.wallId, sel!.openingId);
                setSel(null);
              }}
              className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-2 py-1 font-bold text-red-700 hover:bg-red-100"
            >
              Smazat
            </button>
          </div>
        </div>
      )}

      {/* editor vybraného podlahového objektu */}
      {selFloorObj && (
        <div className="absolute right-3 top-11 z-10 w-52 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] p-3 text-xs shadow-xl">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="font-black" style={{ color: "var(--brand)" }}>{selFloorObj.name}</span>
            <button type="button" onClick={() => setSelFloor(null)} className="text-[var(--muted)] hover:text-[var(--text)]" title="Zavřít">✕</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Šířka", "w"],
              ["Délka", "d"],
              ["Výška", "h"],
            ].map(([label, field]) => (
              <label key={field} className="block">
                <div className="mb-0.5 text-[10px] font-bold uppercase text-[var(--muted)]">{label}</div>
                <input
                  value={selFloorObj[field] ?? 0}
                  onChange={(event) => onUpdateFloorObject?.(selFloorObj.id, { [field]: event.target.value })}
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-1.5 py-1 text-right"
                />
              </label>
            ))}
          </div>
          {selFloorObj.kind === "stairs" && (
            <button
              type="button"
              onClick={() =>
                onUpdateFloorObject?.(selFloorObj.id, {
                  up: !selFloorObj.up,
                  h: !selFloorObj.up ? roomHeight : 0,
                  name: `Schodiště ${!selFloorObj.up ? "nahoru" : "dolů"}`,
                })
              }
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-soft)] py-1 font-bold hover:border-[var(--brand)]"
              title="Nahoru = stoupá do výšky stěny, dolů = jen naznačeno na podlaze"
            >
              Směr: {selFloorObj.up ? "nahoru ↑" : "dolů ↓"} (přepnout)
            </button>
          )}
          <div className="mt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={() => {
                onRemoveFloorObject?.(selFloorObj.id);
                setSelFloor(null);
              }}
              className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-2 py-1 font-bold text-red-700 hover:bg-red-100"
            >
              Smazat
            </button>
          </div>
        </div>
      )}

      {/* fasáda: štítek zdůrazňující pohled zvenku */}
      {facade && (
        <div className="pointer-events-none absolute right-3 bottom-9 rounded-full border border-amber-300 bg-amber-50/90 px-2.5 py-1 text-[11px] font-bold text-amber-900 shadow-sm">
          ☀ Pohled zvenku (fasáda)
        </div>
      )}

      {/* Detail stěny po najetí myší (skryje se, když je otevřený editor objektu) */}
      {!selOpening && !selFloorObj && hovered ? (
        <div className="pointer-events-none absolute left-3 top-11 max-w-[260px] rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] p-3 text-xs shadow-lg">
          <div className="font-black" style={{ color: "var(--brand)" }}>{hovered.wall.name}</div>
          <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[var(--text-soft)]">
            <span className="text-[var(--muted)]">Rozměr</span>
            <span className="text-right font-semibold">{n(hovered.wall.width)} × {n(hovered.wall.height)} cm</span>
            <span className="text-[var(--muted)]">Čistá plocha</span>
            <span className="text-right font-semibold">{f2(wallStats(hovered.wall).clean)} m²</span>
            <span className="text-[var(--muted)]">Rozsah</span>
            <span className="text-right font-semibold">{SCOPE_LABEL[hovered.wall.scope] ?? hovered.wall.scope}</span>
            {wallStats(hovered.wall).reveals > 0 && (
              <>
                <span className="text-[var(--muted)]">Špalety</span>
                <span className="text-right font-semibold text-emerald-700">+{f2(wallStats(hovered.wall).reveals)} m²</span>
              </>
            )}
            <span className="text-[var(--muted)]">Otvory</span>
            <span className="text-right font-semibold">{hovered.wall.openings.length ? `${hovered.wall.openings.length}× (-${f2(wallStats(hovered.wall).openings)} m²)` : "žádné"}</span>
          </div>
          <div className="mt-2 border-t border-[var(--line)] pt-1.5">
            <div className="text-[10px] font-bold uppercase text-[var(--muted)]">Práce na stěně</div>
            {hovered.wall.workIds?.length ? (
              <ul className="mt-0.5 space-y-0.5">
                {hovered.wall.workIds.map((id: string) => (
                  <li key={id} className="flex gap-1.5">
                    <span style={{ color: "var(--brand)" }}>•</span>
                    <span>{workName(id)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-0.5 text-[var(--muted)]">Žádné práce nevybrány.</div>
            )}
          </div>
        </div>
      ) : !selOpening && !selFloorObj ? (
        <div className="pointer-events-none absolute left-3 top-11 rounded-[var(--radius-sm)] border border-dashed border-[var(--line)] bg-[var(--card)]/80 px-2.5 py-1.5 text-[11px] text-[var(--muted)]">
          Najeď myší na stěnu pro detail
        </div>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[var(--muted)]">
        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 border border-sky-700 bg-sky-300" /> Okno</span>
        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 border border-amber-800 bg-amber-400" /> Dveře</span>
        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 border border-indigo-700 bg-indigo-300" /> Schody</span>
        <span className="ml-auto">Objekt na stěnu / na půdorys · klik na objekt = úprava rozměru</span>
      </div>
    </div>
  );
}
