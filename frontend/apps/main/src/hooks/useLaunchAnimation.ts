/**
 * Custom hook for the rocket launch animation
 * Used by all CTA buttons across the site
 * 
 * Animation sequence:
 * 1. Show 3, 2, 1 countdown (3 seconds) - Global portal overlay
 * 2. Show rocket launch + page peel (2 seconds) - Local to hero section wrapper
 * 3. Navigate to /signup page
 * 
 * Returns:
 * - handleLaunch: Trigger the full animation sequence
 * - showCountdown/countdownNumber: For countdown overlay (portal)
 * - showTransition: For rocket/peel (RocketPeelTransition wrapper)
 * - shouldLoadOnboarding: For preloading signup page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useLaunchAnimation() {
  const navigate = useNavigate();
  
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [showTransition, setShowTransition] = useState(false);
  const [shouldLoadOnboarding, setShouldLoadOnboarding] = useState(false);

  const handleLaunch = () => {
    // Start countdown
    setShowCountdown(true);
    setCountdownNumber(3);
    
    // Preload signup page immediately (lazy load while animation plays)
    setShouldLoadOnboarding(true);
    
    // Trigger preload of the route component
    import('@shared/components/tenantOnboarding/components/TenantApplicationPage').catch(() => {
      // Silently fail if already loaded
    });

    // Countdown sequence: 3... 2... 1...
    setTimeout(() => setCountdownNumber(2), 1000);
    setTimeout(() => setCountdownNumber(1), 2000);
    
    // After countdown, start rocket + peel transition
    setTimeout(() => {
      setShowCountdown(false);
      setShowTransition(true);
    }, 3000);
    
    // After rocket animation, navigate to signup
    setTimeout(() => {
      navigate('/signup');
    }, 5000);
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
  };

  return {
    handleLaunch,
    showCountdown,
    countdownNumber,
    showTransition,
    handleTransitionComplete,
    shouldLoadOnboarding,
  };
}

