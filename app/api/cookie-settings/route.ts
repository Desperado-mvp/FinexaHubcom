import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase.from("cookie_settings").select("banner_text").single()

    if (error) {
      // Return default text if table doesn't exist
      return NextResponse.json({
        banner_text:
          "We use cookies to enhance your experience and analyze site traffic. By continuing to visit this site you agree to our use of cookies.",
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({
      banner_text:
        "We use cookies to enhance your experience and analyze site traffic. By continuing to visit this site you agree to our use of cookies.",
    })
  }
}
