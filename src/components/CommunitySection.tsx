
import { Users, MessageCircle, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CommunitySection = () => {
  const benefits = [
    {
      icon: MessageCircle,
      title: "Real-time Advice",
      description: "Get instant answers from nomads who've been there before."
    },
    {
      icon: Globe,
      title: "Local Tips",
      description: "Discover hidden gems and insider knowledge in every destination."
    },
    {
      icon: Users,
      title: "Personal Recommendations",
      description: "Connect with like-minded nomads and get personalized suggestions."
    },
    {
      icon: Heart,
      title: "Co-living Q&A",
      description: "Ask questions and share experiences about specific co-living spaces."
    }
  ];

  return (
    <section className="py-20 bg-desert-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-forest-green mb-6">
            Join Our Global Nomad Community
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with thousands of digital nomads worldwide. Share experiences, 
            get recommendations, and build lasting friendships on your remote work journey.
          </p>
          <Button className="adventure-button text-lg">
            <Users className="mr-2" size={20} />
            Join the Community
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <benefit.icon size={24} className="text-adventure-orange" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
