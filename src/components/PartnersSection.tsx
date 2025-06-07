
import { Button } from '@/components/ui/button';
import { Building, Users, TrendingUp, Globe } from 'lucide-react';

const PartnersSection = () => {
  const benefits = [
    {
      icon: Users,
      title: "Quality Nomads",
      description: "Access to our vetted community of remote workers and digital nomads"
    },
    {
      icon: TrendingUp,
      title: "Increased Bookings",
      description: "Boost your occupancy rates with our engaged audience"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with nomads from around the world looking for their next home"
    }
  ];

  return (
    <section className="py-20 bg-forest-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
              Partner With Us
            </h2>
            <p className="text-xl text-gray-100 mb-8">
              Are you a co-living operator, retreat organizer, or event host? 
              Join our network and reach thousands of quality remote workers.
            </p>
            
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-adventure-orange rounded-lg p-3 flex-shrink-0">
                    <benefit.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-200">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="adventure-button">
                Become a Partner
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-forest-green">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=700&q=80"
              alt="Co-living partners"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-adventure-orange text-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm">Happy Partners</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
