"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LocationPageEN() {
  const router = useRouter()

  useEffect(() => {
    router.push("/en?section=lokalita")
  }, [router])

  return null
}
