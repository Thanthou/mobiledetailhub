import type { ServiceData, ServiceType } from '../types';

// Service map interface for better type safety
export interface ServiceMap { 
  [slug: string]: ServiceData; 
}

// Import service images
const autoImage = '/images/services/thumbnails/auto.png';
const boatImage = '/images/services/thumbnails/boat.png';
const rvImage = '/images/services/thumbnails/rv.png';
const ceramicImage = '/images/services/thumbnails/ceramic.png';
const paintCorrectionImage = '/images/services/thumbnails/paint.png';
const ppfImage = '/images/services/thumbnails/ppf.png';

const serviceDataMap: Record<ServiceType, ServiceData> = {
  'auto-detailing': {
    id: 'auto-detailing',
    title: 'Auto Detailing',
    slug: 'auto-detailing',
    description: 'Professional auto detailing services to restore and protect your vehicle\'s appearance.',
    shortDescription: 'Complete auto detailing services for cars, trucks, and SUVs.',
    heroImage: autoImage,
    overview: {
      title: 'Professional Auto Detailing',
      content: 'Our comprehensive auto detailing services bring your vehicle back to showroom condition. We use premium products and professional techniques to clean, protect, and enhance your car\'s appearance.',
      benefits: [
        'Restores original paint shine',
        'Protects against environmental damage',
        'Increases vehicle resale value',
        'Professional-grade equipment and products'
      ],
      features: [
        'Exterior wash and wax',
        'Interior deep cleaning',
        'Paint correction and polishing',
        'Engine bay cleaning',
        'Tire and wheel detailing'
      ]
    },
    process: {
      title: 'Our Auto Detailing Process',
      steps: [
        {
          id: 1,
          title: 'Initial Assessment',
          description: 'We inspect your vehicle and discuss your specific needs and preferences.',
          duration: '15 minutes'
        },
        {
          id: 2,
          title: 'Exterior Preparation',
          description: 'Thorough wash, clay bar treatment, and paint decontamination.',
          duration: '45 minutes'
        },
        {
          id: 3,
          title: 'Paint Correction',
          description: 'Professional polishing to remove swirls, scratches, and oxidation.',
          duration: '2-3 hours'
        },
        {
          id: 4,
          title: 'Protection Application',
          description: 'Apply premium wax or ceramic coating for long-lasting protection.',
          duration: '1 hour'
        },
        {
          id: 5,
          title: 'Interior Detailing',
          description: 'Deep clean all interior surfaces, leather treatment, and conditioning.',
          duration: '1-2 hours'
        },
        {
          id: 6,
          title: 'Final Inspection',
          description: 'Quality check and final touches to ensure perfection.',
          duration: '15 minutes'
        }
      ]
    },
    pricing: {
      title: 'Auto Detailing Packages',
      tiers: [
        {
          id: 'basic',
          name: 'Basic Detail',
          price: '$150',
          description: 'Perfect for regular maintenance',
          features: [
            'Exterior wash and dry',
            'Interior vacuum and wipe down',
            'Tire cleaning',
            'Basic wax application'
          ]
        },
        {
          id: 'premium',
          name: 'Premium Detail',
          price: '$300',
          description: 'Most popular choice',
          popular: true,
          features: [
            'Everything in Basic',
            'Paint correction',
            'Interior deep cleaning',
            'Leather conditioning',
            'Engine bay cleaning',
            'Premium wax or sealant'
          ]
        },
        {
          id: 'showroom',
          name: 'Showroom Detail',
          price: '$500',
          description: 'Ultimate protection and shine',
          features: [
            'Everything in Premium',
            'Multi-stage paint correction',
            'Ceramic coating application',
            'Full interior restoration',
            'Paint protection film prep',
            '1-year warranty'
          ]
        }
      ]
    },
    gallery: {
      title: 'Auto Detailing Gallery',
      images: [
        {
          id: '1',
          src: autoImage,
          alt: 'Auto detailing before and after',
          caption: 'Complete transformation of vehicle exterior'
        },
        {
          id: '2',
          src: autoImage,
          alt: 'Interior detailing results',
          caption: 'Professional interior cleaning and conditioning'
        }
      ]
    },
    faq: {
      title: 'Auto Detailing FAQ',
      questions: [
        {
          id: '1',
          question: 'How long does auto detailing take?',
          answer: 'Basic detailing takes 2-3 hours, while premium packages can take 4-6 hours depending on the vehicle size and condition.'
        },
        {
          id: '2',
          question: 'How often should I get my car detailed?',
          answer: 'We recommend detailing every 3-4 months for regular maintenance, or more frequently if your vehicle is exposed to harsh conditions.'
        },
        {
          id: '3',
          question: 'Do you offer mobile detailing services?',
          answer: 'Yes, we provide mobile detailing services for your convenience. We come to your location with all necessary equipment.'
        }
      ]
    },
    cta: {
      title: 'Ready to Transform Your Vehicle?',
      description: 'Book your auto detailing service today and experience the difference professional care makes.',
      buttonText: 'Schedule Auto Detailing',
      buttonLink: '/contact'
    },
    meta: {
      title: 'Professional Auto Detailing Services | Mobile Detail Hub',
      description: 'Expert auto detailing services including paint correction, ceramic coating, and interior cleaning. Book your appointment today.',
      keywords: ['auto detailing', 'car detailing', 'paint correction', 'ceramic coating', 'interior cleaning']
    }
  },
  'marine-detailing': {
    id: 'marine-detailing',
    title: 'Marine Detailing',
    slug: 'marine-detailing',
    description: 'Specialized marine detailing services for boats, yachts, and watercraft.',
    shortDescription: 'Professional marine detailing for boats and watercraft.',
    heroImage: boatImage,
    overview: {
      title: 'Professional Marine Detailing',
      content: 'Our marine detailing specialists understand the unique challenges of maintaining watercraft. We use marine-grade products and techniques designed specifically for boats and yachts.',
      benefits: [
        'Protects against saltwater corrosion',
        'Maintains gel coat finish',
        'Prevents marine growth',
        'Extends boat lifespan'
      ],
      features: [
        'Hull cleaning and waxing',
        'Deck and cockpit detailing',
        'Interior marine cleaning',
        'Canvas and upholstery care',
        'Metal polishing and protection'
      ]
    },
    process: {
      title: 'Our Marine Detailing Process',
      steps: [
        {
          id: 1,
          title: 'Marine Assessment',
          description: 'Evaluate the boat\'s condition and identify areas needing special attention.',
          duration: '20 minutes'
        },
        {
          id: 2,
          title: 'Hull Preparation',
          description: 'Remove marine growth, barnacles, and salt deposits from the hull.',
          duration: '1-2 hours'
        },
        {
          id: 3,
          title: 'Gel Coat Restoration',
          description: 'Polish and restore the gel coat to its original shine.',
          duration: '2-3 hours'
        },
        {
          id: 4,
          title: 'Deck and Interior',
          description: 'Clean and protect all deck surfaces and interior areas.',
          duration: '1-2 hours'
        },
        {
          id: 5,
          title: 'Marine Protection',
          description: 'Apply marine-grade wax and protective coatings.',
          duration: '1 hour'
        }
      ]
    },
    pricing: {
      title: 'Marine Detailing Packages',
      tiers: [
        {
          id: 'basic',
          name: 'Basic Marine',
          price: '$200',
          description: 'Essential marine maintenance',
          features: [
            'Hull wash and wax',
            'Deck cleaning',
            'Basic interior cleaning',
            'Tire and trailer cleaning'
          ]
        },
        {
          id: 'premium',
          name: 'Premium Marine',
          price: '$400',
          description: 'Complete marine detailing',
          popular: true,
          features: [
            'Everything in Basic',
            'Gel coat restoration',
            'Canvas cleaning and treatment',
            'Metal polishing',
            'Engine compartment cleaning'
          ]
        },
        {
          id: 'yacht',
          name: 'Yacht Detail',
          price: '$800',
          description: 'Luxury yacht service',
          features: [
            'Everything in Premium',
            'Multi-stage gel coat correction',
            'Teak restoration',
            'Full interior detailing',
            'Marine ceramic coating',
            '6-month protection warranty'
          ]
        }
      ]
    },
    gallery: {
      title: 'Marine Detailing Gallery',
      images: [
        {
          id: '1',
          src: boatImage,
          alt: 'Marine detailing results',
          caption: 'Professional boat hull restoration'
        }
      ]
    },
    faq: {
      title: 'Marine Detailing FAQ',
      questions: [
        {
          id: '1',
          question: 'Do you work on boats in the water?',
          answer: 'Yes, we can work on boats both in and out of the water, depending on the services needed.'
        },
        {
          id: '2',
          question: 'What products do you use for marine detailing?',
          answer: 'We use only marine-grade products specifically designed for boats and watercraft to ensure proper protection.'
        }
      ]
    },
    cta: {
      title: 'Keep Your Boat Looking Great',
      description: 'Professional marine detailing services to protect and maintain your watercraft.',
      buttonText: 'Schedule Marine Service',
      buttonLink: '/contact'
    },
    meta: {
      title: 'Professional Marine Detailing Services | Mobile Detail Hub',
      description: 'Expert marine detailing for boats and yachts. Specialized services for watercraft maintenance and protection.',
      keywords: ['marine detailing', 'boat detailing', 'yacht detailing', 'marine cleaning', 'boat maintenance']
    }
  },
  'rv-detailing': {
    id: 'rv-detailing',
    title: 'RV Detailing',
    slug: 'rv-detailing',
    description: 'Comprehensive RV detailing services for recreational vehicles and motorhomes.',
    shortDescription: 'Professional RV detailing for motorhomes and travel trailers.',
    heroImage: rvImage,
    overview: {
      title: 'Professional RV Detailing',
      content: 'Our RV detailing specialists understand the unique needs of recreational vehicles. We provide comprehensive cleaning and protection services for both interior and exterior.',
      benefits: [
        'Protects against road grime and weather',
        'Maintains RV value',
        'Creates comfortable living space',
        'Prevents mold and mildew'
      ],
      features: [
        'Exterior wash and wax',
        'Interior deep cleaning',
        'Canvas and awning care',
        'Appliance cleaning',
        'Storage compartment detailing'
      ]
    },
    process: {
      title: 'Our RV Detailing Process',
      steps: [
        {
          id: 1,
          title: 'RV Inspection',
          description: 'Assess the RV\'s condition and plan the detailing approach.',
          duration: '30 minutes'
        },
        {
          id: 2,
          title: 'Exterior Cleaning',
          description: 'Wash, clay bar, and prepare the exterior surfaces.',
          duration: '2-3 hours'
        },
        {
          id: 3,
          title: 'Interior Deep Clean',
          description: 'Clean all interior surfaces, appliances, and storage areas.',
          duration: '3-4 hours'
        },
        {
          id: 4,
          title: 'Protection Application',
          description: 'Apply protective coatings and treatments.',
          duration: '1 hour'
        }
      ]
    },
    pricing: {
      title: 'RV Detailing Packages',
      tiers: [
        {
          id: 'basic',
          name: 'Basic RV',
          price: '$250',
          description: 'Essential RV maintenance',
          features: [
            'Exterior wash and wax',
            'Interior vacuum and wipe',
            'Basic appliance cleaning',
            'Tire and wheel cleaning'
          ]
        },
        {
          id: 'premium',
          name: 'Premium RV',
          price: '$450',
          description: 'Complete RV detailing',
          popular: true,
          features: [
            'Everything in Basic',
            'Deep interior cleaning',
            'Canvas and awning treatment',
            'Appliance deep clean',
            'Storage compartment cleaning'
          ]
        },
        {
          id: 'deluxe',
          name: 'Deluxe RV',
          price: '$750',
          description: 'Full restoration service',
          features: [
            'Everything in Premium',
            'Paint correction',
            'Full interior restoration',
            'Mold and mildew treatment',
            'Ceramic coating application',
            '3-month warranty'
          ]
        }
      ]
    },
    gallery: {
      title: 'RV Detailing Gallery',
      images: [
        {
          id: '1',
          src: rvImage,
          alt: 'RV detailing results',
          caption: 'Complete RV transformation'
        }
      ]
    },
    faq: {
      title: 'RV Detailing FAQ',
      questions: [
        {
          id: '1',
          question: 'How long does RV detailing take?',
          answer: 'RV detailing typically takes 4-8 hours depending on the size and condition of the vehicle.'
        },
        {
          id: '2',
          question: 'Do you clean the interior appliances?',
          answer: 'Yes, we clean and sanitize all interior appliances including refrigerators, stoves, and bathrooms.'
        }
      ]
    },
    cta: {
      title: 'Ready for Your Next Adventure?',
      description: 'Professional RV detailing to keep your home on wheels in perfect condition.',
      buttonText: 'Schedule RV Service',
      buttonLink: '/contact'
    },
    meta: {
      title: 'Professional RV Detailing Services | Mobile Detail Hub',
      description: 'Expert RV detailing for motorhomes and travel trailers. Complete interior and exterior cleaning services.',
      keywords: ['RV detailing', 'motorhome detailing', 'travel trailer cleaning', 'RV maintenance', 'recreational vehicle detailing']
    }
  },
  'ceramic-coating': {
    id: 'ceramic-coating',
    title: 'Ceramic Coating',
    slug: 'ceramic-coating',
    description: 'Professional ceramic coating application for long-lasting paint protection.',
    shortDescription: 'Premium ceramic coating for ultimate paint protection.',
    heroImage: ceramicImage,
    overview: {
      title: 'Professional Ceramic Coating',
      content: 'Ceramic coating provides the ultimate protection for your vehicle\'s paint. Our professional application ensures years of protection with minimal maintenance.',
      benefits: [
        'Years of protection',
        'Superior water repellency',
        'UV protection',
        'Easy maintenance',
        'Enhanced gloss and depth'
      ],
      features: [
        'Paint correction preparation',
        'Professional ceramic application',
        'Multiple coating layers',
        'Quality inspection',
        'Maintenance instructions'
      ]
    },
    process: {
      title: 'Our Ceramic Coating Process',
      steps: [
        {
          id: 1,
          title: 'Paint Assessment',
          description: 'Evaluate paint condition and plan correction strategy.',
          duration: '30 minutes'
        },
        {
          id: 2,
          title: 'Paint Correction',
          description: 'Multi-stage polishing to perfect the paint surface.',
          duration: '4-6 hours'
        },
        {
          id: 3,
          title: 'Surface Preparation',
          description: 'Thorough cleaning and decontamination.',
          duration: '1 hour'
        },
        {
          id: 4,
          title: 'Ceramic Application',
          description: 'Professional application of ceramic coating.',
          duration: '2-3 hours'
        },
        {
          id: 5,
          title: 'Curing and Inspection',
          description: 'Allow proper curing and final quality check.',
          duration: '1 hour'
        }
      ]
    },
    pricing: {
      title: 'Ceramic Coating Packages',
      tiers: [
        {
          id: 'basic',
          name: 'Basic Coating',
          price: '$800',
          description: 'Essential protection',
          features: [
            'Paint correction',
            'Single layer coating',
            '1-year warranty',
            'Basic maintenance kit'
          ]
        },
        {
          id: 'premium',
          name: 'Premium Coating',
          price: '$1200',
          description: 'Enhanced protection',
          popular: true,
          features: [
            'Multi-stage paint correction',
            'Two-layer coating',
            '3-year warranty',
            'Premium maintenance kit',
            'Annual inspection'
          ]
        },
        {
          id: 'pro',
          name: 'Professional Coating',
          price: '$1800',
          description: 'Ultimate protection',
          features: [
            'Complete paint restoration',
            'Multi-layer coating system',
            '5-year warranty',
            'Professional maintenance kit',
            'Bi-annual inspections',
            'Touch-up service included'
          ]
        }
      ]
    },
    gallery: {
      title: 'Ceramic Coating Gallery',
      images: [
        {
          id: '1',
          src: ceramicImage,
          alt: 'Ceramic coating results',
          caption: 'Professional ceramic coating application'
        }
      ]
    },
    faq: {
      title: 'Ceramic Coating FAQ',
      questions: [
        {
          id: '1',
          question: 'How long does ceramic coating last?',
          answer: 'Our ceramic coatings last 1-5 years depending on the package selected and proper maintenance.'
        },
        {
          id: '2',
          question: 'Can ceramic coating be applied to any vehicle?',
          answer: 'Yes, ceramic coating can be applied to any vehicle with paint, including cars, trucks, boats, and RVs.'
        }
      ]
    },
    cta: {
      title: 'Protect Your Investment',
      description: 'Professional ceramic coating application for years of protection and beauty.',
      buttonText: 'Get Ceramic Coating Quote',
      buttonLink: '/contact'
    },
    meta: {
      title: 'Professional Ceramic Coating Services | Mobile Detail Hub',
      description: 'Expert ceramic coating application for long-lasting paint protection. Professional installation with warranty.',
      keywords: ['ceramic coating', 'paint protection', 'car coating', 'vehicle protection', 'ceramic coating installation']
    }
  },
  'paint-correction': {
    id: 'paint-correction',
    title: 'Paint Correction',
    slug: 'paint-correction',
    description: 'Professional paint correction to restore your vehicle\'s original finish.',
    shortDescription: 'Expert paint correction and restoration services.',
    heroImage: paintCorrectionImage,
    overview: {
      title: 'Professional Paint Correction',
      content: 'Paint correction removes imperfections from your vehicle\'s paint to restore its original beauty. Our multi-stage process eliminates swirls, scratches, and oxidation.',
      benefits: [
        'Removes swirl marks and scratches',
        'Restores original paint depth',
        'Eliminates oxidation',
        'Prepares surface for protection',
        'Increases vehicle value'
      ],
      features: [
        'Paint assessment and testing',
        'Multi-stage polishing',
        'Swirl mark removal',
        'Scratch repair',
        'Oxidation removal'
      ]
    },
    process: {
      title: 'Our Paint Correction Process',
      steps: [
        {
          id: 1,
          title: 'Paint Analysis',
          description: 'Test paint hardness and identify imperfections.',
          duration: '30 minutes'
        },
        {
          id: 2,
          title: 'Surface Preparation',
          description: 'Wash, clay bar, and decontaminate paint surface.',
          duration: '1 hour'
        },
        {
          id: 3,
          title: 'Correction Phase 1',
          description: 'Heavy cutting to remove deep scratches and oxidation.',
          duration: '2-3 hours'
        },
        {
          id: 4,
          title: 'Correction Phase 2',
          description: 'Medium polishing to refine the finish.',
          duration: '1-2 hours'
        },
        {
          id: 5,
          title: 'Final Polish',
          description: 'Light polishing for maximum gloss and clarity.',
          duration: '1 hour'
        },
        {
          id: 6,
          title: 'Protection Application',
          description: 'Apply wax or sealant to protect the corrected paint.',
          duration: '30 minutes'
        }
      ]
    },
    pricing: {
      title: 'Paint Correction Packages',
      tiers: [
        {
          id: 'basic',
          name: 'Basic Correction',
          price: '$300',
          description: 'Light imperfection removal',
          features: [
            'Single-stage polishing',
            'Swirl mark removal',
            'Basic wax application',
            '1-year protection'
          ]
        },
        {
          id: 'premium',
          name: 'Premium Correction',
          price: '$500',
          description: 'Multi-stage correction',
          popular: true,
          features: [
            'Two-stage correction',
            'Deep scratch removal',
            'Oxidation treatment',
            'Premium sealant',
            '2-year protection'
          ]
        },
        {
          id: 'showroom',
          name: 'Showroom Correction',
          price: '$800',
          description: 'Complete paint restoration',
          features: [
            'Multi-stage correction',
            'Complete imperfection removal',
            'Paint depth restoration',
            'Ceramic coating prep',
            '3-year protection warranty'
          ]
        }
      ]
    },
    gallery: {
      title: 'Paint Correction Gallery',
      images: [
        {
          id: '1',
          src: paintCorrectionImage,
          alt: 'Paint correction results',
          caption: 'Before and after paint correction'
        }
      ]
    },
    faq: {
      title: 'Paint Correction FAQ',
      questions: [
        {
          id: '1',
          question: 'How long does paint correction take?',
          answer: 'Paint correction typically takes 4-8 hours depending on the vehicle size and paint condition.'
        },
        {
          id: '2',
          question: 'Will paint correction damage my paint?',
          answer: 'No, when done professionally, paint correction actually improves and protects your paint.'
        }
      ]
    },
    cta: {
      title: 'Restore Your Paint\'s Beauty',
      description: 'Professional paint correction to bring your vehicle back to showroom condition.',
      buttonText: 'Schedule Paint Correction',
      buttonLink: '/contact'
    },
    meta: {
      title: 'Professional Paint Correction Services | Mobile Detail Hub',
      description: 'Expert paint correction to remove swirls, scratches, and oxidation. Restore your vehicle\'s original finish.',
      keywords: ['paint correction', 'swirl removal', 'scratch repair', 'paint restoration', 'car polishing']
    }
  },
  'paint-protection-film': {
    id: 'paint-protection-film',
    title: 'Paint Protection Film',
    slug: 'paint-protection-film',
    description: 'Professional paint protection film installation for ultimate vehicle protection.',
    shortDescription: 'Premium paint protection film installation.',
    heroImage: ppfImage,
    overview: {
      title: 'Professional Paint Protection Film',
      content: 'Paint Protection Film (PPF) provides the ultimate protection against rock chips, scratches, and environmental damage. Our professional installation ensures perfect fit and long-lasting protection.',
      benefits: [
        'Protects against rock chips',
        'Self-healing properties',
        'Invisible protection',
        'Maintains paint value',
        'Easy maintenance'
      ],
      features: [
        'Precision cutting and installation',
        'Self-healing film technology',
        'UV protection',
        'Professional edge wrapping',
        'Quality warranty'
      ]
    },
    process: {
      title: 'Our PPF Installation Process',
      steps: [
        {
          id: 1,
          title: 'Vehicle Preparation',
          description: 'Thorough cleaning and paint correction if needed.',
          duration: '1-2 hours'
        },
        {
          id: 2,
          title: 'Film Cutting',
          description: 'Precision cutting of PPF to exact vehicle specifications.',
          duration: '1 hour'
        },
        {
          id: 3,
          title: 'Installation',
          description: 'Professional installation with edge wrapping.',
          duration: '3-4 hours'
        },
        {
          id: 4,
          title: 'Quality Check',
          description: 'Inspection and final adjustments.',
          duration: '30 minutes'
        }
      ]
    },
    pricing: {
      title: 'Paint Protection Film Packages',
      tiers: [
        {
          id: 'basic',
          name: 'Basic PPF',
          price: '$400',
          description: 'Essential protection',
          features: [
            'Front bumper coverage',
            'Hood partial coverage',
            'Mirror caps',
            '1-year warranty'
          ]
        },
        {
          id: 'premium',
          name: 'Premium PPF',
          price: '$800',
          description: 'Enhanced protection',
          popular: true,
          features: [
            'Full front end coverage',
            'Door edge protection',
            'Rock panel coverage',
            '3-year warranty'
          ]
        },
        {
          id: 'full',
          name: 'Full Vehicle PPF',
          price: '$2500',
          description: 'Complete protection',
          features: [
            'Full vehicle coverage',
            'Self-healing technology',
            'UV protection',
            '5-year warranty',
            'Annual inspection'
          ]
        }
      ]
    },
    gallery: {
      title: 'Paint Protection Film Gallery',
      images: [
        {
          id: '1',
          src: ppfImage,
          alt: 'PPF installation results',
          caption: 'Professional PPF installation'
        }
      ]
    },
    faq: {
      title: 'Paint Protection Film FAQ',
      questions: [
        {
          id: '1',
          question: 'How long does PPF last?',
          answer: 'Our PPF installations come with 1-5 year warranties depending on the package selected.'
        },
        {
          id: '2',
          question: 'Can PPF be removed?',
          answer: 'Yes, PPF can be removed without damaging the original paint when done professionally.'
        }
      ]
    },
    cta: {
      title: 'Protect Your Paint Investment',
      description: 'Professional paint protection film installation for ultimate vehicle protection.',
      buttonText: 'Get PPF Quote',
      buttonLink: '/contact'
    },
    meta: {
      title: 'Professional Paint Protection Film Installation | Mobile Detail Hub',
      description: 'Expert PPF installation to protect your vehicle from rock chips and scratches. Professional installation with warranty.',
      keywords: ['paint protection film', 'PPF installation', 'car protection', 'rock chip protection', 'vehicle protection film']
    }
  }
};

export const getServiceData = async (serviceType: ServiceType): Promise<ServiceData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Since serviceDataMap is Record<ServiceType, ServiceData>, this lookup will always succeed
  const serviceData = serviceDataMap[serviceType];
  
  return serviceData;
};

export const getAllServiceTypes = (): ServiceType[] => {
  return Object.keys(serviceDataMap) as ServiceType[];
};

export const getServiceSlug = (serviceType: ServiceType): string => {
  const serviceData = serviceDataMap[serviceType];
  return serviceData.slug;
};

// Helper function using ServiceMap interface for better type safety
export const getService = (slug: string, map: ServiceMap): ServiceData | undefined => {
  return map[slug]; // no optional chain if map is defined
};
