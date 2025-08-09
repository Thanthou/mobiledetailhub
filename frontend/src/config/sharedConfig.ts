// Business Configuration - matches shared/config.js
export const businessConfig = {
  name: "JP's Mobile Detail",
  phone: '(702) 420-3151',
  location: 'Bullhead City, AZ',
  email: 'JPsMobileDetailing@hotmail.com',
  
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
  
  bookingLink: '/booking?detailer_id=joe123',
  bookingEnabled: false,
  
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

export default businessConfig;
