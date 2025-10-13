-- Complete database schema for Financial Portal CMS
-- Run this script to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- A/B Testing table
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  variant_a TEXT NOT NULL,
  variant_b TEXT NOT NULL,
  variant_a_views INTEGER DEFAULT 0,
  variant_b_views INTEGER DEFAULT 0,
  variant_a_conversions INTEGER DEFAULT 0,
  variant_b_conversions INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ad Slots table
CREATE TABLE IF NOT EXISTS ad_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  position TEXT NOT NULL CHECK (position IN ('header', 'sidebar', 'inline', 'footer', 'hero')),
  width INTEGER,
  height INTEGER,
  is_active BOOLEAN DEFAULT true,
  mobile_enabled BOOLEAN DEFAULT true,
  desktop_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ad Impressions table
CREATE TABLE IF NOT EXISTS ad_impressions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_slot_id UUID REFERENCES ad_slots(id) ON DELETE CASCADE,
  ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
  session_id TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  clicked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Cookie Consents table (if not exists from previous script)
CREATE TABLE IF NOT EXISTS cookie_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  consent JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Cookie Settings table (if not exists)
CREATE TABLE IF NOT EXISTS cookie_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  banner_text TEXT NOT NULL DEFAULT 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Legal Pages table (if not exists)
CREATE TABLE IF NOT EXISTS legal_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Glossary Terms table for auto-linking
CREATE TABLE IF NOT EXISTS glossary_terms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  term TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Article Views tracking (enhanced)
CREATE TABLE IF NOT EXISTS article_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ad_slots_position ON ad_slots(position);
CREATE INDEX IF NOT EXISTS idx_ad_slots_active ON ad_slots(is_active);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_ad_slot ON ad_impressions(ad_slot_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_created ON ad_impressions(created_at);
CREATE INDEX IF NOT EXISTS idx_cookie_consents_session ON cookie_consents(session_id);
CREATE INDEX IF NOT EXISTS idx_cookie_consents_created ON cookie_consents(created_at);
CREATE INDEX IF NOT EXISTS idx_legal_pages_slug ON legal_pages(slug);
CREATE INDEX IF NOT EXISTS idx_glossary_terms_term ON glossary_terms(term);
CREATE INDEX IF NOT EXISTS idx_glossary_terms_active ON glossary_terms(is_active);
CREATE INDEX IF NOT EXISTS idx_article_views_article ON article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_article_views_viewed ON article_views(viewed_at);

-- Row Level Security Policies

-- A/B Tests: Admin only
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can manage ab_tests" ON ab_tests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can view active ab_tests" ON ab_tests FOR SELECT USING (status = 'active');

-- Ad Slots: Admin manage, public view active
ALTER TABLE ad_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can manage ad_slots" ON ad_slots FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can view active ad_slots" ON ad_slots FOR SELECT USING (is_active = true);

-- Ad Impressions: Admin view, public insert
ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can view ad_impressions" ON ad_impressions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public can insert ad_impressions" ON ad_impressions FOR INSERT WITH CHECK (true);

-- Cookie Consents: Admin view, public insert
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can view cookie_consents" ON cookie_consents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public can insert cookie_consents" ON cookie_consents FOR INSERT WITH CHECK (true);

-- Cookie Settings: Admin manage, public view
ALTER TABLE cookie_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can manage cookie_settings" ON cookie_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can view cookie_settings" ON cookie_settings FOR SELECT USING (true);

-- Legal Pages: Admin manage, public view
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can manage legal_pages" ON legal_pages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can view legal_pages" ON legal_pages FOR SELECT USING (true);

-- Glossary Terms: Admin manage, public view active
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can manage glossary_terms" ON glossary_terms FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can view active glossary_terms" ON glossary_terms FOR SELECT USING (is_active = true);

-- Article Views: Admin view, public insert
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can view article_views" ON article_views FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public can insert article_views" ON article_views FOR INSERT WITH CHECK (true);

-- Insert default cookie settings
INSERT INTO cookie_settings (banner_text) 
VALUES ('We use cookies to enhance your experience and analyze site traffic. By continuing to visit this site you agree to our use of cookies.')
ON CONFLICT DO NOTHING;

-- Insert default legal pages
INSERT INTO legal_pages (slug, title, content, meta_description) VALUES
('privacy-policy', 'Privacy Policy', 
'<h2>Privacy Policy</h2>
<p>Last updated: ' || to_char(now(), 'Month DD, YYYY') || '</p>

<h3>1. Information We Collect</h3>
<p>We collect information you provide directly to us, including name, email address, and any other information you choose to provide.</p>

<h3>2. How We Use Your Information</h3>
<p>We use the information we collect to provide, maintain, and improve our services, communicate with you, and comply with legal obligations.</p>

<h3>3. Information Sharing</h3>
<p>We do not sell your personal information. We may share your information with service providers who assist us in operating our website.</p>

<h3>4. Cookies</h3>
<p>We use cookies and similar tracking technologies. See our Cookie Policy for more details.</p>

<h3>5. Data Security</h3>
<p>We implement appropriate security measures to protect your personal information.</p>

<h3>6. Your Rights</h3>
<p>You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>

<h3>7. Contact Us</h3>
<p>For questions about this Privacy Policy, contact us at privacy@financial-portal.com</p>',
'Learn how we collect, use, and protect your personal information on Financial Portal.'),

('terms-of-service', 'Terms of Service',
'<h2>Terms of Service</h2>
<p>Last updated: ' || to_char(now(), 'Month DD, YYYY') || '</p>

<h3>1. Acceptance of Terms</h3>
<p>By accessing and using this website, you accept and agree to be bound by these Terms of Service.</p>

<h3>2. Use of Service</h3>
<p>You agree to use our service only for lawful purposes and in accordance with these Terms.</p>

<h3>3. Intellectual Property</h3>
<p>All content on this website is owned by Financial Portal and protected by copyright laws.</p>

<h3>4. User Content</h3>
<p>You retain ownership of content you submit, but grant us a license to use, display, and distribute it.</p>

<h3>5. Disclaimer</h3>
<p>Our service is provided "as is" without warranties of any kind. See our Financial Disclaimer for investment-related information.</p>

<h3>6. Limitation of Liability</h3>
<p>We shall not be liable for any indirect, incidental, or consequential damages arising from your use of our service.</p>

<h3>7. Changes to Terms</h3>
<p>We reserve the right to modify these terms at any time. Continued use constitutes acceptance of modified terms.</p>

<h3>8. Contact</h3>
<p>For questions about these Terms, contact us at legal@financial-portal.com</p>',
'Read the Terms of Service governing your use of Financial Portal.'),

('cookies', 'Cookie Policy',
'<h2>Cookie Policy</h2>
<p>Last updated: ' || to_char(now(), 'Month DD, YYYY') || '</p>

<h3>What Are Cookies</h3>
<p>Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience.</p>

<h3>Types of Cookies We Use</h3>

<h4>Necessary Cookies</h4>
<p>These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas.</p>

<h4>Analytics Cookies</h4>
<p>We use analytics cookies to understand how visitors interact with our website, helping us improve our service.</p>

<h4>Advertising Cookies</h4>
<p>These cookies are used to deliver relevant advertisements and track ad campaign performance.</p>

<h4>Personalization Cookies</h4>
<p>These cookies remember your preferences and provide personalized content and features.</p>

<h3>Managing Cookies</h3>
<p>You can control cookies through our cookie consent banner or your browser settings. Note that disabling certain cookies may affect website functionality.</p>

<h3>Third-Party Cookies</h3>
<p>We may use third-party services like Google Analytics that set their own cookies. These are governed by their respective privacy policies.</p>

<h3>Contact</h3>
<p>For questions about our use of cookies, contact us at privacy@financial-portal.com</p>',
'Learn about how Financial Portal uses cookies and how you can manage your preferences.'),

('disclaimer', 'Financial Disclaimer',
'<h2>Financial Disclaimer</h2>
<p>Last updated: ' || to_char(now(), 'Month DD, YYYY') || '</p>

<h3>Not Financial Advice</h3>
<p>The information provided on this website is for educational and informational purposes only. It does not constitute financial, investment, trading, or other professional advice.</p>

<h3>No Guarantees</h3>
<p>We make no representations or warranties regarding the accuracy, completeness, or timeliness of any information on this website. Financial markets are inherently risky and past performance does not guarantee future results.</p>

<h3>Do Your Own Research</h3>
<p>Before making any financial decisions, you should conduct your own research and consult with qualified financial advisors. Consider your individual circumstances, risk tolerance, and investment objectives.</p>

<h3>Risk Warning</h3>
<p>Investing in financial markets involves substantial risk of loss. You should only invest money you can afford to lose. The value of investments can go down as well as up.</p>

<h3>No Liability</h3>
<p>We shall not be liable for any losses or damages arising from your use of information on this website or any investment decisions you make.</p>

<h3>Third-Party Content</h3>
<p>We may link to third-party websites or display third-party content. We are not responsible for the accuracy or reliability of such content.</p>

<h3>Regulatory Compliance</h3>
<p>This website is not registered with any financial regulatory authority. We do not provide personalized investment recommendations.</p>

<h3>Contact</h3>
<p>For questions about this disclaimer, contact us at legal@financial-portal.com</p>',
'Important financial disclaimer regarding the information and content provided on Financial Portal.')

ON CONFLICT (slug) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_ab_tests_updated_at BEFORE UPDATE ON ab_tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ad_slots_updated_at BEFORE UPDATE ON ad_slots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cookie_settings_updated_at BEFORE UPDATE ON cookie_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legal_pages_updated_at BEFORE UPDATE ON legal_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_glossary_terms_updated_at BEFORE UPDATE ON glossary_terms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
