const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Database connection configuration from .env file
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mdh',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
};

// Validate required environment variables
if (!dbConfig.password) {
  console.error('❌ DB_PASSWORD is required in your .env file');
  console.log('💡 Make sure you have a .env file in your backend directory with:');
  console.log('   DB_PASSWORD=your_actual_password');
  process.exit(1);
}

async function getTableSchema(pool) {
  try {
    // Get all tables in the database
    const tablesQuery = `
      SELECT 
        t.table_name,
        t.table_type,
        obj_description(c.oid) as table_comment
      FROM information_schema.tables t
      LEFT JOIN pg_class c ON c.relname = t.table_name
      WHERE t.table_schema = 'public'
      ORDER BY t.table_name;
    `;
    
    const tablesResult = await pool.query(tablesQuery);
    
    const schema = {
      database: dbConfig.database,
      exported_at: new Date().toISOString(),
      tables: []
    };
    
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      
      // Get table columns
      const columnsQuery = `
        SELECT 
          c.column_name,
          c.data_type,
          c.character_maximum_length,
          c.is_nullable,
          c.column_default,
          c.ordinal_position,
          col_description(
            (SELECT c.oid FROM pg_class c WHERE c.relname = $1), 
            c.ordinal_position
          ) as column_comment
        FROM information_schema.columns c
        WHERE c.table_name = $1
        ORDER BY c.ordinal_position;
      `;
      
      const columnsResult = await pool.query(columnsQuery, [tableName]);
      
      // Get table constraints
      const constraintsQuery = `
        SELECT 
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name,
          rc.update_rule,
          rc.delete_rule
        FROM information_schema.table_constraints tc
        LEFT JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        LEFT JOIN information_schema.constraint_column_usage ccu 
          ON ccu.constraint_name = tc.constraint_name
        LEFT JOIN information_schema.referential_constraints rc 
          ON tc.constraint_name = rc.constraint_name
        WHERE tc.table_name = $1
        ORDER BY tc.constraint_name;
      `;
      
      const constraintsResult = await pool.query(constraintsQuery, [tableName]);
      
      // Get table indexes
      const indexesQuery = `
        SELECT 
          i.relname as index_name,
          a.attname as column_name,
          ix.indisunique as is_unique,
          ix.indisprimary as is_primary
        FROM pg_class t
        JOIN pg_index ix ON t.oid = ix.indrelid
        JOIN pg_class i ON ix.indexrelid = i.oid
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
        WHERE t.relname = $1
        ORDER BY i.relname, a.attnum;
      `;
      
      const indexesResult = await pool.query(indexesQuery, [tableName]);
      
      // Get table statistics
      const statsQuery = `
        SELECT 
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes,
          n_live_tup as live_tuples,
          n_dead_tup as dead_tuples,
          last_vacuum,
          last_autovacuum,
          last_analyze,
          last_autoanalyze
        FROM pg_stat_user_tables
        WHERE relname = $1;
      `;
      
      const statsResult = await pool.query(statsQuery, [tableName]);
      
      // Get sample data (first 3 rows)
      const sampleDataQuery = `SELECT * FROM "${tableName}" LIMIT 3;`;
      let sampleData = [];
      try {
        const sampleResult = await pool.query(sampleDataQuery);
        sampleData = sampleResult.rows;
      } catch (err) {
        // Table might be empty or have issues, continue without sample data
        sampleData = [];
      }
      
      const tableSchema = {
        table_name: tableName,
        table_type: table.table_type,
        table_comment: table.table_comment,
        columns: columnsResult.rows.map(col => ({
          name: col.column_name,
          type: col.data_type,
          max_length: col.character_maximum_length,
          nullable: col.is_nullable === 'YES',
          default_value: col.column_default,
          position: col.ordinal_position,
          comment: col.column_comment
        })),
        constraints: constraintsResult.rows.map(constraint => ({
          name: constraint.constraint_name,
          type: constraint.constraint_type,
          column: constraint.column_name,
          foreign_table: constraint.foreign_table_name,
          foreign_column: constraint.foreign_column_name,
          update_rule: constraint.update_rule,
          delete_rule: constraint.delete_rule
        })),
        indexes: indexesResult.rows.map(index => ({
          name: index.index_name,
          column: index.column_name,
          unique: index.is_unique,
          primary: index.is_primary
        })),
        statistics: statsResult.rows[0] || null,
        sample_data: sampleData,
        row_count: statsResult.rows[0]?.live_tuples || 0
      };
      
      schema.tables.push(tableSchema);
    }
    
    return schema;
    
  } catch (error) {
    console.error('Error getting table schema:', error);
    throw error;
  }
}

