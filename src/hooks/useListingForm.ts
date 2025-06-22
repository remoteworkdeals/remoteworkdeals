
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/listing';
import { useAuth } from '@/contexts/AuthContext';

export const useListingForm = (listing?: Listing | null, onClose?: () => void) => {
  console.log('useListingForm initializing with listing:', listing?.id || 'new');
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [type, setType] = useState<'coliving' | 'coworking' | 'apartment' | 'house'>('coliving');
  const [status, setStatus] = useState<'active' | 'inactive' | 'pending'>('active');
  const [usp, setUsp] = useState('');
  const [originalPrice, setOriginalPrice] = useState(0);
  const [pricingUnit, setPricingUnit] = useState<'night' | 'month'>('night');
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState<number | null>(null);
  const [discountCodeUrl, setDiscountCodeUrl] = useState<string | null>(null);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed_amount' | null>(null);
  const [discountValue, setDiscountValue] = useState<number | null>(null);
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
  const [featured, setFeatured] = useState(false);

  // Load listing data if editing
  useEffect(() => {
    if (listing) {
      console.log('Loading listing data for edit:', listing.id);
      
      setTitle(listing.title || '');
      setDescription(listing.description || '');
      setLocation(listing.location || '');
      setCountry(listing.country || '');
      setType(listing.type || 'coliving');
      setStatus(listing.status || 'active');
      setUsp(listing.usp || '');
      setOriginalPrice(listing.original_price || 0);
      setPricingUnit((listing.pricing_unit as 'night' | 'month') || 'night');
      setDiscountedPrice(listing.discounted_price || null);
      setDiscountPercentage(listing.discount_percentage || null);
      setDiscountCodeUrl(listing.discount_code_url || null);
      setDiscountType((listing.discount_type as 'percentage' | 'fixed_amount') || null);
      setDiscountValue(listing.discount_value ? Number(listing.discount_value) : null);
      setMinimumStay(listing.minimum_stay || null);
      setMinimumStayUnit((listing.minimum_stay_unit as 'nights' | 'weeks' | 'months') || 'nights');
      setCapacity(listing.capacity || null);
      setRooms(listing.rooms || null);
      setAmenities(Array.isArray(listing.amenities) ? listing.amenities : []);
      setImages(Array.isArray(listing.images) ? listing.images : []);
      setFeaturedImage(listing.featured_image || null);
      setIsSeasonal(listing.is_seasonal || false);
      setSeasonalStartDate(listing.seasonal_start_date || null);
      setSeasonalEndDate(listing.seasonal_end_date || null);
      setWebsiteUrl(listing.website_url || null);
      setInstagramUrl(listing.instagram_url || null);
      setFeatured(listing.featured || false);
      setWorkWifiInfo(listing.work_wifi_info || '');
      setCommunitySocialInfo(listing.community_social_info || '');
      setComfortLivingInfo(listing.comfort_living_info || '');
      setLocationSurroundingsInfo(listing.location_surroundings_info || '');
    } else {
      console.log('Initializing new listing form');
      // Set reasonable defaults for new listings
      setOriginalPrice(0);
      setPricingUnit('night');
      setDiscountType(null);
      setDiscountValue(null);
      setDiscountedPrice(null);
      setDiscountPercentage(null);
    }
  }, [listing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('Form submission started');
    
    if (!user?.id) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to save listings.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const listingData = {
        title: title || '',
        description: description?.trim() || null,
        location: location || '',
        country: country || '',
        type: type || 'coliving',
        status: status || 'active',
        usp: usp?.trim() || null,
        original_price: Math.max(0, originalPrice || 0),
        pricing_unit: pricingUnit || 'night',
        discounted_price: discountedPrice && discountedPrice > 0 ? discountedPrice : null,
        discount_percentage: discountPercentage && discountPercentage > 0 ? discountPercentage : null,
        discount_code_url: discountCodeUrl?.trim() || null,
        discount_type: discountType || null,
        discount_value: discountValue && discountValue > 0 ? discountValue : null,
        minimum_stay: minimumStay && minimumStay > 0 ? minimumStay : null,
        minimum_stay_unit: minimumStayUnit || 'nights',
        capacity: capacity && capacity > 0 ? capacity : null,
        rooms: rooms && rooms > 0 ? rooms : null,
        amenities: amenities.length > 0 ? amenities : null,
        images: images.length > 0 ? images : null,
        featured_image: featuredImage?.trim() || null,
        is_seasonal: isSeasonal || false,
        seasonal_start_date: seasonalStartDate,
        seasonal_end_date: seasonalEndDate,
        website_url: websiteUrl?.trim() || null,
        instagram_url: instagramUrl?.trim() || null,
        featured: featured || false,
        created_by: user.id,
        work_wifi_info: workWifiInfo?.trim() || null,
        community_social_info: communitySocialInfo?.trim() || null,
        comfort_living_info: comfortLivingInfo?.trim() || null,
        location_surroundings_info: locationSurroundingsInfo?.trim() || null,
      };

      console.log('Saving listing data:', listingData);

      let result;
      
      if (listing) {
        console.log('Updating existing listing:', listing.id);
        result = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', listing.id)
          .select('*');
      } else {
        console.log('Creating new listing');
        result = await supabase
          .from('listings')
          .insert(listingData)
          .select('*');
      }

      if (result.error) {
        console.error('Database error:', result.error);
        throw result.error;
      }

      if (!result.data || result.data.length === 0) {
        throw new Error('No data returned from database operation');
      }

      console.log('Operation successful:', result.data[0]);

      toast({
        title: listing ? 'Listing updated successfully!' : 'Listing created successfully!',
        description: 'All information has been saved.',
      });
      
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      let errorMessage = 'Failed to save listing. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error saving listing',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log('useListingForm returning data, all state initialized');
  
  return {
    title, setTitle,
    description, setDescription,
    location, setLocation,
    country, setCountry,
    type, setType,
    status, setStatus,
    usp, setUsp,
    originalPrice, setOriginalPrice,
    pricingUnit, setPricingUnit,
    discountedPrice, setDiscountedPrice,
    discountPercentage, setDiscountPercentage,
    discountCodeUrl, setDiscountCodeUrl,
    discountType, setDiscountType,
    discountValue, setDiscountValue,
    minimumStay, setMinimumStay,
    minimumStayUnit, setMinimumStayUnit,
    capacity, setCapacity,
    rooms, setRooms,
    amenities, setAmenities,
    images, setImages,
    featuredImage, setFeaturedImage,
    isSeasonal, setIsSeasonal,
    seasonalStartDate, setSeasonalStartDate,
    seasonalEndDate, setSeasonalEndDate,
    websiteUrl, setWebsiteUrl,
    instagramUrl, setInstagramUrl,
    workWifiInfo, setWorkWifiInfo,
    communitySocialInfo, setCommunitySocialInfo,
    comfortLivingInfo, setComfortLivingInfo,
    locationSurroundingsInfo, setLocationSurroundingsInfo,
    featured, setFeatured,
    isSubmitting,
    handleSubmit,
  };
};
