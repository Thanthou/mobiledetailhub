# Mobile Detail Hub - Codebase Overview

Generated on: 2025-08-22T20:59:13.852Z

## 🏗️ Project Overview
- **Name**: mobiledetailhub
- **Version**: 1.0.0
- **Description**: Mobile Detail Hub - Multi-business detailing services platform

## 🚀 Tech Stack

### Frontend
- **framework**: React 18.3.1
- **language**: TypeScript 5.5.3
- **buildTool**: Vite 5.4.2
- **styling**: Tailwind CSS 3.4.1
- **routing**: React Router DOM 7.7.1
- **icons**: Lucide React 0.344.0
- **bundler**: Vite with PostCSS and Autoprefixer

### Backend
- **runtime**: Node.js
- **framework**: Express 5.1.0
- **database**: PostgreSQL with pg driver
- **authentication**: JWT + bcryptjs
- **security**: Helmet 8.1.0
- **cors**: CORS enabled

### Development
- **packageManager**: npm with workspaces
- **linting**: ESLint 9.9.1
- **hotReload**: Nodemon for backend, Vite for frontend
- **concurrent**: Concurrently for running both services

## 📊 Statistics
- **Total Components**: 109
- **Total Pages**: 61
- **Database Tables**: 6
- **Database Migrations**: 2
- **Architecture**: Monorepo with React frontend and Express backend

## 🔑 Key Features
- Multi-business platform (JPS, ABC, MDH)
- Affiliate management system
- Client booking and dashboard
- Admin dashboard
- Service area management
- Vehicle data integration
- Google Maps integration
- Responsive design with Tailwind CSS

## 📁 Component Structure
- DevModeDropdown.tsx (2429 bytes)
- HomePage.tsx (1793 bytes)


## 📄 Page Structure


## 🗄️ Database & Backend
- **Models**: 0 files
- **Routes**: 7 files

### Database Schemas
#### Tables
- **users**
  - password_hash: VARCHAR(255) NOT NULL
  - name: VARCHAR(255) NOT NULL
  - phone: VARCHAR(50), NULL
  - is_admin: BOOLEAN NULL (has default)
  - role: VARCHAR(50) NULL (has default)
  - created_at: TIMESTAMP NULL (has default)
  - updated_at: TIMESTAMP NULL (has default)
  - Constraints: id SERIAL PRIMARY KEY,, email VARCHAR(255) UNIQUE NOT NULL,

- **mdh_config**
  - email: VARCHAR(255), NULL
  - phone: VARCHAR(50), NULL
  - sms_phone: VARCHAR(50), NULL
  - logo_url: TEXT, NULL
  - favicon_url: TEXT, NULL
  - header_display: VARCHAR(255) NULL (has default)
  - facebook: VARCHAR(255), NULL
  - instagram: VARCHAR(255), NULL
  - tiktok: VARCHAR(255), NULL
  - youtube: VARCHAR(255), NULL
  - created_at: TIMESTAMP NULL (has default)
  - updated_at: TIMESTAMP NULL (has default)
  - Constraints: id SERIAL PRIMARY KEY,

- **service_areas**
  - state: VARCHAR(50), NULL
  - city: VARCHAR(100), NULL
  - zip: VARCHAR(20), NULL
  - created_at: TIMESTAMP NULL (has default)
  - Constraints: id SERIAL PRIMARY KEY,

- **affiliates**
  - name: VARCHAR(255) NOT NULL
  - email: VARCHAR(255), NULL
  - phone: VARCHAR(50), NULL
  - sms_phone: VARCHAR(50), NULL
  - address: TEXT, NULL
  - logo_url: TEXT, NULL
  - website: VARCHAR(255), NULL
  - description: TEXT, NULL
  - service_areas: TEXT[], NULL
  - state_cities: JSONB, NULL
  - is_active: BOOLEAN NULL (has default)
  - created_at: TIMESTAMP NULL (has default)
  - updated_at: TIMESTAMP NULL (has default)
  - Constraints: id SERIAL PRIMARY KEY,, slug VARCHAR(100) UNIQUE NOT NULL,

- **affiliate_service_areas**
  - affiliate_id: INTEGER NULL
  - state: VARCHAR(50) NOT NULL
  - city: VARCHAR(100) NOT NULL
  - zip: VARCHAR(20), NULL
  - created_at: TIMESTAMP NULL (has default)
  - Constraints: id SERIAL PRIMARY KEY,, UNIQUE(affiliate_id, state, city)

- **clients**
  - user_id: INTEGER, NULL
  - address: TEXT, NULL
  - preferences: JSONB, NULL
  - created_at: TIMESTAMP NULL (has default)
  - updated_at: TIMESTAMP NULL (has default)
  - Constraints: id SERIAL PRIMARY KEY,, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL

#### Table Relationships
- clients.user_id → users.id (Foreign Key)

#### Migration Scripts
- **add_services_description.sql** (SQL Migration)
  - Migration script to add services_description column to mdh_config table
  - Changes: ALTER TABLE mdh_config ADD COLUMN services_description TEXT DEFAULT 'auto detailing, boat & RV detailing, ceramic coating, and PPF';

- **migrate_service_areas.py** (Python Migration)
  - 
  - Tables: businesses

#### Sample Data
- **Service areas sample data**: ['California', 'Los Angeles', '90210'],
        ['California', 'San Francisco', '94102'],
        ['Texas', 'Austin', '73301'],
        ['Texas', 'Dallas', '75201'],
        ['Florida', 'Miami', '33101'],
        ['Florida', 'Orlando', '32801'],
        ['New York', 'New York', '10001'],
        ['New York', 'Buffalo', '14201']



### Database Scripts
2 migration scripts

## ⚙️ Configuration
- **Environment**: Configured
- **Brands**: Configured
- **Contexts**: 4 files

---
*This overview was automatically generated. Run `node scripts/generate-codebase-overview.js` to update.*
