import React from 'react';
import { X } from 'lucide-react';

import { Button } from '@shared/ui';

interface TenantTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TenantTermsModal: React.FC<TenantTermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-stone-800 border-b border-stone-700 p-6 flex justify-between items-center">
          <h2 className="text-white text-2xl font-bold">Tenant Terms of Service</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="p-6 text-gray-300 space-y-4">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-400">Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="space-y-3">
            <p className="leading-relaxed">
              Welcome to our platform. By applying to become a tenant and using our services, you agree to these Terms of Service (&ldquo;Terms&rdquo;). Please read them carefully.
            </p>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-1">1. Eligibility</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>You must be at least 18 years old and legally able to enter into contracts.</li>
                <li>You must provide accurate information in your application and maintain it up to date.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-1">2. Services Provided</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>We provide a platform (website and app) that allows tenants to list, market, and sell mobile detailing services to customers.</li>
                <li>We are not the service provider; you remain solely responsible for delivering the services you advertise and accept through the platform.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-1">3. Tenant Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Maintain valid business licenses, insurance, and any required permits in your service area.</li>
                <li>Deliver services in a professional, lawful, and safe manner.</li>
                <li>Keep your availability, pricing, and business information current in the platform.</li>
                <li>You are responsible for your own employees, contractors, tools, products, and vehicles.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-1">4. Payments and Fees</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>All transactions are processed through our payment processor (currently Stripe).</li>
                <li>Standard fee: 10% of each transaction (3% payment processing + 7% platform fee).</li>
                <li>Payouts are issued to your designated bank account, less applicable fees.</li>
                <li>You are responsible for taxes associated with your earnings.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-1">5. Termination and Suspension</h3>
              <p className="text-sm mb-1">We may suspend or terminate your account if you:</p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>Provide false information,</li>
                <li>Engage in fraudulent or harmful activity,</li>
                <li>Fail to deliver services to customers as agreed.</li>
              </ul>
              <p className="text-sm mt-1">You may request account closure at any time by contacting support.</p>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-1">6. Limitation of Liability</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>We are not liable for your actions, omissions, or damages arising from your detailing services.</li>
                <li>Our liability is limited to the amount of platform fees you paid to us in the past 6 months.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-1">7. Changes to Terms</h3>
              <p className="text-sm">
                We may update these Terms from time to time. We will notify tenants by email or dashboard notice. Continued use of the platform constitutes acceptance.
              </p>
            </div>
          </div>
          
          <div className="text-center pt-4">
            <Button
              onClick={onClose}
              variant="primary"
              size="md"
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg"
            >
              I Understand
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantTermsModal;


