
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

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
  discountType: 'percentage' | 'fixed_amount' | null;
  setDiscountType: (value: 'percentage' | 'fixed_amount' | null) => void;
  discountValue: number | null;
  setDiscountValue: (value: number | null) => void;
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
  discountType,
  setDiscountType,
  discountValue,
  setDiscountValue,
}: PricingFormProps) => {
  // Auto-calculate discounted price based on discount type and value
  useEffect(() => {
    if (originalPrice && discountType && discountValue) {
      let calculatedPrice: number;
      
      if (discountType === 'percentage') {
        calculatedPrice = originalPrice - (originalPrice * (discountValue / 100));
      } else {
        calculatedPrice = originalPrice - discountValue;
      }
      
      // Ensure price doesn't go below 0
      calculatedPrice = Math.max(0, Math.round(calculatedPrice));
      setDiscountedPrice(calculatedPrice);
    } else if (!discountValue) {
      setDiscountedPrice(null);
    }
  }, [originalPrice, discountType, discountValue, setDiscountedPrice]);

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
              value={originalPrice || ''}
              onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)}
              required
            />
          </div>
          <div>
            <Label htmlFor="pricingUnit">Pricing Unit</Label>
            <Select value={pricingUnit || 'night'} onValueChange={(value) => setPricingUnit(value as 'night' | 'month')}>
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

        <div className="space-y-4">
          <div>
            <Label htmlFor="discountType">Discount Type</Label>
            <Select 
              value={discountType || ''} 
              onValueChange={(value) => {
                if (value === '') {
                  setDiscountType(null);
                } else {
                  setDiscountType(value as 'percentage' | 'fixed_amount');
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No discount</SelectItem>
                <SelectItem value="percentage">% Percentage</SelectItem>
                <SelectItem value="fixed_amount">€ Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {discountType && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountValue">
                  {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount (€)'}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={discountValue !== null ? String(discountValue) : ''}
                  onChange={(e) => setDiscountValue(e.target.value ? Number(e.target.value) : null)}
                  placeholder={discountType === 'percentage' ? 'e.g., 20' : 'e.g., 100'}
                />
              </div>
              <div>
                <Label htmlFor="discountedPrice">Discounted Price (auto-calculated)</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  value={discountedPrice !== null ? String(discountedPrice) : ''}
                  onChange={(e) => setDiscountedPrice(e.target.value ? Number(e.target.value) : null)}
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-calculated, but can be manually overridden</p>
              </div>
            </div>
          )}
        </div>

        {/* Legacy fields for backward compatibility */}
        <div className="hidden">
          <Input
            type="number"
            value={discountPercentage !== null ? String(discountPercentage) : ''}
            onChange={(e) => setDiscountPercentage(e.target.value ? Number(e.target.value) : null)}
          />
        </div>

        <div>
          <Label htmlFor="discountCodeUrl">Discount Code URL (optional)</Label>
          <Input
            id="discountCodeUrl"
            type="url"
            value={discountCodeUrl || ''}
            onChange={(e) => setDiscountCodeUrl(e.target.value || null)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingForm;
