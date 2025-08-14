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

  // Service Areas/Locations - Auto-generated from all business configs
  serviceLocations: [
    'Arizona',
    'California',
    'Nevada'
  ],
  

  


  // State-to-cities mapping - Auto-generated from all business configs
  stateCities: {
    "Arizona": [
      "Bullhead City",
      "Fort Mohave",
      "Katherine Landing",
      "Kingman",
      "Lake Havasu City",
      "Mohave Valley"
    ],
    "California": [
      "Needles"
    ],
    "Nevada": [
      "Anthem",
      "Boulder City",
      "Enterprise",
      "Green Valley",
      "Henderson",
      "Las Vegas",
      "Laughlin",
      "Mount Charleston",
      "North Las Vegas",
      "Paradise",
      "Red Rock Canyon",
      "Spring Valley",
      "Summerlin",
      "Sunrise Manor",
      "Valley of Fire",
      "Whitney",
      "Winchester"
    ]
  },

  // City-to-business mapping - Auto-generated from all business configs
  cityToBusiness: {
    "Anthem": "abc",
    "Boulder City": "abc",
    "Enterprise": "abc",
    "Green Valley": "abc",
    "Henderson": "abc",
    "Las Vegas": "abc",
    "Mount Charleston": "abc",
    "North Las Vegas": "abc",
    "Paradise": "abc",
    "Red Rock Canyon": "abc",
    "Spring Valley": "abc",
    "Summerlin": "abc",
    "Sunrise Manor": "abc",
    "Valley of Fire": "abc",
    "Whitney": "abc",
    "Winchester": "abc",
    "Bullhead City": "jps",
    "Fort Mohave": "jps",
    "Katherine Landing": "jps",
    "Kingman": "jps",
    "Lake Havasu City": "jps",
    "Mohave Valley": "jps",
    "Laughlin": "jps",
    "Needles": "jps"
  },
  




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
