import React from 'react';

import type { DashboardTab, DetailerData } from '@/features/affiliateDashboard/types';

import CustomersTab from '../tabs/customers/CustomersTab';
import LocationsTab from '../tabs/locations/LocationsTab';
import OverviewTab from '../tabs/overview/OverviewTab';
import PerformanceTab from '../tabs/performance/PerformanceTab';
import ProfileTab from '../tabs/profile/ProfileTab';
import ScheduleTab from '../tabs/schedule/ScheduleTab';
import ServicesTab from '../tabs/services/SimpleFixedServicesTab';

interface TabContentProps {
  activeTab: DashboardTab;
  detailerData: DetailerData;
  onDataUpdate: (data: Partial<DetailerData>) => void;
}

export const TabContent: React.FC<TabContentProps> = ({ 
  activeTab, 
  detailerData, 
  onDataUpdate 
}) => {
  return (
    <div className="transition-all duration-300 ease-in-out">
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'schedule' && <ScheduleTab />}
      {activeTab === 'customers' && <CustomersTab />}
      {activeTab === 'performance' && <PerformanceTab />}
      {activeTab === 'services' && <ServicesTab />}
      {activeTab === 'locations' && <LocationsTab detailerData={detailerData} />}
      {activeTab === 'profile' && (
        <ProfileTab 
          detailerData={detailerData} 
          onDataUpdate={onDataUpdate} 
        />
      )}
    </div>
  );
};
