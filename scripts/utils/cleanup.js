#!/usr/bin/env node
/**
 * cleanup.js — Process & Port Management Utilities
 * --------------------------------------------------------------
 * Provides robust utilities for:
 *  - Killing process trees (Windows & Unix)
 *  - Checking port availability
 *  - Tracking and cleaning up spawned servers
 *  - Finding and killing processes by port
 * --------------------------------------------------------------
 * Used by: audit scripts, dev servers, testing utilities
 */

import { spawn, exec } from "child_process";
import { promisify } from "util";
import net from "net";

const execAsync = promisify(exec);

/*──────────────────────────────────────────────────────────────
| 🔪 Process Tree Termination (Cross-Platform)
|──────────────────────────────────────────────────────────────*/

/**
 * Kills a process and all its children
 * @param {number} pid - Process ID to kill
 * @param {string} signal - Signal to send (default: SIGTERM)
 * @returns {Promise<boolean>} - True if successful
 */
export async function killProcessTree(pid, signal = "SIGTERM") {
  if (!pid || pid <= 0) {
    console.warn("⚠️ Invalid PID provided to killProcessTree");
    return false;
  }

  try {
    if (process.platform === "win32") {
      // Windows: Use taskkill with /T (tree) and /F (force)
      return new Promise((resolve) => {
        const killProcess = spawn("taskkill", ["/PID", String(pid), "/T", "/F"], {
          shell: true,
          stdio: "ignore",
        });

        killProcess.on("close", (code) => {
          if (code === 0) {
            console.log(`✅ Killed process tree ${pid} (Windows)`);
            resolve(true);
          } else {
            console.warn(`⚠️ Failed to kill process ${pid}, may already be dead`);
            resolve(false);
          }
        });

        killProcess.on("error", (err) => {
          console.warn(`⚠️ Error killing process ${pid}:`, err.message);
          resolve(false);
        });
      });
    } else {
      // Unix: Kill negative PID to kill process group
      try {
        process.kill(-pid, signal);
        console.log(`✅ Killed process tree ${pid} (Unix)`);
        return true;
      } catch (err) {
        if (err.code === "ESRCH") {
          console.warn(`⚠️ Process ${pid} not found (already dead)`);
          return false;
        }
        throw err;
      }
    }
  } catch (err) {
    console.error(`❌ Failed to kill process ${pid}:`, err.message);
    return false;
  }
}

/*──────────────────────────────────────────────────────────────
| 🔌 Port Availability Utilities
|──────────────────────────────────────────────────────────────*/

/**
 * Check if a port is currently in use
 * @param {number} port - Port to check
 * @param {string} host - Host to check (default: 127.0.0.1)
 * @returns {Promise<boolean>} - True if port is in use
 */
export function isPortInUse(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    socket.setTimeout(800);
    
    socket.once("connect", () => {
      socket.destroy();
      resolve(true); // Port is in use
    });
    
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false); // Port is free
    });
    
    socket.once("error", (err) => {
      socket.destroy();
      if (err.code === "ECONNREFUSED") {
        resolve(false); // Port is free
      } else {
        resolve(false); // Assume free on other errors
      }
    });
    
    socket.connect(port, host);
  });
}

/**
 * Wait for a port to become available
 * @param {number} port - Port to check
 * @param {number} retries - Number of retries (default: 20)
 * @param {number} delayMs - Delay between retries (default: 500)
 * @returns {Promise<boolean>} - True if port became available
 */
export async function waitForPort(port, retries = 20, delayMs = 500) {
  for (let i = 0; i < retries; i++) {
    if (await isPortInUse(port)) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return false;
}

/**
 * Find the first available port starting from basePort
 * @param {number} basePort - Starting port number
 * @param {number} maxAttempts - Maximum ports to try (default: 10)
 * @returns {Promise<number>} - First available port, or -1 if none found
 */
export async function findAvailablePort(basePort = 3000, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = basePort + i;
    if (!(await isPortInUse(port))) {
      return port;
    }
  }
  console.warn(`⚠️ No available ports found in range ${basePort}-${basePort + maxAttempts}`);
  return -1;
}

/*──────────────────────────────────────────────────────────────
| 🎯 Find & Kill Process by Port
|──────────────────────────────────────────────────────────────*/

/**
 * Find the PID of process using a specific port
 * @param {number} port - Port number
 * @returns {Promise<number|null>} - PID if found, null otherwise
 */
export async function findProcessByPort(port) {
  try {
    if (process.platform === "win32") {
      // Windows: Use netstat
      const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
      const lines = stdout.split("\n").filter((line) => line.includes("LISTENING"));
      
      if (lines.length === 0) return null;
      
      // Extract PID from last column
      const match = lines[0].trim().split(/\s+/).pop();
      return match ? parseInt(match, 10) : null;
    } else {
      // Unix: Use lsof
      const { stdout } = await execAsync(`lsof -ti:${port}`);
      const pid = parseInt(stdout.trim(), 10);
      return isNaN(pid) ? null : pid;
    }
  } catch (err) {
    // Command failed, likely no process on port
    return null;
  }
}

/**
 * Kill process using a specific port
 * @param {number} port - Port number
 * @returns {Promise<boolean>} - True if process was killed
 */
