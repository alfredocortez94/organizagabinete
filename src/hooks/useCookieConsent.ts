
import { useState, useEffect } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export const useCookieConsent = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent) {
      const savedPreferences = JSON.parse(cookieConsent);
      setPreferences(savedPreferences);
      setHasConsent(true);
    }
  }, []);

  const updatePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('cookieConsent', JSON.stringify(newPreferences));
    setHasConsent(true);
  };

  const clearConsent = () => {
    localStorage.removeItem('cookieConsent');
    setHasConsent(false);
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    });
  };

  const canUseAnalytics = () => preferences.analytics;
  const canUseMarketing = () => preferences.marketing;
  const canUseFunctional = () => preferences.functional;

  return {
    preferences,
    hasConsent,
    updatePreferences,
    clearConsent,
    canUseAnalytics,
    canUseMarketing,
    canUseFunctional
  };
};
