
import { Search, MapPin, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

/**
 * Hero section component with mobile-first responsive design
 * Features search functionality and trust indicators
 */
const Hero = () => {
  const navigate = useNavigate();
  return <section className="hero-gradient text-white py-12 sm:py-16 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold leading-tight mb-4 sm:mb-6">
              Find Your Perfect
              <br />
              <span className="text-adventure-orange">Coliving Match & Deal.</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-100 leading-relaxed">Join our trusted community of Digital Nomads. Get personalized coliving recommendations, exclusive discounts up to 60%, and real coliving reviews from fellow nomads.</p>
            
            {/* Trust Indicators - Mobile optimized */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 text-sm">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-adventure-orange">200+</div>
                <div className="text-xs sm:text-sm">Community Members</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-adventure-orange">30+</div>
                <div className="text-xs sm:text-sm">Coliving Partners</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-adventure-orange">4.8★</div>
                <div className="text-xs sm:text-sm">Average Rating</div>
              </div>
            </div>
            
            {/* Search Bar - Mobile optimized */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl mb-6 sm:mb-8">
              <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input placeholder="Where to?" className="pl-10 h-11 sm:h-12 border-0 text-gray-800 text-base sm:text-lg" />
                </div>
                <Select>
                  <SelectTrigger className="h-11 sm:h-12 border-0 text-gray-800 text-base sm:text-lg">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coliving">Co-living</SelectItem>
                    <SelectItem value="retreat">Retreat</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="adventure-button h-11 sm:h-12 text-base sm:text-lg w-full" onClick={() => navigate('/coliving-deals')}>
                  <Search className="mr-2" size={18} />
                  Find Deals
                </Button>
              </div>
            </div>

            {/* CTA Buttons - Mobile optimized */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button className="adventure-button text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 w-full sm:w-auto" onClick={() => navigate('/exclusive-deals')}>
                <MessageCircle className="mr-2" size={18} />
                Join Free Community
              </Button>
              <Button variant="outline" className="outline-button text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 bg-transparent border-white text-white hover:bg-white hover:text-forest-green w-full sm:w-auto" onClick={() => navigate('/coliving-deals')}>Browse All Coliving Deals</Button>
            </div>
          </div>

          {/* Hero Image - Mobile optimized with performance optimizations */}
          <div className="animate-scale-in order-first lg:order-last">
            <div className="relative">
              <div className="aspect-video rounded-xl sm:rounded-2xl bg-gray-200 overflow-hidden">
                <img 
                  alt="Digital nomad working in a beautiful co-living space" 
                  className="w-full h-full object-cover transition-opacity duration-300" 
                  src="/lovable-uploads/6c22efa0-f3ff-4036-b52a-2c5adb94f2b9.jpg"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-adventure-orange text-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg">
                <div className="text-xl sm:text-2xl font-bold">Up to 60%</div>
                <div className="text-xs sm:text-sm">Exclusive Savings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default Hero;
