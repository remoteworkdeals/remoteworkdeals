
import { useState, useEffect } from 'react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const useCookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie-consent');
    if (storedConsent) {
      const parsed = JSON.parse(storedConsent);
      setPreferences(parsed.preferences);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const newPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(newPreferences);
    localStorage.setItem('cookie-consent', JSON.stringify({
      timestamp: new Date().toISOString(),
      preferences: newPreferences,
    }));
    setShowBanner(false);
  };

  const acceptEssential = () => {
    const newPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(newPreferences);
    localStorage.setItem('cookie-consent', JSON.stringify({
      timestamp: new Date().toISOString(),
      preferences: newPreferences,
    }));
    setShowBanner(false);
  };

  const updatePreferences = (newPreferences: Partial<CookiePreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences, essential: true };
    setPreferences(updatedPreferences);
    localStorage.setItem('cookie-consent', JSON.stringify({
      timestamp: new Date().toISOString(),
      preferences: updatedPreferences,
    }));
  };

  const resetConsent = () => {
    localStorage.removeItem('cookie-consent');
    setShowBanner(true);
    setPreferences({
      essential: true,
      analytics: false,
      marketing: false,
    });
  };

  return {
    showBanner,
    preferences,
    acceptAll,
    acceptEssential,
    updatePreferences,
    resetConsent,
  };
};
