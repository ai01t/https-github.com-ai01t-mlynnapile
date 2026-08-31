// Záznam anonymní statistiky používání kalkulačky.
//
// ZÁMĚRNĚ neukládá žádné osobní údaje: server přijímá pouze čísla, přepínače
// a náhodné ID zařízení ze seznamu níže. Cokoli jiného zahodí – i kdyby to
// prohlížeč poslal. Neukládá se ani IP adresa.

import { NextRequest, NextResponse } from "next/server";
import { kv, kvReady } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// povolené události
const EVENTS = new Set(["visit", "quote_saved", "invoice_created", "sketch_used", "view_3d", "room_added", "print_preview"]);

// povolená číselná / logická pole (nic z toho neidentifikuje osobu)
const NUMBERS = new Set(["rooms", "walls", "openings", "floorObjects", "items"]);
const FLAGS = new Set(["has3D", "hasSketch", "facade", "manual", "ceiling"]);

const clampNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(9999, Math.round(parsed))) : 0;
};

export async function POST(request: NextRequest) {
  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = String(payload?.event ?? "");
  if (!EVENTS.has(event)) return NextResponse.json({ ok: false }, { status: 400 });

  // náhodné ID zařízení (vygenerované v prohlížeči, bez vazby na osobu)
  const id = String(payload?.id ?? "").replace(/[^a-z0-9]/gi, "").slice(0, 32);

  // z došlých dat propustíme jen povolená pole
  const clean: Record<string, number | boolean | string> = {};
  const data = payload?.data && typeof payload.data === "object" ? payload.data : {};
  for (const [key, value] of Object.entries(data)) {
    if (NUMBERS.has(key)) clean[key] = clampNumber(value);
    else if (FLAGS.has(key)) clean[key] = Boolean(value);
    // hrubá statistika oboru: pouze první tři číslice IČO (konkrétní firmu z toho nepoznáš)
    else if (key === "icoPrefix" && /^\d{3}$/.test(String(value))) clean.icoPrefix = String(value);
  }

  if (!kvReady()) return NextResponse.json({ ok: true, stored: false });

  const day = new Date().toISOString().slice(0, 10);
  const entry = JSON.stringify({ event, t: new Date().toISOString(), ...clean });

  const commands: (string | number)[][] = [
    ["INCR", `stats:ev:${event}`],
    ["INCR", `stats:day:${day}`],
    ["LPUSH", "stats:events", entry],
    ["LTRIM", "stats:events", 0, 499],
  ];
  if (event === "visit") commands.push(["INCR", "stats:visits"]);
  if (id) commands.push(["SADD", "stats:users", id]);

  await kv(commands);
  return NextResponse.json({ ok: true, stored: true });
}
