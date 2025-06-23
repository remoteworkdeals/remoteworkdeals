
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Settings, Cookie } from 'lucide-react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import CookiePreferencesModal from './CookiePreferencesModal';

/**
 * GDPR-compliant cookie consent banner
 * Appears on first visit and allows users to manage cookie preferences
 */
const CookieConsentBanner = () => {
  const { showBanner, acceptAll, acceptEssential } = useCookieConsent();
  const [showPreferences, setShowPreferences] = useState(false);

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-sm border-t shadow-lg">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <Cookie className="w-6 h-6 text-adventure-orange flex-shrink-0 mt-1" />
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-forest-green">We value your privacy</h3>
                  <Badge variant="secondary" className="text-xs">Required by law</Badge>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or 
                  accept only essential cookies.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button 
                    onClick={acceptAll}
                    className="adventure-button text-sm px-4 py-2"
                  >
                    Accept All
                  </Button>
                  
                  <Button 
                    onClick={acceptEssential}
                    variant="outline"
                    className="text-sm px-4 py-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-white"
                  >
                    Essential Only
                  </Button>
                  
                  <Button 
                    onClick={() => setShowPreferences(true)}
                    variant="ghost" 
                    className="text-sm px-4 py-2 text-forest-green hover:text-adventure-orange"
                  >
                    <Settings size={16} className="mr-2" />
                    Customize
                  </Button>
                </div>
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