async function exportSchema() {
  const pool = new Pool(dbConfig);
  
  try {
    console.log('Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('Connected successfully!');
    
    console.log('Extracting schema information...');
    const schema = await getTableSchema(pool);
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '..', 'schema_export');
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }
    
    // Save as JSON
    const jsonPath = path.join(outputDir, 'database_schema.json');
    await fs.writeFile(jsonPath, JSON.stringify(schema, null, 2));
    console.log(`Schema exported to: ${jsonPath}`);
    
    // Save as formatted text
    const textPath = path.join(outputDir, 'database_schema.txt');
    let textContent = `Database Schema Export\n`;
    textContent += `Database: ${schema.database}\n`;
    textContent += `Exported: ${schema.exported_at}\n`;
    textContent += `Total Tables: ${schema.tables.length}\n\n`;
    
    schema.tables.forEach(table => {
      textContent += `=== TABLE: ${table.table_name} ===\n`;
      textContent += `Type: ${table.table_type}\n`;
      if (table.table_comment) textContent += `Comment: ${table.table_comment}\n`;
      textContent += `Row Count: ${table.row_count}\n\n`;
      
      textContent += `Columns:\n`;
      table.columns.forEach(col => {
        textContent += `  - ${col.name}: ${col.type}`;
        if (col.max_length) textContent += `(${col.max_length})`;
        textContent += ` ${col.nullable ? 'NULL' : 'NOT NULL'}`;
        if (col.default_value) textContent += ` DEFAULT ${col.default_value}`;
        if (col.comment) textContent += ` // ${col.comment}`;
        textContent += `\n`;
      });
      textContent += `\n`;
      
      if (table.constraints.length > 0) {
        textContent += `Constraints:\n`;
        table.constraints.forEach(constraint => {
          textContent += `  - ${constraint.name}: ${constraint.type}`;
          if (constraint.column) textContent += ` on ${constraint.column}`;
          if (constraint.foreign_table) {
            textContent += ` -> ${constraint.foreign_table}.${constraint.foreign_column}`;
          }
          textContent += `\n`;
        });
        textContent += `\n`;
      }
      
      if (table.indexes.length > 0) {
        textContent += `Indexes:\n`;
        table.indexes.forEach(index => {
          textContent += `  - ${index.name}: ${index.column}`;
          if (index.unique) textContent += ` (UNIQUE)`;
          if (index.primary) textContent += ` (PRIMARY)`;
          textContent += `\n`;
        });
        textContent += `\n`;
      }
      
      if (table.sample_data.length > 0) {
        textContent += `Sample Data (${table.sample_data.length} rows):\n`;
        table.sample_data.forEach((row, i) => {
          textContent += `  Row ${i + 1}: ${JSON.stringify(row)}\n`;
        });
        textContent += `\n`;
      }
      
      textContent += `\n`;
    });
    
    await fs.writeFile(textPath, textContent);
    console.log(`Schema exported to: ${textPath}`);
    
    // Summary
    console.log('\n=== EXPORT SUMMARY ===');
    console.log(`Total tables: ${schema.tables.length}`);
    schema.tables.forEach(table => {
      console.log(`- ${table.table_name}: ${table.columns.length} columns, ${table.row_count} rows`);
    });
    
  } catch (error) {
    console.error('Export failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('Database connection closed.');
  }
}

// Run the export if this script is executed directly
if (require.main === module) {
  exportSchema().catch(console.error);
}

module.exports = { exportSchema, getTableSchema };
