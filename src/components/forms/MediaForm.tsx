
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import ImageUpload from '../ImageUpload';

interface MediaFormProps {
  images: string[];
  setImages: (value: string[]) => void;
  featuredImage: string | null;
  setFeaturedImage: (value: string | null) => void;
  amenities: string[];
  setAmenities: (value: string[]) => void;
}

const MediaForm = ({
  images,
  setImages,
  featuredImage,
  setFeaturedImage,
  amenities,
  setAmenities,
}: MediaFormProps) => {
  const handleFeaturedImageUpload = (url: string) => {
    setFeaturedImage(url);
  };

  const handleAdditionalImageUpload = (url: string) => {
    if (url) {
      setImages([...images, url]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addAmenity = (amenity: string) => {
    if (amenity.trim() && !amenities.includes(amenity.trim())) {
      setAmenities([...amenities, amenity.trim()]);
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload
            onImageUploaded={handleFeaturedImageUpload}
            currentImage={featuredImage || undefined}
            label="Featured Image"
          />
          
          <div>
            <Label>Additional Images</Label>
            <ImageUpload
              onImageUploaded={handleAdditionalImageUpload}
              label="Add Additional Image"
            />
            
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Additional ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
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
          <CardTitle className="text-xl font-semibold">Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add amenity"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAmenity(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addAmenity(input.value);
                input.value = '';
              }}
            >
              Add
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

export default MediaForm;
