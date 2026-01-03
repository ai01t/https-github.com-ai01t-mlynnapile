"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function VybaveniPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/?section=equipment")
  }, [router])

  return null
}
