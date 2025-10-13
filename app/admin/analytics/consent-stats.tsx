"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, BarChart3, TrendingUp } from "lucide-react"

interface ConsentStats {
  total: number
  analytics: number
  advertising: number
  personalization: number
  allAccepted: number
  onlyNecessary: number
}

export function ConsentStats() {
  const [stats, setStats] = useState<ConsentStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/consent")
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching consent stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cookie Consent Statistics</CardTitle>
          <CardDescription>Loading consent data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cookie Consent Statistics</CardTitle>
          <CardDescription>No consent data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const analyticsPercent = (stats.analytics / stats.total) * 100
  const advertisingPercent = (stats.advertising / stats.total) * 100
  const personalizationPercent = (stats.personalization / stats.total) * 100
  const allAcceptedPercent = (stats.allAccepted / stats.total) * 100
  const onlyNecessaryPercent = (stats.onlyNecessary / stats.total) * 100

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consents</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Unique consent records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All Accepted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.allAccepted}</div>
            <p className="text-xs text-muted-foreground">{allAcceptedPercent.toFixed(1)}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Only Necessary</CardTitle>
            <XCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onlyNecessary}</div>
            <p className="text-xs text-muted-foreground">{onlyNecessaryPercent.toFixed(1)}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(((stats.total - stats.onlyNecessary) / stats.total) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Users accepting cookies</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consent Breakdown by Category</CardTitle>
          <CardDescription>Percentage of users who accepted each cookie category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Analytics Cookies</span>
              <span className="text-muted-foreground">
                {stats.analytics} ({analyticsPercent.toFixed(1)}%)
              </span>
            </div>
            <Progress value={analyticsPercent} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Advertising Cookies</span>
              <span className="text-muted-foreground">
                {stats.advertising} ({advertisingPercent.toFixed(1)}%)
              </span>
            </div>
            <Progress value={advertisingPercent} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Personalization Cookies</span>
              <span className="text-muted-foreground">
                {stats.personalization} ({personalizationPercent.toFixed(1)}%)
              </span>
            </div>
            <Progress value={personalizationPercent} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
