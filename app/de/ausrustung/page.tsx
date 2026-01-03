"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AusrustungPageDE() {
  const router = useRouter()

  useEffect(() => {
    router.push("/de?section=equipment")
  }, [router])

  return null
}
