"use client"

import { useState } from "react"
import { Download, User } from "lucide-react"

export function BusinessCardDownload() {
  const [isHovered, setIsHovered] = useState(false)

  const handleImageDownload = async () => {
    try {
      // Fetch the image as blob
      const response = await fetch("/images/business-card.png")
      const blob = await response.blob()

      // Create object URL
      const url = window.URL.createObjectURL(blob)

      // Create download link
      const link = document.createElement("a")
      link.href = url
      link.download = "vizitka-mlyn-na-pile.png"

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
      // Fallback method
      const link = document.createElement("a")
      link.href = "/images/business-card.png"
      link.download = "vizitka-mlyn-na-pile.png"
      link.target = "_blank"
      link.click()
    }
  }

  const handleVCardDownload = () => {
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:Ing. Jindřích Traxmandl
N:Traxmandl;Jindřích;;Ing.;
ORG:Mlýn na Pile
TEL;TYPE=CELL:+420724050093
EMAIL:mlynnapile@gmail.com
ADR;TYPE=WORK:;;Pila 100;Trhanov;;34401;Česká republika
URL:https://mlynnapile.cz
NOTE:Prémiové nahrávací studio v historickém mlýně
END:VCARD`

    const blob = new Blob([vCardContent], { type: "text/vcard" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "jindrich-traxmandl.vcf"
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="relative inline-block">
      <div
        className={`fixed left-1/2 -translate-x-1/2 bottom-24 w-72 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ease-out ${
          isHovered ? "opacity-100 scale-100 visible z-[9999]" : "opacity-0 scale-95 invisible z-[-1]"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <img src="/images/business-card.png" alt="Vizitka Mlýn na Pile" className="w-full h-auto" />
        </div>
        <div className="p-2 flex gap-1.5 justify-center bg-white/80">
          <button
            onClick={handleImageDownload}
            className="flex-1 px-2 py-1 text-gray-600 hover:text-gray-900 text-[10px] font-light transition-colors duration-200 flex items-center justify-center gap-1.5"
          >
            <Download className="h-2.5 w-2.5" />
            Stáhnout obrázek
          </button>
          <div className="w-px bg-gray-300" />
          <button
            onClick={handleVCardDownload}
            className="flex-1 px-2 py-1 text-gray-600 hover:text-gray-900 text-[10px] font-light transition-colors duration-200 flex items-center justify-center gap-1.5"
          >
            <User className="h-2.5 w-2.5" />
            Uložit kontakt
          </button>
        </div>
      </div>
      <button
        className="text-xs text-white/60 hover:text-white/90 transition-colors duration-300 font-light underline decoration-white/30 hover:decoration-white/60 underline-offset-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Stáhnout vizitku
      </button>
    </div>
  )
}
