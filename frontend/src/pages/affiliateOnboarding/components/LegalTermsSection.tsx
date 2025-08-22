import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { AffiliateApplication, SOURCES } from '../types';
import { AffiliateTermsModal, AffiliatePrivacyModal } from './index';

interface LegalTermsSectionProps {
  formData: AffiliateApplication;
  handleInputChange: (field: string, value: any) => void;
}

const LegalTermsSection: React.FC<LegalTermsSectionProps> = ({
  formData,
  handleInputChange
}) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg">
      <div className="p-6 border-b border-stone-700">
        <h2 className="text-white text-lg font-semibold flex items-center">
          <Shield className="w-5 h-5 mr-2 text-orange-400" />
          Legal & Terms
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Important agreements and confirmations
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <label htmlFor="accept_terms" className="flex items-start space-x-3">
            <input
              id="accept_terms"
              name="accept_terms"
              type="checkbox"
              checked={formData.accept_terms}
              onChange={(e) => handleInputChange('accept_terms', e.target.checked)}
              className="mt-1 border-stone-600 text-orange-500 rounded focus:ring-orange-500"
              required
            />
            <span className="text-gray-300 text-sm">
              I accept the <button type="button" onClick={() => setShowTerms(true)} className="text-orange-400 hover:underline">Terms of Service</button> and <button type="button" onClick={() => setShowPrivacy(true)} className="text-orange-400 hover:underline">Privacy Policy</button> <span className="text-red-400">*</span>
            </span>
          </label>

          <label htmlFor="consent_notifications" className="flex items-start space-x-3">
            <input
              id="consent_notifications"
              name="consent_notifications"
              type="checkbox"
              checked={formData.consent_notifications}
              onChange={(e) => handleInputChange('consent_notifications', e.target.checked)}
              className="mt-1 border-stone-600 text-orange-500 rounded focus:ring-orange-500"
              required
            />
            <span className="text-gray-300 text-sm">
              I consent to receive notifications about my application status and affiliate opportunities <span className="text-red-400">*</span>
            </span>
          </label>
        </div>

        <div>
          <label htmlFor="source" className="block text-gray-300 text-sm font-medium mb-2">How did you hear about us?</label>
          <select 
            id="source"
            name="source"
            value={formData.source}
            onChange={(e) => handleInputChange('source', e.target.value)}
            className="w-full bg-stone-700 border border-stone-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select source</option>
            {SOURCES.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-gray-300 text-sm font-medium mb-2">Additional Notes (Optional)</label>
          <textarea 
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Any additional information you'd like us to know..."
            rows={3}
          />
        </div>
      </div>
      
      <AffiliateTermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <AffiliatePrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};

export default LegalTermsSection;
