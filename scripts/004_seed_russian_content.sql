-- Seed Russian content for the financial portal
delete from public.articles;

-- Insert sample articles in Russian
insert into public.articles (title, slug, content, excerpt, category_id, published, published_at, featured_image) 
select 
  'Центробанк повысил ключевую ставку: что это значит для инвесторов',
  'cb-raised-key-rate',
  '<h2>Решение ЦБ</h2><p>Центральный банк принял решение о повышении ключевой ставки на 0.5 процентных пункта, что окажет влияние на все сегменты финансового рынка.</p><h2>Влияние на рынки</h2><p>Эксперты прогнозируют укрепление рубля и рост доходности облигаций в краткосрочной перспективе.</p><h2>Рекомендации инвесторам</h2><p>В текущих условиях стоит пересмотреть структуру портфеля и обратить внимание на защитные активы.</p>',
  'Анализ последствий повышения ключевой ставки ЦБ для различных классов активов и стратегии для инвесторов.',
  (select id from public.categories where slug = 'analytics' limit 1),
  true,
  now(),
  '/placeholder.svg?height=400&width=800'
where not exists (select 1 from public.articles where slug = 'cb-raised-key-rate');

insert into public.articles (title, slug, content, excerpt, category_id, published, published_at, featured_image)
select
  'Топ-5 инвестиционных стратегий для 2025 года',
  'top-5-investment-strategies-2025',
  '<h2>Диверсификация портфеля</h2><p>Распределение активов между различными классами остается ключевым принципом успешного инвестирования.</p><h2>Долгосрочные инвестиции</h2><p>Фокус на качественных активах с горизонтом инвестирования от 3 лет показывает наилучшие результаты.</p><h2>Альтернативные инвестиции</h2><p>Рассмотрите включение в портфель недвижимости, драгоценных металлов и структурных продуктов.</p>',
  'Проверенные инвестиционные стратегии, которые помогут сохранить и приумножить капитал в текущем году.',
  (select id from public.categories where slug = 'investments' limit 1),
  true,
  now(),
  '/placeholder.svg?height=400&width=800'
where not exists (select 1 from public.articles where slug = 'top-5-investment-strategies-2025');

insert into public.articles (title, slug, content, excerpt, category_id, published, published_at, featured_image)
select
  'Как выбрать страховую компанию: гайд для начинающих',
  'how-to-choose-insurance-company',
  '<h2>Критерии выбора</h2><p>При выборе страховой компании обратите внимание на рейтинг надежности, историю выплат и условия договора.</p><h2>Виды страхования</h2><p>Разберитесь в различиях между ОСАГО, КАСКО, страхованием жизни и имущества.</p><h2>Частые ошибки</h2><p>Избегайте типичных ошибок при оформлении страховки и внимательно читайте договор.</p>',
  'Подробное руководство по выбору надежной страховой компании и оформлению страховых продуктов.',
  (select id from public.categories where slug = 'guides' limit 1),
  true,
  now(),
  '/placeholder.svg?height=400&width=800'
where not exists (select 1 from public.articles where slug = 'how-to-choose-insurance-company');

insert into public.articles (title, slug, content, excerpt, category_id, published, published_at, featured_image)
select
  'Интервью с главой инвестиционного фонда: взгляд на рынок 2025',
  'interview-investment-fund-ceo',
  '<h2>О текущей ситуации</h2><p>Глава одного из крупнейших инвестиционных фондов делится своим видением развития рынка в 2025 году.</p><h2>Перспективные секторы</h2><p>Эксперт выделяет технологии, зеленую энергетику и здравоохранение как наиболее перспективные направления.</p><h2>Риски и возможности</h2><p>Обсуждение ключевых рисков и способов их минимизации в текущих рыночных условиях.</p>',
  'Эксклюзивное интервью с руководителем крупного инвестиционного фонда о трендах и возможностях рынка.',
  (select id from public.categories where slug = 'interviews' limit 1),
  true,
  now(),
  '/placeholder.svg?height=400&width=800'
where not exists (select 1 from public.articles where slug = 'interview-investment-fund-ceo');

insert into public.articles (title, slug, content, excerpt, category_id, published, published_at, featured_image)
select
  'Финтех-революция: как технологии меняют банковский сектор',
  'fintech-revolution-banking',
  '<h2>Цифровые банки</h2><p>Необанки и цифровые платформы захватывают все большую долю рынка финансовых услуг.</p><h2>Блокчейн и криптовалюты</h2><p>Технология распределенного реестра открывает новые возможности для финансовых операций.</p><h2>Искусственный интеллект</h2><p>ИИ трансформирует процессы кредитования, оценки рисков и обслуживания клиентов.</p>',
  'Как современные технологии трансформируют финансовую индустрию и создают новые возможности для бизнеса.',
  (select id from public.categories where slug = 'technology' limit 1),
  true,
  now(),
  '/placeholder.svg?height=400&width=800'
where not exists (select 1 from public.articles where slug = 'fintech-revolution-banking');

insert into public.articles (title, slug, content, excerpt, category_id, published, published_at, featured_image)
select
  'Кейс: как я заработал 50% годовых на акциях технологических компаний',
  'case-study-tech-stocks-50-percent',
  '<h2>Начало пути</h2><p>История успешного инвестирования в акции технологических компаний с детальным разбором стратегии.</p><h2>Выбор активов</h2><p>Критерии отбора компаний и анализ фундаментальных показателей, которые привели к успеху.</p><h2>Уроки и выводы</h2><p>Ключевые уроки, ошибки и рекомендации для тех, кто хочет повторить успех.</p>',
  'Реальная история инвестора, который добился впечатляющей доходности на технологических акциях.',
  (select id from public.categories where slug = 'case-studies' limit 1),
  true,
  now(),
  '/placeholder.svg?height=400&width=800'
where not exists (select 1 from public.articles where slug = 'case-study-tech-stocks-50-percent');
