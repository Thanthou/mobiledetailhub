import { getPool } from './backend/database/pool.js';

const pool = await getPool();
// Set schema first
await pool.query('SET search_path TO tenants, public');

const result = await pool.query(`
  SELECT slug, business_name, industry 
  FROM business 
  WHERE industry = 'maid-service' OR slug LIKE '%maid%'
`);

console.log(JSON.stringify(result.rows, null, 2));

