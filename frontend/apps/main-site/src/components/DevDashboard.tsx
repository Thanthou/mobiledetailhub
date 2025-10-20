/**
 * Dev Dashboard Component
 * Personal development dashboard for quick access to all apps and services
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { ErrorTestButton } from './ErrorTestButton';
import { RuntimeConfigTest } from './RuntimeConfigTest';

interface ServiceStatus {
  name: string;
  url: string;
  status: 'online' | 'offline' | 'checking';
  responseTime?: number;
}

export function DevDashboard() {
  const [services, setServices] = useState<ServiceStatus[]>([
    // Use proxied backend URL to avoid cross-origin issues in dev
    { name: 'Backend API', url: '/api/health', status: 'checking' },
    // Align with Vite dev server ports from vite.config.admin.ts and vite.config.tenant.ts
    { name: 'Admin App', url: 'http://localhost:5177', status: 'checking' },
    { name: 'Tenant App', url: 'http://localhost:5179', status: 'checking' },
  ]);

  useEffect(() => {
    // Check service health
    const checkServices = async () => {
      const results = await Promise.all(
        services.map(async (service) => {
          const start = Date.now();
          try {
            const response = await fetch(service.url, { 
              method: 'HEAD',
              mode: 'no-cors' // Avoid CORS issues for quick check
            });
            const responseTime = Date.now() - start;
            return { ...service, status: 'online' as const, responseTime };
          } catch {
            return { ...service, status: 'offline' as const };
          }
        })
      );
      setServices(results);
    };

    checkServices();
    const interval = setInterval(checkServices, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const quickLinks = [
    {
      title: 'Admin Dashboard',
      description: 'Manage tenants, users, and platform',
      href: 'http://localhost:5177',
      icon: '🔐',
      color: 'bg-blue-500',
    },
    {
      title: 'Tenant Preview',
      description: 'Preview tenant site templates',
      href: 'http://localhost:5179',
      icon: '🏢',
      color: 'bg-purple-500',
    },
    {
      title: 'Backend API',
      description: 'API health and documentation',
      href: '/api/health',
      icon: '⚙️',
      color: 'bg-green-500',
    },
    {
      title: 'Port Registry',
      description: 'View active development ports',
      href: 'http://localhost:8080/.port-registry.json',
      icon: '📊',
      color: 'bg-orange-500',
    },
    {
      title: 'Onboarding Flow',
      description: 'Test tenant signup process',
      href: '/onboard',
      icon: '📝',
      color: 'bg-indigo-500',
    },
    {
      title: 'Pricing Page',
      description: 'View pricing tiers',
      href: '/pricing',
      icon: '💰',
      color: 'bg-emerald-500',
    },
  ];

  const industries = [
    { 
      name: 'Mobile Detailing', 
      slug: 'mobile-detailing', 
      icon: '🚗', 
      color: 'bg-blue-100 text-blue-600',
      previewUrl: 'http://localhost:5179/?industry=mobile-detailing',
      description: 'Car, boat, RV detailing with ceramic coating, paint correction, PPF'
    },
    { 
      name: 'Maid Service', 
      slug: 'maid-service', 
      icon: '🏠', 
      color: 'bg-pink-100 text-pink-600',
      previewUrl: 'http://localhost:5179/?industry=maid-service',
      description: 'Residential and commercial cleaning services'
    },
    { 
      name: 'Lawn Care', 
      slug: 'lawncare', 
      icon: '🌱', 
      color: 'bg-green-100 text-green-600',
      previewUrl: 'http://localhost:5179/?industry=lawncare',
      description: 'Lawn mowing, landscaping, and yard maintenance'
    },
    { 
      name: 'Pet Grooming', 
      slug: 'pet-grooming', 
      icon: '🐶', 
      color: 'bg-purple-100 text-purple-600',
      previewUrl: 'http://localhost:5179/?industry=pet-grooming',
      description: 'Professional grooming for dogs and cats'
    },
    { 
      name: 'Barber Shop', 
      slug: 'barber', 
      icon: '✂️', 
      color: 'bg-red-100 text-red-600',
      previewUrl: 'http://localhost:5179/?industry=barber',
      description: 'Haircuts, shaves, and beard grooming'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Service Status */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🔍</span> Service Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.name} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
              <div className={`w-3 h-3 rounded-full ${
                service.status === 'online' ? 'bg-green-400 animate-pulse' :
                service.status === 'offline' ? 'bg-red-400' :
                'bg-yellow-400 animate-pulse'
              }`} />
              <div className="flex-1">
                <div className="text-white font-medium text-sm">{service.name}</div>
                {service.responseTime && (
                  <div className="text-white/60 text-xs">{service.responseTime}ms</div>
                )}
              </div>
              <div className="text-xs text-white/60 uppercase">{service.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🚀</span> Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <a
              key={link.title}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group bg-white/5 hover:bg-white/20 rounded-lg p-4 transition-all duration-200 hover:scale-105 border border-white/10 hover:border-white/30"
            >
              <div className={`${link.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 text-2xl shadow-lg`}>
                {link.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-300 transition-colors">
                {link.title}
              </h3>
              <p className="text-white/70 text-sm">{link.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Industries */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🏭</span> Available Industries
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((industry) => (
            <a
              key={industry.slug}
              href={industry.previewUrl}
              className="group p-5 bg-white/5 hover:bg-white/15 rounded-lg transition-all duration-200 hover:scale-[1.02] border border-white/10 hover:border-white/30 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`${industry.color} w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {industry.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-base mb-1 group-hover:text-blue-300 transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-white/60 text-xs mb-2 line-clamp-2">
                    {industry.description}
                  </p>
                  <div className="text-xs text-blue-300 group-hover:text-blue-200 font-medium flex items-center gap-1">
                    Preview Template <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Development Info */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>ℹ️</span> Development Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="text-white/60">Node Environment:</div>
            <div className="text-white font-mono">{import.meta.env.MODE}</div>
          </div>
          <div className="space-y-2">
            <div className="text-white/60">Backend URL:</div>
            <div className="text-white font-mono">{import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}</div>
          </div>
          <div className="space-y-2">
            <div className="text-white/60">Main App:</div>
            <div className="text-white font-mono">localhost:5175</div>
          </div>
          <div className="space-y-2">
            <div className="text-white/60">Admin App:</div>
            <div className="text-white font-mono">admin.localhost:5177</div>
          </div>
        </div>
      </div>

      {/* Error Testing */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🧪</span> Error Boundary Testing
        </h2>
        <p className="text-white/70 mb-4">
          Test the error boundary and error monitoring system. Check browser console and backend logs.
        </p>
        <div className="flex flex-wrap gap-3">
          <ErrorTestButton errorType="render" />
          <ErrorTestButton errorType="async" />
          <ErrorTestButton errorType="promise" />
        </div>
        <div className="mt-4 text-xs text-white/50">
          <p>• Render Error: Triggers ErrorBoundary component</p>
          <p>• Async Error: Triggers error monitoring system</p>
          <p>• Promise Error: Triggers unhandled rejection handler</p>
        </div>
      </div>

      {/* Runtime Config Testing */}
      <RuntimeConfigTest />
    </div>
  );
}

