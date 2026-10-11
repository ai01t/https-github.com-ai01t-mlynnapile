import { Cormorant_Garamond, Manrope } from "next/font/google"

// Písma webu na jednom místě: hlavní stránka je načítá z Google Fonts,
// stránky v Next (booking, historie, chleba) sdílejí tuto jedinou instanci,
// aby všude vypadala stejně.
export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
})

export const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
})
