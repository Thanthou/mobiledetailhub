# Database Scripts

This directory contains database migration and setup scripts.

## Affiliates Table Migration

### Running the Migration

1. **Connect to your PostgreSQL database:**
   ```bash
   psql -U your_username -d MobileDetailHub
   ```

2. **Run the migration:**
   ```sql
   \i scripts/create_affiliates_table.sql
   ```

   Or copy and paste the contents of `create_affiliates_table.sql` directly into your psql session.

### What the Migration Does

- Drops any existing `affiliates` table
- Creates a new `affiliates` table with all necessary columns
- Sets up proper indexes for performance
- Creates a trigger to automatically update `updated_at` timestamps
- Adds helpful comments to the table and columns

### Table Structure

The table includes:
- **Basic Info**: slug, business_name, owner, phone, email
- **Location**: base_location (JSONB with city, state, zip)
- **Services**: services (JSONB with boolean flags for each service type)
- **Social Media**: URLs for various platforms
- **Status**: application_status (pending, active, rejected, inactive)
- **Business Details**: insurance info, source, notes
- **Performance**: ratings, job counts, timestamps

### After Migration

Once the table is created, the affiliate application form will be able to:
1. Submit applications to `/api/affiliates/apply`
2. Store all form data in the database
3. Generate unique slugs for each business
4. Track application status

### Testing

You can test the endpoint by:
1. Starting your backend server
2. Filling out the affiliate application form
3. Submitting the form
4. Checking the database for the new record
