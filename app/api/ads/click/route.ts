import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ad_id } = body

    if (!ad_id) {
      return NextResponse.json({ error: "Ad ID required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Get session ID
    const sessionId = request.cookies.get("session_id")?.value

    if (!sessionId) {
      return NextResponse.json({ error: "Session not found" }, { status: 400 })
    }

    // Update the most recent impression for this session/ad to clicked
    const { error } = await supabase
      .from("ad_impressions")
      .update({ clicked: true })
      .eq("ad_id", ad_id)
      .eq("session_id", sessionId)
      .eq("clicked", false)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error recording click:", error)
      return NextResponse.json({ error: "Failed to record click" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in click API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
