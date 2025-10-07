/**
 * Script to update existing affiliates with appropriate industry assignments
 * Run this after the migration to properly categorize existing tenants
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/mdh_db'
});

async function updateIndustries() {
  const client = await pool.connect();
  
  try {
    console.log('Updating industry assignments for existing businesses...');
    
    // Define industry mapping based on business names and descriptions
    const industryUpdates = [
      // Mobile Detailing businesses (most common)
      { pattern: '%mobile%', industry: 'mobile-detailing' },
      { pattern: '%detail%', industry: 'mobile-detailing' },
      { pattern: '%auto%', industry: 'mobile-detailing' },
      { pattern: '%car%', industry: 'mobile-detailing' },
      { pattern: '%ceramic%', industry: 'mobile-detailing' },
      
      // Pet Grooming businesses
      { pattern: '%pet%', industry: 'pet-grooming' },
      { pattern: '%groom%', industry: 'pet-grooming' },
      { pattern: '%dog%', industry: 'pet-grooming' },
      { pattern: '%cat%', industry: 'pet-grooming' },
      { pattern: '%paws%', industry: 'pet-grooming' },
      
      // Lawn Care businesses
      { pattern: '%lawn%', industry: 'lawncare' },
      { pattern: '%grass%', industry: 'lawncare' },
      { pattern: '%landscape%', industry: 'lawncare' },
      { pattern: '%yard%', industry: 'lawncare' },
      { pattern: '%mow%', industry: 'lawncare' },
      
      // Maid Service businesses
      { pattern: '%maid%', industry: 'maid-service' },
      { pattern: '%clean%', industry: 'maid-service' },
      { pattern: '%house%', industry: 'maid-service' },
      { pattern: '%home%', industry: 'maid-service' },
    ];
    
    // Update based on business_name
    for (const update of industryUpdates) {
      const result = await client.query(
        `UPDATE tenants.business 
         SET industry = $1 
         WHERE LOWER(business_name) LIKE LOWER($2) 
         AND industry = 'mobile-detailing'`, // Only update if still default
        [update.industry, update.pattern]
      );
      
      if (result.rowCount > 0) {
        console.log(`Updated ${result.rowCount} businesses to ${update.industry} (pattern: ${update.pattern})`);
      }
    }
    
    // Update based on notes field as well
    for (const update of industryUpdates) {
      const result = await client.query(
        `UPDATE tenants.business 
         SET industry = $1 
         WHERE LOWER(notes) LIKE LOWER($2) 
         AND industry = 'mobile-detailing'`, // Only update if still default
        [update.industry, update.pattern]
      );
      
      if (result.rowCount > 0) {
        console.log(`Updated ${result.rowCount} businesses to ${update.industry} based on notes (pattern: ${update.pattern})`);
      }
    }
    
    // Show final industry distribution
    const industryStats = await client.query(
      'SELECT industry, COUNT(*) as count FROM tenants.business GROUP BY industry ORDER BY count DESC'
    );
    
    console.log('\nFinal industry distribution:');
    industryStats.rows.forEach(row => {
      console.log(`  ${row.industry}: ${row.count} businesses`);
    });
    
    // Show any remaining unassigned (should be 0)
    const unassigned = await client.query(
      'SELECT id, slug, business_name FROM tenants.business WHERE industry IS NULL'
    );
    
    if (unassigned.rows.length > 0) {
      console.log('\n⚠️  Unassigned businesses (still need manual review):');
      unassigned.rows.forEach(row => {
        console.log(`  ID ${row.id}: ${row.slug} - "${row.business_name}"`);
      });
    } else {
      console.log('\n✅ All businesses have been assigned to industries');
    }
    
  } catch (error) {
    console.error('Error updating industries:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the update
updateIndustries()
  .then(() => {
    console.log('Industry update completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Industry update failed:', error);
    process.exit(1);
  });
