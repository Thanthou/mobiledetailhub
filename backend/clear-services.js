const { pool } = require('./database/pool');

async function clearServices() {
  try {
    console.log('🧹 Clearing services data...\n');
    
    // First, let's see what we have
    const servicesCount = await pool.query('SELECT COUNT(*) as count FROM affiliates.services');
    const tiersCount = await pool.query('SELECT COUNT(*) as count FROM affiliates.service_tiers');
    
    console.log(`📊 Current data:`);
    console.log(`   • Services: ${servicesCount.rows[0].count}`);
    console.log(`   • Service Tiers: ${tiersCount.rows[0].count}`);
    
    if (servicesCount.rows[0].count > 0) {
      console.log('\n🗑️  Clearing service_tiers first (due to foreign key constraint)...');
      await pool.query('DELETE FROM affiliates.service_tiers');
      
      console.log('🗑️  Clearing services...');
      await pool.query('DELETE FROM affiliates.services');
      
      console.log('✅ Services data cleared successfully!');
      
      // Verify it's empty
      const newServicesCount = await pool.query('SELECT COUNT(*) as count FROM affiliates.services');
      const newTiersCount = await pool.query('SELECT COUNT(*) as count FROM affiliates.service_tiers');
      
      console.log(`\n📊 After clearing:`);
      console.log(`   • Services: ${newServicesCount.rows[0].count}`);
      console.log(`   • Service Tiers: ${newTiersCount.rows[0].count}`);
      
      console.log('\n🎉 Ready to start fresh! You can now create services through the UI.');
    } else {
      console.log('ℹ️  Services table is already empty.');
    }
    
  } catch (error) {
    console.error('❌ Error clearing services:', error.message);
  } finally {
    await pool.end();
  }
}

clearServices();
