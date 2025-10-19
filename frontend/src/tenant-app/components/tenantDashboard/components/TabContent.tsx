import React from 'react';

import type { DashboardTab, DetailerData } from '@/tenant-app/components/tenantDashboard/types';

import { getTabConfig } from '../config/tabConfig';
import CustomersTab from '../tabs/customers/CustomersTab';
import LocationsTab from '../tabs/locations/LocationsTab';
import OverviewTab from '../tabs/overview/OverviewTab';
import ProfileTab from '../tabs/profile/ProfileTab';
import ScheduleTab from '../tabs/schedule/ScheduleTab';
import ServicesTab from '../tabs/services/SimpleFixedServicesTab';
import WebsiteTab from '../tabs/website/WebsiteTab';

interface TabContentProps {
  activeTab: DashboardTab;
  detailerData: DetailerData;
  onDataUpdate: (data: Partial<DetailerData>) => void;
  tenantSlug?: string;
}

export const TabContent: React.FC<TabContentProps> = ({ 
  activeTab, 
  detailerData, 
  onDataUpdate,
  tenantSlug
}) => {
  // Get tab configuration for this tenant
  const tabConfig = getTabConfig(tenantSlug);
  
  // Check if the current tab is enabled
  const isTabEnabled = (tab: DashboardTab): boolean => {
    switch (tab) {
      case 'schedule':
        return tabConfig.schedule;
      case 'customers':
        return tabConfig.customers;
      case 'services':
        return tabConfig.services;
      case 'locations':
        return tabConfig.locations;
      case 'profile':
        return tabConfig.profile;
      case 'website':
        return tabConfig.website;
      case 'overview':
        return true; // Overview is always enabled
      default:
        return true;
    }
  };

  // If the current tab is disabled, show a message
  if (!isTabEnabled(activeTab)) {
    return (
      <div className="transition-all duration-300 ease-in-out">
        <div className="bg-stone-800 rounded-lg p-8 text-center border border-stone-700">
          <div className="text-orange-400 text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-white mb-2">Feature Not Available</h3>
          <p className="text-gray-300 mb-4">
            This feature is not currently enabled for your account.
          </p>
          <p className="text-sm text-gray-400">
            Contact support to upgrade your plan and unlock this feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="transition-all duration-300 ease-in-out">
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'website' && <WebsiteTab tenantSlug={tenantSlug} />}
      {activeTab === 'locations' && <LocationsTab detailerData={detailerData} />}
      {activeTab === 'profile' && (
        <ProfileTab 
          detailerData={detailerData} 
          onDataUpdate={onDataUpdate} 
        />
      )}
      {activeTab === 'schedule' && <ScheduleTab />}
      {activeTab === 'customers' && <CustomersTab />}
      {activeTab === 'services' && <ServicesTab />}
    </div>
  );
};
