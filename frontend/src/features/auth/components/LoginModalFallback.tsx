import React from 'react';

// Loading fallback component that matches the actual modal design
const LoginModalFallback: React.FC = () => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-stone-900 rounded-2xl shadow-2xl border border-stone-700 w-full max-w-md">
      <div className="p-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-stone-600 rounded-2xl mx-auto mb-4"></div>
            <div className="h-8 bg-stone-600 rounded w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-stone-600 rounded w-64 mx-auto"></div>
          </div>
          
          {/* Form skeleton */}
          <div className="space-y-6">
            <div className="h-12 bg-stone-700 rounded-xl"></div>
            <div className="h-12 bg-stone-700 rounded-xl"></div>
            <div className="h-12 bg-stone-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LoginModalFallback;
