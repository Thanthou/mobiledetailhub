#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class CodebaseOverviewGenerator {
  constructor() {
    this.rootDir = path.resolve(__dirname, '..');
    this.output = {
      timestamp: new Date().toISOString(),
      project: {},
      structure: {},
      techStack: {},
      components: {},
      pages: {},
      database: {},
      config: {},
      services: {},
      summary: {}
    };
  }

  async generate() {
    console.log('🔍 Generating Mobile Detail Hub Codebase Overview...\n');
    
    await this.analyzeProject();
    await this.analyzeStructure();
    await this.analyzeTechStack();
    await this.analyzeComponents();
    await this.analyzePages();
    await this.analyzeDatabase();
    await this.analyzeConfig();
    await this.analyzeServices();
    await this.generateSummary();
    
    this.saveOutput();
    this.displayOutput();
  }

  async analyzeProject() {
    const packageJson = JSON.parse(fs.readFileSync(path.join(this.rootDir, 'package.json'), 'utf8'));
    const frontendPkg = JSON.parse(fs.readFileSync(path.join(this.rootDir, 'frontend/package.json'), 'utf8'));
    const backendPkg = JSON.parse(fs.readFileSync(path.join(this.rootDir, 'backend/package.json'), 'utf8'));

    this.output.project = {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      scripts: packageJson.scripts,
      frontend: {
        name: frontendPkg.name,
        version: frontendPkg.version,
        dependencies: Object.keys(frontendPkg.dependencies || {}),
        devDependencies: Object.keys(frontendPkg.devDependencies || {})
      },
      backend: {
        name: backendPkg.name,
        version: backendPkg.version,
        dependencies: Object.keys(backendPkg.dependencies || {}),
        devDependencies: Object.keys(backendPkg.devDependencies || {})
      }
    };
  }

  async analyzeStructure() {
    this.output.structure = {
      root: this.getDirectoryInfo(this.rootDir, 2),
      frontend: this.getDirectoryInfo(path.join(this.rootDir, 'frontend'), 3),
      backend: this.getDirectoryInfo(path.join(this.rootDir, 'backend'), 3)
    };
  }

  getDirectoryInfo(dirPath, maxDepth = 2, currentDepth = 0) {
    if (currentDepth >= maxDepth) return { type: 'file', truncated: true };
    
    try {
      const items = fs.readdirSync(dirPath);
      const result = { type: 'directory', items: {} };
      
      for (const item of items) {
        if (item.startsWith('.') || item === 'node_modules' || item === 'dist') continue;
        
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          result.items[item] = this.getDirectoryInfo(fullPath, maxDepth, currentDepth + 1);
        } else {
          result.items[item] = { type: 'file', size: stat.size };
        }
      }
      
      return result;
    } catch (error) {
      return { type: 'error', message: error.message };
    }
  }

  async analyzeTechStack() {
    this.output.techStack = {
      frontend: {
        framework: 'React 18.3.1',
        language: 'TypeScript 5.5.3',
        buildTool: 'Vite 5.4.2',
        styling: 'Tailwind CSS 3.4.1',
        routing: 'React Router DOM 7.7.1',
        icons: 'Lucide React 0.344.0',
        bundler: 'Vite with PostCSS and Autoprefixer'
      },
      backend: {
        runtime: 'Node.js',
        framework: 'Express 5.1.0',
        database: 'PostgreSQL with pg driver',
        authentication: 'JWT + bcryptjs',
        security: 'Helmet 8.1.0',
        cors: 'CORS enabled'
      },
      development: {
        packageManager: 'npm with workspaces',
        linting: 'ESLint 9.9.1',
        hotReload: 'Nodemon for backend, Vite for frontend',
        concurrent: 'Concurrently for running both services'
      }
    };
  }

  async analyzeComponents() {
    const componentsDir = path.join(this.rootDir, 'frontend/src/components');
    const components = this.scanComponents(componentsDir);
    
    this.output.components = {
      structure: components,
      count: this.countComponents(components),
      keyComponents: this.identifyKeyComponents(components)
    };
  }

  scanComponents(dirPath, currentDepth = 0) {
    if (currentDepth > 3) return { type: 'truncated' };
    
    try {
      const items = fs.readdirSync(dirPath);
      const result = {};
      
      for (const item of items) {
        if (item.startsWith('.')) continue;
        
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          result[item] = this.scanComponents(fullPath, currentDepth + 1);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          result[item] = { type: 'component', size: stat.size };
        }
      }
      
      return result;
    } catch (error) {
      return { type: 'error', message: error.message };
    }
  }

  countComponents(components) {
    let count = 0;
    const countRecursive = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        if (obj.type === 'component') count++;
        Object.values(obj).forEach(countRecursive);
      }
    };
    countRecursive(components);
    return count;
  }

  identifyKeyComponents(components) {
    const keyDirs = ['01_header', '02_hero', '03_services', '04_reviews', '05_faq', '07_footer', 'login', 'shared'];
    const keyComponents = {};
    
    keyDirs.forEach(dir => {
      if (components[dir]) {
        keyComponents[dir] = Object.keys(components[dir]).filter(key => 
          key.endsWith('.tsx') || key.endsWith('.ts')
        );
      }
    });
    
    return keyComponents;
  }

  async analyzePages() {
    const pagesDir = path.join(this.rootDir, 'frontend/src/pages');
    const pages = this.scanPages(pagesDir);
    
    this.output.pages = {
      structure: pages,
      count: this.countPages(pages),
      mainPages: this.identifyMainPages(pages)
    };
  }

  scanPages(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      const result = {};
      
      for (const item of items) {
        if (item.startsWith('.')) continue;
        
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          result[item] = this.scanPages(fullPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          result[item] = { type: 'page', size: stat.size };
        }
      }
      
      return result;
    } catch (error) {
      return { type: 'error', message: error.message };
    }
  }

  countPages(pages) {
    let count = 0;
    const countRecursive = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        if (obj.type === 'page') count++;
        Object.values(obj).forEach(countRecursive);
      }
    };
    countRecursive(pages);
    return count;
  }

  identifyMainPages(pages) {
    const mainPageDirs = ['adminDashboard', 'affiliateDashboard', 'affiliateOnboarding', 'clientDashboard'];
    const mainPages = {};
    
    mainPageDirs.forEach(dir => {
      if (pages[dir]) {
        mainPages[dir] = Object.keys(pages[dir]).filter(key => 
          key.endsWith('.tsx') || key.endsWith('.ts')
        );
      }
    });
    
    return mainPages;
  }

  async analyzeDatabase() {
    const backendDir = path.join(this.rootDir, 'backend');
    const modelsDir = path.join(backendDir, 'models');
    const routesDir = path.join(backendDir, 'routes');
    const utilsDir = path.join(backendDir, 'utils');
    
    this.output.database = {
      connection: this.readFileIfExists(path.join(backendDir, 'database/connection.js')),
      models: this.scanDirectory(modelsDir),
      routes: this.scanDirectory(routesDir),
      setup: this.readFileIfExists(path.join(backendDir, 'DATABASE_SETUP.md')),
      schemas: this.extractDatabaseSchemas(backendDir),
      scripts: this.scanDirectory(path.join(backendDir, 'scripts')),
      utils: this.readFileIfExists(path.join(utilsDir, 'databaseInit.js'))
    };
  }

  extractDatabaseSchemas(backendDir) {
    const schemas = {
      tables: {},
      relationships: [],
      migrations: [],
      sampleData: []
    };

    try {
      // Extract schema from databaseInit.js
      const dbInitPath = path.join(backendDir, 'utils/databaseInit.js');
      if (fs.existsSync(dbInitPath)) {
        const content = fs.readFileSync(dbInitPath, 'utf8');
        
        // Extract table creation statements
        const tableMatches = content.match(/CREATE TABLE IF NOT EXISTS (\w+)\s*\(([\s\S]*?)\);/g);
        if (tableMatches) {
          tableMatches.forEach(match => {
            const tableName = match.match(/CREATE TABLE IF NOT EXISTS (\w+)/)[1];
            const tableDef = match.match(/CREATE TABLE IF NOT EXISTS \w+\s*\(([\s\S]*?)\);/)[1];
            
            schemas.tables[tableName] = this.parseTableDefinition(tableDef);
          });
        }

        // Extract sample data
        const sampleDataMatches = content.match(/const sampleData = \[([\s\S]*?)\];/);
        if (sampleDataMatches) {
          schemas.sampleData.push({
            description: 'Service areas sample data',
            data: sampleDataMatches[1].trim()
          });
        }
      }

      // Extract migration scripts
      const scriptsDir = path.join(backendDir, 'scripts');
      if (fs.existsSync(scriptsDir)) {
        const scriptFiles = fs.readdirSync(scriptsDir);
        scriptFiles.forEach(file => {
          if (file.endsWith('.sql') || file.endsWith('.py')) {
            const scriptPath = path.join(scriptsDir, file);
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            
            if (file.endsWith('.sql')) {
              schemas.migrations.push({
                file: file,
                type: 'SQL Migration',
                description: this.extractMigrationDescription(scriptContent),
                changes: this.extractTableChanges(scriptContent)
              });
            } else if (file.endsWith('.py')) {
              schemas.migrations.push({
                file: file,
                type: 'Python Migration',
                description: this.extractPythonMigrationDescription(scriptContent),
                tables: this.extractPythonMigrationTables(scriptContent)
              });
            }
          }
        });
      }

      // Extract relationships
      schemas.relationships = this.extractTableRelationships(schemas.tables);

    } catch (error) {
      console.error('Error extracting database schemas:', error);
    }

    return schemas;
  }

  parseTableDefinition(tableDef) {
    const columns = [];
    const constraints = [];
    
    const lines = tableDef.split('\n').map(line => line.trim()).filter(line => line);
    
    lines.forEach(line => {
      if (line.startsWith('--')) return; // Skip comments
      
      if (line.includes('PRIMARY KEY') || line.includes('FOREIGN KEY') || line.includes('UNIQUE')) {
        constraints.push(line);
      } else if (line.includes(' ')) {
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
          const columnName = parts[0];
          const dataType = parts[1];
          const isNullable = !line.includes('NOT NULL');
          const hasDefault = line.includes('DEFAULT');
          
          columns.push({
            name: columnName,
            type: dataType,
            nullable: isNullable,
            hasDefault: hasDefault,
            definition: line.trim()
          });
        }
      }
    });

    return {
      columns: columns,
      constraints: constraints
    };
  }

  extractMigrationDescription(content) {
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.startsWith('--') && line.includes('Migration script')) {
        return line.replace('--', '').trim();
      }
    }
    return 'Database migration script';
  }

  extractTableChanges(content) {
    const changes = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      if (line.includes('ALTER TABLE') || line.includes('ADD COLUMN')) {
        changes.push(line.trim());
      }
    });
    
    return changes;
  }

  extractPythonMigrationDescription(content) {
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.startsWith('"""') || line.startsWith("'''")) {
        return line.replace(/['"]/g, '').trim();
      }
    }
    return 'Python migration script';
  }

  extractPythonMigrationTables(content) {
    const tables = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      if (line.includes('FROM') && line.includes('SELECT')) {
        const tableMatch = line.match(/FROM (\w+)/);
        if (tableMatch) {
          tables.push(tableMatch[1]);
        }
      }
    });
    
    return tables;
  }

  extractTableRelationships(tables) {
    const relationships = [];
    
    Object.entries(tables).forEach(([tableName, tableDef]) => {
      tableDef.constraints.forEach(constraint => {
        if (constraint.includes('FOREIGN KEY')) {
          const fkMatch = constraint.match(/FOREIGN KEY\s*\(([^)]+)\)\s*REFERENCES\s*(\w+)\s*\(([^)]+)\)/);
          if (fkMatch) {
            relationships.push({
              from: {
                table: tableName,
                column: fkMatch[1]
              },
              to: {
                table: fkMatch[2],
                column: fkMatch[3]
              },
              type: 'Foreign Key'
            });
          }
        }
      });
    });
    
    return relationships;
  }

  async analyzeConfig() {
    const configDir = path.join(this.rootDir, 'frontend/src/config');
    const contextsDir = path.join(this.rootDir, 'frontend/src/contexts');
    
    this.output.config = {
      environment: this.readFileIfExists(path.join(configDir, 'environment.ts')),
      brands: this.readFileIfExists(path.join(configDir, 'brands.ts')),
      contexts: this.scanDirectory(contextsDir),
      types: this.scanDirectory(path.join(this.rootDir, 'frontend/src/types'))
    };
  }

  async analyzeServices() {
    const servicesDir = path.join(this.rootDir, 'frontend/src/services');
    const hooksDir = path.join(this.rootDir, 'frontend/src/hooks');
    const utilsDir = path.join(this.rootDir, 'frontend/src/utils');
    
    this.output.services = {
      api: this.readFileIfExists(path.join(servicesDir, 'api.ts')),
      hooks: this.scanDirectory(hooksDir),
      utils: this.scanDirectory(utilsDir),
      data: this.scanDirectory(path.join(this.rootDir, 'frontend/src/data'))
    };
  }

  scanDirectory(dirPath) {
    try {
      if (!fs.existsSync(dirPath)) return { exists: false };
      
      const items = fs.readdirSync(dirPath);
      const result = { exists: true, files: [] };
      
      for (const item of items) {
        if (item.startsWith('.')) continue;
        
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isFile()) {
          result.files.push({
            name: item,
            size: stat.size,
            type: path.extname(item)
          });
        }
      }
      
      return result;
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }

  readFileIfExists(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return {
          exists: true,
          size: content.length,
          preview: content.substring(0, 200) + (content.length > 200 ? '...' : '')
        };
      }
      return { exists: false };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }

  generateSummary() {
    this.output.summary = {
      totalComponents: this.output.components.count,
      totalPages: this.output.pages.count,
      databaseTables: Object.keys(this.output.database.schemas.tables).length,
      databaseMigrations: this.output.database.schemas.migrations.length,
      techStack: {
        frontend: `${this.output.techStack.frontend.framework} + ${this.output.techStack.frontend.language}`,
        backend: `${this.output.techStack.backend.framework} + ${this.output.techStack.backend.database}`,
        styling: this.output.techStack.frontend.styling
      },
      architecture: 'Monorepo with React frontend and Express backend',
      keyFeatures: [
        'Multi-business platform (JPS, ABC, MDH)',
        'Affiliate management system',
        'Client booking and dashboard',
        'Admin dashboard',
        'Service area management',
        'Vehicle data integration',
        'Google Maps integration',
        'Responsive design with Tailwind CSS'
      ]
    };
  }

  saveOutput() {
    const outputPath = path.join(this.rootDir, 'CODEBASE_OVERVIEW.json');
    fs.writeFileSync(outputPath, JSON.stringify(this.output, null, 2));
    
    const markdownPath = path.join(this.rootDir, 'CODEBASE_OVERVIEW.md');
    const markdown = this.generateMarkdown();
    fs.writeFileSync(markdownPath, markdown);
    
    console.log(`📁 Overview saved to:`);
    console.log(`   - ${outputPath}`);
    console.log(`   - ${markdownPath}\n`);
  }

  generateMarkdown() {
    return `# Mobile Detail Hub - Codebase Overview

Generated on: ${this.output.timestamp}

## 🏗️ Project Overview
- **Name**: ${this.output.project.name}
- **Version**: ${this.output.project.version}
- **Description**: ${this.output.project.description}

## 🚀 Tech Stack

### Frontend
${Object.entries(this.output.techStack.frontend).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

### Backend
${Object.entries(this.output.techStack.backend).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

### Development
${Object.entries(this.output.techStack.development).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

## 📊 Statistics
- **Total Components**: ${this.output.summary.totalComponents}
- **Total Pages**: ${this.output.summary.totalPages}
- **Database Tables**: ${this.output.summary.databaseTables}
- **Database Migrations**: ${this.output.summary.databaseMigrations}
- **Architecture**: ${this.output.summary.architecture}

## 🔑 Key Features
${this.output.summary.keyFeatures.map(feature => `- ${feature}`).join('\n')}

## 📁 Component Structure
${this.formatComponentStructure(this.output.components.structure)}

## 📄 Page Structure
${this.formatPageStructure(this.output.pages.structure)}

## 🗄️ Database & Backend
- **Models**: ${this.output.database.models.exists ? `${this.output.database.models.files.length} files` : 'Not found'}
- **Routes**: ${this.output.database.routes.exists ? `${this.output.database.routes.files.length} files` : 'Not found'}

### Database Schemas
${this.formatDatabaseSchemas(this.output.database.schemas)}

### Database Scripts
${this.output.database.scripts.exists ? `${this.output.database.scripts.files.length} migration scripts` : 'No migration scripts found'}

## ⚙️ Configuration
- **Environment**: ${this.output.config.environment.exists ? 'Configured' : 'Not found'}
- **Brands**: ${this.output.config.brands.exists ? 'Configured' : 'Not found'}
- **Contexts**: ${this.output.config.contexts.exists ? `${this.output.config.contexts.files.length} files` : 'Not found'}

---
*This overview was automatically generated. Run \`node scripts/generate-codebase-overview.js\` to update.*
`;
  }

  formatComponentStructure(structure, indent = '') {
    let result = '';
    for (const [key, value] of Object.entries(structure)) {
      if (value.type === 'component') {
        result += `${indent}- ${key} (${value.size} bytes)\n`;
      } else if (value.type === 'directory') {
        result += `${indent}- 📁 ${key}/\n`;
        result += this.formatComponentStructure(value.items, indent + '  ');
      }
    }
    return result;
  }

  formatPageStructure(structure, indent = '') {
    let result = '';
    for (const [key, value] of Object.entries(structure)) {
      if (value.type === 'page') {
        result += `${indent}- ${key} (${value.size} bytes)\n`;
      } else if (value.type === 'directory') {
        result += `${indent}- 📁 ${key}/\n`;
        result += this.formatPageStructure(value.items, indent + '  ');
      }
    }
    return result;
  }

  formatDatabaseSchemas(schemas) {
    let result = '';
    
    // Tables
    if (Object.keys(schemas.tables).length > 0) {
      result += '#### Tables\n';
      Object.entries(schemas.tables).forEach(([tableName, tableDef]) => {
        result += `- **${tableName}**\n`;
        tableDef.columns.forEach(column => {
          const nullable = column.nullable ? 'NULL' : 'NOT NULL';
          const defaultText = column.hasDefault ? ' (has default)' : '';
          result += `  - ${column.name}: ${column.type} ${nullable}${defaultText}\n`;
        });
        if (tableDef.constraints.length > 0) {
          result += `  - Constraints: ${tableDef.constraints.join(', ')}\n`;
        }
        result += '\n';
      });
    }
    
    // Relationships
    if (schemas.relationships.length > 0) {
      result += '#### Table Relationships\n';
      schemas.relationships.forEach(rel => {
        result += `- ${rel.from.table}.${rel.from.column} → ${rel.to.table}.${rel.to.column} (${rel.type})\n`;
      });
      result += '\n';
    }
    
    // Migrations
    if (schemas.migrations.length > 0) {
      result += '#### Migration Scripts\n';
      schemas.migrations.forEach(migration => {
        result += `- **${migration.file}** (${migration.type})\n`;
        result += `  - ${migration.description}\n`;
        if (migration.changes && migration.changes.length > 0) {
          result += `  - Changes: ${migration.changes.join(', ')}\n`;
        }
        if (migration.tables && migration.tables.length > 0) {
          result += `  - Tables: ${migration.tables.join(', ')}\n`;
        }
        result += '\n';
      });
    }
    
    // Sample Data
    if (schemas.sampleData.length > 0) {
      result += '#### Sample Data\n';
      schemas.sampleData.forEach(data => {
        result += `- **${data.description}**: ${data.data}\n`;
      });
      result += '\n';
    }
    
    return result || 'No schema information available';
  }

  displayOutput() {
    console.log('📋 CODEBASE OVERVIEW SUMMARY');
    console.log('=' .repeat(50));
    console.log(`🏗️  Project: ${this.output.project.name} v${this.output.project.version}`);
    console.log(`📅 Generated: ${this.output.timestamp}`);
    console.log(`🔧 Components: ${this.output.summary.totalComponents}`);
    console.log(`📄 Pages: ${this.output.summary.totalPages}`);
    console.log(`🗄️  Database Tables: ${Object.keys(this.output.database.schemas.tables).length}`);
    console.log(`🔄 Migrations: ${this.output.database.schemas.migrations.length}`);
    console.log(`⚡ Frontend: ${this.output.summary.techStack.frontend}`);
    console.log(`⚙️  Backend: ${this.output.summary.techStack.backend}`);
    console.log(`🎨 Styling: ${this.output.summary.techStack.styling}`);
    console.log('\n✅ Overview generation complete!');
  }
}

// Run the generator
const generator = new CodebaseOverviewGenerator();
generator.generate().catch(console.error);
