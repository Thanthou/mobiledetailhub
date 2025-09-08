import { useSiteContext } from '../../../../../hooks/useSiteContext';

export const useFAQSelector = () => {
  const { isMDH } = useSiteContext();
  return { isMDH };
};
