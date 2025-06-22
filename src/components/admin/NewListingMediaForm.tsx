
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';

interface NewListingMediaFormProps {
  featuredImage: string;
  setFeaturedImage: (value: string) => void;
  images: string[];
  setImages: (value: string[]) => void;
  amenities: string[];
  setAmenities: (value: string[]) => void;
}

const NewListingMediaForm = ({
  featuredImage,
  setFeaturedImage,
  images,
  setImages,
  amenities,
  setAmenities,
}: NewListingMediaFormProps) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  const addImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {featuredImage && (
              <div className="mt-2">
                <img
                  src={featuredImage}
                  alt="Featured preview"
                  className="w-32 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <Label>Additional Images</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              />
              <Button type="button" onClick={addImage} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Additional ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="e.g., High-speed WiFi, Pool, Gym"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
            />
            <Button type="button" onClick={addAmenity} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {amenity}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeAmenity(index)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default NewListingMediaForm;
