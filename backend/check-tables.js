const { pool } = require('./database/pool');

async function checkTables() {
  try {
    console.log('🔍 Checking for content tables...');
    
    // Check for content table in different schemas
    const queries = [
      'SELECT * FROM content WHERE tenant_slug = $1',
      'SELECT * FROM website.content WHERE tenant_slug = $1', 
      'SELECT * FROM public.content WHERE tenant_slug = $1',
      'SELECT * FROM tenants.website_content WHERE tenant_id = (SELECT id FROM tenants.business WHERE slug = $1)'
    ];
    
    for (let i = 0; i < queries.length; i++) {
      try {
        console.log(`\n🔍 Trying query ${i + 1}: ${queries[i]}`);
        const result = await pool.query(queries[i], ['jps']);
        console.log(`✅ Query ${i + 1} worked! Found ${result.rows.length} rows`);
        if (result.rows.length > 0) {
          console.log('📋 Data:', result.rows[0]);
        }
      } catch (err) {
        console.log(`❌ Query ${i + 1} failed: ${err.message}`);
      }
    }
    
    // Also check what tables exist
    console.log('\n🔍 Checking what tables exist...');
    const tablesResult = await pool.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE '%content%' 
      ORDER BY table_schema, table_name
    `);
    console.log('📋 Tables with "content" in name:', tablesResult.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkTables();
