-- Complete database setup with all tables and Russian content
-- This script can be run multiple times safely

-- Drop existing policies first to avoid conflicts
drop policy if exists "Anyone can view categories" on public.categories;
drop policy if exists "Anyone can view published articles" on public.articles;
drop policy if exists "Anyone can view active ads" on public.ads;
drop policy if exists "Authenticated users can insert categories" on public.categories;
drop policy if exists "Authenticated users can update categories" on public.categories;
drop policy if exists "Authenticated users can delete categories" on public.categories;
drop policy if exists "Authenticated users can insert articles" on public.articles;
drop policy if exists "Authenticated users can update articles" on public.articles;
drop policy if exists "Authenticated users can delete articles" on public.articles;
drop policy if exists "Authenticated users can view all articles" on public.articles;
drop policy if exists "Authenticated users can insert ads" on public.ads;
drop policy if exists "Authenticated users can update ads" on public.ads;
drop policy if exists "Authenticated users can delete ads" on public.ads;
drop policy if exists "Authenticated users can view all ads" on public.ads;

-- Disable RLS temporarily
alter table if exists public.categories disable row level security;
alter table if exists public.articles disable row level security;
alter table if exists public.ads disable row level security;

-- Create tables (if not exists)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

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

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  code text not null,
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Clear existing data
truncate table public.articles cascade;
truncate table public.categories cascade;
truncate table public.ads cascade;

-- Insert Russian categories
insert into public.categories (name, slug, description) values
  ('Финансы и страхование', 'finance-insurance', 'Новости и аналитика финансового сектора и страхования'),
  ('Инвестиции', 'investments', 'Инвестиционные стратегии и возможности'),
  ('Технологии', 'technology', 'Финтех и технологические инновации в финансах'),
  ('Экономика', 'economy', 'Экономические новости и макроэкономический анализ'),
  ('Новости', 'news', 'Актуальные новости финансового мира'),
  ('Аналитика', 'analytics', 'Глубокая аналитика рынков и трендов'),
  ('Советы и Гайды', 'guides', 'Практические советы и руководства'),
  ('Интервью', 'interviews', 'Интервью с экспертами и лидерами индустрии'),
  ('Личный опыт', 'case-studies', 'Кейсы и истории успеха');

-- Insert sample articles
insert into public.articles (title, slug, content, excerpt, category_id, featured_image, published, published_at)
select 
  'Центробанк повысил ключевую ставку до 18%',
  'cb-raised-key-rate-18',
  'Совет директоров Банка России принял решение повысить ключевую ставку на 200 б.п., до 18,00% годовых. Решение принято в целях ограничения инфляционных рисков...',
  'ЦБ РФ повысил ключевую ставку до рекордных 18% для борьбы с инфляцией',
  id,
  '/placeholder.svg?height=600&width=1000',
  true,
  now() - interval '1 hour'
from public.categories where slug = 'economy' limit 1;

insert into public.articles (title, slug, content, excerpt, category_id, featured_image, published, published_at)
select 
  'Топ-5 акций для долгосрочных инвестиций в 2025',
  'top-5-stocks-2025',
  'Аналитики выделили пять компаний с наибольшим потенциалом роста на горизонте 3-5 лет. В список вошли технологические гиганты и компании зеленой энергетики...',
  'Эксперты назвали самые перспективные акции для инвестиций',
  id,
  '/placeholder.svg?height=600&width=1000',
  true,
  now() - interval '2 hours'
from public.categories where slug = 'investments' limit 1;

insert into public.articles (title, slug, content, excerpt, category_id, featured_image, published, published_at)
select 
  'Искусственный интеллект в банковском секторе',
  'ai-in-banking',
  'Крупнейшие банки внедряют ИИ для анализа кредитных рисков и персонализации услуг. Технология позволяет сократить время принятия решений в 10 раз...',
  'Как ИИ меняет банковскую индустрию',
  id,
  '/placeholder.svg?height=600&width=1000',
  true,
  now() - interval '3 hours'
from public.categories where slug = 'technology' limit 1;

