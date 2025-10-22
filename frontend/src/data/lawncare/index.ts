/**
 * Lawncare Industry Config Loader
 * Assembles modular config files into MainSiteConfig structure
 * 
 * NOTE: This industry is not yet fully configured. Placeholder files are used
 * to establish the modular architecture pattern. The old site.json is still
 * available as a reference/backup.
 */

import type { MainSiteConfig } from '@shared/types/location';

/**
 * Load and assemble lawncare config from modular files
 * Falls back to legacy site.json data structure for now
 */
export async function loadLawncareConfig(): Promise<MainSiteConfig> {
  // TODO: Populate modular files with actual lawncare data
  // Legacy import temporarily disabled to fix Vite build issues
  // const legacyConfig = await import('./_archive/site.json.bak');
  // return legacyConfig.default as MainSiteConfig;
  
  throw new Error('Lawncare config not yet implemented. Please populate modular files.');
}

