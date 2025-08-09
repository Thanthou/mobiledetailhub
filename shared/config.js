// Shared business configuration
// This file can be used by both frontend and backend
const config = {
  business: {
    name: "JP's Mobile Detail",
    email: 'JPsMobileDetailing@hotmail.com',
    phone: '(702) 420-3151',
    smsPhone: '+17024203151', // SMS notifications (no formatting)
    location: 'Bullhead City, AZ'
  },
  
  serviceLocations: [
    'Bullhead City, AZ',
    'Laughlin, NV',
    'Mohave Valley, AZ',
    'Needles, CA',
    'Fort Mohave, AZ',
    "Katherine Landing, AZ",
    'Lake Havasu City, AZ',
    'Lake Mohave',
    'Colorado River'
  ],

  socialMedia: {
    facebook: 'https://facebook.com/mobiledetailhub',
    instagram: 'https://instagram.com/mobiledetailhub',
    tiktok: 'https://tiktok.com/@mobiledetailhub',
    youtube: 'https://youtube.com/@mobiledetailhub'
  },

  booking: {
    link: '/booking?detailer_id=joe123',
    enabled: false
  },

  hero: {
    backgroundImage: '/auto_detailing/hero_image.png',
    headline: 'Premium Mobile Detailing',
    ctaText: 'Book Now'
  },

  attribution: {
    text: 'Powered by MobileDetailHub',
    link: 'https://mobiledetailhub.com'
  }
};

// CommonJS export for backend
module.exports = config;
