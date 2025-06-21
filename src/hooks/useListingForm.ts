
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/listing';

export const useListingForm = (listing?: Listing | null, onClose?: () => void) => {
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
      console.log('=== LOADING LISTING DATA ===');
      console.log('Full listing object:', listing);
      console.log('Information blocks from listing:', {
        work_wifi_info: listing.work_wifi_info,
        community_social_info: listing.community_social_info,
        comfort_living_info: listing.comfort_living_info,
        location_surroundings_info: listing.location_surroundings_info
      });

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
      
      console.log('Form state after loading:', {
        workWifiInfo: listing.work_wifi_info || '',
        communitySocialInfo: listing.community_social_info || '',
        comfortLivingInfo: listing.comfort_living_info || '',
        locationSurroundingsInfo: listing.location_surroundings_info || ''
      });
      console.log('=== LISTING DATA LOADED ===');
    }
  }, [listing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Current form state at submission:', {
      title,
      description,
      workWifiInfo,
      communitySocialInfo,
      comfortLivingInfo,
      locationSurroundingsInfo,
    });
    
    try {
      const informationBlocksData = {
        work_wifi_info: workWifiInfo.trim() || null,
        community_social_info: communitySocialInfo.trim() || null,
        comfort_living_info: comfortLivingInfo.trim() || null,
        location_surroundings_info: locationSurroundingsInfo.trim() || null,
      };

      console.log('Information blocks data prepared:', informationBlocksData);

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
        ...informationBlocksData
      };

      console.log('Complete data being sent to database:', listingData);

      let result;
      let operationSuccess = false;
      let savedData = null;
      
      if (listing) {
        console.log('=== UPDATING EXISTING LISTING ===');
        console.log('Updating listing with ID:', listing.id);
        
        // For updates, we use .select() to return the updated data
        result = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', listing.id)
          .select('*');
          
        console.log('Update result:', result);
        
        // For updates with .select(), we expect data to be returned
        if (!result.error && result.data && result.data.length > 0) {
          operationSuccess = true;
          savedData = result.data[0];
          console.log('Update successful, returned data:', savedData);
        } else if (result.error) {
          console.error('Update failed with error:', result.error);
          throw result.error;
        } else {
          console.error('Update failed: No data returned, possibly no matching record or no changes made');
          throw new Error('Update operation did not affect any records. The listing may not exist or no changes were detected.');
        }
        
      } else {
        console.log('=== CREATING NEW LISTING ===');
        
        result = await supabase
          .from('listings')
          .insert(listingData)
          .select('*');
          
        console.log('Insert result:', result);
        
        // For inserts, we expect data to be returned
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
        console.log('Final saved data:', savedData);
        console.log('Information blocks in saved data:', {
          work_wifi_info: savedData.work_wifi_info,
          community_social_info: savedData.community_social_info,
          comfort_living_info: savedData.comfort_living_info,
          location_surroundings_info: savedData.location_surroundings_info
        });

        toast({
          title: listing ? 'Listing updated successfully' : 'Listing created successfully',
          description: 'All information has been saved including the information blocks.',
        });
        
        console.log('=== FORM SUBMISSION COMPLETED SUCCESSFULLY ===');
        
        // Close the form and trigger a refetch
        if (onClose) {
          console.log('Calling onClose to trigger refetch');
          onClose();
        }
      } else {
        console.error('=== OPERATION FAILED ===');
        throw new Error('Database operation failed - no confirmation of success');
      }
    } catch (error) {
      console.error('=== FORM SUBMISSION ERROR ===');
      console.error('Error details:', error);
      
      let errorMessage = 'Please try again. Check browser console for details.';
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

  return {
    // Form state
    title, setTitle,
    description, setDescription,
    location, setLocation,
    country, setCountry,
    type, setType,
    status, setStatus,
    originalPrice, setOriginalPrice,
    pricingUnit, setPricingUnit,
    discountedPrice, setDiscountedPrice,
    discountPercentage, setDiscountPercentage,
    discountCodeUrl, setDiscountCodeUrl,
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
    
    // Form actions
    isSubmitting,
    handleSubmit,
  };
};
