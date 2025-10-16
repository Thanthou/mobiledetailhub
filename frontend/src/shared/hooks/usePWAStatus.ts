import { useEffect, useState } from 'react';

interface PWAStatus {
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  displayMode: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
}

export const usePWAStatus = (): PWAStatus => {
  const [status, setStatus] = useState<PWAStatus>({
    isInstalled: false,
    isStandalone: false,
    canInstall: false,
    displayMode: 'browser',
  });

  useEffect(() => {
    const detectDisplayMode = () => {
      const modes = ['standalone', 'fullscreen', 'minimal-ui'] as const;
      const active = modes.find((mode) =>
        window.matchMedia(`(display-mode: ${mode})`).matches
      );
      const displayMode = active ?? 'browser';
      const isStandaloneIOS =
        'standalone' in navigator && (navigator as { standalone?: boolean }).standalone;
      const isStandalone = displayMode !== 'browser' || !!isStandaloneIOS;

      // Additional detection methods
      const hasAppBanner = 'standalone' in window && window.standalone === true;
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isPWAInstalled = isStandalone || hasAppBanner || isInStandaloneMode;

      // Debug logging removed for production

      setStatus((prev) => ({
        ...prev,
        isStandalone,
        isInstalled: isPWAInstalled,
        displayMode,
      }));
    };

    detectDisplayMode();

    // Detect when app becomes installable
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setStatus((prev) => ({ ...prev, canInstall: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', detectDisplayMode);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return status;
};
