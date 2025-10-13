-- Update categories to match Russian financial portal requirements
-- Delete old categories and insert new ones

delete from public.categories;

-- Insert new categories based on requirements
insert into public.categories (name, slug, description) values
  ('Финансы и страхование', 'finance-insurance', 'Новости и аналитика финансового сектора и страхования'),
  ('Инвестиции', 'investments', 'Инвестиционные стратегии и возможности'),
  ('Технологии', 'technology', 'Финтех и технологические инновации в финансах'),
  ('Экономика', 'economy', 'Экономические новости и макроэкономический анализ'),
  ('Новости', 'news', 'Актуальные новости финансового мира'),
  ('Аналитика', 'analytics', 'Глубокая аналитика рынков и трендов'),
  ('Советы и Гайды', 'guides', 'Практические советы и руководства'),
  ('Интервью', 'interviews', 'Интервью с экспертами и лидерами индустрии'),
  ('Личный опыт', 'case-studies', 'Кейсы и истории успеха')
on conflict (slug) do nothing;
