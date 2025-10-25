# Tenant Seeding System

A simple, JSON-based system for seeding demo tenants into the database.

## 📁 Structure

```
scripts/seeding/
├── README.md                    # This file
├── seed-tenants.js             # Main seeding script
├── data/                       # JSON fixture files (one per industry)
│   ├── mobile-detailing.json   # ✅ Enabled by default
│   ├── house-cleaning.json     # ⏸️  Disabled (set enabled: true to activate)
│   └── lawn-care.json          # ⏸️  Disabled
└── factories/
    └── tenantFactory.js        # Database logic for creating tenants
```

## 🚀 Quick Start

### Seed All Enabled Tenants

```bash
node scripts/seeding/seed-tenants.js
```

By default, only `mobile-detailing.json` is enabled.

### Available Options

```bash
# Seed all enabled tenants
node scripts/seeding/seed-tenants.js

# Clean existing demo tenants first, then seed
node scripts/seeding/seed-tenants.js --clean

# Force recreate existing tenants
node scripts/seeding/seed-tenants.js --force

# ONLY remove all demo tenants (no reseeding)
node scripts/seeding/seed-tenants.js --remove
```

## 📝 Adding New Industries

### 1. Create a JSON file in `data/`

```bash
# Example: data/pet-grooming.json
```

### 2. Use this simple flat structure:

```json
{
  "enabled": false,
  "slug": "demo-pet-spa",
  "industry": "pet-grooming",
  "business_name": "Pampered Paws Pet Spa",
  "business_email": "hello@pamperedpawsspa.com",
  "business_phone": "(555) 456-7890",
  "first_name": "Lisa",
  "last_name": "Chen",
  "personal_email": "lisa@pamperedpawsspa.com",
  "personal_phone": "(555) 789-0123",
  "password": "DemoPassword123!",
  "service_area_city": "Portland",
  "service_area_state": "OR",
  "service_area_zip": "97201"
}
```

**That's it!** This matches exactly what gets created during the real payment flow.

### 3. Set `"enabled": true` when ready

```json
{
  "enabled": true,
  ...
}
```

### 4. Run the seeding script

```bash
node scripts/seeding/seed-tenants.js
```

## 🎯 Use Cases

### Development
- Quick tenant data for local development
- No need to go through payment flow
- Deterministic data for testing

### Testing
- Seed before running integration tests
- Multiple industries to test tenant isolation
- Clean state for each test run

### Demos
- Pre-configured tenants for presentations
- Different subscription tiers
- Various industries

## 🔧 Configuration

### Required Fields

These match EXACTLY what's required during the real tenant signup flow:

| Field | Description | Required |
|-------|-------------|----------|
| `enabled` | Whether to seed this tenant | ✅ |
| `slug` | Subdomain (e.g., `demo-mobile-detail`) | ✅ |
| `industry` | Industry type (`mobile-detailing`, `house-cleaning`, etc.) | ✅ |
| `business_name` | Business name | ✅ |
| `business_email` | Business email | ✅ |
| `business_phone` | Business phone | ✅ |
| `first_name` | Owner first name | ✅ |
| `last_name` | Owner last name | ✅ |
| `personal_email` | Owner email (used for login) | ✅ |
| `personal_phone` | Owner phone (optional, can be null) | |
| `password` | Login password (will be hashed) | ✅ |
| `service_area_city` | Primary service area city | ✅ |
| `service_area_state` | Primary service area state | ✅ |
| `service_area_zip` | Primary service area ZIP | ✅ |

### What Gets Created

**1. User account** (`auth.users`)
- Email, name, phone, password_hash

**2. Tenant business** (`tenants.business`)
- All business info, slug, service areas (as JSONB)

**Note:** Services, subscriptions, and other data are NOT created during signup - those are added later through the admin dashboard or tenant dashboard.

## 🔐 Security Notes

- Passwords in JSON files are hashed before storing
- Demo tenants should use obvious slugs (`demo-*`)
- Don't use production data in seed files
- Add `scripts/seeding/data/*.local.json` to `.gitignore` for personal test data

## 📦 NPM Scripts (Optional)

Add these to your root `package.json`:

```json
{
  "scripts": {
    "seed": "node scripts/seeding/seed-tenants.js",
    "seed:clean": "node scripts/seeding/seed-tenants.js --clean",
    "seed:force": "node scripts/seeding/seed-tenants.js --force",
    "seed:remove": "node scripts/seeding/seed-tenants.js --remove"
  }
}
```

Then use:

```bash
npm run seed         # Seed enabled tenants
npm run seed:clean   # Delete all, then reseed enabled ones
npm run seed:force   # Force recreate existing tenants
npm run seed:remove  # ONLY delete (no reseeding)
```

## 🐛 Troubleshooting

### "Tenant already exists"

Use `--force` to recreate, or `--remove` to delete first:
```bash
node scripts/seeding/seed-tenants.js --force   # Recreate
npm run seed:remove                             # Delete all
```

### "No enabled tenants found"

Check your JSON files have `"enabled": true`:
```json
{
  "enabled": true,
  ...
}
```

### Why aren't services/subscriptions created?

This seeding script mirrors the exact tenant creation flow from `backend/routes/payments.js`. During signup, only the user account and basic tenant info are created. Services and subscriptions are added later through the dashboard.

### Database connection errors

Make sure your `.env` file has correct database credentials:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ThatSmartSite
DB_USER=postgres
DB_PASSWORD=your_password
```

## 🎨 Future Enhancements

- [ ] Support seeding from CSV for bulk tenant creation
- [ ] Interactive CLI for generating new fixture files
- [ ] Separate seeders for services, reviews, appointments (post-signup data)

