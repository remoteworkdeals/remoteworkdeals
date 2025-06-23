
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Settings } from 'lucide-react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import CookiePreferencesModal from './CookiePreferencesModal';

/**
 * Minimal GDPR-compliant cookie consent banner
 */
const CookieConsentBanner = () => {
  const { showBanner, acceptAll, acceptEssential } = useCookieConsent();
  const [showPreferences, setShowPreferences] = useState(false);

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200">
          <CardContent className="p-4">
            <div className="space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                We use cookies to enhance your experience. 
                <button 
                  onClick={() => setShowPreferences(true)}
                  className="text-adventure-orange hover:underline ml-1"
                >
                  Learn more
                </button>
              </p>
              
              <div className="flex gap-2">
                <Button 
                  onClick={acceptAll}
                  size="sm"
                  className="flex-1 bg-adventure-orange hover:bg-adventure-orange/90 text-white text-xs py-2 px-3 h-8"
                >
                  Accept
                </Button>
                
                <Button 
                  onClick={acceptEssential}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs py-2 px-3 h-8 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Essential
                </Button>
                
                <Button 
                  onClick={() => setShowPreferences(true)}
                  variant="ghost" 
                  size="sm"
                  className="px-2 h-8 text-gray-500 hover:text-gray-700"
                >
                  <Settings size={14} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CookiePreferencesModal 
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </>
  );
};

export default CookieConsentBanner;
