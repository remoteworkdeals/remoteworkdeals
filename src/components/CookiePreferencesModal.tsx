
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Shield, BarChart3, Target } from 'lucide-react';
import { useCookieConsent, CookiePreferences } from '@/hooks/useCookieConsent';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Minimal cookie preferences modal
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
      title: 'Essential',
      description: 'Required for basic website functionality',
      icon: <Shield className="w-4 h-4" />,
      required: true,
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Help us understand how visitors use our website',
      icon: <BarChart3 className="w-4 h-4" />,
      required: false,
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Used for advertising and social media features',
      icon: <Target className="w-4 h-4" />,
      required: false,
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-gray-900">Cookie Settings</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose which cookies you'd like to allow.
          </p>

          <div className="space-y-3">
            {cookieCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-gray-600 mt-0.5">{category.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-gray-900">{category.title}</h4>
                      {category.required && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{category.description}</p>
                  </div>
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
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} className="flex-1 bg-adventure-orange hover:bg-adventure-orange/90 text-white">
              Save
            </Button>
            <Button onClick={() => { acceptAll(); onClose(); }} variant="outline" className="flex-1">
              Accept All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookiePreferencesModal;
