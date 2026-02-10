"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LokalitatPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/?section=lokalita")
  }, [router])

  return null
}
