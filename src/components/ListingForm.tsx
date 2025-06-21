
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Listing } from '@/types/listing';
import { useListingForm } from '@/hooks/useListingForm';
import BasicInformationForm from './forms/BasicInformationForm';
import PricingForm from './forms/PricingForm';
import USPForm from './forms/USPForm';
import StayDetailsForm from './forms/StayDetailsForm';
import MediaForm from './forms/MediaForm';
import SeasonalForm from './forms/SeasonalForm';
import ContactForm from './forms/ContactForm';
import FeaturedForm from './forms/FeaturedForm';
import InformationBlocksForm from './InformationBlocksForm';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

interface ListingFormProps {
  listing?: Listing | null;
  onClose: () => void;
}

const ListingForm = ({ listing, onClose }: ListingFormProps) => {
  const { toast } = useToast();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formHook = useListingForm(listing, onClose);

  // Add loading state to prevent premature rendering
  useEffect(() => {
    // Give the form hook time to initialize properly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Add error boundary-like behavior
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('=== FRONTEND ERROR CAUGHT ===', event.error);
      setHasError(true);
      toast({
        title: 'Form Error',
        description: 'There was an issue loading the form. Please refresh and try again.',
        variant: 'destructive',
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('=== UNHANDLED PROMISE REJECTION ===', event.reason);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [toast]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading form...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (hasError || !formHook) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onClose} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
          <h1 className="text-3xl font-bold text-red-600">Form Error</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Form</h2>
          <p className="text-red-700 mb-4">
            There was an error loading the listing form. This could be due to missing data or a configuration issue.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
            <Button onClick={onClose} variant="ghost">
              Back to Listings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Destructure form hook safely
  const {
    // Basic Information
    title, setTitle,
    description, setDescription,
    location, setLocation,
    country, setCountry,
    type, setType,
    status, setStatus,
    
    // USP
    usp, setUsp,
    
    // Pricing
    originalPrice, setOriginalPrice,
    pricingUnit, setPricingUnit,
    discountedPrice, setDiscountedPrice,
    discountPercentage, setDiscountPercentage,
    discountCodeUrl, setDiscountCodeUrl,
    discountType, setDiscountType,
    discountValue, setDiscountValue,
    
    // Stay Details
    minimumStay, setMinimumStay,
    minimumStayUnit, setMinimumStayUnit,
    capacity, setCapacity,
    rooms, setRooms,
    
    // Media
    amenities, setAmenities,
    images, setImages,
    featuredImage, setFeaturedImage,
    
    // Seasonal
    isSeasonal, setIsSeasonal,
    seasonalStartDate, setSeasonalStartDate,
    seasonalEndDate, setSeasonalEndDate,
    
    // Contact
    websiteUrl, setWebsiteUrl,
    instagramUrl, setInstagramUrl,
    
    // Information Blocks
    workWifiInfo, setWorkWifiInfo,
    communitySocialInfo, setCommunitySocialInfo,
    comfortLivingInfo, setComfortLivingInfo,
    locationSurroundingsInfo, setLocationSurroundingsInfo,
    
    // Featured
    featured, setFeatured,
    
    // Form actions
    isSubmitting,
    handleSubmit,
  } = formHook;

  try {
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
          <BasicInformationForm
            title={title || ''}
            setTitle={setTitle}
            description={description || ''}
            setDescription={setDescription}
            location={location || ''}
            setLocation={setLocation}
            country={country || ''}
            setCountry={setCountry}
            type={type || 'coliving'}
            setType={setType}
            status={status || 'active'}
            setStatus={setStatus}
          />

          <USPForm
            usp={usp || ''}
            setUsp={setUsp}
          />

          <PricingForm
            originalPrice={originalPrice || 0}
            setOriginalPrice={setOriginalPrice}
            pricingUnit={pricingUnit || 'night'}
            setPricingUnit={setPricingUnit}
            discountedPrice={discountedPrice}
            setDiscountedPrice={setDiscountedPrice}
            discountPercentage={discountPercentage}
            setDiscountPercentage={setDiscountPercentage}
            discountCodeUrl={discountCodeUrl}
            setDiscountCodeUrl={setDiscountCodeUrl}
            discountType={discountType}
            setDiscountType={setDiscountType}
            discountValue={discountValue}
            setDiscountValue={setDiscountValue}
          />

          <StayDetailsForm
            minimumStay={minimumStay}
            setMinimumStay={setMinimumStay}
            minimumStayUnit={minimumStayUnit || 'nights'}
            setMinimumStayUnit={setMinimumStayUnit}
            capacity={capacity}
            setCapacity={setCapacity}
            rooms={rooms}
            setRooms={setRooms}
          />

          <FeaturedForm
            featured={featured || false}
            setFeatured={setFeatured}
          />
          
          <InformationBlocksForm
            workWifiInfo={workWifiInfo || ''}
            setWorkWifiInfo={setWorkWifiInfo}
            communitySocialInfo={communitySocialInfo || ''}
            setCommunitySocialInfo={setCommunitySocialInfo}
            comfortLivingInfo={comfortLivingInfo || ''}
            setComfortLivingInfo={setComfortLivingInfo}
            locationSurroundingsInfo={locationSurroundingsInfo || ''}
            setLocationSurroundingsInfo={setLocationSurroundingsInfo}
          />

          <MediaForm
            images={images || []}
            setImages={setImages}
            featuredImage={featuredImage}
            setFeaturedImage={setFeaturedImage}
            amenities={amenities || []}
            setAmenities={setAmenities}
          />

          <SeasonalForm
            isSeasonal={isSeasonal || false}
            setIsSeasonal={setIsSeasonal}
            seasonalStartDate={seasonalStartDate}
            setSeasonalStartDate={setSeasonalStartDate}
            seasonalEndDate={seasonalEndDate}
            setSeasonalEndDate={setSeasonalEndDate}
          />

          <ContactForm
            websiteUrl={websiteUrl}
            setWebsiteUrl={setWebsiteUrl}
            instagramUrl={instagramUrl}
            setInstagramUrl={setInstagramUrl}
          />

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
  } catch (error) {
    console.error('=== RENDER ERROR IN LISTING FORM ===', error);
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onClose} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
          <h1 className="text-3xl font-bold text-red-600">Form Error</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Form</h2>
          <p className="text-red-700 mb-4">
            There was an error loading the listing form. This could be due to missing data or a configuration issue.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
            <Button onClick={onClose} variant="ghost">
              Back to Listings
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default ListingForm;
