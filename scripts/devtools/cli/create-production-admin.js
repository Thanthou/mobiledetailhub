#!/usr/bin/env node

/**
 * Create admin user for production database
 * This script connects to the production database and creates the admin user
 */

import bcrypt from 'bcryptjs';
import { pool } from './database/pool.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createProductionAdmin() {
  try {
    console.log('🔑 Creating production admin user...');
    
    // Get admin credentials from environment or use defaults
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;
    
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`👤 Name: ${adminName}`);
    console.log(`🔑 Password: ${adminPassword}`);
    
    // Check if admin already exists
    const existingAdmin = await pool.query(
      'SELECT id, email FROM auth.users WHERE email = $1',
      [adminEmail]
    );
    
    if (existingAdmin.rows.length > 0) {
      console.log('✅ Admin user already exists!');
      console.log(`📧 Email: ${existingAdmin.rows[0].email}`);
      console.log('💡 To reset password, run: node reset-admin-password.js');
      return;
    }
    
    // Hash the password
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    
    // Create admin user
    const result = await pool.query(`
      INSERT INTO auth.users (
        email, 
        email_verified, 
        name, 
        password_hash, 
        is_admin, 
        account_status,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, email, name, is_admin
    `, [
      adminEmail,
      true, // email_verified
      adminName,
      passwordHash,
      true, // is_admin
      'active' // account_status
    ]);
    
    if (result.rows.length > 0) {
      console.log('✅ Production admin user created successfully!');
      console.log(`🆔 ID: ${result.rows[0].id}`);
      console.log(`📧 Email: ${result.rows[0].email}`);
      console.log(`👤 Name: ${result.rows[0].name}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log(`🔐 Hash: ${passwordHash}`);
    } else {
      console.error('❌ Failed to create admin user.');
    }
    
  } catch (error) {
    console.error('❌ Error creating production admin:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await pool.end();
  }
}

// Run the script
createProductionAdmin();
