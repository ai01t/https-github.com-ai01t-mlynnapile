"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FAQPageDE() {
  const router = useRouter()

  useEffect(() => {
    router.push("/de?section=about#faq")
  }, [router])

  return null
}
