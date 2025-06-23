
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Shield, BarChart3, Target, Cookie } from 'lucide-react';
import { useCookieConsent, CookiePreferences } from '@/hooks/useCookieConsent';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Detailed cookie preferences modal for GDPR compliance
 * Allows users to control individual cookie categories
 */
const CookiePreferencesModal = ({ isOpen, onClose }: CookiePreferencesModalProps) => {
  const { preferences, updatePreferences, acceptAll, acceptEssential } = useCookieConsent();
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  if (!isOpen) return null;

  const handleSave = () => {
    updatePreferences(localPreferences);
    onClose();
  };

  const cookieCategories = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you.',
      icon: <Shield className="w-5 h-5" />,
      required: true,
      examples: 'Session management, security, form data'
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      icon: <BarChart3 className="w-5 h-5" />,
      required: false,
      examples: 'Google Analytics, page views, user behavior'
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      description: 'These cookies are used to track visitors across websites to display relevant advertisements and improve marketing effectiveness.',
      icon: <Target className="w-5 h-5" />,
      required: false,
      examples: 'Ad targeting, social media integration, conversion tracking'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cookie className="w-6 h-6 text-adventure-orange" />
              <CardTitle className="text-xl text-forest-green">Cookie Preferences</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="text-sm text-gray-600">
            <p className="mb-4">
              We respect your privacy and give you control over your data. Choose which cookies you'd like to allow. 
              You can change these settings at any time.
            </p>
          </div>

          <div className="space-y-4">
            {cookieCategories.map((category) => (
              <Card key={category.id} className="border-l-4 border-l-adventure-orange">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-adventure-orange">{category.icon}</div>
                        <h4 className="font-semibold text-forest-green">{category.title}</h4>
                        {category.required && (
                          <Badge variant="secondary" className="text-xs">Required</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                      
                      <p className="text-xs text-gray-500">
                        <strong>Examples:</strong> {category.examples}
                      </p>
                    </div>
                    
                    <Switch
                      checked={localPreferences[category.id as keyof CookiePreferences]}
                      onCheckedChange={(checked) => 
                        setLocalPreferences(prev => ({ 
                          ...prev, 
                          [category.id]: checked 
                        }))
                      }
                      disabled={category.required}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button onClick={handleSave} className="adventure-button flex-1">
              Save Preferences
            </Button>
            
            <Button 
              onClick={() => {
                acceptAll();
                onClose();
              }}
              variant="outline" 
              className="border-forest-green text-forest-green hover:bg-forest-green hover:text-white"
            >
              Accept All
            </Button>
            
            <Button 
              onClick={() => {
                acceptEssential();
                onClose();
              }}
              variant="ghost" 
              className="text-forest-green hover:text-adventure-orange"
            >
              Essential Only
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookiePreferencesModal;
