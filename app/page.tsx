import { createClient } from "@/lib/supabase/server"
import { ArticleCard } from "@/components/article-card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AdBlock } from "@/components/ad-block"
import Link from "next/link"
import Image from "next/image"
import type { Article } from "@/lib/types"

export const revalidate = 300 // Revalidate every 5 minutes

export default async function HomePage() {
  const supabase = await createClient()

  let articles: any[] | null = null
  let categories: any[] | null = null
  let dbError = false

  try {
    const { data: articlesData, error: articlesError } = await supabase
      .from("articles")
      .select(
        `
      *,
      category:categories(name, slug)
    `,
      )
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(9)

    if (articlesError) {
      console.log("[v0] Database error:", articlesError)
      dbError = true
    } else {
      articles = articlesData
    }

    const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("*").order("name")

    if (categoriesError) {
      console.log("[v0] Categories error:", categoriesError)
    } else {
      categories = categoriesData
    }
  } catch (error) {
    console.log("[v0] Fetch error:", error)
    dbError = true
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Financial Portal",
    description:
      "Leading financial portal: economy news, market analytics, investment strategies, and expert insights.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://financial-portal.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://financial-portal.com"}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Financial Portal",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://financial-portal.com"}/logo.png`,
      },
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_SITE_URL || "https://financial-portal.com",
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main id="main-content" role="main" className="flex-1">
        {dbError && (
          <section className="py-16 bg-background">
            <div className="container">
              <div className="max-w-2xl mx-auto text-center space-y-6 bg-card border-2 border-border p-8">
                <h2 className="text-2xl font-bold">Database Setup Required</h2>
                <p className="text-muted-foreground">Please run the SQL script to create database tables.</p>
                <div className="bg-muted p-6 text-left space-y-2 text-sm border-2 border-border">
                  <p className="font-semibold">Setup Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Go to Scripts section in the left panel</li>
                    <li>Run script: 007_complete_setup_english.sql</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        )}

        {!dbError && articles && articles.length > 0 && (
          <section className="py-12 md:py-16 bg-background">
            <div className="container">
              <div className="grid lg:grid-cols-[1fr_320px] gap-8">
                {/* Main content area */}
                <div className="space-y-8">
                  {/* Featured article */}
                  {articles[0] && (
                    <Link href={`/article/${articles[0].slug}`} className="block group">
                      <article className="bg-card border-2 border-border hover:border-foreground transition-colors">
                        <div className="relative w-full aspect-[16/9] bg-muted overflow-hidden">
                          <Image
                            src={articles[0].featured_image || "/placeholder.svg?height=600&width=1000"}
                            alt={articles[0].title}
                            fill
                            className="object-cover group-hover:opacity-90 transition-opacity"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 1000px"
                          />
                        </div>
                        <div className="p-8 space-y-4">
                          {articles[0].category && (
                            <span className="inline-block text-xs font-black uppercase tracking-widest text-foreground">
                              {articles[0].category.name}
                            </span>
                          )}
                          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-foreground text-balance">
                            {articles[0].title}
                          </h2>
                          <p className="text-base text-muted-foreground leading-relaxed text-pretty">
                            {articles[0].excerpt}
                          </p>
                        </div>
                      </article>
                    </Link>
                  )}

                  {/* Ad block between content */}
                  <AdBlock position="in-content" />

                  {/* Article grid */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {articles.slice(1, 5).map((article) => (
                      <ArticleCard key={article.id} article={article as Article} />
                    ))}
                  </div>

                  {/* Another ad block */}
                  <AdBlock position="in-content" />

                  {/* More articles */}
                  {articles.length > 5 && (
                    <div className="grid gap-6 md:grid-cols-2">
                      {articles.slice(5).map((article) => (
                        <ArticleCard key={article.id} article={article as Article} />
                      ))}
                    </div>
                  )}
                </div>

                <aside className="space-y-6" role="complementary" aria-label="Sidebar">
                  <div className="sticky top-24 space-y-6">
                    {/* Sidebar ad */}
                    <AdBlock position="sidebar" />

                    {/* Categories widget */}
                    {categories && categories.length > 0 && (
                      <nav className="bg-card border-2 border-border p-6 space-y-4" aria-label="Categories">
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground border-b-2 border-border pb-3">
                          Categories
                        </h3>
                        <ul className="space-y-3">
                          {categories.map((category) => (
                            <li key={category.id}>
                              <Link
                                href={`/category/${category.slug}`}
                                className="text-sm hover:text-foreground transition-colors font-semibold text-muted-foreground uppercase tracking-wide block py-1 focus:outline-none focus:ring-2 focus:ring-primary rounded px-2"
                              >
                                {category.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    )}

                    {/* Another sidebar ad */}
                    <AdBlock position="sidebar" />
                  </div>
                </aside>
              </div>
            </div>
          </section>
        )}

        {!dbError && (
          <section className="py-8 bg-muted border-t-2 border-border">
            <div className="container">
              <AdBlock position="footer" />
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
