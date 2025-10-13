import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

interface LegalPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from("legal_pages")
    .select("title, meta_description")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (!page) {
    return {
      title: "Page Not Found",
    }
  }

  return {
    title: page.title,
    description: page.meta_description || page.title,
  }
}

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data: pages } = await supabase.from("legal_pages").select("slug").eq("published", true)

  return (
    pages?.map((page) => ({
      slug: page.slug,
    })) || []
  )
}

export const revalidate = 3600 // Revalidate every hour

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase.from("legal_pages").select("*").eq("slug", slug).eq("published", true).single()

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-6 text-black">{page.title}</h1>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
