# Mobile Detail Hub - Development Context

Generated: 2025-09-17T19:35:31.328Z

## Project Overview

- **Name**: mobiledetailhub
- **Version**: 1.0.0
- **Description**: Mobile Detail Hub - Multi-business detailing services platform

## File Structure Summary

- **Total Files**: 895
- **Frontend Files**: 290
- **Backend Files**: 145
- **Root Files**: 460
- **Total Directories**: 795

## Frontend Structure

- **Pages**: 0
- **Components**: 0
- **Hooks**: 3
- **Contexts**: 6
- **Utils**: 0
- **Config**: 0
- **Types**: 0
- **Data**: 0
- **Styles**: 1

## Backend Structure

- **Routes**: 0
- **Middleware**: 0
- **Utils**: 0
- **Controllers**: 0
- **Models**: 0
- **Services**: 0
- **Database**: 0
- **Documentation**: 0
- **Tests**: 2
- **Scripts**: 0

## Deployment & Infrastructure

- **Hosting Platform**: unknown
- **Config Files**: package.json
- **Platforms Detected**: package

### Build Settings

#### FRONTEND
- **dev**: `vite`
- **build**: `vite build`
- **lint**: `eslint .`
- **lint:fix**: `eslint . --fix`
- **preview**: `vite preview`
- **test**: `vitest`
- **test:ui**: `vitest --ui`
- **optimize-images**: `node scripts/convert-images.js`
- **prebuild**: `npm run optimize-images`
- **check-pages**: `node scripts/check-pages-usage.js`
- **lint:pages**: `eslint . --rule 'import/no-restricted-paths: error'`

#### BACKEND
- **start**: `node server.js`
- **start:prod**: `node server.js`
- **dev**: `nodemon server.js`
- **test**: `echo "Error: no test specified" && exit 1`

