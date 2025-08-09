// Business Configuration
// Update these values to change them throughout the entire application

export const businessConfig = {
  // Business Information
  name: "JP's Mobile Detail",
  phone: '(702) 420-3151',
  location: 'Bullhead City, AZ',
  email: 'jps@mobiledetailhub.com',
  
  // Service Areas/Locations
  serviceLocations: [
    'Bullhead City, AZ',
    'Laughlin, NV',
    'Mohave Valley, AZ',
    'Needles, CA',
    'Fort Mohave, AZ',
    "Katherine Landing, AZ",
    'Lake Havasu City, AZ',
    'Lake Mohave',
    'Colorado River',
  ],
  
  // Social Media Links
  socialMedia: {
    facebook: 'https://facebook.com/mobiledetailhub',
    instagram: 'https://instagram.com/mobiledetailhub',
    tiktok: 'https://tiktok.com/@mobiledetailhub',
    youtube: 'https://youtube.com/@mobiledetailhub'
  },
  
  // Booking & Links
  bookingLink: '/booking?detailer_id=joe123',
  bookingEnabled: false, // Set to true to enable booking functionality
  
  // Website Content
  hero: {
    backgroundImage: '/auto_detailing/hero_image.png',
    headline: 'Premium Mobile Detailing',
    ctaText: 'Book Now'
  },
  
  // Attribution
  attribution: {
    text: 'Powered by MobileDetailHub',
    link: 'https://mobiledetailhub.com'
  }
};

export default businessConfig;