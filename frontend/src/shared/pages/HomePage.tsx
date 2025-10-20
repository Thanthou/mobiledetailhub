import React from 'react';

import { useSEO, useTenantSlug } from '@shared/hooks';

interface HomePageProps {
  onRequestQuote?: () => void;
  locationData?: unknown;
}

const HomePage: React.FC<HomePageProps> = ({ onRequestQuote, locationData }) => {
  // Resolve tenant slug (domain or params). If undefined, we are on platform main site.
  const tenantSlug = useTenantSlug();

  // Update basic SEO for the platform page. Avoid heavy tenant-dependent hooks/components here.
  useSEO();

  // Render a lightweight marketing page for the main site to prevent blocking imports and cross-app coupling
  if (!tenantSlug) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="font-bold text-xl">That Smart Site</a>
            <nav className="space-x-4">
              <a href="/pricing" className="text-gray-300 hover:text-white">Pricing</a>
              <a href="/login" className="text-gray-300 hover:text-white">Login</a>
              <a href="/onboard" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">Get Started</a>
            </nav>
          </div>
        </header>

        <main className="pt-12 md:pt-20">
          <section className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Launch a Pro Website in Minutes</h1>
            <p className="text-lg md:text-2xl text-gray-300 mb-10">White‑label sites for local services: detailing, cleaning, lawn care, and more.</p>
            <a href="/onboard" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">Create Your Site</a>
          </section>

          <section className="container mx-auto px-4 pb-20 grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-2">Templates</h3>
              <p className="text-gray-300">Conversion‑optimized layouts per industry.</p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-2">SEO‑Ready</h3>
              <p className="text-gray-300">Structured data, fast loads, clean markup.</p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-2">One‑Click Deploy</h3>
              <p className="text-gray-300">Automatic subdomain and CDN caching.</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // For tenant slugs, keep this page minimal and let tenant routes/pages handle rich content.
  // We intentionally avoid importing tenant-app components here to respect app boundaries.
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">{tenantSlug}</h1>
        <p className="text-gray-700">Tenant site is loading. Navigate directly to the tenant subdomain route.</p>
      </div>
    </div>
  );
};

export default HomePage;
