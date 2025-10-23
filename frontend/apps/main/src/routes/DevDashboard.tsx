import React from 'react';
import { DevDashboard as DevDashboardComponent } from '../components/DevDashboard';

export function DevDashboard() {
  return (
    <main 
      className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/images/background.png')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"></div>
      
      {/* Content (above overlay) */}
      <div className="relative z-10 min-h-screen py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-4 drop-shadow-2xl">
              That Smart Site
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 drop-shadow-lg">
              Development Dashboard
            </p>
            <div className="mt-4 inline-block bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/30">
              <span className="text-green-300 text-sm font-medium">🟢 All Systems Online</span>
            </div>
          </div>

          {/* Dev Dashboard */}
          <DevDashboardComponent />

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-white/50 text-sm">
              Multi-Tenant SaaS Platform • Development Environment
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

