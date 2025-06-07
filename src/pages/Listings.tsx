
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, Wifi, Star, Filter } from 'lucide-react';

const Listings = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const listings = [
    {
      id: 1,
      name: "Tropical Beach House",
      location: "Canggu, Bali",
      country: "Indonesia",
      type: "Co-living",
      originalPrice: 1200,
      discountedPrice: 720,
      discount: 40,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      reviews: 127,
      capacity: 12
    },
    {
      id: 2,
      name: "Mountain Retreat",
      location: "Medellín, Colombia",
      country: "Colombia",
      type: "Retreat",
      originalPrice: 800,
      discountedPrice: 560,
      discount: 30,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
      rating: 4.9,
      reviews: 89,
      capacity: 8
    },
    {
      id: 3,
      name: "Urban Nomad Hub",
      location: "Lisbon, Portugal",
      country: "Portugal",
      type: "Co-living",
      originalPrice: 950,
      discountedPrice: 665,
      discount: 30,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      reviews: 203,
      capacity: 15
    },
    {
      id: 4,
      name: "Desert Workspace",
      location: "Taghazout, Morocco",
      country: "Morocco",
      type: "Co-living",
      originalPrice: 600,
      discountedPrice: 420,
      discount: 30,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80",
      rating: 4.6,
      reviews: 156,
      capacity: 10
    }
  ];

  const handleGetCode = (listingName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hi! I'm interested in getting the discount code for ${listingName}. Can you help me?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCardClick = (listingId: number) => {
    navigate(`/listing/${listingId}`);
  };

  const filteredListings = listings.filter(listing => {
    const matchesLocation = selectedLocation === 'all' || listing.country.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesType = selectedType === 'all' || listing.type.toLowerCase() === selectedType.toLowerCase();
    return matchesLocation && matchesType;
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="bg-forest-green text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
            All Listings
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl">
            Discover amazing co-living spaces, retreats, and events around the world. 
            All with exclusive discounts for our community.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
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
                  <SelectItem value="indonesia">Indonesia</SelectItem>
                  <SelectItem value="colombia">Colombia</SelectItem>
                  <SelectItem value="portugal">Portugal</SelectItem>
                  <SelectItem value="morocco">Morocco</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="co-living">Co-living</SelectItem>
                  <SelectItem value="retreat">Retreat</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing, index) => (
              <Card 
                key={listing.id} 
                className="overflow-hidden card-shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleCardClick(listing.id)}
              >
                <div className="relative">
                  <img
                    src={listing.image}
                    alt={listing.name}
                    className="w-full h-64 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-adventure-orange text-white">
                    -{listing.discount}%
                  </Badge>
                  <Badge className="absolute top-4 right-4 bg-forest-green text-white">
                    {listing.type}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span className="ml-1 text-sm font-medium text-gray-700">
                        {listing.rating} ({listing.reviews})
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold text-forest-green mb-2">
                    {listing.name}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin size={16} className="mr-1" />
                    <span>{listing.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users size={16} className="mr-1" />
                      <span>Up to {listing.capacity}</span>
                    </div>
                    <div className="flex items-center">
                      <Wifi size={16} className="mr-1" />
                      <span>High-speed WiFi</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-2xl font-bold text-forest-green">
                        ${listing.discountedPrice}
                      </span>
                      <span className="text-lg text-gray-500 line-through ml-2">
                        ${listing.originalPrice}
                      </span>
                      <div className="text-sm text-gray-600">per month</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="adventure-button w-full"
                    onClick={(e) => handleGetCode(listing.name, e)}
                  >
                    Get Discount Code
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Listings;
