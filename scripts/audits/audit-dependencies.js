#!/usr/bin/env node
/**
 * audit-dependencies.js — Dependency & Port Audit
 * --------------------------------------------------------------
 * ✅ Checks file dependencies (.port-registry.json, .env)
 * ✅ Validates npm packages (missing dependencies)
 * ✅ Detects circular dependencies (via madge)
 * ✅ Verifies hosts file entries
 * ✅ Checks port availability
 * --------------------------------------------------------------
 */
import depcheck from "depcheck";
import fs from "fs";
import madgePkg from "madge";
import net from "net";
import os from "os";
import path from "path";
import { 
  createAuditResult, 
  saveReport, 
  finishAudit,
  fileExists,
  readJson
} from './shared/audit-utils.js';

const root = process.cwd();

// Check if running in silent mode
const isSilent = process.argv.includes('--silent') || process.env.AUDIT_SILENT === 'true';

//──────────────────────────────
// 📁 FILE DEPENDENCIES
//──────────────────────────────
function checkRequiredFiles(audit) {
  audit.section('Required Files');
  
  const filesToCheck = [".port-registry.json", ".env"];
  
  for (const f of filesToCheck) {
    if (fileExists(path.join(root, f))) {
      audit.pass(`${f} exists`);
    } else {
      audit.warn(`${f} missing`, {
        path: f,
        details: 'Required by startup scripts'
      });
    }
  }
}

//──────────────────────────────
// 📦 CODE DEPENDENCIES
//──────────────────────────────
async function checkNpmDependencies(audit) {
  audit.section('NPM Dependencies');
  
  try {
    const result = await depcheck(process.cwd(), {});
    const missing = result.missing || {};
    
    if (Object.keys(missing).length === 0) {
      audit.pass('All dependencies installed');
    } else {
      for (const [pkg, locations] of Object.entries(missing)) {
        const shortList = locations.slice(0, 3).map((p) => path.relative(root, p));
        const extra = locations.length > 3 ? ` (+${locations.length - 3} more)` : "";
        
        audit.error(`${pkg} not installed`, {
          path: shortList.join(', ') + extra,
          details: 'Run: npm install'
        });
      }
    }
  } catch (e) {
    audit.warn('Depcheck analysis failed', {
      details: 'Check module compatibility: ' + e.message
    });
  }
}

//──────────────────────────────
// 🕸️ IMPORT GRAPH AUDIT (Madge)
//──────────────────────────────
async function checkCircularDependencies(audit) {
  audit.section('Circular Dependencies');
  
  const madge = madgePkg.default || madgePkg;
  
  try {
    const res = await madge(path.resolve(root, "frontend/apps"), {
      fileExtensions: ["ts", "tsx", "js", "jsx"],
      excludeRegExp: [
        /node_modules/,
        /dist/,
        /\.test\./,
        /\.spec\./,
        /\.(css|scss|svg|png|jpg|jpeg|json)$/,
      ],
      tsConfig: path.resolve(root, "frontend/tsconfig.app.json"),
      includeNpm: false,
    });
    
    const obj = (typeof res.obj === "function" ? res.obj() : res);
    const totalFiles = Object.keys(obj || {}).length;
    const circular = typeof res.circular === "function" ? res.circular() : [];
    
    if (totalFiles === 0) {
      audit.warn('Madge found 0 files', {
        details: 'Check tsconfig or file paths'
      });
    } else {
      audit.pass(`Analyzed ${totalFiles} files`);
      
      if (circular.length === 0) {
        audit.pass('No circular dependencies detected');
      } else {
        circular.forEach((chain, i) => {
          audit.warn(`Circular dependency chain ${i + 1}`, {
            details: chain.join(" → ")
          });
        });
      }
    }
  } catch (e) {
    audit.warn('Madge import analysis failed', {
      details: e.message
    });
  }
}

//──────────────────────────────
// ⚙️ SYSTEM DEPENDENCIES
//──────────────────────────────
function checkHostsFile(audit) {
  audit.section('Hosts File');
  
  try {
    const hostsPath = os.platform() === "win32"
      ? "C:\\Windows\\System32\\drivers\\etc\\hosts"
      : "/etc/hosts";
      
    const hosts = fs.readFileSync(hostsPath, "utf8");
    
    const requiredEntries = ['admin.localhost', 'tenant.localhost'];
    const missing = requiredEntries.filter(entry => !hosts.includes(entry));
    
    if (missing.length === 0) {
      audit.pass('All required hosts entries present');
    } else {
      audit.warn(`Hosts file missing entries: ${missing.join(', ')}`, {
        path: hostsPath,
        details: 'Add: 127.0.0.1 admin.localhost tenant.localhost'
      });
    }
  } catch (e) {
    audit.error('Unable to read hosts file', {
      details: e.message
    });
  }
}

//──────────────────────────────
// 🧱 PORT REGISTRY VALIDATION
//──────────────────────────────
async function checkPortAvailability(audit) {
  audit.section('Port Availability');
  
  const portRegistryPath = path.join(root, ".port-registry.json");
  const registry = readJson(portRegistryPath);
  
  if (!registry) {
    audit.warn('.port-registry.json not found', {
      details: 'Cannot validate port availability'
    });
    return;
  }

  const checkPort = (port) =>
    new Promise((resolve) => {
      const tester = net
        .createServer()
        .once("error", () => resolve(false))
        .once("listening", () => tester.close(() => resolve(true)))
        .listen(port);
    });

  // Check each port
  const entries = Object.entries(registry);
  let allFree = true;
  
  for (const [app, config] of entries) {
    const port = config.port;
    const isFree = await checkPort(port);
    
    if (isFree) {
      audit.pass(`Port ${port} (${app}) is available`);
    } else {
      audit.warn(`Port ${port} (${app}) is already in use`, {
        details: 'Stop existing process or use different port'
      });
      allFree = false;
    }
  }
  
  if (allFree) {
    audit.pass('All registered ports are available');
  }
}

//──────────────────────────────
// 🚀 Main
//──────────────────────────────
async function main() {
  const audit = createAuditResult('Dependencies', isSilent);

  // Run all checks
  checkRequiredFiles(audit);
  await checkNpmDependencies(audit);
  await checkCircularDependencies(audit);
  checkHostsFile(audit);
  await checkPortAvailability(audit);

  // Generate report
  saveReport(audit, 'DEPENDENCY_AUDIT.md', {
    description: 'Validates file dependencies, npm packages, circular dependencies, hosts file entries, and port availability.',
    recommendations: [
      'Ensure .port-registry.json and .env files exist',
      'Install all missing npm packages',
      'Resolve circular dependencies in frontend code',
      'Add required entries to hosts file (admin.localhost, tenant.localhost)',
      'Free up ports in use or update port registry',
      'Run: npm install to fix missing dependencies'
    ]
  });

  // Finish and exit
  finishAudit(audit);
}

main().catch(err => {
  console.error(`❌ Dependencies audit failed: ${err.message}`);
  process.exit(1);
});

