import React from 'react';

// Custom RV Icon Component
const RVIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src="/icons/rv.png" 
    alt="RV" 
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(60%) sepia(100%) saturate(3000%) hue-rotate(-20deg) brightness(1.1) contrast(1.2)'
    }}
  />
);

export default RVIcon;
