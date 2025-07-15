import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';

interface SuitabilityFormProps {
  bestFor: string[];
  setBestFor: (value: string[]) => void;
  notSuitableFor: string[];
  setNotSuitableFor: (value: string[]) => void;
}

const SuitabilityForm = ({
  bestFor,
  setBestFor,
  notSuitableFor,
  setNotSuitableFor,
}: SuitabilityFormProps) => {
  const addBestFor = (value: string) => {
    if (value.trim() && !bestFor.includes(value.trim())) {
      setBestFor([...bestFor, value.trim()]);
    }
  };

  const removeBestFor = (index: number) => {
    setBestFor(bestFor.filter((_, i) => i !== index));
  };

  const addNotSuitableFor = (value: string) => {
    if (value.trim() && !notSuitableFor.includes(value.trim())) {
      setNotSuitableFor([...notSuitableFor, value.trim()]);
    }
  };

  const removeNotSuitableFor = (index: number) => {
    setNotSuitableFor(notSuitableFor.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, callback: (value: string) => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      callback(input.value);
      input.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suitability Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Best For Section */}
        <div>
          <Label className="text-base font-medium">This coliving is best for:</Label>
          <p className="text-sm text-gray-600 mb-3">
            Add characteristics or types of people who would love this place. Press Enter to add each item.
          </p>
          
          <Input
            placeholder="e.g., Digital nomads, Remote workers, Solo travelers..."
            onKeyPress={(e) => handleKeyPress(e, addBestFor)}
            className="mb-3"
          />
          
          <div className="flex flex-wrap gap-2">
            {bestFor.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-adventure-orange/10 text-adventure-orange px-3 py-1 rounded-full text-sm"
              >
                <span>{item}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-adventure-orange/20"
                  onClick={() => removeBestFor(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Not Suitable For Section */}
        <div>
          <Label className="text-base font-medium">This coliving is not for you if:</Label>
          <p className="text-sm text-gray-600 mb-3">
            Add situations or preferences where this place might not be suitable. Press Enter to add each item.
          </p>
          
          <Input
            placeholder="e.g., You need complete silence, You prefer luxury accommodations..."
            onKeyPress={(e) => handleKeyPress(e, addNotSuitableFor)}
            className="mb-3"
          />
          
          <div className="flex flex-wrap gap-2">
            {notSuitableFor.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm"
              >
                <span>{item}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-red-100"
                  onClick={() => removeNotSuitableFor(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuitabilityForm;