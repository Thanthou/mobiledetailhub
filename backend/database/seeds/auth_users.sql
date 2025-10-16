-- Initial user data seeds for authentication system
-- These are the default users that should exist in the system

-- Insert admin user
INSERT INTO auth.users (
    email, 
    name, 
    is_admin, 
    password_hash, 
    phone, 
    email_verified,
    account_status,
    created_at,
    updated_at
) VALUES (
    'admin@thatsmartsite.com',
    'Brandan Coleman',
    true,
    '$2a$10$EAY3D9OdVXpYgby.ATOmheJwqrlTZ423Yg2a.qLzN1Ku1/oj2/LzS',
    null,
    true,
    'active',
    '2025-08-28 14:07:23.320768-07',
    '2025-08-28 14:07:23.320768-07'
) ON CONFLICT (email) DO NOTHING;

-- Insert affiliate user
INSERT INTO auth.users (
    email, 
    name, 
    is_admin, 
    password_hash, 
    phone, 
    email_verified,
    account_status,
    created_at,
    updated_at
) VALUES (
    'jessbrister27@gmail.com',
    'Jess Brister',
    false,
    '$2a$10$0Or.7yyweIikMQYPDF3fN.7EHO8Pd5B3.o4bsffWedlr7CzDQ0kqC',
    '7024203151',
    true,
    'active',
    '2025-08-28 18:45:00.933574-07',
    '2025-08-28 18:45:00.933574-07'
) ON CONFLICT (email) DO NOTHING;

-- Insert development user (if in development environment)
INSERT INTO auth.users (
    email, 
    name, 
    is_admin, 
    password_hash, 
    phone, 
    email_verified,
    account_status,
    created_at,
    updated_at
) VALUES (
    'dev@thatsmartsite.com',
    'Development User',
    true,
    '$2a$10$dev.hash.for.development.only',
    '5551234567',
    true,
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;
