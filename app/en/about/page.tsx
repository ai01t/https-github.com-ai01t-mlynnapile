"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AboutPageEN() {
  const router = useRouter()

  useEffect(() => {
    router.push("/en?section=about")
  }, [router])

  return null
}
