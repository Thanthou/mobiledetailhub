const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function cleanupClientsTable() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'MobileDetailHub',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('Starting cleanup: Removing old clients table...');
    
    // Drop the clients table
    await pool.query('DROP TABLE IF EXISTS clients CASCADE');
    
    console.log('✅ Clients table dropped successfully!');
    
    // Verify the table was dropped
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'clients'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('✅ Verification: clients table no longer exists');
    } else {
      console.log('⚠️  Warning: clients table still exists');
    }
    
    // Final verification of foreign key constraints
    console.log('\nFinal verification of foreign key constraints:');
    const constraintsCheck = await pool.query(`
      SELECT 
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name IN ('quotes', 'bookings')
        AND kcu.column_name = 'customer_id'
      ORDER BY tc.table_name, kcu.column_name;
    `);
    
    constraintsCheck.rows.forEach(row => {
      console.log(`  ${row.table_name}.${row.column_name} → ${row.foreign_table_name}.${row.foreign_column_name}`);
    });
    
    console.log('\n🎉 Migration and cleanup completed successfully!');
    console.log('Your application is now fully migrated from clients to customers table.');
    
  } catch (err) {
    console.error('❌ Cleanup failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

cleanupClientsTable();
