import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total consents
    const { count: totalConsents } = await supabase.from("user_consents").select("*", { count: "exact", head: true })

    // Get consents by type
    const { data: consents } = await supabase.from("user_consents").select("analytics, advertising, personalization")

    if (!consents) {
      return NextResponse.json({ error: "No data found" }, { status: 404 })
    }

    const stats = {
      total: totalConsents || 0,
      acceptedAll: consents.filter((c) => c.analytics && c.advertising && c.personalization).length,
      declinedAll: consents.filter((c) => !c.analytics && !c.advertising && !c.personalization).length,
      custom: consents.filter(
        (c) =>
          (c.analytics || c.advertising || c.personalization) && !(c.analytics && c.advertising && c.personalization),
      ).length,
      analytics: consents.filter((c) => c.analytics).length,
      advertising: consents.filter((c) => c.advertising).length,
      personalization: consents.filter((c) => c.personalization).length,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching cookie stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const revalidate = 60 // Cache for 1 minute
