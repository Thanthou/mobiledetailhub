import React, { useEffect, useState } from 'react';
import FooterGrid from './Grid';
import FooterBottom from '../FooterBottom';
import FooterLoadingState from '../FooterLoadingState';
import FooterErrorState from '../FooterErrorState';
import { useSiteContext } from '../../../hooks/useSiteContext';

type BusinessData = {
  name?: string;
  phone?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  // add other fields as needed
};

interface ServiceArea {
  city: string;
  state: string;
}

interface AffiliateFooterProps {
  onRequestQuote: () => void;
}

const AffiliateFooter: React.FC<AffiliateFooterProps> = ({ onRequestQuote }) => {
  const { businessSlug } = useSiteContext();
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    
    // Fetch business data if we have a business slug
    const fetchBusinessData = businessSlug 
      ? fetch(`/api/businesses/${businessSlug}`)
          .then(res => res.json())
          .then(data => setBusinessData(data))
          .catch(() => setError(true))
      : Promise.resolve();

    // Fetch service areas if we have a business slug
    const fetchServiceAreas = businessSlug 
      ? fetch(`/api/businesses/${businessSlug}/business_area`)
          .then(res => res.json())
          .then(data => setServiceAreas(data))
          .catch(() => setServiceAreas([]))
      : Promise.resolve();

    Promise.all([fetchBusinessData, fetchServiceAreas])
      .finally(() => setIsLoading(false));
  }, [businessSlug]);

  if (isLoading) return <FooterLoadingState />;
  if (error || !businessData) return <FooterErrorState />;

  return (
    <footer className="bg-stone-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <FooterGrid 
          parentConfig={businessData} 
          businessSlug={businessSlug}
          serviceAreas={serviceAreas}
          onRequestQuote={onRequestQuote} 
        />
        <FooterBottom businessInfo={{ name: businessData.name || 'Your Business' }} />
      </div>
    </footer>
  );
};

export default AffiliateFooter;