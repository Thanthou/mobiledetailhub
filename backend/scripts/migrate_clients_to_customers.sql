-- Migration script: Update foreign key references from clients to customers
-- Run this after ensuring the customers table exists and has the same structure

-- Step 1: Drop existing foreign key constraints
ALTER TABLE quotes DROP CONSTRAINT IF EXISTS quotes_customer_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_customer_id_fkey;

-- Step 2: Add new foreign key constraints pointing to customers table
ALTER TABLE quotes ADD CONSTRAINT quotes_customer_id_fkey 
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

ALTER TABLE bookings ADD CONSTRAINT bookings_customer_id_fkey 
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

-- Step 3: Drop the clients table (only if you're sure no other references exist)
-- DROP TABLE IF EXISTS clients CASCADE;
