import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import NewListingBasicForm from '@/components/admin/NewListingBasicForm';
import NewListingPricingForm from '@/components/admin/NewListingPricingForm';
import NewListingMediaForm from '@/components/admin/NewListingMediaForm';
import NewListingDetailsForm from '@/components/admin/NewListingDetailsForm';
import NewListingContactForm from '@/components/admin/NewListingContactForm';
import SeasonalForm from '@/components/forms/SeasonalForm';

const AdminAddListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Basic Information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [usp, setUsp] = useState('');
  
  // Pricing
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed_amount'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [pricingUnit, setPricingUnit] = useState<'night' | 'month'>('night');
  
  // Details
  const [minimumStay, setMinimumStay] = useState(1);
  const [minimumStayUnit, setMinimumStayUnit] = useState<'nights' | 'weeks' | 'months'>('nights');
  const [capacity, setCapacity] = useState(1);
  const [rooms, setRooms] = useState(1);
  
  // Information Blocks
  const [workWifiInfo, setWorkWifiInfo] = useState('');
  const [communitySocialInfo, setCommunitySocialInfo] = useState('');
  const [comfortLivingInfo, setComfortLivingInfo] = useState('');
  const [locationSurroundingsInfo, setLocationSurroundingsInfo] = useState('');
  
  // Media
  const [featuredImage, setFeaturedImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  
  // Seasonal
  const [isSeasonal, setIsSeasonal] = useState(false);
  const [seasonalStartDate, setSeasonalStartDate] = useState<string | null>(null);
  const [seasonalEndDate, setSeasonalEndDate] = useState<string | null>(null);
  
  // Contact
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [discountCodeUrl, setDiscountCodeUrl] = useState('');

  // Calculate discounted price
  const calculateDiscountedPrice = () => {
    if (discountValue <= 0) return originalPrice;
    
    if (discountType === 'percentage') {
      return Math.round(originalPrice * (1 - discountValue / 100));
    } else {
      return Math.max(0, originalPrice - discountValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create listings.',
        variant: 'destructive',
      });
      return;
    }

    if (!title.trim() || !location.trim() || !country.trim()) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in title, location, and country.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const discountedPrice = calculateDiscountedPrice();
      
      const listingData = {
        title: title.trim(),
        description: description.trim() || null,
        location: location.trim(),
        country: country.trim(),
        usp: usp.trim() || null,
        type: 'coliving' as const,
        status: 'active' as const,
        original_price: originalPrice,
        pricing_unit: pricingUnit,
        discount_type: discountValue > 0 ? discountType : null,
        discount_value: discountValue > 0 ? discountValue : null,
        discounted_price: discountValue > 0 ? discountedPrice : null,
        minimum_stay: minimumStay,
        minimum_stay_unit: minimumStayUnit,
        capacity: capacity,
        rooms: rooms,
        work_wifi_info: workWifiInfo.trim() || null,
        community_social_info: communitySocialInfo.trim() || null,
        comfort_living_info: comfortLivingInfo.trim() || null,
        location_surroundings_info: locationSurroundingsInfo.trim() || null,
        featured_image: featuredImage || null,
        images: images.length > 0 ? images : null,
        amenities: amenities.length > 0 ? amenities : null,
        is_seasonal: isSeasonal,
        seasonal_start_date: seasonalStartDate,
        seasonal_end_date: seasonalEndDate,
        website_url: websiteUrl.trim() || null,
        instagram_url: instagramUrl.trim() || null,
        discount_code_url: discountCodeUrl.trim() || null,
        featured: false,
        created_by: user.id,
      };

      console.log('Creating new listing with data:', listingData);

      const { data, error } = await supabase
        .from('listings')
        .insert(listingData)
        .select('*')
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Listing created successfully:', data);

      toast({
        title: 'Listing created successfully!',
        description: 'Your new listing is now live on the website.',
      });

      // Redirect to admin listings page
      navigate('/admin/listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      
      toast({
        title: 'Error creating listing',
        description: error instanceof Error ? error.message : 'Failed to create listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate('/admin/listings')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Listings
        </Button>
        <h1 className="text-3xl font-bold">Add New Listing</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <NewListingBasicForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          location={location}
          setLocation={setLocation}
          country={country}
          setCountry={setCountry}
          usp={usp}
          setUsp={setUsp}
        />

        <NewListingPricingForm
          originalPrice={originalPrice}
          setOriginalPrice={setOriginalPrice}
          discountType={discountType}
          setDiscountType={setDiscountType}
          discountValue={discountValue}
          setDiscountValue={setDiscountValue}
          pricingUnit={pricingUnit}
          setPricingUnit={setPricingUnit}
          discountedPrice={calculateDiscountedPrice()}
        />

        <NewListingDetailsForm
          minimumStay={minimumStay}
          setMinimumStay={setMinimumStay}
          minimumStayUnit={minimumStayUnit}
          setMinimumStayUnit={setMinimumStayUnit}
          capacity={capacity}
          setCapacity={setCapacity}
          rooms={rooms}
          setRooms={setRooms}
          workWifiInfo={workWifiInfo}
          setWorkWifiInfo={setWorkWifiInfo}
          communitySocialInfo={communitySocialInfo}
          setCommunitySocialInfo={setCommunitySocialInfo}
          comfortLivingInfo={comfortLivingInfo}
          setComfortLivingInfo={setComfortLivingInfo}
          locationSurroundingsInfo={locationSurroundingsInfo}
          setLocationSurroundingsInfo={setLocationSurroundingsInfo}
        />

        <SeasonalForm
          isSeasonal={isSeasonal}
          setIsSeasonal={setIsSeasonal}
          seasonalStartDate={seasonalStartDate}
          setSeasonalStartDate={setSeasonalStartDate}
          seasonalEndDate={seasonalEndDate}
          setSeasonalEndDate={setSeasonalEndDate}
        />

        <NewListingMediaForm
          featuredImage={featuredImage}
          setFeaturedImage={setFeaturedImage}
          images={images}
          setImages={setImages}
          amenities={amenities}
          setAmenities={setAmenities}
          listingTitle={title}
        />

        <NewListingContactForm
          websiteUrl={websiteUrl}
          setWebsiteUrl={setWebsiteUrl}
          instagramUrl={instagramUrl}
          setInstagramUrl={setInstagramUrl}
          discountCodeUrl={discountCodeUrl}
          setDiscountCodeUrl={setDiscountCodeUrl}
        />

        <div className="flex justify-end">
          <Button type="submit" className="adventure-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Listing...
              </>
            ) : (
              'Create Listing'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddListing;
