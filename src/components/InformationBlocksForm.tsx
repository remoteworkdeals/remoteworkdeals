
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, Users, Heart, MapPin } from 'lucide-react';

interface InformationBlocksFormProps {
  workWifiInfo: string;
  setWorkWifiInfo: (value: string) => void;
  communitySocialInfo: string;
  setCommunitySocialInfo: (value: string) => void;
  comfortLivingInfo: string;
  setComfortLivingInfo: (value: string) => void;
  locationSurroundingsInfo: string;
  setLocationSurroundingsInfo: (value: string) => void;
}

const InformationBlocksForm = ({
  workWifiInfo,
  setWorkWifiInfo,
  communitySocialInfo,
  setCommunitySocialInfo,
  comfortLivingInfo,
  setComfortLivingInfo,
  locationSurroundingsInfo,
  setLocationSurroundingsInfo,
}: InformationBlocksFormProps) => {
  const blocks = [
    {
      title: 'Work & WiFi',
      value: workWifiInfo,
      setValue: setWorkWifiInfo,
      icon: <Wifi className="w-5 h-5 text-adventure-orange" />,
      placeholder: 'Describe the work environment, WiFi quality, dedicated workspaces, etc.'
    },
    {
      title: 'Community & Social',
      value: communitySocialInfo,
      setValue: setCommunitySocialInfo,
      icon: <Users className="w-5 h-5 text-adventure-orange" />,
      placeholder: 'Describe the community atmosphere, social activities, networking opportunities, etc.'
    },
    {
      title: 'Comfort & Living',
      value: comfortLivingInfo,
      setValue: setComfortLivingInfo,
      icon: <Heart className="w-5 h-5 text-adventure-orange" />,
      placeholder: 'Describe living comfort, facilities, cleanliness, room quality, etc.'
    },
    {
      title: 'Location & Surroundings',
      value: locationSurroundingsInfo,
      setValue: setLocationSurroundingsInfo,
      icon: <MapPin className="w-5 h-5 text-adventure-orange" />,
      placeholder: 'Describe the location, nearby attractions, safety, transportation, etc.'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-forest-green">Information Blocks</CardTitle>
        <p className="text-sm text-gray-600">
          Add detailed information about different aspects of this coliving space
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {blocks.map((block, index) => (
          <div key={index}>
            <div className="flex items-center mb-2">
              {block.icon}
              <Label className="text-base font-medium ml-2">{block.title}</Label>
            </div>
            <Textarea
              value={block.value}
              onChange={(e) => block.setValue(e.target.value)}
              placeholder={block.placeholder}
              className="min-h-[120px]"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default InformationBlocksForm;
