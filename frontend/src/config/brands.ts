/**
 * Master Brands Configuration
 * Centralized brand data that can be referenced by business configs
 */

export interface Brand {
  name: string;
  description: string;
  logo: string;
  url: string;
  scale: string; // CSS scale class for image sizing
  verticalPosition: string; // CSS positioning for vertical alignment
  horizontalPosition: string; // CSS positioning for horizontal alignment
}

// Master brands dictionary
export const BRANDS_DICT: Record<string, Brand> = {
  'testbrand': {
    name: 'Test Brand',
    description: 'This is a test brand',
    logo: '/brands/testbrand.png',
    url: 'https://example.com',
    scale: 'scale-100',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  '3d': {
    name: '3D',
    description: 'Professional auto detailing supplies and car care products',
    logo: '/brands/3d.png',
    url: 'https://3dproducts.com/',
    scale: 'scale-80',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0' // Center
  },
  '3m': {
    name: '3M',
    description: 'Auto paint and small scratch repair made simple',
    logo: '/brands/3m.png',
    url: 'https://www.3m.com/',
    scale: 'scale-90',
    verticalPosition: 'translate-y-0',
    horizontalPosition: '-translate-x-1' // Left 4px
  },
  'adams': {
    name: 'Adam\'s Polishes',
    description: 'Premium car care and detailing products',
    logo: '/brands/adams.webp',
    url: 'https://adamspolishes.com/',
    scale: 'scale-85',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-1' // Right 4px
  },
  'c6': {
    name: 'C6',
    description: 'Advanced ceramic coating technology',
    logo: '/brands/c6.webp',
    url: 'https://c6.com/',
    scale: 'scale-80',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'carpro': {
    name: 'CarPro',
    description: 'Professional detailing products and coatings',
    logo: '/brands/carpro.png',
    url: 'https://carpro-us.com',
    scale: 'scale-70',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'ceramic_pro': {
    name: 'Ceramic Pro',
    description: 'Premium ceramic coating products',
    logo: '/brands/ceramic_pro.jfif',
    url: 'https://ceramicpro.com',
    scale: 'scale-100',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'chemicalguys': {
    name: 'Chemical Guys',
    description: 'Complete car care and detailing solutions',
    logo: '/brands/chemicalguys.jpg',
    url: 'https://chemicalguys.com/',
    scale: 'scale-85',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'griots': {
    name: 'Griot\'s Garage',
    description: 'Professional car care and detailing tools',
    logo: '/brands/griots.jpg',
    url: 'https://www.griotsgarage.com/',
    scale: 'scale-80',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'koch': {
    name: 'Koch Chemie',
    description: 'German precision car care products',
    logo: '/brands/koch.png',
    url: 'https://koch-chemie.com/',
    scale: 'scale-125',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'lake-country': {
    name: 'Lake Country',
    description: 'Professional buffing and polishing pads',
    logo: '/brands/lake-country.png',
    url: 'https://lakecountrymfg.com/',
    scale: 'scale-100',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'lamin-x': {
    name: 'Lamin-X',
    description: 'Paint protection film and headlight protection',
    logo: '/brands/lamin-x.png',
    url: 'https://lamin-x.com/',
    scale: 'scale-150',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-2'
  },
  'meguires': {
    name: 'Meguiar\'s',
    description: 'Trusted car care and detailing products',
    logo: '/brands/meguires.jpg',
    url: 'https://www.meguiars.com/',
    scale: 'scale-85',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'menzerna': {
    name: 'Menzerna',
    description: 'German precision polishing compounds',
    logo: '/brands/menzerna.webp',
    url: 'https://www.menzerna.com/',
    scale: 'scale-100',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'mirka': {
    name: 'Mirka',
    description: 'Professional sanding and finishing solutions',
    logo: '/brands/mirka.webp',
    url: 'https://www.mirka.com/',
    scale: 'scale-150',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'mtm_hydro': {
    name: 'MTM Hydro',
    description: 'Professional pressure washing equipment',
    logo: '/brands/mtm_hydro.jpg',
    url: 'https://www.mtmhydroparts.com/',
    scale: 'scale-75',
    verticalPosition: 'translate-y-0',
    horizontalPosition: '-translate-x-1'
  },
  'poka': {
    name: 'Poka',
    description: 'Innovative car care and detailing products',
    logo: '/brands/poka.png',
    url: 'https://pokapremium.com/',
    scale: 'scale-110',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'rupes': {
    name: 'Rupes',
    description: 'Professional polishing and buffing machines',
    logo: '/brands/rupes.png',
    url: 'https://www.rupes.com/',
    scale: 'scale-100',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'shopvac': {
    name: 'Shop-Vac',
    description: 'Professional vacuum and cleaning equipment',
    logo: '/brands/shopvac.jpg',
    url: 'https://www.shopvac.com/',
    scale: 'scale-85',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'starke': {
    name: 'Starke',
    description: 'Premium ceramic coatings and detailing products',
    logo: '/brands/starke.png',
    url: 'https://starkeyachtcare.com/',
    scale: 'scale-110',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'underdog': {
    name: 'Underdog',
    description: 'Professional detailing tools and accessories',
    logo: '/brands/underdog.webp',
    url: 'https://getundrdog.com/',
    scale: 'scale-80',
    verticalPosition: 'translate-y-2',
    horizontalPosition: '-translate-x-2'
  },
  'xpel': {
    name: 'XPEL',
    description: 'Paint protection film solutions',
    logo: '/brands/xpel.png',
    url: 'https://xpel.com',
    scale: 'scale-110',
    verticalPosition: 'translate-y-2',
    horizontalPosition: 'translate-x-0'
  },
  'yot-stik': {
    name: 'Yot-Stik',
    description: 'Innovative detailing tools and accessories',
    logo: '/brands/yot-stik.webp',
    url: 'https://www.yotstik.com/',
    scale: 'scale-95',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  }
};

/**
 * Get brand data by keyword
 * @param keyword - The brand keyword (e.g., 'ceramic_pro', 'xpel')
 * @returns brand data or undefined if not found
 */
export function getBrand(keyword: string): Brand | undefined {
  return BRANDS_DICT[keyword.toLowerCase()];
}

/**
 * Get multiple brands by keywords
 * @param keywords - Array of brand keywords
 * @returns Array of brand data
 */
export function getBrands(keywords: string[]): Brand[] {
  return keywords
    .map(keyword => getBrand(keyword))
    .filter((brand): brand is Brand => brand !== undefined);
}

/**
 * Get all available brand keywords
 * @returns Array of all brand keywords
 */
export function getAllBrandKeywords(): string[] {
  return Object.keys(BRANDS_DICT);
}