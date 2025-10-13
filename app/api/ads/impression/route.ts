import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ad_id, position } = body

    if (!ad_id) {
      return NextResponse.json({ error: "Ad ID required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Get session ID from cookie or create new one
    let sessionId = request.cookies.get("session_id")?.value
    if (!sessionId) {
      sessionId = crypto.randomUUID()
    }

    // Hash IP for privacy
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex")

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Get ad slot
    const { data: slot } = await supabase.from("ad_slots").select("id").eq("position", position).single()

    // Record impression
    const { error } = await supabase.from("ad_impressions").insert({
      ad_id,
      ad_slot_id: slot?.id,
      session_id: sessionId,
      ip_hash: ipHash,
      user_agent: userAgent,
      clicked: false,
    })

    if (error) {
      console.error("Error recording impression:", error)
      return NextResponse.json({ error: "Failed to record impression" }, { status: 500 })
    }

    const response = NextResponse.json({ success: true })

    // Set session cookie if new
    if (!request.cookies.get("session_id")) {
      response.cookies.set("session_id", sessionId, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        sameSite: "lax",
      })
    }

    return response
  } catch (error) {
    console.error("Error in impression API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
