import React, { useState } from 'react';
import { Check, Clipboard, ExternalLink, Share2,X } from 'lucide-react';

import { Button } from '@shared/ui';

interface GoogleBusinessProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  onUrlFound: (url: string) => void;
}

const GoogleBusinessProfileModal: React.FC<GoogleBusinessProfileModalProps> = ({
  isOpen,
  onClose,
  businessName,
  onUrlFound
}) => {
  const [copiedUrl, setCopiedUrl] = useState('');
  const [isPasted, setIsPasted] = useState(false);

  if (!isOpen) return null;

  const handleSearchGoogle = () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(businessName)}`;
    window.open(searchUrl, '_blank');
  };

  const handleUrlSubmit = () => {
    if (copiedUrl.trim()) {
      onUrlFound(copiedUrl.trim());
      onClose();
      setCopiedUrl('');
      setIsPasted(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCopiedUrl(text);
      setIsPasted(true);
      setTimeout(() => { setIsPasted(false); }, 2000);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-800 border border-stone-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-700">
          <h2 className="text-white text-xl font-semibold">
            Find Your Google Business Profile
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white p-2"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Business Name Display */}
          <div className="bg-stone-700 p-4 rounded-lg">
            <p className="text-gray-300 text-sm">
              <span className="font-medium">Business:</span> {businessName}
            </p>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-4">
            <h3 className="text-white font-medium">Follow these steps:</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-gray-300 text-sm">
                    Click the button below to search Google for your business
                  </p>
                  <Button
                    onClick={handleSearchGoogle}
                    variant="primary"
                    size="sm"
                    className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-medium"
                    leftIcon={<ExternalLink className="w-4 h-4" />}
                  >
                    Search Google for &quot;{businessName}&quot;
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-gray-300 text-sm">
                    Look for your business in the search results and click on it
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                                    <p className="text-gray-300 text-sm">
                    On your business profile page, click the share <Share2 className="inline w-4 h-4 text-blue-400 mx-1" /> button
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <p className="text-gray-300 text-sm">
                    Click &quot;Copy link&quot; to copy your business profile URL
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  5
                </div>
                <div>
                  <p className="text-gray-300 text-sm">
                    Click the paste button below to paste the copied URL, then click &quot;Add URL&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-3">
            <label htmlFor="gbp_url_input" className="block text-gray-300 text-sm font-medium">
              Your Google Business Profile URL:
            </label>
            <div className="flex space-x-2">
              <input
                id="gbp_url_input"
                type="url"
                value={copiedUrl}
                onChange={(e) => { setCopiedUrl(e.target.value); }}
                placeholder="https://share.google/..."
                className="flex-1 bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Button
                onClick={() => { void handlePaste(); }}
                variant="secondary"
                size="sm"
                className="px-3 py-2 bg-stone-600 hover:bg-stone-500"
                title="Paste URL from clipboard"
              >
                {isPasted ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Visual Guide */}
          <div className="bg-stone-700 p-4 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">
              <span className="font-medium">💡 Tip:</span> The URL should look like this:
            </p>
            <code className="text-blue-400 text-xs block bg-stone-800 p-2 rounded">
              https://share.google/MM9ugGMsm1Nw5qYGl
            </code>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-stone-700">
          <Button
            onClick={onClose}
            variant="ghost"
            size="md"
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUrlSubmit}
            variant="primary"
            size="md"
            disabled={!copiedUrl.trim()}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-stone-600 font-medium"
          >
            Add URL
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoogleBusinessProfileModal;
