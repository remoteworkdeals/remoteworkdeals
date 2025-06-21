
import { Users, Globe, TrendingUp } from 'lucide-react';

const PartnerHero = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest-green mb-6">
        Become a Partner
      </h1>
      
      <div className="max-w-3xl mx-auto mb-12">
        <p className="text-xl text-gray-700 mb-8">
          Are you running a coliving space and want to reach more digital nomads?<br />
          We'd love to feature your space on RemoteWork.Deals.<br />
          Leave your details below and we'll reach out with all the info you need.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="bg-adventure-orange/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-adventure-orange" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Reach More Nomads</h3>
            <p className="text-gray-600">Connect with thousands of digital nomads looking for their next workspace</p>
          </div>
          
          <div className="text-center">
            <div className="bg-adventure-orange/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-adventure-orange" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Global Exposure</h3>
            <p className="text-gray-600">Get featured on our platform with worldwide visibility</p>
          </div>
          
          <div className="text-center">
            <div className="bg-adventure-orange/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-adventure-orange" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Increase Bookings</h3>
            <p className="text-gray-600">Boost your occupancy rates with exclusive deal placements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerHero;
