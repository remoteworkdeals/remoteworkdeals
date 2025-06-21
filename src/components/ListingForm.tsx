
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
import { useState, useEffect } from 'react';

interface ListingFormProps {
  listing?: Listing | null;
  onClose: () => void;
}

// Error Boundary Component
const ErrorFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => (
  <div className="max-w-4xl mx-auto p-8">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
      <p className="text-red-600 mb-4">
        There was an error loading the listing form. Please try again.
      </p>
      <div className="flex gap-2">
        <Button onClick={resetError} variant="outline">
          Try Again
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
      </div>
      <details className="mt-4">
        <summary className="text-sm text-red-600 cursor-pointer">Error details</summary>
        <pre className="text-xs text-red-500 mt-2 bg-red-100 p-2 rounded overflow-auto">
          {error.message}
        </pre>
      </details>
    </div>
  </div>
);

const ListingForm = ({ listing, onClose }: ListingFormProps) => {
  const [error, setError] = useState<Error | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);

  // Reset error state when listing changes
  useEffect(() => {
    setError(null);
    setIsFormReady(false);
    
    // Small delay to ensure form state is properly initialized
    const timer = setTimeout(() => {
      setIsFormReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [listing]);

  // Error boundary logic
  if (error) {
    return <ErrorFallback error={error} resetError={() => setError(null)} />;
  }

  try {
    const hookResult = useListingForm(listing, onClose);
    
    // Verify hook returned valid data
    if (!hookResult) {
      throw new Error('useListingForm hook failed to initialize');
    }

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
    } = hookResult;

    // Show loading state until form is ready
    if (!isFormReady) {
      return (
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading form...</p>
            </div>
          </div>
        </div>
      );
    }

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
  } catch (err) {
    // Catch any rendering errors and show fallback
    console.error('ListingForm render error:', err);
    return (
      <ErrorFallback 
        error={err instanceof Error ? err : new Error('Unknown error occurred')} 
        resetError={() => setError(null)} 
      />
    );
  }
};

export default ListingForm;
