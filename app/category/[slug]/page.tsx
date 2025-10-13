import { createClient } from "@/lib/supabase/server"
import { ArticleCard } from "@/components/article-card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Article } from "@/lib/types"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase.from("categories").select("name, description").eq("slug", slug).single()

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: category.name,
    description: category.description || `Browse ${category.name} articles on Financial Insights`,
    openGraph: {
      title: `${category.name} | Financial Insights`,
      description: category.description || `Browse ${category.name} articles on Financial Insights`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${category.name} | Financial Insights`,
      description: category.description || `Browse ${category.name} articles on Financial Insights`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch category
  const { data: category } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (!category) {
    notFound()
  }

  // Fetch articles in this category
  const { data: articles } = await supabase
    .from("articles")
    .select(
      `
      *,
      category:categories(name, slug)
    `,
    )
    .eq("category_id", category.id)
    .eq("published", true)
    .order("published_at", { ascending: false })

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://financial-insights.com"}/category/${category.slug}`,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="flex-1">
        {/* Category Header */}
        <section className="border-b bg-muted/50 py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-balance">{category.name}</h1>
              {category.description && (
                <p className="mt-4 text-lg text-muted-foreground text-pretty">{category.description}</p>
              )}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12 md:py-16">
          <div className="container">
            {articles && articles.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article as Article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found in this category yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
