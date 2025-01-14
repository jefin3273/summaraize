import { NextResponse } from "next/server"
import { nhost } from "@/lib/nhost"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    if (!process.env.N8N_WEBHOOK_URL) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoUrl: url }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Webhook error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Store in Nhost
    const { error: dbError } = await nhost.graphql.request(`
      mutation InsertSummary($videoUrl: String!, $summary: String!) {
        insert_summaries_one(object: {
          video_url: $videoUrl,
          summary: $summary
        }) {
          id
        }
      }
    `, {
      videoUrl: url,
      summary: data.summary,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save summary" }, { status: 500 })
    }

    return NextResponse.json({ summary: data.summary })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      { error: "Failed to process request", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}