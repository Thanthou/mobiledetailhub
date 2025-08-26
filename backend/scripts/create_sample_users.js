const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Database connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mdh_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
});

// Sample users data
const sampleUsers = [
  {
    email: 'admin@mdh.com',
    password: 'admin123',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin',
    phone: '555-0001',
    is_active: true
  },
  {
    email: 'affiliate@mdh.com',
    password: 'affiliate123',
    first_name: 'John',
    last_name: 'Affiliate',
    role: 'affiliate',
    phone: '555-0002',
    is_active: true
  },
  {
    email: 'customer@mdh.com',
    password: 'customer123',
    first_name: 'Jane',
    last_name: 'Customer',
    role: 'customer',
    phone: '555-0003',
    is_active: true
  },
  {
    email: 'test@mdh.com',
    password: 'test123',
    first_name: 'Test',
    last_name: 'User',
    role: 'customer',
    phone: '555-0004',
    is_active: true
  }
];

async function createSampleUsers() {
  try {
    console.log('Starting sample users creation...');
    
    // Check if users table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Users table does not exist. Please run schema initialization first.');
      return;
    }
    
    // Check if users already exist
    const existingUsers = await pool.query('SELECT COUNT(*) FROM users');
    if (existingUsers.rows[0].count > 0) {
      console.log('Users already exist in the database. Skipping sample user creation.');
      return;
    }
    
    // Create sample users
    for (const user of sampleUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      const result = await pool.query(`
        INSERT INTO users (email, password_hash, first_name, last_name, role, phone, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id, email, first_name, last_name, role
      `, [
        user.email,
        hashedPassword,
        user.first_name,
        user.last_name,
        user.role,
        user.phone,
        user.is_active
      ]);
      
      console.log(`Created user: ${result.rows[0].email} (${result.rows[0].role})`);
    }
    
    console.log('Sample users created successfully!');
    console.log('\nLogin credentials:');
    sampleUsers.forEach(user => {
      console.log(`${user.role}: ${user.email} / ${user.password}`);
    });
    
  } catch (error) {
    console.error('Error creating sample users:', error);
  } finally {
    await pool.end();
  }
}

// Run the script if called directly
if (require.main === module) {
  createSampleUsers();
}

module.exports = { createSampleUsers };
