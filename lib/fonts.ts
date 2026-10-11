// Písma webu. Hlavní stránka (public/*.html) je načítá z Google Fonts odkazem
// v <head>; stránky v Next (booking, historie, chleba) používají stejný odkaz
// z app/layout.tsx a tyto třídy z globals.css — písmo je tak všude totožné
// a nezávisí na stahování přes next/font při sestavení.
export const cormorant = { className: "font-cormorant" }
export const manrope = { className: "font-manrope" }
