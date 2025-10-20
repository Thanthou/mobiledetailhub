#!/usr/bin/env node
/**
 * cleanup-ports.js — Manual Port Cleanup Script
 * --------------------------------------------------------------
 * Quickly clean up development server ports that are stuck
 * or left running after crashed scripts.
 * --------------------------------------------------------------
 * Usage:
 *   node scripts/automation/cleanup-ports.js           # Clean common ports
 *   node scripts/automation/cleanup-ports.js 4173      # Clean specific port
 *   node scripts/automation/cleanup-ports.js --all     # Clean ALL common ports
 */

import { 
  killProcessByPort, 
  killCommonPorts, 
  findProcessByPort,
  isPortInUse 
} from "../utils/cleanup.js";

const args = process.argv.slice(2);

async function main() {
  console.log("\n🧹 Port Cleanup Utility\n");

  // No arguments: clean common development ports
  if (args.length === 0 || args[0] === "--all") {
    console.log("Cleaning common development ports...\n");
    const killed = await killCommonPorts();
    
    if (killed === 0) {
      console.log("✅ All ports are clean!");
    } else {
      console.log(`\n✅ Successfully cleaned ${killed} port(s)`);
    }
    return;
  }

  // Specific port number provided
  const port = parseInt(args[0], 10);
  
  if (isNaN(port) || port < 1 || port > 65535) {
    console.error("❌ Invalid port number. Must be between 1-65535");
    process.exit(1);
  }

  console.log(`Checking port ${port}...`);
  
  const inUse = await isPortInUse(port);
  
  if (!inUse) {
    console.log(`✅ Port ${port} is already free`);
    return;
  }

  const pid = await findProcessByPort(port);
  
  if (pid) {
    console.log(`🔍 Found process ${pid} on port ${port}`);
    const success = await killProcessByPort(port);
    
    if (success) {
      console.log(`✅ Successfully killed process on port ${port}`);
    } else {
      console.log(`⚠️ Failed to kill process on port ${port}`);
      process.exit(1);
    }
  } else {
    console.log(`⚠️ Port ${port} appears in use but couldn't find process`);
  }
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});

