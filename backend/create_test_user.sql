-- Create a test user for login testing
-- This creates a user with email: test@example.com and password: password123

-- First, make sure the users table exists and has the required columns
DO $$
BEGIN
  -- Create users table if it doesn't exist
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    is_admin BOOLEAN DEFAULT FALSE,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
  
  -- Add missing columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_admin') THEN
    ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';
  END IF;
END $$;

-- Create a test user (password: password123)
-- Note: This password hash was generated using bcrypt with salt rounds 10
INSERT INTO users (email, password_hash, name, phone, is_admin, role) 
VALUES (
  'test@example.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password123
  'Test User',
  '+1-555-123-4567',
  true,
  'admin'
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  is_admin = EXCLUDED.is_admin,
  role = EXCLUDED.role;

-- Verify the user was created
SELECT id, email, name, phone, is_admin, role, created_at FROM users WHERE email = 'test@example.com';
