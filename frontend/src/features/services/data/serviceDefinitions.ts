// Service definitions data
export const serviceDefinitions = [
  {
    title: 'Auto Detailing',
    image: '/images/services/thumbnails/auto.png',
    slug: 'auto-detailing',
    description: 'Complete interior and exterior detailing for your vehicle',
    startingPrice: '$150'
  },
  {
    title: 'Marine Detailing',
    image: '/images/services/thumbnails/boat.png',
    slug: 'marine-detailing',
    description: 'Specialized detailing for boats and marine vessels',
    startingPrice: '$200'
  },
  {
    title: 'RV Detailing',
    image: '/images/services/thumbnails/rv.png',
    slug: 'rv-detailing',
    description: 'Comprehensive cleaning for RVs and motorhomes',
    startingPrice: '$300'
  },
  {
    title: 'Ceramic Coating',
    image: '/images/services/thumbnails/ceramic.png',
    slug: 'ceramic-coating',
    description: 'Long-lasting protection with ceramic coating',
    startingPrice: '$500'
  },
  {
    title: 'Paint Correction',
    image: '/images/services/thumbnails/paint.png',
    slug: 'paint-correction',
    description: 'Professional paint correction and restoration',
    startingPrice: '$400'
  },
  {
    title: 'Paint Protection Film',
    image: '/images/services/thumbnails/ppf.png',
    slug: 'paint-protection-film',
    description: 'Clear protective film for paint protection',
    startingPrice: '$600'
  },
];

export type ServiceDefinition = typeof serviceDefinitions[0];
