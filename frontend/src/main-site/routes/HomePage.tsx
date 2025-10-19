import React from 'react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-4xl mx-auto px-6">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          That Smart Site
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Launch your professional business website in minutes. 
          Perfect for mobile detailing, maid services, lawn care, and more.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a 
            href="http://admin.localhost:8080" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Admin
          </a>
          <Link 
            to="/onboard" 
            className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-4 px-8 rounded-lg text-lg border-2 border-blue-600 transition-colors"
          >
            View Plans & Sign Up
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚗</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Mobile Detailing</h3>
            <p className="text-gray-600">Professional car detailing services</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Maid Service</h3>
            <p className="text-gray-600">Residential and commercial cleaning</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Lawn Care</h3>
            <p className="text-gray-600">Landscaping and maintenance services</p>
          </div>
        </div>
      </div>
    </main>
  );
}
