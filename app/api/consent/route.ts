import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id, consent } = body

    if (!session_id || !consent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Hash IP for privacy
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex")

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Insert consent record
    const { error } = await supabase.from("cookie_consents").insert({
      session_id,
      ip_hash: ipHash,
      user_agent: userAgent,
      consent,
    })

    if (error) {
      console.error("Error saving consent:", error)
      return NextResponse.json({ error: "Failed to save consent" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in consent API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get consent statistics
    const { data: consents, error } = await supabase
      .from("cookie_consents")
      .select("consent, created_at")
      .order("created_at", { ascending: false })
      .limit(1000)

    if (error) {
      console.error("Error fetching consents:", error)
      return NextResponse.json({ error: "Failed to fetch consents" }, { status: 500 })
    }

    // Calculate statistics
    const stats = {
      total: consents.length,
      analytics: consents.filter((c) => c.consent.analytics).length,
      advertising: consents.filter((c) => c.consent.advertising).length,
      personalization: consents.filter((c) => c.consent.personalization).length,
      allAccepted: consents.filter((c) => c.consent.analytics && c.consent.advertising && c.consent.personalization)
        .length,
      onlyNecessary: consents.filter(
        (c) => !c.consent.analytics && !c.consent.advertising && !c.consent.personalization,
      ).length,
    }

    return NextResponse.json({ stats, consents })
  } catch (error) {
    console.error("Error in consent stats API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
