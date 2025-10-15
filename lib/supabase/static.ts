import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export function createClientWithoutCookies() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}