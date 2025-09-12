// src/services/data/interior-exterior.ts
import type { ServiceData } from '../../types/service';

const heroImage = '/images/services/interior-exterior/hero.png';
const processImage = '/images/services/interior-exterior/process-1.png';
const processImage2 = '/images/services/interior-exterior/process-2.png';
const processImage3 = '/images/services/interior-exterior/process-3.png';
const resultsImage = '/images/services/interior-exterior/before.png';
const resultsImage2 = '/images/services/interior-exterior/after.png';
const whatItIsImage = '/images/services/interior-exterior/what-it-is.png';

export const interiorExteriorData: ServiceData = {
  id: 'interior-exterior',
  title: 'Interior & Exterior',
  description:
    'Complete vehicle care package that combines comprehensive interior and exterior detailing—delivering showroom-quality results for both inside and outside of your vehicle.',
  heroImage: heroImage,

  whatItIs: {
    description:
      'Our most comprehensive service package that combines full interior and exterior detailing in one convenient service. This all-in-one solution provides complete vehicle care, from deep interior cleaning to exterior protection, ensuring your vehicle looks and feels like new.',
    benefits: [
      'Complete interior deep cleaning and sanitization',
      'Full exterior wash, wax, and protection treatment',
      'All-in-one convenience with comprehensive coverage',
      'Best value package for complete vehicle care',
      'Professional-grade products and techniques throughout'
    ],
    image: whatItIsImage
  },

  process: {
    title: 'Our Complete Service Process',
    steps: [
      {
        number: 1,
        title: 'Exterior Deep Clean',
        description:
        ["High-pressure rinse and foam wash with premium products", 
          "Clay bar treatment and surface decontamination",
          "Wax application and exterior protection treatment"
        ],
        image: processImage
        },
      {
        number: 2,
        title: 'Interior Deep Clean',
        description:
        ["Vacuum and steam cleaning of all interior surfaces",
          "Leather conditioning and fabric protection", 
          "Dashboard, console, and trim cleaning and protection"
        ],
        image: processImage2
        },
      {
        number: 3,
        title: 'Final Inspection & Protection',
        description:[
          "Quality inspection of all completed work",
          "Final touches and protection application",
          "Interior air freshening and exterior final polish",
        ],
        image: processImage3
        }
    ]
  },

  results: {
    description: ["Showroom-quality interior that feels fresh and hygienic","Glossy, protected exterior that resists environmental damage","Complete vehicle transformation that maximizes comfort and appearance"],
    beforeImage: resultsImage,
    afterImage: resultsImage2
  },

  information: {
    title: 'Complete Service Information',
    faqs: [
      {
        question: 'What\'s included in the complete interior & exterior service?',
        answer:
          'Everything! Exterior wash, clay treatment, wax, interior vacuum, steam cleaning, leather conditioning, fabric protection, dashboard cleaning, and air freshening.'
      },
      {
        question: 'How long does the complete service take?',
        answer:
          'The complete interior and exterior service typically takes 4-6 hours depending on vehicle size and condition. This ensures thorough cleaning and protection.'
      },
      {
        question: 'Is this the best value for comprehensive vehicle care?',
        answer:
          'Yes! Our complete service offers the best value by combining both interior and exterior services at a discounted rate compared to booking separately.'
      },
      {
        question: 'Do you clean all interior materials?',
        answer:
          'Yes. We clean and protect leather, fabric, vinyl, plastic, and all interior surfaces using appropriate products for each material type.'
      },
      {
        question: 'What protection is included?',
        answer:
          'Exterior wax protection, interior fabric protection, leather conditioning, and dashboard/trim protection to maintain your vehicle\'s condition.'
      }
    ]
  },

  action: {
    title: 'Ready for complete service?',
    description:
      ' ',
    bookLabel: 'Book Complete Service',
    quoteLabel: 'Get Quote'
  }
};
