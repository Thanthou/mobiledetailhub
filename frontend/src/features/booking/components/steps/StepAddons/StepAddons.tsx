import React from 'react';

import Addons from './Addons';

interface StepAddonsProps {
  onAddonsSelected?: (addons: string[]) => void;
}

/**
 * StepAddons - Complete addons step with addon selection
 * The main step header is handled by BookingLayout
 * The Addons component handles tabs and addon selection
 */
const StepAddons: React.FC<StepAddonsProps> = ({ onAddonsSelected }) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Addon Selection with integrated tabs */}
      <Addons onAddonsSelected={onAddonsSelected} />
    </div>
  );
};

export default StepAddons;