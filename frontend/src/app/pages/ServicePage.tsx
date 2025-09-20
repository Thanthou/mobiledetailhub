import React from 'react';
import { Header } from '@/features/header';
import { useServicePage } from '@/features/services/hooks/useServicePage';
import { ServiceHero, WhatItIs, Process, Results, ServiceCTA } from '@/features/services';

const ServicePage: React.FC = () => {
  const { serviceData } = useServicePage();

  if (!serviceData) {
    return (
      <main className="bg-stone-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Service Not Found</h1>
          <p className="text-slate-300">The requested service could not be found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-stone-900 text-white">
      <Header />
      <ServiceHero serviceData={serviceData} />
      <WhatItIs serviceData={serviceData} />
      <Process serviceData={serviceData} />
      <Results serviceData={serviceData} />
      <ServiceCTA serviceData={serviceData} />
    </main>
  );
};

export default ServicePage;
