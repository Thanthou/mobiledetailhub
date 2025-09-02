-- Initial affiliate services data seeds
-- These are sample services for the affiliate businesses

-- Services for Jess Brister Mobile Detailing (business_id = 1)
INSERT INTO affiliates.services (
    business_id,
    service_name,
    service_description,
    service_category,
    service_type,
    vehicle_types,
    is_active,
    is_featured,
    sort_order,
    created_at,
    updated_at,
    metadata
) VALUES 
(
    1, -- Jess Brister Mobile Detailing
    'Full Detail Package',
    'Complete interior and exterior detailing including wash, wax, interior cleaning, and tire shine',
    'detailing',
    'full_detail',
    '["auto", "truck", "suv"]'::jsonb,
    true,
    true,
    1,
    '2025-08-28 19:00:00.000000-07',
    '2025-08-28 19:00:00.000000-07',
    '{"duration": "3-4 hours", "price_range": "$150-250"}'::jsonb
),
(
    1,
    'Ceramic Coating',
    'Premium ceramic coating application for long-lasting protection and shine',
    'protection',
    'ceramic_coating',
    '["auto", "truck", "suv", "boat"]'::jsonb,
    true,
    true,
    2,
    '2025-08-28 19:00:00.000000-07',
    '2025-08-28 19:00:00.000000-07',
    '{"duration": "6-8 hours", "price_range": "$800-1500"}'::jsonb
),
(
    1,
    'Paint Protection Film',
    'Clear protective film application to prevent paint damage',
    'protection',
    'ppf',
    '["auto", "truck", "suv"]'::jsonb,
    true,
    false,
    3,
    '2025-08-28 19:00:00.000000-07',
    '2025-08-28 19:00:00.000000-07',
    '{"duration": "1-2 days", "price_range": "$500-2000"}'::jsonb
),
(
    1,
    'Interior Deep Clean',
    'Thorough interior cleaning including seats, carpets, and dashboard',
    'detailing',
    'interior',
    '["auto", "truck", "suv", "rv"]'::jsonb,
    true,
    false,
    4,
    '2025-08-28 19:00:00.000000-07',
    '2025-08-28 19:00:00.000000-07',
    '{"duration": "2-3 hours", "price_range": "$100-200"}'::jsonb
);

-- Services for Premium Auto Spa (business_id = 2)
INSERT INTO affiliates.services (
    business_id,
    service_name,
    service_description,
    service_category,
    service_type,
    vehicle_types,
    is_active,
    is_featured,
    sort_order,
    created_at,
    updated_at,
    metadata
) VALUES 
(
    2, -- Premium Auto Spa
    'Luxury Detail Package',
    'Premium detailing service with premium products and attention to detail',
    'detailing',
    'luxury_detail',
    '["auto", "truck", "suv", "boat"]'::jsonb,
    true,
    true,
    1,
    '2025-08-29 10:30:00.000000-07',
    '2025-08-29 10:30:00.000000-07',
    '{"duration": "4-6 hours", "price_range": "$300-500"}'::jsonb
),
(
    2,
    'Ceramic Coating Pro',
    'Professional-grade ceramic coating with 5-year warranty',
    'protection',
    'ceramic_coating',
    '["auto", "truck", "suv"]'::jsonb,
    true,
    true,
    2,
    '2025-08-29 10:30:00.000000-07',
    '2025-08-29 10:30:00.000000-07',
    '{"duration": "8-10 hours", "price_range": "$1200-2000"}'::jsonb
),
(
    2,
    'Paint Correction',
    'Multi-stage paint correction to remove swirls and scratches',
    'detailing',
    'paint_correction',
    '["auto", "truck", "suv"]'::jsonb,
    true,
    false,
    3,
    '2025-08-29 10:30:00.000000-07',
    '2025-08-29 10:30:00.000000-07',
    '{"duration": "1-2 days", "price_range": "$400-800"}'::jsonb
);

-- Services for Elite Mobile Detail (business_id = 3) - pending business
INSERT INTO affiliates.services (
    business_id,
    service_name,
    service_description,
    service_category,
    service_type,
    vehicle_types,
    is_active,
    is_featured,
    sort_order,
    created_at,
    updated_at,
    metadata
) VALUES 
(
    3, -- Elite Mobile Detail
    'Basic Wash & Wax',
    'Standard exterior wash and wax service',
    'detailing',
    'basic_wash',
    '["auto", "truck", "suv"]'::jsonb,
    true,
    false,
    1,
    '2025-08-30 14:00:00.000000-07',
    '2025-08-30 14:00:00.000000-07',
    '{"duration": "1-2 hours", "price_range": "$50-100"}'::jsonb
),
(
    3,
    'Interior Clean',
    'Basic interior cleaning and vacuuming',
    'detailing',
    'interior',
    '["auto", "truck", "suv"]'::jsonb,
    true,
    false,
    2,
    '2025-08-30 14:00:00.000000-07',
    '2025-08-30 14:00:00.000000-07',
    '{"duration": "1-2 hours", "price_range": "$75-125"}'::jsonb
);

-- Services for Quick Clean Mobile (business_id = 4)
INSERT INTO affiliates.services (
    business_id,
    service_name,
    service_description,
    service_category,
    service_type,
    vehicle_types,
    is_active,
    is_featured,
    sort_order,
    created_at,
    updated_at,
    metadata
) VALUES 
(
    4, -- Quick Clean Mobile
    'Express Detail',
    'Quick 30-minute exterior wash and interior wipe-down',
    'detailing',
    'express',
    '["auto", "truck", "suv"]'::jsonb,
    true,
    true,
    1,
    '2025-08-31 09:15:00.000000-07',
    '2025-08-31 09:15:00.000000-07',
    '{"duration": "30 minutes", "price_range": "$30-50"}'::jsonb
),
(
    4,
    'Standard Detail',
    'Complete wash, wax, and interior cleaning',
    'detailing',
    'standard',
    '["auto", "truck", "suv"]'::jsonb,
    true,
    false,
    2,
    '2025-08-31 09:15:00.000000-07',
    '2025-08-31 09:15:00.000000-07',
    '{"duration": "2-3 hours", "price_range": "$100-150"}'::jsonb
);
