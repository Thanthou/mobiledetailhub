import bcrypt from 'bcryptjs';
import { pool } from './database/pool.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function resetAdminPassword() {
  try {
    // Get the new password from command line, .env, or use default
    const newPassword = process.argv[2] || process.env.ADMIN_PASSWORD;
    
    console.log(`🔑 Resetting admin password to: ${newPassword}`);
    console.log('💡 Usage: node reset-admin-password.js [new-password]');
    console.log('💡 Example: node reset-admin-password.js mynewpassword123');
    console.log('💡 Or set ADMIN_PASSWORD in .env file');
    
    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    // Update the admin user's password
    const result = await pool.query(`
      UPDATE auth.users 
      SET password_hash = $1, updated_at = NOW()
      WHERE email = 'admin@thatsmartsite.com'
      RETURNING id, email, name, is_admin
    `, [passwordHash]);

    if (result.rows.length > 0) {
      console.log('✅ Admin password reset successfully!');
      console.log('📧 Email: admin@thatsmartsite.com');
      console.log(`🔑 Password: ${newPassword}`);
      console.log('🔐 Hash:', passwordHash);
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
