// scripts/devtools/cli/env-manager.js
import fs from 'fs';
import path from 'path';

/**
 * Environment file manager for dynamic ports
 */
class EnvManager {
  constructor() {
    this.envPath = path.join(process.cwd(), '.env');
  }

  /**
   * Read current .env file
   */
  readEnv() {
    try {
      if (!fs.existsSync(this.envPath)) {
        console.log('❌ .env file not found');
        return null;
      }
      return fs.readFileSync(this.envPath, 'utf8');
    } catch (error) {
      console.error('❌ Failed to read .env file:', error.message);
      return null;
    }
  }

  /**
   * Write .env file
   */
  writeEnv(content) {
    try {
      fs.writeFileSync(this.envPath, content);
      console.log('✅ .env file updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to write .env file:', error.message);
      return false;
    }
  }

  /**
   * Remove hardcoded port settings
   */
  removeHardcodedPorts() {
    const content = this.readEnv();
    if (!content) return false;

    let updated = content;

    // Comment out hardcoded ports
    updated = updated.replace(/^FRONTEND_URL=.*$/m, '# FRONTEND_URL=http://localhost:5175  # Auto-detected');
    updated = updated.replace(/^PORT=.*$/m, '# PORT=3001  # Auto-detected');

    // Add dynamic port comments
    if (!updated.includes('# Dynamic Ports')) {
      updated = '\n# Dynamic Ports (auto-detected by system)\n# FRONTEND_URL=http://localhost:5175\n# PORT=3001\n' + updated;
    }

    return this.writeEnv(updated);
  }

  /**
   * Show current port configuration
   */
  showPortConfig() {
    const content = this.readEnv();
    if (!content) return;

    console.log('\n📋 Current Port Configuration:');
    console.log('================================');

    // Check for hardcoded ports
    const frontendUrl = content.match(/^FRONTEND_URL=(.*)$/m);
    const port = content.match(/^PORT=(.*)$/m);
    const oauthRedirect = content.match(/^GOOGLE_REDIRECT_URI=(.*)$/m);

    console.log(`Frontend URL: ${frontendUrl ? frontendUrl[1] : 'Not set (auto-detected)'}`);
    console.log(`Backend Port: ${port ? port[1] : 'Not set (auto-detected)'}`);
    console.log(`OAuth Redirect: ${oauthRedirect ? oauthRedirect[1] : 'Not set'}`);

    // Check for port files
    try {
      const frontendPort = JSON.parse(fs.readFileSync('.frontend-port.json', 'utf8'));
      const backendPort = JSON.parse(fs.readFileSync('.backend-port.json', 'utf8'));
      console.log(`\n🎯 Current Dynamic Ports:`);
      console.log(`Frontend: ${frontendPort.port}`);
      console.log(`Backend: ${backendPort.port}`);
    } catch (error) {
      console.log('\n⚠️ No dynamic port files found (run npm run dev:all first)');
    }
  }

  /**
   * Backup current .env file
   */
  backup() {
    const content = this.readEnv();
    if (!content) return false;

    const backupPath = this.envPath + '.backup.' + Date.now();
    try {
      fs.writeFileSync(backupPath, content);
      console.log(`✅ Backup created: ${backupPath}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to create backup:', error.message);
      return false;
    }
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const manager = new EnvManager();
  const command = process.argv[2];

  switch (command) {
    case 'show':
      manager.showPortConfig();
      break;
    case 'remove-ports':
      console.log('🔄 Removing hardcoded ports...');
      manager.backup();
      manager.removeHardcodedPorts();
      break;
    case 'backup':
      manager.backup();
      break;
    default:
      console.log(`
🔧 Environment Manager

Usage:
  node scripts/devtools/cli/env-manager.js <command>

Commands:
  show          - Show current port configuration
  remove-ports  - Remove hardcoded ports (with backup)
  backup        - Create backup of .env file

Examples:
  node scripts/devtools/cli/env-manager.js show
  node scripts/devtools/cli/env-manager.js remove-ports
      `);
  }
}

export { EnvManager };
