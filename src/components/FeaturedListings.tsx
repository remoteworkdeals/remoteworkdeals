
import { MapPin, Users, Wifi, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FeaturedListings = () => {
  const navigate = useNavigate();

  const listings = [
    {
      id: 1,
      name: "Tropical Beach House",
      location: "Canggu, Bali",
      type: "Co-living",
      originalPrice: 1200,
      discountedPrice: 720,
      discount: 40,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      reviews: 127,
      capacity: 12,
      amenities: ["High-speed WiFi", "Pool", "Coworking Space"]
    },
    {
      id: 2,
      name: "Mountain Retreat",
      location: "Medellín, Colombia",
      type: "Retreat",
      originalPrice: 800,
      discountedPrice: 560,
      discount: 30,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
      rating: 4.9,
      reviews: 89,
      capacity: 8,
      amenities: ["Mountain View", "Yoga Studio", "Organic Garden"]
    },
    {
      id: 3,
      name: "Urban Nomad Hub",
      location: "Lisbon, Portugal",
      type: "Co-living",
      originalPrice: 950,
      discountedPrice: 665,
      discount: 30,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      reviews: 203,
      capacity: 15,
      amenities: ["City Center", "Rooftop Terrace", "24/7 Access"]
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

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-forest-green mb-6">
            Featured Deals
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hand-picked co-livings with the best discounts. These spots are popular 
            among our community and fill up fast.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing, index) => (
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
        
        <div className="text-center mt-12">
          <Button className="outline-button" onClick={() => navigate('/listings')}>
            View All Listings
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
