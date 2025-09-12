// src/services/data/ppf-installation.ts
// NOTE: Keep the structure consistent with ServiceData. I only refined copy,
// reordered some bullets for impact, and added TODO comments for future upgrades.

import type { ServiceData } from '../../types/service';

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA ASSETS
// TODO[hero]: Use a clean, high-contrast 3/4 front car shot with glossy reflections.
// Ideally a dark vehicle outdoors at golden hour to show off gloss + clarity.
// If you offer matte PPF, consider an A/B slider (gloss vs matte) for the hero.
const heroImage = '/images/services/ppf-installation/hero.jpg';

// TODO[process-1]: Tight macro of decon/clay/IPA wipe on a dark panel (satisfying).
const processImage = '/images/services/ppf-installation/process-1.png';

// TODO[process-2]: Mid shot of squeegee pass with slip solution beading on film.
const processImage2 = '/images/services/ppf-installation/process-2.png';

// TODO[process-3]: Edge-wrapping close-up: show seamless edge and trimmed corner.
const processImage3 = '/images/services/ppf-installation/process-3.png';

// TODO[results]: Use a real before/after of a peppered front bumper vs. protected.
// If possible, add a draggable before/after slider component.
const resultsVideo = '/video/ppf_final1.mp4';
const resultsImage2 = '/images/services/ppf-installation/after.png';

// TODO[video]: 30–60s explainer (voiceover optional): "What PPF Is & Why It's Worth It"
// Open on rock chips montage → show film macro → end with covered areas + CTA.
const whatItIsVideo = '/video/ppf_worth.mp4';

