import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Globe, Heart, CheckCircle } from 'lucide-react';
const About = () => {
  return <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-forest-green text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
            Built by Nomads, for Nomads
          </h1>
          <p className="text-xl text-gray-100">The story behind RemoteWork.Deals and our mission to make remote work adventures accessible to everyone.</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-forest-green mb-6">
                Why I Started Remote Work Deals
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>As a digital nomad, I quickly discovered the power of a good coliving.</p>
                <p>When you find the right place — with the right people, the right energy, and the right vibe — something just clicks. Suddenly, remote life isn't just amazing... it becomes one of the best times of your life.</p>
                <p>
                  I've experienced that magic myself.
                </p>
                <p>But I've also seen how often other nomads miss out on it, ending up in the wrong place, feeling isolated, or simply drained from always being "on the move." And that's a shame, because I genuinely believe:</p>
                <p className="font-semibold text-forest-green">A good coliving can change everything.</p>
                <p>
                  That's why I created Remote Work Deals:
                </p>
                <p className="font-semibold">
                  To help others find their version of that perfect fit.
                </p>
              </div>
              
              <div className="mt-8">
                <a href="https://api.whatsapp.com/send/?phone=31628359453" target="_blank" rel="noopener noreferrer">
                  <Button className="adventure-button">
                    Chat with me on WhatsApp
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="relative">
              <img src="/lovable-uploads/09c233c7-f24f-46fe-9d9e-f782252f3953.png" alt="Founder working remotely" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-6 -right-6 bg-adventure-orange text-white p-6 rounded-xl shadow-lg">
                <div className="text-sm font-medium text-center">Let's find your perfect Coliving match together</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes This Platform Different Section */}
      <section className="py-20 bg-gradient-to-br from-desert-beige to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-forest-green mb-6">
              What Makes This Platform Different
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This isn't just a list of discounts. It's a curated space, built around honest recommendations and real experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="bg-forest-green rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <CheckCircle size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-4">
                Real Reviews Only
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every listing includes genuine reviews from real nomads who've actually stayed there.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="bg-adventure-orange rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Users size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-4">
                Honest Recommendations
              </h3>
              <p className="text-gray-600 leading-relaxed">We're upfront about who a place is for and who it's not for. No sugarcoating.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 md:col-span-2 lg:col-span-1">
              <div className="bg-forest-green rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Heart size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-4">
                What Really Matters
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Is there a true community? What's the vibe? What kind of people stay there?
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-gray-100">
            <div className="max-w-4xl mx-auto text-center">
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>I believe that finding the right coliving isn't about luck, it's about access to the right information.</p>
                <p>
                  And I want to make that accessible for everyone living the remote lifestyle.
                </p>
                <p>
                  So whether you're planning your first remote trip or looking for your next community, I hope Remote Work Deals helps you find a place where you feel like you truly belong.
                </p>
                
                <div className="text-right mt-12 pt-8 border-t border-gray-200">
                  <p className="font-serif text-2xl text-forest-green mb-2">— Joëlle</p>
                  <p className="text-gray-600 font-medium">Founder of Remote Work Deals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
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
              <p className="text-gray-600">Making real and good colivings accessible to nomads from all backgrounds and budgets.</p>
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
              <p className="text-gray-600">Partnering only with colivings that meet our standards for comfort, wifi, and community.</p>
            </div>

            <div className="text-center">
              <div className="bg-desert-beige rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Heart size={32} className="text-forest-green" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
                Human Touch
              </h3>
              <p className="text-gray-600">Real humans, real recommendations. No spam or fake listings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-forest-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-6">Growing Coliving Community</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-adventure-orange mb-2">200+</div>
              <div className="text-lg">Happy Nomads</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-adventure-orange mb-2">30+</div>
              <div className="text-lg">Partner Locations</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-adventure-orange mb-2">15+</div>
              <div className="text-lg">Countries</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-adventure-orange mb-2">20%</div>
              <div className="text-lg">Avg. Discount</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default About;