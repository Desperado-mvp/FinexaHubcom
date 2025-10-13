# Financial Portal CMS

A production-ready financial content management system built with Next.js, Supabase, and TypeScript. Bloomberg/WSJ-style design with comprehensive SEO, analytics, and GDPR compliance.

## Features

### Public Website
- Bloomberg/WSJ-inspired design (black/white with blue/gold accents)
- Responsive, mobile-first layout
- Article browsing by category with pagination
- SEO optimized with JSON-LD structured data
- Dynamic OG image generation
- Cookie consent management (GDPR/CCPA compliant)
- Dark mode support
- Automatic sitemap and robots.txt

### Admin Dashboard
- Secure authentication with Supabase
- Rich text editor with TipTap (WYSIWYG)
- Article management (create, edit, delete, publish)
- Category and tag management
- Advertisement slot management
- Analytics dashboard with consent statistics
- Legal page editor (Privacy, Terms, Cookies)
- A/B testing framework

### Technical Features
- Next.js 14 with App Router and ISR
- TypeScript strict mode
- Supabase (PostgreSQL + Auth + Storage)
- Tailwind CSS v4 with custom design tokens
- Row Level Security (RLS)
- Rate limiting and CSP headers
- Lighthouse optimized (LCP < 2s, CLS < 0.1)
- CI/CD with GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm (recommended) or npm
- A Supabase account

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd financial-cms
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

3. Set up environment variables:
   - Supabase credentials are automatically provided in v0
   - For local development, add to `.env.local`:
     \`\`\`
     NEXT_PUBLIC_SITE_URL=http://localhost:3000
     NEXT_PUBLIC_GA_MEASUREMENT_ID=your-ga-id (optional)
     \`\`\`

4. Run database migrations:
   - Execute SQL scripts in `/scripts` folder in order
   - Use the v0 interface to run scripts directly
   - Or run them in Supabase SQL Editor

5. Start the development server:
   \`\`\`bash
   pnpm dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

### First Admin User

1. Go to `/admin/login`
2. Sign up with email/password
3. Verify email (check Supabase Auth settings)
4. Log in to access admin dashboard

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   │   ├── articles/      # Article management
│   │   ├── ads/           # Ad management
│   │   ├── analytics/     # Analytics dashboard
│   │   └── legal/         # Legal page editor
│   ├── article/[slug]/    # Article detail pages
│   ├── category/[slug]/   # Category pages
│   ├── legal/[slug]/      # Legal pages
│   ├── api/               # API routes
│   │   ├── consent/       # Cookie consent API
│   │   ├── og/            # OG image generation
│   │   └── analytics/     # Analytics endpoints
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/            # React components
│   ├── admin-sidebar.tsx  # Admin navigation
│   ├── article-card.tsx   # Article preview card
│   ├── rich-text-editor.tsx # TipTap editor
│   ├── cookie-consent-banner.tsx # GDPR banner
│   ├── site-header.tsx    # Public site header
│   └── site-footer.tsx    # Public site footer
├── lib/                   # Utilities
│   ├── supabase/         # Supabase clients
│   ├── consent.ts        # Consent management
│   ├── rate-limit.ts     # Rate limiting
│   └── types.ts          # TypeScript types
├── scripts/              # Database migrations
│   ├── 001_create_tables.sql
│   ├── 002_seed_data.sql
│   └── 008_cookie_consent_system.sql
└── .github/workflows/    # CI/CD pipelines
    └── ci.yml            # Lighthouse CI
\`\`\`

## Database Schema

### Core Tables
- **articles** - Blog posts with SEO metadata
- **categories** - Article categories
- **ads** - Advertisement slots
- **cookie_consents** - User consent tracking
- **legal_pages** - Privacy, Terms, Cookies content
- **ab_tests** - A/B testing data
- **ad_impressions** - Ad performance tracking

All tables use Row Level Security (RLS):
- Public: Read published content
- Authenticated: Full CRUD access

## Development

### Code Quality

\`\`\`bash
# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check

# Run all checks (pre-commit)
pnpm format:check && pnpm lint && pnpm type-check
\`\`\`

### Testing

\`\`\`bash
# Run integration tests
pnpm test

# Run Lighthouse CI
pnpm lighthouse
\`\`\`

## SEO & Analytics

### SEO Features
- Dynamic metadata per page
- JSON-LD structured data (Article, BreadcrumbList, Organization)
- Open Graph and Twitter Card tags
- Dynamic OG image generation (`/api/og`)
- Automatic sitemap with pagination
- Robots.txt with sitemap reference
- Semantic HTML with WCAG 2.1 AA compliance

### Analytics Setup

1. **Google Analytics 4**:
   - Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to environment variables
   - Scripts load only after user consent

2. **Cookie Consent**:
   - Banner appears on first visit
   - Tracks consent by category (Analytics, Advertising, Personalization)
   - Admin dashboard shows consent statistics

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Environment variables are auto-configured from v0
4. Deploy

### Post-Deployment

1. Run database migrations in production Supabase
2. Configure custom domain
3. Set up Google Analytics
4. Test cookie consent flow
5. Run Lighthouse audit

## Performance Targets

- **LCP** (Largest Contentful Paint): < 2s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **Lighthouse Score**: > 90

## Security

- CSP headers configured in middleware
- Rate limiting on API endpoints
- Input sanitization for rich text
- RLS policies on all tables
- Secure cookie handling
- HTTPS only in production

## License

MIT

## Support

For issues or questions:
- Open a GitHub issue
- Contact support at vercel.com/help
