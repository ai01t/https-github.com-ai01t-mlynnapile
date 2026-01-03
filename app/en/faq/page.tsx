"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FAQPageEN() {
  const router = useRouter()

  useEffect(() => {
    router.push("/en?section=about#faq")
  }, [router])

  return null
}
