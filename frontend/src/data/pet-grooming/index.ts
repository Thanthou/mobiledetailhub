/**
 * Pet Grooming Industry Config Loader
 * Assembles modular config files into MainSiteConfig structure
 * 
 * NOTE: This industry is not yet fully configured. Placeholder files are used
 * to establish the modular architecture pattern. The old site.json is still
 * available as a reference/backup.
 */

import type { MainSiteConfig } from '@/shared/types/location';

/**
 * Load and assemble pet-grooming config from modular files
 * Falls back to legacy site.json data structure for now
 */
export async function loadPetGroomingConfig(): Promise<MainSiteConfig> {
  // TODO: Populate modular files with actual pet grooming data
  // For now, import the legacy site.json from archive as fallback
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Legacy JSON import, typing refactor planned
  const legacyConfig = await import('./_archive/site.json.legacy');
  
  // Return legacy config until modular files are populated
  // Once populated, replace with assembled config like mobile-detailing
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Legacy JSON import, typing refactor planned
  return legacyConfig.default as MainSiteConfig;
}

