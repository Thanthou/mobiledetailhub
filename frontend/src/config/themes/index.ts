import { unifiedTheme, businessVariations } from './unified/config';
import type { Theme, ThemeName, BusinessVariation, UnifiedThemeConfig } from './types';

// Export the unified theme
export { unifiedTheme, businessVariations } from './unified/config';

// Export types
export type { Theme, ThemeName, BusinessVariation, BusinessVariations, UnifiedThemeConfig } from './types';

// Theme registry - single unified theme
export const themes: Record<ThemeName, Theme> = {
  unified: unifiedTheme,
};

// Current business theme (always unified, but business varies)
let currentBusiness: string | null = null;

export function setCurrentBusiness(businessSlug: string) {
  console.log('setCurrentBusiness called with:', businessSlug);
  console.log('Previous business was:', currentBusiness);
  currentBusiness = businessSlug;
  console.log('Business set to:', currentBusiness);
}

export function getCurrentBusiness(): string | null {
  return currentBusiness;
}

export function getCurrentTheme(): Theme {
  console.log('getCurrentTheme called, returning unified theme');
  return themes.unified;
}

export function getBusinessVariation(businessSlug: string): BusinessVariation | null {
  console.log('getBusinessVariation called for:', businessSlug);
  const variation = businessVariations[businessSlug as keyof typeof businessVariations];
  if (variation) {
    console.log('Business variation found:', variation);
  } else {
    console.error('Business variation not found for:', businessSlug);
  }
  return variation || null;
}

export function getUnifiedThemeConfig(businessSlug: string): UnifiedThemeConfig | null {
  console.log('getUnifiedThemeConfig called for:', businessSlug);
  const business = getBusinessVariation(businessSlug);
  if (!business) {
    console.error('No business variation found for:', businessSlug);
    return null;
  }
  
  const config: UnifiedThemeConfig = {
    theme: getCurrentTheme(),
    business: business,
  };
  
  console.log('Unified theme config created:', config);
  return config;
}

// Legacy function for backward compatibility (deprecated)
export function setCurrentTheme(themeName: ThemeName) {
  console.warn('setCurrentTheme is deprecated. Use setCurrentBusiness instead.');
  // No-op since we only have one theme now
}
