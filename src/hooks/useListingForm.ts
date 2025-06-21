import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/listing';
import { useAuth } from '@/contexts/AuthContext';

export const useListingForm = (listing?: Listing | null, onClose?: () => void) => {
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

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (listing) {
      console.log('=== LOADING LISTING DATA ===');
      console.log('Full listing object:', listing);

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
      setDiscountType(listing.discount_type || null);
      setDiscountValue(listing.discount_value || null);
      setMinimumStay(listing.minimum_stay || null);
      setMinimumStayUnit((listing.minimum_stay_unit as 'nights' | 'weeks' | 'months') || 'nights');
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
      setFeatured(listing.featured || false);
      
      setWorkWifiInfo(listing.work_wifi_info || '');
      setCommunitySocialInfo(listing.community_social_info || '');
      setComfortLivingInfo(listing.comfort_living_info || '');
      setLocationSurroundingsInfo(listing.location_surroundings_info || '');
      
      console.log('=== LISTING DATA LOADED ===');
    }
  }, [listing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Current user:', user?.id);
    console.log('Is editing existing listing:', !!listing);
    
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
      const informationBlocksData = {
        work_wifi_info: workWifiInfo.trim() || null,
        community_social_info: communitySocialInfo.trim() || null,
        comfort_living_info: comfortLivingInfo.trim() || null,
        location_surroundings_info: locationSurroundingsInfo.trim() || null,
      };

      const listingData = {
        title,
        description: description || null,
        location,
        country,
        type,
        status,
        usp: usp.trim() || null,
        original_price: originalPrice,
        pricing_unit: pricingUnit,
        discounted_price: discountedPrice || null,
        discount_percentage: discountPercentage || null,
        discount_code_url: discountCodeUrl || null,
        discount_type: discountType || null,
        discount_value: discountValue || null,
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
        featured: featured,
        created_by: user.id,
        ...informationBlocksData
      };

      console.log('Complete data being sent to database:', listingData);

      let result;
      let operationSuccess = false;
      let savedData = null;
      
      if (listing) {
        console.log('=== UPDATING EXISTING LISTING ===');
        console.log('Updating listing with ID:', listing.id);
        
        result = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', listing.id)
          .select('*');
          
        console.log('Update result:', result);
        
        if (!result.error && result.data && result.data.length > 0) {
          operationSuccess = true;
          savedData = result.data[0];
          console.log('Update successful, returned data:', savedData);
        } else if (result.error) {
          console.error('Update failed with error:', result.error);
          throw result.error;
        } else {
          console.error('Update failed: No data returned');
          throw new Error('Update operation did not affect any records. Please check your permissions or try refreshing the page.');
        }
        
      } else {
        console.log('=== CREATING NEW LISTING ===');
        
        result = await supabase
          .from('listings')
          .insert(listingData)
          .select('*');
          
        console.log('Insert result:', result);
        
        if (!result.error && result.data && result.data.length > 0) {
          operationSuccess = true;
          savedData = result.data[0];
          console.log('Insert successful, returned data:', savedData);
        } else if (result.error) {
          console.error('Insert failed with error:', result.error);
          throw result.error;
        } else {
          console.error('Insert failed: No data returned');
          throw new Error('Insert operation failed to return the created record.');
        }
      }

      if (operationSuccess && savedData) {
        console.log('=== DATABASE OPERATION SUCCESSFUL ===');

        toast({
          title: listing ? 'Listing updated successfully!' : 'Listing created successfully!',
          description: 'All information has been saved. Changes are now live.',
        });
        
        console.log('=== FORM SUBMISSION COMPLETED SUCCESSFULLY ===');
        
        if (onClose) {
          console.log('Calling onClose to trigger refetch');
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      } else {
        console.error('=== OPERATION FAILED ===');
        throw new Error('Database operation failed - no confirmation of success');
      }
    } catch (error) {
      console.error('=== FORM SUBMISSION ERROR ===');
      console.error('Error details:', error);
      
      let errorMessage = 'Failed to save listing. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('permission') || error.message.includes('policy')) {
          errorMessage = 'Permission denied. Please make sure you have the right permissions to edit this listing.';
        } else {
          errorMessage = error.message;
        }
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

  return {
    // Form state
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
    
    // Form actions
    isSubmitting,
    handleSubmit,
  };
};
