import { NextResponse } from "next/server"

export async function GET() {
  try {
    const artistName = "Anteater"
    const appId = "anteater_official"
    const response = await fetch(`https://rest.bandsintown.com/artists/${artistName}/events?app_id=${appId}`)

    if (!response.ok) {
      return NextResponse.json({ error: `Bandsintown API error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Proxy error fetching events:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
