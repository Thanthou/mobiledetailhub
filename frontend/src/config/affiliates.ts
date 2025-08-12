/**
 * Master Affiliates Configuration
 * Centralized affiliate data that can be referenced by business configs
 */

export interface Affiliate {
  name: string;
  description: string;
  logo: string;
  url: string;
  scale: string; // CSS scale class for image sizing
  verticalPosition: string; // CSS positioning for vertical alignment
  horizontalPosition: string; // CSS positioning for horizontal alignment
}

// Master affiliates dictionary
export const AFFILIATES_DICT: Record<string, Affiliate> = {
  '3d': {
    name: '3D',
    description: 'Professional auto detailing supplies and car care products',
    logo: '/affiliates/3d.png',
    url: 'https://3dproducts.com/',
    scale: 'scale-80',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0' // Center
  },
  '3m': {
    name: '3M',
    description: 'Auto paint and small scratch repair made simple',
    logo: '/affiliates/3m.png',
    url: 'https://www.3m.com/',
    scale: 'scale-90',
    verticalPosition: 'translate-y-0',
    horizontalPosition: '-translate-x-1' // Left 4px
  },
  'adams': {
    name: 'Adam\'s Polishes',
    description: 'Premium car care and detailing products',
    logo: '/affiliates/adams.webp',
    url: 'https://adamspolishes.com/',
    scale: 'scale-85',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-1' // Right 4px
  },
  'c6': {
    name: 'C6',
    description: 'Advanced ceramic coating technology',
    logo: '/affiliates/c6.webp',
    url: 'https://c6.com/',
    scale: 'scale-80',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'carpro': {
    name: 'CarPro',
    description: 'Professional detailing products and coatings',
    logo: '/affiliates/carpro.png',
    url: 'https://carpro-us.com',
    scale: 'scale-70',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'ceramic_pro': {
    name: 'Ceramic Pro',
    description: 'Premium ceramic coating products',
    logo: '/affiliates/ceramic_pro.jfif',
    url: 'https://ceramicpro.com',
    scale: 'scale-100',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'chemicalguys': {
    name: 'Chemical Guys',
    description: 'Complete car care and detailing solutions',
    logo: '/affiliates/chemicalguys.jpg',
    url: 'https://chemicalguys.com/',
    scale: 'scale-85',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'griots': {
    name: 'Griot\'s Garage',
    description: 'Professional car care and detailing tools',
    logo: '/affiliates/griots.jpg',
    url: 'https://www.griotsgarage.com/',
    scale: 'scale-80',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'koch': {
    name: 'Koch Chemie',
    description: 'German precision car care products',
    logo: '/affiliates/koch.png',
    url: 'https://koch-chemie.com/',
    scale: 'scale-125',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'lake-country': {
    name: 'Lake Country',
    description: 'Professional buffing and polishing pads',
    logo: '/affiliates/lake-country.png',
    url: 'https://lakecountrymfg.com/',
    scale: 'scale-100',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'lamin-x': {
    name: 'Lamin-X',
    description: 'Paint protection film and headlight protection',
    logo: '/affiliates/lamin-x.png',
    url: 'https://lamin-x.com/',
    scale: 'scale-150',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-2'
  },
  'meguires': {
    name: 'Meguiar\'s',
    description: 'Trusted car care and detailing products',
    logo: '/affiliates/meguires.jpg',
    url: 'https://www.meguiars.com/',
    scale: 'scale-85',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'menzerna': {
    name: 'Menzerna',
    description: 'German precision polishing compounds',
    logo: '/affiliates/menzerna.webp',
    url: 'https://www.menzerna.com/',
    scale: 'scale-100',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'mirka': {
    name: 'Mirka',
    description: 'Professional sanding and finishing solutions',
    logo: '/affiliates/mirka.webp',
    url: 'https://www.mirka.com/',
    scale: 'scale-150',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'mtm_hydro': {
    name: 'MTM Hydro',
    description: 'Professional pressure washing equipment',
    logo: '/affiliates/mtm_hydro.jpg',
    url: 'https://www.mtmhydroparts.com/',
    scale: 'scale-75',
    verticalPosition: 'translate-y-0',
    horizontalPosition: '-translate-x-1'
  },
  'poka': {
    name: 'Poka',
    description: 'Innovative car care and detailing products',
    logo: '/affiliates/poka.png',
    url: 'https://pokapremium.com/',
    scale: 'scale-110',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'rupes': {
    name: 'Rupes',
    description: 'Professional polishing and buffing machines',
    logo: '/affiliates/rupes.png',
    url: 'https://www.rupes.com/',
    scale: 'scale-100',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'shopvac': {
    name: 'Shop-Vac',
    description: 'Professional vacuum and cleaning equipment',
    logo: '/affiliates/shopvac.jpg',
    url: 'https://www.shopvac.com/',
    scale: 'scale-85',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'starke': {
    name: 'Starke',
    description: 'Premium ceramic coatings and detailing products',
    logo: '/affiliates/starke.png',
    url: 'https://starkeyachtcare.com/',
    scale: 'scale-110',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  },
  'underdog': {
    name: 'Underdog',
    description: 'Professional detailing tools and accessories',
    logo: '/affiliates/underdog.webp',
    url: 'https://getundrdog.com/',
    scale: 'scale-80',
    verticalPosition: 'translate-y-2',
    horizontalPosition: '-translate-x-2'
  },
  'xpel': {
    name: 'XPEL',
    description: 'Paint protection film solutions',
    logo: '/affiliates/xpel.png',
    url: 'https://xpel.com',
    scale: 'scale-110',
    verticalPosition: 'translate-y-2',
    horizontalPosition: 'translate-x-0'
  },
  'yot-stik': {
    name: 'Yot-Stik',
    description: 'Innovative detailing tools and accessories',
    logo: '/affiliates/yot-stik.webp',
    url: 'https://www.yotstik.com/',
    scale: 'scale-95',
    verticalPosition: 'translate-y-0',
    horizontalPosition: 'translate-x-0'
  }
};

/**
 * Get affiliate data by keyword
 * @param keyword - The affiliate keyword (e.g., 'ceramic_pro', 'xpel')
 * @returns Affiliate data or undefined if not found
 */
export function getAffiliate(keyword: string): Affiliate | undefined {
  return AFFILIATES_DICT[keyword.toLowerCase()];
}

/**
 * Get multiple affiliates by keywords
 * @param keywords - Array of affiliate keywords
 * @returns Array of affiliate data
 */
export function getAffiliates(keywords: string[]): Affiliate[] {
  return keywords
    .map(keyword => getAffiliate(keyword))
    .filter((affiliate): affiliate is Affiliate => affiliate !== undefined);
}

/**
 * Get all available affiliate keywords
 * @returns Array of all affiliate keywords
 */
export function getAllAffiliateKeywords(): string[] {
  return Object.keys(AFFILIATES_DICT);
}
