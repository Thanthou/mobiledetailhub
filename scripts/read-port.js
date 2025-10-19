#!/usr/bin/env node
import { readRegistry } from './automation/port-registry.js';

const appName = process.argv[2];
const registry = readRegistry();

if (!appName) {
  console.error('❌ Usage: node read-port.js <app-name>');
  console.log('Available apps:', Object.keys(registry).join(', '));
  process.exit(1);
}

if (!registry[appName]) {
  console.error(`❌ No port registered for ${appName}`);
  console.log('Available apps:', Object.keys(registry).join(', '));
  process.exit(1);
}

console.log(registry[appName]);
