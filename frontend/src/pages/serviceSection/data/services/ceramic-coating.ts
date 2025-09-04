// src/services/data/ceramic-coating.ts
// NOTE: Structure kept consistent with ServiceData. I refined copy for clarity & conversion,
// softened absolute claims (e.g., “permanent” → “durable, semi-permanent”), and added
// TODO comments suggesting high-impact visuals you can capture or generate.

// Source alignment: your PDF mentions pro-grade install, rapid flash, 24h dry time, 5–7 day cure,
// strong chemical resistance, high gloss & hydrophobics — we echo those benefits succinctly.
// (Undrdog Pro Plus / HCC overview)  [See project PDF]  :contentReference[oaicite:1]{index=1}

import type { ServiceData } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA ASSETS
// TODO[hero]: 3/4 front, dark glossy vehicle under soft studio or golden-hour light.
// Emphasize deep gloss + tight water beading (macro droplets on hood) for instant “ceramic” cue.
const heroImage = '/images/services/ceramic-coating/hero.png';

// TODO[process-1]: Prep macro — clay/IPA wipe on dark panel; shallow DOF; satisfying streak-free wipe.
const processImage = '/images/services/ceramic-coating/process-1.png';

// TODO[process-2]: Application mid-shot — cross-hatch application with high-quality applicator block.
// Subtle “flash/rainbow” look is optional; keep it tasteful and realistic.
const processImage2 = '/images/services/ceramic-coating/process-2.png';

// TODO[process-3]: Curing/inspection — close-up gloss check with light bar reflections (“rope lights”).
// Optionally show IR lamp if you use one.
const processImage3 = '/images/services/ceramic-coating/process-3.png';

// TODO[results-before/after]: Real vehicle, same angle/lighting; before = light swirls/water spotting,
// after = richer gloss, tighter beads/sheeting. Consider a draggable slider component.
const resultsImage = '/images/services/ceramic-coating/before.png';
const resultsImage2 = '/images/services/ceramic-coating/after.png';

// TODO[whatItIs]: Clean infographic: "Wax vs Sealant vs Ceramic vs PPF" with 3–4 simple axes
// (Protection, Longevity, Ease of Wash, Rock-Chip Resistance). Keep it minimal.
// Note: Replaced with interactive ProtectionComparisonChart component

export const ceramicCoatingData: ServiceData = {
  id: 'ceramic-coating',
  title: 'Ceramic Coating',
  description:
    // Benefit-led one-liner: shine, easier washing, long-term protection.
    'Durable ceramic coating that bonds to your clear coat for deep gloss, slick hydrophobics, and easier washes—lasting protection you can see and feel.',
  heroImage,

  whatItIs: {
    // Simple "what it is" + payoff. Avoid over-claiming "permanent."
    description:
      "A pro-grade, nano-ceramic layer applied to your clear coat. It cures into a dense, slick barrier that boosts gloss, resists chemicals/UV, and keeps paint cleaner between washes.",
    benefits: [
      'Deep, mirror-like gloss that makes color pop',
      'Hydrophobic surface: water beads/sheets off to reduce spotting',
      'Strong resistance to chemicals, UV, and road grime',
      'Easier, faster maintenance with less dirt bonding',
      'Durable, semi-permanent protection measured in years'
    ],
    chart: {
      type: 'protection-comparison' as const,
      title: 'How Ceramic Coating Compares'
    }
  },

  process: {
    title: 'Our Ceramic Coating Process',
    steps: [
      {
        number: 1,
        title: 'Paint Prep & Refinement',
        description: [
          'Decontamination and clay treatment to remove bonded fallout',
          'Targeted single to multi-stage correction as needed for gloss',
          'Final isopropyl alcohol wipe to ensure a perfectly clean surface'
        ],
        image: processImage
      },
      {
        number: 2,
        title: 'Controlled Application',
        description: [
          'Cross-hatch application for uniform film build',
          'Panel-by-panel leveling and high-spot checks',
          'Professional environment for consistent flash and finish'
        ],
        image: processImage2
      },
      {
        number: 3,
        title: 'Cure & Quality Check',
        description: [
          'Initial set/dry within ~24 hours; avoid moisture during this window',
          'Full chemical resistance typically develops by day 5–7',
          'Final inspection and after-care guidance before hand-off'
        ],
        image: processImage3
      }
    ]
  },

  results: {
    description: [
      "Showroom-level gloss and rich, liquid reflections",
      "Hydrophobic behavior that helps reduce spotting and speeds up washing",
      "Durable protection against UV, chemicals, and daily contaminants"
    ],
    beforeImage: resultsImage,
    afterImage: resultsImage2,
    containerSize: 'large'
  },

  information: {
    title: 'Ceramic Coating Information',
    faqs: [
      {
        question: 'How long does ceramic coating last?',
        answer:
          "Professional coatings are designed to last multiple years with proper care. Lifespan depends on environment, wash routine, and product grade."
      },
      {
        question: 'Is paint correction required?',
        answer:
          "Highly recommended. Coatings lock in the paint’s current state. We refine swirls/haze first so you seal in maximum clarity and gloss."
      },
      {
        question: 'Is it scratch-proof?',
        answer:
          "No coating is scratch-proof. Ceramic helps reduce wash-induced marring but does not stop rock chips or deep scratches (that’s what PPF is for)."
      },
      {
        question: 'How do I wash after coating?',
        answer:
          "Use pH-balanced soap, quality mitts, and soft towels. Avoid harsh chemicals during the first week while the coating achieves full resistance."
      },
      {
        question: 'Ceramic vs. wax or sealant?',
        answer:
          "Wax/sealants offer weeks to months of protection. Ceramic is a denser, longer-lasting layer with stronger hydrophobics and chemical resistance."
      },
      {
        question: 'Can I layer ceramic over PPF?',
        answer:
          "Yes. Many owners coat PPF for added slickness and easier cleaning—the best of both worlds."
      },
      {
        question: 'How much does it cost?',
        answer:
          'Typical professional installs range from $800–$3,000+ depending on vehicle size, paint condition, and coating tier.'
      }
    ]
  },

  action: {
    title: 'Ready for ceramic gloss & easy maintenance?',
    // Sales microcopy: outcome + risk reversal + prompt.
    description:
      "Get a tailored package for your paint. We handle prep, application, and after-care—so you drive away with lasting shine and minimal upkeep.",
    bookLabel: 'Book Ceramic Coating',
    quoteLabel: 'Get Quote'
  }
};
