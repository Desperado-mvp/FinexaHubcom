import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Eye, TrendingUp, Calendar } from "lucide-react"

export async function ArticleStats() {
  const supabase = await createServerClient()

  // Get total articles
  const { count: totalArticles } = await supabase.from("articles").select("*", { count: "exact", head: true })

  // Get published articles
  const { count: publishedArticles } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")

  // Get total views
  const { count: totalViews } = await supabase.from("article_views").select("*", { count: "exact", head: true })

  // Get articles published this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count: thisMonthArticles } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfMonth.toISOString())

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalArticles || 0}</div>
          <p className="text-xs text-muted-foreground">{publishedArticles || 0} published</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalViews?.toLocaleString() || 0}</div>
          <p className="text-xs text-muted-foreground">All time views</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{thisMonthArticles || 0}</div>
          <p className="text-xs text-muted-foreground">Articles published</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Views</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {publishedArticles && totalViews ? Math.round(totalViews / publishedArticles) : 0}
          </div>
          <p className="text-xs text-muted-foreground">Per article</p>
        </CardContent>
      </Card>
    </div>
  )
}
