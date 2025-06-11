
import { MapPin, Users, Wifi, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useListings } from '@/hooks/useListings';

const FeaturedListings = () => {
  const navigate = useNavigate();
  const { listings, loading } = useListings();

  // Get first 3 listings with highest discount percentage for featured section
  const featuredListings = listings
    .filter(listing => listing.discount_percentage && listing.discount_percentage > 0)
    .sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0))
    .slice(0, 3);

  const handleMoreInfo = (listing: any, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/listing/${listing.id}`);
  };

  const handleCardClick = (listingId: number) => {
    navigate(`/listing/${listingId}`);
  };

  if (loading || featuredListings.length === 0) {
    return null; // Don't show section if loading or no featured listings
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-forest-green mb-6">
            Featured Coliving Deals
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hand-picked co-livings with the best discounts. These spots are popular 
            among our community and fill up fast.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredListings.map((listing, index) => {
            const displayImage = listing.featured_image || 
              (listing.images && listing.images.length > 0 ? listing.images[0] : null) ||
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80";
            
            const discountedPrice = listing.discounted_price || listing.original_price;
            const hasDiscount = listing.discount_percentage && listing.discount_percentage > 0;

            return (
              <Card 
                key={listing.id} 
                className="overflow-hidden card-shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleCardClick(listing.id)}
              >
                <div className="relative">
                  <img
                    src={displayImage}
                    alt={listing.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {hasDiscount && (
                      <Badge className="bg-adventure-orange text-white">
                        -{listing.discount_percentage}%
                      </Badge>
                    )}
                    {listing.is_seasonal && (
                      <Badge className="bg-blue-500 text-white">
                        Seasonal
                      </Badge>
                    )}
                  </div>
                  <Badge className="absolute top-4 right-4 bg-forest-green text-white">
                    {listing.type}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  {listing.rating && listing.review_count && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1 text-sm font-medium text-gray-700">
                          {listing.rating} ({listing.review_count})
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-serif font-bold text-forest-green mb-2">
                    {listing.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin size={16} className="mr-1" />
                    <span>{listing.location}</span>
                  </div>

                  {listing.is_seasonal && listing.seasonal_start_date && listing.seasonal_end_date && (
                    <div className="text-sm text-blue-600 mb-3">
                      Available: {new Date(listing.seasonal_start_date).toLocaleDateString()} - {new Date(listing.seasonal_end_date).toLocaleDateString()}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    {listing.capacity && (
                      <div className="flex items-center">
                        <Users size={16} className="mr-1" />
                        <span>Up to {listing.capacity}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Wifi size={16} className="mr-1" />
                      <span>High-speed WiFi</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-2xl font-bold text-forest-green">
                        €{discountedPrice}
                      </span>
                      {hasDiscount && (
                        <span className="text-lg text-gray-500 line-through ml-2">
                          €{listing.original_price}
                        </span>
                      )}
                      <div className="text-sm text-gray-600">per month</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="adventure-button w-full"
                    onClick={(e) => handleMoreInfo(listing, e)}
                  >
                    More Info
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Button className="outline-button" onClick={() => navigate('/coliving-deals')}>
            View All Deals
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
