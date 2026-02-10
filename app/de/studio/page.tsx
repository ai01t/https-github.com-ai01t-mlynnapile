"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function StudioPageDE() {
  const router = useRouter()

  useEffect(() => {
    router.push("/de?section=studio")
  }, [router])

  return null
}
