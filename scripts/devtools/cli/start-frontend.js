// scripts/start-frontend.js
import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';

// Read the port from .port-registry.json
let port = 5175;
try {
  const registry = JSON.parse(fs.readFileSync('.port-registry.json', 'utf8'));
  port = registry.main?.port || 5175;
} catch (error) {
  console.warn('⚠️ No .port-registry.json found, using default port 5175');
}

console.log(`🚀 Starting frontend on port ${port}...`);

// Change to frontend directory and run vite
process.chdir('frontend');

// Use npx to ensure we get the locally installed vite
// Let Vite handle port conflicts gracefully (it will auto-increment if needed)
const vite = spawn('npx', ['vite', '--port', port.toString(), '--host'], {
  stdio: 'inherit',
  shell: true // This helps with Windows compatibility
});

vite.on('error', (error) => {
  console.error('❌ Failed to start Vite:', error.message);
  process.exit(1);
});

vite.on('close', (code) => {
  console.log(`Frontend process exited with code ${code}`);
});
