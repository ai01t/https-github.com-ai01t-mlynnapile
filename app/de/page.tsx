"use client"

import { useEffect } from "react"

export default function GermanPage() {
  useEffect(() => {
    window.location.href = "/?lang=de"
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <p className="text-white">Weiterleitung zur deutschen Version...</p>
    </div>
  )
}
