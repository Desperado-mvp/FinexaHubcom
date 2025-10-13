import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@/components/analytics"
import { Suspense } from "react"
import { CookieConsentBanner } from "@/components/cookie-consent-banner"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://financial-portal.com"),
  title: {
    default: "Financial Portal - News, Analytics, Investments & Market Insights",
    template: "%s | Financial Portal",
  },
  description:
    "Leading financial portal providing breaking economic news, in-depth market analytics, investment strategies, fintech reviews, and expert interviews. Stay informed with real-time financial data and insights.",
  keywords: [
    "finance",
    "investments",
    "economy",
    "insurance",
    "technology",
    "analytics",
    "news",
    "stock market",
    "fintech",
    "cryptocurrency",
    "trading",
    "financial planning",
    "market analysis",
    "investment strategies",
  ],
  authors: [{ name: "Financial Portal", url: "https://financial-portal.com" }],
  creator: "Financial Portal",
  publisher: "Financial Portal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Financial Portal",
    title: "Financial Portal - News, Analytics, Investments & Market Insights",
    description:
      "Leading financial portal providing breaking economic news, in-depth market analytics, and investment strategies.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Financial Portal - Your Source for Financial News",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Portal - News, Analytics, Investments & Market Insights",
    description:
      "Leading financial portal providing breaking economic news, in-depth market analytics, and investment strategies.",
    images: ["/og-image.jpg"],
    creator: "@financialportal",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  category: "finance",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="antialiased">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          {children}
          <Analytics />
          <CookieConsentBanner />
        </Suspense>
      </body>
    </html>
  )
}
