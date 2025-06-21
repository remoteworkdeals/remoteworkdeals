
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContactFormProps {
  websiteUrl: string | null;
  setWebsiteUrl: (value: string | null) => void;
  instagramUrl: string | null;
  setInstagramUrl: (value: string | null) => void;
}

const ContactForm = ({
  websiteUrl,
  setWebsiteUrl,
  instagramUrl,
  setInstagramUrl,
}: ContactFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="websiteUrl">Website URL (optional)</Label>
          <Input
            id="websiteUrl"
            type="url"
            value={websiteUrl || ''}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="instagramUrl">Instagram URL (optional)</Label>
          <Input
            id="instagramUrl"
            type="url"
            value={instagramUrl || ''}
            onChange={(e) => setInstagramUrl(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
