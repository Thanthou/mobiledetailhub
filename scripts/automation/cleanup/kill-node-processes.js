// scripts/backend/kill-node-processes.js
import { exec, execSync } from "child_process";

console.log("🧹 Cleaning up old Node.js processes...");

const isWindows = process.platform === "win32";
const command = isWindows
  ? `
    for /f "tokens=5" %a in ('netstat -ano ^| findstr :3001') do taskkill /PID %a /F >nul 2>&1
    for /f "tokens=5" %a in ('netstat -ano ^| findstr :3002') do taskkill /PID %a /F >nul 2>&1
    for /f "tokens=5" %a in ('netstat -ano ^| findstr :3003') do taskkill /PID %a /F >nul 2>&1
    for /f "tokens=5" %a in ('netstat -ano ^| findstr :3004') do taskkill /PID %a /F >nul 2>&1
    for /f "tokens=5" %a in ('netstat -ano ^| findstr :3005') do taskkill /PID %a /F >nul 2>&1
    for /f "tokens=5" %a in ('netstat -ano ^| findstr :5175') do taskkill /PID %a /F >nul 2>&1
    for /f "tokens=5" %a in ('netstat -ano ^| findstr :5176') do taskkill /PID %a /F >nul 2>&1
    for /f "tokens=5" %a in ('netstat -ano ^| findstr :5177') do taskkill /PID %a /F >nul 2>&1
    for /f "tokens=5" %a in ('netstat -ano ^| findstr :5178') do taskkill /PID %a /F >nul 2>&1
    for /f "tokens=5" %a in ('netstat -ano ^| findstr :5179') do taskkill /PID %a /F >nul 2>&1
    taskkill /F /IM node.exe /T >nul 2>&1
  `
  : `lsof -ti:3001,3002,3003,3004,3005,5175,5176,5177,5178,5179 | xargs kill -9 2>/dev/null || true && pkill -f node || true`;

exec(command, (error) => {
  if (error) {
    console.log("⚠️ Some processes may not have terminated cleanly:", error.message);
  } else {
    console.log("✅ All Node.js processes killed (ports 3001-3005, 5175-5179 freed)");
  }

  // 🕐 Simple delay to allow ports to be released
  setTimeout(() => {
    console.log("🟢 Ports should be released");
    process.exit(0);
  }, 1000);
});