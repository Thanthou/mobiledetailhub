import { X } from 'lucide-react';
import React from 'react';

interface AffiliatePrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AffiliatePrivacyModal: React.FC<AffiliatePrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-stone-800 border-b border-stone-700 p-6 flex justify-between items-center">
          <h2 className="text-white text-2xl font-bold">Affiliate Privacy Policy</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 text-gray-300 space-y-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-400">Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="space-y-4">
            <p className="leading-relaxed">
              Mobile Detail Hub (&quot;MDH&quot;, &quot;we&quot;, &quot;our&quot;) respects your privacy. This Privacy Policy explains how we collect, use, and protect your personal information as an affiliate.
            </p>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-2">1. Information We Collect</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>From your application: business name, contact info, service areas, licenses, proof of work, and social links.</li>
                <li>From your use of the platform: services listed, prices, availability, and customer communications.</li>
                <li>From transactions: payout details, Stripe account info, and invoices.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-2">2. How We Use Your Information</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>To review and approve affiliate applications.</li>
                <li>To publish your business profile and services on our platform.</li>
                <li>To process transactions, fees, and payouts.</li>
                <li>To communicate with you regarding account updates, payments, or issues.</li>
                <li>To comply with legal obligations (e.g., tax reporting, fraud prevention).</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-2">3. Sharing of Information</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>With customers: business name, logo, contact info, services, reviews, and availability.</li>
                <li>With service providers: payment processors (Stripe), cloud hosting, and analytics tools.</li>
                <li>For legal reasons: if required by law or to enforce our Terms.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-2">4. Data Security</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>We use encryption and secure access controls to protect data.</li>
                <li>No method of storage or transmission is 100% secure; use of the platform is at your own risk.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-2">5. Your Choices</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>You may update your business details in the dashboard at any time.</li>
                <li>You may request deletion of your account, subject to legal/financial record retention requirements.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">6. Data Retention</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Application data is retained while your account is active.</li>
                <li>Transaction records are retained for at least 7 years (for accounting and tax compliance).</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-2">7. Changes to this Policy</h3>
              <p className="text-sm">
                MDH may update this Privacy Policy. We will notify you via email or dashboard notice. Continued use of the platform constitutes acceptance.
              </p>
            </div>
          </div>
          
          <div className="text-center pt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliatePrivacyModal;
