
import { Search, MessageCircle, Home, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-forest-green mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting your discount is simple. No accounts, no hassle, just great deals 
            delivered straight to your phone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center animate-fade-in" style={{ animationDelay: '0s' }}>
            <div className="bg-desert-beige rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-forest-green" />
            </div>
            <div className="bg-adventure-orange text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              1
            </div>
            <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
              Discover
            </h3>
            <p className="text-gray-600">
              Browse exclusive co-living deals from verified partners worldwide.
            </p>
          </div>

          <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-desert-beige rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={32} className="text-forest-green" />
            </div>
            <div className="bg-adventure-orange text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              2
            </div>
            <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
              Get Code
            </h3>
            <p className="text-gray-600">
              Click 'Get Code' and receive your discount via WhatsApp instantly.
            </p>
          </div>

          <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-desert-beige rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Home size={32} className="text-forest-green" />
            </div>
            <div className="bg-adventure-orange text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              3
            </div>
            <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
              Book Direct
            </h3>
            <p className="text-gray-600">
              Use your code to book directly with the co-living at a discounted rate.
            </p>
          </div>

          <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-desert-beige rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-forest-green" />
            </div>
            <div className="bg-adventure-orange text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              4
            </div>
            <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
              Enjoy
            </h3>
            <p className="text-gray-600">
              Move in and start your remote work adventure with fellow nomads.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
