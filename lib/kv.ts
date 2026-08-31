// Tenký klient pro Vercel KV (Upstash Redis přes REST) – záměrně bez další závislosti.
// Proměnné KV_REST_API_URL a KV_REST_API_TOKEN doplní Vercel sám po připojení KV storu.
// Když nejsou k dispozici (lokální vývoj), funkce se chovají jako no-op, aby aplikace běžela dál.

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

export const kvReady = () => Boolean(KV_URL && KV_TOKEN);

// Spustí dávku Redis příkazů, vrátí pole výsledků (nebo null, když KV není nastavené).
export async function kv(commands: (string | number)[][]): Promise<any[] | null> {
  if (!kvReady()) return null;
  try {
    const response = await fetch(`${KV_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { result: any }[];
    return Array.isArray(data) ? data.map((item) => item?.result) : null;
  } catch {
    // statistika nikdy nesmí shodit aplikaci
    return null;
  }
}
