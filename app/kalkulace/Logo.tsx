"use client";

// Značka aplikace – dům se zednickou lžící (SVG). Název firmy se načítá
// z administrace (/kalkulace/admin), v kódu nejsou žádné osobní údaje.

export const BRAND = "#820c0c";

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 132 132" className={className} aria-hidden="true">
      {/* střecha */}
      <path d="M14 66 L64 20 L114 66" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      {/* zdi a podlaha */}
      <path d="M27 70 V118 H58" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M101 70 V86" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      {/* zednická lžíce – čepel */}
      <path d="M64 122 L97 74 L121 98 Z" fill="currentColor" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      {/* krček */}
      <path d="M104 82 L114 68" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      {/* rukojeť */}
      <path d="M114 66 L126 48" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  name,
  subtitle,
  markClass = "h-11 w-11",
  titleClass = "text-xl",
}: {
  name?: string;
  subtitle?: string;
  markClass?: string;
  titleClass?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark className={`${markClass} shrink-0 text-neutral-900`} />
      <div className="leading-none">
        <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-neutral-700">{subtitle || "Kalkulace a fakturace"}</div>
        <div className={`${titleClass} font-black uppercase tracking-tight`} style={{ color: BRAND }}>
          {name || "Vaše firma"}
        </div>
      </div>
    </div>
  );
}
