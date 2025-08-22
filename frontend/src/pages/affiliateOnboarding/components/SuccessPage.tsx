import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Info } from 'lucide-react';
import { AffiliateApplication } from '../types';

interface SuccessPageProps {
  formData: AffiliateApplication;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ formData }) => {
  return (
    <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center p-4">
      <div className="bg-stone-800 border border-stone-700 rounded-lg max-w-2xl w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl text-white font-bold mb-2">Application Received!</h1>
          <p className="text-gray-300 mb-6">
            Thank you for applying to join Mobile Detail Hub
          </p>
        </div>
        
        <div className="bg-stone-700 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-white mb-3">Application Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Business:</span>
              <span className="text-white">{formData.legal_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Location:</span>
              <span className="text-white">{formData.base_location.city}, {formData.base_location.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Services:</span>
              <span className="text-white">{formData.categories.join(', ')}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Info className="h-4 w-4 text-blue-400 mr-2 mt-0.5" />
            <p className="text-gray-300 text-sm">
              We'll review your application within 2-3 business days and contact you at {formData.email} with next steps.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/affiliate-dashboard" className="flex-1">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Go to Affiliate Dashboard
            </button>
          </Link>
          <Link to="/" className="flex-1">
            <button className="w-full border border-stone-600 text-gray-300 hover:bg-stone-700 font-semibold py-2 px-4 rounded-lg transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
