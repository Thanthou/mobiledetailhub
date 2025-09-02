// Hero configuration constants
export const HERO_CONSTANTS = {
  IMAGES: [
    '/hero/image1.png',
    '/hero/image2.png',
  ].filter(Boolean),
  
  // Responsive image sources for different screen sizes
  RESPONSIVE_IMAGES: {
    image1: {
      avif: '/hero/image1.avif',
      webp: {
        sm: '/hero/image1-sm.webp',   // 640w
        md: '/hero/image1-md.webp',   // 1024w  
        lg: '/hero/image1-lg.webp',   // 1920w
        xl: '/hero/image1-xl.webp'    // 2560w
      },
      fallback: '/hero/image1.png'
    },
    image2: {
      avif: '/hero/image2.avif',
      webp: {
        sm: '/hero/image2-sm.webp',
        md: '/hero/image2-md.webp',
        lg: '/hero/image2-lg.webp', 
        xl: '/hero/image2-xl.webp'
      },
      fallback: '/hero/image2.png'
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