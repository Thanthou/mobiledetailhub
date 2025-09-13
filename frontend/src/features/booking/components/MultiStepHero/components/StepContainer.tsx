import React from 'react';

interface StepContainerProps {
  children: React.ReactNode;
  bottomSection?: React.ReactNode;
  className?: string;
}

const StepContainer: React.FC<StepContainerProps> = ({ children, bottomSection, className = '' }) => {
  return (
    <div className={`flex flex-col h-screen overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export default StepContainer;
