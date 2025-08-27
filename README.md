# Mobile Detail Hub (MDH)

## Development Environment
- **OS**: Windows 10/11 (PowerShell environment)
- **Package Manager**: npm
- **Database**: PostgreSQL with pgAdmin
- **Node.js**: Available for backend operations

## Project Structure
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Scripts**: `backend/scripts/` for database operations

## Quick Start
```powershell
# Install dependencies
npm install

# Backend
cd backend; npm start

# Frontend  
cd frontend; npm run dev

# Database scripts
cd backend; node scripts/script-name.js
```

## Key Preferences
- Use PowerShell syntax (; not &&)
- Prefer node scripts over direct database CLI
- Keep responses concise
- Respect existing codebase modularity

## Documentation
- **Context**: `cursor-context.md` - Full development context
- **Rules**: `.cursorrules` - Cursor-specific guidelines
- **Backend Docs**: `backend/docs/` - Backend documentation
- **Scripts**: `backend/scripts/README.md` - Database scripts

## Recent Improvements
- ✅ Enhanced TypeScript strict mode
- ✅ Simplified database retry logic with Winston
- ✅ Production-ready logging system
- ✅ Comprehensive environment validation
