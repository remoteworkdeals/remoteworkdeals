
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

interface ListingFormProps {
  listing?: Listing | null;
  onClose: () => void;
}

const ListingForm = ({ listing, onClose }: ListingFormProps) => {
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
  } = useListingForm(listing, onClose);

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
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          location={location}
          setLocation={setLocation}
          country={country}
          setCountry={setCountry}
          type={type}
          setType={setType}
          status={status}
          setStatus={setStatus}
        />

        <USPForm
          usp={usp}
          setUsp={setUsp}
        />

        <PricingForm
          originalPrice={originalPrice}
          setOriginalPrice={setOriginalPrice}
          pricingUnit={pricingUnit}
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
          minimumStayUnit={minimumStayUnit}
          setMinimumStayUnit={setMinimumStayUnit}
          capacity={capacity}
          setCapacity={setCapacity}
          rooms={rooms}
          setRooms={setRooms}
        />

        <FeaturedForm
          featured={featured}
          setFeatured={setFeatured}
        />
        
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

        <MediaForm
          images={images}
          setImages={setImages}
          featuredImage={featuredImage}
          setFeaturedImage={setFeaturedImage}
          amenities={amenities}
          setAmenities={setAmenities}
        />

        <SeasonalForm
          isSeasonal={isSeasonal}
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
};

export default ListingForm;
