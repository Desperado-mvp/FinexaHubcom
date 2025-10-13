-- Create cookie consent tables

-- Cookie settings table (admin configurable)
CREATE TABLE IF NOT EXISTS cookie_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_text TEXT NOT NULL DEFAULT 'We use cookies to improve your experience, analytics, and personalized advertising. See our Cookie Policy for details.',
  policy_url TEXT NOT NULL DEFAULT '/legal/cookies',
  necessary_enabled BOOLEAN NOT NULL DEFAULT true,
  analytics_enabled BOOLEAN NOT NULL DEFAULT true,
  advertising_enabled BOOLEAN NOT NULL DEFAULT true,
  personalization_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO cookie_settings (banner_text, policy_url) 
VALUES (
  'We use cookies to improve your experience, analytics, and personalized advertising. See our Cookie Policy for details.',
  '/legal/cookies'
) ON CONFLICT DO NOTHING;

-- User consent tracking table
CREATE TABLE IF NOT EXISTS user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  necessary BOOLEAN NOT NULL DEFAULT true,
  analytics BOOLEAN NOT NULL DEFAULT false,
  advertising BOOLEAN NOT NULL DEFAULT false,
  personalization BOOLEAN NOT NULL DEFAULT false,
  consent_given_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_consents_session ON user_consents(session_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_created ON user_consents(created_at DESC);

-- Legal pages table
CREATE TABLE IF NOT EXISTS legal_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default legal pages
INSERT INTO legal_pages (slug, title, content, meta_description) VALUES
(
  'privacy-policy',
  'Privacy Policy',
  '<h2>Privacy Policy</h2><p>Last updated: ' || TO_CHAR(NOW(), 'Month DD, YYYY') || '</p><p>This Privacy Policy describes how Financial Portal collects, uses, and protects your personal information.</p><h3>Information We Collect</h3><p>We collect information you provide directly, usage data, and information from cookies and similar technologies.</p><h3>How We Use Your Information</h3><p>We use your information to provide services, improve user experience, send communications, and comply with legal obligations.</p><h3>Data Security</h3><p>We implement appropriate security measures to protect your personal information.</p><h3>Your Rights</h3><p>You have rights to access, correct, delete, and restrict processing of your personal data.</p><h3>Contact Us</h3><p>For privacy concerns, contact us at privacy@financial-portal.com</p>',
  'Learn how Financial Portal collects, uses, and protects your personal information in compliance with GDPR and CCPA.'
),
(
  'terms-of-service',
  'Terms of Service',
  '<h2>Terms of Service</h2><p>Last updated: ' || TO_CHAR(NOW(), 'Month DD, YYYY') || '</p><h3>Acceptance of Terms</h3><p>By accessing Financial Portal, you agree to these Terms of Service.</p><h3>Use of Service</h3><p>You agree to use our service only for lawful purposes and in accordance with these Terms.</p><h3>Intellectual Property</h3><p>All content on Financial Portal is protected by copyright and other intellectual property laws.</p><h3>Disclaimer of Warranties</h3><p>The service is provided "as is" without warranties of any kind.</p><h3>Limitation of Liability</h3><p>Financial Portal shall not be liable for any indirect, incidental, or consequential damages.</p><h3>Changes to Terms</h3><p>We reserve the right to modify these terms at any time.</p>',
  'Terms of Service for Financial Portal - Read our terms and conditions for using our financial news and analytics platform.'
),
(
  'cookies',
  'Cookie Policy',
  '<h2>Cookie Policy</h2><p>Last updated: ' || TO_CHAR(NOW(), 'Month DD, YYYY') || '</p><h3>What Are Cookies</h3><p>Cookies are small text files stored on your device when you visit our website.</p><h3>Types of Cookies We Use</h3><h4>Necessary Cookies</h4><p>Essential for the website to function properly. These cannot be disabled.</p><h4>Analytics Cookies</h4><p>Help us understand how visitors interact with our website by collecting anonymous information.</p><h4>Advertising Cookies</h4><p>Used to deliver relevant advertisements and track ad campaign performance.</p><h4>Personalization Cookies</h4><p>Remember your preferences and settings for a better user experience.</p><h3>Managing Cookies</h3><p>You can control cookie preferences through our cookie banner or your browser settings.</p><h3>Third-Party Cookies</h3><p>We use Google Analytics, Google Ads, and other third-party services that may set cookies.</p>',
  'Learn about how Financial Portal uses cookies and how you can manage your cookie preferences.'
),
(
  'disclaimer',
  'Financial Disclaimer',
  '<h2>Financial Disclaimer</h2><p>Last updated: ' || TO_CHAR(NOW(), 'Month DD, YYYY') || '</p><h3>Not Financial Advice</h3><p>The information provided on Financial Portal is for educational and informational purposes only and should not be construed as financial, investment, or legal advice.</p><h3>No Guarantees</h3><p>We make no representations or warranties regarding the accuracy, completeness, or timeliness of any information on this website.</p><h3>Investment Risks</h3><p>All investments involve risk, including the potential loss of principal. Past performance does not guarantee future results.</p><h3>Consult Professionals</h3><p>Before making any financial decisions, consult with qualified financial advisors, accountants, or legal professionals.</p><h3>Third-Party Content</h3><p>We are not responsible for the accuracy or reliability of third-party content, links, or advertisements.</p><h3>Limitation of Liability</h3><p>Financial Portal and its authors shall not be held liable for any losses or damages arising from the use of information on this website.</p>',
  'Important financial disclaimer - Financial Portal content is for informational purposes only and not financial advice.'
)
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS (Row Level Security) for public access
ALTER TABLE cookie_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;

-- Public read access for cookie settings and legal pages
CREATE POLICY "Public can read cookie settings" ON cookie_settings FOR SELECT USING (true);
CREATE POLICY "Public can read legal pages" ON legal_pages FOR SELECT USING (published = true);

-- Public can insert their own consent
CREATE POLICY "Anyone can insert consent" ON user_consents FOR INSERT WITH CHECK (true);