export const ppfInstallationData: ServiceData = {
  id: 'ppf-installation',
  title: 'Paint Protection Film',
  slug: 'ppf-installation',
  description:
    // Keep this short, benefit-led, and concrete.
    "Invisible, self-healing protection that stops rock chips, road rash, and swirl marks—preserving showroom gloss and your vehicle's long-term value.",
  shortDescription: 'Professional paint protection film installation for maximum paint protection',
  heroImage,

  overview: {
    title: 'PPF Installation Overview',
    content: 'Professional installation of crystal-clear paint protection film that provides invisible, self-healing protection against rock chips and road debris.',
    benefits: [
      'Stops rock chips and road rash',
      'Self-healing surface for light scratches',
      'Virtually invisible clarity',
      'Maintains vehicle resale value'
    ],
    features: [
      'Surface preparation and refinement',
      'Precision film application',
      'Custom trimming and edge wrapping',
      'Quality assurance inspection'
    ]
  },

  gallery: {
    title: 'PPF Installation Gallery',
    images: [
      {
        id: '1',
        src: heroImage,
        alt: 'PPF installation service',
        caption: 'Professional paint protection film installation'
      }
    ]
  },

  faq: {
    title: 'PPF Installation FAQ',
    questions: [
      {
        id: 1,
        question: 'Will PPF change how my car looks?',
        answer: 'No. Premium films are optically clear and virtually invisible when installed correctly.'
      },
      {
        id: 2,
        question: 'How long does installation take?',
        answer: 'Most front-end packages take 1-2 days. Full-vehicle coverage typically takes 2-3 days.'
      }
    ]
  },

  pricing: {
    title: 'PPF Installation Pricing',
    tiers: [
      {
        id: 'front-end',
        name: 'Front-End Package',
        price: '$1200',
        description: 'Bumper, hood, mirrors, and fenders',
        popular: false,
        features: ['High-impact areas', 'Self-healing film', '5-year warranty']
      },
      {
        id: 'full-coverage',
        name: 'Full Vehicle Coverage',
        price: '$4000',
        description: 'Complete vehicle protection',
        popular: true,
        features: ['Full body coverage', 'Premium film', '10-year warranty']
      }
    ]
  },

  whatItIs: {
    // One-liner "what it is", then the payoff.
    description:
      "A crystal-clear polyurethane layer applied to high-impact areas (or the whole car). It self-heals light scratches with warmth and blocks chips from gravel and road debris—without changing your paint's look.",
    benefits: [
      // Order = impact: protection → look → longevity → care.
      'Stops rock chips and road rash on bumpers, hoods, mirrors, rockers',
      'Self-healing surface: light swirls disappear with heat (sun or warm water)',
      'Maintains factory finish: virtually invisible clarity or satin matte option',
      'Keeps resale higher by protecting original paint',
      'Low-maintenance: wash as normal; no special routines required'
    ],
    image: whatItIsVideo
  },

  process: {
    title: 'Our PPF Installation Process',
    steps: [
      {
        number: 1,
        title: 'Surface Perfection',
        description: [
          'Decontamination and targeted paint refinement where needed',
          'Isopropyl alcohol panel prep for clean, strong adhesion',
          'Exact pattern selection and precise panel measurements'
        ],
        image: processImage
      },
      {
        number: 2,
        title: 'Precision Application',
        description: [
          'Professional film laydown with controlled slip/tack solutions',
          'Custom trimming with wrapped edges for a seamless look',
          'Gentle heat to activate adhesion and self-healing properties'
        ],
        image: processImage2
      },
      {
        number: 3,
        title: 'Quality Assurance',
        description: [
          'Detailed inspection to eliminate bubbles and lift points',
          'Edge sealing and final micro-trims',
          'Cure check and after-care guidance before hand-off'
        ],
        image: processImage3
      }
    ]
  },

  results: {
    // Keep bullets short and concrete; they should echo hero promises.
    description: [
      "Invisible barrier keeps your original paint looking new",
      "Self-healing top layer reduces visible swirls over time",
      "Daily-driver toughness against chips, stains, and harsh elements"
    ],
    beforeImage: resultsVideo,
    afterImage: resultsImage2,
    containerSize: 'medium'
  },

  information: {
    title: 'PPF Installation Information',
    // FAQ = objection handling + education + expectation setting + care.
    faqs: [
      {
        question: 'Will PPF change how my car looks?',
        answer:
          "No. Premium films are optically clear and virtually invisible when installed correctly. Prefer a different look? We also offer satin matte finishes that transform the paint without a respray."
      },
      {
        question: 'How long does installation take?',
        answer:
          "Most front-end packages take 1–2 days. Full-vehicle coverage typically takes 2–3 days depending on model complexity and condition."
      },
      {
        question: 'What does "self-healing" mean?',
        answer:
          "The top coat is engineered to rebound from light swirls and marring with warmth (sunlight or warm water), keeping the surface looking freshly detailed."
      },
      {
        question: 'Can PPF be removed later?',
        answer:
          "Yes. When removed by a professional, quality PPF comes off cleanly without harming OEM paint."
      },
      {
        question: 'How long does it last?',
        answer:
          "Depending on the film tier and environment, premium films carry multi-year warranties and routinely protect for many years when cared for properly."
      },
      {
        question: 'PPF or ceramic coating?',
        answer:
          "They're different tools. PPF physically blocks impact (chips) and self-heals light swirls; coatings add slickness, gloss, and chemical resistance. Many owners do PPF on the high-impact areas and layer a coating on top for easy washing."
      },
      {
        question: 'Care & maintenance tips?',
        answer:
          "Wait 48 hours before washing. Hand-wash or touchless; avoid harsh chemicals. Use quality wash media and microfiber. If you see minor marks, park in sun or pour warm water to encourage self-healing."
      }
    ]
  },

  action: {
    title: 'Ready to protect your paint for years?',
    // Sales microcopy: promise + risk reversal + prompt.
    description:
      "Choose targeted coverage (front end) or go full-body for maximum protection. Our premium films are optically clear, self-healing, and backed by multi-year warranties. Get a tailored quote in minutes.",
    bookLabel: 'Book PPF Installation',
    quoteLabel: 'Get Quote'
  }
};
