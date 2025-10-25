import bcrypt from 'bcryptjs';
import { getPool } from '../../../backend/database/pool.js';

/**
 * Tenant Factory
 * Creates tenants exactly as they are created in the payment flow.
 * Mirrors backend/routes/payments.js POST /confirm logic.
 */

export class TenantFactory {
  
  /**
   * Create a complete tenant with user
   * Matches the exact logic from payments.js
   * @param {Object} data - Tenant data from JSON file
   * @returns {Promise<Object>} Created tenant info
   */
  static async create(data) {
    const pool = await getPool();
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      console.log(`\n🏢 Creating tenant: ${data.business_name}`);
      
      // 1. Create user record (matches payments.js lines 106-117)
      const hashedPassword = data.password 
        ? await bcrypt.hash(data.password, 10)
        : null; // Real flow uses null for password
      
      const userResult = await client.query(`
        INSERT INTO auth.users (email, name, phone, password_hash, is_admin, account_status)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          phone = EXCLUDED.phone,
          password_hash = EXCLUDED.password_hash,
          updated_at = NOW()
        RETURNING id, email, name
      `, [
        data.personal_email,
        `${data.first_name} ${data.last_name}`,
        data.personal_phone || null,
        hashedPassword,
        false,
        'active'
      ]);
      
      const user = userResult.rows[0];
      console.log(`   ✅ User created: ${user.name} (${user.email})`);
      
      // 2. Create tenant business record (matches payments.js lines 122-153)
      const tenantResult = await client.query(`
        INSERT INTO tenants.business (
          user_id, business_name, business_email, business_phone,
          first_name, last_name, personal_email, personal_phone,
          industry, application_status, application_date,
          service_areas, notes, slug,
          facebook_url, instagram_url, tiktok_url, youtube_url,
          facebook_enabled, instagram_enabled, tiktok_enabled, youtube_enabled
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        ON CONFLICT (slug) DO UPDATE SET
          user_id = EXCLUDED.user_id,
          business_name = EXCLUDED.business_name,
          business_email = EXCLUDED.business_email,
          business_phone = EXCLUDED.business_phone,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          personal_email = EXCLUDED.personal_email,
          personal_phone = EXCLUDED.personal_phone,
          facebook_url = EXCLUDED.facebook_url,
          instagram_url = EXCLUDED.instagram_url,
          tiktok_url = EXCLUDED.tiktok_url,
          youtube_url = EXCLUDED.youtube_url,
          facebook_enabled = EXCLUDED.facebook_enabled,
          instagram_enabled = EXCLUDED.instagram_enabled,
          tiktok_enabled = EXCLUDED.tiktok_enabled,
          youtube_enabled = EXCLUDED.youtube_enabled,
          updated_at = NOW()
        RETURNING id, slug, business_name
      `, [
        user.id,
        data.business_name,
        data.business_email,
        data.business_phone,
        data.first_name,
        data.last_name,
        data.personal_email,
        data.personal_phone || null,
        data.industry,
        'approved',
        new Date(),
        JSON.stringify([{
          zip: data.service_area_zip || '',
          city: data.service_area_city || '',
          state: data.service_area_state || '',
          minimum: 0,
          primary: true,
          multiplier: 1
        }]),
        `Seeded tenant for development/testing`,
        data.slug,
        data.facebook_url || null,
        data.instagram_url || null,
        data.tiktok_url || null,
        data.youtube_url || null,
        true, // facebook_enabled
        true, // instagram_enabled
        true, // tiktok_enabled
        true  // youtube_enabled
      ]);
      
      const tenant = tenantResult.rows[0];
      console.log(`   ✅ Tenant created: ${tenant.business_name} (${tenant.slug})`);
      console.log(`   🌐 URL: https://${tenant.slug}.thatsmartsite.com`);
      
      await client.query('COMMIT');
      
      return {
        tenant: tenant,
        user: user
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`   ❌ Error creating tenant: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Delete a tenant and all related data
   * @param {string} slug - Tenant slug to delete
   */
  static async delete(slug) {
    const pool = await getPool();
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get tenant info and user_id before deleting
      const tenantResult = await client.query(`
        SELECT id, business_name, user_id FROM tenants.business WHERE slug = $1
      `, [slug]);
      
      if (tenantResult.rows.length === 0) {
        console.log(`   ℹ️  Tenant not found: ${slug}`);
        await client.query('ROLLBACK');
        return;
      }
      
      const tenant = tenantResult.rows[0];
      
      // Delete tenant (CASCADE will handle related records)
      await client.query(`DELETE FROM tenants.business WHERE id = $1`, [tenant.id]);
      
      // Delete associated user if exists
      if (tenant.user_id) {
        await client.query(`DELETE FROM auth.users WHERE id = $1`, [tenant.user_id]);
      }
      
      await client.query('COMMIT');
      console.log(`   ✅ Deleted tenant: ${tenant.business_name}`);
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`   ❌ Error deleting tenant: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Check if tenant exists
   * @param {string} slug - Tenant slug
   * @returns {Promise<boolean>}
   */
  static async exists(slug) {
    const pool = await getPool();
    
    const result = await pool.query(`
      SELECT id FROM tenants.business WHERE slug = $1
    `, [slug]);
    
    return result.rows.length > 0;
  }
}

