import React, { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardTabs } from './components/DashboardTabs';
import { TabContent } from './components/TabContent';
import { useDashboardData } from './hooks/useDashboardData';
import type { DetailerData, DashboardTab } from './types';

// Mock detailer data - replace with actual data fetching
const mockDetailerData: DetailerData = {
  business_name: "Elite Auto Detailing",
  first_name: "Michael",
  last_name: "Rodriguez",
  email: "michael@eliteautodetailing.com",
  phone: "(213) 555-0123",
  location: "Downtown Los Angeles, CA",
  services: ["Premium Wash", "Ceramic Coating", "Paint Correction", "Interior Detailing"],
  memberSince: "2019"
};

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const { detailerData, updateDetailerData } = useDashboardData(mockDetailerData);

  const handleDataUpdate = (data: Partial<DetailerData>) => {
    updateDetailerData(data);
  };

  const handleBackToForm = () => {
    // Navigate back to main site or form
    console.log('Navigate back to form');
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader 
          detailerData={detailerData}
          onBackToForm={handleBackToForm}
        />
        
        <DashboardTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <TabContent 
          activeTab={activeTab}
          detailerData={detailerData}
          onDataUpdate={handleDataUpdate}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;