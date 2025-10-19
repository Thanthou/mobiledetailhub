#!/usr/bin/env node
import fs from 'fs';
import os from 'os';

const hostsFile = os.platform() === 'win32' 
  ? 'C:\\Windows\\System32\\drivers\\etc\\hosts'
  : '/etc/hosts';

const entries = [
  '127.0.0.1 main.localhost',
  '127.0.0.1 admin.localhost', 
  '127.0.0.1 tenant.localhost'
];

console.log('🔧 Setting up localhost subdomains...');
console.log(`📁 Hosts file: ${hostsFile}`);

try {
  const hostsContent = fs.readFileSync(hostsFile, 'utf8');
  
  // Check if entries already exist
  const hasEntries = entries.some(entry => hostsContent.includes(entry.split(' ')[1]));
  
  if (hasEntries) {
    console.log('✅ Localhost subdomains already configured');
  } else {
    console.log('⚠️  Please add these entries to your hosts file:');
    console.log('');
    entries.forEach(entry => console.log(`   ${entry}`));
    console.log('');
    console.log('📝 Instructions:');
    if (os.platform() === 'win32') {
      console.log('   1. Run as Administrator');
      console.log('   2. Open: C:\\Windows\\System32\\drivers\\etc\\hosts');
      console.log('   3. Add the entries above');
    } else {
      console.log('   1. Run: sudo nano /etc/hosts');
      console.log('   2. Add the entries above');
      console.log('   3. Save and exit');
    }
  }
} catch (error) {
  console.log('⚠️  Could not read hosts file:', error.message);
  console.log('📝 Please manually add these entries to your hosts file:');
  console.log('');
  entries.forEach(entry => console.log(`   ${entry}`));
}
