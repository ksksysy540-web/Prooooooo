-- Delete existing sample data to replace with enhanced version
DELETE FROM faqs WHERE landing_page_id IN (SELECT id FROM landing_pages WHERE slug = 'aurasleep-smart-mattress');
DELETE FROM testimonials WHERE landing_page_id IN (SELECT id FROM landing_pages WHERE slug = 'aurasleep-smart-mattress');
DELETE FROM features WHERE landing_page_id IN (SELECT id FROM landing_pages WHERE slug = 'aurasleep-smart-mattress');
DELETE FROM landing_pages WHERE slug = 'aurasleep-smart-mattress';

-- Insert enhanced sample landing page
INSERT INTO landing_pages (
  user_id,
  product_name,
  primary_affiliate_link,
  target_audience,
  affiliate_disclosure,
  main_headline,
  sub_headline,
  hero_image_url,
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
  'SleepGenius Pro Smart Mattress',
  'https://sleepgenius.com/buy?aff_id=DEMO2024',
  'Busy professionals aged 28-55 who struggle with poor sleep quality due to stress, irregular schedules, and chronic back pain.',
  'Transparency Notice: This page contains affiliate links. If you purchase through these links, I may earn a commission at no extra cost to you. I only recommend products I genuinely believe can improve your sleep quality and overall well-being.',
  'Finally Sleep Through the Night Without Tossing, Turning, or Waking Up Exhausted',
  'Discover how the SleepGenius Pro uses NASA-developed memory foam and AI-powered sleep tracking to give you the deepest, most restorative sleep of your life—guaranteed in just 7 nights.',
  '/placeholder.svg?height=600&width=800',
  'Yes, I Want Perfect Sleep Tonight!',
  'Tired of Lying Awake at 3 AM, Watching the Clock Tick Away Your Energy?',
  'You know the feeling. Your head hits the pillow, but your mind starts racing. You toss and turn for hours, finally drift off, then wake up feeling like you got hit by a truck. You''ve tried everything—melatonin, white noise machines, expensive pillows—but nothing works. Poor sleep isn''t just making you tired. It''s destroying your focus at work, making you irritable with loved ones, and slowly crushing your health. Every morning feels like starting a marathon already exhausted.',
  'Introducing SleepGenius Pro: The Sleep Revolution That''s Changing Lives Worldwide',
  'SleepGenius Pro isn''t just another mattress—it''s a complete sleep optimization system. Using breakthrough NASA memory foam technology combined with AI-powered sleep sensors, it automatically adjusts firmness, temperature, and support throughout the night. The result? You fall asleep faster, stay asleep longer, and wake up feeling genuinely refreshed for the first time in years.',
  'Join 50,000+ People Who''ve Transformed Their Sleep Forever',
  'Limited Time: Get Your SleepGenius Pro for 60% OFF + Free White Glove Delivery!',
  '⚡ Flash Sale Ends in 48 Hours - Only 127 Units Left at This Price!',
  'Sleep Risk-Free for 365 Nights: If you don''t experience the best sleep of your life within one year, we''ll refund every penny AND donate $100 to a sleep research charity. That''s how confident we are that SleepGenius Pro will change your life.',
  'Claim My 60% Discount + Free Delivery Now',
  'Everything You Need to Know About Your New Sleep Solution',
  'sleepgenius-pro-smart-mattress',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  product_name = EXCLUDED.product_name,
  primary_affiliate_link = EXCLUDED.primary_affiliate_link,
  target_audience = EXCLUDED.target_audience,
  affiliate_disclosure = EXCLUDED.affiliate_disclosure,
  main_headline = EXCLUDED.main_headline,
  sub_headline = EXCLUDED.sub_headline,
  hero_image_url = EXCLUDED.hero_image_url,
  primary_cta_text = EXCLUDED.primary_cta_text,
  problem_headline = EXCLUDED.problem_headline,
  problem_description = EXCLUDED.problem_description,
  solution_headline = EXCLUDED.solution_headline,
  solution_description = EXCLUDED.solution_description,
  social_proof_headline = EXCLUDED.social_proof_headline,
  offer_headline = EXCLUDED.offer_headline,
  urgency_scarcity_text = EXCLUDED.urgency_scarcity_text,
  risk_reversal_guarantee = EXCLUDED.risk_reversal_guarantee,
  final_cta_text = EXCLUDED.final_cta_text,
  faq_headline = EXCLUDED.faq_headline,
  is_published = EXCLUDED.is_published;

-- Insert enhanced sample features
INSERT INTO features (landing_page_id, feature_icon, feature_title, benefit_description, display_order) VALUES 
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'check',
  'NASA Memory Foam Technology',
  'Experience zero pressure points with the same advanced foam used in space missions. Your spine stays perfectly aligned all night, eliminating morning back pain and stiffness forever.',
  1
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'star',
  'AI Sleep Optimization',
  'Smart sensors learn your sleep patterns and automatically adjust firmness every 15 minutes. Wake up feeling like you slept in a luxury hotel every single night.',
  2
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'shield',
  'Temperature Regulation System',
  'Never wake up hot and sweaty again. Advanced cooling gel keeps you at the perfect temperature all night, reducing sleep interruptions by up to 87%.',
  3
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'clock',
  'Smart Wake Technology',
  'Gentle vibration wakes you during your lightest sleep phase, so you feel naturally refreshed instead of groggy. No more jarring alarms ruining your morning.',
  4
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'users',
  'Partner Motion Isolation',
  'Sleep peacefully even if your partner tosses and turns. Advanced motion isolation means you won''t feel them move, guaranteeing uninterrupted rest for both of you.',
  5
);

