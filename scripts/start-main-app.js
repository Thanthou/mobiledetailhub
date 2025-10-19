#!/usr/bin/env node
import { spawn } from 'child_process';
import net from 'net';
import { updateRegistry } from './automation/port-registry.js';

// Find free port function
function findFreePort(startPort = 5175, maxTries = 10) {
  return new Promise((resolve, reject) => {
    let port = startPort;
    let tries = 0;

    const tryPort = () => {
      if (tries >= maxTries) {
        reject(new Error(`No free port found starting from ${startPort}`));
        return;
      }

      const server = net.createServer()
        .once('error', () => {
          port++;
          tries++;
          tryPort();
        })
        .once('listening', () => {
          server.close(() => {
            resolve(port);
          });
        })
        .listen(port, '0.0.0.0');
    };

    tryPort();
  });
}

// Find free port and register it
console.log('🔍 Finding free port for main app...');
const port = await findFreePort(5175, 10);
updateRegistry('main', port);

console.log(`🚀 Starting main app on port ${port}...`);

// Change to frontend directory and start Vite
process.chdir('frontend');

const vite = spawn('npx', ['vite', '--config', 'vite.config.main.ts', '--port', port, '--host'], {
  stdio: 'inherit',
  shell: true
});

vite.on('error', (error) => {
  console.error('❌ Failed to start main app:', error.message);
  process.exit(1);
});

vite.on('close', (code) => {
  console.log(`Main app process exited with code ${code}`);
});
