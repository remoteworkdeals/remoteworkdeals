
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Listing } from '@/types/listing';
import { ExternalLink, MapPin, Users, Bed, Calendar, Globe, Instagram } from 'lucide-react';
import { useListingData } from '@/hooks/useListingData';
import ReviewsSection from './ReviewsSection';
import ReviewForm from './ReviewForm';

interface ListingDetailOriginalProps {
  listingId: number;
}

const ListingDetailOriginal = ({ listingId }: ListingDetailOriginalProps) => {
  const { listing, reviews, loading, error, submitReview } = useListingData(listingId);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-4xl mb-4">😕</div>
            <h2 className="text-xl font-semibold mb-2">Listing not found</h2>
            <p className="text-gray-600">{error || 'This listing may have been removed or is no longer available.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: number, unit: string) => {
    return `€${price}/${unit}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Hero Section */}
      <Card className="overflow-hidden shadow-lg">
        {listing.featured_image && (
          <div className="relative">
            <img 
              src={listing.featured_image} 
              alt={listing.title}
              className="w-full h-64 md:h-96 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <Badge variant="secondary" className="mb-2">
                {listing.type}
              </Badge>
              {listing.discounted_price && listing.discount_percentage && (
                <Badge variant="destructive" className="ml-2">
                  🔥 {listing.discount_percentage}% OFF
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <CardHeader className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl md:text-3xl font-serif text-forest-green mb-2">
                {listing.title}
              </CardTitle>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin size={18} className="mr-2" />
                <span className="text-lg">{listing.location}, {listing.country}</span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {listing.capacity && (
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{listing.capacity} people</span>
                  </div>
                )}
                {listing.rooms && (
                  <div className="flex items-center gap-1">
                    <Bed size={16} />
                    <span>{listing.rooms} rooms</span>
                  </div>
                )}
                {listing.minimum_stay && (
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Min {listing.minimum_stay} {listing.minimum_stay_unit}</span>
                  </div>
                )}
                {listing.rating && listing.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span>{listing.rating} ({listing.review_count} reviews)</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-xl border border-blue-100 lg:min-w-[280px]">
              <div className="text-center">
                <div className="mb-3">
                  {listing.discounted_price ? (
                    <div>
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(listing.discounted_price, listing.pricing_unit || 'night')}
                      </span>
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(listing.original_price, listing.pricing_unit || 'night')}
                      </div>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-800">
                      {formatPrice(listing.original_price, listing.pricing_unit || 'night')}
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  {listing.website_url && (
                    <Button asChild className="w-full adventure-button">
                      <a href={listing.website_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Check Availability
                      </a>
                    </Button>
                  )}
                  
                  {listing.discount_code_url && (
                    <Button asChild variant="outline" className="w-full">
                      <a href={listing.discount_code_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Get Discount Code
                      </a>
                    </Button>
                  )}
                  
                  {listing.instagram_url && (
                    <Button asChild variant="ghost" size="sm" className="w-full">
                      <a href={listing.instagram_url} target="_blank" rel="noopener noreferrer">
                        <Instagram className="mr-2 h-4 w-4" />
                        View on Instagram
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        {listing.description && (
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">{listing.description}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Amenities Section */}
      {listing.amenities && listing.amenities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-serif text-forest-green flex items-center gap-2">
              🏠 What's Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {listing.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Sections Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Work & WiFi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              💻 Work & WiFi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {listing.work_wifi_info || "High-speed internet and dedicated workspaces make this perfect for remote work. Multiple coworking areas and quiet zones ensure productivity."}
            </p>
          </CardContent>
        </Card>

        {/* Community & Social */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              🤝 Community & Social
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {listing.community_social_info || "Join a vibrant community of like-minded nomads. Regular social events, shared meals, and collaborative spaces foster meaningful connections."}
            </p>
          </CardContent>
        </Card>

        {/* Comfort & Living */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              🏠 Comfort & Living
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {listing.comfort_living_info || "Modern amenities and comfortable spaces designed for long-term stays. Quality furniture, storage solutions, and homey atmosphere."}
            </p>
          </CardContent>
        </Card>

        {/* Location & Surroundings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              📍 Location & Surroundings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {listing.location_surroundings_info || "Perfectly located with easy access to cafes, restaurants, and local attractions. Great transport links and walkable neighborhood."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Section */}
      <ReviewsSection reviews={reviews} />

      {/* Review Form */}
      <ReviewForm onSubmit={submitReview} />

      {/* Ready to Join CTA */}
      <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <CardContent className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">🎒 Ready to join this community?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Connect with like-minded nomads and experience {listing.location} like a local.
          </p>
          {listing.website_url && (
            <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              <a href={listing.website_url} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-5 w-5" />
                Book Your Stay
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ListingDetailOriginal;
