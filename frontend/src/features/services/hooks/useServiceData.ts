import { useParams } from 'react-router-dom';

import { servicesData } from '../data/services';
import type { ServiceData } from '../types/service';

export function useServiceData(): ServiceData | null {
  const { serviceType } = useParams<{ serviceType: string }>();
  
  if (!serviceType) {
    return null;
  }
  
  return servicesData[serviceType] || null;
}