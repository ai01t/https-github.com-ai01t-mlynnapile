"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EquipmentPageEN() {
  const router = useRouter()

  useEffect(() => {
    router.push("/en?section=equipment")
  }, [router])

  return null
}
