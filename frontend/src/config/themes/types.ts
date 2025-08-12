// Theme type definitions
export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

export interface ThemeTypography {
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
    black: string;
  };
}

export interface ThemeSpacing {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
  40: string;
  48: string;
  56: string;
  64: string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeTransitions {
  default: string;
  fast: string;
  slow: string;
}

export interface ThemeBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeZIndex {
  hide: number;
  auto: string;
  base: number;
  docked: number;
  dropdown: number;
  sticky: number;
  banner: number;
  overlay: number;
  modal: number;
  popover: number;
  skipLink: number;
  toast: number;
  tooltip: number;
}

export interface ThemeImages {
  hero: string;
  auto: string;
  marine: string;
  rv: string;
}

export interface Theme {
  colors: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    accent: Record<string, string>;
    neutral: Record<string, string>;
  };
  typography: {
    fontFamily: {
      sans: string[];
      serif: string[];
      mono: string[];
    };
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  transitions: Record<string, string>;
  breakpoints: Record<string, string>;
  zIndex: Record<string, string | number>;
  images: {
    hero: string;
    auto: string;
    marine: string;
    rv: string;
  };
}

export type ThemeName = 'unified';

export interface BusinessVariation {
  business: {
    name: string;
    tagline: string;
    description: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaSubtext: string;
  };
  services: {
    auto: {
      title: string;
      description: string;
      highlights: string[];
    };
    marine: {
      title: string;
      description: string;
      highlights: string[];
    };
    rv: {
      title: string;
      description: string;
      highlights: string[];
    };
  };
  locations: string[];
  contact: {
    phone: string;
    email: string;
    hours: string;
  };
}

export interface BusinessVariations {
  mdh: BusinessVariation;
  jps: BusinessVariation;
  abc: BusinessVariation;
}

export interface UnifiedThemeConfig {
  theme: Theme;
  business: BusinessVariation;
}
