
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface NewListingMediaFormProps {
  featuredImage: string;
  setFeaturedImage: (value: string) => void;
  images: string[];
  setImages: (value: string[]) => void;
  amenities: string[];
  setAmenities: (value: string[]) => void;
  listingTitle?: string;
}

const NewListingMediaForm = ({
  featuredImage,
  setFeaturedImage,
  images,
  setImages,
  amenities,
  setAmenities,
  listingTitle = '',
}: NewListingMediaFormProps) => {
  const [newAmenity, setNewAmenity] = useState('');

  const generateAltText = (imageType: 'featured' | 'additional', index?: number) => {
    const baseTitle = listingTitle || 'Coliving space';
    if (imageType === 'featured') {
      return `${baseTitle} - Featured image`;
    }
    return `${baseTitle} - Interior view ${index ? index + 1 : ''}`;
  };

  const handleFeaturedImageUpload = (url: string) => {
    setFeaturedImage(url);
  };

  const handleAdditionalImageUpload = (url: string) => {
    if (url && !images.includes(url)) {
      setImages([...images, url]);
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
        <CardContent className="space-y-6">
          <div>
            <Label>Featured Image</Label>
            <p className="text-sm text-gray-600 mb-2">
              This will be the main image displayed for your listing
            </p>
            <ImageUpload
              onImageUploaded={handleFeaturedImageUpload}
              currentImage={featuredImage}
              label=""
              className="w-full"
            />
            {featuredImage && (
              <p className="text-xs text-gray-500 mt-1">
                Alt text: {generateAltText('featured')}
              </p>
            )}
          </div>

          <div>
            <Label>Additional Images</Label>
            <p className="text-sm text-gray-600 mb-2">
              Add more photos to showcase different areas of your space
            </p>
            <ImageUpload
              onImageUploaded={handleAdditionalImageUpload}
              label="Add Another Image"
              className="w-full"
            />
            
            {images.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Uploaded Images ({images.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video rounded-lg bg-gray-100 overflow-hidden">
                        <img
                          src={image}
                          alt={generateAltText('additional', index)}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {generateAltText('additional', index)}
                      </p>
                    </div>
                  ))}
                </div>
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
