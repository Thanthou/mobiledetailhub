// Load environment variables first
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'MobileDetailHub'}`,
});

async function verifySetup() {
  try {
    console.log('🔍 Verifying Affiliate Trigger Setup...\n');
    
    // 1. Check if trigger function exists
    console.log('1️⃣ Checking trigger function...');
    const functionResult = await pool.query(`
      SELECT routine_name, routine_type 
      FROM information_schema.routines 
      WHERE routine_name = 'trg_affiliate_approved_seed_area'
    `);
    
    if (functionResult.rows.length > 0) {
      console.log('✅ Trigger function exists');
    } else {
      console.log('❌ Trigger function not found');
    }
    
    // 2. Check if trigger exists
    console.log('\n2️⃣ Checking trigger...');
    const triggerResult = await pool.query(`
      SELECT trigger_name, event_manipulation, action_timing 
      FROM information_schema.triggers 
      WHERE trigger_name = 'on_affiliate_approved_seed_area'
    `);
    
    if (triggerResult.rows.length > 0) {
      console.log('✅ Trigger exists');
      console.log(`   Event: ${triggerResult.rows[0].event_manipulation}`);
      console.log(`   Timing: ${triggerResult.rows[0].action_timing}`);
    } else {
      console.log('❌ Trigger not found');
    }
    
    // 3. Check affiliate_service_areas table
    console.log('\n3️⃣ Checking affiliate_service_areas...');
    const serviceAreasResult = await pool.query(`
      SELECT COUNT(*) as total_rows 
      FROM affiliate_service_areas
    `);
    
    console.log(`   Total service areas: ${serviceAreasResult.rows[0].total_rows}`);
    
    if (serviceAreasResult.rows[0].total_rows > 0) {
      const sampleResult = await pool.query(`
        SELECT asa.*, a.business_name 
        FROM affiliate_service_areas asa
        JOIN affiliates a ON a.id = asa.affiliate_id
        LIMIT 3
      `);
      
      console.log('   Sample data:');
      sampleResult.rows.forEach((row, i) => {
        console.log(`     ${i + 1}. ${row.business_name} - ${row.city}, ${row.state} (ZIP: ${row.zip || 'entire city'})`);
      });
    }
    
    // 4. Check affiliates table
    console.log('\n4️⃣ Checking affiliates...');
    const affiliatesResult = await pool.query(`
      SELECT application_status, COUNT(*) as count
      FROM affiliates 
      GROUP BY application_status
    `);
    
    console.log('   Affiliate status counts:');
    affiliatesResult.rows.forEach(row => {
      console.log(`     ${row.application_status}: ${row.count}`);
    });
    
    // 5. Test the trigger function manually
    console.log('\n5️⃣ Testing trigger function...');
    try {
      const testResult = await pool.query(`
        SELECT trg_affiliate_approved_seed_area()
      `);
      console.log('✅ Trigger function can be called');
    } catch (error) {
      console.log(`⚠️  Trigger function test: ${error.message}`);
    }
    
    console.log('\n🎯 Verification complete!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    await pool.end();
  }
}

verifySetup();
