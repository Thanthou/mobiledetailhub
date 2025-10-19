// scripts/devtools/cli/update-oauth-redirect.js
import fs from 'fs';
import path from 'path';

/**
 * Update Google OAuth redirect URI in .env file with dynamic backend port
 */
function updateOAuthRedirect() {
  try {
    // Look for .env in current directory or parent directory
    const envPath = fs.existsSync('.env') 
      ? '.env' 
      : path.join(process.cwd(), '../.env');
    
    if (!fs.existsSync(envPath)) {
      console.log('❌ .env file not found');
      return;
    }

    // Read current .env content
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Get current backend port
    let backendPort = 3001;
    try {
      const portFilePath = fs.existsSync('.backend-port.json') 
        ? '.backend-port.json' 
        : path.join(process.cwd(), '../.backend-port.json');
      const portData = JSON.parse(fs.readFileSync(portFilePath, 'utf8'));
      backendPort = portData.port;
    } catch (error) {
      console.log('⚠️ No .backend-port.json found, using default port 3001');
    }

    // Update GOOGLE_REDIRECT_URI
    const newRedirectUri = `http://localhost:${backendPort}/api/google/oauth/callback`;
    
    // Replace the redirect URI
    const redirectUriRegex = /GOOGLE_REDIRECT_URI=.*/;
    if (redirectUriRegex.test(envContent)) {
      envContent = envContent.replace(redirectUriRegex, `GOOGLE_REDIRECT_URI=${newRedirectUri}`);
      console.log(`✅ Updated GOOGLE_REDIRECT_URI to: ${newRedirectUri}`);
    } else {
      // Add it if it doesn't exist
      envContent += `\nGOOGLE_REDIRECT_URI=${newRedirectUri}\n`;
      console.log(`✅ Added GOOGLE_REDIRECT_URI: ${newRedirectUri}`);
    }

    // Write back to .env
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully');
    
  } catch (error) {
    console.error('❌ Failed to update .env file:', error.message);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateOAuthRedirect();
}

export { updateOAuthRedirect };
