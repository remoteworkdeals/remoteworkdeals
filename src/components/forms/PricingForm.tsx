
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PricingFormProps {
  originalPrice: number;
  setOriginalPrice: (value: number) => void;
  pricingUnit: 'night' | 'month';
  setPricingUnit: (value: 'night' | 'month') => void;
  discountedPrice: number | null;
  setDiscountedPrice: (value: number | null) => void;
  discountPercentage: number | null;
  setDiscountPercentage: (value: number | null) => void;
  discountCodeUrl: string | null;
  setDiscountCodeUrl: (value: string | null) => void;
}

const PricingForm = ({
  originalPrice,
  setOriginalPrice,
  pricingUnit,
  setPricingUnit,
  discountedPrice,
  setDiscountedPrice,
  discountPercentage,
  setDiscountPercentage,
  discountCodeUrl,
  setDiscountCodeUrl,
}: PricingFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="originalPrice">Original Price</Label>
            <Input
              id="originalPrice"
              type="number"
              value={String(originalPrice)}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor="pricingUnit">Pricing Unit</Label>
            <Select value={pricingUnit} onValueChange={(value) => setPricingUnit(value as 'night' | 'month')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="night">Night</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="discountedPrice">Discounted Price (optional)</Label>
            <Input
              id="discountedPrice"
              type="number"
              value={discountedPrice !== null ? String(discountedPrice) : ''}
              onChange={(e) => setDiscountedPrice(e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <div>
            <Label htmlFor="discountPercentage">Discount Percentage (optional)</Label>
            <Input
              id="discountPercentage"
              type="number"
              value={discountPercentage !== null ? String(discountPercentage) : ''}
              onChange={(e) => setDiscountPercentage(e.target.value ? Number(e.target.value) : null)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="discountCodeUrl">Discount Code URL (optional)</Label>
          <Input
            id="discountCodeUrl"
            type="url"
            value={discountCodeUrl || ''}
            onChange={(e) => setDiscountCodeUrl(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingForm;
