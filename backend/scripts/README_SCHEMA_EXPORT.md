# Database Schema Export Script

This script exports your complete database schema to JSON and text files for easy sharing with AI assistants like ChatGPT.

## What it exports:

- **Table structure**: All tables, columns, data types, constraints
- **Relationships**: Foreign keys, references, constraints
- **Indexes**: Primary keys, unique constraints, indexes
- **Sample data**: First 3 rows from each table
- **Statistics**: Row counts, table metadata
- **Comments**: Table and column descriptions if available

## Usage:

### 1. Set up your .env file:
Create or update your `.env` file in the `backend/` directory with your database credentials:

```bash
# backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mdh
DB_USER=postgres
DB_PASSWORD=your_actual_password
```

**Note:** Only `DB_PASSWORD` is required. The other variables have sensible defaults.

### 2. Run the script:
```bash
cd backend/scripts
node export_schema.js
```

### 3. Check the output:
The script creates a `schema_export` folder in the backend directory with:
- `database_schema.json` - Complete schema in JSON format
- `database_schema.txt` - Human-readable text format

## Output files:

### JSON format (`database_schema.json`):
Perfect for programmatic use or sharing with ChatGPT. Contains structured data about:
- Database name and export timestamp
- Complete table definitions
- Column details with types and constraints
- Foreign key relationships
- Index information
- Sample data

### Text format (`database_schema.txt`):
Human-readable format showing:
- Table summaries
- Column definitions
- Constraint details
- Sample data previews

## Example output structure:

```json
{
  "database": "mdh",
  "exported_at": "2024-01-15T10:30:00.000Z",
  "tables": [
    {
      "table_name": "affiliates",
      "table_type": "BASE TABLE",
      "columns": [
        {
          "name": "id",
          "type": "integer",
          "nullable": false,
          "default_value": "nextval('affiliates_id_seq'::regclass)"
        }
      ],
      "constraints": [
        {
          "name": "affiliates_pkey",
          "type": "PRIMARY KEY",
          "column": "id"
        }
      ],
      "row_count": 25
    }
  ]
}
```

## Troubleshooting:

1. **Connection issues**: Check your database credentials in `.env` file and ensure the database is running
2. **Permission errors**: Ensure your database user has SELECT privileges on information_schema
3. **Empty output**: Check if your database has tables in the 'public' schema
4. **Missing .env file**: Make sure you have a `.env` file in your `backend/` directory
5. **Missing DB_PASSWORD**: The password is required in your `.env` file

## Dependencies:

The scripts require the `dotenv` package to read environment variables from the `.env` file. If you don't have it installed, run:

```bash
cd backend
npm install dotenv
```

## Sharing with ChatGPT:

1. Run the script to generate the schema files
2. Copy the content of `database_schema.json` or `database_schema.txt`
3. Paste it into ChatGPT with a prompt like:
   - "Here's my database schema. Can you help me understand the structure?"
   - "Based on this schema, how should I design a query for..."
   - "What indexes should I add to optimize performance?"

## Security note:

The script only reads schema information and sample data. It doesn't modify your database. However, be careful when sharing sample data as it may contain sensitive information.
