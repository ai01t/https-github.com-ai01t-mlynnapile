"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function StudioPageEN() {
  const router = useRouter()

  useEffect(() => {
    router.push("/en?section=studio")
  }, [router])

  return null
}
