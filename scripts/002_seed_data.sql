-- Insert sample categories
insert into public.categories (name, slug, description) values
  ('Market Analysis', 'market-analysis', 'In-depth analysis of financial markets and trends'),
  ('Economic News', 'economic-news', 'Latest economic news and updates'),
  ('Investment Strategies', 'investment-strategies', 'Expert investment strategies and tips'),
  ('Cryptocurrency', 'cryptocurrency', 'Digital currency news and analysis'),
  ('Personal Finance', 'personal-finance', 'Personal finance tips and advice')
on conflict (slug) do nothing;

-- Insert sample articles
insert into public.articles (title, slug, content, excerpt, category_id, published, published_at, featured_image) 
select 
  'Understanding Market Volatility in 2025',
  'understanding-market-volatility-2025',
  '<h2>Introduction</h2><p>Market volatility has been a defining characteristic of 2025, with investors navigating unprecedented economic conditions.</p><h2>Key Factors</h2><p>Several factors contribute to current market conditions including interest rate policies, geopolitical tensions, and technological disruptions.</p><h2>Investment Strategies</h2><p>Diversification remains crucial in volatile markets. Consider a balanced portfolio approach.</p>',
  'Explore the key factors driving market volatility in 2025 and learn strategies to protect your investments.',
  (select id from public.categories where slug = 'market-analysis' limit 1),
  true,
  now(),
  '/placeholder.svg?height=400&width=800'
where not exists (select 1 from public.articles where slug = 'understanding-market-volatility-2025');

insert into public.articles (title, slug, content, excerpt, category_id, published, published_at, featured_image)
select
  'Federal Reserve Policy Update: What Investors Need to Know',
  'federal-reserve-policy-update',
  '<h2>Recent Developments</h2><p>The Federal Reserve has announced significant policy changes that will impact markets globally.</p><h2>Impact on Markets</h2><p>These policy shifts are expected to influence interest rates, inflation, and investment strategies.</p><h2>Expert Analysis</h2><p>Leading economists weigh in on what these changes mean for your portfolio.</p>',
  'Breaking down the latest Federal Reserve policy changes and their implications for investors.',
  (select id from public.categories where slug = 'economic-news' limit 1),
  true,
  now(),
  '/placeholder.svg?height=400&width=800'
where not exists (select 1 from public.articles where slug = 'federal-reserve-policy-update');

insert into public.articles (title, slug, content, excerpt, category_id, published, published_at, featured_image)
select
  'Cryptocurrency Market Trends: Bitcoin and Beyond',
  'cryptocurrency-market-trends',
  '<h2>Bitcoin Performance</h2><p>Bitcoin continues to show resilience despite market fluctuations, maintaining strong institutional interest.</p><h2>Altcoin Opportunities</h2><p>Emerging cryptocurrencies are presenting new investment opportunities for diversified portfolios.</p><h2>Regulatory Landscape</h2><p>Understanding the evolving regulatory environment is crucial for crypto investors.</p>',
  'A comprehensive look at cryptocurrency market trends and emerging opportunities in digital assets.',
  (select id from public.categories where slug = 'cryptocurrency' limit 1),
  true,
  now(),
  '/placeholder.svg?height=400&width=800'
where not exists (select 1 from public.articles where slug = 'cryptocurrency-market-trends');
