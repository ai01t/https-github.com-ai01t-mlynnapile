// Obsah stránky /chleba. Čtení je veřejné (potřebuje ho každý návštěvník),
// zápis smí jen přihlášený správce.

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions, isAdminEmail } from "@/lib/auth"
import { CONTENT_KEY, emptyContent, normalizeContent } from "@/lib/chleba-content"
import { kv, kvReady } from "@/lib/kv"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  if (!kvReady()) return NextResponse.json(emptyContent)

  const result = await kv([["GET", CONTENT_KEY]])
  const raw = result?.[0]
  if (!raw) return NextResponse.json(emptyContent)

  try {
    return NextResponse.json(normalizeContent(typeof raw === "string" ? JSON.parse(raw) : raw))
  } catch {
    return NextResponse.json(emptyContent)
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 })
  }

  if (!kvReady()) {
    return NextResponse.json(
      { error: "Úložiště není připojené — ve Vercelu chybí KV (proměnné KV_REST_API_URL a KV_REST_API_TOKEN)." },
      { status: 503 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Neplatná data." }, { status: 400 })
  }

  const content = normalizeContent(body)
  content.updatedAt = new Date().toISOString()
  content.updatedBy = session?.user?.email ?? undefined

  const written = await kv([["SET", CONTENT_KEY, JSON.stringify(content)]])
  if (!written) return NextResponse.json({ error: "Úložiště neodpovědělo." }, { status: 502 })

  return NextResponse.json(content)
}
