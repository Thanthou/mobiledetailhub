require('../backend/node_modules/dotenv').config();
const { Client } = require('../backend/node_modules/pg');
const fs = require('fs');

async function getSystemStatus() {
  const status = {
    timestamp: new Date().toISOString(),
    system: {},
    services: {},
    database: {},
    project: {},
    environment: {}
  };

  // System Information
  try {
    status.system = {
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      platform: process.platform
    };
  } catch (error) {
    status.system.error = error.message;
  }

  // Service Status (skip port checks to avoid hanging)
  status.services = {
    backend: { running: 'unknown', port: 3001 },
    frontend: { running: 'unknown', port: 3000 }
  };

  // Database Status
  let dbConnected = false;
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 3000,
    });
    
    await client.connect();
    const result = await client.query('SELECT version(), current_database(), current_user');
    dbConnected = true;
    
    status.database = {
      connected: true,
      version: result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1],
      database: result.rows[0].current_database,
      user: result.rows[0].current_user
    };
    await client.end();
  } catch (error) {
    status.database = {
      connected: false,
      error: error.message
    };
  }

  // Project Structure
  try {
    status.project = {
      backendExists: fs.existsSync('backend'),
      frontendExists: fs.existsSync('frontend'),
      packageJsonExists: fs.existsSync('package.json')
    };
  } catch (error) {
    status.project.error = error.message;
  }

  // Environment Variables Status
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'NODE_ENV'];
  status.environment = {};
  requiredEnvVars.forEach(envVar => {
    status.environment[envVar] = process.env[envVar] ? 'set' : 'missing';
  });

  // Database Schema (if connected)
  if (dbConnected) {
    try {
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 3000,
      });
      
      await client.connect();
      
      // Get schemas
      const schemas = await client.query(`
        SELECT schema_name, schema_owner
        FROM information_schema.schemata 
        WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
        ORDER BY schema_name
      `);
      
      status.database.schemas = schemas.rows.map(row => ({
        name: row.schema_name,
        owner: row.schema_owner
      }));
      
      // Get tables
      const tables = await client.query(`
        SELECT schemaname, tablename, tableowner
        FROM pg_tables 
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
        ORDER BY schemaname, tablename
      `);
      
      status.database.tables = {};
      for (const table of tables.rows) {
        try {
          const count = await client.query(`SELECT COUNT(*) as count FROM ${table.schemaname}.${table.tablename}`);
          status.database.tables[`${table.schemaname}.${table.tablename}`] = parseInt(count.rows[0].count);
        } catch (error) {
          status.database.tables[`${table.schemaname}.${table.tablename}`] = 'error';
        }
      }
      
      // Get foreign keys
      const foreignKeys = await client.query(`
        SELECT 
          tc.table_schema,
          tc.table_name,
          tc.constraint_name,
          ccu.table_schema AS foreign_table_schema,
          ccu.table_name AS foreign_table_name,
          kcu.column_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' 
          AND tc.table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
        ORDER BY tc.table_schema, tc.table_name, tc.constraint_name
      `);
      
      status.database.foreignKeys = foreignKeys.rows.map(row => ({
        from: `${row.table_schema}.${row.table_name}.${row.column_name}`,
        to: `${row.foreign_table_schema}.${row.foreign_table_name}.${row.foreign_column_name}`
      }));
      
      await client.end();
    } catch (error) {
      status.database.schemaError = error.message;
    }
  }

  return status;
}

// Run the status check and output to JSON
getSystemStatus()
  .then(status => {
    const outputPath = '../cursor-context.json';
    fs.writeFileSync(outputPath, JSON.stringify(status, null, 2));
    console.log(`✅ System status written to ${outputPath}`);
    process.exit(0);
  })
  .catch(error => {
    console.log('❌ Context script failed:', error.message);
    process.exit(1);
  });