
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-forest-green mb-6">
            What Our Nomads Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real reviews from real nomads who found their perfect co-living through our community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="card-shadow animate-fade-in" style={{ animationDelay: '0s' }}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b913?auto=format&fit=crop&w=150&q=80"
                  alt="Sarah Chen"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-forest-green">Sarah Chen</h4>
                  <p className="text-sm text-gray-600">Currently in Bali</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <Star size={16} className="text-yellow-500 fill-current" />
                <Star size={16} className="text-yellow-500 fill-current" />
                <Star size={16} className="text-yellow-500 fill-current" />
                <Star size={16} className="text-yellow-500 fill-current" />
                <Star size={16} className="text-yellow-500 fill-current" />
              </div>
              
              <p className="text-gray-600 italic">"RemoteWork.Deals helped me find an amazing co-living in Canggu with 30% off. The community recommendations were spot on!"</p>
            </CardContent>
          </Card>

          <Card className="card-shadow animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="Marcus Rodriguez"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-forest-green">Marcus Rodriguez</h4>
                  <p className="text-sm text-gray-600">Just left Lisbon</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <Star size={16} className="text-yellow-500 fill-current" />
                <Star size={16} className="text-yellow-500 fill-current" />
                <Star size={16} className="text-yellow-500 fill-current" />
                <Star size={16} className="text-yellow-500 fill-current" />
                <Star size={16} className="text-yellow-500 fill-current" />
              </div>
              
              <p className="text-gray-600 italic">"Best nomad community out there. Got insider tips that saved me hundreds and made friends for life."</p>
            </CardContent>
          </Card>

          <Card className="card-shadow animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
                  alt="Emma Thompson"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-forest-green">Emma Thompson</h4>
                  <p className="text-sm text-gray-600">Heading to Mexico</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <Star size={16} className="text-yellow-500 fill-current" />
                <Star size={16} className="text-yellow-500 fill-current" />
                <Star size={16} className="text-yellow-500 fill-current" />
                <Star size={16} className="text-yellow-500 fill-current" />
                <Star size={16} className="text-yellow-500 fill-current" />
              </div>
              
              <p className="text-gray-600 italic">"The personalized matching service is incredible. They found me the perfect co-living that matched my work style and budget."</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
