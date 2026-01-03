"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ZusammenarbeitPageDE() {
  const router = useRouter()

  useEffect(() => {
    router.push("/de?section=about#collaboration")
  }, [router])

  return null
}
