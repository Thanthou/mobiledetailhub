import { useParams } from 'react-router-dom';
import { servicesData, type ServiceData } from '../data/services';

export function useServiceData(): ServiceData | null {
  const { serviceType } = useParams<{ serviceType: string }>();
  
  if (!serviceType) {
    return null;
  }
  
  return servicesData[serviceType] || null;
}