"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function KontaktPageDE() {
  const router = useRouter()

  useEffect(() => {
    router.push("/de?section=contact")
  }, [router])

  return null
}
