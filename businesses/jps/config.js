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
    smsPhone: '+17024203151', // SMS notifications (no formatting)
    address: 'Bullhead City, AZ',
    services: ['Auto Detailing', 'Marine Detailing', 'RV Detailing', 'Interior/Exterior', 'Ceramic Coating', 'Paint Protection Film'],
    description: 'Professional mobile detailing services in the Southwest region'
  },

  // Override settings - what to pull from parent company (MDH)
  overrides: {
    useParentEmail: true,      // Use MDH email instead of JP's
    useParentPhone: false,     // Keep JP's phone
    useParentAddress: false,   // Keep JP's address
    useParentAttribution: true // Use MDH attribution text
  },


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
    'Colorado River'
  ],

  // Branding & Styling
  branding: {
    primaryColor: '#ea580c', // orange-600
    secondaryColor: '#78716c', // stone-500
    logo: '/businesses/jps/assets/logo.png',
    favicon: '/businesses/jps/assets/favicon.png'
  },

  // Services Configuration
  services: {
    available: ['Detail', 'Ceramic Coating', 'Paint Protection Film', 'Other'],
    vehicleTypes: ['Car', 'Truck', 'Marine', 'RV', 'Motorcycle', 'Other']
  },

  // Booking & Links
  booking: {
    link: '/booking?detailer_id=joe123',
    enabled: false
  },

  // Header Configuration
  header: {
    businessName: "JP's Mobile Detail",
    phone: '(702) 420-3152',
    location: 'Bullhead City, AZ',
    navLinks: [
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'Contact', href: '/contact' }
    ],
    socialLinks: {

    }
  },

  // Hero Section
  hero: {
    backgroundImage: '/themes/beach/images/hero.png',
    headline: 'Premium Mobile Detailing',
    // subheadline: 'Southwest Excellence in Mobile Detailing',
    ctaText: 'Book Now',
    ctaSubtext: 'Serving the Southwest region',
    secondaryCta: 'Request a Quote'
  },

  // Services Section
  servicesSection: {
    headline: 'Our Services',
    subheadline: 'Professional detailing for all vehicle types',
    items: [
      {
        title: 'Auto Detailing',
        description: 'Complete interior and exterior detailing for cars and trucks',
        image: '/auto_detailing/service_image.png',
        highlights: ['Interior deep cleaning', 'Exterior wash & wax', 'Paint correction available']
      },
      {
        title: 'Marine Detailing',
        description: 'Specialized boat and marine vehicle detailing services',
        image: '/marine_detailing/service_image.png',
        highlights: ['Hull cleaning', 'Interior sanitization', 'UV protection']
      },
      {
        title: 'RV Detailing',
        description: 'Comprehensive RV and motorhome detailing solutions',
        image: '/rv_detailing/service_image.png',
        highlights: ['Full interior cleaning', 'Exterior wash & wax', 'Storage preparation']
      }
    ]
  },

  // FAQ Section
  faq: {
    headline: 'Frequently Asked Questions',
    items: [
      {
        question: 'How long does detailing take?',
        answer: 'Most services take 2-4 hours depending on vehicle size and condition.'
      },
      {
        question: 'Do you come to me?',
        answer: 'Yes! We are a mobile detailing service and come to your location.'
      },
      {
        question: 'What areas do you serve?',
        answer: 'We serve Bullhead City, Laughlin, Mohave Valley, and surrounding areas.'
      }
    ]
  },

  // Contact Section
  contact: {
    headline: 'Get In Touch',
    subheadline: 'Ready to book your detailing service?',
    // phone: '(702) 420-3151',
    // email: 'service@jpsmobiledetail.com',
    locations: [
      'Bullhead City, AZ',
      'Laughlin, NV',
      'Mohave Valley, AZ',
      'Needles, CA',
      'Fort Mohave, AZ',
      "Katherine Landing, AZ",
      'Lake Havasu City, AZ',
      'Lake Mohave',
      'Colorado River'
    ]
  },

  // Affiliates Section
  affiliates: {
    // Just list the affiliate keywords - the full data comes from the master affiliates config
    keywords: ['underdog', 'yot-stik', 'starke', 'rupes', 'poka', 'mtm_hydro', 'mirka', 'menzerna', 'lamin-x', 'lake-country', 'koch']
  },

  // Footer Configuration
  footer: {
    businessName: "JP's Mobile Detail",
    contactInfo: {
      phone: '(702) 420-3151',
      email: 'service@jpsmobiledetail.com',
      location: 'Bullhead City, AZ'
    },
    quickLinks: [
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'Contact', href: '/contact' }
    ],
    attribution: {
      text: 'Powered by MobileDetailHub',
      link: 'https://mobiledetailhub.com'
    }
  },

  // Attribution
  attribution: {
    text: 'Powered by MobileDetailHub',
    link: 'https://mobiledetailhub.com'
  }
};