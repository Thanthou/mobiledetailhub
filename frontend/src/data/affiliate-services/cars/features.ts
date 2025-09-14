/**
 * Predefined service options for cars
 * These are the service names (keys) from the service.json that affiliates can select from
 */

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  explanation: string;
  duration: number;
  category: 'exterior' | 'interior' | 'protection' | 'correction' | 'preparation' | 'service-packages';
}

export const CAR_SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'full-exterior-detail',
    name: 'Full Exterior Detail',
    description: 'Complete exterior cleaning and protection service.',
    explanation: 'Our full exterior detail service provides a comprehensive cleaning of your vehicle\'s exterior surfaces. We use premium products and techniques to remove dirt, grime, road salt, and contaminants while protecting your paint with high-quality wash solutions and finishing products.',
    duration: 120,
    category: 'exterior'
  },
  {
    id: 'full-interior-detail',
    name: 'Full Interior Detail',
    description: 'Deep cleaning and restoration of all interior surfaces.',
    explanation: 'Our full interior detail service transforms your vehicle\'s interior with a meticulous cleaning of carpets, seats, panels, vents, and hard-to-reach areas. We use safe products that eliminate odors and leave your cabin refreshed and spotless.',
    duration: 150,
    category: 'interior'
  },
  {
    id: 'preparation-detail',
    name: 'Preparation Detail',
    description: 'Essential prep before correction or coating services.',
    explanation: 'Our preparation detail ensures your vehicle is fully decontaminated and ready for advanced services such as paint correction or ceramic coatings. This includes a deep clean, surface decontamination, and protective prep work.',
    duration: 90,
    category: 'preparation'
  },
  {
    id: 'fallout-removal',
    name: 'Fallout Removal',
    description: 'Targeted removal of iron particles and contaminants.',
    explanation: 'Fallout removal focuses on eliminating embedded iron, tar, and industrial fallout that regular washes cannot remove. This process restores a smooth surface and prevents long-term paint damage.',
    duration: 60,
    category: 'preparation'
  },
  {
    id: 'paint-enhancement',
    name: 'Paint Enhancement',
    description: 'Boosts gloss and depth with a light polish.',
    explanation: 'Paint enhancement is designed for vehicles that need improved shine but not full correction. A single-step polish refines the paint, reducing light swirls and enhancing overall gloss.',
    duration: 180,
    category: 'correction'
  },
  {
    id: '1-stage-paint-correction',
    name: '1-Stage Paint Correction',
    description: 'Single-step polish to improve gloss and remove light imperfections.',
    explanation: 'Our 1-stage paint correction enhances your vehicle\'s finish by removing light swirl marks and surface imperfections. It restores gloss and clarity in a cost-effective single-step process.',
    duration: 240,
    category: 'correction'
  },
  {
    id: '2-stage-paint-correction',
    name: '2-Stage Paint Correction',
    description: 'Cut and polish to remove moderate defects and restore depth.',
    explanation: 'This service uses a two-step process: compounding to remove moderate scratches and oxidation, followed by polishing to restore depth and shine. Ideal for vehicles with noticeable imperfections.',
    duration: 360,
    category: 'correction'
  },
  {
    id: '3-stage-paint-correction',
    name: '3-Stage Paint Correction',
    description: 'Multi-step correction for near-showroom perfection.',
    explanation: 'Our 3-stage correction process is designed for enthusiasts who want their paint to look as flawless as possible. This service removes deep scratches, heavy swirl marks, and severe oxidation with compounding, refining, and finishing steps.',
    duration: 480,
    category: 'correction'
  },
  {
    id: 'essential-ceramic-coating',
    name: 'Essential Ceramic Coating',
    description: 'Entry-level ceramic coating for durable protection.',
    explanation: 'Our essential ceramic coating provides strong protection against UV rays, water spots, and contaminants. Designed for those who want an affordable yet durable upgrade in gloss and hydrophobic performance.',
    duration: 300,
    category: 'protection'
  },
  {
    id: 'enduring-ceramic-coating',
    name: 'Enduring Ceramic Coating',
    description: 'Long-lasting ceramic protection with extreme durability.',
    explanation: 'Our enduring ceramic coating is a premium solution offering multi-year protection, extreme gloss, and unmatched hydrophobic properties. Ideal for owners who want to safeguard their investment long-term.',
    duration: 420,
    category: 'protection'
  }
];

// Group services by category for easier organization
export const CAR_SERVICES_BY_CATEGORY = {
  exterior: CAR_SERVICE_OPTIONS.filter(s => s.category === 'exterior'),
  interior: CAR_SERVICE_OPTIONS.filter(s => s.category === 'interior'),
  protection: CAR_SERVICE_OPTIONS.filter(s => s.category === 'protection'),
  correction: CAR_SERVICE_OPTIONS.filter(s => s.category === 'correction'),
  preparation: CAR_SERVICE_OPTIONS.filter(s => s.category === 'preparation'),
  'service-packages': CAR_SERVICE_OPTIONS.filter(s => s.category === 'service-packages')
};

// Helper function to get services by category
export const getServicesByCategory = (category: ServiceOption['category']) => {
  return CAR_SERVICES_BY_CATEGORY[category];
};

// Helper function to get service by ID
export const getServiceById = (id: string) => {
  return CAR_SERVICE_OPTIONS.find(s => s.id === id);
};
