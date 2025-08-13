// Mobile Detail Hub - Business Configuration
module.exports = {
  // Domain identification
  domain: 'mobiledetailhub.com',
  slug: 'mdh',
  
  // Business Information
  business: {
    name: "Mobile Detail Hub",
    email: 'service@mobiledetailhub.com',
    phone: '(702) 420-6066',
    smsPhone: '+17024206066', // SMS notifications (no formatting)
    address: 'Los Angeles, CA',
  },

  // Service Areas/Locations
  serviceLocations: [
    'Los Angeles, CA',
    'Beverly Hills, CA',
    'Santa Monica, CA',
    'Culver City, CA',
    'West Hollywood, CA',
    'Hollywood, CA',
    'Downtown LA, CA',
    'Venice, CA',
    'Marina del Rey, CA',
    'Manhattan Beach, CA',
    'Redondo Beach, CA',
    'Torrance, CA',
    'Long Beach, CA',
    'Pasadena, CA',
    'Glendale, CA',
    'Burbank, CA',
    'North Hollywood, CA',
    'Studio City, CA',
    'Encino, CA',
    'Sherman Oaks, CA',
    'Van Nuys, CA',
    'Woodland Hills, CA',
    'Calabasas, CA',
    'Agoura Hills, CA',
    'Thousand Oaks, CA',
    'Westlake Village, CA',
    'Malibu, CA'
  ],

  // Social Media Links
  socialMedia: {
    facebook: 'https://facebook.com/mobiledetailhub',
    instagram: 'https://instagram.com/mobiledetailhub',
    tiktok: 'https://tiktok.com/@mobiledetailhub',
    youtube: 'https://youtube.com/@mobiledetailhub'
  },

  // Services Configuration
  services: {
    available: ['Detail', 'Ceramic Coating', 'Paint Protection Film'],
    vehicleTypes: ['Car', 'Truck', 'Marine', 'RV', 'Motorcycle']
  },



  // Affiliates Section
  affiliates: {
    headline: 'Trusted brands we work with',
    // Just list the affiliate keywords - the full data comes from the master affiliates config
    keywords: ['ceramic_pro', 'xpel']
  },

  // Booking & Links
  booking: {
    link: '/booking?detail_id=mdh123',
    enabled: false
  },

  // Attribution
  attribution: {
    text: 'Powered by MobileDetailHub',
    link: 'https://mobiledetailhub.com'
  }
};
