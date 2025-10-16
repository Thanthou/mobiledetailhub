#!/usr/bin/env node

// Cross-platform port killer for npm prestart
// Frees the port defined in PORT (default 3001) before starting the server

const { execSync } = require('child_process');

const PORT = process.env.PORT || '3001';

function killOnWindows(port) {
  try {
    // Find PID(s) listening on the port
    const cmd = `PowerShell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique"`;
    const output = execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (!output) return 0;
    const pids = output.split(/\s+/).filter(Boolean);
    pids.forEach(pid => {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      } catch {}
    });
    return pids.length;
  } catch {
    return 0;
  }
}

function killOnUnix(port) {
  let killed = 0;
  try {
    // Try lsof
    const out = execSync(`lsof -ti :${port}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (out) {
      out.split(/\s+/).filter(Boolean).forEach(pid => {
        try {
          execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
          killed++;
        } catch {}
      });
      return killed;
    }
  } catch {}

  try {
    // Fallback to fuser
    execSync(`fuser -k ${port}/tcp`, { stdio: 'ignore' });
    // If no error, assume at least one was killed
    return 1;
  } catch {
    return killed;
  }
}

function main() {
  const isWindows = process.platform === 'win32';
  const killed = isWindows ? killOnWindows(PORT) : killOnUnix(PORT);
  if (killed > 0) {
    console.log(`✅ Freed port ${PORT} (killed ${killed} process${killed > 1 ? 'es' : ''})`);
  } else {
    console.log(`ℹ️ Port ${PORT} was free`);
  }
}

try {
  main();
} catch (e) {
  // Never fail prestart; just log minimal info
  console.log(`ℹ️ Port cleanup skipped: ${e.message}`);
}


