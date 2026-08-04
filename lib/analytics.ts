"use client";

// Anonymní statistika používání.
// Posílá se jen náhodné ID zařízení (nemá vazbu na žádnou osobu) a čísla o tom,
// jak se aplikace používá. Žádná jména, adresy, telefony ani e-maily.

const ID_KEY = "kalk.anonId";

// Náhodné ID zařízení – vznikne při prvním spuštění a zůstane v prohlížeči.
export function anonId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(ID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID().replace(/-/g, "").slice(0, 16)
          : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem(ID_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

type Payload = Record<string, number | boolean | string>;

export function track(event: string, data: Payload = {}) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({ id: anonId(), event, data });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      return;
    }
    fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
  } catch {
    // statistika nikdy nesmí shodit aplikaci
  }
}
