
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SeasonalFormProps {
  isSeasonal: boolean;
  setIsSeasonal: (value: boolean) => void;
  seasonalStartDate: string | null;
  setSeasonalStartDate: (value: string | null) => void;
  seasonalEndDate: string | null;
  setSeasonalEndDate: (value: string | null) => void;
}

const SeasonalForm = ({
  isSeasonal,
  setIsSeasonal,
  seasonalStartDate,
  setSeasonalStartDate,
  seasonalEndDate,
  setSeasonalEndDate,
}: SeasonalFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Seasonal Availability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="isSeasonal">Is Seasonal?</Label>
          <Switch
            id="isSeasonal"
            checked={isSeasonal}
            onCheckedChange={(checked) => setIsSeasonal(checked)}
          />
        </div>
        {isSeasonal && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seasonalStartDate">Seasonal Start Date</Label>
              <Input
                id="seasonalStartDate"
                type="date"
                value={seasonalStartDate || ''}
                onChange={(e) => setSeasonalStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="seasonalEndDate">Seasonal End Date</Label>
              <Input
                id="seasonalEndDate"
                type="date"
                value={seasonalEndDate || ''}
                onChange={(e) => setSeasonalEndDate(e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeasonalForm;
