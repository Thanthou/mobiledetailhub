// scripts/devtools/cli/find-free-port.js
import net from "net";
import fs from "fs";

const basePort = 5175;
const maxTries = 10;

/**
 * Check if a port is available
 * @param {number} port - Port number to check
 * @returns {Promise<boolean>} - True if port is free
 */
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once("error", (err) => {
        console.log(`⚠️ Port ${port} in use: ${err.code}`);
        resolve(false);
      })
      .once("listening", () => {
        server.close(() => {
          console.log(`🟢 Port ${port} is free`);
          resolve(true);
        });
      })
      .listen(port, '0.0.0.0');
  });
}

/**
 * Find the first available port starting from basePort
 * @param {number} startPort - Starting port number (default: 5175)
 * @param {number} maxAttempts - Maximum attempts (default: 10)
 * @returns {Promise<number>} - Available port number
 */
export async function findFreePort(startPort = basePort, maxAttempts = maxTries) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    const free = await checkPort(port);
    if (free) {
      return port;
    }
  }
  throw new Error(`No free port found between ${startPort} and ${startPort + maxAttempts}`);
}

/**
 * Find free port and save to file (CLI script behavior)
 */
async function findAndSavePort() {
  try {
    const port = await findFreePort();
    fs.writeFileSync(".frontend-port.json", JSON.stringify({ port }));
    console.log(`🟢 Using port ${port}`);
    return port;
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
  }
}

// Run as CLI script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  findAndSavePort();
}
