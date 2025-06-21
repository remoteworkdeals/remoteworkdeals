
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StayDetailsFormProps {
  minimumStay: number | null;
  setMinimumStay: (value: number | null) => void;
  minimumStayUnit: 'nights' | 'weeks' | 'months';
  setMinimumStayUnit: (value: 'nights' | 'weeks' | 'months') => void;
  capacity: number | null;
  setCapacity: (value: number | null) => void;
  rooms: number | null;
  setRooms: (value: number | null) => void;
}

const StayDetailsForm = ({
  minimumStay,
  setMinimumStay,
  minimumStayUnit,
  setMinimumStayUnit,
  capacity,
  setCapacity,
  rooms,
  setRooms,
}: StayDetailsFormProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Minimum Stay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minimumStay">Minimum Stay (optional)</Label>
              <Input
                id="minimumStay"
                type="number"
                value={minimumStay !== null ? String(minimumStay) : ''}
                onChange={(e) => setMinimumStay(e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div>
              <Label htmlFor="minimumStayUnit">Minimum Stay Unit</Label>
              <Select value={minimumStayUnit} onValueChange={(value) => setMinimumStayUnit(value as 'nights' | 'weeks' | 'months')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nights">Nights</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Capacity & Rooms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">Capacity (optional)</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity !== null ? String(capacity) : ''}
                onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div>
              <Label htmlFor="rooms">Rooms (optional)</Label>
              <Input
                id="rooms"
                type="number"
                value={rooms !== null ? String(rooms) : ''}
                onChange={(e) => setRooms(e.target.value ? Number(e.target.value) : null)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StayDetailsForm;
