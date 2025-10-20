// scripts/devtools/cli/port-discovery.js
import fs from 'fs';
import path from 'path';

/**
 * Get the current frontend port from .port-registry.json
 */
export function getFrontendPort() {
  try {
    const portFile = path.join(process.cwd(), '.port-registry.json');
    if (fs.existsSync(portFile)) {
      const registry = JSON.parse(fs.readFileSync(portFile, 'utf8'));
      return registry.main?.port || 5175;
    }
  } catch (error) {
    console.warn('Could not read frontend port from registry, using default 5175');
  }
  return 5175;
}

/**
 * Get the current backend port from .port-registry.json
 */
export function getBackendPort() {
  try {
    const portFile = path.join(process.cwd(), '.port-registry.json');
    if (fs.existsSync(portFile)) {
      const registry = JSON.parse(fs.readFileSync(portFile, 'utf8'));
      return registry.backend?.port || 3001;
    }
  } catch (error) {
    console.warn('Could not read backend port from registry, using default 3001');
  }
  return 3001;
}

/**
 * Get frontend URL with dynamic port
 */
export function getFrontendUrl() {
  const port = getFrontendPort();
  return `http://localhost:${port}`;
}

/**
 * Get backend URL with dynamic port
 */
export function getBackendUrl() {
  const port = getBackendPort();
  return `http://localhost:${port}`;
}

/**
 * Get all possible frontend ports (for CORS)
 */
export function getFrontendPorts() {
  return [5175, 5176, 5177, 5178, 5179, 5180];
}

/**
 * Get all possible backend ports (for CORS)
 */
export function getBackendPorts() {
  return [3001, 3002, 3003, 3004, 3005, 3006];
}

// If run directly, output current ports
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Frontend Port:', getFrontendPort());
  console.log('Backend Port:', getBackendPort());
  console.log('Frontend URL:', getFrontendUrl());
  console.log('Backend URL:', getBackendUrl());
}
