// Import types and individual service data files
import type { ServiceData } from './types';
import { autoDetailingData } from './services/auto-detailing';
import { boatDetailingData } from './services/boat-detailing';
import { marineDetailingData } from './services/marine-detailing';
import { rvDetailingData } from './services/rv-detailing';
import { ceramicCoatingData } from './services/ceramic-coating';
import { ppfInstallationData } from './services/ppf-installation';
import { paintCorrectionData } from './services/paint-correction';
import { interiorExteriorData } from './services/interior-exterior';

export const servicesData: Record<string, ServiceData> = {
  'auto-detailing': autoDetailingData,
  'boat-detailing': boatDetailingData,
  'marine-detailing': marineDetailingData,
  'rv-detailing': rvDetailingData,
  'ceramic-coating': ceramicCoatingData,
  'ppf-installation': ppfInstallationData,
  'paint-protection-film': ppfInstallationData, // Alias for backward compatibility
  'paint-correction': paintCorrectionData,
  'interior-exterior': interiorExteriorData,
};