export async function killProcessByPort(port) {
  console.log(`🔍 Looking for process on port ${port}...`);
  const pid = await findProcessByPort(port);
  
  if (!pid) {
    console.log(`✅ No process found on port ${port}`);
    return false;
  }
  
  console.log(`🔪 Killing process ${pid} on port ${port}...`);
  return await killProcessTree(pid);
}

/*──────────────────────────────────────────────────────────────
| 📋 Process Registry (Track Spawned Servers)
|──────────────────────────────────────────────────────────────*/

class ProcessRegistry {
  constructor() {
    this.processes = new Map(); // port -> { pid, name, startTime }
  }

  /**
   * Register a spawned process
   * @param {number} port - Port the process is using
   * @param {number} pid - Process ID
   * @param {string} name - Process name/description
   */
  register(port, pid, name = "unknown") {
    this.processes.set(port, {
      pid,
      name,
      startTime: Date.now(),
    });
    console.log(`📝 Registered process: ${name} (PID ${pid}) on port ${port}`);
  }

  /**
   * Unregister a process
   * @param {number} port - Port to unregister
   */
  unregister(port) {
    const proc = this.processes.get(port);
    if (proc) {
      this.processes.delete(port);
      console.log(`🗑️ Unregistered process on port ${port}`);
    }
  }

  /**
   * Kill all registered processes
   * @returns {Promise<number>} - Number of processes killed
   */
  async killAll() {
    let killed = 0;
    console.log(`🔪 Killing ${this.processes.size} registered process(es)...`);
    
    for (const [port, { pid, name }] of this.processes.entries()) {
      console.log(`  Killing ${name} (PID ${pid}) on port ${port}...`);
      const success = await killProcessTree(pid);
      if (success) killed++;
      this.unregister(port);
    }
    
    return killed;
  }

  /**
   * Get all registered processes
   * @returns {Array} - Array of process info objects
   */
  list() {
    return Array.from(this.processes.entries()).map(([port, info]) => ({
      port,
      ...info,
    }));
  }

  /**
   * Get count of registered processes
   * @returns {number}
   */
  count() {
    return this.processes.size;
  }
}

// Singleton instance
export const processRegistry = new ProcessRegistry();

/*──────────────────────────────────────────────────────────────
| 🧹 Cleanup Helpers
|──────────────────────────────────────────────────────────────*/

/**
 * Setup graceful shutdown handlers
 * Automatically kills all registered processes on exit
 */
export function setupGracefulShutdown() {
  const cleanup = async () => {
    console.log("\n💤 Graceful shutdown initiated...");
    await processRegistry.killAll();
    process.exit(0);
  };

  process.on("exit", () => {
    if (processRegistry.count() > 0) {
      console.log("\n⚠️ Processes still registered on exit");
    }
  });

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("SIGQUIT", cleanup);
}

/**
 * Kill common development server ports
 * Useful for cleaning up after crashed scripts
 * @returns {Promise<number>} - Number of processes killed
 */
export async function killCommonPorts() {
  const commonPorts = [3000, 3001, 4173, 5173, 5174, 5175, 5176, 5177, 5178, 5179, 8080];
  let killed = 0;

  console.log("🧹 Cleaning up common development ports...");
  
  for (const port of commonPorts) {
    const success = await killProcessByPort(port);
    if (success) killed++;
  }

  console.log(`✅ Cleaned ${killed} port(s)`);
  return killed;
}

/*──────────────────────────────────────────────────────────────
| 🚀 CLI Usage (if run directly)
|──────────────────────────────────────────────────────────────*/

if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  const arg = process.argv[3];

  switch (command) {
    case "kill-port":
      if (!arg) {
        console.error("Usage: node cleanup.js kill-port <port>");
        process.exit(1);
      }
      await killProcessByPort(parseInt(arg, 10));
      break;

    case "kill-common":
      await killCommonPorts();
      break;

    case "find-port":
      if (!arg) {
        console.error("Usage: node cleanup.js find-port <port>");
        process.exit(1);
      }
      const pid = await findProcessByPort(parseInt(arg, 10));
      if (pid) {
        console.log(`✅ Process ${pid} is using port ${arg}`);
      } else {
        console.log(`✅ Port ${arg} is free`);
      }
      break;

    case "check-port":
      if (!arg) {
        console.error("Usage: node cleanup.js check-port <port>");
        process.exit(1);
      }
      const inUse = await isPortInUse(parseInt(arg, 10));
      console.log(`Port ${arg}: ${inUse ? "❌ IN USE" : "✅ FREE"}`);
      break;

    default:
      console.log(`
🧹 Process & Port Cleanup Utilities

Usage:
  node cleanup.js kill-port <port>    - Kill process on specific port
  node cleanup.js kill-common         - Kill processes on common dev ports
  node cleanup.js find-port <port>    - Find PID using port
  node cleanup.js check-port <port>   - Check if port is in use

Examples:
  node cleanup.js kill-port 4173
  node cleanup.js kill-common
  node cleanup.js find-port 3000
  node cleanup.js check-port 5173
      `);
      process.exit(1);
  }
}

