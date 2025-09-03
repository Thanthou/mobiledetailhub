// Hero configuration constants
export const HERO_CONSTANTS = {
  IMAGES: [
    '/images/hero/hero1.png',
    '/images/hero/hero2.png',
  ].filter(Boolean),
  
  // Responsive image sources for different screen sizes
  RESPONSIVE_IMAGES: {
    image1: {
      avif: '/images/hero/hero1.avif',
      webp: {
        sm: '/images/hero/hero1-sm.webp',   // 640w
        md: '/images/hero/hero1-md.webp',   // 1024w  
        lg: '/images/hero/hero1-lg.webp',   // 1920w
        xl: '/images/hero/hero1-xl.webp'    // 2560w
      },
      fallback: '/images/hero/hero1.png'
    },
    image2: {
      avif: '/images/hero/hero2.avif',
      webp: {
        sm: '/images/hero/hero2-sm.webp',
        md: '/images/hero/hero2-md.webp',
        lg: '/images/hero/hero2-lg.webp', 
        xl: '/images/hero/hero2-xl.webp'
      },
      fallback: '/images/hero/hero2.png'
    }
  },
  
  IMAGE_ROTATION_INTERVAL: 8000, // 8 seconds
  IMAGE_TRANSITION_DURATION: 2000, // 2 seconds
  
  // Image dimensions for CLS prevention
  IMAGE_DIMENSIONS: {
    width: 1920,
    height: 1080,
    aspectRatio: '16/9'
  },
  
  BUSINESS_TYPES: {
    MDH: 'mdh'
  }
} as const;