import React from 'react';

import { MetricsCards } from './components/MetricsCards';
import { NotificationPanel } from './components/NotificationPanel';
import { QuickActions } from './components/QuickActions';
import { RecentAppointments } from './components/RecentAppointments';
import { RecentReviews } from './components/RecentReviews';

export const OverviewTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <MetricsCards />
      <QuickActions />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentAppointments />
        <RecentReviews />
      </div>
      
      <NotificationPanel />
    </div>
  );
};

export default OverviewTab;