-- Insert enhanced sample testimonials
INSERT INTO testimonials (landing_page_id, customer_name, customer_location, star_rating, testimonial_quote, display_order) VALUES 
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'Sarah Chen',
  'San Francisco, CA',
  5,
  'I was skeptical about spending this much on a mattress, but after 3 months, I can honestly say it''s the best investment I''ve ever made. I fall asleep in minutes now and wake up feeling like I''ve had the most restful sleep of my life. My chronic back pain is completely gone!',
  1
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'Michael Rodriguez',
  'Austin, TX',
  5,
  'As a shift worker, good sleep has always been impossible for me. The SleepGenius Pro changed everything. The AI adjustments help me sleep deeply no matter what time I go to bed. I have more energy now than I''ve had in 10 years.',
  2
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'Jennifer Walsh',
  'Boston, MA',
  5,
  'My husband and I have completely different sleep preferences, but this mattress somehow works perfectly for both of us. The motion isolation is incredible—I don''t feel him getting up for work at 5 AM anymore. We both sleep through the night now.',
  3
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'David Kim',
  'Seattle, WA',
  5,
  'I''ve tried every sleep solution imaginable. This is the only thing that actually worked. The temperature control keeps me cool all night, and I wake up feeling genuinely refreshed. Worth every penny and more.',
  4
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'Lisa Thompson',
  'Miami, FL',
  5,
  'Three weeks in and I''m sleeping 8 hours straight for the first time in years. My Fitbit shows I''m getting 40% more deep sleep. My productivity at work has skyrocketed because I''m actually well-rested. This mattress is life-changing.',
  5
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'Robert Johnson',
  'Denver, CO',
  5,
  'I was waking up 4-5 times every night with lower back pain. Since getting the SleepGenius Pro, I sleep through the night and wake up pain-free. The AI adjustments are like having a personal sleep coach. Absolutely incredible technology.',
  6
);

-- Insert enhanced sample FAQs
INSERT INTO faqs (landing_page_id, question, answer, display_order) VALUES 
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'How does the 365-night trial actually work?',
  'Simple: Sleep on your SleepGenius Pro for up to one full year. If you''re not completely satisfied for any reason, contact our customer service team. We''ll arrange free pickup and issue a full refund within 5 business days. No questions asked, no restocking fees, no hassles.',
  1
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'Will this work with my existing bed frame?',
  'Yes! The SleepGenius Pro works with any bed frame, platform bed, adjustable base, or even directly on the floor. It''s designed to be universally compatible. If you have an adjustable base, the smart features work even better.',
  2
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'How long does shipping take and what does "White Glove Delivery" include?',
  'Standard shipping takes 5-7 business days. White Glove Delivery (free with this offer) includes: professional delivery team brings it inside, unpacks it, sets it up in your bedroom, removes all packaging, and can even remove your old mattress for free. You don''t lift a finger.',
  3
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'Is the AI technology safe? Will it emit harmful radiation?',
  'Absolutely safe. The sensors use ultra-low power Bluetooth technology (1000x less radiation than your phone). The system is FCC certified and meets all safety standards. Many customers actually sleep better knowing their sleep is being optimized without any health risks.',
  4
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'What if I sleep hot? Will this mattress make me overheat?',
  'The opposite! The SleepGenius Pro is specifically designed for hot sleepers. The cooling gel layer and breathable memory foam actively regulate temperature. Most customers report sleeping 3-5 degrees cooler than their old mattress. If you currently wake up sweaty, this will solve that problem.',
  5
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'How is this different from other "smart" mattresses I''ve seen?',
  'Most smart mattresses just track your sleep. SleepGenius Pro actually improves it in real-time. While you sleep, it makes micro-adjustments to firmness and temperature based on your sleep stage. It''s like having a sleep technician optimizing your comfort all night long. No other mattress does this.',
  6
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'What about the warranty? What if something breaks?',
  'You''re covered by our industry-leading 20-year warranty. The first 10 years cover everything (including the smart technology) with free replacement. Years 11-20 cover the foam and structure. Plus, our customer service team is available 24/7 to help with any questions or issues.',
  7
),
(
  (SELECT id FROM landing_pages WHERE slug = 'sleepgenius-pro-smart-mattress' LIMIT 1),
  'Can I really get 60% off? This seems too good to be true.',
  'This is a genuine limited-time offer for new customers only. We''re launching in your area and want to create buzz with amazing testimonials. The regular price is $2,997, but during this 48-hour flash sale, you pay just $1,197. Once we hit our quota of 500 units, the price goes back to normal.',
  8
);

