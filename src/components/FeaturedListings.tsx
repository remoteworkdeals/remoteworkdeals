
import { MapPin, Users, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useListings } from '@/hooks/useListings';
import { useListingUrl } from '@/hooks/useListingUrl';

/**
 * Featured listings section with mobile-first responsive grid
 * Displays manually featured listings first, then top discounted co-living spaces
 */
const FeaturedListings = () => {
  const navigate = useNavigate();
  const { getListingUrl } = useListingUrl();
  const {
    listings,
    loading
  } = useListings();

  // Get featured listings - prioritize manually featured, then highest discount percentage
  const featuredListings = (() => {
    const manuallyFeatured = listings.filter(listing => listing.featured).slice(0, 3);
    
    if (manuallyFeatured.length >= 3) {
      return manuallyFeatured;
    }
    
    // Fill remaining slots with highest discount listings that aren't already featured
    const remainingSlots = 3 - manuallyFeatured.length;
    const discountedListings = listings
      .filter(listing => !listing.featured && listing.discount_percentage && listing.discount_percentage > 0)
      .sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0))
      .slice(0, remainingSlots);
    
    return [...manuallyFeatured, ...discountedListings];
  })();
  
  const handleMoreInfo = (listing: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getListingUrl(listing.title, listing.id);
    navigate(url);
  };
  
  const handleCardClick = (listing: any) => {
    const url = getListingUrl(listing.title, listing.id);
    navigate(url);
  };
  
  if (loading || featuredListings.length === 0) {
    return null;
  }
  
  return <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-forest-green mb-4 sm:mb-6">
            Featured Coliving Deals
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">These coliving places get booked fast, grab your code before it's gone. Trusted spaces. Real discounts. Loved by other nomads.</p>
        </div>

        {/* Mobile-first responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredListings.map((listing, index) => {
          const displayImage = listing.featured_image || (listing.images && listing.images.length > 0 ? listing.images[0] : null) || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80";
          const discountedPrice = listing.discounted_price || listing.original_price;
          const hasDiscount = listing.discount_percentage && listing.discount_percentage > 0;
          return <Card key={listing.id} className="overflow-hidden card-shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in cursor-pointer" style={{
            animationDelay: `${index * 0.1}s`
          }} onClick={() => handleCardClick(listing)}>
                <div className="relative">
                  <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                    <img 
                      src={displayImage} 
                      alt={listing.title}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                  </div>
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex gap-2">
                    {hasDiscount && <Badge className="bg-adventure-orange text-white text-xs sm:text-sm">
                        -{listing.discount_percentage}%
                      </Badge>}
                    {listing.is_seasonal && <Badge className="bg-blue-500 text-white text-xs sm:text-sm">
                        Seasonal
                      </Badge>}
                  </div>
                  <Badge className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-forest-green text-white text-xs sm:text-sm">
                    {listing.type}
                  </Badge>
                </div>
                
                <CardContent className="p-4 sm:p-6">
                  {listing.rating && listing.review_count && <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center text-yellow-500">
                        <Star size={14} fill="currentColor" />
                        <span className="ml-1 text-sm font-medium text-gray-700">
                          {listing.rating} ({listing.review_count})
                        </span>
                      </div>
                    </div>}
                  
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-forest-green mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3 sm:mb-4">
                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                    <span className="text-sm truncate">{listing.location}</span>
                  </div>

                  {listing.is_seasonal && listing.seasonal_start_date && listing.seasonal_end_date && <div className="text-xs sm:text-sm text-blue-600 mb-3 line-clamp-2">
                      Available: {new Date(listing.seasonal_start_date).toLocaleDateString()} - {new Date(listing.seasonal_end_date).toLocaleDateString()}
                    </div>}
                  
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
                    {listing.capacity && <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        <span>Up to {listing.capacity}</span>
                      </div>}
                    {listing.usp && (
                      <div className="flex items-center">
                        <span>{listing.usp}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div>
                      <span className="text-xl sm:text-2xl font-bold text-forest-green">
                        €{discountedPrice}
                      </span>
                      {hasDiscount && <span className="text-sm sm:text-lg text-gray-500 line-through ml-2">
                          €{listing.original_price}
                        </span>}
                      <div className="text-xs sm:text-sm text-gray-600">per month</div>
                    </div>
                  </div>
                  
                  <Button className="adventure-button w-full py-2 sm:py-3 text-sm sm:text-base" onClick={e => handleMoreInfo(listing, e)}>
                    More Info
                  </Button>
                </CardContent>
              </Card>;
        })}
        </div>
        
        <div className="text-center mt-8 sm:mt-12">
          <Button className="outline-button py-3 px-6 sm:px-8 text-sm sm:text-base" onClick={() => navigate('/coliving-deals')}>View All Coliving Deals</Button>
        </div>
      </div>
    </section>;
};

export default FeaturedListings;
