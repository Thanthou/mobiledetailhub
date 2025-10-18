import bcrypt from 'bcryptjs';
import { pool } from './database/pool.js';

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingUser = await pool.query('SELECT id FROM auth.users WHERE email = $1', ['admin@thatsmartsite.com']);
    
    if (existingUser.rows.length > 0) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const result = await pool.query(`
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, email, name, is_admin
    `, [
      'admin@thatsmartsite.com',
      'Brandan Coleman',
      true,
      passwordHash,
      null,
      true,
      'active'
    ]);

    console.log('✅ Admin user created successfully:', result.rows[0]);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await pool.end();
  }
}

createAdminUser();
