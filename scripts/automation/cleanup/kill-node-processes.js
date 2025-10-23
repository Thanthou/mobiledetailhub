// scripts/automation/cleanup/kill-node-processes.js
import { execSync } from "child_process";

console.log("🧹 Cleaning up old Node.js processes...");

const isWindows = process.platform === "win32";

try {
  if (isWindows) {
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
    console.log("✅ All Node.js processes killed (ports 3001-3005, 5175-5179 freed)");
  } else {
    execSync('lsof -ti:3001,3002,3003,3004,3005,5175,5176,5177,5178,5179 | xargs kill -9 2>/dev/null || true && pkill -f node || true', { stdio: 'ignore' });
    console.log("✅ All Node.js processes killed");
  }
} catch (error) {
  // No processes to kill - this is fine
  console.log("ℹ️  No Node processes to clean up");
}

// Give ports time to release
console.log("⏱️  Waiting for ports to release...");
await new Promise(resolve => setTimeout(resolve, 1500));
console.log("🟢 Ports released - starting dev servers...\n");