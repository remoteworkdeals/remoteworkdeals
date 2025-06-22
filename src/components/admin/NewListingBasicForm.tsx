
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NewListingBasicFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  usp: string;
  setUsp: (value: string) => void;
}

const NewListingBasicForm = ({
  title,
  setTitle,
  description,
  setDescription,
  location,
  setLocation,
  country,
  setCountry,
  usp,
  setUsp,
}: NewListingBasicFormProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Casa Basilico - Luxury Coliving in Lisbon"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the coliving space, its atmosphere, and what makes it special..."
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Lisbon"
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., Portugal"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unique Selling Point</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="usp">USP (Short tagline)</Label>
            <Input
              id="usp"
              value={usp}
              onChange={(e) => setUsp(e.target.value)}
              placeholder="e.g., Eco Retreat with Mountain Views"
              maxLength={50}
            />
            <p className="text-sm text-gray-500 mt-1">
              {50 - usp.length} characters remaining
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default NewListingBasicForm;
