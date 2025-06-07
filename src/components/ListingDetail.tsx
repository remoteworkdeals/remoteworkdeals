
import { useState } from 'react';
import { MapPin, Users, Wifi, Star, Heart, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

interface ListingDetailProps {
  listingId: number;
}

const ListingDetail = ({ listingId }: ListingDetailProps) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewData, setReviewData] = useState({
    name: '',
    review: '',
    social: 5,
    work: 5,
    surroundings: 5,
    facilities: 5,
    price: 5
  });

  // Mock data - in real app this would come from API
  const listing = {
    id: listingId,
    name: "Tropical Beach House",
    location: "Canggu, Bali",
    country: "Indonesia",
    type: "Co-living",
    originalPrice: 1200,
    discountedPrice: 720,
    discount: 40,
    images: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    reviews: 127,
    capacity: 12,
    rooms: 6,
    description: "Experience the ultimate digital nomad lifestyle in our beautiful beachfront co-living space. Located just 5 minutes from Canggu's famous surf breaks, this tropical paradise offers the perfect blend of work and play. Our community of like-minded professionals creates an inspiring environment for productivity and connection.",
    amenities: ["High-speed WiFi (100+ Mbps)", "Infinity Pool", "Coworking Space", "Surfboard Storage", "Yoga Deck", "Communal Kitchen", "Laundry Service", "24/7 Security"],
    ratings: {
      social: 4.7,
      work: 4.9,
      surroundings: 4.8,
      facilities: 4.6,
      price: 4.5
    }
  };

  const handleGetCode = () => {
    const message = `Hi! I'm interested in getting the discount code for ${listing.name} in ${listing.location}. Can you help me?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Review submitted:', reviewData);
    // Here you would send the review to your backend
    alert('Thank you for your review!');
    setReviewData({
      name: '',
      review: '',
      social: 5,
      work: 5,
      surroundings: 5,
      facilities: 5,
      price: 5
    });
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
            <Badge className="bg-adventure-orange text-white">
              -{listing.discount}%
            </Badge>
            <Badge className="bg-forest-green text-white">
              {listing.type}
            </Badge>
          </div>
          
          <h1 className="text-4xl font-serif font-bold text-forest-green mb-4">
            {listing.name}
          </h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin size={20} className="mr-2" />
              <span className="text-lg">{listing.location}, {listing.country}</span>
            </div>
            
            <div className="flex items-center gap-4">
              {renderStars(listing.rating)}
              <span className="text-sm text-gray-600">({listing.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="mb-4">
                <img
                  src={listing.images[selectedImage]}
                  alt={listing.name}
                  className="w-full h-96 object-cover rounded-xl"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {listing.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${listing.name} ${index + 1}`}
                    className={`h-20 object-cover rounded-lg cursor-pointer ${
                      selectedImage === index ? 'ring-2 ring-adventure-orange' : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-2xl font-serif font-bold text-forest-green mb-4">About this space</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{listing.description}</p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <Users size={20} className="mr-2 text-adventure-orange" />
                  <span>Up to {listing.capacity} nomads</span>
                </div>
                <div className="flex items-center">
                  <Heart size={20} className="mr-2 text-adventure-orange" />
                  <span>{listing.rooms} bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Wifi size={20} className="mr-2 text-adventure-orange" />
                  <span>100+ Mbps WiFi</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h3 className="text-2xl font-serif font-bold text-forest-green mb-4">What's included</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center py-2">
                    <div className="w-2 h-2 bg-adventure-orange rounded-full mr-3" />
                    <span className="text-gray-600">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ratings */}
            <div className="mb-8">
              <h3 className="text-2xl font-serif font-bold text-forest-green mb-6">Community Ratings</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {renderRatingBar('social', listing.ratings.social)}
                  {renderRatingBar('work environment', listing.ratings.work)}
                  {renderRatingBar('surroundings', listing.ratings.surroundings)}
                </div>
                <div>
                  {renderRatingBar('facilities', listing.ratings.facilities)}
                  {renderRatingBar('price', listing.ratings.price)}
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
                    ${listing.discountedPrice}
                    <span className="text-lg text-gray-500 line-through ml-2">
                      ${listing.originalPrice}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">per month</div>
                  <div className="text-adventure-orange font-semibold mt-2">
                    Save ${listing.originalPrice - listing.discountedPrice}!
                  </div>
                </div>
                
                <Button 
                  className="adventure-button w-full mb-4 text-lg py-6"
                  onClick={handleGetCode}
                >
                  <MessageCircle className="mr-2" size={20} />
                  Get Discount Code
                </Button>
                
                <div className="text-xs text-gray-500 text-center">
                  You'll receive your discount code via WhatsApp instantly
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-forest-green">Leave a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Your Name (optional)</Label>
                    <Input
                      id="name"
                      value={reviewData.name}
                      onChange={(e) => setReviewData({...reviewData, name: e.target.value})}
                      placeholder="Anonymous nomad"
                    />
                  </div>
                  
                  <div>
                    <Label>Overall Experience</Label>
                    <Textarea
                      value={reviewData.review}
                      onChange={(e) => setReviewData({...reviewData, review: e.target.value})}
                      placeholder="Share your experience with fellow nomads..."
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-base font-semibold mb-4 block">Rate each category (1-5 stars)</Label>
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.keys(listing.ratings).map((category) => (
                      <div key={category} className="text-center">
                        <Label className="text-sm capitalize mb-2 block">{category}</Label>
                        <select
                          value={reviewData[category as keyof typeof reviewData]}
                          onChange={(e) => setReviewData({
                            ...reviewData,
                            [category]: parseInt(e.target.value)
                          })}
                          className="w-full p-2 border rounded-md"
                        >
                          {[1,2,3,4,5].map(num => (
                            <option key={num} value={num}>{num} star{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button type="submit" className="adventure-button">
                  Submit Review
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
