// Booking hero configuration constants
export const BOOKING_HERO_CONSTANTS = {
  IMAGES: [
    '/images/hero/hero1.png',
    '/images/hero/hero2.png',
  ].filter(Boolean),
  
  IMAGE_ROTATION_INTERVAL: 8000, // 8 seconds
  IMAGE_TRANSITION_DURATION: 2000, // 2 seconds
  
  // Image dimensions for CLS prevention
  IMAGE_DIMENSIONS: {
    width: 1920,
    height: 1080,
    aspectRatio: '16/9'
  }
} as const;
