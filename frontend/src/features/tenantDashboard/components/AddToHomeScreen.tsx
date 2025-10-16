/**
 * Add to Home Screen Component
 * Prompts users to install the PWA on mobile devices only
 * Works on iOS and Android mobile devices
 * Desktop and tablet users will not see this prompt
 */

/**
 * AddToHomeScreen Component - DISABLED FOR NOW
 * 
 * This component provides PWA "Add to Home Screen" functionality for tenant dashboards.
 * Moved from onboarding flow to dashboard where it makes more sense.
 * 
 * TODO: Enable this component in the tenant dashboard when ready.
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
  // DISABLED FOR NOW - Component moved from onboarding to dashboard
  // TODO: Enable when ready to add PWA functionality to tenant dashboard
  return null;
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [userDismissed, setUserDismissed] = useState(false);
  const [installStatus, setInstallStatus] = useState<string>('');
  const isMobile = useMobileDetection();

  // Debug logging for mobile (console only)
  const addDebugMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] 📱 PWA: ${message}`);
  };

  useEffect(() => {
    addDebugMessage('🎯 AddToHomeScreen component mounted');
    addDebugMessage(`Props: tenantSlug=${tenantSlug}, businessName=${businessName}, autoShow=${autoShow}`);
    
    // Check localStorage for previous dismissals
    const iosDismissed = localStorage.getItem('pwa-ios-prompt-dismissed');
    const androidDismissed = localStorage.getItem('pwa-android-prompt-dismissed');
    addDebugMessage(`localStorage check: iOS dismissed=${!!iosDismissed}, Android dismissed=${!!androidDismissed}`);
    
    // TEMPORARY: Clear dismissal flags for testing
    if (iosDismissed || androidDismissed) {
      addDebugMessage('Clearing dismissal flags for testing...');
      localStorage.removeItem('pwa-ios-prompt-dismissed');
      localStorage.removeItem('pwa-android-prompt-dismissed');
      setUserDismissed(false);
    }
    
    // Check if already installed (both display-mode and navigator.standalone for iOS)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      console.log('📱 PWA: Already installed (standalone mode)');
      addDebugMessage('Already installed (standalone mode)');
      setIsInstalled(true);
      return;
    }

    // Only proceed if on mobile device
    if (!isMobile) {
      console.log('📱 PWA: Not mobile device, skipping prompt');
      addDebugMessage('Not mobile device, skipping prompt');
      return;
    }

    console.log('📱 PWA: Mobile device detected, setting up prompt');
    addDebugMessage('Mobile device detected, setting up prompt');

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    addDebugMessage(`iOS detected: ${iOS}`);

    // Listen for the beforeinstallprompt event (Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('📱 PWA: beforeinstallprompt event received');
      addDebugMessage('beforeinstallprompt event received');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (autoShow) {
        setShowPrompt(true);
        addDebugMessage('Showing prompt (Android)');
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
        console.log('📱 PWA: Showing iOS prompt');
        addDebugMessage('Showing iOS prompt');
        setShowPrompt(true);
      } else {
        console.log('📱 PWA: iOS prompt was dismissed before');
        addDebugMessage('iOS prompt was dismissed before');
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [autoShow, isInstalled, isMobile, tenantSlug, businessName]);

  // Separate effect to handle mobile detection changes
  useEffect(() => {
    addDebugMessage(`Mobile effect: isMobile=${isMobile}, isInstalled=${isInstalled}, showPrompt=${showPrompt}, autoShow=${autoShow}, userDismissed=${userDismissed}`);
    
    if (isMobile && !isInstalled && autoShow && !showPrompt && !userDismissed) {
      addDebugMessage('Mobile detected - checking for PWA events');
      
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      addDebugMessage(`Device type: iOS=${iOS}, hasDeferredPrompt=${!!deferredPrompt}`);
      
      // For iOS, always show manual prompt (no beforeinstallprompt event)
      if (iOS) {
        const dismissed = localStorage.getItem('pwa-ios-prompt-dismissed');
        addDebugMessage(`iOS dismissed check: ${!!dismissed}`);
        if (!dismissed) {
          addDebugMessage('iOS device - showing manual prompt');
          setShowPrompt(true);
        } else {
          addDebugMessage('iOS prompt was previously dismissed');
        }
      }
      // For Android, check if previously dismissed
      else {
        const dismissed = localStorage.getItem('pwa-android-prompt-dismissed');
        addDebugMessage(`Android dismissed check: ${!!dismissed}`);
        if (!dismissed) {
          if (deferredPrompt) {
            addDebugMessage('Android - found deferred prompt, showing native prompt');
          } else {
            addDebugMessage('Android - no deferred prompt, showing manual prompt');
          }
          setShowPrompt(true);
        } else {
          addDebugMessage('Android prompt was previously dismissed');
        }
      }
    } else {
      addDebugMessage(`Not showing prompt - isMobile:${isMobile}, isInstalled:${isInstalled}, autoShow:${autoShow}, showPrompt:${showPrompt}, userDismissed:${userDismissed}`);
    }
  }, [isMobile, deferredPrompt, isInstalled, showPrompt, autoShow, userDismissed]);

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
    setInstallStatus('Checking install options...');
    
    if (deferredPrompt) {
      setInstallStatus('Opening install dialog...');
      try {
        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user's response
        const choiceResult = await deferredPrompt.userChoice;

        if (choiceResult.outcome === 'accepted') {
          setInstallStatus('✅ Install accepted! Check your home screen.');
          addDebugMessage('User accepted the install prompt');
        } else {
          setInstallStatus('Install dialog dismissed');
          addDebugMessage('User dismissed the install prompt');
        }

        // Clear the deferred prompt
        setDeferredPrompt(null);
        setTimeout(() => setShowPrompt(false), 2000);
      } catch (error) {
        setInstallStatus('❌ Install failed. Try manual install.');
        addDebugMessage(`Error showing install prompt: ${error}`);
      }
    } else {
      setInstallStatus('📱 Use browser menu (⋮) → "Add to Home screen"');
      addDebugMessage('No native install prompt available - manual installation required');
      
      // For manual installation, keep the prompt open so user can see instructions
      setTimeout(() => {
        setInstallStatus('');
      }, 5000);
    }
  };

  const handleClose = () => {
    console.log('📱 PWA: handleClose called');
    setShowPrompt(false);
    setUserDismissed(true);
    if (isIOS) {
      // Remember that user dismissed iOS prompt
      localStorage.setItem('pwa-ios-prompt-dismissed', 'true');
    } else {
      // Remember that user dismissed Android prompt
      localStorage.setItem('pwa-android-prompt-dismissed', 'true');
    }
    onClose?.();
  };

  // Log render state (moved to useEffect to avoid race conditions)
  useEffect(() => {
    console.log('📱 PWA: AddToHomeScreen render called - isMobile:', isMobile, 'showPrompt:', showPrompt);
    addDebugMessage(`Render: isMobile=${isMobile}, showPrompt=${showPrompt}, isInstalled=${isInstalled}`);
  }, [isMobile, showPrompt, isInstalled]);

  // Don't show if not mobile, already installed, or no prompt available
  if (!isMobile || isInstalled || !showPrompt) {
    console.log('📱 PWA: Component returning null - isMobile:', isMobile, 'isInstalled:', isInstalled, 'showPrompt:', showPrompt);
    return null;
  }

  console.log('📱 PWA: Component rendering PWA prompt');

  return (
    <>
      
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-stone-900 via-stone-900 to-stone-900/95 border-t border-stone-700 shadow-2xl">
        <div className="max-w-2xl mx-auto p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Smartphone className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-1">
                Add {businessName} to Home Screen
              </h3>
              
              {isIOS ? (
                <div className="text-sm text-gray-300 space-y-2">
                  <p>Access your dashboard instantly!</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-gray-400">
                    <li>Tap the Share button at the bottom</li>
                    <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
                    <li>Tap &quot;Add&quot; to confirm</li>
                  </ol>
                </div>
              ) : (
                <div className="text-sm text-gray-300 space-y-2">
                  <p>Install the app for quick access to your dashboard.</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-gray-400">
                    <li>Tap the menu button (⋮) in your browser</li>
                    <li>Look for "Add to Home screen" or "Install app"</li>
                    <li>Tap "Add" to confirm</li>
                  </ol>
                  <p className="text-xs text-gray-400 mt-2">
                    Works offline and loads instantly!
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                console.log('📱 PWA: Close button clicked');
                handleClose();
              }}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status message */}
          {installStatus && (
            <div className="mt-4 p-3 bg-blue-900/50 border border-blue-700 rounded-lg">
              <p className="text-sm text-blue-200 text-center">{installStatus}</p>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3">
            {!isIOS && (
              <Button
                onClick={() => { 
                  console.log('📱 PWA: Install button clicked');
                  void handleInstallClick();
                }}
                variant="primary"
                size="lg"
                className="w-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {deferredPrompt ? 'Install App' : 'Install App'}
              </Button>
            )}
            <Button
              onClick={() => {
                console.log('📱 PWA: Maybe Later button clicked');
                handleClose();
              }}
              variant="outline"
              size="lg"
              className="w-full border-stone-600 text-gray-300 hover:bg-stone-800"
            >
              {isIOS ? 'Got it' : 'Maybe Later'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddToHomeScreen;