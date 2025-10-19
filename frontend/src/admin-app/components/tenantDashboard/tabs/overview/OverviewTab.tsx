import React from 'react';

import { QuickActions } from './components/QuickActions';

export const OverviewTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <QuickActions />
    </div>
  );
};

export default OverviewTab;