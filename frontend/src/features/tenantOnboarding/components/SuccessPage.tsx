import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ExternalLink, Sparkles, Settings } from 'lucide-react';

import { AddToHomeScreen } from '@/shared/components';
import { Button } from '@/shared/ui';
import { useAuth } from '@/shared/hooks';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(null);
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Retrieve the tenant info from session storage
    const slug = sessionStorage.getItem('newTenantSlug');
    const url = sessionStorage.getItem('newTenantWebsiteUrl');
    const dashboard = sessionStorage.getItem('newTenantDashboardUrl');
    
    if (slug) {
      setTenantSlug(slug);
      setWebsiteUrl(url || `/${slug}`);
      setDashboardUrl(dashboard || `/${slug}/dashboard`);
      
      // Clean up session storage after retrieval
      sessionStorage.removeItem('newTenantSlug');
      sessionStorage.removeItem('newTenantWebsiteUrl');
      sessionStorage.removeItem('newTenantDashboardUrl');
    }
  }, []);

  const handleGoToDashboard = async () => {
    const tempPassword = sessionStorage.getItem('tempPassword');
    const tenantEmail = sessionStorage.getItem('tenantEmail');
    
    if (!tempPassword || !tenantEmail || !dashboardUrl) {
      console.error('Missing credentials for dashboard login');
      return;
    }

    setIsLoggingIn(true);
    
    try {
      const result = await login(tenantEmail, tempPassword);
      
      if (result.success) {
        // Clean up temporary credentials
        sessionStorage.removeItem('tempPassword');
        sessionStorage.removeItem('tenantEmail');
        
        // Navigate to dashboard
        navigate(dashboardUrl);
      } else {
        console.error('Dashboard login failed:', result.error);
        // Fallback: navigate to dashboard URL anyway (user can login manually)
        navigate(dashboardUrl);
      }
    } catch (error) {
      console.error('Dashboard login error:', error);
      // Fallback: navigate to dashboard URL anyway
      navigate(dashboardUrl);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center p-4 pb-32">
        <div className="bg-stone-800 border border-stone-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-600/50">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl text-white font-bold mb-3">
            Welcome to ThatSmartSite! 🎉
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Your website has been created and is ready to view!
          </p>
        </div>
        
        {tenantSlug && websiteUrl && (
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-600/50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-white text-lg mb-3 text-center">
              🌐 Your Website is Live!
            </h3>
            <p className="text-gray-300 text-sm mb-4 text-center">
              View your new website at:
            </p>
            <div className="bg-stone-900/50 rounded-lg p-3 mb-4">
              <code className="text-blue-400 text-sm break-all">
                {window.location.origin}{websiteUrl}
              </code>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={websiteUrl} className="flex-1">
                <Button 
                  variant="primary"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  View My Website
                </Button>
              </Link>
              <Button 
                onClick={handleGoToDashboard}
                disabled={isLoggingIn}
                variant="primary"
                size="lg"
                className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Settings className="w-5 h-5" />
                {isLoggingIn ? 'Logging In...' : 'Go to Dashboard'}
              </Button>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-600/50 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white text-lg mb-2">What&apos;s Next?</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span>Click &quot;Go to Dashboard&quot; above to access your site settings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span>You&apos;ll receive a welcome email with your login credentials</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span>Customize your site content, photos, and business information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span>Our team will reach out to help you get started</span>
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

      {/* Add to Home Screen Prompt */}
      {tenantSlug && (
        <AddToHomeScreen 
          tenantSlug={tenantSlug}
          businessName="Your Dashboard"
          autoShow={true}
        />
      )}
    </>
  );
};

export default SuccessPage;
