import React from 'react';
import { CTAButtons } from '@/shared/ui';

interface CTAProps {
  className?: string;
}

const CTA: React.FC<CTAProps> = ({ 
  className = "" 
}) => {
  return (
    <CTAButtons 
      className={className}
    />
  );
};

export default CTA;
