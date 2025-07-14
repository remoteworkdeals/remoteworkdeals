
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import DateRangePicker from '@/components/DateRangePicker';
import { MapPin, Users, Wifi, Star, Filter } from 'lucide-react';
import { useListings } from '@/hooks/useListings';
import { useListingUrl } from '@/hooks/useListingUrl';
import type { DateRange } from 'react-day-picker';

const ColivingDeals = () => {
  const navigate = useNavigate();
  const { getListingUrl } = useListingUrl();
  const {
    listings,
    loading,
    error
  } = useListings();
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // Filter listings based on selected criteria
  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      // Location filter
      if (selectedLocation !== 'all' && listing.country.toLowerCase() !== selectedLocation) {
        return false;
      }
      
      // Type filter
      if (selectedType !== 'all' && listing.type.toLowerCase() !== selectedType) {
        return false;
      }
      
      // Date filter for seasonal listings
      if (selectedDates?.from && selectedDates?.to && listing.is_seasonal) {
        const startDate = new Date(listing.seasonal_start_date || '');
        const endDate = new Date(listing.seasonal_end_date || '');
        const selectedStart = selectedDates.from;
        const selectedEnd = selectedDates.to;
        
        // Check if selected dates overlap with seasonal availability
        if (selectedStart > endDate || selectedEnd < startDate) {
          return false;
        }
      }
      
      return true;
    });
  }, [listings, selectedLocation, selectedType, selectedDates]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentListings = filteredListings.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const resetPage = () => setCurrentPage(1);

  // Helper function to get discount badge text
  const getDiscountBadgeText = (listing: any) => {
    if (!listing.discount_value || listing.discount_value <= 0) return null;
    
    if (listing.discount_type === 'percentage') {
      return `-${listing.discount_value}%`;
    } else {
      return `-€${listing.discount_value}`;
    }
  };

  // Helper function to check if listing has discount
  const hasDiscount = (listing: any) => {
    return listing.discount_value && listing.discount_value > 0 && listing.discounted_price;
  };

  const handleGetCode = (listing: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (listing.discount_code_url) {
      window.open(listing.discount_code_url, '_blank');
    } else {
      const message = `Hi! I'm interested in getting the discount code for ${listing.title}. Can you help me?`;
      const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleMoreInfo = (listing: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getListingUrl(listing.title, listing.id);
    navigate(url);
  };

  const handleCardClick = (listing: any) => {
    const url = getListingUrl(listing.title, listing.id);
    navigate(url);
  };

  // Get unique countries for the location filter
  const uniqueCountries: string[] = Array.from(new Set(listings.map(listing => listing.country))).sort();

  // Get unique types for the type filter
  const uniqueTypes: string[] = Array.from(new Set(listings.map(listing => listing.type))).sort();

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg">Loading listings...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg text-red-600">Error loading listings: {error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="bg-forest-green text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">Explore trusted Coliving spaces & discounts</h1>
          <p className="text-xl text-gray-100 max-w-3xl">Discover only the best coliving spaces, retreats, and events around the world. Read real reviews from fellow remote workers, compare your options, and claim your discount. All in one space.</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <span className="font-medium text-gray-700">Filter by:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Select value={selectedLocation} onValueChange={(value) => { setSelectedLocation(value); resetPage(); }}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueCountries.map((country: string) => (
                    <SelectItem key={country} value={country.toLowerCase()}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedType} onValueChange={(value) => { setSelectedType(value); resetPage(); }}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map((type: string) => (
                    <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DateRangePicker 
                value={selectedDates} 
                onChange={(dates) => { setSelectedDates(dates); resetPage(); }} 
                placeholder="Travel Dates" 
                className="w-full sm:w-56" 
              />
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredListings.length} deal{filteredListings.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No listings found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentListings.map((listing, index) => {
                const displayImage = listing.featured_image || (listing.images && listing.images.length > 0 ? listing.images[0] : null) || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80";
                const discountBadgeText = getDiscountBadgeText(listing);
                const isDiscounted = hasDiscount(listing);
                
                return (
                  <Card key={listing.id} className="overflow-hidden card-shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in cursor-pointer" style={{
                    animationDelay: `${index * 0.1}s`
                  }} onClick={() => handleCardClick(listing)}>
                    <div className="relative">
                      <img src={displayImage} alt={listing.title} className="w-full h-64 object-cover" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {discountBadgeText && (
                          <Badge className="bg-adventure-orange text-white">
                            {discountBadgeText}
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
                        {listing.usp ? (
                          <div className="flex items-center">
                            <span className="text-adventure-orange font-medium">{listing.usp}</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Wifi size={16} className="mr-1" />
                            <span>High-speed WiFi</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          {isDiscounted ? (
                            <div className="flex flex-col">
                              <span className="text-lg text-gray-500 line-through">
                                €{listing.original_price}
                              </span>
                              <span className="text-2xl font-bold text-forest-green">
                                €{listing.discounted_price}
                              </span>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold text-forest-green">
                              €{listing.original_price}
                            </span>
                          )}
                          <div className="text-sm text-gray-600">per {listing.pricing_unit || 'month'}</div>
                        </div>
                      </div>
                      
                      <Button className="adventure-button w-full" onClick={e => handleMoreInfo(listing, e)}>
                        More Info
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage - 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    </PaginationItem>
                  )}
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ColivingDeals;
