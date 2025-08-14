-- Insert sample admin user
INSERT INTO users (email, password_hash, full_name, role) VALUES 
('admin@example.com', '$2b$10$example_hash_here', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample landing page
INSERT INTO landing_pages (
  user_id,
  product_name,
  primary_affiliate_link,
  target_audience,
  affiliate_disclosure,
  main_headline,
  sub_headline,
  primary_cta_text,
  problem_headline,
  problem_description,
  solution_headline,
  solution_description,
  social_proof_headline,
  offer_headline,
  urgency_scarcity_text,
  risk_reversal_guarantee,
  final_cta_text,
  faq_headline,
  slug,
  is_published
) VALUES (
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1),
  'AuraSleep Smart Mattress',
  'https://product-site.com/buy?aff_id=12345',
  'Working professionals aged 30-50 who struggle with sleep due to stress and a busy lifestyle.',
  'Please note: This page contains affiliate links. If you make a purchase through these links, I may earn a small commission at no extra cost to you. I only recommend products I truly believe in.',
  'Get a Full Night''s Rest Without Waking Up Tired and Groggy',
  'Discover how the AuraSleep Smart Mattress uses AI-powered adjustments to give you deep, uninterrupted sleep every single night.',
  'Yes, I Want Better Sleep!',
  'Still Waking Up Feeling Like You Haven''t Slept at All?',
  'Tossing and turning all night, staring at the ceiling, and dreading the sound of your alarm clock. You''ve tried everything from herbal teas to meditation apps, but nothing seems to stop the cycle of exhaustion. Poor sleep isn''t just making you tired—it''s ruining your focus, mood, and productivity.',
  'Introducing AuraSleep: The Last Sleep Solution You''ll Ever Need',
  'AuraSleep isn''t just a mattress; it''s a personalized sleep ecosystem. It intelligently tracks your sleep cycles and makes micro-adjustments to temperature and firmness in real-time, guiding you into deeper, more restorative sleep.',
  'See What Our Happy Customers Are Saying...',
  'Get 40% OFF Your AuraSleep Smart Mattress Today + Free Shipping!',
  'This special launch offer ends in 48 hours!',
  'Your purchase is protected by our 100-Night Risk-Free Trial. If you don''t have the best sleep of your life, we''ll give you a full refund.',
  'Claim My 40% Discount Now',
  'Got Questions? We Have Answers.',
  'aurasleep-smart-mattress',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample features
INSERT INTO features (landing_page_id, feature_icon, feature_title, benefit_description, display_order) VALUES 
(
  (SELECT id FROM landing_pages WHERE slug = 'aurasleep-smart-mattress' LIMIT 1),
  'check',
  'AI-Powered Firmness Adjustment',
  'Never wake up with a sore back again. The mattress adapts to your sleeping position to provide perfect spinal alignment and pressure relief all night long.',
  1
),
(
  (SELECT id FROM landing_pages WHERE slug = 'aurasleep-smart-mattress' LIMIT 1),
  'thermometer',
  'Smart Temperature Control',
  'Stay cool and comfortable all night. The mattress automatically adjusts temperature based on your body heat and sleep stage.',
  2
),
(
  (SELECT id FROM landing_pages WHERE slug = 'aurasleep-smart-mattress' LIMIT 1),
  'moon',
  'Sleep Cycle Tracking',
  'Wake up refreshed every morning. Advanced sensors track your sleep patterns and wake you during your lightest sleep phase.',
  3
);

-- Insert sample testimonials
INSERT INTO testimonials (landing_page_id, customer_name, customer_location, star_rating, testimonial_quote, display_order) VALUES 
(
  (SELECT id FROM landing_pages WHERE slug = 'aurasleep-smart-mattress' LIMIT 1),
  'Sarah J.',
  'San Diego, CA',
  5,
  'I haven''t slept this well in years. The AuraSleep mattress was a game-changer for my energy levels. I can''t recommend it enough!',
  1
),
(
  (SELECT id FROM landing_pages WHERE slug = 'aurasleep-smart-mattress' LIMIT 1),
  'Mike R.',
  'Austin, TX',
  5,
  'As someone who travels for work, good sleep is crucial. This mattress has completely transformed my sleep quality.',
  2
);

-- Insert sample FAQs
INSERT INTO faqs (landing_page_id, question, answer, display_order) VALUES 
(
  (SELECT id FROM landing_pages WHERE slug = 'aurasleep-smart-mattress' LIMIT 1),
  'How does the 100-night trial work?',
  'From the day your mattress is delivered, you have 100 nights to try it out. If you''re not completely satisfied for any reason, contact us for a full refund and we''ll even arrange for pickup.',
  1
),
(
  (SELECT id FROM landing_pages WHERE slug = 'aurasleep-smart-mattress' LIMIT 1),
  'Is the mattress compatible with adjustable bed frames?',
  'Yes! The AuraSleep Smart Mattress works perfectly with most adjustable bed frames and platform beds.',
  2
),
(
  (SELECT id FROM landing_pages WHERE slug = 'aurasleep-smart-mattress' LIMIT 1),
  'How long does shipping take?',
  'We offer free shipping and your mattress will arrive within 5-7 business days. We''ll send you tracking information once it ships.',
  3
);
