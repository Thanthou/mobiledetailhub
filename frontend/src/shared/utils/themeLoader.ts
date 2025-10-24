/**
 * Theme Loader
 * 
 * Loads theme definitions and applies them as CSS variables
 */

export interface Theme {
  name: string;
  displayName: string;
  description: string;
  colors: {
    primary: string;
    'primary-hover': string;
    'primary-light': string;
    'primary-dark': string;
    background: string;
    surface: string;
    'surface-light': string;
    'surface-hover': string;
    text: string;
    'text-muted': string;
    'text-dim': string;
    'text-dark'?: string;
    'text-dark-muted'?: string;
    'text-dark-dim'?: string;
    'text-light'?: string;
    'text-light-muted'?: string;
    'text-light-dim'?: string;
    border: string;
    'border-light': string;
    'border-dark': string;
  };
  tailwind: {
    primary: string;
    'primary-hover': string;
    'primary-light': string;
    'primary-dark': string;
    background: string;
    surface: string;
    text: string;
    'text-muted': string;
    'text-dim': string;
  };
}

/**
 * Load a theme by name
 */
export async function loadTheme(themeName: string): Promise<Theme> {
  try {
    // Explicit imports for Vite's static analysis
    let theme;
    switch (themeName) {
      case 'sunset':
        theme = await import('@shared/themes/sunset.json');
        break;
      case 'housecleaning':
        theme = await import('@shared/themes/housecleaning.json');
        break;
      case 'ecofriendly':
        theme = await import('@shared/themes/ecofriendly.json');
        break;
      case 'premium':
        theme = await import('@shared/themes/premium.json');
        break;
      default:
        throw new Error(`Unknown theme: ${themeName}`);
    }
    return theme.default || theme;
  } catch (error) {
    console.error(`Failed to load theme: ${themeName}`, error);
    throw new Error(`Theme "${themeName}" not found`);
  }
}

/**
 * Apply theme colors as CSS variables to :root
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  
  // Apply each color as a CSS variable
  Object.entries(theme.colors).forEach(([key, value]) => {
    const varName = `--color-${key}`;
    root.style.setProperty(varName, value);
  });
  
  // Store current theme name as data attribute
  root.setAttribute('data-theme', theme.name);
  
  console.log(`✅ Applied theme: ${theme.displayName}`);
}

/**
 * Load and apply theme by name
 */
export async function loadAndApplyTheme(themeName: string): Promise<Theme> {
  const theme = await loadTheme(themeName);
  applyTheme(theme);
  return theme;
}

/**
 * Get the currently active theme name
 */
export function getCurrentTheme(): string | null {
  return document.documentElement.getAttribute('data-theme');
}

