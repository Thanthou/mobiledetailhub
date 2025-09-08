import { useMDHConfig } from '../../../../../contexts/useMDHConfig';
import { useFAQ } from '../../../../../hooks/useFAQ';
import { useFAQData } from '../hooks/useFAQData';
import { useFAQState } from '../hooks/useFAQState';

export const useFAQMDH = () => {
  // Use global FAQ state for expansion
  const { isExpanded, setIsExpanded } = useFAQ();
  
  // Use local state for individual FAQ items
  const { openItems, toggleItem } = useFAQState(false);

  // Use static MDH FAQ data (no backend)
  const { groupedFAQs, categories } = useFAQData();

  // Get configurable services description from MDH config (with fallback)
  const { mdhConfig } = useMDHConfig();
  const servicesLine = mdhConfig?.services_description || 'auto detailing, boat & RV detailing, ceramic coating, and PPF';
  const nearbyList = '';

  return {
    isExpanded,
    setIsExpanded,
    openItems,
    toggleItem,
    groupedFAQs,
    categories,
    servicesLine,
    nearbyList
  };
};
