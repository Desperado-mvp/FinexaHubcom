import Link from "next/link"
import { Facebook, Twitter, Linkedin, Youtube, Mail } from "lucide-react"

export function SiteFooter() {
  const categories = [
    { name: "Finance & Insurance", href: "/category/finance-insurance" },
    { name: "Investments", href: "/category/investments" },
    { name: "Technology", href: "/category/technology" },
    { name: "Economy", href: "/category/economy" },
    { name: "News", href: "/category/news" },
    { name: "Analytics", href: "/category/analytics" },
    { name: "Guides & Tips", href: "/category/guides" },
    { name: "Interviews", href: "/category/interviews" },
  ]

  return (
    <footer className="border-t-4 border-foreground bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand section */}
          <div className="space-y-6 md:col-span-4">
            <h3 className="text-3xl font-black uppercase tracking-tighter">Financial Portal</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Leading source of financial news, market analytics, and investment strategies. Expert information for
              making informed financial decisions.
            </p>
            {/* Social media */}
            <div className="flex items-center gap-3">
              <Link
                href="https://facebook.com"
                className="h-9 w-9 border-2 border-border hover:border-foreground flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="https://twitter.com"
                className="h-9 w-9 border-2 border-border hover:border-foreground flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="h-9 w-9 border-2 border-border hover:border-foreground flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="https://youtube.com"
                className="h-9 w-9 border-2 border-border hover:border-foreground flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-6 md:col-span-4">
            <h4 className="text-sm font-bold uppercase tracking-widest">Categories</h4>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              {categories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-6 md:col-span-4">
            <h4 className="text-sm font-bold uppercase tracking-widest">Contact & Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="mailto:info@financial-portal.com"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  info@financial-portal.com
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/advertise"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  Advertise
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy-policy"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms-of-service"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/disclaimer"
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-border">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            &copy; {new Date().getFullYear()} Financial Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
