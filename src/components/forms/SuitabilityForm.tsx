
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
  const handleBestForTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
    setBestFor(lines.map(line => line.trim()));
  };

  const handleNotSuitableForTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
    setNotSuitableFor(lines.map(line => line.trim()));
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="text-2xl text-blue-800">For who is this coliving?</CardTitle>
        <p className="text-sm text-blue-600">
          Add information about who this coliving is perfect for and who it's not suitable for. Each line will become a bullet point on the listing page.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Perfect For Section */}
        <div>
          <Label className="text-base font-medium text-green-700 mb-3 block">Perfect for you if you are:</Label>
          <Textarea
            placeholder="Enter each point on a new line:&#10;Digital nomads&#10;Remote workers&#10;Creative freelancers&#10;Social people who enjoy community"
            value={bestFor.join('\n')}
            onChange={handleBestForTextareaChange}
            className="min-h-[120px] border-green-200 focus:border-green-400"
            rows={6}
          />
          
          {bestFor.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {bestFor.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                      <span className="text-green-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Not Suitable For Section */}
        <div>
          <Label className="text-base font-medium text-red-700 mb-3 block">Not ideal if you:</Label>
          <Textarea
            placeholder="Enter each point on a new line:&#10;Heavy partiers&#10;People seeking complete isolation&#10;Those uncomfortable with shared spaces&#10;Light sleepers who need absolute quiet"
            value={notSuitableFor.join('\n')}
            onChange={handleNotSuitableForTextareaChange}
            className="min-h-[120px] border-red-200 focus:border-red-400"
            rows={6}
          />
          
          {notSuitableFor.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {notSuitableFor.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                      <span className="text-red-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuitabilityForm;
