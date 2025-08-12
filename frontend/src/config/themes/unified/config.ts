import { Theme } from '../types';

// Base theme that's shared across all businesses
const baseTheme = {
  colors: {
    primary: {
      50: '#f0faff', // Light sky blue
      100: '#e0f7ff',
      200: '#bae8ff',
      300: '#7fd3ff',
      400: '#4bbcff',
      500: '#1aa5ff', // Main ocean blue
      600: '#008ee0',
      700: '#006fad',
      800: '#005580',
      900: '#004266',
    },
    secondary: {
      50: '#fffdf7', // Sand
      100: '#fff8e7',
      200: '#fef0c2',
      300: '#fde08e',
      400: '#fbc14d',
      500: '#f4a72c', // Golden sand
      600: '#d68b1f',
      700: '#a96717',
      800: '#804f12',
      900: '#663e0e',
    },
    accent: {
      50: '#fff5f2', // Coral tint
      100: '#ffe8e1',
      200: '#ffd1c6',
      300: '#ffb3a3',
      400: '#ff8a73',
      500: '#ff654d', // Coral highlight
      600: '#e84c37',
      700: '#b8382a',
      800: '#8c2a20',
      900: '#6b2018',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  transitions: {
    default: '150ms ease-in-out',
    fast: '100ms ease-in-out',
    slow: '300ms ease-in-out',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
  images: {
    hero: '/themes/beach/images/hero.png',
    auto: '/themes/beach/images/auto.png',
    marine: '/themes/beach/images/marine.png',
    rv: '/themes/beach/images/rv.png',
  },
};

// Business-specific variations
export const businessVariations = {
  mdh: {
    business: {
      name: 'Mobile Detail Hub',
      tagline: 'Premium Mobile Detailing',
      description: 'Professional mobile detailing services across Southern California',
    },
    hero: {
      headline: 'Premium Mobile Detailing',
      subheadline: 'Professional Care for Your Vehicle',
      ctaText: 'Book Now',
      ctaSubtext: 'Get a free quote today',
    },
    services: {
      auto: {
        title: 'Auto Detailing',
        description: 'Complete interior and exterior detailing for cars and trucks',
        highlights: ['Interior deep cleaning', 'Exterior wash & wax', 'Paint correction available'],
      },
      marine: {
        title: 'Marine Detailing',
        description: 'Specialized boat and marine vehicle detailing services',
        highlights: ['Hull cleaning', 'Interior sanitization', 'UV protection'],
      },
      rv: {
        title: 'RV Detailing',
        description: 'Comprehensive RV and motorhome detailing solutions',
        highlights: ['Full interior cleaning', 'Exterior wash & wax', 'Storage preparation'],
      },
    },
    locations: [
      'Los Angeles, CA',
      'Orange County, CA',
      'San Diego, CA',
      'Riverside, CA',
      'San Bernardino, CA'
    ],
    contact: {
      phone: '(702) 420-6066',
      email: 'service@mobiledetailhub.com',
      hours: 'Mon-Sat: 8AM-6PM',
    },
  },
  jps: {
    business: {
      name: "JP's Mobile Detail",
      tagline: 'Southwest Excellence in Mobile Detailing',
      description: 'Professional mobile detailing services in the Southwest region',
    },
    hero: {
      headline: "JP's Mobile Detail",
      subheadline: 'Southwest Excellence in Mobile Detailing',
      ctaText: 'Book Now',
      ctaSubtext: 'Serving the Southwest region',
    },
    services: {
      auto: {
        title: 'Auto Detailing',
        description: 'Complete interior and exterior detailing for cars and trucks',
        highlights: ['Interior deep cleaning', 'Exterior wash & wax', 'Paint correction available'],
      },
      marine: {
        title: 'Marine Detailing',
        description: 'Specialized boat and marine vehicle detailing services',
        highlights: ['Hull cleaning', 'Interior sanitization', 'UV protection'],
      },
      rv: {
        title: 'RV Detailing',
        description: 'Comprehensive RV and motorhome detailing solutions',
        highlights: ['Full interior cleaning', 'Exterior wash & wax', 'Storage preparation'],
      },
    },
    locations: [
      'Bullhead City, AZ',
      'Laughlin, NV',
      'Mohave Valley, AZ',
      'Needles, CA',
      'Fort Mohave, AZ',
      'Katherine Landing, AZ',
      'Lake Havasu City, AZ',
      'Lake Mohave',
      'Colorado River'
    ],
    contact: {
      phone: '(702) 420-3151',
      email: 'service@jpsmobiledetail.com',
      hours: 'Mon-Sat: 8AM-6PM',
    },
  },
  abc: {
    business: {
      name: 'ABC Mobile Detail',
      tagline: 'Professional Mobile Detailing Services',
      description: 'Quality mobile detailing services for all vehicle types',
    },
    hero: {
      headline: 'ABC Mobile Detail',
      subheadline: 'Professional Care for Your Vehicle',
      ctaText: 'Book Now',
      ctaSubtext: 'Get a free quote today',
    },
    services: {
      auto: {
        title: 'Auto Detailing',
        description: 'Complete interior and exterior detailing for cars and trucks',
        highlights: ['Interior deep cleaning', 'Exterior wash & wax', 'Paint correction available'],
      },
      marine: {
        title: 'Marine Detailing',
        description: 'Specialized boat and marine vehicle detailing services',
        highlights: ['Hull cleaning', 'Interior sanitization', 'UV protection'],
      },
      rv: {
        title: 'RV Detailing',
        description: 'Comprehensive RV and motorhome detailing solutions',
        highlights: ['Full interior cleaning', 'Exterior wash & wax', 'Storage preparation'],
      },
    },
    locations: [
      'Your City, ST',
      'Nearby City, ST'
    ],
    contact: {
      phone: '(702) 420-6066',
      email: 'service@abcmobiledetail.com',
      hours: 'Mon-Sat: 8AM-6PM',
    },
  },
};

// Export the unified theme
export const unifiedTheme: Theme = baseTheme;
