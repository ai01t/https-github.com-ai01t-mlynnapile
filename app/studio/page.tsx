"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function StudioPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main page with section parameter
    router.push("/?section=studio")
  }, [router])

  return null
}
