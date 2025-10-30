"use client"

import { useState } from "react"
import { Download, User, X } from "lucide-react"

export function BusinessCardDownload() {
  const [isOpen, setIsOpen] = useState(false)

  const handleImageDownload = async () => {
    try {
      const response = await fetch("/images/business-card.png")
      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = "vizitka-mlyn-na-pile.png"

      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
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
EMAIL:info@mlynnapile.cz
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
    <>
      <button
        className="text-lg font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-2">
          <span>Stáhnout vizitku</span>
          <Download className="h-4 w-4" />
        </div>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl w-full animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
              aria-label="Zavřít"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>

            <img src="/images/business-card.png" alt="Vizitka Mlýn na Pile" className="w-full h-auto" />

            {/* Tlačítka pod vizitkou */}
            <div className="p-4 flex flex-col sm:flex-row gap-3 justify-center bg-gray-50">
              <button
                onClick={handleImageDownload}
                className="px-4 py-3 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-sm border border-gray-200"
              >
                <Download className="h-4 w-4" />
                Stáhnout obrázek
              </button>
              <button
                onClick={handleVCardDownload}
                className="px-4 py-3 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-sm border border-gray-200"
              >
                <User className="h-4 w-4" />
                Uložit kontakt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
