// scripts/devtools/cli/find-free-backend-port.js
import net from "net";
import fs from "fs";

const basePort = 3001;
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
 * @param {number} startPort - Starting port number (default: 3001)
 * @param {number} maxAttempts - Maximum attempts (default: 10)
 * @returns {Promise<number>} - Available port number
 */
export async function findFreeBackendPort(startPort = basePort, maxAttempts = maxTries) {
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
 * Find free backend port and save to .port-registry.json
 */
async function findAndSaveBackendPort() {
  try {
    const port = await findFreeBackendPort();
    
    // Update .port-registry.json instead of separate file
    const registryPath = ".port-registry.json";
    let registry = { backend: { port: 3001, host: "localhost" } };
    
    if (fs.existsSync(registryPath)) {
      registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
    }
    
    registry.backend = { ...registry.backend, port };
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
    
    console.log(`🟢 Using port ${port}`);
    return port;
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
  }
}

// Run as CLI script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  findAndSaveBackendPort();
}
