
import { useState } from 'react';
import { MapPin, Users, Wifi, Star, Heart, MessageCircle, ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useListingData } from '@/hooks/useListingData';
import ReviewsSection from './ReviewsSection';
import ReviewForm from './ReviewForm';

interface ListingDetailProps {
  listingId: number;
}

const ListingDetail = ({ listingId }: ListingDetailProps) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const { listing, reviews, loading, error, averageRatings, submitReview } = useListingData(listingId);

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

  const handleGetCode = () => {
    if (listing.discount_code_url) {
      window.open(listing.discount_code_url, '_blank');
    } else {
      const message = `Hi! I'm interested in getting the discount code for ${listing.title} in ${listing.location}. Can you help me?`;
      const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.floor(rating) ? "text-yellow-500 fill-current" : "text-gray-300"}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const renderRatingBar = (category: string, rating: number) => {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
          <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-adventure-orange h-2 rounded-full"
            style={{ width: `${(rating / 5) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  // Use featured image first, then fall back to images array
  const displayImages = [];
  if (listing.featured_image) {
    displayImages.push(listing.featured_image);
  }
  if (listing.images) {
    displayImages.push(...listing.images.filter(img => img !== listing.featured_image));
  }
  
  const images = displayImages.length > 0 ? displayImages : [];
  const amenities = listing.amenities || [];
  const discountAmount = listing.original_price - (listing.discounted_price || listing.original_price);

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {listing.discount_percentage && (
              <Badge className="bg-adventure-orange text-white">
                -{listing.discount_percentage}%
              </Badge>
            )}
            <Badge className="bg-forest-green text-white">
              {listing.type}
            </Badge>
            {listing.is_seasonal && (
              <Badge className="bg-blue-500 text-white">
                <Calendar size={14} className="mr-1" />
                Seasonal
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl font-serif font-bold text-forest-green mb-4">
            {listing.title}
          </h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin size={20} className="mr-2" />
              <span className="text-lg">{listing.location}, {listing.country}</span>
            </div>
            
            <div className="flex items-center gap-4">
              {renderStars(listing.rating || 0)}
              <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
            </div>
          </div>

          {listing.is_seasonal && listing.seasonal_start_date && listing.seasonal_end_date && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-blue-700">
                <Calendar size={16} className="mr-2" />
                <span className="font-medium">Seasonal Availability:</span>
              </div>
              <p className="text-blue-600 mt-1">
                {new Date(listing.seasonal_start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - {new Date(listing.seasonal_end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>

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
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${listing.title} ${index + 1}`}
                        className={`h-20 object-cover rounded-lg cursor-pointer ${
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
                <div className="flex items-center">
                  <Wifi size={20} className="mr-2 text-adventure-orange" />
                  <span>High-speed WiFi</span>
                </div>
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
            <div className="mb-8">
              <h3 className="text-2xl font-serif font-bold text-forest-green mb-6">Community Ratings</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {renderRatingBar('social', averageRatings.social)}
                  {renderRatingBar('work environment', averageRatings.work)}
                  {renderRatingBar('surroundings', averageRatings.surroundings)}
                </div>
                <div>
                  {renderRatingBar('facilities', averageRatings.facilities)}
                  {renderRatingBar('price', averageRatings.price)}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 card-shadow">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-forest-green">
                    €{listing.discounted_price || listing.original_price}
                    {listing.discounted_price && (
                      <span className="text-lg text-gray-500 line-through ml-2">
                        €{listing.original_price}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">per month</div>
                  {discountAmount > 0 && (
                    <div className="text-adventure-orange font-semibold mt-2">
                      Save €{discountAmount}!
                    </div>
                  )}
                </div>
                
                <Button 
                  className="adventure-button w-full mb-4 text-lg py-6 flex items-center justify-center gap-2"
                  onClick={handleGetCode}
                >
                  {listing.discount_code_url ? (
                    <>
                      <ExternalLink size={20} />
                      Get Discount Code
                    </>
                  ) : (
                    <>
                      <MessageCircle size={20} />
                      Get Discount Code
                    </>
                  )}
                </Button>
                
                <div className="text-sm text-gray-600 text-center bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700 mb-1">
                    Receive your discount code directly in your WhatsApp inbox.
                  </p>
                  <p className="text-xs">
                    {listing.discount_code_url 
                      ? "Click to get your discount code instantly" 
                      : "Fast response guaranteed within minutes"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 space-y-8">
          <ReviewsSection reviews={reviews} />
          <ReviewForm onSubmit={submitReview} />
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
