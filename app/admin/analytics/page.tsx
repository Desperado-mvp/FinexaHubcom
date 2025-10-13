import { Suspense } from "react"
import { ConsentStats } from "./consent-stats"
import { ArticleStats } from "./article-stats"
import { AdStats } from "./ad-stats"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your site performance, user engagement, and content metrics
        </p>
      </div>

      <Suspense fallback={<StatsLoadingSkeleton />}>
        <ArticleStats />
      </Suspense>

      <Suspense fallback={<StatsLoadingSkeleton />}>
        <ConsentStats />
      </Suspense>

      <Suspense fallback={<StatsLoadingSkeleton />}>
        <AdStats />
      </Suspense>
    </div>
  )
}

function StatsLoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
