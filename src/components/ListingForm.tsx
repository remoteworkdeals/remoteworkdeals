import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/listing';
import ImageUpload from './ImageUpload';
import InformationBlocksForm from './InformationBlocksForm';

interface ListingFormProps {
  listing?: Listing | null;
  onClose: () => void;
}

const ListingForm = ({ listing, onClose }: ListingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [type, setType] = useState<'coliving' | 'coworking' | 'apartment' | 'house'>('coliving');
  const [status, setStatus] = useState<'active' | 'inactive' | 'pending'>('active');
  const [originalPrice, setOriginalPrice] = useState(0);
  const [pricingUnit, setPricingUnit] = useState<'night' | 'month'>('night');
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState<number | null>(null);
  const [discountCodeUrl, setDiscountCodeUrl] = useState<string | null>(null);
  const [minimumStay, setMinimumStay] = useState<number | null>(null);
  const [minimumStayUnit, setMinimumStayUnit] = useState<'nights' | 'weeks' | 'months'>('nights');
  const [capacity, setCapacity] = useState<number | null>(null);
  const [rooms, setRooms] = useState<number | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [isSeasonal, setIsSeasonal] = useState(false);
  const [seasonalStartDate, setSeasonalStartDate] = useState<string | null>(null);
  const [seasonalEndDate, setSeasonalEndDate] = useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(null);
  const [instagramUrl, setInstagramUrl] = useState<string | null>(null);
  const [workWifiInfo, setWorkWifiInfo] = useState('');
  const [communitySocialInfo, setCommunitySocialInfo] = useState('');
  const [comfortLivingInfo, setComfortLivingInfo] = useState('');
  const [locationSurroundingsInfo, setLocationSurroundingsInfo] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    if (listing) {
      console.log('Loading listing data:', listing);
      setTitle(listing.title);
      setDescription(listing.description || '');
      setLocation(listing.location);
      setCountry(listing.country);
      setType(listing.type);
      setStatus(listing.status);
      setOriginalPrice(listing.original_price);
      setPricingUnit(listing.pricing_unit as 'night' | 'month');
      setDiscountedPrice(listing.discounted_price || null);
      setDiscountPercentage(listing.discount_percentage || null);
      setDiscountCodeUrl(listing.discount_code_url || null);
      setMinimumStay(listing.minimum_stay || null);
      setMinimumStayUnit(listing.minimum_stay_unit as 'nights' | 'weeks' | 'months' || 'nights');
      setCapacity(listing.capacity || null);
      setRooms(listing.rooms || null);
      setAmenities(listing.amenities || []);
      setImages(listing.images || []);
      setFeaturedImage(listing.featured_image || null);
      setIsSeasonal(listing.is_seasonal || false);
      setSeasonalStartDate(listing.seasonal_start_date || null);
      setSeasonalEndDate(listing.seasonal_end_date || null);
      setWebsiteUrl(listing.website_url || null);
      setInstagramUrl(listing.instagram_url || null);
      setWorkWifiInfo(listing.work_wifi_info || '');
      setCommunitySocialInfo(listing.community_social_info || '');
      setComfortLivingInfo(listing.comfort_living_info || '');
      setLocationSurroundingsInfo(listing.location_surroundings_info || '');
      
      console.log('Information blocks loaded:', {
        workWifiInfo: listing.work_wifi_info,
        communitySocialInfo: listing.community_social_info,
        comfortLivingInfo: listing.comfort_living_info,
        locationSurroundingsInfo: listing.location_surroundings_info
      });
    }
  }, [listing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Current form values:', {
      title,
      description,
      workWifiInfo,
      communitySocialInfo,
      comfortLivingInfo,
      locationSurroundingsInfo
    });
    
    try {
      const listingData = {
        title,
        description: description || null,
        location,
        country,
        type,
        status,
        original_price: originalPrice,
        pricing_unit: pricingUnit,
        discounted_price: discountedPrice || null,
        discount_percentage: discountPercentage || null,
        discount_code_url: discountCodeUrl || null,
        minimum_stay: minimumStay || null,
        minimum_stay_unit: minimumStayUnit,
        capacity: capacity || null,
        rooms: rooms || null,
        amenities: amenities.length > 0 ? amenities : null,
        images: images.length > 0 ? images : null,
        featured_image: featuredImage || null,
        is_seasonal: isSeasonal,
        seasonal_start_date: seasonalStartDate || null,
        seasonal_end_date: seasonalEndDate || null,
        website_url: websiteUrl || null,
        instagram_url: instagramUrl || null,
        work_wifi_info: workWifiInfo.trim() || null,
        community_social_info: communitySocialInfo.trim() || null,
        comfort_living_info: comfortLivingInfo.trim() || null,
        location_surroundings_info: locationSurroundingsInfo.trim() || null,
      };

      console.log('Data being sent to database:', listingData);
      console.log('Information blocks in data:', {
        work_wifi_info: listingData.work_wifi_info,
        community_social_info: listingData.community_social_info,
        comfort_living_info: listingData.comfort_living_info,
        location_surroundings_info: listingData.location_surroundings_info
      });

      let result;
      if (listing) {
        console.log('Updating existing listing with ID:', listing.id);
        result = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', listing.id)
          .select(); // Add select to see what was actually saved
      } else {
        console.log('Creating new listing');
        result = await supabase
          .from('listings')
          .insert(listingData)
          .select(); // Add select to see what was actually saved
      }

      console.log('Database result:', result);

      if (result.error) {
        console.error('Database error:', result.error);
        throw result.error;
      }

      if (result.data) {
        console.log('Successfully saved data:', result.data);
        console.log('Information blocks in saved data:', {
          work_wifi_info: result.data[0]?.work_wifi_info,
          community_social_info: result.data[0]?.community_social_info,
          comfort_living_info: result.data[0]?.comfort_living_info,
          location_surroundings_info: result.data[0]?.location_surroundings_info
        });
      }

      toast({
        title: listing ? 'Listing updated successfully' : 'Listing created successfully',
        description: 'All information has been saved including the information blocks.',
      });
      
      console.log('=== FORM SUBMISSION COMPLETED SUCCESSFULLY ===');
      onClose();
    } catch (error) {
      console.error('=== FORM SUBMISSION ERROR ===');
      console.error('Error details:', error);
      toast({
        title: 'Error saving listing',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeaturedImageUpload = (url: string) => {
    setFeaturedImage(url);
  };

  const handleAdditionalImageUpload = (url: string) => {
    if (url) {
      setImages(prev => [...prev, url]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={onClose} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Listings
        </Button>
        <h1 className="text-3xl font-bold">
          {listing ? 'Edit Listing' : 'Create New Listing'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(value) => setType(value as 'coliving' | 'coworking' | 'apartment' | 'house')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coliving">Coliving</SelectItem>
                    <SelectItem value="coworking">Coworking</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as 'active' | 'inactive' | 'pending')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  value={String(originalPrice)}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pricingUnit">Pricing Unit</Label>
                <Select value={pricingUnit} onValueChange={(value) => setPricingUnit(value as 'night' | 'month')}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountedPrice">Discounted Price (optional)</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  value={discountedPrice !== null ? String(discountedPrice) : ''}
                  onChange={(e) => setDiscountedPrice(e.target.value ? Number(e.target.value) : null)}
                />
              </div>
              <div>
                <Label htmlFor="discountPercentage">Discount Percentage (optional)</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  value={discountPercentage !== null ? String(discountPercentage) : ''}
                  onChange={(e) => setDiscountPercentage(e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="discountCodeUrl">Discount Code URL (optional)</Label>
              <Input
                id="discountCodeUrl"
                type="url"
                value={discountCodeUrl || ''}
                onChange={(e) => setDiscountCodeUrl(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

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
        
        <InformationBlocksForm
          workWifiInfo={workWifiInfo}
          setWorkWifiInfo={setWorkWifiInfo}
          communitySocialInfo={communitySocialInfo}
          setCommunitySocialInfo={setCommunitySocialInfo}
          comfortLivingInfo={comfortLivingInfo}
          setComfortLivingInfo={setComfortLivingInfo}
          locationSurroundingsInfo={locationSurroundingsInfo}
          setLocationSurroundingsInfo={setLocationSurroundingsInfo}
        />

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

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="websiteUrl">Website URL (optional)</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={websiteUrl || ''}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="instagramUrl">Instagram URL (optional)</Label>
              <Input
                id="instagramUrl"
                type="url"
                value={instagramUrl || ''}
                onChange={(e) => setInstagramUrl(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="adventure-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            listing ? 'Update Listing' : 'Create Listing'
          )}
        </Button>
      </form>
    </div>
  );
};

export default ListingForm;
