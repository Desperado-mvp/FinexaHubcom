import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from("articles")
    .select(
      `
      *,
      category:categories(name, slug)
    `,
    )
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  const publishedDate = article.published_at ? new Date(article.published_at).toISOString() : undefined
  const modifiedDate = new Date(article.updated_at).toISOString()

  return {
    title: article.title,
    description: article.excerpt || undefined,
    keywords: article.category ? [article.category.name, "financial news", "market analysis"] : undefined,
    authors: [{ name: "Financial Insights" }],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt || undefined,
      images: article.featured_image ? [{ url: article.featured_image, width: 1200, height: 630 }] : [],
      publishedTime: publishedDate,
      modifiedTime: modifiedDate,
      authors: ["Financial Insights"],
      section: article.category?.name,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || undefined,
      images: article.featured_image ? [article.featured_image] : [],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch article
  const { data: article } = await supabase
    .from("articles")
    .select(
      `
      *,
      category:categories(name, slug)
    `,
    )
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (!article) {
    notFound()
  }

  // Increment view count
  await supabase
    .from("articles")
    .update({ views: article.views + 1 })
    .eq("id", article.id)

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.featured_image,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      "@type": "Organization",
      name: "Financial Insights",
    },
    publisher: {
      "@type": "Organization",
      name: "Financial Insights",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://financial-insights.com"}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://financial-insights.com"}/article/${article.slug}`,
    },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="flex-1">
        <article className="py-8 md:py-12">
          <div className="container max-w-4xl">
            {/* Article Header */}
            <div className="mb-8 space-y-4">
              {article.category && (
                <Link href={`/category/${article.category.slug}`}>
                  <Badge variant="secondary" className="w-fit">
                    {article.category.name}
                  </Badge>
                </Link>
              )}
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-balance">{article.title}</h1>
              {article.excerpt && <p className="text-xl text-muted-foreground text-pretty">{article.excerpt}</p>}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={article.published_at || undefined}>{formattedDate}</time>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{article.views + 1} views</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {article.featured_image && (
              <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={article.featured_image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Article Content */}
            <div
              className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
