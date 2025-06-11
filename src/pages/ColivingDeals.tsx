import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateRangePicker from '@/components/DateRangePicker';
import { MapPin, Users, Wifi, Star, Filter, ExternalLink } from 'lucide-react';
import { useListings } from '@/hooks/useListings';
import type { DateRange } from 'react-day-picker';

const ColivingDeals = () => {
  const navigate = useNavigate();
  const { listings, loading, error } = useListings();
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();

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

  const handleCardClick = (listingId: number) => {
    navigate(`/listing/${listingId}`);
  };

  const filteredListings = listings.filter(listing => {
    const matchesLocation = selectedLocation === 'all' || listing.country.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesType = selectedType === 'all' || listing.type.toLowerCase() === selectedType.toLowerCase();
    
    let matchesDates = true;
    if (selectedDates?.from && listing.is_seasonal && listing.seasonal_start_date && listing.seasonal_end_date) {
      const startDate = new Date(listing.seasonal_start_date);
      const endDate = new Date(listing.seasonal_end_date);
      const userStartDate = selectedDates.from;
      const userEndDate = selectedDates.to || selectedDates.from;
      
      // Check if user dates overlap with seasonal dates
      matchesDates = userStartDate <= endDate && userEndDate >= startDate;
    }
    
    return matchesLocation && matchesType && matchesDates;
  });

  // Get unique countries for the location filter
  const uniqueCountries = Array.from(new Set(listings.map(listing => listing.country))).sort();

  // Get unique types for the type filter
  const uniqueTypes = Array.from(new Set(listings.map(listing => listing.type))).sort();

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
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
            Exclusive Coliving Deals
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl">
            Discover amazing co-living spaces, retreats, and events around the world. 
            All with exclusive discounts for our community members.
          </p>
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
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueCountries.map((country) => (
                    <SelectItem key={country} value={country.toLowerCase()}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DateRangePicker
                value={selectedDates}
                onChange={setSelectedDates}
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
              {filteredListings.map((listing, index) => {
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
                      
                      <div className="flex items-center justify-between mb-4">
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
                        className="adventure-button w-full flex items-center justify-center gap-2"
                        onClick={(e) => handleGetCode(listing, e)}
                      >
                        {listing.discount_code_url ? (
                          <>
                            Get Discount Code
                            <ExternalLink size={16} />
                          </>
                        ) : (
                          'Get Discount Code'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ColivingDeals;
