// scripts/devtools/cli/update-oauth-redirect.js
import fs from 'fs';
import path from 'path';

/**
 * Update Google OAuth redirect URI in .env file with dynamic backend port
 * @param {boolean} silent - Suppress console output (default: true for server startup)
 */
function updateOAuthRedirect(silent = true) {
  try {
    // Look for .env in current directory or parent directory
    const envPath = fs.existsSync('.env') 
      ? '.env' 
      : path.join(process.cwd(), '../.env');
    
    if (!fs.existsSync(envPath)) {
      if (!silent) console.log('❌ .env file not found');
      return;
    }

    // Read current .env content
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Get current backend port from .port-registry.json
    let backendPort = 3001;
    try {
      const registryPath = fs.existsSync('.port-registry.json') 
        ? '.port-registry.json' 
        : path.join(process.cwd(), '../.port-registry.json');
      const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      backendPort = registry.backend?.port || 3001;
    } catch (error) {
      // Silently use default
    }

    // Update GOOGLE_REDIRECT_URI
    const newRedirectUri = `http://localhost:${backendPort}/api/google/oauth/callback`;
    
    // Replace the redirect URI
    const redirectUriRegex = /GOOGLE_REDIRECT_URI=.*/;
    const existingUri = envContent.match(redirectUriRegex)?.[0].split('=')[1];
    
    if (existingUri !== newRedirectUri) {
      if (redirectUriRegex.test(envContent)) {
        envContent = envContent.replace(redirectUriRegex, `GOOGLE_REDIRECT_URI=${newRedirectUri}`);
      } else {
        // Add it if it doesn't exist
        envContent += `\nGOOGLE_REDIRECT_URI=${newRedirectUri}\n`;
      }
      
      // Write back to .env
      fs.writeFileSync(envPath, envContent);
      
      // Only log if not silent
      if (!silent) {
        console.log(`✅ Updated GOOGLE_REDIRECT_URI to: ${newRedirectUri}`);
      }
    }
    
  } catch (error) {
    if (!silent) console.error('❌ Failed to update .env file:', error.message);
  }
}

// Run if called directly (not silent when run from CLI)
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  updateOAuthRedirect(false); // Show output when run manually
}

export { updateOAuthRedirect };
