#!/usr/bin/env node

/**
 * Create main tenant for the production site
 * This script creates the default tenant that the frontend expects
 */

import { pool } from './database/pool.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createMainTenant() {
  try {
    console.log('🏢 Creating main tenant...');
    
    // Check if tenant already exists
    const existingTenant = await pool.query(
      'SELECT id, slug, business_name FROM tenants.business WHERE slug = $1',
      ['thatsmartsite-backend']
    );
    
    if (existingTenant.rows.length > 0) {
      console.log('✅ Main tenant already exists!');
      console.log(`🏢 Business: ${existingTenant.rows[0].business_name}`);
      console.log(`🔗 Slug: ${existingTenant.rows[0].slug}`);
      return;
    }
    
    // Create main tenant
    const result = await pool.query(`
      INSERT INTO tenants.business (
        slug,
        business_name,
        industry,
        business_email,
        business_phone,
        owner,
        first_name,
        last_name,
        application_status,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING id, slug, business_name, business_email, business_phone
    `, [
      'thatsmartsite-backend',           // slug
      'That Smart Site',                 // business_name
      'Website Generator',               // industry
      'admin@thatsmartsite.com',         // business_email
      '(555) 123-4580',                  // phone
      '123 Main St',                     // address
      'Your City',                       // city
      'Your State',                      // state
      '12345',                           // zip_code
      'Service Area',                    // service_area
      'https://thatsmartsite.com',       // website_url
      'active'                           // status
    ]);
    
    if (result.rows.length > 0) {
      console.log('✅ Main tenant created successfully!');
      console.log(`🆔 ID: ${result.rows[0].id}`);
      console.log(`🏢 Business: ${result.rows[0].business_name}`);
      console.log(`📧 Email: ${result.rows[0].email}`);
      console.log(`📞 Phone: ${result.rows[0].phone}`);
      console.log(`🔗 Slug: ${result.rows[0].slug}`);
    } else {
      console.error('❌ Failed to create main tenant.');
    }
    
  } catch (error) {
    console.error('❌ Error creating main tenant:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await pool.end();
  }
}

// Run the script
createMainTenant();
