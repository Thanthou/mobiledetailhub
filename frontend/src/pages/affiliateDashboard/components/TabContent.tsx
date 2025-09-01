import React from 'react';
import OverviewTab from '../tabs/overview/OverviewTab';
import ScheduleTab from '../tabs/schedule/ScheduleTab';
import CustomersTab from '../tabs/customers/CustomersTab';
import PerformanceTab from '../tabs/performance/PerformanceTab';
import ServicesTab from '../tabs/services/ServicesTab';
import LocationsTab from '../tabs/locations/LocationsTab';
import ProfileTab from '../tabs/profile/ProfileTab';
import type { DashboardTab, DetailerData } from '../types';

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