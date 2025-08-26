# Database Scripts

This directory contains database migration and setup scripts.

## Schema Export Scripts

### Quick Schema Export (`quick_schema_export.js`)
A simple script to export your complete database schema to JSON and text files for sharing with AI assistants like ChatGPT.

**Prerequisites:**
- Make sure you have a `.env` file in your `backend/` directory with your database credentials
- Required environment variables: `DB_PASSWORD` (others have sensible defaults)

**Usage:**
```bash
cd backend/scripts
node quick_schema_export.js
```

**What it exports:**
- Table structure (columns, types, constraints)
- Primary and foreign keys
- Row counts
- Sample data (first 2 rows from each table)

**Output:**
- `../schema_export/database_schema.json` - JSON format
- `../schema_export/database_schema.txt` - Human-readable format

### Full Schema Export (`export_schema.js`)
A comprehensive schema export script with detailed information about indexes, constraints, and statistics.

**Prerequisites:**
- Make sure you have a `.env` file in your `backend/` directory with your database credentials
- Required environment variables: `DB_PASSWORD` (others have sensible defaults)

**Usage:**
```bash
cd backend/scripts
node export_schema.js
```

**Features:**
- Environment variable support
- Detailed constraint information
- Index details
- Table statistics
- Column comments

See `README_SCHEMA_EXPORT.md` for detailed documentation.

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
