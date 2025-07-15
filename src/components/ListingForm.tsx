
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Listing } from '@/types/listing';
import { useListingForm } from '@/hooks/useListingForm';
import ErrorBoundary from '@/components/ErrorBoundary';
import BasicInformationForm from './forms/BasicInformationForm';
import PricingForm from './forms/PricingForm';
import USPForm from './forms/USPForm';
import StayDetailsForm from './forms/StayDetailsForm';
import MediaForm from './forms/MediaForm';
import SeasonalForm from './forms/SeasonalForm';
import ContactForm from './forms/ContactForm';
import FeaturedForm from './forms/FeaturedForm';
import InformationBlocksForm from './InformationBlocksForm';
import SuitabilityForm from './forms/SuitabilityForm';

interface ListingFormProps {
  listing?: Listing | null;
  onClose: () => void;
}

const ListingForm = ({ listing, onClose }: ListingFormProps) => {
  console.log('ListingForm rendering with listing:', listing?.id || 'new');
  
  const formData = useListingForm(listing, onClose);

  console.log('Form data initialized:', !!formData);

  if (!formData) {
    console.log('Form data not ready, showing loading...');
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
    <ErrorBoundary>
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

        <form onSubmit={formData.handleSubmit} className="space-y-8">
          <ErrorBoundary fallback={<div className="p-4 bg-yellow-50 rounded">Error in Basic Information form</div>}>
            <BasicInformationForm
              title={formData.title || ''}
              setTitle={formData.setTitle}
              description={formData.description || ''}
              setDescription={formData.setDescription}
              location={formData.location || ''}
              setLocation={formData.setLocation}
              country={formData.country || ''}
              setCountry={formData.setCountry}
              type={formData.type || 'coliving'}
              setType={formData.setType}
              status={formData.status || 'active'}
              setStatus={formData.setStatus}
            />
          </ErrorBoundary>

          <ErrorBoundary fallback={<div className="p-4 bg-yellow-50 rounded">Error in USP form</div>}>
            <USPForm
              usp={formData.usp || ''}
              setUsp={formData.setUsp}
            />
          </ErrorBoundary>

          <ErrorBoundary fallback={<div className="p-4 bg-yellow-50 rounded">Error in Pricing form</div>}>
            <PricingForm
              originalPrice={formData.originalPrice || 0}
              setOriginalPrice={formData.setOriginalPrice}
              pricingUnit={formData.pricingUnit || 'night'}
              setPricingUnit={formData.setPricingUnit}
              discountedPrice={formData.discountedPrice}
              setDiscountedPrice={formData.setDiscountedPrice}
              discountPercentage={formData.discountPercentage}
              setDiscountPercentage={formData.setDiscountPercentage}
              discountType={formData.discountType}
              setDiscountType={formData.setDiscountType}
              discountValue={formData.discountValue}
              setDiscountValue={formData.setDiscountValue}
            />
          </ErrorBoundary>

          <ErrorBoundary fallback={<div className="p-4 bg-yellow-50 rounded">Error in Stay Details form</div>}>
            <StayDetailsForm
              minimumStay={formData.minimumStay}
              setMinimumStay={formData.setMinimumStay}
              minimumStayUnit={formData.minimumStayUnit || 'nights'}
              setMinimumStayUnit={formData.setMinimumStayUnit}
              capacity={formData.capacity}
              setCapacity={formData.setCapacity}
              rooms={formData.rooms}
              setRooms={formData.setRooms}
            />
          </ErrorBoundary>

          <ErrorBoundary fallback={<div className="p-4 bg-yellow-50 rounded">Error in Featured form</div>}>
            <FeaturedForm
              featured={formData.featured || false}
              setFeatured={formData.setFeatured}
            />
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<div className="p-4 bg-yellow-50 rounded">Error in Information Blocks form</div>}>
            <InformationBlocksForm
              workWifiInfo={formData.workWifiInfo || ''}
              setWorkWifiInfo={formData.setWorkWifiInfo}
              communitySocialInfo={formData.communitySocialInfo || ''}
              setCommunitySocialInfo={formData.setCommunitySocialInfo}
              comfortLivingInfo={formData.comfortLivingInfo || ''}
              setComfortLivingInfo={formData.setComfortLivingInfo}
              locationSurroundingsInfo={formData.locationSurroundingsInfo || ''}
              setLocationSurroundingsInfo={formData.setLocationSurroundingsInfo}
            />
          </ErrorBoundary>

          <ErrorBoundary fallback={<div className="p-4 bg-yellow-50 rounded">Error in Media form</div>}>
            <MediaForm
              images={formData.images || []}
              setImages={formData.setImages}
              featuredImage={formData.featuredImage}
              setFeaturedImage={formData.setFeaturedImage}
              amenities={formData.amenities || []}
              setAmenities={formData.setAmenities}
            />
          </ErrorBoundary>

          <ErrorBoundary fallback={<div className="p-4 bg-yellow-50 rounded">Error in Seasonal form</div>}>
            <SeasonalForm
              isSeasonal={formData.isSeasonal || false}
              setIsSeasonal={formData.setIsSeasonal}
              seasonalStartDate={formData.seasonalStartDate}
              setSeasonalStartDate={formData.setSeasonalStartDate}
              seasonalEndDate={formData.seasonalEndDate}
              setSeasonalEndDate={formData.setSeasonalEndDate}
            />
          </ErrorBoundary>

          <ErrorBoundary fallback={<div className="p-4 bg-yellow-50 rounded">Error in Contact form</div>}>
            <ContactForm
              websiteUrl={formData.websiteUrl}
              setWebsiteUrl={formData.setWebsiteUrl}
              instagramUrl={formData.instagramUrl}
              setInstagramUrl={formData.setInstagramUrl}
              discountCodeUrl={formData.discountCodeUrl}
              setDiscountCodeUrl={formData.setDiscountCodeUrl}
            />
          </ErrorBoundary>

          <ErrorBoundary fallback={<div className="p-4 bg-yellow-50 rounded">Error in Suitability form</div>}>
            <SuitabilityForm
              bestFor={formData.bestFor || []}
              setBestFor={formData.setBestFor}
              notSuitableFor={formData.notSuitableFor || []}
              setNotSuitableFor={formData.setNotSuitableFor}
            />
          </ErrorBoundary>

          <Button type="submit" className="adventure-button" disabled={formData.isSubmitting}>
            {formData.isSubmitting ? (
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
    </ErrorBoundary>
  );
};

export default ListingForm;
