"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function KontaktPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/?section=contact")
  }, [router])

  return null
}
