import bcrypt from 'bcryptjs';
import { pool } from './database/pool.js';

async function resetAdminPassword() {
  try {
    // Hash the new password
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    // Update the admin user's password
    const result = await pool.query(`
      UPDATE auth.users 
      SET password_hash = $1, updated_at = NOW()
      WHERE email = 'admin@thatsmartsite.com'
      RETURNING id, email, name, is_admin
    `, [passwordHash]);

    if (result.rows.length > 0) {
      console.log('✅ Admin password reset successfully:', result.rows[0]);
      console.log('📧 Email: admin@thatsmartsite.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Error resetting admin password:', error.message);
  } finally {
    await pool.end();
  }
}

resetAdminPassword();
