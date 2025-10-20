#!/usr/bin/env node
/**
 * Setup Hosts Script
 * Checks and guides user to configure localhost subdomains for Dev Hub
 */
import fs from 'fs';
import os from 'os';

const hostsFile = os.platform() === 'win32' 
  ? 'C:\\Windows\\System32\\drivers\\etc\\hosts'
  : '/etc/hosts';

const entries = [
  '127.0.0.1 admin.localhost', 
  '127.0.0.1 tenant.localhost'
];

console.log('\n🔧 That Smart Site - Hosts Setup\n');
console.log(`📁 Hosts file: ${hostsFile}\n`);

try {
  const hostsContent = fs.readFileSync(hostsFile, 'utf8');
  
  // Check each entry individually
  const missing = entries.filter(entry => !hostsContent.includes(entry.split(' ')[1]));
  
  if (missing.length === 0) {
    console.log('✅ All localhost subdomains are configured!\n');
    console.log('You can now run the Dev Hub:');
    console.log('   npm run dev:hub\n');
  } else {
    console.log('⚠️  Missing subdomain entries:\n');
    missing.forEach(entry => console.log(`   ${entry}`));
    console.log('\n📝 Setup Instructions:\n');
    
    if (os.platform() === 'win32') {
      console.log('   Windows:');
      console.log('   1. Open Notepad as Administrator');
      console.log('   2. Open: C:\\Windows\\System32\\drivers\\etc\\hosts');
      console.log('   3. Add the entries above at the end of the file');
      console.log('   4. Save and close\n');
    } else {
      console.log('   Mac/Linux:');
      console.log('   1. Run: sudo nano /etc/hosts');
      console.log('   2. Add the entries above at the end of the file');
      console.log('   3. Press Ctrl+X, then Y, then Enter to save\n');
    }
    
    console.log('💡 Why these entries are needed:');
    console.log('   The Dev Hub (port 8080) routes requests based on hostname.');
    console.log('   These entries tell your OS to resolve *.localhost to 127.0.0.1\n');
  }
} catch (error) {
  console.error('❌ Could not read hosts file:', error.message);
  console.log('\n📝 Please manually add these entries:\n');
  entries.forEach(entry => console.log(`   ${entry}`));
  console.log('');
}
