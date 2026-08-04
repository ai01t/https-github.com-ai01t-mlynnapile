// Přehled anonymní statistiky pro správce.
// Přístup chrání heslo uložené na serveru (proměnná STATS_KEY ve Vercelu),
// takže data nejsou veřejně stažitelná – na rozdíl od PINu v prohlížeči.

import { NextRequest, NextResponse } from "next/server";
import { kv, kvReady } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENTS = ["visit", "quote_saved", "invoice_created", "sketch_used", "view_3d", "room_added", "print_preview"];

export async function GET(request: NextRequest) {
  const secret = process.env.STATS_KEY;
  if (!secret) return NextResponse.json({ error: "Statistika není nastavená (chybí STATS_KEY)." }, { status: 503 });

  const key = request.headers.get("x-stats-key") ?? "";
  if (key !== secret) return NextResponse.json({ error: "Neplatné heslo." }, { status: 401 });

  if (!kvReady()) return NextResponse.json({ error: "Úložiště není připojené (chybí KV)." }, { status: 503 });

  // posledních 14 dní
  const days: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().slice(0, 10));
  }

  const result = await kv([
    ["GET", "stats:visits"],
    ["SCARD", "stats:users"],
    ["LRANGE", "stats:events", 0, 199],
    ...EVENTS.map((event) => ["GET", `stats:ev:${event}`]),
    ...days.map((day) => ["GET", `stats:day:${day}`]),
  ]);

  if (!result) return NextResponse.json({ error: "Úložiště neodpovědělo." }, { status: 502 });

  const [visits, users, rawEvents, ...rest] = result;
  const eventCounts: Record<string, number> = {};
  EVENTS.forEach((event, index) => {
    eventCounts[event] = Number(rest[index] ?? 0);
  });
  const daily = days.map((day, index) => ({ day, count: Number(rest[EVENTS.length + index] ?? 0) }));

  const events = (Array.isArray(rawEvents) ? rawEvents : [])
    .map((item: string) => {
      try {
        return JSON.parse(item);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return NextResponse.json({
    visits: Number(visits ?? 0),
    uniqueUsers: Number(users ?? 0),
    eventCounts,
    daily,
    events,
  });
}