-- Create a second sample landing page for variety
INSERT INTO landing_pages (
  user_id,
  product_name,
  primary_affiliate_link,
  target_audience,
  affiliate_disclosure,
  main_headline,
  sub_headline,
  hero_image_url,
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
  'FocusFlow Productivity Planner',
  'https://focusflow.com/buy?aff_id=DEMO2024',
  'Entrepreneurs, freelancers, and busy professionals who struggle with overwhelm, procrastination, and achieving their biggest goals.',
  'Affiliate Disclosure: This page contains affiliate links. If you make a purchase through these links, I may earn a small commission at no extra cost to you. I only recommend products that I personally use and believe can genuinely help you achieve your goals.',
  'Stop Feeling Overwhelmed and Start Achieving Your Biggest Goals in Just 90 Days',
  'The science-backed productivity system that helps ambitious professionals eliminate distractions, prioritize what matters, and accomplish 3x more in half the time.',
  '/placeholder.svg?height=600&width=800',
  'Get My Productivity System Now',
  'Drowning in Your To-Do List While Your Dreams Collect Dust?',
  'You start each day with big plans, but by noon you''re already behind. Emails pile up, meetings run long, and that important project keeps getting pushed to "tomorrow." You work harder than ever but feel like you''re running in place. Meanwhile, your biggest goals—starting that business, writing that book, getting that promotion—remain just dreams on a someday list.',
  'Introducing FocusFlow: The Goal Achievement System Used by Top Performers',
  'FocusFlow isn''t just another planner—it''s a complete productivity transformation system. Based on neuroscience research and tested by over 10,000 high achievers, it helps you identify your true priorities, eliminate time-wasting activities, and create unstoppable momentum toward your most important goals.',
  'See How FocusFlow Users Are Crushing Their Goals',
  'Get FocusFlow for 50% OFF + Bonus Goal-Setting Masterclass (Worth $297)',
  'Early Bird Special Ends Tonight at Midnight!',
  '90-Day Money-Back Guarantee: If you don''t accomplish at least one major goal within 90 days of using FocusFlow, we''ll refund your entire purchase and let you keep the planner. That''s how confident we are in this system.',
  'Claim My 50% Discount Now',
  'Your Questions About FocusFlow Answered',
  'focusflow-productivity-planner',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Add features for the second sample
INSERT INTO features (landing_page_id, feature_icon, feature_title, benefit_description, display_order) VALUES 
(
  (SELECT id FROM landing_pages WHERE slug = 'focusflow-productivity-planner' LIMIT 1),
  'check',
  '90-Day Goal Sprint System',
  'Break down any big goal into manageable 90-day sprints with weekly milestones. Never feel overwhelmed again—just follow the system and watch your progress compound.',
  1
),
(
  (SELECT id FROM landing_pages WHERE slug = 'focusflow-productivity-planner' LIMIT 1),
  'star',
  'Priority Matrix Framework',
  'Instantly identify what truly matters using our proven 4-quadrant system. Stop wasting time on busy work and focus only on activities that move you forward.',
  2
),
(
  (SELECT id FROM landing_pages WHERE slug = 'focusflow-productivity-planner' LIMIT 1),
  'clock',
  'Time-Blocking Templates',
  'Pre-designed daily schedules that automatically protect your most important work. No more decision fatigue—just plug in your priorities and execute.',
  3
);

-- Add testimonials for the second sample
INSERT INTO testimonials (landing_page_id, customer_name, customer_location, star_rating, testimonial_quote, display_order) VALUES 
(
  (SELECT id FROM landing_pages WHERE slug = 'focusflow-productivity-planner' LIMIT 1),
  'Amanda Foster',
  'New York, NY',
  5,
  'I launched my consulting business, wrote a book proposal, and got promoted—all in my first 90 days with FocusFlow. The goal sprint system is absolutely game-changing.',
  1
),
(
  (SELECT id FROM landing_pages WHERE slug = 'focusflow-productivity-planner' LIMIT 1),
  'Marcus Williams',
  'Chicago, IL',
  5,
  'Finally, a productivity system that actually works! I''ve tried everything, but FocusFlow is the only thing that helped me stop procrastinating and start achieving my biggest goals.',
  2
);

-- Add FAQs for the second sample
INSERT INTO faqs (landing_page_id, question, answer, display_order) VALUES 
(
  (SELECT id FROM landing_pages WHERE slug = 'focusflow-productivity-planner' LIMIT 1),
  'Is this just another planner or something different?',
  'FocusFlow is a complete goal achievement system, not just a planner. It includes the physical planner, digital templates, video training modules, and access to our private community of high achievers. It''s everything you need to transform your productivity.',
  1
),
(
  (SELECT id FROM landing_pages WHERE slug = 'focusflow-productivity-planner' LIMIT 1),
  'How long does it take to see results?',
  'Most users report feeling more organized and focused within the first week. Significant progress toward major goals typically happens within 30-45 days. The 90-day sprint system is designed to deliver measurable results by the end of each quarter.',
  2
);
