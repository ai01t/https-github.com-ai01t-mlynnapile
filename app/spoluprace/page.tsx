"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SpolupracePageRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/?section=about#collaboration")
  }, [router])

  return null
}
