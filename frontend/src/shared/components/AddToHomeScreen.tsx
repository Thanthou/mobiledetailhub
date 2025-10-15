/**
 * Add to Home Screen Component
 * Prompts users to install the PWA on mobile devices only
 * Works on iOS and Android mobile devices
 * Desktop and tablet users will not see this prompt
 */

import React, { useEffect, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

import { Button } from '@/shared/ui';
import { useMobileDetection } from '@/shared/hooks/useMobileDetection';

interface AddToHomeScreenProps {
  tenantSlug?: string;
  businessName?: string;
  onClose?: () => void;
  autoShow?: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const AddToHomeScreen: React.FC<AddToHomeScreenProps> = ({
  tenantSlug,
  businessName = 'Dashboard',
  onClose,
  autoShow = true
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const isMobile = useMobileDetection();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Only proceed if on mobile device
    if (!isMobile) {
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for the beforeinstallprompt event (Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (autoShow) {
        setShowPrompt(true);
      }
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show iOS prompt if on iOS and auto-show enabled
    if (iOS && autoShow && !isInstalled) {
      // Don't show if they've dismissed it before
      const dismissed = localStorage.getItem('pwa-ios-prompt-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [autoShow, isInstalled, isMobile]);

  // Update manifest link if tenant-specific
  useEffect(() => {
    if (tenantSlug) {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        manifestLink.setAttribute('href', `/api/tenant-manifest/${tenantSlug}/manifest.json`);
      }
    }
  }, [tenantSlug]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      // User accepted the install prompt
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
    if (isIOS) {
      // Remember that user dismissed iOS prompt
      localStorage.setItem('pwa-ios-prompt-dismissed', 'true');
    }
    onClose?.();
  };

  // Don't show if not mobile, already installed, or no prompt available
  if (!isMobile || isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-stone-900 via-stone-900 to-stone-900/95 border-t border-stone-700 shadow-2xl">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <Smartphone className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1">
              Add {businessName} to Home Screen
            </h3>
            
            {isIOS ? (
              <div className="text-sm text-gray-300 space-y-2">
                <p>Access your dashboard instantly!</p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-gray-400">
                  <li>Tap the Share button <span className="inline-block">
                    <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
                  </span> at the bottom</li>
                  <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
                  <li>Tap &quot;Add&quot; to confirm</li>
                </ol>
              </div>
            ) : (
              <div className="text-sm text-gray-300 space-y-2">
                <p>Install the app for quick access to your dashboard.</p>
                <p className="text-xs text-gray-400">
                  Works offline and loads instantly!
                </p>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex gap-3">
          {!isIOS && deferredPrompt && (
            <Button
              onClick={() => { void handleInstallClick(); }}
              variant="primary"
              size="lg"
              className="flex-1 bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Install App
            </Button>
          )}
          <Button
            onClick={handleClose}
            variant="outline"
            size="lg"
            className={`${!isIOS && deferredPrompt ? 'flex-shrink-0' : 'flex-1'} border-stone-600 text-gray-300 hover:bg-stone-800`}
          >
            {isIOS ? 'Got it' : 'Maybe Later'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddToHomeScreen;



