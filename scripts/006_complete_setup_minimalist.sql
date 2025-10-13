-- Complete database setup for minimalist financial portal
-- This script creates all tables and populates them with Russian content

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

-- Insert categories (updated with new structure)
insert into public.categories (name, slug, description) values
  ('Финансы и страхование', 'finance-insurance', 'Новости и аналитика финансового сектора и страхования'),
  ('Инвестиции', 'investments', 'Инвестиционные стратегии и обзоры рынков'),
  ('Технологии', 'technology', 'Финтех и технологические инновации в финансах'),
  ('Экономика', 'economy', 'Макроэкономические новости и анализ'),
  ('Новости', 'news', 'Актуальные финансовые новости'),
  ('Аналитика', 'analytics', 'Глубокая аналитика рынков и трендов'),
  ('Советы и Гайды', 'guides', 'Практические советы по финансам и инвестициям'),
  ('Интервью', 'interviews', 'Интервью с экспертами финансового рынка'),
  ('Личный опыт', 'personal-experience', 'Кейсы и истории успеха инвесторов');

-- Insert sample articles
insert into public.articles (title, slug, excerpt, content, featured_image, category_id, author, published, published_at)
select 
  'Центробанк повысил ключевую ставку до 18%',
  'central-bank-rate-increase',
  'ЦБ РФ принял решение о повышении ключевой ставки в ответ на инфляционные риски. Эксперты оценивают последствия для экономики.',
  'Подробный анализ решения Центрального банка...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'news'),
  'Иван Петров',
  true,
  now() - interval '1 day'
union all
select 
  'Топ-10 акций для долгосрочных инвестиций в 2025',
  'top-10-stocks-2025',
  'Аналитики составили список наиболее перспективных акций для инвестиций на горизонте 3-5 лет.',
  'Детальный обзор перспективных компаний...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'investments'),
  'Мария Сидорова',
  true,
  now() - interval '2 days'
union all
select 
  'Искусственный интеллект в банковском секторе',
  'ai-in-banking',
  'Как технологии ИИ трансформируют банковскую индустрию и меняют подход к обслуживанию клиентов.',
  'Обзор внедрения AI в финансовом секторе...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'technology'),
  'Алексей Смирнов',
  true,
  now() - interval '3 days'
union all
select 
  'Прогноз курса рубля на 2025 год',
  'ruble-forecast-2025',
  'Экономисты делятся прогнозами по динамике российской валюты в условиях текущей геополитической ситуации.',
  'Анализ факторов влияющих на курс рубля...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'economy'),
  'Елена Волкова',
  true,
  now() - interval '4 days'
union all
select 
  'Как выбрать брокера для начинающего инвестора',
  'choosing-broker-guide',
  'Подробное руководство по выбору брокера: на что обратить внимание, какие комиссии важны и как избежать ошибок.',
  'Пошаговая инструкция для новичков...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'guides'),
  'Дмитрий Козлов',
  true,
  now() - interval '5 days'
union all
select 
  'Интервью с управляющим крупнейшего фонда',
  'fund-manager-interview',
  'Беседа с Сергеем Ивановым о стратегиях управления активами и перспективах российского рынка.',
  'Эксклюзивное интервью с экспертом...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'interviews'),
  'Ольга Новикова',
  true,
  now() - interval '6 days'
union all
select 
  'Страхование жизни: что нужно знать',
  'life-insurance-basics',
  'Разбираемся в видах страхования жизни, условиях полисов и как выбрать оптимальный вариант.',
  'Полное руководство по страхованию...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'finance-insurance'),
  'Андрей Морозов',
  true,
  now() - interval '7 days'
union all
select 
  'Мой путь к финансовой независимости',
  'financial-independence-story',
  'История успешного инвестора о том, как он достиг финансовой свободы за 10 лет.',
  'Личный опыт и практические советы...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'personal-experience'),
  'Виктор Соколов',
  true,
  now() - interval '8 days'
union all
select 
  'Анализ рынка недвижимости: тренды 2025',
  'real-estate-trends-2025',
  'Глубокий анализ рынка недвижимости: цены, спрос, перспективные районы и прогнозы экспертов.',
  'Комплексный обзор рынка недвижимости...',
  '/placeholder.svg?height=600&width=1000',
  (select id from public.categories where slug = 'analytics'),
  'Наталья Белова',
  true,
  now() - interval '9 days';
