"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EnglishRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/?lang=en")
  }, [router])

  return null
}
