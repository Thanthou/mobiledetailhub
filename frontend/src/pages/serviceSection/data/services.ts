// Import types and individual service data files
import { autoDetailingData } from './services/auto-detailing';
import { boatDetailingData } from './services/boat-detailing';
import { ceramicCoatingData } from './services/ceramic-coating';
import { interiorExteriorData } from './services/interior-exterior';
import { marineDetailingData } from './services/marine-detailing';
import { paintCorrectionData } from './services/paint-correction';
import { ppfInstallationData } from './services/ppf-installation';
import { rvDetailingData } from './services/rv-detailing';
import type { ServiceData } from './types';

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
