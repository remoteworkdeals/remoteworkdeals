import { Users, MessageCircle, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
const CommunitySection = () => {
  return <section className="py-20 bg-desert-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-forest-green mb-6">Join Our Coliving Deals Community</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">Get access to Coliving Deals you won't find anywhere else. Think of big last minute discounts, discounts in exchange for content, community management positions and more. No spam, just real deals.</p>
          <Button className="adventure-button text-lg">
            <Users className="mr-2" size={20} />
            Join the Community
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center animate-fade-in" style={{
          animationDelay: '0s'
        }}>
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MessageCircle size={24} className="text-adventure-orange" />
            </div>
            <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
              Real-time Advice
            </h3>
            <p className="text-gray-600">
              Get instant answers from nomads who've been there before.
            </p>
          </div>

          <div className="text-center animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Globe size={24} className="text-adventure-orange" />
            </div>
            <h3 className="text-xl font-serif font-bold text-forest-green mb-3">Exclusive Discounts</h3>
            <p className="text-gray-600">Get access to Coliving Discounts you won't find anywhere else.</p>
          </div>

          <div className="text-center animate-fade-in" style={{
          animationDelay: '0.2s'
        }}>
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users size={24} className="text-adventure-orange" />
            </div>
            <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
              Personal Recommendations
            </h3>
            <p className="text-gray-600">
              Connect with like-minded nomads and get personalized suggestions.
            </p>
          </div>

          <div className="text-center animate-fade-in" style={{
          animationDelay: '0.3s'
        }}>
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart size={24} className="text-adventure-orange" />
            </div>
            <h3 className="text-xl font-serif font-bold text-forest-green mb-3">Coliving Q&A</h3>
            <p className="text-gray-600">Ask questions and share experiences about specific coliving spaces.</p>
          </div>
        </div>
      </div>
    </section>;
};
export default CommunitySection;