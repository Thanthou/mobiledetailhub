import { useParams } from 'react-router-dom';

export function useSiteContext() {
  const params = useParams();
  console.log('useSiteContext params:', params);
  const { businessSlug } = params;
  const isAffiliate = !!businessSlug;
  const isMDH = !businessSlug;
  console.log('useSiteContext businessSlug:', businessSlug, 'isMDH:', isMDH);
  return { isMDH, isAffiliate, businessSlug };
}