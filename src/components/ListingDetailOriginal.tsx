
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
      {/* Hero Section with Image */}
      {listing.featured_image && (
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={listing.featured_image} 
            alt={listing.title}
            className="w-full h-64 md:h-96 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title and Basic Info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">
                {listing.type}
              </Badge>
              {listing.discounted_price && listing.discount_percentage && (
                <Badge variant="destructive">
                  🔥 {listing.discount_percentage}% OFF
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-serif text-forest-green mb-4">
              {listing.title}
            </h1>
            
            <div className="flex items-center text-gray-600 mb-6">
              <MapPin size={20} className="mr-2" />
              <span className="text-lg">{listing.location}, {listing.country}</span>
            </div>
            
            <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
              {listing.capacity && (
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>Up to {listing.capacity} nomads</span>
                </div>
              )}
              {listing.rooms && (
                <div className="flex items-center gap-2">
                  <Bed size={18} />
                  <span>{listing.rooms} bedrooms</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Globe size={18} />
                <span>High-speed WiFi</span>
              </div>
            </div>

            {listing.rating && listing.rating > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="text-lg">{listing.rating} ({listing.review_count} reviews)</span>
              </div>
            )}
          </div>

          {/* About this space */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-forest-green">About this space</CardTitle>
            </CardHeader>
            <CardContent>
              {listing.description && (
                <p className="text-gray-700 leading-relaxed text-lg mb-6">{listing.description}</p>
              )}
            </CardContent>
          </Card>

          {/* What's Included */}
          {listing.amenities && listing.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-serif text-forest-green">What's included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {listing.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-orange-500 text-lg">•</span>
                      <span className="text-gray-700">{amenity}</span>
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

          {/* This coliving is for you if */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif text-forest-green">This coliving is for you if</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700">You're a digital nomad looking for a vibrant community</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700">You value networking and making meaningful connections</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700">You need reliable WiFi and dedicated workspace</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700">You enjoy shared experiences and collaborative living</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* This coliving is not for you if */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif text-forest-green">This coliving is not for you if</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-lg">✗</span>
                  <span className="text-gray-700">You prefer complete privacy and minimal social interaction</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-lg">✗</span>
                  <span className="text-gray-700">You're looking for luxury accommodations with hotel-like services</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-lg">✗</span>
                  <span className="text-gray-700">You're not comfortable sharing common spaces</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-lg">✗</span>
                  <span className="text-gray-700">You prefer traditional tourist experiences over local immersion</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <ReviewsSection reviews={reviews} />

          {/* Review Form */}
          <ReviewForm onSubmit={submitReview} />
        </div>

        {/* Right Column - Pricing Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="text-right mb-4">
                  <span className="text-sm text-gray-500">per {listing.pricing_unit}</span>
                  {listing.discounted_price && listing.discount_percentage && (
                    <div className="text-orange-500 font-semibold mb-2">
                      Save €{listing.original_price - listing.discounted_price}!
                    </div>
                  )}
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    Starting from
                  </div>
                  {listing.discounted_price ? (
                    <div>
                      <div className="text-4xl font-bold text-gray-800">
                        {formatPrice(listing.discounted_price, listing.pricing_unit || 'night')}
                      </div>
                      <div className="text-lg text-gray-500 line-through">
                        {formatPrice(listing.original_price, listing.pricing_unit || 'night')}
                      </div>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-gray-800">
                      {formatPrice(listing.original_price, listing.pricing_unit || 'night')}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {listing.discount_code_url && (
                    <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      <a href={listing.discount_code_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Get Discount Code
                      </a>
                    </Button>
                  )}
                  
                  {listing.website_url && (
                    <Button asChild variant="outline" className="w-full">
                      <a href={listing.website_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Check Availability
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

                {listing.discount_code_url && (
                  <div className="mt-4 text-center text-sm text-gray-600">
                    <p>Receive your discount code directly in your</p>
                    <p>WhatsApp inbox.</p>
                    <p className="mt-2">Click to get your discount code instantly</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Community Join CTA */}
      <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <CardContent className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Community?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-lg">
            It's completely free and takes less than 30 seconds. Start saving today!
          </p>
          <div className="max-w-md mx-auto grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-left text-sm font-medium mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="w-full p-3 rounded-lg text-gray-800"
              />
            </div>
            <div>
              <label className="block text-left text-sm font-medium mb-2">WhatsApp Number</label>
              <input 
                type="tel" 
                placeholder="+1 234 567 8900" 
                className="w-full p-3 rounded-lg text-gray-800"
              />
            </div>
          </div>
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
            💬 Join the Community (Free)
          </Button>
          <p className="text-sm text-blue-100 mt-4">
            By joining, you agree to receive exclusive deals and community updates. Unsubscribe anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListingDetailOriginal;
