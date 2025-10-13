import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { DeleteArticleButton } from "@/components/delete-article-button"

export default async function ArticlesPage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from("articles")
    .select(
      `
      *,
      category:categories(name)
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="text-muted-foreground">Manage your articles</p>
        </div>
        <Link href="/admin/articles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles?.map((article) => (
              <div key={article.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{article.title}</p>
                    {article.published ? (
                      <Badge variant="default">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{article.category?.name || "Uncategorized"}</span>
                    <span>•</span>
                    <span>{article.views} views</span>
                    <span>•</span>
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/articles/edit/${article.id}`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <DeleteArticleButton articleId={article.id} />
                </div>
              </div>
            ))}
            {!articles || articles.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No articles yet. Create your first article!</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
