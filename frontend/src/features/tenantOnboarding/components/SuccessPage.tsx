import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Sparkles } from 'lucide-react';

import { Button } from '@/shared/ui';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center p-4">
      <div className="bg-stone-800 border border-stone-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-600/50">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl text-white font-bold mb-3">
            Welcome to ThatSmartSite! 🎉
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Your application has been received and is being processed.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-600/50 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white text-lg mb-2">What&apos;s Next?</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span>We&apos;re setting up your website right now (takes ~5 minutes)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span>You&apos;ll receive a welcome email with login credentials</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span>Our team will reach out to help customize your site</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span>Your first payment will be processed within 24 hours</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-stone-700/50 border border-stone-600 rounded-lg p-4 mb-6">
          <p className="text-gray-300 text-sm text-center">
            Check your email inbox for a confirmation message from{' '}
            <span className="text-orange-400 font-semibold">hello@thatsmartsite.com</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="w-full sm:w-auto">
            <Button 
              variant="outline"
              size="lg"
              className="w-full border border-stone-600 text-gray-300 hover:bg-stone-700 font-semibold"
            >
              Back to Home
            </Button>
          </Link>
          <Button 
            onClick={() => { void navigate('/contact'); }}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
          >
            Contact Support
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-700 text-center">
          <p className="text-xs text-gray-500">
            Need help? Call us at <span className="text-orange-400">(555) 123-4567</span> or email{' '}
            <span className="text-orange-400">support@thatsmartsite.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
