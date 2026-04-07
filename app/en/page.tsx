"use client"

import { useEffect } from "react"

export default function EnglishPage() {
  useEffect(() => {
    const hash = window.location.hash || ""
    window.location.href = `/?lang=en${hash}`
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <p className="text-white">Redirecting to English version...</p>
    </div>
  )
}
