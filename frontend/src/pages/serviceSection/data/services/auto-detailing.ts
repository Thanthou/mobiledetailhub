// src/services/data/auto-detailing.ts
import type { ServiceData } from '../types';
const heroImage = '/images/services/auto-detailing/hero.png';
const processImage = '/images/services/auto-detailing/process-1.png';
const processImage2 = '/images/services/auto-detailing/process-2.png';
const processImage3 = '/images/services/auto-detailing/process-3.jpg';
const resultsImage = '/images/services/auto-detailing/before.png';
const resultsImage2 = '/images/services/auto-detailing/after.png';
const whatItIsImage = '/images/services/auto-detailing/what-it-is.png';

export const autoDetailingData: ServiceData = {
  id: 'auto-detailing',
  title: 'Auto Detailing',
  description:
    'Thorough interior and exterior detailing that restores clarity, cleanliness, and protection—setting the stage for coatings and film.',
  heroImage: heroImage,

  whatItIs: {
    description:
      'Complete interior + exterior service focused on deep cleaning, decontamination, and entry-level protection. This is the ideal baseline before paint correction, ceramic coating, or paint protection film (PPF).',
    benefits: [
      'Removes bonded contaminants (rail dust, overspray, brake fallout)',
      'Restores gloss and clarity with safe wash + clay process',
      'Interior deep clean: carpets, seats, vents, touch points',
      'Protective sealant applied for short-term hydrophobics',
      'Prepares paint for advanced services (Correction, Coating, PPF)'
    ],
    image: whatItIsImage
  },

  process: {
    title: 'Our Auto Detailing Process',
    steps: [
      {
        number: 1,
        title: 'Assessment & Prep',
        description:
        ["Inspection of paint and interior condition", 
          "Reverse Osmosis mineral free Pre-Rinse",
          "Foam and Hand wash with contact-safe media"
        ],
        image: processImage
        },
      {
        number: 2,
        title: 'Decontamination',
        description:
        ["Fallout removal + clay treatment",
          "Removal of Iron & other bonded contaminants", 
          "Surface prepped for correction, protection, and enhancement"
        ],
        image: processImage2
        },
      {
        number: 3,
        title: 'Exterior & Interior Protection',
        description:[
          "Exterior paint sealant and enhancement",
          "Interior vacuum and steam/spot clean",
          "Trim and plastics dressed satin-matte",
        ],
        image: processImage3
        }
    ]
  },

  results: {
    description: ["Crisp, glossy finish that restores your vehicle's showroom look","Fresh, hygienic cabin with deep interior cleaning","Contaminant-free surface - maximizes bond of Ceramic Coatings and PPF"],
    beforeImage: resultsImage,
    afterImage: resultsImage2,
    containerSize: 'large'
  },

  information: {
    title: 'Auto Detailing Information',
    faqs: [
      {
        question: 'How long does auto detailing take?',
        answer:
          'Typically 5-8 hours for standard vehicles and details. Ceramic Coating and PPF installs can take 1 to 2 days.'
      },
      {
        question: 'Do you bring water and power?',
        answer:
          'Yes. We are fully mobile and bring filtered water, power, and all professional equipment.'
      },
      {
        question: 'Will detailing remove scratches or swirls?',
        answer:
          '3 Stage paint correction will remove nearly all scratches and swirls. Serious defects require auto-body repair.'
      },
      {
        question: 'How long does the protection last?',
        answer:
          'Ceramic Coatings typically lasts 3-8 years. Paint Protection Films typically lasts 3-5 years.'
      },
      {
        question: 'Is detailing required before Ceramic Coating or PPF?',
        answer:
          'Yes. A pristine, contaminant-free surface is essential. Ceramic Coating and PPF installs benefit from 3 stage paint correction.'
      }
    ]
  },

  action: {
    title: 'Ready to get started?',
    description:
      ' ',
    bookLabel: 'Book Auto Detailing',
    quoteLabel: 'Get Quote'
  }
};
