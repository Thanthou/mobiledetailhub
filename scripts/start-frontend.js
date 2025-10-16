// scripts/start-frontend.js
import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';

// Read the port from .frontend-port.json
let port = 5175;
try {
  const data = JSON.parse(fs.readFileSync('.frontend-port.json', 'utf8'));
  port = data.port;
} catch (error) {
  console.warn('⚠️ No .frontend-port.json found, using default port 5175');
}

console.log(`🚀 Starting frontend on port ${port}...`);

// Change to frontend directory and run vite
process.chdir('frontend');

// Use npx to ensure we get the locally installed vite
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
