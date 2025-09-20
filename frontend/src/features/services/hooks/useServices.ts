import { useNavigate } from 'react-router-dom';
import { Service } from '@/features/services/types/service.types';
import siteData from '@/data/mdh/site.json';
import autoDetailingData from '@/data/services/auto-detailing.json';
import marineDetailingData from '@/data/services/marine-detailing.json';
import rvDetailingData from '@/data/services/rv-detailing.json';
import ceramicCoatingData from '@/data/services/ceramic-coating.json';
import paintCorrectionData from '@/data/services/paint-correction.json';
import ppfData from '@/data/services/ppf.json';

// Transform site.json servicesGrid data to Service format
const getServicesFromSiteData = (): Service[] => {
  return siteData.servicesGrid.map((service, index) => ({
    id: (index + 1).toString(),
    title: service.title,
    description: service.alt, // Using alt text as description
    imageUrl: service.image,
    route: service.href,
    category: service.slug.split('-')[0] || 'general' // Extract category from slug
  }));
};

export const useServices = () => {
  const navigate = useNavigate();

  const handleServiceClick = (service: Service) => {
    navigate(service.route);
  };

  const getServices = () => {
    return getServicesFromSiteData();
  };

  const getServiceById = (id: string) => {
    return getServicesFromSiteData().find(service => service.id === id);
  };

  const getServicesByCategory = (category: string) => {
    return getServicesFromSiteData().filter(service => service.category === category);
  };

  const getAutoDetailingData = () => {
    return autoDetailingData;
  };

  const getMarineDetailingData = () => {
    return marineDetailingData;
  };

  const getRvDetailingData = () => {
    return rvDetailingData;
  };

  const getCeramicCoatingData = () => {
    return ceramicCoatingData;
  };

  const getPaintCorrectionData = () => {
    return paintCorrectionData;
  };

  const getPpfData = () => {
    return ppfData;
  };

  return {
    services: getServices(),
    handleServiceClick,
    getServiceById,
    getServicesByCategory,
    getAutoDetailingData,
    getMarineDetailingData,
    getRvDetailingData,
    getCeramicCoatingData,
    getPaintCorrectionData,
    getPpfData
  };
};
