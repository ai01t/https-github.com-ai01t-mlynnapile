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
    <div className="relative inline-block">
      <div
        className={`absolute left-0 bottom-full mb-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-700 ease-in-out z-[9999] ${
          isHovered ? "opacity-100 transform translate-y-0 visible" : "opacity-0 transform translate-y-2 invisible"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src="/images/business-card.png"
          alt="Vizitka Mlýn na Pile"
          className="w-full h-auto transition-opacity duration-700"
        />

        {/* Tlačítka pod vizitkou */}
        <div className="p-3 flex gap-2 justify-center bg-gray-50">
          <button
            onClick={handleImageDownload}
            className="px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm border border-gray-200"
          >
            <Download className="h-4 w-4" />
            Stáhnout obrázek
          </button>
          <button
            onClick={handleVCardDownload}
            className="px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm border border-gray-200"
          >
            <User className="h-4 w-4" />
            Uložit kontakt
          </button>
        </div>
      </div>

      {/* Hlavní text */}
      <div
        className={`cursor-pointer transition-all duration-300 ${
          isHovered
            ? "bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-md"
            : "text-lg font-medium text-white/80 hover:text-white"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-2">
          <span>Stáhnout vizitku</span>
          <Download
            className={`transition-all duration-300 ${isHovered ? "h-4 w-4 opacity-100" : "h-0 w-0 opacity-0"}`}
          />
        </div>
      </div>
    </div>
  )
}
