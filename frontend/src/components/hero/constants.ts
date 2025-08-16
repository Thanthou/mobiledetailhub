// Hero configuration constants
export const HERO_CONSTANTS = {
  IMAGES: [
    '/hero/image1.png',
    '/hero/image2.png',
  ].filter(Boolean),
  
  IMAGE_ROTATION_INTERVAL: 8000, // 8 seconds
  IMAGE_TRANSITION_DURATION: 2000, // 2 seconds
  
  BUSINESS_TYPES: {
    MDH: 'mdh'
  }
} as const;