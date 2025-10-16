import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { DashboardTab, DetailerData } from '@/features/tenantDashboard/types';
import { useBrowserTab } from '@/shared/hooks';

import { dashboardApi } from '../api/dashboard.api';
import { DashboardHeader } from './DashboardHeader';
import { DashboardLayout } from './DashboardLayout';
import { DashboardTabs } from './DashboardTabs';
import { TabContent } from './TabContent';

const DashboardPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [detailerData, setDetailerData] = useState<DetailerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set browser tab title and favicon for tenant dashboard
  useBrowserTab({
    title: detailerData?.businessName 
      ? `${detailerData.businessName} - Dashboard`
      : 'Dashboard - That Smart Site',
  });

  // Fetch tenant data based on business slug
  useEffect(() => {
    const fetchTenantData = async () => {
      if (!slug) {
        setError('No business slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const tenant = await dashboardApi.getDashboardData(slug);
        
        // Transform tenant data to DetailerData format
        const transformedData: DetailerData = {
          business_name: tenant.business_name || 'Unknown Business',
          first_name: tenant.first_name || 'Unknown',
          last_name: tenant.last_name || 'Unknown',
          email: tenant.business_email || tenant.personal_email || 'No email',
          phone: tenant.business_phone || tenant.personal_phone || 'No phone',
          location: tenant.service_areas && Array.isArray(tenant.service_areas) && tenant.service_areas.length > 0 
            ? `${tenant.service_areas[0]?.city ?? ''}, ${tenant.service_areas[0]?.state ?? ''}` 
            : 'No location',
          services: tenant.service_areas && Array.isArray(tenant.service_areas) && tenant.service_areas.length > 0 
            ? tenant.service_areas.map((area: { city: string }) => area.city).slice(0, 4)
            : ['Mobile Detailing'],
          memberSince: tenant.created_at ? new Date(tenant.created_at).getFullYear().toString() : 'Unknown'
        };
        setDetailerData(transformedData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch business data');
      } finally {
        setLoading(false);
      }
    };

    void fetchTenantData();
  }, [slug]);

  const handleDataUpdate = (data: Partial<DetailerData>) => {
    if (detailerData) {
      setDetailerData({ ...detailerData, ...data });
    }
  };

  const handleBackToForm = () => {
    // Navigate back to main site or form
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading business dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !detailerData) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-lg text-red-600">Error: {error || 'Failed to load business data'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
          tenantSlug={slug}
        />
        
        <TabContent 
          activeTab={activeTab}
          detailerData={detailerData}
          onDataUpdate={handleDataUpdate}
          tenantSlug={slug}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
