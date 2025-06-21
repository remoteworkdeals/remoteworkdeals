
import { useState } from 'react';
import { MapPin, Users, Wifi, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useListingData } from '@/hooks/useListingData';
import ReviewsSection from './ReviewsSection';
import ReviewForm from './ReviewForm';
import LinkedBlogPosts from './LinkedBlogPosts';
import CommunityPromotion from './CommunityPromotion';
import { ListingHeader } from './listing/ListingHeader';
import { BookingCard } from './listing/BookingCard';
import { RatingBars } from './listing/RatingBars';

interface ListingDetailProps {
  listingId: number;
}

// Helper function to convert text to bulleted list
const formatTextAsBullets = (text: string) => {
  if (!text) return null;
  
  // Split by newlines, periods, or bullet points and filter out empty strings
  const sentences = text
    .split(/[.\n•]/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);
  
  if (sentences.length <= 1) {
    return <p className="text-gray-600 leading-relaxed">{text}</p>;
  }
  
  return (
    <ul className="text-gray-600 leading-relaxed space-y-2">
      {sentences.map((sentence, index) => (
        <li key={index} className="flex items-start">
          <div className="w-2 h-2 bg-adventure-orange rounded-full mr-3 mt-2 flex-shrink-0" />
          <span>{sentence}</span>
        </li>
      ))}
    </ul>
  );
};

/**
 * Main listing detail page component
 * Displays comprehensive listing information including images, details, ratings, and reviews
 */
const ListingDetail = ({ listingId }: ListingDetailProps) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const { listing, reviews, loading, error, averageRatings, submitReview } = useListingData(listingId);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adventure-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Listing Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The listing you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => navigate('/coliving-deals')} className="adventure-button">
            Browse All Listings
          </Button>
        </div>
      </div>
    );
  }

  // Prepare image gallery
  const displayImages = [];
  if (listing.featured_image) {
    displayImages.push(listing.featured_image);
  }
  if (listing.images) {
    displayImages.push(...listing.images.filter(img => img !== listing.featured_image));
  }
  const images = displayImages.length > 0 ? displayImages : [];
  const amenities = listing.amenities || [];

  // Information blocks for "What to expect" section
  const informationBlocks = [
    {
      title: 'Work & WiFi',
      content: listing.work_wifi_info,
      icon: <Wifi className="w-6 h-6 text-adventure-orange" />
    },
    {
      title: 'Community & Social',
      content: listing.community_social_info,
      icon: <Users className="w-6 h-6 text-adventure-orange" />
    },
    {
      title: 'Comfort & Living',
      content: listing.comfort_living_info,
      icon: <Heart className="w-6 h-6 text-adventure-orange" />
    },
    {
      title: 'Location & Surroundings',
      content: listing.location_surroundings_info,
      icon: <MapPin className="w-6 h-6 text-adventure-orange" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center text-forest-green hover:text-adventure-orange"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Listings
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <ListingHeader listing={listing} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="mb-8">
                <div className="mb-4">
                  <img
                    src={images[selectedImage]}
                    alt={listing.title}
                    className="w-full h-96 object-cover rounded-xl"
                  />
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${listing.title} ${index + 1}`}
                        className={`h-20 object-cover rounded-lg cursor-pointer transition-all ${
                          selectedImage === index ? 'ring-2 ring-adventure-orange' : 'opacity-70 hover:opacity-100'
                        }`}
                        onClick={() => setSelectedImage(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-2xl font-serif font-bold text-forest-green mb-4">About this space</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{listing.description}</p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {listing.capacity && (
                  <div className="flex items-center">
                    <Users size={20} className="mr-2 text-adventure-orange" />
                    <span>Up to {listing.capacity} nomads</span>
                  </div>
                )}
                {listing.rooms && (
                  <div className="flex items-center">
                    <Heart size={20} className="mr-2 text-adventure-orange" />
                    <span>{listing.rooms} bedrooms</span>
                  </div>
                )}
                {listing.usp && (
                  <div className="flex items-center">
                    <Wifi size={20} className="mr-2 text-adventure-orange" />
                    <span>{listing.usp}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Booking Card - Shows only on mobile, positioned after description */}
            <div className="lg:hidden mb-8">
              <BookingCard listing={listing} />
            </div>

            {/* Information Blocks */}
            <div className="mb-8">
              <h3 className="text-2xl font-serif font-bold text-forest-green mb-6">What to expect</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {informationBlocks.map((block, index) => (
                  block.content && (
                    <Card key={index} className="border-l-4 border-l-adventure-orange">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          {block.icon}
                          <h4 className="text-lg font-semibold text-forest-green ml-3">{block.title}</h4>
                        </div>
                        {formatTextAsBullets(block.content)}
                      </CardContent>
                    </Card>
                  )
                ))}
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-serif font-bold text-forest-green mb-4">What's included</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center py-2">
                      <div className="w-2 h-2 bg-adventure-orange rounded-full mr-3" />
                      <span className="text-gray-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings */}
            <RatingBars averageRatings={averageRatings} />
          </div>

          {/* Right Column - Desktop Booking Card */}
          <div className="lg:col-span-1 hidden lg:block">
            <BookingCard listing={listing} />
          </div>
        </div>

        {/* Linked Blog Posts */}
        <div className="mt-16">
          <LinkedBlogPosts listingId={listingId} />
        </div>

        {/* Reviews Section */}
        <div className="mt-16 space-y-8">
          <ReviewsSection reviews={reviews} />
          <ReviewForm onSubmit={submitReview} />
        </div>

        {/* Community Promotion */}
        <div className="mt-16">
          <CommunityPromotion />
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
