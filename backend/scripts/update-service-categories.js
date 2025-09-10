const { pool } = require('../database/pool');
const fs = require('fs');
const path = require('path');

async function updateServiceCategories() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting service category migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../database/migrations/update_service_categories.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await client.query(migrationSQL);
    
    console.log('✅ Service category migration completed successfully!');
    
    // Show the results
    const result = await client.query(`
      SELECT 
        service_category,
        COUNT(*) as count
      FROM affiliates.services 
      GROUP BY service_category 
      ORDER BY service_category
    `);
    
    console.log('\n📊 Updated service categories:');
    result.rows.forEach(row => {
      console.log(`  ${row.service_category}: ${row.count} services`);
    });
    
  } catch (error) {
    console.error('❌ Error updating service categories:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
updateServiceCategories()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
