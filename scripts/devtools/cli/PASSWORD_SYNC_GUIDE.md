# Admin Password Sync Guide

## 🚀 Quick Start

```bash
npm run password
```

That's it! This command intelligently manages your admin password.

## 🧠 What It Does

1. **Reads** your `.env` file for `ADMIN_PASSWORD`
2. **Checks** if it matches the database hash
3. **Updates** database if they don't match
4. **Creates** admin user if it doesn't exist

## 📋 Workflow

### First Time Setup

1. Set your password in `.env`:
   ```bash
   ADMIN_EMAIL=admin@thatsmartsite.com
   ADMIN_PASSWORD=YourSecurePassword123!
   ADMIN_NAME=Your Name
   ```

2. Run the sync:
   ```bash
   npm run password
   ```

3. Login with your password! ✅

### Changing Password

1. Update `.env`:
   ```bash
   ADMIN_PASSWORD=MyNewPassword456!
   ```

2. Run the sync:
   ```bash
   npm run password
   ```

3. Login with new password! ✅

## 💡 How It Works

```
┌─────────────────┐
│  .env file      │
│  ADMIN_PASSWORD │
└────────┬────────┘
         │
         ↓
    [npm run password]
         │
         ↓
┌────────▼─────────────────────────┐
│  1. Read .env password           │
│  2. Read DB hash                 │
│  3. Compare with bcrypt.compare()│
└────────┬─────────────────────────┘
         │
    ┌────▼─────┐
    │  Match?  │
    └────┬─────┘
         │
    ┌────▼──────┬──────────────┐
    │  YES      │  NO          │
    │  ✅ Done  │  🔄 Update   │
    └───────────┴──────────────┘
```

## 🎯 Benefits

- **✅ One command** - No more manual password management
- **🔒 Secure** - Uses bcrypt hashing automatically
- **🤖 Smart** - Only updates when needed
- **📝 Source of truth** - `.env` is always correct

## 🛠 Behind the Scenes

The script:
- Uses `bcrypt.compare()` to check password validity
- Hashes passwords with bcrypt (10 rounds)
- Creates admin if missing
- Never stores plain text passwords in DB

## ❓ Troubleshooting

### "ADMIN_PASSWORD not found in .env"
**Solution**: Add `ADMIN_PASSWORD=yourpassword` to your `.env` file

### "Database connection failed"
**Solution**: 
- Check `DATABASE_URL` in `.env`
- Make sure PostgreSQL is running
- Verify connection string is correct

### "Admin user not found"
**Don't worry!** The script will create it automatically.

## 📚 Related Scripts

- `scripts/devtools/cli/sync-admin-password.js` - The smart script (new! 🎉)
- `scripts/devtools/cli/create-production-admin.js` - Legacy create script
- `scripts/devtools/cli/reset-admin-password.js` - Legacy reset script

## 🔐 Security Notes

- Never commit `.env` to git (already in `.gitignore`)
- Use strong passwords in production
- Change default password immediately
- The database stores only bcrypt hashes (irreversible)

## 💻 Manual Usage

You can also run the script directly:

```bash
node scripts/devtools/cli/sync-admin-password.js
```

But `npm run password` is shorter! 😎

