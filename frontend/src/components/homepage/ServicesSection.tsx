import React, { useMemo } from 'react';
import { Car, Ship, Paintbrush, Palette, Sun, Zap } from 'lucide-react';
import ServicesGrid from '../ServicesGrid';

interface Service {
  title: string;
  image: string;
  icon: React.ReactNode;
  description: string[];
  images: string[];
}

interface ServicesSectionProps {
  currentBusiness: string;
  currentConfig: any;
  onBookNow: () => void;
  onRequestQuote: () => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  currentBusiness,
  currentConfig,
  onBookNow,
  onRequestQuote
}) => {
  const defaultServices: Service[] = [
    {
      title: 'Auto Detailing',
      image: '/auto_detailing/image1.png',
      icon: <Car className="h-6 w-6" />,
      description: ['Professional service', 'Quality results'],
      images: ['/auto_detailing/image1.png']
    },
    {
      title: 'Marine Detailing',
      image: '/boat_detailing/image1.png',
      icon: <Ship className="h-6 w-6" />,
      description: ['Boat care', 'Marine expertise'],
      images: ['/boat_detailing/image1.png']
    },
    {
      title: 'RV Detailing',
      image: '/rv_detailing/image1.png',
      icon: <Paintbrush className="h-6 w-6" />,
      description: ['RV maintenance', 'Travel ready'],
      images: ['/rv_detailing/image1.png']
    },
    {
      title: 'Interior / Exterior',
      image: '/interior_exterior/image1.png',
      icon: <Palette className="h-6 w-6" />,
      description: ['Complete care', 'Inside and out'],
      images: ['/interior_exterior/image1.png']
    },
    {
      title: 'Ceramic Coating',
      image: '/ceramic/image1.png',
      icon: <Sun className="h-6 w-6" />,
      description: ['Long-term protection', 'Enhanced shine'],
      images: ['/ceramic/image1.png']
    },
    {
      title: 'Paint Protection Film',
      image: '/ppf/image1.png',
      icon: <Zap className="h-6 w-6" />,
      description: ['Ultimate protection', 'Invisible shield'],
      images: ['/ppf/image1.png']
    }
  ];

  const servicesConfig = useMemo(() => {
    if (!currentConfig) return defaultServices;
    
    return defaultServices.map((service: Service) => ({
      ...service,
      description: currentConfig.services?.description || service.description
    }));
  }, [currentConfig]);

  return (
    <div id="services">
      <ServicesGrid
        key={`${currentBusiness}-${currentConfig?.hero?.backgroundImage || 'default'}`}
        services={servicesConfig}
        onBookNow={onBookNow}
        onRequestQuote={onRequestQuote}
        businessSlug={currentBusiness}
      />
    </div>
  );
};

export default ServicesSection;