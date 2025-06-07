
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Hero = () => {
  return (
    <section className="hero-gradient text-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              Find Your Perfect
              <br />
              <span className="text-adventure-orange">Co-living Match.</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-gray-100 leading-relaxed">
              Join our trusted community of digital nomads. Get personalized co-living 
              recommendations, exclusive discounts up to 40%, and real reviews from fellow nomads.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl mb-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <Input 
                    placeholder="Where to?" 
                    className="pl-10 h-12 border-0 text-gray-800 text-lg"
                  />
                </div>
                <Select>
                  <SelectTrigger className="h-12 border-0 text-gray-800 text-lg">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coliving">Co-living</SelectItem>
                    <SelectItem value="retreat">Retreat</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="adventure-button h-12 text-lg">
                  <Search className="mr-2" size={20} />
                  Get Matched
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="adventure-button text-lg">
                <Users className="mr-2" size={20} />
                Join Our Community
              </Button>
              <Button variant="outline" className="outline-button text-lg bg-transparent border-white text-white hover:bg-white hover:text-forest-green">
                Browse All Listings
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="animate-scale-in">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80"
                alt="Digital nomad working in a beautiful co-living space"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-adventure-orange text-white p-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">40%</div>
                <div className="text-sm">Average Savings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
