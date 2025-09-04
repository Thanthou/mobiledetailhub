// src/services/data/paint-correction.ts
import type { ServiceData } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA ASSETS
// TODO[hero]: Half-and-half panel (masked line) showing BEFORE (swirls/haze) vs AFTER (deep gloss).
// Dark color works best to show defects. Soft studio or shaded outdoor light.
// Optional: short loop video version for hover on desktop.
const heroImage = '/images/services/paint-correction/hero.jpg';

// TODO[process-1]: Compounding pass — wool/microfiber pad on a DA polisher,
// light dusting captured in the air, precise hand placement; shallow DOF macro.
const processImage = '/images/services/paint-correction/process-1.jpg';

// TODO[process-2]: Refining polish — yellow/foam pad, tight "rope light" reflections showing clarity.
const processImage2 = '/images/services/paint-correction/process-2.jpg';

// TODO[process-3]: Inspection — paint depth gauge in frame or cross-polarized light shot,
// showing a crystal-clear, hologram-free finish.
const processImage3 = '/images/services/paint-correction/process-3.jpg';

// TODO[results-before/after]: Same angle/lighting for slider. BEFORE: swirls, RIDs, oxidation.
// AFTER: sharp, mirror reflections. Keep lighting neutral to avoid "lighting trick" skepticism.
const resultsImage = '/images/services/paint-correction/before.jpg';
const resultsImage2 = '/images/services/paint-correction/after.jpg';

// TODO[whatItIs]: Simple graphic: clear coat layers + "defects" vs "leveled finish", or
// a 1–2 sentence explainer overlay ("Removes swirls/haze to restore true gloss").
const whatItIsImage = '/images/services/paint-correction/what-it-is.png';

export const paintCorrectionData: ServiceData = {
  id: 'paint-correction',
  title: 'Paint Correction',
  description:
    "Professional machine polishing that removes swirls, haze, and light scratches—restoring true gloss and clarity before ceramic coating or PPF.",
  heroImage,

  whatItIs: {
    description:
      "Paint correction is a safe, measured polishing process that levels microscopic defects in the clear coat (swirls, marring, oxidation, light scratches). The result is a sharper, deeper, more reflective finish that's the ideal foundation for Ceramic Coating or Paint Protection Film.",
    benefits: [
      'Removes wash swirls, oxidation, and light scratches',
      'Restores depth, clarity, and accurate color',
      'Eliminates holograms from poor prior polishing',
      'Measured approach that preserves clear coat health',
      'Prepares paint for long-term protection (Ceramic/PPF)'
    ],
    image: whatItIsImage
  },

  process: {
    title: 'Our Paint Correction Process',
    steps: [
      {
        number: 1,
        title: 'Assessment, Prep & Test Spot',
        description: [
          'Lighting-based inspection and paint-depth readings (where applicable)',
          'Mineral-free pre-rinse, foam, contact wash, and full decontamination',
          'Test-spot to dial in safest pad/polish combo for your paint system'
        ],
        image: processImage
      },
      {
        number: 2,
        title: 'Cut & Refine',
        description: [
          'Targeted compounding to remove heavier defects where needed',
          'Refining polish to maximize clarity and eliminate micro-marring',
          'Tight panel control and temperature-safe machine technique'
        ],
        image: processImage2
      },
      {
        number: 3,
        title: 'Inspection & Protection',
        description: [
          'Cross-light and panel wipe to verify a hologram-free finish',
          'Optional sealant, Ceramic Coating, or PPF for lasting protection',
          'After-care guidance to keep the finish looking its best'
        ],
        image: processImage3
      }
    ]
  },

  results: {
    description: [
      "Significantly reduced swirls and haze—true, mirror-like reflections",
      "Color that appears richer and more accurate under all lighting",
      "A proper base that lets Ceramic/PPF bond and perform optimally"
    ],
    beforeImage: resultsImage,
    afterImage: resultsImage2,
    containerSize: 'large'
  },

  information: {
    title: 'Paint Correction Information',
    faqs: [
      {
        question: 'Will paint correction remove all scratches?',
        answer:
          "It removes the vast majority of swirls, haze, and light defects. Deep scratches that penetrate the clear coat may require touch-up or bodywork. We always set expectations after an in-person inspection."
      },
      {
        question: 'Is it safe for my clear coat?',
        answer:
          "Yes. We use a measured approach, modern dual-action polishers, and controlled heat. Only a very thin layer is removed to level defects, and we verify progress with lighting and, when applicable, paint-depth readings."
      },
      {
        question: 'How many stages do I need?',
        answer:
          "It depends on paint condition and goals. A one-step enhances gloss and removes light defects. Two-step (cut + refine) targets moderate defects. Multi-step is reserved for severe cases or show-car results."
      },
      {
        question: 'How long does it take?',
        answer:
          "Most one-step packages take ~4–6 hours. Two-step corrections range ~6–12+ hours depending on vehicle size and condition."
      },
      {
        question: 'Do I need Ceramic Coating or PPF afterwards?',
        answer:
          "Correction restores the look; protection preserves it. Ceramic adds slickness, gloss, and chemical resistance. PPF physically guards against rock chips. Many owners choose Ceramic over the entire car and PPF on high-impact areas."
      },
      {
        question: 'How do I keep it looking new?',
        answer:
          "Use proper wash technique: pH-balanced soap, quality wash media, and soft drying towels. Avoid automatic brushes. This minimizes new swirls and extends the life of your corrected finish."
      }
    ]
  },

  action: {
    title: 'Ready to restore a truly glossy finish?',
    description:
      "Book an assessment or request a fast quote. We'll recommend the right correction package and protection so your paint stays stunning.",
    bookLabel: 'Book Paint Correction',
    quoteLabel: 'Get Quote'
  }
};
