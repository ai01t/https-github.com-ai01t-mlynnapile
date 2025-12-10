"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function GermanRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/?lang=de")
  }, [router])

  return null
}
