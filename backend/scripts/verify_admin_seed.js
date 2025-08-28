require('dotenv').config();
const { pool } = require('../database/pool');
const logger = require('../utils/logger');

/**
 * Verify Admin Seed Script
 * 
 * This script checks if admin users are properly seeded and have the correct permissions.
 * It also creates admin users if they don't exist based on ADMIN_EMAILS environment variable.
 */

async function verifyAdminSeed() {
  try {
    if (!pool) {
      logger.error('❌ Database connection not available');
      process.exit(1);
    }

    logger.info('🔍 Verifying admin user seeding...');

    // Check if users table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      logger.error('❌ Users table does not exist');
      process.exit(1);
    }

    // Check if refresh_tokens table exists
    const refreshTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'refresh_tokens'
      );
    `);

    if (!refreshTableCheck.rows[0].exists) {
      logger.warn('⚠️  Refresh tokens table does not exist - creating it...');
      
      // Create refresh_tokens table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          token_hash VARCHAR(255) NOT NULL UNIQUE,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          is_revoked BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          revoked_at TIMESTAMP WITH TIME ZONE,
          ip_address INET,
          user_agent TEXT,
          device_id VARCHAR(255),
          
          CONSTRAINT fk_refresh_tokens_user_id 
            FOREIGN KEY (user_id) 
            REFERENCES users(id) 
            ON DELETE CASCADE,
          
          CONSTRAINT idx_refresh_tokens_user_id 
            UNIQUE (user_id, device_id),
          CONSTRAINT idx_refresh_tokens_token_hash 
            UNIQUE (token_hash)
        );
      `);

      // Create indexes
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id_expires 
          ON refresh_tokens(user_id, expires_at);
        
        CREATE INDEX IF NOT EXISTS idx_refresh_tokens_revoked_expires 
          ON refresh_tokens(is_revoked, expires_at);
      `);

      logger.info('✅ Refresh tokens table created successfully');
    }

    // Get admin emails from environment
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').filter(email => email.trim()) || [];
    
    if (adminEmails.length === 0) {
      logger.warn('⚠️  No ADMIN_EMAILS configured in environment');
      logger.info('💡 Set ADMIN_EMAILS=email1@example.com,email2@example.com in your .env file');
    }

    // Check existing admin users
    const existingAdmins = await pool.query(`
      SELECT id, email, name, is_admin, role, created_at 
      FROM users 
      WHERE is_admin = TRUE 
      ORDER BY created_at
    `);

    logger.info(`📊 Found ${existingAdmins.rows.length} existing admin users`);

    if (existingAdmins.rows.length > 0) {
      existingAdmins.rows.forEach((admin, index) => {
        logger.info(`   ${index + 1}. ${admin.email} (${admin.name}) - Role: ${admin.role}`);
      });
    }

    // Check if any admin emails from environment need to be created/promoted
    if (adminEmails.length > 0) {
      logger.info(`🔧 Processing ${adminEmails.length} admin emails from environment...`);
      
      for (const email of adminEmails) {
        const trimmedEmail = email.trim();
        
        // Check if user exists
        const userCheck = await pool.query('SELECT id, email, is_admin, role FROM users WHERE email = $1', [trimmedEmail]);
        
        if (userCheck.rows.length === 0) {
          // Create admin user
          const bcrypt = require('bcryptjs');
          const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
          const passwordHash = await bcrypt.hash(adminPassword, 10);
          
          const result = await pool.query(`
            INSERT INTO users (email, name, role, is_admin, password_hash, created_at) 
            VALUES ($1, $2, $3, TRUE, $4, NOW()) 
            RETURNING id, email, name, is_admin, role
          `, [trimmedEmail, 'Admin User', 'admin', passwordHash]);
          
          logger.info(`✅ Created admin user: ${trimmedEmail} (ID: ${result.rows[0].id})`);
          logger.info(`   Default password: ${adminPassword} (change this immediately!)`);
        } else {
          const user = userCheck.rows[0];
          
          if (!user.is_admin) {
            // Promote user to admin
            await pool.query(`
              UPDATE users 
              SET is_admin = TRUE, role = 'admin', updated_at = NOW() 
              WHERE id = $1
            `, [user.id]);
            
            logger.info(`✅ Promoted user to admin: ${trimmedEmail} (ID: ${user.id})`);
          } else {
            logger.info(`ℹ️  User already admin: ${trimmedEmail} (ID: ${user.id})`);
          }
        }
      }
    }

    // Final verification
    const finalAdminCheck = await pool.query(`
      SELECT COUNT(*) as admin_count, COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_role_count
      FROM users 
      WHERE is_admin = TRUE
    `);

    const adminCount = parseInt(finalAdminCheck.rows[0].admin_count);
    const adminRoleCount = parseInt(finalAdminCheck.rows[0].admin_role_count);

    logger.info(`📊 Final admin status:`);
    logger.info(`   Total admin users: ${adminCount}`);
    logger.info(`   Users with admin role: ${adminRoleCount}`);

    if (adminCount === 0) {
      logger.error('❌ No admin users found! This will prevent admin access.');
      logger.info('💡 Ensure ADMIN_EMAILS is set in your .env file');
      process.exit(1);
    }

    if (adminCount !== adminRoleCount) {
      logger.warn('⚠️  Some admin users may not have the correct role');
    }

    logger.info('✅ Admin seed verification completed successfully');
    
    // Test admin login capability
    logger.info('🧪 Testing admin login capability...');
    
    const testAdmin = await pool.query(`
      SELECT id, email, is_admin, role 
      FROM users 
      WHERE is_admin = TRUE 
      LIMIT 1
    `);

    if (testAdmin.rows.length > 0) {
      const admin = testAdmin.rows[0];
      logger.info(`✅ Admin login test: ${admin.email} (ID: ${admin.id}) can log in`);
      logger.info(`   is_admin: ${admin.is_admin}, role: ${admin.role}`);
    }

  } catch (error) {
    logger.error('❌ Error during admin seed verification:', { error: error.message });
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Run the verification
if (require.main === module) {
  verifyAdminSeed();
}

module.exports = { verifyAdminSeed };
