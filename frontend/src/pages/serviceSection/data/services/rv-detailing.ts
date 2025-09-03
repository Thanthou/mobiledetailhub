// src/services/data/rv-detailing.ts
import type { ServiceData } from '../types';

const heroImage = '/images/services/rv-detailing/hero.png';
const processImage = '/images/services/rv-detailing/process-1.png';
const processImage2 = '/images/services/rv-detailing/process-2.png';
const processImage3 = '/images/services/rv-detailing/process-3.png';
const resultsImage = '/images/services/rv-detailing/before.png';
const resultsImage2 = '/images/services/rv-detailing/after.png';
const whatItIsImage = '/images/services/rv-detailing/what-it-is.png';

export const rvDetailingData: ServiceData = {
  id: 'rv-detailing',
  title: 'RV Detailing',
  description:
    'Comprehensive RV detailing that protects your home on wheels from road grime, UV damage, and wear—ensuring comfort and longevity for your adventures.',
  heroImage: heroImage,

  whatItIs: {
    description:
      'Complete RV service focused on exterior protection, interior deep cleaning, and RV-specific maintenance. This specialized service is designed for recreational vehicles, motorhomes, and travel trailers exposed to road conditions and outdoor elements.',
    benefits: [
      'Removes road grime, bugs, and environmental contaminants',
      'Protects against UV damage and weather elements',
      'Interior deep clean including appliances, upholstery, and storage areas',
      'Awning and slide-out maintenance and protection',
      'Prepares surfaces for advanced protection coatings and treatments'
    ],
    image: whatItIsImage
  },

  process: {
    title: 'Our RV Detailing Process',
    steps: [
      {
        number: 1,
        title: 'RV Assessment & Prep',
        description:
        ["Inspection of exterior, interior, and RV-specific components", 
          "High-pressure rinse to remove road grime and bugs",
          "Foam and hand wash with RV-safe cleaning products"
        ],
        image: processImage
        },
      {
        number: 2,
        title: 'Interior Deep Clean',
        description:
        ["Appliance cleaning and sanitization",
          "Upholstery and carpet deep cleaning", 
          "Storage compartments and slide-out maintenance"
        ],
        image: processImage2
        },
      {
        number: 3,
        title: 'Protection & Enhancement',
        description:[
          "Exterior wax and UV protection application",
          "Awning cleaning and mold prevention treatment",
          "Tire and wheel care with protective dressing",
        ],
        image: processImage3
        }
    ]
  },

  results: {
    description: ["Clean, protected exterior that resists road grime and UV damage","Fresh, sanitized interior ready for comfortable travel","Well-maintained components that extend RV lifespan and performance"],
    beforeImage: resultsImage,
    afterImage: resultsImage2
  },

  information: {
    title: 'RV Detailing Information',
    faqs: [
      {
        question: 'How long does RV detailing take?',
        answer:
          'Typically 6-12 hours for standard RVs. Larger motorhomes and complex units can take 1-2 days depending on size and condition.'
      },
      {
        question: 'Do you clean interior appliances and systems?',
        answer:
          'Yes. We clean and sanitize all interior appliances, HVAC systems, and RV-specific components to ensure proper function and hygiene.'
      },
      {
        question: 'What about awnings and slide-outs?',
        answer:
          'We clean and treat awnings to prevent mold and mildew, and maintain slide-out mechanisms and seals for smooth operation.'
      },
      {
        question: 'Do you work on all types of RVs?',
        answer:
          'Yes. We service motorhomes, travel trailers, fifth wheels, toy haulers, and all types of recreational vehicles.'
      },
      {
        question: 'How often should I detail my RV?',
        answer:
          'We recommend detailing every 3-6 months depending on usage and travel frequency. Seasonal detailing helps maintain protection and prevent damage.'
      }
    ]
  },

  action: {
    title: 'Ready to protect your RV?',
    description:
      ' ',
    bookLabel: 'Book RV Detailing',
    quoteLabel: 'Get Quote'
  }
};
