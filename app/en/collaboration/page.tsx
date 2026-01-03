"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CollaborationPageEN() {
  const router = useRouter()

  useEffect(() => {
    router.push("/en?section=about#collaboration")
  }, [router])

  return null
}
