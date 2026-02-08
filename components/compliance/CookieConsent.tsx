'use client';

import { useState, useEffect } from 'react';
import { CookieCategory, DEFAULT_COOKIE_CONSENT } from '@/lib/compliance/gdpr';

interface CookiePreferences {
  [CookieCategory.NECESSARY]: boolean;
  [CookieCategory.ANALYTICS]: boolean;
  [CookieCategory.MARKETING]: boolean;
  [CookieCategory.FUNCTIONAL]: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_COOKIE_CONSENT);

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem('cookie-consent');
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      setPreferences(JSON.parse(savedConsent));
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      [CookieCategory.NECESSARY]: true,
      [CookieCategory.ANALYTICS]: true,
      [CookieCategory.MARKETING]: true,
      [CookieCategory.FUNCTIONAL]: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    savePreferences(DEFAULT_COOKIE_CONSENT);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
    setShowPreferences(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    
    // Trigger analytics consent mode update if Google Analytics is present
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: prefs.analytics ? 'granted' : 'denied',
        ad_storage: prefs.marketing ? 'granted' : 'denied',
        functionality_storage: prefs.functional ? 'granted' : 'denied',
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 sm:p-8">
        {!showPreferences ? (
          // Main Banner
          <>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  We value your privacy
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or accept only necessary cookies.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Read our{' '}
                  <a href="/privacy-policy" className="text-purple-600 hover:underline" target="_blank">
                    Privacy Policy
                  </a>
                  {' '}and{' '}
                  <a href="/terms" className="text-purple-600 hover:underline" target="_blank">
                    Terms of Service
                  </a>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptAll}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Accept All
              </button>
              <button
                onClick={acceptNecessary}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Necessary Only
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-purple-600 hover:text-purple-600 transition font-medium"
              >
                Customize
              </button>
            </div>
          </>
        ) : (
          // Preferences Panel
          <>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Cookie Preferences
              </h3>
              <p className="text-gray-600 text-sm">
                Choose which cookies you want to accept. You can change these settings at any time.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">Necessary Cookies</h4>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Required</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Essential for the website to function. Cannot be disabled.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-1 h-5 w-5 text-purple-600 rounded cursor-not-allowed opacity-50"
                />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Help us understand how visitors interact with our website (Google Analytics).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="mt-1 h-5 w-5 text-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Used to track visitors across websites for advertising purposes.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="mt-1 h-5 w-5 text-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Functional Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Functional Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Remember your preferences and settings for a better experience.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                  className="mt-1 h-5 w-5 text-purple-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPreferences(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Back
              </button>
              <button
                onClick={saveCustomPreferences}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Save Preferences
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
