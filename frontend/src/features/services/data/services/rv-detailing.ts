// src/services/data/rv-detailing.ts
import type { ServiceData } from '../../types/service';

const heroImage = '/images/services/rv-detailing/hero.jpg';
const processImage = '/images/services/rv-detailing/process-1.jpg';
const processImage2 = '/images/services/rv-detailing/process-2.jpg';
const processImage3 = '/images/services/rv-detailing/process-3.jpg';
const resultsImage = '/images/services/rv-detailing/before.jpg';
const resultsImage2 = '/images/services/rv-detailing/after.jpg';
const whatItIsImage = '/images/services/rv-detailing/what-it-is.jpg';

export const rvDetailingData: ServiceData = {
  id: 'rv-detailing',
  title: 'RV Detailing',
  slug: 'rv-detailing',
  description:
    'Comprehensive RV exterior detailing that protects your home on wheels from road grime, UV damage, and weather—keeping your rig looking sharp and lasting longer.',
  shortDescription: 'Professional RV exterior detailing and protection',
  heroImage: heroImage,

  overview: {
    title: 'RV Detailing Overview',
    content: 'Professional mobile RV detailing service designed for recreational vehicles, motorhomes, and travel trailers.',
    benefits: [
      'RV-specific cleaning products and techniques',
      'Road grime and bug removal',
      'UV protection and oxidation prevention'
    ],
    features: [
      'High-pressure rinse system',
      'Awning and slide-out cleaning',
      'Tire and wheel protection',
      'UV-resistant sealants'
    ]
  },

  gallery: {
    title: 'RV Detailing Gallery',
    images: [
      {
        id: '1',
        src: heroImage,
        alt: 'RV detailing service',
        caption: 'Professional RV detailing'
      }
    ]
  },

  faq: {
    title: 'RV Detailing FAQ',
    questions: [
      {
        id: 1,
        question: 'How long does RV detailing take?',
        answer: 'Typically 4-8 hours for most RVs. Larger Class A motorhomes can take a full day.'
      },
      {
        id: 2,
        question: 'Do you clean awnings and slide-outs?',
        answer: 'Yes. We clean and treat awnings to prevent mold and mildew, and maintain slide-out exteriors.'
      }
    ]
  },

  pricing: {
    title: 'RV Detailing Pricing',
    tiers: [
      {
        id: 'basic',
        name: 'Basic RV Detail',
        price: '$180',
        description: 'Standard RV exterior cleaning',
        popular: false,
        features: ['Exterior wash', 'Bug removal', 'Basic protection']
      },
      {
        id: 'premium',
        name: 'Premium RV Detail',
        price: '$280',
        description: 'Complete RV detailing with protection',
        popular: true,
        features: ['Awning cleaning', 'UV protection', 'Tire dressing']
      }
    ]
  },

  whatItIs: {
    description:
      'Exterior-focused RV service designed to remove dirt, bugs, and oxidation while adding UV protection. This specialized service is tailored for recreational vehicles, motorhomes, and travel trailers exposed to the road and outdoor elements.',
    benefits: [
      'Removes road grime, bugs, and environmental contaminants',
      'Protects against UV damage and oxidation',
      'Awning and slide-out cleaning and protection',
      'Tire and wheel care with protective dressing',
      'Prepares surfaces for advanced coatings and sealants'
    ],
    image: whatItIsImage
  },

  process: {
    title: 'Our RV Detailing Process',
    steps: [
      {
        number: 1,
        title: 'RV Assessment & Prep',
        description: [
          'Inspection of exterior and RV-specific components',
          'High-pressure rinse to remove road grime and bugs',
          'Foam and hand wash with RV-safe cleaning products'
        ],
        image: processImage
      },
      {
        number: 2,
        title: 'Decontamination & Cleaning',
        description: [
          'Bug and tar removal from front cap and mirrors',
          'Oxidation and surface contaminant treatment',
          'Awning and slide-out cleaning'
        ],
        image: processImage2
      },
      {
        number: 3,
        title: 'Protection & Enhancement',
        description: [
          'Exterior wax or sealant with UV protection',
          'Tire and wheel care with protective dressing',
          'Trim and plastics dressed with a satin finish'
        ],
        image: processImage3
      }
    ]
  },

  results: {
    description: [
      'Clean, glossy exterior that resists road grime and UV damage',
      'Awnings and slide-outs free from buildup and well-protected',
      'Tires, wheels, and trim restored with a fresh protective finish'
    ],
    beforeImage: resultsImage,
    afterImage: resultsImage2,
    containerSize: 'large'
  },

  information: {
    title: 'RV Detailing Information',
    faqs: [
      {
        question: 'How long does RV detailing take?',
        answer:
          'Typically 4–8 hours for most RVs. Larger Class A motorhomes can take a full day depending on size and condition.'
      },
      {
        question: 'Do you clean awnings and slide-outs?',
        answer:
          'Yes. We clean and treat awnings to prevent mold and mildew, and maintain slide-out exteriors and seals for smooth operation.'
      },
      {
        question: 'Do you work on all types of RVs?',
        answer:
          'Yes. We service motorhomes, travel trailers, fifth wheels, toy haulers, and all types of recreational vehicles.'
      },
      {
        question: 'How often should I detail my RV?',
        answer:
          'We recommend exterior detailing every 3–6 months depending on usage and exposure. Seasonal detailing helps maintain protection and prevent damage.'
      }
    ]
  },

  action: {
    title: 'Ready to protect your RV exterior?',
    description: '',
    bookLabel: 'Book RV Detailing',
    quoteLabel: 'Get Quote'
  }
};
