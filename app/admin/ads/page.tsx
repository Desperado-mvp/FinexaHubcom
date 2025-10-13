import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { DeleteAdButton } from "@/components/delete-ad-button"

export default async function AdsPage() {
  const supabase = await createClient()

  const { data: ads } = await supabase.from("ads").select("*").order("created_at", { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ads</h1>
          <p className="text-muted-foreground">Manage your advertisement slots</p>
        </div>
        <Link href="/admin/ads/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Ad
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Ads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ads?.map((ad) => (
              <div key={ad.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{ad.name}</p>
                    {ad.active ? <Badge variant="default">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">Position: {ad.position}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/ads/edit/${ad.id}`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <DeleteAdButton adId={ad.id} />
                </div>
              </div>
            ))}
            {!ads || ads.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No ads yet. Create your first ad slot!</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
