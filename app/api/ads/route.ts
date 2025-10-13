import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get("position")

    if (!position) {
      return NextResponse.json({ error: "Position required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Get active ad slot for this position
    const { data: slot } = await supabase
      .from("ad_slots")
      .select("*")
      .eq("position", position)
      .eq("is_active", true)
      .single()

    if (!slot) {
      return NextResponse.json({ ad: null })
    }

    // Get active ad for this slot
    const { data: ad } = await supabase.from("ads").select("*").eq("slot_id", slot.id).eq("is_active", true).single()

    if (!ad) {
      return NextResponse.json({ ad: null })
    }

    return NextResponse.json({ ad, slot })
  } catch (error) {
    console.error("Error fetching ad:", error)
    return NextResponse.json({ ad: null })
  }
}
