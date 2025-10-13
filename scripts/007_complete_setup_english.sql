-- Complete database setup for minimalist financial portal (English version)
-- This script creates all tables and populates them with English content

-- Drop existing policies if they exist
drop policy if exists "Anyone can view published articles" on public.articles;
drop policy if exists "Anyone can view categories" on public.categories;
drop policy if exists "Anyone can view ads" on public.ads;

-- Drop existing tables if they exist
drop table if exists public.articles cascade;
drop table if exists public.categories cascade;
drop table if exists public.ads cascade;

-- Create categories table
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default now()
);

-- Create articles table
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  featured_image text,
  category_id uuid references public.categories(id),
  author text,
  published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create ads table
create table public.ads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  position text not null,
  image_url text,
  link_url text,
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.categories enable row level security;
alter table public.articles enable row level security;
alter table public.ads enable row level security;

-- Create policies for public read access
create policy "Anyone can view categories"
  on public.categories for select
  using (true);

create policy "Anyone can view published articles"
  on public.articles for select
  using (published = true);

create policy "Anyone can view active ads"
  on public.ads for select
  using (active = true);

-- Insert categories (English version)
insert into public.categories (name, slug, description) values
  ('Finance & Insurance', 'finance-insurance', 'Financial sector and insurance news and analytics'),
  ('Investments', 'investments', 'Investment strategies and market reviews'),
  ('Technology', 'technology', 'Fintech and technological innovations in finance'),
  ('Economy', 'economy', 'Macroeconomic news and analysis'),
  ('News', 'news', 'Current financial news'),
  ('Analytics', 'analytics', 'In-depth market and trend analysis'),
  ('Guides & Tips', 'guides', 'Practical financial and investment advice'),
  ('Interviews', 'interviews', 'Interviews with financial market experts'),
  ('Personal Experience', 'personal-experience', 'Success stories and investor case studies');

-- Insert sample articles (English version)
insert into public.articles (title, slug, excerpt, content, featured_image, category_id, author, published, published_at)
select 
  'Central Bank Raises Key Rate to 18%',
  'central-bank-rate-increase',
  'The Central Bank has decided to raise the key rate in response to inflationary risks. Experts assess the economic consequences.',
  'Detailed analysis of the Central Bank decision...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'news'),
  'John Smith',
  true,
  now() - interval '1 day'
union all
select 
  'Top 10 Stocks for Long-Term Investment in 2025',
  'top-10-stocks-2025',
  'Analysts have compiled a list of the most promising stocks for investment over a 3-5 year horizon.',
  'Detailed review of promising companies...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'investments'),
  'Sarah Johnson',
  true,
  now() - interval '2 days'
union all
select 
  'Artificial Intelligence in the Banking Sector',
  'ai-in-banking',
  'How AI technologies are transforming the banking industry and changing the approach to customer service.',
  'Overview of AI implementation in the financial sector...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'technology'),
  'Michael Brown',
  true,
  now() - interval '3 days'
union all
select 
  'Dollar Exchange Rate Forecast for 2025',
  'dollar-forecast-2025',
  'Economists share forecasts on currency dynamics in the current geopolitical situation.',
  'Analysis of factors affecting exchange rates...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'economy'),
  'Emily Davis',
  true,
  now() - interval '4 days'
union all
select 
  'How to Choose a Broker for Beginner Investors',
  'choosing-broker-guide',
  'Comprehensive guide to choosing a broker: what to look for, which fees matter, and how to avoid mistakes.',
  'Step-by-step instructions for beginners...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'guides'),
  'David Wilson',
  true,
  now() - interval '5 days'
union all
select 
  'Interview with the Manager of the Largest Fund',
  'fund-manager-interview',
  'Conversation with Robert Anderson about asset management strategies and prospects for the market.',
  'Exclusive interview with an expert...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'interviews'),
  'Lisa Martinez',
  true,
  now() - interval '6 days'
union all
select 
  'Life Insurance: What You Need to Know',
  'life-insurance-basics',
  'Understanding types of life insurance, policy terms, and how to choose the optimal option.',
  'Complete guide to insurance...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'finance-insurance'),
  'James Taylor',
  true,
  now() - interval '7 days'
union all
select 
  'My Journey to Financial Independence',
  'financial-independence-story',
  'A successful investor\'s story about achieving financial freedom in 10 years.',
  'Personal experience and practical advice...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'personal-experience'),
  'Chris Anderson',
  true,
  now() - interval '8 days'
union all
select 
  'Real Estate Market Analysis: 2025 Trends',
  'real-estate-trends-2025',
  'In-depth analysis of the real estate market: prices, demand, promising areas, and expert forecasts.',
  'Comprehensive real estate market overview...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'analytics'),
  'Jennifer White',
  true,
  now() - interval '9 days';
