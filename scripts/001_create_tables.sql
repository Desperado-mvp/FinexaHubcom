-- Create categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create articles table
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  category_id uuid references public.categories(id) on delete set null,
  featured_image text,
  published boolean default false,
  published_at timestamp with time zone,
  views integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create ads table
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null, -- 'header', 'sidebar', 'footer', 'in-article'
  code text not null, -- HTML/JavaScript code for the ad
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index if not exists articles_category_id_idx on public.articles(category_id);
create index if not exists articles_published_idx on public.articles(published);
create index if not exists articles_slug_idx on public.articles(slug);
create index if not exists categories_slug_idx on public.categories(slug);

-- Enable Row Level Security
alter table public.categories enable row level security;
alter table public.articles enable row level security;
alter table public.ads enable row level security;

-- Public read access for published content
create policy "Anyone can view categories"
  on public.categories for select
  using (true);

create policy "Anyone can view published articles"
  on public.articles for select
  using (published = true);

create policy "Anyone can view active ads"
  on public.ads for select
  using (active = true);

-- Admin write access (authenticated users can manage content)
create policy "Authenticated users can insert categories"
  on public.categories for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update categories"
  on public.categories for update
  to authenticated
  using (true);

create policy "Authenticated users can delete categories"
  on public.categories for delete
  to authenticated
  using (true);

create policy "Authenticated users can insert articles"
  on public.articles for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update articles"
  on public.articles for update
  to authenticated
  using (true);

create policy "Authenticated users can delete articles"
  on public.articles for delete
  to authenticated
  using (true);

create policy "Authenticated users can view all articles"
  on public.articles for select
  to authenticated
  using (true);

create policy "Authenticated users can insert ads"
  on public.ads for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update ads"
  on public.ads for update
  to authenticated
  using (true);

create policy "Authenticated users can delete ads"
  on public.ads for delete
  to authenticated
  using (true);

create policy "Authenticated users can view all ads"
  on public.ads for select
  to authenticated
  using (true);
