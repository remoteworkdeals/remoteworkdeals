
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NewListingContactFormProps {
  websiteUrl: string;
  setWebsiteUrl: (value: string) => void;
  instagramUrl: string;
  setInstagramUrl: (value: string) => void;
  discountCodeUrl: string;
  setDiscountCodeUrl: (value: string) => void;
}

const NewListingContactForm = ({
  websiteUrl,
  setWebsiteUrl,
  instagramUrl,
  setInstagramUrl,
  discountCodeUrl,
  setDiscountCodeUrl,
}: NewListingContactFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        
        <div>
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input
            id="instagramUrl"
            type="url"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="https://instagram.com/username"
          />
        </div>

        <div>
          <Label htmlFor="discountCodeUrl">Discount Code URL</Label>
          <Input
            id="discountCodeUrl"
            type="url"
            value={discountCodeUrl}
            onChange={(e) => setDiscountCodeUrl(e.target.value)}
            placeholder="https://booking-site.com/discount-link"
          />
          <p className="text-sm text-gray-600 mt-1">
            This URL will be used for the "Get Discount Code" button on your listing page. If left empty, visitors will be directed to WhatsApp instead.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewListingContactForm;
