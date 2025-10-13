import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Finance & Insurance", href: "/category/finance-insurance" },
    { name: "Investments", href: "/category/investments" },
    { name: "Technology", href: "/category/technology" },
    { name: "Economy", href: "/category/economy" },
    { name: "News", href: "/category/news" },
    { name: "Analytics", href: "/category/analytics" },
  ]

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 w-full bg-primary text-primary-foreground border-b border-border"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-foreground focus:text-primary focus:rounded"
      >
        Skip to main content
      </a>

      <div className="container">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 border-b border-border/50">
          <Link
            href="/"
            className="flex items-center gap-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50 rounded"
            aria-label="Financial Portal Home"
          >
            <div className="text-xl md:text-2xl font-black tracking-tight">FINANCIAL PORTAL</div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10 focus:ring-2 focus:ring-primary-foreground/50"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>

        <nav
          role="navigation"
          aria-label="Main navigation"
          className="hidden lg:flex h-14 items-center gap-6 text-sm font-medium px-4 md:px-6"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-primary-foreground/70 transition-colors uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-primary-foreground/50 rounded px-2 py-1"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="lg:hidden flex h-12 items-center px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground focus:ring-2 focus:ring-primary-foreground/50"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-6 mt-8" aria-label="Mobile navigation">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-semibold hover:text-primary transition-colors uppercase focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
