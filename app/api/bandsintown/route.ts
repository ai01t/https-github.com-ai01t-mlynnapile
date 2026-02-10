import { NextResponse } from "next/server"

const BANDSINTOWN_APP_ID = "0a2dea39573f25733169a109f2820195"
const ARTIST_ID = "id_15580598"

export async function GET() {
  try {
    const url = `https://rest.bandsintown.com/artists/${ARTIST_ID}/events?app_id=${BANDSINTOWN_APP_ID}&date=upcoming`
    console.log("[v0] Fetching from:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error("[v0] Bandsintown API error:", response.status, await response.text())
      return NextResponse.json([], { status: 200 })
    }

    const data = await response.json()
    console.log("[v0] Bandsintown raw response:", JSON.stringify(data).slice(0, 500))

    // Return all events (already filtered by date=upcoming)
    const events = Array.isArray(data) ? data : []
    console.log("[v0] Returning events count:", events.length)

    return NextResponse.json(events)
  } catch (error) {
    console.error("[v0] Error fetching Bandsintown events:", error)
    return NextResponse.json([], { status: 200 })
  }
}
