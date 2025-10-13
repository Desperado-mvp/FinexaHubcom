import type { Metadata } from "next"

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
}

export function generateSEO({
  title,
  description,
  keywords = [],
  image = "/og-image.png",
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
}: SEOProps): Metadata {
  const siteName = "Financial Portal"
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://financial-portal.com"
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const fullImage = image.startsWith("http") ? image : `${siteUrl}${image}`

  return {
    title: `${title} | ${siteName}`,
    description,
    keywords: keywords.join(", "),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: type === "article" ? "article" : "website",
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

interface ArticleStructuredData {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  author: string
  url: string
}

export function generateArticleStructuredData({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: ArticleStructuredData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://financial-portal.com"
  const fullUrl = `${siteUrl}${url}`
  const fullImage = image.startsWith("http") ? image : `${siteUrl}${image}`

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: fullImage,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Financial Portal",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
  }
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://financial-portal.com"

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  }
}

export function generateOrganizationStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://financial-portal.com"

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Financial Portal",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: "Your trusted source for financial news, analysis, and insights",
    sameAs: [
      "https://twitter.com/financialportal",
      "https://linkedin.com/company/financialportal",
      "https://facebook.com/financialportal",
    ],
  }
}

export function generateWebSiteStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://financial-portal.com"

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Financial Portal",
    url: siteUrl,
    description: "Your trusted source for financial news, analysis, and insights",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}
