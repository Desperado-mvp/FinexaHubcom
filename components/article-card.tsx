import Link from "next/link"
import Image from "next/image"
import { Calendar } from "lucide-react"
import type { Article } from "@/lib/types"

interface ArticleCardProps {
  article: Article & { category?: { name: string; slug: string } }
}

export function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  return (
    <article className="group bg-card border-2 border-border hover:border-foreground transition-colors">
      <Link
        href={`/article/${article.slug}`}
        className="block focus:outline-none focus:ring-2 focus:ring-primary rounded"
      >
        {article.featured_image && (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
            <Image
              src={article.featured_image || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover group-hover:opacity-90 transition-opacity"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              loading="lazy"
            />
          </div>
        )}

        <div className="p-6 space-y-4">
          {article.category && (
            <span className="inline-block text-xs font-black uppercase tracking-widest text-foreground">
              {article.category.name}
            </span>
          )}

          <h3 className="text-xl font-bold leading-tight line-clamp-3 text-foreground text-balance">{article.title}</h3>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 text-pretty">{article.excerpt}</p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t-2 border-border font-medium">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            <time dateTime={article.published_at || ""}>{formattedDate}</time>
          </div>
        </div>
      </Link>
    </article>
  )
}
