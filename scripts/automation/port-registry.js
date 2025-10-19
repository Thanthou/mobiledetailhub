import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.join(__dirname, "../../.port-registry.json");

export function updateRegistry(app, port) {
  const registry = fs.existsSync(REGISTRY_PATH)
    ? JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"))
    : {};
  registry[app] = port;
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
  console.log(`🗂️ Port registry updated: ${app} → ${port}`);
}

export function readRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) return {};
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));
}

export function clearRegistry() {
  if (fs.existsSync(REGISTRY_PATH)) {
    fs.unlinkSync(REGISTRY_PATH);
    console.log("🗑️ Port registry cleared");
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  const app = process.argv[3];
  const port = process.argv[4];
  
  if (command === 'update' && app && port) {
    updateRegistry(app, parseInt(port));
  } else if (command === 'read') {
    console.log(JSON.stringify(readRegistry(), null, 2));
  } else if (command === 'clear') {
    clearRegistry();
  } else {
    console.log('Usage: node port-registry.js [update|read|clear] [app] [port]');
  }
}
