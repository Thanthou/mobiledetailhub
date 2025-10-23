#!/usr/bin/env node

/**
 * Smart Admin Password Sync
 * 
 * Compares .env ADMIN_PASSWORD with database hash.
 * If they don't match, updates the database to match .env.
 * 
 * Usage: npm run password
 */

import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPool } from '../../../backend/database/pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function syncAdminPassword() {
  let pool;
  
  try {
    console.log('🔍 Checking admin password sync...\n');
    
    // 1. Get password from .env
    const envPassword = process.env.ADMIN_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@thatsmartsite.com';
    
    if (!envPassword) {
      console.error('❌ ADMIN_PASSWORD not found in .env file');
      console.log('💡 Add ADMIN_PASSWORD to your .env file');
      process.exit(1);
    }
    
    console.log(`📧 Admin Email: ${adminEmail}`);
    console.log(`🔑 .env Password: ${envPassword.substring(0, 3)}${'*'.repeat(envPassword.length - 3)}`);
    
    // 2. Get current hash from database
    pool = await getPool();
    const result = await pool.query(
      'SELECT id, email, password_hash FROM auth.users WHERE email = $1',
      [adminEmail]
    );
    
    if (result.rows.length === 0) {
      console.log('\n⚠️  Admin user not found in database');
      console.log('💡 Creating admin user...\n');
      
      const passwordHash = await bcrypt.hash(envPassword, 10);
      const adminName = process.env.ADMIN_NAME || 'Admin';
      
      const createResult = await pool.query(`
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
        true,
        adminName,
        passwordHash,
        true,
        'active'
      ]);
      
      console.log('✅ Admin user created successfully!');
      console.log(`🆔 ID: ${createResult.rows[0].id}`);
      console.log(`📧 Email: ${createResult.rows[0].email}`);
      console.log(`👤 Name: ${createResult.rows[0].name}`);
      console.log(`🔑 Password: ${envPassword}`);
      return;
    }
    
    const currentHash = result.rows[0].password_hash;
    
    // 3. Compare .env password with database hash
    const passwordsMatch = await bcrypt.compare(envPassword, currentHash);
    
    if (passwordsMatch) {
      console.log('\n✅ Password is already in sync!');
      console.log('💚 .env password matches database hash');
      console.log('🎉 No action needed');
      return;
    }
    
    // 4. Passwords don't match - update database
    console.log('\n⚠️  Password mismatch detected');
    console.log('🔄 Updating database to match .env...\n');
    
    const newHash = await bcrypt.hash(envPassword, 10);
    
    await pool.query(
      `UPDATE auth.users 
       SET password_hash = $1, updated_at = NOW()
       WHERE email = $2`,
      [newHash, adminEmail]
    );
    
    console.log('✅ Password updated successfully!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${envPassword}`);
    console.log('🔐 New hash stored in database');
    console.log('\n💡 You can now login with the password from your .env file');
    
  } catch (error) {
    console.error('\n❌ Error syncing admin password:', error.message);
    
    if (error.message.includes('connect')) {
      console.log('\n💡 Database connection failed. Is your database running?');
      console.log('💡 Check your DATABASE_URL in .env');
    }
    
    process.exit(1);
  }
}

// Run the script
syncAdminPassword()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

