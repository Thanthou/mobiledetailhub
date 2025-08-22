import { useParams } from 'react-router-dom';

export function useSiteContext() {
  const params = useParams();
  const { businessSlug } = params;
  const isAffiliate = !!businessSlug;
  const isMDH = !businessSlug;
  return { isMDH, isAffiliate, businessSlug };
}