insert into public.articles (title, slug, content, excerpt, category_id, featured_image, published, published_at)
select 
  'Как защитить сбережения от инфляции',
  'protect-savings-from-inflation',
  'Пошаговое руководство по сохранению и приумножению капитала в условиях высокой инфляции. Рассматриваем различные инструменты: от облигаций до недвижимости...',
  'Практические советы по защите капитала',
  id,
  '/placeholder.svg?height=600&width=1000',
  true,
  now() - interval '4 hours'
from public.categories where slug = 'guides' limit 1;

insert into public.articles (title, slug, content, excerpt, category_id, featured_image, published, published_at)
select 
  'Интервью с главой крупнейшего инвестфонда',
  'interview-investment-fund-ceo',
  'Эксклюзивное интервью с управляющим активами на $50 млрд о стратегии инвестирования, рисках и возможностях российского рынка...',
  'Глава инвестфонда о будущем российского рынка',
  id,
  '/placeholder.svg?height=600&width=1000',
  true,
  now() - interval '5 hours'
from public.categories where slug = 'interviews' limit 1;

insert into public.articles (title, slug, content, excerpt, category_id, featured_image, published, published_at)
select 
  'Рубль укрепился к доллару на фоне роста цен на нефть',
  'ruble-strengthens-oil-prices',
  'Российская валюта показала рост на 2% за день на фоне увеличения стоимости нефти марки Brent выше $85 за баррель...',
  'Курс рубля вырос на фоне дорожающей нефти',
  id,
  '/placeholder.svg?height=600&width=1000',
  true,
  now() - interval '6 hours'
from public.categories where slug = 'news' limit 1;

insert into public.articles (title, slug, content, excerpt, category_id, featured_image, published, published_at)
select 
  'Анализ рынка облигаций: куда вкладывать в 2025',
  'bond-market-analysis-2025',
  'Детальный разбор рынка облигаций с прогнозами доходности. Сравниваем ОФЗ, корпоративные и еврооблигации...',
  'Полный гид по рынку облигаций',
  id,
  '/placeholder.svg?height=600&width=1000',
  true,
  now() - interval '7 hours'
from public.categories where slug = 'analytics' limit 1;

insert into public.articles (title, slug, content, excerpt, category_id, featured_image, published, published_at)
select 
  'Страхование жизни: как выбрать правильный полис',
  'life-insurance-guide',
  'Подробное руководство по выбору страхования жизни. Разбираем виды полисов, условия и подводные камни...',
  'Все о страховании жизни простым языком',
  id,
  '/placeholder.svg?height=600&width=1000',
  true,
  now() - interval '8 hours'
from public.categories where slug = 'finance-insurance' limit 1;

insert into public.articles (title, slug, content, excerpt, category_id, featured_image, published, published_at)
select 
  'Мой путь к финансовой независимости',
  'my-path-to-financial-independence',
  'История о том, как за 5 лет удалось накопить капитал и выйти на пассивный доход. Делюсь ошибками и находками...',
  'Личный опыт достижения финансовой свободы',
  id,
  '/placeholder.svg?height=600&width=1000',
  true,
  now() - interval '9 hours'
from public.categories where slug = 'case-studies' limit 1;

-- Create indexes
create index if not exists articles_category_id_idx on public.articles(category_id);
create index if not exists articles_published_idx on public.articles(published);
create index if not exists articles_slug_idx on public.articles(slug);
create index if not exists categories_slug_idx on public.categories(slug);

-- Re-enable RLS with proper policies
alter table public.categories enable row level security;
alter table public.articles enable row level security;
alter table public.ads enable row level security;

-- Public read access
create policy "Anyone can view categories"
  on public.categories for select
  using (true);

create policy "Anyone can view published articles"
  on public.articles for select
  using (published = true);

create policy "Anyone can view active ads"
  on public.ads for select
  using (active = true);

-- Admin access (authenticated users)
create policy "Authenticated users can manage categories"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can manage articles"
  on public.articles for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can manage ads"
  on public.ads for all
  to authenticated
  using (true)
  with check (true);
