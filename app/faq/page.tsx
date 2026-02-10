"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FAQPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/?section=about#faq")
  }, [router])

  return null
}
