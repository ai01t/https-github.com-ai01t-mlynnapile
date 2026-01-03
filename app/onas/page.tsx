"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OnasPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/?section=about")
  }, [router])

  return null
}
