// Mobile Detail Hub - Business Configuration
module.exports = {
  // Domain identification
  domain: 'mobiledetailhub.com',
  slug: 'mdh',
  theme: 'beach',
  
  // Business Information
  business: {
    name: "Mobile Detail Hub",
    email: 'service@mobiledetailhub.com',
    phone: '(702) 420-6066',
    smsPhone: '+17024206066', // SMS notifications (no formatting)
    address: 'Los Angeles, CA',
    hours: 'Mon-Sat: 8AM-6PM',
    services: ['Auto Detailing', 'Marine Detailing', 'RV Detailing', 'Interior/Exterior', 'Ceramic Coating', 'Paint Protection Film'],
    description: 'Premium mobile detailing services across Southern California'
  },

  // Email notifications - quotes will be sent to all these addresses
  emailNotifications: [
    'service@mobiledetailhub.com',
    'bcoleman143@gmail.com'
  ],
  
  // Service Areas/Locations
  serviceLocations: [
    'Los Angeles, CA',
    'Orange County, CA',
    'San Diego, CA',
    'Riverside, CA',
    'San Bernardino, CA'
  ],

  // Branding & Styling
  branding: {
    primaryColor: '#3b82f6', // blue-500
    secondaryColor: '#64748b', // slate-500
    logo: '/businesses/mdh/assets/logo.png',
    favicon: '/businesses/mdh/assets/favicon.png'
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
    available: ['Detail', 'Ceramic Coating', 'Paint Protection Film', 'Other'],
    vehicleTypes: ['Car', 'Truck', 'Marine', 'RV', 'Motorcycle', 'Other']
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
        answer: 'We serve Los Angeles, Orange County, San Diego, and surrounding areas.'
      }
    ]
  },

  // Contact Section
  contact: {
    headline: 'Get In Touch',
    subheadline: 'Ready to book your detailing service?',
    phone: '(702) 420-6066',
    email: 'service@mobiledetailhub.com',
    locations: [
      'Los Angeles, CA',
      'Orange County, CA',
      'San Diego, CA',
      'Riverside, CA',
      'San Bernardino, CA'
    ]
  },

  // Affiliates Section
  affiliates: {
    headline: 'Our Partners',
    subheadline: 'Trusted brands we work with',
    // Just list the affiliate keywords - the full data comes from the master affiliates config
    keywords: ['ceramic_pro', 'xpel']
  },

  // Booking & Links
  booking: {
    link: '/booking?detail_id=mdh123',
    enabled: false
  },

  // Website Content
  hero: {
    backgroundImage: '/auto_detailing/hero_image.png',
    headline: 'Premium Mobile Detailing',
    ctaText: 'Book Now',
    ctaSubtext: 'Professional mobile detailing services',
    secondaryCta: 'Request a Quote'
  },

  // Header Configuration
  header: {
    businessName: "Mobile Detail Hub",
    phone: '(702) 420-6066',
    location: 'Los Angeles, CA',
    navLinks: [
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'Contact', href: '/contact' }
    ],
    socialLinks: {}
  },

  // Footer Configuration
  footer: {
    businessName: "Mobile Detail Hub",
    contactInfo: {
      phone: '(702) 420-6066',
      email: 'service@mobiledetailhub.com',
      location: 'Los Angeles, CA'
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

  // Override settings - what to pull from parent company (MDH is the parent, so no overrides needed)
  overrides: {
    useParentEmail: false,      // Use MDH's own email
    useParentPhone: false,      // Use MDH's own phone
    useParentAddress: false,    // Use MDH's own address
    useParentHours: false,      // Use MDH's own hours
    useParentAttribution: false // Use MDH's own attribution text
  },

  // Attribution
  attribution: {
    text: 'Powered by MobileDetailHub',
    link: 'https://mobiledetailhub.com'
  }
};
