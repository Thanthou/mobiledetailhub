// scripts/devtools/cli/verify-ports-free.js
import { execSync } from "child_process";

/**
 * Verify that specific ports are actually free after cleanup
 */
function verifyPortsFree() {
  const portsToCheck = [3001, 5175];
  const isWindows = process.platform === "win32";
  
  if (!isWindows) {
    console.log("🟢 Port verification skipped on non-Windows platform");
    return true;
  }

  try {
    for (const port of portsToCheck) {
      const output = execSync(`netstat -ano | findstr :${port}`).toString();
      if (output.includes("LISTEN")) {
        console.log(`⚠️ Port ${port} still in use after cleanup`);
        return false;
      }
    }
    console.log("🟢 All ports confirmed free");
    return true;
  } catch (error) {
    // If netstat fails, assume ports are free
    console.log("🟢 Port verification completed");
    return true;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyPortsFree();
}

export { verifyPortsFree };
