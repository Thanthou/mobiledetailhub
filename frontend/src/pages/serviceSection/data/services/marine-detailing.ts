// src/services/data/marine-detailing.ts
import type { ServiceData } from '../types';

const heroImage = '/images/services/marine-detailing/hero.png';
const processImage = '/images/services/marine-detailing/process-1.jpg';
const processImage2 = '/images/services/marine-detailing/process-2.png';
const processImage3 = '/images/services/marine-detailing/process-3.png';
const resultsImage = '/images/services/marine-detailing/before.png';
const resultsImage2 = '/images/services/marine-detailing/after.jpg';
const whatItIsImage = '/images/services/marine-detailing/what-it-is.jpg';

export const marineDetailingData: ServiceData = {
  id: 'marine-detailing',
  title: 'Marine Detailing',
  description:
    'Specialized marine detailing that protects your boat from salt water, UV damage, and marine growth—ensuring maximum performance and longevity.',
  heroImage: heroImage,

  whatItIs: {
    description:
      'Complete marine-grade service focused on salt removal, UV protection, and marine-specific contamination. This specialized service is designed for boats, yachts, and watercraft exposed to harsh marine environments.',
    benefits: [
      'Removes salt deposits and marine contaminants (barnacles, algae, sea spray)',
      'Protects against UV damage and salt water corrosion',
      'Marine-grade wax and sealants for extended protection',
      'Hull and deck deep cleaning with specialized marine products',
      'Prepares surfaces for advanced marine coatings and protection'
    ],
    image: whatItIsImage
  },

  process: {
    title: 'Our Marine Detailing Process',
    steps: [
      {
        number: 1,
        title: 'Marine Assessment & Prep',
        description:
        ["Inspection of hull, deck, and marine-specific damage", 
          "Fresh water rinse to remove salt and marine debris",
          "Marine-grade foam and hand wash with specialized media"
        ],
        image: processImage
        },
      {
        number: 2,
        title: 'Marine Decontamination',
        description:
        ["Barnacle and marine growth removal",
          "Salt deposit and corrosion treatment", 
          "Hull and deck surface preparation for protection"
        ],
        image: processImage2
        },
      {
        number: 3,
        title: 'Marine Protection & Enhancement',
        description:[
          "Marine-grade wax and UV protection application",
          "Deck and interior marine cleaning",
          "Metal and hardware corrosion protection",
        ],
        image: processImage3
        }
    ]
  },

  results: {
    description: ["Salt-free, protected hull that maximizes performance and fuel efficiency","UV-protected surfaces that resist fading and cracking","Marine-grade protection that lasts through the boating season"],
    beforeImage: resultsImage,
    afterImage: resultsImage2,
    containerSize: 'large'
  },

  information: {
    title: 'Marine Detailing Information',
    faqs: [
      {
        question: 'How long does marine detailing take?',
        answer:
          'Typically 6-10 hours for standard boats. Larger vessels and yachts can take 1-3 days depending on size and condition.'
      },
      {
        question: 'Do you work at marinas and docks?',
        answer:
          'Yes. We are fully mobile and can service your boat at most marinas, docks, and boat ramps.'
      },
      {
        question: 'Will marine detailing remove barnacles and marine growth?',
        answer:
          'Yes. We use specialized marine products and techniques to safely remove barnacles, algae, and other marine growth without damaging your hull.'
      },
      {
        question: 'How long does marine protection last?',
        answer:
          'Marine-grade protection typically lasts 3-6 months depending on usage and water conditions. We recommend seasonal detailing for optimal protection.'
      },
      {
        question: 'Do you use fresh water for rinsing?',
        answer:
          'Yes. We bring our own fresh water supply to ensure proper salt removal and prevent further corrosion during the detailing process.'
      }
    ]
  },

  action: {
    title: 'Ready to protect your vessel?',
    description:
      ' ',
    bookLabel: 'Book Marine Detailing',
    quoteLabel: 'Get Quote'
  }
};
