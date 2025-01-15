/* eslint-disable @typescript-eslint/no-unused-vars */
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

    // Call n8n webhook to trigger the YouTube summarization workflow
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoUrl: url,
      }),
    })

    if (!n8nResponse.ok) {
      return NextResponse.json({ error: `n8n error: ${n8nResponse.statusText}` }, { status: n8nResponse.status })
    }

    const data = await n8nResponse.json()

    if (!data.summary) {
      return NextResponse.json({ error: "No summary generated" }, { status: 500 })
    }

    // Store the summary in Nhost database
    const { data: insertData, error: insertError } = await nhost.graphql.request(`
      mutation InsertSummary($videoUrl: String!, $summary: String!) {
        insert_video_summaries_one(object: {
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

    if (insertError) {
      console.error("Error inserting summary:", insertError)
      return NextResponse.json({ error: "Failed to save summary" }, { status: 500 })
    }

    return NextResponse.json({ summary: data.summary })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      { error: "Failed to generate summary", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

