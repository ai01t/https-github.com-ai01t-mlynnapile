"use client";

// Značka aplikace. Logo je nahraný obrázek (administrace / záhlaví),
// v kódu nejsou žádné osobní údaje ani pevná grafika.

// Akcentní barva se řídí zvoleným motivem (CSS proměnná).
export const BRAND = "var(--brand)";

export function Logo({
  logo,
  name,
  subtitle,
  markClass = "h-11",
  titleClass = "text-xl",
}: {
  logo?: string;
  name?: string;
  subtitle?: string;
  markClass?: string;
  titleClass?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {logo ? <img src={logo} alt="Logo" className={`${markClass} w-auto shrink-0 object-contain`} /> : null}
      <div className="leading-none">
        <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-soft)]">{subtitle || "Kalkulace a fakturace"}</div>
        <div className={`${titleClass} font-black uppercase tracking-tight`} style={{ color: BRAND }}>
          {name || "Vaše firma"}
        </div>
      </div>
    </div>
  );
}
