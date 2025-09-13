import React from 'react';

// Custom RV Icon Component
const RVIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src="/icons/rv.png" 
    alt="RV" 
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(100%)'
    }}
  />
);

export default RVIcon;
