
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NewListingPricingFormProps {
  originalPrice: number;
  setOriginalPrice: (value: number) => void;
  discountType: 'percentage' | 'fixed_amount';
  setDiscountType: (value: 'percentage' | 'fixed_amount') => void;
  discountValue: number;
  setDiscountValue: (value: number) => void;
  pricingUnit: 'night' | 'month';
  setPricingUnit: (value: 'night' | 'month') => void;
  discountedPrice: number;
}

const NewListingPricingForm = ({
  originalPrice,
  setOriginalPrice,
  discountType,
  setDiscountType,
  discountValue,
  setDiscountValue,
  pricingUnit,
  setPricingUnit,
  discountedPrice,
}: NewListingPricingFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="originalPrice">Original Price (€) *</Label>
            <Input
              id="originalPrice"
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)}
              min="0"
              required
            />
          </div>
          <div>
            <Label htmlFor="pricingUnit">Pricing Unit</Label>
            <Select value={pricingUnit} onValueChange={(value: 'night' | 'month') => setPricingUnit(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="night">Per Night</SelectItem>
                <SelectItem value="month">Per Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Discount (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="discountType">Discount Type</Label>
              <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed_amount') => setDiscountType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed_amount">Fixed Amount (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="discountValue">
                Discount Value {discountType === 'percentage' ? '(%)' : '(€)'}
              </Label>
              <Input
                id="discountValue"
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value) || 0)}
                min="0"
                max={discountType === 'percentage' ? 100 : undefined}
              />
            </div>
            <div>
              <Label>Final Price</Label>
              <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
                <span className="font-medium">€{discountedPrice}</span>
                <span className="text-sm text-gray-500 ml-1">/ {pricingUnit}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewListingPricingForm;
