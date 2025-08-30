// Load environment variables first
require('dotenv').config();

const { pool } = require('../database/pool');

async function migrateServicesToForeignKeys() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting services migration to foreign keys...');
    
    // Step 1: Add new columns
    console.log('📝 Step 1: Adding new columns to services table...');
    await client.query(`
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS vehicle_id INTEGER,
      ADD COLUMN IF NOT EXISTS service_category_id INTEGER
    `);
    
    console.log('✅ New columns added');
    
    // Step 2: Create foreign key constraints
    console.log('🔗 Step 2: Creating foreign key constraints...');
    
    // Check if constraints already exist to avoid errors
    const existingConstraints = await client.query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'services' 
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name IN ('fk_services_vehicle', 'fk_services_service_category')
    `);
    
    const existingConstraintNames = existingConstraints.rows.map(row => row.constraint_name);
    
    if (!existingConstraintNames.includes('fk_services_vehicle')) {
      await client.query(`
        ALTER TABLE services 
        ADD CONSTRAINT fk_services_vehicle 
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
      `);
      console.log('✅ Vehicle foreign key constraint created');
    } else {
      console.log('✅ Vehicle foreign key constraint already exists');
    }
    
    if (!existingConstraintNames.includes('fk_services_service_category')) {
      await client.query(`
        ALTER TABLE services 
        ADD CONSTRAINT fk_services_service_category 
        FOREIGN KEY (service_category_id) REFERENCES service_categories(id)
      `);
      console.log('✅ Service category foreign key constraint created');
    } else {
      console.log('✅ Service category foreign key constraint already exists');
    }
    
    // Step 3: Skip data migration (starting fresh)
    console.log('🔄 Step 3: Skipping data migration (starting fresh)...');
    console.log('✅ No existing services to migrate');
    
    // Step 4: Create indexes for performance
    console.log('📈 Step 4: Creating indexes for performance...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_services_affiliate_vehicle_category 
      ON services(affiliate_id, vehicle_id, service_category_id)
    `);
    
    console.log('✅ Index created');
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Test creating new services with the new foreign key structure');
    console.log('   2. Verify proper isolation by vehicle/category');
    console.log('   3. Update backend routes to use new foreign key columns');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateServicesToForeignKeys()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateServicesToForeignKeys };
