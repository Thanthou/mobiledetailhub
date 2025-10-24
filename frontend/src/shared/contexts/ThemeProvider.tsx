/**
 * Theme Provider
 * 
 * Loads and applies themes based on industry or theme name.
 * Applies CSS variables to :root for use throughout the app.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadAndApplyTheme, type Theme } from '@shared/utils/themeLoader';

interface ThemeContextValue {
  theme: Theme | null;
  themeName: string | null;
  isLoading: boolean;
  error: string | null;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: null,
  themeName: null,
  isLoading: true,
  error: null,
});

interface ThemeProviderProps {
  children: React.ReactNode;
  themeName?: string;
  industry?: string;
}

/**
 * Theme Provider Component
 * 
 * Loads theme by name or by industry default.
 * Applies CSS variables for use with Tailwind utilities.
 */
export function ThemeProvider({ children, themeName, industry }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedThemeName, setResolvedThemeName] = useState<string | null>(null);

  useEffect(() => {
    async function loadThemeConfig() {
      setIsLoading(true);
      setError(null);

      try {
        let themeToLoad = themeName;

        // If no theme name provided, try to load from industry config
        if (!themeToLoad && industry) {
          try {
            // Explicit imports for Vite's static analysis
            let industryThemeConfig;
            switch (industry) {
              case 'mobile-detailing':
                industryThemeConfig = await import('@data/mobile-detailing/theme.json');
                break;
              case 'maid-service':
                industryThemeConfig = await import('@data/maid-service/theme.json');
                break;
              default:
                console.warn(`No theme config for industry: ${industry}, using default`);
                break;
            }
            if (industryThemeConfig) {
              themeToLoad = (industryThemeConfig.default || industryThemeConfig).theme;
            }
          } catch (err) {
            console.warn(`Failed to load theme config for industry: ${industry}`, err);
          }
          
          // Fallback to sunset if no theme loaded
          if (!themeToLoad) {
            themeToLoad = 'sunset';
          }
        }

        // Final fallback
        if (!themeToLoad) {
          themeToLoad = 'sunset';
        }

        // Load and apply the theme
        const loadedTheme = await loadAndApplyTheme(themeToLoad);
        setTheme(loadedTheme);
        setResolvedThemeName(themeToLoad);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load theme';
        setError(errorMessage);
        console.error('Theme loading error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    void loadThemeConfig();
  }, [themeName, industry]);

  const contextValue: ThemeContextValue = {
    theme,
    themeName: resolvedThemeName,
    isLoading,
    error,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

