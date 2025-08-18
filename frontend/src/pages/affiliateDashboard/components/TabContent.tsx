import React from 'react';
import { OverviewTab } from '../tabs/overview';
import { ScheduleTab } from '../tabs/schedule';
import { CustomersTab } from '../tabs/customers';
import { PerformanceTab } from '../tabs/performance';
import { ServicesTab } from '../tabs/services';
import { ProfileTab } from '../tabs/profile';
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
      {activeTab === 'profile' && (
        <ProfileTab 
          detailerData={detailerData} 
          onDataUpdate={onDataUpdate} 
        />
      )}
    </div>
  );
};