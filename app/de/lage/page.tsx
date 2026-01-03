"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LagePageDE() {
  const router = useRouter()

  useEffect(() => {
    router.push("/de?section=lokalita")
  }, [router])

  return null
}
