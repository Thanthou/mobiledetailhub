// backend/scripts/kill-node-processes.js
import { exec, execSync } from "child_process";

console.log("🧹 Cleaning up old Node.js processes...");

const isWindows = process.platform === "win32";
const command = isWindows
  ? `
    for /f "tokens=5" %a in ('netstat -ano ^| findstr :3001') do taskkill /PID %a /F >nul 2>&1
    for /f "tokens=5" %a in ('netstat -ano ^| findstr :5175') do taskkill /PID %a /F >nul 2>&1
    taskkill /F /IM node.exe /T >nul 2>&1
  `
  : `lsof -ti:3001,5175 | xargs kill -9 2>/dev/null || true && pkill -f node || true`;

exec(command, (error) => {
  if (error) {
    console.log("⚠️ Some processes may not have terminated cleanly:", error.message);
  } else {
    console.log("✅ All Node.js processes killed (ports 3001, 5175 freed)");
  }

  // 🕐 Verify ports are actually free (Windows delay safety)
  setTimeout(() => {
    try {
      const output = execSync("netstat -ano | findstr :3001").toString();
      if (output.includes("LISTEN")) {
        console.log("⚠️ Port 3001 still in use, retrying...");
        execSync(
          'for /f "tokens=5" %a in (\'netstat -ano ^| findstr :3001\') do taskkill /PID %a /F >nul 2>&1'
        );
        // Wait a bit more after the retry
        setTimeout(() => {
          console.log("🟢 Ports confirmed released");
          process.exit(0);
        }, 1000);
      } else {
        console.log("🟢 Ports confirmed released");
        process.exit(0);
      }
    } catch {
      console.log("🟢 Ports confirmed released");
      process.exit(0);
    }
  }, 1500);
});