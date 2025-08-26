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

async function exportSchema() {
  const pool = new Pool(dbConfig);
  
  try {
    console.log('🔌 Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✅ Connected successfully!');
    
    console.log('📊 Extracting schema information...');
    
    // Get all tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const tablesResult = await pool.query(tablesQuery);
    console.log(`📋 Found ${tablesResult.rows.length} tables`);
    
    const schema = {
      database: dbConfig.database,
      exported_at: new Date().toISOString(),
      tables: []
    };
    
    // Process each table
    for (const tableRow of tablesResult.rows) {
      const tableName = tableRow.table_name;
      console.log(`  📝 Processing table: ${tableName}`);
      
      // Get columns
      const columnsQuery = `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position;
      `;
      
      const columnsResult = await pool.query(columnsQuery, [tableName]);
      
      // Get primary key
      const pkQuery = `
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'PRIMARY KEY' 
          AND tc.table_name = $1;
      `;
      
      const pkResult = await pool.query(pkQuery, [tableName]);
      
      // Get foreign keys
      const fkQuery = `
        SELECT 
          kcu.column_name,
          ccu.table_name AS foreign_table,
          ccu.column_name AS foreign_column
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu 
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
          AND tc.table_name = $1;
      `;
      
      const fkResult = await pool.query(fkQuery, [tableName]);
      
      // Get row count
      let rowCount = 0;
      try {
        const countResult = await pool.query(`SELECT COUNT(*) FROM "${tableName}"`);
        rowCount = parseInt(countResult.rows[0].count);
      } catch (err) {
        // Table might be empty or have issues
        rowCount = 0;
      }
      
      // Get sample data (first 2 rows)
      let sampleData = [];
      try {
        const sampleResult = await pool.query(`SELECT * FROM "${tableName}" LIMIT 2`);
        sampleData = sampleResult.rows;
      } catch (err) {
        sampleData = [];
      }
      
      const tableSchema = {
        table_name: tableName,
        columns: columnsResult.rows.map(col => ({
          name: col.column_name,
          type: col.data_type,
          nullable: col.is_nullable === 'YES',
          default_value: col.column_default,
          max_length: col.character_maximum_length
        })),
        primary_key: pkResult.rows.map(row => row.column_name),
        foreign_keys: fkResult.rows.map(fk => ({
          column: fk.column_name,
          references: `${fk.foreign_table}.${fk.foreign_column}`
        })),
        row_count: rowCount,
        sample_data: sampleData
      };
      
      schema.tables.push(tableSchema);
    }
    
    // Create output directory
    const outputDir = path.join(__dirname, '..', 'schema_export');
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }
    
    // Save JSON
    const jsonPath = path.join(outputDir, 'database_schema.json');
    await fs.writeFile(jsonPath, JSON.stringify(schema, null, 2));
    console.log(`💾 Schema saved to: ${jsonPath}`);
    
    // Save simple text version
    const textPath = path.join(outputDir, 'database_schema.txt');
    let textContent = `Database Schema: ${schema.database}\n`;
    textContent += `Exported: ${schema.exported_at}\n`;
    textContent += `Total Tables: ${schema.tables.length}\n\n`;
    
    schema.tables.forEach(table => {
      textContent += `=== ${table.table_name.toUpperCase()} ===\n`;
      textContent += `Rows: ${table.row_count}\n\n`;
      
      textContent += `Columns:\n`;
      table.columns.forEach(col => {
        textContent += `  ${col.name}: ${col.type}`;
        if (col.max_length) textContent += `(${col.max_length})`;
        textContent += ` ${col.nullable ? 'NULL' : 'NOT NULL'}`;
        if (col.default_value) textContent += ` DEFAULT ${col.default_value}`;
        textContent += `\n`;
      });
      
      if (table.primary_key.length > 0) {
        textContent += `\nPrimary Key: ${table.primary_key.join(', ')}\n`;
      }
      
      if (table.foreign_keys.length > 0) {
        textContent += `\nForeign Keys:\n`;
        table.foreign_keys.forEach(fk => {
          textContent += `  ${fk.column} -> ${fk.references}\n`;
        });
      }
      
      if (table.sample_data.length > 0) {
        textContent += `\nSample Data:\n`;
        table.sample_data.forEach((row, i) => {
          textContent += `  Row ${i + 1}: ${JSON.stringify(row)}\n`;
        });
      }
      
      textContent += `\n\n`;
    });
    
    await fs.writeFile(textPath, textContent);
    console.log(`📄 Text version saved to: ${textPath}`);
    
    // Summary
    console.log('\n🎉 EXPORT COMPLETE!');
    console.log('📊 Summary:');
    schema.tables.forEach(table => {
      console.log(`  - ${table.table_name}: ${table.columns.length} columns, ${table.row_count} rows`);
    });
    
    console.log('\n💡 You can now copy the content of database_schema.json or database_schema.txt');
    console.log('   and share it with ChatGPT to get help with your database!');
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your PostgreSQL database is running');
    } else if (error.code === '28P01') {
      console.log('\n💡 Check your database username and password in .env file');
    } else if (error.code === '3D000') {
      console.log('\n💡 Check your database name in .env file');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the export
exportSchema();
