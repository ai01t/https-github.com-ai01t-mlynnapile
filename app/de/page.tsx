"use client"

import { useEffect } from "react"

export default function GermanPage() {
  useEffect(() => {
    const hash = window.location.hash || ""
    window.location.href = `/?lang=de${hash}`
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <p className="text-white">Weiterleitung zur deutschen Version...</p>
    </div>
  )
}
