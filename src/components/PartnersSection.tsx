
import { Button } from '@/components/ui/button';
import { Building, Users, TrendingUp, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const PartnersSection = () => {
  return <section className="py-20 bg-forest-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
              Partner With Us
            </h2>
            <p className="text-xl text-gray-100 mb-8">Are you a coliving operator, nomad retreat organizer, or Digital Nomad event host? Join our network and reach thousands of remote workers.</p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-adventure-orange rounded-lg p-3 flex-shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Instant access to Digital Nomads & remote workers</h3>
                  <p className="text-gray-200">Access to our vetted community of remote workers and digital nomads</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-adventure-orange rounded-lg p-3 flex-shrink-0">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Increased Bookings</h3>
                  <p className="text-gray-200">Boost your occupancy rates with our engaged audience</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-adventure-orange rounded-lg p-3 flex-shrink-0">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Global Reach</h3>
                  <p className="text-gray-200">Connect with nomads from around the world looking for their next home</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/become-partner">
                <Button className="adventure-button">
                  Become a Partner
                </Button>
              </Link>
              <Link to="/become-partner">
                <Button variant="outline" className="border-white hover:bg-white hover:text-forest-green text-zinc-900">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gray-700 overflow-hidden">
              <img 
                alt="Co-living partners working together in modern space" 
                className="w-full h-full object-cover transition-opacity duration-300" 
                src="/lovable-uploads/6ac830c3-8a61-4649-bb1b-547c4a58a652.jpg"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-adventure-orange text-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold">30+</div>
              <div className="text-sm">Happy Partners</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default PartnersSection;
