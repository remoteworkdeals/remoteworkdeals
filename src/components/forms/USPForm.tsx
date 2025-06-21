
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface USPFormProps {
  usp: string;
  setUsp: (value: string) => void;
}

const USPForm = ({ usp, setUsp }: USPFormProps) => {
  const maxLength = 40;
  const remainingChars = maxLength - usp.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Unique Selling Point</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="usp">USP (short unique selling point)</Label>
          <Input
            id="usp"
            type="text"
            value={usp}
            onChange={(e) => setUsp(e.target.value)}
            maxLength={maxLength}
            placeholder="e.g., Eco Retreat with Mountain Views"
            className="mt-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            {remainingChars >= 0 ? `${remainingChars} characters remaining` : `${Math.abs(remainingChars)} characters over limit`}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            This appears on listing cards instead of "High-speed WiFi"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default USPForm;
