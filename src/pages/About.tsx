
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Globe, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-forest-green text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
            Built by Nomads, for Nomads
          </h1>
          <p className="text-xl text-gray-100">
            The story behind RemoteWork.Deals and our mission to make remote work adventures accessible to everyone.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-forest-green mb-6">
                My Journey as a Digital Nomad
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  Three years ago, I packed my life into a backpack and bought a one-way ticket to Bali. 
                  What started as a month-long "workation" turned into a complete lifestyle transformation.
                </p>
                <p>
                  After visiting 47 co-living spaces across 23 countries, I noticed something: the best 
                  places were often the most expensive, making nomadism accessible only to those with 
                  high salaries or trust funds.
                </p>
                <p>
                  I started negotiating group discounts with co-living operators I'd built relationships 
                  with. Word spread in nomad WhatsApp groups, and soon I was managing discount codes for 
                  hundreds of fellow travelers.
                </p>
                <p>
                  RemoteWork.Deals was born from this simple idea: everyone deserves access to amazing 
                  co-living experiences, regardless of their budget.
                </p>
              </div>
              
              <div className="mt-8">
                <Button className="adventure-button">
                  Chat with me on WhatsApp
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80"
                alt="Founder working remotely"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-adventure-orange text-white p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">47</div>
                <div className="text-sm">Co-livings Visited</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-forest-green mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe that location independence shouldn't be a luxury. Our mission is to democratize 
              access to premium co-living experiences worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-desert-beige rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Globe size={32} className="text-forest-green" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
                Global Access
              </h3>
              <p className="text-gray-600">
                Making world-class co-livings accessible to nomads from all backgrounds and budgets.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-desert-beige rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Users size={32} className="text-forest-green" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
                Community First
              </h3>
              <p className="text-gray-600">
                Building genuine connections between nomads and creating lasting friendships worldwide.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-desert-beige rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <MapPin size={32} className="text-forest-green" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
                Quality Spaces
              </h3>
              <p className="text-gray-600">
                Partnering only with co-livings that meet our standards for comfort, wifi, and community.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-desert-beige rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Heart size={32} className="text-forest-green" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
                Human Touch
              </h3>
              <p className="text-gray-600">
                Real humans, real relationships. No bots, no algorithms, just genuine care for each nomad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-forest-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-6">
              Growing Global Community
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-adventure-orange mb-2">2,847</div>
              <div className="text-lg">Happy Nomads</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-adventure-orange mb-2">147</div>
              <div className="text-lg">Partner Locations</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-adventure-orange mb-2">23</div>
              <div className="text-lg">Countries</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-adventure-orange mb-2">$1.2M</div>
              <div className="text-lg">Total Savings</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
