// JP's Mobile Detail - Business Configuration
module.exports = {
  // Domain identification
  domain: 'jps.mobiledetailhub.com',
  slug: 'jps',
  
  // Business Information
  business: {
    name: "JP's Mobile Detail",
    email: 'JPsMobileDetailing@hotmail.com',
    phone: '(702) 420-3151',
    smsPhone: '+17024203151',
    address: 'Bullhead City, AZ',
  },

  // Override settings - what to pull from parent company (MDH)
  overrides: {
    useParentEmail: true,      // Use MDH email instead of JP's
  },

  // Service Areas/Locations
  serviceLocations: [
    'Bullhead City, AZ',
    'Mohave Valley, AZ',
    'Fort Mohave, AZ',
    'Katherine Landing, AZ',
    'Lake Havasu City, AZ',
    'Kingman, AZ',
    'Laughlin, NV',
    'Needles, CA',
    'Lake Mohave',
    'Colorado River'
  ],


  services: {
    available: ['Detail', 'Ceramic Coating', 'Paint Protection Film'],
    vehicleTypes: ['Car', 'Truck', 'Marine', 'RV', 'Motorcycle']
  },

  // Booking & Links
  booking: {
    link: '/booking?detailer_id=joe123',
    enabled: false
  },

  // Affiliates Section
brands: {
    keywords: ['underdog', 'yot-stik', 'starke', 'rupes', 'poka', 'mtm_hydro', 'mirka', 'menzerna', 'lamin-x', 'lake-country', 'koch']
  },
};