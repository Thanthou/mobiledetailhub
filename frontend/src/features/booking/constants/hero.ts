// Booking hero configuration constants
export const BOOKING_HERO_CONSTANTS = {
  IMAGES: [
    '/images/booking/hero-default/hero1.png',
    '/images/booking/hero-default/hero2.png',
  ].filter(Boolean),
  
  // Responsive image sources for different screen sizes
  RESPONSIVE_IMAGES: {
    image1: {
      avif: '/images/booking/hero-default/hero1.avif',
      webp: {
        sm: '/images/booking/hero-default/hero1-sm.webp',   // 640w
        md: '/images/booking/hero-default/hero1-md.webp',   // 1024w  
        lg: '/images/booking/hero-default/hero1-lg.webp',   // 1920w
        xl: '/images/booking/hero-default/hero1-xl.webp'    // 2560w
      },
      fallback: '/images/booking/hero-default/hero1.png'
    },
    image2: {
      avif: '/images/booking/hero-default/hero2.avif',
      webp: {
        sm: '/images/booking/hero-default/hero2-sm.webp',
        md: '/images/booking/hero-default/hero2-md.webp',
        lg: '/images/booking/hero-default/hero2-lg.webp', 
        xl: '/images/booking/hero-default/hero2-xl.webp'
      },
      fallback: '/images/booking/hero-default/hero2.png'
    }
  },
  
  IMAGE_ROTATION_INTERVAL: 6000, // 6 seconds (faster rotation for booking flow)
  IMAGE_TRANSITION_DURATION: 1500, // 1.5 seconds
  
  // Image dimensions for CLS prevention
  IMAGE_DIMENSIONS: {
    width: 1920,
    height: 1080,
    aspectRatio: '16/9'
  }
} as const;
