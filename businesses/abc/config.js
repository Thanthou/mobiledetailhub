// Template Business Configuration
// Copy this file to create new businesses
module.exports = {
  // Domain identification
  domain: 'abc.mobiledetailhub.com',
  slug: 'abc',
  
  // Business Information
  business: {
    name: "ABC Mobile Detail",
    email: 'service@abcmobiledetail.com',
    phone: '(702) 420-6066',
    smsPhone: '+17024206066',
    address: 'Las Vegas, NV',
    hours: 'Mon-Sat: 8AM-6PM',
    services: ['Auto Detailing', 'Marine Detailing', 'RV Detailing', 'Interior/Exterior', 'Ceramic Coating', 'Paint Protection Film'],
    description: 'Quality mobile detailing services for all vehicle types'
  },

  // Email notifications
  emailNotifications: [
    'contact@abc.com'
  ],
  
  // Service Areas/Locations
  serviceLocations: [
    'Las Vegas, NV',
    'Henderson, NV',
    'North Las Vegas, NV',
    'Boulder City, NV',
    'Summerlin, NV',
    'Green Valley, NV',
    'Anthem, NV',
    'Enterprise, NV',
    'Spring Valley, NV',
    'Paradise, NV',
    'Sunrise Manor, NV',
    'Whitney, NV',
    'Winchester, NV',
    'Mount Charleston, NV',
    'Red Rock Canyon, NV',
    'Valley of Fire, NV'
  ],

  // Branding & Styling
  branding: {
    primaryColor: '#3b82f6', // blue-500
    secondaryColor: '#6b7280', // gray-500
    logo: '/businesses/abc/assets/logo.png',
    favicon: '/businesses/abc/assets/favicon.png'
  },

  // Services Configuration
  services: {
    available: ['Detail', 'Ceramic Coating', 'Paint Protection Film', 'Other'],
    vehicleTypes: ['Car', 'Truck', 'Marine', 'RV', 'Motorcycle', 'Other']
  },

  // Booking & Links
  booking: {
    link: '/booking?detailer_id=abc',
    enabled: false
  },

  // Website Content
  hero: {
    backgroundImage: '/auto_detailing/hero_image.png',
    headline: 'Professional Mobile Detailing',
    ctaText: 'Get Quote'
  },

  // Attribution
  attribution: {
    text: 'Powered by MobileDetailHub',
    link: 'https://mobiledetailhub.com'
  }
};
