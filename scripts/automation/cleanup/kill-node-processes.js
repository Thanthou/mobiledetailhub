// scripts/backend/kill-node-processes.js
import { exec, execSync } from "child_process";

console.log("🧹 Cleaning up old Node.js processes...");

const isWindows = process.platform === "win32";
const command = isWindows
  ? `taskkill /F /IM node.exe /T >nul 2>&1`
  : `lsof -ti:3001,3002,3003,3004,3005,5175,5176,5177,5178,5179 | xargs kill -9 2>/dev/null || true && pkill -f node || true`;

exec(command, (error) => {
  if (error) {
    console.log("⚠️ Some processes may not have terminated cleanly:", error.message);
  } else {
    console.log("✅ All Node.js processes killed (ports 3001-3005, 5175-5179 freed)");
  }

  // 🕐 Delay to ensure ports are fully released by OS
  setTimeout(() => {
    console.log("🟢 Ports should be released");
    process.exit(0);
  }, 2000); // Increased to 2 seconds for Windows port release
});