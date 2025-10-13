import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, MousePointerClick, Eye, TrendingUp } from "lucide-react"

export async function AdStats() {
  const supabase = await createServerClient()

  // Get total ad impressions
  const { count: totalImpressions } = await supabase.from("ad_impressions").select("*", { count: "exact", head: true })

  // Get total clicks
  const { count: totalClicks } = await supabase
    .from("ad_impressions")
    .select("*", { count: "exact", head: true })
    .eq("clicked", true)

  // Get active ad slots
  const { count: activeSlots } = await supabase
    .from("ad_slots")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  // Calculate CTR
  const ctr = totalImpressions && totalClicks ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advertisement Performance</CardTitle>
        <CardDescription>Overview of ad impressions and engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>Impressions</span>
            </div>
            <div className="text-2xl font-bold">{totalImpressions?.toLocaleString() || 0}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MousePointerClick className="h-4 w-4" />
              <span>Clicks</span>
            </div>
            <div className="text-2xl font-bold">{totalClicks?.toLocaleString() || 0}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>CTR</span>
            </div>
            <div className="text-2xl font-bold">{ctr}%</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Active Slots</span>
            </div>
            <div className="text-2xl font-bold">{activeSlots || 0}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
