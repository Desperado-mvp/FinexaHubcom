import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Edit } from "lucide-react"
import Link from "next/link"

export default async function LegalPagesPage() {
  const supabase = await createServerClient()

  const { data: pages } = await supabase.from("legal_pages").select("*").order("slug")

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Legal Pages</h1>
          <p className="text-muted-foreground mt-2">
            Manage your privacy policy, terms of service, and other legal content
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {pages?.map((page) => (
          <Card key={page.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                    <CardDescription className="mt-1">/{page.slug}</CardDescription>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/legal/${page.slug}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{page.meta_description}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span>Updated {new Date(page.updated_at).toLocaleDateString()}</span>
                <Button size="sm" variant="ghost" asChild>
                  <Link href={`/legal/${page.slug}`} target="_blank">
                    View Live
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
