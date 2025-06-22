
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, Users, Heart, MapPin } from 'lucide-react';

interface NewListingDetailsFormProps {
  minimumStay: number;
  setMinimumStay: (value: number) => void;
  minimumStayUnit: 'nights' | 'weeks' | 'months';
  setMinimumStayUnit: (value: 'nights' | 'weeks' | 'months') => void;
  capacity: number;
  setCapacity: (value: number) => void;
  rooms: number;
  setRooms: (value: number) => void;
  workWifiInfo: string;
  setWorkWifiInfo: (value: string) => void;
  communitySocialInfo: string;
  setCommunitySocialInfo: (value: string) => void;
  comfortLivingInfo: string;
  setComfortLivingInfo: (value: string) => void;
  locationSurroundingsInfo: string;
  setLocationSurroundingsInfo: (value: string) => void;
}

const NewListingDetailsForm = ({
  minimumStay,
  setMinimumStay,
  minimumStayUnit,
  setMinimumStayUnit,
  capacity,
  setCapacity,
  rooms,
  setRooms,
  workWifiInfo,
  setWorkWifiInfo,
  communitySocialInfo,
  setCommunitySocialInfo,
  comfortLivingInfo,
  setComfortLivingInfo,
  locationSurroundingsInfo,
  setLocationSurroundingsInfo,
}: NewListingDetailsFormProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Stay Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minimumStay">Minimum Stay</Label>
              <Input
                id="minimumStay"
                type="number"
                value={minimumStay}
                onChange={(e) => setMinimumStay(Number(e.target.value) || 1)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="minimumStayUnit">Minimum Stay Unit</Label>
              <Select value={minimumStayUnit} onValueChange={(value: 'nights' | 'weeks' | 'months') => setMinimumStayUnit(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nights">Nights</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">Capacity (people)</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value) || 1)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="rooms">Number of Rooms</Label>
              <Input
                id="rooms"
                type="number"
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value) || 1)}
                min="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Information Blocks</CardTitle>
          <p className="text-sm text-gray-600">Add detailed information about different aspects</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center mb-2">
              <Wifi className="w-5 h-5 text-adventure-orange mr-2" />
              <Label className="text-base font-medium">Work & WiFi</Label>
            </div>
            <Textarea
              value={workWifiInfo}
              onChange={(e) => setWorkWifiInfo(e.target.value)}
              placeholder="Describe the work environment, WiFi quality, dedicated workspaces..."
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-adventure-orange mr-2" />
              <Label className="text-base font-medium">Community & Social</Label>
            </div>
            <Textarea
              value={communitySocialInfo}
              onChange={(e) => setCommunitySocialInfo(e.target.value)}
              placeholder="Describe the community atmosphere, social activities, networking opportunities..."
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Heart className="w-5 h-5 text-adventure-orange mr-2" />
              <Label className="text-base font-medium">Comfort & Living</Label>
            </div>
            <Textarea
              value={comfortLivingInfo}
              onChange={(e) => setComfortLivingInfo(e.target.value)}
              placeholder="Describe living comfort, facilities, cleanliness, room quality..."
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-adventure-orange mr-2" />
              <Label className="text-base font-medium">Location & Surroundings</Label>
            </div>
            <Textarea
              value={locationSurroundingsInfo}
              onChange={(e) => setLocationSurroundingsInfo(e.target.value)}
              placeholder="Describe the location, nearby attractions, safety, transportation..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default NewListingDetailsForm;
